const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/', auth, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      location,
      nativeLanguage,
      learningGoal,
      bio,
      profileImage
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (nativeLanguage) user.nativeLanguage = nativeLanguage;
    if (learningGoal) user.learningGoal = learningGoal;
    if (bio) user.bio = bio;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    // Return user without password
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
