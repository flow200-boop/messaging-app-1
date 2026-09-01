# 💬 MessagingApp

A real-time messaging application built with React and Socket.IO, featuring one-on-one messaging, group chats, and user authentication.

## Features

✨ **Real-time Messaging** - Instant message delivery using WebSocket (Socket.IO)
👤 **User Authentication** - Simple login/signup system
💬 **One-on-One Messaging** - Direct messages between users
👥 **Group Chats/Channels** - Create and join multiple channels
📱 **Mobile-Responsive** - Optimized for mobile and desktop
💾 **Message History** - All messages are stored and loaded on demand
🎨 **Modern UI** - Clean, intuitive interface with smooth animations

## Tech Stack

- **Frontend**: React, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO
- **Styling**: Custom CSS with mobile-first design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Navigate to the project directory:
```bash
cd messaging-app
```

2. Dependencies are already installed!

### Running the Application

You need to run **both** the backend server and the React app:

#### Terminal 1 - Start the Backend Server:
```bash
npm run server
```
The server will start on `http://localhost:3001`

#### Terminal 2 - Start the React App:
```bash
npm start
```
The app will open in your browser at `http://localhost:3000`

### Usage

1. **Login**: Enter a username to log in (no password required for this demo)
2. **Channels**: Click on "# Channels" tab to view and join channels
   - Default channels: General, Random
   - Click "+" to create a new channel
3. **Direct Messages**: Click on "👤 Direct Messages" tab to see online users
   - Click on any user to start a direct conversation
4. **Send Messages**: Type your message and press Enter or click the send button
5. **Mobile**: On mobile devices, use the menu button (☰) to toggle the sidebar

## Project Structure

```
messaging-app/
├── src/
│   ├── components/
│   │   ├── Auth.js              # Login/Signup component
│   │   ├── Auth.css
│   │   ├── ChatList.js          # Sidebar with channels and users
│   │   ├── ChatList.css
│   │   ├── ChatWindow.js        # Main chat interface
│   │   └── ChatWindow.css
│   ├── App.js                   # Main app component
│   ├── App.css
│   └── index.js
├── server.js                     # Backend WebSocket server
└── package.json
```

## Features in Detail

### Authentication
- Simple username-based login
- Users are stored in memory (resets on server restart)
- Online/offline status tracking

### Channels
- Public channels visible to all users
- Create custom channels
- Real-time member count
- Message history per channel

### Direct Messages
- Private one-on-one conversations
- Online status indicators
- Persistent message history

### Real-time Updates
- Instant message delivery
- User join/leave notifications
- Typing indicators (backend ready)
- Online status updates

## Future Enhancements

- 🔐 Proper authentication with passwords
- 💾 Database integration (MongoDB/PostgreSQL)
- 🖼️ Image and file sharing
- 🔍 Message search
- 📝 Message editing and deletion
- ⚡ Typing indicators (UI)
- 🔔 Notifications
- 😊 Emoji picker
- 🌙 Dark mode
- 📌 Pin messages
- 👍 Message reactions

## Notes

- This is a demo application. Messages are stored in memory and will be lost on server restart.
- For production use, implement:
  - Proper authentication and authorization
  - Database for persistent storage
  - Rate limiting and input validation
  - HTTPS/WSS for secure connections
  - User profile management

## License

MIT

---

Built with ❤️ using React and Socket.IO
