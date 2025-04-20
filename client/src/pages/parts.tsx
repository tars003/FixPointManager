import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Camera, 
  Upload, 
  Mic, 
  FileText, 
  Share2, 
  Info, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Plus, 
  Car,
  Barcode,
  FileIcon,
  MessageSquare,
  FileSearch
} from 'lucide-react';
import { FaWhatsapp, FaEnvelope, FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FadeIn, SlideUp } from '@/components/ui/animated-components';

interface Part {
  id: string;
  name: string;
  description: string;
  compatibility: string[];
  price: string;
  rating: number;
  oem: boolean;
  image: string;
  supplier: string;
  alternatives?: {
    id: string;
    name: string;
    price: string;
    supplier: string;
  }[];
}

const samplePart: Part = {
  id: 'AF-12345',
  name: 'Air Filter',
  description: 'High-quality air filter for optimal engine performance and fuel efficiency',
  compatibility: ['Honda Accord 2018-2022', 'Honda Civic 2019-2022', 'Honda CR-V 2018-2022'],
  price: '₹1,250',
  rating: 4.8,
  oem: true,
  image: 'https://placehold.co/400x300/e2e8f0/64748b?text=Air+Filter',
  supplier: 'Honda Genuine Parts',
  alternatives: [
    {
      id: 'AF-12346',
      name: 'Premium Air Filter',
      price: '₹950',
      supplier: 'AutoZone'
    },
    {
      id: 'AF-12347',
      name: 'Economy Air Filter',
      price: '₹750',
      supplier: 'SpareHub'
    }
  ]
};

const PartsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('find');
  const [searchMethod, setSearchMethod] = useState('vin');
  const [isUploading, setIsUploading] = useState(false);
  const [vinNumber, setVinNumber] = useState('');
  const [searchResult, setSearchResult] = useState<Part | null>(null);
  const [noResults, setNoResults] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [notes, setNotes] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [isBulkUpload, setIsBulkUpload] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const handleSearch = () => {
    // In a real app, this would be an API call
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      
      if (searchMethod === 'manual' && partNumber.toLowerCase().includes('air filter')) {
        setSearchResult(samplePart);
        setNoResults(false);
      } else if (searchMethod === 'vin' && vinNumber.length >= 10) {
        setSearchResult(samplePart);
        setNoResults(false);
      } else if (searchMethod === 'image' && attachments.length > 0) {
        setSearchResult(samplePart);
        setNoResults(false);
      } else {
        setSearchResult(null);
        setNoResults(true);
      }
    }, 1500);
  };

  const handleVerify = () => {
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      
      if (partNumber.toLowerCase().includes('air filter') || attachments.length > 0) {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newAttachments = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const handleTakePhoto = () => {
    setCameraActive(true);
    // This would activate the camera in a real app
    // For demo purposes, let's simulate taking a photo
    setTimeout(() => {
      setCameraActive(false);
      setAttachments([...attachments, 'https://placehold.co/400x300/e2e8f0/64748b?text=Camera+Photo']);
    }, 2000);
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    // Simulate voice recording
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setNotes(notes + (notes ? "\n" : "") + "Voice note transcription would appear here...");
      }, 3000);
    }
  };

  const renderSearchTab = () => {
    return (
      <div className="space-y-6">
        <Tabs defaultValue="vin" value={searchMethod} onValueChange={setSearchMethod} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="vin" className="flex items-center gap-2">
              <Barcode className="h-4 w-4" />
              <span>VIN Search</span>
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <span>Image Search</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Manual Search</span>
            </TabsTrigger>
          </TabsList>
          
          {/* VIN Search */}
          <TabsContent value="vin" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Barcode className="h-5 w-5 text-primary" />
                  <span>VIN Search</span>
                </CardTitle>
                <CardDescription>
                  Enter your Vehicle Identification Number (VIN) to find compatible parts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
                    <Input 
                      id="vin" 
                      placeholder="e.g. 1HGCM82633A123456" 
                      value={vinNumber}
                      onChange={(e) => setVinNumber(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Info className="h-3.5 w-3.5" />
                      You can find your VIN on the driver's side dashboard or door jamb sticker.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSearch} 
                  disabled={isUploading || !vinNumber}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <span className="animate-spin mr-2">
                        <Upload className="h-4 w-4" />
                      </span>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search Parts
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Image Search */}
          <TabsContent value="image" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" />
                    <span>Image Search</span>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="bulk-upload" className="text-sm font-medium">Bulk Upload</Label>
                    <Switch 
                      id="bulk-upload" 
                      checked={isBulkUpload}
                      onCheckedChange={setIsBulkUpload}
                    />
                  </div>
                </div>
                <CardDescription>
                  Upload or take a photo of the part you need to identify
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cameraActive ? (
                  <div className="border-2 border-dashed border-primary/50 rounded-lg p-12 text-center relative bg-black">
                    <div className="absolute top-2 right-2">
                      <Button 
                        variant="ghost"
                        size="icon"
                        onClick={() => setCameraActive(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 rounded-full border-2 border-white/80 flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-white/60 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-10 w-10 bg-white"></span>
                      </div>
                      <p className="text-white font-medium">Camera Preview</p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center p-12 text-center">
                    <FileIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-1">Upload an image</h3>
                    <p className="text-sm text-muted-foreground mb-4">Our AI will identify the parts in your image</p>
                    <div className="flex gap-2">
                      <Button variant="outline" asChild>
                        <label className="cursor-pointer">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileUpload}
                            multiple={isBulkUpload}
                          />
                        </label>
                      </Button>
                      <Button 
                        variant="secondary"
                        onClick={handleTakePhoto}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Take Photo
                      </Button>
                    </div>
                  </div>
                )}
                
                {attachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Uploaded Images ({attachments.length})</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {attachments.map((url, index) => (
                        <div key={index} className="relative rounded-md overflow-hidden border group">
                          <img src={url} alt={`Attachment ${index + 1}`} className="w-full h-24 object-cover" />
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveAttachment(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-6 bg-muted/40 rounded-lg p-4">
                  <h4 className="flex items-center gap-1.5 text-sm font-medium mb-2 text-muted-foreground">
                    <Info className="h-4 w-4" />
                    Pro Tips for Image Recognition
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                    <li>Ensure good lighting for better recognition</li>
                    <li>Capture clear, focused images of the part</li>
                    <li>Include any part numbers or labels in the image</li>
                    <li>For better results, take multiple angles of the same part</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 items-stretch">
                <Button 
                  onClick={handleSearch} 
                  disabled={isUploading || attachments.length === 0}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <span className="animate-spin mr-2">
                        <Upload className="h-4 w-4" />
                      </span>
                      Analyzing Images...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Identify Parts
                    </>
                  )}
                </Button>
                
                <div className="w-full flex flex-col gap-2">
                  <Label htmlFor="notes" className="text-sm font-medium">Add Notes (Optional)</Label>
                  <div className="flex gap-2">
                    <Textarea 
                      id="notes" 
                      placeholder="Add additional details about the part..." 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      className={isRecording ? "bg-red-100 text-red-500 animate-pulse" : ""}
                      onClick={handleToggleRecording}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="w-full flex flex-col gap-2">
                  <Label className="text-sm font-medium">Upload Documents (Optional)</Label>
                  <Button variant="outline" asChild className="w-full">
                    <label className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      Attach Documents (PDF, Excel, etc.)
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.xls,.xlsx,.doc,.docx"
                        onChange={handleFileUpload}
                        multiple
                      />
                    </label>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Manual Search */}
          <TabsContent value="manual" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  <span>Manual Search</span>
                </CardTitle>
                <CardDescription>
                  Enter your vehicle details and part information to find what you need
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="make">Vehicle Make</Label>
                    <Input 
                      id="make" 
                      placeholder="e.g. Honda" 
                      value={vehicleMake}
                      onChange={(e) => setVehicleMake(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Vehicle Model</Label>
                    <Input 
                      id="model" 
                      placeholder="e.g. Accord" 
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input 
                      id="year" 
                      placeholder="e.g. 2021" 
                      value={vehicleYear}
                      onChange={(e) => setVehicleYear(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partNumber">Part Name or Number</Label>
                    <Input 
                      id="partNumber" 
                      placeholder="e.g. Air Filter or AF-1234" 
                      value={partNumber}
                      onChange={(e) => setPartNumber(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSearch} 
                  disabled={isUploading || (!vehicleMake && !vehicleModel && !vehicleYear && !partNumber)}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <span className="animate-spin mr-2">
                        <Upload className="h-4 w-4" />
                      </span>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search Parts
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Search Results */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-primary" />
            Search Results
          </h2>
          
          {isUploading && (
            <FadeIn>
              <Card className="border border-primary/20">
                <CardContent className="p-8 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin mb-4">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-center font-medium">Searching for parts...</p>
                    <p className="text-sm text-muted-foreground mt-1">This might take a moment</p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          )}
          
          {noResults && !isUploading && (
            <FadeIn>
              <Card>
                <CardContent className="p-8 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No parts found yet</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    Use the search options above to find parts for your vehicle.
                    Try providing more specific information for better results.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          )}
          
          {searchResult && !isUploading && (
            <SlideUp>
              <Card className="overflow-hidden border-primary/20">
                <CardHeader className="bg-primary/5 pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle>{searchResult.name}</CardTitle>
                        {searchResult.oem && (
                          <Badge variant="default" className="bg-green-500 hover:bg-green-600">OEM</Badge>
                        )}
                      </div>
                      <CardDescription className="mt-1">Part Number: {searchResult.id}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-semibold">{searchResult.price}</span>
                      <span className="text-sm text-muted-foreground">Supplier: {searchResult.supplier}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid md:grid-cols-5 gap-6">
                    <div className="md:col-span-2">
                      <img 
                        src={searchResult.image} 
                        alt={searchResult.name} 
                        className="w-full h-auto rounded-md border object-cover"
                      />
                      <div className="flex justify-between mt-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          Authentic
                        </Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-xs">
                              <Share2 className="h-3 w-3 mr-1" /> Share
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Share This Part</DialogTitle>
                              <DialogDescription>
                                Choose how you want to share this part information
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-5 gap-4 py-4">
                              <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-3">
                                <FaWhatsapp className="h-5 w-5 text-green-500" />
                                <span className="text-xs">WhatsApp</span>
                              </Button>
                              <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-3">
                                <FaEnvelope className="h-5 w-5 text-blue-500" />
                                <span className="text-xs">Email</span>
                              </Button>
                              <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-3">
                                <FaTwitter className="h-5 w-5 text-sky-500" />
                                <span className="text-xs">Twitter</span>
                              </Button>
                              <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-3">
                                <FaFacebook className="h-5 w-5 text-blue-600" />
                                <span className="text-xs">Facebook</span>
                              </Button>
                              <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-3">
                                <FaLinkedin className="h-5 w-5 text-blue-700" />
                                <span className="text-xs">LinkedIn</span>
                              </Button>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="share-link">Or copy link</Label>
                              <div className="flex items-center gap-2">
                                <Input id="share-link" value={`https://fixpoint.app/parts/${searchResult.id}`} readOnly />
                                <Button size="sm">Copy</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    <div className="md:col-span-3">
                      <h3 className="font-medium mb-2">Description</h3>
                      <p className="text-sm text-muted-foreground mb-4">{searchResult.description}</p>
                      
                      <h3 className="font-medium mb-2">Compatible With</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {searchResult.compatibility.map((vehicle, idx) => (
                          <Badge key={idx} variant="secondary">
                            <Car className="h-3 w-3 mr-1" />
                            {vehicle}
                          </Badge>
                        ))}
                      </div>
                      
                      {searchResult.alternatives && searchResult.alternatives.length > 0 && (
                        <>
                          <h3 className="font-medium mb-2">Alternative Parts</h3>
                          <div className="space-y-2">
                            {searchResult.alternatives.map((alt, idx) => (
                              <div key={idx} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                                <div>
                                  <p className="font-medium text-sm">{alt.name}</p>
                                  <p className="text-xs text-muted-foreground">Supplier: {alt.supplier}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{alt.price}</span>
                                  <Button variant="outline" size="sm" className="h-7 text-xs">View</Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between bg-muted/30 border-t">
                  <Button variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify Authenticity
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="default">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </SlideUp>
          )}
        </div>
      </div>
    );
  };

  const renderVerifyTab = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>Verify Part Authenticity</span>
            </CardTitle>
            <CardDescription>
              Upload an image of the part or enter part details to verify authenticity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="verify-part-number">Part Number (if available)</Label>
                <Input 
                  id="verify-part-number" 
                  placeholder="e.g. AF-12345" 
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                />
              </div>
              
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <FileIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium mb-1">Upload images for verification</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload clear images of the part, packaging, and any authentication labels
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button variant="outline" asChild>
                    <label className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Images
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                        multiple
                      />
                    </label>
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={handleTakePhoto}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Take Photo
                  </Button>
                </div>
              </div>
              
              {attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Uploaded Images ({attachments.length})</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {attachments.map((url, index) => (
                      <div key={index} className="relative rounded-md overflow-hidden border group">
                        <img src={url} alt={`Attachment ${index + 1}`} className="w-full h-16 sm:h-20 object-cover" />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveAttachment(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="verify-notes">Additional Notes (Optional)</Label>
                <div className="flex gap-2">
                  <Textarea 
                    id="verify-notes" 
                    placeholder="Add any additional details about the part you want to verify..." 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    className={isRecording ? "bg-red-100 text-red-500 animate-pulse" : ""}
                    onClick={handleToggleRecording}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => {
              setPartNumber('');
              setAttachments([]);
              setNotes('');
              setIsVerified(null);
            }}>Reset</Button>
            <Button 
              onClick={handleVerify}
              disabled={isUploading || (partNumber === '' && attachments.length === 0)}
            >
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">
                    <Upload className="h-4 w-4" />
                  </span>
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify Authenticity
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Verification Results */}
        {isVerified !== null && !isUploading && (
          <SlideUp>
            <Card className={isVerified ? "border-green-200" : "border-red-200"}>
              <CardHeader className={isVerified ? "bg-green-50" : "bg-red-50"}>
                <CardTitle className="flex items-center gap-2">
                  {isVerified ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-green-700">Authentic Part Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span className="text-red-700">Potential Counterfeit Detected</span>
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  {isVerified 
                    ? "Our analysis confirms this is a genuine part matching manufacturer specifications."
                    : "Our analysis suggests this part may not be a genuine manufacturer part."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {isVerified ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-md border border-green-100">
                      <h3 className="font-medium flex items-center gap-1.5 text-green-700 mb-2">
                        <CheckCircle className="h-4 w-4" />
                        Verification Details
                      </h3>
                      <ul className="space-y-2 pl-6 text-sm">
                        <li className="flex gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium">QR Code Authentication:</span>
                            <span className="text-muted-foreground"> Valid manufacturer code detected</span>
                          </div>
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium">Hologram Verification:</span>
                            <span className="text-muted-foreground"> Authentic security hologram present</span>
                          </div>
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium">Material Analysis:</span>
                            <span className="text-muted-foreground"> Materials match manufacturer specifications</span>
                          </div>
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium">Database Lookup:</span>
                            <span className="text-muted-foreground"> Part number confirmed in manufacturer database</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Manufacturer Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-xs text-muted-foreground">Manufacturer</p>
                          <p className="font-medium">Honda Genuine Parts</p>
                        </div>
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-xs text-muted-foreground">Country of Origin</p>
                          <p className="font-medium">Japan</p>
                        </div>
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-xs text-muted-foreground">Production Date</p>
                          <p className="font-medium">Jan 2023</p>
                        </div>
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-xs text-muted-foreground">Warranty</p>
                          <p className="font-medium">1 Year</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 bg-red-50 rounded-md border border-red-100">
                      <h3 className="font-medium flex items-center gap-1.5 text-red-700 mb-2">
                        <AlertCircle className="h-4 w-4" />
                        Verification Issues
                      </h3>
                      <ul className="space-y-2 pl-6 text-sm">
                        <li className="flex gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium">QR Code Issue:</span>
                            <span className="text-muted-foreground"> Invalid or missing QR code</span>
                          </div>
                        </li>
                        <li className="flex gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium">Security Features:</span>
                            <span className="text-muted-foreground"> Missing or altered security hologram</span>
                          </div>
                        </li>
                        <li className="flex gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium">Material Analysis:</span>
                            <span className="text-muted-foreground"> Materials differ from manufacturer standards</span>
                          </div>
                        </li>
                        <li className="flex gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium">Database Lookup:</span>
                            <span className="text-muted-foreground"> Part number not found in manufacturer database</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Concerns & Recommendations</h3>
                      <div className="space-y-2">
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-sm">
                            <span className="font-medium">Potential risks: </span>
                            <span className="text-muted-foreground">Counterfeit parts may have reduced quality, durability, and performance compared to genuine parts, potentially causing damage to your vehicle.</span>
                          </p>
                        </div>
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="text-sm">
                            <span className="font-medium">Recommendation: </span>
                            <span className="text-muted-foreground">We recommend purchasing authentic parts from authorized dealers. Click below to find genuine parts.</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-wrap gap-3 justify-between bg-muted/30 border-t">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Results
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Share Verification Results</DialogTitle>
                      <DialogDescription>
                        Choose how you want to share these verification results
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-5 gap-4 py-4">
                      <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-3">
                        <FaWhatsapp className="h-5 w-5 text-green-500" />
                        <span className="text-xs">WhatsApp</span>
                      </Button>
                      <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-3">
                        <FaEnvelope className="h-5 w-5 text-blue-500" />
                        <span className="text-xs">Email</span>
                      </Button>
                      <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-3">
                        <FaTwitter className="h-5 w-5 text-sky-500" />
                        <span className="text-xs">Twitter</span>
                      </Button>
                      <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-3">
                        <FaFacebook className="h-5 w-5 text-blue-600" />
                        <span className="text-xs">Facebook</span>
                      </Button>
                      <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-3">
                        <FaLinkedin className="h-5 w-5 text-blue-700" />
                        <span className="text-xs">LinkedIn</span>
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="share-link">Or copy link</Label>
                      <div className="flex items-center gap-2">
                        <Input id="share-link" value={`https://fixpoint.app/verification-results/12345`} readOnly />
                        <Button size="sm">Copy</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Get Expert Help
                  </Button>
                  {!isVerified && (
                    <Button>
                      <Search className="h-4 w-4 mr-2" />
                      Find Genuine Parts
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </SlideUp>
        )}
      </div>
    );
  };

  return (
    <motion.div 
      className="container py-8 pb-24 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileSearch className="h-6 w-6 text-primary" />
            Find & Verify Parts
          </h1>
          <p className="text-muted-foreground">
            Search for exact parts for your vehicle or verify authenticity of spare parts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <div className="text-muted-foreground mr-2">?</div>
            How It Works
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New Vehicle
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="find" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="find" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Find Parts</span>
          </TabsTrigger>
          <TabsTrigger value="verify" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Verify Authenticity</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="find" className="space-y-4">
          {renderSearchTab()}
        </TabsContent>
        <TabsContent value="verify" className="space-y-4">
          {renderVerifyTab()}
        </TabsContent>
      </Tabs>
      
      {/* Pink Action Bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-pink-300 text-white py-3 px-4 flex items-center justify-center z-50"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          delay: 0.3
        }}
      >
        <Button 
          className="bg-white text-pink-500 hover:bg-pink-50 flex items-center gap-2 font-medium rounded-full shadow-lg px-6"
          size="lg"
        >
          <Search className="h-5 w-5" />
          Identify Parts
        </Button>
      </motion.div>
      
      {/* Floating action button */}
      <motion.div
        className="fixed bottom-20 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          delay: 0.6
        }}
      >
        <Button
          size="icon"
          className="h-14 w-14 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PartsPage;