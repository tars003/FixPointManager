import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommunityIntegration from '@/components/service-booking/community-integration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useInView, animate } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, Calendar, ChevronDown, Download, Share, Award,
  Gauge, Settings, Clock, BookOpen, Users, Trophy,
  Car, FileText, HeartPulse, Shield, FileImage, BarChart3,
  PieChart, TrendingUp, TrendingDown, Star, BoxSelect, Brain,
  Battery, Leaf, Droplets, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight,
  AlertTriangle, Activity, Info, Zap, BadgeCheck, Wrench, X, PlusCircle,
  AlertCircle, ThumbsUp, ShoppingBag, RefreshCw, Warehouse, AlertOctagon,
  Building2, KeyRound, Tag, CheckCircle, Scale, Trash2, FileX,
  Plus, Edit, Eye, Calendar as CalendarIcon, Clock as CalendarClock,
  Smartphone as SmartphoneNfc, Receipt, CalendarCheck,
  Fuel, Route, User as UserCircle, UserCog, CreditCard, Truck,
  Filter as FilterX, CheckCircle as CheckCircle2, MapPin, HelpCircle as FileQuestion,
  FileCheck, Circle, ClipboardCheck, PhoneCall, Image as ImageIcon, 
  History, IndianRupee, ChevronsDown, MessageSquare, ShieldCheck,
  Share2, FileEdit, ListChecks
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// Import our components
import VehicleCarousel from '@/components/vehicle-vault/VehicleCarousel';
import VehicleDetailAnalysis from '@/components/vehicle-vault/VehicleDetailAnalysis';
import VehicleCategorySelector from '@/components/vehicle-vault/VehicleCategorySelector';
import VehicleMoodIndicator from '@/components/vehicle-vault/VehicleMoodIndicator';
import VehicleStoryCard from '@/components/vehicle-vault/VehicleStoryCard';
import VehicleDashboardCard from '@/components/vehicle-vault/VehicleDashboardCard';
import ColorAdaptiveUI from '@/components/vehicle-vault/ColorAdaptiveUI';
import QuickActionMenu from '@/components/vehicle-vault/QuickActionMenu';
import ContextualHelpTooltip from '@/components/vehicle-vault/ContextualHelpTooltip';
import InteractiveDataPoint from '@/components/vehicle-vault/InteractiveDataPoint';
import AnimatedStatusTransition from '@/components/vehicle-vault/AnimatedStatusTransition';

// Define Vehicle type to match our vehicleData props
type Vehicle = {
  id: number;
  vehicle: string;
  worth: number; 
  percentage: number;
  image: string;
  mileage: number;
  fuelType: string;
  batteryHealth?: number;
  engineHealth?: number;
  lastService: string;
  nextService: string;
  purchaseDate: string;
  insuranceValid: string;
  maintenanceCost: number;
  efficiency: string;
  averageCharge?: string;
  averageFuel?: string;
  range?: string;
  carbonOffset?: string;
  topSpeed?: string;
  emissionRating?: string;
  registrationNumber: string;
  chassisNumber: string;
  engineNumber: string;
  owner: string;
  rcExpiryDate: string;
  
  // Pre-Owned specific fields
  previousOwners?: number;
  purchaseType?: string;
  certifiedBy?: string;
  odometerReading?: number;
  historyReport?: string;
  
  // In Maintenance specific fields
  maintenanceType?: string;
  serviceCenter?: string;
  estimatedCompletion?: string;
  maintenanceNotes?: string;
  
  // Garage Stored specific fields
  storageLocation?: string;
  storageStartDate?: string;
  storageDuration?: string;
  storageType?: string;
  storageConditions?: string;
  storageCost?: string;
  coverType?: string;
  
  // Out of Service specific fields
  issueDescription?: string;
  estimatedRepairCost?: string;
  serviceHistory?: string;
  condition?: string;
  lastOperationalDate?: string;
  parkedLocation?: string;
  disposalPlan?: string;
  
  // Commercial Fleet specific fields
  fleetID?: string;
  driver?: string;
  driverLicense?: string;
  driverContact?: string;
  routeAssignment?: string;
  loadCapacity?: string;
  dailyRunningCost?: string;
  commercialPermit?: string;
  gpsTrackingID?: string;
  
  // Leased Out specific fields
  leaseStartDate?: string;
  leaseDuration?: string;
  leasedTo?: string;
  leaseAmount?: string;
  leaseTerms?: string;
  kmLimit?: string;
  securityDeposit?: string;
  leaseAgreementNo?: string;
  
  // For Sale specific fields
  listingDate?: string;
  askingPrice?: string;
  negotiable?: boolean;
  sellingReason?: string;
  advertisedOn?: string;
  viewingLocation?: string;
  sellerContact?: string;
  documentStatus?: string;
};

// Extended vehicle data with more details
const vehicleData = [
  { 
    id: 1,
    vehicle: 'Tata Nexon EV', 
    worth: 892500, 
    percentage: 67,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Tata/Nexon-EV/9779/1673939319612/front-left-side-47.jpg',
    mileage: 15200,
    fuelType: 'Electric',
    batteryHealth: 93,
    lastService: '2 months ago',
    nextService: '4 months',
    purchaseDate: 'Jun 15, 2023',
    insuranceValid: 'May 2025',
    maintenanceCost: 12500,
    efficiency: '88%',
    averageCharge: '35 kWh',
    range: '312 km',
    carbonOffset: '2.4 tonnes',
    registrationNumber: 'MH 01 AB 1234',
    chassisNumber: 'TNEJ3498323CNEX',
    engineNumber: 'EV77123NX',
    owner: 'Raj Kumar',
    rcExpiryDate: 'May 15, 2028'
  },
  { 
    id: 2,
    vehicle: 'Honda City', 
    worth: 375000, 
    percentage: 28,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/City/9710/1677914238296/front-left-side-47.jpg',
    mileage: 45700,
    fuelType: 'Petrol',
    engineHealth: 87,
    lastService: '2 weeks ago',
    nextService: '3 months',
    purchaseDate: 'Aug 21, 2019',
    insuranceValid: 'Jul 2025',
    maintenanceCost: 38500,
    efficiency: '16.5 km/l',
    averageFuel: '5.2 l/100km',
    topSpeed: '185 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'DL 8C AB 3921',
    chassisNumber: 'HONC4723984CTY',
    engineNumber: 'PE239874HC',
    owner: 'Anjali Singh',
    rcExpiryDate: 'Jul 20, 2029'
  },
  { 
    id: 3,
    vehicle: 'TVS iQube', 
    worth: 73500, 
    percentage: 5,
    image: 'https://bd.gaadicdn.com/processedimages/tvs/iqube/source/iqube62edf2890fdfa.jpg',
    mileage: 1200,
    fuelType: 'Electric',
    batteryHealth: 98,
    lastService: 'None',
    nextService: '2 months',
    purchaseDate: 'Aug 05, 2023',
    insuranceValid: 'Aug 2026',
    maintenanceCost: 2500,
    efficiency: '95%',
    averageCharge: '2.8 kWh',
    range: '85 km',
    carbonOffset: '0.3 tonnes',
    registrationNumber: 'KA 01 MJ 9023',
    chassisNumber: 'TVS23487234IQB',
    engineNumber: 'ETV98712',
    owner: 'Sunil Patel',
    rcExpiryDate: 'Aug 04, 2028'
  },
  { 
    id: 4,
    vehicle: 'Mahindra XUV700', 
    worth: 1250000, 
    percentage: 82,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Mahindra/XUV700/10798/1690452411429/front-left-side-47.jpg',
    mileage: 8500,
    fuelType: 'Diesel',
    engineHealth: 96,
    lastService: '1 month ago',
    nextService: '5 months',
    purchaseDate: 'Jan 10, 2023',
    insuranceValid: 'Dec 2026',
    maintenanceCost: 15000,
    efficiency: '14.3 km/l',
    averageFuel: '7.0 l/100km',
    topSpeed: '200 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'UP 32 BT 5687',
    chassisNumber: 'MHXXUV7002384753',
    engineNumber: 'DZ15893XUV',
    owner: 'Vikram Rathore',
    rcExpiryDate: 'Jan 09, 2033'
  },
  { 
    id: 5,
    vehicle: 'Royal Enfield Classic 350', 
    worth: 190000, 
    percentage: 38,
    image: 'https://bd.gaadicdn.com/processedimages/royal-enfield/classic-350/source/classic-35062f3b48bfe873.jpg',
    mileage: 22500,
    fuelType: 'Petrol',
    engineHealth: 90,
    lastService: '3 months ago',
    nextService: '1 month',
    purchaseDate: 'Mar 18, 2021',
    insuranceValid: 'Feb 2025',
    maintenanceCost: 18500,
    efficiency: '35 km/l',
    averageFuel: '2.9 l/100km',
    topSpeed: '120 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'TN 75 AQ 4523',
    chassisNumber: 'RE350CL23784952',
    engineNumber: 'CL35089234',
    owner: 'Karthik Narayanan',
    rcExpiryDate: 'Mar 17, 2031'
  },
  // Recently Purchased Vehicles
  { 
    id: 6,
    vehicle: 'Bajaj Chetak Electric', 
    worth: 142000, 
    percentage: 98,
    image: 'https://bd.gaadicdn.com/processedimages/bajaj/chetak-2019/source/chetak-201962ebba5fc1e52.jpg',
    mileage: 120,
    fuelType: 'Electric',
    batteryHealth: 100,
    lastService: 'None',
    nextService: '3 months',
    purchaseDate: 'Apr 10, 2025', // Recently purchased (current date is April 2025)
    insuranceValid: 'Apr 2028',
    maintenanceCost: 0,
    efficiency: '99%',
    averageCharge: '2.1 kWh',
    range: '95 km',
    carbonOffset: '0.1 tonnes',
    registrationNumber: 'Registration in progress',
    chassisNumber: 'BCH20250410TRE',
    engineNumber: 'ECH25041078',
    owner: 'Divya Sharma',
    rcExpiryDate: 'Pending'
  },
  { 
    id: 7,
    vehicle: 'Piaggio Ape E-City', 
    worth: 335000, 
    percentage: 99,
    image: 'https://bd.gaadicdn.com/processedimages/piaggio/ape-e-city/source/ape-e-city625906a6aefa9.jpg',
    mileage: 240,
    fuelType: 'Electric',
    batteryHealth: 100,
    lastService: 'None',
    nextService: '6 months',
    purchaseDate: 'Mar 22, 2025', // Recently purchased
    insuranceValid: 'Mar 2028',
    maintenanceCost: 0,
    efficiency: '97%',
    averageCharge: '4.5 kWh',
    range: '110 km',
    carbonOffset: '0.3 tonnes',
    registrationNumber: 'DL 02 CD 3456',
    chassisNumber: 'PIAE250322CIT',
    engineNumber: 'API2503223WE',
    owner: 'Rakesh Patel Transport',
    rcExpiryDate: 'Mar 21, 2035'
  },
  { 
    id: 8,
    vehicle: 'Skoda Slavia', 
    worth: 1250000, 
    percentage: 97,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Skoda/Slavia/9218/1645698138797/front-left-side-47.jpg',
    mileage: 350,
    fuelType: 'Petrol',
    engineHealth: 100,
    lastService: 'PDI Completed',
    nextService: '6 months',
    purchaseDate: 'Feb 15, 2025', // Recently purchased
    insuranceValid: 'Feb 2028',
    maintenanceCost: 0,
    efficiency: '18.0 km/l',
    averageFuel: '5.5 l/100km',
    topSpeed: '195 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'MH 12 FG 7654',
    chassisNumber: 'SKSL2502155HT',
    engineNumber: 'SL25021512YG',
    owner: 'Arjun Menon',
    rcExpiryDate: 'Feb 14, 2035'
  },
  { 
    id: 9,
    vehicle: 'Tata Intra V50', 
    worth: 820000, 
    percentage: 99,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Tata/Intra-V50/7376/1684224761578/front-left-side-47.jpg',
    mileage: 185,
    fuelType: 'Diesel',
    engineHealth: 100,
    lastService: 'PDI Completed',
    nextService: '3 months',
    purchaseDate: 'Mar 30, 2025', // Recently purchased
    insuranceValid: 'Mar 2028',
    maintenanceCost: 0,
    efficiency: '19.3 km/l',
    averageFuel: '5.2 l/100km',
    topSpeed: '110 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'GJ 01 XY 9087',
    chassisNumber: 'TINTV250330CM',
    engineNumber: 'INV25033089T',
    owner: 'Krishna Logistics Ltd',
    rcExpiryDate: 'Mar 29, 2035'
  },
  { 
    id: 10,
    vehicle: 'Ashok Leyland Partner', 
    worth: 1750000, 
    percentage: 100,
    image: 'https://5.imimg.com/data5/ANDROID/Default/2020/10/WK/PJ/CF/15239911/product-jpeg-500x500.jpg',
    mileage: 90,
    fuelType: 'Diesel',
    engineHealth: 100,
    lastService: 'None',
    nextService: '3 months',
    purchaseDate: 'Apr 02, 2025', // Recently purchased
    insuranceValid: 'Apr 2028',
    maintenanceCost: 0,
    efficiency: '10.5 km/l',
    averageFuel: '9.5 l/100km',
    topSpeed: '90 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'Registration in progress',
    chassisNumber: 'ALPT25040258K',
    engineNumber: 'APT2504029XZ',
    owner: 'Fast Delivery Services',
    rcExpiryDate: 'Pending'
  },
  // Pre-Owned Vehicles
  { 
    id: 11,
    vehicle: 'Honda Activa 6G', 
    worth: 58000, 
    percentage: 45,
    image: 'https://bd.gaadicdn.com/processedimages/honda/activa-6g/source/activa-6g6424ea6abe1f6.jpg',
    mileage: 12500,
    fuelType: 'Petrol',
    engineHealth: 88,
    lastService: '2 months ago',
    nextService: '1 month',
    purchaseDate: 'Jan 20, 2024', // Pre-owned
    insuranceValid: 'Dec 2025',
    maintenanceCost: 3500,
    efficiency: '45 km/l',
    averageFuel: '2.2 l/100km',
    topSpeed: '85 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'HR 26 AB 3214',
    chassisNumber: 'HACT24012078G',
    engineNumber: 'AC24G012078',
    owner: 'Preeti Sharma',
    rcExpiryDate: 'Jan 19, 2034',
    previousOwners: 1,
    purchaseType: 'Pre-Owned',
    certifiedBy: 'Honda Certified Pre-Owned',
    odometerReading: 12500,
    historyReport: 'Available'
  },
  { 
    id: 12,
    vehicle: 'Mahindra Supro Mini Truck', 
    worth: 385000, 
    percentage: 62,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Mahindra/Supro-Minitruck/7196/1631177351344/front-left-side-47.jpg',
    mileage: 38500,
    fuelType: 'Diesel',
    engineHealth: 86,
    lastService: '1 month ago',
    nextService: '2 months',
    purchaseDate: 'Aug 10, 2023', // Pre-owned
    insuranceValid: 'Aug 2025',
    maintenanceCost: 12000,
    efficiency: '18.5 km/l',
    averageFuel: '5.4 l/100km',
    topSpeed: '90 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'UP 16 CD 7821',
    chassisNumber: 'MSUP23081022K',
    engineNumber: 'SUP23810WV9',
    owner: 'Rajeev Transport Co.',
    rcExpiryDate: 'Aug 09, 2033',
    previousOwners: 2,
    purchaseType: 'Pre-Owned Commercial',
    certifiedBy: 'Mahindra First Choice',
    odometerReading: 38500,
    historyReport: 'Available'
  },
  { 
    id: 13,
    vehicle: 'Maruti Suzuki Swift', 
    worth: 525000, 
    percentage: 56,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Maruti/Swift/9211/1675862859468/front-left-side-47.jpg',
    mileage: 19800,
    fuelType: 'Petrol',
    engineHealth: 90,
    lastService: '3 months ago',
    nextService: '1 month',
    purchaseDate: 'Dec 5, 2023', // Pre-owned
    insuranceValid: 'Nov 2025',
    maintenanceCost: 8500,
    efficiency: '22.5 km/l',
    averageFuel: '4.4 l/100km',
    topSpeed: '165 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'MH 04 FG 9023',
    chassisNumber: 'MSW23120599P',
    engineNumber: 'SW2312051HJ',
    owner: 'Sanjay Desai',
    rcExpiryDate: 'Dec 4, 2033',
    previousOwners: 1,
    purchaseType: 'Pre-Owned',
    certifiedBy: 'Maruti True Value',
    odometerReading: 19800,
    historyReport: 'Available'
  },
  // In Maintenance Vehicles
  { 
    id: 14,
    vehicle: 'Tata Tiago', 
    worth: 435000, 
    percentage: 40,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Tata/Tiago/7339/Tata-Tiago-XT-iCNG/1676702032361/front-left-side-47.jpg',
    mileage: 42500,
    fuelType: 'Petrol',
    engineHealth: 75,
    lastService: 'In progress',
    nextService: 'N/A',
    purchaseDate: 'Jun 15, 2022',
    insuranceValid: 'Jun 2025',
    maintenanceCost: 22500,
    efficiency: '19.8 km/l',
    averageFuel: '5.0 l/100km',
    topSpeed: '150 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'PB 10 CD 4532',
    chassisNumber: 'TTAG2206156RV',
    engineNumber: 'TG22615JK95',
    owner: 'Manpreet Singh',
    rcExpiryDate: 'Jun 14, 2032',
    maintenanceType: 'Major Service',
    serviceCenter: 'Tata Authorized Service Center',
    estimatedCompletion: 'Apr 30, 2025',
    maintenanceNotes: 'Engine oil leak and transmission issues'
  },
  { 
    id: 15,
    vehicle: 'Hero Splendor+', 
    worth: 62000, 
    percentage: 35,
    image: 'https://bd.gaadicdn.com/processedimages/hero/splendor-plus/source/splendor-plus62e7a6a6a6b17.jpg',
    mileage: 35600,
    fuelType: 'Petrol',
    engineHealth: 70,
    lastService: 'In progress',
    nextService: 'N/A',
    purchaseDate: 'Mar 18, 2023',
    insuranceValid: 'Mar 2026',
    maintenanceCost: 4500,
    efficiency: '65 km/l',
    averageFuel: '1.5 l/100km',
    topSpeed: '90 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'TN 07 AB 5478',
    chassisNumber: 'HSP23031879P',
    engineNumber: 'SP23318C067',
    owner: 'Anand Kumar',
    rcExpiryDate: 'Mar 17, 2033',
    maintenanceType: 'Engine Work',
    serviceCenter: 'Hero Authorized Workshop',
    estimatedCompletion: 'May 1, 2025',
    maintenanceNotes: 'Carburetor adjustment and chain replacement'
  },
  // Garage Stored Vehicles
  { 
    id: 16,
    vehicle: 'Audi R8', 
    worth: 15500000, 
    percentage: 85,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Audi/R8/8249/1681887437801/front-left-side-47.jpg',
    mileage: 6200,
    fuelType: 'Petrol',
    engineHealth: 95,
    lastService: '2 months ago',
    nextService: 'After storage',
    purchaseDate: 'Jun 10, 2022',
    insuranceValid: 'Jun 2025',
    maintenanceCost: 125000,
    efficiency: '7.5 km/l',
    averageFuel: '13.3 l/100km',
    topSpeed: '330 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'DL 01 AW 7890',
    chassisNumber: 'AUDR8220610XYZ',
    engineNumber: 'R822061078V10',
    owner: 'Vikram Malhotra',
    rcExpiryDate: 'Jun 09, 2032',
    storageLocation: 'Premium Auto Storage, Gurugram',
    storageStartDate: 'Jan 15, 2025',
    storageDuration: '6 months',
    storageType: 'Climate Controlled',
    storageConditions: 'Temperature: 18-22°C, Humidity: 40-50%',
    storageCost: '35000 per month',
    coverType: 'Custom-fit breathable cover'
  },
  { 
    id: 17,
    vehicle: 'Royal Enfield Continental GT 650', 
    worth: 310000, 
    percentage: 72,
    image: 'https://bd.gaadicdn.com/processedimages/royal-enfield/continental-gt-650/source/continental-gt-65062f3b82ec1c8.jpg',
    mileage: 8500,
    fuelType: 'Petrol',
    engineHealth: 96,
    lastService: 'Before storage',
    nextService: 'After storage',
    purchaseDate: 'Sep 25, 2023',
    insuranceValid: 'Sep 2026',
    maintenanceCost: 15000,
    efficiency: '25 km/l',
    averageFuel: '4.0 l/100km',
    topSpeed: '160 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'MH 02 CV 5432',
    chassisNumber: 'RECT65023925GTX',
    engineNumber: 'GT65023925ENG',
    owner: 'Arjun Sharma',
    rcExpiryDate: 'Sep 24, 2033',
    storageLocation: 'Personal Garage, Mumbai',
    storageStartDate: 'Feb 10, 2025',
    storageDuration: 'Indefinite',
    storageType: 'Garage',
    storageConditions: 'Ambient temperature, covered parking',
    storageCost: '0',
    coverType: 'Royal Enfield branded dust cover'
  },
  // Out of Service Vehicles
  { 
    id: 18,
    vehicle: 'Maruti Suzuki Alto', 
    worth: 125000, 
    percentage: 25,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Maruti/Alto-800/10079/1687342153187/front-left-side-47.jpg',
    mileage: 75600,
    fuelType: 'Petrol',
    engineHealth: 40,
    lastService: '8 months ago',
    nextService: 'Required',
    purchaseDate: 'Apr 12, 2020',
    insuranceValid: 'Apr 2023 (Expired)',
    maintenanceCost: 45000,
    efficiency: '20 km/l',
    averageFuel: '5.0 l/100km',
    topSpeed: '140 km/h',
    emissionRating: 'BS4',
    registrationNumber: 'KA 05 ML 2345',
    chassisNumber: 'MSALT20041267H',
    engineNumber: 'ALT2004126MS',
    owner: 'Rajesh Kumar',
    rcExpiryDate: 'Apr 11, 2030',
    issueDescription: 'Transmission failure, engine knocking',
    estimatedRepairCost: '65000',
    serviceHistory: 'Irregular maintenance',
    condition: 'Poor',
    lastOperationalDate: 'Jan 5, 2025',
    parkedLocation: 'Residence parking lot',
    disposalPlan: 'Considering repair or scrap'
  },
  { 
    id: 19,
    vehicle: 'Yamaha FZ-S', 
    worth: 45000, 
    percentage: 30,
    image: 'https://bd.gaadicdn.com/processedimages/yamaha/fzs-fi-v3/source/fzs-fi-v362f8f2fc7138d.jpg',
    mileage: 52000,
    fuelType: 'Petrol',
    engineHealth: 35,
    lastService: '10 months ago',
    nextService: 'Required',
    purchaseDate: 'Jul 28, 2021',
    insuranceValid: 'Jul 2023 (Expired)',
    maintenanceCost: 12000,
    efficiency: '42 km/l',
    averageFuel: '2.4 l/100km',
    topSpeed: '115 km/h',
    emissionRating: 'BS4',
    registrationNumber: 'UP 14 BR 7891',
    chassisNumber: 'YMFZ21072856Y',
    engineNumber: 'FZ21072856YM',
    owner: 'Vivek Singh',
    rcExpiryDate: 'Jul 27, 2031',
    issueDescription: 'Electrical system failure, starter issues',
    estimatedRepairCost: '18000',
    serviceHistory: 'Regular until 1 year ago',
    condition: 'Fair',
    lastOperationalDate: 'Feb 20, 2025',
    parkedLocation: 'Apartment basement',
    disposalPlan: 'Planning to repair'
  },
  // Commercial Fleet Vehicles
  { 
    id: 20,
    vehicle: 'Tata Ace Gold', 
    worth: 450000, 
    percentage: 65,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Tata/Ace-Gold/7376/1677666481065/front-left-side-47.jpg',
    mileage: 28500,
    fuelType: 'Diesel',
    engineHealth: 82,
    lastService: '45 days ago',
    nextService: '2 months',
    purchaseDate: 'Oct 10, 2023',
    insuranceValid: 'Oct 2026',
    maintenanceCost: 35000,
    efficiency: '16 km/l',
    averageFuel: '6.3 l/100km',
    topSpeed: '80 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'DL 1L CB 2534',
    chassisNumber: 'TACE231010GLD',
    engineNumber: 'ACE2310105G',
    owner: 'Swift Logistics',
    rcExpiryDate: 'Oct 09, 2033',
    fleetID: 'SL-12345',
    driver: 'Kamal Singh',
    driverLicense: 'DL-2309876543',
    driverContact: '9876543210',
    routeAssignment: 'Delhi-Sonipat-Delhi',
    loadCapacity: '710 kg',
    dailyRunningCost: '1,200',
    commercialPermit: 'Valid through Oct 2026',
    gpsTrackingID: 'TRK-SL-2534'
  },
  { 
    id: 21,
    vehicle: 'Tata 407 LPT', 
    worth: 1250000, 
    percentage: 78,
    image: 'https://5.imimg.com/data5/WE/FJ/QL/SELLER-26256295/tata-407-pick-up-truck-500x500.png',
    mileage: 42000,
    fuelType: 'Diesel',
    engineHealth: 88,
    lastService: '25 days ago',
    nextService: '2.5 months',
    purchaseDate: 'May 15, 2023',
    insuranceValid: 'May 2026',
    maintenanceCost: 85000,
    efficiency: '10 km/l',
    averageFuel: '10.0 l/100km',
    topSpeed: '90 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'HR 55 T 9876',
    chassisNumber: 'T407230515LPT',
    engineNumber: '407230515TT',
    owner: 'Galaxy Transport Co.',
    rcExpiryDate: 'May 14, 2033',
    fleetID: 'GT-789012',
    driver: 'Prakash Yadav',
    driverLicense: 'HR-4587691230',
    driverContact: '8765432109',
    routeAssignment: 'Delhi-Jaipur-Delhi',
    loadCapacity: '4 tonnes',
    dailyRunningCost: '3,500',
    commercialPermit: 'Valid through May 2026',
    gpsTrackingID: 'TRK-GT-9876'
  },
  // Leased Out Vehicles
  { 
    id: 22,
    vehicle: 'Hyundai Creta', 
    worth: 1050000, 
    percentage: 70,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/Creta/10544/1689586014142/front-left-side-47.jpg',
    mileage: 18500,
    fuelType: 'Petrol',
    engineHealth: 92,
    lastService: '1 month ago',
    nextService: '4 months',
    purchaseDate: 'Jan 05, 2024',
    insuranceValid: 'Jan 2027',
    maintenanceCost: 18500,
    efficiency: '16.5 km/l',
    averageFuel: '6.1 l/100km',
    topSpeed: '170 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'KA 01 MJ 4567',
    chassisNumber: 'HCRT240105BLU',
    engineNumber: 'CRT24010512',
    owner: 'Horizon Car Rentals',
    rcExpiryDate: 'Jan 04, 2034',
    leaseStartDate: 'Feb 10, 2025',
    leaseDuration: '12 months',
    leasedTo: 'Infosys Ltd.',
    leaseAmount: '28,000 per month',
    leaseTerms: 'Full maintenance included',
    kmLimit: '2,500 km/month',
    securityDeposit: '100,000',
    leaseAgreementNo: 'HCR/L/2025/123'
  },
  { 
    id: 23,
    vehicle: 'Toyota Innova Crysta', 
    worth: 1650000, 
    percentage: 75,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Toyota/Innova-Crysta/9612/1669619170082/front-left-side-47.jpg',
    mileage: 22000,
    fuelType: 'Diesel',
    engineHealth: 94,
    lastService: '2 months ago',
    nextService: '3 months',
    purchaseDate: 'Sep 15, 2023',
    insuranceValid: 'Sep 2026',
    maintenanceCost: 25000,
    efficiency: '13 km/l',
    averageFuel: '7.7 l/100km',
    topSpeed: '190 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'MH 01 TC 7890',
    chassisNumber: 'TICR230915INV',
    engineNumber: 'CR230915TYT',
    owner: 'Supreme Cars',
    rcExpiryDate: 'Sep 14, 2033',
    leaseStartDate: 'Mar 01, 2025',
    leaseDuration: '24 months',
    leasedTo: 'TCS Ltd.',
    leaseAmount: '45,000 per month',
    leaseTerms: 'Maintenance excluded',
    kmLimit: '3,000 km/month',
    securityDeposit: '150,000',
    leaseAgreementNo: 'SC/L/2025/456'
  },
  // For Sale Vehicles
  { 
    id: 24,
    vehicle: 'Honda Amaze', 
    worth: 585000, 
    percentage: 55,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/Amaze/10489/1687857324697/front-left-side-47.jpg',
    mileage: 35000,
    fuelType: 'Petrol',
    engineHealth: 88,
    lastService: '1.5 months ago',
    nextService: '4 months',
    purchaseDate: 'Jul 22, 2022',
    insuranceValid: 'Jul 2025',
    maintenanceCost: 22000,
    efficiency: '18 km/l',
    averageFuel: '5.6 l/100km',
    topSpeed: '160 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'TN 01 AK 6789',
    chassisNumber: 'HAMZ220722AMZ',
    engineNumber: 'AMZ220722HN',
    owner: 'Ravi Chandran',
    rcExpiryDate: 'Jul 21, 2032',
    listingDate: 'Apr 15, 2025',
    askingPrice: '585,000',
    negotiable: true,
    sellingReason: 'Upgrading to SUV',
    advertisedOn: 'FixPoint, Olx, CarTrade',
    viewingLocation: 'Chennai, Tamil Nadu',
    sellerContact: '9876123450',
    documentStatus: 'All clear'
  },
  { 
    id: 25,
    vehicle: 'KTM Duke 390', 
    worth: 240000, 
    percentage: 60,
    image: 'https://bd.gaadicdn.com/processedimages/ktm/duke-390/source/duke-39063e10e9fa61d9.jpg',
    mileage: 15500,
    fuelType: 'Petrol',
    engineHealth: 90,
    lastService: '2 months ago',
    nextService: '4 months',
    purchaseDate: 'Oct 30, 2022',
    insuranceValid: 'Oct 2025',
    maintenanceCost: 12000,
    efficiency: '28 km/l',
    averageFuel: '3.6 l/100km',
    topSpeed: '170 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'KA 03 EB 4321',
    chassisNumber: 'KTM221030DUK',
    engineNumber: 'DUK221030KT',
    owner: 'Karan Mehta',
    rcExpiryDate: 'Oct 29, 2032',
    listingDate: 'Apr 10, 2025',
    askingPrice: '240,000',
    negotiable: true,
    sellingReason: 'Moving abroad',
    advertisedOn: 'FixPoint, BikeWale, OLX',
    viewingLocation: 'Bangalore, Karnataka',
    sellerContact: '8765432198',
    documentStatus: 'All clear'
  },
  
  // Out of Service specific vehicles
  { 
    id: 26,
    vehicle: 'Honda City ZX', 
    worth: 450000, 
    percentage: 35,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/City/9710/1677914238296/front-left-side-47.jpg',
    mileage: 68300,
    fuelType: 'Petrol',
    engineHealth: 40,
    status: 'Out of Service',
    lastService: '8 months ago',
    nextService: 'Suspended',
    purchaseDate: 'Apr 12, 2020',
    insuranceValid: 'Apr 2025',
    maintenanceCost: 85000,
    efficiency: '14.2 km/l',
    averageFuel: '7.0 l/100km',
    topSpeed: '180 km/h',
    emissionRating: 'BS4',
    registrationNumber: 'TN 01 BC 5432',
    chassisNumber: 'HOCIZX2004128SD',
    engineNumber: 'PTZX87541239',
    owner: 'Rajeev Malhotra',
    rcExpiryDate: 'Apr 11, 2030',
    issueDescription: 'Major transmission failure',
    estimatedRepairCost: '₹105,000',
    outOfServiceDate: 'Feb 15, 2025',
    expectedDuration: '3 months',
    parkedLocation: 'Home garage, Chennai',
    declarationStatus: 'Filed',
    insuranceStatus: 'Adjusted',
    diagnosisSummary: 'Complete transmission failure requiring replacement. Vehicle cannot be safely operated.'
  },
  { 
    id: 27,
    vehicle: 'Mahindra Bolero', 
    worth: 380000, 
    percentage: 30,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Mahindra/Bolero/9684/1677912038041/front-left-side-47.jpg',
    mileage: 125800,
    fuelType: 'Diesel',
    engineHealth: 45,
    status: 'Out of Service',
    lastService: '1 year ago',
    nextService: 'Suspended',
    purchaseDate: 'Mar 05, 2018',
    insuranceValid: 'Mar 2025',
    maintenanceCost: 120000,
    efficiency: '12.8 km/l',
    averageFuel: '7.8 l/100km',
    topSpeed: '120 km/h',
    emissionRating: 'BS4',
    registrationNumber: 'MH 43 RT 8910',
    chassisNumber: 'MHBR1803058XT',
    engineNumber: 'DBRO3481269',
    owner: 'Sandeep Construction Co.',
    rcExpiryDate: 'Mar 04, 2028',
    issueDescription: 'Severe engine damage and chassis deformation',
    estimatedRepairCost: '₹185,000',
    outOfServiceDate: 'Jan 10, 2025',
    expectedDuration: 'Indefinite',
    parkedLocation: 'Company warehouse, Pune',
    declarationStatus: 'Pending',
    insuranceStatus: 'Claim Filed',
    diagnosisSummary: 'Engine seized due to coolant system failure. Additional frame damage from work site accident.'
  },
  
  // Garage Stored specific vehicles
  { 
    id: 28,
    vehicle: 'Mercedes-Benz C-Class', 
    worth: 3850000, 
    percentage: 80,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Mercedes-Benz/C-Class/10458/1677914238307/front-left-side-47.jpg',
    mileage: 12400,
    fuelType: 'Petrol',
    engineHealth: 96,
    status: 'Garage Stored',
    lastService: '2 months ago',
    nextService: 'Suspended during storage',
    purchaseDate: 'Aug 18, 2023',
    insuranceValid: 'Aug 2026',
    maintenanceCost: 45000,
    efficiency: '12.5 km/l',
    averageFuel: '8.0 l/100km',
    topSpeed: '250 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'MH 01 ZA 7777',
    chassisNumber: 'MBCL2308187ZXT',
    engineNumber: 'CLMB9834765',
    owner: 'Vikram Mehta',
    rcExpiryDate: 'Aug 17, 2033',
    storageLocation: 'Premium Auto Vault, Mumbai',
    storageStartDate: 'January 15, 2025',
    storageDuration: '12 months',
    storageType: 'Climate Controlled',
    storageConditions: 'Temperature and humidity controlled',
    storageCost: '₹12,500/month',
    coverType: 'Custom-fit breathable cover'
  },
  { 
    id: 29,
    vehicle: 'Porsche 911 Carrera', 
    worth: 16500000, 
    percentage: 95,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Porsche/911/8446/1678693698915/front-left-side-47.jpg',
    mileage: 5800,
    fuelType: 'Petrol',
    engineHealth: 99,
    status: 'Garage Stored',
    lastService: '1 month ago',
    nextService: 'Scheduled after storage',
    purchaseDate: 'Oct 30, 2023',
    insuranceValid: 'Oct 2026',
    maintenanceCost: 180000,
    efficiency: '8.5 km/l',
    averageFuel: '11.8 l/100km',
    topSpeed: '293 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'KA 01 MM 9119',
    chassisNumber: 'POR911CR23XTB9',
    engineNumber: 'CR9118534790',
    owner: 'Shankar Menon',
    rcExpiryDate: 'Oct 29, 2033',
    storageLocation: 'Exclusive Auto Storage, Bangalore',
    storageStartDate: 'February 1, 2025',
    storageDuration: '8 months',
    storageType: 'Premium Storage',
    storageConditions: 'Controlled environment with nitrogen-filled tires',
    storageCost: '₹35,000/month',
    coverType: 'Custom Porsche indoor cover'
  },
  
  // Commercial Fleet specific vehicles
  { 
    id: 30,
    vehicle: 'Tata Ace Gold', 
    worth: 620000, 
    percentage: 75,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Tata/Ace/7460/1677912038033/front-left-side-47.jpg',
    mileage: 25800,
    fuelType: 'Diesel',
    engineHealth: 85,
    status: 'Commercial Fleet',
    lastService: '15 days ago',
    nextService: '3 months',
    purchaseDate: 'Oct 10, 2023',
    insuranceValid: 'Oct 2026',
    maintenanceCost: 28000,
    efficiency: '16 km/l',
    averageFuel: '6.3 l/100km',
    topSpeed: '80 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'DL 1L CB 2534',
    chassisNumber: 'TACE231010GLD',
    engineNumber: 'ACE2310105G',
    owner: 'Swift Logistics',
    rcExpiryDate: 'Oct 09, 2033',
    fleetID: 'SL-12345',
    driver: 'Kamal Singh',
    driverLicense: 'DL-2309876543',
    driverContact: '9876543210',
    routeAssignment: 'Delhi-Sonipat-Delhi',
    loadCapacity: '710 kg',
    dailyRunningCost: '1,200',
    commercialPermit: 'Valid through Oct 2026',
    gpsTrackingID: 'TRK-SL-2534'
  },
  { 
    id: 31,
    vehicle: 'Tata 407 LPT', 
    worth: 1250000, 
    percentage: 78,
    image: 'https://5.imimg.com/data5/WE/FJ/QL/SELLER-26256295/tata-407-pick-up-truck-500x500.png',
    mileage: 42000,
    fuelType: 'Diesel',
    engineHealth: 88,
    status: 'Commercial Fleet',
    lastService: '25 days ago',
    nextService: '2.5 months',
    purchaseDate: 'May 15, 2023',
    insuranceValid: 'May 2026',
    maintenanceCost: 85000,
    efficiency: '10 km/l',
    averageFuel: '10.0 l/100km',
    topSpeed: '90 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'HR 55 T 9876',
    chassisNumber: 'T407230515LPT',
    engineNumber: '407230515TT',
    owner: 'Galaxy Transport Co.',
    rcExpiryDate: 'May 14, 2033',
    fleetID: 'GT-789012',
    driver: 'Prakash Yadav',
    driverLicense: 'HR-4587691230',
    driverContact: '8765432109',
    routeAssignment: 'Delhi-Jaipur-Delhi',
    loadCapacity: '4 tonnes',
    dailyRunningCost: '3,500',
    commercialPermit: 'Valid through May 2026',
    gpsTrackingID: 'GPS-GT-7890'
  },
  
  // Leased Out specific vehicles
  { 
    id: 32,
    vehicle: 'Hyundai Alcazar', 
    worth: 1780000, 
    percentage: 85,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/Alcazar/10582/1686816171305/front-left-side-47.jpg',
    mileage: 18400,
    fuelType: 'Petrol',
    engineHealth: 92,
    status: 'Leased Out',
    lastService: '1 month ago',
    nextService: '4 months',
    purchaseDate: 'Feb 22, 2023',
    insuranceValid: 'Feb 2026',
    maintenanceCost: 32000,
    efficiency: '14.5 km/l',
    averageFuel: '6.9 l/100km',
    topSpeed: '180 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'KA 05 MH 7890',
    chassisNumber: 'HYAL230222BLR',
    engineNumber: 'AL230222HYM',
    owner: 'Premium Car Rentals',
    rcExpiryDate: 'Feb 21, 2033',
    leaseStartDate: 'Jan 15, 2025',
    leaseDuration: '12 months',
    leasedTo: 'Infosys Ltd.',
    leaseAmount: '₹45,000 monthly',
    leaseTerms: 'Full maintenance included',
    kmLimit: '1,500 km monthly',
    securityDeposit: '₹90,000',
    leaseAgreementNo: 'PCR-INF-2501'
  },
  { 
    id: 33,
    vehicle: 'Toyota Fortuner', 
    worth: 3550000, 
    percentage: 90,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Toyota/Fortuner/8241/1609921660871/front-left-side-47.jpg',
    mileage: 22500,
    fuelType: 'Diesel',
    engineHealth: 94,
    status: 'Leased Out',
    lastService: '45 days ago',
    nextService: '6 months',
    purchaseDate: 'Jul 15, 2022',
    insuranceValid: 'Jul 2025',
    maintenanceCost: 65000,
    efficiency: '12.9 km/l',
    averageFuel: '7.8 l/100km',
    topSpeed: '176 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'MH 01 AB 6543',
    chassisNumber: 'TYFR220715MUM',
    engineNumber: 'FR220715TYM',
    owner: 'Luxury Rentals Pvt Ltd',
    rcExpiryDate: 'Jul 14, 2032',
    leaseStartDate: 'Mar 01, 2025',
    leaseDuration: '24 months',
    leasedTo: 'TCS Executive Transport',
    leaseAmount: '₹75,000 monthly',
    leaseTerms: 'Maintenance by lessee',
    kmLimit: '2,000 km monthly',
    securityDeposit: '₹150,000',
    leaseAgreementNo: 'LRPL-TCS-0301'
  },
  
  // For Sale specific vehicles
  { 
    id: 34,
    vehicle: 'Honda Amaze', 
    worth: 480000, 
    percentage: 65,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/Amaze/10527/1689589917145/front-left-side-47.jpg',
    mileage: 45000,
    fuelType: 'Petrol',
    engineHealth: 82,
    status: 'For Sale',
    lastService: '1 month ago',
    nextService: '3 months',
    purchaseDate: 'Jul 22, 2022',
    insuranceValid: 'Jul 2025',
    maintenanceCost: 22000,
    efficiency: '18 km/l',
    averageFuel: '5.6 l/100km',
    topSpeed: '160 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'TN 01 AK 6789',
    chassisNumber: 'HAMZ220722AMZ',
    engineNumber: 'AMZ220722HN',
    owner: 'Ravi Chandran',
    rcExpiryDate: 'Jul 21, 2032',
    listingDate: 'Apr 15, 2025',
    askingPrice: '₹585,000',
    negotiable: true,
    sellingReason: 'Upgrading to SUV',
    advertisedOn: 'FixPoint, Olx, CarTrade',
    viewingLocation: 'Chennai, Tamil Nadu',
    sellerContact: '9876123450',
    documentStatus: 'All clear'
  },
  { 
    id: 35,
    vehicle: 'KTM Duke 390', 
    worth: 240000, 
    percentage: 60,
    image: 'https://bd.gaadicdn.com/processedimages/ktm/duke-390/source/duke-39063e10e9fa61d9.jpg',
    mileage: 15500,
    fuelType: 'Petrol',
    engineHealth: 90,
    status: 'For Sale',
    lastService: '2 months ago',
    nextService: '4 months',
    purchaseDate: 'Oct 30, 2022',
    insuranceValid: 'Oct 2025',
    maintenanceCost: 12000,
    efficiency: '28 km/l',
    averageFuel: '3.6 l/100km',
    topSpeed: '170 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'KA 03 EB 4321',
    chassisNumber: 'KTM221030DUK',
    engineNumber: 'DUK221030KT',
    owner: 'Karan Mehta',
    rcExpiryDate: 'Oct 29, 2032',
    listingDate: 'Apr 10, 2025',
    askingPrice: '₹240,000',
    negotiable: true,
    sellingReason: 'Moving abroad',
    advertisedOn: 'FixPoint, BikeWale, OLX',
    viewingLocation: 'Bangalore, Karnataka',
    sellerContact: '8765432198',
    documentStatus: 'All clear'
  },
  
  // Sold specific vehicles
  { 
    id: 36,
    vehicle: 'Maruti Suzuki Swift', 
    worth: 480000, 
    percentage: 72,
    image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Maruti/Swift/10406/1697698080670/front-left-side-47.jpg',
    mileage: 35000,
    fuelType: 'Petrol',
    engineHealth: 85,
    status: 'Sold',
    lastService: '3 months ago',
    nextService: 'N/A (Sold)',
    purchaseDate: 'May 15, 2021',
    soldDate: 'Apr 15, 2025',
    insuranceValid: 'May 2024',
    maintenanceCost: 18500,
    efficiency: '21.5 km/l',
    averageFuel: '4.7 l/100km',
    topSpeed: '165 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'DL 05 CP 7890',
    chassisNumber: 'MSWFT210515DEL',
    engineNumber: 'SWF210515MSZ',
    previousOwner: 'Akshay Kumar',
    newOwner: 'Priya Sharma',
    rcExpiryDate: 'May 14, 2031',
    salePrice: '₹480,000',
    saleType: 'Private',
    saleLocation: 'Delhi',
    buyerContact: '9876543210',
    transferStatus: 'In Progress',
    transferDate: 'Apr 25, 2025' 
  },
  { 
    id: 37,
    vehicle: 'Bajaj Pulsar 150', 
    worth: 75000, 
    percentage: 65,
    image: 'https://bd.gaadicdn.com/processedimages/bajaj/bajaj-pulsar-150/source/bajaj-pulsar-15065c9ce3fcc77c.jpg',
    mileage: 22000,
    fuelType: 'Petrol',
    engineHealth: 78,
    status: 'Sold',
    lastService: '2 months ago',
    nextService: 'N/A (Sold)',
    purchaseDate: 'Jan 10, 2022',
    soldDate: 'Apr 05, 2025',
    insuranceValid: 'Jan 2025',
    maintenanceCost: 8500,
    efficiency: '45 km/l',
    averageFuel: '2.2 l/100km',
    topSpeed: '120 km/h',
    emissionRating: 'BS6',
    registrationNumber: 'MH 12 DE 5678',
    chassisNumber: 'BJPL220110PNE',
    engineNumber: 'PLS220110BJZ',
    previousOwner: 'Rajesh Patil',
    newOwner: 'Sunil Jadhav',
    rcExpiryDate: 'Jan 09, 2032',
    salePrice: '₹75,000',
    saleType: 'Private',
    saleLocation: 'Pune',
    buyerContact: '9123456780',
    transferStatus: 'Completed',
    transferDate: 'Apr 15, 2025'
  }
];

// Extract the first 3 vehicles for the worth chart
const vehicleWorthData = vehicleData.slice(0, 3).map(v => ({
  vehicle: v.vehicle,
  worth: v.worth,
  percentage: v.percentage
}));

// AI generated stories for each vehicle
const vehicleStories = {
  'Tata Nexon EV': "Your Tata Nexon EV has been with you for 2 years, reliably serving through 15,000 km of urban commutes and 3 memorable road trips. Its electric powertrain has saved approximately ₹87,500 in fuel costs compared to a petrol equivalent, while helping reduce your carbon footprint by an estimated 3.2 tonnes of CO2.",
  'Honda City': "Your Honda City has been a loyal companion for 5 years, clocking 45,000 km across various terrains. It's witnessed 2 family vacations to the hills and has an impressive service record with only one major maintenance issue. The fuel efficiency remains excellent at 16.5 km/l, above the average for its age.",
  'TVS iQube': "The TVS iQube, your newest addition from 8 months ago, has transformed your daily commute. With 1,200 km on the odometer, it's already saved you 30 hours in traffic and reduced your monthly transportation budget by 35%. Its charging efficiency remains at factory optimal levels.",
  'Mahindra XUV700': "Your Mahindra XUV700, acquired just 16 months ago, has already become the family favorite for weekend getaways. With 8,500 km logged, it's taken you on 4 long trips and countless city drives. Its spacious interior and advanced safety features have provided peace of mind during monsoon travel conditions.",
  'Royal Enfield Classic 350': "The Royal Enfield Classic 350 has been your weekend companion for 3 years now. It's participated in 5 group rides, including the prestigious Royal Enfield Rider Mania. With 22,500 km on the odometer, it's developed that distinctive character that Royal Enfield enthusiasts cherish, and its value has remained remarkably stable."
};

// Community leaderboard data
const communityLeaderboard = [
  { name: 'Rajesh M.', points: 2450, contributions: 47, badges: 8 },
  { name: 'Priya S.', points: 2120, contributions: 39, badges: 7 },
  { name: 'Vikram K.', points: 1870, contributions: 31, badges: 6 },
  { name: 'Anjali P.', points: 1650, contributions: 28, badges: 5 },
  { name: 'Sanjay R.', points: 1520, contributions: 25, badges: 4 },
];

// Add keyframes for pulse animation
const pulseKeyframes = `
@keyframes pulse {
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.5;
  }
}

@keyframes float {
  0% {
    transform: translateY(0px) translateX(0px);
  }
  33% {
    transform: translateY(-10px) translateX(5px);
  }
  66% {
    transform: translateY(5px) translateX(-5px);
  }
  100% {
    transform: translateY(0px) translateX(0px);
  }
}

@keyframes glow {
  0% {
    box-shadow: 0 0 5px rgba(100, 149, 237, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(100, 149, 237, 0.6);
  }
  100% {
    box-shadow: 0 0 5px rgba(100, 149, 237, 0.3);
  }
}
`;

// Dynamic floating particles background
const ParticleBg = () => {
  const particles = Array.from({ length: 25 }, (_, i) => i);
  
  useEffect(() => {
    // Insert keyframes into document
    const style = document.createElement('style');
    style.textContent = pulseKeyframes;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {particles.map((i) => {
        const size = Math.random() * 20 + 10;
        const duration = Math.random() * 20 + 10;
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.2 + 0.05;
        const blur = Math.random() * 10 + 5;
        
        // Generate a random color from a palette of blues and purples
        const colors = ['from-blue-400/10 to-indigo-500/10', 'from-indigo-300/10 to-purple-400/10', 'from-blue-500/10 to-emerald-500/10'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <motion.div
            key={i}
            className={`absolute rounded-full bg-gradient-to-br ${color} backdrop-blur-sm`}
            style={{ 
              width: size, 
              height: size, 
              left: `${initialX}%`, 
              top: `${initialY}%`,
              opacity: opacity,
              filter: `blur(${blur}px)`,
              animation: `float ${duration}s infinite ease-in-out`
            }}
            animate={{
              x: [0, Math.random() * 200 - 100, 0],
              y: [0, Math.random() * 200 - 100, 0],
              opacity: [opacity, opacity * 2, opacity]
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay,
            }}
          />
        );
      })}
    </div>
  );
};

const AnimatedCounter = ({ target, duration = 2 }: { target: number, duration?: number }) => {
  const nodeRef = useRef(null);
  const count = useMotionValue(0);
  const roundedCount = useTransform(count, Math.round);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      count.set(0);
      const controls = animate(count, target, { duration });
      return controls.stop;
    }
  }, [count, target, duration, isInView]);

  return (
    <motion.span ref={ref} className="text-4xl font-bold">
      {roundedCount}
    </motion.span>
  );
};

const FadeInView = ({ children, delay = 0, direction = null }: { children: React.ReactNode, delay?: number, direction?: 'up' | 'down' | 'left' | 'right' | null }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  let initialProps: any = { opacity: 0 };
  if (direction === 'up') initialProps = { ...initialProps, y: 50 };
  if (direction === 'down') initialProps = { ...initialProps, y: -50 };
  if (direction === 'left') initialProps = { ...initialProps, x: 50 };
  if (direction === 'right') initialProps = { ...initialProps, x: -50 };
  
  return (
    <motion.div
      ref={ref}
      initial={initialProps}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const TabTransition = ({ children, isActive }: { children: React.ReactNode, isActive: boolean }) => (
  <AnimatePresence mode="wait">
    {isActive && (
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30 
        }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

const InfoBox = ({ icon: Icon, title, value, accent }: { icon: any; title: string; value: string; accent: string }) => (
  <div className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg p-5 transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
    <div className="flex items-center gap-4">
      <div className={`rounded-full p-3 ${accent} shadow-md transform transition-all duration-300 hover:scale-110`}>
        <Icon className={`h-6 w-6 text-white`} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">{value}</h3>
      </div>
    </div>
  </div>
);

const VehicleWorthVisual = () => {
  const [progress, setProgress] = useState<number[]>([0, 0, 0]);
  
  useEffect(() => {
    // Animate progress bars
    const timer = setTimeout(() => {
      setProgress(vehicleWorthData.map(v => v.percentage));
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const totalWorth = vehicleWorthData.reduce((sum, vehicle) => sum + vehicle.worth, 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">Total Fleet Value</h3>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-3xl md:text-4xl font-bold">
                ₹{totalWorth.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Combined value of 3 primary vehicles
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <FileText className="h-4 w-4 mr-1" />
                <span className="text-xs">Report</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="h-4 w-4 mr-1" />
                <span className="text-xs">Export</span>
              </Button>
            </div>
          </div>
        </div>
        
        {vehicleWorthData.map((vehicle, index) => (
          <div key={vehicle.vehicle} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-slate-600" />
                <span className="font-medium">{vehicle.vehicle}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {vehicle.percentage}%
              </Badge>
            </div>
            <p className="text-xl font-bold">₹{vehicle.worth.toLocaleString('en-IN')}</p>
            <Progress value={progress[index]} className="h-2 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Using the imported VehicleStoryCard component

const PredictiveMaintenance = () => {
  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-start gap-2">
        <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-1 mt-0.5">
          <AlertTriangle className="h-3 w-3 text-amber-500" />
        </div>
        <div>
          <p className="font-medium">Honda City - Brake pads</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Expected replacement in 2 months (15,000 km)</p>
        </div>
      </div>
      <Separator />
      <div className="flex items-start gap-2">
        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1 mt-0.5">
          <Zap className="h-3 w-3 text-green-500" />
        </div>
        <div>
          <p className="font-medium">Tata Nexon EV - Battery health</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Excellent condition (93% capacity)</p>
        </div>
      </div>
      <Separator />
      <div className="flex items-start gap-2">
        <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1 mt-0.5">
          <Info className="h-3 w-3 text-blue-500" />
        </div>
        <div>
          <p className="font-medium">TVS iQube - First service</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Schedule first service in 3 weeks</p>
        </div>
      </div>
    </div>
  );
};

const CommunityLeaderboardCard = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Community Leaderboard</CardTitle>
          <Trophy className="h-5 w-5 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {communityLeaderboard.slice(0, 3).map((user, index) => (
            <motion.div 
              key={user.name}
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <div className="flex items-center gap-3">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-slate-400' : 'bg-amber-700'
                }`}>
                  {index + 1}
                </div>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {Array.from({ length: Math.min(3, Math.floor(user.badges / 3)) }).map((_, i) => (
                    <div 
                      key={i} 
                      className="h-4 w-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center -ml-1 first:ml-0 border border-white dark:border-slate-800"
                    >
                      <Star className="h-2.5 w-2.5 text-amber-500" />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">{user.points} pts</span>
              </div>
            </motion.div>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="w-full mt-3 text-xs">View All Rankings</Button>
      </CardContent>
    </Card>
  );
};

// Floating Action Button
const FloatingActionButton = () => {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-10"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <Button 
        className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-blue-500 text-white shadow-lg hover:shadow-xl"
        aria-label="Add Vehicle"
      >
        <PlusCircle className="h-6 w-6" />
      </Button>
    </motion.div>
  );
};

const VehicleVault = () => {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [selectedVehicle, setSelectedVehicle] = useState<typeof vehicleData[0] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('cars');
  const [selectedStatus, setSelectedStatus] = useState<string | null>('Active');
  const [selectedDocumentVehicle, setSelectedDocumentVehicle] = useState<typeof vehicleData[0] | null>(null);
  const { toast } = useToast();
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.3]);
  const mainContentScale = useSpring(
    useTransform(scrollY, [0, 100], [1, 0.98]), 
    { stiffness: 300, damping: 30 }
  );
  
  // Filter vehicles by category
  const getFilteredVehicles = () => {
    if (selectedCategory === 'two-wheelers') {
      return vehicleData.filter(v => v.vehicle.includes('TVS') || v.vehicle.includes('Royal Enfield'));
    } else if (selectedCategory === 'cars') {
      return vehicleData.filter(v => v.vehicle.includes('Tata') || v.vehicle.includes('Honda') || v.vehicle.includes('Mahindra'));
    } else if (selectedCategory === 'commercial') {
      return vehicleData.filter(v => v.vehicle.includes('Mahindra') || v.vehicle.includes('XUV'));
    } else if (selectedCategory === 'three-wheelers') {
      // No three-wheelers in our data, so return an empty array
      return [];
    }
    return vehicleData;
  };
  
  const filteredVehicles = getFilteredVehicles();
  
  const handleVehicleSelect = (vehicle: typeof vehicleData[0]) => {
    setSelectedVehicle(vehicle);
    toast({
      title: `${vehicle.vehicle} selected`,
      description: "Vehicle details loaded successfully",
    });
  };
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedVehicle(null);
  };
  
  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setActiveTab('documents');
    toast({
      title: `${status} Vehicles Selected`,
      description: `Viewing documents for ${status} vehicles`,
    });
  };
  
  return (
    <>
      {/* Quick action floating menu */}
      <QuickActionMenu vehicleStatus={selectedStatus || "Active"} />
      
      <div className="relative">
        <ParticleBg />
        <div className="relative z-10">
          {selectedVehicle && (
            <ColorAdaptiveUI vehicleType={selectedVehicle.vehicle}>
              <div className="absolute inset-0 pointer-events-none z-[-1] opacity-30">
                <div className="w-full h-full bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/10" />
              </div>
            </ColorAdaptiveUI>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-2"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Your Vehicles
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  View and manage your entire vehicle fleet
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Vehicle
              </Button>
            </div>
          </motion.div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <motion.div
            style={{ opacity: headerOpacity }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg shadow-sm mb-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Active' ? 'ring-2 ring-green-500 dark:ring-green-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Active')}
                >
                  <Car className="h-3.5 w-3.5" />
                  Active
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Recently Purchased' ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Recently Purchased')}
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Recently Purchased
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Pre-owned' ? 'ring-2 ring-indigo-500 dark:ring-indigo-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Pre-owned')}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Pre-owned
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'In Maintenance' ? 'ring-2 ring-amber-500 dark:ring-amber-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('In Maintenance')}
                >
                  <Wrench className="h-3.5 w-3.5" />
                  In Maintenance
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-900/20 dark:text-sky-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Garage Stored' ? 'ring-2 ring-sky-500 dark:ring-sky-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Garage Stored')}
                >
                  <Warehouse className="h-3.5 w-3.5" />
                  Garage Stored
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/40 dark:text-slate-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Out of Service' ? 'ring-2 ring-slate-500 dark:ring-slate-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Out of Service')}
                >
                  <AlertOctagon className="h-3.5 w-3.5" />
                  Out of Service
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Commercial Fleet' ? 'ring-2 ring-purple-500 dark:ring-purple-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Commercial Fleet')}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  Commercial Fleet
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Leased Out' ? 'ring-2 ring-emerald-500 dark:ring-emerald-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Leased Out')}
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  Leased Out
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-pink-50 text-pink-700 hover:bg-pink-100 dark:bg-pink-900/20 dark:text-pink-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'For Sale' ? 'ring-2 ring-pink-500 dark:ring-pink-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('For Sale')}
                >
                  <Tag className="h-3.5 w-3.5" />
                  For Sale
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-900/20 dark:text-violet-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Sold' ? 'ring-2 ring-violet-500 dark:ring-violet-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Sold')}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Sold
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Impounded' ? 'ring-2 ring-rose-500 dark:ring-rose-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Impounded')}
                >
                  <Shield className="h-3.5 w-3.5" />
                  Impounded
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Under Legal Hold' ? 'ring-2 ring-yellow-500 dark:ring-yellow-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Under Legal Hold')}
                >
                  <Scale className="h-3.5 w-3.5" />
                  Under Legal Hold
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Stolen' ? 'ring-2 ring-red-500 dark:ring-red-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Stolen')}
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Stolen
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800/40 dark:text-gray-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Scrapped' ? 'ring-2 ring-gray-500 dark:ring-gray-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Scrapped')}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Scrapped
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`py-2 px-3 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:bg-stone-800/40 dark:text-stone-400 flex items-center gap-1.5 cursor-pointer transition-all ${selectedStatus === 'Totaled' ? 'ring-2 ring-stone-500 dark:ring-stone-400 shadow-md scale-105' : ''}`}
                  onClick={() => handleStatusSelect('Totaled')}
                >
                  <FileX className="h-3.5 w-3.5" />
                  Totaled
                </Badge>
              </div>
            </div>
            
            <TabsList className="grid grid-cols-2 w-fit p-1">
              <TabsTrigger value="vehicles" className="px-4 py-2 text-sm flex gap-2 items-center">
                <Car className="h-4 w-4" />
                Vehicles
              </TabsTrigger>
              <TabsTrigger value="documents" className="px-4 py-2 text-sm flex gap-2 items-center">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
            </TabsList>
          </motion.div>
        
          <TabsContent value="vehicles" className="m-0">
            <TabTransition isActive={activeTab === 'vehicles'}>
              <Card className="mt-0">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl">Your Vehicles</CardTitle>
                      <CardDescription>View and manage your entire vehicle fleet</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <PlusCircle className="h-4 w-4" />
                      Add Vehicle
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-6">
                    {/* Vehicle category selector */}
                    <div className="mb-6">
                      <VehicleCategorySelector 
                        selectedCategory={selectedCategory}
                        onCategorySelect={handleCategorySelect}
                      />
                    </div>
                    
                    {/* Vehicle Dashboard Cards */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        Vehicle Dashboard
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <VehicleDashboardCard 
                          vehicle="Honda City"
                          registrationNumber="MH02AB1234"
                          fuelType="petrol"
                          serviceStatus="up_to_date"
                          healthPercentage={92}
                          lastUpdated={new Date(Date.now() - 3 * 60 * 60 * 1000)} // 3 hours ago
                          status="Active"
                        />
                        <VehicleDashboardCard 
                          vehicle="Hyundai Creta"
                          registrationNumber="KA01MJ5678"
                          fuelType="diesel"
                          serviceStatus="due"
                          healthPercentage={75}
                          lastUpdated={new Date(Date.now() - 24 * 60 * 60 * 1000)} // 1 day ago
                          status="Commercial Fleet"
                        />
                        <VehicleDashboardCard 
                          vehicle="Maruti Swift"
                          registrationNumber="DL7CX9012"
                          fuelType="petrol"
                          serviceStatus="up_to_date"
                          healthPercentage={95}
                          lastUpdated={new Date(Date.now() - 5 * 60 * 60 * 1000)} // 5 hours ago
                          status="Recently Purchased"
                        />
                      </div>
                    </div>
                    
                    {/* Vehicle carousel section */}
                    <VehicleCarousel 
                      vehicles={filteredVehicles} 
                      onVehicleSelect={handleVehicleSelect}
                    />
                    
                    {/* Selected vehicle analysis */}
                    {selectedVehicle && (
                      <div className="mt-8">
                        <div className="mb-4 flex justify-between items-center">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-white dark:to-slate-300 bg-clip-text text-transparent flex items-center gap-2">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-1.5 rounded-lg shadow-md">
                              <Activity className="h-4 w-4" />
                            </div>
                            Vehicle Analysis
                            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400">
                              Active
                            </Badge>
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline"
                              size="sm" 
                              className="text-xs gap-1 rounded-full border-slate-300"
                            >
                              <Share className="h-3.5 w-3.5" />
                              Share
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="text-xs gap-1 bg-red-500 hover:bg-red-600"
                            >
                              <span className="font-medium">₹</span>
                              Sell Vehicle
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs gap-1 rounded-full" 
                              onClick={() => setSelectedVehicle(null)}
                            >
                              <X className="h-3.5 w-3.5" />
                              Close
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2">
                            <VehicleDetailAnalysis vehicle={selectedVehicle} />
                          </div>
                          <div>
                            <VehicleMoodIndicator vehicle={selectedVehicle} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabTransition>
          </TabsContent>
          
          <TabsContent value="documents" className="m-0">
            <TabTransition isActive={activeTab === 'documents'}>
              <Card className="mt-0">
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {selectedStatus === 'Active' && <div className="h-3 w-3 rounded-full bg-green-500"></div>}
                        {selectedStatus === 'Recently Purchased' && <div className="h-3 w-3 rounded-full bg-blue-500"></div>}
                        {selectedStatus === 'Pre-owned' && <div className="h-3 w-3 rounded-full bg-indigo-500"></div>}
                        {selectedStatus === 'In Maintenance' && <div className="h-3 w-3 rounded-full bg-amber-500"></div>}
                        {selectedStatus === 'Garage Stored' && <div className="h-3 w-3 rounded-full bg-sky-500"></div>}
                        {selectedStatus === 'Out of Service' && <div className="h-3 w-3 rounded-full bg-slate-500"></div>}
                        {selectedStatus === 'Commercial Fleet' && <div className="h-3 w-3 rounded-full bg-purple-500"></div>}
                        {selectedStatus === 'Leased Out' && <div className="h-3 w-3 rounded-full bg-emerald-500"></div>}
                        {selectedStatus === 'For Sale' && <div className="h-3 w-3 rounded-full bg-pink-500"></div>}
                        {selectedStatus === 'Sold' && <div className="h-3 w-3 rounded-full bg-violet-500"></div>}
                        {selectedStatus === 'Impounded' && <div className="h-3 w-3 rounded-full bg-rose-500"></div>}
                        {selectedStatus === 'Under Legal Hold' && <div className="h-3 w-3 rounded-full bg-yellow-500"></div>}
                        {selectedStatus === 'Stolen' && <div className="h-3 w-3 rounded-full bg-red-500"></div>}
                        {selectedStatus === 'Scrapped' && <div className="h-3 w-3 rounded-full bg-gray-500"></div>}
                        {selectedStatus === 'Totaled' && <div className="h-3 w-3 rounded-full bg-stone-500"></div>}
                        {selectedStatus} Vehicle Documents
                      </CardTitle>
                      <CardDescription>Manage all your important vehicle documents in one place</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        Export All
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Plus className="h-4 w-4" />
                        Add Document
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {selectedStatus === 'Active' && (
                    <>
                      {!selectedDocumentVehicle ? (
                        // Vehicle Selection State
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 mb-6">
                          <h3 className="text-lg font-semibold text-center mb-4">Select a Vehicle to View Documents</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {vehicleData.map((vehicle) => (
                              <Card 
                                key={vehicle.id} 
                                className={`cursor-pointer transition-all hover:shadow-md ${selectedDocumentVehicle?.id === vehicle.id ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
                                onClick={() => setSelectedDocumentVehicle(vehicle)}
                              >
                                <CardContent className="p-4">
                                  <div className="aspect-video w-full overflow-hidden rounded-md mb-3">
                                    <img 
                                      src={vehicle.image} 
                                      alt={vehicle.vehicle} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <h4 className="font-semibold">{vehicle.vehicle}</h4>
                                    <p className="text-xs text-slate-500">{vehicle.registrationNumber || "No registration"}</p>
                                    <div className="flex justify-between items-center">
                                      <Badge variant="outline" className="text-xs px-2 py-0">
                                        {vehicle.fuelType}
                                      </Badge>
                                      <p className="text-xs text-slate-500">Owner: {vehicle.owner || "Unknown"}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ) : (
                        // Vehicle Documents Display State
                        <div className="space-y-6">
                          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 mb-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={selectedDocumentVehicle.image} />
                                <AvatarFallback>{selectedDocumentVehicle.vehicle.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{selectedDocumentVehicle.vehicle}</h3>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-slate-500">{selectedDocumentVehicle.registrationNumber || "No registration"}</p>
                                  <Badge variant="outline" className="text-xs">{selectedDocumentVehicle.fuelType}</Badge>
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedDocumentVehicle(null)}
                            >
                              Change Vehicle
                            </Button>
                          </div>
                          
                          {/* Vehicle Registration Certificate */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-gray-800">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-500" />
                            Vehicle Registration Certificate (RC)
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Share className="h-4 w-4" />
                              <span className="sr-only">Share</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-1">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Original RC book/card</span>
                              <Button variant="outline" size="sm" className="justify-start">
                                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                View Original RC
                              </Button>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Digital Copy</span>
                              <Button variant="outline" size="sm" className="justify-start">
                                <SmartphoneNfc className="h-4 w-4 mr-2 text-green-500" />
                                Access Digital RC
                              </Button>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                            <h4 className="text-sm font-medium mb-2">Renewal Information</h4>
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarClock className="h-4 w-4 text-amber-500" />
                              <span>Renewal due in <strong>245 days</strong> (12/01/2026)</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-3">
                            <span className="text-sm text-gray-500">Last Updated: 05/15/2024</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                              Valid
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Insurance Documentation */}
                      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-gray-800">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Shield className="h-5 w-5 text-violet-500" />
                            Insurance Documentation
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Share className="h-4 w-4" />
                              <span className="sr-only">Share</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-1">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Policy Documents</span>
                              <Button variant="outline" size="sm" className="justify-start">
                                <FileText className="h-4 w-4 mr-2 text-violet-500" />
                                View Policy Details
                              </Button>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Premium Payment</span>
                              <Button variant="outline" size="sm" className="justify-start">
                                <Receipt className="h-4 w-4 mr-2 text-amber-500" />
                                View Payment Receipts
                              </Button>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                            <h4 className="text-sm font-medium mb-2">No-Claim Bonus</h4>
                            <div className="flex items-center gap-2 mb-2">
                              <Award className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm">Current NCB: <strong>25%</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarClock className="h-4 w-4 text-amber-500" />
                              <span>Renewal due in <strong>123 days</strong> (08/31/2025)</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-3">
                            <span className="text-sm text-gray-500">Last Updated: 07/22/2024</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                              Valid
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Pollution Control Certificate */}
                      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-gray-800">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Leaf className="h-5 w-5 text-green-500" />
                            Pollution Control Certificate
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Share className="h-4 w-4" />
                              <span className="sr-only">Share</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-1">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Certificate</span>
                              <Button variant="outline" size="sm" className="justify-start">
                                <FileText className="h-4 w-4 mr-2 text-green-500" />
                                View Certificate
                              </Button>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Testing Center</span>
                              <Button variant="outline" size="sm" className="justify-start">
                                <MapPin className="h-4 w-4 mr-2 text-red-500" />
                                View Testing Location
                              </Button>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                            <h4 className="text-sm font-medium mb-2">Emission Test Results</h4>
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span className="text-sm">Status: <strong>Within Permissible Limits</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarClock className="h-4 w-4 text-amber-500" />
                              <span>Renewal due in <strong>45 days</strong> (06/15/2025)</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-3">
                            <span className="text-sm text-gray-500">Last Updated: 12/15/2024</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                              Valid
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Tax Documentation */}
                      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-gray-800">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Receipt className="h-5 w-5 text-amber-500" />
                            Tax Documentation
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Share className="h-4 w-4" />
                              <span className="sr-only">Share</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-1">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Road Tax Receipt</span>
                              <Button variant="outline" size="sm" className="justify-start">
                                <Receipt className="h-4 w-4 mr-2 text-amber-500" />
                                View Tax Receipt
                              </Button>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tax Validity</span>
                              <div className="flex items-center gap-2 text-sm">
                                <CalendarCheck className="h-4 w-4 text-blue-500" />
                                <span>Valid until <strong>12/31/2027</strong></span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-3">
                            <span className="text-sm text-gray-500">Last Updated: 01/05/2025</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                              Paid
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Service Records */}
                      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-gray-800">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Wrench className="h-5 w-5 text-blue-500" />
                            Service Records
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Share className="h-4 w-4" />
                              <span className="sr-only">Share</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                  <Wrench className="h-4 w-4 text-blue-500" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">Regular Service</h4>
                                  <p className="text-xs text-gray-500">March 10, 2025</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                  <FilterX className="h-4 w-4 text-amber-500" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">Oil Change</h4>
                                  <p className="text-xs text-gray-500">January 15, 2025</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">Complete Service</h4>
                                  <p className="text-xs text-gray-500">October 5, 2024</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium">Upcoming Service</h4>
                              <Button variant="outline" size="sm" className="h-7">
                                Schedule
                              </Button>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarClock className="h-4 w-4 text-amber-500" />
                              <span>Next service due in <strong>4500 km</strong> or <strong>4 months</strong></span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Vehicle Performance Logs */}
                      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-gray-800">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-indigo-500" />
                            Vehicle Performance Logs
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Share className="h-4 w-4" />
                              <span className="sr-only">Share</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-3">
                              <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                                <Fuel className="h-4 w-4 text-amber-500" />
                                Fuel Efficiency
                              </h4>
                              <div className="flex items-center justify-between">
                                <span className="text-xl font-bold">17.5 km/l</span>
                                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                  +2.1%
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-3">
                              <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                                <Route className="h-4 w-4 text-blue-500" />
                                Trip History
                              </h4>
                              <div className="flex items-center justify-between">
                                <span className="text-xl font-bold">2,345 km</span>
                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                                  View Trips
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                            <h4 className="text-sm font-medium mb-3">Performance Overview</h4>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between items-center mb-1 text-xs">
                                  <span>Engine Health</span>
                                  <span className="font-medium">92%</span>
                                </div>
                                <Progress value={92} className="h-1.5" />
                              </div>
                              <div>
                                <div className="flex justify-between items-center mb-1 text-xs">
                                  <span>Battery Condition</span>
                                  <span className="font-medium">87%</span>
                                </div>
                                <Progress value={87} className="h-1.5" />
                              </div>
                              <div>
                                <div className="flex justify-between items-center mb-1 text-xs">
                                  <span>Brake Wear</span>
                                  <span className="font-medium">22%</span>
                                </div>
                                <Progress value={22} className="h-1.5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Driver Information */}
                      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-gray-800">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <UserCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            Driver Information
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Share className="h-4 w-4" />
                              <span className="sr-only">Share</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border">
                              <AvatarImage src="" />
                              <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                                RK
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">Rahul Kumar</h4>
                              <p className="text-sm text-gray-500">Primary Driver</p>
                            </div>
                            <Button variant="ghost" size="sm" className="ml-auto">
                              <UserCog className="h-4 w-4 mr-1" />
                              Manage
                            </Button>
                          </div>
                          
                          <div className="border-t border-gray-200 dark:border-gray-800 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">License Details</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-blue-500" />
                                  <span>MH-1420110012345</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CalendarCheck className="h-4 w-4 text-green-500" />
                                  <span>Valid until: <strong>06/12/2029</strong></span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-2">Authorization</h4>
                              <div className="space-y-2">
                                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                  Authorized
                                </Badge>
                                <div className="flex">
                                  <Button variant="outline" size="sm" className="text-xs h-7">
                                    <Plus className="h-3.5 w-3.5 mr-1" />
                                    Add Driver
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {selectedStatus === 'Recently Purchased' && (
                    <>
                      {!selectedDocumentVehicle ? (
                        // Vehicle Selection State for Recently Purchased
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
                          <h3 className="text-lg font-semibold text-center mb-4 text-blue-700 dark:text-blue-400">Select a Recently Purchased Vehicle</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {vehicleData
                              .slice(5, 10) // The recently purchased vehicles (IDs 6-10)
                              .map((vehicle) => (
                                <Card 
                                  key={vehicle.id} 
                                  className={`cursor-pointer transition-all hover:shadow-md border-2 ${selectedDocumentVehicle?.id === vehicle.id ? 'border-blue-500 dark:border-blue-400' : 'border-transparent'}`}
                                  onClick={() => setSelectedDocumentVehicle(vehicle)}
                                >
                                  <CardContent className="p-4">
                                    <div className="aspect-video w-full overflow-hidden rounded-md mb-3 relative">
                                      <img 
                                        src={vehicle.image} 
                                        alt={vehicle.vehicle} 
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                        New
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <h4 className="font-semibold">{vehicle.vehicle}</h4>
                                      <p className="text-xs text-slate-500">{vehicle.registrationNumber || "Registration in progress"}</p>
                                      <div className="flex justify-between items-center">
                                        <Badge variant="outline" className="text-xs px-2 py-0 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                          {vehicle.fuelType}
                                        </Badge>
                                        <p className="text-xs text-slate-500">Purchased: {vehicle.purchaseDate}</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        </div>
                      ) : (
                        // Recently Purchased Vehicle Documents Display
                        <div className="space-y-6">
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={selectedDocumentVehicle.image} />
                                <AvatarFallback>{selectedDocumentVehicle.vehicle.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{selectedDocumentVehicle.vehicle}</h3>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-slate-500">{selectedDocumentVehicle.registrationNumber || "Registration in progress"}</p>
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">Recently Purchased</Badge>
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedDocumentVehicle(null)}
                              className="text-blue-700 dark:text-blue-400"
                            >
                              Change Vehicle
                            </Button>
                          </div>
                          
                          {/* Purchase Documentation */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                <ShoppingBag className="h-5 w-5" />
                                Purchase Documentation
                              </h3>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-700 dark:text-blue-400">
                                  <Plus className="h-4 w-4" />
                                  <span className="sr-only">Add</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-700 dark:text-blue-400">
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sales Invoice</h4>
                                  <p className="text-xs text-gray-500">Itemized breakdown with all costs</p>
                                  <Button variant="outline" size="sm" className="justify-start mt-2">
                                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                    Upload Invoice
                                  </Button>
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Receipt</h4>
                                  <p className="text-xs text-gray-500">PDI (Pre-Delivery Inspection) details</p>
                                  <Button variant="outline" size="sm" className="justify-start mt-2">
                                    <Truck className="h-4 w-4 mr-2 text-green-500" />
                                    Upload Receipt
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                                <h4 className="text-sm font-medium mb-2">Post-purchase Checklist</h4>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Checkbox id="check1" checked={true} />
                                    <label htmlFor="check1" className="text-sm">Sales invoice received</label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Checkbox id="check2" checked={true} />
                                    <label htmlFor="check2" className="text-sm">Delivery receipt signed</label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Checkbox id="check3" checked={false} />
                                    <label htmlFor="check3" className="text-sm">Registration process initiated</label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Checkbox id="check4" checked={false} />
                                    <label htmlFor="check4" className="text-sm">Warranty activated</label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Checkbox id="check5" checked={false} />
                                    <label htmlFor="check5" className="text-sm">First service scheduled</label>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
                                <div className="flex items-center gap-2">
                                  <CalendarClock className="h-4 w-4 text-amber-500" />
                                  <span className="text-sm">Transition to "Active" in <strong>45 days</strong></span>
                                </div>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                  In Progress
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          {/* Ownership Transfer */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                <RefreshCw className="h-5 w-5" />
                                Ownership Transfer
                              </h3>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-700 dark:text-blue-400">
                                  <Plus className="h-4 w-4" />
                                  <span className="sr-only">Add</span>
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Transfer Documents</h4>
                                  <p className="text-xs text-gray-500">Form 29/30 and related papers</p>
                                  <Button variant="outline" size="sm" className="justify-start mt-2">
                                    <FileText className="h-4 w-4 mr-2 text-indigo-500" />
                                    Upload Forms
                                  </Button>
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Previous Owner's NOC</h4>
                                  <p className="text-xs text-gray-500">No Objection Certificate</p>
                                  <Button variant="outline" size="sm" className="justify-start mt-2">
                                    <FileCheck className="h-4 w-4 mr-2 text-green-500" />
                                    Upload NOC
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Financing/Loan Details */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                <CreditCard className="h-5 w-5" />
                                Financing/Loan Details
                              </h3>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-700 dark:text-blue-400">
                                  <Plus className="h-4 w-4" />
                                  <span className="sr-only">Add</span>
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Loan Agreement</h4>
                                  <p className="text-xs text-gray-500">Terms and conditions document</p>
                                  <Button variant="outline" size="sm" className="justify-start mt-2">
                                    <FileText className="h-4 w-4 mr-2 text-amber-500" />
                                    Upload Agreement
                                  </Button>
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">EMI Schedule</h4>
                                  <p className="text-xs text-gray-500">Payment tracking document</p>
                                  <Button variant="outline" size="sm" className="justify-start mt-2">
                                    <Calendar className="h-4 w-4 mr-2 text-violet-500" />
                                    Upload Schedule
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Warranty Information */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mt-6">
                            <div className="flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                <Shield className="h-5 w-5" />
                                Warranty Information
                              </h3>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-700 dark:text-blue-400">
                                  <Plus className="h-4 w-4" />
                                  <span className="sr-only">Add</span>
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Manufacturer Warranty</h4>
                                  <p className="text-xs text-gray-500">Coverage details and terms</p>
                                  <Button variant="outline" size="sm" className="justify-start mt-2">
                                    <FileText className="h-4 w-4 mr-2 text-green-500" />
                                    Upload Certificate
                                  </Button>
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Extended Warranty</h4>
                                  <p className="text-xs text-gray-500">Additional coverage purchased</p>
                                  <Button variant="outline" size="sm" className="justify-start mt-2">
                                    <Shield className="h-4 w-4 mr-2 text-indigo-500" />
                                    Upload Details
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-lg">
                                <div className="text-sm text-blue-700 dark:text-blue-400 flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4" />
                                  <span>Warranty active until: <strong>Jan 2028</strong></span>
                                </div>
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                                  Active
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          {/* Initial Vehicle Documentation */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mt-6">
                            <div className="flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                <FileText className="h-5 w-5" />
                                Initial Vehicle Documentation
                              </h3>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-700 dark:text-blue-400">
                                  <Plus className="h-4 w-4" />
                                  <span className="sr-only">Add</span>
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">VIN Details</h4>
                                  <p className="text-xs text-gray-500">Vehicle identification number information</p>
                                  <p className="text-xs font-medium mt-1 text-slate-700 dark:text-slate-300">{selectedDocumentVehicle.chassisNumber}</p>
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Engine/Chassis Numbers</h4>
                                  <p className="text-xs text-gray-500">Core vehicle identifiers</p>
                                  <p className="text-xs font-medium mt-1 text-slate-700 dark:text-slate-300">Engine: {selectedDocumentVehicle.engineNumber}</p>
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Color & Variant</h4>
                                  <p className="text-xs text-gray-500">Vehicle specifications</p>
                                  <Button variant="outline" size="sm" className="justify-start mt-2">
                                    <FileText className="h-4 w-4 mr-2 text-amber-500" />
                                    Upload Specs
                                  </Button>
                                </div>
                              </div>
                              
                              <Separator className="my-2" />
                              
                              <div className="mt-2">
                                <h4 className="text-sm font-medium mb-2">Vehicle Feature Documentation</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <Button variant="outline" size="sm" className="justify-start">
                                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                    Owner's Manual
                                  </Button>
                                  <Button variant="outline" size="sm" className="justify-start">
                                    <FileText className="h-4 w-4 mr-2 text-purple-500" />
                                    Service Schedule
                                  </Button>
                                  <Button variant="outline" size="sm" className="justify-start">
                                    <FileText className="h-4 w-4 mr-2 text-emerald-500" />
                                    Feature Guide
                                  </Button>
                                  <Button variant="outline" size="sm" className="justify-start">
                                    <FileText className="h-4 w-4 mr-2 text-amber-500" />
                                    Accessory Catalog
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-lg mt-4">
                                <div className="text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
                                  <CalendarCheck className="h-4 w-4" />
                                  <span>First service scheduled for: <strong>Feb 15, 2025</strong></span>
                                </div>
                                <Button variant="outline" size="sm" className="h-8 bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400">
                                  Reschedule
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 justify-end mt-6">
                            <Button variant="outline" className="gap-2">
                              <Download className="h-4 w-4" />
                              Export All Documents
                            </Button>
                            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                              <CheckCircle className="h-4 w-4" />
                              Complete Setup
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* In Maintenance Documents Section */}
                  {selectedStatus === 'In Maintenance' && (
                    <>
                      {!selectedDocumentVehicle ? (
                        // Vehicle Selection State for In Maintenance
                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 mb-6">
                          <h3 className="text-lg font-semibold text-center mb-4 text-amber-700 dark:text-amber-400">Select a Vehicle in Maintenance</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {vehicleData
                              .slice(14, 16) // Maintenance vehicles (IDs 14-15)
                              .map((vehicle) => (
                                <Card 
                                  key={vehicle.id} 
                                  className={`cursor-pointer transition-all hover:shadow-md border-2 ${selectedDocumentVehicle?.id === vehicle.id ? 'border-amber-500 dark:border-amber-400' : 'border-transparent'}`}
                                  onClick={() => setSelectedDocumentVehicle(vehicle)}
                                >
                                  <CardContent className="p-4">
                                    <div className="aspect-video w-full overflow-hidden rounded-md mb-3 relative">
                                      <img 
                                        src={vehicle.image} 
                                        alt={vehicle.vehicle} 
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                                        In Service
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <h4 className="font-semibold">{vehicle.vehicle}</h4>
                                      <p className="text-xs text-slate-500">{vehicle.registrationNumber}</p>
                                      <div className="flex justify-between items-center">
                                        <Badge variant="outline" className="text-xs px-2 py-0 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                                          {vehicle.fuelType}
                                        </Badge>
                                        <p className="text-xs text-slate-500">EST: {(vehicle as any).estimatedCompletion}</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        </div>
                      ) : (
                        // In Maintenance Vehicle Documents Display
                        <div className="space-y-6">
                          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mb-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={selectedDocumentVehicle.image} />
                                <AvatarFallback>{selectedDocumentVehicle.vehicle.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{selectedDocumentVehicle.vehicle}</h3>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-slate-500">{selectedDocumentVehicle.registrationNumber}</p>
                                  <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">In Maintenance</Badge>
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedDocumentVehicle(null)}
                              className="text-amber-700 dark:text-amber-400"
                            >
                              Change Vehicle
                            </Button>
                          </div>
                          
                          {/* Current Service Details */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                <Wrench className="h-5 w-5" />
                                Current Service Details
                              </h3>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-amber-700 dark:text-amber-400">
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Work Order</h4>
                                  <p className="text-xs text-gray-500">Detailed job description</p>
                                  <p className="text-xs mt-1 text-slate-700 dark:text-slate-300">
                                    Service type: <strong>{(selectedDocumentVehicle as any).maintenanceType}</strong>
                                  </p>
                                  <p className="text-xs mt-1 text-slate-700 dark:text-slate-300">
                                    Notes: <strong>{(selectedDocumentVehicle as any).maintenanceNotes}</strong>
                                  </p>
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Service Center</h4>
                                  <p className="text-xs text-gray-500">Where the vehicle is being serviced</p>
                                  <p className="text-xs mt-1 text-slate-700 dark:text-slate-300">
                                    {(selectedDocumentVehicle as any).serviceCenter}
                                  </p>
                                  <Button variant="outline" size="sm" className="justify-start mt-2">
                                    <MapPin className="h-4 w-4 mr-2 text-red-500" />
                                    View Location
                                  </Button>
                                </div>
                              </div>
                              
                              <Separator className="my-2" />
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Cost Estimate</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                      <span>Parts</span>
                                      <span>₹8,200</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span>Labor</span>
                                      <span>₹3,500</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span>Diagnostics</span>
                                      <span>₹1,200</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-sm font-medium">
                                      <span>Total</span>
                                      <span>₹12,900</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Service Timeline</h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                      <span className="text-xs">Diagnostic completed</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                      <span className="text-xs">Parts ordered</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Circle className="h-4 w-4 text-amber-500" />
                                      <span className="text-xs">Repair in progress</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Circle className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                                      <span className="text-xs">Quality check</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Circle className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                                      <span className="text-xs">Ready for pickup</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-lg mt-2">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                                    <CalendarCheck className="h-4 w-4" />
                                    <span>Estimated completion: <strong>{(selectedDocumentVehicle as any).estimatedCompletion}</strong></span>
                                  </div>
                                  <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                                    In Progress
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Issue Documentation */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                <AlertTriangle className="h-5 w-5" />
                                Issue Documentation
                              </h3>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-amber-700 dark:text-amber-400">
                                  <Plus className="h-4 w-4" />
                                  <span className="sr-only">Add</span>
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="border border-gray-200 dark:border-gray-800 rounded-md p-3">
                                <h4 className="text-sm font-medium">Problem Description</h4>
                                <p className="text-xs mt-2">{(selectedDocumentVehicle as any).maintenanceNotes}</p>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button variant="outline" size="sm" className="justify-start">
                                  <FileText className="h-4 w-4 mr-2 text-purple-500" />
                                  View Diagnostic Report
                                </Button>
                                <Button variant="outline" size="sm" className="justify-start">
                                  <ImageIcon className="h-4 w-4 mr-2 text-blue-500" />
                                  View Issue Photos
                                </Button>
                              </div>
                              
                              <div className="border-t border-gray-200 dark:border-gray-800 pt-3">
                                <h4 className="text-sm font-medium mb-2">Error Codes</h4>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="bg-red-50 dark:bg-red-900/20 rounded p-2 text-xs">
                                    <span className="font-mono text-red-600 dark:text-red-400">P0300</span>
                                    <p className="mt-1 text-gray-600 dark:text-gray-400">Random/Multiple Cylinder Misfire Detected</p>
                                  </div>
                                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded p-2 text-xs">
                                    <span className="font-mono text-amber-600 dark:text-amber-400">P0171</span>
                                    <p className="mt-1 text-gray-600 dark:text-gray-400">System Too Lean (Bank 1)</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Alternative Transportation */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                <Car className="h-5 w-5" />
                                Alternative Transportation
                              </h3>
                            </div>
                            <div className="p-4">
                              <div className="bg-green-50 dark:bg-green-900/20 rounded-md p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <h4 className="text-sm font-medium">Loaner Vehicle Provided</h4>
                                  </div>
                                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">Active</Badge>
                                </div>
                                <p className="text-xs mt-2">Vehicle: Maruti Suzuki WagonR</p>
                                <p className="text-xs">Pickup date: Apr 25, 2025</p>
                                <p className="text-xs">Return due: Upon service completion</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 justify-end mt-6">
                            <Button variant="outline" className="gap-2">
                              <PhoneCall className="h-4 w-4" />
                              Contact Service Center
                            </Button>
                            <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
                              <RefreshCw className="h-4 w-4" />
                              Get Service Updates
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Pre-Owned Documents Section */}
                  {selectedStatus === 'Pre-Owned' && (
                    <>
                      {!selectedDocumentVehicle ? (
                        // Vehicle Selection State for Pre-Owned
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 mb-6">
                          <h3 className="text-lg font-semibold text-center mb-4 text-purple-700 dark:text-purple-400">Select a Pre-Owned Vehicle</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {vehicleData
                              .slice(11, 14) // Pre-owned vehicles (IDs 11-13)
                              .map((vehicle) => (
                                <Card 
                                  key={vehicle.id} 
                                  className={`cursor-pointer transition-all hover:shadow-md border-2 ${selectedDocumentVehicle?.id === vehicle.id ? 'border-purple-500 dark:border-purple-400' : 'border-transparent'}`}
                                  onClick={() => setSelectedDocumentVehicle(vehicle)}
                                >
                                  <CardContent className="p-4">
                                    <div className="aspect-video w-full overflow-hidden rounded-md mb-3 relative">
                                      <img 
                                        src={vehicle.image} 
                                        alt={vehicle.vehicle} 
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                                        Pre-Owned
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <h4 className="font-semibold">{vehicle.vehicle}</h4>
                                      <p className="text-xs text-slate-500">{vehicle.registrationNumber}</p>
                                      <div className="flex justify-between items-center">
                                        <Badge variant="outline" className="text-xs px-2 py-0 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                                          {vehicle.fuelType}
                                        </Badge>
                                        <p className="text-xs text-slate-500">Certified: {(vehicle as any).certifiedBy.split(' ')[0]}</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        </div>
                      ) : (
                        // Pre-Owned Vehicle Documents Display
                        <div className="space-y-6">
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={selectedDocumentVehicle.image} />
                                <AvatarFallback>{selectedDocumentVehicle.vehicle.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{selectedDocumentVehicle.vehicle}</h3>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-slate-500">{selectedDocumentVehicle.registrationNumber}</p>
                                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">Pre-Owned</Badge>
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedDocumentVehicle(null)}
                              className="text-purple-700 dark:text-purple-400"
                            >
                              Change Vehicle
                            </Button>
                          </div>
                          
                          {/* Vehicle History */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-700 dark:text-purple-400">
                                <History className="h-5 w-5" />
                                Vehicle History
                              </h3>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-purple-700 dark:text-purple-400">
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Ownership History</h4>
                                  <p className="text-xs text-gray-500">Previous ownership details</p>
                                  <div className="mt-2 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <UserCircle className="h-4 w-4 text-purple-500" />
                                      <p className="text-xs font-medium">Previous Owners: <span className="font-normal">{(selectedDocumentVehicle as any).previousOwners}</span></p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Gauge className="h-4 w-4 text-purple-500" />
                                      <p className="text-xs font-medium">Odometer Reading: <span className="font-normal">{(selectedDocumentVehicle as any).odometerReading} km</span></p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Certification</h4>
                                  <p className="text-xs text-gray-500">Vehicle certification details</p>
                                  <div className="bg-purple-50/50 dark:bg-purple-950/20 p-3 rounded-lg mt-2">
                                    <div className="flex items-center gap-2">
                                      <CheckCircle className="h-4 w-4 text-purple-500" />
                                      <p className="text-xs font-medium">{(selectedDocumentVehicle as any).certifiedBy}</p>
                                    </div>
                                    <p className="text-xs mt-1">Full history report available</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                                <h4 className="text-sm font-medium mb-2">Vehicle History Timeline</h4>
                                <div className="space-y-3">
                                  <div className="relative pl-5 pb-3 border-l-2 border-purple-200 dark:border-purple-900">
                                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-purple-500"></div>
                                    <p className="text-xs font-medium">First Registration</p>
                                    <p className="text-xs text-gray-500">June 2022</p>
                                  </div>
                                  <div className="relative pl-5 pb-3 border-l-2 border-purple-200 dark:border-purple-900">
                                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-purple-300"></div>
                                    <p className="text-xs font-medium">First Ownership Period</p>
                                    <p className="text-xs text-gray-500">June 2022 - March 2023</p>
                                  </div>
                                  <div className="relative pl-5 pb-3 border-l-2 border-purple-200 dark:border-purple-900">
                                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-purple-300"></div>
                                    <p className="text-xs font-medium">Ownership Transfer</p>
                                    <p className="text-xs text-gray-500">March 2023</p>
                                  </div>
                                  <div className="relative pl-5">
                                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-green-500"></div>
                                    <p className="text-xs font-medium">Current Ownership</p>
                                    <p className="text-xs text-gray-500">Started {selectedDocumentVehicle.purchaseDate}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Inspection Report */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-700 dark:text-purple-400">
                                <ClipboardCheck className="h-5 w-5" />
                                Inspection Report
                              </h3>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Mechanical</h4>
                                  <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs">
                                      <span>Engine</span>
                                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">Passed</Badge>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span>Transmission</span>
                                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">Passed</Badge>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span>Suspension</span>
                                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">Minor Issues</Badge>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span>Brakes</span>
                                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">Passed</Badge>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Exterior</h4>
                                  <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs">
                                      <span>Body</span>
                                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">Minor Issues</Badge>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span>Paint</span>
                                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">Passed</Badge>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span>Glass/Lights</span>
                                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">Passed</Badge>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span>Tires</span>
                                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">Passed</Badge>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Interior</h4>
                                  <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs">
                                      <span>Seats/Upholstery</span>
                                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">Passed</Badge>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span>Dashboard</span>
                                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">Passed</Badge>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span>Electronics</span>
                                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">Passed</Badge>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span>AC/Heating</span>
                                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">Passed</Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <Button variant="outline" size="sm" className="w-full mt-2">
                                <FileText className="h-4 w-4 mr-2" />
                                View Full Inspection Report
                              </Button>
                            </div>
                          </div>
                          
                          {/* Price and Value */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-700 dark:text-purple-400">
                                <IndianRupee className="h-5 w-5" />
                                Purchase & Value Details
                              </h3>
                            </div>
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Purchase Details</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                      <span>Purchase Date</span>
                                      <span className="font-medium">{selectedDocumentVehicle.purchaseDate}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span>Purchase Price</span>
                                      <span className="font-medium">₹{selectedDocumentVehicle.worth.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span>Purchase Type</span>
                                      <span className="font-medium">{(selectedDocumentVehicle as any).purchaseType}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Market Valuation</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                      <span>Current Market Value</span>
                                      <span className="font-medium">₹{selectedDocumentVehicle.worth.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span>Historical Depreciation</span>
                                      <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 font-normal">
                                        {(100 - selectedDocumentVehicle.percentage).toFixed(1)}%
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span>Warranty Status</span>
                                      <Badge className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 font-normal">
                                        Extended
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 justify-end mt-6">
                            <Button variant="outline" className="gap-2">
                              <Download className="h-4 w-4" />
                              Export All Documents
                            </Button>
                            <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                              <Share className="h-4 w-4" />
                              Share History Report
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Out of Service Documents Section */}
                  {selectedStatus === 'Out of Service' && (
                    <>
                      {!selectedDocumentVehicle ? (
                        // Vehicle Selection State for Out of Service
                        <div className="bg-slate-50 dark:bg-slate-900/20 rounded-lg p-6 mb-6">
                          <h3 className="text-lg font-semibold text-center mb-4 text-slate-700 dark:text-slate-400">Select an Out of Service Vehicle</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {vehicleData
                              .filter(vehicle => (vehicle as any).status === 'Out of Service')
                              .map((vehicle) => (
                                <Card 
                                  key={vehicle.id} 
                                  className={`cursor-pointer transition-all hover:shadow-md border-2 ${selectedDocumentVehicle?.id === vehicle.id ? 'border-slate-500 dark:border-slate-400' : 'border-transparent'}`}
                                  onClick={() => setSelectedDocumentVehicle(vehicle)}
                                >
                                  <CardContent className="p-4">
                                    <div className="aspect-video w-full overflow-hidden rounded-md mb-3 relative">
                                      <img 
                                        src={vehicle.image} 
                                        alt={vehicle.vehicle} 
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute top-2 right-2 bg-slate-500 text-white text-xs px-2 py-1 rounded-full">
                                        OOS
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <h4 className="font-semibold">{vehicle.vehicle}</h4>
                                      <p className="text-xs text-slate-500">{vehicle.registrationNumber}</p>
                                      <div className="flex justify-between items-center">
                                        <Badge variant="outline" className="text-xs px-2 py-0 bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400">
                                          {vehicle.fuelType}
                                        </Badge>
                                        <p className="text-xs text-slate-500">Since: {(vehicle as any).outOfServiceDate}</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        </div>
                      ) : (
                        // Out of Service Vehicle Documents Display
                        <div className="space-y-6">
                          <div className="bg-slate-50 dark:bg-slate-900/20 rounded-lg p-4 mb-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                <AlertOctagon className="h-6 w-6 text-slate-700 dark:text-slate-400" />
                              </div>
                              <div>
                                <h3 className="font-semibold flex items-center gap-2">
                                  {selectedDocumentVehicle.vehicle}
                                  <AnimatedStatusTransition 
                                    currentStatus="Out of Service"
                                    size="sm"
                                  />
                                </h3>
                                <p className="text-xs text-slate-500">{selectedDocumentVehicle.registrationNumber}</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setSelectedDocumentVehicle(null)}>
                              Change Vehicle
                            </Button>
                          </div>
                          
                          {/* Non-operational Status */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-400">
                                <AlertOctagon className="h-5 w-5" />
                                Non-operational Status
                                <ContextualHelpTooltip tipType="nonOperational" />
                              </h3>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Official Declaration</h4>
                                  <p className="text-xs text-gray-500">Non-operation status with authorities</p>
                                  <div className="flex mt-2 gap-2">
                                    <Badge variant="outline" className="bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400">
                                      {(selectedDocumentVehicle as any).declarationStatus || 'Pending'}
                                    </Badge>
                                    {(selectedDocumentVehicle as any).declarationStatus === 'Filed' && (
                                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                        Verified
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Storage Location</h4>
                                  <p className="text-xs text-gray-500">Where the vehicle is currently kept</p>
                                  <p className="text-xs mt-1 text-slate-700 dark:text-slate-300">
                                    {(selectedDocumentVehicle as any).storageLocation || 'Not specified'}
                                  </p>
                                  <Button variant="outline" size="sm" className="justify-start mt-2">
                                    <MapPin className="h-4 w-4 mr-2 text-red-500" />
                                    Update Location
                                  </Button>
                                </div>
                              </div>
                              
                              <Separator className="my-2" />
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InteractiveDataPoint
                                  label="Out of Service Since"
                                  value={(selectedDocumentVehicle as any).outOfServiceDate || 'Not recorded'}
                                  info="Date when vehicle was officially declared non-operational"
                                />
                                
                                <InteractiveDataPoint
                                  label="Expected Duration"
                                  value={(selectedDocumentVehicle as any).expectedDuration || 'Indefinite'}
                                  info="Estimated time vehicle will remain out of service"
                                />
                                
                                <InteractiveDataPoint
                                  label="Insurance Status"
                                  value={(selectedDocumentVehicle as any).insuranceStatus || 'Adjusted'}
                                  info="Current insurance coverage status"
                                  trend={(selectedDocumentVehicle as any).insuranceStatus === 'Adjusted' ? 'good' : 'neutral'}
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Mechanical Assessment */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-400">
                                <Wrench className="h-5 w-5" />
                                Mechanical Assessment
                              </h3>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="rounded-lg border p-3">
                                <div className="font-medium">Diagnosis Summary</div>
                                <div className="text-sm mt-1 text-muted-foreground">
                                  {(selectedDocumentVehicle as any).diagnosisSummary || 'Major transmission failure requiring complete replacement. Vehicle cannot be driven safely.'}
                                </div>
                              </div>
                            
                              <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="required-parts">
                                  <AccordionTrigger className="text-sm">Required Parts</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-3">
                                      <div className="border rounded-lg divide-y">
                                        <div className="p-3 flex justify-between items-center">
                                          <span>Transmission Assembly</span>
                                          <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                                            On Order
                                          </Badge>
                                        </div>
                                        <div className="p-3 flex justify-between items-center">
                                          <span>Clutch Kit</span>
                                          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                            In Stock
                                          </Badge>
                                        </div>
                                        <div className="p-3 flex justify-between items-center">
                                          <span>Gearbox Mount</span>
                                          <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                            Unavailable
                                          </Badge>
                                        </div>
                                      </div>
                                      <Button variant="outline" size="sm" className="w-full">
                                        <ListChecks className="h-4 w-4 mr-2" />
                                        View Complete Parts List
                                      </Button>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                                
                                <AccordionItem value="labor-requirements">
                                  <AccordionTrigger className="text-sm">Labor Requirements</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-3">
                                      <div className="rounded-lg border p-3">
                                        <div className="font-medium">Specialized Skills Required</div>
                                        <div className="text-sm mt-1 text-muted-foreground">
                                          Transmission specialist with experience in this specific vehicle model required. Estimated labor hours: 12-16 hours.
                                        </div>
                                      </div>
                                      <div className="rounded-lg border p-3">
                                        <div className="font-medium">Workshop Requirements</div>
                                        <div className="text-sm mt-1 text-muted-foreground">
                                          Hydraulic lift, transmission jack, and specialized diagnostics equipment needed.
                                        </div>
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                                
                                <AccordionItem value="expert-opinions">
                                  <AccordionTrigger className="text-sm">Expert Opinions</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-3">
                                      <div className="rounded-lg border p-3">
                                        <div className="font-medium">Authorized Service Center</div>
                                        <div className="text-sm mt-1 text-muted-foreground">
                                          "Complete transmission replacement recommended. Vehicle has exceeded warranty period, but may qualify for goodwill assistance from manufacturer."
                                        </div>
                                      </div>
                                      <div className="rounded-lg border p-3">
                                        <div className="font-medium">Independent Specialist</div>
                                        <div className="text-sm mt-1 text-muted-foreground">
                                          "Transmission rebuild possible at 40% lower cost than replacement, but would require 3-4 week lead time."
                                        </div>
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </div>
                          </div>
                          
                          {/* Financial Assessment */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-400">
                                <IndianRupee className="h-5 w-5" />
                                Financial Assessment
                              </h3>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="rounded-lg border p-3">
                                <div className="font-medium">Comprehensive Repair Estimate</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span>Parts</span>
                                      <span>₹75,000</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Labor</span>
                                      <span>₹25,000</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Diagnostics</span>
                                      <span>₹5,000</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium pt-2 border-t">
                                      <span>Total Estimate</span>
                                      <span>₹105,000</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span>Current Value</span>
                                      <span>₹340,000</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Repair Cost %</span>
                                      <span>31%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Salvage Value</span>
                                      <span>₹180,000</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            
                              <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="cost-benefit-analysis">
                                  <AccordionTrigger className="text-sm">Cost-Benefit Analysis</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-3">
                                      <div className="rounded-lg border p-3">
                                        <div className="font-medium">Repair Option</div>
                                        <div className="text-sm mt-1 text-muted-foreground">
                                          <p>Investment: ₹105,000</p>
                                          <p>Extended vehicle life: Est. 3-5 years</p>
                                          <p>Resale value after repair: ₹320,000 (6% loss)</p>
                                          <p>Monthly cost: ₹2,100 (over 48 months)</p>
                                        </div>
                                      </div>
                                      <div className="rounded-lg border p-3">
                                        <div className="font-medium">Replace Option</div>
                                        <div className="text-sm mt-1 text-muted-foreground">
                                          <p>New vehicle cost: ₹650,000</p>
                                          <p>Less salvage value: ₹180,000</p>
                                          <p>Net investment: ₹470,000</p>
                                          <p>Monthly cost: ₹9,800 (over 48 months)</p>
                                        </div>
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                                
                                <AccordionItem value="financing-options">
                                  <AccordionTrigger className="text-sm">Financing Options</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-3">
                                      <div className="rounded-lg border p-3">
                                        <div className="font-medium">Service Center Financing</div>
                                        <div className="text-sm mt-1 text-muted-foreground">
                                          <p>6 months no-interest payment plan</p>
                                          <p>₹17,500 per month for 6 months</p>
                                        </div>
                                      </div>
                                      <div className="rounded-lg border p-3">
                                        <div className="font-medium">Bank Personal Loan</div>
                                        <div className="text-sm mt-1 text-muted-foreground">
                                          <p>10.5% interest rate</p>
                                          <p>₹3,400 per month for 36 months</p>
                                          <p>Total interest: ₹17,400</p>
                                        </div>
                                      </div>
                                      <div className="rounded-lg border p-3">
                                        <div className="font-medium">Credit Card</div>
                                        <div className="text-sm mt-1 text-muted-foreground">
                                          <p>12-month EMI option</p>
                                          <p>₹9,200 per month for 12 months</p>
                                          <p>Includes processing fee of ₹5,400</p>
                                        </div>
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </div>
                          </div>
                          
                          {/* Resolution Planning */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-400">
                                <BarChart3 className="h-5 w-5" />
                                Resolution Planning
                              </h3>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="rounded-lg border p-3">
                                <div className="font-medium">Decision Timeline</div>
                                <div className="text-sm mt-1 text-muted-foreground">
                                  <p>Decision deadline: May 15, 2025</p>
                                  <p>Insurance adjustment expires: June 1, 2025</p>
                                  <p>Recommended action by: May 10, 2025</p>
                                </div>
                              </div>
                              
                              <div className="rounded-lg border p-3">
                                <div className="flex justify-between">
                                  <div className="font-medium">Repair Timeline</div>
                                  <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                                    Recommended
                                  </Badge>
                                </div>
                                <div className="space-y-3 mt-3">
                                  <div className="relative pl-5 pb-3 border-l-2 border-slate-200 dark:border-slate-800">
                                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-slate-500"></div>
                                    <p className="text-xs font-medium">Parts Ordering</p>
                                    <p className="text-xs text-gray-500">May 10-15, 2025</p>
                                  </div>
                                  <div className="relative pl-5 pb-3 border-l-2 border-slate-200 dark:border-slate-800">
                                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-slate-300"></div>
                                    <p className="text-xs font-medium">Repair Work</p>
                                    <p className="text-xs text-gray-500">May 20-30, 2025</p>
                                  </div>
                                  <div className="relative pl-5">
                                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-green-500"></div>
                                    <p className="text-xs font-medium">Return to Service</p>
                                    <p className="text-xs text-gray-500">June 5, 2025</p>
                                  </div>
                                </div>
                              </div>
                              
                              <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="alternative-arrangements">
                                  <AccordionTrigger className="text-sm">Alternative Vehicle Arrangements</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-3">
                                      <div className="border rounded-lg divide-y">
                                        <div className="p-3 flex justify-between items-center">
                                          <span>Rental Car</span>
                                          <div className="text-right">
                                            <div className="text-xs">₹2,500/day</div>
                                            <div className="text-xs text-slate-500">Insurance covered: 15 days</div>
                                          </div>
                                        </div>
                                        <div className="p-3 flex justify-between items-center">
                                          <span>Rideshare Services</span>
                                          <div className="text-right">
                                            <div className="text-xs">Est. ₹800/day</div>
                                            <div className="text-xs text-slate-500">Based on typical usage</div>
                                          </div>
                                        </div>
                                        <div className="p-3 flex justify-between items-center">
                                          <span>Temporary Lease</span>
                                          <div className="text-right">
                                            <div className="text-xs">₹25,000/month</div>
                                            <div className="text-xs text-slate-500">3-month minimum</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                                
                                <AccordionItem value="specialists">
                                  <AccordionTrigger className="text-sm">Recommended Specialists</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-3">
                                      <div className="border rounded-lg divide-y">
                                        <div className="p-3 flex justify-between items-center">
                                          <div>
                                            <div className="font-medium">Automotive Transmission Experts</div>
                                            <div className="text-xs text-slate-500">Authorized dealer service center</div>
                                          </div>
                                          <Button variant="outline" size="sm">Contact</Button>
                                        </div>
                                        <div className="p-3 flex justify-between items-center">
                                          <div>
                                            <div className="font-medium">Precision Auto Works</div>
                                            <div className="text-xs text-slate-500">Independent transmission specialist</div>
                                          </div>
                                          <Button variant="outline" size="sm">Contact</Button>
                                        </div>
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 justify-end mt-6">
                            <Button variant="outline" className="gap-2">
                              <Download className="h-4 w-4" />
                              Export Assessment
                            </Button>
                            <Button variant="outline" className="gap-2">
                              <Share2 className="h-4 w-4" />
                              Share with Mechanic
                            </Button>
                            <Button className="gap-2 bg-slate-600 hover:bg-slate-700">
                              <CheckCircle className="h-4 w-4" />
                              Approve Repair
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Garage Stored Documents Section */}
                  {selectedStatus === 'Garage Stored' && (
                    <>
                      {!selectedDocumentVehicle ? (
                        // Vehicle Selection State for Garage Stored
                        <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-6 mb-6">
                          <h3 className="text-lg font-semibold text-center mb-4 text-sky-700 dark:text-sky-400">Select a Garage Stored Vehicle</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {vehicleData
                              .filter(vehicle => (vehicle as any).status === 'Garage Stored')
                              .map((vehicle) => (
                                <Card 
                                  key={vehicle.id} 
                                  className={`cursor-pointer transition-all hover:shadow-md border-2 ${selectedDocumentVehicle?.id === vehicle.id ? 'border-sky-500 dark:border-sky-400' : 'border-transparent'}`}
                                  onClick={() => setSelectedDocumentVehicle(vehicle)}
                                >
                                  <CardContent className="p-4">
                                    <div className="aspect-video w-full overflow-hidden rounded-md mb-3 relative">
                                      <img 
                                        src={vehicle.image} 
                                        alt={vehicle.vehicle} 
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute top-2 right-2 bg-sky-500 text-white text-xs px-2 py-1 rounded-full">
                                        Stored
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <h4 className="font-semibold">{vehicle.vehicle}</h4>
                                      <p className="text-xs text-slate-500">{vehicle.registrationNumber}</p>
                                      <div className="flex justify-between items-center">
                                        <Badge variant="outline" className="text-xs px-2 py-0 bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400">
                                          {vehicle.fuelType}
                                        </Badge>
                                        <p className="text-xs text-slate-500">Since: {(vehicle as any).storageStartDate}</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        </div>
                      ) : (
                        // Garage Stored Vehicle Documents Display
                        <div className="space-y-6">
                          <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-4 mb-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-full bg-sky-200 dark:bg-sky-800 flex items-center justify-center">
                                <Warehouse className="h-6 w-6 text-sky-700 dark:text-sky-400" />
                              </div>
                              <div>
                                <h3 className="font-semibold flex items-center gap-2">
                                  {selectedDocumentVehicle.vehicle}
                                  <AnimatedStatusTransition 
                                    currentStatus="Garage Stored"
                                    size="sm"
                                  />
                                </h3>
                                <p className="text-xs text-slate-500">{selectedDocumentVehicle.registrationNumber}</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setSelectedDocumentVehicle(null)}>
                              Change Vehicle
                            </Button>
                          </div>
                          
                          {/* Storage Facility Details */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-sky-50 dark:bg-sky-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-sky-700 dark:text-sky-400">
                                <Warehouse className="h-5 w-5" />
                                Storage Facility Details
                                <ContextualHelpTooltip tipType="storage" />
                              </h3>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Storage Location</h4>
                                  <p className="text-xs text-gray-500">Facility information and access details</p>
                                  <p className="text-xs mt-1 text-slate-700 dark:text-slate-300">
                                    {(selectedDocumentVehicle as any).storageLocation || 'Premium Auto Storage, Block A, Unit 16, Gurgaon'}
                                  </p>
                                  <Button variant="outline" size="sm" className="justify-start mt-2">
                                    <MapPin className="h-4 w-4 mr-2 text-red-500" />
                                    View Location
                                  </Button>
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Facility Security</h4>
                                  <p className="text-xs text-gray-500">Security features of the storage facility</p>
                                  <div className="mt-2 grid grid-cols-2 gap-2">
                                    <Badge variant="outline" className="justify-start bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                      24/7 CCTV
                                    </Badge>
                                    <Badge variant="outline" className="justify-start bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                      Gated Access
                                    </Badge>
                                    <Badge variant="outline" className="justify-start bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                      Fire System
                                    </Badge>
                                    <Badge variant="outline" className="justify-start bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                      Security Guards
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <Separator className="my-2" />
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InteractiveDataPoint
                                  label="Storage Start Date"
                                  value={(selectedDocumentVehicle as any).storageStartDate || 'January 15, 2025'}
                                  info="Date when vehicle was placed in storage"
                                />
                                
                                <InteractiveDataPoint
                                  label="Contract Duration"
                                  value={(selectedDocumentVehicle as any).storageDuration || '12 months'}
                                  info="Length of the storage contract"
                                />
                                
                                <InteractiveDataPoint
                                  label="Monthly Cost"
                                  value={(selectedDocumentVehicle as any).storageCost || '₹7,500'}
                                  info="Monthly fee for storage service"
                                />
                              </div>
                              
                              <div className="rounded-lg border p-3 mt-4">
                                <div className="font-medium flex justify-between">
                                  <span>Climate Control Specifications</span>
                                  <Badge variant="outline" className="bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400">
                                    Premium
                                  </Badge>
                                </div>
                                <div className="text-sm mt-1 text-muted-foreground">
                                  Temperature maintained between 18-22°C year-round. Humidity controlled at 40-45%. Daily monitoring and alerts for any deviations from optimal conditions.
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Vehicle Preparation Documents */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-sky-50 dark:bg-sky-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-sky-700 dark:text-sky-400">
                                <ClipboardCheck className="h-5 w-5" />
                                Vehicle Preparation
                              </h3>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="rounded-lg border p-3">
                                <div className="font-medium">Pre-storage Maintenance</div>
                                <div className="text-sm mt-2 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>Full fluid change completed</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>Fresh fuel with stabilizer added</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>Battery on trickle charger</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>Tire pressure adjusted for storage</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>Interior detailing completed</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <X className="h-4 w-4 text-red-500" />
                                    <span>Paint protection film application</span>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm" className="w-full mt-3">
                                  <FileText className="h-4 w-4 mr-2" />
                                  View Complete Checklist
                                </Button>
                              </div>
                            
                              <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="fluid-levels">
                                  <AccordionTrigger className="text-sm">Fluid Levels and Condition</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-3">
                                      <div className="border rounded-lg divide-y">
                                        <div className="p-3 flex justify-between items-center">
                                          <span>Engine Oil</span>
                                          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                            New - Synthetic 5W-30
                                          </Badge>
                                        </div>
                                        <div className="p-3 flex justify-between items-center">
                                          <span>Coolant</span>
                                          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                            Filled - Long Life
                                          </Badge>
                                        </div>
                                        <div className="p-3 flex justify-between items-center">
                                          <span>Brake Fluid</span>
                                          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                            Changed - DOT4
                                          </Badge>
                                        </div>
                                        <div className="p-3 flex justify-between items-center">
                                          <span>Power Steering</span>
                                          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                            Checked - Full
                                          </Badge>
                                        </div>
                                        <div className="p-3 flex justify-between items-center">
                                          <span>Fuel Tank</span>
                                          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                            95% Full + Stabilizer
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                                
                                <AccordionItem value="battery-maintenance">
                                  <AccordionTrigger className="text-sm">Battery Maintenance Protocol</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-3">
                                      <div className="rounded-lg border p-3">
                                        <div className="font-medium">Battery Management</div>
                                        <div className="text-sm mt-1 text-muted-foreground">
                                          Battery disconnected from negative terminal. Professional-grade CTEK trickle charger connected to maintain optimal charge. Monthly battery health check scheduled.
                                        </div>
                                      </div>
                                      <div className="rounded-lg border p-3">
                                        <div className="font-medium">Electronic Systems Protection</div>
                                        <div className="text-sm mt-1 text-muted-foreground">
                                          Memory settings backed up. ECU and electronic modules protected with surge protectors. Climate controlled environment prevents circuit deterioration.
                                        </div>
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </div>
                          </div>
                          
                          {/* Preservation Measures */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-sky-50 dark:bg-sky-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-sky-700 dark:text-sky-400">
                                <Shield className="h-5 w-5" />
                                Preservation Measures
                              </h3>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-lg border p-3">
                                  <div className="font-medium">Vehicle Cover</div>
                                  <div className="text-sm mt-1 text-muted-foreground">
                                    Premium breathable fabric cover with soft inner lining. Custom fit for vehicle model. UV protection and water resistance. Includes tie-down straps for secure fit.
                                  </div>
                                </div>
                                
                                <div className="rounded-lg border p-3">
                                  <div className="font-medium">Humidity Control</div>
                                  <div className="text-sm mt-1 text-muted-foreground">
                                    Facility equipped with industrial dehumidifiers. Silica gel packets placed inside vehicle. Humidity monitoring system with alerts for optimal preservation.
                                  </div>
                                </div>
                              </div>
                            
                              <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="pest-prevention">
                                  <AccordionTrigger className="text-sm">Pest Prevention Measures</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-3">
                                      <div className="rounded-lg border p-3">
                                        <div className="font-medium">Rodent Protection</div>
                                        <div className="text-sm mt-1 text-muted-foreground">
                                          Vehicle undercarriage treated with natural rodent repellent. Ultrasonic pest deterrent devices placed in storage area. Monthly rodent trap inspections. All potential entry points sealed.
                                        </div>
                                      </div>
                                      <div className="rounded-lg border p-3">
                                        <div className="font-medium">Insect Control</div>
                                        <div className="text-sm mt-1 text-muted-foreground">
                                          Quarterly professional pest control service. Moth balls placed strategically in interior. Air vents and intakes sealed with breathable mesh covers.
                                        </div>
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                                
                                <AccordionItem value="component-rotation">
                                  <AccordionTrigger className="text-sm">Component Rotation Schedule</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-3">
                                      <div className="border rounded-lg divide-y">
                                        <div className="p-3 flex justify-between items-center">
                                          <span>Engine Start & Run</span>
                                          <Badge variant="outline" className="bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400">
                                            Monthly
                                          </Badge>
                                        </div>
                                        <div className="p-3 flex justify-between items-center">
                                          <span>Transmission Engagement</span>
                                          <Badge variant="outline" className="bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400">
                                            Quarterly
                                          </Badge>
                                        </div>
                                        <div className="p-3 flex justify-between items-center">
                                          <span>Brake System Operation</span>
                                          <Badge variant="outline" className="bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400">
                                            Quarterly
                                          </Badge>
                                        </div>
                                        <div className="p-3 flex justify-between items-center">
                                          <span>Steering System Movement</span>
                                          <Badge variant="outline" className="bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400">
                                            Quarterly
                                          </Badge>
                                        </div>
                                        <div className="p-3 flex justify-between items-center">
                                          <span>Tire Rotation</span>
                                          <Badge variant="outline" className="bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400">
                                            Biannually
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="text-xs text-slate-500 mt-2">
                                        Next scheduled rotation service: May 15, 2025
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                                
                                <AccordionItem value="anti-rust">
                                  <AccordionTrigger className="text-sm">Anti-Rust Application</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-3">
                                      <div className="rounded-lg border p-3">
                                        <div className="font-medium">Undercarriage Protection</div>
                                        <div className="text-sm mt-1 text-muted-foreground">
                                          Complete undercarriage treated with premium rust-preventive coating. Special attention to suspension components, exhaust system, and frame rails.
                                        </div>
                                      </div>
                                      <div className="rounded-lg border p-3">
                                        <div className="font-medium">Exposed Metal Surfaces</div>
                                        <div className="text-sm mt-1 text-muted-foreground">
                                          All exposed metal components treated with protective wax coating. Chrome surfaces treated with specialized metal preservative.
                                        </div>
                                      </div>
                                      <div className="text-xs text-slate-500 mt-2">
                                        Anti-rust reapplication scheduled for: October 15, 2025
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </div>
                          </div>
                          
                          {/* Inspection Schedule */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-sky-50 dark:bg-sky-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-sky-700 dark:text-sky-400">
                                <CalendarCheck className="h-5 w-5" />
                                Inspection Schedule
                              </h3>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="space-y-3">
                                <div className="font-medium">Upcoming Inspections</div>
                                <div className="border rounded-lg divide-y">
                                  <div className="p-3 flex justify-between items-center">
                                    <div>
                                      <div className="font-medium">Monthly Visual Check</div>
                                      <div className="text-xs text-slate-500">Basic condition inspection</div>
                                    </div>
                                    <Badge variant="outline" className="bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400">
                                      May 15, 2025
                                    </Badge>
                                  </div>
                                  <div className="p-3 flex justify-between items-center">
                                    <div>
                                      <div className="font-medium">Quarterly Detailed Inspection</div>
                                      <div className="text-xs text-slate-500">Comprehensive check with documentation</div>
                                    </div>
                                    <Badge variant="outline" className="bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400">
                                      Jul 15, 2025
                                    </Badge>
                                  </div>
                                  <div className="p-3 flex justify-between items-center">
                                    <div>
                                      <div className="font-medium">Engine Start & Run Test</div>
                                      <div className="text-xs text-slate-500">30-minute operational test</div>
                                    </div>
                                    <Badge variant="outline" className="bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400">
                                      May 15, 2025
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="rounded-lg border p-3">
                                <div className="font-medium">Inspection Documentation</div>
                                <div className="text-sm mt-1 text-muted-foreground">
                                  All inspections include detailed photography for comparison over time. Reports are stored digitally and accessible through your account. Notifications sent 3 days before scheduled inspection.
                                </div>
                              </div>
                              
                              <Button variant="outline" size="sm" className="w-full">
                                <Calendar className="h-4 w-4 mr-2" />
                                Manage Inspection Schedule
                              </Button>
                            </div>
                          </div>
                          
                          {/* Insurance During Storage */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-sky-50 dark:bg-sky-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-sky-700 dark:text-sky-400">
                                <ShieldCheck className="h-5 w-5" />
                                Insurance During Storage
                              </h3>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-lg border p-3">
                                  <div className="font-medium">Modified Coverage</div>
                                  <div className="text-sm mt-1 text-muted-foreground">
                                    Insurance policy modified to "Laid Up" coverage status. Comprehensive protection maintained for fire, theft, vandalism, and natural disasters. Road liability coverage suspended during storage period.
                                  </div>
                                </div>
                                
                                <div className="rounded-lg border p-3">
                                  <div className="font-medium">Facility Insurance</div>
                                  <div className="text-sm mt-1 text-muted-foreground">
                                    Storage facility provides additional coverage up to ₹15,00,000 for damages occurring while in their care. Coverage includes fire, structural damage, water damage, and theft from premises.
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="font-medium">Premium Savings</div>
                                <div className="border rounded-lg divide-y">
                                  <div className="p-3 flex justify-between items-center">
                                    <div>Regular Annual Premium</div>
                                    <div className="font-medium">₹24,000</div>
                                  </div>
                                  <div className="p-3 flex justify-between items-center">
                                    <div>Storage Annual Premium</div>
                                    <div className="font-medium text-green-600">₹12,500</div>
                                  </div>
                                  <div className="p-3 flex justify-between items-center bg-green-50 dark:bg-green-900/10">
                                    <div className="font-medium">Annual Savings</div>
                                    <div className="font-medium text-green-600">₹11,500</div>
                                  </div>
                                </div>
                              </div>
                              
                              <Button variant="outline" size="sm" className="w-full">
                                <FileText className="h-4 w-4 mr-2" />
                                View Insurance Certificate
                              </Button>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 justify-end mt-6">
                            <Button variant="outline" className="gap-2">
                              <Download className="h-4 w-4" />
                              Export Storage Documents
                            </Button>
                            <Button variant="outline" className="gap-2">
                              <FileEdit className="h-4 w-4" />
                              Update Storage Details
                            </Button>
                            <Button className="gap-2 bg-sky-600 hover:bg-sky-700">
                              <Car className="h-4 w-4" />
                              Schedule Activation
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Commercial Fleet Documents Section */}
                  {selectedStatus === 'Commercial Fleet' && (
                    <>
                      {!selectedDocumentVehicle ? (
                        // Vehicle Selection State for Commercial Fleet
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 mb-6">
                          <h3 className="text-lg font-semibold text-center mb-4 text-purple-700 dark:text-purple-400">Select a Commercial Fleet Vehicle</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {vehicleData
                              .filter(vehicle => vehicle.status === 'Commercial Fleet' || (vehicle.fleetID !== undefined))
                              .map((vehicle) => (
                                <Card 
                                  key={vehicle.id} 
                                  className={`cursor-pointer transition-all hover:shadow-md border-2 ${selectedDocumentVehicle?.id === vehicle.id ? 'border-purple-500 dark:border-purple-400' : 'border-transparent'}`}
                                  onClick={() => setSelectedDocumentVehicle(vehicle)}
                                >
                                  <CardContent className="p-4">
                                    <div className="aspect-video w-full overflow-hidden rounded-md mb-3 relative">
                                      <img 
                                        src={vehicle.image} 
                                        alt={vehicle.vehicle} 
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                                        Fleet
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <h4 className="font-semibold">{vehicle.vehicle}</h4>
                                      <p className="text-xs text-slate-500">{vehicle.registrationNumber}</p>
                                      <div className="flex justify-between items-center">
                                        <Badge variant="outline" className="text-xs px-2 py-0 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                                          {vehicle.fuelType}
                                        </Badge>
                                        <p className="text-xs text-slate-500">Fleet ID: {(vehicle as any).fleetID}</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        </div>
                      ) : (
                        // Commercial Fleet Vehicle Documents Display
                        <div className="space-y-6">
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={selectedDocumentVehicle.image} />
                                <AvatarFallback>{selectedDocumentVehicle.vehicle.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{selectedDocumentVehicle.vehicle}</h3>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-slate-500">{selectedDocumentVehicle.registrationNumber}</p>
                                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">Commercial Fleet</Badge>
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedDocumentVehicle(null)}
                              className="text-purple-700 dark:text-purple-400"
                            >
                              Change Vehicle
                            </Button>
                          </div>
                          
                          {/* Fleet Documentation */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-700 dark:text-purple-400">
                                <Building2 className="h-5 w-5" />
                                Fleet Documentation
                              </h3>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-purple-700 dark:text-purple-400">
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Fleet Assignment</h4>
                                  <p className="text-xs text-gray-500">Vehicle fleet information</p>
                                  <div className="mt-2 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Building2 className="h-4 w-4 text-purple-500" />
                                      <p className="text-xs font-medium">Fleet ID: <span className="font-normal">{(selectedDocumentVehicle as any).fleetID}</span></p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Truck className="h-4 w-4 text-purple-500" />
                                      <p className="text-xs font-medium">Route: <span className="font-normal">{(selectedDocumentVehicle as any).routeAssignment}</span></p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Scale className="h-4 w-4 text-purple-500" />
                                      <p className="text-xs font-medium">Load Capacity: <span className="font-normal">{(selectedDocumentVehicle as any).loadCapacity}</span></p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Driver Information</h4>
                                  <p className="text-xs text-gray-500">Assigned driver details</p>
                                  <div className="mt-2 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <UserCircle className="h-4 w-4 text-purple-500" />
                                      <p className="text-xs font-medium">Driver: <span className="font-normal">{(selectedDocumentVehicle as any).driver}</span></p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <BadgeCheck className="h-4 w-4 text-purple-500" />
                                      <p className="text-xs font-medium">License: <span className="font-normal">{(selectedDocumentVehicle as any).driverLicense}</span></p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <PhoneCall className="h-4 w-4 text-purple-500" />
                                      <p className="text-xs font-medium">Contact: <span className="font-normal">{(selectedDocumentVehicle as any).driverContact}</span></p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                                <h4 className="text-sm font-medium mb-3">Commercial Documentation</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <Button variant="outline" size="sm" className="justify-start">
                                    <FileText className="h-4 w-4 mr-2 text-purple-500" />
                                    Commercial Permit
                                  </Button>
                                  <Button variant="outline" size="sm" className="justify-start">
                                    <FileText className="h-4 w-4 mr-2 text-purple-500" />
                                    GPS Tracking Details
                                  </Button>
                                  <Button variant="outline" size="sm" className="justify-start">
                                    <FileText className="h-4 w-4 mr-2 text-purple-500" />
                                    Route & Schedule
                                  </Button>
                                  <Button variant="outline" size="sm" className="justify-start">
                                    <FileText className="h-4 w-4 mr-2 text-purple-500" />
                                    Daily Run Logs
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Operating Costs */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-700 dark:text-purple-400">
                                <IndianRupee className="h-5 w-5" />
                                Operating Costs
                              </h3>
                            </div>
                            <div className="p-4">
                              <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                  <span className="text-sm">Daily Running Cost</span>
                                  <span className="font-medium">₹{(selectedDocumentVehicle as any).dailyRunningCost}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                  <span className="text-sm">Maintenance Cost (YTD)</span>
                                  <span className="font-medium">₹{selectedDocumentVehicle.maintenanceCost}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                  <span className="text-sm">Fuel Economy</span>
                                  <span className="font-medium">{selectedDocumentVehicle.efficiency}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 justify-end mt-6">
                            <Button variant="outline" className="gap-2">
                              <Download className="h-4 w-4" />
                              Export Fleet Documents
                            </Button>
                            <Button variant="outline" className="gap-2">
                              <FileEdit className="h-4 w-4" />
                              Update Assignment
                            </Button>
                            <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                              <MapPin className="h-4 w-4" />
                              Track Vehicle
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Leased Out Documents Section */}
                  {selectedStatus === 'Leased Out' && (
                    <>
                      {!selectedDocumentVehicle ? (
                        // Vehicle Selection State for Leased Out
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-6 mb-6">
                          <h3 className="text-lg font-semibold text-center mb-4 text-emerald-700 dark:text-emerald-400">Select a Leased Out Vehicle</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {vehicleData
                              .filter(vehicle => vehicle.status === 'Leased Out' || (vehicle.leaseStartDate !== undefined))
                              .map((vehicle) => (
                                <Card 
                                  key={vehicle.id} 
                                  className={`cursor-pointer transition-all hover:shadow-md border-2 ${selectedDocumentVehicle?.id === vehicle.id ? 'border-emerald-500 dark:border-emerald-400' : 'border-transparent'}`}
                                  onClick={() => setSelectedDocumentVehicle(vehicle)}
                                >
                                  <CardContent className="p-4">
                                    <div className="aspect-video w-full overflow-hidden rounded-md mb-3 relative">
                                      <img 
                                        src={vehicle.image} 
                                        alt={vehicle.vehicle} 
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                                        Leased
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <h4 className="font-semibold">{vehicle.vehicle}</h4>
                                      <p className="text-xs text-slate-500">{vehicle.registrationNumber}</p>
                                      <div className="flex justify-between items-center">
                                        <Badge variant="outline" className="text-xs px-2 py-0 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                                          {vehicle.fuelType}
                                        </Badge>
                                        <p className="text-xs text-slate-500">To: {(vehicle as any).leasedTo?.split(' ')[0]}</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        </div>
                      ) : (
                        // Leased Out Vehicle Documents Display
                        <div className="space-y-6">
                          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 mb-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={selectedDocumentVehicle.image} />
                                <AvatarFallback>{selectedDocumentVehicle.vehicle.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{selectedDocumentVehicle.vehicle}</h3>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-slate-500">{selectedDocumentVehicle.registrationNumber}</p>
                                  <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">Leased Out</Badge>
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedDocumentVehicle(null)}
                              className="text-emerald-700 dark:text-emerald-400"
                            >
                              Change Vehicle
                            </Button>
                          </div>
                          
                          {/* Lease Documentation */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                <KeyRound className="h-5 w-5" />
                                Lease Documentation
                              </h3>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-emerald-700 dark:text-emerald-400">
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Lease Details</h4>
                                  <p className="text-xs text-gray-500">Active lease information</p>
                                  <div className="mt-2 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-emerald-500" />
                                      <p className="text-xs font-medium">Start Date: <span className="font-normal">{(selectedDocumentVehicle as any).leaseStartDate}</span></p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-emerald-500" />
                                      <p className="text-xs font-medium">Duration: <span className="font-normal">{(selectedDocumentVehicle as any).leaseDuration}</span></p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Building2 className="h-4 w-4 text-emerald-500" />
                                      <p className="text-xs font-medium">Leased To: <span className="font-normal">{(selectedDocumentVehicle as any).leasedTo}</span></p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Financial Details</h4>
                                  <p className="text-xs text-gray-500">Lease payment information</p>
                                  <div className="mt-2 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <IndianRupee className="h-4 w-4 text-emerald-500" />
                                      <p className="text-xs font-medium">Amount: <span className="font-normal">{(selectedDocumentVehicle as any).leaseAmount}</span></p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <CreditCard className="h-4 w-4 text-emerald-500" />
                                      <p className="text-xs font-medium">Security Deposit: <span className="font-normal">{(selectedDocumentVehicle as any).securityDeposit}</span></p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Route className="h-4 w-4 text-emerald-500" />
                                      <p className="text-xs font-medium">KM Limit: <span className="font-normal">{(selectedDocumentVehicle as any).kmLimit}</span></p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                                <h4 className="text-sm font-medium mb-3">Lease Agreement</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <Button variant="outline" size="sm" className="justify-start">
                                    <FileText className="h-4 w-4 mr-2 text-emerald-500" />
                                    Lease Agreement #{(selectedDocumentVehicle as any).leaseAgreementNo}
                                  </Button>
                                  <Button variant="outline" size="sm" className="justify-start">
                                    <ListChecks className="h-4 w-4 mr-2 text-emerald-500" />
                                    Terms & Conditions
                                  </Button>
                                  <Button variant="outline" size="sm" className="justify-start">
                                    <FileText className="h-4 w-4 mr-2 text-emerald-500" />
                                    Vehicle Condition Report
                                  </Button>
                                  <Button variant="outline" size="sm" className="justify-start">
                                    <FileText className="h-4 w-4 mr-2 text-emerald-500" />
                                    Insurance Certificate
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Payment History */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                <CreditCard className="h-5 w-5" />
                                Payment History
                              </h3>
                            </div>
                            <div className="p-4">
                              <div className="divide-y">
                                <div className="flex justify-between items-center py-2">
                                  <div>
                                    <p className="text-sm font-medium">January 2025</p>
                                    <p className="text-xs text-gray-500">Paid on Jan 15, 2025</p>
                                  </div>
                                  <Badge variant="outline" className="bg-green-50 text-green-700">Paid</Badge>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                  <div>
                                    <p className="text-sm font-medium">February 2025</p>
                                    <p className="text-xs text-gray-500">Paid on Feb 15, 2025</p>
                                  </div>
                                  <Badge variant="outline" className="bg-green-50 text-green-700">Paid</Badge>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                  <div>
                                    <p className="text-sm font-medium">March 2025</p>
                                    <p className="text-xs text-gray-500">Paid on Mar 15, 2025</p>
                                  </div>
                                  <Badge variant="outline" className="bg-green-50 text-green-700">Paid</Badge>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                  <div>
                                    <p className="text-sm font-medium">April 2025</p>
                                    <p className="text-xs text-gray-500">Due on Apr 15, 2025</p>
                                  </div>
                                  <Badge variant="outline" className="bg-amber-50 text-amber-700">Upcoming</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 justify-end mt-6">
                            <Button variant="outline" className="gap-2">
                              <Download className="h-4 w-4" />
                              Export Lease Documents
                            </Button>
                            <Button variant="outline" className="gap-2">
                              <FileEdit className="h-4 w-4" />
                              Update Lease Terms
                            </Button>
                            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                              <ShieldCheck className="h-4 w-4" />
                              View Lease Status
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* For Sale Documents Section */}
                  {selectedStatus === 'For Sale' && (
                    <>
                      {!selectedDocumentVehicle ? (
                        // Vehicle Selection State for For Sale with enhanced details
                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 rounded-lg p-6 mb-6 border border-pink-100 dark:border-pink-900/20 shadow-sm">
                          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-center sm:text-left mb-3 sm:mb-0 text-pink-700 dark:text-pink-400 flex items-center gap-2">
                              <Tag className="h-5 w-5" />
                              Vehicles For Sale
                            </h3>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="text-xs flex items-center gap-1.5 border-pink-200 dark:border-pink-800">
                                <FilterX className="h-3.5 w-3.5" />
                                Filter
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs flex items-center gap-1.5 border-pink-200 dark:border-pink-800">
                                <ChevronsDown className="h-3.5 w-3.5" />
                                Sort by Price
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {vehicleData
                              .filter(vehicle => vehicle.status === 'For Sale' || (vehicle.listingDate !== undefined))
                              .map((vehicle) => (
                                <Card 
                                  key={vehicle.id} 
                                  className={`cursor-pointer transition-all hover:shadow-lg group ${selectedDocumentVehicle?.id === vehicle.id ? 'ring-2 ring-pink-500 dark:ring-pink-400' : 'hover:border-pink-300 dark:hover:border-pink-700'}`}
                                  onClick={() => setSelectedDocumentVehicle(vehicle)}
                                >
                                  <CardContent className="p-0 overflow-hidden">
                                    <div className="aspect-video w-full overflow-hidden relative">
                                      <img 
                                        src={vehicle.image} 
                                        alt={vehicle.vehicle} 
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                                      />
                                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
                                      <div className="absolute top-2 right-2 bg-pink-500 dark:bg-pink-600 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
                                        For Sale
                                      </div>
                                      <div className="absolute bottom-0 left-0 w-full p-3 text-white">
                                        <h4 className="font-semibold text-sm">{vehicle.vehicle}</h4>
                                        <div className="flex justify-between items-center mt-1">
                                          <Badge variant="secondary" className="text-xs bg-white/20 backdrop-blur-sm text-white hover:bg-white/30">
                                            {vehicle.fuelType}
                                          </Badge>
                                          <p className="text-sm font-semibold">{(vehicle as any).askingPrice}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="p-4 space-y-2">
                                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                                        <span>Reg: {vehicle.registrationNumber}</span>
                                        <span>{vehicle.mileage} km</span>
                                      </div>
                                      <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                          <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3 text-pink-500" />
                                            {(vehicle as any).listingDate}
                                          </span>
                                          <span className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3 text-pink-500" />
                                            {(vehicle as any).viewingLocation.split(',')[0]}
                                          </span>
                                        </div>
                                        <div className="flex items-center text-xs mt-1">
                                          {(vehicle as any).negotiable ? (
                                            <div className="flex items-center text-emerald-600 dark:text-emerald-500 gap-1 text-xs">
                                              <CheckCircle className="h-3 w-3" />
                                              Negotiable
                                            </div>
                                          ) : (
                                            <div className="flex items-center text-gray-500 gap-1 text-xs">
                                              <X className="h-3 w-3" />
                                              Fixed Price
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex justify-between">
                                          <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300">
                                            View Details
                                          </Button>
                                          <Button variant="ghost" size="sm" className="p-0 h-auto text-xs text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300">
                                            <Share2 className="h-3.5 w-3.5 mr-1" />
                                            Share
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                          
                          <div className="flex justify-center mt-6">
                            <Button variant="outline" className="text-pink-600 border-pink-200 dark:border-pink-800 dark:text-pink-400">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Vehicle For Sale
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // For Sale Vehicle Documents Display - Enhanced version
                        <div className="space-y-6">
                          <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 rounded-lg p-4 mb-6 flex justify-between items-center border border-pink-100 dark:border-pink-900/20 shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-12 w-12 border-2 border-pink-200 dark:border-pink-800">
                                  <AvatarImage src={selectedDocumentVehicle.image} />
                                  <AvatarFallback>{selectedDocumentVehicle.vehicle.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 bg-pink-500 h-5 w-5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                                  <Tag className="h-3 w-3 text-white" />
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{selectedDocumentVehicle.vehicle}</h3>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-slate-500">{selectedDocumentVehicle.registrationNumber}</p>
                                  <Badge variant="outline" className="text-xs bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400">For Sale</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" className="text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800">
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                View Listing
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setSelectedDocumentVehicle(null)}
                                className="text-pink-700 dark:text-pink-400"
                              >
                                Change Vehicle
                              </Button>
                            </div>
                          </div>
                          
                          {/* Enhanced Sale Details - Main Information Card */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                              <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 bg-pink-50 dark:bg-pink-900/20 border-b border-gray-200 dark:border-gray-800">
                                  <h3 className="text-lg font-semibold flex items-center gap-2 text-pink-700 dark:text-pink-400">
                                    <Tag className="h-5 w-5" />
                                    Sale Information
                                  </h3>
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-pink-700 dark:text-pink-400">
                                      <Download className="h-4 w-4" />
                                      <span className="sr-only">Download</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-pink-700 dark:text-pink-400">
                                      <Share2 className="h-4 w-4" />
                                      <span className="sr-only">Share</span>
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="p-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Listing Details */}
                                    <div>
                                      <h4 className="text-sm font-medium mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <Info className="h-4 w-4 text-pink-500" />
                                        Listing Details
                                      </h4>
                                      
                                      <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                                          <span className="text-sm text-gray-600 dark:text-gray-400">Listed On</span>
                                          <span className="text-sm font-medium">{(selectedDocumentVehicle as any).listingDate}</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                                          <span className="text-sm text-gray-600 dark:text-gray-400">Asking Price</span>
                                          <span className="text-lg font-bold text-pink-600 dark:text-pink-400">{(selectedDocumentVehicle as any).askingPrice}</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                                          <span className="text-sm text-gray-600 dark:text-gray-400">Price Negotiable</span>
                                          {(selectedDocumentVehicle as any).negotiable ? (
                                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">Yes</Badge>
                                          ) : (
                                            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">No</Badge>
                                          )}
                                        </div>
                                        
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                                          <span className="text-sm text-gray-600 dark:text-gray-400">Selling Reason</span>
                                          <span className="text-sm">{(selectedDocumentVehicle as any).sellingReason}</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                                          <span className="text-sm text-gray-600 dark:text-gray-400">Advertised On</span>
                                          <div className="flex flex-wrap gap-1">
                                            {(selectedDocumentVehicle as any).advertisedOn.split(', ').map((platform: string, index: number) => (
                                              <Badge key={index} variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-400">
                                                {platform}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Viewing & Contact Information */}
                                    <div>
                                      <h4 className="text-sm font-medium mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <MapPin className="h-4 w-4 text-pink-500" />
                                        Viewing & Contact
                                      </h4>
                                      
                                      <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                          <h5 className="text-sm font-medium mb-2">Location</h5>
                                          <p className="text-sm">{(selectedDocumentVehicle as any).viewingLocation}</p>
                                          <div className="mt-4 aspect-video bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                                            <MapPin className="h-6 w-6 text-gray-400" />
                                            <span className="text-xs text-gray-500 ml-2">Map view</span>
                                          </div>
                                        </div>
                                        
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                          <h5 className="text-sm font-medium mb-2">Contact Details</h5>
                                          <div className="flex items-center gap-2 mb-2">
                                            <UserCircle className="h-4 w-4 text-pink-500" />
                                            <p className="text-sm">{selectedDocumentVehicle.owner}</p>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <PhoneCall className="h-4 w-4 text-pink-500" />
                                            <p className="text-sm">{(selectedDocumentVehicle as any).sellerContact}</p>
                                          </div>
                                          <Button variant="outline" size="sm" className="w-full mt-3 text-pink-600 border-pink-200 dark:border-pink-800 dark:text-pink-400">
                                            <MessageSquare className="h-3.5 w-3.5 mr-1" />
                                            Contact Seller
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Document Gallery */}
                              <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mt-6">
                                <div className="flex items-center justify-between px-4 py-3 bg-pink-50 dark:bg-pink-900/20 border-b border-gray-200 dark:border-gray-800">
                                  <h3 className="text-lg font-semibold flex items-center gap-2 text-pink-700 dark:text-pink-400">
                                    <FileText className="h-5 w-5" />
                                    Sale Documents
                                  </h3>
                                </div>
                                <div className="p-6">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                      <div className="bg-pink-100 dark:bg-pink-900/20 p-2 rounded-md text-pink-600 dark:text-pink-400">
                                        <FileText className="h-5 w-5" />
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Vehicle Condition Report</h4>
                                        <p className="text-xs text-gray-500 mt-1">Detailed inspection of vehicle condition</p>
                                        <div className="flex items-center gap-1 mt-3">
                                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400">PDF</Badge>
                                          <span className="text-xs text-gray-500">•</span>
                                          <span className="text-xs text-gray-500">Generated {(selectedDocumentVehicle as any).listingDate}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                      <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-md text-purple-600 dark:text-purple-400">
                                        <FileText className="h-5 w-5" />
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Service History</h4>
                                        <p className="text-xs text-gray-500 mt-1">Complete service and maintenance records</p>
                                        <div className="flex items-center gap-1 mt-3">
                                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400">PDF</Badge>
                                          <span className="text-xs text-gray-500">•</span>
                                          <span className="text-xs text-gray-500">Last updated: {selectedDocumentVehicle.lastService}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                      <div className="bg-indigo-100 dark:bg-indigo-900/20 p-2 rounded-md text-indigo-600 dark:text-indigo-400">
                                        <FileText className="h-5 w-5" />
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Ownership Documents</h4>
                                        <p className="text-xs text-gray-500 mt-1">Registration certificate and insurance</p>
                                        <div className="flex items-center gap-1 mt-3">
                                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400">PDF</Badge>
                                          <span className="text-xs text-gray-500">•</span>
                                          <span className="text-xs text-gray-500">{(selectedDocumentVehicle as any).documentStatus}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                      <div className="bg-emerald-100 dark:bg-emerald-900/20 p-2 rounded-md text-emerald-600 dark:text-emerald-400">
                                        <FileText className="h-5 w-5" />
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium">Sale Agreement Template</h4>
                                        <p className="text-xs text-gray-500 mt-1">Ready-to-use legal agreement for sale</p>
                                        <div className="flex items-center gap-1 mt-3">
                                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400">DOCX</Badge>
                                          <span className="text-xs text-gray-500">•</span>
                                          <span className="text-xs text-gray-500">Editable template</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <Button variant="outline" size="sm" className="w-full mt-4 text-pink-600 border-pink-200 dark:border-pink-800 dark:text-pink-400">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add More Documents
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                            {/* Right Column - Vehicle Details & Marketing */}
                            <div>
                              {/* Vehicle Specs Card */}
                              <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mb-6">
                                <div className="px-4 py-3 bg-pink-50 dark:bg-pink-900/20 border-b border-gray-200 dark:border-gray-800">
                                  <h3 className="text-sm font-semibold flex items-center gap-2 text-pink-700 dark:text-pink-400">
                                    <Car className="h-4 w-4" />
                                    Vehicle Specifications
                                  </h3>
                                </div>
                                <div className="p-4">
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600 dark:text-gray-400">Model</span>
                                      <span className="font-medium">{selectedDocumentVehicle.vehicle}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600 dark:text-gray-400">Year</span>
                                      <span className="font-medium">{selectedDocumentVehicle.purchaseDate.split(', ')[1]}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600 dark:text-gray-400">Fuel Type</span>
                                      <span className="font-medium">{selectedDocumentVehicle.fuelType}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600 dark:text-gray-400">Odometer</span>
                                      <span className="font-medium">{selectedDocumentVehicle.mileage} km</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600 dark:text-gray-400">Engine Health</span>
                                      <div className="flex items-center gap-1">
                                        <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                          <div 
                                            className={`h-full rounded-full ${
                                              (selectedDocumentVehicle.engineHealth || 0) >= 90 ? 'bg-green-500' : 
                                              (selectedDocumentVehicle.engineHealth || 0) >= 70 ? 'bg-green-500' : 
                                              (selectedDocumentVehicle.engineHealth || 0) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${selectedDocumentVehicle.engineHealth || 0}%` }}
                                          ></div>
                                        </div>
                                        <span className="text-sm font-medium">{selectedDocumentVehicle.engineHealth || 0}%</span>
                                      </div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600 dark:text-gray-400">Efficiency</span>
                                      <span className="font-medium">{selectedDocumentVehicle.efficiency}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600 dark:text-gray-400">Last Service</span>
                                      <span className="font-medium">{selectedDocumentVehicle.lastService}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Marketing Gallery */}
                              <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                                <div className="px-4 py-3 bg-pink-50 dark:bg-pink-900/20 border-b border-gray-200 dark:border-gray-800">
                                  <h3 className="text-sm font-semibold flex items-center gap-2 text-pink-700 dark:text-pink-400">
                                    <ImageIcon className="h-4 w-4" />
                                    Marketing Gallery
                                  </h3>
                                </div>
                                <div className="p-4">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="aspect-square rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 relative group cursor-pointer">
                                      <img 
                                        src={selectedDocumentVehicle.image} 
                                        alt={`${selectedDocumentVehicle.vehicle} - Main`}
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="bg-white dark:bg-gray-800 rounded-full p-1">
                                          <Eye className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="aspect-square rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                      <Plus className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                                    </div>
                                    <div className="aspect-square rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                      <Plus className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                                    </div>
                                    <div className="aspect-square rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                      <Plus className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                                    </div>
                                  </div>
                                  
                                  <Button variant="outline" size="sm" className="w-full mt-4 text-pink-600 border-pink-200 dark:border-pink-800 dark:text-pink-400">
                                    <ImageIcon className="h-4 w-4 mr-2" />
                                    Manage Gallery
                                  </Button>
                                </div>
                              </div>
                              
                              {/* Buyer Interest */}
                              <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mt-6">
                                <div className="px-4 py-3 bg-pink-50 dark:bg-pink-900/20 border-b border-gray-200 dark:border-gray-800">
                                  <h3 className="text-sm font-semibold flex items-center gap-2 text-pink-700 dark:text-pink-400">
                                    <Users className="h-4 w-4" />
                                    Buyer Interest
                                  </h3>
                                </div>
                                <div className="p-4">
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="text-lg font-bold text-pink-600 dark:text-pink-400">3</div>
                                    <Badge variant="outline" className="bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800 dark:text-pink-400">
                                      New Inquiries
                                    </Badge>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                                      <Avatar className="h-8 w-8">
                                        <AvatarFallback>RK</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate">Rahul Kumar</p>
                                        <p className="text-xs text-gray-500 truncate">Interested in test drive</p>
                                      </div>
                                      <Badge className="text-xs bg-green-500">New</Badge>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                                      <Avatar className="h-8 w-8">
                                        <AvatarFallback>AS</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate">Ananya Singh</p>
                                        <p className="text-xs text-gray-500 truncate">Made an offer</p>
                                      </div>
                                      <Badge className="text-xs bg-amber-500">Offer</Badge>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                                      <Avatar className="h-8 w-8">
                                        <AvatarFallback>VK</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate">Vivek Kapoor</p>
                                        <p className="text-xs text-gray-500 truncate">Asked for documents</p>
                                      </div>
                                      <Badge className="text-xs bg-green-500">New</Badge>
                                    </div>
                                  </div>
                                  
                                  <Button variant="outline" size="sm" className="w-full mt-4 text-pink-600 border-pink-200 dark:border-pink-800 dark:text-pink-400">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    View All Inquiries
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 justify-end mt-6">
                            <Button variant="outline" className="gap-2 border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400">
                              <Share2 className="h-4 w-4" />
                              Share Listing
                            </Button>
                            <Button variant="outline" className="gap-2 border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400">
                              <Edit className="h-4 w-4" />
                              Edit Price & Details
                            </Button>
                            <Button className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-none">
                              <CheckCircle className="h-4 w-4" />
                              Mark as Sold
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Sold Documents Section */}
                  {selectedStatus === 'Sold' && (
                    <>
                      {!selectedDocumentVehicle ? (
                        // Vehicle Selection State for Sold
                        <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-6 mb-6">
                          <h3 className="text-lg font-semibold text-center mb-4 text-violet-700 dark:text-violet-400">Select a Sold Vehicle</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {vehicleData
                              .filter(vehicle => vehicle.status === 'Sold')
                              .map((vehicle) => (
                                <Card 
                                  key={vehicle.id} 
                                  className={`cursor-pointer transition-all hover:shadow-md border-2 ${selectedDocumentVehicle?.id === vehicle.id ? 'border-violet-500 dark:border-violet-400' : 'border-transparent'}`}
                                  onClick={() => setSelectedDocumentVehicle(vehicle)}
                                >
                                  <CardContent className="p-4">
                                    <div className="aspect-video w-full overflow-hidden rounded-md mb-3 relative">
                                      <img 
                                        src={vehicle.image} 
                                        alt={vehicle.vehicle} 
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute top-2 right-2 bg-violet-500 text-white text-xs px-2 py-1 rounded-full">
                                        Sold
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <h4 className="font-semibold">{vehicle.vehicle}</h4>
                                      <p className="text-xs text-slate-500">{vehicle.registrationNumber}</p>
                                      <div className="flex justify-between items-center">
                                        <Badge variant="outline" className="text-xs px-2 py-0 bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400">
                                          {vehicle.fuelType}
                                        </Badge>
                                        <p className="text-xs text-slate-500">Sold: Apr 2025</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        </div>
                      ) : (
                        // Sold Vehicle Documents Display
                        <div className="space-y-6">
                          <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-4 mb-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={selectedDocumentVehicle.image} />
                                <AvatarFallback>{selectedDocumentVehicle.vehicle.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{selectedDocumentVehicle.vehicle}</h3>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-slate-500">{selectedDocumentVehicle.registrationNumber}</p>
                                  <Badge variant="outline" className="text-xs bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400">Sold</Badge>
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedDocumentVehicle(null)}
                              className="text-violet-700 dark:text-violet-400"
                            >
                              Change Vehicle
                            </Button>
                          </div>
                          
                          {/* Sale Documentation */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-violet-50 dark:bg-violet-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-violet-700 dark:text-violet-400">
                                <CheckCircle className="h-5 w-5" />
                                Sale Documentation
                              </h3>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-violet-700 dark:text-violet-400">
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">Download</span>
                                </Button>
                              </div>
                            </div>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sale Details</h4>
                                  <p className="text-xs text-gray-500">Transaction information</p>
                                  <div className="mt-2 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-violet-500" />
                                      <p className="text-xs font-medium">Sale Date: <span className="font-normal">April 10, 2025</span></p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <IndianRupee className="h-4 w-4 text-violet-500" />
                                      <p className="text-xs font-medium">Sale Price: <span className="font-normal">₹650,000</span></p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <UserCircle className="h-4 w-4 text-violet-500" />
                                      <p className="text-xs font-medium">New Owner: <span className="font-normal">Priya Sharma</span></p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col space-y-1">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Transfer Status</h4>
                                  <p className="text-xs text-gray-500">Ownership transfer information</p>
                                  <div className="mt-2 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-violet-500" />
                                      <p className="text-xs font-medium">RC Transfer: <span className="font-normal">In Progress</span></p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-violet-500" />
                                      <p className="text-xs font-medium">Insurance Transfer: <span className="font-normal">Completed</span></p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-violet-500" />
                                      <p className="text-xs font-medium">Tax Payment: <span className="font-normal">Completed</span></p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                                <h4 className="text-sm font-medium mb-3">Sale Documents</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <Button variant="outline" size="sm" className="justify-start">
                                    <FileText className="h-4 w-4 mr-2 text-violet-500" />
                                    Sale Agreement
                                  </Button>
                                  <Button variant="outline" size="sm" className="justify-start">
                                    <FileText className="h-4 w-4 mr-2 text-violet-500" />
                                    Delivery Note
                                  </Button>
                                  <Button variant="outline" size="sm" className="justify-start">
                                    <FileText className="h-4 w-4 mr-2 text-violet-500" />
                                    Payment Receipt
                                  </Button>
                                  <Button variant="outline" size="sm" className="justify-start">
                                    <FileText className="h-4 w-4 mr-2 text-violet-500" />
                                    Transfer Forms
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Condition at Sale */}
                          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-violet-50 dark:bg-violet-900/20 border-b border-gray-200 dark:border-gray-800">
                              <h3 className="text-lg font-semibold flex items-center gap-2 text-violet-700 dark:text-violet-400">
                                <ClipboardCheck className="h-5 w-5" />
                                Condition at Sale
                              </h3>
                            </div>
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Vehicle Specifications</h4>
                                  <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Odometer Reading</span>
                                      <span>{selectedDocumentVehicle.mileage} km</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Engine Health</span>
                                      <span>{selectedDocumentVehicle.engineHealth}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Last Service</span>
                                      <span>{selectedDocumentVehicle.lastService}</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Inspection Details</h4>
                                  <Button variant="outline" size="sm" className="w-full justify-start">
                                    <FileText className="h-4 w-4 mr-2 text-violet-500" />
                                    View Pre-Sale Inspection Report
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 justify-end mt-6">
                            <Button variant="outline" className="gap-2">
                              <Download className="h-4 w-4" />
                              Export Sale Documents
                            </Button>
                            <Button variant="outline" className="gap-2">
                              <MessageSquare className="h-4 w-4" />
                              Contact Buyer
                            </Button>
                            <Button className="gap-2 bg-violet-600 hover:bg-violet-700">
                              <CheckCircle className="h-4 w-4" />
                              Complete Transfers
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {selectedStatus !== 'Active' && selectedStatus !== 'Recently Purchased' && 
                   selectedStatus !== 'In Maintenance' && selectedStatus !== 'Pre-Owned' &&
                   selectedStatus !== 'Out of Service' && selectedStatus !== 'Garage Stored' && 
                   selectedStatus !== 'Commercial Fleet' && selectedStatus !== 'Leased Out' &&
                   selectedStatus !== 'For Sale' && selectedStatus !== 'Sold' && (
                    <div className="text-center py-12">
                      <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <FileQuestion className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Documents Setup</h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                        Documents for {selectedStatus} vehicles have not been configured yet. Click below to set up document management for this category.
                      </p>
                      <Button variant="default">
                        <Plus className="h-4 w-4 mr-2" />
                        Set Up Documents
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabTransition>
          </TabsContent>
          
          <TabsContent value="service-history" className="m-0">
            <TabTransition isActive={activeTab === 'service-history'}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card className="mt-0">
                    <CardHeader className="pb-0">
                      <CardTitle className="text-xl">Service History</CardTitle>
                      <CardDescription>Complete history of all your vehicle services</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="text-center p-12 text-gray-500">
                        Service history records will be displayed here.
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabTransition>
          </TabsContent>
          
          <TabsContent value="health" className="m-0">
            <TabTransition isActive={activeTab === 'health'}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card className="mt-0 h-full">
                    <CardHeader className="pb-0">
                      <CardTitle className="text-xl">Vehicle Health & Value Analysis</CardTitle>
                      <CardDescription>Interactive visualization of your vehicles' health and current market value</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <VehicleWorthVisual />
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">AI Insights</CardTitle>
                        <Brain className="h-5 w-5 text-purple-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <PredictiveMaintenance />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Recommended Actions</CardTitle>
                        <Settings className="h-5 w-5 text-blue-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Calendar className="h-4 w-4 mr-2 text-amber-500" />
                          Schedule Honda City service
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2 text-blue-500" />
                          Update insurance documents
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  AI-Generated Vehicle Stories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(vehicleStories).map(([vehicle, story]) => (
                    <VehicleStoryCard key={vehicle} vehicle={vehicle} story={story} />
                  ))}
                </div>
              </div>
            </TabTransition>
          </TabsContent>
          
          <TabsContent value="community" className="m-0">
            <TabTransition isActive={activeTab === 'community'}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card className="mt-0">
                    <CardHeader className="pb-0">
                      <CardTitle className="text-xl">Community Knowledge Base</CardTitle>
                      <CardDescription>Learn from other owners and share your experience</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CommunityIntegration />
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <CommunityLeaderboardCard />
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Your Engagement</CardTitle>
                        <Users className="h-5 w-5 text-indigo-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Contributions</span>
                          <span className="font-semibold">14</span>
                        </div>
                        <Progress value={46} className="h-1.5" />
                        
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm text-slate-500">Badges Earned</span>
                          <span className="font-semibold">3</span>
                        </div>
                        <Progress value={37} className="h-1.5" />
                        
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm text-slate-500">Reputation Points</span>
                          <span className="font-semibold">850</span>
                        </div>
                        <Progress value={28} className="h-1.5" />
                      </div>
                      
                      <div className="mt-6">
                        <Button variant="outline" size="sm" className="w-full">View Your Profile</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabTransition>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  );
};

export default VehicleVault;