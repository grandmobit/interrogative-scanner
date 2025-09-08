/**
 * Stunning Modern Welcome Screen - Premium Cybersecurity UI
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Easing, 
  Dimensions,
  StatusBar,
  SafeAreaView,
  Alert,
  ImageBackground
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface WelcomeScreenProps {
  onGetStarted?: () => void;
  onSignUp?: () => void;
  onPrivacyPolicy?: () => void;
  onTermsOfService?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onGetStarted, 
  onSignUp, 
  onPrivacyPolicy, 
  onTermsOfService 
}) => {
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideUpAnim] = useState(new Animated.Value(50));
  const [logoGlowAnim] = useState(new Animated.Value(0.5));
  const [particleAnim] = useState(new Animated.Value(0));
  const [getStartedScale] = useState(new Animated.Value(1));
  const [signUpScale] = useState(new Animated.Value(1));
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  // Initialize animations
  useEffect(() => {
    // Main entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        delay: 200,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ]).start();

    // Logo glow animation
    const logoGlowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(logoGlowAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }),
        Animated.timing(logoGlowAnim, {
          toValue: 0.5,
          duration: 2500,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }),
      ])
    );

    // Particle floating animation
    const particleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(particleAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }),
        Animated.timing(particleAnim, {
          toValue: 0,
          duration: 4000,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }),
      ])
    );
    particleAnimation.start();

    // Cleanup function
    return () => {
      logoGlowAnimation.stop();
      particleAnimation.stop();
    };
  }, []);

  const handleGetStartedPress = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setLoadingText('Initializing security protocols...');
    
    Animated.sequence([
      Animated.timing(getStartedScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(getStartedScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoadingText('Loading dashboard...');
      await new Promise(resolve => setTimeout(resolve, 400));
      
      if (onGetStarted) {
        onGetStarted();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize the app. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSignUpPress = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setLoadingText('Preparing sign up...');
    
    Animated.sequence([
      Animated.timing(signUpScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(signUpScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      setLoadingText('Redirecting...');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (onSignUp) {
        onSignUp();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to prepare sign up. Please try again.');
      setIsLoading(false);
    }
  };

  // Particle positions for floating effect
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * screenWidth,
    y: Math.random() * screenHeight,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.3 + 0.1,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000814" />
      
      {/* Background Image */}
      <ImageBackground 
        source={require('../../images/backgrounds/b 3.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Overlay for better text readability */}
        <View style={styles.overlay} />
        
        {/* Floating Particles */}
        {particles.map((particle) => (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              {
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                opacity: particleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [particle.opacity, particle.opacity * 0.3],
                }),
                transform: [
                  {
                    translateY: particleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -20],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
        
        {/* Main Content */}
        <Animated.View 
          style={[
            styles.content,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Animated.View 
            style={[
              styles.logoGlow,
              { opacity: logoGlowAnim }
            ]}
          />
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🛡️</Text>
            <Text style={styles.appName}>Interrogative Scanner</Text>
          </View>
          <Text style={styles.tagline}>Advanced Cybersecurity Protection</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Secure Your Digital World</Text>
          <Text style={styles.heroSubtitle}>Military-grade protection with real-time threat detection</Text>
            
            {/* Feature highlights */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="shield-check" size={20} color="#00ffff" />
                <Text style={styles.featureText}>Real-time Protection</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="eye-check" size={20} color="#00ffff" />
                <Text style={styles.featureText}>Threat Detection</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="lock-check" size={20} color="#00ffff" />
                <Text style={styles.featureText}>Secure Encryption</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Animated.View style={[{ transform: [{ scale: getStartedScale }] }]}>
              <TouchableOpacity 
                style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                onPress={handleGetStartedPress}
                activeOpacity={isLoading ? 1 : 0.8}
                disabled={isLoading}
              >
                <View style={styles.buttonContent}>
                  <MaterialCommunityIcons 
                    name="rocket-launch" 
                    size={18} 
                    color="#000814" 
                    style={styles.buttonIcon} 
                  />
                  <Text style={[styles.primaryButtonText, isLoading && styles.buttonTextDisabled]}>
                    {isLoading ? 'Loading...' : 'Get Started'}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
            
            <Animated.View style={[{ transform: [{ scale: signUpScale }] }]}>
              <TouchableOpacity 
                style={[styles.secondaryButton, isLoading && styles.buttonDisabled]}
                onPress={handleSignUpPress}
                activeOpacity={isLoading ? 1 : 0.8}
                disabled={isLoading}
              >
                <View style={styles.buttonContent}>
                  <MaterialCommunityIcons 
                    name="account-plus" 
                    size={18} 
                    color="#00ffff" 
                    style={styles.buttonIcon} 
                  />
                  <Text style={[styles.secondaryButtonText, isLoading && styles.buttonTextDisabled]}>
                    {isLoading ? 'Please wait...' : 'Sign Up'}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Loading Status */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>{loadingText}</Text>
              <View style={styles.loadingBar}>
                <Animated.View 
                  style={[
                    styles.loadingProgress,
                    {
                      transform: [{
                        scaleX: particleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      }],
                    },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Bottom Links */}
          <View style={styles.bottomSection}>
            <View style={styles.linksContainer}>
              <TouchableOpacity 
                onPress={() => {
                  if (!isLoading && onPrivacyPolicy) {
                    onPrivacyPolicy();
                  }
                }}
                activeOpacity={isLoading ? 1 : 0.7}
                disabled={isLoading}
              >
                <Text style={[styles.linkText, isLoading && styles.linkTextDisabled]}>Privacy Policy</Text>
              </TouchableOpacity>
              <Text style={[styles.linkSeparator, isLoading && styles.linkTextDisabled]}>•</Text>
              <TouchableOpacity 
                onPress={() => {
                  if (!isLoading && onTermsOfService) {
                    onTermsOfService();
                  }
                }}
                activeOpacity={isLoading ? 1 : 0.7}
                disabled={isLoading}
              >
                <Text style={[styles.linkText, isLoading && styles.linkTextDisabled]}>Terms of Service</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000814',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 8, 20, 0.3)',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientBackground: {
    flex: 1,
    backgroundColor: '#000814',
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#00ffff',
    borderRadius: 50,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#00ffff',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  meshGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
    backgroundColor: 'transparent',
  },
  gridLine: {
    position: 'absolute',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#00ffff',
    top: -50,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  logoIcon: {
    fontSize: 60,
    marginBottom: 10,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#a0a9c0',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 1,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 40,
  },
  shieldContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  shieldGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#00ffff',
    opacity: 0.2,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 15,
  },
  shieldIcon: {
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  shieldRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: '#00ffff33',
    borderStyle: 'dashed',
  },
  heroText: {
    fontSize: 16,
    color: '#a0a9c0',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    fontWeight: '400',
  },
  buttonContainer: {
    paddingHorizontal: 10,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00ffff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00ffff',
    opacity: 0.3,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 15,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000814',
    marginRight: 8,
  },
  signInButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#00ffff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: 'transparent',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signInText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00ffff',
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  linksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 12,
    color: '#666',
    textDecorationLine: 'underline',
  },
  linkSeparator: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signInButtonDisabled: {
    opacity: 0.4,
    borderColor: '#666',
  },
  loadingIcon: {
    marginRight: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#00ffff',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: '#00ffff',
    borderRadius: 2,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  linkTextDisabled: {
    color: '#444',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#a0a9c0',
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 12,
    color: '#00ffff',
    marginTop: 4,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#00ffff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00ffff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    color: '#000814',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#00ffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    opacity: 0.5,
  },
});

export default WelcomeScreen;
