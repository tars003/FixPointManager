import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface VoiceControlProps {
  onCommand: (command: string) => void;
  onError?: (error: string) => void;
  commands: Array<{
    name: string;
    description: string;
    keywords: string[];
    action: () => void;
  }>;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ 
  onCommand, 
  onError,
  commands 
}) => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [lastRecognizedCommand, setLastRecognizedCommand] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcriptValue = result[0].transcript.toLowerCase();
        setTranscript(transcriptValue);
        setConfidence(result[0].confidence * 100);
        
        if (result.isFinal) {
          // Process command here
          processCommand(transcriptValue);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (onError) onError(event.error);
        
        toast({
          title: "Voice Recognition Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        });
        
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        if (isListening) {
          // Restart if it was still supposed to be listening
          recognitionRef.current.start();
        }
      };
    } else {
      toast({
        title: "Voice Control Not Supported",
        description: "Your browser doesn't support voice control. Please try using a modern browser like Chrome.",
        variant: "destructive",
      });
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isListening, onError, toast]);
  
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript('');
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
        
        toast({
          title: "Voice Control Activated",
          description: "Say 'help' to see available commands",
        });
      }
    }
  };
  
  const processCommand = (text: string) => {
    // Check for help command
    if (text.includes('help') || text.includes('commands') || text.includes('what can i say')) {
      setShowCommands(true);
      return;
    }
    
    // Check for hide help command
    if (text.includes('hide help') || text.includes('close commands')) {
      setShowCommands(false);
      return;
    }
    
    // Check for other commands
    let foundCommand = false;
    
    for (const command of commands) {
      for (const keyword of command.keywords) {
        if (text.includes(keyword)) {
          onCommand(command.name);
          command.action();
          setLastRecognizedCommand(command.name);
          
          toast({
            title: "Command Recognized",
            description: `Executing: ${command.name}`,
          });
          
          foundCommand = true;
          
          // Show command recognition animation
          setTimeout(() => {
            setLastRecognizedCommand(null);
          }, 3000);
          
          break;
        }
      }
      if (foundCommand) break;
    }
    
    if (!foundCommand && text.length > 5) {
      // Only show error for substantial input
      toast({
        title: "Command Not Recognized",
        description: "Say 'help' to see available commands",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <Button
          variant={isListening ? "default" : "outline"}
          size="icon"
          onClick={toggleListening}
          className={`relative ${isListening ? 'bg-primary text-primary-foreground' : ''}`}
        >
          {isListening ? (
            <>
              <Mic className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </>
          ) : (
            <MicOff className="h-4 w-4" />
          )}
        </Button>
        
        {isListening && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCommands(!showCommands)}
            className="text-xs"
          >
            <Volume2 className="h-3 w-3 mr-1" />
            <span>Commands</span>
          </Button>
        )}
      </div>
      
      {/* Voice command feedback */}
      <AnimatePresence>
        {isListening && transcript && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 right-0 bg-background border rounded-lg shadow-md p-2 z-10 w-64"
          >
            <div className="text-xs font-medium mb-1 flex justify-between">
              <span>Listening...</span>
              <span className="text-muted-foreground">{Math.round(confidence)}% confidence</span>
            </div>
            <div className="text-sm break-words">"{transcript}"</div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Command list */}
      <AnimatePresence>
        {showCommands && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full mt-2 right-0 bg-background border rounded-lg shadow-md p-3 z-20 w-80"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-sm">Available Voice Commands</h4>
              <Button variant="ghost" size="icon" onClick={() => setShowCommands(false)} className="h-6 w-6">
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <div className="space-y-2">
                {commands.map((command, index) => (
                  <div key={index} className="text-sm border-b pb-2">
                    <div className="font-medium">{command.name}</div>
                    <div className="text-xs text-muted-foreground">{command.description}</div>
                    <div className="text-xs mt-1">
                      <span className="font-medium">Say:</span> "{command.keywords.join('", "')}"
                    </div>
                  </div>
                ))}
                
                <div className="text-sm border-b pb-2">
                  <div className="font-medium">Help</div>
                  <div className="text-xs text-muted-foreground">Show this command list</div>
                  <div className="text-xs mt-1">
                    <span className="font-medium">Say:</span> "help", "commands", "what can I say"
                  </div>
                </div>
                
                <div className="text-sm border-b pb-2">
                  <div className="font-medium">Hide Help</div>
                  <div className="text-xs text-muted-foreground">Close this command list</div>
                  <div className="text-xs mt-1">
                    <span className="font-medium">Say:</span> "hide help", "close commands"
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Command recognition animation */}
      <AnimatePresence>
        {lastRecognizedCommand && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-background/20 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-card p-6 rounded-lg shadow-lg border flex flex-col items-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: 1, duration: 0.5 }}
                className="text-primary"
              >
                <CheckCircle2 className="h-16 w-16 mb-4" />
              </motion.div>
              <h3 className="text-xl font-bold">Command Recognized</h3>
              <p className="text-muted-foreground mb-4">Executing: {lastRecognizedCommand}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceControl;