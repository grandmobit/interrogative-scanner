@echo off
echo Installing dependencies...
npm install

echo.
echo Starting Interrogative Scanner...
echo.
echo Instructions:
echo - Press 'i' for iOS simulator
echo - Press 'a' for Android emulator  
echo - Scan QR code with Expo Go app for physical device
echo.

npx expo start
