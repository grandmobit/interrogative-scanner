/**
 * API Management Screen - Configure and monitor threat detection APIs
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
  Chip,
  IconButton,
  FAB,
  TextInput,
  Switch,
  ActivityIndicator
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useAdminStore, { APIConfig } from '../stores/adminStore';

const APIManagementScreen: React.FC = () => {
  const theme = useTheme();
  const {
    apiConfigs,
    addAPIConfig,
    updateAPIConfig,
    deleteAPIConfig,
    testAPIConnection,
    isLoading
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAPI, setEditingAPI] = useState<APIConfig | null>(null);
  const [testingAPI, setTestingAPI] = useState<string | null>(null);

  const [newAPIForm, setNewAPIForm] = useState({
    name: '',
    endpoint: '',
    apiKey: '',
    provider: '',
    status: 'active' as 'active' | 'inactive',
    description: ''
  });

  const filteredAPIs = apiConfigs.filter(api =>
    searchQuery === '' ||
    api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    api.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAPI = () => {
    if (!newAPIForm.name.trim() || !newAPIForm.endpoint.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    addAPIConfig(newAPIForm);
    resetForm();
    setShowAddModal(false);
    Alert.alert('Success', 'API configuration added successfully');
  };

  const handleEditAPI = (api: APIConfig) => {
    setEditingAPI(api);
    setNewAPIForm({
      name: api.name,
      endpoint: api.endpoint,
      apiKey: api.apiKey,
      provider: api.provider,
      status: api.status,
      description: api.description
    });
    setShowAddModal(true);
  };

  const handleUpdateAPI = () => {
    if (!editingAPI) return;

    updateAPIConfig(editingAPI.id, newAPIForm);
    resetForm();
    setEditingAPI(null);
    setShowAddModal(false);
    Alert.alert('Success', 'API configuration updated successfully');
  };

  const handleTestAPI = async (api: APIConfig) => {
    setTestingAPI(api.id);
    const success = await testAPIConnection(api.id);
    setTestingAPI(null);
    
    Alert.alert(
      'API Test Result',
      success 
        ? `✅ ${api.name} is responding correctly`
        : `❌ ${api.name} connection failed`,
      [{ text: 'OK' }]
    );
  };

  const handleDeleteAPI = (api: APIConfig) => {
    Alert.alert(
      'Delete API Configuration',
      `Are you sure you want to delete ${api.name}? This will disable threat detection from this provider.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          deleteAPIConfig(api.id);
          Alert.alert('Success', 'API configuration deleted');
        }}
      ]
    );
  };

  const resetForm = () => {
    setNewAPIForm({
      name: '',
      endpoint: '',
      apiKey: '',
      provider: '',
      status: 'active',
      description: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4caf50';
      case 'inactive': return '#9e9e9e';
      case 'error': return '#f44336';
      default: return theme.colors.primary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return 'check-circle';
      case 'inactive': return 'pause-circle';
      case 'error': return 'alert-circle';
      default: return 'help-circle';
    }
  };

  const renderAPICard = ({ item }: { item: APIConfig }) => (
    <Card style={styles.apiCard}>
      <Card.Content>
        <View style={styles.apiHeader}>
          <View style={styles.apiInfo}>
            <Text style={styles.apiName}>{item.name}</Text>
            <Text style={styles.apiProvider}>by {item.provider}</Text>
            <Text style={styles.apiDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          
          <View style={styles.apiStatus}>
            <Chip
              mode="outlined"
              style={[styles.statusChip, { borderColor: getStatusColor(item.status) }]}
              textStyle={[styles.statusText, { color: getStatusColor(item.status) }]}
              icon={getStatusIcon(item.status)}
              compact
            >
              {item.status.toUpperCase()}
            </Chip>
          </View>
        </View>

        <View style={styles.apiDetails}>
          <View style={styles.apiDetailRow}>
            <MaterialCommunityIcons name="web" size={16} color={theme.colors.primary} />
            <Text style={styles.apiDetailText} numberOfLines={1}>
              {item.endpoint}
            </Text>
          </View>
          
          <View style={styles.apiDetailRow}>
            <MaterialCommunityIcons name="key" size={16} color={theme.colors.primary} />
            <Text style={styles.apiDetailText}>
              {item.apiKey.substring(0, 8)}...
            </Text>
          </View>
        </View>

        <View style={styles.apiMetrics}>
          <View style={styles.metricItem}>
            <Text style={styles.metricNumber}>{item.requestCount.toLocaleString()}</Text>
            <Text style={styles.metricLabel}>Requests</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={[styles.metricNumber, { color: item.errorRate > 0.1 ? '#f44336' : '#4caf50' }]}>
              {(item.errorRate * 100).toFixed(1)}%
            </Text>
            <Text style={styles.metricLabel}>Error Rate</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>Updated</Text>
            <Text style={styles.metricLabel}>
              {new Date(item.lastUpdated).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.apiActions}>
          <Button
            mode="outlined"
            onPress={() => handleTestAPI(item)}
            style={styles.testButton}
            icon="test-tube"
            compact
            disabled={testingAPI === item.id}
          >
            {testingAPI === item.id ? 'Testing...' : 'Test'}
          </Button>
          
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => handleEditAPI(item)}
            style={styles.actionButton}
          />
          
          <IconButton
            icon="delete"
            size={20}
            onPress={() => handleDeleteAPI(item)}
            style={[styles.actionButton, styles.deleteButton]}
          />
        </View>
      </Card.Content>
    </Card>
  );

  const renderAddAPIModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        setShowAddModal(false);
        setEditingAPI(null);
        resetForm();
      }}
    >
      <View style={styles.modalContainer}>
        <Surface style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {editingAPI ? 'Edit API Configuration' : 'Add New API'}
          </Text>
          <IconButton
            icon="close"
            onPress={() => {
              setShowAddModal(false);
              setEditingAPI(null);
              resetForm();
            }}
          />
        </Surface>

        <View style={styles.modalContent}>
          <TextInput
            label="API Name *"
            value={newAPIForm.name}
            onChangeText={(text) => setNewAPIForm(prev => ({ ...prev, name: text }))}
            mode="outlined"
            style={styles.modalInput}
            placeholder="e.g., VirusTotal API"
          />

          <TextInput
            label="Provider *"
            value={newAPIForm.provider}
            onChangeText={(text) => setNewAPIForm(prev => ({ ...prev, provider: text }))}
            mode="outlined"
            style={styles.modalInput}
            placeholder="e.g., VirusTotal, URLVoid"
          />

          <TextInput
            label="API Endpoint *"
            value={newAPIForm.endpoint}
            onChangeText={(text) => setNewAPIForm(prev => ({ ...prev, endpoint: text }))}
            mode="outlined"
            style={styles.modalInput}
            placeholder="https://api.example.com/v1/"
            keyboardType="url"
          />

          <TextInput
            label="API Key *"
            value={newAPIForm.apiKey}
            onChangeText={(text) => setNewAPIForm(prev => ({ ...prev, apiKey: text }))}
            mode="outlined"
            style={styles.modalInput}
            placeholder="Enter your API key"
            secureTextEntry
          />

          <TextInput
            label="Description"
            value={newAPIForm.description}
            onChangeText={(text) => setNewAPIForm(prev => ({ ...prev, description: text }))}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.modalInput}
            placeholder="Describe what this API is used for..."
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Active Status</Text>
            <Switch
              value={newAPIForm.status === 'active'}
              onValueChange={(value) => 
                setNewAPIForm(prev => ({ ...prev, status: value ? 'active' : 'inactive' }))
              }
            />
          </View>

          <View style={styles.modalActions}>
            <Button
              mode="contained"
              onPress={editingAPI ? handleUpdateAPI : handleAddAPI}
              style={styles.saveButton}
              icon={editingAPI ? "content-save" : "plus"}
            >
              {editingAPI ? 'Update API' : 'Add API'}
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
        <Text style={styles.headerTitle}>API Management</Text>
        <Text style={styles.headerSubtitle}>
          {filteredAPIs.length} threat detection APIs configured
        </Text>
      </Surface>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search APIs..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* APIs List */}
      <FlatList
        data={filteredAPIs}
        renderItem={renderAPICard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="api" size={64} color={theme.colors.outline} />
            <Text style={styles.emptyTitle}>No APIs configured</Text>
            <Text style={styles.emptySubtitle}>
              Add your first threat detection API to get started
            </Text>
          </View>
        }
      />

      {/* Add API FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        label="Add API"
      />

      {/* Add/Edit API Modal */}
      {renderAddAPIModal()}
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
  apiCard: {
    marginBottom: 12,
    elevation: 2,
  },
  apiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  apiInfo: {
    flex: 1,
  },
  apiName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  apiProvider: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  apiDescription: {
    fontSize: 12,
    opacity: 0.6,
    lineHeight: 16,
  },
  apiStatus: {
    marginLeft: 12,
  },
  statusChip: {
    height: 28,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  apiDetails: {
    marginBottom: 12,
  },
  apiDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  apiDetailText: {
    marginLeft: 8,
    fontSize: 12,
    fontFamily: 'monospace',
    flex: 1,
  },
  apiMetrics: {
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
  metricNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricLabel: {
    fontSize: 10,
    opacity: 0.7,
    marginTop: 2,
  },
  apiActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testButton: {
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalActions: {
    marginTop: 24,
  },
  saveButton: {
    borderRadius: 8,
  },
});

export default APIManagementScreen;
