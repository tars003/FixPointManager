import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Vehicle } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { 
  CheckCircle2, 
  Shield, 
  Car, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Repeat, 
  Clock, 
  Minus, 
  Plus, 
  ChevronRight, 
  Star, 
  Award, 
  ChevronsRight,
  FileText,
  Info,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useTheme } from 'next-themes';

// Insurance provider mock data
const insuranceProviders = [
  { 
    id: 'tata-aig', 
    name: 'Tata AIG', 
    logo: 'tata-aig.png', 
    claimSettlementRatio: 98.5,
    responseTime: '24h',
    networkGarages: 4500,
    customerRating: 4.7,
    premiumFactor: 1.05
  },
  { 
    id: 'hdfc-ergo', 
    name: 'HDFC Ergo', 
    logo: 'hdfc-ergo.png', 
    claimSettlementRatio: 97.8,
    responseTime: '36h',
    networkGarages: 5200,
    customerRating: 4.6,
    premiumFactor: 1.0
  },
  { 
    id: 'icici-lombard', 
    name: 'ICICI Lombard', 
    logo: 'icici-lombard.png', 
    claimSettlementRatio: 96.2,
    responseTime: '48h',
    networkGarages: 4800,
    customerRating: 4.4,
    premiumFactor: 0.95
  },
  { 
    id: 'bajaj-allianz', 
    name: 'Bajaj Allianz', 
    logo: 'bajaj-allianz.png', 
    claimSettlementRatio: 95.8,
    responseTime: '24h',
    networkGarages: 4100,
    customerRating: 4.5,
    premiumFactor: 0.98
  },
  { 
    id: 'new-india', 
    name: 'New India Assurance', 
    logo: 'new-india.png', 
    claimSettlementRatio: 94.0,
    responseTime: '72h',
    networkGarages: 3800,
    customerRating: 4.2,
    premiumFactor: 0.9
  },
  { 
    id: 'reliance-general', 
    name: 'Reliance General', 
    logo: 'reliance-general.png', 
    claimSettlementRatio: 95.2,
    responseTime: '48h',
    networkGarages: 4300,
    customerRating: 4.3,
    premiumFactor: 0.92
  }
];

// Insurance plan types
const planTypes = [
  { id: 'third-party', name: 'Third Party', description: 'Covers damages caused to third parties' },
  { id: 'comprehensive', name: 'Comprehensive', description: 'Complete protection for your vehicle and third parties' },
  { id: 'zero-dep', name: 'Zero Depreciation', description: 'Full claim without depreciation deduction' }
];

// Add-on options
const addOns = [
  { id: 'engine-protection', name: 'Engine Protection', description: 'Covers engine damage due to water ingression', premium: 1200 },
  { id: 'roadside-assistance', name: 'Roadside Assistance', description: '24x7 emergency assistance anywhere in India', premium: 800 },
  { id: 'passenger-cover', name: 'Passenger Cover', description: 'Personal accident cover for passengers', premium: 500 },
  { id: 'return-to-invoice', name: 'Return to Invoice', description: 'Receive full invoice value in case of total loss', premium: 1500 },
  { id: 'ncb-protection', name: 'NCB Protection', description: 'Protect your No Claim Bonus even after a claim', premium: 1000 },
  { id: 'consumables', name: 'Consumables Cover', description: 'Covers cost of consumables during repairs', premium: 600 }
];

// Base premium calculation function (simplified)
const calculateBasePremium = (vehicleValue: number, vehicleAge: number, planType: string, bodyType: string) => {
  let basePremium = 0;
  
  // Define base premium rates based on vehicle value
  if (vehicleValue <= 500000) {
    basePremium = vehicleValue * 0.025;
  } else if (vehicleValue <= 1000000) {
    basePremium = 12500 + (vehicleValue - 500000) * 0.02;
  } else {
    basePremium = 22500 + (vehicleValue - 1000000) * 0.015;
  }
  
  // Adjust for vehicle age
  const ageMultiplier = 1 + (vehicleAge * 0.05);
  basePremium *= ageMultiplier;
  
  // Adjust for policy type
  if (planType === 'third-party') {
    basePremium *= 0.4;
  } else if (planType === 'zero-dep') {
    basePremium *= 1.25;
  }
  
  // Adjust for body type
  if (bodyType === 'suv') {
    basePremium *= 1.2;
  } else if (bodyType === 'luxury') {
    basePremium *= 1.5;
  } else if (bodyType === 'electric') {
    basePremium *= 1.1;
  }
  
  return Math.round(basePremium);
};

// Format currency helper function
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function InsuranceMarketplace() {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [manualVehicle, setManualVehicle] = useState({
    name: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    value: 800000,
    bodyType: 'sedan',
    fuelType: 'petrol',
  });
  const [useVehicleVault, setUseVehicleVault] = useState<boolean>(true);
  const [selectedPlanType, setSelectedPlanType] = useState<string>('comprehensive');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [idvPercentage, setIdvPercentage] = useState<number>(100);
  const [noClaimBonus, setNoClaimBonus] = useState<number>(0);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [comparingPolicies, setComparingPolicies] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('premium');
  const [insuranceQuotes, setInsuranceQuotes] = useState<any[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [showAIRecommendation, setShowAIRecommendation] = useState<boolean>(false);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  
  // Fetch user vehicles from Vehicle Vault
  const { data: userVehicles = [] } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles'],
  });
  
  // Update progress bar when step changes
  useEffect(() => {
    const progressPercentages = [0, 25, 50, 75, 100];
    setProgress(progressPercentages[currentStep]);
  }, [currentStep]);
  
  // Generate insurance quotes when required parameters change
  useEffect(() => {
    if (currentStep === 2 || currentStep === 3) {
      generateInsuranceQuotes();
    }
  }, [selectedPlanType, idvPercentage, noClaimBonus, selectedAddOns, currentStep]);
  
  // Generate AI recommendation when showing the recommendations
  useEffect(() => {
    if (showAIRecommendation && insuranceQuotes.length > 0) {
      // Use a timeout to simulate AI processing
      const timeout = setTimeout(() => {
        // Find the quote with the best value (using a simple algorithm for demo)
        // In a real system, this would use actual ML/AI for recommendation
        const scoredQuotes = insuranceQuotes.map(quote => {
          const coverageScore = quote.planType === 'zero-dep' ? 10 : (quote.planType === 'comprehensive' ? 7 : 4);
          const priceScore = 1000000 / quote.totalPremium; // Lower premium = higher score
          const serviceScore = quote.provider.claimSettlementRatio * quote.provider.customerRating; 
          const totalScore = (coverageScore * 0.4) + (priceScore * 0.3) + (serviceScore * 0.3);
          
          return {
            ...quote,
            aiScore: totalScore
          };
        });
        
        // Sort by AI score and get the top recommendation
        const sortedQuotes = [...scoredQuotes].sort((a: any, b: any) => b.aiScore - a.aiScore);
        setAiRecommendation(sortedQuotes[0]);
      }, 1500);
      
      return () => clearTimeout(timeout);
    }
  }, [showAIRecommendation, insuranceQuotes]);
  
  // Generate insurance quotes based on current parameters
  const generateInsuranceQuotes = () => {
    // Get vehicle details either from vehicle vault or manual entry
    const vehicleDetails = useVehicleVault && selectedVehicle 
      ? userVehicles.find(v => v.id.toString() === selectedVehicle)
      : null;
    
    // Use vehicle value from manual entry or estimate based on year and type
    const estimateVehicleValue = (vehicle: Vehicle | null): number => {
      if (!vehicle) return manualVehicle.value;
      
      // Base value calculation based on make and year
      const currentYear = new Date().getFullYear();
      const age = currentYear - vehicle.year;
      const baseValue = vehicle.make === 'BMW' || vehicle.make === 'Mercedes' || vehicle.make === 'Audi' 
        ? 3000000 // Luxury brands
        : 1000000; // Standard brands
        
      // Apply depreciation based on age (roughly 10% per year)
      return Math.max(baseValue * Math.pow(0.9, age), 100000);
    };
    
    const vehicleValue = manualVehicle.value || estimateVehicleValue(vehicleDetails || null);
    const vehicleAge = new Date().getFullYear() - (vehicleDetails?.year || manualVehicle.year);
    const bodyType = manualVehicle.bodyType || (vehicleDetails?.vehicleType === 'SUV' ? 'suv' : 'sedan');
    
    // Calculate IDV (Insured Declared Value) based on user selection
    const idv = vehicleValue * (idvPercentage / 100);
    
    // For each provider, generate a quote
    const quotes = insuranceProviders.map(provider => {
      // Calculate base premium
      const basePremium = calculateBasePremium(idv, vehicleAge, selectedPlanType, bodyType);
      
      // Apply provider's premium factor
      const providerBasePremium = Math.round(basePremium * provider.premiumFactor);
      
      // Calculate NCB discount
      const ncbDiscount = Math.round(providerBasePremium * (noClaimBonus / 100));
      
      // Calculate net premium after NCB
      const netPremium = providerBasePremium - ncbDiscount;
      
      // Calculate add-on premiums
      const selectedAddOnsList = addOns.filter(addon => selectedAddOns.includes(addon.id));
      const addOnsPremium = selectedAddOnsList.reduce((sum, addon) => sum + addon.premium, 0);
      
      // Calculate GST
      const gst = Math.round((netPremium + addOnsPremium) * 0.18);
      
      // Calculate total premium
      const totalPremium = netPremium + addOnsPremium + gst;
      
      return {
        provider,
        planType: selectedPlanType,
        idv,
        basePremium: providerBasePremium,
        ncbDiscount,
        netPremium,
        addOns: selectedAddOnsList,
        addOnsPremium,
        gst,
        totalPremium
      };
    });
    
    // Sort quotes by selected sorting option
    const sortedQuotes = sortQuotes(quotes, sortBy);
    setInsuranceQuotes(sortedQuotes);
  };
  
  // Sort quotes based on selected sort criteria
  const sortQuotes = (quotes: any[], sortCriteria: string) => {
    switch (sortCriteria) {
      case 'premium':
        return [...quotes].sort((a: any, b: any) => a.totalPremium - b.totalPremium);
      case 'coverage':
        // Higher idv and zero-dep or comprehensive plans get sorted higher
        return [...quotes].sort((a: any, b: any) => {
          const aScore = a.idv + (a.planType === 'zero-dep' ? 1000000 : (a.planType === 'comprehensive' ? 500000 : 0));
          const bScore = b.idv + (b.planType === 'zero-dep' ? 1000000 : (b.planType === 'comprehensive' ? 500000 : 0));
          return bScore - aScore;
        });
      case 'claimRatio':
        return [...quotes].sort((a: any, b: any) => b.provider.claimSettlementRatio - a.provider.claimSettlementRatio);
      case 'rating':
        return [...quotes].sort((a: any, b: any) => b.provider.customerRating - a.provider.customerRating);
      default:
        return quotes;
    }
  };
  
  // Navigate to the next step in the process
  const handleNextStep = () => {
    if (currentStep === 0 && useVehicleVault && !selectedVehicle) {
      toast({
        title: "Vehicle Selection Required",
        description: "Please select a vehicle from your Vehicle Vault or enter vehicle details manually.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 0 && !useVehicleVault && (!manualVehicle.make || !manualVehicle.model)) {
      toast({
        title: "Vehicle Details Required",
        description: "Please enter the required vehicle details.",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentStep(prevStep => Math.min(prevStep + 1, 4));
  };
  
  // Navigate to the previous step in the process
  const handlePreviousStep = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 0));
  };
  
  // Toggle add-ons selection
  const toggleAddOn = (addonId: string) => {
    setSelectedAddOns(prevSelected => 
      prevSelected.includes(addonId)
        ? prevSelected.filter(id => id !== addonId)
        : [...prevSelected, addonId]
    );
  };
  
  // Toggle provider selection for comparison
  const toggleProviderForComparison = (providerId: string) => {
    setSelectedProviders(prevSelected => {
      // If already selected, remove it
      if (prevSelected.includes(providerId)) {
        return prevSelected.filter(id => id !== providerId);
      }
      
      // If not selected and less than 3 providers are selected, add it
      if (prevSelected.length < 3) {
        return [...prevSelected, providerId];
      }
      
      // If already 3 providers are selected, show error toast
      toast({
        title: "Maximum Providers Selected",
        description: "You can compare up to 3 insurance providers at a time.",
        variant: "destructive",
      });
      
      return prevSelected;
    });
  };
  
  // Handle comparison view toggling
  const toggleComparisonView = () => {
    if (selectedProviders.length < 2) {
      toast({
        title: "Select Providers to Compare",
        description: "Please select at least 2 insurance providers to compare.",
        variant: "destructive",
      });
      return;
    }
    
    setComparingPolicies(!comparingPolicies);
  };
  
  // Handle quote selection for purchase
  const handleSelectQuote = (quote: any) => {
    setSelectedQuote(quote);
    setCurrentStep(4); // Move to purchase step
  };
  
  // Handle purchase (mock implementation)
  const handlePurchase = () => {
    toast({
      title: "Policy Purchase Initiated",
      description: "Your insurance policy purchase is being processed. You will receive a confirmation shortly.",
    });
    
    // In a real implementation, this would connect to payment gateway & insurance provider API
    setTimeout(() => {
      toast({
        title: "Policy Purchase Successful",
        description: "Your insurance policy has been successfully purchased and added to Document Vault.",
        variant: "default", // Using default variant instead of success
      });
      
      // Reset state and go back to step 0 for a new purchase
      setCurrentStep(0);
      setSelectedQuote(null);
      setSelectedProviders([]);
      setSelectedAddOns([]);
    }, 2000);
  };
  
  // Generate a random policy number (for demo purposes)
  const generatePolicyNumber = () => {
    const prefix = selectedQuote?.provider.id.substring(0, 3).toUpperCase() || 'INS';
    const randomNum = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    return `${prefix}/${randomNum}/VEH`;
  };
  
  // Render step-specific content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderVehicleSelection();
      case 1:
        return renderCoverageSelection();
      case 2:
        return renderQuotesComparison();
      case 3:
        return renderDetailedComparison();
      case 4:
        return renderPurchaseConfirmation();
      default:
        return null;
    }
  };
  
  // Vehicle selection step
  const renderVehicleSelection = () => (
    <Card className="bg-white border-0 shadow-md overflow-hidden">
      <CardHeader className="relative pb-2">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CardTitle className="text-xl font-bold flex items-center text-blue-800">
            <Car className="mr-2 h-5 w-5 text-blue-600" />
            Select Your Vehicle
          </CardTitle>
          <CardDescription>
            Choose a vehicle from your garage or enter details manually
          </CardDescription>
        </motion.div>
        
        <motion.div
          className="absolute top-6 right-6 text-blue-100 opacity-20"
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ 
            scale: [0.8, 0.9, 0.8],
            rotate: [-10, 0, -10]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Car className="h-24 w-24" />
        </motion.div>
      </CardHeader>
      
      <CardContent className="space-y-6 relative z-10">
        <motion.div 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h3 className="font-medium text-gray-800 mb-2">Vehicle Selection Method</h3>
          <div className="flex rounded-lg overflow-hidden shadow-sm bg-blue-50/50 border border-blue-100 mb-4">
            {/* Left side - Vehicle Vault */}
            <div className={`w-1/2 relative ${!useVehicleVault && 'bg-white/40'}`}>
              <button 
                onClick={() => setUseVehicleVault(true)}
                className="w-full py-4 text-center relative z-10"
              >
                <div className="flex flex-col items-center">
                  <div className={`rounded-full p-1.5 ${useVehicleVault ? 'bg-white' : 'bg-white/70'}`}>
                    <Shield className={`w-5 h-5 ${useVehicleVault ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                  <span className={`text-sm font-medium mt-1 ${useVehicleVault ? 'text-blue-700' : 'text-gray-500'}`}>Vehicle Vault</span>
                </div>
              </button>
            </div>

            {/* Right side - Enter Manually */}
            <div className={`w-1/2 bg-blue-500 relative ${useVehicleVault && 'bg-opacity-70'}`}>
              <button 
                onClick={() => setUseVehicleVault(false)}
                className="w-full py-4 text-center relative z-10"
              >
                <div className="flex flex-col items-center">
                  <div className={`rounded-full p-1.5 ${!useVehicleVault ? 'bg-white' : 'bg-white/50'}`}>
                    <Info className={`w-5 h-5 ${!useVehicleVault ? 'text-blue-600' : 'text-white/60'}`} />
                  </div>
                  <span className={`text-sm font-medium mt-1 ${!useVehicleVault ? 'text-white' : 'text-white/70'}`}>Enter Manually</span>
                </div>
              </button>
            </div>
          </div>
          
          <AnimatePresence initial={false} mode="wait">
            {useVehicleVault ? (
              <motion.div
                key="vehicle-vault"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-4"
              >
                {userVehicles.length > 0 ? (
                  <div className="space-y-3">
                    <Label htmlFor="vehicle" className="text-gray-700">Select from Vehicle Vault</Label>
                    <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                      <SelectTrigger className="bg-white border-gray-200">
                        <SelectValue placeholder="Select your vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {userVehicles.map(vehicle => (
                          <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                            <div className="flex items-center">
                              <Car className="h-4 w-4 mr-2 text-indigo-500" />
                              <span>{vehicle.name} - {vehicle.licensePlate}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedVehicle && (
                      <motion.div 
                        className="bg-blue-50 p-3 mt-3 rounded-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {(() => {
                          const vehicle = userVehicles.find(v => v.id.toString() === selectedVehicle);
                          return (
                            <>
                              <div className="font-medium text-blue-800 mb-1">Selected Vehicle Details</div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center text-gray-600">
                                  <span className="font-medium mr-2">Make:</span> {vehicle?.make}
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <span className="font-medium mr-2">Model:</span> {vehicle?.model}
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <span className="font-medium mr-2">Year:</span> {vehicle?.year}
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <span className="font-medium mr-2">Reg No:</span> {vehicle?.licensePlate}
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                    <AlertCircle className="h-6 w-6 mx-auto mb-2 text-amber-500" />
                    <p className="text-amber-800 font-medium">No vehicles found in Vehicle Vault</p>
                    <p className="text-amber-600 text-sm mt-1">Add vehicles to Vehicle Vault or enter details manually</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="manual-entry"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-4"
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="make" className="text-gray-700">Make</Label>
                      <Input 
                        id="make" 
                        value={manualVehicle.make} 
                        onChange={e => setManualVehicle(prev => ({ ...prev, make: e.target.value }))} 
                        placeholder="e.g., Maruti Suzuki" 
                        className="bg-white border-gray-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="model" className="text-gray-700">Model</Label>
                      <Input 
                        id="model" 
                        value={manualVehicle.model} 
                        onChange={e => setManualVehicle(prev => ({ ...prev, model: e.target.value }))} 
                        placeholder="e.g., Swift" 
                        className="bg-white border-gray-200"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="year" className="text-gray-700">Year</Label>
                      <Input 
                        id="year" 
                        type="number" 
                        value={manualVehicle.year} 
                        onChange={e => setManualVehicle(prev => ({ ...prev, year: parseInt(e.target.value) }))} 
                        min={1990}
                        max={new Date().getFullYear()}
                        className="bg-white border-gray-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="licensePlate" className="text-gray-700">License Plate</Label>
                      <Input 
                        id="licensePlate" 
                        value={manualVehicle.name} 
                        onChange={e => setManualVehicle(prev => ({ ...prev, name: e.target.value }))} 
                        placeholder="e.g., MH02AB1234" 
                        className="bg-white border-gray-200"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="bodyType" className="text-gray-700">Body Type</Label>
                      <Select 
                        value={manualVehicle.bodyType} 
                        onValueChange={(value) => setManualVehicle(prev => ({ ...prev, bodyType: value }))}
                      >
                        <SelectTrigger className="bg-white border-gray-200">
                          <SelectValue placeholder="Select body type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hatchback">Hatchback</SelectItem>
                          <SelectItem value="sedan">Sedan</SelectItem>
                          <SelectItem value="suv">SUV</SelectItem>
                          <SelectItem value="muv">MUV</SelectItem>
                          <SelectItem value="luxury">Luxury</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="fuelType" className="text-gray-700">Fuel Type</Label>
                      <Select 
                        value={manualVehicle.fuelType} 
                        onValueChange={(value) => setManualVehicle(prev => ({ ...prev, fuelType: value }))}
                      >
                        <SelectTrigger className="bg-white border-gray-200">
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="petrol">Petrol</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="cng">CNG</SelectItem>
                          <SelectItem value="electric">Electric</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="value" className="text-gray-700 flex justify-between">
                      <span>Approximate Vehicle Value (₹)</span>
                      <span className="font-medium text-indigo-600">{formatCurrency(manualVehicle.value)}</span>
                    </Label>
                    <div className="pt-2">
                      <Slider
                        value={[manualVehicle.value]}
                        min={100000}
                        max={5000000}
                        step={10000}
                        onValueChange={(value) => setManualVehicle(prev => ({ ...prev, value: value[0] }))}
                        className="my-3"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>₹1L</span>
                        <span>₹50L</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t bg-gray-50 py-3 px-6">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button 
            onClick={handleNextStep}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  );
  
  // Coverage selection step
  const renderCoverageSelection = () => (
    <Card className="bg-white border-0 shadow-md overflow-hidden">
      <CardHeader className="relative pb-2">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CardTitle className="text-xl font-bold flex items-center text-indigo-800">
            <Shield className="mr-2 h-5 w-5 text-indigo-600" />
            Select Coverage Options
          </CardTitle>
          <CardDescription>
            Choose the coverage level and additional protection for your vehicle
          </CardDescription>
        </motion.div>
        
        <motion.div
          className="absolute top-6 right-6 text-indigo-100 opacity-20"
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ 
            scale: [0.8, 0.9, 0.8],
            rotate: [-10, 0, -10]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Shield className="h-24 w-24" />
        </motion.div>
      </CardHeader>
      
      <CardContent className="space-y-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="mb-5">
            <h3 className="font-medium text-gray-800 mb-3">Policy Type</h3>
            <RadioGroup 
              value={selectedPlanType} 
              onValueChange={setSelectedPlanType}
              className="grid grid-cols-3 gap-3"
            >
              {planTypes.map(plan => (
                <div key={plan.id} className="relative">
                  <RadioGroupItem value={plan.id} id={plan.id} className="sr-only" />
                  <Label
                    htmlFor={plan.id}
                    className={`flex flex-col items-start h-full p-4 rounded-lg cursor-pointer border-2 transition-all ${
                      selectedPlanType === plan.id 
                        ? 'border-indigo-600 bg-indigo-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <motion.div 
                      className={`absolute top-3 right-3 h-4 w-4 flex items-center justify-center rounded-full border ${
                        selectedPlanType === plan.id 
                          ? 'border-indigo-600 bg-indigo-600 text-white' 
                          : 'border-gray-300 bg-white'
                      }`}
                      animate={{ 
                        scale: selectedPlanType === plan.id ? [1, 1.2, 1] : 1
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {selectedPlanType === plan.id && (
                        <Check className="h-3 w-3" />
                      )}
                    </motion.div>
                    <span className={`font-medium mb-1 ${
                      selectedPlanType === plan.id ? 'text-indigo-700' : 'text-gray-700'
                    }`}>
                      {plan.name}
                    </span>
                    <span className={`text-xs ${
                      selectedPlanType === plan.id ? 'text-indigo-600' : 'text-gray-500'
                    }`}>
                      {plan.description}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="mb-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-800">Insured Declared Value (IDV)</h3>
              <span className="text-sm font-medium text-indigo-600">{idvPercentage}% of vehicle value</span>
            </div>
            <div className="px-1">
              <Slider
                value={[idvPercentage]}
                min={80}
                max={120}
                step={5}
                onValueChange={(value) => setIdvPercentage(value[0])}
                className="my-3"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Lower Premium</span>
                <span>Higher Coverage</span>
              </div>
              <div className="text-xs text-gray-500 mt-2 bg-blue-50 p-2 rounded-md flex items-start">
                <Info className="h-4 w-4 text-blue-500 mr-1.5 flex-shrink-0 mt-0.5" />
                <span>
                  IDV is the maximum amount your insurer will pay in case of total loss or theft. 
                  Higher IDV means better coverage but increases premium.
                </span>
              </div>
            </div>
          </div>
          
          <div className="mb-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-800">No Claim Bonus (NCB)</h3>
              <span className="text-sm font-medium text-indigo-600">{noClaimBonus}% discount</span>
            </div>
            <div className="px-1">
              <Slider
                value={[noClaimBonus]}
                min={0}
                max={50}
                step={10}
                onValueChange={(value) => setNoClaimBonus(value[0])}
                className="my-3"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0% (No discount)</span>
                <span>50% (Max discount)</span>
              </div>
              <div className="text-xs text-gray-500 mt-2 bg-blue-50 p-2 rounded-md flex items-start">
                <Info className="h-4 w-4 text-blue-500 mr-1.5 flex-shrink-0 mt-0.5" />
                <span>
                  NCB is a reward for claim-free years. It increases by 5-10% each claim-free year, 
                  up to a maximum of 50%.
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Additional Coverage (Add-ons)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {addOns.map(addon => (
                <motion.div
                  key={addon.id}
                  className={`p-3 rounded-lg cursor-pointer border-2 transition-all flex items-start ${
                    selectedAddOns.includes(addon.id) 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => toggleAddOn(addon.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div 
                    className={`h-5 w-5 rounded-md border flex-shrink-0 mt-0.5 flex items-center justify-center mr-3 ${
                      selectedAddOns.includes(addon.id) 
                        ? 'border-green-500 bg-green-500 text-white' 
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {selectedAddOns.includes(addon.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </motion.div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className={`font-medium ${
                        selectedAddOns.includes(addon.id) ? 'text-green-700' : 'text-gray-800'
                      }`}>
                        {addon.name}
                      </span>
                      <span className={`text-sm font-medium ${
                        selectedAddOns.includes(addon.id) ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        +₹{addon.premium}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${
                      selectedAddOns.includes(addon.id) ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {addon.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t bg-gray-50 py-3 px-6">
        <Button 
          variant="outline" 
          onClick={handlePreviousStep}
        >
          Back
        </Button>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button 
            onClick={handleNextStep}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            View Quotes <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  );
  
  // Quotes comparison step
  const renderQuotesComparison = () => (
    <Card className="bg-white border-0 shadow-md overflow-hidden">
      <CardHeader className="relative pb-2">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CardTitle className="text-xl font-bold flex items-center text-purple-800">
            <Layers className="mr-2 h-5 w-5 text-purple-600" />
            Compare Insurance Quotes
          </CardTitle>
          <CardDescription>
            View and compare quotes from top insurance providers
          </CardDescription>
        </motion.div>
        
        <motion.div
          className="absolute top-6 right-6 text-purple-100 opacity-20"
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ 
            scale: [0.8, 0.9, 0.8],
            rotate: [-10, 0, -10]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Layers className="h-24 w-24" />
        </motion.div>
      </CardHeader>
      
      <CardContent className="space-y-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h3 className="font-medium text-gray-800">Insurance Quotes</h3>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="ml-3 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
              >
                {insuranceQuotes.length} providers
              </motion.div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="sort-by" className="text-sm text-gray-600">Sort by:</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-8 text-sm bg-white w-[130px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="premium">Lowest Premium</SelectItem>
                  <SelectItem value="coverage">Best Coverage</SelectItem>
                  <SelectItem value="claimRatio">Claim Settlement</SelectItem>
                  <SelectItem value="rating">Customer Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center mb-2">
            <Button
              variant="outline"
              size="sm"
              className={`text-xs h-7 ${
                selectedProviders.length > 0 
                  ? 'bg-purple-50 text-purple-700 border-purple-200' 
                  : 'text-gray-600'
              }`}
              onClick={toggleComparisonView}
              disabled={selectedProviders.length < 2}
            >
              <Layers className="h-3.5 w-3.5 mr-1" />
              Compare Selected ({selectedProviders.length}/3)
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 ml-2 text-gray-600"
              onClick={() => setShowAIRecommendation(!showAIRecommendation)}
            >
              <Sparkles className={`h-3.5 w-3.5 mr-1 ${showAIRecommendation ? 'text-amber-500' : ''}`} />
              {showAIRecommendation ? 'Hide AI Recommendation' : 'Show AI Recommendation'}
            </Button>
          </div>
          
          {showAIRecommendation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              {aiRecommendation ? (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-4">
                      <Sparkles className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-amber-800 flex items-center">
                        AI Recommended Policy
                        <span className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white text-xs px-2 py-0.5 rounded-full ml-2">
                          Best Value
                        </span>
                      </h4>
                      <p className="text-amber-700 text-sm mb-3">
                        Based on your preferences and vehicle details
                      </p>
                      <div className="flex items-center text-amber-900 mb-2">
                        <Shield className="h-4 w-4 mr-1.5" />
                        <span className="font-medium">{aiRecommendation.provider.name}</span>
                        <span className="mx-2 text-amber-400">•</span>
                        <span>{planTypes.find(p => p.id === aiRecommendation.planType)?.name}</span>
                        <span className="mx-2 text-amber-400">•</span>
                        <span>{formatCurrency(aiRecommendation.totalPremium)}</span>
                      </div>
                      <div className="text-xs text-amber-700 mb-3">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            High claim settlement ratio of {aiRecommendation.provider.claimSettlementRatio}%
                          </li>
                          <li>
                            Excellent customer rating of {aiRecommendation.provider.customerRating}/5
                          </li>
                          <li>
                            {aiRecommendation.provider.networkGarages.toLocaleString()} network garages across India
                          </li>
                          <li>
                            {aiRecommendation.addOns.length} add-ons included for comprehensive protection
                          </li>
                        </ul>
                      </div>
                      <Button 
                        className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 w-full"
                        onClick={() => handleSelectQuote(aiRecommendation)}
                      >
                        Select Recommended Plan
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-6 flex flex-col items-center justify-center">
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
                    }}
                    className="mb-4"
                  >
                    <Sparkles className="h-8 w-8 text-amber-500" />
                  </motion.div>
                  <p className="text-amber-800 font-medium text-center">
                    AI is analyzing your requirements and finding the best policy for you...
                  </p>
                </div>
              )}
            </motion.div>
          )}
          
          {comparingPolicies ? (
            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-purple-800">Policy Comparison</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-purple-700 hover:bg-purple-100"
                  onClick={() => setComparingPolicies(false)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Close Comparison
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-purple-100">
                      <th className="px-4 py-2 text-purple-800 font-medium">Feature</th>
                      {selectedProviders.map(providerId => {
                        const quote = insuranceQuotes.find(q => q.provider.id === providerId);
                        return (
                          <th key={providerId} className="px-4 py-2 text-purple-800 font-medium text-center">
                            {quote?.provider.name}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-purple-100">
                      <td className="px-4 py-2 text-gray-700 font-medium">Plan Type</td>
                      {selectedProviders.map(providerId => {
                        const quote = insuranceQuotes.find(q => q.provider.id === providerId);
                        return (
                          <td key={providerId} className="px-4 py-2 text-center">
                            {planTypes.find(p => p.id === quote?.planType)?.name}
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="border-b border-purple-100">
                      <td className="px-4 py-2 text-gray-700 font-medium">IDV</td>
                      {selectedProviders.map(providerId => {
                        const quote = insuranceQuotes.find(q => q.provider.id === providerId);
                        return (
                          <td key={providerId} className="px-4 py-2 text-center">
                            {formatCurrency(quote?.idv || 0)}
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="border-b border-purple-100">
                      <td className="px-4 py-2 text-gray-700 font-medium">Basic Premium</td>
                      {selectedProviders.map(providerId => {
                        const quote = insuranceQuotes.find(q => q.provider.id === providerId);
                        return (
                          <td key={providerId} className="px-4 py-2 text-center">
                            {formatCurrency(quote?.basePremium || 0)}
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="border-b border-purple-100">
                      <td className="px-4 py-2 text-gray-700 font-medium">NCB Discount</td>
                      {selectedProviders.map(providerId => {
                        const quote = insuranceQuotes.find(q => q.provider.id === providerId);
                        return (
                          <td key={providerId} className="px-4 py-2 text-center text-green-600">
                            -{formatCurrency(quote?.ncbDiscount || 0)}
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="border-b border-purple-100">
                      <td className="px-4 py-2 text-gray-700 font-medium">Add-ons</td>
                      {selectedProviders.map(providerId => {
                        const quote = insuranceQuotes.find(q => q.provider.id === providerId);
                        return (
                          <td key={providerId} className="px-4 py-2 text-center">
                            {quote?.addOns.length || 0} selected
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="border-b border-purple-100">
                      <td className="px-4 py-2 text-gray-700 font-medium">Add-on Cost</td>
                      {selectedProviders.map(providerId => {
                        const quote = insuranceQuotes.find(q => q.provider.id === providerId);
                        return (
                          <td key={providerId} className="px-4 py-2 text-center">
                            {formatCurrency(quote?.addOnsPremium || 0)}
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="border-b border-purple-100">
                      <td className="px-4 py-2 text-gray-700 font-medium">GST (18%)</td>
                      {selectedProviders.map(providerId => {
                        const quote = insuranceQuotes.find(q => q.provider.id === providerId);
                        return (
                          <td key={providerId} className="px-4 py-2 text-center">
                            {formatCurrency(quote?.gst || 0)}
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="border-b border-purple-100 bg-purple-50">
                      <td className="px-4 py-2 text-purple-900 font-bold">Total Premium</td>
                      {selectedProviders.map(providerId => {
                        const quote = insuranceQuotes.find(q => q.provider.id === providerId);
                        return (
                          <td key={providerId} className="px-4 py-2 text-center text-purple-900 font-bold">
                            {formatCurrency(quote?.totalPremium || 0)}
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="border-b border-purple-100">
                      <td className="px-4 py-2 text-gray-700 font-medium">Claim Settlement Ratio</td>
                      {selectedProviders.map(providerId => {
                        const quote = insuranceQuotes.find(q => q.provider.id === providerId);
                        return (
                          <td key={providerId} className="px-4 py-2 text-center">
                            {quote?.provider.claimSettlementRatio}%
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="border-b border-purple-100">
                      <td className="px-4 py-2 text-gray-700 font-medium">Network Garages</td>
                      {selectedProviders.map(providerId => {
                        const quote = insuranceQuotes.find(q => q.provider.id === providerId);
                        return (
                          <td key={providerId} className="px-4 py-2 text-center">
                            {quote?.provider.networkGarages.toLocaleString()}
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="border-b border-purple-100">
                      <td className="px-4 py-2 text-gray-700 font-medium">Customer Rating</td>
                      {selectedProviders.map(providerId => {
                        const quote = insuranceQuotes.find(q => q.provider.id === providerId);
                        return (
                          <td key={providerId} className="px-4 py-2 text-center">
                            <div className="flex items-center justify-center">
                              <Star className="h-4 w-4 text-amber-400 mr-1" />
                              {quote?.provider.customerRating}/5
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="px-4 py-2"></td>
                      {selectedProviders.map(providerId => {
                        const quote = insuranceQuotes.find(q => q.provider.id === providerId);
                        return (
                          <td key={providerId} className="px-4 py-2 text-center">
                            <Button 
                              className="bg-purple-600 hover:bg-purple-700 w-full"
                              onClick={() => handleSelectQuote(quote)}
                            >
                              Select
                            </Button>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {insuranceQuotes.map((quote, index) => (
                <motion.div
                  key={quote.provider.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (index * 0.1), duration: 0.5 }}
                  className={`border rounded-lg overflow-hidden ${
                    selectedProviders.includes(quote.provider.id) 
                      ? 'border-purple-300 bg-purple-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div 
                          className="h-5 w-5 rounded-md border flex-shrink-0 mt-1 flex items-center justify-center mr-3 cursor-pointer"
                          onClick={() => toggleProviderForComparison(quote.provider.id)}
                          style={{
                            borderColor: selectedProviders.includes(quote.provider.id) ? '#7c3aed' : '#d1d5db',
                            backgroundColor: selectedProviders.includes(quote.provider.id) ? '#7c3aed' : 'white',
                          }}
                        >
                          {selectedProviders.includes(quote.provider.id) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <Check className="h-3.5 w-3.5 text-white" />
                            </motion.div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{quote.provider.name}</h4>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <div className="flex items-center mr-3">
                              <Star className="h-3.5 w-3.5 text-amber-400 mr-1" />
                              {quote.provider.customerRating}/5
                            </div>
                            <div className="flex items-center mr-3">
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1" />
                              {quote.provider.claimSettlementRatio}% Claims
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 text-blue-500 mr-1" />
                              {quote.provider.responseTime} response
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl text-gray-800">
                          {formatCurrency(quote.totalPremium)}
                        </div>
                        <div className="text-xs text-gray-500">yearly premium</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-gray-500">Plan Type</div>
                        <div className="font-medium text-gray-700">
                          {planTypes.find(p => p.id === quote.planType)?.name}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-gray-500">IDV</div>
                        <div className="font-medium text-gray-700">
                          {formatCurrency(quote.idv)}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-gray-500">Add-ons</div>
                        <div className="font-medium text-gray-700">
                          {quote.addOns.length} selected
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-indigo-600 underline cursor-pointer" onClick={() => handleNextStep()}>
                        View details
                      </div>
                      <Button 
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        onClick={() => handleSelectQuote(quote)}
                      >
                        Select Plan
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t bg-gray-50 py-3 px-6">
        <Button 
          variant="outline" 
          onClick={handlePreviousStep}
        >
          Back
        </Button>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button 
            onClick={handleNextStep}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Detailed Comparison <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  );
  
  // Detailed comparison step
  const renderDetailedComparison = () => (
    <Card className="bg-white border-0 shadow-md overflow-hidden">
      <CardHeader className="relative pb-2">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CardTitle className="text-xl font-bold flex items-center text-pink-800">
            <Repeat className="mr-2 h-5 w-5 text-pink-600" />
            Detailed Coverage Comparison
          </CardTitle>
          <CardDescription>
            Compare detailed coverage options and benefits across providers
          </CardDescription>
        </motion.div>
        
        <motion.div
          className="absolute top-6 right-6 text-pink-100 opacity-20"
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ 
            scale: [0.8, 0.9, 0.8],
            rotate: [-10, 0, -10]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Repeat className="h-24 w-24" />
        </motion.div>
      </CardHeader>
      
      <CardContent className="space-y-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-800">Coverage Detail</h3>
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-500 bg-gray-100 py-1 px-2 rounded-full">
                  Compare by feature
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="basic-coverage" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="basic-coverage">Basic Coverage</TabsTrigger>
                <TabsTrigger value="additional-benefits">Additional Benefits</TabsTrigger>
                <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic-coverage" className="mt-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-gray-800 font-medium">Coverage</th>
                        {insuranceQuotes.slice(0, 3).map(quote => (
                          <th key={quote.provider.id} className="px-4 py-2 text-gray-800 font-medium text-center">
                            {quote.provider.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-2 text-gray-700 font-medium">Own Damage Cover</td>
                        {insuranceQuotes.slice(0, 3).map(quote => (
                          <td key={quote.provider.id} className="px-4 py-2 text-center">
                            {quote.planType !== 'third-party' ? (
                              <motion.div 
                                className="flex items-center justify-center text-green-600"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                              >
                                <Check className="h-5 w-5" />
                              </motion.div>
                            ) : (
                              <motion.div 
                                className="flex items-center justify-center text-red-500"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                              >
                                <X className="h-5 w-5" />
                              </motion.div>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-2 text-gray-700 font-medium">Third Party Liability</td>
                        {insuranceQuotes.slice(0, 3).map(quote => (
                          <td key={quote.provider.id} className="px-4 py-2 text-center">
                            <motion.div 
                              className="flex items-center justify-center text-green-600"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            >
                              <Check className="h-5 w-5" />
                            </motion.div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-2 text-gray-700 font-medium">Natural Calamities</td>
                        {insuranceQuotes.slice(0, 3).map(quote => (
                          <td key={quote.provider.id} className="px-4 py-2 text-center">
                            {quote.planType !== 'third-party' ? (
                              <motion.div 
                                className="flex items-center justify-center text-green-600"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                              >
                                <Check className="h-5 w-5" />
                              </motion.div>
                            ) : (
                              <motion.div 
                                className="flex items-center justify-center text-red-500"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                              >
                                <X className="h-5 w-5" />
                              </motion.div>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-2 text-gray-700 font-medium">Man-made Disasters</td>
                        {insuranceQuotes.slice(0, 3).map(quote => (
                          <td key={quote.provider.id} className="px-4 py-2 text-center">
                            {quote.planType !== 'third-party' ? (
                              <motion.div 
                                className="flex items-center justify-center text-green-600"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                              >
                                <Check className="h-5 w-5" />
                              </motion.div>
                            ) : (
                              <motion.div 
                                className="flex items-center justify-center text-red-500"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                              >
                                <X className="h-5 w-5" />
                              </motion.div>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-2 text-gray-700 font-medium">Personal Accident Cover</td>
                        {insuranceQuotes.slice(0, 3).map(quote => (
                          <td key={quote.provider.id} className="px-4 py-2 text-center">
                            <motion.div 
                              className="flex items-center justify-center text-green-600"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            >
                              <Check className="h-5 w-5" />
                            </motion.div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-gray-700 font-medium">Zero Depreciation</td>
                        {insuranceQuotes.slice(0, 3).map(quote => (
                          <td key={quote.provider.id} className="px-4 py-2 text-center">
                            {quote.planType === 'zero-dep' ? (
                              <motion.div 
                                className="flex items-center justify-center text-green-600"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                              >
                                <Check className="h-5 w-5" />
                              </motion.div>
                            ) : (
                              <motion.div 
                                className="flex items-center justify-center text-red-500"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                              >
                                <X className="h-5 w-5" />
                              </motion.div>
                            )}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="additional-benefits" className="mt-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-gray-800 font-medium">Benefit</th>
                        {insuranceQuotes.slice(0, 3).map(quote => (
                          <th key={quote.provider.id} className="px-4 py-2 text-gray-800 font-medium text-center">
                            {quote.provider.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {addOns.map((addon, index) => (
                        <tr key={addon.id} className={index < addOns.length - 1 ? "border-b border-gray-200" : ""}>
                          <td className="px-4 py-2 text-gray-700 font-medium">{addon.name}</td>
                          {insuranceQuotes.slice(0, 3).map(quote => (
                            <td key={quote.provider.id} className="px-4 py-2 text-center">
                              {quote.addOns.some((a: any) => a.id === addon.id) ? (
                                <motion.div 
                                  className="flex items-center justify-center text-green-600"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                >
                                  <Check className="h-5 w-5" />
                                </motion.div>
                              ) : (
                                <motion.div 
                                  className="flex items-center justify-center text-red-500"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                >
                                  <X className="h-5 w-5" />
                                </motion.div>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="exclusions" className="mt-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-gray-800 font-medium">Exclusion</th>
                        <th className="px-4 py-2 text-gray-800 font-medium text-center">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-2 text-gray-700 font-medium">Normal Wear & Tear</td>
                        <td className="px-4 py-2 text-gray-600">
                          Regular wear and tear or general aging of the vehicle is not covered under the policy.
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-2 text-gray-700 font-medium">Electrical/Mechanical Breakdown</td>
                        <td className="px-4 py-2 text-gray-600">
                          Failures due to electrical or mechanical breakdowns without any accident damage.
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-2 text-gray-700 font-medium">Illegal Driving</td>
                        <td className="px-4 py-2 text-gray-600">
                          Damages while driving without valid license or under influence of alcohol/drugs.
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-2 text-gray-700 font-medium">Consequential Damage</td>
                        <td className="px-4 py-2 text-gray-600">
                          Any consequential loss or damage that's not direct result of insured peril.
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-gray-700 font-medium">Nuclear Perils</td>
                        <td className="px-4 py-2 text-gray-600">
                          Damages caused by nuclear weapons, radiation or radioactive contamination.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium text-gray-800 mb-3">Quick Comparison</h3>
            <div className="grid grid-cols-3 gap-4">
              {insuranceQuotes.slice(0, 3).map((quote, index) => (
                <motion.div
                  key={quote.provider.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (index * 0.1), duration: 0.5 }}
                  className="border rounded-lg overflow-hidden bg-white"
                >
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-800">{quote.provider.name}</h4>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-amber-400 mr-1" />
                        <span className="text-sm font-medium">{quote.provider.customerRating}/5</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xl font-bold text-pink-700">
                      {formatCurrency(quote.totalPremium)}
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-2 text-xs">
                      <div className="flex justify-between items-center py-1 border-b border-gray-100">
                        <span className="text-gray-500">Plan Type</span>
                        <span className="font-medium text-gray-800">
                          {planTypes.find(p => p.id === quote.planType)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-gray-100">
                        <span className="text-gray-500">IDV Amount</span>
                        <span className="font-medium text-gray-800">
                          {formatCurrency(quote.idv)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-gray-100">
                        <span className="text-gray-500">Claim Settlement</span>
                        <span className="font-medium text-gray-800">
                          {quote.provider.claimSettlementRatio}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-500">Add-ons</span>
                        <span className="font-medium text-gray-800">
                          {quote.addOns.length} selected
                        </span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                      onClick={() => handleSelectQuote(quote)}
                    >
                      Select Plan
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Need Help Deciding?</h3>
            <p className="text-sm text-gray-600 mb-3">
              Our AI recommendations are personalized based on your driving habits and vehicle usage patterns.
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
              onClick={() => {
                setShowAIRecommendation(true);
                setCurrentStep(2); // Go back to quotes view with AI recommendation
              }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Get AI Recommendation
            </Button>
          </div>
        </motion.div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t bg-gray-50 py-3 px-6">
        <Button 
          variant="outline" 
          onClick={handlePreviousStep}
        >
          Back
        </Button>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button 
            onClick={() => setCurrentStep(2)} // Go back to quotes view
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
          >
            View All Quotes
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  );
  
  // Purchase confirmation step
  const renderPurchaseConfirmation = () => (
    <Card className="bg-white border-0 shadow-md overflow-hidden">
      <CardHeader className="relative pb-2">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CardTitle className="text-xl font-bold flex items-center text-green-800">
            <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
            Purchase Details
          </CardTitle>
          <CardDescription>
            Review and confirm your insurance policy purchase
          </CardDescription>
        </motion.div>
        
        <motion.div
          className="absolute top-6 right-6 text-green-100 opacity-20"
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ 
            scale: [0.8, 0.9, 0.8],
            rotate: [-10, 0, -10]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <CheckCircle2 className="h-24 w-24" />
        </motion.div>
      </CardHeader>
      
      <CardContent className="space-y-6 relative z-10">
        {selectedQuote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-lg mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-green-800 text-lg">Selected Insurance Plan</h3>
                  <p className="text-green-600 text-sm">
                    {selectedQuote.provider.name} - {planTypes.find(p => p.id === selectedQuote.planType)?.name}
                  </p>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-amber-500 mr-1" />
                  <span className="text-sm font-medium text-amber-700">
                    {selectedQuote.provider.customerRating}/5 Customer Rating
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-md p-3 border border-green-100">
                  <div className="text-sm text-green-700 mb-1">Premium Amount</div>
                  <div className="text-xl font-bold text-green-800">
                    {formatCurrency(selectedQuote.totalPremium)}
                  </div>
                  <div className="text-xs text-green-600 mt-1">Yearly payment</div>
                </div>
                <div className="bg-white rounded-md p-3 border border-green-100">
                  <div className="text-sm text-green-700 mb-1">Coverage Amount</div>
                  <div className="text-xl font-bold text-green-800">
                    {formatCurrency(selectedQuote.idv)}
                  </div>
                  <div className="text-xs text-green-600 mt-1">Insured Declared Value</div>
                </div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium text-green-800 mb-2">Policy Highlights</div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-green-700">
                      {planTypes.find(p => p.id === selectedQuote.planType)?.description}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-green-700">
                      {selectedQuote.provider.networkGarages.toLocaleString()} network garages across India
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-green-700">
                      {selectedQuote.provider.claimSettlementRatio}% claim settlement ratio
                    </span>
                  </li>
                  {selectedQuote.addOns.length > 0 && (
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-green-700">
                        {selectedQuote.addOns.length} add-ons included: {selectedQuote.addOns.map((a: any) => a.name).join(', ')}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Policy Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="border rounded-md p-3">
                  <div className="text-gray-500 mb-1">Policy Number</div>
                  <div className="font-medium text-gray-800">{generatePolicyNumber()}</div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="text-gray-500 mb-1">Policy Period</div>
                  <div className="font-medium text-gray-800">1 Year</div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="text-gray-500 mb-1">Start Date</div>
                  <div className="font-medium text-gray-800">
                    {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="text-gray-500 mb-1">End Date</div>
                  <div className="font-medium text-gray-800">
                    {(() => {
                      const endDate = new Date();
                      endDate.setFullYear(endDate.getFullYear() + 1);
                      return endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                    })()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Payment Details</h3>
              <div className="border rounded-md p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Basic Premium</span>
                    <span className="font-medium text-gray-800">{formatCurrency(selectedQuote.basePremium)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">NCB Discount</span>
                    <span className="font-medium text-red-600">-{formatCurrency(selectedQuote.ncbDiscount)}</span>
                  </div>
                  {selectedQuote.addOns.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Add-on Premiums</span>
                      <span className="font-medium text-gray-800">{formatCurrency(selectedQuote.addOnsPremium)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">GST (18%)</span>
                    <span className="font-medium text-gray-800">{formatCurrency(selectedQuote.gst)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-gray-800">Total Premium</span>
                    <span className="font-bold text-green-700">{formatCurrency(selectedQuote.totalPremium)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Important Information</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your policy documents will be stored in Document Vault after purchase</li>
                    <li>You'll receive policy details on your registered email and phone</li>
                    <li>In case of a claim, use the Support section in your profile</li>
                    <li>24/7 customer support available at {selectedQuote.provider.id.includes('tata') ? '1800-266-7783' : '1800-209-5858'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t bg-gray-50 py-3 px-6">
        <Button 
          variant="outline" 
          onClick={handlePreviousStep}
        >
          Back
        </Button>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button 
            onClick={handlePurchase}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            Confirm Purchase <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  );
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Insurance Marketplace</h1>
            <p className="text-gray-600 max-w-3xl">
              Compare, purchase, and manage insurance policies from India's top providers at the best rates.
            </p>
          </motion.div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-gray-600">
                <span className="text-blue-600">{currentStep + 1}</span>/5 Step
              </div>
              <div className="text-sm font-medium text-gray-600">
                {(() => {
                  const stepNames = ['Vehicle Selection', 'Policy Type', 'Quotes', 'Compare Details', 'Purchase'];
                  return stepNames[currentStep];
                })()}
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
        
        {renderStepContent()}
      </div>
    </Layout>
  );
}