import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Car, 
  Bike, 
  Truck, 
  ChevronRight, 
  ChevronLeft, 
  Rotate3d, 
  ZoomIn,
  PanelRight,
  Paintbrush,
  Wrench,
  Gauge,
  Lightbulb,
  Armchair,
  Cog, 
  Package,
  Save,
  Share2,
  ShoppingCart,
  Plus,
  Minus,
  X,
  ArrowRightLeft,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Type definitions
type VehicleType = 'two-wheeler' | 'three-wheeler' | 'four-wheeler';
type SelectionStep = 'vehicleType' | 'vehicleSource' | 'brand' | 'model' | 'variant' | 'customization';
type CustomizationCategory = 'exterior' | 'wheels' | 'lighting' | 'interior' | 'performance' | 'accessories';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  image: string;
  type: VehicleType;
}

interface Brand {
  id: number;
  name: string;
  logo: string;
  vehicleTypes: VehicleType[];
}

interface Model {
  id: number;
  brandId: number;
  name: string;
  image: string;
  price: number;
  bodyType: string;
  fuelType: string;
}

interface Variant {
  id: number;
  modelId: number;
  name: string;
  engine: string;
  transmission: string;
  features: string[];
  price: number;
}

interface CustomizationOption {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: CustomizationCategory;
  vehicleTypes: VehicleType[];
  installationCost: number;
}

// Sample data
const myVehicles: Vehicle[] = [
  { 
    id: 1, 
    make: 'Honda', 
    model: 'City', 
    year: 2022, 
    registrationNumber: 'MH01AB****', 
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75', 
    type: 'four-wheeler' 
  },
  { 
    id: 2, 
    make: 'Royal Enfield', 
    model: 'Classic 350', 
    year: 2021, 
    registrationNumber: 'MH02CD****', 
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/43482/royal-enfield-classic-350-right-front-three-quarter-2.jpeg?isig=0&q=75', 
    type: 'two-wheeler' 
  },
  { 
    id: 3, 
    make: 'Bajaj', 
    model: 'Maxima', 
    year: 2020, 
    registrationNumber: 'MH03EF****', 
    image: 'https://imgd.aeplcdn.com/1200x900/bw/models/bajaj-maxima-c-cng--bs-vi20210628155834.jpg?q=75', 
    type: 'three-wheeler' 
  }
];

const brands: Brand[] = [
  { id: 1, name: 'Honda', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/1200px-Honda.svg.png', vehicleTypes: ['two-wheeler', 'three-wheeler', 'four-wheeler'] },
  { id: 2, name: 'Royal Enfield', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/11/Royal_Enfield_logo.svg/1200px-Royal_Enfield_logo.svg.png', vehicleTypes: ['two-wheeler'] },
  { id: 3, name: 'Bajaj', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bajaj_Auto_Logo.svg/1280px-Bajaj_Auto_Logo.svg.png', vehicleTypes: ['two-wheeler', 'three-wheeler'] },
  { id: 4, name: 'Maruti Suzuki', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Maruti_Suzuki_Logo.svg/1200px-Maruti_Suzuki_Logo.svg.png', vehicleTypes: ['four-wheeler'] },
  { id: 5, name: 'Tata', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/1200px-Tata_logo.svg.png', vehicleTypes: ['four-wheeler'] },
  { id: 6, name: 'Mahindra', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Mahindra_Rise_Logo.svg/1200px-Mahindra_Rise_Logo.svg.png', vehicleTypes: ['three-wheeler', 'four-wheeler'] }
];

const models: Model[] = [
  { id: 1, brandId: 1, name: 'City', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75', price: 1100000, bodyType: 'Sedan', fuelType: 'Petrol' },
  { id: 2, brandId: 1, name: 'Amaze', image: 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/46891/amaze-exterior-right-front-three-quarter-2.jpeg?q=75', price: 900000, bodyType: 'Sedan', fuelType: 'Petrol/Diesel' },
  { id: 3, brandId: 4, name: 'Swift', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/109265/swift-exterior-right-front-three-quarter.jpeg?isig=0&q=75', price: 850000, bodyType: 'Hatchback', fuelType: 'Petrol' },
  { id: 4, brandId: 2, name: 'Classic 350', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/43482/royal-enfield-classic-350-right-front-three-quarter-2.jpeg?isig=0&q=75', price: 200000, bodyType: 'Cruiser', fuelType: 'Petrol' },
  { id: 5, brandId: 5, name: 'Nexon', image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141867/nexon-exterior-right-front-three-quarter-71.jpeg?isig=0&q=75', price: 950000, bodyType: 'SUV', fuelType: 'Petrol/Electric' }
];

const variants: Variant[] = [
  { 
    id: 1, 
    modelId: 1, 
    name: 'City ZX CVT', 
    engine: '1.5L i-VTEC', 
    transmission: 'CVT Automatic', 
    features: ['Sunroof', 'Leather Seats', 'Alloy Wheels'], 
    price: 1350000 
  },
  { 
    id: 2, 
    modelId: 1, 
    name: 'City V MT', 
    engine: '1.5L i-VTEC', 
    transmission: 'Manual', 
    features: ['Touchscreen Infotainment', 'Alloy Wheels', 'Keyless Entry'], 
    price: 1150000 
  },
  { 
    id: 3, 
    modelId: 4, 
    name: 'Classic 350 Signals', 
    engine: '349cc Single Cylinder', 
    transmission: '5-Speed Manual', 
    features: ['Dual-Channel ABS', 'Tripper Navigation', 'Spoke Wheels'], 
    price: 215000 
  }
];

const customizationOptions: CustomizationOption[] = [
  // Exterior options
  { 
    id: 1, 
    name: 'Racing Body Kit', 
    description: 'Full body kit with front/rear bumpers and side skirts',
    price: 45000, 
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/133517/endeavour-sport-exterior-right-front-three-quarter-3.jpeg?isig=0&q=75', 
    category: 'exterior', 
    vehicleTypes: ['four-wheeler'],
    installationCost: 10000
  },
  { 
    id: 2, 
    name: 'Matte Black Wrap', 
    description: 'Full vehicle wrap in premium matte black vinyl',
    price: 35000, 
    image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/115777/2022-x1-exterior-right-front-three-quarter-2.jpeg?isig=0&q=75', 
    category: 'exterior', 
    vehicleTypes: ['two-wheeler', 'four-wheeler'],
    installationCost: 8000
  },
  // Wheels options
  { 
    id: 3, 
    name: '18-inch Alloy Wheels', 
    description: 'Premium multi-spoke alloy wheels',
    price: 40000, 
    image: 'https://www.tyresales.com.au/images/alloy-wheels/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled/hero/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled-wheel-380.jpg', 
    category: 'wheels', 
    vehicleTypes: ['four-wheeler'],
    installationCost: 5000
  },
  { 
    id: 4, 
    name: 'Performance Tires', 
    description: 'High-grip performance tires for better handling',
    price: 28000, 
    image: 'https://www.michelinman.com/on/demandware.static/-/Sites-michelin-master-catalog/default/dw210a3946/images/tires/Pilot-Sport-5/perspective/MICHELIN_PILOT_SPORT_5_sideview_high.png', 
    category: 'wheels', 
    vehicleTypes: ['two-wheeler', 'four-wheeler'],
    installationCost: 3000
  },
  // Lighting options
  { 
    id: 5, 
    name: 'LED Headlight Kit', 
    description: 'Bright LED headlights with extended visibility',
    price: 15000, 
    image: 'https://m.media-amazon.com/images/I/71Najs0QpkL._AC_UF894,1000_QL80_.jpg', 
    category: 'lighting', 
    vehicleTypes: ['two-wheeler', 'three-wheeler', 'four-wheeler'],
    installationCost: 4000
  },
  { 
    id: 6, 
    name: 'Underbody RGB Lighting', 
    description: 'Customizable RGB underbody lighting system',
    price: 12000, 
    image: 'https://content.instructables.com/FQ3/EQLN/JCKQVWIP/FQ3EQLNJCKQVWIP.jpg', 
    category: 'lighting', 
    vehicleTypes: ['four-wheeler'],
    installationCost: 5000
  },
  // Interior options
  { 
    id: 7, 
    name: 'Premium Leather Seats', 
    description: 'Custom leather upholstery for all seats',
    price: 50000, 
    image: 'https://icdn.digitaltrends.com/image/digitaltrends/2020-bentley-continental-gt-v8-coupe-interior-500x500.jpg', 
    category: 'interior', 
    vehicleTypes: ['four-wheeler'],
    installationCost: 12000
  },
  { 
    id: 8, 
    name: 'Digital Instrument Cluster', 
    description: 'Advanced digital dashboard with customizable displays',
    price: 25000, 
    image: 'https://images.hindustantimes.com/auto/img/2022/01/19/1600x900/Maruti_Suzuki_Baleno_2022_facelift_interior_1642596532747_1642596546118.jpg', 
    category: 'interior', 
    vehicleTypes: ['four-wheeler'],
    installationCost: 8000
  },
  // Performance options
  { 
    id: 9, 
    name: 'Sport Exhaust System', 
    description: 'Performance exhaust for enhanced sound and power',
    price: 35000, 
    image: 'https://www.carid.com/images/borla/items/140307.jpg', 
    category: 'performance', 
    vehicleTypes: ['two-wheeler', 'four-wheeler'],
    installationCost: 7000
  },
  { 
    id: 10, 
    name: 'Air Intake System', 
    description: 'Cold air intake for improved performance',
    price: 18000, 
    image: 'https://m.media-amazon.com/images/I/91pddkZhbOL._AC_UF1000,1000_QL80_.jpg', 
    category: 'performance', 
    vehicleTypes: ['two-wheeler', 'four-wheeler'],
    installationCost: 5000
  },
  // Accessories options
  { 
    id: 11, 
    name: 'Roof Cargo Box', 
    description: 'Spacious roof-mounted cargo storage',
    price: 22000, 
    image: 'https://www.yakima.com/media/wysiwyg/cat-feature/skybox-cat-feature.jpg', 
    category: 'accessories', 
    vehicleTypes: ['four-wheeler'],
    installationCost: 3000
  },
  { 
    id: 12, 
    name: 'Bike Carrier', 
    description: 'Rear-mounted bicycle carrier',
    price: 15000, 
    image: 'https://www.yakima.com/media/wysiwyg/plp/bike/hitchtower-pro-plp.jpg', 
    category: 'accessories', 
    vehicleTypes: ['four-wheeler'],
    installationCost: 2000
  }
];

const ArenaPage: React.FC = () => {
  const { toast } = useToast();
  const [selectionStep, setSelectionStep] = useState<SelectionStep>('vehicleSource');
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedCustomizations, setSelectedCustomizations] = useState<CustomizationOption[]>([]);
  const [activeCustomizationCategory, setActiveCustomizationCategory] = useState<CustomizationCategory>('exterior');
  const [isThreeDMode, setIsThreeDMode] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [priceBreakdownOpen, setPriceBreakdownOpen] = useState(false);
  const [view3dActive, setView3dActive] = useState(false);
  
  // Calculate total price
  const getBasePrice = () => {
    if (selectedVariant) return selectedVariant.price;
    if (selectedModel) return selectedModel.price;
    return 0;
  };
  
  const getCustomizationCost = () => {
    return selectedCustomizations.reduce((total, item) => total + item.price, 0);
  };
  
  const getInstallationCost = () => {
    return selectedCustomizations.reduce((total, item) => total + item.installationCost, 0);
  };
  
  const getTotalCost = () => {
    return getBasePrice() + getCustomizationCost() + getInstallationCost();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleVehicleSourceSelect = (source: 'existing' | 'new') => {
    if (source === 'existing') {
      // If user has vehicles, show selection screen
      if (myVehicles.length > 0) {
        setSelectionStep('customization');
        // Auto-select the first vehicle for simplicity
        const firstVehicle = myVehicles[0];
        setSelectedVehicle(firstVehicle);
        setSelectedVehicleType(firstVehicle.type);
      } else {
        // No vehicles, prompt to add or select new
        toast({
          title: "No vehicles found",
          description: "Please add a vehicle first or select a new vehicle for customization.",
          variant: "default"
        });
        setSelectionStep('vehicleType');
      }
    } else {
      setSelectionStep('vehicleType');
    }
  };

  const handleVehicleTypeSelect = (type: VehicleType) => {
    setSelectedVehicleType(type);
    setSelectionStep('brand');
  };

  const handleBrandSelect = (brand: Brand) => {
    setSelectedBrand(brand);
    setSelectionStep('model');
  };

  const handleModelSelect = (model: Model) => {
    setSelectedModel(model);
    setSelectionStep('variant');
  };

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
    setSelectionStep('customization');
  };

  const handleCustomizationSelect = (option: CustomizationOption) => {
    const isAlreadySelected = selectedCustomizations.some(item => item.id === option.id);
    
    if (isAlreadySelected) {
      setSelectedCustomizations(selectedCustomizations.filter(item => item.id !== option.id));
    } else {
      // Check if there's already an item in the same category and remove it (for mutually exclusive items)
      const newCustomizations = selectedCustomizations.filter(item => {
        // For now, allow multiple items in different categories
        return item.category !== option.category || 
               (item.category === option.category && option.category !== 'exterior');
      });
      setSelectedCustomizations([...newCustomizations, option]);
    }
  };

  const handleSaveConfiguration = () => {
    toast({
      title: "Configuration Saved",
      description: "Your vehicle configuration has been saved successfully.",
      variant: "default"
    });
  };

  const handleShareConfiguration = () => {
    toast({
      title: "Share Configuration",
      description: "Sharing feature will be available in the next update.",
      variant: "default"
    });
  };

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: "Your customization items have been added to the marketplace cart.",
      variant: "default"
    });
  };

  const handleBookInstallation = () => {
    toast({
      title: "Installation Booking",
      description: "Redirecting to service booking for installation.",
      variant: "default"
    });
  };

  const handleRotateVehicle = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setRotationAngle(rotationAngle - 45);
    } else {
      setRotationAngle(rotationAngle + 45);
    }
  };

  const toggle3DView = () => {
    setView3dActive(!view3dActive);
    toast({
      title: view3dActive ? "Standard View" : "3D View",
      description: view3dActive ? "Switched to standard view" : "Switched to interactive 3D view",
      variant: "default"
    });
  };

  const renderVehicleSourceSelection = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
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
    );
  };

  const renderVehicleTypeSelection = () => {
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => setSelectionStep('vehicleSource')}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h2 className="text-2xl font-bold flex-1 text-center">Select Vehicle Type</h2>
          <div className="w-16"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleVehicleTypeSelect('two-wheeler')}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Bike className="h-24 w-24 text-primary mb-4" />
                <h3 className="text-xl font-bold">Two-Wheeler</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Motorcycles, scooters, and mopeds
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleVehicleTypeSelect('three-wheeler')}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-24 w-24 text-primary mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-20 w-20">
                    <circle cx="6" cy="17" r="3" />
                    <circle cx="18" cy="17" r="3" />
                    <circle cx="12" cy="6" r="3" />
                    <path d="M6 17v-4h12v4" />
                    <path d="M12 6v7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Three-Wheeler</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Auto-rickshaws and cargo three-wheelers
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleVehicleTypeSelect('four-wheeler')}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Car className="h-24 w-24 text-primary mb-4" />
                <h3 className="text-xl font-bold">Four-Wheeler</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Cars, SUVs, and commercial vehicles
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderBrandSelection = () => {
    const filteredBrands = selectedVehicleType 
      ? brands.filter(brand => brand.vehicleTypes.includes(selectedVehicleType))
      : brands;
    
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => setSelectionStep('vehicleType')}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h2 className="text-2xl font-bold flex-1 text-center">Select Brand</h2>
          <div className="w-16"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBrands.map(brand => (
            <Card 
              key={brand.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleBrandSelect(brand)}
            >
              <CardContent className="flex flex-col items-center justify-center h-40">
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="h-20 object-contain mb-4"
                />
                <h3 className="font-medium text-center">{brand.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderModelSelection = () => {
    if (!selectedBrand) return null;
    
    const filteredModels = models.filter(model => model.brandId === selectedBrand.id);
    
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => setSelectionStep('brand')}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h2 className="text-2xl font-bold flex-1 text-center">{selectedBrand.name} Models</h2>
          <div className="w-16"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map(model => (
            <Card 
              key={model.id}
              className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
              onClick={() => handleModelSelect(model)}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={model.image} 
                  alt={model.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="pt-4">
                <h3 className="font-bold text-lg">{model.name}</h3>
                <div className="flex justify-between mt-2">
                  <span className="text-sm">{model.bodyType}</span>
                  <span className="text-sm">{model.fuelType}</span>
                </div>
                <p className="font-medium text-primary mt-2">
                  {formatPrice(model.price)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderVariantSelection = () => {
    if (!selectedModel) return null;
    
    const filteredVariants = variants.filter(variant => variant.modelId === selectedModel.id);
    
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => setSelectionStep('model')}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h2 className="text-2xl font-bold flex-1 text-center">{selectedModel.name} Variants</h2>
          <div className="w-16"></div>
        </div>
        
        <div className="space-y-4">
          {filteredVariants.map(variant => (
            <Card 
              key={variant.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleVariantSelect(variant)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{variant.name}</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-muted-foreground">Engine: {variant.engine}</p>
                      <p className="text-sm text-muted-foreground">Transmission: {variant.transmission}</p>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-medium">Key Features:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {variant.features.map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <p className="font-medium text-xl text-primary">
                      {formatPrice(variant.price)}
                    </p>
                    <Button className="mt-2" size="sm">Select</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderVehicleCustomization = () => {
    const vehicleToCustomize = selectedVehicle || (selectedVariant && { 
      id: 0,
      make: selectedBrand?.name || '',
      model: selectedModel?.name || '',
      year: new Date().getFullYear(),
      registrationNumber: 'New Vehicle',
      image: selectedModel?.image || '',
      type: selectedVehicleType as VehicleType
    });

    if (!vehicleToCustomize) return null;

    const vehicleType = vehicleToCustomize.type;
    
    const filteredCustomizationOptions = customizationOptions
      .filter(option => 
        option.category === activeCustomizationCategory && 
        option.vehicleTypes.includes(vehicleType)
      );
      
    const isOptionSelected = (option: CustomizationOption) => {
      return selectedCustomizations.some(item => item.id === option.id);
    };

    return (
      <div className="flex flex-col h-full">
        {/* Navigation Header */}
        <div className="flex items-center p-4 border-b">
          <Button variant="ghost" size="sm" onClick={() => {
            if (selectedVehicle) {
              setSelectionStep('vehicleSource');
            } else if (selectedVariant) {
              setSelectionStep('variant');
            }
          }}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h2 className="text-xl font-bold flex-1 text-center">
            Customize {vehicleToCustomize.make} {vehicleToCustomize.model}
          </h2>
          <Button variant="ghost" size="icon" onClick={toggle3DView}>
            <Rotate3d className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-hidden">
          {/* 3D Vehicle Preview */}
          <div className="lg:col-span-2 bg-slate-100 dark:bg-slate-900 relative flex flex-col">
            {/* 3D Controls */}
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
              <Button 
                variant={view3dActive ? "primary" : "secondary"} 
                onClick={toggle3DView}
                className="mr-2 flex items-center gap-1 transition-all"
                size="sm"
              >
                <Rotate3d className="h-4 w-4" />
                {view3dActive ? "Exit 3D" : "View in 3D"}
              </Button>
              <Button variant="secondary" size="icon" onClick={() => handleRotateVehicle('left')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="icon" onClick={() => handleRotateVehicle('right')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="icon" onClick={() => setPriceBreakdownOpen(!priceBreakdownOpen)}>
                <PanelRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Vehicle Image - 3D View */}
            <div className="flex-1 flex items-center justify-center p-4">
              <div 
                className={`relative transition-all duration-500 ${view3dActive ? 'animate-float transform-gpu' : ''}`}
                style={{ 
                  transform: view3dActive ? `rotateY(${rotationAngle}deg) rotateX(15deg)` : `rotateY(${rotationAngle}deg)`,
                  perspective: '1000px',
                  boxShadow: view3dActive ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : 'none'
                }}
              >
                <motion.img 
                  src={vehicleToCustomize.image} 
                  alt={`${vehicleToCustomize.make} ${vehicleToCustomize.model}`} 
                  className="max-h-96 object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Show any visual customizations applied */}
                {selectedCustomizations.map(customization => (
                  <div key={customization.id} className="absolute inset-0 flex items-center justify-center">
                    {/* This is where we would render the customization visually */}
                    {customization.category === 'wheels' && (
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-opacity-50 text-center text-xs">
                        Custom {customization.name} Applied
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Customization Category Tabs */}
            <Tabs 
              value={activeCustomizationCategory} 
              onValueChange={(value) => setActiveCustomizationCategory(value as CustomizationCategory)}
              className="bg-white dark:bg-slate-950 border-t"
            >
              <TabsList className="w-full justify-start px-4 h-16">
                <TabsTrigger value="exterior" className="flex flex-col items-center h-14 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Paintbrush className="h-4 w-4 mb-1" />
                  <span className="text-xs">Exterior</span>
                </TabsTrigger>
                <TabsTrigger value="wheels" className="flex flex-col items-center h-14 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mb-1">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="2" />
                    <path d="M12 2v4" />
                    <path d="M12 18v4" />
                    <path d="M2 12h4" />
                    <path d="M18 12h4" />
                  </svg>
                  <span className="text-xs">Wheels</span>
                </TabsTrigger>
                <TabsTrigger value="lighting" className="flex flex-col items-center h-14 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Lightbulb className="h-4 w-4 mb-1" />
                  <span className="text-xs">Lighting</span>
                </TabsTrigger>
                <TabsTrigger value="interior" className="flex flex-col items-center h-14 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Armchair className="h-4 w-4 mb-1" />
                  <span className="text-xs">Interior</span>
                </TabsTrigger>
                <TabsTrigger value="performance" className="flex flex-col items-center h-14 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Gauge className="h-4 w-4 mb-1" />
                  <span className="text-xs">Performance</span>
                </TabsTrigger>
                <TabsTrigger value="accessories" className="flex flex-col items-center h-14 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Package className="h-4 w-4 mb-1" />
                  <span className="text-xs">Accessories</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Customization Options Panel */}
          <div className="border-l overflow-auto max-h-[calc(100vh-12rem)]">
            <div className="p-4 border-b">
              <h3 className="font-bold text-lg capitalize">{activeCustomizationCategory} Options</h3>
              <p className="text-sm text-muted-foreground">
                Select options to customize your vehicle
              </p>
            </div>
            
            <div className="divide-y">
              {filteredCustomizationOptions.length > 0 ? (
                filteredCustomizationOptions.map(option => (
                  <div 
                    key={option.id}
                    className={cn(
                      "p-4 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors",
                      isOptionSelected(option) && "bg-primary/10"
                    )}
                    onClick={() => handleCustomizationSelect(option)}
                  >
                    <div className="flex gap-3">
                      <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={option.image} 
                          alt={option.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{option.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {option.description}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-medium text-primary">
                            {formatPrice(option.price)}
                          </span>
                          {isOptionSelected(option) ? (
                            <Button variant="destructive" size="sm" onClick={(e) => {
                              e.stopPropagation();
                              handleCustomizationSelect(option);
                            }}>
                              Remove
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm">
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-muted-foreground">
                    No {activeCustomizationCategory} options available for this vehicle type.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Price Summary and Actions Footer */}
        <div className="border-t p-4 bg-white dark:bg-slate-950 sticky bottom-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Total Price</div>
              <div className="text-2xl font-bold">{formatPrice(getTotalCost())}</div>
              <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => setPriceBreakdownOpen(!priceBreakdownOpen)}>
                {priceBreakdownOpen ? 'Hide' : 'View'} price breakdown
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveConfiguration}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareConfiguration}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleBookInstallation}>
                <Wrench className="h-4 w-4 mr-1" />
                Book Installation
              </Button>
              <Button onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
            </div>
          </div>
          
          {/* Price Breakdown Panel */}
          {priceBreakdownOpen && (
            <motion.div 
              className="mt-4 border rounded-md p-4 bg-slate-50 dark:bg-slate-900"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h4 className="font-medium mb-2">Price Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Vehicle Price</span>
                  <span>{formatPrice(getBasePrice())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customization Cost</span>
                  <span>{formatPrice(getCustomizationCost())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Installation Cost</span>
                  <span>{formatPrice(getInstallationCost())}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total Cost</span>
                  <span>{formatPrice(getTotalCost())}</span>
                </div>
              </div>
              
              {selectedCustomizations.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Selected Customizations</h4>
                  <div className="space-y-2 text-sm">
                    {selectedCustomizations.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.category}</div>
                        </div>
                        <div className="text-right">
                          <div>{formatPrice(item.price)}</div>
                          <div className="text-xs text-muted-foreground">
                            +{formatPrice(item.installationCost)} installation
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Arena Customization Platform</h1>
          <p className="text-muted-foreground mt-1">Visualize, customize, and enhance your vehicle</p>
        </div>

        {selectionStep === 'vehicleSource' && renderVehicleSourceSelection()}
        {selectionStep === 'vehicleType' && renderVehicleTypeSelection()}
        {selectionStep === 'brand' && renderBrandSelection()}
        {selectionStep === 'model' && renderModelSelection()}
        {selectionStep === 'variant' && renderVariantSelection()}
        {selectionStep === 'customization' && renderVehicleCustomization()}
      </motion.div>
    </div>
  );
};

export default ArenaPage;