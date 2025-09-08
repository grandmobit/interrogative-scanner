const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: [true, 'Lesson is required']
  },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
    required: [true, 'Language is required']
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  score: {
    type: Number,
    min: [0, 'Score cannot be negative'],
    max: [100, 'Score cannot exceed 100'],
    default: 0
  },
  attempts: {
    type: Number,
    default: 0,
    min: [0, 'Attempts cannot be negative']
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0,
    min: [0, 'Time spent cannot be negative']
  },
  completedAt: {
    type: Date
  },
  lastAttemptAt: {
    type: Date,
    default: Date.now
  },
  quizResults: [{
    attemptNumber: Number,
    score: Number,
    totalQuestions: Number,
    correctAnswers: Number,
    timeSpent: Number,
    answers: [{
      questionId: String,
      userAnswer: String,
      correctAnswer: String,
      isCorrect: Boolean,
      timeSpent: Number
    }],
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  mistakes: [{
    wordId: mongoose.Schema.Types.ObjectId,
    incorrectAnswer: String,
    correctAnswer: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  strengths: [{
    wordId: mongoose.Schema.Types.ObjectId,
    consecutiveCorrect: {
      type: Number,
      default: 1
    },
    lastCorrectAt: {
      type: Date,
      default: Date.now
    }
  }],
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
progressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set completedAt when status changes to completed
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = Date.now();
  }
  
  next();
});

// Compound index for efficient queries
progressSchema.index({ user: 1, lesson: 1 }, { unique: true });
progressSchema.index({ user: 1, language: 1 });
progressSchema.index({ user: 1, status: 1 });

// Methods
progressSchema.methods.addQuizResult = function(quizData) {
  this.attempts += 1;
  this.lastAttemptAt = Date.now();
  this.score = Math.max(this.score, quizData.score);
  
  this.quizResults.push({
    attemptNumber: this.attempts,
    ...quizData
  });
  
  if (quizData.score >= 70) {
    this.status = 'completed';
  } else if (this.status === 'not_started') {
    this.status = 'in_progress';
  }
};

progressSchema.methods.addMistake = function(wordId, incorrectAnswer, correctAnswer) {
  this.mistakes.push({
    wordId,
    incorrectAnswer,
    correctAnswer
  });
};

progressSchema.methods.addStrength = function(wordId) {
  const existingStrength = this.strengths.find(s => s.wordId.equals(wordId));
  
  if (existingStrength) {
    existingStrength.consecutiveCorrect += 1;
    existingStrength.lastCorrectAt = Date.now();
  } else {
    this.strengths.push({
      wordId,
      consecutiveCorrect: 1
    });
  }
};

// Virtual for completion percentage
progressSchema.virtual('completionPercentage').get(function() {
  if (this.status === 'completed') return 100;
  if (this.status === 'not_started') return 0;
  return Math.min(this.score, 99); // In progress but not completed
});

// Ensure virtual fields are serialized
progressSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Progress', progressSchema);
