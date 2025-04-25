import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { 
  PlusCircle, 
  Car, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  ArrowLeftRight, 
  Maximize2, 
  Share2, 
  Copy, 
  ListFilter, 
  SortAsc,
  Wrench,
  Gauge,
  ShoppingCart,
  Sparkles,
  Clock,
  Scale,
  Ruler,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Define vehicle interface
interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
  image?: string;
  specs?: {
    engine?: string;
    horsepower?: number;
    torque?: number;
    transmission?: string;
    drivetrain?: string;
    fuelType?: string;
    weight?: number;
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
      wheelbase?: number;
    };
  };
  modifications: Modification[];
}

// Define modification interface
interface Modification {
  id: number;
  name: string;
  category: string;
  price: number;
  installedDate?: string;
  compatibleWith: number[]; // Array of vehicle IDs
  performance?: {
    horsepowerGain?: number;
    torqueGain?: number;
    weightChange?: number;
  };
  image?: string;
}

// Comparison property interface
interface ComparisonProperty {
  id: string;
  name: string;
  category: string;
  unit?: string;
  getValue: (vehicle: Vehicle) => any;
  higherIsBetter?: boolean;
}

interface MultiVehicleComparisonProps {
  userVehicles: Vehicle[];
  onAddVehicle?: () => void;
  onSelectModification?: (vehicleId: number, modId: number) => void;
}

const MultiVehicleComparison: React.FC<MultiVehicleComparisonProps> = ({
  userVehicles,
  onAddVehicle,
  onSelectModification
}) => {
  const { toast } = useToast();
  const [selectedVehicles, setSelectedVehicles] = useState<number[]>(
    userVehicles.length > 0 ? [userVehicles[0].id] : []
  );
  const [comparisonMode, setComparisonMode] = useState<'specs' | 'mods' | 'compatibility'>('specs');
  const [expandedVehicle, setExpandedVehicle] = useState<number | null>(null);
  const [availableModifications, setAvailableModifications] = useState<Modification[]>([
    {
      id: 1,
      name: "Performance Air Intake System",
      category: "Performance",
      price: 15000,
      compatibleWith: [1, 2],
      performance: {
        horsepowerGain: 8,
        torqueGain: 10,
        weightChange: -2
      },
      image: "https://m.media-amazon.com/images/I/91pddkZhbOL._AC_UF1000,1000_QL80_.jpg"
    },
    {
      id: 2,
      name: "Sports Exhaust System",
      category: "Performance",
      price: 45000,
      compatibleWith: [1, 3],
      performance: {
        horsepowerGain: 12,
        torqueGain: 15,
        weightChange: -5
      },
      image: "https://www.carid.com/images/borla/items/140307.jpg"
    },
    {
      id: 3,
      name: "Upgraded Suspension Kit",
      category: "Handling",
      price: 35000,
      compatibleWith: [1, 2, 3],
      performance: {
        weightChange: 2
      },
      image: "https://m.media-amazon.com/images/I/71vpTFUl7WL._AC_UF894,1000_QL80_.jpg"
    },
    {
      id: 4,
      name: "LED Headlight Upgrade",
      category: "Exterior",
      price: 12000,
      compatibleWith: [2, 3],
      image: "https://m.media-amazon.com/images/I/71eo-L9+wdL._AC_UF1000,1000_QL80_.jpg"
    },
    {
      id: 5,
      name: "18\" Alloy Wheels (Set of 4)",
      category: "Exterior",
      price: 60000,
      compatibleWith: [1, 2],
      performance: {
        weightChange: -8
      },
      image: "https://www.tyresales.com.au/images/alloy-wheels/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled/hero/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled-wheel-380.jpg"
    }
  ]);
  
  // Comparison properties for specs tab
  const specProperties: ComparisonProperty[] = [
    {
      id: 'engine',
      name: 'Engine',
      category: 'Performance',
      getValue: (vehicle) => vehicle.specs?.engine || '-'
    },
    {
      id: 'horsepower',
      name: 'Horsepower',
      category: 'Performance',
      unit: 'HP',
      getValue: (vehicle) => {
        const baseHP = vehicle.specs?.horsepower || 0;
        const modsHP = vehicle.modifications.reduce((total, mod) => 
          total + (mod.performance?.horsepowerGain || 0), 0);
        return baseHP + modsHP;
      },
      higherIsBetter: true
    },
    {
      id: 'torque',
      name: 'Torque',
      category: 'Performance',
      unit: 'Nm',
      getValue: (vehicle) => {
        const baseTorque = vehicle.specs?.torque || 0;
        const modsTorque = vehicle.modifications.reduce((total, mod) => 
          total + (mod.performance?.torqueGain || 0), 0);
        return baseTorque + modsTorque;
      },
      higherIsBetter: true
    },
    {
      id: 'transmission',
      name: 'Transmission',
      category: 'Drivetrain',
      getValue: (vehicle) => vehicle.specs?.transmission || '-'
    },
    {
      id: 'drivetrain',
      name: 'Drivetrain',
      category: 'Drivetrain',
      getValue: (vehicle) => vehicle.specs?.drivetrain || '-'
    },
    {
      id: 'fuelType',
      name: 'Fuel Type',
      category: 'General',
      getValue: (vehicle) => vehicle.specs?.fuelType || '-'
    },
    {
      id: 'weight',
      name: 'Weight',
      category: 'Performance',
      unit: 'kg',
      getValue: (vehicle) => {
        const baseWeight = vehicle.specs?.weight || 0;
        const modsWeight = vehicle.modifications.reduce((total, mod) => 
          total + (mod.performance?.weightChange || 0), 0);
        return baseWeight + modsWeight;
      },
      higherIsBetter: false
    },
    {
      id: 'length',
      name: 'Length',
      category: 'Dimensions',
      unit: 'mm',
      getValue: (vehicle) => vehicle.specs?.dimensions?.length || '-'
    },
    {
      id: 'width',
      name: 'Width',
      category: 'Dimensions',
      unit: 'mm',
      getValue: (vehicle) => vehicle.specs?.dimensions?.width || '-'
    },
    {
      id: 'height',
      name: 'Height',
      category: 'Dimensions',
      unit: 'mm',
      getValue: (vehicle) => vehicle.specs?.dimensions?.height || '-'
    },
    {
      id: 'wheelbase',
      name: 'Wheelbase',
      category: 'Dimensions',
      unit: 'mm',
      getValue: (vehicle) => vehicle.specs?.dimensions?.wheelbase || '-'
    },
    {
      id: 'modCount',
      name: 'Modifications',
      category: 'General',
      getValue: (vehicle) => vehicle.modifications.length,
    },
    {
      id: 'modCost',
      name: 'Total Mods Cost',
      category: 'General',
      getValue: (vehicle) => {
        return vehicle.modifications.reduce((total, mod) => total + mod.price, 0);
      },
    }
  ];
  
  // Toggle vehicle selection
  const toggleVehicleSelection = (vehicleId: number) => {
    setSelectedVehicles(prev => {
      if (prev.includes(vehicleId)) {
        // Don't allow deselecting the last vehicle
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== vehicleId);
      } else {
        return [...prev, vehicleId];
      }
    });
  };
  
  // Set single vehicle for comparison
  const selectSingleVehicle = (vehicleId: number) => {
    setSelectedVehicles([vehicleId]);
  };
  
  // Handle adding a modification to a vehicle
  const handleAddModification = (vehicleId: number, modId: number) => {
    if (onSelectModification) {
      onSelectModification(vehicleId, modId);
    } else {
      toast({
        title: "Modification Added",
        description: "This modification would be added to your vehicle in a real implementation.",
      });
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Get compatible modifications for the selected vehicles
  const getCompatibleModifications = () => {
    // Find mods that are compatible with ALL selected vehicles
    return availableModifications.filter(mod => 
      selectedVehicles.every(vehicleId => mod.compatibleWith.includes(vehicleId))
    );
  };
  
  // Get highest value among selected vehicles for a property
  const getHighestValue = (property: ComparisonProperty) => {
    const filteredVehicles = userVehicles.filter(v => selectedVehicles.includes(v.id));
    const values = filteredVehicles.map(v => property.getValue(v));
    
    // Filter out non-numeric or '-' values
    const numericValues = values.filter(v => typeof v === 'number');
    
    return numericValues.length > 0 ? Math.max(...numericValues as number[]) : null;
  };
  
  // Get lowest value among selected vehicles for a property
  const getLowestValue = (property: ComparisonProperty) => {
    const filteredVehicles = userVehicles.filter(v => selectedVehicles.includes(v.id));
    const values = filteredVehicles.map(v => property.getValue(v));
    
    // Filter out non-numeric or '-' values
    const numericValues = values.filter(v => typeof v === 'number');
    
    return numericValues.length > 0 ? Math.min(...numericValues as number[]) : null;
  };
  
  // Check if a value is the best (highest or lowest depending on property)
  const isBestValue = (property: ComparisonProperty, value: any, vehicleId: number) => {
    if (typeof value !== 'number' || selectedVehicles.length < 2) return false;
    
    if (property.higherIsBetter) {
      const highest = getHighestValue(property);
      return value === highest;
    } else {
      const lowest = getLowestValue(property);
      return value === lowest;
    }
  };
  
  // Format a property value for display
  const formatPropertyValue = (property: ComparisonProperty, value: any) => {
    if (value === '-') return '-';
    
    if (property.id === 'modCost') {
      return formatCurrency(value);
    }
    
    if (typeof value === 'number') {
      return property.unit ? `${value.toLocaleString()} ${property.unit}` : value.toLocaleString();
    }
    
    return value;
  };
  
  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <CardHeader>
        <CardTitle>Multiple Vehicle Management</CardTitle>
        <CardDescription>
          Compare specifications, modifications, and compatibility across your vehicles
        </CardDescription>
      </CardHeader>
      
      {/* Vehicle selection */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-medium mb-2">Your Vehicles</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          {userVehicles.map(vehicle => (
            <Card 
              key={vehicle.id}
              className={`cursor-pointer overflow-hidden transition-all ${
                selectedVehicles.includes(vehicle.id) 
                  ? 'ring-2 ring-primary' 
                  : 'opacity-70 hover:opacity-100'
              }`}
              onClick={() => toggleVehicleSelection(vehicle.id)}
            >
              <div className="h-28 relative overflow-hidden bg-muted">
                {vehicle.image ? (
                  <img 
                    src={vehicle.image} 
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                
                {selectedVehicles.includes(vehicle.id) && (
                  <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                )}
                
                {vehicle.modifications.length > 0 && (
                  <Badge className="absolute bottom-2 left-2 bg-primary/80">
                    {vehicle.modifications.length} Mods
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-2">
                <h4 className="font-medium text-sm truncate">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h4>
                {vehicle.licensePlate && (
                  <p className="text-xs text-muted-foreground truncate">
                    {vehicle.licensePlate}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
          
          {onAddVehicle && (
            <Card 
              className="cursor-pointer hover:bg-accent/50 transition-colors h-full"
              onClick={onAddVehicle}
            >
              <CardContent className="h-full flex flex-col items-center justify-center p-4">
                <PlusCircle className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-center">Add Vehicle</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">
            {selectedVehicles.length} of {userVehicles.length} vehicles selected
          </span>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedVehicles(userVehicles.map(v => v.id))}
              disabled={selectedVehicles.length === userVehicles.length}
            >
              Select All
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedVehicles(selectedVehicles.length > 1 ? [selectedVehicles[0]] : [userVehicles[0].id])}
              disabled={selectedVehicles.length === 1}
            >
              Select One
            </Button>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Comparison tabs */}
      <Tabs 
        defaultValue="specs" 
        className="w-full"
        onValueChange={(value) => setComparisonMode(value as any)}
      >
        <div className="px-4 pt-4">
          <TabsList className="w-full">
            <TabsTrigger value="specs" className="flex-1">
              <Gauge className="h-4 w-4 mr-2" />
              Specifications
            </TabsTrigger>
            <TabsTrigger value="mods" className="flex-1">
              <Wrench className="h-4 w-4 mr-2" />
              Modifications
            </TabsTrigger>
            <TabsTrigger value="compatibility" className="flex-1">
              <Sparkles className="h-4 w-4 mr-2" />
              Compatible Parts
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Specifications comparison */}
        <TabsContent value="specs" className="p-4">
          {selectedVehicles.length === 0 ? (
            <div className="text-center p-10">
              <Car className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <h3 className="font-medium">No Vehicles Selected</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Please select at least one vehicle to see specifications.
              </p>
            </div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Specification</TableHead>
                    {userVehicles
                      .filter(vehicle => selectedVehicles.includes(vehicle.id))
                      .map(vehicle => (
                        <TableHead key={vehicle.id} className="text-center">
                          {vehicle.make} {vehicle.model}
                        </TableHead>
                      ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {specProperties.map(property => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">
                        {property.name}
                        {property.unit && <span className="text-muted-foreground ml-1">({property.unit})</span>}
                      </TableCell>
                      
                      {userVehicles
                        .filter(vehicle => selectedVehicles.includes(vehicle.id))
                        .map(vehicle => {
                          const value = property.getValue(vehicle);
                          const isBest = isBestValue(property, value, vehicle.id);
                          
                          return (
                            <TableCell 
                              key={vehicle.id} 
                              className={`text-center ${isBest ? 'font-semibold text-primary' : ''}`}
                            >
                              {formatPropertyValue(property, value)}
                              {isBest && selectedVehicles.length > 1 && (
                                <Badge variant="outline" className="ml-1">Best</Badge>
                              )}
                            </TableCell>
                          );
                        })
                      }
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        {/* Modifications comparison */}
        <TabsContent value="mods" className="p-4">
          {selectedVehicles.length === 0 ? (
            <div className="text-center p-10">
              <Wrench className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <h3 className="font-medium">No Vehicles Selected</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Please select at least one vehicle to see modifications.
              </p>
            </div>
          ) : selectedVehicles.length === 1 ? (
            // Single vehicle selected - show detailed mods
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">
                  Modifications for {userVehicles.find(v => v.id === selectedVehicles[0])?.make} {userVehicles.find(v => v.id === selectedVehicles[0])?.model}
                </h3>
                <Button size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Modification
                </Button>
              </div>
              
              {userVehicles.find(v => v.id === selectedVehicles[0])?.modifications.length === 0 ? (
                <div className="text-center p-6 border rounded-lg">
                  <Wrench className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-medium">No Modifications Installed</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    This vehicle doesn't have any modifications installed yet.
                  </p>
                  <Button className="mt-4" size="sm">
                    Browse Modifications
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {userVehicles.find(v => v.id === selectedVehicles[0])?.modifications.map(mod => (
                    <Card key={mod.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        {mod.image && (
                          <div className="w-full md:w-48 h-40 md:h-auto overflow-hidden">
                            <img 
                              src={mod.image} 
                              alt={mod.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{mod.name}</h4>
                              <Badge variant="outline">{mod.category}</Badge>
                              {mod.installedDate && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Installed on: {new Date(mod.installedDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <p className="font-semibold">
                              {formatCurrency(mod.price)}
                            </p>
                          </div>
                          
                          {mod.performance && (
                            <div className="grid grid-cols-3 gap-2 mt-4">
                              {mod.performance.horsepowerGain && (
                                <div className="border rounded-md p-2 text-center">
                                  <p className="text-xs text-muted-foreground">Horsepower</p>
                                  <p className="font-medium text-green-600">+{mod.performance.horsepowerGain} HP</p>
                                </div>
                              )}
                              {mod.performance.torqueGain && (
                                <div className="border rounded-md p-2 text-center">
                                  <p className="text-xs text-muted-foreground">Torque</p>
                                  <p className="font-medium text-green-600">+{mod.performance.torqueGain} Nm</p>
                                </div>
                              )}
                              {mod.performance.weightChange !== undefined && (
                                <div className="border rounded-md p-2 text-center">
                                  <p className="text-xs text-muted-foreground">Weight</p>
                                  <p className={`font-medium ${mod.performance.weightChange < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                                    {mod.performance.weightChange > 0 ? '+' : ''}{mod.performance.weightChange} kg
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Multiple vehicles selected - show comparison table
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Vehicle</TableHead>
                    <TableHead>Total Mods</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Performance Impact</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userVehicles
                    .filter(vehicle => selectedVehicles.includes(vehicle.id))
                    .map(vehicle => {
                      const totalModsCost = vehicle.modifications.reduce((total, mod) => total + mod.price, 0);
                      const horsepowerGain = vehicle.modifications.reduce((total, mod) => total + (mod.performance?.horsepowerGain || 0), 0);
                      const torqueGain = vehicle.modifications.reduce((total, mod) => total + (mod.performance?.torqueGain || 0), 0);
                      const weightChange = vehicle.modifications.reduce((total, mod) => total + (mod.performance?.weightChange || 0), 0);
                      
                      // Get unique categories
                      const categories = [...new Set(vehicle.modifications.map(mod => mod.category))];
                      
                      return (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-medium">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </TableCell>
                          <TableCell>{vehicle.modifications.length}</TableCell>
                          <TableCell>{formatCurrency(totalModsCost)}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {horsepowerGain > 0 && (
                                <div className="flex items-center">
                                  <Gauge className="h-3 w-3 mr-1 text-green-600" />
                                  <span className="text-xs">+{horsepowerGain} HP</span>
                                </div>
                              )}
                              {torqueGain > 0 && (
                                <div className="flex items-center">
                                  <Gauge className="h-3 w-3 mr-1 text-green-600" />
                                  <span className="text-xs">+{torqueGain} Nm</span>
                                </div>
                              )}
                              {weightChange !== 0 && (
                                <div className="flex items-center">
                                  <Scale className="h-3 w-3 mr-1 text-orange-600" />
                                  <span className="text-xs">{weightChange > 0 ? '+' : ''}{weightChange} kg</span>
                                </div>
                              )}
                              {horsepowerGain === 0 && torqueGain === 0 && weightChange === 0 && (
                                <span className="text-xs text-muted-foreground">No impact</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {categories.map(category => (
                                <Badge key={category} variant="outline" className="text-xs">
                                  {category}
                                </Badge>
                              ))}
                              {categories.length === 0 && (
                                <span className="text-xs text-muted-foreground">None</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => selectSingleVehicle(vehicle.id)}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        {/* Compatibility tab */}
        <TabsContent value="compatibility" className="p-4">
          {selectedVehicles.length === 0 ? (
            <div className="text-center p-10">
              <Sparkles className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <h3 className="font-medium">No Vehicles Selected</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Please select at least one vehicle to see compatible parts.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium">Compatible Parts</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedVehicles.length === 1 
                    ? `Parts compatible with your ${userVehicles.find(v => v.id === selectedVehicles[0])?.make} ${userVehicles.find(v => v.id === selectedVehicles[0])?.model}`
                    : `Parts compatible with all ${selectedVehicles.length} selected vehicles`}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getCompatibleModifications().length > 0 ? getCompatibleModifications().map(mod => (
                  <Card key={mod.id} className="overflow-hidden">
                    <div className="h-40 overflow-hidden relative">
                      {mod.image && (
                        <img 
                          src={mod.image} 
                          alt={mod.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                        <div>
                          <h4 className="text-white font-semibold">{mod.name}</h4>
                          <p className="text-white/80 text-sm">{mod.category}</p>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant="outline">{mod.category}</Badge>
                        <span className="font-semibold">{formatCurrency(mod.price)}</span>
                      </div>
                      
                      {mod.performance && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {mod.performance.horsepowerGain && (
                            <Badge variant="secondary">+{mod.performance.horsepowerGain} HP</Badge>
                          )}
                          {mod.performance.torqueGain && (
                            <Badge variant="secondary">+{mod.performance.torqueGain} Nm</Badge>
                          )}
                          {mod.performance.weightChange !== undefined && mod.performance.weightChange < 0 && (
                            <Badge variant="secondary">{mod.performance.weightChange} kg</Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mr-1"
                          onClick={() => {
                            // View details
                          }}
                        >
                          Details
                        </Button>
                        <Button 
                          size="sm" 
                          className="w-full ml-1"
                          onClick={() => {
                            // If one vehicle is selected, add to that vehicle
                            // Otherwise, show a list to select which vehicle to add to
                            if (selectedVehicles.length === 1) {
                              handleAddModification(selectedVehicles[0], mod.id);
                            } else {
                              toast({
                                title: "Multiple Vehicles Selected",
                                description: "Please select a single vehicle to add this modification.",
                              });
                            }
                          }}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="col-span-full text-center p-6 border rounded-lg">
                    <HelpCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <h3 className="font-medium">No Compatible Parts Found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedVehicles.length === 1 
                        ? "We couldn't find compatible parts for this vehicle."
                        : "We couldn't find parts compatible with all selected vehicles."}
                    </p>
                    {selectedVehicles.length > 1 && (
                      <Button className="mt-4" size="sm" variant="outline" onClick={() => setSelectedVehicles([selectedVehicles[0]])}>
                        Try with fewer vehicles
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultiVehicleComparison;