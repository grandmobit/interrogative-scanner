import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    nativeLanguage: user?.nativeLanguage || '',
    learningGoal: user?.learningGoal || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || null,
  });
  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, [user]);

  const loadProfileData = async () => {
    try {
      const savedProfile = await SecureStore.getItemAsync('userProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setProfileData(prev => ({ ...prev, ...profile }));
      }
    } catch (error) {
      console.log('Error loading profile:', error);
    }
  };

  const saveProfileData = async () => {
    try {
      await SecureStore.setItemAsync('userProfile', JSON.stringify(profileData));
      if (updateUserProfile) {
        await updateUserProfile(profileData);
      }
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.log('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile changes');
    }
  };

  const pickImage = async (source) => {
    try {
      let result;
      
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Camera permission is required to take photos');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Gallery permission is required to select photos');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled) {
        setProfileData(prev => ({
          ...prev,
          profileImage: result.assets[0].uri
        }));
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
    setShowImagePicker(false);
  };

  const renderProfileImage = () => {
    return (
      <View style={styles.imageContainer}>
        <TouchableOpacity
          onPress={() => isEditing && setShowImagePicker(true)}
          style={styles.imageWrapper}
        >
          {profileData.profileImage ? (
            <Image source={{ uri: profileData.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="person" size={60} color="#666" />
            </View>
          )}
          {isEditing && (
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={20} color="white" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderField = (label, key, placeholder, multiline = false) => {
    if (key === 'email' && user?.isGuest) {
      return null; // Don't show email field for guest users
    }

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {isEditing ? (
          <TextInput
            style={[styles.fieldInput, multiline && styles.multilineInput]}
            value={profileData[key]}
            onChangeText={(text) => setProfileData(prev => ({ ...prev, [key]: text }))}
            placeholder={placeholder}
            placeholderTextColor="#999"
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
            editable={!(key === 'email' && user?.isLocal)}
          />
        ) : (
          <Text style={styles.fieldValue}>
            {profileData[key] || `No ${label.toLowerCase()} provided`}
          </Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#58CC02', '#89E219']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            onPress={() => isEditing ? saveProfileData() : setIsEditing(true)}
            style={styles.editButton}
          >
            <Ionicons 
              name={isEditing ? "checkmark" : "pencil"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Profile Content */}
      <View style={styles.content}>
        <Animatable.View animation="fadeInUp" style={styles.profileCard}>
          {renderProfileImage()}
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{profileData.name || 'User'}</Text>
            {user?.isGuest && (
              <Text style={styles.guestLabel}>Guest User</Text>
            )}
            {user?.isLocal && (
              <Text style={styles.localLabel}>Local Account</Text>
            )}
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={200} style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          {renderField('Full Name', 'name', 'Enter your full name')}
          {renderField('Email', 'email', 'Enter your email address')}
          {renderField('Phone', 'phone', 'Enter your phone number')}
          {renderField('Location', 'location', 'Enter your location')}
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={400} style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Learning Preferences</Text>
          
          {renderField('Native Language', 'nativeLanguage', 'What is your native language?')}
          {renderField('Learning Goal', 'learningGoal', 'What do you want to achieve?')}
          {renderField('Bio', 'bio', 'Tell us about yourself...', true)}
        </Animatable.View>

        {isEditing && (
          <Animatable.View animation="fadeInUp" delay={600} style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsEditing(false);
                loadProfileData(); // Reset changes
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveProfileData}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
      </View>

      {/* Image Picker Modal */}
      <Modal
        visible={showImagePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Profile Picture</Text>
            
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => pickImage('camera')}
            >
              <Ionicons name="camera" size={24} color="#58CC02" />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => pickImage('gallery')}
            >
              <Ionicons name="image" size={24} color="#58CC02" />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowImagePicker(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#58CC02',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#58CC02',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#58CC02',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  guestLabel: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  localLabel: {
    fontSize: 14,
    color: '#FF6B35',
    fontStyle: 'italic',
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#58CC02',
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
  },
  fieldInput: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#58CC02',
    paddingVertical: 15,
    borderRadius: 10,
    marginLeft: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    marginBottom: 10,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  modalCancel: {
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
});
