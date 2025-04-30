import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { User, Heart, Car, Palette, Sliders, Tag, FileImage } from 'lucide-react';

interface PersonalizedVehicleProps {
  vehicleColor: string;
  onColorChange: (color: string) => void;
  onSaveCustomization: () => void;
}

const PersonalizedVehicle: React.FC<PersonalizedVehicleProps> = ({
  vehicleColor,
  onColorChange,
  onSaveCustomization
}) => {
  const { toast } = useToast();
  const [personalName, setPersonalName] = useState('');
  const [drivingStyle, setDrivingStyle] = useState('balanced');
  const [heightSettings, setHeightSettings] = useState([50]);
  const [favoriteColor, setFavoriteColor] = useState('#0047AB');
  const [preferences, setPreferences] = useState({
    fuelEfficiency: true,
    performance: false,
    comfort: true,
    safety: true
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [personalizedOptions, setPersonalizedOptions] = useState<string[]>([]);

  const handleSaveName = () => {
    if (!personalName) {
      toast({
        title: "Name Required",
        description: "Please provide a name for your personalized vehicle profile.",
        variant: "destructive"
      });
      return;
    }

    // Generate personalized recommendations based on profile
    generatePersonalizedRecommendations();
    setActiveTab('recommendations');
    
    toast({
      title: "Profile Saved",
      description: "Your personalized profile has been saved.",
    });
  };

  const generatePersonalizedRecommendations = () => {
    // In a real app, this would analyze preferences and create AI-driven recommendations
    const recommendations = [];
    
    if (preferences.performance) {
      recommendations.push("Sport-tuned suspension system");
      recommendations.push("High-performance exhaust system");
    }
    
    if (preferences.comfort) {
      recommendations.push("Premium leather seating package");
      recommendations.push("Enhanced sound insulation");
    }
    
    if (preferences.safety) {
      recommendations.push("Advanced driver assistance package");
      recommendations.push("360° camera system");
    }
    
    if (preferences.fuelEfficiency) {
      recommendations.push("Eco driving mode enhancement");
      recommendations.push("Aerodynamic exterior package");
    }
    
    if (drivingStyle === 'sport') {
      recommendations.push("Sport alloy wheels");
      recommendations.push("Sport body kit");
    } else if (drivingStyle === 'comfort') {
      recommendations.push("Comfort-tuned suspension");
      recommendations.push("Enhanced cabin noise reduction");
    }
    
    // Add favorite color related recommendation
    recommendations.push(`${personalizedColorName(favoriteColor)} accent package`);
    
    setPersonalizedOptions(recommendations);
  };

  const personalizedColorName = (hexColor: string) => {
    // Simple function to name colors - would be more sophisticated in production
    const colorMap: Record<string, string> = {
      '#FF0000': 'Ruby Red',
      '#00FF00': 'Emerald Green',
      '#0000FF': 'Sapphire Blue',
      '#FFFF00': 'Sunburst Yellow',
      '#FF00FF': 'Vibrant Magenta',
      '#00FFFF': 'Aqua Blue',
      '#0047AB': 'Cobalt Blue',
      '#000000': 'Midnight Black',
      '#FFFFFF': 'Pearl White'
    };
    
    return colorMap[hexColor] || 'Custom';
  };

  const applyPersonalization = (option: string) => {
    // In a real app, this would apply the selected option to the vehicle
    // For demo, we'll just show a toast
    toast({
      title: "Option Applied",
      description: `${option} has been applied to your vehicle.`,
    });
    
    // If this is a color package, update the vehicle color
    if (option.includes('accent package')) {
      onColorChange(favoriteColor);
    }
    
    onSaveCustomization();
  };

  return (
    <Card className="w-full border-t-4 border-t-blue-600 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Personalized Vehicle</CardTitle>
            <CardDescription>
              Customize your vehicle to match your personal preferences and driving style
            </CardDescription>
          </div>
          <User className="h-8 w-8 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Driver Profile
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <Heart className="mr-2 h-4 w-4" />
              Personalized Options
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="pt-4 space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="nickname">Vehicle Nickname</Label>
                <Input 
                  id="nickname" 
                  placeholder="e.g., My Dream Ride" 
                  value={personalName}
                  onChange={(e) => setPersonalName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="drivingStyle">Your Driving Style</Label>
                <Select 
                  value={drivingStyle} 
                  onValueChange={setDrivingStyle}
                >
                  <SelectTrigger id="drivingStyle">
                    <SelectValue placeholder="Select your driving style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comfort">Comfort-Oriented</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="sport">Sport-Oriented</SelectItem>
                    <SelectItem value="eco">Eco-Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Preferred Vehicle Height</Label>
                <div className="pt-2 pb-4">
                  <Slider
                    value={heightSettings}
                    onValueChange={setHeightSettings}
                    max={100}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Low</span>
                    <span>Stock</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="favoriteColor">Favorite Color</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    id="favoriteColor"
                    type="color"
                    value={favoriteColor}
                    onChange={(e) => setFavoriteColor(e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <span className="text-sm">{personalizedColorName(favoriteColor)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Preferences</Label>
                
                <div className="flex items-center justify-between">
                  <Label 
                    htmlFor="fuelEfficiency" 
                    className="text-sm font-normal flex items-center cursor-pointer"
                  >
                    <Tag className="mr-2 h-4 w-4 text-green-500" />
                    Fuel Efficiency
                  </Label>
                  <Switch
                    id="fuelEfficiency"
                    checked={preferences.fuelEfficiency}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, fuelEfficiency: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label 
                    htmlFor="performance" 
                    className="text-sm font-normal flex items-center cursor-pointer"
                  >
                    <Sliders className="mr-2 h-4 w-4 text-red-500" />
                    Performance
                  </Label>
                  <Switch
                    id="performance"
                    checked={preferences.performance}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, performance: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label 
                    htmlFor="comfort" 
                    className="text-sm font-normal flex items-center cursor-pointer"
                  >
                    <FileImage className="mr-2 h-4 w-4 text-blue-500" />
                    Comfort
                  </Label>
                  <Switch
                    id="comfort"
                    checked={preferences.comfort}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, comfort: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label 
                    htmlFor="safety" 
                    className="text-sm font-normal flex items-center cursor-pointer"
                  >
                    <Car className="mr-2 h-4 w-4 text-amber-500" />
                    Safety Features
                  </Label>
                  <Switch
                    id="safety"
                    checked={preferences.safety}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, safety: checked }))}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="pt-4">
            {personalizedOptions.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-3">
                  Based on your driver profile, we recommend these personalized options for your vehicle:
                </p>
                
                {personalizedOptions.map((option, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center">
                      <Palette className="h-5 w-5 mr-3 text-blue-500" />
                      <span>{option}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => applyPersonalization(option)}
                    >
                      Apply
                    </Button>
                  </div>
                ))}
                
                <p className="text-xs text-muted-foreground mt-6">
                  These recommendations are based on your driver profile and preferences.
                  Apply any option to add it to your customization.
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-1">Profile Not Created</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete your driver profile to receive personalized recommendations.
                </p>
                <Button onClick={() => setActiveTab('profile')}>Create Profile</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-end border-t bg-muted/50 pt-4">
        {activeTab === 'profile' && (
          <Button onClick={handleSaveName} className="flex items-center">
            <Heart className="mr-2 h-4 w-4" />
            Save Profile & Generate Recommendations
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PersonalizedVehicle;