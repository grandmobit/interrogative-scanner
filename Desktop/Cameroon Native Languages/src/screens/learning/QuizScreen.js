import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { useLearning } from '../../context/LearningContext';

const { width } = Dimensions.get('window');

export default function QuizScreen({ navigation, route }) {
  const { lesson, language, words } = route.params;
  const { updateProgress } = useLearning();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = () => {
    const quizQuestions = [];
    
    // Generate different types of questions
    words.forEach((word, index) => {
      // Translation question (English to Duala)
      const otherWords = words.filter(w => w.id !== word.id);
      const wrongAnswers = otherWords.slice(0, 3).map(w => w.duala);
      
      quizQuestions.push({
        id: `q${index}_translation`,
        type: 'translation',
        question: `What is "${word.english}" in Duala?`,
        correctAnswer: word.duala,
        options: shuffleArray([word.duala, ...wrongAnswers]),
        audioText: word.duala
      });

      // Reverse translation question (Duala to English)
      const wrongEnglishAnswers = otherWords.slice(0, 3).map(w => w.english);
      
      quizQuestions.push({
        id: `q${index}_reverse`,
        type: 'reverse',
        question: `What does "${word.duala}" mean in English?`,
        correctAnswer: word.english,
        options: shuffleArray([word.english, ...wrongEnglishAnswers]),
        audioText: word.duala
      });
    });

    // Select 8 random questions
    const selectedQuestions = shuffleArray(quizQuestions).slice(0, 8);
    setQuestions(selectedQuestions);
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
      const finalScore = Math.round((score / questions.length) * 100);
      updateProgress(lesson.id, finalScore);
    }
  };

  const playAudio = () => {
    if (currentQuestion.audioText) {
      Speech.speak(currentQuestion.audioText, {
        language: 'fr', // Use French as approximation for Duala
        pitch: 1,
        rate: 0.8,
      });
    }
  };

  const getScoreMessage = () => {
    const percentage = Math.round((score / questions.length) * 100);
    if (percentage >= 90) return { message: "Excellent! You're a natural!", color: "#4CAF50" };
    if (percentage >= 70) return { message: "Great job! Keep it up!", color: "#58CC02" };
    if (percentage >= 50) return { message: "Good effort! Practice makes perfect!", color: "#FF9500" };
    return { message: "Keep practicing! You'll get there!", color: "#FF3B30" };
  };

  if (questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Preparing your quiz...</Text>
      </View>
    );
  }

  if (quizComplete) {
    const scoreMessage = getScoreMessage();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <LinearGradient colors={['#58CC02', '#89E219']} style={styles.container}>
        <View style={styles.completionContainer}>
          <Animatable.View animation="bounceIn" style={styles.completionContent}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scorePercentage}>{percentage}%</Text>
            </View>
            <Text style={styles.completionTitle}>Quiz Complete!</Text>
            <Text style={[styles.scoreMessage, { color: scoreMessage.color }]}>
              {scoreMessage.message}
            </Text>
            <Text style={styles.scoreDetails}>
              You got {score} out of {questions.length} questions correct
            </Text>
            
            <View style={styles.completionButtons}>
              <TouchableOpacity 
                style={styles.retryButton} 
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.retryButtonText}>Back to Lessons</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.continueButton} 
                onPress={() => navigation.navigate('LearningMain')}
              >
                <Text style={styles.continueButtonText}>Continue Learning</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animatable.View 
            animation="slideInLeft"
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
      </View>

      {/* Question Card */}
      <Animatable.View 
        key={currentQuestionIndex}
        animation="fadeIn"
        style={styles.questionCard}
      >
        <View style={styles.questionHeader}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          {currentQuestion.audioText && (
            <TouchableOpacity style={styles.audioButton} onPress={playAudio}>
              <Ionicons name="volume-high" size={24} color="#58CC02" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            let buttonStyle = styles.optionButton;
            let textStyle = styles.optionText;

            if (showResult && selectedAnswer) {
              if (option === currentQuestion.correctAnswer) {
                buttonStyle = [styles.optionButton, styles.correctOption];
                textStyle = [styles.optionText, styles.correctOptionText];
              } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                buttonStyle = [styles.optionButton, styles.wrongOption];
                textStyle = [styles.optionText, styles.wrongOptionText];
              }
            }

            return (
              <TouchableOpacity
                key={index}
                style={buttonStyle}
                onPress={() => !showResult && handleAnswerSelect(option)}
                disabled={showResult}
              >
                <Text style={textStyle}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {showResult && (
          <Animatable.View animation="fadeInUp" style={styles.resultContainer}>
            <View style={styles.resultContent}>
              <Ionicons 
                name={selectedAnswer === currentQuestion.correctAnswer ? "checkmark-circle" : "close-circle"} 
                size={32} 
                color={selectedAnswer === currentQuestion.correctAnswer ? "#4CAF50" : "#FF3B30"} 
              />
              <Text style={styles.resultText}>
                {selectedAnswer === currentQuestion.correctAnswer ? "Correct!" : "Incorrect"}
              </Text>
              {selectedAnswer !== currentQuestion.correctAnswer && (
                <Text style={styles.correctAnswerText}>
                  Correct answer: {currentQuestion.correctAnswer}
                </Text>
              )}
            </View>
          </Animatable.View>
        )}
      </Animatable.View>

      {/* Navigation */}
      {showResult && (
        <Animatable.View animation="fadeInUp" style={styles.navigationContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Text>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </TouchableOpacity>
        </Animatable.View>
      )}

      {/* Score Display */}
      <View style={styles.scoreContainer}>
        <Text style={styles.currentScore}>Score: {score}/{currentQuestionIndex + (showResult ? 1 : 0)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  questionCard: {
    flex: 1,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    lineHeight: 30,
  },
  audioButton: {
    padding: 10,
    marginLeft: 10,
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  correctOption: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  wrongOption: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FF3B30',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
  },
  correctOptionText: {
    color: '#4CAF50',
  },
  wrongOptionText: {
    color: '#FF3B30',
  },
  resultContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
  },
  resultContent: {
    alignItems: 'center',
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  correctAnswerText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  navigationContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#58CC02',
    paddingVertical: 18,
    borderRadius: 25,
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  scoreContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  currentScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#58CC02',
    textAlign: 'center',
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  completionContent: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    width: '100%',
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#58CC02',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scorePercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  scoreMessage: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  scoreDetails: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  completionButtons: {
    width: '100%',
  },
  retryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#58CC02',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#58CC02',
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#58CC02',
    paddingVertical: 15,
    borderRadius: 25,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});
