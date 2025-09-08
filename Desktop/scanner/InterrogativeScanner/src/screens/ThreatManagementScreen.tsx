/**
 * Threat Management Screen - Manage threat signatures and community reports
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
  SegmentedButtons
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useAdminStore, { ThreatSignature } from '../stores/adminStore';
import useCommunityStore from '../stores/communityStore';

const ThreatManagementScreen: React.FC = () => {
  const theme = useTheme();
  const {
    threatSignatures,
    addThreatSignature,
    updateThreatSignature,
    deleteThreatSignature,
    approveCommunityThreat,
    rejectCommunityThreat
  } = useAdminStore();

  const { threatReports } = useCommunityStore();

  const [activeTab, setActiveTab] = useState('signatures');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSignature, setEditingSignature] = useState<ThreatSignature | null>(null);

  const [newSignatureForm, setNewSignatureForm] = useState({
    name: '',
    type: 'malware' as 'malware' | 'phishing' | 'scam' | 'suspicious',
    signature: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    description: '',
    isActive: true
  });

  const pendingReports = threatReports.filter(report => report.status === 'pending');
  const filteredSignatures = threatSignatures.filter(sig =>
    searchQuery === '' ||
    sig.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sig.signature.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSignature = () => {
    if (!newSignatureForm.name.trim() || !newSignatureForm.signature.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const signatureData = {
      ...newSignatureForm,
      createdBy: 'admin'
    };

    addThreatSignature(signatureData);
    resetForm();
    setShowAddModal(false);
    Alert.alert('Success', 'Threat signature added successfully');
  };

  const handleEditSignature = (signature: ThreatSignature) => {
    setEditingSignature(signature);
    setNewSignatureForm({
      name: signature.name,
      type: signature.type,
      signature: signature.signature,
      severity: signature.severity,
      description: signature.description,
      isActive: signature.isActive
    });
    setShowAddModal(true);
  };

  const handleUpdateSignature = () => {
    if (!editingSignature) return;

    updateThreatSignature(editingSignature.id, newSignatureForm);
    resetForm();
    setEditingSignature(null);
    setShowAddModal(false);
    Alert.alert('Success', 'Threat signature updated successfully');
  };

  const handleDeleteSignature = (signature: ThreatSignature) => {
    Alert.alert(
      'Delete Threat Signature',
      `Are you sure you want to delete "${signature.name}"? This will disable detection for this threat.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          deleteThreatSignature(signature.id);
          Alert.alert('Success', 'Threat signature deleted');
        }}
      ]
    );
  };

  const handleApproveCommunityReport = (reportId: string) => {
    Alert.alert(
      'Approve Community Report',
      'This will mark the report as verified and add it to the threat database.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Approve', onPress: () => {
          approveCommunityThreat(reportId);
          Alert.alert('Success', 'Community report approved and verified');
        }}
      ]
    );
  };

  const handleRejectCommunityReport = (reportId: string) => {
    Alert.alert(
      'Reject Community Report',
      'This will mark the report as rejected. Please provide feedback to the user.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reject', style: 'destructive', onPress: () => {
          rejectCommunityThreat(reportId);
          Alert.alert('Success', 'Community report rejected');
        }}
      ]
    );
  };

  const resetForm = () => {
    setNewSignatureForm({
      name: '',
      type: 'malware',
      signature: '',
      severity: 'medium',
      description: '',
      isActive: true
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ff1744';
      case 'high': return '#ff5722';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return theme.colors.primary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'malware': return 'bug';
      case 'phishing': return 'fish';
      case 'scam': return 'alert-decagram';
      case 'suspicious': return 'shield-alert';
      default: return 'help-circle';
    }
  };

  const renderSignatureCard = ({ item }: { item: ThreatSignature }) => (
    <Card style={styles.signatureCard}>
      <Card.Content>
        <View style={styles.signatureHeader}>
          <View style={styles.signatureInfo}>
            <View style={styles.signatureTitleRow}>
              <MaterialCommunityIcons 
                name={getTypeIcon(item.type) as any} 
                size={20} 
                color={getSeverityColor(item.severity)} 
              />
              <Text style={styles.signatureName}>{item.name}</Text>
              <Chip
                mode="outlined"
                style={[styles.severityChip, { borderColor: getSeverityColor(item.severity) }]}
                textStyle={[styles.severityText, { color: getSeverityColor(item.severity) }]}
                compact
              >
                {item.severity.toUpperCase()}
              </Chip>
            </View>
            <Text style={styles.signatureDescription}>{item.description}</Text>
          </View>
        </View>

        <View style={styles.signatureDetails}>
          <Text style={styles.signatureLabel}>Signature:</Text>
          <Text style={styles.signatureValue} numberOfLines={2}>
            {item.signature}
          </Text>
        </View>

        <View style={styles.signatureMetrics}>
          <View style={styles.metricItem}>
            <Text style={styles.metricNumber}>{item.detectionCount}</Text>
            <Text style={styles.metricLabel}>Detections</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>Created</Text>
            <Text style={styles.metricLabel}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>Updated</Text>
            <Text style={styles.metricLabel}>{new Date(item.lastUpdated).toLocaleDateString()}</Text>
          </View>
          <View style={styles.metricItem}>
            <Chip
              mode="outlined"
              style={[styles.statusChip, { borderColor: item.isActive ? '#4caf50' : '#9e9e9e' }]}
              textStyle={[styles.statusText, { color: item.isActive ? '#4caf50' : '#9e9e9e' }]}
              compact
            >
              {item.isActive ? 'ACTIVE' : 'INACTIVE'}
            </Chip>
          </View>
        </View>

        <View style={styles.signatureActions}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => handleEditSignature(item)}
            style={styles.actionButton}
          />
          <IconButton
            icon={item.isActive ? "pause" : "play"}
            size={20}
            onPress={() => {
              updateThreatSignature(item.id, { isActive: !item.isActive });
              Alert.alert('Success', `Signature ${item.isActive ? 'deactivated' : 'activated'}`);
            }}
            style={styles.actionButton}
          />
          <IconButton
            icon="delete"
            size={20}
            onPress={() => handleDeleteSignature(item)}
            style={[styles.actionButton, styles.deleteButton]}
          />
        </View>
      </Card.Content>
    </Card>
  );

  const renderCommunityReportCard = ({ item }: { item: any }) => (
    <Card style={styles.reportCard}>
      <Card.Content>
        <View style={styles.reportHeader}>
          <Text style={styles.reportTitle}>{item.title}</Text>
          <Chip
            mode="outlined"
            style={[styles.severityChip, { borderColor: getSeverityColor(item.severity.toLowerCase()) }]}
            textStyle={[styles.severityText, { color: getSeverityColor(item.severity.toLowerCase()) }]}
            compact
          >
            {item.severity}
          </Chip>
        </View>

        <Text style={styles.reportDescription} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.reportMeta}>
          <Text style={styles.reportAuthor}>Reported by: {item.reportedBy}</Text>
          <Text style={styles.reportTime}>
            {new Date(item.reportedAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.reportActions}>
          <Button
            mode="contained"
            onPress={() => handleApproveCommunityReport(item.id)}
            style={[styles.approveButton, { backgroundColor: '#4caf50' }]}
            icon="check"
            compact
          >
            Approve
          </Button>
          <Button
            mode="outlined"
            onPress={() => handleRejectCommunityReport(item.id)}
            style={styles.rejectButton}
            icon="close"
            compact
          >
            Reject
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderAddSignatureModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        setShowAddModal(false);
        setEditingSignature(null);
        resetForm();
      }}
    >
      <View style={styles.modalContainer}>
        <Surface style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {editingSignature ? 'Edit Threat Signature' : 'Add New Signature'}
          </Text>
          <IconButton
            icon="close"
            onPress={() => {
              setShowAddModal(false);
              setEditingSignature(null);
              resetForm();
            }}
          />
        </Surface>

        <ScrollView style={styles.modalContent}>
          <TextInput
            label="Signature Name *"
            value={newSignatureForm.name}
            onChangeText={(text) => setNewSignatureForm(prev => ({ ...prev, name: text }))}
            mode="outlined"
            style={styles.modalInput}
            placeholder="e.g., Banking Trojan Signature"
          />

          <Text style={styles.fieldLabel}>Threat Type</Text>
          <RadioButton.Group
            onValueChange={(value) => setNewSignatureForm(prev => ({ ...prev, type: value as any }))}
            value={newSignatureForm.type}
          >
            {[
              { value: 'malware', label: 'Malware', icon: 'bug' },
              { value: 'phishing', label: 'Phishing', icon: 'fish' },
              { value: 'scam', label: 'Scam', icon: 'alert-decagram' },
              { value: 'suspicious', label: 'Suspicious', icon: 'shield-alert' }
            ].map((type) => (
              <View key={type.value} style={styles.radioOption}>
                <RadioButton value={type.value} />
                <MaterialCommunityIcons name={type.icon as any} size={20} color={theme.colors.primary} />
                <Text style={styles.radioLabel}>{type.label}</Text>
              </View>
            ))}
          </RadioButton.Group>

          <Text style={styles.fieldLabel}>Severity Level</Text>
          <RadioButton.Group
            onValueChange={(value) => setNewSignatureForm(prev => ({ ...prev, severity: value as any }))}
            value={newSignatureForm.severity}
          >
            {[
              { value: 'low', label: 'Low', color: '#4caf50' },
              { value: 'medium', label: 'Medium', color: '#ff9800' },
              { value: 'high', label: 'High', color: '#ff5722' },
              { value: 'critical', label: 'Critical', color: '#ff1744' }
            ].map((severity) => (
              <View key={severity.value} style={styles.radioOption}>
                <RadioButton value={severity.value} />
                <Text style={[styles.radioLabel, { color: severity.color }]}>
                  {severity.label}
                </Text>
              </View>
            ))}
          </RadioButton.Group>

          <TextInput
            label="Signature Pattern *"
            value={newSignatureForm.signature}
            onChangeText={(text) => setNewSignatureForm(prev => ({ ...prev, signature: text }))}
            mode="outlined"
            style={styles.modalInput}
            placeholder="MD5:hash or REGEX:pattern"
            multiline
          />

          <TextInput
            label="Description *"
            value={newSignatureForm.description}
            onChangeText={(text) => setNewSignatureForm(prev => ({ ...prev, description: text }))}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.modalInput}
            placeholder="Describe what this signature detects..."
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Active Status</Text>
            <Switch
              value={newSignatureForm.isActive}
              onValueChange={(value) => 
                setNewSignatureForm(prev => ({ ...prev, isActive: value }))
              }
            />
          </View>

          <View style={styles.modalActions}>
            <Button
              mode="contained"
              onPress={editingSignature ? handleUpdateSignature : handleAddSignature}
              style={styles.saveButton}
              icon={editingSignature ? "content-save" : "plus"}
            >
              {editingSignature ? 'Update Signature' : 'Add Signature'}
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
        <Text style={styles.headerTitle}>Threat Management</Text>
        <Text style={styles.headerSubtitle}>
          Manage signatures and community reports
        </Text>
      </Surface>

      {/* Tab Navigation */}
      <SegmentedButtons
        value={activeTab}
        onValueChange={setActiveTab}
        buttons={[
          {
            value: 'signatures',
            label: 'Signatures',
            icon: 'shield-check'
          },
          {
            value: 'community',
            label: `Community (${pendingReports.length})`,
            icon: 'account-group'
          }
        ]}
        style={styles.tabButtons}
      />

      {/* Search */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={activeTab === 'signatures' ? "Search signatures..." : "Search reports..."}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Content */}
      {activeTab === 'signatures' ? (
        <FlatList
          data={filteredSignatures}
          renderItem={renderSignatureCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="shield-search" size={64} color={theme.colors.outline} />
              <Text style={styles.emptyTitle}>No threat signatures</Text>
              <Text style={styles.emptySubtitle}>
                Add your first threat signature to start detection
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={pendingReports}
          renderItem={renderCommunityReportCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="check-all" size={64} color={theme.colors.outline} />
              <Text style={styles.emptyTitle}>No pending reports</Text>
              <Text style={styles.emptySubtitle}>
                All community reports have been reviewed
              </Text>
            </View>
          }
        />
      )}

      {/* Add Signature FAB */}
      {activeTab === 'signatures' && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setShowAddModal(true)}
          label="Add Signature"
        />
      )}

      {/* Add/Edit Signature Modal */}
      {renderAddSignatureModal()}
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
  tabButtons: {
    margin: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  searchBar: {
    elevation: 2,
  },
  listContainer: {
    padding: 16,
  },
  signatureCard: {
    marginBottom: 12,
    elevation: 2,
  },
  signatureHeader: {
    marginBottom: 12,
  },
  signatureInfo: {
    flex: 1,
  },
  signatureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  signatureName: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  signatureDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 18,
  },
  signatureDetails: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  signatureLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  signatureValue: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#1976d2',
  },
  signatureMetrics: {
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
  severityChip: {
    height: 24,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  statusChip: {
    height: 20,
  },
  statusText: {
    fontSize: 9,
  },
  signatureActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    margin: 0,
  },
  deleteButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  reportCard: {
    marginBottom: 12,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  reportDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 18,
    marginBottom: 12,
  },
  reportMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reportAuthor: {
    fontSize: 12,
    opacity: 0.6,
  },
  reportTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  reportActions: {
    flexDirection: 'row',
    gap: 8,
  },
  approveButton: {
    flex: 1,
  },
  rejectButton: {
    flex: 1,
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
  radioLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
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

export default ThreatManagementScreen;
