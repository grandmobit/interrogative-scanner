import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LearningScreen from '../screens/main/LearningScreen';
import LanguageSelectionScreen from '../screens/learning/LanguageSelectionScreen';
import LessonScreen from '../screens/learning/LessonScreen';
import QuizScreen from '../screens/learning/QuizScreen';

const Stack = createStackNavigator();

export default function LearningNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#58CC02',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="LearningMain" 
        component={LearningScreen}
        options={{ title: 'Learning' }}
      />
      <Stack.Screen 
        name="LanguageSelection" 
        component={LanguageSelectionScreen}
        options={{ title: 'Choose Language' }}
      />
      <Stack.Screen 
        name="Lesson" 
        component={LessonScreen}
        options={{ title: 'Lesson' }}
      />
      <Stack.Screen 
        name="Quiz" 
        component={QuizScreen}
        options={{ title: 'Quiz' }}
      />
    </Stack.Navigator>
  );
}
