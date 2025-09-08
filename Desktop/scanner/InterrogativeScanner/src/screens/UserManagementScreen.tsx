/**
 * User Management Screen - Admin interface for managing app users
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Searchbar,
  useTheme,
  Surface,
  Avatar,
  Chip,
  IconButton,
  FAB,
  TextInput,
  RadioButton
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useAdminStore, { AppUser } from '../stores/adminStore';

const UserManagementScreen: React.FC = () => {
  const theme = useTheme();
  const {
    appUsers,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'general_user' | 'security_analyst'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);

  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'general_user' as 'general_user' | 'security_analyst',
    isActive: true
  });

  const filteredUsers = appUsers.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && user.isActive) ||
      (filterStatus === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    if (!newUserForm.name.trim() || !newUserForm.email.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const userData = {
      ...newUserForm,
      lastLogin: new Date().toISOString(),
      scanCount: 0,
      threatsReported: 0
    };

    addUser(userData);
    setNewUserForm({
      name: '',
      email: '',
      role: 'general_user',
      isActive: true
    });
    setShowAddModal(false);
    Alert.alert('Success', 'User added successfully');
  };

  const handleEditUser = (user: AppUser) => {
    setEditingUser(user);
    setNewUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    setShowAddModal(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    updateUser(editingUser.id, {
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      isActive: newUserForm.isActive
    });

    setEditingUser(null);
    setNewUserForm({
      name: '',
      email: '',
      role: 'general_user',
      isActive: true
    });
    setShowAddModal(false);
    Alert.alert('Success', 'User updated successfully');
  };

  const handleDeleteUser = (user: AppUser) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          deleteUser(user.id);
          Alert.alert('Success', 'User deleted successfully');
        }}
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderUserCard = ({ item }: { item: AppUser }) => (
    <Card style={styles.userCard}>
      <Card.Content>
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <Avatar.Text 
              size={48} 
              label={item.name.split(' ').map(n => n[0]).join('')} 
              style={[
                styles.userAvatar,
                { backgroundColor: item.isActive ? '#4caf50' : '#9e9e9e' }
              ]}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              <View style={styles.userMeta}>
                <Chip 
                  mode="outlined" 
                  style={styles.roleChip}
                  textStyle={styles.roleChipText}
                  compact
                >
                  {item.role.replace('_', ' ')}
                </Chip>
                <Chip 
                  mode="outlined" 
                  style={[
                    styles.statusChip,
                    { borderColor: item.isActive ? '#4caf50' : '#f44336' }
                  ]}
                  textStyle={[
                    styles.statusChipText,
                    { color: item.isActive ? '#4caf50' : '#f44336' }
                  ]}
                  compact
                >
                  {item.isActive ? 'Active' : 'Inactive'}
                </Chip>
              </View>
            </View>
          </View>
          
          <View style={styles.userActions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => handleEditUser(item)}
              style={styles.actionButton}
            />
            <IconButton
              icon={item.isActive ? "account-off" : "account-check"}
              size={20}
              onPress={() => {
                toggleUserStatus(item.id);
                Alert.alert('Success', `User ${item.isActive ? 'deactivated' : 'activated'}`);
              }}
              style={styles.actionButton}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDeleteUser(item)}
              style={[styles.actionButton, styles.deleteButton]}
            />
          </View>
        </View>

        <View style={styles.userStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{item.scanCount}</Text>
            <Text style={styles.statLabel}>Scans</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{item.threatsReported}</Text>
            <Text style={styles.statLabel}>Reports</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>Registered</Text>
            <Text style={styles.statLabel}>{formatDate(item.registeredAt)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>Last Login</Text>
            <Text style={styles.statLabel}>{formatLastLogin(item.lastLogin)}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderAddUserModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        setShowAddModal(false);
        setEditingUser(null);
      }}
    >
      <View style={styles.modalContainer}>
        <Surface style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {editingUser ? 'Edit User' : 'Add New User'}
          </Text>
          <IconButton
            icon="close"
            onPress={() => {
              setShowAddModal(false);
              setEditingUser(null);
            }}
          />
        </Surface>

        <View style={styles.modalContent}>
          <TextInput
            label="Full Name *"
            value={newUserForm.name}
            onChangeText={(text) => setNewUserForm(prev => ({ ...prev, name: text }))}
            mode="outlined"
            style={styles.modalInput}
          />

          <TextInput
            label="Email Address *"
            value={newUserForm.email}
            onChangeText={(text) => setNewUserForm(prev => ({ ...prev, email: text }))}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.modalInput}
          />

          <Text style={styles.fieldLabel}>User Role</Text>
          <RadioButton.Group
            onValueChange={(value) => setNewUserForm(prev => ({ ...prev, role: value as any }))}
            value={newUserForm.role}
          >
            <View style={styles.radioOption}>
              <RadioButton value="general_user" />
              <View style={styles.radioInfo}>
                <Text style={styles.radioLabel}>General User</Text>
                <Text style={styles.radioDescription}>Standard app user with basic scanning features</Text>
              </View>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="security_analyst" />
              <View style={styles.radioInfo}>
                <Text style={styles.radioLabel}>Security Analyst</Text>
                <Text style={styles.radioDescription}>Advanced user with enhanced threat analysis tools</Text>
              </View>
            </View>
          </RadioButton.Group>

          <View style={styles.modalActions}>
            <Button
              mode="contained"
              onPress={editingUser ? handleUpdateUser : handleAddUser}
              style={styles.saveButton}
              icon={editingUser ? "content-save" : "account-plus"}
            >
              {editingUser ? 'Update User' : 'Add User'}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Surface style={styles.header}>
        <Text style={styles.headerTitle}>User Management</Text>
        <Text style={styles.headerSubtitle}>
          {filteredUsers.length} of {appUsers.length} users
        </Text>
      </Surface>

      {/* Search and Filters */}
      <View style={styles.filtersContainer}>
        <Searchbar
          placeholder="Search users..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterButton, filterRole !== 'all' && styles.activeFilter]}
            onPress={() => {
              Alert.alert('Filter by Role', 'Choose user role', [
                { text: 'All Users', onPress: () => setFilterRole('all') },
                { text: 'General Users', onPress: () => setFilterRole('general_user') },
                { text: 'Security Analysts', onPress: () => setFilterRole('security_analyst') }
              ]);
            }}
          >
            <MaterialCommunityIcons name="account-group" size={16} color={theme.colors.primary} />
            <Text style={styles.filterText}>Role: {filterRole.replace('_', ' ')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filterStatus !== 'all' && styles.activeFilter]}
            onPress={() => {
              Alert.alert('Filter by Status', 'Choose user status', [
                { text: 'All Users', onPress: () => setFilterStatus('all') },
                { text: 'Active Only', onPress: () => setFilterStatus('active') },
                { text: 'Inactive Only', onPress: () => setFilterStatus('inactive') }
              ]);
            }}
          >
            <MaterialCommunityIcons name="account-check" size={16} color={theme.colors.primary} />
            <Text style={styles.filterText}>Status: {filterStatus}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUserCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="account-search" size={64} color={theme.colors.outline} />
            <Text style={styles.emptyTitle}>No users found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try adjusting your search' : 'Add your first user to get started'}
            </Text>
          </View>
        }
      />

      {/* Add User FAB */}
      <FAB
        icon="account-plus"
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        label="Add User"
      />

      {/* Add/Edit User Modal */}
      {renderAddUserModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  searchBar: {
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeFilter: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1976d2',
  },
  filterText: {
    marginLeft: 4,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  listContainer: {
    padding: 16,
  },
  userCard: {
    marginBottom: 12,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  userAvatar: {
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  roleChip: {
    height: 24,
  },
  roleChipText: {
    fontSize: 10,
  },
  statusChip: {
    height: 24,
  },
  statusChipText: {
    fontSize: 10,
  },
  userActions: {
    flexDirection: 'row',
  },
  actionButton: {
    margin: 0,
  },
  deleteButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 10,
    opacity: 0.7,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    elevation: 2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 16,
  },
  modalInput: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    marginTop: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioInfo: {
    marginLeft: 8,
    flex: 1,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  radioDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  modalActions: {
    marginTop: 24,
  },
  saveButton: {
    borderRadius: 8,
  },
});

export default UserManagementScreen;
