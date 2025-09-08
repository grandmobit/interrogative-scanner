import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { user } = useAuth();
  const { userProgress, fetchUserProgress } = useLearning();
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    averageScore: 0,
    streak: 7,
    totalTime: 0,
  });

  useEffect(() => {
    fetchUserProgress();
    calculateStats();
  }, [userProgress]);

  const calculateStats = () => {
    const progressArray = Object.values(userProgress);
    const completed = progressArray.filter(p => p.completed).length;
    const totalScore = progressArray.reduce((sum, p) => sum + (p.score || 0), 0);
    const avgScore = progressArray.length > 0 ? Math.round(totalScore / progressArray.length) : 0;

    setStats({
      totalLessons: progressArray.length,
      completedLessons: completed,
      averageScore: avgScore,
      streak: 7, // Mock data
      totalTime: 145, // Mock data in minutes
    });
  };

  const getProgressPercentage = () => {
    if (stats.totalLessons === 0) return 0;
    return Math.round((stats.completedLessons / stats.totalLessons) * 100);
  };

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Complete your first lesson', icon: 'footsteps', earned: true },
    { id: 2, title: 'Week Warrior', description: '7-day learning streak', icon: 'flame', earned: true },
    { id: 3, title: 'Perfect Score', description: 'Get 100% on a quiz', icon: 'star', earned: false },
    { id: 4, title: 'Language Explorer', description: 'Try 3 different languages', icon: 'globe', earned: false },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#58CC02', '#89E219']} style={styles.header}>
        <Text style={styles.headerTitle}>Your Progress</Text>
        <Text style={styles.headerSubtitle}>Keep up the great work, {user?.name}!</Text>
      </LinearGradient>

      {/* Overall Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Progress</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Learning Journey</Text>
            <Text style={styles.progressPercentage}>{getProgressPercentage()}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <Animatable.View 
                animation="slideInLeft"
                duration={1000}
                style={[styles.progressFill, { width: `${getProgressPercentage()}%` }]} 
              />
            </View>
          </View>
          <Text style={styles.progressText}>
            {stats.completedLessons} of {stats.totalLessons} lessons completed
          </Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsGrid}>
          <Animatable.View animation="fadeInUp" delay={200} style={styles.statCard}>
            <LinearGradient colors={['#FF6B6B', '#FF8E8E']} style={styles.statGradient}>
              <Ionicons name="flame" size={32} color="white" />
              <Text style={styles.statNumber}>{stats.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </LinearGradient>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={400} style={styles.statCard}>
            <LinearGradient colors={['#4ECDC4', '#44A08D']} style={styles.statGradient}>
              <Ionicons name="checkmark-circle" size={32} color="white" />
              <Text style={styles.statNumber}>{stats.completedLessons}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </LinearGradient>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={600} style={styles.statCard}>
            <LinearGradient colors={['#FFD93D', '#FF9F43']} style={styles.statGradient}>
              <Ionicons name="trophy" size={32} color="white" />
              <Text style={styles.statNumber}>{stats.averageScore}%</Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </LinearGradient>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={800} style={styles.statCard}>
            <LinearGradient colors={['#A8E6CF', '#7FCDCD']} style={styles.statGradient}>
              <Ionicons name="time" size={32} color="white" />
              <Text style={styles.statNumber}>{stats.totalTime}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </LinearGradient>
          </Animatable.View>
        </View>
      </View>

      {/* Weekly Progress Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.chartCard}>
          <View style={styles.chartContainer}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <View key={day} style={styles.chartBar}>
                <View 
                  style={[
                    styles.chartBarFill, 
                    { height: `${Math.random() * 80 + 20}%` }
                  ]} 
                />
                <Text style={styles.chartLabel}>{day}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.chartTitle}>Daily Learning Time (minutes)</Text>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        {achievements.map((achievement, index) => (
          <Animatable.View 
            key={achievement.id}
            animation="fadeInRight"
            delay={index * 200}
            style={[styles.achievementCard, !achievement.earned && styles.achievementLocked]}
          >
            <View style={[styles.achievementIcon, !achievement.earned && styles.achievementIconLocked]}>
              <Ionicons 
                name={achievement.icon} 
                size={24} 
                color={achievement.earned ? '#FFD700' : '#CCC'} 
              />
            </View>
            <View style={styles.achievementContent}>
              <Text style={[styles.achievementTitle, !achievement.earned && styles.achievementTitleLocked]}>
                {achievement.title}
              </Text>
              <Text style={[styles.achievementDescription, !achievement.earned && styles.achievementDescriptionLocked]}>
                {achievement.description}
              </Text>
            </View>
            {achievement.earned && (
              <Ionicons name="checkmark-circle" size={24} color="#58CC02" />
            )}
          </Animatable.View>
        ))}
      </View>

      {/* Language Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language Progress</Text>
        <View style={styles.languageCard}>
          <View style={styles.languageHeader}>
            <Text style={styles.languageFlag}>🇨🇲</Text>
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>Duala</Text>
              <Text style={styles.languageLevel}>Beginner</Text>
            </View>
            <Text style={styles.languageProgress}>Level 2</Text>
          </View>
          <View style={styles.languageProgressBar}>
            <View style={[styles.languageProgressFill, { width: '40%' }]} />
          </View>
        </View>

        <View style={styles.languageCard}>
          <View style={styles.languageHeader}>
            <Text style={styles.languageFlag}>🇨🇲</Text>
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>Bamileke</Text>
              <Text style={styles.languageLevel}>Beginner</Text>
            </View>
            <Text style={styles.languageProgress}>Level 1</Text>
          </View>
          <View style={styles.languageProgressBar}>
            <View style={[styles.languageProgressFill, { width: '20%' }]} />
          </View>
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
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
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
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#58CC02',
  },
  progressBarContainer: {
    marginBottom: 10,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E5E5EA',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 50) / 2,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 15,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: 20,
    backgroundColor: '#58CC02',
    borderRadius: 10,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: '#666',
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  achievementCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementIconLocked: {
    backgroundColor: '#F5F5F5',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  achievementTitleLocked: {
    color: '#999',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  achievementDescriptionLocked: {
    color: '#CCC',
  },
  languageCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  languageFlag: {
    fontSize: 32,
    marginRight: 15,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  languageLevel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  languageProgress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#58CC02',
  },
  languageProgressBar: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
  },
  languageProgressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 4,
  },
});
