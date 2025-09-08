/**
 * Professional Dashboard Screen - Modern Cybersecurity Analytics
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing, Platform, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import ProfileAvatar from '../components/ProfileAvatar';
import NotificationBell from '../components/NotificationBell';
import useNotificationStore from '../stores/notificationStore';
import useCommunityStore from '../stores/communityStore';
import useScanStore from '../stores/scanStore';
import ReportThreatModal from '../components/ReportThreatModal';

interface DashboardScreenProps {
  onNavigateToTab?: (tabId: string) => void;
  currentUser?: {
    email: string;
    name: string;
  };
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigateToTab, currentUser }) => {
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [securityScore] = useState(92);
  const [notifications] = useState(2);
  
  // Initialize notification store
  const notificationStore = useNotificationStore();

  useEffect(() => {
    // Initialize demo notifications if none exist
    notificationStore.initializeDemoNotifications();
    // Initialize community data
    initializeCommunityData();
  }, []);

  // Animate on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for security score
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  // Real-time data calculations
  const getCurrentTime = () => new Date().toLocaleTimeString();
  
  const [showReportModal, setShowReportModal] = useState(false);
  
  // Scan store for real-time statistics
  const { scanStats, recentScans, isScanning, scanProgress, scanPhase } = useScanStore();
  
  // Community store
  const { communityStats, getTrendingReports, initializeCommunityData } = useCommunityStore();

  // Get recent activity from scan results
  const recentActivity = recentScans.slice(0, 5).map(scan => ({
    id: scan.id,
    name: scan.fileName || scan.url || 'Unknown',
    status: scan.status,
    time: new Date(scan.timestamp).toLocaleTimeString(),
    threat: scan.threatType || (scan.status === 'threat' ? 'Malware' : undefined)
  }));

  // Enhanced functionality
  const refreshDashboard = () => {
    Alert.alert(
      'Dashboard Refreshed',
      `Updated at ${getCurrentTime()}`,
      [{ text: 'OK' }]
    );
  };

  const exportReport = () => {
    Alert.alert(
      'Export Report',
      'Security report exported successfully!\n\nIncludes:\n• Scan statistics\n• Threat analysis\n• Security recommendations',
      [{ text: 'OK' }]
    );
  };

  const scheduleFullScan = () => {
    Alert.alert(
      'Schedule Scan',
      'When would you like to schedule the full scan?',
      [
        { text: 'Daily', onPress: () => Alert.alert('Scheduled', 'Daily full scan scheduled') },
        { text: 'Weekly', onPress: () => Alert.alert('Scheduled', 'Weekly full scan scheduled') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return '#00ff88';
      case 'warning': return '#ffd93d';
      case 'threat': return '#ff6b6b';
      default: return '#a0a9c0';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return '✅';
      case 'warning': return '⚠️';
      case 'threat': return '🚨';
      default: return '⏳';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return '#ff1744';
      case 'High': return '#ff5722';
      case 'Medium': return '#ff9800';
      case 'Low': return '#4caf50';
      default: return '#1976d2';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  // Navigation functions with proper tab switching
  const navigateToScanner = (scanType?: string) => {
    if (onNavigateToTab) {
      onNavigateToTab('scanner');
    } else {
      Alert.alert(
        'Scanner',
        `Opening ${scanType || 'default'} scanner...`,
        [{ text: 'OK' }]
      );
    }
  };

  const navigateToProfile = () => {
    if (onNavigateToTab) {
      onNavigateToTab('profile');
    } else {
      Alert.alert(
        'Profile',
        'Profile settings and user preferences',
        [{ text: 'OK' }]
      );
    }
  };

  const showNotifications = () => {
    Alert.alert(
      'Notifications',
      `You have ${notifications} new notifications:\n\n• Security scan completed\n• New threat detected`,
      [{ text: 'OK' }]
    );
  };

  const showActivityDetails = (item: any) => {
    Alert.alert(
      'Scan Details',
      `File: ${item.name}\nType: ${item.type}\nStatus: ${item.threat}\nTime: ${item.time}`,
      [{ text: 'OK' }]
    );
  };

  const handleQuickScan = () => {
    Alert.alert(
      'Quick Scan',
      'Starting quick security scan...',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start', onPress: () => {
          // Simulate scan completion with random result
          const scanResult = Math.random() > 0.8 ? 'threat' : 'safe';
          const scanData = {
            id: Date.now(),
            name: `quick-scan-${Date.now()}`,
            type: 'Quick Scan',
            status: scanResult,
            time: 'just now',
            threat: scanResult === 'threat' ? 'Threat Detected' : 'Clean'
          };
          // Statistics will be updated automatically by the scan store
          navigateToScanner('quick');
        }}
      ]
    );
  };

  const handleFullScan = () => {
    Alert.alert(
      'Full Scan',
      'Starting comprehensive security scan...',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start', onPress: () => {
          // Simulate scan completion with random result
          const scanResult = Math.random() > 0.7 ? 'threat' : 'safe';
          const scanData = {
            id: Date.now(),
            name: `full-scan-${Date.now()}`,
            type: 'Full Scan',
            status: scanResult,
            time: 'just now',
            threat: scanResult === 'threat' ? 'Threat Detected' : 'Clean'
          };
          // Statistics will be updated automatically by the scan store
          navigateToScanner('full');
        }}
      ]
    );
  };

  const handleCustomScan = () => {
    Alert.alert(
      'Custom Scan',
      'Configure custom scan parameters...',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Configure', onPress: () => {
          // Simulate scan completion with random result
          const scanResult = Math.random() > 0.85 ? 'threat' : 'safe';
          const scanData = {
            id: Date.now(),
            name: `custom-scan-${Date.now()}`,
            type: 'Custom Scan',
            status: scanResult,
            time: 'just now',
            threat: scanResult === 'threat' ? 'Threat Detected' : 'Clean'
          };
          // Statistics will be updated automatically by the scan store
          navigateToScanner('custom');
        }}
      ]
    );
  };

  const renderSecurityGauge = () => {
    return (
      <View style={styles.gaugeContainer}>
        <Animated.View style={[styles.gaugeCircle, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.gaugeScore}>{securityScore}</Text>
          <Text style={styles.gaugeLabel}>Security Score</Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Floating Profile Avatar */}
      <ProfileAvatar 
        userName={currentUser?.name || 'Security User'}
        userInitials={currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'SU'}
        notificationCount={notifications}
        onProfileAction={(action) => {
          switch(action) {
            case 'profile':
              navigateToProfile();
              break;
            case 'settings':
              Alert.alert('Settings', 'Account settings coming soon!');
              break;
            case 'privacy':
              Alert.alert('Privacy', 'Privacy & Security settings coming soon!');
              break;
            case 'logout':
              if (onNavigateToTab) {
                onNavigateToTab('welcome');
              }
              break;
          }
        }}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.appLogo}>🛡️</Text>
          <Text style={styles.appName}>SecureGuard</Text>
        </View>
        <View style={styles.headerRight}>
          <NotificationBell
            notifications={notificationStore.notifications}
            onNotificationPress={(notification) => {
              console.log('Notification pressed:', notification);
              notificationStore.markAsRead(notification.id);
            }}
            onClearAll={() => {
              notificationStore.clearAllNotifications();
            }}
            onMarkAsRead={(id) => {
              notificationStore.markAsRead(id);
            }}
            onDelete={(id) => {
              notificationStore.deleteNotification(id);
            }}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Overview Card */}
        <Animated.View style={[styles.overviewCard, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>Hello, {currentUser?.name?.split(' ')[0] || 'User'}</Text>
            <Text style={styles.greetingSubtext}>Your security dashboard</Text>
          </View>
          {renderSecurityGauge()}
        </Animated.View>

        {/* Scan Statistics */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Security Overview</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { borderColor: '#00d4ff' }]}>
              <Text style={styles.statIcon}>🔍</Text>
              <Text style={styles.statValue}>{scanStats.totalScans}</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
            <View style={[styles.statCard, { borderColor: '#ff6b6b' }]}>
              <Text style={styles.statIcon}>🚨</Text>
              <Text style={styles.statValue}>{scanStats.threatsDetected}</Text>
              <Text style={styles.statLabel}>Threats Detected</Text>
            </View>
            <View style={[styles.statCard, { borderColor: '#00ff88' }]}>
              <Text style={styles.statIcon}>✅</Text>
              <Text style={styles.statValue}>{scanStats.safeScans}</Text>
              <Text style={styles.statLabel}>Safe Scans</Text>
            </View>
            <View style={[styles.statCard, { borderColor: '#ffd93d' }]}>
              <Text style={styles.statIcon}>⏳</Text>
              <Text style={styles.statValue}>{scanStats.pendingScans}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: 'rgba(0, 212, 255, 0.15)', borderColor: '#00d4ff' }]}
              onPress={handleQuickScan}
            >
              <Text style={styles.actionIcon}>⚡</Text>
              <Text style={styles.actionText}>Quick Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: 'rgba(0, 255, 136, 0.15)', borderColor: '#00ff88' }]}
              onPress={handleFullScan}
            >
              <Text style={styles.actionIcon}>🔍</Text>
              <Text style={styles.actionText}>Full Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: 'rgba(255, 215, 61, 0.15)', borderColor: '#ffd93d' }]}
              onPress={handleCustomScan}
            >
              <Text style={styles.actionIcon}>⚙️</Text>
              <Text style={styles.actionText}>Custom</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivityContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => onNavigateToTab ? onNavigateToTab('scanner') : Alert.alert('View All', 'Navigate to complete scan history')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {recentActivity.length > 0 ? recentActivity.map((item: any) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.activityItem}
              onPress={() => showActivityDetails(item)}
            >
              <View style={styles.activityLeft}>
                <View style={[styles.activityStatusDot, { backgroundColor: getStatusColor(item.status) }]} />
                <View style={styles.activityInfo}>
                  <Text style={styles.activityName}>{item.name}</Text>
                  <Text style={styles.activityType}>{item.type} • {item.time}</Text>
                </View>
              </View>
              <View style={styles.activityRight}>
                <Text style={[styles.activityThreat, { color: getStatusColor(item.status) }]}>
                  {item.threat}
                </Text>
                <Text style={styles.activityIcon}>{getStatusIcon(item.status)}</Text>
              </View>
            </TouchableOpacity>
          )) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateIcon}>🔍</Text>
              <Text style={styles.emptyStateTitle}>No scans performed yet</Text>
              <Text style={styles.emptyStateText}>Start a scan to see your security activity here</Text>
            </View>
          )}
        </View>

        {/* Community Threats Section */}
        <View style={styles.communityContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Community Threats</Text>
            <TouchableOpacity onPress={() => setShowReportModal(true)}>
              <Text style={styles.viewAllText}>Report Threat</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.communityStatsRow}>
            <View style={styles.communityStatItem}>
              <Text style={styles.communityStatNumber}>{communityStats.totalReports.toLocaleString()}</Text>
              <Text style={styles.communityStatLabel}>Total Reports</Text>
            </View>
            <View style={styles.communityStatItem}>
              <Text style={styles.communityStatNumber}>{communityStats.verifiedReports.toLocaleString()}</Text>
              <Text style={styles.communityStatLabel}>Verified</Text>
            </View>
            <View style={styles.communityStatItem}>
              <Text style={styles.communityStatNumber}>{communityStats.threatsBlocked.toLocaleString()}</Text>
              <Text style={styles.communityStatLabel}>Blocked</Text>
            </View>
          </View>

          {getTrendingReports().slice(0, 2).map((report) => (
            <TouchableOpacity key={report.id} style={styles.threatReportCard}>
              <View style={styles.threatReportHeader}>
                <View style={styles.threatReportTitleRow}>
                  <Text style={styles.threatReportIcon}>
                    {report.threatType === 'Malware' ? '🦠' : 
                     report.threatType === 'Phishing' ? '🎣' : 
                     report.threatType === 'Scam' ? '⚠️' : '🛡️'}
                  </Text>
                  <Text style={styles.threatReportTitle} numberOfLines={1}>{report.title}</Text>
                  <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(report.severity) }]}>
                    <Text style={styles.severityText}>{report.severity}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.threatReportDescription} numberOfLines={2}>
                {report.description}
              </Text>
              <View style={styles.threatReportFooter}>
                <Text style={styles.threatReportAuthor}>by {report.reportedBy}</Text>
                <View style={styles.threatReportStats}>
                  <Text style={styles.threatReportVotes}>👍 {report.upvotes}</Text>
                  <Text style={styles.threatReportTime}>{formatTimeAgo(report.reportedAt)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Security Insights */}
        <View style={styles.insightsContainer}>
          <Text style={styles.sectionTitle}>Security Insights</Text>
          <TouchableOpacity style={styles.insightCard} onPress={exportReport}>
            <View style={styles.insightHeader}>
              <Text style={styles.insightIcon}>📊</Text>
              <Text style={styles.insightTitle}>Threat Trends</Text>
            </View>
            <Text style={styles.insightText}>
              Malware detections decreased by 15% this week. Tap to export detailed report.
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.insightCard} onPress={scheduleFullScan}>
            <View style={styles.insightHeader}>
              <Text style={styles.insightIcon}>💡</Text>
              <Text style={styles.insightTitle}>Security Tip</Text>
            </View>
            <Text style={styles.insightText}>
              Schedule regular full scans for comprehensive protection. Tap to configure.
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.insightCard} onPress={refreshDashboard}>
            <View style={styles.insightHeader}>
              <Text style={styles.insightIcon}>🔄</Text>
              <Text style={styles.insightTitle}>Refresh Data</Text>
            </View>
            <Text style={styles.insightText}>
              Update dashboard with latest security metrics and scan results.
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Report Threat Modal */}
      <ReportThreatModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000814',
  },
  header: {
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
  headerRight: {
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
    marginRight: 12,
  },
  notificationIcon: {
    fontSize: 20,
    color: '#00d4ff',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: 60,
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
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#00d4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00d4ff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  overviewCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderRadius: 20,
    padding: 24,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  greetingSubtext: {
    fontSize: 16,
    color: '#a0a9c0',
  },
  gaugeContainer: {
    alignItems: 'center',
  },
  gaugeCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderWidth: 4,
    borderColor: '#00d4ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  gaugeScore: {
    fontSize: 24,
    fontWeight: '900',
    color: '#00d4ff',
  },
  gaugeLabel: {
    fontSize: 10,
    color: '#a0a9c0',
    marginTop: 2,
  },
  statsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#a0a9c0',
    textAlign: 'center',
  },
  quickActionsContainer: {
    marginBottom: 30,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  recentActivityContainer: {
    marginBottom: 30,
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
  activityItem: {
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
  activityType: {
    fontSize: 12,
    color: '#a0a9c0',
  },
  activityRight: {
    alignItems: 'flex-end',
  },
  activityThreat: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  activityIcon: {
    fontSize: 16,
  },
  insightsContainer: {
    marginBottom: 30,
  },
  insightCard: {
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  insightText: {
    fontSize: 14,
    color: '#a0a9c0',
    lineHeight: 20,
    marginBottom: 16,
  },
  insightTip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.2)',
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#00ff88',
    fontWeight: '600',
    flex: 1,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  // Community Styles
  communityContainer: {
    margin: 20,
    marginTop: 10,
  },
  communityStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  communityStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  communityStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00d4ff',
  },
  communityStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  threatReportCard: {
    backgroundColor: 'rgba(0, 8, 20, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
  },
  threatReportHeader: {
    marginBottom: 8,
  },
  threatReportTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  threatReportIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  threatReportTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  severityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  threatReportDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
    marginBottom: 8,
  },
  threatReportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  threatReportAuthor: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  threatReportStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  threatReportVotes: {
    fontSize: 10,
    color: '#4caf50',
  },
  threatReportTime: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});

export default DashboardScreen;
