import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

// Import screens
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';

// Create Stack Navigator
const Stack = createNativeStackNavigator();

// Authentication Context for managing user state
export const AuthContext = React.createContext();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock authentication functions
  const authFunctions = {
    // Login function with mock validation
    login: async (email, password) => {
      try {
        // Mock authentication - accept any email with password "password123"
        if (email && password === 'password123') {
          const userData = {
            id: Date.now(),
            email: email,
            name: email.split('@')[0], // Use email prefix as name
            loginTime: new Date().toISOString()
          };
          
          // Store user data
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          setIsAuthenticated(true);
          
          return { success: true, user: userData };
        } else {
          return { 
            success: false, 
            error: 'Invalid credentials. Use password: password123' 
          };
        }
      } catch (error) {
        return { 
          success: false, 
          error: 'Login failed. Please try again.' 
        };
      }
    },

    // Signup function with mock validation
    signup: async (email, password, confirmPassword) => {
      try {
        // Basic validation
        if (!email || !password || !confirmPassword) {
          return { 
            success: false, 
            error: 'All fields are required' 
          };
        }

        if (password !== confirmPassword) {
          return { 
            success: false, 
            error: 'Passwords do not match' 
          };
        }

        if (password.length < 6) {
          return { 
            success: false, 
            error: 'Password must be at least 6 characters' 
          };
        }

        // Mock signup - create new user
        const userData = {
          id: Date.now(),
          email: email,
          name: email.split('@')[0],
          signupTime: new Date().toISOString()
        };

        // Store user data
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);

        return { success: true, user: userData };
      } catch (error) {
        return { 
          success: false, 
          error: 'Signup failed. Please try again.' 
        };
      }
    },

    // Logout function
    logout: async () => {
      try {
        await AsyncStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          error: 'Logout failed' 
        };
      }
    },

    // Get current user
    getCurrentUser: () => user,

    // Check if authenticated
    isLoggedIn: () => isAuthenticated
  };

  // Show loading screen while checking auth state
  if (isLoading) {
    return null; // You can replace this with a proper loading screen
  }

  return (
    <AuthContext.Provider value={authFunctions}>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#1e2139" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false, // Hide default header for custom styling
            gestureEnabled: false, // Disable swipe back gesture for auth flow
          }}
        >
          {isAuthenticated ? (
            // Authenticated stack - show main app screens
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{
                animationTypeForReplace: 'push', // Smooth transition after login
              }}
            />
          ) : (
            // Unauthenticated stack - show welcome/auth screens
            <Stack.Screen 
              name="Welcome" 
              component={WelcomeScreen}
              options={{
                animationTypeForReplace: 'pop', // Smooth transition after logout
              }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
