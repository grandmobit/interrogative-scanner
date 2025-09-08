const express = require('express');
const { body, validationResult } = require('express-validator');
const Language = require('../models/Language');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/languages
// @desc    Get all active languages
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { search, region, difficulty } = req.query;
    let query = { isActive: true };

    // Add search filters
    if (search) {
      query.$text = { $search: search };
    }
    if (region) {
      query.region = new RegExp(region, 'i');
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const languages = await Language.find(query)
      .select('-metadata -createdAt -updatedAt')
      .sort({ name: 1 });

    res.json(languages);
  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({
      message: 'Server error fetching languages'
    });
  }
});

// @route   GET /api/languages/:id
// @desc    Get single language by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);
    
    if (!language || !language.isActive) {
      return res.status(404).json({
        message: 'Language not found'
      });
    }

    res.json(language);
  } catch (error) {
    console.error('Get language error:', error);
    res.status(500).json({
      message: 'Server error fetching language'
    });
  }
});

// @route   POST /api/languages
// @desc    Create new language (Admin only)
// @access  Private/Admin
router.post('/', adminAuth, [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Language name is required'),
  body('code')
    .trim()
    .isLength({ min: 2, max: 5 })
    .withMessage('Language code must be 2-5 characters'),
  body('region')
    .trim()
    .notEmpty()
    .withMessage('Region is required'),
  body('description')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('family')
    .isIn(['Niger-Congo', 'Nilo-Saharan', 'Afro-Asiatic', 'Creole'])
    .withMessage('Invalid language family'),
  body('speakers')
    .isInt({ min: 0 })
    .withMessage('Speakers must be a non-negative number'),
  body('difficulty')
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Invalid difficulty level')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const language = new Language(req.body);
    await language.save();

    res.status(201).json({
      message: 'Language created successfully',
      language
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Language name or code already exists'
      });
    }
    console.error('Create language error:', error);
    res.status(500).json({
      message: 'Server error creating language'
    });
  }
});

// @route   PUT /api/languages/:id
// @desc    Update language (Admin only)
// @access  Private/Admin
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const language = await Language.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!language) {
      return res.status(404).json({
        message: 'Language not found'
      });
    }

    res.json({
      message: 'Language updated successfully',
      language
    });
  } catch (error) {
    console.error('Update language error:', error);
    res.status(500).json({
      message: 'Server error updating language'
    });
  }
});

// @route   DELETE /api/languages/:id
// @desc    Deactivate language (Admin only)
// @access  Private/Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const language = await Language.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!language) {
      return res.status(404).json({
        message: 'Language not found'
      });
    }

    res.json({
      message: 'Language deactivated successfully'
    });
  } catch (error) {
    console.error('Delete language error:', error);
    res.status(500).json({
      message: 'Server error deactivating language'
    });
  }
});

module.exports = router;
