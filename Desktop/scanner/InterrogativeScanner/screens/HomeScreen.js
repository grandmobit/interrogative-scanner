import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { AuthContext } from '../App';

export default function HomeScreen() {
  const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, completed
  const [scanResults, setScanResults] = useState(null);
  const [user, setUser] = useState(null);

  // Get auth functions from context
  const { logout, getCurrentUser } = useContext(AuthContext);

  // Get current user on component mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            const result = await logout();
            if (!result.success) {
              Alert.alert('Error', result.error);
            }
            // Navigation happens automatically via App.js
          },
        },
      ]
    );
  };

  // Mock scan function
  const startScan = () => {
    setScanStatus('scanning');
    setScanResults(null);

    // Simulate scanning process
    setTimeout(() => {
      const mockResults = {
        filesScanned: Math.floor(Math.random() * 1000) + 500,
        threatsFound: Math.floor(Math.random() * 5),
        vulnerabilities: Math.floor(Math.random() * 3),
        scanTime: '2.3 seconds',
        lastScan: new Date().toLocaleString(),
      };
      
      setScanResults(mockResults);
      setScanStatus('completed');
    }, 3000); // 3 second mock scan
  };

  // Reset scan
  const resetScan = () => {
    setScanStatus('idle');
    setScanResults(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e2139" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Interrogative Scanner</Text>
          <Text style={styles.headerSubtitle}>
            Welcome back, {user?.name || 'User'}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeIcon}>
            <Text style={styles.shieldIcon}>🛡️</Text>
          </View>
          <Text style={styles.welcomeTitle}>Welcome to Interrogative Scanner</Text>
          <Text style={styles.welcomeSubtitle}>
            Advanced cybersecurity analysis at your fingertips. 
            Start a scan to analyze your system for potential threats and vulnerabilities.
          </Text>
        </View>

        {/* Scan Interface */}
        <View style={styles.scanSection}>
          <View style={styles.scanHeader}>
            <Text style={styles.sectionTitle}>Security Scan</Text>
            <Text style={styles.sectionSubtitle}>
              Comprehensive system analysis and threat detection
            </Text>
          </View>

          {/* Scan Status Card */}
          <View style={styles.scanCard}>
            <View style={styles.scanStatusContainer}>
              <View style={styles.scanStatusIcon}>
                <Text style={styles.statusEmoji}>
                  {scanStatus === 'idle' && '⚡'}
                  {scanStatus === 'scanning' && '🔍'}
                  {scanStatus === 'completed' && '✅'}
                </Text>
              </View>
              <View style={styles.scanStatusText}>
                <Text style={styles.scanStatusTitle}>
                  {scanStatus === 'idle' && 'Ready to Scan'}
                  {scanStatus === 'scanning' && 'Scanning in Progress...'}
                  {scanStatus === 'completed' && 'Scan Completed'}
                </Text>
                <Text style={styles.scanStatusSubtitle}>
                  {scanStatus === 'idle' && 'Click below to start security analysis'}
                  {scanStatus === 'scanning' && 'Analyzing system for threats'}
                  {scanStatus === 'completed' && 'Analysis complete - view results below'}
                </Text>
              </View>
            </View>

            {/* Scan Button */}
            <TouchableOpacity
              style={[
                styles.scanButton,
                scanStatus === 'scanning' && styles.scanButtonDisabled
              ]}
              onPress={scanStatus === 'completed' ? resetScan : startScan}
              disabled={scanStatus === 'scanning'}
            >
              <Text style={styles.scanButtonText}>
                {scanStatus === 'idle' && 'Start Security Scan'}
                {scanStatus === 'scanning' && 'Scanning...'}
                {scanStatus === 'completed' && 'Start New Scan'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Scan Results */}
          {scanResults && (
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>Scan Results</Text>
              
              <View style={styles.resultsGrid}>
                <View style={styles.resultCard}>
                  <Text style={styles.resultNumber}>{scanResults.filesScanned}</Text>
                  <Text style={styles.resultLabel}>Files Scanned</Text>
                </View>
                
                <View style={styles.resultCard}>
                  <Text style={[styles.resultNumber, { color: '#ff4757' }]}>
                    {scanResults.threatsFound}
                  </Text>
                  <Text style={styles.resultLabel}>Threats Found</Text>
                </View>
                
                <View style={styles.resultCard}>
                  <Text style={[styles.resultNumber, { color: '#ff9500' }]}>
                    {scanResults.vulnerabilities}
                  </Text>
                  <Text style={styles.resultLabel}>Vulnerabilities</Text>
                </View>
                
                <View style={styles.resultCard}>
                  <Text style={[styles.resultNumber, { color: '#00ff88' }]}>
                    {scanResults.scanTime}
                  </Text>
                  <Text style={styles.resultLabel}>Scan Time</Text>
                </View>
              </View>

              <View style={styles.lastScanInfo}>
                <Text style={styles.lastScanText}>
                  Last scan: {scanResults.lastScan}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Feature Cards */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Security Features</Text>
          
          <View style={styles.featureGrid}>
            <TouchableOpacity style={styles.featureCard}>
              <Text style={styles.featureIcon}>🔍</Text>
              <Text style={styles.featureTitle}>Deep Scan</Text>
              <Text style={styles.featureDesc}>
                Comprehensive system analysis
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard}>
              <Text style={styles.featureIcon}>🛡️</Text>
              <Text style={styles.featureTitle}>Real-time Protection</Text>
              <Text style={styles.featureDesc}>
                Continuous threat monitoring
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard}>
              <Text style={styles.featureIcon}>📊</Text>
              <Text style={styles.featureTitle}>Security Reports</Text>
              <Text style={styles.featureDesc}>
                Detailed analysis reports
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard}>
              <Text style={styles.featureIcon}>⚙️</Text>
              <Text style={styles.featureTitle}>Settings</Text>
              <Text style={styles.featureDesc}>
                Customize scan preferences
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* User Info Section */}
        <View style={styles.userSection}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.userCard}>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.userJoined}>
              {user?.loginTime ? 
                `Logged in: ${new Date(user.loginTime).toLocaleDateString()}` :
                `Joined: ${user?.signupTime ? new Date(user.signupTime).toLocaleDateString() : 'Recently'}`
              }
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e2139',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(79, 124, 255, 0.2)',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8892b0',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 71, 87, 0.3)',
  },
  logoutText: {
    color: '#ff4757',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#4f7cff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  shieldIcon: {
    fontSize: 32,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#8892b0',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  scanSection: {
    marginBottom: 30,
  },
  scanHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8892b0',
  },
  scanCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  scanStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  scanStatusIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(79, 124, 255, 0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusEmoji: {
    fontSize: 20,
  },
  scanStatusText: {
    flex: 1,
  },
  scanStatusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  scanStatusSubtitle: {
    fontSize: 14,
    color: '#8892b0',
    lineHeight: 18,
  },
  scanButton: {
    backgroundColor: '#4f7cff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  scanButtonDisabled: {
    opacity: 0.6,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  resultsSection: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  resultNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4f7cff',
    marginBottom: 4,
  },
  resultLabel: {
    fontSize: 12,
    color: '#8892b0',
    textAlign: 'center',
  },
  lastScanInfo: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
  },
  lastScanText: {
    fontSize: 12,
    color: '#00ff88',
    textAlign: 'center',
  },
  featuresSection: {
    marginBottom: 30,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 12,
    color: '#8892b0',
    textAlign: 'center',
    lineHeight: 16,
  },
  userSection: {
    marginBottom: 20,
  },
  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  userJoined: {
    fontSize: 12,
    color: '#8892b0',
  },
});
