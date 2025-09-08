@echo off
echo ================================
echo Contri-Tok Setup Script
echo ================================
echo.

echo Installing mobile app dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing mobile app dependencies
    pause
    exit /b 1
)

echo.
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)

echo.
echo Setup completed successfully!
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Run 'npm run seed' in the backend folder to seed the database
echo 3. Run 'npm run dev' in the backend folder to start the API server
echo 4. Run 'npm start' in the root folder to start the mobile app
echo.
echo Login credentials:
echo Admin: admin@contritok.com / admin123
echo User: user@contritok.com / user123
echo.
pause
