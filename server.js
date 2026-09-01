const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
const users = new Map();
const messages = [];
const channels = new Map();
const directMessages = new Map();

// Default channels
channels.set('general', {
  id: 'general',
  name: 'General',
  type: 'channel',
  members: [],
  messages: []
});

channels.set('random', {
  id: 'random',
  name: 'Random',
  type: 'channel',
  members: [],
  messages: []
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // User authentication
  socket.on('login', (userData) => {
    const user = {
      id: socket.id,
      username: userData.username,
      online: true,
      lastSeen: new Date()
    };
    users.set(socket.id, user);

    // Join all channels by default
    channels.forEach((channel) => {
      if (channel.type === 'channel') {
        socket.join(channel.id);
        channel.members.push(socket.id);
      }
    });

    socket.emit('login_success', {
      user,
      channels: Array.from(channels.values()),
      users: Array.from(users.values())
    });

    // Broadcast user joined to all clients
    io.emit('user_joined', user);
    io.emit('users_update', Array.from(users.values()));
  });

  // Send message
  socket.on('send_message', (data) => {
    const user = users.get(socket.id);
    if (!user) return;

    const message = {
      id: Date.now() + Math.random(),
      text: data.text,
      sender: user.username,
      senderId: socket.id,
      timestamp: new Date(),
      chatId: data.chatId,
      type: data.type // 'channel' or 'direct'
    };

    if (data.type === 'channel') {
      const channel = channels.get(data.chatId);
      if (channel) {
        channel.messages.push(message);
        io.to(data.chatId).emit('new_message', message);
      }
    } else if (data.type === 'direct') {
      // Direct message
      const dmKey = [socket.id, data.recipientId].sort().join('-');
      if (!directMessages.has(dmKey)) {
        directMessages.set(dmKey, []);
      }
      directMessages.get(dmKey).push(message);

      // Send to both sender and recipient
      socket.emit('new_message', message);
      io.to(data.recipientId).emit('new_message', message);
    }
  });

  // Create new channel/group
  socket.on('create_channel', (data) => {
    const channelId = Date.now().toString();
    const channel = {
      id: channelId,
      name: data.name,
      type: 'channel',
      members: [socket.id],
      messages: [],
      createdBy: socket.id,
      createdAt: new Date()
    };

    channels.set(channelId, channel);
    socket.join(channelId);

    io.emit('channel_created', channel);
  });

  // Join channel
  socket.on('join_channel', (channelId) => {
    const channel = channels.get(channelId);
    if (channel && !channel.members.includes(socket.id)) {
      channel.members.push(socket.id);
      socket.join(channelId);

      io.to(channelId).emit('user_joined_channel', {
        channelId,
        userId: socket.id,
        username: users.get(socket.id)?.username
      });
    }
  });

  // Get message history
  socket.on('get_messages', (data) => {
    if (data.type === 'channel') {
      const channel = channels.get(data.chatId);
      if (channel) {
        socket.emit('message_history', {
          chatId: data.chatId,
          messages: channel.messages
        });
      }
    } else if (data.type === 'direct') {
      const dmKey = [socket.id, data.recipientId].sort().join('-');
      const messages = directMessages.get(dmKey) || [];
      socket.emit('message_history', {
        chatId: data.chatId,
        messages
      });
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    if (data.type === 'channel') {
      socket.to(data.chatId).emit('user_typing', {
        chatId: data.chatId,
        username: users.get(socket.id)?.username
      });
    } else {
      io.to(data.recipientId).emit('user_typing', {
        chatId: data.chatId,
        username: users.get(socket.id)?.username
      });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      user.online = false;
      user.lastSeen = new Date();

      // Remove from channel members
      channels.forEach(channel => {
        channel.members = channel.members.filter(id => id !== socket.id);
      });

      io.emit('user_left', user);
      io.emit('users_update', Array.from(users.values()));
    }
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
