/**
 * Admin Navigator - Routes between different admin modules
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Surface, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useAdminStore from '../stores/adminStore';

import AdminDashboard from './AdminDashboard';
import UserManagementScreen from './UserManagementScreen';
import APIManagementScreen from './APIManagementScreen';
import ThreatManagementScreen from './ThreatManagementScreen';
import FeatureUpdatesScreen from './FeatureUpdatesScreen';
import CustomerSupportScreen from './CustomerSupportScreen';

interface AdminNavigatorProps {
  onLogout: () => void;
}

const AdminNavigator: React.FC<AdminNavigatorProps> = ({ onLogout }) => {
  const { activeModule, setActiveModule } = useAdminStore();

  const getModuleTitle = () => {
    switch (activeModule) {
      case 'users': return 'User Management';
      case 'apis': return 'API Management';
      case 'threats': return 'Threat Database';
      case 'features': return 'Feature Updates';
      case 'support': return 'Customer Support';
      default: return 'Admin Dashboard';
    }
  };

  const renderCurrentScreen = () => {
    switch (activeModule) {
      case 'users':
        return <UserManagementScreen />;
      case 'apis':
        return <APIManagementScreen />;
      case 'threats':
        return <ThreatManagementScreen />;
      case 'features':
        return <FeatureUpdatesScreen />;
      case 'support':
        return <CustomerSupportScreen />;
      default:
        return <AdminDashboard onLogout={onLogout} />;
    }
  };

  const showBackButton = activeModule !== null;

  return (
    <View style={styles.container}>
      {/* Navigation Header */}
      {showBackButton && (
        <Surface style={styles.navHeader}>
          <View style={styles.navLeft}>
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => setActiveModule(null)}
              style={styles.backButton}
            />
            <Text style={styles.navTitle}>{getModuleTitle()}</Text>
          </View>
          
          <IconButton
            icon="logout"
            size={24}
            onPress={onLogout}
            style={styles.logoutButton}
          />
        </Surface>
      )}

      {/* Current Screen */}
      <View style={styles.screenContainer}>
        {renderCurrentScreen()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 50,
    paddingBottom: 8,
    elevation: 4,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    margin: 0,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  screenContainer: {
    flex: 1,
  },
});

export default AdminNavigator;
