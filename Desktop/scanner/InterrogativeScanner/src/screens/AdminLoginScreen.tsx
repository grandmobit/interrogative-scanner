/**
 * Admin Login Screen - Secure authentication for administrators
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  useTheme,
  ActivityIndicator,
  IconButton
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useAdminStore from '../stores/adminStore';

interface AdminLoginScreenProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onLoginSuccess, onBack }) => {
  const theme = useTheme();
  const { adminLogin, isLoading, error } = useAdminStore();
  
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!credentials.username.trim() || !credentials.password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    const success = await adminLogin(credentials.username, credentials.password);
    
    if (success) {
      Alert.alert(
        'Login Successful',
        'Welcome to the Administrator Panel',
        [{ text: 'Continue', onPress: onLoginSuccess }]
      );
    } else {
      Alert.alert(
        'Login Failed',
        error || 'Invalid credentials. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const showCredentialsHelp = () => {
    Alert.alert(
      'Demo Credentials',
      'For testing purposes:\n\nSuper Admin:\nUsername: admin\nPassword: admin123\n\nModerator:\nUsername: moderator\nPassword: mod123',
      [{ text: 'OK' }]
    );
  };

  return (
    <ImageBackground
      source={require('../../images/backgrounds/b 3.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView 
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View style={styles.header}>
            <IconButton
              icon="arrow-left"
              size={24}
              iconColor="#ffffff"
              onPress={onBack}
              style={styles.backButton}
            />
            <IconButton
              icon="help-circle"
              size={24}
              iconColor="#00d4ff"
              onPress={showCredentialsHelp}
              style={styles.helpButton}
            />
          </View>

          {/* Login Card */}
          <View style={styles.loginContainer}>
            <Card style={styles.loginCard}>
              <Card.Content style={styles.cardContent}>
                {/* Logo and Title */}
                <View style={styles.logoContainer}>
                  <MaterialCommunityIcons 
                    name="shield-crown" 
                    size={48} 
                    color="#00d4ff" 
                  />
                  <Text style={styles.title}>Administrator Access</Text>
                  <Text style={styles.subtitle}>Secure login required</Text>
                </View>

                {/* Login Form */}
                <View style={styles.formContainer}>
                  <TextInput
                    label="Username"
                    value={credentials.username}
                    onChangeText={(text) => setCredentials(prev => ({ ...prev, username: text }))}
                    mode="outlined"
                    style={styles.input}
                    left={<TextInput.Icon icon="account" />}
                    autoCapitalize="none"
                    autoComplete="username"
                  />

                  <TextInput
                    label="Password"
                    value={credentials.password}
                    onChangeText={(text) => setCredentials(prev => ({ ...prev, password: text }))}
                    mode="outlined"
                    secureTextEntry={!passwordVisible}
                    style={styles.input}
                    left={<TextInput.Icon icon="lock" />}
                    right={
                      <TextInput.Icon 
                        icon={passwordVisible ? "eye-off" : "eye"} 
                        onPress={() => setPasswordVisible(!passwordVisible)}
                      />
                    }
                    autoComplete="password"
                  />

                  {error && (
                    <Text style={styles.errorText}>{error}</Text>
                  )}

                  <Button
                    mode="contained"
                    onPress={handleLogin}
                    style={styles.loginButton}
                    contentStyle={styles.loginButtonContent}
                    disabled={isLoading}
                    icon={isLoading ? undefined : "login"}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      'Login to Admin Panel'
                    )}
                  </Button>
                </View>

                {/* Security Notice */}
                <View style={styles.securityNotice}>
                  <MaterialCommunityIcons 
                    name="security" 
                    size={16} 
                    color="#ff9800" 
                  />
                  <Text style={styles.securityText}>
                    This is a secure area. All activities are logged and monitored.
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 8, 20, 0.85)',
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 1,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  helpButton: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
  },
  loginContainer: {
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  loginCard: {
    borderRadius: 16,
    elevation: 8,
  },
  cardContent: {
    padding: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    color: '#ff1744',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  loginButton: {
    borderRadius: 8,
    marginTop: 8,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.3)',
  },
  securityText: {
    fontSize: 12,
    color: '#ff9800',
    marginLeft: 8,
    textAlign: 'center',
    flex: 1,
  },
});

export default AdminLoginScreen;
