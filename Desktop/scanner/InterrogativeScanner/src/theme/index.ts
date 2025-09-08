/**
 * Theme configuration for Interrogative Scanner
 * Using react-native-paper's Material Design 3 theming
 */

import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1976D2',
    primaryContainer: '#E3F2FD',
    secondary: '#FF6B35',
    secondaryContainer: '#FFE0DB',
    tertiary: '#4CAF50',
    tertiaryContainer: '#E8F5E8',
    error: '#F44336',
    errorContainer: '#FFEBEE',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    onSurface: '#212121',
    onSurfaceVariant: '#757575',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#64B5F6',
    primaryContainer: '#1565C0',
    secondary: '#FF8A65',
    secondaryContainer: '#D84315',
    tertiary: '#81C784',
    tertiaryContainer: '#388E3C',
    error: '#EF5350',
    errorContainer: '#C62828',
    surface: '#121212',
    surfaceVariant: '#1E1E1E',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#BDBDBD',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

export const typography = {
  headlineLarge: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  headlineMedium: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 36,
  },
  titleLarge: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  titleMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  labelLarge: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
};
