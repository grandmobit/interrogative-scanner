/**
 * Report Threat Screen - Form for submitting new threat reports
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Chip,
  useTheme,
  Surface,
  RadioButton,
  Switch,
  HelperText
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useCommunityStore from '../stores/communityStore';

interface ReportThreatScreenProps {
  onClose: () => void;
}

const ReportThreatScreen: React.FC<ReportThreatScreenProps> = ({ onClose }) => {
  const theme = useTheme();
  const { addThreatReport } = useCommunityStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    threatType: 'Malware' as const,
    severity: 'Medium' as const,
    url: '',
    fileName: '',
    location: '',
    additionalInfo: '',
    isAnonymous: false
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const threatTypes = [
    { value: 'Malware', label: 'Malware', icon: 'bug' },
    { value: 'Phishing', label: 'Phishing', icon: 'fish' },
    { value: 'Scam', label: 'Scam', icon: 'alert-decagram' },
    { value: 'Suspicious URL', label: 'Suspicious URL', icon: 'link-variant' },
    { value: 'Fake App', label: 'Fake App', icon: 'application-outline' },
    { value: 'Data Breach', label: 'Data Breach', icon: 'database-alert' },
    { value: 'Other', label: 'Other', icon: 'shield-alert' }
  ];

  const severityLevels = [
    { value: 'Low', label: 'Low', color: '#4caf50', description: 'Minor threat, low impact' },
    { value: 'Medium', label: 'Medium', color: '#ff9800', description: 'Moderate threat, some impact' },
    { value: 'High', label: 'High', color: '#ff5722', description: 'Serious threat, significant impact' },
    { value: 'Critical', label: 'Critical', color: '#ff1744', description: 'Severe threat, major impact' }
  ];

  const suggestedTags = [
    'phishing', 'malware', 'scam', 'fake app', 'suspicious url', 'data breach',
    'banking', 'cryptocurrency', 'social media', 'email', 'mobile', 'browser',
    'credentials', 'password', 'financial', 'identity theft', 'ransomware'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (formData.url && !isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before submitting');
      return;
    }

    const reportData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      threatType: formData.threatType,
      severity: formData.severity,
      url: formData.url.trim() || undefined,
      fileName: formData.fileName.trim() || undefined,
      location: formData.location.trim() || undefined,
      reportedBy: formData.isAnonymous ? 'Anonymous User' : 'Current User', // In real app, use actual user
      tags: selectedTags,
      evidence: formData.additionalInfo.trim() ? {
        additionalInfo: formData.additionalInfo.trim()
      } : undefined
    };

    addThreatReport(reportData);

    Alert.alert(
      'Report Submitted',
      'Thank you for reporting this threat! Our community will review it shortly.',
      [{ text: 'OK', onPress: onClose }]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Surface style={styles.header}>
          <Text style={styles.headerTitle}>Report a Threat</Text>
          <Text style={styles.headerSubtitle}>
            Help protect the community by sharing threat information
          </Text>
        </Surface>

        {/* Basic Information */}
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <TextInput
              label="Threat Title *"
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              mode="outlined"
              style={styles.input}
              error={!!errors.title}
              placeholder="e.g., Fake banking app stealing credentials"
            />
            <HelperText type="error" visible={!!errors.title}>
              {errors.title}
            </HelperText>

            <TextInput
              label="Description *"
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
              error={!!errors.description}
              placeholder="Provide detailed information about the threat, how it works, and what users should watch out for..."
            />
            <HelperText type="error" visible={!!errors.description}>
              {errors.description}
            </HelperText>
          </Card.Content>
        </Card>

        {/* Threat Classification */}
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Threat Classification</Text>
            
            <Text style={styles.fieldLabel}>Threat Type *</Text>
            <View style={styles.threatTypeGrid}>
              {threatTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.threatTypeButton,
                    formData.threatType === type.value && styles.selectedThreatType
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, threatType: type.value as any }))}
                >
                  <MaterialCommunityIcons 
                    name={type.icon as any} 
                    size={20} 
                    color={formData.threatType === type.value ? theme.colors.primary : theme.colors.onSurface} 
                  />
                  <Text style={[
                    styles.threatTypeLabel,
                    formData.threatType === type.value && styles.selectedThreatTypeLabel
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Severity Level *</Text>
            <RadioButton.Group 
              onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value as any }))}
              value={formData.severity}
            >
              {severityLevels.map((level) => (
                <View key={level.value} style={styles.severityOption}>
                  <RadioButton value={level.value} />
                  <View style={styles.severityInfo}>
                    <Text style={[styles.severityLabel, { color: level.color }]}>
                      {level.label}
                    </Text>
                    <Text style={styles.severityDescription}>
                      {level.description}
                    </Text>
                  </View>
                </View>
              ))}
            </RadioButton.Group>
          </Card.Content>
        </Card>

        {/* Target Information */}
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Target Information</Text>
            
            <TextInput
              label="Malicious URL"
              value={formData.url}
              onChangeText={(text) => setFormData(prev => ({ ...prev, url: text }))}
              mode="outlined"
              style={styles.input}
              error={!!errors.url}
              placeholder="https://suspicious-website.com"
              keyboardType="url"
            />
            <HelperText type="error" visible={!!errors.url}>
              {errors.url}
            </HelperText>

            <TextInput
              label="File Name"
              value={formData.fileName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, fileName: text }))}
              mode="outlined"
              style={styles.input}
              placeholder="malicious-app.apk"
            />

            <TextInput
              label="Location/Platform"
              value={formData.location}
              onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., Google Play Store, Email, Social Media"
            />
          </Card.Content>
        </Card>

        {/* Tags */}
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Tags</Text>
            <Text style={styles.fieldDescription}>
              Select relevant tags to help categorize this threat
            </Text>
            
            <View style={styles.tagsContainer}>
              {suggestedTags.map((tag) => (
                <Chip
                  key={tag}
                  selected={selectedTags.includes(tag)}
                  onPress={() => handleTagToggle(tag)}
                  style={styles.tagChip}
                  mode={selectedTags.includes(tag) ? 'flat' : 'outlined'}
                >
                  #{tag}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Additional Information */}
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Additional Evidence</Text>
            
            <TextInput
              label="Additional Information"
              value={formData.additionalInfo}
              onChangeText={(text) => setFormData(prev => ({ ...prev, additionalInfo: text }))}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
              placeholder="Any additional technical details, file hashes, IP addresses, or other evidence..."
            />
          </Card.Content>
        </Card>

        {/* Privacy Options */}
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Privacy</Text>
            
            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Text style={styles.switchLabel}>Submit Anonymously</Text>
                <Text style={styles.switchDescription}>
                  Your username will not be shown with this report
                </Text>
              </View>
              <Switch
                value={formData.isAnonymous}
                onValueChange={(value) => setFormData(prev => ({ ...prev, isAnonymous: value }))}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
            icon="send"
          >
            Submit Report
          </Button>
          
          <Button
            mode="outlined"
            onPress={onClose}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
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
  section: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    marginTop: 8,
  },
  fieldDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
  },
  threatTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  threatTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: 'white',
    minWidth: '45%',
  },
  selectedThreatType: {
    borderColor: '#1976d2',
    backgroundColor: '#e3f2fd',
  },
  threatTypeLabel: {
    marginLeft: 8,
    fontSize: 14,
  },
  selectedThreatTypeLabel: {
    color: '#1976d2',
    fontWeight: '600',
  },
  severityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  severityInfo: {
    marginLeft: 8,
    flex: 1,
  },
  severityLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  severityDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    marginBottom: 4,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchInfo: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  switchDescription: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  submitContainer: {
    padding: 16,
    gap: 12,
  },
  submitButton: {
    borderRadius: 8,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  cancelButton: {
    borderRadius: 8,
  },
});

export default ReportThreatScreen;
