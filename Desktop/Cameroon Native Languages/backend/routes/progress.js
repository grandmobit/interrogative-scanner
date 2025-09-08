const express = require('express');
const { body, validationResult } = require('express-validator');
const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/progress
// @desc    Get user's progress for all lessons
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { language } = req.query;
    let query = { user: req.user.userId };
    
    if (language) {
      query.language = language;
    }

    const progress = await Progress.find(query)
      .populate('lesson', 'title level order difficulty estimatedDuration')
      .populate('language', 'name code flag')
      .sort({ 'lesson.level': 1, 'lesson.order': 1 });

    res.json(progress);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      message: 'Server error fetching progress'
    });
  }
});

// @route   GET /api/progress/:lessonId
// @desc    Get user's progress for specific lesson
// @access  Private
router.get('/:lessonId', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user.userId,
      lesson: req.params.lessonId
    })
    .populate('lesson', 'title level order difficulty words')
    .populate('language', 'name code flag');

    if (!progress) {
      return res.status(404).json({
        message: 'Progress not found'
      });
    }

    res.json(progress);
  } catch (error) {
    console.error('Get lesson progress error:', error);
    res.status(500).json({
      message: 'Server error fetching lesson progress'
    });
  }
});

// @route   POST /api/progress
// @desc    Create or update lesson progress
// @access  Private
router.post('/', auth, [
  body('lessonId')
    .isMongoId()
    .withMessage('Valid lesson ID is required'),
  body('score')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Score must be between 0 and 100'),
  body('timeSpent')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Time spent must be non-negative'),
  body('status')
    .optional()
    .isIn(['not_started', 'in_progress', 'completed'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { lessonId, score, timeSpent, status } = req.body;

    // Verify lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        message: 'Lesson not found'
      });
    }

    // Find or create progress record
    let progress = await Progress.findOne({
      user: req.user.userId,
      lesson: lessonId
    });

    if (!progress) {
      progress = new Progress({
        user: req.user.userId,
        lesson: lessonId,
        language: lesson.language,
        status: status || 'in_progress'
      });
    }

    // Update progress fields
    if (score !== undefined) {
      progress.score = Math.max(progress.score, score);
    }
    if (timeSpent !== undefined) {
      progress.timeSpent += timeSpent;
    }
    if (status) {
      progress.status = status;
    }

    progress.lastAttemptAt = Date.now();
    await progress.save();

    // Update user stats
    const user = await User.findById(req.user.userId);
    if (user) {
      user.updateStreak();
      if (timeSpent) {
        user.stats.totalStudyTime += timeSpent;
      }
      if (status === 'completed' && progress.status !== 'completed') {
        user.stats.totalLessonsCompleted += 1;
      }
      await user.save();
    }

    const populatedProgress = await Progress.findById(progress._id)
      .populate('lesson', 'title level order difficulty')
      .populate('language', 'name code flag');

    res.json({
      message: 'Progress updated successfully',
      progress: populatedProgress
    });

  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      message: 'Server error updating progress'
    });
  }
});

// @route   POST /api/progress/:lessonId/quiz
// @desc    Submit quiz results
// @access  Private
router.post('/:lessonId/quiz', auth, [
  body('score')
    .isInt({ min: 0, max: 100 })
    .withMessage('Score must be between 0 and 100'),
  body('totalQuestions')
    .isInt({ min: 1 })
    .withMessage('Total questions must be at least 1'),
  body('correctAnswers')
    .isInt({ min: 0 })
    .withMessage('Correct answers must be non-negative'),
  body('timeSpent')
    .isInt({ min: 0 })
    .withMessage('Time spent must be non-negative'),
  body('answers')
    .isArray()
    .withMessage('Answers must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { lessonId } = req.params;
    const quizData = req.body;

    // Find or create progress record
    let progress = await Progress.findOne({
      user: req.user.userId,
      lesson: lessonId
    });

    if (!progress) {
      const lesson = await Lesson.findById(lessonId);
      if (!lesson) {
        return res.status(404).json({
          message: 'Lesson not found'
        });
      }

      progress = new Progress({
        user: req.user.userId,
        lesson: lessonId,
        language: lesson.language
      });
    }

    // Add quiz result
    progress.addQuizResult(quizData);

    // Process answers for mistakes and strengths
    if (quizData.answers) {
      quizData.answers.forEach(answer => {
        if (answer.isCorrect) {
          progress.addStrength(answer.wordId);
        } else {
          progress.addMistake(answer.wordId, answer.userAnswer, answer.correctAnswer);
        }
      });
    }

    await progress.save();

    // Update user stats
    const user = await User.findById(req.user.userId);
    if (user) {
      user.stats.totalQuizzesCompleted += 1;
      user.updateStreak();
      if (quizData.timeSpent) {
        user.stats.totalStudyTime += quizData.timeSpent;
      }
      await user.save();
    }

    // Update lesson stats
    await Lesson.findByIdAndUpdate(lessonId, {
      $inc: { 'stats.completions': 1 },
      $set: {
        'stats.averageScore': await calculateAverageScore(lessonId),
        'stats.averageTime': await calculateAverageTime(lessonId)
      }
    });

    res.json({
      message: 'Quiz results submitted successfully',
      progress: await Progress.findById(progress._id)
        .populate('lesson', 'title level order')
        .populate('language', 'name code flag')
    });

  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      message: 'Server error submitting quiz results'
    });
  }
});

// @route   GET /api/progress/stats/overview
// @desc    Get user's learning statistics overview
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user with stats
    const user = await User.findById(userId).select('stats');
    
    // Get progress statistics
    const progressStats = await Progress.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      }
    ]);

    // Get language-wise progress
    const languageProgress = await Progress.aggregate([
      { $match: { user: userId } },
      {
        $lookup: {
          from: 'languages',
          localField: 'language',
          foreignField: '_id',
          as: 'languageInfo'
        }
      },
      { $unwind: '$languageInfo' },
      {
        $group: {
          _id: '$language',
          name: { $first: '$languageInfo.name' },
          flag: { $first: '$languageInfo.flag' },
          totalLessons: { $sum: 1 },
          completedLessons: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          averageScore: { $avg: '$score' }
        }
      }
    ]);

    // Get recent activity
    const recentActivity = await Progress.find({ user: userId })
      .populate('lesson', 'title')
      .populate('language', 'name flag')
      .sort({ lastAttemptAt: -1 })
      .limit(10)
      .select('lesson language score status lastAttemptAt');

    res.json({
      userStats: user.stats,
      progressStats,
      languageProgress,
      recentActivity
    });

  } catch (error) {
    console.error('Get stats overview error:', error);
    res.status(500).json({
      message: 'Server error fetching statistics'
    });
  }
});

// Helper functions
async function calculateAverageScore(lessonId) {
  const result = await Progress.aggregate([
    { $match: { lesson: lessonId, status: 'completed' } },
    { $group: { _id: null, averageScore: { $avg: '$score' } } }
  ]);
  return result.length > 0 ? Math.round(result[0].averageScore) : 0;
}

async function calculateAverageTime(lessonId) {
  const result = await Progress.aggregate([
    { $match: { lesson: lessonId, status: 'completed' } },
    { $group: { _id: null, averageTime: { $avg: '$timeSpent' } } }
  ]);
  return result.length > 0 ? Math.round(result[0].averageTime) : 0;
}

module.exports = router;
