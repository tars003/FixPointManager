import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Plus } from 'lucide-react';

const ArenaVehicleSelection: React.FC = () => {
  const [_, navigate] = useLocation();

  const handleVehicleSourceSelect = (source: 'existing' | 'new') => {
    if (source === 'existing') {
      navigate('/arena-dashboard-new');
    } else {
      navigate('/arena-dashboard-new');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Arena Customization Platform</h1>
      <p className="text-lg text-muted-foreground mb-8">Visualize, customize, and enhance your vehicle</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleVehicleSourceSelect('existing')}>
          <CardHeader>
            <CardTitle>Select from My Vehicles</CardTitle>
            <CardDescription>Customize one of your existing vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Car className="h-24 w-24 text-primary" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Continue with My Vehicles</Button>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleVehicleSourceSelect('new')}>
          <CardHeader>
            <CardTitle>Select a New Vehicle</CardTitle>
            <CardDescription>Explore customization for a new vehicle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Plus className="h-24 w-24 text-primary" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Select New Vehicle</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ArenaVehicleSelection;