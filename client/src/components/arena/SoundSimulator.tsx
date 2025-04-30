import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Speaker, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  HelpCircle, 
  RefreshCw,
  Music,
  Columns,
  MoveHorizontal,
  BarChart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';

interface SoundSimulatorProps {
  vehicleType?: string;
  engineType?: string;
  exhaustType?: string;
}

const SoundSimulator: React.FC<SoundSimulatorProps> = ({
  vehicleType = 'sedan',
  engineType = 'standard',
  exhaustType = 'standard'
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('engine');
  const [volume, setVolume] = useState([70]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tuning, setTuning] = useState({
    bass: [50],
    midrange: [50],
    treble: [50],
    depth: [50]
  });
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [selectedSound, setSelectedSound] = useState('standard');
  const [enhancedMode, setEnhancedMode] = useState(false);
  
  const progressTimer = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sound categories
  const engineSounds = [
    { id: 'standard', name: 'Standard Engine', type: 'Stock' },
    { id: 'sport', name: 'Sport Performance', type: 'Enhanced' },
    { id: 'luxury', name: 'Luxury Sedan', type: 'Enhanced' },
    { id: 'muscle', name: 'Muscle Car V8', type: 'Enhanced' },
    { id: 'electric', name: 'Electric Motor', type: 'Alternative' }
  ];
  
  const exhaustSounds = [
    { id: 'standard', name: 'Factory Exhaust', type: 'Stock' },
    { id: 'performance', name: 'Performance Exhaust', type: 'Enhanced' },
    { id: 'aftermarket', name: 'Aftermarket Racing', type: 'Enhanced' },
    { id: 'custom', name: 'Custom Tuned', type: 'Enhanced' },
    { id: 'quiet', name: 'Quiet Mode', type: 'Alternative' }
  ];
  
  const interiorSounds = [
    { id: 'standard', name: 'Standard Interior', type: 'Stock' },
    { id: 'premium', name: 'Premium Insulation', type: 'Enhanced' },
    { id: 'sport', name: 'Sport Interior', type: 'Enhanced' },
    { id: 'minimal', name: 'Race Minimal', type: 'Alternative' },
    { id: 'luxury', name: 'Luxury Dampening', type: 'Enhanced' }
  ];

  useEffect(() => {
    // Create a simulated audio element
    audioRef.current = new Audio();
    
    // Cleanup function
    return () => {
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      // Stop playing
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
        progressTimer.current = null;
      }
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      // In a real app, this would play actual audio files
      setIsPlaying(true);
      
      // Simulate audio playing with progress bar
      setPlaybackProgress(0);
      progressTimer.current = setInterval(() => {
        setPlaybackProgress(prev => {
          if (prev >= 100) {
            // Loop the sound
            return 0;
          }
          return prev + 1;
        });
      }, 100);
      
      // Show toast with information
      toast({
        title: "Sound Simulating",
        description: `${getActiveTabSounds().find(s => s.id === selectedSound)?.name} sound is now playing.`,
      });
    }
  };

  const getActiveTabSounds = () => {
    switch (activeTab) {
      case 'engine': return engineSounds;
      case 'exhaust': return exhaustSounds;
      case 'interior': return interiorSounds;
      default: return engineSounds;
    }
  };

  const handleSoundSelect = (soundId: string) => {
    setSelectedSound(soundId);
    
    // If already playing, stop and restart with new sound
    if (isPlaying) {
      if (progressTimer.current) {
        clearInterval(progressTimer.current);
      }
      setPlaybackProgress(0);
      progressTimer.current = setInterval(() => {
        setPlaybackProgress(prev => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 1;
        });
      }, 100);
    }
    
    toast({
      title: "Sound Selected",
      description: `${getActiveTabSounds().find(s => s.id === soundId)?.name} selected.`,
    });
  };

  const handleTuningChange = (key: keyof typeof tuning, value: number[]) => {
    setTuning(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetTuning = () => {
    setTuning({
      bass: [50],
      midrange: [50],
      treble: [50],
      depth: [50]
    });
    
    toast({
      title: "Settings Reset",
      description: "Sound tuning has been reset to default values.",
    });
  };

  const toggleEnhancedMode = (checked: boolean) => {
    setEnhancedMode(checked);
    
    toast({
      title: checked ? "Enhanced Mode Activated" : "Standard Mode Activated",
      description: checked 
        ? "Using advanced sound profiles with spatial audio effects." 
        : "Using standard sound profiles.",
    });
  };

  return (
    <Card className="w-full border-t-4 border-t-violet-600 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Sound Simulator</CardTitle>
            <CardDescription>
              Preview how your vehicle will sound with different customizations
            </CardDescription>
          </div>
          <Speaker className="h-8 w-8 text-violet-600" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="engine">Engine</TabsTrigger>
            <TabsTrigger value="exhaust">Exhaust</TabsTrigger>
            <TabsTrigger value="interior">Interior</TabsTrigger>
          </TabsList>
          
          {['engine', 'exhaust', 'interior'].map((tab) => (
            <TabsContent key={tab} value={tab} className="pt-4">
              <div className="grid gap-4">
                {getActiveTabSounds().map((sound) => (
                  <div 
                    key={sound.id}
                    onClick={() => handleSoundSelect(sound.id)}
                    className={`
                      flex items-center justify-between p-3 rounded-lg border cursor-pointer
                      transition-colors hover:bg-muted/50
                      ${selectedSound === sound.id ? 'bg-violet-50 border-violet-200 dark:bg-violet-950/20 dark:border-violet-800' : ''}
                    `}
                  >
                    <div className="flex items-center">
                      {tab === 'engine' && <Music className="h-5 w-5 mr-3 text-violet-500" />}
                      {tab === 'exhaust' && <BarChart className="h-5 w-5 mr-3 text-violet-500" />}
                      {tab === 'interior' && <Columns className="h-5 w-5 mr-3 text-violet-500" />}
                      <div>
                        <p className="font-medium">{sound.name}</p>
                        <p className="text-xs text-muted-foreground">{sound.type}</p>
                      </div>
                    </div>
                    
                    {selectedSound === sound.id && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay();
                        }}
                      >
                        {isPlaying ? 
                          <Pause className="h-4 w-4" /> : 
                          <Play className="h-4 w-4" />
                        }
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        {isPlaying && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span>Now Playing</span>
              <span>{getActiveTabSounds().find(s => s.id === selectedSound)?.name}</span>
            </div>
            <Progress value={playbackProgress} className="h-2" />
          </div>
        )}
        
        <div className="space-y-4 border-t pt-4 mt-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="enhancedMode" className="flex items-center cursor-pointer">
              <HelpCircle className="h-4 w-4 mr-2 text-muted-foreground" />
              Enhanced 3D Audio
            </Label>
            <Switch 
              id="enhancedMode" 
              checked={enhancedMode}
              onCheckedChange={toggleEnhancedMode}
            />
          </div>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="volume" className="text-sm flex items-center">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Volume
                </Label>
                <span className="text-sm">{volume[0]}%</span>
              </div>
              <Slider
                id="volume"
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bass" className="text-sm">Bass</Label>
                  <span className="text-sm">{tuning.bass[0]}%</span>
                </div>
                <Slider
                  id="bass"
                  value={tuning.bass}
                  onValueChange={(value) => handleTuningChange('bass', value)}
                  max={100}
                  step={1}
                />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="midrange" className="text-sm">Mid</Label>
                  <span className="text-sm">{tuning.midrange[0]}%</span>
                </div>
                <Slider
                  id="midrange"
                  value={tuning.midrange}
                  onValueChange={(value) => handleTuningChange('midrange', value)}
                  max={100}
                  step={1}
                />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="treble" className="text-sm">Treble</Label>
                  <span className="text-sm">{tuning.treble[0]}%</span>
                </div>
                <Slider
                  id="treble"
                  value={tuning.treble}
                  onValueChange={(value) => handleTuningChange('treble', value)}
                  max={100}
                  step={1}
                />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="depth" className="text-sm flex items-center">
                    <MoveHorizontal className="h-3 w-3 mr-1" />
                    Spatial
                  </Label>
                  <span className="text-sm">{tuning.depth[0]}%</span>
                </div>
                <Slider
                  id="depth"
                  value={tuning.depth}
                  onValueChange={(value) => handleTuningChange('depth', value)}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t bg-muted/50 py-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetTuning}
          className="flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        
        <Button 
          onClick={togglePlay}
          className="flex items-center"
        >
          {isPlaying ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Stop Sound
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Play Sound
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SoundSimulator;