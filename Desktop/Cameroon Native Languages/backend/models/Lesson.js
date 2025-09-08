const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  english: {
    type: String,
    required: [true, 'English word is required'],
    trim: true
  },
  translation: {
    type: String,
    required: [true, 'Translation is required'],
    trim: true
  },
  pronunciation: {
    type: String,
    required: [true, 'Pronunciation is required'],
    trim: true
  },
  audioUrl: {
    type: String,
    trim: true
  },
  example: {
    native: String,
    english: String
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  partOfSpeech: {
    type: String,
    enum: ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'interjection', 'phrase'],
    required: true
  }
});

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Lesson description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
    required: [true, 'Language is required']
  },
  level: {
    type: Number,
    required: [true, 'Lesson level is required'],
    min: [1, 'Level must be at least 1']
  },
  order: {
    type: Number,
    required: [true, 'Lesson order is required'],
    min: [1, 'Order must be at least 1']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  estimatedDuration: {
    type: Number, // in minutes
    required: [true, 'Estimated duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  words: [wordSchema],
  content: {
    introduction: String,
    culturalContext: String,
    grammarNotes: String,
    tips: [String]
  },
  media: {
    videoUrl: String,
    imageUrls: [String],
    audioUrls: [String]
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  stats: {
    completions: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    averageTime: {
      type: Number,
      default: 0
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
lessonSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
lessonSchema.index({ language: 1, level: 1, order: 1 });
lessonSchema.index({ title: 'text', description: 'text' });

// Virtual for word count
lessonSchema.virtual('wordCount').get(function() {
  return this.words.length;
});

// Ensure virtual fields are serialized
lessonSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Lesson', lessonSchema);
