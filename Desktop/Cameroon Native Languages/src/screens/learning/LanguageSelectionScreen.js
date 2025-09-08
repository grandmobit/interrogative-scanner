import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useLearning } from '../../context/LearningContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LanguageSelectionScreen({ navigation, route }) {
  const { languageId } = route.params;
  const { setSelectedLanguage, fetchLessons } = useLearning();
  const [selectedLanguage, setSelectedLang] = useState(null);

  const dualaLessons = [
    {
      id: 1,
      title: 'Basic Greetings',
      description: 'Learn how to say hello and goodbye',
      difficulty: 'Beginner',
      duration: '10 min',
      words: 8,
      completed: false,
      locked: false,
    },
    {
      id: 2,
      title: 'Family Members',
      description: 'Words for family relationships',
      difficulty: 'Beginner',
      duration: '15 min',
      words: 12,
      completed: false,
      locked: false,
    },
    {
      id: 3,
      title: 'Numbers 1-10',
      description: 'Counting in Duala',
      difficulty: 'Beginner',
      duration: '12 min',
      words: 10,
      completed: false,
      locked: false,
    },
    {
      id: 4,
      title: 'Colors',
      description: 'Basic color vocabulary',
      difficulty: 'Beginner',
      duration: '10 min',
      words: 8,
      completed: false,
      locked: true,
    },
    {
      id: 5,
      title: 'Food & Drinks',
      description: 'Common food items',
      difficulty: 'Intermediate',
      duration: '20 min',
      words: 15,
      completed: false,
      locked: true,
    },
  ];

  useEffect(() => {
    const language = {
      id: languageId,
      name: 'Duala',
      region: 'Littoral',
      flag: '🇨🇲',
      description: 'Coastal Bantu language spoken by the Duala people'
    };
    setSelectedLang(language);
    setSelectedLanguage(language);
    fetchLessons(languageId);
  }, [languageId]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#58CC02';
      case 'Intermediate': return '#FF9500';
      case 'Advanced': return '#FF3B30';
      default: return '#58CC02';
    }
  };

  const handleLessonPress = (lesson) => {
    if (lesson.locked) return;
    navigation.navigate('Lesson', { lesson, language: selectedLanguage });
  };

  if (!selectedLanguage) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Language Header */}
      <LinearGradient colors={['#FF6B6B', '#FF8E8E']} style={styles.header}>
        <View style={styles.languageInfo}>
          <Text style={styles.languageFlag}>{selectedLanguage.flag}</Text>
          <View style={styles.languageDetails}>
            <Text style={styles.languageName}>{selectedLanguage.name}</Text>
            <Text style={styles.languageRegion}>{selectedLanguage.region} Region</Text>
            <Text style={styles.languageDescription}>{selectedLanguage.description}</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>0%</Text>
          </View>
          <Text style={styles.progressLabel}>Progress</Text>
        </View>
      </LinearGradient>

      {/* Lessons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lessons</Text>
        {dualaLessons.map((lesson, index) => (
          <Animatable.View 
            key={lesson.id}
            animation="fadeInUp"
            delay={index * 100}
          >
            <TouchableOpacity 
              style={[styles.lessonCard, lesson.locked && styles.lessonLocked]}
              onPress={() => handleLessonPress(lesson)}
              disabled={lesson.locked}
            >
              <View style={styles.lessonHeader}>
                <View style={styles.lessonLeft}>
                  <View style={[styles.lessonNumber, lesson.completed && styles.lessonCompleted]}>
                    {lesson.completed ? (
                      <Ionicons name="checkmark" size={20} color="white" />
                    ) : lesson.locked ? (
                      <Ionicons name="lock-closed" size={20} color="#CCC" />
                    ) : (
                      <Text style={styles.lessonNumberText}>{lesson.id}</Text>
                    )}
                  </View>
                  <View style={styles.lessonInfo}>
                    <Text style={[styles.lessonTitle, lesson.locked && styles.lessonTitleLocked]}>
                      {lesson.title}
                    </Text>
                    <Text style={[styles.lessonDescription, lesson.locked && styles.lessonDescriptionLocked]}>
                      {lesson.description}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.lessonRight}>
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(lesson.difficulty) }]}>
                    <Text style={styles.difficultyText}>{lesson.difficulty}</Text>
                  </View>
                  {!lesson.locked && (
                    <Ionicons name="play-circle" size={32} color="#58CC02" style={styles.playIcon} />
                  )}
                </View>
              </View>
              
              <View style={styles.lessonStats}>
                <View style={styles.lessonStat}>
                  <Ionicons name="time-outline" size={16} color={lesson.locked ? "#CCC" : "#666"} />
                  <Text style={[styles.lessonStatText, lesson.locked && styles.lessonStatTextLocked]}>
                    {lesson.duration}
                  </Text>
                </View>
                <View style={styles.lessonStat}>
                  <Ionicons name="book-outline" size={16} color={lesson.locked ? "#CCC" : "#666"} />
                  <Text style={[styles.lessonStatText, lesson.locked && styles.lessonStatTextLocked]}>
                    {lesson.words} words
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>

      {/* Study Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Study Tips</Text>
        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={24} color="#58CC02" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Practice Daily</Text>
            <Text style={styles.tipText}>
              Consistent daily practice, even just 10 minutes, is more effective than long study sessions once a week.
            </Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Ionicons name="volume-high-outline" size={24} color="#FF6B35" />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Listen & Repeat</Text>
            <Text style={styles.tipText}>
              Use the audio feature to hear native pronunciation and practice speaking aloud.
            </Text>
          </View>
        </View>
      </View>

      {/* Cultural Context */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Duala Culture</Text>
        <View style={styles.cultureCard}>
          <Text style={styles.cultureTitle}>The Duala People</Text>
          <Text style={styles.cultureText}>
            The Duala are a Bantu ethnic group native to Cameroon. They primarily inhabit the littoral region around Douala, 
            Cameroon's largest city and economic capital. The Duala language serves as a lingua franca in the region and 
            has influenced many other local languages.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  languageFlag: {
    fontSize: 48,
    marginRight: 20,
  },
  languageDetails: {
    flex: 1,
  },
  languageName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  languageRegion: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  languageDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  progressLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  lessonCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lessonLocked: {
    opacity: 0.6,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  lessonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lessonNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#58CC02',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  lessonCompleted: {
    backgroundColor: '#4CAF50',
  },
  lessonNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  lessonTitleLocked: {
    color: '#999',
  },
  lessonDescription: {
    fontSize: 14,
    color: '#666',
  },
  lessonDescriptionLocked: {
    color: '#CCC',
  },
  lessonRight: {
    alignItems: 'flex-end',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  playIcon: {
    marginTop: 4,
  },
  lessonStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  lessonStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonStatText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  lessonStatTextLocked: {
    color: '#CCC',
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipContent: {
    flex: 1,
    marginLeft: 15,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  cultureCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cultureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  cultureText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});
