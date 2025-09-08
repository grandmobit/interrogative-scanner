const express = require('express');
const { body, validationResult } = require('express-validator');
const Lesson = require('../models/Lesson');
const Language = require('../models/Language');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/lessons/:languageId
// @desc    Get lessons for a specific language
// @access  Private
router.get('/:languageId', auth, async (req, res) => {
  try {
    const { languageId } = req.params;
    const { level, difficulty } = req.query;

    let query = { 
      language: languageId, 
      isActive: true 
    };

    if (level) {
      query.level = parseInt(level);
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const lessons = await Lesson.find(query)
      .populate('language', 'name code flag')
      .select('-createdBy -createdAt -updatedAt')
      .sort({ level: 1, order: 1 });

    res.json(lessons);
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({
      message: 'Server error fetching lessons'
    });
  }
});

// @route   GET /api/lessons/single/:id
// @desc    Get single lesson by ID
// @access  Private
router.get('/single/:id', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('language', 'name code flag')
      .populate('prerequisites', 'title level order');

    if (!lesson || !lesson.isActive) {
      return res.status(404).json({
        message: 'Lesson not found'
      });
    }

    res.json(lesson);
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({
      message: 'Server error fetching lesson'
    });
  }
});

// @route   POST /api/lessons
// @desc    Create new lesson (Admin only)
// @access  Private/Admin
router.post('/', adminAuth, [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('language')
    .isMongoId()
    .withMessage('Valid language ID is required'),
  body('level')
    .isInt({ min: 1 })
    .withMessage('Level must be at least 1'),
  body('order')
    .isInt({ min: 1 })
    .withMessage('Order must be at least 1'),
  body('difficulty')
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Invalid difficulty level'),
  body('estimatedDuration')
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 minute'),
  body('words')
    .isArray({ min: 1 })
    .withMessage('At least one word is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Verify language exists
    const language = await Language.findById(req.body.language);
    if (!language) {
      return res.status(400).json({
        message: 'Language not found'
      });
    }

    const lesson = new Lesson({
      ...req.body,
      createdBy: req.user.userId
    });

    await lesson.save();

    // Update language stats
    await Language.findByIdAndUpdate(req.body.language, {
      $inc: { 
        'stats.totalLessons': 1,
        'stats.totalWords': req.body.words.length
      }
    });

    const populatedLesson = await Lesson.findById(lesson._id)
      .populate('language', 'name code flag');

    res.status(201).json({
      message: 'Lesson created successfully',
      lesson: populatedLesson
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({
      message: 'Server error creating lesson'
    });
  }
});

// @route   PUT /api/lessons/:id
// @desc    Update lesson (Admin only)
// @access  Private/Admin
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('language', 'name code flag');

    if (!lesson) {
      return res.status(404).json({
        message: 'Lesson not found'
      });
    }

    res.json({
      message: 'Lesson updated successfully',
      lesson
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({
      message: 'Server error updating lesson'
    });
  }
});

// @route   DELETE /api/lessons/:id
// @desc    Deactivate lesson (Admin only)
// @access  Private/Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!lesson) {
      return res.status(404).json({
        message: 'Lesson not found'
      });
    }

    res.json({
      message: 'Lesson deactivated successfully'
    });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({
      message: 'Server error deactivating lesson'
    });
  }
});

// @route   POST /api/lessons/:id/words
// @desc    Add word to lesson (Admin only)
// @access  Private/Admin
router.post('/:id/words', adminAuth, [
  body('english')
    .trim()
    .notEmpty()
    .withMessage('English word is required'),
  body('translation')
    .trim()
    .notEmpty()
    .withMessage('Translation is required'),
  body('pronunciation')
    .trim()
    .notEmpty()
    .withMessage('Pronunciation is required'),
  body('partOfSpeech')
    .isIn(['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'interjection', 'phrase'])
    .withMessage('Invalid part of speech')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({
        message: 'Lesson not found'
      });
    }

    lesson.words.push(req.body);
    await lesson.save();

    res.json({
      message: 'Word added successfully',
      lesson
    });
  } catch (error) {
    console.error('Add word error:', error);
    res.status(500).json({
      message: 'Server error adding word'
    });
  }
});

module.exports = router;
