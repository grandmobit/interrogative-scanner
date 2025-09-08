/**
 * Modern Professional Profile Screen - Premium Cybersecurity UI
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  Easing, 
  Alert,
  TextInput,
  Switch,
  Image
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import ProfileAvatar from '../components/ProfileAvatar';

interface ProfileScreenProps {
  onNavigateBack?: () => void;
  onLogout?: () => void;
  onAdminAccess?: () => void;
  currentUser?: {
    email: string;
    name: string;
  };
}

interface UserProfile {
  name: string;
  email: string;
  username: string;
  totalScans: number;
  threatsDetected: number;
  lastScanDate: string;
  profileImage?: string;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  notifications: boolean;
  privacyMode: boolean;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigateBack, onLogout, onAdminAccess, currentUser }) => {
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [scaleAnim] = useState(new Animated.Value(0.95));
  const [glowAnim] = useState(new Animated.Value(0.5));

  // Helper function to generate username from email
  const generateUsername = (email: string) => {
    return '@' + email.split('@')[0].replace('.', '');
  };

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Profile state - use currentUser data if available
  const [profile, setProfile] = useState<UserProfile>({
    name: currentUser?.name || 'Security User',
    email: currentUser?.email || 'user@secureapp.com',
    username: generateUsername(currentUser?.email || 'user@secureapp.com'),
    totalScans: 247,
    threatsDetected: 12,
    lastScanDate: '2 hours ago'
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: true,
    notifications: true,
    privacyMode: false
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Partial<UserProfile>>({});

  // Initialize animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.back(1.05)),
        useNativeDriver: true,
      }),
    ]).start();

    // Glow animation for avatar
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 2000,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }),
      ])
    );
    glowAnimation.start();
    return () => glowAnimation.stop();
  }, []);

  const handleEditField = (field: string) => {
    setEditingField(field);
    setTempValues({ ...tempValues, [field]: profile[field as keyof UserProfile] });
  };

  const handleSaveField = (field: string) => {
    setProfile({ ...profile, [field]: tempValues[field as keyof UserProfile] });
    setEditingField(null);
    setTempValues({});
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValues({});
  };

  const handleSecurityToggle = (setting: keyof SecuritySettings) => {
    const newValue = !securitySettings[setting];
    setSecuritySettings({
      ...securitySettings,
      [setting]: newValue
    });
    
    // Show confirmation for important security changes
    if (setting === 'twoFactorAuth') {
      Alert.alert(
        newValue ? '2FA Enabled' : '2FA Disabled',
        newValue 
          ? 'Two-factor authentication has been enabled for enhanced security.' 
          : 'Two-factor authentication has been disabled. Your account may be less secure.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleChangePhoto = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setProfile({ ...profile, profileImage: asset.uri });
        Alert.alert('Success', 'Profile photo updated successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleSaveChanges = () => {
    // Save profile data to persistent storage (AsyncStorage in real app)
    try {
      // In a real app, you would save to AsyncStorage or API
      console.log('Saving profile data:', profile);
      console.log('Saving security settings:', securitySettings);
      Alert.alert('Success', 'Profile changes saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    }
  };

  const handleLogOut = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive', 
          onPress: () => {
            // Clear user data and navigate to welcome screen
            if (onLogout) {
              onLogout();
            } else {
              Alert.alert('Logged Out', 'You have been logged out successfully.');
            }
          }
        }
      ]
    );
  };

  const statsData = [
    { label: 'Total Scans', value: profile.totalScans.toString(), icon: '🛡️' },
    { label: 'Threats Detected', value: profile.threatsDetected.toString(), icon: '⚠️' },
    { label: 'Last Scan', value: profile.lastScanDate, icon: '🕒' },
  ];

  const profileFields = [
    { key: 'name', label: 'Full Name', value: profile.name, icon: 'account' },
    { key: 'email', label: 'Email Address', value: profile.email, icon: 'email' },
    { key: 'username', label: 'Username', value: profile.username, icon: 'at' },
  ];

  const securityOptions = [
    { 
      key: 'twoFactorAuth', 
      label: 'Two-Factor Authentication', 
      description: 'Add an extra layer of security',
      icon: 'shield-check',
      value: securitySettings.twoFactorAuth 
    },
    { 
      key: 'notifications', 
      label: 'Security Notifications', 
      description: 'Get alerts about security events',
      icon: 'bell-ring',
      value: securitySettings.notifications 
    },
    { 
      key: 'privacyMode', 
      label: 'Privacy Mode', 
      description: 'Enhanced privacy protection',
      icon: 'incognito',
      value: securitySettings.privacyMode 
    },
  ];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Floating Profile Avatar */}
      <ProfileAvatar 
        userName={profile.name}
        userInitials={getInitials(profile.name)}
        notificationCount={2}
        onProfileAction={(action) => {
          switch(action) {
            case 'profile':
              Alert.alert('Profile', 'You are already on the profile page!');
              break;
            case 'settings':
              Alert.alert('Settings', 'Account settings coming soon!');
              break;
            case 'privacy':
              Alert.alert('Privacy', 'Privacy & Security settings coming soon!');
              break;
            case 'logout':
              handleLogOut();
              break;
          }
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onNavigateBack || (() => Alert.alert('Back', 'Navigate back'))}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#00ffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => Alert.alert('Settings', 'Profile settings coming soon!')}
        >
          <MaterialCommunityIcons name="cog" size={24} color="#00ffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Animated.View 
          style={[
            styles.profileCard,
            { 
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ] 
            }
          ]}
        >
          <View style={styles.avatarContainer}>
            <Animated.View 
              style={[
                styles.avatarGlow,
                { opacity: glowAnim }
              ]}
            />
            <View style={styles.avatar}>
              {profile.profileImage ? (
                <Image source={{ uri: profile.profileImage }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>
                  {getInitials(profile.name)}
                </Text>
              )}
            </View>
            <TouchableOpacity style={styles.changePhotoButton} onPress={handleChangePhoto}>
              <MaterialCommunityIcons name="camera" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileUsername}>{profile.username}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
        </Animated.View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          {statsData.map((stat, index) => (
            <Animated.View 
              key={stat.label}
              style={[
                styles.statCard,
                { 
                  transform: [{ 
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 30],
                      outputRange: [0, 30 + (index * 10)],
                    })
                  }] 
                }
              ]}
            >
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Profile Details Section */}
        <Animated.View 
          style={[
            styles.sectionCard,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.sectionTitle}>Profile Details</Text>
          {profileFields.map((field) => (
            <View key={field.key} style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <MaterialCommunityIcons 
                  name={field.icon as any} 
                  size={20} 
                  color="#00ffff" 
                  style={styles.fieldIcon} 
                />
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => editingField === field.key ? handleSaveField(field.key) : handleEditField(field.key)}
                >
                  <MaterialCommunityIcons 
                    name={editingField === field.key ? "check" : "pencil"} 
                    size={16} 
                    color="#00ffff" 
                  />
                </TouchableOpacity>
              </View>
              
              {editingField === field.key ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.editInput}
                    value={tempValues[field.key as keyof UserProfile] as string || ''}
                    onChangeText={(text) => setTempValues({ ...tempValues, [field.key]: text })}
                    placeholder={field.value}
                    placeholderTextColor="#a0a9c0"
                    autoFocus
                  />
                  <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                    <MaterialCommunityIcons name="close" size={16} color="#ff6b6b" />
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.fieldValue}>{field.value}</Text>
              )}
            </View>
          ))}
        </Animated.View>

        {/* Security Settings Section */}
        <Animated.View 
          style={[
            styles.sectionCard,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.sectionTitle}>Security Settings</Text>
          {securityOptions.map((option) => (
            <View key={option.key} style={styles.securityOption}>
              <View style={styles.securityOptionLeft}>
                <MaterialCommunityIcons 
                  name={option.icon as any} 
                  size={24} 
                  color="#00ffff" 
                  style={styles.securityIcon} 
                />
                <View style={styles.securityTextContainer}>
                  <Text style={styles.securityLabel}>{option.label}</Text>
                  <Text style={styles.securityDescription}>{option.description}</Text>
                </View>
              </View>
              <Switch
                value={option.value}
                onValueChange={() => handleSecurityToggle(option.key as keyof SecuritySettings)}
                trackColor={{ false: '#2a2a2a', true: '#00ffff33' }}
                thumbColor={option.value ? '#00ffff' : '#666666'}
                ios_backgroundColor="#2a2a2a"
                style={styles.securitySwitch}
              />
            </View>
          ))}
        </Animated.View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
            <MaterialCommunityIcons name="content-save" size={20} color="#ffffff" />
          </TouchableOpacity>
          
          {onAdminAccess && (
            <TouchableOpacity style={styles.adminButton} onPress={onAdminAccess}>
              <MaterialCommunityIcons name="shield-crown" size={18} color="#ffd700" />
              <Text style={styles.adminButtonText}>Admin Panel</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
            <MaterialCommunityIcons name="logout" size={18} color="#ff6b6b" />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#001122',
    borderBottomWidth: 1,
    borderBottomColor: '#00ffff33',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00ffff22',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00ffff66',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00ffff22',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00ffff66',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: 'rgba(0, 17, 34, 0.8)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#00ffff33',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatarGlow: {
    position: 'absolute',
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: '#00ffff',
    top: -2,
    left: -2,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#001122',
    borderWidth: 3,
    borderColor: '#00ffff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00ffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#001122',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  profileUsername: {
    fontSize: 16,
    color: '#00ffff',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: '#a0a9c0',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 17, 34, 0.8)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#00ffff33',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00ffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#a0a9c0',
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: 'rgba(0, 17, 34, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#00ffff33',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldIcon: {
    marginRight: 10,
  },
  fieldLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#a0a9c0',
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00ffff22',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00ffff66',
  },
  fieldValue: {
    fontSize: 16,
    color: '#ffffff',
    paddingLeft: 30,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 30,
  },
  editInput: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    backgroundColor: '#001122',
    borderWidth: 1,
    borderColor: '#00ffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
  },
  cancelButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff6b6b22',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ff6b6b66',
  },
  securityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#00ffff22',
  },
  securityOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  securityIcon: {
    marginRight: 15,
  },
  securityTextContainer: {
    flex: 1,
  },
  securityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  securityDescription: {
    fontSize: 12,
    color: '#a0a9c0',
  },
  securitySwitch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  actionButtonsContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'linear-gradient(135deg, #00ffff, #0099cc)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 15,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#ff6b6b66',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b6b',
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ffd70066',
  },
  adminButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffd700',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ProfileScreen;
