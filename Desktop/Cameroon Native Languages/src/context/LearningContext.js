import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const LearningContext = createContext();

const API_BASE_URL = 'http://localhost:3000/api';

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};

// Mock data for offline fallback
const mockLanguages = [
  {
    id: 'duala',
    name: 'Duala',
    description: 'Learn the Duala language spoken in Cameroon',
    difficulty: 'Beginner',
    estimatedTime: '3 months'
  },
  {
    id: 'ewondo',
    name: 'Ewondo',
    description: 'Learn Ewondo, widely spoken in central Cameroon',
    difficulty: 'Beginner',
    estimatedTime: '3 months'
  },
  {
    id: 'fulfulde',
    name: 'Fulfulde',
    description: 'Learn Fulfulde, spoken in northern Cameroon',
    difficulty: 'Intermediate',
    estimatedTime: '4 months'
  }
];

const mockLessons = {
  duala: [
    {
      id: 'duala-1',
      title: 'Basic Greetings',
      description: 'Learn how to greet people in Duala',
      difficulty: 'Beginner',
      estimatedTime: '10 min',
      wordCount: 8,
      completed: false
    },
    {
      id: 'duala-2',
      title: 'Family Members',
      description: 'Learn words for family members',
      difficulty: 'Beginner',
      estimatedTime: '15 min',
      wordCount: 12,
      completed: false
    },
    {
      id: 'duala-3',
      title: 'Colors & Numbers',
      description: 'Basic color vocabulary and numbers 1-10',
      difficulty: 'Beginner',
      estimatedTime: '10 min',
      wordCount: 15,
      completed: false
    },
    {
      id: 'duala-4',
      title: 'Food & Drinks',
      description: 'Common food items and beverages',
      difficulty: 'Intermediate',
      estimatedTime: '20 min',
      wordCount: 18,
      completed: false
    }
  ],
  ewondo: [
    {
      id: 'ewondo-1',
      title: 'Basic Greetings',
      description: 'Learn how to greet people in Ewondo',
      difficulty: 'Beginner',
      estimatedTime: '10 min',
      wordCount: 8,
      completed: false
    },
    {
      id: 'ewondo-2',
      title: 'Daily Activities',
      description: 'Common daily activities and verbs',
      difficulty: 'Beginner',
      estimatedTime: '15 min',
      wordCount: 14,
      completed: false
    }
  ],
  fulfulde: [
    {
      id: 'fulfulde-1',
      title: 'Basic Greetings',
      description: 'Learn how to greet people in Fulfulde',
      difficulty: 'Beginner',
      estimatedTime: '10 min',
      wordCount: 8,
      completed: false
    }
  ]
};

export const LearningProvider = ({ children }) => {
  const [languages, setLanguages] = useState(mockLanguages);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = async () => {
    const token = await SecureStore.getItemAsync('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/languages`, { 
        headers,
        timeout: 5000
      });
      setLanguages(response.data);
    } catch (error) {
      console.log('Failed to fetch languages, using offline data:', error.message);
      // Use mock data as fallback
      setLanguages(mockLanguages);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async (languageId) => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/lessons/${languageId}`, { 
        headers,
        timeout: 5000
      });
      setLessons(response.data);
    } catch (error) {
      console.log('Failed to fetch lessons, using offline data:', error.message);
      // Use mock data as fallback
      const offlineLessons = mockLessons[languageId] || [];
      setLessons(offlineLessons);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/progress`, { 
        headers,
        timeout: 5000
      });
      setUserProgress(response.data);
    } catch (error) {
      console.log('Failed to fetch progress, using local data:', error.message);
      // Use empty progress as fallback - no error thrown
      setUserProgress({});
    }
  };

  const updateProgress = async (lessonId, score) => {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${API_BASE_URL}/progress`, {
        lessonId,
        score
      }, { 
        headers,
        timeout: 5000
      });
      
      setUserProgress(prev => ({
        ...prev,
        [lessonId]: response.data
      }));
    } catch (error) {
      console.log('Failed to update progress on server, saving locally:', error.message);
      // Save progress locally as fallback
      const localProgress = {
        lessonId,
        score,
        completedAt: new Date().toISOString(),
        isLocal: true
      };
      
      setUserProgress(prev => ({
        ...prev,
        [lessonId]: localProgress
      }));
    }
  };

  const value = {
    languages,
    selectedLanguage,
    setSelectedLanguage,
    lessons,
    userProgress,
    loading,
    fetchLanguages,
    fetchLessons,
    fetchUserProgress,
    updateProgress
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
};
