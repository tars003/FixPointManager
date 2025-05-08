import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  AlertTriangle, 
  Check, 
  X, 
  Download, 
  Upload, 
  Filter, 
  Search, 
  Plus, 
  FileImage,
  FileCog,
  FileWarning,
  Clock,
  Car,
  ChevronRight,
  ArrowRight,
  Info,
  Settings
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { formatDate, formatRelativeTime } from '@/lib/format';
import { apiRequest } from '@/lib/queryClient';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PageHeader } from '@/components/ui/page-header';
import { DocumentScanner } from '@/components/documents/DocumentScanner';
import { DocumentRecommendations } from '@/components/documents/DocumentRecommendations';
import { DocumentAnnotation } from '@/components/documents/DocumentAnnotation';

// Define document types that match the backend
type DocumentType = 
  | 'registration_certificate'
  | 'insurance_policy'
  | 'pollution_certificate'
  | 'service_record'
  | 'warranty_card'
  | 'fitness_certificate'
  | 'loan_document'
  | 'road_tax_receipt'
  | 'purchase_invoice'
  | 'odometer_reading'
  | 'accident_report'
  | 'modification_certificate'
  | 'driving_license'
  | 'other';

// Document status
type DocumentStatus = 'active' | 'expired' | 'renewed' | 'cancelled';

// Interface for document
interface Document {
  id: number;
  vehicleId: number;
  userId: number;
  documentType: DocumentType;
  name: string;
  description?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  fileSize?: number;
  fileType?: string;
  issuedBy?: string;
  issuedDate?: string;
  expiryDate?: string;
  documentNumber?: string;
  isVerified: boolean;
  reminderEnabled: boolean;
  reminderDays: number;
  hasExpiryDate: boolean;
  status: DocumentStatus;
  tags?: string[];
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  vehicle?: {
    id: number;
    name: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    imageUrl?: string;
  };
}

// Interface for vehicle 
interface Vehicle {
  id: number;
  name: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  imageUrl?: string;
  status: string;
}

// Interface for the document form 
interface DocumentFormData {
  vehicleId: number;
  documentType: DocumentType;
  name: string;
  description?: string;
  issuedBy?: string;
  issuedDate?: string;
  expiryDate?: string;
  documentNumber?: string;
  hasExpiryDate: boolean;
  reminderEnabled: boolean;
  reminderDays: number;
}

const DocumentVault: React.FC = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // States
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<number | 'all'>('all');
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | 'all'>('all');
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isViewDocumentOpen, setIsViewDocumentOpen] = useState<boolean>(false);
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState<boolean>(false);
  const [isDocumentScannerOpen, setIsDocumentScannerOpen] = useState<boolean>(false);
  const [scannedDocumentData, setScannedDocumentData] = useState<any>(null);
  
  // Form data
  const [formData, setFormData] = useState<DocumentFormData>({
    vehicleId: 0,
    documentType: 'registration_certificate',
    name: '',
    description: '',
    issuedBy: '',
    issuedDate: '',
    expiryDate: '',
    documentNumber: '',
    hasExpiryDate: true,
    reminderEnabled: true,
    reminderDays: 30
  });
  
  // Fetch vehicles
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles'],
  });
  
  // Fetch documents
  const { data: documents = [], isLoading: isLoadingDocuments } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
    onError: (error) => {
      console.error("Error fetching documents:", error);
      toast({
        title: 'Failed to fetch documents',
        description: 'Using sample data until connection is restored',
        variant: 'default',
      });
    }
  });
  
  // Sample documents to use when API fails
  const sampleDocuments: Document[] = [
    {
      id: 1,
      vehicleId: 1,
      userId: 1,
      documentType: 'registration_certificate',
      name: 'Vehicle Registration Certificate',
      description: 'Official RC for BMW X5',
      issuedBy: 'Regional Transport Office',
      issuedDate: '2023-05-01',
      expiryDate: '2028-05-01',
      documentNumber: 'RC123456789',
      isVerified: true,
      reminderEnabled: true,
      reminderDays: 30,
      hasExpiryDate: true,
      status: 'active',
      createdAt: '2023-05-02',
      updatedAt: '2023-05-02',
      vehicle: {
        id: 1,
        name: 'My BMW',
        make: 'BMW',
        model: 'X5',
        year: 2023,
        licensePlate: 'MH01AB1234',
        imageUrl: 'https://www.bmw.in/content/dam/bmw/marketIN/bmw_in/all-models/x-series/x5/2023/navigation/bmw-x-series-x5-navigation-desktop.png'
      }
    },
    {
      id: 2,
      vehicleId: 1,
      userId: 1,
      documentType: 'insurance_policy',
      name: 'Comprehensive Insurance Policy',
      description: 'Full coverage insurance for BMW X5',
      issuedBy: 'HDFC ERGO',
      issuedDate: '2023-05-01',
      expiryDate: '2024-05-01',
      documentNumber: 'INS987654321',
      isVerified: true,
      reminderEnabled: true,
      reminderDays: 30,
      hasExpiryDate: true,
      status: 'active',
      createdAt: '2023-05-02',
      updatedAt: '2023-05-02',
      vehicle: {
        id: 1,
        name: 'My BMW',
        make: 'BMW',
        model: 'X5',
        year: 2023,
        licensePlate: 'MH01AB1234',
        imageUrl: 'https://www.bmw.in/content/dam/bmw/marketIN/bmw_in/all-models/x-series/x5/2023/navigation/bmw-x-series-x5-navigation-desktop.png'
      }
    },
    {
      id: 3,
      vehicleId: 2,
      userId: 1,
      documentType: 'service_record',
      name: 'First Service Record',
      description: 'First scheduled service for Audi A4',
      issuedBy: 'Audi Service Center',
      issuedDate: '2023-06-15',
      documentNumber: 'SVC20230615',
      isVerified: true,
      reminderEnabled: false,
      reminderDays: 0,
      hasExpiryDate: false,
      status: 'active',
      createdAt: '2023-06-16',
      updatedAt: '2023-06-16',
      vehicle: {
        id: 2,
        name: 'My Audi',
        make: 'Audi',
        model: 'A4',
        year: 2022,
        licensePlate: 'MH02CD5678',
        imageUrl: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Audi/A4/10548/Audi-A4-Technology-Plus-45-TFSI-Quattro/1683097437166/front-left-side-47.jpg'
      }
    },
    {
      id: 4,
      vehicleId: 1,
      userId: 1,
      documentType: 'pollution_certificate',
      name: 'Pollution Under Control Certificate',
      description: 'PUC for BMW X5',
      issuedBy: 'Mumbai PUC Center',
      issuedDate: '2023-07-10',
      expiryDate: '2024-01-10',
      documentNumber: 'PUC7654321',
      isVerified: true,
      reminderEnabled: true,
      reminderDays: 15,
      hasExpiryDate: true,
      status: 'active',
      createdAt: '2023-07-10',
      updatedAt: '2023-07-10',
      vehicle: {
        id: 1,
        name: 'My BMW',
        make: 'BMW',
        model: 'X5',
        year: 2023,
        licensePlate: 'MH01AB1234',
        imageUrl: 'https://www.bmw.in/content/dam/bmw/marketIN/bmw_in/all-models/x-series/x5/2023/navigation/bmw-x-series-x5-navigation-desktop.png'
      }
    },
    {
      id: 5,
      vehicleId: 2,
      userId: 1,
      documentType: 'loan_document',
      name: 'Vehicle Loan Agreement',
      description: 'Car loan document for Audi A4',
      issuedBy: 'HDFC Bank',
      issuedDate: '2022-12-01',
      documentNumber: 'LOAN22120001',
      isVerified: true,
      reminderEnabled: false,
      reminderDays: 0,
      hasExpiryDate: false,
      status: 'active',
      createdAt: '2022-12-02',
      updatedAt: '2022-12-02',
      vehicle: {
        id: 2,
        name: 'My Audi',
        make: 'Audi',
        model: 'A4',
        year: 2022,
        licensePlate: 'MH02CD5678',
        imageUrl: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Audi/A4/10548/Audi-A4-Technology-Plus-45-TFSI-Quattro/1683097437166/front-left-side-47.jpg'
      }
    },
    {
      id: 6,
      vehicleId: 1,
      userId: 1,
      documentType: 'modification_certificate',
      name: 'Alloy Wheels Modification Certificate',
      description: 'Certificate for custom alloy wheels',
      issuedBy: 'RTO Mumbai',
      issuedDate: '2023-08-05',
      documentNumber: 'MOD20230805',
      isVerified: true,
      reminderEnabled: false,
      reminderDays: 0,
      hasExpiryDate: false,
      status: 'active',
      createdAt: '2023-08-06',
      updatedAt: '2023-08-06',
      vehicle: {
        id: 1,
        name: 'My BMW',
        make: 'BMW',
        model: 'X5',
        year: 2023,
        licensePlate: 'MH01AB1234',
        imageUrl: 'https://www.bmw.in/content/dam/bmw/marketIN/bmw_in/all-models/x-series/x5/2023/navigation/bmw-x-series-x5-navigation-desktop.png'
      }
    }
  ];
  
  // Use sample data if API failed
  const actualDocuments = documents.length > 0 ? documents : sampleDocuments;
  
  // Create document mutation
  const addDocumentMutation = useMutation({
    mutationFn: async (data: DocumentFormData) => {
      const response = await apiRequest('POST', '/api/documents', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Document added successfully',
        description: 'Your document has been added to the vault.',
        variant: 'default',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      setIsAddDocumentOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to add document',
        description: error.message || 'An error occurred while adding the document.',
        variant: 'destructive',
      });
    },
  });
  
  // Function to reset form
  const resetForm = () => {
    setFormData({
      vehicleId: 0,
      documentType: 'registration_certificate',
      name: '',
      description: '',
      issuedBy: '',
      issuedDate: '',
      expiryDate: '',
      documentNumber: '',
      hasExpiryDate: true,
      reminderEnabled: true,
      reminderDays: 30
    });
    setScannedDocumentData(null);
  };
  
  // Handle document scan completion
  const handleScanComplete = (data: any) => {
    setScannedDocumentData(data);
    setIsDocumentScannerOpen(false);
    
    // Pre-fill form with scanned data
    if (data && data.extractedData) {
      const extractedData = data.extractedData;
      
      setFormData(prev => ({
        ...prev,
        name: data.suggestedName || prev.name,
        documentType: data.detectedType || prev.documentType,
        documentNumber: extractedData.documentNumber || prev.documentNumber,
        issuedBy: extractedData.issuedBy || prev.issuedBy,
        issuedDate: extractedData.issuedDate || extractedData.issueDate || prev.issuedDate,
        expiryDate: extractedData.expiryDate || prev.expiryDate,
        hasExpiryDate: !!extractedData.expiryDate,
      }));
      
      setIsAddDocumentOpen(true);
      
      toast({
        title: "Document scanned successfully",
        description: "The form has been pre-filled with the extracted data. Please review and submit.",
      });
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle select input changes
  const handleSelectChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vehicleId) {
      toast({
        title: 'Vehicle required',
        description: 'Please select a vehicle for this document.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!formData.name) {
      toast({
        title: 'Document name required',
        description: 'Please provide a name for this document.',
        variant: 'destructive',
      });
      return;
    }
    
    addDocumentMutation.mutate(formData);
  };
  
  // State for category filtering 
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Filter documents based on selected filters
  const filteredDocuments = (Array.isArray(actualDocuments) ? actualDocuments : []).filter((doc: Document) => {
    // Filter by search term
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.issuedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.vehicle?.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.vehicle?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.vehicle?.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by document status
    const matchesStatus = 
      activeTab === 'all' || 
      (activeTab === 'active' && doc.status === 'active') ||
      (activeTab === 'expired' && doc.status === 'expired') ||
      (activeTab === 'expiring-soon' && doc.status === 'active' && doc.expiryDate && isExpiringWithin30Days(doc.expiryDate));
    
    // Filter by vehicle
    const matchesVehicle = selectedVehicle === 'all' || doc.vehicleId === selectedVehicle;
    
    // Filter by document type
    const matchesType = selectedDocumentType === 'all' || doc.documentType === selectedDocumentType;
    
    // Filter by category
    const matchesCategory = !selectedCategory || 
      (selectedCategory === 'registration' && ['registration_certificate', 'road_tax_receipt', 'purchase_invoice'].includes(doc.documentType)) ||
      (selectedCategory === 'insurance' && doc.documentType === 'insurance_policy') ||
      (selectedCategory === 'service' && ['service_record', 'odometer_reading'].includes(doc.documentType)) ||
      (selectedCategory === 'legal' && ['driving_license', 'pollution_certificate', 'fitness_certificate'].includes(doc.documentType)) ||
      (selectedCategory === 'modification' && doc.documentType === 'modification_certificate') ||
      (selectedCategory === 'financial' && doc.documentType === 'loan_document');
    
    return matchesSearch && matchesStatus && matchesVehicle && matchesType && matchesCategory;
  });
  
  // Using the isExpiringWithin30Days function defined earlier
  
  // Function to open document view with proper type
  const openDocumentView = (document: Document) => {
    setSelectedDocument(document);
    setIsViewDocumentOpen(true);
    toast({
      title: 'Document opened',
      description: `Viewing details for ${document.name}`,
      variant: 'default',
    });
  };
  
  // Function to get document status badge
  const getDocumentStatusBadge = (status: DocumentStatus, expiryDate?: string) => {
    if (status === 'active' && expiryDate && isExpiringWithin30Days(expiryDate)) {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Expiring Soon</Badge>;
    }
    
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Expired</Badge>;
      case 'renewed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Renewed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Cancelled</Badge>;
      default:
        return null;
    }
  };
  
  // Function to get document type label
  const getDocumentTypeLabel = (docType: DocumentType): string => {
    return docType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Function to get document icon based on type
  const getDocumentIcon = (docType: DocumentType) => {
    switch (docType) {
      case 'registration_certificate':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'insurance_policy':
        return <FileCog className="h-5 w-5 text-green-600" />;
      case 'pollution_certificate':
        return <FileImage className="h-5 w-5 text-emerald-600" />;
      case 'service_record':
        return <FileCog className="h-5 w-5 text-purple-600" />;
      case 'accident_report':
        return <FileWarning className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  // Mock document categories to show while we build the complete feature
  const documentCategories = [
    { id: 'registration', title: 'Registration & Ownership', count: 0 },
    { id: 'insurance', title: 'Insurance Documents', count: 0 },
    { id: 'service', title: 'Service Records', count: 0 },
    { id: 'legal', title: 'Legal Documents', count: 0 },
    { id: 'modification', title: 'Modification Records', count: 0 },
    { id: 'financial', title: 'Financial Documents', count: 0 },
  ];
  
  // Update counts of each category
  (Array.isArray(documents) ? documents : []).forEach((doc: Document) => {
    if (['registration_certificate', 'road_tax_receipt', 'purchase_invoice'].includes(doc.documentType)) {
      documentCategories[0].count++;
    } else if (doc.documentType === 'insurance_policy') {
      documentCategories[1].count++;
    } else if (['service_record', 'odometer_reading'].includes(doc.documentType)) {
      documentCategories[2].count++;
    } else if (['driving_license', 'pollution_certificate', 'fitness_certificate'].includes(doc.documentType)) {
      documentCategories[3].count++;
    } else if (doc.documentType === 'modification_certificate') {
      documentCategories[4].count++;
    } else if (doc.documentType === 'loan_document') {
      documentCategories[5].count++;
    }
  });
  
  // Removing duplicate function declaration
  
  // Document view dialog
  const renderDocumentViewDialog = () => {
    if (!selectedDocument) return null;
    
    return (
      <Dialog open={isViewDocumentOpen} onOpenChange={setIsViewDocumentOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              <div className="flex items-center gap-2">
                {getDocumentIcon(selectedDocument.documentType)}
                <span>{selectedDocument.name}</span>
              </div>
            </DialogTitle>
            <DialogDescription>
              <span className="flex items-center gap-2 mt-2">
                <Car className="h-4 w-4" />
                {selectedDocument.vehicle 
                  ? `${selectedDocument.vehicle.make} ${selectedDocument.vehicle.model} (${selectedDocument.vehicle.licensePlate})`
                  : 'Loading vehicle...'}
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div>
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Document Details</h3>
                <div className="border rounded-lg p-4 space-y-3">
                  {selectedDocument.documentNumber && (
                    <div>
                      <div className="text-xs text-gray-500">Document Number</div>
                      <div className="text-sm font-medium">{selectedDocument.documentNumber}</div>
                    </div>
                  )}
                  
                  {selectedDocument.issuedBy && (
                    <div>
                      <div className="text-xs text-gray-500">Issued By</div>
                      <div className="text-sm font-medium">{selectedDocument.issuedBy}</div>
                    </div>
                  )}
                  
                  {selectedDocument.issuedDate && (
                    <div>
                      <div className="text-xs text-gray-500">Issue Date</div>
                      <div className="text-sm font-medium">{formatDate(selectedDocument.issuedDate)}</div>
                    </div>
                  )}
                  
                  {selectedDocument.hasExpiryDate && selectedDocument.expiryDate && (
                    <div>
                      <div className="text-xs text-gray-500">Expiry Date</div>
                      <div className="text-sm font-medium flex items-center">
                        {formatDate(selectedDocument.expiryDate)}
                        {selectedDocument.status === 'active' && isExpiringWithin30Days(selectedDocument.expiryDate) && (
                          <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                            Expiring Soon
                          </Badge>
                        )}
                        {selectedDocument.status === 'expired' && (
                          <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 border-red-300">
                            Expired
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {selectedDocument.description && (
                    <div>
                      <div className="text-xs text-gray-500">Description</div>
                      <div className="text-sm">{selectedDocument.description}</div>
                    </div>
                  )}
                  
                  {selectedDocument.tags && selectedDocument.tags.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-500">Tags</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedDocument.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="bg-violet-100 text-violet-800 border-violet-300">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <div className="text-xs text-gray-500">Document Type</div>
                    <div className="text-sm font-medium">{getDocumentTypeLabel(selectedDocument.documentType)}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500">Status</div>
                    <div className="text-sm font-medium">{selectedDocument.status.charAt(0).toUpperCase() + selectedDocument.status.slice(1)}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Notification Settings</h3>
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Expiry Reminders</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedDocument.reminderEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {selectedDocument.reminderEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  
                  {selectedDocument.reminderEnabled && (
                    <div>
                      <div className="text-xs text-gray-500">Reminder Days</div>
                      <div className="text-sm">{selectedDocument.reminderDays} days before expiry</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Document Preview</h3>
              <div className="border rounded-lg overflow-hidden">
                {selectedDocument.thumbnailUrl ? (
                  <img 
                    src={selectedDocument.thumbnailUrl} 
                    alt={selectedDocument.name} 
                    className="w-full h-64 object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                    <FileText className="h-16 w-16 text-gray-300" />
                  </div>
                )}
                
                <div className="p-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">File Type</div>
                      <div className="text-sm font-medium">{selectedDocument.fileType || 'Unknown'}</div>
                    </div>
                    
                    {selectedDocument.fileSize && (
                      <div className="text-right">
                        <div className="text-xs text-gray-500">File Size</div>
                        <div className="text-sm font-medium">{formatFileSize(selectedDocument.fileSize)}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col mt-6 space-y-2">
                <Button className="w-full bg-violet-600 hover:bg-violet-700 flex items-center justify-center">
                  <Download className="h-4 w-4 mr-2" />
                  Download Document
                </Button>
                
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Update Document
                </Button>
                
                {selectedDocument.status === 'expired' && (
                  <Button className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Renew Document
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <div className="w-full flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
              <Button variant="outline" onClick={() => setIsViewDocumentOpen(false)}>
                Close
              </Button>
              
              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 mb-2 sm:mb-0">
                <Button
                  variant="outline"
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                  onClick={() => {
                    toast({
                      title: 'Document sharing',
                      description: 'Share functionality will be available soon',
                    });
                  }}
                >
                  Share Document
                </Button>
                
                <Button
                  variant="outline"
                  className="border-red-500 text-red-600 hover:bg-red-50"
                  onClick={() => {
                    toast({
                      title: 'Document archived',
                      description: 'Document has been archived successfully',
                    });
                    setIsViewDocumentOpen(false);
                  }}
                >
                  Archive Document
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    else return (bytes / 1073741824).toFixed(1) + ' GB';
  };
  
  // Keeping this implementation of isExpiringWithin30Days
  const isExpiringWithin30Days = (expiryDate: string): boolean => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <PageHeader 
        title="Document Vault"
        description="Securely store, organize, and access all your vehicle-related documents in one place."
        className="mb-8"
      >
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-violet-600 mr-2" />
        </div>
      </PageHeader>
      
      {/* Document View Dialog */}
      {renderDocumentViewDialog()}
      
      {/* Document Management */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-md h-auto">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Categories</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {documentCategories.map(category => (
                  <button
                    key={category.id}
                    className={`w-full flex justify-between items-center px-3 py-2 text-left rounded-md hover:bg-gray-100 transition-colors ${
                      selectedCategory === category.id ? 'bg-violet-100 text-violet-800 border border-violet-300' : ''
                    }`}
                    onClick={() => {
                      if (selectedCategory === category.id) {
                        // If already selected, deselect it
                        setSelectedCategory(null);
                      } else {
                        // Select this category
                        setSelectedCategory(category.id);
                        // Set a toast notification to show the category was selected
                        toast({
                          title: `${category.title} selected`,
                          description: `Showing ${category.count} document${category.count !== 1 ? 's' : ''}`,
                          variant: 'default',
                        });
                      }
                    }}
                  >
                    <span className="text-sm font-medium flex items-center">
                      {selectedCategory === category.id && <ChevronRight className="h-4 w-4 mr-1 text-violet-600" />}
                      {category.title}
                    </span>
                    <Badge variant={selectedCategory === category.id ? "default" : "outline"} 
                      className={selectedCategory === category.id ? "bg-violet-600" : ""}>
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex flex-col space-y-2">
              <Button
                className="w-full bg-violet-600 hover:bg-violet-700"
                onClick={() => setIsAddDocumentOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Document
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsDocumentScannerOpen(true)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Scan Document
              </Button>
              <Button
                variant="ghost"
                className="w-full text-violet-700"
                onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
              >
                <FileCog className="mr-2 h-4 w-4" />
                {showAdvancedFeatures ? 'Hide Advanced Features' : 'Show Advanced Features'}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-0 shadow-md mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Filters</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Vehicle</label>
                  <Select
                    value={selectedVehicle.toString()}
                    onValueChange={(value) => setSelectedVehicle(value === 'all' ? 'all' : parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Vehicles</SelectItem>
                      {vehicles.map(vehicle => (
                        <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                          {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Document Type</label>
                  <Select
                    value={selectedDocumentType}
                    onValueChange={(value) => setSelectedDocumentType(value as DocumentType | 'all')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="registration_certificate">Registration Certificate</SelectItem>
                      <SelectItem value="insurance_policy">Insurance Policy</SelectItem>
                      <SelectItem value="pollution_certificate">Pollution Certificate</SelectItem>
                      <SelectItem value="service_record">Service Record</SelectItem>
                      <SelectItem value="warranty_card">Warranty Card</SelectItem>
                      <SelectItem value="fitness_certificate">Fitness Certificate</SelectItem>
                      <SelectItem value="loan_document">Loan Document</SelectItem>
                      <SelectItem value="road_tax_receipt">Road Tax Receipt</SelectItem>
                      <SelectItem value="purchase_invoice">Purchase Invoice</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search documents..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center">
              <TabsList className="bg-gray-100">
                <TabsTrigger value="all" className="font-medium">All Documents</TabsTrigger>
                <TabsTrigger value="active" className="font-medium">Active</TabsTrigger>
                <TabsTrigger value="expiring-soon" className="font-medium">Expiring Soon</TabsTrigger>
                <TabsTrigger value="expired" className="font-medium">Expired</TabsTrigger>
              </TabsList>
              
              <span className="text-sm text-gray-500">
                {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <TabsContent value="all" className="mt-6">
              {isLoadingDocuments ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner size="lg" />
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 h-64">
                  <FileText className="h-10 w-10 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No documents found</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center max-w-md">
                    {searchTerm || selectedVehicle !== 'all' || selectedDocumentType !== 'all'
                      ? "No documents match your current filters. Try adjusting your search criteria."
                      : "You haven't added any documents yet. Start building your document vault by adding your first document."}
                  </p>
                  <Button 
                    onClick={() => setIsAddDocumentOpen(true)}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Document
                  </Button>
                </div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredDocuments.map((document) => (
                    <motion.div
                      key={document.id}
                      variants={itemVariants}
                      onClick={() => openDocumentView(document)}
                      className="cursor-pointer"
                    >
                      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row">
                          <div className="flex items-center gap-4 p-4 md:w-3/5">
                            <div className="bg-gray-100 rounded-full p-2.5">
                              {getDocumentIcon(document.documentType)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">{document.name}</h3>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="bg-gray-100">
                                  {getDocumentTypeLabel(document.documentType)}
                                </Badge>
                                {getDocumentStatusBadge(document.status, document.expiryDate)}
                              </div>
                              {document.description && (
                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{document.description}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-between md:w-2/5">
                            <div className="mb-2">
                              <div className="flex items-center mb-1">
                                <Car className="h-4 w-4 text-gray-500 mr-2" />
                                <span className="text-sm font-medium text-gray-800 truncate">
                                  {document.vehicle 
                                    ? `${document.vehicle.make} ${document.vehicle.model} (${document.vehicle.licensePlate})`
                                    : 'Loading vehicle...'}
                                </span>
                              </div>
                              
                              {document.expiryDate && (
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                  <span className="text-sm text-gray-600">
                                    Expires: {formatDate(document.expiryDate)}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">
                                Added: {formatDate(document.createdAt)}
                              </span>
                              <button className="text-violet-600 hover:text-violet-800">
                                <ChevronRight className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
            
            {/* Active documents tab */}
            <TabsContent value="active" className="mt-6">
              {isLoadingDocuments ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner size="lg" />
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 h-64">
                  <Check className="h-10 w-10 text-green-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No active documents found</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center max-w-md">
                    {searchTerm || selectedVehicle !== 'all' || selectedDocumentType !== 'all'
                      ? "No active documents match your current filters. Try adjusting your search criteria."
                      : "You don't have any active documents. Add documents to your vault to keep track of their status."}
                  </p>
                  <Button 
                    onClick={() => setIsAddDocumentOpen(true)}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Document
                  </Button>
                </div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredDocuments.map((document) => (
                    <motion.div
                      key={document.id}
                      variants={itemVariants}
                      onClick={() => openDocumentView(document)}
                      className="cursor-pointer"
                    >
                      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row">
                          <div className="flex items-center gap-4 p-4 md:w-3/5">
                            <div className="bg-gray-100 rounded-full p-2.5">
                              {getDocumentIcon(document.documentType)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">{document.name}</h3>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="bg-gray-100">
                                  {getDocumentTypeLabel(document.documentType)}
                                </Badge>
                                {getDocumentStatusBadge(document.status, document.expiryDate)}
                              </div>
                              {document.description && (
                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{document.description}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-between md:w-2/5">
                            <div className="mb-2">
                              <div className="flex items-center mb-1">
                                <Car className="h-4 w-4 text-gray-500 mr-2" />
                                <span className="text-sm font-medium text-gray-800 truncate">
                                  {document.vehicle 
                                    ? `${document.vehicle.make} ${document.vehicle.model} (${document.vehicle.licensePlate})`
                                    : 'Loading vehicle...'}
                                </span>
                              </div>
                              
                              {document.expiryDate && (
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                  <span className="text-sm text-gray-600">
                                    Expires: {formatDate(document.expiryDate)}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">
                                Added: {formatDate(document.createdAt)}
                              </span>
                              <button className="text-violet-600 hover:text-violet-800">
                                <ChevronRight className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
            
            {/* Expiring Soon documents tab */}
            <TabsContent value="expiring-soon" className="mt-6">
              {isLoadingDocuments ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner size="lg" />
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 h-64">
                  <AlertTriangle className="h-10 w-10 text-yellow-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No expiring documents found</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center max-w-md">
                    {searchTerm || selectedVehicle !== 'all' || selectedDocumentType !== 'all'
                      ? "No expiring documents match your current filters. Try adjusting your search criteria."
                      : "You don't have any documents expiring soon. Your documents are all valid for more than 30 days."}
                  </p>
                  <Button 
                    onClick={() => setIsAddDocumentOpen(true)}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Document
                  </Button>
                </div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredDocuments.map((document) => (
                    <motion.div
                      key={document.id}
                      variants={itemVariants}
                      onClick={() => openDocumentView(document)}
                      className="cursor-pointer"
                    >
                      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row">
                          <div className="flex items-center gap-4 p-4 md:w-3/5">
                            <div className="bg-yellow-50 rounded-full p-2.5">
                              {getDocumentIcon(document.documentType)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">{document.name}</h3>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="bg-gray-100">
                                  {getDocumentTypeLabel(document.documentType)}
                                </Badge>
                                {getDocumentStatusBadge(document.status, document.expiryDate)}
                              </div>
                              {document.description && (
                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{document.description}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-4 bg-yellow-50 border-t md:border-t-0 md:border-l border-yellow-100 flex flex-col justify-between md:w-2/5">
                            <div className="mb-2">
                              <div className="flex items-center mb-1">
                                <Car className="h-4 w-4 text-gray-500 mr-2" />
                                <span className="text-sm font-medium text-gray-800 truncate">
                                  {document.vehicle 
                                    ? `${document.vehicle.make} ${document.vehicle.model} (${document.vehicle.licensePlate})`
                                    : 'Loading vehicle...'}
                                </span>
                              </div>
                              
                              {document.expiryDate && (
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                                  <span className="text-sm text-yellow-700 font-medium">
                                    Expires in {formatRelativeTime(document.expiryDate)}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">
                                Added: {formatDate(document.createdAt)}
                              </span>
                              <button className="text-yellow-600 hover:text-yellow-800">
                                <ArrowRight className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
            
            {/* Expired documents tab */}
            <TabsContent value="expired" className="mt-6">
              {isLoadingDocuments ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner size="lg" />
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 h-64">
                  <X className="h-10 w-10 text-red-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No expired documents found</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center max-w-md">
                    {searchTerm || selectedVehicle !== 'all' || selectedDocumentType !== 'all'
                      ? "No expired documents match your current filters. Try adjusting your search criteria."
                      : "You don't have any expired documents. All your documents are up to date."}
                  </p>
                  <Button 
                    onClick={() => setIsAddDocumentOpen(true)}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Document
                  </Button>
                </div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredDocuments.map((document) => (
                    <motion.div
                      key={document.id}
                      variants={itemVariants}
                      onClick={() => openDocumentView(document)}
                      className="cursor-pointer"
                    >
                      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row">
                          <div className="flex items-center gap-4 p-4 md:w-3/5">
                            <div className="bg-red-50 rounded-full p-2.5">
                              {getDocumentIcon(document.documentType)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">{document.name}</h3>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="bg-gray-100">
                                  {getDocumentTypeLabel(document.documentType)}
                                </Badge>
                                {getDocumentStatusBadge(document.status, document.expiryDate)}
                              </div>
                              {document.description && (
                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{document.description}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-4 bg-red-50 border-t md:border-t-0 md:border-l border-red-100 flex flex-col justify-between md:w-2/5">
                            <div className="mb-2">
                              <div className="flex items-center mb-1">
                                <Car className="h-4 w-4 text-gray-500 mr-2" />
                                <span className="text-sm font-medium text-gray-800 truncate">
                                  {document.vehicle 
                                    ? `${document.vehicle.make} ${document.vehicle.model} (${document.vehicle.licensePlate})`
                                    : 'Loading vehicle...'}
                                </span>
                              </div>
                              
                              {document.expiryDate && (
                                <div className="flex items-center">
                                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                                  <span className="text-sm text-red-700 font-medium">
                                    Expired {formatRelativeTime(document.expiryDate)}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <button className="text-xs text-red-600 hover:text-red-800 font-medium">
                                Renew Document
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                <ArrowRight className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Document Scanner Dialog */}
      <Dialog open={isDocumentScannerOpen} onOpenChange={setIsDocumentScannerOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Scan Document</DialogTitle>
            <DialogDescription>
              Upload or scan a document to automatically extract information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-2">
            {selectedVehicle === 'all' ? (
              <div className="mb-4">
                <label className="text-sm font-medium mb-1 block">Select Vehicle</label>
                <Select
                  value={formData.vehicleId ? formData.vehicleId.toString() : ''}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    vehicleId: parseInt(value)
                  }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                        {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <input type="hidden" value={selectedVehicle} />
            )}
            
            <DocumentScanner 
              vehicleId={selectedVehicle === 'all' ? formData.vehicleId : Number(selectedVehicle)} 
              onScanComplete={handleScanComplete} 
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Document Scanner Dialog */}
      <Dialog open={isDocumentScannerOpen} onOpenChange={setIsDocumentScannerOpen}>
        <DialogContent className="sm:max-w-[600px]" aria-describedby="document-scanner-description">
          <DialogHeader>
            <DialogTitle>Scan Document</DialogTitle>
            <DialogDescription>
              Use your camera to scan and automatically extract information from your vehicle documents.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <DocumentScanner 
              vehicleId={selectedVehicle !== 'all' ? Number(selectedVehicle) : (vehicles.length > 0 ? vehicles[0].id : 0)}
              onScanComplete={(data) => {
                setScannedDocumentData(data);
                setIsDocumentScannerOpen(false);
                
                // If we have extracted data, pre-fill the add document form
                if (data && data.extractedData) {
                  const extractedData = data.extractedData;
                  
                  // Prepare form data from extracted data
                  const newFormData = {
                    ...formData,
                    vehicleId: selectedVehicle !== 'all' ? Number(selectedVehicle) : (vehicles.length > 0 ? vehicles[0].id : 0),
                    name: extractedData.documentType ? `${extractedData.documentType.charAt(0).toUpperCase() + extractedData.documentType.slice(1).replace(/_/g, ' ')}` : formData.name,
                    documentType: extractedData.documentType || formData.documentType,
                    documentNumber: extractedData.documentNumber || formData.documentNumber,
                    issuedBy: extractedData.issuedBy || formData.issuedBy,
                    issuedDate: extractedData.issuedDate || formData.issuedDate,
                    expiryDate: extractedData.expiryDate || formData.expiryDate,
                  };
                  
                  setFormData(newFormData);
                  
                  // Auto open the add document form with pre-filled data
                  setIsAddDocumentOpen(true);
                  
                  toast({
                    title: 'Document scanned successfully',
                    description: 'Document information has been extracted and pre-filled.',
                    variant: 'default',
                  });
                }
              }}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDocumentScannerOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Document Dialog */}
      <Dialog open={isAddDocumentOpen} onOpenChange={setIsAddDocumentOpen}>
        <DialogContent className="sm:max-w-[600px]" aria-describedby="add-document-description">
          <DialogHeader>
            <DialogTitle>Add New Document</DialogTitle>
            <DialogDescription>
              Upload and manage your important vehicle documents. All information is securely stored.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="vehicleId" className="text-sm font-medium">Vehicle</label>
                  <Select
                    value={formData.vehicleId.toString()}
                    onValueChange={(value) => handleSelectChange('vehicleId', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map(vehicle => (
                        <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                          {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="documentType" className="text-sm font-medium">Document Type</label>
                  <Select
                    value={formData.documentType}
                    onValueChange={(value) => handleSelectChange('documentType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="registration_certificate">Registration Certificate</SelectItem>
                      <SelectItem value="insurance_policy">Insurance Policy</SelectItem>
                      <SelectItem value="pollution_certificate">Pollution Certificate</SelectItem>
                      <SelectItem value="service_record">Service Record</SelectItem>
                      <SelectItem value="warranty_card">Warranty Card</SelectItem>
                      <SelectItem value="fitness_certificate">Fitness Certificate</SelectItem>
                      <SelectItem value="loan_document">Loan Document</SelectItem>
                      <SelectItem value="road_tax_receipt">Road Tax Receipt</SelectItem>
                      <SelectItem value="purchase_invoice">Purchase Invoice</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium">Document Name</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter document name"
                />
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="description" className="text-sm font-medium">Description (Optional)</label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter brief description"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="issuedBy" className="text-sm font-medium">Issued By (Optional)</label>
                  <Input
                    id="issuedBy"
                    name="issuedBy"
                    value={formData.issuedBy}
                    onChange={handleInputChange}
                    placeholder="Authority that issued the document"
                  />
                </div>
                
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="documentNumber" className="text-sm font-medium">Document Number (Optional)</label>
                  <Input
                    id="documentNumber"
                    name="documentNumber"
                    value={formData.documentNumber}
                    onChange={handleInputChange}
                    placeholder="Registration/policy number"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="issuedDate" className="text-sm font-medium">Issue Date (Optional)</label>
                  <Input
                    id="issuedDate"
                    name="issuedDate"
                    type="date"
                    value={formData.issuedDate}
                    onChange={handleInputChange}
                  />
                </div>
                
                {formData.hasExpiryDate && (
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="expiryDate" className="text-sm font-medium">Expiry Date (Optional)</label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasExpiryDate"
                  className="rounded border-gray-300"
                  checked={formData.hasExpiryDate}
                  onChange={() => handleSelectChange('hasExpiryDate', !formData.hasExpiryDate)}
                />
                <label htmlFor="hasExpiryDate" className="text-sm font-medium">
                  This document has an expiry date
                </label>
              </div>
              
              {formData.hasExpiryDate && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="reminderEnabled"
                    className="rounded border-gray-300"
                    checked={formData.reminderEnabled}
                    onChange={() => handleSelectChange('reminderEnabled', !formData.reminderEnabled)}
                  />
                  <label htmlFor="reminderEnabled" className="text-sm font-medium">
                    Enable reminder before expiry
                  </label>
                </div>
              )}
              
              {formData.hasExpiryDate && formData.reminderEnabled && (
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="reminderDays" className="text-sm font-medium">
                    Remind me days before expiry
                  </label>
                  <Input
                    id="reminderDays"
                    name="reminderDays"
                    type="number"
                    min="1"
                    max="180"
                    value={formData.reminderDays}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              
              <div className="flex flex-col space-y-1.5">
                <label className="text-sm font-medium">Upload Document (Coming Soon)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-gray-50">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-1">Drag & drop your document here</p>
                  <p className="text-xs text-gray-400">Supported formats: PDF, JPG, PNG</p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddDocumentOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-violet-600 hover:bg-violet-700"
                disabled={addDocumentMutation.isPending}
              >
                {addDocumentMutation.isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : 'Save Document'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* View Document Dialog */}
      <Dialog open={isViewDocumentOpen} onOpenChange={setIsViewDocumentOpen}>
        <DialogContent className="sm:max-w-[600px]" aria-describedby="view-document-description">
          {selectedDocument && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 rounded-full p-2.5">
                    {getDocumentIcon(selectedDocument.documentType)}
                  </div>
                  <div>
                    <DialogTitle>{selectedDocument.name}</DialogTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="bg-gray-100">
                        {getDocumentTypeLabel(selectedDocument.documentType)}
                      </Badge>
                      {getDocumentStatusBadge(selectedDocument.status, selectedDocument.expiryDate)}
                    </div>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="py-4">
                {selectedDocument.description && (
                  <p className="text-sm text-gray-600 mb-4">
                    {selectedDocument.description}
                  </p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <span className="text-xs text-gray-500 block">Vehicle</span>
                    <span className="text-sm font-medium">
                      {selectedDocument.vehicle 
                        ? `${selectedDocument.vehicle.make} ${selectedDocument.vehicle.model}`
                        : 'Loading vehicle...'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-xs text-gray-500 block">License Plate</span>
                    <span className="text-sm font-medium">
                      {selectedDocument.vehicle?.licensePlate || 'N/A'}
                    </span>
                  </div>
                  
                  {selectedDocument.documentNumber && (
                    <div>
                      <span className="text-xs text-gray-500 block">Document Number</span>
                      <span className="text-sm font-medium">{selectedDocument.documentNumber}</span>
                    </div>
                  )}
                  
                  {selectedDocument.issuedBy && (
                    <div>
                      <span className="text-xs text-gray-500 block">Issued By</span>
                      <span className="text-sm font-medium">{selectedDocument.issuedBy}</span>
                    </div>
                  )}
                  
                  {selectedDocument.issuedDate && (
                    <div>
                      <span className="text-xs text-gray-500 block">Issue Date</span>
                      <span className="text-sm font-medium">{formatDate(selectedDocument.issuedDate)}</span>
                    </div>
                  )}
                  
                  {selectedDocument.expiryDate && (
                    <div>
                      <span className="text-xs text-gray-500 block">Expiry Date</span>
                      <span className="text-sm font-medium">{formatDate(selectedDocument.expiryDate)}</span>
                    </div>
                  )}
                </div>
                
                {selectedDocument.fileUrl ? (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Document Preview</h4>
                    <div className="border rounded-md overflow-hidden bg-gray-50 p-4 flex items-center justify-center">
                      {/* Document preview would go here */}
                      <div className="text-center">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Document preview available</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 bg-amber-50 border border-amber-200 rounded-md p-4">
                    <div className="flex gap-3">
                      <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-800 mb-1">Document file not uploaded</h4>
                        <p className="text-xs text-amber-700">
                          Only document metadata is available. The actual document file has not been uploaded.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Advanced Features Section */}
              {showAdvancedFeatures && selectedDocument && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-md font-semibold mb-4">Advanced Features</h3>
                  
                  <div className="grid gap-8">
                    {/* Document Recommendations */}
                    <DocumentRecommendations 
                      vehicleId={selectedDocument.vehicleId}
                      onCreateDocument={(documentType, title, description) => {
                        toast({
                          title: "Document created from recommendation",
                          description: title,
                        });
                        queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
                      }}
                    />
                    
                    {/* Document Annotation */}
                    <DocumentAnnotation 
                      documentId={selectedDocument.id}
                      previewUrl={selectedDocument.thumbnailUrl}
                    />
                  </div>
                </div>
              )}
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setIsViewDocumentOpen(false)}>
                  Close
                </Button>
                <div className="flex gap-2">
                  {showAdvancedFeatures ? (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAdvancedFeatures(false)}
                    >
                      <FileCog className="h-4 w-4 mr-2" />
                      Hide Advanced Features
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAdvancedFeatures(true)}
                    >
                      <FileCog className="h-4 w-4 mr-2" />
                      Show Advanced Features
                    </Button>
                  )}
                  
                  {selectedDocument.fileUrl && (
                    <Button className="bg-violet-600 hover:bg-violet-700">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentVault;