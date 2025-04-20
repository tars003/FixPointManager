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
    <div className="px-4 py-6 max-w-3xl mx-auto">
      {/* Progress steps */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div 
          className={`h-3 w-3 rounded-full bg-primary transition-all ${process.step === 'type' ? 'scale-125' : ''}`}
          style={{
            boxShadow: process.step === 'type' ? '0 0 0 4px rgba(126, 255, 0, 0.2)' : 'none'
          }}
        />
        <div className="h-px flex-1 bg-gray-700 mx-2"></div>
        <div 
          className={`h-3 w-3 rounded-full transition-all ${process.step === 'manufacturer' ? 'bg-primary scale-125' : process.step === 'type' ? 'bg-gray-600' : 'bg-primary'}`}
          style={{
            boxShadow: process.step === 'manufacturer' ? '0 0 0 4px rgba(126, 255, 0, 0.2)' : 'none'
          }}
        />
        <div className="h-px flex-1 bg-gray-700 mx-2"></div>
        <div 
          className={`h-3 w-3 rounded-full transition-all ${process.step === 'model' ? 'bg-primary scale-125' : (process.step === 'type' || process.step === 'manufacturer') ? 'bg-gray-600' : 'bg-primary'}`}
          style={{
            boxShadow: process.step === 'model' ? '0 0 0 4px rgba(126, 255, 0, 0.2)' : 'none'
          }}
        />
        <div className="h-px flex-1 bg-gray-700 mx-2"></div>
        <div 
          className={`h-3 w-3 rounded-full transition-all ${process.step === 'fuel' ? 'bg-primary scale-125' : (process.step === 'type' || process.step === 'manufacturer' || process.step === 'model') ? 'bg-gray-600' : 'bg-primary'}`}
          style={{
            boxShadow: process.step === 'fuel' ? '0 0 0 4px rgba(126, 255, 0, 0.2)' : 'none'
          }}
        />
      </div>

      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={goBack}
          className="mr-2 rounded-full hover:bg-gray-800"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">{getStepTitle()}</h1>
      </div>

      {/* Search bar for manufacturer, model and fuel type steps */}
      {(process.step === 'manufacturer' || process.step === 'model' || process.step === 'fuel') && (
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={`Search ${process.step === 'manufacturer' ? 'Brands' : process.step === 'model' ? 'Models' : 'Fuel Type'}...`}
            className="pl-10 bg-gray-800 border-gray-700 focus:border-primary focus:ring-primary/20"
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectVehicleType(type.id as any)}
            >
              <Card className="flex flex-col items-center p-6 h-full border-none bg-gray-800 hover:bg-gray-700 transition-all">
                <div className="p-5 rounded-full bg-gray-700 mb-4">
                  <type.icon className="h-12 w-12 text-primary" />
                </div>
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectManufacturer(manufacturer.id)}
            >
              <Card className="flex flex-col items-center p-6 h-full border-none bg-gray-800 hover:bg-gray-700 transition-all">
                <div className="p-4 rounded-full bg-gray-700 mb-4">
                  <manufacturer.logo className="h-12 w-12 text-gray-300" />
                </div>
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectModel(model.id)}
            >
              <Card className="overflow-hidden border-none bg-gray-800 hover:bg-gray-700 transition-all h-full">
                <div className="h-36 bg-gray-700 relative flex items-center justify-center">
                  <CarIcon className="h-16 w-16 text-primary" />
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectFuelType(fuelType.id)}
            >
              <Card className="flex flex-col items-center p-6 h-full border-none bg-gray-800 hover:bg-gray-700 transition-all">
                <div className={`h-16 w-16 mb-4 flex items-center justify-center text-2xl rounded-full
                  ${fuelType.id === 'petrol' ? 'bg-gray-700 text-red-400' : 
                    fuelType.id === 'diesel' ? 'bg-gray-700 text-amber-400' : 
                    fuelType.id === 'cng' ? 'bg-gray-700 text-green-400' : 
                    fuelType.id === 'electric' ? 'bg-gray-700 text-blue-400' : 
                    'bg-gray-700 text-purple-400'}`}
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
        <Card className="p-6 border-none bg-gray-800">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 h-48 bg-gray-700 flex items-center justify-center rounded-md">
              <CarIcon className="h-24 w-24 text-primary" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">
                {manufacturers.find(m => m.id === process.manufacturer)?.name} {process.model}
                <span className="ml-2 text-gray-400 font-normal">{process.fuelType}</span>
              </h2>
              
              <div className="mt-6">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-black font-semibold"
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