import React, { useState } from 'react';
import { Save, Edit2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SaveProjectPanelProps {
  projectName: string;
  onChangeProjectName: (name: string) => void;
  onSave: () => void;
}

const SaveProjectPanel: React.FC<SaveProjectPanelProps> = ({
  projectName,
  onChangeProjectName,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(projectName);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Handle save button click
  const handleSave = () => {
    setLastSaved(new Date());
    onSave();
  };
  
  // Handle name edit
  const handleEditComplete = () => {
    onChangeProjectName(editValue);
    setIsEditing(false);
  };
  
  // Format the last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return null;
    
    // Get time difference in minutes
    const diff = Math.floor((new Date().getTime() - lastSaved.getTime()) / 60000);
    
    if (diff < 1) return 'Just now';
    if (diff === 1) return '1 minute ago';
    if (diff < 60) return `${diff} minutes ago`;
    
    // Show hours
    const hours = Math.floor(diff / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    // Show days
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="h-8"
              autoFocus
            />
            <Button 
              size="sm" 
              variant="ghost" 
              className="px-2 shrink-0"
              onClick={handleEditComplete}
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <div className="flex-1">
              <h4 className="text-sm font-medium truncate">{projectName}</h4>
              {lastSaved && (
                <p className="text-xs text-muted-foreground">
                  Last saved: {formatLastSaved()}
                </p>
              )}
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              className="px-2 h-8"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </div>
      
      <Button 
        className="w-full"
        onClick={handleSave}
        disabled={isEditing}
      >
        <Save className="h-4 w-4 mr-2" />
        Save Project
      </Button>
    </div>
  );
};

export default SaveProjectPanel;