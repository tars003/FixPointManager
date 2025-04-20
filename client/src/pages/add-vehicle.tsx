import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronLeft, Search, Check, Fuel, Truck, Car as CarIcon, Bike } from 'lucide-react';
import { SiHonda, SiHyundai, SiTata, SiFord, SiVolkswagen, SiRenault, SiChevrolet, SiMercedes, SiToyota } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Define types for our selection process
export interface VehicleAddProcess {
  step: 'type' | 'manufacturer' | 'model' | 'fuel' | 'details';
  vehicleType?: '2-wheeler' | '3-wheeler' | '4-wheeler';
  manufacturer?: string;
  model?: string;
  fuelType?: string;
  name?: string;
  year?: number;
  registrationNumber?: string;
  color?: string;
}

// Vehicle types with icons
const vehicleTypes = [
  { id: '2-wheeler', name: '2-Wheeler', icon: Bike },
  { id: '3-wheeler', name: '3-Wheeler', icon: Truck },
  { id: '4-wheeler', name: '4-Wheeler', icon: CarIcon },
];

// Manufacturers with logos
const manufacturers = [
  { id: 'maruti', name: 'Maruti Suzuki', logo: SiToyota }, // Using Toyota icon as closest alternative
  { id: 'hyundai', name: 'Hyundai', logo: SiHyundai },
  { id: 'honda', name: 'Honda', logo: SiHonda },
  { id: 'tata', name: 'Tata', logo: SiTata },
  { id: 'ford', name: 'Ford', logo: SiFord },
  { id: 'volkswagen', name: 'Volkswagen', logo: SiVolkswagen },
  { id: 'mahindra', name: 'Mahindra', logo: SiToyota }, // Using Toyota icon as closest alternative
  { id: 'renault', name: 'Renault', logo: SiRenault },
  { id: 'chevrolet', name: 'Chevrolet', logo: SiChevrolet },
];

// Vehicle models with images based on manufacturer
const vehicleModels: Record<string, Array<{ id: string; name: string; image: string }>> = {
  hyundai: [
    { id: 'i10', name: 'i10', image: '/vehicle-models/hyundai-i10.jpg' },
    { id: 'i20', name: 'i20', image: '/vehicle-models/hyundai-i20.jpg' },
    { id: 'grand-i10', name: 'Grand i10', image: '/vehicle-models/hyundai-grand-i10.jpg' },
    { id: 'santro-xing', name: 'Santro Xing', image: '/vehicle-models/hyundai-santro-xing.jpg' },
    { id: 'eon', name: 'Eon', image: '/vehicle-models/hyundai-eon.jpg' },
    { id: 'xcent', name: 'Xcent', image: '/vehicle-models/hyundai-xcent.jpg' },
    { id: 'verna', name: 'Verna', image: '/vehicle-models/hyundai-verna.jpg' },
    { id: 'creta', name: 'Creta', image: '/vehicle-models/hyundai-creta.jpg' },
    { id: 'tucson', name: 'Tucson', image: '/vehicle-models/hyundai-tucson.jpg' },
  ],
  maruti: [
    { id: 'swift', name: 'Swift', image: '/vehicle-models/maruti-swift.jpg' },
    { id: 'dzire', name: 'Dzire', image: '/vehicle-models/maruti-dzire.jpg' },
    { id: 'baleno', name: 'Baleno', image: '/vehicle-models/maruti-baleno.jpg' },
    { id: 'alto', name: 'Alto', image: '/vehicle-models/maruti-alto.jpg' },
    { id: 'wagon-r', name: 'Wagon R', image: '/vehicle-models/maruti-wagon-r.jpg' },
    { id: 'vitara-brezza', name: 'Vitara Brezza', image: '/vehicle-models/maruti-vitara-brezza.jpg' },
  ],
  honda: [
    { id: 'city', name: 'City', image: '/vehicle-models/honda-city.jpg' },
    { id: 'amaze', name: 'Amaze', image: '/vehicle-models/honda-amaze.jpg' },
    { id: 'civic', name: 'Civic', image: '/vehicle-models/honda-civic.jpg' },
    { id: 'jazz', name: 'Jazz', image: '/vehicle-models/honda-jazz.jpg' },
  ],
  tata: [
    { id: 'tiago', name: 'Tiago', image: '/vehicle-models/tata-tiago.jpg' },
    { id: 'nexon', name: 'Nexon', image: '/vehicle-models/tata-nexon.jpg' },
    { id: 'harrier', name: 'Harrier', image: '/vehicle-models/tata-harrier.jpg' },
    { id: 'altroz', name: 'Altroz', image: '/vehicle-models/tata-altroz.jpg' },
  ],
  // Add other manufacturers later
};

// Fuel types with icons
const fuelTypes = [
  { id: 'petrol', name: 'Petrol', icon: '🛢️' },
  { id: 'diesel', name: 'Diesel', icon: '🛢️' },
  { id: 'cng', name: 'CNG', icon: '🔷' },
  { id: 'electric', name: 'Electric', icon: '⚡' },
  { id: 'hybrid', name: 'Hybrid', icon: '🔋' },
];

const AddVehicle = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [process, setProcess] = useState<VehicleAddProcess>({
    step: 'type'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Go back to previous step
  const goBack = () => {
    if (process.step === 'type') {
      navigate('/vehicles');
    } else if (process.step === 'manufacturer') {
      setProcess({ ...process, step: 'type' });
    } else if (process.step === 'model') {
      setProcess({ ...process, step: 'manufacturer' });
    } else if (process.step === 'fuel') {
      setProcess({ ...process, step: 'model' });
    } else if (process.step === 'details') {
      setProcess({ ...process, step: 'fuel' });
    }
  };

  // Select vehicle type
  const selectVehicleType = (type: '2-wheeler' | '3-wheeler' | '4-wheeler') => {
    setProcess({
      ...process,
      step: 'manufacturer',
      vehicleType: type
    });
  };

  // Select manufacturer
  const selectManufacturer = (manufacturer: string) => {
    setProcess({
      ...process,
      step: 'model',
      manufacturer
    });
  };

  // Select model
  const selectModel = (model: string) => {
    setProcess({
      ...process,
      step: 'fuel',
      model
    });
  };

  // Select fuel type
  const selectFuelType = (fuelType: string) => {
    // In a real app, we'd go to details step first before finalizing
    // For now, we'll just show a toast and navigate back
    toast({
      title: "Vehicle Added",
      description: `${process.manufacturer} ${process.model} with ${fuelType} fuel type has been added to your vehicles.`,
    });
    navigate('/vehicles');
  };

  // Filter items based on search term
  const filterItems = <T extends { name: string }>(items: T[]): T[] => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Current step title
  const getStepTitle = () => {
    switch (process.step) {
      case 'type':
        return 'Select Vehicle Type';
      case 'manufacturer':
        return 'Select Manufacturer';
      case 'model':
        return 'Select Model';
      case 'fuel':
        return 'Select Fuel Type';
      case 'details':
        return 'Enter Vehicle Details';
      default:
        return 'Add Vehicle';
    }
  };

  return (
    <div className="container px-4 py-6 max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={goBack}
          className="mr-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{getStepTitle()}</h1>
      </div>

      {/* Search bar for manufacturer, model and fuel type steps */}
      {(process.step === 'manufacturer' || process.step === 'model' || process.step === 'fuel') && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={`Search ${process.step === 'manufacturer' ? 'Brands' : process.step === 'model' ? 'Models' : 'Fuel Type'}...`}
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Vehicle Type Selection */}
      {process.step === 'type' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vehicleTypes.map(type => (
            <motion.div
              key={type.id}
              className="cursor-pointer"
              whileHover={{ scale: 1.03 }}
              onClick={() => selectVehicleType(type.id as any)}
            >
              <Card className="flex flex-col items-center p-6 h-full hover:shadow-md transition-shadow">
                <type.icon className="h-16 w-16 mb-4 text-primary" />
                <h3 className="text-lg font-medium">{type.name}</h3>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Manufacturer Selection */}
      {process.step === 'manufacturer' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {filterItems(manufacturers).map(manufacturer => (
            <motion.div
              key={manufacturer.id}
              className="cursor-pointer"
              whileHover={{ scale: 1.03 }}
              onClick={() => selectManufacturer(manufacturer.id)}
            >
              <Card className="flex flex-col items-center p-6 h-full hover:shadow-md transition-shadow">
                <manufacturer.logo className="h-16 w-16 mb-4 text-neutral-dark" />
                <h3 className="text-lg font-medium text-center">{manufacturer.name}</h3>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Model Selection */}
      {process.step === 'model' && process.manufacturer && vehicleModels[process.manufacturer] && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filterItems(vehicleModels[process.manufacturer]).map(model => (
            <motion.div
              key={model.id}
              className="cursor-pointer"
              whileHover={{ scale: 1.03 }}
              onClick={() => selectModel(model.id)}
            >
              <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
                <div className="h-36 bg-neutral-100 relative flex items-center justify-center">
                  <CarIcon className="h-16 w-16 text-neutral-300" />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-medium">{model.name}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Fuel Type Selection */}
      {process.step === 'fuel' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {filterItems(fuelTypes).map(fuelType => (
            <motion.div
              key={fuelType.id}
              className="cursor-pointer"
              whileHover={{ scale: 1.03 }}
              onClick={() => selectFuelType(fuelType.id)}
            >
              <Card className="flex flex-col items-center p-6 h-full hover:shadow-md transition-shadow">
                <div className={`h-16 w-16 mb-4 flex items-center justify-center text-2xl rounded-full
                  ${fuelType.id === 'petrol' ? 'bg-red-100 text-red-500' : 
                    fuelType.id === 'diesel' ? 'bg-amber-100 text-amber-600' : 
                    fuelType.id === 'cng' ? 'bg-green-100 text-green-500' : 
                    fuelType.id === 'electric' ? 'bg-blue-100 text-blue-500' : 
                    'bg-purple-100 text-purple-500'}`}
                >
                  {fuelType.icon}
                </div>
                <h3 className="text-lg font-medium">{fuelType.name}</h3>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Summary - shown after fuel selection */}
      {process.step === 'details' && (
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 h-48 bg-neutral-100 flex items-center justify-center rounded-md">
              <CarIcon className="h-24 w-24 text-neutral-300" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">
                {manufacturers.find(m => m.id === process.manufacturer)?.name} {process.model}
                <span className="ml-2 text-neutral-light font-normal">{process.fuelType}</span>
              </h2>
              
              <div className="mt-6">
                <Button 
                  className="w-full bg-primary text-white"
                  onClick={() => {
                    toast({
                      title: "Vehicle Added",
                      description: `Your vehicle has been added successfully!`,
                    });
                    navigate('/vehicles');
                  }}
                >
                  Add Vehicle
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AddVehicle;