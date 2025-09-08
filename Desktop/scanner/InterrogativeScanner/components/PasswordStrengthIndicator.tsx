import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

interface PasswordStrengthIndicatorProps {
  password: string;
  style?: any;
}

interface StrengthResult {
  strength: number;
  label: string;
  color: string;
  percentage: number;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  style,
}) => {
  const calculateStrength = (password: string): StrengthResult => {
    let strength = 0;
    const checks = [
      password.length >= 8, // Length check
      /[A-Z]/.test(password), // Uppercase
      /[a-z]/.test(password), // Lowercase
      /[0-9]/.test(password), // Numbers
      /[^A-Za-z0-9]/.test(password), // Special characters
    ];

    strength = checks.filter(Boolean).length;

    const strengthData = [
      { label: 'Very Weak', color: '#ff4757', percentage: 20 },
      { label: 'Weak', color: '#ff6b7a', percentage: 40 },
      { label: 'Fair', color: '#ffa502', percentage: 60 },
      { label: 'Good', color: '#2ed573', percentage: 80 },
      { label: 'Strong', color: '#00d2d3', percentage: 100 },
    ];

    const index = Math.min(strength, 4);
    return {
      strength,
      label: strengthData[index].label,
      color: strengthData[index].color,
      percentage: strengthData[index].percentage,
    };
  };

  if (!password) return null;

  const result = calculateStrength(password);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.strengthBar}>
        <View
          style={[
            styles.strengthFill,
            {
              width: `${result.percentage}%`,
              backgroundColor: result.color,
            },
          ]}
        />
      </View>
      <View style={styles.strengthInfo}>
        <Text style={[styles.strengthText, { color: result.color }]}>
          {result.label}
        </Text>
        <Text style={styles.strengthPercentage}>
          {result.percentage}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  strengthBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.3s ease',
  },
  strengthInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  strengthText: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '600',
  },
  strengthPercentage: {
    fontSize: isTablet ? 12 : 10,
    color: '#8892b0',
    fontWeight: '500',
  },
});

export default PasswordStrengthIndicator;
