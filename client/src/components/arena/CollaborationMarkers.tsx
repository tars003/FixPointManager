import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, MessageSquare, Edit, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CollaboratorData {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  color: string;
  position?: { x: number; y: number };
  action?: 'viewing' | 'editing' | 'commenting';
  lastActivity: Date;
  area?: string;
}

interface CollaborationMarkersProps {
  projectId: string;
  onSendMarker?: (position: { x: number; y: number }, action: string) => void;
}

const CollaborationMarkers: React.FC<CollaborationMarkersProps> = ({
  projectId,
  onSendMarker
}) => {
  const { toast } = useToast();
  const [collaborators, setCollaborators] = useState<CollaboratorData[]>([
    {
      id: 'user1',
      name: 'John Doe',
      initials: 'JD',
      color: '#4F46E5',
      position: { x: 250, y: 150 },
      action: 'editing',
      lastActivity: new Date(),
      area: 'Front Bumper'
    },
    {
      id: 'user2',
      name: 'Alice Smith',
      avatar: 'https://ui-avatars.com/api/?name=Alice+Smith&background=random',
      initials: 'AS',
      color: '#0EA5E9',
      position: { x: 150, y: 300 },
      action: 'viewing',
      lastActivity: new Date(),
      area: 'Side Panel'
    },
    {
      id: 'user3',
      name: 'Mark Johnson',
      initials: 'MJ',
      color: '#10B981',
      position: { x: 400, y: 200 },
      action: 'commenting',
      lastActivity: new Date(),
      area: 'Roof Wrap'
    }
  ]);
  
  const [showActiveUsers, setShowActiveUsers] = useState(false);
  const [isTrackingMouse, setIsTrackingMouse] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentUserAction, setCurrentUserAction] = useState<'viewing' | 'editing' | 'commenting'>('viewing');
  
  // Listen for mouse movements when tracking is active
  useEffect(() => {
    if (!isTrackingMouse) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Get position relative to the design canvas
      const canvas = document.getElementById('design-canvas');
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setMousePosition({ x, y });
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTrackingMouse]);
  
  // Send cursor position update every 500ms when tracking
  useEffect(() => {
    if (!isTrackingMouse) return;
    
    const intervalId = setInterval(() => {
      if (onSendMarker) {
        onSendMarker(mousePosition, currentUserAction);
      }
      
      // Update local state for current user (for demonstration)
      updateCurrentUserPosition(mousePosition);
    }, 500);
    
    return () => clearInterval(intervalId);
  }, [isTrackingMouse, mousePosition, currentUserAction, onSendMarker]);
  
  // Update current user position in collaborators array
  const updateCurrentUserPosition = (position: { x: number; y: number }) => {
    // In a real app, you would use the actual user ID
    const currentUserId = 'currentUser';
    
    setCollaborators(prev => {
      const existingUserIndex = prev.findIndex(c => c.id === currentUserId);
      
      if (existingUserIndex >= 0) {
        // Update existing user
        const updatedCollaborators = [...prev];
        updatedCollaborators[existingUserIndex] = {
          ...updatedCollaborators[existingUserIndex],
          position,
          lastActivity: new Date(),
          action: currentUserAction
        };
        return updatedCollaborators;
      } else {
        // Add current user
        return [
          ...prev,
          {
            id: currentUserId,
            name: 'You',
            initials: 'YO',
            color: '#EF4444',
            position,
            action: currentUserAction,
            lastActivity: new Date()
          }
        ];
      }
    });
  };
  
  // Toggle cursor tracking
  const toggleCursorTracking = () => {
    setIsTrackingMouse(prev => !prev);
    
    if (!isTrackingMouse) {
      toast({
        title: "Cursor sharing enabled",
        description: "Other collaborators can see your cursor position",
      });
    } else {
      toast({
        title: "Cursor sharing disabled",
        description: "Your cursor is no longer visible to others",
      });
    }
  };
  
  // Set the current user action
  const setAction = (action: 'viewing' | 'editing' | 'commenting') => {
    setCurrentUserAction(action);
    
    if (isTrackingMouse && onSendMarker) {
      onSendMarker(mousePosition, action);
    }
  };
  
  // Get icon based on action
  const getActionIcon = (action: CollaboratorData['action']) => {
    switch (action) {
      case 'editing':
        return <Edit className="h-3 w-3" />;
      case 'commenting':
        return <MessageSquare className="h-3 w-3" />;
      case 'viewing':
      default:
        return <Eye className="h-3 w-3" />;
    }
  };
  
  return (
    <div className="relative">
      {/* Active users button */}
      <div className="relative">
        <Badge 
          variant="outline" 
          className="cursor-pointer hover:bg-muted flex items-center gap-1 pr-2"
          onClick={() => setShowActiveUsers(!showActiveUsers)}
        >
          <Users className="h-3.5 w-3.5 mr-0.5" />
          <span>{collaborators.length} Active</span>
        </Badge>
        
        {/* Dropdown for active users */}
        <AnimatePresence>
          {showActiveUsers && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full right-0 mt-1 bg-card border rounded-lg shadow-md p-3 z-30 w-64"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Active Collaborators</h3>
                <Badge variant="outline" className="text-xs">{collaborators.length}</Badge>
              </div>
              
              <div className="max-h-60 overflow-y-auto space-y-2">
                {collaborators.map(collaborator => (
                  <div 
                    key={collaborator.id} 
                    className="flex items-center justify-between bg-muted/30 p-2 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 ring-1 ring-muted-foreground/20">
                        {collaborator.avatar ? (
                          <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                        ) : (
                          <AvatarFallback style={{ backgroundColor: collaborator.color }}>
                            <span className="text-xs text-white">{collaborator.initials}</span>
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="text-sm">{collaborator.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground mr-1">
                        {collaborator.action || 'viewing'}
                      </span>
                      {getActionIcon(collaborator.action)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t mt-3 pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <Badge 
                      variant={currentUserAction === 'viewing' ? 'default' : 'outline'} 
                      className="cursor-pointer text-xs gap-1 py-0"
                      onClick={() => setAction('viewing')}
                    >
                      <Eye className="h-3 w-3" />
                      <span>Viewing</span>
                    </Badge>
                    <Badge 
                      variant={currentUserAction === 'editing' ? 'default' : 'outline'} 
                      className="cursor-pointer text-xs gap-1 py-0"
                      onClick={() => setAction('editing')}
                    >
                      <Edit className="h-3 w-3" />
                      <span>Editing</span>
                    </Badge>
                    <Badge 
                      variant={currentUserAction === 'commenting' ? 'default' : 'outline'} 
                      className="cursor-pointer text-xs gap-1 py-0"
                      onClick={() => setAction('commenting')}
                    >
                      <MessageSquare className="h-3 w-3" />
                      <span>Commenting</span>
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <Badge 
                    variant={isTrackingMouse ? 'default' : 'outline'} 
                    className={`cursor-pointer text-xs w-full justify-center ${isTrackingMouse ? 'bg-green-500 hover:bg-green-600' : ''}`}
                    onClick={toggleCursorTracking}
                  >
                    {isTrackingMouse ? 'Cursor Sharing On' : 'Share Cursor Position'}
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Canvas overlay with cursor markers */}
      <div 
        id="design-canvas-markers" 
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 50 }}
      >
        {collaborators.map((collaborator) => (
          collaborator.position && (
            <TooltipProvider key={collaborator.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute pointer-events-auto cursor-pointer"
                    style={{
                      left: `${collaborator.position.x}px`,
                      top: `${collaborator.position.y}px`,
                    }}
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8 ring-2 ring-background shadow-md">
                        {collaborator.avatar ? (
                          <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                        ) : (
                          <AvatarFallback style={{ backgroundColor: collaborator.color }}>
                            <span className="text-xs text-white">{collaborator.initials}</span>
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div 
                        className="absolute -top-1 -right-1 rounded-full p-0.5 text-white"
                        style={{ backgroundColor: collaborator.color }}
                      >
                        {getActionIcon(collaborator.action)}
                      </div>
                      {collaborator.action === 'editing' && (
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 0.8, 0.5]
                          }}
                          transition={{ 
                            repeat: Infinity,
                            duration: 2
                          }}
                          className="absolute -inset-2 rounded-full"
                          style={{ 
                            border: `2px solid ${collaborator.color}`,
                            zIndex: -1
                          }}
                        />
                      )}
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <div className="font-medium">{collaborator.name}</div>
                    <div className="text-muted-foreground capitalize">
                      {collaborator.action || 'viewing'} 
                      {collaborator.area && ` - ${collaborator.area}`}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        ))}
      </div>
    </div>
  );
};

export default CollaborationMarkers;