import { useState, useEffect, useCallback } from 'react';

// User type definition
export interface User {
  userId: number;
  username: string;
  isActive: boolean;
}

// Define project update message
export interface ProjectUpdateMessage {
  projectId: number;
  updates: Record<string, unknown>;
  userId: number;
  timestamp: string;
}

// Message format for sending/receiving
export interface WebSocketMessage {
  type: string;
  payload: unknown;
}

export function useArenaWebSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [projectUpdates, setProjectUpdates] = useState<ProjectUpdateMessage[]>([]);

  // Initialize WebSocket connection
  useEffect(() => {
    // Construct WebSocket URL based on current protocol (ws/wss)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    // Create new WebSocket connection
    const newSocket = new WebSocket(wsUrl);
    
    // Connection opened
    newSocket.addEventListener('open', () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
    });
    
    // Listen for messages
    newSocket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        const message: WebSocketMessage = {
          type: data.type,
          payload: data.payload
        };
        
        setLastMessage(message);
        
        // Handle different message types
        switch (message.type) {
          case 'USER_PRESENCE':
            const users = message.payload as User[];
            if (Array.isArray(users)) {
              setActiveUsers(users);
            }
            break;
          case 'PROJECT_UPDATE':
            const update = message.payload as ProjectUpdateMessage;
            if (update && typeof update === 'object' && 'projectId' in update) {
              setProjectUpdates(prev => [...prev, update]);
            }
            break;
          default:
            console.log('Unhandled message type:', message.type);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    // Connection closed
    newSocket.addEventListener('close', () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
    });
    
    // Connection error
    newSocket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });
    
    // Set socket in state
    setSocket(newSocket);
    
    // Clean up on unmount
    return () => {
      newSocket.close();
    };
  }, []);
  
  // Send message function
  const sendMessage = useCallback((type: string, payload: Record<string, unknown>) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = { 
        type, 
        payload 
      };
      socket.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, [socket]);
  
  // Update project function
  const updateProject = useCallback((projectId: number, updates: Record<string, unknown>) => {
    return sendMessage('PROJECT_UPDATE', {
      projectId,
      updates,
      userId: 1, // Default to user 1 for demo purposes
      timestamp: new Date().toISOString()
    });
  }, [sendMessage]);
  
  // Update user presence
  const updatePresence = useCallback((projectId: number, status: 'active' | 'idle' | 'offline') => {
    return sendMessage('USER_PRESENCE', {
      projectId,
      status,
      timestamp: new Date().toISOString()
    });
  }, [sendMessage]);
  
  return {
    isConnected,
    lastMessage,
    activeUsers,
    projectUpdates,
    sendMessage,
    updateProject,
    updatePresence
  };
}