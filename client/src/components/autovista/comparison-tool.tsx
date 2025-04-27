import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Info, Check, X, Share2, Download, BarChart3, Shield, Clock, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import ContentReaction from '@/components/ui/content-reaction';

interface ComparisonToolProps {
  isPreowned?: boolean;
}
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ComparisonVehicle {
  id: number;
  name: string;
  manufacturer: string;
  model: string;
  year: number;
  price: number;
  fuelType: string;
  imageUrl: string;
}

// Sample vehicle data for new vehicles
const sampleNewVehicles: ComparisonVehicle[] = [
  {
    id: 1,
    name: 'Hyundai Creta',
    manufacturer: 'Hyundai',
    model: 'Creta',
    year: 2023,
    price: 1300000,
    fuelType: 'Petrol',
    imageUrl: 'https://images.unsplash.com/photo-1605515298946-d730802e22e1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  {
    id: 2,
    name: 'Tata Nexon',
    manufacturer: 'Tata',
    model: 'Nexon',
    year: 2023,
    price: 900000,
    fuelType: 'Diesel',
    imageUrl: 'https://images.unsplash.com/photo-1609089783094-51498e2f29c8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3'
  }
];

// Sample vehicle data for pre-owned vehicles 
const samplePreOwnedVehicles: ComparisonVehicle[] = [
  {
    id: 101,
    name: 'Hyundai Creta (Pre-owned)',
    manufacturer: 'Hyundai',
    model: 'Creta',
    year: 2020,
    price: 850000,
    fuelType: 'Petrol',
    imageUrl: 'https://images.unsplash.com/photo-1605515298946-d730802e22e1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  {
    id: 102,
    name: 'Tata Harrier (Pre-owned)',
    manufacturer: 'Tata',
    model: 'Harrier',
    year: 2021,
    price: 1200000,
    fuelType: 'Diesel',
    imageUrl: 'https://images.unsplash.com/photo-1609089783094-51498e2f29c8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3'
  }
];

// Sample comparison metrics
const comparisonMetrics = [
  { 
    category: 'Performance',
    metrics: [
      { name: 'Engine Displacement', unit: 'cc' },
      { name: 'Max Power', unit: 'HP' },
      { name: 'Max Torque', unit: 'Nm' },
      { name: '0-100 kmph', unit: 'seconds' },
      { name: 'Top Speed', unit: 'kmph' }
    ]
  },
  { 
    category: 'Efficiency',
    metrics: [
      { name: 'Mileage (City)', unit: 'kmpl' },
      { name: 'Mileage (Highway)', unit: 'kmpl' },
      { name: 'Fuel Tank Capacity', unit: 'liters' },
      { name: 'Range', unit: 'km' },
      { name: 'Emission Rating', unit: '' }
    ]
  },
  { 
    category: 'Dimensions',
    metrics: [
      { name: 'Length', unit: 'mm' },
      { name: 'Width', unit: 'mm' },
      { name: 'Height', unit: 'mm' },
      { name: 'Wheelbase', unit: 'mm' },
      { name: 'Boot Space', unit: 'liters' }
    ]
  },
  { 
    category: 'Features',
    metrics: [
      { name: 'Infotainment', unit: '' },
      { name: 'Safety Rating', unit: 'stars' },
      { name: 'Airbags', unit: '' },
      { name: 'Parking Sensors', unit: '' },
      { name: 'Sunroof', unit: '' }
    ]
  }
];

// Pre-owned specific comparison metrics
const preOwnedMetrics = { 
  category: 'Pre-owned Metrics',
  metrics: [
    { name: 'Service History', unit: '' },
    { name: 'Ownership Count', unit: '' },
    { name: 'Accident History', unit: '' },
    { name: 'Odometer Reading', unit: 'km' },
    { name: 'Inspection Score', unit: '/100' }
  ]
};

// Sample comparison data
const comparisonData: Record<string, any> = {
  // New vehicles
  1: {
    // Performance
    'Engine Displacement': '1497',
    'Max Power': '115',
    'Max Torque': '250',
    '0-100 kmph': '10.2',
    'Top Speed': '170',
    
    // Efficiency
    'Mileage (City)': '15.2',
    'Mileage (Highway)': '18.7',
    'Fuel Tank Capacity': '50',
    'Range': '935',
    'Emission Rating': 'BS6',
    
    // Dimensions
    'Length': '4300',
    'Width': '1790',
    'Height': '1635',
    'Wheelbase': '2610',
    'Boot Space': '433',
    
    // Features
    'Infotainment': '10.25-inch touchscreen',
    'Safety Rating': '5',
    'Airbags': '6',
    'Parking Sensors': 'Front & Rear',
    'Sunroof': 'Panoramic',
  },
  2: {
    // Performance
    'Engine Displacement': '1497',
    'Max Power': '110',
    'Max Torque': '260',
    '0-100 kmph': '11.5',
    'Top Speed': '165',
    
    // Efficiency
    'Mileage (City)': '17.5',
    'Mileage (Highway)': '22.4',
    'Fuel Tank Capacity': '44',
    'Range': '985',
    'Emission Rating': 'BS6',
    
    // Dimensions
    'Length': '3993',
    'Width': '1811',
    'Height': '1606',
    'Wheelbase': '2498',
    'Boot Space': '350',
    
    // Features
    'Infotainment': '7-inch touchscreen',
    'Safety Rating': '5',
    'Airbags': '6',
    'Parking Sensors': 'Rear only',
    'Sunroof': 'Single-pane',
  },

  // Pre-owned vehicles
  101: {
    // Performance
    'Engine Displacement': '1497',
    'Max Power': '115',
    'Max Torque': '250',
    '0-100 kmph': '10.5', // Slight performance decrease due to age
    'Top Speed': '168',
    
    // Efficiency
    'Mileage (City)': '14.8', // Slight efficiency decrease due to age
    'Mileage (Highway)': '18.2',
    'Fuel Tank Capacity': '50',
    'Range': '910',
    'Emission Rating': 'BS6',
    
    // Dimensions
    'Length': '4300',
    'Width': '1790',
    'Height': '1635',
    'Wheelbase': '2610',
    'Boot Space': '433',
    
    // Features
    'Infotainment': '10.25-inch touchscreen',
    'Safety Rating': '5',
    'Airbags': '6',
    'Parking Sensors': 'Front & Rear',
    'Sunroof': 'Panoramic',

    // Pre-owned Metrics
    'Service History': 'Complete',
    'Ownership Count': 'Single Owner',
    'Accident History': 'None',
    'Odometer Reading': '32,450',
    'Inspection Score': '92'
  },
  102: {
    // Performance
    'Engine Displacement': '1956',
    'Max Power': '170',
    'Max Torque': '350',
    '0-100 kmph': '10.8',
    'Top Speed': '180',
    
    // Efficiency
    'Mileage (City)': '13.5',
    'Mileage (Highway)': '16.8',
    'Fuel Tank Capacity': '50',
    'Range': '840',
    'Emission Rating': 'BS6',
    
    // Dimensions
    'Length': '4598',
    'Width': '1894',
    'Height': '1706',
    'Wheelbase': '2741',
    'Boot Space': '425',
    
    // Features
    'Infotainment': '8.8-inch touchscreen',
    'Safety Rating': '5',
    'Airbags': '6',
    'Parking Sensors': 'Front & Rear',
    'Sunroof': 'Panoramic',

    // Pre-owned Metrics
    'Service History': 'Partial',
    'Ownership Count': 'Second Owner',
    'Accident History': 'Minor (Repaired)',
    'Odometer Reading': '28,750',
    'Inspection Score': '87'
  }
};

const ComparisonTool: React.FC<ComparisonToolProps> = ({ isPreowned = false }) => {
  const [selectedVehicles, setSelectedVehicles] = useState<ComparisonVehicle[]>(isPreowned ? samplePreOwnedVehicles : sampleNewVehicles);
  const [selectedCategory, setSelectedCategory] = useState('Performance');
  
  // Format price to Indian format
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Compare values and determine which is better
  const compareValues = (metric: string, value1: string, value2: string): 'first' | 'second' | 'equal' => {
    // Metrics where higher is better
    const higherIsBetter = [
      'Max Power', 'Max Torque', 'Top Speed', 'Mileage (City)', 
      'Mileage (Highway)', 'Range', 'Boot Space', 'Airbags', 'Safety Rating'
    ];
    
    // Metrics where lower is better
    const lowerIsBetter = ['0-100 kmph', 'Price'];
    
    // Strings that indicate presence is better
    const presenceIsBetter = ['Yes', 'Front & Rear'];
    
    if (metric === 'Price') {
      const val1 = parseFloat(value1.replace(/[^\d.-]/g, ''));
      const val2 = parseFloat(value2.replace(/[^\d.-]/g, ''));
      
      if (val1 < val2) return 'first';
      if (val1 > val2) return 'second';
      return 'equal';
    }
    
    // If both values are numbers, compare them
    if (!isNaN(Number(value1)) && !isNaN(Number(value2))) {
      const val1 = parseFloat(value1);
      const val2 = parseFloat(value2);
      
      if (higherIsBetter.includes(metric)) {
        if (val1 > val2) return 'first';
        if (val1 < val2) return 'second';
        return 'equal';
      }
      
      if (lowerIsBetter.includes(metric)) {
        if (val1 < val2) return 'first';
        if (val1 > val2) return 'second';
        return 'equal';
      }
    }
    
    // For yes/no and similar presence fields
    if (presenceIsBetter.includes(value1) && !presenceIsBetter.includes(value2)) {
      return 'first';
    }
    if (!presenceIsBetter.includes(value1) && presenceIsBetter.includes(value2)) {
      return 'second';
    }
    
    // Default to equal if we can't determine
    return 'equal';
  };
  
  // Function to add a new vehicle to comparison
  const addVehicle = () => {
    // This would typically open a search dialog - for demo we'll just add a placeholder
    alert('In a real implementation, this would open a vehicle search dialog');
  };
  
  // Function to remove a vehicle from comparison
  const removeVehicle = (id: number) => {
    setSelectedVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${isPreowned ? 'preowned-theme' : ''}`}>
      <div className="p-6 md:p-8 border-b">
        <h2 className="text-2xl font-bold mb-6">{isPreowned ? 'Pre-owned Vehicle Comparison' : 'Vehicle Comparison'}</h2>
        
        <div className="flex flex-wrap gap-4">
          {/* Vehicle cards */}
          {selectedVehicles.map((vehicle) => (
            <motion.div 
              key={vehicle.id}
              className="relative border rounded-lg overflow-hidden w-full sm:w-48 md:w-56 flex-shrink-0 shadow-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <button 
                className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1 rounded-full z-10 hover:bg-white"
                onClick={() => removeVehicle(vehicle.id)}
              >
                <X className="h-4 w-4 text-neutral-500" />
              </button>
              
              <div className="h-32 overflow-hidden">
                <img 
                  src={vehicle.imageUrl} 
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-3">
                <h3 className="font-medium mb-1">{vehicle.name}</h3>
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-xs">
                    {vehicle.fuelType}
                  </Badge>
                  <span className="text-xs font-semibold text-neutral-700">
                    {formatPrice(vehicle.price)}
                  </span>
                </div>
              </div>
              
              <div className="bg-primary/5 border-t p-2 text-center">
                <div className="flex justify-center items-center">
                  <Check className="h-4 w-4 text-primary mr-1" />
                  <span className="text-xs font-medium">Selected for comparison</span>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Add vehicle card */}
          {selectedVehicles.length < 5 && (
            <motion.div 
              className="border border-dashed rounded-lg overflow-hidden w-full sm:w-48 md:w-56 flex-shrink-0 flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-neutral-50 transition-colors"
              onClick={addVehicle}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="bg-neutral-100 rounded-full p-2 mb-3">
                <Plus className="h-5 w-5 text-neutral-500" />
              </div>
              <p className="text-sm text-neutral-600 text-center">
                Add vehicle to compare
                <br />
                <span className="text-xs text-neutral-400">
                  (max 5 vehicles)
                </span>
              </p>
            </motion.div>
          )}
        </div>
      </div>
      
      {selectedVehicles.length >= 2 && (
        <>
          <div className="border-b">
            <Tabs 
              defaultValue="Performance" 
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              className="w-full"
            >
              <div className="px-6 py-2 overflow-x-auto">
                <TabsList className="inline-flex h-9">
                  {comparisonMetrics.map((category) => (
                    <TabsTrigger 
                      key={category.category}
                      value={category.category}
                      className={`px-4 ${isPreowned ? 'data-[state=active]:bg-amber-500 data-[state=active]:text-white' : ''}`}
                    >
                      {category.category}
                    </TabsTrigger>
                  ))}
                  {isPreowned && (
                    <TabsTrigger 
                      value="Pre-owned Metrics" 
                      className="px-4 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                    >
                      Pre-owned Metrics
                    </TabsTrigger>
                  )}
                  <TabsTrigger 
                    value="Overview"
                    className={isPreowned ? 'data-[state=active]:bg-amber-500 data-[state=active]:text-white' : ''}
                  >
                    Overview
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[180px]">Parameter</TableHead>
                          {selectedVehicles.map((vehicle) => (
                            <TableHead key={vehicle.id}>
                              {vehicle.manufacturer} {vehicle.model}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCategory === 'Pre-owned Metrics' && isPreowned ? (
                          preOwnedMetrics.metrics.map((metric) => (
                            <TableRow key={metric.name}>
                              <TableCell className="font-medium">
                                {metric.name}
                                {metric.unit && <span className="text-neutral-400 ml-1">({metric.unit})</span>}
                              </TableCell>
                              
                              {selectedVehicles.map((vehicle) => {
                                const value = comparisonData[vehicle.id][metric.name] || '-';
                                
                                // For two vehicle comparison, show which is better
                                let comparison = 'equal';
                                if (selectedVehicles.length === 2) {
                                  const otherVehicle = selectedVehicles.find(v => v.id !== vehicle.id);
                                  const otherValue = otherVehicle ? comparisonData[otherVehicle.id][metric.name] || '-' : '-';
                                  
                                  // Pre-owned specific logic for which is better
                                  if (metric.name === 'Inspection Score' || metric.name === 'Service History') {
                                    comparison = compareValues(metric.name, value, otherValue);
                                  } else if (metric.name === 'Ownership Count') {
                                    // Lower ownership count is better
                                    if (value.includes('Single') && !otherValue.includes('Single')) {
                                      comparison = 'first';
                                    } else if (!value.includes('Single') && otherValue.includes('Single')) {
                                      comparison = 'second';
                                    }
                                  } else if (metric.name === 'Accident History') {
                                    // No accidents is better
                                    if (value.includes('None') && !otherValue.includes('None')) {
                                      comparison = 'first';
                                    } else if (!value.includes('None') && otherValue.includes('None')) {
                                      comparison = 'second';
                                    }
                                  } else if (metric.name === 'Odometer Reading') {
                                    // Lower reading is better
                                    const val1 = parseInt(value.replace(/,/g, ''));
                                    const val2 = parseInt(otherValue.replace(/,/g, ''));
                                    if (val1 < val2) comparison = 'first';
                                    if (val1 > val2) comparison = 'second';
                                  }
                                }
                                
                                return (
                                  <TableCell 
                                    key={vehicle.id}
                                    className={`
                                      ${comparison === 'first' && vehicle.id === selectedVehicles[0].id ? 'text-amber-600 font-medium' : ''}
                                      ${comparison === 'second' && vehicle.id === selectedVehicles[1].id ? 'text-amber-600 font-medium' : ''}
                                    `}
                                  >
                                    {value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          ))
                        ) : selectedCategory === 'Overview' ? (
                          <>
                            <TableRow>
                              <TableCell className="font-medium">Price</TableCell>
                              {selectedVehicles.map((vehicle) => {
                                const comparison = selectedVehicles.length === 2 
                                  ? compareValues('Price', formatPrice(vehicle.price), formatPrice(selectedVehicles.find(v => v.id !== vehicle.id)?.price || 0))
                                  : 'equal';
                                
                                const textColor = isPreowned ? 'text-amber-600' : 'text-green-600';
                                
                                return (
                                  <TableCell 
                                    key={vehicle.id}
                                    className={`
                                      ${comparison === 'first' && vehicle.id === selectedVehicles[0].id ? `${textColor} font-medium` : ''}
                                      ${comparison === 'second' && vehicle.id === selectedVehicles[1].id ? `${textColor} font-medium` : ''}
                                    `}
                                  >
                                    {formatPrice(vehicle.price)}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Fuel Type</TableCell>
                              {selectedVehicles.map((vehicle) => (
                                <TableCell key={vehicle.id}>
                                  {vehicle.fuelType}
                                </TableCell>
                              ))}
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Year</TableCell>
                              {selectedVehicles.map((vehicle) => (
                                <TableCell key={vehicle.id}>
                                  {vehicle.year}
                                </TableCell>
                              ))}
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Warranty</TableCell>
                              {selectedVehicles.map((vehicle) => (
                                <TableCell key={vehicle.id}>
                                  {vehicle.id === 1 ? "3 years/100,000 km" : "2 years/75,000 km"}
                                </TableCell>
                              ))}
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Body Style</TableCell>
                              {selectedVehicles.map((vehicle) => (
                                <TableCell key={vehicle.id}>
                                  {vehicle.id === 1 ? "SUV" : "Compact SUV"}
                                </TableCell>
                              ))}
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Seating Capacity</TableCell>
                              {selectedVehicles.map((vehicle) => (
                                <TableCell key={vehicle.id}>
                                  {vehicle.id === 1 ? "5 people" : "5 people"}
                                </TableCell>
                              ))}
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Transmission</TableCell>
                              {selectedVehicles.map((vehicle) => (
                                <TableCell key={vehicle.id}>
                                  {vehicle.id === 1 ? "6-speed automatic" : "5-speed manual"}
                                </TableCell>
                              ))}
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Service Cost (annual)</TableCell>
                              {selectedVehicles.map((vehicle) => {
                                const value = vehicle.id === 1 ? "₹8,000" : "₹6,500";
                                const comparison = compareValues('Price', 
                                  value === "₹8,000" ? "8000" : "6500", 
                                  value === "₹8,000" ? "6500" : "8000");
                                
                                return (
                                  <TableCell 
                                    key={vehicle.id}
                                    className={`
                                      ${comparison === 'first' && vehicle.id === 1 && value === "₹6,500" ? 'text-green-600 font-medium' : ''}
                                      ${comparison === 'second' && vehicle.id === 2 && value === "₹6,500" ? 'text-green-600 font-medium' : ''}
                                    `}
                                  >
                                    {value}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Color Options</TableCell>
                              {selectedVehicles.map((vehicle) => (
                                <TableCell key={vehicle.id}>
                                  {vehicle.id === 1 ? "7 colors" : "5 colors"}
                                </TableCell>
                              ))}
                            </TableRow>
                          </>
                        ) : (
                          comparisonMetrics
                            .find(category => category.category === selectedCategory)
                            ?.metrics.map((metric) => (
                              <TableRow key={metric.name}>
                                <TableCell className="font-medium">
                                  {metric.name}
                                  {metric.unit && <span className="text-neutral-400 ml-1">({metric.unit})</span>}
                                </TableCell>
                                
                                {selectedVehicles.map((vehicle) => {
                                  const value = comparisonData[vehicle.id][metric.name] || '-';
                                  
                                  // For two vehicle comparison, show which is better
                                  let comparison = 'equal';
                                  if (selectedVehicles.length === 2) {
                                    const otherVehicle = selectedVehicles.find(v => v.id !== vehicle.id);
                                    const otherValue = otherVehicle ? comparisonData[otherVehicle.id][metric.name] || '-' : '-';
                                    
                                    comparison = compareValues(metric.name, value, otherValue);
                                  }
                                  
                                  return (
                                    <TableCell 
                                      key={vehicle.id}
                                      className={`
                                        ${comparison === 'first' && vehicle.id === selectedVehicles[0].id ? 'text-green-600 font-medium' : ''}
                                        ${comparison === 'second' && vehicle.id === selectedVehicles[1].id ? 'text-green-600 font-medium' : ''}
                                      `}
                                    >
                                      {value}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </div>
          
          <div className="p-4 bg-neutral-50 flex flex-wrap gap-3 justify-end">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" />
              Save as PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button size="sm" className="gap-1.5">
              <BarChart3 className="h-4 w-4" />
              View Full Comparison
            </Button>
          </div>
        </>
      )}
      
      {selectedVehicles.length < 2 && (
        <div className="p-8 text-center">
          <Info className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-1">Select vehicles to compare</h3>
          <p className="text-neutral-500 max-w-sm mx-auto mb-4">
            Add at least 2 vehicles to see a detailed side-by-side comparison of specifications
          </p>
          <Button onClick={addVehicle}>Add Vehicle</Button>
        </div>
      )}
      
      {/* Footer with feedback component */}
      {selectedVehicles.length >= 2 && (
        <div className="border-t p-5 bg-neutral-50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-medium">How useful was this comparison?</h4>
              <p className="text-xs text-neutral-500">Your feedback improves our recommendations</p>
            </div>
            <ContentReaction 
              contentId={`comparison-${selectedVehicles.map(v => v.id).join('-')}`}
              contentType="comparison"
              variant="text"
              showCount={true}
              className="pt-2 sm:pt-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonTool;