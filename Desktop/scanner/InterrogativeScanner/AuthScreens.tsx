import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

// Types
interface AuthScreensProps {
  onLogin?: (email: string, password: string) => void;
  onSignup?: (userData: SignupData) => void;
  onGuestContinue?: () => void;
  onSocialLogin?: (provider: string) => void;
}

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

type Screen = 'welcome' | 'login' | 'signup';

const AuthScreens: React.FC<AuthScreensProps> = ({
  onLogin,
  onSignup,
  onGuestContinue,
  onSocialLogin,
}) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  // Animation
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Password strength calculation
  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['#ff4757', '#ff6b7a', '#ffa502', '#2ed573', '#00d2d3'];
    
    return {
      strength: Math.min(strength, 4),
      label: labels[Math.min(strength, 4)],
      color: colors[Math.min(strength, 4)],
    };
  };

  // Screen transitions
  const navigateToScreen = (screen: Screen) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: screen === 'welcome' ? 0 : screen === 'login' ? -screenWidth : -screenWidth * 2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    setCurrentScreen(screen);
  };

  // Validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    if (!loginData.email || !loginData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (!validateEmail(loginData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    onLogin?.(loginData.email, loginData.password);
  };

  const handleSignup = () => {
    if (!signupData.fullName || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (!validateEmail(signupData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    if (signupData.password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }
    
    if (!acceptTerms) {
      Alert.alert('Error', 'Please accept the terms and conditions');
      return;
    }
    
    onSignup?.({
      ...signupData,
      acceptTerms,
    });
  };

  // Reusable Components
  const CustomInput: React.FC<{
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address';
    rightIcon?: React.ReactNode;
  }> = ({ placeholder, value, onChangeText, secureTextEntry, keyboardType, rightIcon }) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#8892b0"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
      {rightIcon && <View style={styles.inputRightIcon}>{rightIcon}</View>}
    </View>
  );

  const PrimaryButton: React.FC<{
    title: string;
    onPress: () => void;
    style?: any;
  }> = ({ title, onPress, style }) => (
    <TouchableOpacity style={[styles.primaryButton, style]} onPress={onPress}>
      <Text style={styles.primaryButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const SecondaryButton: React.FC<{
    title: string;
    onPress: () => void;
    style?: any;
  }> = ({ title, onPress, style }) => (
    <TouchableOpacity style={[styles.secondaryButton, style]} onPress={onPress}>
      <Text style={styles.secondaryButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const SocialButton: React.FC<{
    title: string;
    icon: string;
    onPress: () => void;
    backgroundColor: string;
  }> = ({ title, icon, onPress, backgroundColor }) => (
    <TouchableOpacity
      style={[styles.socialButton, { backgroundColor }]}
      onPress={onPress}
    >
      <Text style={styles.socialButtonIcon}>{icon}</Text>
      <Text style={styles.socialButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  // Welcome Screen
  const WelcomeScreen = () => (
    <View style={styles.welcomeContainer}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoIcon}>🛡️</Text>
        </View>
        <Text style={styles.appName}>Interrogative Scanner</Text>
        <Text style={styles.tagline}>
          Advanced cybersecurity protection{'\n'}for your digital assets
        </Text>
      </View>
      
      <View style={styles.welcomeButtons}>
        <PrimaryButton
          title="Get Started"
          onPress={() => navigateToScreen('signup')}
        />
        <SecondaryButton
          title="I already have an account"
          onPress={() => navigateToScreen('login')}
        />
        <TouchableOpacity
          style={styles.guestButton}
          onPress={onGuestContinue}
        >
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Login Screen
  const LoginScreen = () => (
    <ScrollView style={styles.authContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.authHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigateToScreen('welcome')}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.authTitle}>Welcome Back</Text>
        <Text style={styles.authSubtitle}>Sign in to your account</Text>
      </View>

      <View style={styles.formContainer}>
        <CustomInput
          placeholder="Email address"
          value={loginData.email}
          onChangeText={(text) => setLoginData({ ...loginData, email: text })}
          keyboardType="email-address"
        />
        
        <CustomInput
          placeholder="Password"
          value={loginData.password}
          onChangeText={(text) => setLoginData({ ...loginData, password: text })}
          secureTextEntry={!showPassword}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          }
        />

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <PrimaryButton
          title="Sign In"
          onPress={handleLogin}
          style={styles.authButton}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtons}>
          <SocialButton
            title="Google"
            icon="G"
            backgroundColor="#4285f4"
            onPress={() => onSocialLogin?.('google')}
          />
          <SocialButton
            title="Apple"
            icon="🍎"
            backgroundColor="#000000"
            onPress={() => onSocialLogin?.('apple')}
          />
        </View>

        <View style={styles.switchAuth}>
          <Text style={styles.switchAuthText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigateToScreen('signup')}>
            <Text style={styles.switchAuthLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  // Signup Screen
  const SignupScreen = () => {
    const passwordStrength = getPasswordStrength(signupData.password);
    
    return (
      <ScrollView style={styles.authContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.authHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigateToScreen('welcome')}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.authTitle}>Create Account</Text>
          <Text style={styles.authSubtitle}>Join us for secure protection</Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            placeholder="Full Name"
            value={signupData.fullName}
            onChangeText={(text) => setSignupData({ ...signupData, fullName: text })}
          />
          
          <CustomInput
            placeholder="Email address"
            value={signupData.email}
            onChangeText={(text) => setSignupData({ ...signupData, email: text })}
            keyboardType="email-address"
          />
          
          <CustomInput
            placeholder="Password"
            value={signupData.password}
            onChangeText={(text) => setSignupData({ ...signupData, password: text })}
            secureTextEntry={!showPassword}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            }
          />

          {signupData.password.length > 0 && (
            <View style={styles.passwordStrength}>
              <View style={styles.strengthBar}>
                <View
                  style={[
                    styles.strengthFill,
                    {
                      width: `${(passwordStrength.strength + 1) * 20}%`,
                      backgroundColor: passwordStrength.color,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                {passwordStrength.label}
              </Text>
            </View>
          )}
          
          <CustomInput
            placeholder="Confirm Password"
            value={signupData.confirmPassword}
            onChangeText={(text) => setSignupData({ ...signupData, confirmPassword: text })}
            secureTextEntry={!showConfirmPassword}
            rightIcon={
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            }
          />

          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setAcceptTerms(!acceptTerms)}
          >
            <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
              {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          <PrimaryButton
            title="Create Account"
            onPress={handleSignup}
            style={styles.authButton}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign up with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <SocialButton
              title="Google"
              icon="G"
              backgroundColor="#4285f4"
              onPress={() => onSocialLogin?.('google')}
            />
            <SocialButton
              title="Apple"
              icon="🍎"
              backgroundColor="#000000"
              onPress={() => onSocialLogin?.('apple')}
            />
          </View>

          <View style={styles.switchAuth}>
            <Text style={styles.switchAuthText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigateToScreen('login')}>
              <Text style={styles.switchAuthLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Animated.View
        style={[
          styles.screenContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {currentScreen === 'welcome' && <WelcomeScreen />}
        {currentScreen === 'login' && <LoginScreen />}
        {currentScreen === 'signup' && <SignupScreen />}
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(135deg, #1e2139 0%, #2a2d47 100%)',
  },
  screenContainer: {
    flex: 1,
  },
  
  // Welcome Screen Styles
  welcomeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: isTablet ? 60 : 30,
    paddingVertical: isTablet ? 80 : 60,
    backgroundColor: 'linear-gradient(135deg, #1e2139 0%, #2a2d47 100%)',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: isTablet ? 100 : 80,
  },
  logoCircle: {
    width: isTablet ? 120 : 100,
    height: isTablet ? 120 : 100,
    borderRadius: isTablet ? 60 : 50,
    backgroundColor: 'linear-gradient(135deg, #4f7cff, #6b8cff)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: '#4f7cff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoIcon: {
    fontSize: isTablet ? 60 : 50,
  },
  appName: {
    fontSize: isTablet ? 32 : 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: isTablet ? 18 : 16,
    color: '#8892b0',
    textAlign: 'center',
    lineHeight: isTablet ? 26 : 24,
    paddingHorizontal: 20,
  },
  welcomeButtons: {
    gap: 16,
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  guestButtonText: {
    color: '#8892b0',
    fontSize: 16,
    fontWeight: '600',
  },

  // Auth Screen Styles
  authContainer: {
    flex: 1,
    backgroundColor: 'linear-gradient(135deg, #1e2139 0%, #2a2d47 100%)',
  },
  authHeader: {
    paddingHorizontal: isTablet ? 60 : 30,
    paddingTop: isTablet ? 80 : 60,
    paddingBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  backButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: '600',
  },
  authTitle: {
    fontSize: isTablet ? 32 : 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: isTablet ? 18 : 16,
    color: '#8892b0',
  },
  formContainer: {
    paddingHorizontal: isTablet ? 60 : 30,
    paddingBottom: 40,
  },

  // Input Styles
  inputContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: isTablet ? 18 : 16,
    fontSize: isTablet ? 18 : 16,
    color: 'white',
    fontWeight: '500',
  },
  inputRightIcon: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  eyeIcon: {
    fontSize: 20,
    color: '#8892b0',
  },

  // Button Styles
  primaryButton: {
    backgroundColor: 'linear-gradient(135deg, #4f7cff, #6b8cff)',
    borderRadius: 16,
    paddingVertical: isTablet ? 18 : 16,
    alignItems: 'center',
    shadowColor: '#4f7cff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingVertical: isTablet ? 16 : 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
  },
  authButton: {
    marginTop: 10,
  },

  // Social Login Styles
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isTablet ? 16 : 14,
    borderRadius: 12,
    gap: 8,
  },
  socialButtonIcon: {
    fontSize: 18,
    color: 'white',
    fontWeight: '700',
  },
  socialButtonText: {
    color: 'white',
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },

  // Divider Styles
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: '#8892b0',
    fontSize: 14,
    marginHorizontal: 16,
    fontWeight: '500',
  },

  // Password Strength Styles
  passwordStrength: {
    marginBottom: 20,
  },
  strengthBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    marginBottom: 8,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Terms and Conditions Styles
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#4f7cff',
    borderColor: '#4f7cff',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  termsText: {
    flex: 1,
    color: '#8892b0',
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: {
    color: '#4f7cff',
    fontWeight: '600',
  },

  // Forgot Password Styles
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#4f7cff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Switch Auth Styles
  switchAuth: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchAuthText: {
    color: '#8892b0',
    fontSize: 14,
  },
  switchAuthLink: {
    color: '#4f7cff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AuthScreens;
