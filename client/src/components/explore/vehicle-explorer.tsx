import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Vehicle {
  id: number;
  name: string;
  manufacturer: string;
  model: string;
  year: number;
  price: number;
  fuelType: string;
  transmission: string;
  imageUrl: string;
  category: string;
  features: string[];
}

interface VehicleExplorerProps {
  vehicles: Vehicle[];
}

const VehicleExplorer: React.FC<VehicleExplorerProps> = ({ vehicles }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const filteredVehicles = selectedCategory === 'all' 
    ? vehicles
    : vehicles.filter(vehicle => vehicle.category === selectedCategory);

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Explore New Vehicles</h1>
          <p className="text-neutral-500">
            Discover and compare the latest vehicles from top manufacturers
          </p>
        </div>
        <Button variant="outline">Compare Vehicles</Button>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setSelectedCategory} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Vehicles</TabsTrigger>
          <TabsTrigger value="sedan">Sedans</TabsTrigger>
          <TabsTrigger value="suv">SUVs</TabsTrigger>
          <TabsTrigger value="truck">Trucks</TabsTrigger>
          <TabsTrigger value="luxury">Luxury</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map(vehicle => (
          <Card key={vehicle.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 overflow-hidden">
              <img 
                src={vehicle.imageUrl}
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{vehicle.name}</CardTitle>
              <p className="text-sm text-neutral-500">
                {vehicle.year} {vehicle.manufacturer} {vehicle.model}
              </p>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex flex-wrap gap-1 mb-3">
                <Badge variant="secondary">{vehicle.fuelType}</Badge>
                <Badge variant="outline">{vehicle.transmission}</Badge>
              </div>
              <p className="text-lg font-bold">${vehicle.price.toLocaleString()}</p>
              
              <div className="mt-3 space-y-1">
                <p className="text-sm font-medium">Key Features:</p>
                <ul className="text-xs text-neutral-500 space-y-1">
                  {vehicle.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button size="sm" className="w-full">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VehicleExplorer;