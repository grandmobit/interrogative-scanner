import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeNavigator from './HomeNavigator';
import DashboardScreen from '../screens/main/DashboardScreen';
import LearningNavigator from './LearningNavigator';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Dashboard') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Learning') {
            iconName = focused ? 'book' : 'book-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#58CC02',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Learning" component={LearningNavigator} />
    </Tab.Navigator>
  );
}
