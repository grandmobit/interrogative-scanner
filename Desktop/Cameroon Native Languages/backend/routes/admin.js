const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Language = require('../models/Language');
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      'stats.lastStudyDate': { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // Get language statistics
    const totalLanguages = await Language.countDocuments({ isActive: true });
    const totalLessons = await Lesson.countDocuments({ isActive: true });

    // Get progress statistics
    const totalCompletions = await Progress.countDocuments({ status: 'completed' });
    const averageScore = await Progress.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, avgScore: { $avg: '$score' } } }
    ]);

    // Get recent user registrations
    const recentUsers = await User.find()
      .select('name email createdAt stats')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get popular languages
    const popularLanguages = await Progress.aggregate([
      {
        $group: {
          _id: '$language',
          enrollments: { $sum: 1 },
          completions: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
        }
      },
      {
        $lookup: {
          from: 'languages',
          localField: '_id',
          foreignField: '_id',
          as: 'languageInfo'
        }
      },
      { $unwind: '$languageInfo' },
      {
        $project: {
          name: '$languageInfo.name',
          flag: '$languageInfo.flag',
          enrollments: 1,
          completions: 1,
          completionRate: { $divide: ['$completions', '$enrollments'] }
        }
      },
      { $sort: { enrollments: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        totalLanguages,
        totalLessons,
        totalCompletions,
        averageScore: averageScore.length > 0 ? Math.round(averageScore[0].avgScore) : 0
      },
      recentUsers,
      popularLanguages
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      message: 'Server error fetching dashboard data'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private/Admin
router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      message: 'Server error fetching users'
    });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.put('/users/:id/role', adminAuth, [
  body('role')
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json({
      message: 'User role updated successfully',
      user
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      message: 'Server error updating user role'
    });
  }
});

// @route   GET /api/admin/languages/manage
// @desc    Get all languages for management
// @access  Private/Admin
router.get('/languages/manage', adminAuth, async (req, res) => {
  try {
    const languages = await Language.find()
      .sort({ name: 1 });

    res.json(languages);
  } catch (error) {
    console.error('Get languages for management error:', error);
    res.status(500).json({
      message: 'Server error fetching languages'
    });
  }
});

// @route   GET /api/admin/lessons/manage
// @desc    Get all lessons for management
// @access  Private/Admin
router.get('/lessons/manage', adminAuth, async (req, res) => {
  try {
    const { language, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (language) {
      query.language = language;
    }

    const lessons = await Lesson.find(query)
      .populate('language', 'name flag')
      .populate('createdBy', 'name email')
      .sort({ 'language.name': 1, level: 1, order: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Lesson.countDocuments(query);

    res.json({
      lessons,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get lessons for management error:', error);
    res.status(500).json({
      message: 'Server error fetching lessons'
    });
  }
});

// @route   GET /api/admin/analytics/users
// @desc    Get user analytics
// @access  Private/Admin
router.get('/analytics/users', adminAuth, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // User registrations over time
    const registrations = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Active users over time
    const activeUsers = await Progress.aggregate([
      { $match: { lastAttemptAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$lastAttemptAt' } },
            user: '$user'
          }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          activeUsers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // User engagement metrics
    const engagement = await User.aggregate([
      {
        $group: {
          _id: null,
          avgStreak: { $avg: '$stats.currentStreak' },
          avgStudyTime: { $avg: '$stats.totalStudyTime' },
          avgLessonsCompleted: { $avg: '$stats.totalLessonsCompleted' }
        }
      }
    ]);

    res.json({
      registrations,
      activeUsers,
      engagement: engagement[0] || {}
    });

  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({
      message: 'Server error fetching user analytics'
    });
  }
});

// @route   GET /api/admin/analytics/content
// @desc    Get content analytics
// @access  Private/Admin
router.get('/analytics/content', adminAuth, async (req, res) => {
  try {
    // Lesson completion rates
    const lessonStats = await Lesson.aggregate([
      {
        $lookup: {
          from: 'progresses',
          localField: '_id',
          foreignField: 'lesson',
          as: 'progress'
        }
      },
      {
        $project: {
          title: 1,
          level: 1,
          difficulty: 1,
          totalAttempts: { $size: '$progress' },
          completions: {
            $size: {
              $filter: {
                input: '$progress',
                cond: { $eq: ['$$this.status', 'completed'] }
              }
            }
          }
        }
      },
      {
        $addFields: {
          completionRate: {
            $cond: [
              { $gt: ['$totalAttempts', 0] },
              { $divide: ['$completions', '$totalAttempts'] },
              0
            ]
          }
        }
      },
      { $sort: { completionRate: -1 } }
    ]);

    // Language popularity
    const languageStats = await Language.aggregate([
      {
        $lookup: {
          from: 'progresses',
          localField: '_id',
          foreignField: 'language',
          as: 'progress'
        }
      },
      {
        $project: {
          name: 1,
          flag: 1,
          totalEnrollments: { $size: '$progress' },
          completions: {
            $size: {
              $filter: {
                input: '$progress',
                cond: { $eq: ['$$this.status', 'completed'] }
              }
            }
          }
        }
      },
      { $sort: { totalEnrollments: -1 } }
    ]);

    res.json({
      lessonStats,
      languageStats
    });

  } catch (error) {
    console.error('Content analytics error:', error);
    res.status(500).json({
      message: 'Server error fetching content analytics'
    });
  }
});

// @route   POST /api/admin/seed-data
// @desc    Seed initial data (languages and lessons)
// @access  Private/Admin
router.post('/seed-data', adminAuth, async (req, res) => {
  try {
    // Check if data already exists
    const existingLanguages = await Language.countDocuments();
    if (existingLanguages > 0) {
      return res.status(400).json({
        message: 'Data already exists. Use individual endpoints to add more content.'
      });
    }

    // Seed languages
    const languages = [
      {
        name: 'Duala',
        code: 'DUA',
        region: 'Littoral',
        description: 'Coastal Bantu language spoken by the Duala people',
        family: 'Niger-Congo',
        speakers: 87700,
        difficulty: 'Beginner',
        metadata: {
          culturalNotes: 'The Duala people are known for their rich maritime culture and trade history.',
          writingSystem: 'Latin script',
          phoneticNotes: 'Tonal language with high and low tones',
          grammarNotes: 'Noun class system typical of Bantu languages'
        }
      },
      {
        name: 'Bamileke',
        code: 'BAM',
        region: 'West',
        description: 'Grassfields language of the Bamileke people',
        family: 'Niger-Congo',
        speakers: 300000,
        difficulty: 'Intermediate',
        metadata: {
          culturalNotes: 'Known for their complex chieftaincy system and artistic traditions.',
          writingSystem: 'Latin script',
          phoneticNotes: 'Complex tonal system with multiple tone levels',
          grammarNotes: 'Rich verbal morphology and noun class system'
        }
      }
    ];

    const createdLanguages = await Language.insertMany(languages);
    
    // Seed basic lessons for Duala
    const dualaLanguage = createdLanguages.find(lang => lang.name === 'Duala');
    const lessons = [
      {
        title: 'Basic Greetings',
        description: 'Learn essential greetings in Duala',
        language: dualaLanguage._id,
        level: 1,
        order: 1,
        difficulty: 'Beginner',
        estimatedDuration: 10,
        words: [
          {
            english: 'Hello',
            translation: 'Mbolo',
            pronunciation: 'mm-BOH-loh',
            partOfSpeech: 'interjection',
            example: {
              native: 'Mbolo, na ndé o kala?',
              english: 'Hello, how are you?'
            }
          },
          {
            english: 'Good morning',
            translation: 'Mbolo ma gonya',
            pronunciation: 'mm-BOH-loh mah GOH-nyah',
            partOfSpeech: 'phrase',
            example: {
              native: 'Mbolo ma gonya, tata',
              english: 'Good morning, father'
            }
          }
        ],
        createdBy: req.user.userId
      }
    ];

    await Lesson.insertMany(lessons);

    res.json({
      message: 'Initial data seeded successfully',
      languagesCreated: createdLanguages.length,
      lessonsCreated: lessons.length
    });

  } catch (error) {
    console.error('Seed data error:', error);
    res.status(500).json({
      message: 'Server error seeding data'
    });
  }
});

module.exports = router;
