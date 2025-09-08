# Interrogative Scanner

A comprehensive cross-platform mobile application for detecting and mitigating phishing, malware, and other cyber threats in documents, URLs, emails, images, and videos.

![Interrogative Scanner](https://img.shields.io/badge/Platform-React%20Native-blue)
![Expo](https://img.shields.io/badge/Expo-SDK%2050-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Main Objective

To develop a cross-platform mobile application, Interrogative Scanner, that effectively detects and mitigates phishing, malware, and other cyber threats in documents, URLs, emails, images, and videos.

## 🎯 Specific Objectives

1. **Real-time Threat Detection**: Integrate a robust API (VirusTotal) for real-time threat detection across multiple content types including files, URLs, images, and videos.

2. **Detailed Threat Analysis**: Provide comprehensive threat analysis with risk scores (0-100), confidence levels, threat categorization, and actionable insights.

3. **Actionable Remediation**: Offer specific remediation strategies and prevention recommendations for identified threats, helping users understand and respond appropriately.

4. **Advanced Features**: Implement unique capabilities like real-time threat visualization, comprehensive analytics, and curated cybersecurity learning resources.

## ✨ Key Features

### 🛡️ Comprehensive Scanning
- **File Scanning**: Support for documents, images, videos, archives, and executables
- **URL Analysis**: Real-time website and link threat detection
- **Dual Scan Modes**: Express (quick) and Comprehensive (detailed) analysis
- **Multi-format Support**: PDF, DOC, images, videos, compressed files, and more

### 📊 Advanced Analytics
- **Risk Scoring**: 0-100 risk assessment with confidence levels
- **Threat Categorization**: Detailed breakdown of threat types
- **Visual Analytics**: Charts and graphs showing threat trends
- **Historical Data**: Persistent scan history with detailed reports

### 🎓 Security Learning Hub
- **Curated Resources**: 20+ handpicked cybersecurity learning materials
- **Multiple Formats**: YouTube videos, PDF guides, and articles
- **Organized Categories**: Getting Started, Phishing, Mobile Safety, Malware
- **Interactive Learning**: Direct links to educational content

### 🎨 Modern UI/UX
- **Material Design 3**: Clean, modern interface with dark/light theme support
- **Intuitive Navigation**: Bottom tab navigation with clear iconography
- **Responsive Design**: Optimized for various screen sizes
- **Accessibility**: Full accessibility support with proper labels and navigation

## 🏗️ Architecture

### Tech Stack
- **Framework**: Expo SDK 50 with React Native
- **Language**: TypeScript (strict mode)
- **Navigation**: React Navigation v6 with bottom tabs
- **UI Library**: React Native Paper (Material Design 3)
- **State Management**: Zustand with AsyncStorage persistence
- **Charts**: React Native Chart Kit with SVG support
- **File Handling**: Expo Document Picker and File System
- **API Integration**: VirusTotal API v3 with comprehensive error handling

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ScanCard.tsx    # Scan result display card
│   ├── MetricCard.tsx  # Analytics metric display
│   ├── ChartCard.tsx   # Chart visualization wrapper
│   ├── EmptyState.tsx  # Empty state component
│   └── ErrorState.tsx  # Error handling component
├── navigation/          # Navigation configuration
│   └── BottomTabs.tsx  # Bottom tab navigator
├── screens/            # Main application screens
│   ├── HomeScreen.tsx      # Welcome and quick actions
│   ├── DashboardScreen.tsx # Analytics and scan history
│   ├── ScannerScreen.tsx   # File and URL scanning
│   └── LearningScreen.tsx  # Educational resources
├── services/           # External service integrations
│   └── virusTotal.ts   # VirusTotal API service
├── store/              # State management
│   └── useScansStore.ts # Zustand store with persistence
├── theme/              # Design system
│   └── index.ts        # Theme configuration and tokens
├── types/              # TypeScript type definitions
│   └── index.ts        # Application types
└── utils/              # Utility functions
    ├── format.ts       # Data formatting utilities
    ├── mapping.ts      # API response mapping
    └── validation.ts   # Input validation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd InterrogativeScanner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your VirusTotal API key:
   ```env
   VT_API_KEY=your_virustotal_api_key_here
   TEST_MODE=false
   ```

4. **Start the development server**:
   ```bash
   npm start
   # or
   npx expo start
   ```

5. **Run on device/simulator**:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

### Getting a VirusTotal API Key

1. Visit [VirusTotal](https://www.virustotal.com/)
2. Create a free account or sign in
3. Go to your [API key page](https://www.virustotal.com/gui/my-apikey)
4. Copy your API key and add it to your `.env` file

**Note**: The free tier allows 4 requests per minute and 500 requests per day.

## 📱 App Screens

### 🏠 Home Screen
- Welcome message and app overview
- Feature highlights and quick actions
- API status indicator
- Quick navigation to Scanner and Learning sections
- Personal security statistics summary

### 📊 Dashboard Screen
- Comprehensive analytics with metrics cards
- Visual charts showing threat trends and distributions
- Complete scan history with detailed results
- Scan result management (view details, delete)
- Export and sharing capabilities

### 🔍 Scanner Screen
- Dual scanning modes (Express vs Comprehensive)
- File selection with validation and size checking
- URL input with format validation
- Real-time scan progress with detailed status
- Comprehensive result display with recommendations

### 🎓 Learning Screen
- 20+ curated cybersecurity resources
- Categorized content (Getting Started, Phishing, Mobile Safety, Malware)
- Search and filter functionality
- Direct links to YouTube videos and PDF resources
- Resource metadata (duration, file size, type)

## 🔒 Security Considerations

### API Key Security
- **Client-side limitation**: API keys in mobile apps are not fully secure
- **Recommendation**: For production use, implement a backend proxy server
- **Current implementation**: Direct API calls for demonstration purposes
- **Best practice**: Store sensitive operations on a secure backend

### Data Privacy
- **Local storage**: All scan results stored locally using AsyncStorage
- **No cloud sync**: Data remains on device unless explicitly shared
- **Temporary files**: Uploaded files are handled securely and not permanently stored

### Network Security
- **HTTPS only**: All API communications use secure HTTPS
- **Error handling**: Comprehensive error handling prevents information leakage
- **Input validation**: All user inputs are validated and sanitized

## 🧪 Testing

### Test Mode
Enable test mode in development to use mock data when API quota is exceeded:

```env
TEST_MODE=true
```

When enabled, the app will return realistic mock scan results instead of making API calls.

### Running Tests
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

## 🛠️ Development

### Code Quality
- **ESLint**: Configured with TypeScript and React Native rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict mode enabled for maximum type safety
- **Husky**: Pre-commit hooks for code quality (when configured)

### Available Scripts
```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
npm run format     # Format code with Prettier
npm run type-check # TypeScript type checking
```

## 🔧 Configuration

### Environment Variables
```env
# VirusTotal API Configuration
VT_API_KEY=your_api_key_here

# Development Settings
TEST_MODE=false  # Enable mock data for testing
```

### Customization
- **Theme**: Modify `src/theme/index.ts` for custom colors and spacing
- **Learning Resources**: Update `src/screens/LearningScreen.tsx` to add new resources
- **API Endpoints**: Extend `src/services/virusTotal.ts` for additional API features

## 🚨 Known Limitations

### VirusTotal Free Tier
- **Rate Limits**: 4 requests per minute, 500 per day
- **File Size**: Maximum 32MB per file
- **Analysis Time**: Comprehensive scans may take 30-60 seconds

### Mobile Platform Constraints
- **File Access**: Limited by platform file system permissions
- **Background Processing**: Scans pause when app is backgrounded
- **Network Dependency**: Requires internet connection for API calls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode requirements
- Maintain test coverage for new features
- Use conventional commit messages
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **VirusTotal**: For providing comprehensive malware detection API
- **Expo Team**: For the excellent React Native development platform
- **React Native Paper**: For beautiful Material Design components
- **Cybersecurity Community**: For educational resources and threat intelligence

## 📞 Support

For support, questions, or feature requests:
- Create an issue on GitHub
- Check the documentation in the `/docs` folder
- Review the FAQ section below

## ❓ FAQ

**Q: Why is my API key not working?**
A: Ensure you've copied the key correctly from VirusTotal and added it to your `.env` file. Check that the key has proper permissions.

**Q: Can I use this app offline?**
A: The app can display previously scanned results offline, but new scans require an internet connection to access the VirusTotal API.

**Q: How accurate are the threat detections?**
A: Accuracy depends on VirusTotal's detection engines. The app provides confidence scores to help you assess the reliability of results.

**Q: Can I scan files larger than 32MB?**
A: The free VirusTotal tier limits file uploads to 32MB. Consider upgrading to a paid plan for larger files.

**Q: Is my data secure?**
A: All scan results are stored locally on your device. Files are uploaded to VirusTotal for analysis but not permanently stored by this app.

---

**Built with ❤️ for cybersecurity awareness and mobile security**
