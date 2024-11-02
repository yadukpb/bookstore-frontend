import React, { useState, useRef, useEffect } from "react";
import "./CSS/chat.css";

function Chat() {
  const [message, setMessage] = useState("");
  const [sellers, setSellers] = useState([
    { id: 1, name: "John Smith", lastSeen: "online", avatar: "/placeholder.jpg" },
    { id: 2, name: "Sarah Johnson", lastSeen: "2 min ago", avatar: "/placeholder.jpg" },
    { id: 3, name: "Mike Williams", lastSeen: "1 hour ago", avatar: "/placeholder.jpg" },
  ]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [chatHistory, setChatHistory] = useState({});
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const chatBoxRef = useRef(null);

  // Initialize chat history for each seller
  useEffect(() => {
    const initialChats = {};
    sellers.forEach(seller => {
      initialChats[seller.id] = [
        {
          id: 1,
          text: "Hello there!",
          sender: seller.id,
          timestamp: new Date().toLocaleTimeString(),
          status: "read"
        }
      ];
    });
    setChatHistory(initialChats);
  }, []);

  const sendMessage = () => {
    if (message.trim() && selectedSeller) {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: "user",
        timestamp: new Date().toLocaleTimeString(),
        status: "sent"
      };

      setChatHistory(prev => ({
        ...prev,
        [selectedSeller.id]: [...(prev[selectedSeller.id] || []), newMessage]
      }));
      setMessage("");

      // Simulate seller response
      setTimeout(() => {
        const response = {
          id: Date.now() + 1,
          text: "Thanks for your message! I'll get back to you soon.",
          sender: selectedSeller.id,
          timestamp: new Date().toLocaleTimeString(),
          status: "received"
        };
        
        setChatHistory(prev => ({
          ...prev,
          [selectedSeller.id]: [...(prev[selectedSeller.id] || []), response]
        }));
      }, 1000);
    }
  };

  const handleMessageSelect = (messageId) => {
    if (selectedMessages.includes(messageId)) {
      setSelectedMessages(prev => prev.filter(id => id !== messageId));
    } else {
      setSelectedMessages(prev => [...prev, messageId]);
    }
  };

  const deleteSelectedMessages = () => {
    if (selectedSeller) {
      setChatHistory(prev => ({
        ...prev,
        [selectedSeller.id]: prev[selectedSeller.id].filter(
          msg => !selectedMessages.includes(msg.id)
        )
      }));
      setSelectedMessages([]);
    }
  };

  return (
    <div className="chat-container">
      {/* Sellers Sidebar */}
      <div className="sellers-sidebar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search sellers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="sellers-list">
          {sellers
            .filter(seller => 
              seller.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(seller => (
              <div
                key={seller.id}
                className={`seller-item ${selectedSeller?.id === seller.id ? 'selected' : ''}`}
                onClick={() => setSelectedSeller(seller)}
              >
                <img src={seller.avatar} alt={seller.name} className="seller-avatar" />
                <div className="seller-info">
                  <div className="seller-name">{seller.name}</div>
                  <div className="seller-status">{seller.lastSeen}</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {selectedSeller ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="selected-seller-info">
                <img src={selectedSeller.avatar} alt={selectedSeller.name} className="seller-avatar" />
                <div className="seller-details">
                  <div className="seller-name">{selectedSeller.name}</div>
                  <div className="seller-status">{selectedSeller.lastSeen}</div>
                </div>
              </div>
              <div className="chat-actions">
                <button className="action-button">⋮</button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="messages-container" ref={chatBoxRef}>
              {chatHistory[selectedSeller.id]?.map(msg => (
                <div
                  key={msg.id}
                  className={`message-wrapper ${msg.sender === 'user' ? 'sent' : 'received'}`}
                  onMouseDown={() => handleMessageSelect(msg.id)}
                >
                  <div className={`message ${selectedMessages.includes(msg.id) ? 'selected' : ''}`}>
                    <p className="message-text">{msg.text}</p>
                    <div className="message-info">
                      <span className="message-time">{msg.timestamp}</span>
                      {msg.sender === 'user' && (
                        <span className="message-status">{msg.status}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="input-area">
              {selectedMessages.length > 0 && (
                <div className="selection-actions">
                  <span>{selectedMessages.length} selected</span>
                  <button onClick={deleteSelectedMessages} className="delete-button">
                    Delete
                  </button>
                </div>
              )}
              <div className="message-input-container">
                <button className="attachment-button">📎</button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="message-input"
                />
                <button onClick={sendMessage} className="send-button">
                  ➤
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            Select a seller to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;