/**
 * Admin Dashboard - Main administrator control panel
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import {
  Text,
  Card,
  Button,
  useTheme,
  Surface,
  Avatar,
  Badge,
  IconButton,
  Chip
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useAdminStore from '../stores/adminStore';

const { width: screenWidth } = Dimensions.get('window');

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const theme = useTheme();
  const {
    currentAdmin,
    appUsers,
    apiConfigs,
    threatSignatures,
    featureUpdates,
    supportTickets,
    activeModule,
    setActiveModule,
    initializeAdminData,
    adminLogout
  } = useAdminStore();

  useEffect(() => {
    initializeAdminData();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from the admin panel?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          adminLogout();
          onLogout();
        }}
      ]
    );
  };

  const getModuleStats = () => {
    const activeUsers = appUsers.filter(user => user.isActive).length;
    const inactiveUsers = appUsers.filter(user => !user.isActive).length;
    const activeAPIs = apiConfigs.filter(api => api.status === 'active').length;
    const errorAPIs = apiConfigs.filter(api => api.status === 'error').length;
    const activeThreatSigs = threatSignatures.filter(sig => sig.isActive).length;
    const pendingFeatures = featureUpdates.filter(update => update.status === 'testing' || update.status === 'approved').length;
    const openTickets = supportTickets.filter(ticket => ticket.status === 'open' || ticket.status === 'in_progress').length;
    const urgentTickets = supportTickets.filter(ticket => ticket.priority === 'urgent').length;

    return {
      activeUsers,
      inactiveUsers,
      activeAPIs,
      errorAPIs,
      activeThreatSigs,
      pendingFeatures,
      openTickets,
      urgentTickets
    };
  };

  const stats = getModuleStats();

  const adminModules = [
    {
      id: 'users',
      title: 'User Management',
      icon: 'account-group',
      description: 'Manage app users and security analysts',
      stats: `${stats.activeUsers} active, ${stats.inactiveUsers} inactive`,
      color: '#4caf50',
      bgColor: 'rgba(76, 175, 80, 0.1)'
    },
    {
      id: 'apis',
      title: 'API Management',
      icon: 'api',
      description: 'Configure threat detection APIs',
      stats: `${stats.activeAPIs} active, ${stats.errorAPIs} errors`,
      color: '#2196f3',
      bgColor: 'rgba(33, 150, 243, 0.1)'
    },
    {
      id: 'threats',
      title: 'Threat Database',
      icon: 'database-alert',
      description: 'Manage threat signatures and reports',
      stats: `${stats.activeThreatSigs} signatures active`,
      color: '#ff5722',
      bgColor: 'rgba(255, 87, 34, 0.1)'
    },
    {
      id: 'features',
      title: 'Feature Updates',
      icon: 'update',
      description: 'Deploy app updates and patches',
      stats: `${stats.pendingFeatures} pending deployment`,
      color: '#9c27b0',
      bgColor: 'rgba(156, 39, 176, 0.1)'
    },
    {
      id: 'support',
      title: 'Customer Support',
      icon: 'headset',
      description: '24/7 user support interface',
      stats: `${stats.openTickets} open tickets`,
      color: '#ff9800',
      bgColor: 'rgba(255, 152, 0, 0.1)',
      badge: stats.urgentTickets > 0 ? stats.urgentTickets : undefined
    }
  ];

  const renderModuleCard = (module: typeof adminModules[0]) => (
    <TouchableOpacity
      key={module.id}
      style={[styles.moduleCard, { backgroundColor: module.bgColor }]}
      onPress={() => setActiveModule(module.id as any)}
    >
      <View style={styles.moduleHeader}>
        <View style={[styles.moduleIcon, { backgroundColor: module.color }]}>
          <MaterialCommunityIcons 
            name={module.icon as any} 
            size={24} 
            color="#ffffff" 
          />
        </View>
        {module.badge && (
          <Badge style={[styles.moduleBadge, { backgroundColor: '#ff1744' }]}>
            {module.badge}
          </Badge>
        )}
      </View>
      
      <Text style={styles.moduleTitle}>{module.title}</Text>
      <Text style={styles.moduleDescription}>{module.description}</Text>
      <Text style={[styles.moduleStats, { color: module.color }]}>
        {module.stats}
      </Text>
      
      <View style={styles.moduleFooter}>
        <MaterialCommunityIcons 
          name="chevron-right" 
          size={20} 
          color={module.color} 
        />
      </View>
    </TouchableOpacity>
  );

  const renderSystemHealth = () => (
    <Card style={styles.healthCard}>
      <Card.Content>
        <Text style={styles.healthTitle}>System Health</Text>
        
        <View style={styles.healthGrid}>
          <TouchableOpacity style={styles.healthItem} onPress={() => Alert.alert('Server Status', 'System is running normally with 99.9% uptime')}>
            <MaterialCommunityIcons name="server" size={20} color="#4caf50" />
            <Text style={styles.healthLabel}>Server Status</Text>
            <Text style={[styles.healthValue, { color: '#4caf50' }]}>Online</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.healthItem} onPress={() => Alert.alert('Database', 'Database is healthy with all connections active')}>
            <MaterialCommunityIcons name="database" size={20} color="#4caf50" />
            <Text style={styles.healthLabel}>Database</Text>
            <Text style={[styles.healthValue, { color: '#4caf50' }]}>Healthy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.healthItem} onPress={() => Alert.alert('Security', 'Real-time monitoring active. No threats detected.')}>
            <MaterialCommunityIcons name="shield-check" size={20} color="#ff9800" />
            <Text style={styles.healthLabel}>Security</Text>
            <Text style={[styles.healthValue, { color: '#ff9800' }]}>Monitoring</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.healthItem} onPress={() => Alert.alert('Backup', 'Last backup completed successfully 2 hours ago')}>
            <MaterialCommunityIcons name="backup-restore" size={20} color="#4caf50" />
            <Text style={styles.healthLabel}>Backup</Text>
            <Text style={[styles.healthValue, { color: '#4caf50' }]}>Current</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Surface style={styles.header}>
        <View style={styles.headerLeft}>
          <Avatar.Text 
            size={40} 
            label={currentAdmin?.username.charAt(0).toUpperCase() || 'A'} 
            style={styles.adminAvatar}
          />
          <View style={styles.adminInfo}>
            <Text style={styles.adminName}>
              {currentAdmin?.username || 'Administrator'}
            </Text>
            <Chip 
              mode="outlined" 
              style={styles.roleChip}
              textStyle={styles.roleText}
              compact
            >
              {currentAdmin?.role.replace('_', ' ').toUpperCase()}
            </Chip>
          </View>
        </View>
        
        <IconButton
          icon="logout"
          size={24}
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </Surface>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Administrator Panel</Text>
          <Text style={styles.welcomeSubtitle}>
            Manage your cybersecurity platform
          </Text>
        </View>

        {/* System Health */}
        {renderSystemHealth()}

        {/* Quick Stats */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.statsTitle}>Quick Overview</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{appUsers.length}</Text>
                <Text style={styles.statLabel}>Total Users</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{apiConfigs.length}</Text>
                <Text style={styles.statLabel}>APIs</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{threatSignatures.length}</Text>
                <Text style={styles.statLabel}>Threat Sigs</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{supportTickets.length}</Text>
                <Text style={styles.statLabel}>Support Tickets</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Admin Modules */}
        <View style={styles.modulesContainer}>
          <Text style={styles.modulesTitle}>Administration Modules</Text>
          <View style={styles.modulesGrid}>
            {adminModules.map(renderModuleCard)}
          </View>
        </View>

        {/* Recent Activity */}
        <Card style={styles.activityCard}>
          <Card.Content>
            <Text style={styles.activityTitle}>Recent Admin Activity</Text>
            
            {appUsers.length > 0 && appUsers.map((user, index) => (
              <View key={user.id} style={styles.activityItem}>
                <MaterialCommunityIcons name="account-plus" size={16} color="#4caf50" />
                <Text style={styles.activityText}>User {user.name} registered</Text>
                <Text style={styles.activityTime}>
                  {new Date(user.registeredAt).toLocaleDateString() === new Date().toLocaleDateString() 
                    ? 'Today' 
                    : new Date(user.registeredAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
            
            <View style={styles.activityItem}>
              <MaterialCommunityIcons name="api" size={16} color="#2196f3" />
              <Text style={styles.activityText}>VirusTotal API configured</Text>
              <Text style={styles.activityTime}>30 days ago</Text>
            </View>
          </Card.Content>
        </Card>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminAvatar: {
    backgroundColor: '#1976d2',
  },
  adminInfo: {
    marginLeft: 12,
  },
  adminName: {
    fontSize: 16,
    fontWeight: '600',
  },
  roleChip: {
    marginTop: 4,
    height: 20,
  },
  roleText: {
    fontSize: 10,
  },
  logoutButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  healthCard: {
    margin: 16,
    marginTop: 0,
  },
  healthTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  healthGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  healthItem: {
    alignItems: 'center',
    flex: 1,
  },
  healthLabel: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 2,
  },
  healthValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsCard: {
    margin: 16,
    marginTop: 0,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  modulesContainer: {
    padding: 16,
  },
  modulesTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  modulesGrid: {
    gap: 12,
  },
  moduleCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  moduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  moduleStats: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 12,
  },
  moduleFooter: {
    alignItems: 'flex-end',
  },
  activityCard: {
    margin: 16,
    marginTop: 0,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 12,
  },
  activityTime: {
    fontSize: 12,
    opacity: 0.6,
  },
});

export default AdminDashboard;
