import { useState, useEffect, useCallback } from 'react';

// Define message types
export interface WebSocketMessage {
  type: string;
  payload: any;
}

export interface ProjectUpdateMessage {
  projectId: number;
  updates: any;
  userId: number;
  timestamp: string;
}

export function useArenaWebSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [activeUsers, setActiveUsers] = useState<{ userId: number; username: string; isActive: boolean }[]>([]);
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
      const message = JSON.parse(event.data) as WebSocketMessage;
      setLastMessage(message);
      
      // Handle different message types
      switch (message.type) {
        case 'USER_PRESENCE':
          setActiveUsers(message.payload);
          break;
        case 'PROJECT_UPDATE':
          setProjectUpdates(prev => [...prev, message.payload]);
          break;
        default:
          console.log('Unhandled message type:', message.type);
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
  const sendMessage = useCallback((type: string, payload: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = { type, payload };
      socket.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, [socket]);
  
  // Update project function
  const updateProject = useCallback((projectId: number, updates: any) => {
    return sendMessage('PROJECT_UPDATE', {
      projectId,
      updates,
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