import React, { useEffect } from 'react';
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

export default function LearningScreen({ navigation }) {
  const { languages, fetchLanguages, loading } = useLearning();

  useEffect(() => {
    fetchLanguages();
  }, []);

  const cameroonLanguages = [
    {
      id: 1,
      name: 'Duala',
      region: 'Littoral',
      speakers: '87,700',
      difficulty: 'Beginner',
      flag: '🇨🇲',
      color: ['#FF6B6B', '#FF8E8E'],
      lessons: 24,
      description: 'Coastal Bantu language'
    },
    {
      id: 2,
      name: 'Bamileke',
      region: 'West',
      speakers: '300,000',
      difficulty: 'Intermediate',
      flag: '🇨🇲',
      color: ['#4ECDC4', '#44A08D'],
      lessons: 18,
      description: 'Grassfields language'
    },
    {
      id: 3,
      name: 'Fulfulde',
      region: 'North',
      speakers: '1,000,000',
      difficulty: 'Advanced',
      flag: '🇨🇲',
      color: ['#FFD93D', '#FF9F43'],
      lessons: 32,
      description: 'Atlantic language'
    },
    {
      id: 4,
      name: 'Ewondo',
      region: 'Centre',
      speakers: '577,700',
      difficulty: 'Beginner',
      flag: '🇨🇲',
      color: ['#A8E6CF', '#7FCDCD'],
      lessons: 20,
      description: 'Bantu language'
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#58CC02';
      case 'Intermediate': return '#FF9500';
      case 'Advanced': return '#FF3B30';
      default: return '#58CC02';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#58CC02', '#89E219']} style={styles.header}>
        <Text style={styles.headerTitle}>Choose Your Language</Text>
        <Text style={styles.headerSubtitle}>Explore Cameroon's rich linguistic heritage</Text>
      </LinearGradient>

      {/* Featured Language */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌟 Featured Language</Text>
        <TouchableOpacity 
          style={styles.featuredCard}
          onPress={() => navigation.navigate('LanguageSelection', { languageId: 1 })}
        >
          <LinearGradient colors={['#FF6B6B', '#FF8E8E']} style={styles.featuredGradient}>
            <View style={styles.featuredContent}>
              <View style={styles.featuredLeft}>
                <Text style={styles.featuredFlag}>🇨🇲</Text>
                <View>
                  <Text style={styles.featuredName}>Duala</Text>
                  <Text style={styles.featuredDescription}>Perfect for beginners</Text>
                  <View style={styles.featuredStats}>
                    <View style={styles.featuredStat}>
                      <Ionicons name="people" size={16} color="rgba(255,255,255,0.8)" />
                      <Text style={styles.featuredStatText}>87K speakers</Text>
                    </View>
                    <View style={styles.featuredStat}>
                      <Ionicons name="book" size={16} color="rgba(255,255,255,0.8)" />
                      <Text style={styles.featuredStatText}>24 lessons</Text>
                    </View>
                  </View>
                </View>
              </View>
              <Ionicons name="arrow-forward-circle" size={48} color="white" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* All Languages */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Languages</Text>
        {cameroonLanguages.map((language, index) => (
          <Animatable.View 
            key={language.id}
            animation="fadeInUp"
            delay={index * 200}
          >
            <TouchableOpacity 
              style={styles.languageCard}
              onPress={() => navigation.navigate('LanguageSelection', { languageId: language.id })}
            >
              <View style={styles.languageHeader}>
                <Text style={styles.languageFlag}>{language.flag}</Text>
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.languageRegion}>{language.region} Region</Text>
                  <Text style={styles.languageDescription}>{language.description}</Text>
                </View>
                <View style={styles.languageRight}>
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(language.difficulty) }]}>
                    <Text style={styles.difficultyText}>{language.difficulty}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.languageStats}>
                <View style={styles.languageStat}>
                  <Ionicons name="people-outline" size={16} color="#666" />
                  <Text style={styles.languageStatText}>{language.speakers} speakers</Text>
                </View>
                <View style={styles.languageStat}>
                  <Ionicons name="book-outline" size={16} color="#666" />
                  <Text style={styles.languageStatText}>{language.lessons} lessons</Text>
                </View>
                <View style={styles.languageStat}>
                  <Ionicons name="location-outline" size={16} color="#666" />
                  <Text style={styles.languageStatText}>{language.region}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>

      {/* Language Facts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Did You Know?</Text>
        <View style={styles.factCard}>
          <Ionicons name="bulb-outline" size={24} color="#58CC02" />
          <View style={styles.factContent}>
            <Text style={styles.factTitle}>Linguistic Diversity</Text>
            <Text style={styles.factText}>
              Cameroon is home to 280+ languages from 4 major language families: 
              Niger-Congo, Nilo-Saharan, Afro-Asiatic, and Creole languages.
            </Text>
          </View>
        </View>

        <View style={styles.factCard}>
          <Ionicons name="globe-outline" size={24} color="#FF6B35" />
          <View style={styles.factContent}>
            <Text style={styles.factTitle}>Official Languages</Text>
            <Text style={styles.factText}>
              French and English are official languages, but native languages 
              are essential for cultural identity and local communication.
            </Text>
          </View>
        </View>
      </View>

      {/* Coming Soon */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 Coming Soon</Text>
        <View style={styles.comingSoonCard}>
          <Text style={styles.comingSoonTitle}>More Languages</Text>
          <Text style={styles.comingSoonText}>
            We're working on adding Bassa, Beti, Fang, and many more Cameroonian languages!
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
    paddingTop: 20,
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
    textAlign: 'center',
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
  featuredCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  featuredGradient: {
    padding: 25,
  },
  featuredContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featuredFlag: {
    fontSize: 48,
    marginRight: 20,
  },
  featuredName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
  },
  featuredStats: {
    flexDirection: 'row',
  },
  featuredStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  featuredStatText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
  },
  languageCard: {
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  languageRegion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  languageDescription: {
    fontSize: 12,
    color: '#999',
  },
  languageRight: {
    alignItems: 'flex-end',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  languageStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  languageStat: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageStatText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  factCard: {
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
  factContent: {
    flex: 1,
    marginLeft: 15,
  },
  factTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  factText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  comingSoonCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
