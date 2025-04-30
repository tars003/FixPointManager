import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Car, Settings, Wrench } from 'lucide-react';

// Simplified Arena Studio Page
const Arena: React.FC = () => {
  return (
    <div className="container max-w-7xl mx-auto py-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Arena Studio</h1>
          <p className="text-muted-foreground mt-1">
            Transform your vehicle with advanced customization tools
          </p>
        </div>
        
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button variant="outline">New Project</Button>
          <Button>Get Started</Button>
        </div>
      </div>
      
      {/* Simplified content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Selection</CardTitle>
            <CardDescription>Choose your vehicle to customize</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Car className="h-20 w-20 text-primary mb-4" />
            <p className="text-center">Browse our extensive catalog of vehicles</p>
            <Button className="mt-4">Select Vehicle</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Customization</CardTitle>
            <CardDescription>Modify your vehicle's appearance</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Wrench className="h-20 w-20 text-primary mb-4" />
            <p className="text-center">Personalize every aspect of your vehicle</p>
            <Button className="mt-4">Explore Options</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Enhance your vehicle's capabilities</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Settings className="h-20 w-20 text-primary mb-4" />
            <p className="text-center">Upgrade performance with premium parts</p>
            <Button className="mt-4">Tune Performance</Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              Our 3D visualizer and advanced customization tools are being upgraded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>We're working on bringing you the most advanced vehicle customization experience:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Real-time 3D visualization</li>
              <li>Comprehensive parts catalog</li>
              <li>Performance simulation</li>
              <li>Social sharing capabilities</li>
              <li>AR preview on your smartphone</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Arena;