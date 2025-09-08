import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Easing, PanResponder, Alert, Platform, Dimensions } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { StatusBar } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import HomeScreen from './src/screens/HomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import LearningScreen from './src/screens/LearningScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import AdminLoginScreen from './src/screens/AdminLoginScreen';
import AdminNavigator from './src/screens/AdminNavigator';
import GlassmorphismNavigation from './src/components/GlassmorphismNavigation';
import useAdminStore from './src/stores/adminStore';
import * as DocumentPicker from 'expo-document-picker';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

const tabs = [
  { id: 'home', title: 'Home', icon: '🏠' },
  { id: 'dashboard', title: 'Dashboard', icon: '📊' },
  { id: 'scanner', title: 'Scanner', icon: '🔍' },
  { id: 'learning', title: 'Learning', icon: '🎓' },
  { id: 'community', title: 'Community', icon: '👥' },
  { id: 'profile', title: 'Profile', icon: '👤' },
];

const App: React.FC = () => {
  // Admin store for real-time updates
  const { addUser, initializeAdminData } = useAdminStore();
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Set to false to show welcome screen first
  const [currentUser, setCurrentUser] = useState<any>({
    email: 'user@secureapp.com',
    name: 'Security User'
  });
  const [authScreen, setAuthScreen] = useState<'welcome' | 'login' | 'signup'>('welcome');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    acceptTerms: false 
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
  // App state
  const [activeTab, setActiveTab] = useState('learning'); // Start with learning tab
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Security Update', message: 'New threat definitions available', type: 'info', timestamp: new Date() },
    { id: 2, title: 'Scan Complete', message: 'Your file scan finished successfully', type: 'success', timestamp: new Date(Date.now() - 300000) }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Scanner state
  const [urlInput, setUrlInput] = useState('');
  const [scanMode, setScanMode] = useState<'express' | 'comprehensive'>('express');
  const [scanTarget, setScanTarget] = useState<'file' | 'url'>('file');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [urlToScan, setUrlToScan] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [showScanDetails, setShowScanDetails] = useState(false);
  const [currentScanPhase, setCurrentScanPhase] = useState('');
  
  // Profile state
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Cyber Guardian',
    email: 'guardian@cybersec.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    avatar: '👤',
    notifications: true,
    twoFactorEnabled: true,
    lastPasswordChange: '30 days ago'
  });

  // Admin state
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);


  // Futuristic home screen state
  const [scanButtonScale] = useState(new Animated.Value(1));
  const [glowOpacity] = useState(new Animated.Value(0.5));


  // Swipe navigation using PanResponder
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 30;
    },
    onPanResponderGrant: () => {
      return true;
    },
    onPanResponderMove: (evt, gestureState) => {
      // Optional: Add visual feedback during swipe
    },
    onPanResponderRelease: (evt, gestureState) => {
      const swipeThreshold = 60;
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
      
      if (currentIndex !== -1) {
        if (gestureState.dx > swipeThreshold && currentIndex > 0) {
          setActiveTab(tabs[currentIndex - 1]?.id || activeTab);
        } else if (gestureState.dx < -swipeThreshold && currentIndex < tabs.length - 1) {
          setActiveTab(tabs[currentIndex + 1]?.id || activeTab);
        }
      }
    },
  });


  // Render futuristic home screen
  // Glow animation effect for home screen
  useEffect(() => {
    if (activeTab === 'home') {
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 1,
            duration: 2000,
            easing: Easing.bezier(0.4, 0, 0.6, 1),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.5,
            duration: 2000,
            easing: Easing.bezier(0.4, 0, 0.6, 1),
            useNativeDriver: true,
          }),
        ])
      );
      glowAnimation.start();
      return () => glowAnimation.stop();
    }
  }, [activeTab, glowOpacity]);

  const renderFuturisticHome = () => {
    const handleScanPress = () => {
      Animated.sequence([
        Animated.timing(scanButtonScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scanButtonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      
      setActiveTab('scanner');
    };

    const quickScanOptions = [
      { id: 1, title: 'URL', icon: '🌐', color: '#00d4ff', description: 'Scan websites' },
      { id: 2, title: 'File', icon: '📄', color: '#00ff88', description: 'Check documents' },
      { id: 3, title: 'Image', icon: '🖼️', color: '#ff6b6b', description: 'Analyze images' },
      { id: 4, title: 'Email', icon: '📧', color: '#ffd93d', description: 'Verify emails' },
      { id: 5, title: 'QR Code', icon: '📱', color: '#a855f7', description: 'Scan QR codes' },
    ];

    const recentScans = [
      { id: 1, name: 'document.pdf', status: 'safe', time: '2 min ago', threat: 'Clean' },
      { id: 2, name: 'suspicious-link.com', status: 'warning', time: '15 min ago', threat: 'Phishing' },
      { id: 3, name: 'image.jpg', status: 'safe', time: '1 hour ago', threat: 'Clean' },
      { id: 4, name: 'malware.exe', status: 'danger', time: '2 hours ago', threat: 'Trojan' },
    ];

    return (
      <View style={styles.futuristicHome}>
        {/* Gradient Background */}
        <View style={styles.gradientBackground} />
        
        {/* Header */}
        <View style={styles.futuristicHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.appLogo}>🛡️</Text>
            <Text style={styles.appName}>SecureGuard</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.homeContent} showsVerticalScrollIndicator={false}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Security Status</Text>
            <Text style={styles.welcomeSubtitle}>Your device is protected</Text>
            <View style={styles.statusIndicator}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>All systems secure</Text>
            </View>
          </View>

          {/* Main Scan Button */}
          <View style={styles.scanButtonContainer}>
            <Animated.View 
              style={[
                styles.glowEffect,
                { 
                  opacity: glowOpacity,
                  transform: [{ scale: scanButtonScale }]
                }
              ]}
            />
            <Animated.View style={[styles.scanButton, { transform: [{ scale: scanButtonScale }] }]}>
              <TouchableOpacity 
                style={styles.scanButtonInner}
                onPress={handleScanPress}
                activeOpacity={0.8}
              >
                <View style={styles.scanIconContainer}>
                  <Text style={styles.scanIcon}>🔍</Text>
                </View>
                <Text style={styles.scanButtonText}>SCAN NOW</Text>
                <Text style={styles.scanButtonSubtext}>Tap to start security scan</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Quick Scan Options */}
          <View style={styles.quickScanSection}>
            <Text style={styles.sectionTitle}>Quick Scan</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.quickScanScroll}
              contentContainerStyle={styles.quickScanContent}
            >
              {quickScanOptions.map((option) => (
                <TouchableOpacity 
                  key={option.id} 
                  style={[styles.quickScanCard, { borderColor: option.color }]}
                  onPress={() => setActiveTab('scanner')}
                >
                  <View style={[styles.quickScanIconContainer, { backgroundColor: option.color + '20' }]}>
                    <Text style={styles.quickScanIcon}>{option.icon}</Text>
                  </View>
                  <Text style={styles.quickScanTitle}>{option.title}</Text>
                  <Text style={styles.quickScanDescription}>{option.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Recent Activity */}
          <View style={styles.recentActivitySection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity onPress={() => setActiveTab('dashboard')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {recentScans.map((scan) => (
              <View key={scan.id} style={styles.activityCard}>
                <View style={styles.activityLeft}>
                  <View style={[
                    styles.activityStatusDot, 
                    { backgroundColor: 
                      scan.status === 'safe' ? '#00ff88' : 
                      scan.status === 'warning' ? '#ffd93d' : '#ff6b6b' 
                    }
                  ]} />
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityName}>{scan.name}</Text>
                    <Text style={styles.activityTime}>{scan.time}</Text>
                  </View>
                </View>
                <View style={styles.activityRight}>
                  <Text style={[
                    styles.activityThreat,
                    { color: 
                      scan.status === 'safe' ? '#00ff88' : 
                      scan.status === 'warning' ? '#ffd93d' : '#ff6b6b' 
                    }
                  ]}>
                    {scan.threat}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  // Handle logout functionality
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthScreen('welcome');
    setActiveTab('home');
  };

  // Render main content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderFuturisticHome();
      case 'dashboard':
        return <DashboardScreen 
          onNavigateToTab={(tab) => {
            if (tab === 'welcome') {
              handleLogout();
            } else {
              setActiveTab(tab);
            }
          }}
          currentUser={currentUser}
        />;
      case 'scanner':
        return <ScannerScreen onNavigateBack={() => setActiveTab('dashboard')} />;
      case 'learning':
        return <LearningScreen />;
      case 'community':
        return <CommunityScreen />;
      case 'profile':
        return <ProfileScreen 
          onNavigateBack={() => setActiveTab('dashboard')} 
          onLogout={handleLogout}
          onAdminAccess={() => setShowAdminLogin(true)}
          currentUser={currentUser}
        />;
      default:
        return (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              {tabs.find(tab => tab.id === activeTab)?.title} Page
            </Text>
            <Text style={styles.placeholderSubtext}>
              Content for this section is under development
            </Text>
          </View>
        );
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <ExpoStatusBar style="light" />
        {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
        
        {isAdminAuthenticated ? (
          <AdminNavigator onLogout={() => setIsAdminAuthenticated(false)} />
        ) : showAdminLogin ? (
          <AdminLoginScreen 
            onLoginSuccess={() => {
              setIsAdminAuthenticated(true);
              setShowAdminLogin(false);
            }}
            onBack={() => setShowAdminLogin(false)}
          />
        ) : isAuthenticated ? (
          <>
            <View style={styles.content} {...panResponder.panHandlers}>
              {renderContent()}
            </View>
            
            {/* Enhanced Glassmorphism Navigation */}
            <GlassmorphismNavigation 
              tabs={tabs}
              activeTab={activeTab}
              onTabPress={setActiveTab}
            />
          </>
        ) : (
          <>
            {authScreen === 'welcome' && (
              <WelcomeScreen 
                onGetStarted={() => setAuthScreen('login')}
                onSignUp={() => setAuthScreen('signup')}
              />
            )}
            {authScreen === 'login' && (
              <LoginScreen 
                onLogin={(userData) => {
                  setCurrentUser(userData);
                  setIsAuthenticated(true);
                  setActiveTab('dashboard');
                }}
                onBackToWelcome={() => setAuthScreen('welcome')}
                onGoToSignup={() => setAuthScreen('signup')}
              />
            )}
            {authScreen === 'signup' && (
              <SignupScreen 
                onSignup={(userData) => {
                  // Add new user to admin store for real-time tracking
                  addUser({
                    name: userData.name,
                    email: userData.email,
                    role: 'general_user',
                    isActive: true,
                    lastLogin: new Date().toISOString(),
                    scanCount: 0,
                    threatsReported: 0
                  });
                  
                  setCurrentUser(userData);
                  setIsAuthenticated(true);
                  setActiveTab('dashboard');
                }}
                onBackToWelcome={() => setAuthScreen('welcome')}
                onGoToLogin={() => setAuthScreen('login')}
              />
            )}
          </>
        )}
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e1a',
  },
  content: {
    flex: 1,
  },
  
  // Learning Page Styles
  learningContainer: {
    flex: 1,
    backgroundColor: '#0a0e1a',
  },
  learningHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  learningTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: '#00d4ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#00d4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 18,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderWidth: 1,
    borderColor: '#00ff88',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 18,
  },
  
  // Featured Banner
  featuredBanner: {
    marginHorizontal: 20,
    marginBottom: 25,
    padding: 25,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  bannerContent: {
    alignItems: 'center',
  },
  bannerIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#a0a0a0',
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Category Section
  categorySection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  categoryScroll: {
    paddingLeft: 20,
  },
  categoryTab: {
    marginRight: 15,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#444',
  },
  selectedCategoryTab: {
    backgroundColor: '#00d4ff20',
    borderColor: '#00d4ff',
  },
  categoryContent: {
    alignItems: 'center',
  },
  selectedCategoryName: {
    color: '#00d4ff',
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  
  // Learning Cards
  cardsSection: {
    marginBottom: 25,
  },
  learningCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  cardThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  thumbnailIcon: {
    fontSize: 28,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#a0a0a0',
    lineHeight: 20,
    marginBottom: 10,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  difficultyBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  beginnerBadge: {
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    color: '#00ff88',
  },
  intermediateBadge: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    color: '#ffc107',
  },
  advancedBadge: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    color: '#ff6b6b',
  },
  duration: {
    fontSize: 12,
    color: '#a0a0a0',
  },
  
  // Progress Section
  progressSection: {
    marginBottom: 15,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#a0a0a0',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00d4ff',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00d4ff',
    borderRadius: 3,
  },
  
  // Card Button
  cardButton: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#00d4ff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cardButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00d4ff',
  },
  
  // Tips Section
  tipsSection: {
    marginBottom: 25,
  },
  tipsScroll: {
    paddingLeft: 20,
  },
  tipCard: {
    width: 280,
    padding: 20,
    marginRight: 15,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderLeftWidth: 4,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tipIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
  },
  tipCategory: {
    fontSize: 12,
    color: '#00d4ff',
    fontWeight: '600',
    marginTop: 8,
  },
  learnMoreButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00d4ff',
  },
  
  // Enhanced learning card styles
  cardContent: {
    flex: 1,
  },
  cardIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  bookmarkButton: {
    padding: 8,
  },
  bookmarkIcon: {
    fontSize: 20,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  cardDuration: {
    fontSize: 12,
    color: '#888',
  },
  cardLessons: {
    fontSize: 12,
    color: '#888',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#00d4ff20',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#00d4ff',
    fontWeight: '600',
  },
  
  // Placeholder styles
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#a0a0a0',
    textAlign: 'center',
  },
  
  // Navigation styles
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navIconContainerActive: {
    backgroundColor: '#00d4ff20',
  },
  navIcon: {
    fontSize: 20,
    color: '#888',
  },
  navIconActive: {
    color: '#00d4ff',
  },
  navTitle: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  navTitleActive: {
    color: '#00d4ff',
    fontWeight: '600',
  },
  navIndicator: {
    position: 'absolute',
    top: 0,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00d4ff',
  },
  
  // Auth styles
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0a0a0a',
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 20,
    textAlign: 'center',
  },

  // Futuristic Home Screen Styles
  futuristicHome: {
    flex: 1,
    backgroundColor: '#000814',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000814',
  },
  futuristicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 8, 20, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 212, 255, 0.2)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appLogo: {
    fontSize: 28,
    marginRight: 12,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  notificationIcon: {
    fontSize: 20,
    color: '#00d4ff',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  homeContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#a0a9c0',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00ff88',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#00ff88',
    fontWeight: '600',
  },
  scanButtonContainer: {
    alignItems: 'center',
    marginVertical: 40,
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#00d4ff',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  },
  scanButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    borderWidth: 2,
    borderColor: '#00d4ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  scanButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
  },
  scanIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  scanIcon: {
    fontSize: 32,
    color: '#00d4ff',
  },
  scanButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 2,
    marginBottom: 4,
  },
  scanButtonSubtext: {
    fontSize: 12,
    color: '#a0a9c0',
    textAlign: 'center',
  },
  quickScanSection: {
    marginBottom: 30,
  },
  quickScanScroll: {
    marginHorizontal: -20,
  },
  quickScanContent: {
    paddingHorizontal: 20,
  },
  quickScanCard: {
    width: 120,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  quickScanIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickScanIcon: {
    fontSize: 24,
  },
  quickScanTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickScanDescription: {
    fontSize: 11,
    color: '#a0a9c0',
    textAlign: 'center',
    lineHeight: 14,
  },
  recentActivitySection: {
    marginBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#00d4ff',
    fontWeight: '600',
  },
  activityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#a0a9c0',
  },
  activityRight: {
    alignItems: 'flex-end',
  },
  activityThreat: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

});

export default App;
