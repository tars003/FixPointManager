import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoveHorizontal, RotateCcw, Plus, Minus, Check } from 'lucide-react';

interface CustomizationPart {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number };
  rotation: number;
  scale: number;
  color: string;
  active: boolean;
}

interface DraggableCustomizerProps {
  vehicleBaseImage?: string;
  vehicleEmoji: string;
  vehicleColor: string;
  availableParts: CustomizationPart[];
  onPartChange: (part: CustomizationPart) => void;
}

const DraggableCustomizer: React.FC<DraggableCustomizerProps> = ({
  vehicleBaseImage,
  vehicleEmoji,
  vehicleColor,
  availableParts = [],
  onPartChange
}) => {
  const [parts, setParts] = useState<CustomizationPart[]>(availableParts);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(false);
  
  // Function to handle drag end and update the part position
  const handleDragEnd = (info: any, partId: string) => {
    const newParts = parts.map(part => {
      if (part.id === partId) {
        const updatedPart = {
          ...part,
          position: {
            x: part.position.x + info.offset.x,
            y: part.position.y + info.offset.y
          }
        };
        onPartChange(updatedPart);
        return updatedPart;
      }
      return part;
    });
    
    setParts(newParts);
  };
  
  // Select a part for editing
  const handleSelectPart = (partId: string) => {
    setSelectedPartId(partId === selectedPartId ? null : partId);
    setShowControls(partId !== selectedPartId);
  };
  
  // Rotate the selected part
  const handleRotate = (direction: 'clockwise' | 'counterclockwise') => {
    if (!selectedPartId) return;
    
    const rotationAmount = direction === 'clockwise' ? 15 : -15;
    
    const newParts = parts.map(part => {
      if (part.id === selectedPartId) {
        const updatedPart = {
          ...part,
          rotation: part.rotation + rotationAmount
        };
        onPartChange(updatedPart);
        return updatedPart;
      }
      return part;
    });
    
    setParts(newParts);
  };
  
  // Scale the selected part
  const handleScale = (scaleUp: boolean) => {
    if (!selectedPartId) return;
    
    const scaleAmount = scaleUp ? 0.1 : -0.1;
    
    const newParts = parts.map(part => {
      if (part.id === selectedPartId) {
        const newScale = Math.max(0.5, Math.min(1.5, part.scale + scaleAmount));
        const updatedPart = {
          ...part,
          scale: newScale
        };
        onPartChange(updatedPart);
        return updatedPart;
      }
      return part;
    });
    
    setParts(newParts);
  };
  
  // Toggle part visibility
  const handleTogglePart = (partId: string) => {
    const newParts = parts.map(part => {
      if (part.id === partId) {
        const updatedPart = {
          ...part,
          active: !part.active
        };
        onPartChange(updatedPart);
        return updatedPart;
      }
      return part;
    });
    
    setParts(newParts);
  };
  
  // Reset part position
  const handleResetPart = (partId: string) => {
    const newParts = parts.map(part => {
      if (part.id === partId) {
        const updatedPart = {
          ...part,
          position: { x: 0, y: 0 },
          rotation: 0,
          scale: 1
        };
        onPartChange(updatedPart);
        return updatedPart;
      }
      return part;
    });
    
    setParts(newParts);
  };
  
  return (
    <div className="flex flex-col gap-4">
      {/* 3D Preview Area */}
      <Card className="w-full aspect-video relative overflow-hidden">
        <CardContent className="p-0 h-full flex items-center justify-center bg-slate-100">
          {/* Base Vehicle */}
          <div 
            className="text-9xl relative" 
            style={{ 
              color: vehicleColor, 
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))'
            }}
          >
            {vehicleBaseImage ? (
              <img 
                src={vehicleBaseImage} 
                alt="Vehicle base" 
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-9xl">{vehicleEmoji}</span>
            )}
            
            {/* Draggable Parts */}
            {parts.filter(part => part.active).map((part) => (
              <motion.div
                key={part.id}
                drag
                dragMomentum={false}
                onDragEnd={(_, info) => handleDragEnd(info, part.id)}
                className={`absolute cursor-move ${selectedPartId === part.id ? 'ring-2 ring-blue-500' : ''}`}
                style={{
                  x: part.position.x,
                  y: part.position.y,
                  rotate: part.rotation,
                  scale: part.scale,
                  background: part.color || 'transparent',
                  transformOrigin: 'center'
                }}
                onClick={() => handleSelectPart(part.id)}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-2 rounded min-w-8 min-h-8 flex items-center justify-center">
                  {part.type === 'spoiler' && (
                    <div className="w-24 h-4 bg-black rounded-md"></div>
                  )}
                  {part.type === 'wheel' && (
                    <div className="w-12 h-12 rounded-full border-4 border-black bg-gray-300"></div>
                  )}
                  {part.type === 'bodykit' && (
                    <div className="w-32 h-8 bg-current rounded-lg"></div>
                  )}
                  {part.type === 'decal' && (
                    <div className="w-16 h-10 bg-current rounded-sm opacity-80"></div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Controls Bar */}
      {showControls && selectedPartId && (
        <Card className="w-full p-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleRotate('counterclockwise')}
                title="Rotate Left"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleRotate('clockwise')}
                title="Rotate Right"
              >
                <RotateCcw className="h-4 w-4 transform scale-x-[-1]" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleScale(false)}
                title="Scale Down"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleScale(true)}
                title="Scale Up"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleResetPart(selectedPartId)}
              >
                Reset Position
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setShowControls(false)}
              >
                <Check className="h-4 w-4 mr-1" />
                Done
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Parts Selection */}
      <Card className="w-full">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-3">Available Parts</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {parts.map((part) => (
              <div 
                key={part.id}
                className={`border p-2 rounded-md cursor-pointer transition-all ${
                  part.active ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'
                }`}
                onClick={() => handleTogglePart(part.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{part.name}</span>
                  {part.active && <Check className="h-4 w-4 text-blue-500" />}
                </div>
                <div className="text-xs text-muted-foreground">{part.type}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center text-muted-foreground text-sm">
        <MoveHorizontal className="h-4 w-4 inline-block mr-1" />
        Drag parts to position them on the vehicle
      </div>
    </div>
  );
};

export default DraggableCustomizer;