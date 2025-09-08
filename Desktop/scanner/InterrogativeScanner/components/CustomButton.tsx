import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  loading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  icon,
  loading = false,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size variations
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = isTablet ? 12 : 10;
        baseStyle.paddingHorizontal = isTablet ? 20 : 16;
        break;
      case 'large':
        baseStyle.paddingVertical = isTablet ? 20 : 18;
        baseStyle.paddingHorizontal = isTablet ? 32 : 28;
        break;
      default: // medium
        baseStyle.paddingVertical = isTablet ? 16 : 14;
        baseStyle.paddingHorizontal = isTablet ? 24 : 20;
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)',
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: '#4f7cff',
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default: // primary
        return {
          ...baseStyle,
          backgroundColor: '#4f7cff',
          shadowColor: '#4f7cff',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '700',
      letterSpacing: 0.5,
    };

    // Size variations
    switch (size) {
      case 'small':
        baseTextStyle.fontSize = isTablet ? 14 : 12;
        break;
      case 'large':
        baseTextStyle.fontSize = isTablet ? 20 : 18;
        break;
      default: // medium
        baseTextStyle.fontSize = isTablet ? 16 : 14;
    }

    // Variant colors
    switch (variant) {
      case 'outline':
      case 'ghost':
        baseTextStyle.color = '#4f7cff';
        break;
      default:
        baseTextStyle.color = 'white';
    }

    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {icon && <>{icon}</>}
      <Text style={[getTextStyle(), textStyle]}>
        {loading ? 'Loading...' : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});

export default CustomButton;
