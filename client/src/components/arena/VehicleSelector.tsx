import React, { useState, useEffect } from 'react';
import { 
  Button,
  Card,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui';
import { ChevronDown, Plus, Car, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

// Vehicle interface
interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
  image?: string;
}

interface VehicleSelectorProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
  onAddNewVehicle: () => void;
  className?: string;
}

const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  onSelectVehicle,
  onAddNewVehicle,
  className
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  // Mock data - would be fetched from the API in production
  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      const mockVehicles: Vehicle[] = [
        {
          id: 1,
          make: 'Honda',
          model: 'City',
          year: 2022,
          licensePlate: 'MH01AB****',
          image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75'
        },
        {
          id: 2,
          make: 'Royal Enfield',
          model: 'Classic 350',
          year: 2021,
          licensePlate: 'MH02CD****',
          image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/43482/royal-enfield-classic-350-right-front-three-quarter-2.jpeg?isig=0&q=75'
        },
        {
          id: 3,
          make: 'Mahindra',
          model: 'XUV700',
          year: 2023,
          licensePlate: 'MH03EF****',
          image: 'https://imgd.aeplcdn.com/1200x900/n/cw/ec/42355/mahindra-xuv700-right-front-three-quarter6.jpeg?isig=0&q=75'
        }
      ];
      
      setVehicles(mockVehicles);
      
      // Set the first vehicle as selected by default or get from localStorage
      const lastUsedVehicleId = localStorage.getItem('lastUsedVehicleId');
      if (lastUsedVehicleId) {
        const lastVehicle = mockVehicles.find(v => v.id === parseInt(lastUsedVehicleId));
        if (lastVehicle) {
          setSelectedVehicle(lastVehicle);
          return;
        }
      }
      
      setSelectedVehicle(mockVehicles[0]);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle vehicle selection
  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    localStorage.setItem('lastUsedVehicleId', vehicle.id.toString());
    onSelectVehicle(vehicle);
    setIsPopoverOpen(false);
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center space-x-2 pr-2"
            aria-label="Select vehicle"
          >
            {selectedVehicle ? (
              <>
                <div className="w-8 h-8 rounded-md overflow-hidden mr-2">
                  {selectedVehicle.image ? (
                    <img 
                      src={selectedVehicle.image} 
                      alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Car className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="text-left mr-1">
                  <p className="text-sm font-medium leading-none">
                    {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedVehicle.licensePlate || 'No license plate'}
                  </p>
                </div>
              </>
            ) : (
              <span>Select Vehicle</span>
            )}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">My Vehicles</h3>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {vehicles.map((vehicle) => (
                <Card 
                  key={vehicle.id}
                  className={`cursor-pointer p-2 flex items-center space-x-3 ${
                    selectedVehicle?.id === vehicle.id ? 'ring-1 ring-primary' : ''
                  }`}
                  onClick={() => handleSelectVehicle(vehicle)}
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                    {vehicle.image ? (
                      <img 
                        src={vehicle.image} 
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Car className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                    <p className="text-xs text-muted-foreground">{vehicle.licensePlate || 'No license plate'}</p>
                  </div>
                </Card>
              ))}
            </div>
              
            <Separator className="my-2" />
              
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setIsPopoverOpen(false);
                  onAddNewVehicle();
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Vehicle
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setIsPopoverOpen(false);
                  onAddNewVehicle();
                }}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Select New Vehicle to Customize
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default VehicleSelector;