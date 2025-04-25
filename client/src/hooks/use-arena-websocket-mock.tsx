import { useState, useEffect, useCallback } from 'react';

interface Message {
  data: string;
}

interface MockWebSocketHook {
  isConnected: boolean;
  sendMessage: (message: string) => void;
  lastMessage: Message | null;
}

// Mock implementation of websocket
export function useArenaWebSocketMock(): MockWebSocketHook {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<Message | null>(null);

  // Connect on mount
  useEffect(() => {
    console.log('Mock WebSocket: Connecting...');
    
    // Simulate connection delay
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
      console.log('Mock WebSocket: Connected');
      console.log('WebSocket connection established');
      
      // Send connection message
      setLastMessage({
        data: JSON.stringify({
          type: 'CONNECTED',
          payload: {
            timestamp: new Date().toISOString()
          }
        })
      });
      
      // Simulate other users in the system
      simulateUsers();
    }, 500);
    
    return () => {
      clearTimeout(connectTimer);
      console.log('Mock WebSocket: Disconnecting...');
      console.log('WebSocket connection closed');
      setIsConnected(false);
    };
  }, []);
  
  // Simulate other users sending cursor updates
  const simulateUsers = () => {
    const usernames = ['Alex', 'Priya', 'Raj'];
    
    // Simulate random cursor movements for each user
    usernames.forEach((username, index) => {
      // Start after a random delay
      setTimeout(() => {
        const interval = setInterval(() => {
          if (Math.random() > 0.7) {
            // Generate a random cursor position
            const position = {
              x: Math.floor(Math.random() * 500),
              y: Math.floor(Math.random() * 300)
            };
            
            const action = Math.random() > 0.3 ? 'viewing' : 'editing';
            
            const cursorUpdate = {
              username,
              position,
              action,
              timestamp: new Date().toISOString()
            };
            
            console.log('Cursor position update:', cursorUpdate);
          }
        }, 10000 + (index * 5000)); // Different interval for each user
        
        return () => clearInterval(interval);
      }, 1000 * (index + 1));
    });
  };
  
  // Send a message
  const sendMessage = useCallback((message: string) => {
    if (!isConnected) {
      console.warn('Cannot send message, WebSocket is not connected');
      return;
    }
    
    console.log('Sending message:', message);
    
    // Echo the message back after a delay to simulate response
    setTimeout(() => {
      setLastMessage({ data: message });
    }, 200);
  }, [isConnected]);

  return {
    isConnected,
    sendMessage,
    lastMessage
  };
}