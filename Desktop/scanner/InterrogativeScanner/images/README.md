# Images Directory

This directory contains all custom images for the InterrogativeScanner app.

## Structure

- **`logos/`** - Company logos, app logos, and branding assets
- **`icons/`** - Custom icons and UI elements
- **`backgrounds/`** - Background images and textures

## Supported Formats

- PNG (recommended for logos with transparency)
- JPG/JPEG (for photos and backgrounds)
- SVG (for scalable vector graphics)
- WebP (for optimized web images)

## Usage in React Native

```javascript
// Import images
import logo from '../images/logos/app-logo.png';
import backgroundImg from '../images/backgrounds/hero-bg.jpg';

// Use in components
<Image source={logo} style={styles.logo} />
<ImageBackground source={backgroundImg} style={styles.container}>
  // Your content
</ImageBackground>
```

## Usage in HTML/Web

```html
<!-- Direct path reference -->
<img src="./images/logos/app-logo.png" alt="App Logo" />

<!-- CSS background -->
<div style="background-image: url('./images/backgrounds/hero-bg.jpg')"></div>
```

## File Naming Convention

Use descriptive, lowercase names with hyphens:
- `app-logo.png`
- `user-avatar-placeholder.png` 
- `cybersecurity-hero-bg.jpg`
- `scan-icon.svg`
