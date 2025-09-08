import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Rect, LinearGradient, Stop, Defs } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

interface Tab {
  id: string;
  title: string;
  icon: string;
}

interface NavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

const CustomIcon: React.FC<{ name: string; isActive: boolean; size?: number }> = ({ 
  name, 
  isActive, 
  size = 24 
}) => {
  const gradientId = isActive ? 'activeGradient' : 'inactiveGradient';
  const strokeColor = isActive ? 'url(#activeGradient)' : 'url(#inactiveGradient)';
  const fillColor = isActive ? 'url(#activeGradient)' : 'url(#inactiveGradient)';

  const renderIcon = () => {
    switch (name) {
      case 'home':
        return (
          <>
            <Path 
              d="M12 2.5L2 9.5V22H8V16H16V22H22V9.5L12 2.5Z" 
              stroke={strokeColor} 
              strokeWidth="1.5" 
              fill="none" 
              strokeLinejoin="round"
            />
            <Path 
              d="M8 16H16V22H8V16Z" 
              stroke={strokeColor} 
              strokeWidth="1" 
              fill="none"
            />
            <Circle cx="12" cy="13" r="1" fill={fillColor} opacity="0.8"/>
          </>
        );
      case 'dashboard':
        return (
          <>
            <Rect x="3" y="3" width="7" height="5" rx="1" stroke={strokeColor} strokeWidth="1.5" fill="none"/>
            <Rect x="14" y="3" width="7" height="8" rx="1" stroke={strokeColor} strokeWidth="1.5" fill="none"/>
            <Rect x="3" y="12" width="7" height="9" rx="1" stroke={strokeColor} strokeWidth="1.5" fill="none"/>
            <Rect x="14" y="15" width="7" height="6" rx="1" stroke={strokeColor} strokeWidth="1.5" fill="none"/>
            <Circle cx="6.5" cy="5.5" r="0.8" fill={fillColor} opacity="0.7"/>
            <Circle cx="17.5" cy="7" r="0.8" fill={fillColor} opacity="0.7"/>
            <Circle cx="6.5" cy="16.5" r="0.8" fill={fillColor} opacity="0.7"/>
            <Circle cx="17.5" cy="18" r="0.8" fill={fillColor} opacity="0.7"/>
          </>
        );
      case 'scanner':
        return (
          <>
            <Circle cx="12" cy="12" r="9" stroke={strokeColor} strokeWidth="1.5" fill="none" opacity="0.8"/>
            <Circle cx="12" cy="12" r="6" stroke={strokeColor} strokeWidth="1" fill="none" opacity="0.6"/>
            <Circle cx="12" cy="12" r="3" stroke={strokeColor} strokeWidth="1" fill="none" opacity="0.4"/>
            <Circle cx="12" cy="12" r="1" fill={fillColor}/>
            <Path d="M12 3V6M12 18V21M3 12H6M18 12H21" stroke={strokeColor} strokeWidth="2" strokeLinecap="round"/>
            <Path d="M5.64 5.64L7.76 7.76M16.24 16.24L18.36 18.36M5.64 18.36L7.76 16.24M16.24 7.76L18.36 5.64" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
          </>
        );
      case 'learning':
        return (
          <>
            <Path d="M4 19V6.2C4 5.0799 4 4.51984 4.21799 4.09202C4.40973 3.71569 4.71569 3.40973 5.09202 3.21799C5.51984 3 6.0799 3 7.2 3H16.8C17.9201 3 18.4802 3 18.908 3.21799C19.2843 3.40973 19.5903 3.71569 19.782 4.09202C20 4.51984 20 5.0799 20 6.2V17L16 15L12 17L8 15L4 17V19Z" stroke={strokeColor} strokeWidth="1.5" fill="none"/>
            <Circle cx="12" cy="8" r="2" stroke={strokeColor} strokeWidth="1" fill="none"/>
            <Path d="M8 13H16M8 16H14" stroke={strokeColor} strokeWidth="1" strokeLinecap="round"/>
            <Circle cx="12" cy="8" r="0.5" fill={fillColor} opacity="0.8"/>
          </>
        );
      case 'profile':
        return (
          <>
            <Circle cx="12" cy="8" r="4" stroke={strokeColor} strokeWidth="1.5" fill="none"/>
            <Path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round"/>
            <Circle cx="12" cy="8" r="1.5" fill={fillColor} opacity="0.6"/>
            <Path d="M8.5 19.5H15.5" stroke={strokeColor} strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
          </>
        );
      default:
        return <Circle cx="12" cy="12" r="8" stroke={strokeColor} strokeWidth="2" fill="none"/>;
    }
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#00d4ff" stopOpacity="1" />
          <Stop offset="50%" stopColor="#0099cc" stopOpacity="1" />
          <Stop offset="100%" stopColor="#00ff88" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="inactiveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#94a3b8" stopOpacity="0.8" />
          <Stop offset="100%" stopColor="#64748b" stopOpacity="0.8" />
        </LinearGradient>
      </Defs>
      {renderIcon()}
    </Svg>
  );
};

const GlassmorphismNavigation: React.FC<NavigationProps> = ({ tabs, activeTab, onTabPress }) => {
  return (
    <View style={styles.navigationContainer}>
      <View style={styles.glassContainer}>
        <View style={styles.navContent}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.navItem,
                activeTab === tab.id && styles.navItemActive
              ]}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.7}
            >
              {activeTab === tab.id && <View style={styles.activeGlow} />}
              
              <View style={styles.iconContainer}>
                <CustomIcon 
                  name={tab.id} 
                  isActive={activeTab === tab.id} 
                  size={24} 
                />
              </View>
              
              <Text style={[
                styles.navLabel,
                activeTab === tab.id && styles.navLabelActive
              ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 80,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 20,
  },
  glassContainer: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
  },
  navContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  navItem: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    minWidth: 60,
  },
  navItemActive: {
    transform: [{ scale: 1.05 }],
  },
  activeGlow: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginBottom: 4,
    zIndex: 1,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(148, 163, 184, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'System',
  },
  navLabelActive: {
    color: '#ffffff',
    textShadowColor: 'rgba(0, 212, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});

export default GlassmorphismNavigation;
