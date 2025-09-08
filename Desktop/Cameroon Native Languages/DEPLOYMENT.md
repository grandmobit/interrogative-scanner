# Deployment Guide - Contri-Tok

This guide covers deployment options for both the mobile app and backend API.

## 🚀 Mobile App Deployment

### Expo Application Services (EAS) - Recommended

1. **Install EAS CLI**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure EAS**
   ```bash
   eas build:configure
   ```

4. **Build for Android**
   ```bash
   # Development build
   eas build --platform android --profile development

   # Production build
   eas build --platform android --profile production
   ```

5. **Build for iOS**
   ```bash
   # Development build
   eas build --platform ios --profile development

   # Production build
   eas build --platform ios --profile production
   ```

### Classic Expo Build (Legacy)

```bash
# Android APK
expo build:android --type apk

# Android App Bundle (for Play Store)
expo build:android --type app-bundle

# iOS IPA
expo build:ios
```

### App Store Deployment

1. **Google Play Store**
   - Use App Bundle format
   - Follow Google Play Console guidelines
   - Set up app signing

2. **Apple App Store**
   - Use Xcode for final submission
   - Configure App Store Connect
   - Handle iOS certificates

## 🖥️ Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
2. **Create Heroku app**
   ```bash
   heroku create contri-tok-api
   ```

3. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-production-secret
   heroku config:set MONGODB_URI=your-mongodb-connection-string
   ```

4. **Deploy**
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Option 2: DigitalOcean Droplet

1. **Create Ubuntu droplet**
2. **Install Node.js and MongoDB**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone and setup**
   ```bash
   git clone <your-repo>
   cd backend
   npm install --production
   ```

4. **Use PM2 for process management**
   ```bash
   npm install -g pm2
   pm2 start server.js --name contri-tok-api
   pm2 startup
   pm2 save
   ```

### Option 3: AWS EC2

1. **Launch EC2 instance**
2. **Install dependencies**
3. **Configure security groups**
4. **Use Application Load Balancer**
5. **Set up SSL with Let's Encrypt**

### Option 4: Railway

1. **Connect GitHub repository**
2. **Set environment variables**
3. **Deploy automatically on push**

## 🗄️ Database Deployment

### MongoDB Atlas (Recommended)

1. **Create cluster**
2. **Configure network access**
3. **Create database user**
4. **Get connection string**
5. **Update MONGODB_URI**

### Self-hosted MongoDB

1. **Install MongoDB on server**
2. **Configure authentication**
3. **Set up backups**
4. **Configure firewall**

## 🔧 Environment Configuration

### Production Environment Variables

```bash
# Backend (.env)
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/contritok
JWT_SECRET=your-super-secure-production-secret
JWT_EXPIRE=7d
FRONTEND_URL=https://your-app-domain.com

# Security
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-admin-password

# File uploads
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### Mobile App Configuration

Update `src/context/AuthContext.js` and `src/context/LearningContext.js`:

```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-api-domain.com/api';
```

## 🛡️ Security Checklist

- [ ] Use HTTPS for all communications
- [ ] Set secure JWT secrets
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Use environment variables for secrets
- [ ] Set up database authentication
- [ ] Configure firewall rules
- [ ] Enable MongoDB authentication
- [ ] Use secure session configuration
- [ ] Implement proper error handling

## 📊 Monitoring & Analytics

### Backend Monitoring

1. **Application Performance Monitoring**
   - New Relic
   - DataDog
   - AppDynamics

2. **Error Tracking**
   - Sentry
   - Bugsnag
   - Rollbar

3. **Logging**
   - Winston
   - Morgan
   - ELK Stack

### Mobile App Analytics

1. **Expo Analytics**
2. **Google Analytics**
3. **Firebase Analytics**
4. **Mixpanel**

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths: ['backend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd backend
          npm ci
      - name: Run tests
        run: |
          cd backend
          npm test
      - name: Deploy to production
        run: |
          # Your deployment script
```

## 📱 App Store Optimization

### Google Play Store

1. **App Description**
   - Highlight Cameroonian languages
   - Mention offline capabilities
   - Include screenshots

2. **Keywords**
   - Cameroonian languages
   - Language learning
   - Duala, Bamileke, Fulfulde
   - African languages

3. **Screenshots**
   - Show main features
   - Include different screen sizes
   - Highlight UI/UX

### Apple App Store

1. **App Store Connect**
2. **App Review Guidelines**
3. **Metadata optimization**
4. **In-app purchase setup**

## 🔧 Performance Optimization

### Backend

1. **Database indexing**
2. **Caching with Redis**
3. **CDN for static assets**
4. **Compression middleware**
5. **Database connection pooling**

### Mobile App

1. **Image optimization**
2. **Bundle size optimization**
3. **Lazy loading**
4. **Offline caching**
5. **Performance monitoring**

## 📋 Launch Checklist

- [ ] Backend deployed and tested
- [ ] Database seeded with initial data
- [ ] Mobile app built for production
- [ ] SSL certificates configured
- [ ] Domain names configured
- [ ] Analytics tracking setup
- [ ] Error monitoring active
- [ ] Backup systems in place
- [ ] Documentation updated
- [ ] Team access configured
- [ ] Monitoring alerts setup
- [ ] Performance baselines established

## 🆘 Troubleshooting

### Common Issues

1. **CORS errors**
   - Check FRONTEND_URL configuration
   - Verify CORS middleware setup

2. **Database connection issues**
   - Verify MongoDB URI
   - Check network access rules

3. **JWT token issues**
   - Verify JWT_SECRET consistency
   - Check token expiration settings

4. **Build failures**
   - Clear node_modules and reinstall
   - Check for version conflicts

### Support Contacts

- Technical Support: tech@contritok.com
- Deployment Issues: devops@contritok.com
- Emergency: +237-xxx-xxx-xxx
