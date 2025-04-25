import { useState, useCallback, useEffect } from 'react';

// Mock WebSocket implementation for demo purposes
export function useArenaWebSocketMock() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<{ data: string } | null>(null);
  
  // Mock connect function
  const connect = useCallback(() => {
    console.log('Mock WebSocket: Connecting...');
    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true);
      console.log('Mock WebSocket: Connected');
      
      // Simulate a connection message
      const joinMessage = {
        type: 'SYSTEM',
        payload: {
          message: 'Connection established',
          timestamp: new Date().toISOString()
        }
      };
      
      setLastMessage({ data: JSON.stringify(joinMessage) });
    }, 1000);
  }, []);
  
  // Mock disconnect function
  const disconnect = useCallback(() => {
    console.log('Mock WebSocket: Disconnecting...');
    setIsConnected(false);
  }, []);
  
  // Mock send function
  const sendMessage = useCallback((message: string) => {
    if (!isConnected) {
      console.warn('Mock WebSocket: Cannot send message, not connected');
      return;
    }
    
    console.log('Mock WebSocket: Sending message', message);
    
    // For demo purposes, we'll echo the message back
    const data = JSON.parse(message);
    
    // Simulate server response
    setTimeout(() => {
      if (data.type === 'PROJECT_CREATED') {
        const response = {
          type: 'PROJECT_CREATED_ACK',
          payload: {
            ...data.payload,
            status: 'success',
            message: 'Project created successfully',
            timestamp: new Date().toISOString()
          }
        };
        
        setLastMessage({ data: JSON.stringify(response) });
      } else if (data.type === 'CURSOR_POSITION') {
        // Just acknowledge receipt for cursor positions
        console.log('Mock WebSocket: Received cursor position', data.payload);
      } else {
        // Generic acknowledgement
        const response = {
          type: `${data.type}_ACK`,
          payload: {
            ...data.payload,
            status: 'received',
            timestamp: new Date().toISOString()
          }
        };
        
        setLastMessage({ data: JSON.stringify(response) });
      }
    }, 300);
    
    return true;
  }, [isConnected]);
  
  // Simulate occasional user activity
  useEffect(() => {
    if (!isConnected) return;
    
    const userNames = ['Alex', 'Priya', 'Raj', 'Sofia'];
    const actionTypes = ['joined', 'left', 'updated'];
    
    const interval = setInterval(() => {
      // Only send occasional messages (20% chance)
      if (Math.random() > 0.8) {
        const userName = userNames[Math.floor(Math.random() * userNames.length)];
        const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)];
        
        let message;
        
        if (actionType === 'joined') {
          message = {
            type: 'USER_JOINED',
            payload: {
              username: userName,
              timestamp: new Date().toISOString()
            }
          };
        } else if (actionType === 'left') {
          message = {
            type: 'USER_LEFT',
            payload: {
              username: userName,
              timestamp: new Date().toISOString()
            }
          };
        } else {
          message = {
            type: 'CURSOR_POSITION',
            payload: {
              username: userName,
              position: {
                x: Math.floor(Math.random() * 500),
                y: Math.floor(Math.random() * 300)
              },
              action: Math.random() > 0.5 ? 'editing' : 'viewing',
              timestamp: new Date().toISOString()
            }
          };
        }
        
        setLastMessage({ data: JSON.stringify(message) });
      }
    }, 10000); // Send a message every 10 seconds
    
    return () => clearInterval(interval);
  }, [isConnected]);
  
  return {
    connect,
    disconnect,
    sendMessage,
    lastMessage,
    readyState: isConnected ? 1 : 0,
    isConnected
  };
}

export default useArenaWebSocketMock;