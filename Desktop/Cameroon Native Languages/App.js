import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { LearningProvider } from './src/context/LearningContext';
import AuthNavigator from './src/navigation/AuthNavigator';
import MainNavigator from './src/navigation/MainNavigator';
import { useAuth } from './src/context/AuthContext';

const Stack = createStackNavigator();

function AppContent() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LearningProvider>
        <AppContent />
      </LearningProvider>
    </AuthProvider>
  );
}
