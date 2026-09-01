import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Auth from './components/Auth';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import './App.css';

const SOCKET_URL = 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (user) {
      const newSocket = io(SOCKET_URL);
      setSocket(newSocket);

      newSocket.emit('login', { username: user });

      newSocket.on('login_success', (data) => {
        setChannels(data.channels);
        setUsers(data.users);
        // Set default active chat to 'general' channel
        setActiveChat({ id: 'general', name: 'General', type: 'channel' });
      });

      newSocket.on('users_update', (updatedUsers) => {
        setUsers(updatedUsers);
      });

      newSocket.on('channel_created', (channel) => {
        setChannels((prev) => [...prev, channel]);
      });

      newSocket.on('new_message', (message) => {
        setMessages((prev) => [...prev, message]);
      });

      newSocket.on('message_history', (data) => {
        setMessages(data.messages);
      });

      newSocket.on('user_joined', (newUser) => {
        console.log('User joined:', newUser.username);
      });

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  useEffect(() => {
    if (socket && activeChat) {
      // Request message history when switching chats
      setMessages([]);
      socket.emit('get_messages', {
        chatId: activeChat.id,
        type: activeChat.type,
        recipientId: activeChat.type === 'direct' ? activeChat.id : null
      });
    }
  }, [activeChat, socket]);

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleSendMessage = (text) => {
    if (socket && activeChat && text.trim()) {
      socket.emit('send_message', {
        text: text.trim(),
        chatId: activeChat.id,
        type: activeChat.type,
        recipientId: activeChat.type === 'direct' ? activeChat.id : null
      });
    }
  };

  const handleCreateChannel = (channelName) => {
    if (socket && channelName.trim()) {
      socket.emit('create_channel', { name: channelName });
    }
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <ChatList
        channels={channels}
        users={users}
        activeChat={activeChat}
        onSelectChat={handleSelectChat}
        onCreateChannel={handleCreateChannel}
        currentUserId={socket?.id}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <ChatWindow
        activeChat={activeChat}
        messages={messages.filter(
          (msg) => msg.chatId === activeChat?.id
        )}
        onSendMessage={handleSendMessage}
        currentUser={user}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />
    </div>
  );
}

export default App;
