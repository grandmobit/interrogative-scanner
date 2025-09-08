import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function LandingScreen({ navigation }) {
  const { loginAsGuest } = useAuth();

  const handleGuestLogin = async () => {
    await loginAsGuest();
  };
  return (
    <LinearGradient
      colors={['#58CC02', '#89E219']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animatable.View animation="bounceIn" duration={1500} style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>CT</Text>
          </View>
          <Text style={styles.appName}>Contri-Tok</Text>
          <Text style={styles.slogan}>Learn Cameroonian Languages</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={800} style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.primaryButtonText}>GET STARTED</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryButtonText}>I ALREADY HAVE AN ACCOUNT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.guestButton}
            onPress={handleGuestLogin}
          >
            <Text style={styles.guestButtonText}>CONTINUE AS GUEST</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeIn" delay={1200} style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎯</Text>
            <Text style={styles.featureText}>Interactive Lessons</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔊</Text>
            <Text style={styles.featureText}>Audio Pronunciation</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureText}>Progress Tracking</Text>
          </View>
        </Animatable.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#58CC02',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  slogan: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 60,
  },
  primaryButton: {
    backgroundColor: 'white',
    paddingVertical: 18,
    borderRadius: 25,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#58CC02',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  guestButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    borderRadius: 25,
    marginTop: 16,
  },
  guestButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
});
