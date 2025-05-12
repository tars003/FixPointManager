import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/layout';
import { useQuery } from '@tanstack/react-query';
import { Vehicle } from '@shared/schema';
import { 
  FileText, 
  Camera, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Upload,
  Info,
  ArrowRight,
  Shield as ShieldCheck,
  Shield,
  Edit,
  Car,
  Zap,
  ScanLine,
  ImagePlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const PartVerifierPage = () => {
  const [activeTab, setActiveTab] = useState('manual');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'verified' | 'counterfeit' | 'warning'>('idle');
  const [partCode, setPartCode] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedPartType, setSelectedPartType] = useState('');
  const [vehicleInput, setVehicleInput] = useState('');
  const [useVehicleVault, setUseVehicleVault] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch user's vehicles from Vehicle Vault
  const { data: userVehicles = [] } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles'],
  });

  // Set first vehicle as default if available
  useEffect(() => {
    if (userVehicles.length > 0 && !selectedVehicle) {
      setSelectedVehicle(userVehicles[0].id.toString());
    }
  }, [userVehicles, selectedVehicle]);

  // Mock part data for demo purposes
  const partData = {
    name: 'Brake Pad Set',
    manufacturer: 'Bosch',
    partNumber: 'BP-1042-X9',
    manufacturingDate: '2025-03-15',
    compatibleVehicles: ['Honda City', 'Honda Civic', 'Honda Accord'],
    authenticityScore: 98,
    specifications: [
      { name: 'Material', value: 'Ceramic Composite' },
      { name: 'Position', value: 'Front' },
      { name: 'Wear Indicator', value: 'Yes' },
      { name: 'Warranty', value: '2 Years/40,000 km' }
    ]
  };

  const mockVehicles = [
    { id: 'honda-city', name: 'Honda City' },
    { id: 'maruti-swift', name: 'Maruti Swift' },
    { id: 'hyundai-creta', name: 'Hyundai Creta' },
    { id: 'tata-nexon', name: 'Tata Nexon' },
    { id: 'toyota-innova', name: 'Toyota Innova' },
    { id: 'mahindra-xuv700', name: 'Mahindra XUV700' }
  ];

  const mockPartTypes = [
    { id: 'brake-pads', name: 'Brake Pads' },
    { id: 'air-filters', name: 'Air Filters' },
    { id: 'oil-filters', name: 'Oil Filters' },
    { id: 'spark-plugs', name: 'Spark Plugs' },
    { id: 'batteries', name: 'Batteries' },
    { id: 'clutch-plates', name: 'Clutch Plates' },
    { id: 'alternators', name: 'Alternators' },
    { id: 'headlights', name: 'Headlights' }
  ];

  const handleVerify = () => {
    // Validate input based on active tab
    if (activeTab === 'manual') {
      if (!partCode) {
        toast({
          title: "Error",
          description: "Please enter a part verification code",
          variant: "destructive",
        });
        return;
      }

      // Check if we have vehicle info (either from Vehicle Vault or manual entry)
      if (useVehicleVault && !selectedVehicle) {
        toast({
          title: "Error",
          description: "Please select a vehicle from your Vehicle Vault",
          variant: "destructive",
        });
        return;
      }

      if (!useVehicleVault && !vehicleInput) {
        toast({
          title: "Error",
          description: "Please enter vehicle information",
          variant: "destructive",
        });
        return;
      }
    }

    // Get vehicle details for verification
    let verificationVehicle: Vehicle | undefined;
    if (useVehicleVault) {
      verificationVehicle = userVehicles.find(v => v.id.toString() === selectedVehicle);
    }

    setVerificationStatus('loading');
    
    // Simulate verification check with a timeout
    setTimeout(() => {
      // Demo logic - in a real app, this would check against a database
      if (partCode === 'BP1042X9' || partCode === 'GENU1234') {
        setVerificationStatus('verified');
      } else if (partCode === 'FAKE5678') {
        setVerificationStatus('counterfeit');
      } else if (partCode === 'WARN9012') {
        setVerificationStatus('warning');
      } else {
        // If empty or any other code, show as verified for demo
        setVerificationStatus('verified');
      }

      // In a real implementation, we would use the vehicle information (make, model, year)
      // to further verify part compatibility and authenticity
      if (useVehicleVault && verificationVehicle) {
        console.log('Vehicle for verification:', verificationVehicle);
      } else if (!useVehicleVault && vehicleInput) {
        console.log('Manual vehicle input:', vehicleInput);
      }
    }, 1500);
  };

  const handleQrCapture = () => {
    // In a real implementation, this would activate the camera
    // For demo purposes, let's simulate a QR code scan
    toast({
      title: "QR Scanner Activated",
      description: "Point your camera at the QR code on the part",
    });
    
    // Simulate a successful scan after a delay
    setTimeout(() => {
      setPartCode('BP1042X9');
      handleVerify();
    }, 2000);
  };

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, we would process the image to extract the QR code
      // For demo purposes, simulate a successful extraction
      toast({
        title: "Image Uploaded",
        description: "Processing image for QR code...",
      });
      
      setTimeout(() => {
        setPartCode('BP1042X9');
        handleVerify();
      }, 1500);
    }
  };

  const resetVerification = () => {
    setVerificationStatus('idle');
    setPartCode('');
  };

  const getStatusDisplay = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <div className="flex flex-col items-center p-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mb-4"
            >
              <Search className="h-10 w-10 text-blue-500" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">Verifying Part...</h3>
            <p className="text-gray-500 text-center">
              Checking our database to verify the authenticity of this part
            </p>
          </div>
        );
        
      case 'verified':
        return (
          <div className="p-6">
            <div className="mb-6 text-center">
              <div className="bg-green-100 inline-flex p-3 rounded-full mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-700 mb-2">Genuine Part Verified</h3>
              <p className="text-gray-600">
                This part has been confirmed as an authentic manufacturer part
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>{partData.name}</span>
                  <Badge className="bg-green-600">{partData.authenticityScore}% Match</Badge>
                </CardTitle>
                <CardDescription>
                  Manufacturer: {partData.manufacturer} | Part #: {partData.partNumber}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Your Vehicle</h4>
                    <Badge className="bg-green-100 text-green-800 mb-2">
                      {useVehicleVault 
                        ? userVehicles.find(v => v.id.toString() === selectedVehicle)?.name || 'Unknown Vehicle'
                        : vehicleInput || 'Not Specified'}
                    </Badge>
                    
                    {useVehicleVault && selectedVehicle && (
                      <div className="text-xs text-gray-500 mt-1">
                        Verified using data from your Vehicle Vault
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Compatible Vehicles</h4>
                    <div className="flex flex-wrap gap-2">
                      {partData.compatibleVehicles.map((vehicle, idx) => (
                        <Badge key={idx} variant="outline" className="bg-blue-50">
                          {vehicle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Specifications</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {partData.specifications.map((spec, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-gray-500">{spec.name}:</span>
                          <span className="font-medium">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Manufacturing Information</h4>
                    <div className="text-sm">
                      <p>Manufacture Date: {new Date(partData.manufacturingDate).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={resetVerification}
                >
                  Verify Another Part
                </Button>
              </CardFooter>
            </Card>
          </div>
        );
        
      case 'counterfeit':
        return (
          <div className="p-6">
            <div className="mb-6 text-center">
              <div className="bg-red-100 inline-flex p-3 rounded-full mb-4">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-red-700 mb-2">Counterfeit Part Detected</h3>
              <p className="text-gray-600">
                This part does not match our records of authentic manufacturer parts
              </p>
            </div>
            
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Warning: Potential Safety Risk</CardTitle>
                <CardDescription className="text-red-700">
                  Using counterfeit parts may compromise vehicle safety and void warranty
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Verification Details</h4>
                    <p className="text-sm">
                      The part code "{partCode}" was verified against our database and does not match any authentic manufacturer records.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-red-200">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-1 text-blue-500" />
                      What to do next
                    </h4>
                    <ul className="text-sm list-disc pl-5 space-y-1">
                      <li>Contact your dealer or the part seller</li>
                      <li>Report this counterfeit part to the manufacturer</li>
                      <li>Consider purchasing from authorized dealers only</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={resetVerification}
                >
                  Verify Another Part
                </Button>
              </CardFooter>
            </Card>
          </div>
        );
        
      case 'warning':
        return (
          <div className="p-6">
            <div className="mb-6 text-center">
              <div className="bg-amber-100 inline-flex p-3 rounded-full mb-4">
                <AlertTriangle className="h-12 w-12 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-amber-700 mb-2">Verification Warning</h3>
              <p className="text-gray-600">
                This part has some concerns or is missing complete verification data
              </p>
            </div>
            
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle>Partial Verification</CardTitle>
                <CardDescription>
                  We found partial matches in our database that require attention
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Verification Issues</h4>
                    <ul className="text-sm list-disc pl-5 space-y-1">
                      <li>The manufacturing date could not be verified</li>
                      <li>The part appears genuine but may be from an older production batch</li>
                      <li>This part may have been repackaged</li>
                    </ul>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                    <p className="text-sm">
                      Verify this part with your authorized dealer before installation. The part may be genuine but we recommend additional verification.
                    </p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={resetVerification}
                >
                  Verify Another Part
                </Button>
              </CardFooter>
            </Card>
          </div>
        );
      
      default:
        return (
          <div className="p-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Spare Parts Verification System</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Verify the authenticity of spare parts for all vehicle types by scanning QR codes or entering verification details.
              </p>
            </div>
            
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 p-1 bg-gradient-to-r from-blue-100 via-teal-100 to-purple-100 shadow-inner">
                <TabsTrigger 
                  value="manual"
                  className="data-[state=active]:bg-gradient-to-b data-[state=active]:from-white data-[state=active]:to-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-md"
                >
                  <motion.div
                    className="flex items-center gap-1.5"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Manual Entry</span>
                  </motion.div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="qr"
                  className="data-[state=active]:bg-gradient-to-b data-[state=active]:from-white data-[state=active]:to-cyan-50 data-[state=active]:text-cyan-700 data-[state=active]:shadow-md"
                >
                  <motion.div
                    className="flex items-center gap-1.5"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <ScanLine className="h-4 w-4" />
                    <span>QR Scan</span>
                  </motion.div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="image"
                  className="data-[state=active]:bg-gradient-to-b data-[state=active]:from-white data-[state=active]:to-purple-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-md"
                >
                  <motion.div
                    className="flex items-center gap-1.5"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <ImagePlus className="h-4 w-4" />
                    <span>Upload Image</span>
                  </motion.div>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className="mt-4">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 overflow-hidden">
                  <div className="absolute right-0 top-0 w-40 h-40 opacity-10">
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <FileText className="w-full h-full text-blue-400" />
                    </motion.div>
                  </div>
                  
                  <CardHeader className="pb-3 relative z-10">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CardTitle className="flex items-center text-blue-800">
                        <FileText className="mr-2 h-5 w-5 text-blue-500" />
                        Manual Verification
                      </CardTitle>
                      <CardDescription className="text-blue-600/70">
                        Enter the part verification code found on the packaging or part itself.
                      </CardDescription>
                    </motion.div>
                  </CardHeader>
                  
                  <CardContent className="space-y-5 relative z-10">
                    <div className="space-y-2">
                      <motion.div 
                        className="flex flex-col space-y-2 mb-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                      >
                        <Label htmlFor="vehicle-type" className="text-blue-700 font-medium flex items-center">
                          <Car className="h-4 w-4 mr-1.5 text-blue-500" />
                          Select Vehicle
                        </Label>
                        
                        <div className="bg-blue-50/50 p-1 rounded-lg border border-blue-100 flex items-center">
                          <motion.div 
                            className="absolute h-7 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-md"
                            style={{ 
                              width: '50%', 
                              x: useVehicleVault ? 0 : '100%',
                            }}
                            animate={{ 
                              x: useVehicleVault ? 0 : '100%' 
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                          
                          <button 
                            className={`relative z-10 flex-1 py-1 text-xs font-medium rounded-md transition-colors ${useVehicleVault ? 'text-white' : 'text-blue-700'}`}
                            onClick={() => setUseVehicleVault(true)}
                          >
                            <motion.div 
                              animate={{ 
                                scale: useVehicleVault ? [1, 1.05, 1] : 1
                              }}
                              transition={{ duration: 0.3 }}
                              className="flex items-center justify-center"
                            >
                              <Shield className="w-3 h-3 mr-1" />
                              Vehicle Vault
                            </motion.div>
                          </button>
                          
                          <button 
                            className={`relative z-10 flex-1 py-1 text-xs font-medium rounded-md transition-colors ${!useVehicleVault ? 'text-white' : 'text-blue-700'}`}
                            onClick={() => setUseVehicleVault(false)}
                          >
                            <motion.div 
                              animate={{ 
                                scale: !useVehicleVault ? [1, 1.05, 1] : 1
                              }}
                              transition={{ duration: 0.3 }}
                              className="flex items-center justify-center"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Enter Manually
                            </motion.div>
                          </button>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5 }}
                        key={useVehicleVault ? "vault" : "manual"}
                      >
                        {useVehicleVault ? (
                          userVehicles.length > 0 ? (
                            <div className="relative">
                              <motion.div
                                className="absolute -right-2 -top-2 w-10 h-10 text-blue-200 opacity-40"
                                animate={{ 
                                  rotate: [0, 10, 0],
                                  scale: [1, 1.05, 1]
                                }}
                                transition={{ 
                                  duration: 4,
                                  repeat: Infinity,
                                  repeatType: "reverse"
                                }}
                              >
                                <Shield />
                              </motion.div>
                              
                              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                                <SelectTrigger className="border-blue-200 bg-blue-50/50 focus:ring-blue-500">
                                  <SelectValue placeholder="Select from your vehicles" />
                                </SelectTrigger>
                                <SelectContent>
                                  {userVehicles.map(vehicle => (
                                    <SelectItem 
                                      key={vehicle.id} 
                                      value={vehicle.id.toString()}
                                      className="focus:bg-blue-50 focus:text-blue-700"
                                    >
                                      <div className="flex items-center">
                                        <Car className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                                        <span>{vehicle.name} - <span className="text-blue-600 font-medium">{vehicle.licensePlate}</span></span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              
                              <p className="text-xs mt-1.5 text-blue-600 flex items-center">
                                <Info className="h-3 w-3 mr-1 text-blue-400" />
                                Using vehicles from your Vehicle Vault
                              </p>
                            </div>
                          ) : (
                            <motion.div 
                              className="rounded-lg overflow-hidden"
                              animate={{ 
                                boxShadow: ["0 0 0 rgba(251, 191, 36, 0)", "0 0 8px rgba(251, 191, 36, 0.5)", "0 0 0 rgba(251, 191, 36, 0)"]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity
                              }}
                            >
                              <div className="text-sm text-amber-600 flex items-center p-3 bg-amber-50 rounded-md border border-amber-200">
                                <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                                <div>
                                  <p className="font-medium">No vehicles found</p>
                                  <p className="text-xs mt-0.5">Add vehicles to Vehicle Vault or enter details manually</p>
                                </div>
                              </div>
                            </motion.div>
                          )
                        ) : (
                          <div className="space-y-1">
                            <div className="relative">
                              <motion.div
                                className="absolute -right-2 -top-2 w-8 h-8 text-blue-200 opacity-40"
                                animate={{ 
                                  rotate: [0, 15, 0],
                                }}
                                transition={{ 
                                  duration: 4,
                                  repeat: Infinity,
                                  repeatType: "reverse"
                                }}
                              >
                                <Edit />
                              </motion.div>
                              
                              <Input
                                placeholder="Enter vehicle name or license plate"
                                value={vehicleInput}
                                onChange={(e) => setVehicleInput(e.target.value)}
                                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-blue-50/50 placeholder:text-blue-300"
                              />
                            </div>
                            <motion.p 
                              className="text-xs text-blue-600 flex items-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3, duration: 0.5 }}
                            >
                              <Info className="h-3 w-3 mr-1 text-blue-400" />
                              Enter name, model or license plate number
                            </motion.p>
                          </div>
                        )}
                      </motion.div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="part-type" className="text-blue-700 font-medium flex items-center">
                        <Zap className="h-4 w-4 mr-1.5 text-cyan-500" />
                        Part Type
                      </Label>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        <Select 
                          value={selectedPartType} 
                          onValueChange={(value) => {
                            setSelectedPartType(value);
                            // Add a small animation effect
                            const el = document.getElementById('verification-code');
                            if (el) {
                              el.classList.add('bg-blue-50');
                              setTimeout(() => el.classList.remove('bg-blue-50'), 500);
                            }
                          }}
                        >
                          <SelectTrigger className="border-blue-200 bg-blue-50/50 focus:ring-blue-500">
                            <SelectValue placeholder="Select part type" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockPartTypes.map(part => (
                              <SelectItem 
                                key={part.id} 
                                value={part.id}
                                className="focus:bg-blue-50 focus:text-blue-700"
                              >
                                <div className="flex items-center">
                                  <Zap className="h-3.5 w-3.5 mr-1.5 text-cyan-500" />
                                  {part.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>
                    </div>
                    
                    <motion.div 
                      className="space-y-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <Label htmlFor="verification-code" className="text-blue-700 font-medium flex items-center">
                        <ScanLine className="h-4 w-4 mr-1.5 text-green-500" />
                        Verification Code
                      </Label>
                      
                      <div className="relative">
                        <motion.div
                          className="absolute -right-2 -top-2 w-8 h-8 text-green-200 opacity-40"
                          animate={{ 
                            rotate: [0, -15, 0],
                          }}
                          transition={{ 
                            duration: 4,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                        >
                          <ScanLine />
                        </motion.div>
                        
                        <Input
                          id="verification-code"
                          placeholder="Enter part verification code (e.g., BP1042X9)"
                          value={partCode}
                          onChange={e => setPartCode(e.target.value)}
                          className="border-blue-200 focus:border-green-400 focus:ring-green-400 bg-blue-50/50 placeholder:text-blue-300 transition-all duration-300"
                        />
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-2 rounded-md border border-blue-100 mt-2">
                        <p className="text-xs text-blue-600 flex items-center">
                          <Info className="h-3.5 w-3.5 mr-1 text-blue-400 flex-shrink-0" />
                          <span>
                            The verification code can be found on the part packaging or stamped on the part itself. 
                            <span className="text-green-600 font-medium ml-1">
                              Try demo codes: BP1042X9, FAKE5678, or WARN9012
                            </span>
                          </span>
                        </p>
                      </div>
                    </motion.div>
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <motion.div 
                      className="w-full"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 border-0 font-medium text-base py-6"
                        onClick={handleVerify}
                      >
                        <motion.div
                          className="flex items-center justify-center"
                          animate={{ 
                            scale: [1, 1.03, 1],
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "loop"
                          }}
                        >
                          Verify Part <ArrowRight className="ml-2 h-4 w-4" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="qr" className="mt-4">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-cyan-50 overflow-hidden">
                  <div className="absolute right-0 top-0 w-40 h-40 opacity-10">
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <ScanLine className="w-full h-full text-cyan-400" />
                    </motion.div>
                  </div>
                  
                  <CardHeader className="pb-3 relative z-10">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CardTitle className="flex items-center text-cyan-800">
                        <ScanLine className="mr-2 h-5 w-5 text-cyan-500" />
                        QR Code Scanner
                      </CardTitle>
                      <CardDescription className="text-cyan-600/70">
                        Use your camera to scan the QR code on the part or packaging.
                      </CardDescription>
                    </motion.div>
                  </CardHeader>
                  
                  <CardContent className="relative z-10">
                    <motion.div 
                      className="bg-gradient-to-b from-cyan-50 to-blue-50 rounded-lg border border-cyan-200 aspect-video flex flex-col items-center justify-center p-6 mb-4 relative overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      {/* Scanner frame animation */}
                      <motion.div 
                        className="absolute inset-0 z-0 border-2 border-transparent"
                        animate={{
                          borderColor: ["rgba(6, 182, 212, 0.3)", "rgba(6, 182, 212, 0.8)", "rgba(6, 182, 212, 0.3)"],
                          boxShadow: [
                            "0 0 0 0 rgba(6, 182, 212, 0)", 
                            "0 0 0 8px rgba(6, 182, 212, 0.15)", 
                            "0 0 0 0 rgba(6, 182, 212, 0)"
                          ]
                        }}
                        transition={{ 
                          duration: 2.5, 
                          repeat: Infinity, 
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Scanner line animation */}
                      <motion.div
                        className="absolute left-0 right-0 h-0.5 bg-cyan-400 opacity-70 z-10"
                        initial={{ top: "10%" }}
                        animate={{ top: ["10%", "90%", "10%"] }}
                        transition={{ 
                          duration: 2.5, 
                          repeat: Infinity,
                          ease: "easeInOut" 
                        }}
                      />
                      
                      <motion.div
                        animate={{ 
                          scale: [1, 1.05, 1],
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                        className="relative z-20"
                      >
                        <Camera className="h-16 w-16 text-cyan-500 mb-4" />
                      </motion.div>
                      
                      <p className="text-cyan-700 text-center mb-4 relative z-20">
                        Camera access required to scan QR codes.
                      </p>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative z-20"
                      >
                        <Button
                          onClick={handleQrCapture}
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0"
                        >
                          <motion.div
                            className="flex items-center"
                            animate={{ 
                              scale: [1, 1.05, 1],
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "loop"
                            }}
                          >
                            <ScanLine className="mr-2 h-4 w-4" />
                            Start Scanner
                          </motion.div>
                        </Button>
                      </motion.div>
                    </motion.div>
                    
                    <motion.div 
                      className="text-sm text-cyan-700 bg-blue-50 p-4 rounded-lg border border-cyan-100"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <p className="font-medium mb-2 flex items-center text-cyan-800">
                        <Info className="h-4 w-4 mr-1.5 text-cyan-600" />
                        Scanning Instructions:
                      </p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li className="flex items-start">
                          <span className="bg-cyan-100 text-cyan-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 font-medium">1</span>
                          <span>Click "Start Scanner" to activate your camera</span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-cyan-100 text-cyan-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 font-medium">2</span>
                          <span>Position the QR code within the scanning area</span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-cyan-100 text-cyan-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0 font-medium">3</span>
                          <span>Hold steady until the code is recognized</span>
                        </li>
                      </ol>
                    </motion.div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="image" className="mt-4">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 overflow-hidden">
                  <div className="absolute right-0 top-0 w-40 h-40 opacity-10">
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <ImagePlus className="w-full h-full text-purple-400" />
                    </motion.div>
                  </div>
                  
                  <CardHeader className="pb-3 relative z-10">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CardTitle className="flex items-center text-purple-800">
                        <ImagePlus className="mr-2 h-5 w-5 text-purple-500" />
                        Upload QR Image
                      </CardTitle>
                      <CardDescription className="text-purple-600/70">
                        Upload a photo of the part's QR code for verification.
                      </CardDescription>
                    </motion.div>
                  </CardHeader>
                  
                  <CardContent className="space-y-5 relative z-10">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      whileHover={{ 
                        boxShadow: "0 0 15px rgba(147, 51, 234, 0.2)",
                        borderColor: "rgba(147, 51, 234, 0.4)"
                      }}
                      className="relative"
                    >
                      <div 
                        className="border-2 border-dashed border-purple-200 bg-gradient-to-b from-white to-purple-50 rounded-lg p-10 text-center cursor-pointer transition-all duration-300 relative overflow-hidden"
                        onClick={handleImageUpload}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                        />
                        
                        {/* Pulsing circle behind upload icon */}
                        <motion.div 
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-100 rounded-full w-24 h-24"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.2, 0.5]
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                        />
                        
                        <motion.div
                          className="relative z-10"
                          animate={{ 
                            y: [0, -5, 0],
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity, 
                            repeatType: "reverse"
                          }}
                        >
                          <Upload className="h-14 w-14 text-purple-500 mx-auto mb-4" />
                        </motion.div>
                        
                        <h3 className="font-medium mb-1 text-purple-700 text-lg relative z-10">
                          Click to upload QR code image
                        </h3>
                        
                        <p className="text-sm text-purple-600 mb-4 relative z-10">
                          Support for JPG, PNG or WEBP
                        </p>
                        
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative z-10 inline-block"
                        >
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-purple-300 bg-white text-purple-600 hover:bg-purple-50"
                          >
                            <ImagePlus className="h-4 w-4 mr-1" />
                            Select Image
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-sm text-purple-700"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <div className="flex items-start">
                        <Info className="h-5 w-5 mr-2 text-purple-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium mb-1">For best results:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Ensure the QR code is clearly visible in the image</li>
                            <li>Make sure the image is well-lit with no glare</li>
                            <li>Keep the QR code centered and avoid angles</li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="container px-4 py-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
              Spare Parts Verifier
            </h1>
            <motion.div
              className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400"
              initial={{ width: 0 }}
              animate={{ width: "40%" }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="text-gray-600 mt-4 max-w-2xl">
            Verify the authenticity of vehicle spare parts to ensure quality, 
            safety, and compatibility with your vehicles.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
        >
          {getStatusDisplay()}
        </motion.div>
        
        {/* Information section */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="mr-2 h-5 w-5 text-green-500" />
                Why Verify Parts?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Counterfeit parts may compromise vehicle safety and performance</span>
                </li>
                <li className="flex">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Using non-genuine parts can void vehicle warranty</span>
                </li>
                <li className="flex">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Authentic parts meet strict quality and safety standards</span>
                </li>
                <li className="flex">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Protect yourself from unknowingly purchasing fake parts</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-blue-500" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex">
                  <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex-shrink-0 flex items-center justify-center mr-2 font-medium">1</div>
                  <div>
                    <p className="font-medium">Scan or Enter Code</p>
                    <p className="text-sm text-gray-600">Use your device camera to scan the QR code or enter the verification code manually</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex-shrink-0 flex items-center justify-center mr-2 font-medium">2</div>
                  <div>
                    <p className="font-medium">Authentication Check</p>
                    <p className="text-sm text-gray-600">Our system checks the code against manufacturer databases</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex-shrink-0 flex items-center justify-center mr-2 font-medium">3</div>
                  <div>
                    <p className="font-medium">Verification Results</p>
                    <p className="text-sm text-gray-600">Get immediate confirmation of the part's authenticity with detailed information</p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PartVerifierPage;