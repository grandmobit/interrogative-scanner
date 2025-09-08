import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:3000/api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        });
        setUser(response.data.user);
      } else {
        // Check for local user as fallback
        const localUserData = await SecureStore.getItemAsync('localUser');
        if (localUserData) {
          const localUser = JSON.parse(localUserData);
          setUser(localUser);
        }
      }
    } catch (error) {
      console.log('Auth check failed:', error);
      await SecureStore.deleteItemAsync('authToken');
      
      // Fallback to local user if backend is unavailable
      try {
        const localUserData = await SecureStore.getItemAsync('localUser');
        if (localUserData) {
          const localUser = JSON.parse(localUserData);
          setUser(localUser);
        }
      } catch (e) {
        console.log('Local user fallback failed:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      }, {
        timeout: 10000 // 10 second timeout
      });
      
      const { token, user } = response.data;
      await SecureStore.setItemAsync('authToken', token);
      setUser(user);
      return { success: true };
    } catch (error) {
      console.log('Login error:', error);
      
      // Check if it's a network error (backend not running)
      if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR' || !error.response) {
        // Check for local user as fallback
        try {
          const localUserData = await SecureStore.getItemAsync('localUser');
          if (localUserData) {
            const localUser = JSON.parse(localUserData);
            if (localUser.email === email) {
              setUser(localUser);
              return { success: true };
            }
          }
        } catch (e) {
          console.log('Local user check failed:', e);
        }
        
        return { 
          success: false, 
          error: 'Cannot connect to server. Please check your internet connection or try again later.' 
        };
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password
      }, {
        timeout: 10000 // 10 second timeout
      });
      
      const { token, user } = response.data;
      await SecureStore.setItemAsync('authToken', token);
      setUser(user);
      return { success: true };
    } catch (error) {
      console.log('Registration error:', error);
      
      // Check if it's a network error (backend not running)
      if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR' || !error.response) {
        // Fallback: Create local user when backend is unavailable
        const localUser = {
          id: Date.now().toString(),
          name,
          email,
          isLocal: true,
          createdAt: new Date().toISOString()
        };
        setUser(localUser);
        await SecureStore.setItemAsync('localUser', JSON.stringify(localUser));
        return { success: true };
      }
      
      // Handle specific backend errors
      let errorMessage = 'Registration failed';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors[0]?.msg || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const loginAsGuest = async () => {
    const guestUser = {
      id: 'guest',
      name: 'Guest User',
      email: null,
      isGuest: true
    };
    setUser(guestUser);
    return { success: true };
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('authToken');
    setUser(null);
  };

  const updateUserProfile = async (profileData) => {
    try {
      if (user && !user.isGuest) {
        // Update user object with new profile data
        const updatedUser = { ...user, ...profileData };
        setUser(updatedUser);
        
        // If user has a token, try to update on server
        const token = await SecureStore.getItemAsync('authToken');
        if (token) {
          try {
            await axios.put(`${API_BASE_URL}/auth/profile`, profileData, {
              headers: { Authorization: `Bearer ${token}` },
              timeout: 5000
            });
          } catch (error) {
            console.log('Failed to update profile on server, saved locally:', error.message);
          }
        }
      }
      return { success: true };
    } catch (error) {
      console.log('Profile update error:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const value = {
    user,
    login,
    register,
    loginAsGuest,
    logout,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
