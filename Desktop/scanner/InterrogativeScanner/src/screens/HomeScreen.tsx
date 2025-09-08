/**
 * Home Screen - Welcome and quick actions
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, FlatList, ImageBackground } from 'react-native';
import { Text, Card, Button, Chip, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../navigation/BottomTabs';
import { useScansStore } from '../store/useScansStore';
import { virusTotalService } from '../services/virusTotal';
import { spacing, borderRadius } from '../theme';
import NotificationBell from '../components/NotificationBell';
import useNotificationStore from '../stores/notificationStore';
import useScanStore from '../stores/scanStore';

type HomeScreenNavigationProp = BottomTabNavigationProp<BottomTabParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { getMetrics } = useScansStore();
  const { recentScans } = useScanStore();
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [notifications] = useState(3); // Mock notification count
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  
  // Initialize notification store
  const notificationStore = useNotificationStore();

  // Initialize demo notifications on component mount
  useEffect(() => {
    notificationStore.initializeDemoNotifications();
  }, []);


  const metrics = getMetrics();

  // Mock notification data
  const notificationData = [
    {
      id: 1,
      title: 'Security Scan Completed',
      message: 'Full system scan completed successfully. No threats detected.',
      time: '2 minutes ago',
      type: 'success',
      icon: '🔒'
    },
    {
      id: 2,
      title: 'Threat Detected & Quarantined',
      message: 'Malicious file "suspicious.exe" has been detected and quarantined.',
      time: '15 minutes ago',
      type: 'warning',
      icon: '⚠️'
    },
    {
      id: 3,
      title: 'Weekly Security Report',
      message: 'Your weekly security report is ready for review.',
      time: '1 hour ago',
      type: 'info',
      icon: '📊'
    },
    {
      id: 4,
      title: 'System Update Recommended',
      message: 'Security definitions update is available for download.',
      time: '3 hours ago',
      type: 'info',
      icon: '🛡️'
    }
  ];

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async (): Promise<void> => {
    try {
      const isOnline = await virusTotalService.checkApiStatus();
      setApiStatus(isOnline ? 'online' : 'offline');
    } catch {
      setApiStatus('offline');
    }
  };

  const navigateToScanner = (): void => {
    navigation.navigate('Scanner');
  };

  const navigateToLearning = (): void => {
    navigation.navigate('Learning');
  };

  const navigateToDashboard = (): void => {
    navigation.navigate('Dashboard');
  };

  const showNotifications = (): void => {
    console.log('Notification button pressed'); // Debug log
    setShowNotificationModal(true);
  };

  const closeNotificationModal = (): void => {
    setShowNotificationModal(false);
  };

  const handleNotificationAction = (notificationId: number, action: string): void => {
    console.log(`Action ${action} on notification ${notificationId}`);
    if (action === 'view') {
      navigation.navigate('Dashboard');
      closeNotificationModal();
    } else if (action === 'dismiss') {
      Alert.alert('Dismissed', 'Notification dismissed');
    }
  };

  const handleScanResultPress = (scan: any) => {
    const statusText = scan.status === 'safe' ? 'CLEAN' : 
                     scan.status === 'threat' ? scan.threatType?.toUpperCase() || 'THREAT' :
                     scan.status === 'warning' ? 'WARNING' : 'UNKNOWN';
    
    Alert.alert(
      `Scan Result: ${scan.fileName || scan.url}`,
      `Status: ${statusText}\nScanned: ${new Date(scan.timestamp).toLocaleString()}\nDuration: ${scan.duration || 'N/A'}ms\n\n${scan.details || 'No additional details available.'}`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'View Dashboard', onPress: () => navigation.navigate('Dashboard') },
        { text: 'Rescan', onPress: () => navigation.navigate('Scanner') }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return '#4caf50';
      case 'threat': return '#f44336';
      case 'warning': return '#ff9800';
      default: return theme.colors.outline;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return 'check-circle';
      case 'threat': return 'alert-circle';
      case 'warning': return 'alert';
      default: return 'help-circle';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const scanTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - scanTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'success': return '#00ff88';
      case 'warning': return '#ffd93d';
      case 'info': return '#00d4ff';
      default: return theme.colors.primary;
    }
  };

  const renderNotificationItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.notificationItem}
      onPress={() => handleNotificationAction(item.id, 'view')}
      activeOpacity={0.7}
    >
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationIcon}>{item.icon}</Text>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        <View style={[styles.notificationTypeDot, { backgroundColor: getNotificationTypeColor(item.type) }]} />
      </View>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <View style={styles.notificationActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleNotificationAction(item.id, 'view')}
        >
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.dismissButton]}
          onPress={() => handleNotificationAction(item.id, 'dismiss')}
        >
          <Text style={[styles.actionButtonText, styles.dismissButtonText]}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const getStatusChip = () => {
    switch (apiStatus) {
      case 'checking':
        return (
          <Chip icon="loading" textStyle={{ color: theme.colors.onSurfaceVariant }}>
            Checking API...
          </Chip>
        );
      case 'online':
        return (
          <Chip icon="check-circle" textStyle={{ color: theme.colors.tertiary }}>
            API Online
          </Chip>
        );
      case 'offline':
        return (
          <Chip icon="alert-circle" textStyle={{ color: theme.colors.error }}>
            API Offline
          </Chip>
        );
    }
  };

  return (
    <ImageBackground 
      source={require('../../../images/backgrounds/b 2.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Professional Notification Bell */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.appTitle}>🏠 Home</Text>
        </View>
        <View style={styles.headerRight}>
          <NotificationBell
            notifications={notificationStore.notifications}
            onNotificationPress={(notification) => {
              console.log('Notification pressed:', notification);
              notificationStore.markAsRead(notification.id);
              navigation.navigate('Dashboard');
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

      {/* Quick Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          {notificationStore.unreadCount > 0 ? `${notificationStore.unreadCount} new notifications` : 'All caught up!'}
        </Text>
        <MaterialCommunityIcons 
          name="chevron-right" 
          size={20} 
          color={theme.colors.onSurfaceVariant} 
        />
      </View>

      <View style={styles.content}>
        {/* Welcome Section */}
        <Card style={styles.welcomeCard}>
          <Card.Content style={styles.welcomeContent}>
            <MaterialCommunityIcons
              name="shield-search"
              size={48}
              color={theme.colors.primary}
              style={styles.welcomeIcon}
            />
            <Text variant="headlineMedium" style={styles.welcomeTitle}>
              Welcome to Interrogative Scanner
            </Text>
            <Text variant="bodyLarge" style={styles.welcomeDescription}>
              Your comprehensive mobile security solution for detecting and mitigating 
              cyber threats in documents, URLs, images, and videos.
            </Text>
            <View style={styles.statusContainer}>
              {getStatusChip()}
            </View>
          </Card.Content>
        </Card>

        {/* Features Highlight */}
        <Card style={styles.featuresCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              🛡️ Key Features
            </Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons
                  name="file-document-multiple"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text variant="bodyMedium" style={styles.featureText}>
                  Scan files, documents, images & videos
                </Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons
                  name="web"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text variant="bodyMedium" style={styles.featureText}>
                  Real-time URL threat detection
                </Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons
                  name="chart-line"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text variant="bodyMedium" style={styles.featureText}>
                  Detailed threat analysis & visualization
                </Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons
                  name="school"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text variant="bodyMedium" style={styles.featureText}>
                  Cybersecurity learning resources
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              🚀 Quick Actions
            </Text>
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                icon="shield-search"
                onPress={navigateToScanner}
                style={styles.primaryButton}
                contentStyle={styles.buttonContent}
              >
                Start Scanning
              </Button>
              <View style={styles.secondaryButtons}>
                <Button
                  mode="outlined"
                  icon="view-dashboard"
                  onPress={navigateToDashboard}
                  style={styles.secondaryButton}
                  contentStyle={styles.buttonContent}
                >
                  View Results
                </Button>
                <Button
                  mode="outlined"
                  icon="school"
                  onPress={navigateToLearning}
                  style={styles.secondaryButton}
                  contentStyle={styles.buttonContent}
                >
                  Learn Security
                </Button>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* App Statistics */}
        {metrics.totalScans > 0 && (
          <Card style={styles.statsCard}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                📊 Your Security Stats
              </Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={styles.statValue}>
                    {metrics.totalScans}
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Total Scans
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={[
                    styles.statValue,
                    { color: metrics.threatsFound > 0 ? theme.colors.error : theme.colors.tertiary }
                  ]}>
                    {metrics.threatsFound}
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Threats Found
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={styles.statValue}>
                    {metrics.averageRiskScore}%
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Avg Risk Score
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <Card style={styles.recentScansCard}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                🔍 Recent Scans
              </Text>
              {recentScans.slice(0, 4).map((scan, index) => (
                <TouchableOpacity 
                  key={scan.id} 
                  style={styles.scanResultItem}
                  onPress={() => handleScanResultPress(scan)}
                  activeOpacity={0.7}
                >
                  <View style={styles.scanResultHeader}>
                    <MaterialCommunityIcons 
                      name={getStatusIcon(scan.status)} 
                      size={16} 
                      color={getStatusColor(scan.status)} 
                    />
                    <Text style={styles.scanFileName} numberOfLines={1}>
                      {scan.fileName || scan.url || 'Unknown file'}
                    </Text>
                  </View>
                  <View style={styles.scanResultFooter}>
                    <Text style={styles.scanTime}>
                      {formatTimeAgo(scan.timestamp)}
                    </Text>
                    <Chip 
                      mode="outlined" 
                      style={[styles.statusChip, { borderColor: getStatusColor(scan.status) }]}
                      textStyle={{ color: getStatusColor(scan.status), fontSize: 10, fontWeight: '600' }}
                      compact
                    >
                      {scan.status === 'safe' ? 'CLEAN' : 
                       scan.status === 'threat' ? scan.threatType?.toUpperCase() || 'THREAT' :
                       scan.status === 'warning' ? 'WARNING' : 'UNKNOWN'}
                    </Chip>
                  </View>
                </TouchableOpacity>
              ))}
              {recentScans.length > 4 && (
                <TouchableOpacity 
                  style={styles.viewAllButton}
                  onPress={() => navigation.navigate('Dashboard')}
                >
                  <Text style={styles.viewAllText}>View All Scans ({recentScans.length})</Text>
                  <MaterialCommunityIcons name="chevron-right" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
              )}
            </Card.Content>
          </Card>
        )}
      </View>

      {/* Notification Modal */}
      <Modal
        visible={showNotificationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeNotificationModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.notificationModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Security Notifications</Text>
              <TouchableOpacity onPress={closeNotificationModal}>
                <MaterialCommunityIcons name="close" size={24} color={theme.colors.onSurface} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={notificationData}
              renderItem={renderNotificationItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              style={styles.notificationList}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Brightening overlay
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  welcomeCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  welcomeContent: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  welcomeIcon: {
    marginBottom: spacing.md,
  },
  welcomeTitle: {
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  welcomeDescription: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  statusContainer: {
    marginTop: spacing.sm,
  },
  featuresCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.md,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  featuresList: {
    gap: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    flex: 1,
  },
  actionsCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.md,
  },
  actionButtons: {
    gap: spacing.md,
  },
  primaryButton: {
    borderRadius: borderRadius.md,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: borderRadius.md,
  },
  buttonContent: {
    paddingVertical: spacing.xs,
  },
  statsCard: {
    borderRadius: borderRadius.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: '700',
  },
  statLabel: {
    opacity: 0.7,
    marginTop: spacing.xs,
  },
  notificationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: spacing.sm,
  },
  notificationButton: {
    position: 'relative',
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ff4757',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  notificationText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationModal: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    margin: spacing.md,
    maxHeight: '80%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  notificationList: {
    maxHeight: 400,
  },
  notificationItem: {
    backgroundColor: '#f8f9fa',
    margin: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: '#00d4ff',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  notificationIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 12,
    color: '#666666',
  },
  notificationTypeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: spacing.sm,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  notificationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  actionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: '#00d4ff',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  dismissButton: {
    backgroundColor: '#6c757d',
  },
  dismissButtonText: {
    color: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
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
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusText: {
    fontSize: 14,
    color: '#a0a9c0',
    fontWeight: '500',
  },
  recentScansCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.md,
  },
  scanResultItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  scanResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  scanFileName: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
    flex: 1,
    color: '#ffffff',
  },
  scanResultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scanTime: {
    fontSize: 12,
    color: '#a0a9c0',
  },
  statusChip: {
    height: 24,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00d4ff',
    marginRight: spacing.xs,
  },
});

export default HomeScreen;
