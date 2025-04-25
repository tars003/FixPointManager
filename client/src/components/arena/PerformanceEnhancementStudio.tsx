import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Gauge, 
  Clock, 
  Settings,
  AlertTriangle, 
  BarChart3, 
  Bike, 
  Car, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  CircleOff, 
  Flame, 
  Info, 
  MapPin, 
  Rotate3D, 
  Shield, 
  Star, 
  Timer, 
  Truck, 
  Wind, 
  Zap
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PerformanceEnhancementStudioProps {
  vehicleId: number;
  vehicleType: string;
  onBack: () => void;
  onSave: (customizationData: any) => void;
}

type PerformanceCategory = 'engine' | 'drivetrain' | 'suspension' | 'brakes';
type EngineUpgradeType = 'intake' | 'exhaust' | 'ecu';
type ECUStage = 'stage1' | 'stage2' | 'stage3';
type DrivetrainType = 'transmission' | 'clutch' | 'differential';
type SuspensionType = 'coilovers' | 'springs' | 'sway-bars' | 'bushings';
type BrakeType = 'caliper' | 'rotor' | 'pad' | 'line';

interface EngineUpgrade {
  id: string;
  name: string;
  type: EngineUpgradeType;
  compatibleVehicles: string[];
  hpGain: number;
  torqueGain: number;
  description: string;
  features: string[];
  price: number;
  installationTime: number; // hours
  image: string;
}

interface ECUTuning {
  id: string;
  name: string;
  stage: ECUStage;
  compatibleVehicles: string[];
  hpGain: number;
  torqueGain: number;
  fuelEfficiencyImpact: number; // percentage
  description: string;
  features: string[];
  price: number;
  installationTime: number; // hours
}

interface DrivetrainUpgrade {
  id: string;
  name: string;
  type: DrivetrainType;
  compatibleVehicles: string[];
  description: string;
  features: string[];
  price: number;
  installationTime: number; // hours
  image: string;
}

interface SuspensionUpgrade {
  id: string;
  name: string;
  type: SuspensionType;
  compatibleVehicles: string[];
  description: string;
  features: string[];
  price: number;
  installationTime: number; // hours
  image: string;
}

interface BrakeUpgrade {
  id: string;
  name: string;
  type: BrakeType;
  compatibleVehicles: string[];
  description: string;
  features: string[];
  price: number;
  installationTime: number; // hours
  image: string;
}

interface PerformanceMetrics {
  acceleration: number; // 0-100kph in seconds
  quarterMile: number; // time in seconds
  brakingDistance: number; // meters from 100-0
  lateralG: number; // g-force in corners
}

interface PerformanceSpecialist {
  id: string;
  name: string;
  distance: number;
  rating: number;
  reviewCount: number;
  specialties: string[];
  hasDyno: boolean;
  certifications: string[];
  price: number;
  earliestAvailable: string;
  address: string;
  image: string;
}

const PerformanceEnhancementStudio: React.FC<PerformanceEnhancementStudioProps> = ({
  vehicleId,
  vehicleType,
  onBack,
  onSave
}) => {
  // Selected category
  const [category, setCategory] = useState<PerformanceCategory>('engine');
  
  // Engine Upgrades state
  const [selectedIntakeId, setSelectedIntakeId] = useState<string | null>(null);
  const [selectedExhaustId, setSelectedExhaustId] = useState<string | null>(null);
  const [selectedECUId, setSelectedECUId] = useState<string | null>(null);
  
  // Drivetrain Upgrades state
  const [selectedTransmissionId, setSelectedTransmissionId] = useState<string | null>(null);
  const [selectedClutchId, setSelectedClutchId] = useState<string | null>(null);
  const [selectedDifferentialId, setSelectedDifferentialId] = useState<string | null>(null);
  
  // Suspension Upgrades state
  const [selectedCoiloverId, setSelectedCoiloverId] = useState<string | null>(null);
  const [selectedSpringId, setSelectedSpringId] = useState<string | null>(null);
  const [selectedSwayBarId, setSelectedSwayBarId] = useState<string | null>(null);
  const [selectedBushingId, setSelectedBushingId] = useState<string | null>(null);
  
  // Brake Upgrades state
  const [selectedCaliperId, setSelectedCaliperId] = useState<string | null>(null);
  const [selectedRotorId, setSelectedRotorId] = useState<string | null>(null);
  const [selectedPadId, setSelectedPadId] = useState<string | null>(null);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  
  // Installation
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string | null>(null);
  const [installationDate, setInstallationDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  
  // Sample data for engine upgrades
  const engineUpgrades: EngineUpgrade[] = [
    {
      id: 'intake1',
      name: 'High-Flow Cold Air Intake',
      type: 'intake',
      compatibleVehicles: ['honda', 'toyota', 'mazda'],
      hpGain: 8,
      torqueGain: 10,
      description: 'Premium cold air intake system designed to increase airflow to the engine for improved power and throttle response.',
      features: ['Washable filter', 'Heat shield', 'Polished aluminum tubing'],
      price: 15000,
      installationTime: 1.5,
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434'
    },
    {
      id: 'intake2',
      name: 'Ram Air System',
      type: 'intake',
      compatibleVehicles: ['honda', 'mazda', 'subaru'],
      hpGain: 12,
      torqueGain: 15,
      description: 'Advanced ram air system that forces more air into the engine at higher speeds for increased power.',
      features: ['Velocity stack', 'Carbon fiber housing', 'High-flow filter'],
      price: 22000,
      installationTime: 2,
      image: 'https://images.unsplash.com/photo-1600703136783-bdb5ea365239'
    },
    {
      id: 'exhaust1',
      name: 'Catback Exhaust System',
      type: 'exhaust',
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      hpGain: 10,
      torqueGain: 12,
      description: 'Stainless steel catback exhaust system with larger diameter pipes for improved exhaust flow and a deeper tone.',
      features: ['Stainless steel construction', 'Polished tips', 'Reduced backpressure'],
      price: 45000,
      installationTime: 3,
      image: 'https://images.unsplash.com/photo-1552557604-5c0bf23d0038'
    },
    {
      id: 'exhaust2',
      name: 'Performance Headers',
      type: 'exhaust',
      compatibleVehicles: ['honda', 'mazda', 'subaru'],
      hpGain: 15,
      torqueGain: 18,
      description: 'Equal-length headers designed for maximum exhaust scavenging and improved power throughout the rev range.',
      features: ['Mandrel-bent tubing', 'High-temperature ceramic coating', 'TIG-welded joints'],
      price: 35000,
      installationTime: 4,
      image: 'https://images.unsplash.com/photo-1600754954732-ea539a1ad541'
    }
  ];
  
  // Sample data for ECU tuning
  const ecuTuning: ECUTuning[] = [
    {
      id: 'ecu1',
      name: 'Stage 1 ECU Tune',
      stage: 'stage1',
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      hpGain: 20,
      torqueGain: 25,
      fuelEfficiencyImpact: -5,
      description: 'Software-only ECU tuning that optimizes air/fuel ratios, ignition timing, and boost (where applicable) for improved performance.',
      features: ['No hardware modifications required', 'Improved throttle response', 'OEM reliability maintained'],
      price: 25000,
      installationTime: 2
    },
    {
      id: 'ecu2',
      name: 'Stage 2 ECU Tune',
      stage: 'stage2',
      compatibleVehicles: ['honda', 'mazda', 'subaru'],
      hpGain: 35,
      torqueGain: 40,
      fuelEfficiencyImpact: -10,
      description: 'Intermediate ECU tune designed for vehicles with intake and exhaust modifications for substantial power gains.',
      features: ['Requires intake and exhaust upgrades', 'Custom dyno tuning', 'Enhanced torque curve'],
      price: 35000,
      installationTime: 3
    },
    {
      id: 'ecu3',
      name: 'Stage 3 Performance Package',
      stage: 'stage3',
      compatibleVehicles: ['mazda', 'subaru'],
      hpGain: 60,
      torqueGain: 70,
      fuelEfficiencyImpact: -15,
      description: 'Complete performance package with aggressive ECU tuning for maximum power, requiring substantial hardware modifications.',
      features: ['Full bolt-on package', 'Advanced boost control', 'Launch control', 'Expanded RPM range'],
      price: 65000,
      installationTime: 6
    }
  ];
  
  // Sample data for drivetrain upgrades
  const drivetrainUpgrades: DrivetrainUpgrade[] = [
    {
      id: 'trans1',
      name: 'Short Shifter Kit',
      type: 'transmission',
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      description: 'Precision-engineered short shifter that reduces throw length by 40% for quicker, more precise shifting.',
      features: ['CNC machined', 'Adjustable throw length', 'Solid bushings'],
      price: 15000,
      installationTime: 2,
      image: 'https://images.unsplash.com/photo-1569267118847-2c94c29b32df'
    },
    {
      id: 'clutch1',
      name: 'Performance Clutch Kit',
      type: 'clutch',
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      description: 'Heavy-duty clutch kit with stronger pressure plate and higher friction coefficient disc for improved power handling.',
      features: ['Increased torque capacity', 'Reduced slip', 'Lighter flywheel'],
      price: 35000,
      installationTime: 4,
      image: 'https://images.unsplash.com/photo-1514316703755-dca7d7d9d882'
    },
    {
      id: 'diff1',
      name: 'Limited Slip Differential',
      type: 'differential',
      compatibleVehicles: ['mazda', 'subaru'],
      description: 'Helical limited slip differential that improves traction and cornering by transferring power to the wheel with the most grip.',
      features: ['Torsen design', 'Improved cornering', 'Reduced wheelspin'],
      price: 45000,
      installationTime: 5,
      image: 'https://images.unsplash.com/photo-1618231915642-9780bc5c914f'
    }
  ];
  
  // Sample data for suspension upgrades
  const suspensionUpgrades: SuspensionUpgrade[] = [
    {
      id: 'coil1',
      name: 'Adjustable Coilover System',
      type: 'coilovers',
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      description: 'Professional-grade coilover system with adjustable height, damping, and camber for precision handling.',
      features: ['Height adjustable', 'Damping adjustable', 'Camber plates included'],
      price: 75000,
      installationTime: 4,
      image: 'https://images.unsplash.com/photo-1612591532598-64304cfc3665'
    },
    {
      id: 'spring1',
      name: 'Lowering Springs',
      type: 'springs',
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      description: 'Progressive-rate lowering springs that reduce ride height for improved handling and appearance.',
      features: ['30mm drop', 'Progressive rate', 'Powder-coated finish'],
      price: 20000,
      installationTime: 3,
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537'
    },
    {
      id: 'sway1',
      name: 'Anti-Roll Bar Kit',
      type: 'sway-bars',
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      description: 'Front and rear adjustable sway bars that reduce body roll and improve cornering stability.',
      features: ['Adjustable settings', 'Larger diameter', 'Polyurethane bushings'],
      price: 25000,
      installationTime: 3,
      image: 'https://images.unsplash.com/photo-1613214150384-927f80572136'
    },
    {
      id: 'bush1',
      name: 'Polyurethane Bushing Kit',
      type: 'bushings',
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      description: 'Complete bushing kit that replaces soft rubber bushings with firmer polyurethane for improved response.',
      features: ['Reduced chassis flex', 'Better feedback', 'Longer lasting than rubber'],
      price: 15000,
      installationTime: 6,
      image: 'https://images.unsplash.com/photo-1618231914619-ef02b5b4ac21'
    }
  ];
  
  // Sample data for brake upgrades
  const brakeUpgrades: BrakeUpgrade[] = [
    {
      id: 'caliper1',
      name: '4-Piston Brake Calipers',
      type: 'caliper',
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      description: 'High-performance 4-piston calipers that provide increased clamping force and improved brake feel.',
      features: ['Aluminum construction', 'Stainless steel pistons', 'Available in multiple colors'],
      price: 45000,
      installationTime: 3,
      image: 'https://images.unsplash.com/photo-1552557204-cd37864f3f6c'
    },
    {
      id: 'rotor1',
      name: 'Drilled & Slotted Rotors',
      type: 'rotor',
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      description: 'Two-piece floating rotors with cross-drilled holes and slots for improved cooling and reduced fade.',
      features: ['Increased thermal capacity', 'Reduced unsprung weight', 'Improved pedal feel'],
      price: 35000,
      installationTime: 2,
      image: 'https://images.unsplash.com/photo-1600859628276-875811becdee'
    },
    {
      id: 'pad1',
      name: 'Performance Brake Pads',
      type: 'pad',
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      description: 'High-performance brake pads with advanced friction material for increased stopping power and fade resistance.',
      features: ['Higher friction coefficient', 'Reduced fade at high temperatures', 'Low dust formula'],
      price: 15000,
      installationTime: 1,
      image: 'https://images.unsplash.com/photo-1600859628837-fa3a5ba7fb27'
    },
    {
      id: 'line1',
      name: 'Stainless Steel Brake Lines',
      type: 'line',
      compatibleVehicles: ['honda', 'toyota', 'mazda', 'subaru'],
      description: 'Stainless steel braided brake lines that provide a firmer pedal feel and more consistent braking by eliminating line expansion.',
      features: ['Reduced line expansion', 'Improved pedal feel', 'Corrosion resistant'],
      price: 12000,
      installationTime: 2,
      image: 'https://images.unsplash.com/photo-1563559200096-7ee461f315ab'
    }
  ];
  
  // Sample performance specialists
  const performanceSpecialists: PerformanceSpecialist[] = [
    {
      id: 'spec1',
      name: 'SpeedTech Performance',
      distance: 4.5,
      rating: 4.8,
      reviewCount: 157,
      specialties: ['ECU Tuning', 'Exhaust Systems', 'Suspension'],
      hasDyno: true,
      certifications: ['Factory Authorized', 'ASE Certified'],
      price: 25000,
      earliestAvailable: '2025-04-30',
      address: '123 Performance Way, Delhi',
      image: 'https://images.unsplash.com/photo-1613214187999-ac6ad28a1aad'
    },
    {
      id: 'spec2',
      name: 'Apex Motorsports',
      distance: 7.8,
      rating: 4.9,
      reviewCount: 213,
      specialties: ['Engine Builds', 'Turbo Systems', 'Drivetrain'],
      hasDyno: true,
      certifications: ['ASE Certified', 'Master Technician'],
      price: 35000,
      earliestAvailable: '2025-04-28',
      address: '456 Racing Blvd, Delhi',
      image: 'https://images.unsplash.com/photo-1534333607377-b347312cc675'
    },
    {
      id: 'spec3',
      name: 'Precision Auto Tuning',
      distance: 6.2,
      rating: 4.6,
      reviewCount: 89,
      specialties: ['ECU Tuning', 'Dyno Testing', 'Performance Upgrades'],
      hasDyno: true,
      certifications: ['Factory Authorized'],
      price: 30000,
      earliestAvailable: '2025-05-02',
      address: '789 Tuner Street, Gurgaon',
      image: 'https://images.unsplash.com/photo-1574626349197-a3b15c938bbe'
    },
    {
      id: 'spec4',
      name: 'JDM Performance',
      distance: 9.5,
      rating: 4.7,
      reviewCount: 124,
      specialties: ['Japanese Imports', 'Suspension', 'Brakes'],
      hasDyno: false,
      certifications: ['ASE Certified'],
      price: 20000,
      earliestAvailable: '2025-04-29',
      address: '321 Import Lane, Noida',
      image: 'https://images.unsplash.com/photo-1597007361878-f7186097de95'
    }
  ];
  
  // Base vehicle performance metrics (before upgrades)
  const baseMetrics: PerformanceMetrics = {
    acceleration: 8.5, // 0-100kph in seconds
    quarterMile: 16.2, // time in seconds
    brakingDistance: 42, // meters from 100-0
    lateralG: 0.85 // g-force in corners
  };
  
  // Calculate new performance metrics based on selected upgrades
  const calculateNewMetrics = (): PerformanceMetrics => {
    let updatedMetrics = { ...baseMetrics };
    let totalHpGain = 0;
    let totalTorqueGain = 0;
    
    // Calculate engine gains
    const selectedIntake = engineUpgrades.find(item => item.id === selectedIntakeId);
    const selectedExhaust = engineUpgrades.find(item => item.id === selectedExhaustId);
    const selectedECU = ecuTuning.find(item => item.id === selectedECUId);
    
    if (selectedIntake) {
      totalHpGain += selectedIntake.hpGain;
      totalTorqueGain += selectedIntake.torqueGain;
    }
    
    if (selectedExhaust) {
      totalHpGain += selectedExhaust.hpGain;
      totalTorqueGain += selectedExhaust.torqueGain;
    }
    
    if (selectedECU) {
      totalHpGain += selectedECU.hpGain;
      totalTorqueGain += selectedECU.torqueGain;
    }
    
    // Apply power gains to performance metrics
    if (totalHpGain > 0) {
      // Improve acceleration and quarter mile based on power gains
      const powerFactor = 1 - (totalHpGain / 200); // diminishing returns
      updatedMetrics.acceleration *= powerFactor;
      updatedMetrics.quarterMile *= powerFactor;
    }
    
    // Apply suspension upgrades to handling
    if (selectedCoiloverId || selectedSpringId || selectedSwayBarId || selectedBushingId) {
      // Improvement to lateral G
      let handlingImprovement = 0;
      if (selectedCoiloverId) handlingImprovement += 0.15;
      if (selectedSpringId) handlingImprovement += 0.08;
      if (selectedSwayBarId) handlingImprovement += 0.1;
      if (selectedBushingId) handlingImprovement += 0.05;
      
      updatedMetrics.lateralG += handlingImprovement;
    }
    
    // Apply brake upgrades to braking distance
    if (selectedCaliperId || selectedRotorId || selectedPadId || selectedLineId) {
      // Improvement to braking distance
      let brakingImprovement = 0;
      if (selectedCaliperId) brakingImprovement += 5;
      if (selectedRotorId) brakingImprovement += 3;
      if (selectedPadId) brakingImprovement += 4;
      if (selectedLineId) brakingImprovement += 2;
      
      // Reduce braking distance
      updatedMetrics.brakingDistance -= brakingImprovement;
      // Ensure we don't go below a reasonable minimum
      updatedMetrics.brakingDistance = Math.max(updatedMetrics.brakingDistance, 32);
    }
    
    // Round values for cleaner display
    updatedMetrics.acceleration = parseFloat(updatedMetrics.acceleration.toFixed(1));
    updatedMetrics.quarterMile = parseFloat(updatedMetrics.quarterMile.toFixed(1));
    updatedMetrics.brakingDistance = Math.round(updatedMetrics.brakingDistance);
    updatedMetrics.lateralG = parseFloat(updatedMetrics.lateralG.toFixed(2));
    
    return updatedMetrics;
  };
  
  // Calculate the updated metrics
  const updatedMetrics = calculateNewMetrics();
  
  // Calculate total cost
  const calculateTotal = () => {
    let total = 0;
    
    // Add engine upgrade costs
    const selectedIntake = engineUpgrades.find(item => item.id === selectedIntakeId);
    const selectedExhaust = engineUpgrades.find(item => item.id === selectedExhaustId);
    const selectedECU = ecuTuning.find(item => item.id === selectedECUId);
    
    if (selectedIntake) total += selectedIntake.price;
    if (selectedExhaust) total += selectedExhaust.price;
    if (selectedECU) total += selectedECU.price;
    
    // Add drivetrain upgrade costs
    const selectedTransmission = drivetrainUpgrades.find(item => item.id === selectedTransmissionId);
    const selectedClutch = drivetrainUpgrades.find(item => item.id === selectedClutchId);
    const selectedDifferential = drivetrainUpgrades.find(item => item.id === selectedDifferentialId);
    
    if (selectedTransmission) total += selectedTransmission.price;
    if (selectedClutch) total += selectedClutch.price;
    if (selectedDifferential) total += selectedDifferential.price;
    
    // Add suspension upgrade costs
    const selectedCoilover = suspensionUpgrades.find(item => item.id === selectedCoiloverId);
    const selectedSpring = suspensionUpgrades.find(item => item.id === selectedSpringId);
    const selectedSwayBar = suspensionUpgrades.find(item => item.id === selectedSwayBarId);
    const selectedBushing = suspensionUpgrades.find(item => item.id === selectedBushingId);
    
    if (selectedCoilover) total += selectedCoilover.price;
    if (selectedSpring) total += selectedSpring.price;
    if (selectedSwayBar) total += selectedSwayBar.price;
    if (selectedBushing) total += selectedBushing.price;
    
    // Add brake upgrade costs
    const selectedCaliper = brakeUpgrades.find(item => item.id === selectedCaliperId);
    const selectedRotor = brakeUpgrades.find(item => item.id === selectedRotorId);
    const selectedPad = brakeUpgrades.find(item => item.id === selectedPadId);
    const selectedLine = brakeUpgrades.find(item => item.id === selectedLineId);
    
    if (selectedCaliper) total += selectedCaliper.price;
    if (selectedRotor) total += selectedRotor.price;
    if (selectedPad) total += selectedPad.price;
    if (selectedLine) total += selectedLine.price;
    
    // Add installation cost
    const selectedSpecialist = performanceSpecialists.find(item => item.id === selectedSpecialistId);
    if (selectedSpecialist) total += selectedSpecialist.price;
    
    // Add dyno tuning cost if needed
    if (selectedECU && selectedSpecialist?.hasDyno) {
      total += 15000; // Dyno tuning cost
    }
    
    return total;
  };
  
  // Get EMI amount (for 24 months at 10% interest)
  const getEmiAmount = () => {
    const total = calculateTotal();
    const interestRate = 0.1 / 12; // 10% annual interest
    const months = 24;
    
    const emi = total * interestRate * Math.pow(1 + interestRate, months) / 
                (Math.pow(1 + interestRate, months) - 1);
    
    return Math.round(emi);
  };
  
  // Calculate total installation time
  const calculateInstallationTime = () => {
    let hours = 0;
    
    // Add engine upgrade times
    const selectedIntake = engineUpgrades.find(item => item.id === selectedIntakeId);
    const selectedExhaust = engineUpgrades.find(item => item.id === selectedExhaustId);
    const selectedECU = ecuTuning.find(item => item.id === selectedECUId);
    
    if (selectedIntake) hours += selectedIntake.installationTime;
    if (selectedExhaust) hours += selectedExhaust.installationTime;
    if (selectedECU) hours += selectedECU.installationTime;
    
    // Add drivetrain upgrade times
    const selectedTransmission = drivetrainUpgrades.find(item => item.id === selectedTransmissionId);
    const selectedClutch = drivetrainUpgrades.find(item => item.id === selectedClutchId);
    const selectedDifferential = drivetrainUpgrades.find(item => item.id === selectedDifferentialId);
    
    if (selectedTransmission) hours += selectedTransmission.installationTime;
    if (selectedClutch) hours += selectedClutch.installationTime;
    if (selectedDifferential) hours += selectedDifferential.installationTime;
    
    // Add suspension upgrade times
    const selectedCoilover = suspensionUpgrades.find(item => item.id === selectedCoiloverId);
    const selectedSpring = suspensionUpgrades.find(item => item.id === selectedSpringId);
    const selectedSwayBar = suspensionUpgrades.find(item => item.id === selectedSwayBarId);
    const selectedBushing = suspensionUpgrades.find(item => item.id === selectedBushingId);
    
    if (selectedCoilover) hours += selectedCoilover.installationTime;
    if (selectedSpring) hours += selectedSpring.installationTime;
    if (selectedSwayBar) hours += selectedSwayBar.installationTime;
    if (selectedBushing) hours += selectedBushing.installationTime;
    
    // Add brake upgrade times
    const selectedCaliper = brakeUpgrades.find(item => item.id === selectedCaliperId);
    const selectedRotor = brakeUpgrades.find(item => item.id === selectedRotorId);
    const selectedPad = brakeUpgrades.find(item => item.id === selectedPadId);
    const selectedLine = brakeUpgrades.find(item => item.id === selectedLineId);
    
    if (selectedCaliper) hours += selectedCaliper.installationTime;
    if (selectedRotor) hours += selectedRotor.installationTime;
    if (selectedPad) hours += selectedPad.installationTime;
    if (selectedLine) hours += selectedLine.installationTime;
    
    // Add dyno tuning time if needed
    if (selectedECU && selectedSpecialistId) {
      hours += 2; // Dyno tuning time
    }
    
    return hours;
  };
  
  // Handle saving customization
  const handleSave = () => {
    const totalInstallationHours = calculateInstallationTime();
    
    const customizationData = {
      type: 'performanceEnhancement',
      engineUpgrades: {
        intakeId: selectedIntakeId,
        exhaustId: selectedExhaustId,
        ecuId: selectedECUId
      },
      drivetrainUpgrades: {
        transmissionId: selectedTransmissionId,
        clutchId: selectedClutchId,
        differentialId: selectedDifferentialId
      },
      suspensionUpgrades: {
        coiloverId: selectedCoiloverId,
        springId: selectedSpringId,
        swayBarId: selectedSwayBarId,
        bushingId: selectedBushingId
      },
      brakeUpgrades: {
        caliperId: selectedCaliperId,
        rotorId: selectedRotorId,
        padId: selectedPadId,
        lineId: selectedLineId
      },
      performanceGains: {
        horsepower: calculateHorsepowerGain(),
        torque: calculateTorqueGain(),
        acceleration: baseMetrics.acceleration - updatedMetrics.acceleration,
        quarterMile: baseMetrics.quarterMile - updatedMetrics.quarterMile,
        brakingDistance: baseMetrics.brakingDistance - updatedMetrics.brakingDistance,
        lateralG: updatedMetrics.lateralG - baseMetrics.lateralG
      },
      installation: {
        specialistId: selectedSpecialistId,
        date: installationDate,
        estimatedHours: totalInstallationHours,
        estimatedDays: Math.ceil(totalInstallationHours / 8)
      },
      pricing: {
        partsCost: calculateTotal() - (selectedSpecialistId ? performanceSpecialists.find(s => s.id === selectedSpecialistId)?.price || 0 : 0),
        laborCost: selectedSpecialistId ? performanceSpecialists.find(s => s.id === selectedSpecialistId)?.price || 0 : 0,
        dynoTuning: (selectedECUId && performanceSpecialists.find(s => s.id === selectedSpecialistId)?.hasDyno) ? 15000 : 0,
        totalCost: calculateTotal()
      }
    };
    
    onSave(customizationData);
  };
  
  // Calculate total horsepower gain
  const calculateHorsepowerGain = () => {
    let totalGain = 0;
    
    const selectedIntake = engineUpgrades.find(item => item.id === selectedIntakeId);
    const selectedExhaust = engineUpgrades.find(item => item.id === selectedExhaustId);
    const selectedECU = ecuTuning.find(item => item.id === selectedECUId);
    
    if (selectedIntake) totalGain += selectedIntake.hpGain;
    if (selectedExhaust) totalGain += selectedExhaust.hpGain;
    if (selectedECU) totalGain += selectedECU.hpGain;
    
    return totalGain;
  };
  
  // Calculate total torque gain
  const calculateTorqueGain = () => {
    let totalGain = 0;
    
    const selectedIntake = engineUpgrades.find(item => item.id === selectedIntakeId);
    const selectedExhaust = engineUpgrades.find(item => item.id === selectedExhaustId);
    const selectedECU = ecuTuning.find(item => item.id === selectedECUId);
    
    if (selectedIntake) totalGain += selectedIntake.torqueGain;
    if (selectedExhaust) totalGain += selectedExhaust.torqueGain;
    if (selectedECU) totalGain += selectedECU.torqueGain;
    
    return totalGain;
  };
  
  // Render rating stars
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-3.5 w-3.5 ${
              index < Math.floor(rating) 
                ? 'text-yellow-500 fill-yellow-500' 
                : index < rating 
                  ? 'text-yellow-500 fill-yellow-500 opacity-50' 
                  : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Performance Enhancement Center</h1>
            <p className="text-sm text-muted-foreground">Upgrade your vehicle's performance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!(selectedIntakeId || selectedExhaustId || selectedECUId || 
                     selectedTransmissionId || selectedClutchId || selectedDifferentialId ||
                     selectedCoiloverId || selectedSpringId || selectedSwayBarId || selectedBushingId ||
                     selectedCaliperId || selectedRotorId || selectedPadId || selectedLineId) ||
                     !selectedSpecialistId}
          >
            Save Configuration
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        {/* Left sidebar - Categories */}
        <div className="border-r p-4 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Performance Categories</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={category === 'engine' ? 'default' : 'outline'}
                className="justify-start h-auto py-3"
                onClick={() => setCategory('engine')}
              >
                <div className="flex flex-col items-center mr-3">
                  <Flame className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Engine</div>
                  <div className="text-xs text-muted-foreground">Intake, Exhaust, ECU</div>
                </div>
              </Button>
              
              <Button
                variant={category === 'drivetrain' ? 'default' : 'outline'}
                className="justify-start h-auto py-3"
                onClick={() => setCategory('drivetrain')}
              >
                <div className="flex flex-col items-center mr-3">
                  <Settings className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Drivetrain</div>
                  <div className="text-xs text-muted-foreground">Transmission, Clutch, Diff</div>
                </div>
              </Button>
              
              <Button
                variant={category === 'suspension' ? 'default' : 'outline'}
                className="justify-start h-auto py-3"
                onClick={() => setCategory('suspension')}
              >
                <div className="flex flex-col items-center mr-3">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Suspension</div>
                  <div className="text-xs text-muted-foreground">Coilovers, Springs, Sway Bars</div>
                </div>
              </Button>
              
              <Button
                variant={category === 'brakes' ? 'default' : 'outline'}
                className="justify-start h-auto py-3"
                onClick={() => setCategory('brakes')}
              >
                <div className="flex flex-col items-center mr-3">
                  <Gauge className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Brakes</div>
                  <div className="text-xs text-muted-foreground">Calipers, Rotors, Pads</div>
                </div>
              </Button>
            </div>
          </div>
          
          <Tabs value={category}>
            {/* Engine Upgrades */}
            <TabsContent value="engine" className="space-y-6 mt-0">
              <Accordion type="multiple" defaultValue={['intake', 'exhaust', 'ecu']}>
                <AccordionItem value="intake">
                  <AccordionTrigger className="text-base">Air Intake Systems</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {engineUpgrades.filter(u => u.type === 'intake').map((intake) => (
                        <Card 
                          key={intake.id} 
                          className={`cursor-pointer transition-all ${selectedIntakeId === intake.id ? 'border-primary ring-1 ring-primary' : ''}`}
                          onClick={() => setSelectedIntakeId(intake.id === selectedIntakeId ? null : intake.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                                <img 
                                  src={intake.image} 
                                  alt={intake.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h4 className="font-medium">{intake.name}</h4>
                                  <Badge>₹{intake.price.toLocaleString()}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{intake.description}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Zap className="h-3 w-3" />
                                    +{intake.hpGain} HP
                                  </Badge>
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Gauge className="h-3 w-3" />
                                    +{intake.torqueGain} Nm
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="exhaust">
                  <AccordionTrigger className="text-base">Exhaust Systems</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {engineUpgrades.filter(u => u.type === 'exhaust').map((exhaust) => (
                        <Card 
                          key={exhaust.id} 
                          className={`cursor-pointer transition-all ${selectedExhaustId === exhaust.id ? 'border-primary ring-1 ring-primary' : ''}`}
                          onClick={() => setSelectedExhaustId(exhaust.id === selectedExhaustId ? null : exhaust.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                                <img 
                                  src={exhaust.image} 
                                  alt={exhaust.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h4 className="font-medium">{exhaust.name}</h4>
                                  <Badge>₹{exhaust.price.toLocaleString()}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{exhaust.description}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Zap className="h-3 w-3" />
                                    +{exhaust.hpGain} HP
                                  </Badge>
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Gauge className="h-3 w-3" />
                                    +{exhaust.torqueGain} Nm
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="ecu">
                  <AccordionTrigger className="text-base">ECU Tuning</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {ecuTuning.map((ecu) => (
                        <Card 
                          key={ecu.id} 
                          className={`cursor-pointer transition-all ${selectedECUId === ecu.id ? 'border-primary ring-1 ring-primary' : ''}`}
                          onClick={() => setSelectedECUId(ecu.id === selectedECUId ? null : ecu.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between">
                              <h4 className="font-medium flex items-center gap-2">
                                {ecu.name}
                                {ecu.stage === 'stage3' && <Badge variant="destructive">Advanced</Badge>}
                              </h4>
                              <Badge>₹{ecu.price.toLocaleString()}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{ecu.description}</p>
                            <div className="grid grid-cols-2 gap-2 mt-3">
                              <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">Horsepower Gain</span>
                                <span className="font-medium">+{ecu.hpGain} HP</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">Torque Gain</span>
                                <span className="font-medium">+{ecu.torqueGain} Nm</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">Fuel Efficiency</span>
                                <span className={`font-medium ${ecu.fuelEfficiencyImpact < 0 ? 'text-destructive' : 'text-green-600'}`}>
                                  {ecu.fuelEfficiencyImpact > 0 ? '+' : ''}{ecu.fuelEfficiencyImpact}%
                                </span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">Installation</span>
                                <span className="font-medium">{ecu.installationTime} hours</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {ecu.features.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                  <Check className="h-3 w-3" />
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            
            {/* Drivetrain Upgrades */}
            <TabsContent value="drivetrain" className="space-y-6 mt-0">
              <Accordion type="multiple" defaultValue={['transmission', 'clutch', 'differential']}>
                <AccordionItem value="transmission">
                  <AccordionTrigger className="text-base">Transmission Upgrades</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {drivetrainUpgrades.filter(u => u.type === 'transmission').map((item) => (
                        <Card 
                          key={item.id} 
                          className={`cursor-pointer transition-all ${selectedTransmissionId === item.id ? 'border-primary ring-1 ring-primary' : ''}`}
                          onClick={() => setSelectedTransmissionId(item.id === selectedTransmissionId ? null : item.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h4 className="font-medium">{item.name}</h4>
                                  <Badge>₹{item.price.toLocaleString()}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {item.features.map((feature, index) => (
                                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                                      <Check className="h-3 w-3" />
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="clutch">
                  <AccordionTrigger className="text-base">Clutch Upgrades</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {drivetrainUpgrades.filter(u => u.type === 'clutch').map((item) => (
                        <Card 
                          key={item.id} 
                          className={`cursor-pointer transition-all ${selectedClutchId === item.id ? 'border-primary ring-1 ring-primary' : ''}`}
                          onClick={() => setSelectedClutchId(item.id === selectedClutchId ? null : item.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h4 className="font-medium">{item.name}</h4>
                                  <Badge>₹{item.price.toLocaleString()}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {item.features.map((feature, index) => (
                                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                                      <Check className="h-3 w-3" />
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="differential">
                  <AccordionTrigger className="text-base">Differential Upgrades</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {drivetrainUpgrades.filter(u => u.type === 'differential').map((item) => (
                        <Card 
                          key={item.id} 
                          className={`cursor-pointer transition-all ${selectedDifferentialId === item.id ? 'border-primary ring-1 ring-primary' : ''}`}
                          onClick={() => setSelectedDifferentialId(item.id === selectedDifferentialId ? null : item.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h4 className="font-medium">{item.name}</h4>
                                  <Badge>₹{item.price.toLocaleString()}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {item.features.map((feature, index) => (
                                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                                      <Check className="h-3 w-3" />
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            
            {/* Suspension Upgrades */}
            <TabsContent value="suspension" className="space-y-6 mt-0">
              <Accordion type="multiple" defaultValue={['coilovers', 'springs', 'sway-bars', 'bushings']}>
                {['coilovers', 'springs', 'sway-bars', 'bushings'].map((susType) => (
                  <AccordionItem key={susType} value={susType}>
                    <AccordionTrigger className="text-base">
                      {susType === 'coilovers' ? 'Coilover Systems' :
                       susType === 'springs' ? 'Lowering Springs' :
                       susType === 'sway-bars' ? 'Sway Bars' : 'Bushings'}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {suspensionUpgrades.filter(u => u.type === susType as SuspensionType).map((item) => {
                          const isSelected = 
                            susType === 'coilovers' ? selectedCoiloverId === item.id :
                            susType === 'springs' ? selectedSpringId === item.id :
                            susType === 'sway-bars' ? selectedSwayBarId === item.id :
                            selectedBushingId === item.id;
                          
                          const setSelected = (id: string | null) => {
                            if (susType === 'coilovers') setSelectedCoiloverId(id);
                            else if (susType === 'springs') setSelectedSpringId(id);
                            else if (susType === 'sway-bars') setSelectedSwayBarId(id);
                            else setSelectedBushingId(id);
                          };
                          
                          return (
                            <Card 
                              key={item.id} 
                              className={`cursor-pointer transition-all ${isSelected ? 'border-primary ring-1 ring-primary' : ''}`}
                              onClick={() => setSelected(isSelected ? null : item.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex gap-4">
                                  <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between">
                                      <h4 className="font-medium">{item.name}</h4>
                                      <Badge>₹{item.price.toLocaleString()}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {item.features.map((feature, index) => (
                                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                                          <Check className="h-3 w-3" />
                                          {feature}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
            
            {/* Brake Upgrades */}
            <TabsContent value="brakes" className="space-y-6 mt-0">
              <Accordion type="multiple" defaultValue={['caliper', 'rotor', 'pad', 'line']}>
                {['caliper', 'rotor', 'pad', 'line'].map((brakeType) => (
                  <AccordionItem key={brakeType} value={brakeType}>
                    <AccordionTrigger className="text-base">
                      {brakeType === 'caliper' ? 'Brake Calipers' :
                       brakeType === 'rotor' ? 'Brake Rotors' :
                       brakeType === 'pad' ? 'Brake Pads' : 'Brake Lines'}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {brakeUpgrades.filter(u => u.type === brakeType as BrakeType).map((item) => {
                          const isSelected = 
                            brakeType === 'caliper' ? selectedCaliperId === item.id :
                            brakeType === 'rotor' ? selectedRotorId === item.id :
                            brakeType === 'pad' ? selectedPadId === item.id :
                            selectedLineId === item.id;
                          
                          const setSelected = (id: string | null) => {
                            if (brakeType === 'caliper') setSelectedCaliperId(id);
                            else if (brakeType === 'rotor') setSelectedRotorId(id);
                            else if (brakeType === 'pad') setSelectedPadId(id);
                            else setSelectedLineId(id);
                          };
                          
                          return (
                            <Card 
                              key={item.id} 
                              className={`cursor-pointer transition-all ${isSelected ? 'border-primary ring-1 ring-primary' : ''}`}
                              onClick={() => setSelected(isSelected ? null : item.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex gap-4">
                                  <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between">
                                      <h4 className="font-medium">{item.name}</h4>
                                      <Badge>₹{item.price.toLocaleString()}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {item.features.map((feature, index) => (
                                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                                          <Check className="h-3 w-3" />
                                          {feature}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Center - Performance Metrics */}
        <div className="col-span-1 lg:col-span-1 border-r flex flex-col overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="font-medium mb-2">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Card>
                <CardContent className="p-3">
                  <div className="text-sm text-muted-foreground">0-100 km/h</div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{updatedMetrics.acceleration}s</div>
                    <Badge 
                      variant={baseMetrics.acceleration > updatedMetrics.acceleration ? "default" : "outline"}
                      className="text-xs"
                    >
                      {baseMetrics.acceleration > updatedMetrics.acceleration 
                        ? `-${(baseMetrics.acceleration - updatedMetrics.acceleration).toFixed(1)}s` 
                        : 'No Change'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3">
                  <div className="text-sm text-muted-foreground">Quarter Mile</div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{updatedMetrics.quarterMile}s</div>
                    <Badge 
                      variant={baseMetrics.quarterMile > updatedMetrics.quarterMile ? "default" : "outline"}
                      className="text-xs"
                    >
                      {baseMetrics.quarterMile > updatedMetrics.quarterMile 
                        ? `-${(baseMetrics.quarterMile - updatedMetrics.quarterMile).toFixed(1)}s` 
                        : 'No Change'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3">
                  <div className="text-sm text-muted-foreground">Braking (100-0 km/h)</div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{updatedMetrics.brakingDistance}m</div>
                    <Badge 
                      variant={baseMetrics.brakingDistance > updatedMetrics.brakingDistance ? "default" : "outline"}
                      className="text-xs"
                    >
                      {baseMetrics.brakingDistance > updatedMetrics.brakingDistance 
                        ? `-${baseMetrics.brakingDistance - updatedMetrics.brakingDistance}m` 
                        : 'No Change'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3">
                  <div className="text-sm text-muted-foreground">Lateral G-force</div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{updatedMetrics.lateralG}g</div>
                    <Badge 
                      variant={updatedMetrics.lateralG > baseMetrics.lateralG ? "default" : "outline"}
                      className="text-xs"
                    >
                      {updatedMetrics.lateralG > baseMetrics.lateralG 
                        ? `+${(updatedMetrics.lateralG - baseMetrics.lateralG).toFixed(2)}g` 
                        : 'No Change'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Power Gains</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Horsepower</span>
                  <Badge className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    +{calculateHorsepowerGain()} HP
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Torque</span>
                  <Badge className="flex items-center gap-1">
                    <Gauge className="h-3 w-3" />
                    +{calculateTorqueGain()} Nm
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-4">
            <h3 className="font-medium mb-4">Performance Specialists</h3>
            <div className="space-y-4">
              {performanceSpecialists.map((specialist) => (
                <Card 
                  key={specialist.id} 
                  className={`cursor-pointer transition-all ${selectedSpecialistId === specialist.id ? 'border-primary ring-1 ring-primary' : ''}`}
                  onClick={() => setSelectedSpecialistId(specialist.id === selectedSpecialistId ? null : specialist.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-md overflow-hidden">
                        <img 
                          src={specialist.image} 
                          alt={specialist.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{specialist.name}</h4>
                          <Badge variant={specialist.hasDyno ? "default" : "outline"}>
                            {specialist.hasDyno ? 'Dyno Available' : 'No Dyno'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{specialist.distance} km</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            {renderRating(specialist.rating)}
                            <span className="text-muted-foreground">({specialist.reviewCount})</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {specialist.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">{specialty}</Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Earliest: {specialist.earliestAvailable}</span>
                          </div>
                          <Badge variant="outline">₹{specialist.price.toLocaleString()}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    {selectedSpecialistId === specialist.id && (
                      <>
                        <Separator className="my-3" />
                        <div>
                          <Label htmlFor="installation-date">Appointment Date</Label>
                          <Input 
                            id="installation-date" 
                            type="date"
                            className="mt-1"
                            value={installationDate}
                            onChange={(e) => setInstallationDate(e.target.value)}
                            min={specialist.earliestAvailable}
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right sidebar - Summary */}
        <div className="p-4 overflow-y-auto">
          <h3 className="text-lg font-medium mb-4">Configuration Summary</h3>
          
          <Accordion type="multiple" defaultValue={['selected', 'price']}>
            <AccordionItem value="selected">
              <AccordionTrigger>Selected Upgrades</AccordionTrigger>
              <AccordionContent>
                {/* Engine Upgrades */}
                {(selectedIntakeId || selectedExhaustId || selectedECUId) && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Engine Upgrades</h4>
                    <div className="space-y-2">
                      {selectedIntakeId && (
                        <div className="flex justify-between text-sm">
                          <span>{engineUpgrades.find(i => i.id === selectedIntakeId)?.name}</span>
                          <span className="font-medium">₹{engineUpgrades.find(i => i.id === selectedIntakeId)?.price.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedExhaustId && (
                        <div className="flex justify-between text-sm">
                          <span>{engineUpgrades.find(i => i.id === selectedExhaustId)?.name}</span>
                          <span className="font-medium">₹{engineUpgrades.find(i => i.id === selectedExhaustId)?.price.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedECUId && (
                        <div className="flex justify-between text-sm">
                          <span>{ecuTuning.find(i => i.id === selectedECUId)?.name}</span>
                          <span className="font-medium">₹{ecuTuning.find(i => i.id === selectedECUId)?.price.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Drivetrain Upgrades */}
                {(selectedTransmissionId || selectedClutchId || selectedDifferentialId) && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Drivetrain Upgrades</h4>
                    <div className="space-y-2">
                      {selectedTransmissionId && (
                        <div className="flex justify-between text-sm">
                          <span>{drivetrainUpgrades.find(i => i.id === selectedTransmissionId)?.name}</span>
                          <span className="font-medium">₹{drivetrainUpgrades.find(i => i.id === selectedTransmissionId)?.price.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedClutchId && (
                        <div className="flex justify-between text-sm">
                          <span>{drivetrainUpgrades.find(i => i.id === selectedClutchId)?.name}</span>
                          <span className="font-medium">₹{drivetrainUpgrades.find(i => i.id === selectedClutchId)?.price.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedDifferentialId && (
                        <div className="flex justify-between text-sm">
                          <span>{drivetrainUpgrades.find(i => i.id === selectedDifferentialId)?.name}</span>
                          <span className="font-medium">₹{drivetrainUpgrades.find(i => i.id === selectedDifferentialId)?.price.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Suspension Upgrades */}
                {(selectedCoiloverId || selectedSpringId || selectedSwayBarId || selectedBushingId) && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Suspension Upgrades</h4>
                    <div className="space-y-2">
                      {selectedCoiloverId && (
                        <div className="flex justify-between text-sm">
                          <span>{suspensionUpgrades.find(i => i.id === selectedCoiloverId)?.name}</span>
                          <span className="font-medium">₹{suspensionUpgrades.find(i => i.id === selectedCoiloverId)?.price.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedSpringId && (
                        <div className="flex justify-between text-sm">
                          <span>{suspensionUpgrades.find(i => i.id === selectedSpringId)?.name}</span>
                          <span className="font-medium">₹{suspensionUpgrades.find(i => i.id === selectedSpringId)?.price.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedSwayBarId && (
                        <div className="flex justify-between text-sm">
                          <span>{suspensionUpgrades.find(i => i.id === selectedSwayBarId)?.name}</span>
                          <span className="font-medium">₹{suspensionUpgrades.find(i => i.id === selectedSwayBarId)?.price.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedBushingId && (
                        <div className="flex justify-between text-sm">
                          <span>{suspensionUpgrades.find(i => i.id === selectedBushingId)?.name}</span>
                          <span className="font-medium">₹{suspensionUpgrades.find(i => i.id === selectedBushingId)?.price.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Brake Upgrades */}
                {(selectedCaliperId || selectedRotorId || selectedPadId || selectedLineId) && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Brake Upgrades</h4>
                    <div className="space-y-2">
                      {selectedCaliperId && (
                        <div className="flex justify-between text-sm">
                          <span>{brakeUpgrades.find(i => i.id === selectedCaliperId)?.name}</span>
                          <span className="font-medium">₹{brakeUpgrades.find(i => i.id === selectedCaliperId)?.price.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedRotorId && (
                        <div className="flex justify-between text-sm">
                          <span>{brakeUpgrades.find(i => i.id === selectedRotorId)?.name}</span>
                          <span className="font-medium">₹{brakeUpgrades.find(i => i.id === selectedRotorId)?.price.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedPadId && (
                        <div className="flex justify-between text-sm">
                          <span>{brakeUpgrades.find(i => i.id === selectedPadId)?.name}</span>
                          <span className="font-medium">₹{brakeUpgrades.find(i => i.id === selectedPadId)?.price.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedLineId && (
                        <div className="flex justify-between text-sm">
                          <span>{brakeUpgrades.find(i => i.id === selectedLineId)?.name}</span>
                          <span className="font-medium">₹{brakeUpgrades.find(i => i.id === selectedLineId)?.price.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Installation */}
                {selectedSpecialistId && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Installation</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{performanceSpecialists.find(i => i.id === selectedSpecialistId)?.name}</span>
                        <span className="font-medium">₹{performanceSpecialists.find(i => i.id === selectedSpecialistId)?.price.toLocaleString()}</span>
                      </div>
                      {selectedECUId && performanceSpecialists.find(i => i.id === selectedSpecialistId)?.hasDyno && (
                        <div className="flex justify-between text-sm">
                          <span>Dyno Tuning & Calibration</span>
                          <span className="font-medium">₹15,000</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Appointment Date</span>
                        <span>{installationDate}</span>
                      </div>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="legal">
              <AccordionTrigger>Legal & Warranty Information</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p>Some modifications may void portions of your vehicle's manufacturer warranty. We recommend consulting with your vehicle's manufacturer or dealer before proceeding.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-500" />
                      Emissions Compliance
                    </h4>
                    {selectedIntakeId || selectedExhaustId || selectedECUId ? (
                      <div className="rounded-md bg-muted p-3">
                        {selectedECUId && ecuTuning.find(i => i.id === selectedECUId)?.stage === 'stage3' ? (
                          <Badge variant="destructive" className="mb-2">Track Use Only</Badge>
                        ) : (
                          <Badge variant="outline" className="mb-2">Street Legal*</Badge>
                        )}
                        <p className="text-xs text-muted-foreground">
                          *All performance modifications are designed to comply with local emissions regulations when properly installed and maintained. However, certain aggressive tunes may be intended for off-road use only.
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No engine modifications selected</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      Modification Warranty
                    </h4>
                    <p>All performance parts carry a 12-month warranty against manufacturer defects. Installation performed by our certified specialists is covered for 6 months.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="price">
              <AccordionTrigger>Price Breakdown</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Parts Total</span>
                    <span className="font-medium">
                      ₹{(calculateTotal() - (selectedSpecialistId ? 
                        (performanceSpecialists.find(s => s.id === selectedSpecialistId)?.price || 0) + 
                        (selectedECUId && performanceSpecialists.find(s => s.id === selectedSpecialistId)?.hasDyno ? 15000 : 0) : 0
                      )).toLocaleString()}
                    </span>
                  </div>
                  
                  {selectedSpecialistId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Labor & Installation</span>
                      <span className="font-medium">
                        ₹{performanceSpecialists.find(s => s.id === selectedSpecialistId)?.price.toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  {selectedECUId && selectedSpecialistId && performanceSpecialists.find(s => s.id === selectedSpecialistId)?.hasDyno && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dyno Tuning & Calibration</span>
                      <span className="font-medium">₹15,000</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{calculateTotal().toLocaleString()}</span>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">EMI Option (24 months)</Label>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Payment</span>
                      <span className="font-medium">₹{getEmiAmount().toLocaleString()}/month</span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="rounded-md bg-muted p-3 text-sm mt-4">
            <div className="font-medium mb-1 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Estimated Timeline</span>
            </div>
            <div className="space-y-1 text-muted-foreground">
              <div className="flex justify-between">
                <span>Parts Procurement</span>
                <span>3-5 days</span>
              </div>
              <div className="flex justify-between">
                <span>Installation Time</span>
                <span>{calculateInstallationTime()} hours</span>
              </div>
              <div className="flex justify-between">
                <span>Break-in Period</span>
                <span>1000 km</span>
              </div>
              <div className="flex justify-between font-medium text-foreground">
                <span>Total Duration</span>
                <span>{Math.ceil(calculateInstallationTime() / 8) + 1}-{Math.ceil(calculateInstallationTime() / 6) + 2} days</span>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full mt-4" 
            onClick={handleSave}
            disabled={!(selectedIntakeId || selectedExhaustId || selectedECUId || 
                     selectedTransmissionId || selectedClutchId || selectedDifferentialId ||
                     selectedCoiloverId || selectedSpringId || selectedSwayBarId || selectedBushingId ||
                     selectedCaliperId || selectedRotorId || selectedPadId || selectedLineId) ||
                     !selectedSpecialistId}
          >
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceEnhancementStudio;