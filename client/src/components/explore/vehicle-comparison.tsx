import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  X, 
  ChevronDown, 
  ArrowRight, 
  Check, 
  AlertTriangle,
  Download,
  Share2,
  Trash2,
  FileText,
  BarChart4,
  ShieldCheck,
  Car,
  Wrench,
  Star,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  type: string;
  image: string;
  price: {
    base: number;
    topTrim: number;
  };
  engine: {
    type: string;
    displacement: number;
    power: number;
    torque: number;
    transmission: string;
    fuelEfficiency: number;
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
    wheelbase: number;
    groundClearance: number;
    bootSpace: number;
  };
  features: string[];
  safety: {
    airbags: number;
    rating: number;
    features: string[];
  };
  warranty: string;
  maintenance: number;
  ratings: {
    expert: number;
    user: number;
  };
}

interface VehicleComparisonProps {
  className?: string;
}

const VehicleComparison: React.FC<VehicleComparisonProps> = ({ className = '' }) => {
  const [selectedVehicles, setSelectedVehicles] = useState<(Vehicle | null)[]>([null, null, null]);
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [expandedFeatures, setExpandedFeatures] = useState(false);

  const addVehicle = (vehicle: Vehicle, slot: number) => {
    const updatedVehicles = [...selectedVehicles];
    updatedVehicles[slot] = vehicle;
    setSelectedVehicles(updatedVehicles);
  };

  const removeVehicle = (slot: number) => {
    const updatedVehicles = [...selectedVehicles];
    updatedVehicles[slot] = null;
    setSelectedVehicles(updatedVehicles);
  };

  const clearAllVehicles = () => {
    setSelectedVehicles([null, null, null]);
  };

  const findBestValue = (key: string, isHigherBetter: boolean = true) => {
    const validVehicles = selectedVehicles.filter(v => v !== null) as Vehicle[];
    if (validVehicles.length === 0) return null;

    let bestIndex = -1;
    let bestValue: any = null;

    validVehicles.forEach((vehicle, idx) => {
      // Navigate down the object path (e.g., 'engine.power')
      const keyParts = key.split('.');
      let value = vehicle as any;
      for (const part of keyParts) {
        if (value === null || value === undefined) break;
        value = value[part];
      }

      if (bestValue === null || 
          (isHigherBetter && value > bestValue) || 
          (!isHigherBetter && value < bestValue)) {
        bestValue = value;
        bestIndex = selectedVehicles.indexOf(vehicle);
      }
    });

    return bestIndex;
  };

  // Create a function to determine if a value should be highlighted
  const shouldHighlight = (vehicleIndex: number, key: string, isHigherBetter: boolean = true) => {
    if (!highlightDifferences) return false;
    if (selectedVehicles[vehicleIndex] === null) return false;

    const bestIndex = findBestValue(key, isHigherBetter);
    return bestIndex === vehicleIndex;
  };

  // Sample vehicle data
  const sampleVehicles: Vehicle[] = [
    {
      id: 1,
      make: 'Honda',
      model: 'City',
      year: 2023,
      type: 'Sedan',
      image: 'https://images.unsplash.com/photo-1566473965997-3de9c817e938?q=80&w=200',
      price: {
        base: 1250000,
        topTrim: 1850000
      },
      engine: {
        type: 'Petrol',
        displacement: 1498,
        power: 121,
        torque: 145,
        transmission: '6-Speed Manual/CVT',
        fuelEfficiency: 19.5
      },
      dimensions: {
        length: 4549,
        width: 1748,
        height: 1489,
        wheelbase: 2600,
        groundClearance: 165,
        bootSpace: 506
      },
      features: [
        'Sunroof',
        '8-inch Touchscreen',
        'Wireless Android Auto & Apple CarPlay',
        'Automatic Climate Control',
        'Cruise Control',
        'LED Headlamps',
        'Keyless Entry',
        'Push Button Start',
        'Wireless Charger',
        'Rear AC Vents'
      ],
      safety: {
        airbags: 6,
        rating: 5,
        features: [
          'ABS with EBD',
          'Electronic Stability Control',
          'Hill Start Assist',
          'ISOFIX Child Seat Mounts',
          'Rear Parking Camera with Sensors',
          'Tyre Pressure Monitoring System'
        ]
      },
      warranty: '3 Years / 100,000 km',
      maintenance: 6500,
      ratings: {
        expert: 4.5,
        user: 4.3
      }
    },
    {
      id: 2,
      make: 'Hyundai',
      model: 'Creta',
      year: 2023,
      type: 'SUV',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=200',
      price: {
        base: 1050000,
        topTrim: 1850000
      },
      engine: {
        type: 'Petrol/Diesel',
        displacement: 1497,
        power: 115,
        torque: 250,
        transmission: '6-Speed Manual/Auto',
        fuelEfficiency: 21
      },
      dimensions: {
        length: 4300,
        width: 1790,
        height: 1635,
        wheelbase: 2610,
        groundClearance: 190,
        bootSpace: 433
      },
      features: [
        'Panoramic Sunroof',
        '10.25-inch Touchscreen',
        'Bose Premium Sound System',
        'Ventilated Seats',
        'BlueLink Connected Car Technology',
        'Ambient Lighting',
        'Electric Parking Brake',
        'Air Purifier',
        'Wireless Charging',
        'Drive Modes'
      ],
      safety: {
        airbags: 6,
        rating: 5,
        features: [
          'ABS with EBD',
          'Electronic Stability Control',
          'Vehicle Stability Management',
          'Hill Start Assist',
          'Blind Spot Monitor',
          '360° Camera',
          'Front Parking Sensors'
        ]
      },
      warranty: '3 Years / Unlimited km',
      maintenance: 7500,
      ratings: {
        expert: 4.3,
        user: 4.2
      }
    },
    {
      id: 3,
      make: 'Tata',
      model: 'Nexon',
      year: 2023,
      type: 'Compact SUV',
      image: 'https://images.unsplash.com/photo-1609679975088-bcb459448956?q=80&w=200',
      price: {
        base: 800000,
        topTrim: 1450000
      },
      engine: {
        type: 'Petrol/Diesel/Electric',
        displacement: 1199,
        power: 120,
        torque: 170,
        transmission: '6-Speed Manual/AMT',
        fuelEfficiency: 17.5
      },
      dimensions: {
        length: 3993,
        width: 1811,
        height: 1606,
        wheelbase: 2498,
        groundClearance: 208,
        bootSpace: 350
      },
      features: [
        'Electric Sunroof',
        '10.25-inch Touchscreen',
        'iRA Connected Car Tech',
        'Auto Headlamps',
        'Rain-sensing Wipers',
        'Cooled Glovebox',
        'Cruise Control',
        'Tyre Pressure Monitoring System',
        'JBL Audio System',
        'Terrain Response Modes'
      ],
      safety: {
        airbags: 6,
        rating: 5,
        features: [
          'ABS with EBD',
          'Electronic Stability Program',
          'Rollover Mitigation',
          'Hill Hold Control',
          'ISOFIX Child Seat Mounts',
          'Break Disc Wiping',
          'Electronic Traction Control'
        ]
      },
      warranty: '2 Years / 75,000 km',
      maintenance: 5000,
      ratings: {
        expert: 4.2,
        user: 4.4
      }
    },
    {
      id: 4,
      make: 'Maruti Suzuki',
      model: 'Swift',
      year: 2023,
      type: 'Hatchback',
      image: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=200',
      price: {
        base: 590000,
        topTrim: 850000
      },
      engine: {
        type: 'Petrol/CNG',
        displacement: 1197,
        power: 89,
        torque: 113,
        transmission: '5-Speed Manual/AMT',
        fuelEfficiency: 23.2
      },
      dimensions: {
        length: 3845,
        width: 1735,
        height: 1530,
        wheelbase: 2450,
        groundClearance: 163,
        bootSpace: 268
      },
      features: [
        '7-inch Touchscreen',
        'Apple CarPlay & Android Auto',
        'Automatic Climate Control',
        'LED Projector Headlamps',
        'Keyless Entry',
        'Push Button Start',
        'Height Adjustable Driver Seat',
        'Rear Parking Sensors',
        'Voice Recognition',
        'Steering Mounted Controls'
      ],
      safety: {
        airbags: 2,
        rating: 4,
        features: [
          'ABS with EBD',
          'ISOFIX Child Seat Anchors',
          'Engine Immobilizer',
          'Reverse Parking Sensors',
          'High-Speed Alert System',
          'Impact Sensing Door Unlock'
        ]
      },
      warranty: '2 Years / 40,000 km',
      maintenance: 4000,
      ratings: {
        expert: 4.1,
        user: 4.5
      }
    },
    {
      id: 5,
      make: 'Mahindra',
      model: 'XUV700',
      year: 2023,
      type: 'SUV',
      image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=200',
      price: {
        base: 1380000,
        topTrim: 2450000
      },
      engine: {
        type: 'Petrol/Diesel',
        displacement: 2184,
        power: 197,
        torque: 380,
        transmission: '6-Speed Manual/Auto',
        fuelEfficiency: 16.5
      },
      dimensions: {
        length: 4695,
        width: 1890,
        height: 1755,
        wheelbase: 2750,
        groundClearance: 200,
        bootSpace: 645
      },
      features: [
        'Panoramic Sunroof',
        'Dual 10.25-inch Screens',
        'ADAS Features',
        'Amazon Alexa Built-in',
        'Wireless Android Auto & Apple CarPlay',
        '7-Speaker Sound System',
        'Dual-zone Climate Control',
        'Power Adjustable Driver Seat',
        'Built-in Air Purifier',
        'Adaptive Cruise Control'
      ],
      safety: {
        airbags: 7,
        rating: 5,
        features: [
          'ABS with EBD',
          'Electronic Stability Program',
          'Forward Collision Warning',
          'Autonomous Emergency Braking',
          'Lane Keep Assist',
          'Driver Drowsiness Detection',
          'Smart Pilot Assist'
        ]
      },
      warranty: '3 Years / 100,000 km',
      maintenance: 9000,
      ratings: {
        expert: 4.6,
        user: 4.3
      }
    }
  ];

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  return (
    <div className={`${className}`}>
      <Card className="bg-card">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">Vehicle Comparison</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="highlight-diff"
                  checked={highlightDifferences}
                  onCheckedChange={setHighlightDifferences}
                />
                <Label htmlFor="highlight-diff" className="text-sm">Highlight Differences</Label>
              </div>
              <Button variant="outline" size="sm" onClick={clearAllVehicles}>
                <Trash2 className="h-4 w-4 mr-1" /> Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {selectedVehicles.map((vehicle, index) => (
              <Card 
                key={index} 
                className="min-w-[250px] w-1/3 flex-shrink-0"
              >
                <CardHeader className="p-3 pb-0 text-center relative">
                  {vehicle && (
                    <button 
                      className="absolute top-2 right-2 h-6 w-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20"
                      onClick={() => removeVehicle(index)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                  {vehicle ? (
                    <div className="space-y-1">
                      <div className="h-32 flex items-center justify-center bg-muted rounded-md overflow-hidden">
                        <img 
                          src={vehicle.image}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h3 className="font-medium text-sm mt-2">{vehicle.make} {vehicle.model}</h3>
                      <p className="text-xs text-muted-foreground">{vehicle.year} • {vehicle.type}</p>
                    </div>
                  ) : (
                    <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed rounded-md border-muted-foreground/20">
                      <Select onValueChange={(value) => {
                        const selectedVehicle = sampleVehicles.find(v => v.id === parseInt(value));
                        if (selectedVehicle) {
                          addVehicle(selectedVehicle, index);
                        }
                      }}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select Vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          {sampleVehicles.map((v) => (
                            <SelectItem key={v.id} value={v.id.toString()}>
                              {v.make} {v.model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-2">Add a vehicle to compare</p>
                    </div>
                  )}
                </CardHeader>
                {vehicle && (
                  <CardContent className="p-3 pt-2">
                    <div className="text-sm font-medium">
                      {formatPrice(vehicle.price.base)} - {formatPrice(vehicle.price.topTrim)}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {vehicle.engine.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {vehicle.engine.fuelEfficiency} km/l
                      </Badge>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-6 mb-4 w-full">
              <TabsTrigger value="basic" className="text-xs">
                <Car className="h-3 w-3 mr-1" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="performance" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="features" className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                Features
              </TabsTrigger>
              <TabsTrigger value="costs" className="text-xs">
                <BarChart4 className="h-3 w-3 mr-1" />
                Costs
              </TabsTrigger>
              <TabsTrigger value="safety" className="text-xs">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Safety
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-xs font-medium w-1/4">Dimensions (L×W×H)</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''}`}
                      >
                        {vehicle ? `${vehicle.dimensions.length} × ${vehicle.dimensions.width} × ${vehicle.dimensions.height} mm` : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-xs font-medium">Wheelbase</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''} ${shouldHighlight(idx, 'dimensions.wheelbase') ? 'font-medium text-green-600' : ''}`}
                      >
                        {vehicle ? `${vehicle.dimensions.wheelbase} mm` : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-xs font-medium">Ground Clearance</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''} ${shouldHighlight(idx, 'dimensions.groundClearance') ? 'font-medium text-green-600' : ''}`}
                      >
                        {vehicle ? `${vehicle.dimensions.groundClearance} mm` : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-xs font-medium">Boot Space</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''} ${shouldHighlight(idx, 'dimensions.bootSpace') ? 'font-medium text-green-600' : ''}`}
                      >
                        {vehicle ? `${vehicle.dimensions.bootSpace} litres` : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-xs font-medium">Body Type</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''}`}
                      >
                        {vehicle ? vehicle.type : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-medium">Warranty</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''}`}
                      >
                        {vehicle ? vehicle.warranty : 'N/A'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-xs font-medium w-1/4">Engine Type</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''}`}
                      >
                        {vehicle ? vehicle.engine.type : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-xs font-medium">Displacement</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''}`}
                      >
                        {vehicle ? `${vehicle.engine.displacement} cc` : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-xs font-medium">Power</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''} ${shouldHighlight(idx, 'engine.power') ? 'font-medium text-green-600' : ''}`}
                      >
                        {vehicle ? `${vehicle.engine.power} bhp` : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-xs font-medium">Torque</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''} ${shouldHighlight(idx, 'engine.torque') ? 'font-medium text-green-600' : ''}`}
                      >
                        {vehicle ? `${vehicle.engine.torque} Nm` : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-xs font-medium">Transmission</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''}`}
                      >
                        {vehicle ? vehicle.engine.transmission : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-medium">Fuel Efficiency</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''} ${shouldHighlight(idx, 'engine.fuelEfficiency') ? 'font-medium text-green-600' : ''}`}
                      >
                        {vehicle ? `${vehicle.engine.fuelEfficiency} km/l` : 'N/A'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Key Features</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setExpandedFeatures(!expandedFeatures)}
                  className="h-8 text-xs"
                >
                  {expandedFeatures ? 'Show Less' : 'Show All'}
                </Button>
              </div>

              <table className="w-full border-collapse">
                <tbody>
                  {/* Map through all possible features and show which cars have them */}
                  {['Sunroof', 'Touchscreen Infotainment', 'Apple CarPlay & Android Auto', 'Climate Control', 'Cruise Control', 'LED Headlamps', 'Keyless Entry', 'Push Button Start', 'Wireless Charger', 'Rear AC Vents'].map((feature, featureIdx) => (
                    (expandedFeatures || featureIdx < 5) && (
                      <tr key={feature} className="border-b">
                        <th className="text-left py-2 px-3 text-xs font-medium w-1/4">{feature}</th>
                        {selectedVehicles.map((vehicle, idx) => (
                          <td 
                            key={idx} 
                            className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''}`}
                          >
                            {vehicle ? (
                              vehicle.features.some(f => f.includes(feature)) ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )
                            ) : 'N/A'}
                          </td>
                        ))}
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </TabsContent>

            <TabsContent value="costs" className="space-y-4">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-xs font-medium w-1/4">Base Price</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''} ${shouldHighlight(idx, 'price.base', false) ? 'font-medium text-green-600' : ''}`}
                      >
                        {vehicle ? formatPrice(vehicle.price.base) : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-xs font-medium">Top Trim Price</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''}`}
                      >
                        {vehicle ? formatPrice(vehicle.price.topTrim) : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-xs font-medium">Annual Maintenance</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''} ${shouldHighlight(idx, 'maintenance', false) ? 'font-medium text-green-600' : ''}`}
                      >
                        {vehicle ? `₹${vehicle.maintenance.toLocaleString()}/year` : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-xs font-medium">EMI Estimate</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''}`}
                      >
                        {vehicle ? `₹${Math.round(vehicle.price.base / 60).toLocaleString()}/month` : 'N/A'}
                        {vehicle && <div className="text-xs text-muted-foreground">5 years, 10% interest</div>}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </TabsContent>

            <TabsContent value="safety" className="space-y-4">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-xs font-medium w-1/4">Safety Rating</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''} ${shouldHighlight(idx, 'safety.rating') ? 'font-medium text-green-600' : ''}`}
                      >
                        {vehicle ? (
                          <div className="flex items-center">
                            {Array(vehicle.safety.rating).fill(0).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current text-yellow-500" />
                            ))}
                            {Array(5 - vehicle.safety.rating).fill(0).map((_, i) => (
                              <Star key={i} className="h-3 w-3 text-muted-foreground/40" />
                            ))}
                          </div>
                        ) : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-xs font-medium">Airbags</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''} ${shouldHighlight(idx, 'safety.airbags') ? 'font-medium text-green-600' : ''}`}
                      >
                        {vehicle ? `${vehicle.safety.airbags}` : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  {['ABS with EBD', 'Electronic Stability Control', 'Hill Start Assist', 'ISOFIX Child Seat Mounts', 'Rear Parking Camera'].map((feature) => (
                    <tr key={feature} className="border-b">
                      <th className="text-left py-2 px-3 text-xs font-medium">{feature}</th>
                      {selectedVehicles.map((vehicle, idx) => (
                        <td 
                          key={idx} 
                          className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''}`}
                        >
                          {vehicle ? (
                            vehicle.safety.features.some(f => f.includes(feature)) ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )
                          ) : 'N/A'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-xs font-medium w-1/4">Expert Rating</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''} ${shouldHighlight(idx, 'ratings.expert') ? 'font-medium text-green-600' : ''}`}
                      >
                        {vehicle ? (
                          <div className="flex items-center">
                            <div className="flex mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-3 w-3 ${star <= Math.floor(vehicle.ratings.expert) ? 'text-yellow-500 fill-current' : star <= vehicle.ratings.expert ? 'text-yellow-500 fill-current' : 'text-muted-foreground/40'}`}
                                />
                              ))}
                            </div>
                            <span>{vehicle.ratings.expert}/5</span>
                          </div>
                        ) : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-xs font-medium">User Rating</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''} ${shouldHighlight(idx, 'ratings.user') ? 'font-medium text-green-600' : ''}`}
                      >
                        {vehicle ? (
                          <div className="flex items-center">
                            <div className="flex mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-3 w-3 ${star <= Math.floor(vehicle.ratings.user) ? 'text-yellow-500 fill-current' : star <= vehicle.ratings.user ? 'text-yellow-500 fill-current' : 'text-muted-foreground/40'}`}
                                />
                              ))}
                            </div>
                            <span>{vehicle.ratings.user}/5</span>
                          </div>
                        ) : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-xs font-medium">Pros</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''}`}
                      >
                        {vehicle ? (
                          <ul className="list-disc pl-4 space-y-1">
                            {vehicle.id === 1 && (
                              <>
                                <li>Premium Sedan Feel</li>
                                <li>Refined Engine</li>
                                <li>Feature Loaded</li>
                              </>
                            )}
                            {vehicle.id === 2 && (
                              <>
                                <li>Comfortable Ride</li>
                                <li>Premium Features</li>
                                <li>Multiple Powertrain Options</li>
                              </>
                            )}
                            {vehicle.id === 3 && (
                              <>
                                <li>Top Safety Ratings</li>
                                <li>Value for Money</li>
                                <li>Bold Design</li>
                              </>
                            )}
                            {vehicle.id === 4 && (
                              <>
                                <li>Excellent Fuel Efficiency</li>
                                <li>Fun to Drive</li>
                                <li>Low Maintenance</li>
                              </>
                            )}
                            {vehicle.id === 5 && (
                              <>
                                <li>Powerful Engine</li>
                                <li>Advanced ADAS Features</li>
                                <li>Spacious Cabin</li>
                              </>
                            )}
                          </ul>
                        ) : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-medium">Cons</th>
                    {selectedVehicles.map((vehicle, idx) => (
                      <td 
                        key={idx} 
                        className={`py-2 px-3 text-xs ${!vehicle ? 'text-muted-foreground italic' : ''}`}
                      >
                        {vehicle ? (
                          <ul className="list-disc pl-4 space-y-1">
                            {vehicle.id === 1 && (
                              <>
                                <li>Average Ground Clearance</li>
                                <li>Higher Variants Expensive</li>
                                <li>Limited Back Seat Space</li>
                              </>
                            )}
                            {vehicle.id === 2 && (
                              <>
                                <li>Fuel Efficiency</li>
                                <li>Firm Ride on Bad Roads</li>
                                <li>Long Waiting Period</li>
                              </>
                            )}
                            {vehicle.id === 3 && (
                              <>
                                <li>Average Interior Quality</li>
                                <li>Limited Boot Space</li>
                                <li>Engine Refinement</li>
                              </>
                            )}
                            {vehicle.id === 4 && (
                              <>
                                <li>Limited Safety Features</li>
                                <li>Average Build Quality</li>
                                <li>Small Boot Space</li>
                              </>
                            )}
                            {vehicle.id === 5 && (
                              <>
                                <li>Fuel Economy</li>
                                <li>Expensive Top Variants</li>
                                <li>Software Glitches</li>
                              </>
                            )}
                          </ul>
                        ) : 'N/A'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end mt-6 gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleComparison;