import React, { useState, useEffect } from 'react';
import { Gauge, Clock, Zap, Fuel, BarChart, Scale, Car } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface VehicleSpecificationsProps {
  vehicleId: number | null;
}

// Mock specification data (would come from API in a real implementation)
interface VehicleSpec {
  id: number;
  name: string;
  engineSpecs: {
    type: string;
    displacement: string;
    power: string;
    torque: string;
    cylinders: number;
  };
  performance: {
    topSpeed: number; // km/h
    acceleration: number; // 0-100 km/h in seconds
    fuelEfficiency: number; // km/l
  };
  dimensions: {
    length: number; // mm
    width: number; // mm
    height: number; // mm
    wheelbase: number; // mm
    groundClearance: number; // mm
    weight: number; // kg
  };
}

// Mock data
const vehicleSpecs: Record<number, VehicleSpec> = {
  1: {
    id: 1,
    name: 'Swift DZire',
    engineSpecs: {
      type: 'Petrol',
      displacement: '1197 cc',
      power: '89 bhp @ 6000 rpm',
      torque: '113 Nm @ 4400 rpm',
      cylinders: 4
    },
    performance: {
      topSpeed: 180,
      acceleration: 11.5,
      fuelEfficiency: 22.4
    },
    dimensions: {
      length: 3995,
      width: 1735,
      height: 1515,
      wheelbase: 2450,
      groundClearance: 163,
      weight: 925
    }
  },
  2: {
    id: 2,
    name: 'Thar',
    engineSpecs: {
      type: 'Diesel',
      displacement: '2184 cc',
      power: '130 bhp @ 3750 rpm',
      torque: '300 Nm @ 1600 rpm',
      cylinders: 4
    },
    performance: {
      topSpeed: 155,
      acceleration: 13.5,
      fuelEfficiency: 15.2
    },
    dimensions: {
      length: 3985,
      width: 1820,
      height: 1920,
      wheelbase: 2450,
      groundClearance: 219,
      weight: 1750
    }
  }
};

// Default specification for when no vehicle is selected
const defaultSpec: VehicleSpec = {
  id: 0,
  name: 'Default Vehicle',
  engineSpecs: {
    type: 'Not specified',
    displacement: '0 cc',
    power: '0 bhp',
    torque: '0 Nm',
    cylinders: 0
  },
  performance: {
    topSpeed: 0,
    acceleration: 0,
    fuelEfficiency: 0
  },
  dimensions: {
    length: 0,
    width: 0,
    height: 0,
    wheelbase: 0,
    groundClearance: 0,
    weight: 0
  }
};

const VehicleSpecifications: React.FC<VehicleSpecificationsProps> = ({ vehicleId }) => {
  const [specs, setSpecs] = useState<VehicleSpec>(defaultSpec);
  
  useEffect(() => {
    // In a real app, this would be an API call
    if (vehicleId && vehicleSpecs[vehicleId]) {
      setSpecs(vehicleSpecs[vehicleId]);
    } else {
      setSpecs(defaultSpec);
    }
  }, [vehicleId]);
  
  // Calculate a simple performance score out of 100
  const calculatePerformanceScore = () => {
    if (vehicleId === null) return 0;
    
    // Very basic algorithm for demo purposes
    // In a real app, this would be much more sophisticated
    const topSpeedScore = Math.min(100, specs.performance.topSpeed / 3);
    const accelerationScore = Math.min(100, (20 - specs.performance.acceleration) * 5);
    const efficiencyScore = Math.min(100, specs.performance.fuelEfficiency * 3);
    
    return Math.round((topSpeedScore + accelerationScore + efficiencyScore) / 3);
  };
  
  // Placeholder for when no vehicle is selected
  if (vehicleId === null) {
    return (
      <div className="h-24 flex flex-col items-center justify-center text-center">
        <Car className="h-5 w-5 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          Select a vehicle to view specifications
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Performance indicators */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 mb-2">
            <Gauge className="h-5 w-5 text-blue-500" />
          </div>
          <span className="text-sm font-semibold">{specs.performance.topSpeed} km/h</span>
          <span className="text-xs text-muted-foreground">Top Speed</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 mb-2">
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <span className="text-sm font-semibold">{specs.performance.acceleration}s</span>
          <span className="text-xs text-muted-foreground">0-100 km/h</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 mb-2">
            <Fuel className="h-5 w-5 text-green-500" />
          </div>
          <span className="text-sm font-semibold">{specs.performance.fuelEfficiency} km/l</span>
          <span className="text-xs text-muted-foreground">Fuel Efficiency</span>
        </div>
      </div>
      
      <Separator />
      
      {/* Engine specifications */}
      <div>
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <Zap className="h-4 w-4 mr-1 text-blue-500" />
          Engine Specifications
        </h3>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <span className="text-xs text-muted-foreground">Engine Type</span>
            <p className="text-sm">{specs.engineSpecs.type}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Displacement</span>
            <p className="text-sm">{specs.engineSpecs.displacement}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Max Power</span>
            <p className="text-sm">{specs.engineSpecs.power}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Max Torque</span>
            <p className="text-sm">{specs.engineSpecs.torque}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Cylinders</span>
            <p className="text-sm">{specs.engineSpecs.cylinders}</p>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Dimensions */}
      <div>
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <Scale className="h-4 w-4 mr-1 text-green-500" />
          Dimensions & Weight
        </h3>
        
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          <div>
            <span className="text-xs text-muted-foreground">Length</span>
            <p className="text-sm">{specs.dimensions.length} mm</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Width</span>
            <p className="text-sm">{specs.dimensions.width} mm</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Height</span>
            <p className="text-sm">{specs.dimensions.height} mm</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Wheelbase</span>
            <p className="text-sm">{specs.dimensions.wheelbase} mm</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Ground Clearance</span>
            <p className="text-sm">{specs.dimensions.groundClearance} mm</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Weight</span>
            <p className="text-sm">{specs.dimensions.weight} kg</p>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Performance score */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium flex items-center">
            <BarChart className="h-4 w-4 mr-1 text-purple-500" />
            Performance Rating
          </h3>
          <span className="text-sm font-medium">{calculatePerformanceScore()}/100</span>
        </div>
        <Progress value={calculatePerformanceScore()} className="h-2" />
      </div>
    </div>
  );
};

export default VehicleSpecifications;