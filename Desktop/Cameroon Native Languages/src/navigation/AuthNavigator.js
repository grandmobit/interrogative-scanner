import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from '../screens/auth/LandingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: '#58CC02' }
      }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
