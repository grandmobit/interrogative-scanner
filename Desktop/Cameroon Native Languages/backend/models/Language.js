const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Language name is required'],
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Language code is required'],
    unique: true,
    uppercase: true,
    maxlength: [5, 'Language code cannot exceed 5 characters']
  },
  region: {
    type: String,
    required: [true, 'Region is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  family: {
    type: String,
    required: [true, 'Language family is required'],
    enum: ['Niger-Congo', 'Nilo-Saharan', 'Afro-Asiatic', 'Creole']
  },
  speakers: {
    type: Number,
    required: [true, 'Number of speakers is required'],
    min: [0, 'Number of speakers cannot be negative']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  flag: {
    type: String,
    default: '🇨🇲'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    culturalNotes: String,
    writingSystem: String,
    phoneticNotes: String,
    grammarNotes: String
  },
  stats: {
    totalLessons: {
      type: Number,
      default: 0
    },
    totalWords: {
      type: Number,
      default: 0
    },
    enrolledUsers: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
languageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for search optimization
languageSchema.index({ name: 'text', region: 'text', description: 'text' });

module.exports = mongoose.model('Language', languageSchema);
