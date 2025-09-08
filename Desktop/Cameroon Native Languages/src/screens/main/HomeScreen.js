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
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { userProgress, fetchUserProgress } = useLearning();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    fetchUserProgress();
  }, []);

  const getStreakDays = () => {
    // Mock streak calculation
    return 7;
  };

  const getTotalLessons = () => {
    return Object.keys(userProgress).length;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#58CC02', '#89E219']} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{greeting}!</Text>
            <Text style={styles.userName}>{user?.name || 'Learner'}</Text>
            {user?.isGuest && (
              <Text style={styles.guestLabel}>Guest Mode</Text>
            )}
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Profile')} 
              style={styles.profileButton}
            >
              <Ionicons name="person-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Streak Counter */}
        <Animatable.View animation="bounceIn" style={styles.streakContainer}>
          <View style={styles.streakCircle}>
            <Ionicons name="flame" size={32} color="#FF6B35" />
            <Text style={styles.streakNumber}>{getStreakDays()}</Text>
          </View>
          <Text style={styles.streakText}>Day Streak!</Text>
        </Animatable.View>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="book-outline" size={24} color="#58CC02" />
          <Text style={styles.statNumber}>{getTotalLessons()}</Text>
          <Text style={styles.statLabel}>Lessons</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trophy-outline" size={24} color="#FFD700" />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Achievements</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time-outline" size={24} color="#FF6B35" />
          <Text style={styles.statNumber}>45</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>
      </View>

      {/* Continue Learning */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Continue Learning</Text>
        <TouchableOpacity 
          style={styles.continueCard}
          onPress={() => navigation.navigate('Learning')}
        >
          <LinearGradient colors={['#4CAF50', '#58CC02']} style={styles.continueGradient}>
            <View style={styles.continueContent}>
              <View>
                <Text style={styles.continueTitle}>Duala Basics</Text>
                <Text style={styles.continueSubtitle}>Lesson 3: Greetings</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '60%' }]} />
                </View>
              </View>
              <Ionicons name="play-circle" size={48} color="white" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Daily Goal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Goal</Text>
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Ionicons name="target-outline" size={24} color="#58CC02" />
            <Text style={styles.goalTitle}>15 minutes today</Text>
          </View>
          <View style={styles.goalProgress}>
            <View style={styles.goalProgressBar}>
              <View style={[styles.goalProgressFill, { width: '80%' }]} />
            </View>
            <Text style={styles.goalProgressText}>12/15 min</Text>
          </View>
        </View>
      </View>

      {/* Recent Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        <View style={styles.achievementCard}>
          <View style={styles.achievementIcon}>
            <Ionicons name="star" size={24} color="#FFD700" />
          </View>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>First Lesson Complete!</Text>
            <Text style={styles.achievementSubtitle}>You completed your first Duala lesson</Text>
          </View>
        </View>
      </View>

      {/* Language Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Did You Know?</Text>
        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={24} color="#58CC02" />
          <Text style={styles.tipText}>
            Cameroon has over 280 native languages, making it one of the most linguistically diverse countries in Africa!
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
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  guestLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    padding: 8,
    marginRight: 8,
  },
  logoutButton: {
    padding: 8,
  },
  streakContainer: {
    alignItems: 'center',
  },
  streakCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  streakNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: -5,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
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
  continueCard: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  continueGradient: {
    padding: 20,
  },
  continueContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  continueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  continueSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    marginBottom: 10,
  },
  progressBar: {
    width: 120,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 3,
  },
  goalCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    marginRight: 15,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 4,
  },
  goalProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#58CC02',
  },
  achievementCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  achievementSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginLeft: 15,
  },
});
