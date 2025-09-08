import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import AuthScreens from './AuthScreens';

// Demo component to show how to integrate the AuthScreens
const AuthDemo: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (email: string, password: string) => {
    // Simulate login API call
    console.log('Login attempt:', { email, password });
    
    // Mock validation - in real app, this would be an API call
    if (email && password) {
      Alert.alert('Success', 'Login successful!', [
        { text: 'OK', onPress: () => setIsAuthenticated(true) }
      ]);
    } else {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  const handleSignup = (userData: any) => {
    // Simulate signup API call
    console.log('Signup attempt:', userData);
    
    Alert.alert('Success', 'Account created successfully!', [
      { text: 'OK', onPress: () => setIsAuthenticated(true) }
    ]);
  };

  const handleGuestContinue = () => {
    Alert.alert('Guest Mode', 'Continuing as guest user');
    setIsAuthenticated(true);
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert('Social Login', `Login with ${provider} - Feature coming soon!`);
  };

  if (isAuthenticated) {
    return (
      <View style={styles.authenticatedContainer}>
        {/* Your main app content goes here */}
      </View>
    );
  }

  return (
    <AuthScreens
      onLogin={handleLogin}
      onSignup={handleSignup}
      onGuestContinue={handleGuestContinue}
      onSocialLogin={handleSocialLogin}
    />
  );
};

const styles = StyleSheet.create({
  authenticatedContainer: {
    flex: 1,
    backgroundColor: '#1e2139',
  },
});

export default AuthDemo;
