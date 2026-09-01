import React, { useState } from 'react';
import './ChatList.css';

function ChatList({ channels, users, activeChat, onSelectChat, onCreateChannel, currentUserId, isOpen, onToggle }) {
  const [showNewChannelModal, setShowNewChannelModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [activeTab, setActiveTab] = useState('channels');

  const handleCreateChannel = (e) => {
    e.preventDefault();
    if (newChannelName.trim()) {
      onCreateChannel(newChannelName);
      setNewChannelName('');
      setShowNewChannelModal(false);
    }
  };

  const otherUsers = users.filter(u => u.id !== currentUserId);

  return (
    <>
      <div className={`chat-list ${isOpen ? 'open' : 'closed'}`}>
        <div className="chat-list-header">
          <h2>💬 MessagingApp</h2>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'channels' ? 'active' : ''}`}
            onClick={() => setActiveTab('channels')}
          >
            # Channels
          </button>
          <button
            className={`tab ${activeTab === 'direct' ? 'active' : ''}`}
            onClick={() => setActiveTab('direct')}
          >
            👤 Direct Messages
          </button>
        </div>

        {activeTab === 'channels' && (
          <div className="chat-section">
            <div className="section-header">
              <h3>Channels</h3>
              <button
                className="btn-icon"
                onClick={() => setShowNewChannelModal(true)}
                title="Create channel"
              >
                +
              </button>
            </div>
            <div className="chat-items">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className={`chat-item ${activeChat?.id === channel.id ? 'active' : ''}`}
                  onClick={() => onSelectChat({ ...channel, type: 'channel' })}
                >
                  <div className="chat-item-icon">#</div>
                  <div className="chat-item-info">
                    <div className="chat-item-name">{channel.name}</div>
                    <div className="chat-item-meta">
                      {channel.members?.length || 0} members
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'direct' && (
          <div className="chat-section">
            <div className="section-header">
              <h3>Direct Messages</h3>
            </div>
            <div className="chat-items">
              {otherUsers.length === 0 ? (
                <div className="empty-state">No other users online</div>
              ) : (
                otherUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`chat-item ${activeChat?.id === user.id ? 'active' : ''}`}
                    onClick={() =>
                      onSelectChat({
                        id: user.id,
                        name: user.username,
                        type: 'direct'
                      })
                    }
                  >
                    <div className="chat-item-avatar">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="chat-item-info">
                      <div className="chat-item-name">{user.username}</div>
                      <div className="chat-item-meta">
                        <span className={`status-dot ${user.online ? 'online' : 'offline'}`}></span>
                        {user.online ? 'Online' : 'Offline'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {showNewChannelModal && (
        <div className="modal-overlay" onClick={() => setShowNewChannelModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Channel</h3>
              <button
                className="btn-close"
                onClick={() => setShowNewChannelModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateChannel} className="modal-body">
              <div className="form-group">
                <label htmlFor="channelName">Channel Name</label>
                <input
                  type="text"
                  id="channelName"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="e.g., team-updates"
                  autoFocus
                  required
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowNewChannelModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatList;
