import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout';
import { 
  Car,
  Gauge,
  Cog,
  Sparkles,
  Key,
  RotateCw,
  MapPin,
  Fuel,
  Battery,
  AlertTriangle,
  FileText,
  Check,
  X,
  Gamepad2,
  School,
  ShoppingBag,
  ScrollText,
  Eye,
  Users,
  CreditCard,
  Truck,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Slider
} from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Define animation groups
const animationGroups = {
  'dashboard': {
    name: 'Dashboard',
    description: 'Main dashboard animations',
    color: 'bg-blue-500',
    icon: Gauge,
    animations: [
      {
        name: 'Car Slide',
        id: 'car-slide',
        component: () => (
          <motion.div
            animate={{
              x: [0, 100, 0],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "mirror"
            }}
            className="text-blue-500"
          >
            <Car className="h-16 w-16" />
          </motion.div>
        )
      },
      {
        name: 'Speed Gauge',
        id: 'speed-gauge',
        component: () => (
          <motion.div
            animate={{
              rotate: [0, 180, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut"
            }}
            className="text-red-500"
          >
            <Gauge className="h-16 w-16" />
          </motion.div>
        )
      },
      {
        name: 'Rotating Gear',
        id: 'rotating-gear',
        component: () => (
          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
            className="text-gray-600"
          >
            <Cog className="h-16 w-16" />
          </motion.div>
        )
      },
      {
        name: 'Sparkles',
        id: 'sparkles',
        component: () => (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "mirror"
            }}
            className="text-amber-500"
          >
            <Sparkles className="h-16 w-16" />
          </motion.div>
        )
      }
    ]
  },
  'vehicle-vault': {
    name: 'VehicleVault',
    description: 'Vehicle management animations',
    color: 'bg-indigo-600',
    icon: Car,
    animations: [
      {
        name: 'Key Rattle',
        id: 'key-rattle',
        component: () => (
          <motion.div
            animate={{
              rotate: [-15, 15, -15],
              y: [0, -5, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "mirror"
            }}
            className="text-indigo-600"
          >
            <Key className="h-16 w-16" />
          </motion.div>
        )
      },
      {
        name: 'Rotating Wheel',
        id: 'rotating-wheel',
        component: () => (
          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="text-gray-700"
          >
            <RotateCw className="h-16 w-16" />
          </motion.div>
        )
      },
      {
        name: 'Registration Papers',
        id: 'registration-papers',
        component: () => (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              rotate: [0, 5, 0, -3, 0]
            }}
            transition={{
              y: { duration: 1, repeat: Infinity, repeatType: "mirror" },
              rotate: { duration: 4, repeat: Infinity, repeatType: "mirror" }
            }}
            className="text-blue-600"
          >
            <FileText className="h-16 w-16" />
          </motion.div>
        )
      },
      {
        name: 'Car Status',
        id: 'car-status',
        component: () => (
          <div className="relative">
            <Car className="h-16 w-16 text-gray-800" />
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            >
              <Check className="h-6 w-6 text-green-500" />
            </motion.div>
          </div>
        )
      }
    ]
  },
  'service': {
    name: 'Book Service',
    description: 'Service booking animations',
    color: 'bg-green-600',
    icon: Wrench,
    animations: [
      {
        name: 'Wrench Tool',
        id: 'wrench-tool',
        component: () => (
          <motion.div
            animate={{
              rotate: [0, 45, 0, -45, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "mirror"
            }}
            className="text-green-600"
          >
            <Wrench className="h-16 w-16" />
          </motion.div>
        )
      },
      {
        name: 'Service Checklist',
        id: 'service-checklist',
        component: () => (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -5, 0]
            }}
            transition={{
              scale: { duration: 0.5 },
              opacity: { duration: 0.5 },
              y: { duration: 2, repeat: Infinity, repeatType: "mirror" }
            }}
            className="text-blue-600"
          >
            <ScrollText className="h-16 w-16" />
          </motion.div>
        )
      },
      {
        name: 'Service Completion',
        id: 'service-completion',
        component: () => (
          <div className="relative">
            <Car className="h-16 w-16 text-gray-700" />
            <motion.div
              className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            >
              <Check className="h-12 w-12 text-green-500" />
            </motion.div>
          </div>
        )
      },
      {
        name: 'Repair Process',
        id: 'repair-process',
        component: () => (
          <div className="flex space-x-2">
            <motion.div
              animate={{
                rotate: [-10, 10, -10],
                y: [0, -3, 0]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "mirror"
              }}
              className="text-orange-500"
            >
              <Wrench className="h-12 w-12" />
            </motion.div>
            <motion.div
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              className="text-gray-600"
            >
              <Cog className="h-12 w-12" />
            </motion.div>
          </div>
        )
      }
    ]
  },
  'emergency': {
    name: 'Emergency Services',
    description: 'Emergency assistance animations',
    color: 'bg-red-600',
    icon: AlertTriangle,
    animations: [
      {
        name: 'Alert Pulse',
        id: 'alert-pulse',
        component: () => (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "mirror"
            }}
            className="text-red-600"
          >
            <AlertTriangle className="h-16 w-16" />
          </motion.div>
        )
      },
      {
        name: 'SOS Beacon',
        id: 'sos-beacon',
        component: () => (
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-red-500 rounded-full opacity-30"
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            />
            <motion.div
              animate={{
                rotate: [0, 10, 0, -10, 0]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "mirror"
              }}
              className="relative z-10 text-red-600"
            >
              <AlertTriangle className="h-16 w-16" />
            </motion.div>
          </div>
        )
      },
      {
        name: 'Vehicle Breakdown',
        id: 'vehicle-breakdown',
        component: () => (
          <div className="relative">
            <Car className="h-16 w-16 text-gray-700" />
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            >
              <X className="h-6 w-6 text-red-500" />
            </motion.div>
          </div>
        )
      },
      {
        name: 'Emergency Location',
        id: 'emergency-location',
        component: () => (
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-red-400 rounded-full opacity-20"
              animate={{
                scale: [1, 3, 1],
                opacity: [0.2, 0, 0.2]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <motion.div
              animate={{
                y: [0, -10, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "mirror"
              }}
              className="relative z-10 text-red-600"
            >
              <MapPin className="h-16 w-16" />
            </motion.div>
          </div>
        )
      }
    ]
  },
  'nearby': {
    name: 'Nearby Services',
    description: 'Location-based service animations',
    color: 'bg-teal-600',
    icon: MapPin,
    animations: [
      {
        name: 'Location Pin Bounce',
        id: 'location-pin-bounce',
        component: () => (
          <motion.div
            animate={{
              y: [0, -15, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-teal-600"
          >
            <MapPin className="h-16 w-16" />
          </motion.div>
        )
      },
      {
        name: 'Service Radius',
        id: 'service-radius',
        component: () => (
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-teal-400 rounded-full opacity-20"
              animate={{
                scale: [1, 2, 1],
                opacity: [0.2, 0, 0.2]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />
            <MapPin className="h-16 w-16 text-teal-600 relative z-10" />
          </div>
        )
      },
      {
        name: 'Navigation',
        id: 'navigation',
        component: () => (
          <div className="relative">
            <motion.div
              animate={{
                x: [-30, 30, -30],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="text-blue-500"
            >
              <Car className="h-12 w-12" />
            </motion.div>
            <MapPin className="h-6 w-6 text-red-500 absolute top-3 right-0" />
          </div>
        )
      },
      {
        name: 'Multiple Locations',
        id: 'multiple-locations',
        component: () => (
          <div className="flex space-x-4">
            <motion.div
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror",
                delay: 0
              }}
              className="text-red-500"
            >
              <MapPin className="h-12 w-12" />
            </motion.div>
            <motion.div
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror",
                delay: 0.5
              }}
              className="text-blue-500"
            >
              <MapPin className="h-12 w-12" />
            </motion.div>
            <motion.div
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror",
                delay: 1
              }}
              className="text-green-500"
            >
              <MapPin className="h-12 w-12" />
            </motion.div>
          </div>
        )
      }
    ]
  },
  'drishti': {
    name: 'Drishti',
    description: 'Connected car & analytics animations',
    color: 'bg-indigo-600',
    icon: Eye,
    animations: [
      {
        name: 'Battery Status',
        id: 'battery-status',
        component: () => (
          <motion.div
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "mirror"
            }}
            className="text-green-600"
          >
            <Battery className="h-16 w-16" />
          </motion.div>
        )
      },
      {
        name: 'Fuel Gauge',
        id: 'fuel-gauge',
        component: () => (
          <motion.div
            animate={{
              rotate: [0, 180, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "mirror"
            }}
            className="text-amber-600"
          >
            <Fuel className="h-16 w-16" />
          </motion.div>
        )
      },
      {
        name: 'Eye Scanning',
        id: 'eye-scanning',
        component: () => (
          <div className="relative">
            <Eye className="h-16 w-16 text-indigo-700" />
            <motion.div
              className="absolute top-1/2 h-0.5 w-full bg-blue-400"
              animate={{
                y: [-8, 8, -8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            />
          </div>
        )
      },
      {
        name: 'Connected Vehicle',
        id: 'connected-vehicle',
        component: () => (
          <div className="relative">
            <Car className="h-16 w-16 text-gray-700" />
            <motion.div
              className="absolute inset-0 bg-blue-400 rounded-full opacity-20"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            />
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            >
              <Sparkles className="h-6 w-6 text-blue-500" />
            </motion.div>
          </div>
        )
      }
    ]
  },
  'marketplace': {
    name: 'Marketplace',
    description: 'Shopping and marketplace animations',
    color: 'bg-purple-600',
    icon: ShoppingBag,
    animations: [
      {
        name: 'Shopping Bag',
        id: 'shopping-bag',
        component: () => (
          <motion.div
            animate={{
              y: [0, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "mirror"
            }}
            className="text-purple-600"
          >
            <ShoppingBag className="h-16 w-16" />
          </motion.div>
        )
      },
      {
        name: 'Parts Selection',
        id: 'parts-selection',
        component: () => (
          <div className="relative">
            <Cog className="h-16 w-16 text-gray-700" />
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            >
              <Check className="h-6 w-6 text-green-500" />
            </motion.div>
          </div>
        )
      },
      {
        name: 'Purchase Animation',
        id: 'purchase-animation',
        component: () => (
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                y: [0, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror"
              }}
              className="text-green-600"
            >
              <CreditCard className="h-16 w-16" />
            </motion.div>
            <motion.div
              className="absolute -top-1 -right-1"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1
              }}
            >
              <Check className="h-6 w-6 text-green-500" />
            </motion.div>
          </div>
        )
      },
      {
        name: 'Add to Cart',
        id: 'add-to-cart',
        component: () => (
          <div className="flex items-center">
            <motion.div
              animate={{
                x: [0, 20, 20],
                opacity: [1, 1, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
                times: [0, 0.5, 1]
              }}
              className="text-blue-500"
            >
              <Cog className="h-12 w-12" />
            </motion.div>
            <motion.div
              className="ml-4"
              animate={{
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            >
              <ShoppingBag className="h-12 w-12 text-purple-600" />
            </motion.div>
          </div>
        )
      }
    ]
  },
  'education': {
    name: 'Learning',
    description: 'Educational content animations',
    color: 'bg-amber-600',
    icon: School,
    animations: [
      {
        name: 'Graduation Cap',
        id: 'graduation-cap',
        component: () => (
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "mirror"
            }}
            className="text-amber-600"
          >
            <School className="h-16 w-16" />
          </motion.div>
        )
      },
      {
        name: 'Learning Progress',
        id: 'learning-progress',
        component: () => (
          <div className="relative">
            <ScrollText className="h-16 w-16 text-blue-600" />
            <motion.div
              className="absolute top-0 left-0 right-0 bottom-0 bg-white"
              initial={{ y: '100%' }}
              animate={{
                y: ['100%', '0%', '100%']
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
            />
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "mirror",
                delay: 2.5
              }}
            >
              <Check className="h-6 w-6 text-green-500" />
            </motion.div>
          </div>
        )
      },
      {
        name: 'Video Tutorial',
        id: 'video-tutorial',
        component: () => (
          <div className="relative w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
            <motion.div
              className="w-3 h-3 bg-red-500 rounded-full absolute"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            />
            <Car className="h-8 w-8 text-gray-800 absolute opacity-50" />
          </div>
        )
      },
      {
        name: 'Instructor',
        id: 'instructor',
        component: () => (
          <div className="relative">
            <Users className="h-16 w-16 text-indigo-600" />
            <motion.div
              className="absolute -top-3 -right-3"
              animate={{
                rotate: [0, 10, 0, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            >
              <School className="h-8 w-8 text-amber-600" />
            </motion.div>
          </div>
        )
      }
    ]
  },
  'arena': {
    name: 'Arena',
    description: 'Gaming & customization animations',
    color: 'bg-violet-600',
    icon: Gamepad2,
    animations: [
      {
        name: 'Gamepad',
        id: 'gamepad',
        component: () => (
          <motion.div
            animate={{
              rotate: [0, 5, 0, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "mirror"
            }}
            className="text-violet-600"
          >
            <Gamepad2 className="h-16 w-16" />
          </motion.div>
        )
      },
      {
        name: 'Vehicle Customizer',
        id: 'vehicle-customizer',
        component: () => (
          <div className="relative">
            <Car className="h-16 w-16 text-gray-800" />
            <motion.div
              className="absolute inset-0"
              animate={{
                borderColor: [
                  'rgba(239, 68, 68, 0.5)',
                  'rgba(16, 185, 129, 0.5)',
                  'rgba(59, 130, 246, 0.5)',
                  'rgba(239, 68, 68, 0.5)'
                ]
              }}
              transition={{
                duration: 5,
                repeat: Infinity
              }}
              style={{ 
                borderWidth: '3px',
                borderStyle: 'dashed',
                borderRadius: '0.375rem'
              }}
            />
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Cog className="h-6 w-6 text-indigo-500" />
            </motion.div>
          </div>
        )
      },
      {
        name: 'Sparkle Effects',
        id: 'sparkle-effects',
        component: () => (
          <div className="relative">
            <Car className="h-16 w-16 text-indigo-600" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            >
              <Sparkles className="h-5 w-5 text-yellow-500" />
            </motion.div>
            <motion.div
              className="absolute top-3 -left-1"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "mirror",
                delay: 0.5
              }}
            >
              <Sparkles className="h-5 w-5 text-purple-500" />
            </motion.div>
            <motion.div
              className="absolute -bottom-1 left-3"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "mirror",
                delay: 1
              }}
            >
              <Sparkles className="h-5 w-5 text-blue-500" />
            </motion.div>
          </div>
        )
      },
      {
        name: '3D Rotation',
        id: '3d-rotation',
        component: () => (
          <motion.div
            animate={{
              rotateY: 360
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              transformStyle: 'preserve-3d'
            }}
            className="text-blue-600"
          >
            <Car className="h-16 w-16" />
          </motion.div>
        )
      }
    ]
  },
  'commercial': {
    name: 'Commercial Fleet',
    description: 'Fleet management animations',
    color: 'bg-blue-700',
    icon: Truck,
    animations: [
      {
        name: 'Fleet Truck',
        id: 'fleet-truck',
        component: () => (
          <motion.div
            animate={{
              x: [-30, 30, -30]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "mirror"
            }}
            className="text-blue-700"
          >
            <Truck className="h-16 w-16" />
          </motion.div>
        )
      },
      {
        name: 'Multiple Vehicles',
        id: 'multiple-vehicles',
        component: () => (
          <div className="flex flex-col space-y-1">
            <motion.div
              animate={{
                x: [-20, 20, -20]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "mirror"
              }}
              className="text-blue-700"
            >
              <Truck className="h-10 w-10" />
            </motion.div>
            <motion.div
              animate={{
                x: [-20, 20, -20]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "mirror",
                delay: 1
              }}
              className="text-indigo-600"
            >
              <Car className="h-8 w-8" />
            </motion.div>
            <motion.div
              animate={{
                x: [-20, 20, -20]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "mirror",
                delay: 2
              }}
              className="text-teal-600"
            >
              <Truck className="h-10 w-10" />
            </motion.div>
          </div>
        )
      },
      {
        name: 'Fleet Analytics',
        id: 'fleet-analytics',
        component: () => (
          <div className="relative">
            <Truck className="h-16 w-16 text-gray-700" />
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Gauge className="h-6 w-6 text-blue-500" />
            </motion.div>
            <motion.div
              className="absolute -bottom-2 -left-2"
              animate={{
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            >
              <FileText className="h-6 w-6 text-green-500" />
            </motion.div>
          </div>
        )
      },
      {
        name: 'Route Planning',
        id: 'route-planning',
        component: () => (
          <div className="relative">
            <motion.div
              animate={{
                x: [-20, 20, -20]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "mirror"
              }}
              className="text-blue-700"
            >
              <Truck className="h-12 w-12" />
            </motion.div>
            <div className="absolute top-12 left-0 right-0 h-0.5 rounded-full bg-gray-300 flex">
              <motion.div
                className="absolute left-0 h-full bg-green-500 rounded-full"
                animate={{
                  width: ['0%', '100%']
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              />
              <motion.div
                className="absolute h-3 w-3 bg-red-500 rounded-full -top-1"
                animate={{
                  left: ['-2%', '98%', '-2%']
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              />
            </div>
          </div>
        )
      }
    ]
  }
};

const AnimationDemoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [opacity, setOpacity] = useState(100);
  const [speed, setSpeed] = useState(100);
  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(null);
  
  const groupKeys = Object.keys(animationGroups) as Array<keyof typeof animationGroups>;
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Background animations */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 left-10 opacity-5"
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, 5, 0] 
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "mirror" 
            }}
          >
            <Car className="h-64 w-64 text-primary" />
          </motion.div>
          
          <motion.div 
            className="absolute bottom-20 right-10 opacity-5"
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -5, 0] 
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              repeatType: "mirror" 
            }}
          >
            <Cog className="h-72 w-72 text-indigo-500" />
          </motion.div>
          
          <motion.div 
            className="absolute top-1/2 left-1/3 opacity-5"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360] 
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Gauge className="h-48 w-48 text-amber-500" />
          </motion.div>
        </div>
        
        <div className="container relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div 
              className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center shadow-lg mb-6"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            >
              <Sparkles className="h-10 w-10 text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
                Animation Gallery
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Explore our library of automotive-themed animations designed to bring your vehicle management experience to life.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Animation Settings */}
      <section className="py-8 border-b bg-white sticky top-0 z-30 shadow-sm">
        <div className="container">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Animation Controls</h2>
              <p className="text-sm text-gray-500">Adjust settings to customize animations</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Opacity: {opacity}%</label>
              </div>
              <Slider
                value={[opacity]}
                onValueChange={(values) => setOpacity(values[0])}
                min={20}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Animation Group</label>
              </div>
              <Select 
                value={activeTab} 
                onValueChange={(value) => {
                  setActiveTab(value);
                  setSelectedAnimation(null);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select animation group" />
                </SelectTrigger>
                <SelectContent>
                  {groupKeys.map((key) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center">
                        <div className={cn("w-3 h-3 rounded-full mr-2", animationGroups[key].color)} />
                        {animationGroups[key].name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Animation Groups Tabs */}
      <section className="bg-gray-50 py-12">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 mb-8 bg-transparent h-auto gap-2">
              {groupKeys.map((key) => {
                const group = animationGroups[key];
                return (
                  <TabsTrigger 
                    key={key} 
                    value={key}
                    className={cn(
                      "data-[state=active]:bg-white border data-[state=active]:border-primary/20 h-auto py-3 px-3 flex flex-col items-center justify-center gap-2",
                      "data-[state=active]:text-primary data-[state=active]:shadow-md"
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", group.color)}>
                      <group.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-medium">{group.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            {groupKeys.map((key) => {
              const group = animationGroups[key];
              return (
                <TabsContent key={key} value={key} className="mt-0">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                      <div className="flex items-center mb-4">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mr-3", group.color)}>
                          <group.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{group.name} Animations</h2>
                          <p className="text-gray-600">{group.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {group.animations.map((animation) => (
                        <motion.div
                          key={animation.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ opacity: opacity / 100 }}
                          className={cn(
                            "bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center border border-transparent hover:border-primary/20 hover:shadow-md transition-all cursor-pointer h-48",
                            selectedAnimation === animation.id && "ring-2 ring-primary/30 border-primary/20"
                          )}
                          onClick={() => setSelectedAnimation(animation.id === selectedAnimation ? null : animation.id)}
                        >
                          <div className="flex-1 flex items-center justify-center">
                            <animation.component />
                          </div>
                          <div className="mt-4 text-center">
                            <h3 className="font-medium text-gray-900">{animation.name}</h3>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </section>
      
      {/* Selected Animation Showcase */}
      {selectedAnimation && (
        <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="container">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {groupKeys.map((key) => {
                const group = animationGroups[key];
                const animation = group.animations.find(a => a.id === selectedAnimation);
                if (!animation) return null;
                
                return (
                  <div key={animation.id}>
                    <div className="flex items-center justify-center mb-8">
                      <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", group.color)}>
                        <group.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold mb-6">{animation.name}</h2>
                    <p className="text-gray-300 mb-10">From the {group.name} animation collection</p>
                    
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-16 mb-10 flex items-center justify-center border border-gray-700">
                      <div className="transform scale-150" style={{ opacity: opacity / 100 }}>
                        <animation.component />
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button 
                        onClick={() => setSelectedAnimation(null)}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        Back to Gallery
                      </Button>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>
      )}
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-primary to-blue-700 text-white">
        <div className="container">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">Ready to see animations in action?</h2>
            <p className="text-lg text-white/80 mb-8">
              These animations are integrated throughout the FixPoint platform to create a more engaging and interactive vehicle management experience.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-white text-primary hover:bg-gray-100 shadow-lg"
                size="lg"
              >
                Explore Dashboard
              </Button>
              <Button 
                onClick={() => window.location.href = '/vehicle-vault'}
                className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                size="lg"
              >
                Visit VehicleVault
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default AnimationDemoPage;