import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface VoiceCommand {
  name: string;
  description: string;
  keywords: string[];
  action: () => void;
}

interface VoiceControlProps {
  onCommand: (command: string) => void;
  commands?: VoiceCommand[];
}

const VoiceControl: React.FC<VoiceControlProps> = ({ 
  onCommand,
  commands = []
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  
  // Mock implementation that doesn't rely on browser speech recognition
  // This avoids TypeScript errors with webkitSpeechRecognition
  const toggleListening = () => {
    if (isListening) {
      console.log('Stopping voice recognition');
      setIsListening(false);
    } else {
      console.log('Starting voice recognition');
      setIsListening(true);
      
      // Simulate receiving a command after a short delay
      const timer = setTimeout(() => {
        const mockCommands = [
          'new project',
          'switch to discover',
          'go to my studio',
          'show learning section'
        ];
        
        const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)];
        setTranscript(randomCommand);
        
        // Process the command
        processCommand(randomCommand);
        
        // Stop listening after processing a command
        setIsListening(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  };
  
  // Process voice commands
  const processCommand = (text: string) => {
    const lowerText = text.toLowerCase();
    console.log('Processing command:', lowerText);
    
    // Find matching command
    const matchedCommand = commands.find(command => 
      command.keywords.some(keyword => lowerText.includes(keyword.toLowerCase()))
    );
    
    if (matchedCommand) {
      console.log('Command matched:', matchedCommand.name);
      onCommand(matchedCommand.name);
      matchedCommand.action();
    } else {
      console.log('No command matched');
      onCommand('Unknown command: ' + text);
    }
  };
  
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isListening ? "default" : "ghost"}
              size="icon"
              onClick={toggleListening}
              className={isListening ? "bg-red-500 text-white hover:bg-red-600" : ""}
            >
              {isListening ? (
                <Mic className="h-5 w-5 animate-pulse" />
              ) : (
                <MicOff className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>
              {isListening 
                ? "Voice control active - speak a command" 
                : "Enable voice control"
              }
            </p>
            <button 
              className="text-xs text-blue-500 underline mt-1"
              onClick={(e) => {
                e.preventDefault();
                setShowHelp(true);
              }}
            >
              View available commands
            </button>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Available Voice Commands</DialogTitle>
            <DialogDescription>
              Say any of these commands while voice control is active
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4 max-h-[60vh] overflow-y-auto">
            {commands.map((command, index) => (
              <div key={index} className="border-b pb-3 last:border-b-0">
                <h3 className="font-medium">{command.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{command.description}</p>
                <div className="text-xs text-muted-foreground">
                  Say: {command.keywords.map((keyword, i) => (
                    <span key={i} className="inline-block bg-muted rounded px-1.5 py-0.5 mr-1 mb-1">
                      "{keyword}"
                    </span>
                  ))}
                </div>
              </div>
            ))}
            
            {commands.length === 0 && (
              <p className="text-muted-foreground italic">No commands available</p>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowHelp(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Voice feedback - only show when actively listening or just processed */}
      {(isListening || transcript) && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-background border shadow-lg rounded-lg p-4 z-50 min-w-[300px] max-w-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Voice Control</h3>
            <div className={`flex gap-1 ${isListening ? 'text-red-500' : 'text-muted-foreground'}`}>
              <span className={`h-2 w-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-muted-foreground'}`}></span>
              <span className="text-xs">{isListening ? 'Listening...' : 'Processed'}</span>
            </div>
          </div>
          <p className="text-sm">
            {isListening 
              ? "Say a command..." 
              : transcript
                ? `"${transcript}"`
                : "No command detected"
            }
          </p>
        </div>
      )}
    </>
  );
};

export default VoiceControl;