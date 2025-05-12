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
  Shield as ShieldCheck
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="qr">QR Scan</TabsTrigger>
                <TabsTrigger value="image">Upload Image</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Manual Verification</CardTitle>
                    <CardDescription>
                      Enter the part verification code found on the packaging or part itself.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="vehicle-type">Select Vehicle</Label>
                        <div className="flex items-center gap-2 text-xs">
                          <Button 
                            variant={useVehicleVault ? "default" : "outline"} 
                            size="sm" 
                            onClick={() => setUseVehicleVault(true)}
                            className="h-6 px-2 text-xs"
                          >
                            Vehicle Vault
                          </Button>
                          <Button 
                            variant={!useVehicleVault ? "default" : "outline"} 
                            size="sm" 
                            onClick={() => setUseVehicleVault(false)}
                            className="h-6 px-2 text-xs"
                          >
                            Enter Manually
                          </Button>
                        </div>
                      </div>
                      
                      {useVehicleVault ? (
                        userVehicles.length > 0 ? (
                          <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select from your vehicles" />
                            </SelectTrigger>
                            <SelectContent>
                              {userVehicles.map(vehicle => (
                                <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                                  {vehicle.name} - {vehicle.licensePlate}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="text-sm text-amber-600 flex items-center p-2 bg-amber-50 rounded-md">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            No vehicles in Vehicle Vault. Add vehicles or enter details manually.
                          </div>
                        )
                      ) : (
                        <div className="space-y-2">
                          <Input
                            placeholder="Enter vehicle name or license plate"
                            value={vehicleInput}
                            onChange={(e) => setVehicleInput(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="part-type">Part Type</Label>
                      <Select value={selectedPartType} onValueChange={setSelectedPartType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select part type" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockPartTypes.map(part => (
                            <SelectItem key={part.id} value={part.id}>
                              {part.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="verification-code">Verification Code</Label>
                      <Input
                        id="verification-code"
                        placeholder="Enter part verification code (e.g., BP1042X9)"
                        value={partCode}
                        onChange={e => setPartCode(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        The verification code can be found on the part packaging or stamped on the part.
                      </p>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={handleVerify}
                    >
                      Verify Part <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="qr" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>QR Code Scanner</CardTitle>
                    <CardDescription>
                      Use your camera to scan the QR code on the part or packaging.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="bg-gray-100 rounded-lg border border-gray-200 aspect-video flex flex-col items-center justify-center p-6 mb-4">
                      <Camera className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 text-center mb-4">
                        Camera access required to scan QR codes.
                      </p>
                      <Button onClick={handleQrCapture}>
                        Start Scanner
                      </Button>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <p className="font-medium mb-2">Instructions:</p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Click "Start Scanner" to activate your camera</li>
                        <li>Position the QR code within the scanning area</li>
                        <li>Hold steady until the code is recognized</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="image" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload QR Image</CardTitle>
                    <CardDescription>
                      Upload a photo of the part's QR code for verification.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={handleImageUpload}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-medium mb-1">Click to upload QR code image</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Support for JPG, PNG or WEBP
                      </p>
                      <Button variant="outline" size="sm">
                        Select Image
                      </Button>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-500">
                      <p>
                        For best results, ensure the QR code is clearly visible and well-lit in the image.
                      </p>
                    </div>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Spare Parts Verifier</h1>
          <p className="text-gray-600 mt-2">
            Verify the authenticity of vehicle spare parts to ensure quality and safety
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
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