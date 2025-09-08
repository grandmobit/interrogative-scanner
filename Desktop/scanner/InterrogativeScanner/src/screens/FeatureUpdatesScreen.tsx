/**
 * Feature Updates Management Screen - Manage app features and updates
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Searchbar,
  useTheme,
  Surface,
  Chip,
  IconButton,
  FAB,
  TextInput,
  Switch,
  RadioButton,
  ProgressBar
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useAdminStore, { FeatureUpdate } from '../stores/adminStore';

const FeatureUpdatesScreen: React.FC = () => {
  const theme = useTheme();
  const {
    featureUpdates,
    addFeatureUpdate,
    updateFeatureUpdate,
    deleteFeatureUpdate,
    deployFeatureUpdate
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<FeatureUpdate | null>(null);
  const [deployingUpdate, setDeployingUpdate] = useState<string | null>(null);

  const [newUpdateForm, setNewUpdateForm] = useState({
    title: '',
    description: '',
    version: '',
    type: 'feature' as 'feature' | 'bugfix' | 'security' | 'performance',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    targetUsers: 'all' as 'all' | 'beta' | 'premium',
    releaseNotes: '',
    isActive: true
  });

  const filteredUpdates = featureUpdates.filter(update =>
    searchQuery === '' ||
    update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    update.version.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUpdate = () => {
    if (!newUpdateForm.title.trim() || !newUpdateForm.version.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    addFeatureUpdate(newUpdateForm);
    resetForm();
    setShowAddModal(false);
    Alert.alert('Success', 'Feature update created successfully');
  };

  const handleEditUpdate = (update: FeatureUpdate) => {
    setEditingUpdate(update);
    setNewUpdateForm({
      title: update.title,
      description: update.description,
      version: update.version,
      type: update.type,
      priority: update.priority,
      targetUsers: update.targetUsers,
      releaseNotes: update.releaseNotes,
      isActive: update.isActive
    });
    setShowAddModal(true);
  };

  const handleUpdateFeature = () => {
    if (!editingUpdate) return;

    updateFeatureUpdate(editingUpdate.id, newUpdateForm);
    resetForm();
    setEditingUpdate(null);
    setShowAddModal(false);
    Alert.alert('Success', 'Feature update modified successfully');
  };

  const handleDeployUpdate = async (update: FeatureUpdate) => {
    Alert.alert(
      'Deploy Feature Update',
      `Deploy "${update.title}" v${update.version} to ${update.targetUsers} users?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Deploy', onPress: async () => {
          setDeployingUpdate(update.id);
          const success = await deployFeatureUpdate(update.id);
          setDeployingUpdate(null);
          
          Alert.alert(
            'Deployment Result',
            success 
              ? `✅ ${update.title} deployed successfully`
              : `❌ Deployment failed. Please try again.`
          );
        }}
      ]
    );
  };

  const handleDeleteUpdate = (update: FeatureUpdate) => {
    Alert.alert(
      'Delete Feature Update',
      `Are you sure you want to delete "${update.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          deleteFeatureUpdate(update.id);
          Alert.alert('Success', 'Feature update deleted');
        }}
      ]
    );
  };

  const resetForm = () => {
    setNewUpdateForm({
      title: '',
      description: '',
      version: '',
      type: 'feature',
      priority: 'medium',
      targetUsers: 'all',
      releaseNotes: '',
      isActive: true
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feature': return '#2196f3';
      case 'bugfix': return '#ff9800';
      case 'security': return '#f44336';
      case 'performance': return '#4caf50';
      default: return theme.colors.primary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature': return 'star';
      case 'bugfix': return 'bug-outline';
      case 'security': return 'shield';
      case 'performance': return 'speedometer';
      default: return 'update';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ff1744';
      case 'high': return '#ff5722';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return theme.colors.primary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return '#4caf50';
      case 'pending': return '#ff9800';
      case 'draft': return '#9e9e9e';
      case 'failed': return '#f44336';
      default: return theme.colors.primary;
    }
  };

  const renderUpdateCard = ({ item }: { item: FeatureUpdate }) => (
    <Card style={styles.updateCard}>
      <Card.Content>
        <View style={styles.updateHeader}>
          <View style={styles.updateInfo}>
            <View style={styles.updateTitleRow}>
              <MaterialCommunityIcons 
                name={getTypeIcon(item.type) as any} 
                size={20} 
                color={getTypeColor(item.type)} 
              />
              <Text style={styles.updateTitle}>{item.title}</Text>
              <Text style={styles.updateVersion}>v{item.version}</Text>
            </View>
            <Text style={styles.updateDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </View>

        <View style={styles.updateChips}>
          <Chip
            mode="outlined"
            style={[styles.typeChip, { borderColor: getTypeColor(item.type) }]}
            textStyle={[styles.chipText, { color: getTypeColor(item.type) }]}
            icon={getTypeIcon(item.type) as any}
            compact
          >
            {item.type.toUpperCase()}
          </Chip>
          
          <Chip
            mode="outlined"
            style={[styles.priorityChip, { borderColor: getPriorityColor(item.priority) }]}
            textStyle={[styles.chipText, { color: getPriorityColor(item.priority) }]}
            compact
          >
            {item.priority.toUpperCase()}
          </Chip>

          <Chip
            mode="outlined"
            style={[styles.statusChip, { borderColor: getStatusColor(item.status) }]}
            textStyle={[styles.chipText, { color: getStatusColor(item.status) }]}
            compact
          >
            {item.status.toUpperCase()}
          </Chip>
        </View>

        <View style={styles.updateMetrics}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Target Users</Text>
            <Text style={styles.metricValue}>{item.targetUsers}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Created</Text>
            <Text style={styles.metricValue}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          {item.deployedAt && (
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Deployed</Text>
              <Text style={styles.metricValue}>
                {new Date(item.deployedAt).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {item.status === 'deploying' && (
          <View style={styles.deployProgress}>
            <Text style={styles.deployText}>Deploying...</Text>
            <ProgressBar indeterminate style={styles.progressBar} />
          </View>
        )}

        <View style={styles.updateActions}>
          {item.status === 'draft' && (
            <Button
              mode="contained"
              onPress={() => handleDeployUpdate(item)}
              style={styles.deployButton}
              icon="rocket-launch"
              compact
              disabled={deployingUpdate === item.id}
            >
              {deployingUpdate === item.id ? 'Deploying...' : 'Deploy'}
            </Button>
          )}
          
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => handleEditUpdate(item)}
            style={styles.actionButton}
          />
          
          <IconButton
            icon="delete"
            size={20}
            onPress={() => handleDeleteUpdate(item)}
            style={[styles.actionButton, styles.deleteButton]}
            disabled={item.status === 'deployed'}
          />
        </View>
      </Card.Content>
    </Card>
  );

  const renderAddUpdateModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        setShowAddModal(false);
        setEditingUpdate(null);
        resetForm();
      }}
    >
      <View style={styles.modalContainer}>
        <Surface style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {editingUpdate ? 'Edit Feature Update' : 'Create New Update'}
          </Text>
          <IconButton
            icon="close"
            onPress={() => {
              setShowAddModal(false);
              setEditingUpdate(null);
              resetForm();
            }}
          />
        </Surface>

        <ScrollView style={styles.modalContent}>
          <TextInput
            label="Update Title *"
            value={newUpdateForm.title}
            onChangeText={(text) => setNewUpdateForm(prev => ({ ...prev, title: text }))}
            mode="outlined"
            style={styles.modalInput}
            placeholder="e.g., Enhanced Malware Detection"
          />

          <TextInput
            label="Version *"
            value={newUpdateForm.version}
            onChangeText={(text) => setNewUpdateForm(prev => ({ ...prev, version: text }))}
            mode="outlined"
            style={styles.modalInput}
            placeholder="e.g., 2.1.0"
          />

          <TextInput
            label="Description *"
            value={newUpdateForm.description}
            onChangeText={(text) => setNewUpdateForm(prev => ({ ...prev, description: text }))}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.modalInput}
            placeholder="Brief description of the update..."
          />

          <Text style={styles.fieldLabel}>Update Type</Text>
          <RadioButton.Group
            onValueChange={(value) => setNewUpdateForm(prev => ({ ...prev, type: value as any }))}
            value={newUpdateForm.type}
          >
            {[
              { value: 'feature', label: 'New Feature', icon: 'star', color: '#2196f3' },
              { value: 'bugfix', label: 'Bug Fix', icon: 'bug-outline', color: '#ff9800' },
              { value: 'security', label: 'Security Update', icon: 'shield', color: '#f44336' },
              { value: 'performance', label: 'Performance', icon: 'speedometer', color: '#4caf50' }
            ].map((type) => (
              <View key={type.value} style={styles.radioOption}>
                <RadioButton value={type.value} />
                <MaterialCommunityIcons name={type.icon as any} size={20} color={type.color} />
                <Text style={styles.radioLabel}>{type.label}</Text>
              </View>
            ))}
          </RadioButton.Group>

          <Text style={styles.fieldLabel}>Priority Level</Text>
          <RadioButton.Group
            onValueChange={(value) => setNewUpdateForm(prev => ({ ...prev, priority: value as any }))}
            value={newUpdateForm.priority}
          >
            {[
              { value: 'low', label: 'Low', color: '#4caf50' },
              { value: 'medium', label: 'Medium', color: '#ff9800' },
              { value: 'high', label: 'High', color: '#ff5722' },
              { value: 'critical', label: 'Critical', color: '#ff1744' }
            ].map((priority) => (
              <View key={priority.value} style={styles.radioOption}>
                <RadioButton value={priority.value} />
                <Text style={[styles.radioLabel, { color: priority.color }]}>
                  {priority.label}
                </Text>
              </View>
            ))}
          </RadioButton.Group>

          <Text style={styles.fieldLabel}>Target Users</Text>
          <RadioButton.Group
            onValueChange={(value) => setNewUpdateForm(prev => ({ ...prev, targetUsers: value as any }))}
            value={newUpdateForm.targetUsers}
          >
            {[
              { value: 'all', label: 'All Users', desc: 'Deploy to everyone' },
              { value: 'beta', label: 'Beta Users', desc: 'Limited beta testing group' },
              { value: 'premium', label: 'Premium Users', desc: 'Premium subscribers only' }
            ].map((target) => (
              <View key={target.value} style={styles.radioOption}>
                <RadioButton value={target.value} />
                <View style={styles.radioInfo}>
                  <Text style={styles.radioLabel}>{target.label}</Text>
                  <Text style={styles.radioDescription}>{target.desc}</Text>
                </View>
              </View>
            ))}
          </RadioButton.Group>

          <TextInput
            label="Release Notes"
            value={newUpdateForm.releaseNotes}
            onChangeText={(text) => setNewUpdateForm(prev => ({ ...prev, releaseNotes: text }))}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.modalInput}
            placeholder="What's new in this update..."
          />

          <View style={styles.modalActions}>
            <Button
              mode="contained"
              onPress={editingUpdate ? handleUpdateFeature : handleAddUpdate}
              style={styles.saveButton}
              icon={editingUpdate ? "content-save" : "plus"}
            >
              {editingUpdate ? 'Update Feature' : 'Create Update'}
            </Button>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Surface style={styles.header}>
        <Text style={styles.headerTitle}>Feature Updates</Text>
        <Text style={styles.headerSubtitle}>
          {filteredUpdates.length} updates managed
        </Text>
      </Surface>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search updates..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Updates List */}
      <FlatList
        data={filteredUpdates}
        renderItem={renderUpdateCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="update" size={64} color={theme.colors.outline} />
            <Text style={styles.emptyTitle}>No feature updates</Text>
            <Text style={styles.emptySubtitle}>
              Create your first feature update to get started
            </Text>
          </View>
        }
      />

      {/* Add Update FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        label="New Update"
      />

      {/* Add/Edit Update Modal */}
      {renderAddUpdateModal()}
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
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  searchBar: {
    elevation: 2,
  },
  listContainer: {
    padding: 16,
  },
  updateCard: {
    marginBottom: 12,
    elevation: 2,
  },
  updateHeader: {
    marginBottom: 12,
  },
  updateInfo: {
    flex: 1,
  },
  updateTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  updateVersion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  updateDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 18,
  },
  updateChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  typeChip: {
    height: 24,
  },
  priorityChip: {
    height: 24,
  },
  statusChip: {
    height: 24,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '600',
  },
  updateMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 12,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 10,
    opacity: 0.7,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  deployProgress: {
    marginBottom: 12,
  },
  deployText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1976d2',
  },
  progressBar: {
    height: 4,
  },
  updateActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deployButton: {
    flex: 1,
    marginRight: 8,
  },
  actionButton: {
    margin: 0,
  },
  deleteButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
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
    marginBottom: 32,
  },
  saveButton: {
    borderRadius: 8,
  },
});

export default FeatureUpdatesScreen;
