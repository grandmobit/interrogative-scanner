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
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { useLearning } from '../../context/LearningContext';

const { width, height } = Dimensions.get('window');

export default function LessonScreen({ navigation, route }) {
  const { lesson, language } = route.params;
  const { updateProgress } = useLearning();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);

  // Sample lesson data for Duala greetings
  const lessonWords = [
    {
      id: 1,
      english: 'Hello',
      duala: 'Mbolo',
      pronunciation: 'mm-BOH-loh',
      audioUrl: null, // Would be actual audio file URL
      example: 'Mbolo, na ndé o kala?',
      exampleTranslation: 'Hello, how are you?'
    },
    {
      id: 2,
      english: 'Good morning',
      duala: 'Mbolo ma gonya',
      pronunciation: 'mm-BOH-loh mah GOH-nyah',
      audioUrl: null,
      example: 'Mbolo ma gonya, tata',
      exampleTranslation: 'Good morning, father'
    },
    {
      id: 3,
      english: 'Good evening',
      duala: 'Mbolo ma muèndè',
      pronunciation: 'mm-BOH-loh mah moo-EN-deh',
      audioUrl: null,
      example: 'Mbolo ma muèndè, mama',
      exampleTranslation: 'Good evening, mother'
    },
    {
      id: 4,
      english: 'Goodbye',
      duala: 'Kèlè',
      pronunciation: 'KEH-leh',
      audioUrl: null,
      example: 'Kèlè, na bôna ngoso',
      exampleTranslation: 'Goodbye, see you tomorrow'
    },
    {
      id: 5,
      english: 'Thank you',
      duala: 'Matonya',
      pronunciation: 'mah-TOH-nyah',
      audioUrl: null,
      example: 'Matonya mingi',
      exampleTranslation: 'Thank you very much'
    },
    {
      id: 6,
      english: 'Please',
      duala: 'Ndolo',
      pronunciation: 'nn-DOH-loh',
      audioUrl: null,
      example: 'Ndolo, pèsè mba wèlè',
      exampleTranslation: 'Please, give me water'
    },
    {
      id: 7,
      english: 'Excuse me',
      duala: 'Pardong',
      pronunciation: 'par-DONG',
      audioUrl: null,
      example: 'Pardong, o si ndé?',
      exampleTranslation: 'Excuse me, where are you going?'
    },
    {
      id: 8,
      english: 'How are you?',
      duala: 'Na ndé o kala?',
      pronunciation: 'nah nn-DEH oh KAH-lah',
      audioUrl: null,
      example: 'Mbolo, na ndé o kala?',
      exampleTranslation: 'Hello, how are you?'
    }
  ];

  const currentWord = lessonWords[currentWordIndex];
  const progress = ((currentWordIndex + 1) / lessonWords.length) * 100;

  const speakWord = (text, language = 'en') => {
    Speech.speak(text, {
      language: language === 'duala' ? 'fr' : 'en', // Use French as closest approximation for Duala
      pitch: 1,
      rate: 0.8,
    });
  };

  const handleNext = () => {
    if (currentWordIndex < lessonWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowTranslation(false);
    } else {
      setLessonComplete(true);
      updateProgress(lesson.id, 100);
    }
  };

  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setShowTranslation(false);
    }
  };

  const handleComplete = () => {
    Alert.alert(
      'Lesson Complete!',
      'Great job! Ready to test your knowledge with a quiz?',
      [
        { text: 'Review Lesson', style: 'cancel' },
        { 
          text: 'Take Quiz', 
          onPress: () => navigation.navigate('Quiz', { lesson, language, words: lessonWords })
        }
      ]
    );
  };

  if (lessonComplete) {
    return (
      <LinearGradient colors={['#58CC02', '#89E219']} style={styles.container}>
        <View style={styles.completionContainer}>
          <Animatable.View animation="bounceIn" style={styles.completionContent}>
            <Ionicons name="trophy" size={80} color="#FFD700" />
            <Text style={styles.completionTitle}>Lesson Complete!</Text>
            <Text style={styles.completionText}>
              You've learned {lessonWords.length} new words in {language.name}
            </Text>
            <TouchableOpacity style={styles.quizButton} onPress={handleComplete}>
              <Text style={styles.quizButtonText}>Take Quiz</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.reviewButton} 
              onPress={() => setLessonComplete(false)}
            >
              <Text style={styles.reviewButtonText}>Review Lesson</Text>
            </TouchableOpacity>
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
        <Text style={styles.progressText}>{currentWordIndex + 1} / {lessonWords.length}</Text>
      </View>

      {/* Word Card */}
      <Animatable.View 
        key={currentWordIndex}
        animation="fadeIn"
        style={styles.wordCard}
      >
        <TouchableOpacity 
          style={styles.audioButton}
          onPress={() => speakWord(currentWord.duala, 'duala')}
        >
          <Ionicons name="volume-high" size={32} color="#58CC02" />
        </TouchableOpacity>

        <Text style={styles.englishWord}>{currentWord.english}</Text>
        
        <TouchableOpacity 
          style={styles.dualaContainer}
          onPress={() => setShowTranslation(!showTranslation)}
        >
          <Text style={styles.dualaWord}>{currentWord.duala}</Text>
          <Text style={styles.pronunciation}>/{currentWord.pronunciation}/</Text>
        </TouchableOpacity>

        {showTranslation && (
          <Animatable.View animation="fadeInUp" style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>Example:</Text>
            <Text style={styles.exampleDuala}>{currentWord.example}</Text>
            <Text style={styles.exampleEnglish}>{currentWord.exampleTranslation}</Text>
          </Animatable.View>
        )}

        <TouchableOpacity 
          style={styles.showExampleButton}
          onPress={() => setShowTranslation(!showTranslation)}
        >
          <Text style={styles.showExampleText}>
            {showTranslation ? 'Hide Example' : 'Show Example'}
          </Text>
        </TouchableOpacity>
      </Animatable.View>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity 
          style={[styles.navButton, currentWordIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentWordIndex === 0}
        >
          <Ionicons name="chevron-back" size={24} color={currentWordIndex === 0 ? "#CCC" : "#58CC02"} />
          <Text style={[styles.navButtonText, currentWordIndex === 0 && styles.navButtonTextDisabled]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentWordIndex === lessonWords.length - 1 ? 'Complete' : 'Next'}
          </Text>
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Study Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipText}>
          💡 Tap the Duala word to hear pronunciation
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  wordCard: {
    flex: 1,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  audioButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
  },
  englishWord: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  dualaContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  dualaWord: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#58CC02',
    marginBottom: 10,
    textAlign: 'center',
  },
  pronunciation: {
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
  },
  exampleContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginBottom: 20,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  exampleDuala: {
    fontSize: 18,
    color: '#58CC02',
    marginBottom: 8,
    fontWeight: '600',
  },
  exampleEnglish: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  showExampleButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#58CC02',
  },
  showExampleText: {
    fontSize: 16,
    color: '#58CC02',
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: '#58CC02',
    fontWeight: '600',
    marginLeft: 8,
  },
  navButtonTextDisabled: {
    color: '#CCC',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    backgroundColor: '#58CC02',
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
  },
  tipsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
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
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
  },
  completionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  quizButton: {
    backgroundColor: '#58CC02',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  quizButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  reviewButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#58CC02',
  },
  reviewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#58CC02',
  },
});
