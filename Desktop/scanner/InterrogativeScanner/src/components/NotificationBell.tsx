/**
 * Professional Notification Bell Component
 * Features: Glassmorphism design, animations, swipe-to-delete, cyber theme
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Modal,
  Text,
  FlatList,
  PanGestureHandler,
  State,
  Dimensions,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'safe' | 'threat' | 'warning' | 'info';
  isRead: boolean;
}

interface NotificationBellProps {
  notifications?: Notification[];
  onNotificationPress?: (notification: Notification) => void;
  onClearAll?: () => void;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications = [],
  onNotificationPress,
  onClearAll,
  onMarkAsRead,
  onDelete
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [bellShake] = useState(new Animated.Value(0));
  const [bellGlow] = useState(new Animated.Value(0));
  const [badgePulse] = useState(new Animated.Value(1));
  const [dropdownOpacity] = useState(new Animated.Value(0));
  const [dropdownScale] = useState(new Animated.Value(0.8));
  const [notificationAnimations] = useState(new Map());

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Bell shake animation for new notifications
  const triggerBellShake = () => {
    Animated.sequence([
      Animated.timing(bellShake, {
        toValue: 10,
        duration: 100,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(bellShake, {
        toValue: -10,
        duration: 100,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(bellShake, {
        toValue: 5,
        duration: 100,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(bellShake, {
        toValue: 0,
        duration: 100,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Bell glow animation
  const triggerBellGlow = () => {
    Animated.sequence([
      Animated.timing(bellGlow, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(bellGlow, {
        toValue: 0,
        duration: 500,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Badge pulse animation
  useEffect(() => {
    if (unreadCount > 0) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(badgePulse, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(badgePulse, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [unreadCount]);

  // Trigger animations when new notifications arrive
  useEffect(() => {
    if (unreadCount > 0) {
      triggerBellShake();
      triggerBellGlow();
    }
  }, [notifications.length]);

  const openDropdown = () => {
    setIsDropdownVisible(true);
    Animated.parallel([
      Animated.timing(dropdownOpacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(dropdownScale, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDropdown = () => {
    Animated.parallel([
      Animated.timing(dropdownOpacity, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(dropdownScale, {
        toValue: 0.8,
        duration: 200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsDropdownVisible(false);
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'safe': return '#00ff88';
      case 'threat': return '#ff4757';
      case 'warning': return '#ffd93d';
      case 'info': return '#00d4ff';
      default: return '#00d4ff';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'safe': return 'shield-check';
      case 'threat': return 'alert-octagon';
      case 'warning': return 'alert';
      case 'info': return 'information';
      default: return 'bell';
    }
  };

  const handleNotificationSwipe = (id: string, gestureState: any) => {
    if (gestureState.dx > 100) {
      // Swipe right to delete
      if (onDelete) {
        onDelete(id);
      }
    } else if (gestureState.dx < -100) {
      // Swipe left to mark as read
      if (onMarkAsRead) {
        onMarkAsRead(id);
      }
    }
  };

  const renderNotificationItem = ({ item, index }: { item: Notification; index: number }) => {
    if (!notificationAnimations.has(item.id)) {
      notificationAnimations.set(item.id, {
        slideX: new Animated.Value(0),
        opacity: new Animated.Value(1),
      });
    }

    const animations = notificationAnimations.get(item.id);

    return (
      <PanGestureHandler
        onGestureEvent={Animated.event(
          [{ nativeEvent: { translationX: animations.slideX } }],
          { useNativeDriver: true }
        )}
        onHandlerStateChange={(event) => {
          if (event.nativeEvent.state === State.END) {
            const { translationX } = event.nativeEvent;
            if (Math.abs(translationX) > 100) {
              // Animate out
              Animated.parallel([
                Animated.timing(animations.slideX, {
                  toValue: translationX > 0 ? screenWidth : -screenWidth,
                  duration: 200,
                  useNativeDriver: true,
                }),
                Animated.timing(animations.opacity, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start(() => {
                handleNotificationSwipe(item.id, { dx: translationX });
              });
            } else {
              // Snap back
              Animated.spring(animations.slideX, {
                toValue: 0,
                useNativeDriver: true,
              }).start();
            }
          }
        }}
      >
        <Animated.View
          style={[
            styles.notificationCard,
            {
              transform: [{ translateX: animations.slideX }],
              opacity: animations.opacity,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.notificationContent}
            onPress={() => {
              if (onNotificationPress) {
                onNotificationPress(item);
              }
              if (!item.isRead && onMarkAsRead) {
                onMarkAsRead(item.id);
              }
            }}
            activeOpacity={0.8}
          >
            <View style={styles.notificationHeader}>
              <View style={styles.notificationIconContainer}>
                <MaterialCommunityIcons
                  name={getTypeIcon(item.type)}
                  size={20}
                  color={getTypeColor(item.type)}
                />
                <View
                  style={[
                    styles.typeIndicator,
                    { backgroundColor: getTypeColor(item.type) }
                  ]}
                />
              </View>
              <View style={styles.notificationTextContainer}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationTime}>{item.time}</Text>
              </View>
              {!item.isRead && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.notificationMessage}>{item.message}</Text>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name="bell-sleep"
        size={64}
        color="#4a5568"
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyTitle}>No new notifications</Text>
      <Text style={styles.emptyMessage}>
        You're all caught up! We'll notify you when something important happens.
      </Text>
    </View>
  );

  return (
    <>
      {/* Notification Bell */}
      <TouchableOpacity
        style={styles.bellContainer}
        onPress={openDropdown}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.bellIconContainer,
            {
              transform: [{ rotate: bellShake.interpolate({
                inputRange: [-10, 10],
                outputRange: ['-10deg', '10deg'],
              }) }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.bellGlow,
              {
                opacity: bellGlow,
                transform: [{ scale: bellGlow.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.2],
                }) }],
              },
            ]}
          />
          <MaterialCommunityIcons
            name="bell"
            size={24}
            color="#00d4ff"
            style={styles.bellIcon}
          />
        </Animated.View>
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <Animated.View
            style={[
              styles.unreadBadge,
              {
                transform: [{ scale: badgePulse }],
              },
            ]}
          >
            <Text style={styles.badgeText}>
              {unreadCount > 9 ? '9+' : unreadCount.toString()}
            </Text>
          </Animated.View>
        )}
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeDropdown}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeDropdown}
        >
          <Animated.View
            style={[
              styles.dropdownContainer,
              {
                opacity: dropdownOpacity,
                transform: [{ scale: dropdownScale }],
              },
            ]}
          >
            <BlurView intensity={80} style={styles.blurContainer}>
              <View style={styles.dropdownHeader}>
                <Text style={styles.dropdownTitle}>Notifications</Text>
                <TouchableOpacity onPress={closeDropdown}>
                  <MaterialCommunityIcons name="close" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>

              {notifications.length > 0 ? (
                <FlatList
                  data={notifications}
                  renderItem={renderNotificationItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  style={styles.notificationsList}
                />
              ) : (
                renderEmptyState()
              )}

              {notifications.length > 0 && (
                <View style={styles.dropdownFooter}>
                  <TouchableOpacity
                    style={styles.clearAllButton}
                    onPress={() => {
                      if (onClearAll) {
                        onClearAll();
                      }
                      closeDropdown();
                    }}
                  >
                    <Text style={styles.clearAllText}>Clear All</Text>
                  </TouchableOpacity>
                </View>
              )}
            </BlurView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  bellContainer: {
    position: 'relative',
    padding: 8,
  },
  bellIconContainer: {
    position: 'relative',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00d4ff',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  bellIcon: {
    zIndex: 1,
  },
  unreadBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#ff4757',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000814',
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 8, 20, 0.8)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 20,
  },
  dropdownContainer: {
    width: screenWidth * 0.9,
    maxHeight: screenHeight * 0.7,
    borderRadius: 20,
    overflow: 'hidden',
  },
  blurContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 17, 34, 0.9)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 212, 255, 0.2)',
  },
  dropdownTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  notificationCard: {
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  notificationContent: {
    padding: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationIconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  typeIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 12,
    color: '#a0a9c0',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00d4ff',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#e2e8f0',
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#a0a9c0',
    textAlign: 'center',
    lineHeight: 20,
  },
  dropdownFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 212, 255, 0.2)',
  },
  clearAllButton: {
    backgroundColor: 'rgba(255, 71, 87, 0.2)',
    borderWidth: 1,
    borderColor: '#ff4757',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff4757',
    letterSpacing: 0.5,
  },
});

export default NotificationBell;
