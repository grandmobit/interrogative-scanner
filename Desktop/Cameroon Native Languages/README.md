# Contri-Tok - Cameroonian Language Learning App

A professional, cross-platform mobile application built with React Native and Expo for learning Cameroonian native languages. Features a Duolingo-inspired UI/UX with interactive lessons, quizzes, audio pronunciation, and progress tracking.

## 🌟 Features

### 📱 Mobile App Features
- **Authentication System**: Secure user registration and login
- **Interactive Lessons**: Learn vocabulary with audio pronunciation
- **Quiz System**: Test knowledge with multiple-choice questions
- **Progress Tracking**: Monitor learning streaks and completion rates
- **Audio Pronunciation**: Native language audio with speech synthesis
- **Duolingo-inspired UI**: Modern, colorful, and engaging interface
- **Offline Support**: Cache lessons for offline learning
- **Multi-language Support**: Learn multiple Cameroonian languages

### 🎯 Supported Languages
- **Duala** (Littoral Region) - Beginner friendly
- **Bamileke** (West Region) - Intermediate level
- **Fulfulde** (North Region) - Advanced level
- **Ewondo** (Centre Region) - Beginner friendly

### 🔧 Backend Features
- **RESTful API**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based secure authentication
- **Admin Panel**: Content management for lessons and languages
- **Analytics**: User progress and engagement tracking
- **Rate Limiting**: API protection and security

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Cameroon Native Languages"
   ```

2. **Install mobile app dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Setup environment variables**
   ```bash
   # In backend/.env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/contritok
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:19006
   ADMIN_EMAIL=admin@contritok.com
   ADMIN_PASSWORD=admin123
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

7. **Start the mobile app**
   ```bash
   # In root directory
   npm start
   ```

8. **Run on device/emulator**
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR code with Expo Go app

## 🏗️ Project Structure

```
Contri-Tok/
├── src/                          # React Native app source
│   ├── context/                  # React Context providers
│   │   ├── AuthContext.js        # Authentication state
│   │   └── LearningContext.js    # Learning progress state
│   ├── navigation/               # Navigation setup
│   │   ├── AuthNavigator.js      # Auth flow navigation
│   │   ├── MainNavigator.js      # Main app navigation
│   │   └── LearningNavigator.js  # Learning section navigation
│   └── screens/                  # App screens
│       ├── auth/                 # Authentication screens
│       ├── main/                 # Main app screens
│       └── learning/             # Learning screens
├── backend/                      # Node.js backend
│   ├── models/                   # MongoDB models
│   │   ├── User.js               # User model
│   │   ├── Language.js           # Language model
│   │   ├── Lesson.js             # Lesson model
│   │   └── Progress.js           # Progress tracking model
│   ├── routes/                   # API routes
│   │   ├── auth.js               # Authentication endpoints
│   │   ├── languages.js          # Language management
│   │   ├── lessons.js            # Lesson management
│   │   ├── progress.js           # Progress tracking
│   │   └── admin.js              # Admin functionality
│   ├── middleware/               # Express middleware
│   │   └── auth.js               # JWT authentication
│   └── server.js                 # Express server setup
├── App.js                        # Main app component
├── package.json                  # Dependencies
└── app.json                      # Expo configuration
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `PUT /api/auth/profile` - Update user profile

### Languages
- `GET /api/languages` - Get all languages
- `GET /api/languages/:id` - Get single language
- `POST /api/languages` - Create language (Admin)
- `PUT /api/languages/:id` - Update language (Admin)

### Lessons
- `GET /api/lessons/:languageId` - Get lessons for language
- `GET /api/lessons/single/:id` - Get single lesson
- `POST /api/lessons` - Create lesson (Admin)
- `PUT /api/lessons/:id` - Update lesson (Admin)

### Progress
- `GET /api/progress` - Get user progress
- `POST /api/progress` - Update lesson progress
- `POST /api/progress/:lessonId/quiz` - Submit quiz results
- `GET /api/progress/stats/overview` - Get learning statistics

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Manage users
- `POST /api/admin/seed-data` - Seed initial data

## 🎨 UI/UX Design

The app follows Duolingo's design principles:
- **Bright, engaging colors** (Primary: #58CC02)
- **Smooth animations** using React Native Animatable
- **Card-based layouts** with shadows and gradients
- **Progress indicators** and gamification elements
- **Consistent typography** and iconography
- **Responsive design** for various screen sizes

## 🔊 Audio Features

- **Text-to-Speech**: Uses Expo Speech for pronunciation
- **Audio Playback**: Expo AV for audio files
- **Voice Recognition**: Ready for future implementation
- **Pronunciation Matching**: Feedback system for user pronunciation

## 📊 Progress Tracking

- **Lesson Completion**: Track completed lessons and scores
- **Learning Streaks**: Daily learning streak counter
- **Time Tracking**: Monitor study time and goals
- **Achievement System**: Badges and milestones
- **Language Progress**: Per-language learning statistics

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs for password security
- **Rate Limiting**: API request throttling
- **Input Validation**: Express-validator for data validation
- **CORS Protection**: Cross-origin request security
- **Helmet.js**: Security headers and protection

## 🚀 Deployment

### Mobile App (Expo)
```bash
# Build for production
expo build:android
expo build:ios

# Or use EAS Build (recommended)
eas build --platform android
eas build --platform ios
```

### Backend (Node.js)
```bash
# Set production environment
NODE_ENV=production

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name contri-tok-api

# Or deploy to cloud platforms
# - Heroku
# - AWS EC2
# - DigitalOcean
# - Google Cloud Platform
```

## 🧪 Testing

```bash
# Run mobile app tests
npm test

# Run backend tests
cd backend
npm test

# Run E2E tests
npm run test:e2e
```

## 📱 Building APK

```bash
# Build Android APK
expo build:android --type apk

# Build Android App Bundle (recommended for Play Store)
expo build:android --type app-bundle

# Build iOS IPA
expo build:ios
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Duolingo** for UI/UX inspiration
- **Cameroon Ministry of Arts and Culture** for language resources
- **React Native Community** for excellent libraries
- **Expo Team** for the amazing development platform

## 📞 Support

For support, email support@contritok.com or join our Slack channel.

## 🗺️ Roadmap

- [ ] Voice recognition for pronunciation practice
- [ ] Offline mode with local storage
- [ ] Social features and leaderboards
- [ ] More Cameroonian languages (Bassa, Beti, Fang)
- [ ] Advanced grammar lessons
- [ ] Cultural context videos
- [ ] Community-generated content
- [ ] Web version of the app

---

**Made with ❤️ for preserving Cameroonian languages and culture**
