# Modern Authentication Screens for React Native/Expo

This package provides a complete, modern authentication system with Welcome, Login, and Signup screens designed for React Native/Expo applications.

## Features

### 🎨 **Modern Design**
- Clean, professional UI with gradient backgrounds
- Soft color palette with blue accent (#4f7cff)
- Rounded corners and subtle shadows for depth
- Fully responsive for phones and tablets
- Dark theme optimized for cybersecurity apps

### 🔐 **Welcome Screen**
- Prominent app logo with gradient circle
- App name and tagline display
- Three action buttons: Get Started, Login, Continue as Guest
- Smooth transitions to other screens

### 📧 **Login Screen**
- Email and password input fields
- Show/hide password toggle with eye icon
- Forgot password link
- Social login buttons (Google, Apple)
- Form validation with error messages
- Back navigation to welcome screen

### 👤 **Signup Screen**
- Full name, email, password, confirm password fields
- Real-time password strength indicator
- Terms & conditions checkbox
- Social signup options
- Comprehensive form validation
- Password matching validation

### ⚡ **Interactive Features**
- Smooth animations and transitions
- Focus states with animated borders
- Loading states for buttons
- Drag and drop file handling
- Real-time validation feedback
- Responsive design for all screen sizes

## Installation

1. Copy the authentication files to your project:
   - `AuthScreens.tsx` - Main authentication component
   - `AuthDemo.tsx` - Integration example
   - `components/CustomButton.tsx` - Reusable button component
   - `components/CustomInput.tsx` - Enhanced input component
   - `components/PasswordStrengthIndicator.tsx` - Password strength meter

2. Install required dependencies:
```bash
npm install react-native-reanimated react-native-gesture-handler
```

3. For Expo projects, ensure you have:
```bash
expo install expo-linear-gradient
```

## Basic Usage

```tsx
import React from 'react';
import AuthScreens from './AuthScreens';

const App = () => {
  const handleLogin = (email: string, password: string) => {
    // Your login logic here
    console.log('Login:', { email, password });
  };

  const handleSignup = (userData: any) => {
    // Your signup logic here
    console.log('Signup:', userData);
  };

  const handleGuestContinue = () => {
    // Handle guest access
    console.log('Guest mode');
  };

  const handleSocialLogin = (provider: string) => {
    // Handle social authentication
    console.log('Social login:', provider);
  };

  return (
    <AuthScreens
      onLogin={handleLogin}
      onSignup={handleSignup}
      onGuestContinue={handleGuestContinue}
      onSocialLogin={handleSocialLogin}
    />
  );
};

export default App;
```

## Component Props

### AuthScreens Props
```tsx
interface AuthScreensProps {
  onLogin?: (email: string, password: string) => void;
  onSignup?: (userData: SignupData) => void;
  onGuestContinue?: () => void;
  onSocialLogin?: (provider: string) => void;
}

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}
```

## Customization

### Colors
The main colors can be customized by modifying the StyleSheet:
- Primary: `#4f7cff` (Blue accent)
- Background: `#1e2139` to `#2a2d47` (Dark gradient)
- Text: `white` and `#8892b0` (Light gray)
- Error: `#ff4757` (Red)
- Success: `#2ed573` (Green)

### Typography
Font sizes are responsive and scale based on device type:
- Tablet: Larger fonts for better readability
- Phone: Optimized for smaller screens

### Layout
The layout automatically adapts to:
- Screen orientation changes
- Different device sizes
- Keyboard appearance (KeyboardAvoidingView)

## Advanced Features

### Password Strength Indicator
The signup screen includes a real-time password strength meter that checks for:
- Minimum 8 characters
- Uppercase letters
- Lowercase letters
- Numbers
- Special characters

### Form Validation
Built-in validation includes:
- Email format validation
- Password matching
- Required field checks
- Terms acceptance verification

### Social Authentication
Ready-to-integrate social login buttons for:
- Google (with brand colors)
- Apple (with system styling)
- Easily extensible for other providers

### Animations
Smooth transitions include:
- Screen slide animations
- Fade in/out effects
- Input focus animations
- Button press feedback

## Integration with Backend

### API Integration Example
```tsx
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (response.ok) {
      const { token, user } = await response.json();
      // Store token and navigate to main app
      await AsyncStorage.setItem('authToken', token);
      navigation.navigate('MainApp');
    } else {
      Alert.alert('Error', 'Invalid credentials');
    }
  } catch (error) {
    Alert.alert('Error', 'Network error occurred');
  }
};
```

### State Management
Works seamlessly with popular state management solutions:
- Redux/Redux Toolkit
- Zustand
- Context API
- React Query/TanStack Query

## Accessibility

The components include accessibility features:
- Proper labeling for screen readers
- Touch target sizes (44x44 minimum)
- High contrast colors
- Keyboard navigation support

## Performance

Optimized for performance with:
- Lazy loading of screens
- Efficient re-renders
- Native driver animations
- Minimal dependencies

## Browser Compatibility

While designed for React Native, the components can be adapted for React web applications with minor modifications to replace React Native components with web equivalents.

## Support

This authentication system is production-ready and includes:
- TypeScript support
- Comprehensive error handling
- Responsive design
- Modern UI patterns
- Security best practices

For customization or integration help, refer to the component source code which is well-documented and modular.
