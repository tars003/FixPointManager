import React, { useEffect, useState } from 'react';
import {
  Alert,
  AlertTitle,
  AlertDescription
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Wifi, 
  WifiOff, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Clock
} from 'lucide-react';
import { useArenaWebSocket, User } from '@/hooks/use-arena-websocket';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ArenaWrapperProps {
  children: React.ReactNode;
  projectId?: number;
}

const ArenaWrapper: React.FC<ArenaWrapperProps> = ({ children, projectId }) => {
  const { toast } = useToast();
  const { 
    isConnected, 
    activeUsers, 
    updatePresence, 
    lastMessage 
  } = useArenaWebSocket();
  
  const [showConnectionAlert, setShowConnectionAlert] = useState(false);
  
  // Handle WebSocket connection status
  useEffect(() => {
    if (isConnected) {
      // Join project room if project ID is provided
      if (projectId) {
        updatePresence(projectId, 'active');
        
        // Check for active users every 30 seconds
        const interval = setInterval(() => {
          updatePresence(projectId, 'active');
        }, 30000);
        
        return () => {
          clearInterval(interval);
          // Leave project room on unmount
          updatePresence(projectId, 'offline');
        };
      }
    } else {
      setShowConnectionAlert(true);
      
      // Hide alert after 5 seconds
      const timeout = setTimeout(() => {
        setShowConnectionAlert(false);
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [isConnected, projectId, updatePresence]);
  
  // Show notification on user join/leave
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'USER_PRESENCE') {
      const users = lastMessage.payload as User[];
      
      // Check if there's a newly active user
      const newUser = users.find(u => 
        !activeUsers.some(existingUser => 
          existingUser.userId === u.userId && existingUser.isActive
        ) && u.isActive
      );
      
      if (newUser) {
        toast({
          title: "User Joined",
          description: `${newUser.username} has joined the workspace.`,
        });
      }
      
      // Check if a user went offline
      const offlineUser = activeUsers.find(u => 
        u.isActive && !users.some(newUser => 
          newUser.userId === u.userId && newUser.isActive
        )
      );
      
      if (offlineUser) {
        toast({
          title: "User Left",
          description: `${offlineUser.username} has left the workspace.`,
          variant: "default",
        });
      }
    }
  }, [lastMessage, activeUsers, toast]);
  
  return (
    <div className="relative">
      {/* Connection status alert */}
      <AnimatePresence>
        {showConnectionAlert && !isConnected && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"
          >
            <Alert variant="destructive">
              <WifiOff className="h-4 w-4" />
              <AlertTitle>Connection Lost</AlertTitle>
              <AlertDescription>
                The real-time connection has been lost. Trying to reconnect...
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Active users panel (shown when in a project) */}
      {projectId && (
        <div className="bg-card rounded-lg border mb-4 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500">
                  <Wifi className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Disconnected
                </Badge>
              )}
              
              <Badge variant="outline">
                <Users className="h-3 w-3 mr-1" />
                {activeUsers.length} {activeUsers.length === 1 ? 'User' : 'Users'} Online
              </Badge>
              
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                Last Updated: {new Date().toLocaleTimeString()}
              </Badge>
            </div>
            
            {activeUsers.length > 0 && (
              <div className="flex -space-x-2">
                {activeUsers.slice(0, 5).map((user, index) => (
                  <div 
                    key={user.userId}
                    className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-medium border-2 border-background"
                    title={user.username}
                  >
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                ))}
                {activeUsers.length > 5 && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                    +{activeUsers.length - 5}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {activeUsers.length > 0 && (
            <>
              <Separator className="my-2" />
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Collaborators: </span>
                {activeUsers.map((user, index) => (
                  <span key={user.userId}>
                    {user.username}
                    {user.isActive && (
                      <CheckCircle2 className="h-3 w-3 inline text-green-500 ml-0.5" />
                    )}
                    {index < activeUsers.length - 1 && ", "}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Main content */}
      {children}
    </div>
  );
};

export default ArenaWrapper;