/**
 * Premium Profile Avatar Component - Compact top-right profile UI
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Easing, 
  Alert,
  Modal,
  Text,
  Dimensions
} from 'react-native';

interface ProfileAvatarProps {
  userName?: string;
  userInitials?: string;
  notificationCount?: number;
  onProfileAction?: (action: string) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
  userName = "User",
  userInitials = "U",
  notificationCount = 0,
  onProfileAction 
}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [glowAnim] = useState(new Animated.Value(0.5));
  const [menuOpacity] = useState(new Animated.Value(0));
  const [menuScale] = useState(new Animated.Value(0.8));
  const [badgePulse] = useState(new Animated.Value(1));

  // Initialize glow animation
  useEffect(() => {
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

  // Badge pulse animation
  useEffect(() => {
    if (notificationCount > 0) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(badgePulse, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(badgePulse, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
    return undefined;
  }, [notificationCount]);

  const handleAvatarPress = () => {
    // Scale animation on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsMenuVisible(true);
    
    // Menu appear animation
    Animated.parallel([
      Animated.timing(menuOpacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(menuScale, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideMenu = () => {
    Animated.parallel([
      Animated.timing(menuOpacity, {
        toValue: 0,
        duration: 150,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(menuScale, {
        toValue: 0.8,
        duration: 150,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsMenuVisible(false);
    });
  };

  const handleMenuAction = (action: string, label: string) => {
    hideMenu();
    
    setTimeout(() => {
      if (onProfileAction) {
        onProfileAction(action);
      } else {
        Alert.alert(label, `${label} functionality coming soon!`);
      }
    }, 200);
  };

  const menuItems = [
    { action: 'profile', label: 'View Profile', icon: '👤' },
    { action: 'settings', label: 'Account Settings', icon: '⚙️' },
    { action: 'privacy', label: 'Privacy & Security', icon: '🔒' },
    { action: 'logout', label: 'Log Out', icon: '🚪' },
  ];

  return (
    <>
      {/* Profile Avatar */}
      <TouchableOpacity 
        style={styles.avatarContainer}
        onPress={handleAvatarPress}
        activeOpacity={0.8}
      >
        <Animated.View 
          style={[
            styles.avatarGlow,
            {
              opacity: glowAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        />
        <Animated.View 
          style={[
            styles.avatar,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.avatarText}>{userInitials}</Text>
        </Animated.View>
        
        {/* Notification Badge */}
        {notificationCount > 0 && (
          <Animated.View 
            style={[
              styles.notificationBadge,
              {
                transform: [{ scale: badgePulse }],
              },
            ]}
          >
            <Text style={styles.badgeText}>
              {notificationCount > 9 ? '9+' : notificationCount}
            </Text>
          </Animated.View>
        )}
      </TouchableOpacity>

      {/* Dropdown Menu Modal */}
      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideMenu}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={hideMenu}
        >
          <Animated.View 
            style={[
              styles.dropdownMenu,
              {
                opacity: menuOpacity,
                transform: [{ scale: menuScale }],
              },
            ]}
          >
            <View style={styles.menuHeader}>
              <Text style={styles.menuUserName}>{userName}</Text>
              <Text style={styles.menuUserEmail}>user@secureapp.com</Text>
            </View>
            
            <View style={styles.menuDivider} />
            
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.action}
                style={[
                  styles.menuItem,
                  index === menuItems.length - 1 && styles.lastMenuItem
                ]}
                onPress={() => {
                  switch (item.action) {
                    case 'logout':
                      Alert.alert('Logout', 'Are you sure you want to log out?', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Logout', style: 'destructive', onPress: () => {
                          if (onProfileAction) {
                            onProfileAction('logout');
                          }
                        }}
                      ]);
                      break;
                    default:
                      handleMenuAction(item.action, item.label);
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={[
                  styles.menuText,
                  item.action === 'logout' && styles.logoutText
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    zIndex: 1000,
  },
  avatarGlow: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#00ffff',
    top: -2,
    left: -2,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#001122',
    borderWidth: 2,
    borderColor: '#00ffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: 35,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ff4757',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000814',
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 20,
  },
  dropdownMenu: {
    backgroundColor: 'rgba(0, 17, 34, 0.95)',
    borderRadius: 16,
    padding: 8,
    minWidth: 220,
    borderWidth: 1,
    borderColor: '#00ffff33',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  menuHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  menuUserEmail: {
    fontSize: 12,
    color: '#a0a9c0',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#00ffff33',
    marginVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 2,
  },
  lastMenuItem: {
    borderTopWidth: 1,
    borderTopColor: '#00ffff33',
    marginTop: 8,
    paddingTop: 16,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    flex: 1,
  },
  logoutText: {
    color: '#ff6b6b',
  },
});

export default ProfileAvatar;
