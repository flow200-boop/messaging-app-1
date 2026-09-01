@echo off
echo Starting MessagingApp...
echo.
echo Starting Backend Server...
start "MessagingApp Server" cmd /k "npm run server"
timeout /t 3 /nobreak > nul
echo.
echo Starting React App...
start "MessagingApp Client" cmd /k "npm start"
echo.
echo Both servers are starting!
echo Server: http://localhost:3001
echo Client: http://localhost:3000
echo.
echo Press any key to exit this window...
pause > nul
