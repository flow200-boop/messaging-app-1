import React, { useState, useEffect, useRef } from 'react';
import './ChatWindow.css';

function ChatWindow({ activeChat, messages, onSendMessage, currentUser, onMenuClick }) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, activeChat]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
      inputRef.current?.focus();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((msg) => {
      const dateKey = new Date(msg.timestamp).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });
    return groups;
  };

  if (!activeChat) {
    return (
      <div className="chat-window">
        <div className="empty-chat">
          <div className="empty-chat-icon">💬</div>
          <h2>Welcome to MessagingApp</h2>
          <p>Select a channel or user to start messaging</p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <button className="menu-toggle" onClick={onMenuClick}>
          ☰
        </button>
        <div className="chat-header-info">
          <div className="chat-header-icon">
            {activeChat.type === 'channel' ? '#' : activeChat.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3>{activeChat.name}</h3>
            {activeChat.type === 'channel' && (
              <span className="chat-header-meta">Channel</span>
            )}
          </div>
        </div>
      </div>

      <div className="messages-container">
        {Object.keys(messageGroups).length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          Object.entries(messageGroups).map(([dateKey, dateMessages]) => (
            <div key={dateKey}>
              <div className="date-divider">
                <span>{formatDate(dateMessages[0].timestamp)}</span>
              </div>
              {dateMessages.map((message) => {
                const isOwnMessage = message.sender === currentUser;
                return (
                  <div
                    key={message.id}
                    className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}
                  >
                    {!isOwnMessage && (
                      <div className="message-avatar">
                        {message.sender.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="message-content">
                      {!isOwnMessage && (
                        <div className="message-sender">{message.sender}</div>
                      )}
                      <div className="message-bubble">
                        <p>{message.text}</p>
                        <span className="message-time">{formatTime(message.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="message-input-container">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${activeChat.name}`}
          className="message-input"
        />
        <button type="submit" className="send-button" disabled={!inputText.trim()}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 10L18 3L11 19L9 12L2 10Z" />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;
