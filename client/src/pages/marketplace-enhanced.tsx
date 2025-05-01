import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence, useScroll, useTransform, useAnimation, useInView } from 'framer-motion';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Filter, 
  ChevronDown, 
  Star, 
  Truck, 
  ShieldCheck, 
  BarChart4, 
  CheckCircle2,
  X,
  Plus,
  Minus,
  Clock,
  Sparkles,
  Zap,
  Brain,
  Trophy,
  BadgePercent,
  Gift,
  Flame,
  ArrowRight,
  Share2,
  Bookmark,
  Timer,
  BatteryCharging,
  Cpu,
  Car,
  ThumbsUp,
  RotateCw,
  Users,
  Award,
  BarChart3,
  PlusCircle,
  Info,
  BellRing,
  BarChart,
  HeartHandshake,
  Megaphone,
  PiggyBank,
  ShoppingBag,
  Smartphone,
  Package
} from 'lucide-react';
import BannerSlider from '@/components/marketplace/banner-slider';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Enhanced Animation Components
const AnimatedCounter = ({ value, duration = 2 }: { value: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * value));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

const PulseNotification = ({ text }: { text: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="fixed bottom-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <BellRing className="h-5 w-5" />
      </motion.div>
      <span>{text}</span>
    </motion.div>
  );
};

// Types
interface Vehicle {
  id: number;
  type: 'two-wheeler' | 'three-wheeler' | 'four-wheeler' | 'truck' | 'commercial' | 'bus' | 'tractor' | 'construction';
  make: string;
  model: string;
  year: number;
  fuelType: 'petrol' | 'diesel' | 'hybrid' | 'cng' | 'electric' | 'solar' | 'hydrogen';
  variant?: string;
  image: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  type: 'oem' | 'aftermarket';
  category: string;
  subCategory: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  brand: string;
  compatibleVehicles: number[]; // vehicle ids
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  tags: string[];
  partNumber: string;
  specifications: Record<string, string>;
  installationDifficulty: 1 | 2 | 3 | 4 | 5; // 1-easy, 5-professional only
  installationTime: number; // in minutes
  installationGuideUrl?: string;
  warranty: number; // in months
  discount?: number; // percentage
  isFeatured: boolean;
  relatedProducts: number[]; // product ids
  sellerInfo: {
    id: number;
    name: string;
    rating: number;
    isVerified: boolean;
  };
  popularity?: number; // 1-100
  trending?: boolean;
  limitedStock?: boolean;
  salesCount?: number;
}

interface AIRecommendation {
  id: number;
  type: 'combo-deal' | 'frequently-bought-together' | 'similar-products' | 'vehicle-specific' | 'user-behavior';
  title: string;
  description: string;
  products: Product[];
  discount?: number;
  confidenceScore: number; // 0-100
}

interface FilterOptions {
  vehicleId: number | null;
  category: string | null;
  subCategory: string | null;
  type: 'oem' | 'aftermarket' | null;
  priceRange: { min: number, max: number } | null;
  brands: string[];
  inStock: boolean;
  rating: number | null;
  sortBy: 'relevance' | 'price_low_high' | 'price_high_low' | 'rating' | 'newest' | 'popularity' | 'trending';
}

interface Promotion {
  id: number;
  title: string;
  description: string;
  image: string;
  discount: number;
  code: string;
  expiresIn: number; // hours
  applicable: 'all' | 'category' | 'brand' | 'product';
  applyTo?: string[];
  minSpend?: number;
  maxDiscount?: number;
}

// Helper functions for product generation
const brands = [
  'Bosch', 'Denso', 'NGK', 'Continental', 'Bridgestone', 'Michelin', 'Castrol', 'Shell', 
  'Exide', 'Amaron', 'CEAT', 'MRF', 'Minda', 'TVS', 'Valeo', 'Lucas', 'TATA', 'Mahindra'
];

const sellers = [
  'AutoParts India', 'CarZone', 'Genuine Spares', 'SpeedMart', 'AutoX',
  'MotoZone', 'Parts Depot', 'Premium Auto', 'Capital Auto', 'Parts Galaxy'
];

const subCategories: Record<string, string[]> = {
  'Engine Parts': ['Oil Filters', 'Air Filters', 'Spark Plugs', 'Belts', 'Hoses'],
  'Brakes': ['Brake Pads', 'Brake Discs', 'Brake Fluid', 'Calipers', 'Brake Lines'],
  'Suspension': ['Shock Absorbers', 'Struts', 'Springs', 'Control Arms', 'Bushings'],
  'Transmission': ['Clutch Kits', 'Gearbox Parts', 'Transmission Fluid', 'Differentials'],
  'Electrical': ['Batteries', 'Alternators', 'Starters', 'Sensors', 'Switches'],
  'Cooling': ['Radiators', 'Coolant', 'Thermostats', 'Water Pumps', 'Fans'],
  'Body Parts': ['Bumpers', 'Fenders', 'Mirrors', 'Grills', 'Door Handles'],
  'Lights': ['Headlights', 'Tail Lights', 'Fog Lights', 'Indicators', 'Bulbs'],
  'Exhaust': ['Mufflers', 'Catalytic Converters', 'Exhaust Pipes', 'Gaskets'],
  'Interior': ['Seats', 'Floor Mats', 'Steering Wheels', 'Dashboard Covers'],
  'Wheels': ['Alloys', 'Steel Rims', 'Hub Caps', 'Wheel Bearings'],
  'Tires': ['Summer Tires', 'Winter Tires', 'All-Season', 'Off-Road Tires'],
  'Filters': ['Air Filters', 'Oil Filters', 'Cabin Filters', 'Fuel Filters'],
  'Wipers': ['Wiper Blades', 'Wiper Motors', 'Washer Fluid', 'Arms & Linkage']
};

const getProductNameByCategory = (category: string): string => {
  const categoryMap: Record<string, string[]> = {
    'Brakes': ['Brake Pad Set', 'Brake Rotor', 'Brake Caliper', 'Brake Line Kit', 'Brake Fluid'],
    'Engine Parts': ['Oil Filter', 'Air Filter', 'Spark Plug Set', 'Timing Belt', 'Engine Gasket'],
    'Suspension': ['Shock Absorber', 'Strut Assembly', 'Coil Spring', 'Control Arm', 'Ball Joint'],
    'Transmission': ['Clutch Kit', 'Transmission Filter', 'CV Axle', 'Differential Seal', 'Shift Cable'],
    'Electrical': ['Battery', 'Alternator', 'Starter Motor', 'Ignition Coil', 'Relay Switch'],
    'Cooling': ['Radiator', 'Coolant', 'Thermostat', 'Water Pump', 'Cooling Fan'],
    'Body Parts': ['Bumper Cover', 'Fender', 'Side Mirror', 'Door Handle', 'Hood Latch'],
    'Lights': ['Headlight Assembly', 'Tail Light Assembly', 'Fog Light Kit', 'Signal Light', 'LED Bulb Set'],
    'Exhaust': ['Muffler', 'Catalytic Converter', 'Exhaust Pipe', 'Exhaust Gasket', 'Oxygen Sensor'],
    'Interior': ['Seat Cover Set', 'Floor Mat', 'Steering Wheel Cover', 'Dashboard Cover', 'Interior LED Kit'],
    'Wheels': ['Alloy Wheel', 'Steel Wheel', 'Wheel Hub Assembly', 'Lug Nut Set', 'Wheel Spacer'],
    'Tires': ['All-Season Tire', 'Performance Tire', 'Winter Tire', 'Off-Road Tire', 'Run-Flat Tire'],
    'Filters': ['Premium Air Filter', 'Oil Filter', 'Cabin Air Filter', 'Fuel Filter', 'Filter Set'],
    'Wipers': ['Wiper Blade Set', 'Rear Wiper Blade', 'Wiper Motor', 'Windshield Washer Pump', 'Washer Fluid']
  };
  
  if (categoryMap[category]) {
    return categoryMap[category][Math.floor(Math.random() * categoryMap[category].length)];
  }
  
  return `${category} Part`;
};

// Sample Data
const sampleVehicles: Vehicle[] = [
  {
    id: 1,
    type: 'four-wheeler',
    make: 'Maruti Suzuki',
    model: 'Swift',
    year: 2022,
    fuelType: 'petrol',
    variant: 'VXI',
    image: 'https://www.marutisuzuki.com/-/media/images/maruti/marutisuzuki/car/car-profile-shots/swift_profile_redcolour_1.webp'
  },
  {
    id: 2,
    type: 'four-wheeler',
    make: 'Hyundai',
    model: 'Creta',
    year: 2021,
    fuelType: 'diesel',
    variant: 'SX',
    image: 'https://www.hyundai.com/content/dam/hyundai/in/en/data/find-a-car/Creta/highlights-swiper/Creta-Highlights-Mobile.jpg'
  },
  {
    id: 3,
    type: 'four-wheeler',
    make: 'Tata',
    model: 'Nexon',
    year: 2023,
    fuelType: 'electric',
    variant: 'XZ+',
    image: 'https://www.tatamotors.com/wp-content/themes/tatamotors_2019/images/nexon/home-banner.jpg'
  },
  {
    id: 4,
    type: 'two-wheeler',
    make: 'Hero',
    model: 'Splendor',
    year: 2022,
    fuelType: 'petrol',
    image: 'https://www.heromotocorp.com/content/dam/hero-aem-website/in/en/our-world/motorcycles/splendor/splendor-plus-xtec/colorgallery/splendor-plus-xtec-red.png'
  },
  {
    id: 5,
    type: 'two-wheeler',
    make: 'TVS',
    model: 'Apache',
    year: 2023,
    fuelType: 'petrol',
    variant: 'RTR 160',
    image: 'https://www.tvsmotor.com/-/media/Feature/Motor/Motorcycles/Apache/Apache-RTR/Apache-RTR-160/2v/Overview/Banner/TVS-Apache-RTR-160-2v-launch-banner-1125x525-1.png'
  }
];

const generateSampleProducts = (count: number): Product[] => {
  const categories = ['Engine Parts', 'Suspension', 'Brakes', 'Electrical', 'Body Parts', 'Lighting', 'Filters', 'Wheels & Tires', 'Interior', 'Accessories'];
  const brands = ['Bosch', 'Valeo', 'NGK', 'Denso', 'Continental', 'Exide', 'MRF', 'JK Tyre', 'CEAT', 'Apollo', 'Lumax', 'Asahi'];
  
  return Array.from({ length: count }, (_, i) => {
    const price = Math.floor(Math.random() * 19000) + 1000;
    const discount = Math.random() > 0.6 ? Math.floor(Math.random() * 30) + 5 : 0;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const rating = Math.floor(Math.random() * 50) / 10 + 3; // 3.0 to 8.0
    const popularity = Math.floor(Math.random() * 100);
    const trending = Math.random() > 0.85;
    
    return {
      id: i + 1,
      name: `${brand} ${category} ${i + 1}00`,
      description: `High-quality ${category.toLowerCase()} for optimal vehicle performance and reliability.`,
      type: Math.random() > 0.5 ? 'oem' : 'aftermarket',
      category,
      subCategory: `Premium ${category}`,
      price,
      oldPrice: discount > 0 ? Math.round(price * (1 + discount / 100)) : undefined,
      rating,
      reviewCount: Math.floor(Math.random() * 500) + 10,
      images: [`https://via.placeholder.com/300x300?text=${category.replace(' ', '+')}+${i + 1}`],
      brand,
      compatibleVehicles: Array.from(
        { length: Math.floor(Math.random() * 4) + 1 },
        () => Math.floor(Math.random() * sampleVehicles.length) + 1
      ),
      stockStatus: Math.random() > 0.8 ? 'low_stock' : Math.random() > 0.9 ? 'out_of_stock' : 'in_stock',
      tags: [category, brand, `${Math.random() > 0.5 ? 'Premium' : 'Standard'}`],
      partNumber: `${brand.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 10000)}`,
      specifications: {
        'Material': Math.random() > 0.5 ? 'Aluminum' : 'Steel',
        'Weight': `${(Math.random() * 5 + 0.5).toFixed(2)} kg`,
        'Dimensions': `${Math.floor(Math.random() * 30) + 10}cm x ${Math.floor(Math.random() * 20) + 5}cm x ${Math.floor(Math.random() * 10) + 2}cm`,
      },
      installationDifficulty: (Math.floor(Math.random() * 5) + 1) as (1 | 2 | 3 | 4 | 5),
      installationTime: Math.floor(Math.random() * 120) + 15,
      warranty: [3, 6, 12, 24, 36][Math.floor(Math.random() * 5)],
      discount,
      isFeatured: Math.random() > 0.8,
      relatedProducts: Array.from(
        { length: Math.floor(Math.random() * 5) + 1 },
        () => Math.floor(Math.random() * count) + 1
      ).filter(id => id !== i + 1),
      sellerInfo: {
        id: Math.floor(Math.random() * 20) + 1,
        name: `${['Auto', 'Car', 'Vehicle', 'Drive', 'Moto'][Math.floor(Math.random() * 5)]} ${['Parts', 'Zone', 'Store', 'Hub', 'Shop'][Math.floor(Math.random() * 5)]}`,
        rating: Math.floor(Math.random() * 20) / 10 + 3,
        isVerified: Math.random() > 0.3
      },
      popularity,
      trending,
      limitedStock: Math.random() > 0.9,
      salesCount: Math.floor(Math.random() * 1000)
    };
  });
};

const sampleProducts = generateSampleProducts(100);

const generateAIRecommendations = (products: Product[], cart: {product: Product, quantity: number}[]): AIRecommendation[] => {
  if (cart.length === 0) return [];

  const cartProductIds = cart.map(item => item.product.id);
  const cartCategories = Array.from(new Set(cart.map(item => item.product.category)));
  
  const recommendations: AIRecommendation[] = [];
  
  // Combo Deal
  const comboProducts = products
    .filter(p => !cartProductIds.includes(p.id) && cartCategories.includes(p.category))
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
    
  if (comboProducts.length > 0) {
    recommendations.push({
      id: 1,
      type: 'combo-deal',
      title: 'Complete Your Setup',
      description: 'These items work great with your cart selection',
      products: comboProducts,
      discount: 10,
      confidenceScore: Math.floor(Math.random() * 20) + 80
    });
  }
  
  // Frequently Bought Together
  const frequentlyBoughtWith = products
    .filter(p => !cartProductIds.includes(p.id) && p.rating >= 4)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);
    
  if (frequentlyBoughtWith.length > 0) {
    recommendations.push({
      id: 2,
      type: 'frequently-bought-together',
      title: 'Customers Also Bought',
      description: 'Items frequently purchased together',
      products: frequentlyBoughtWith,
      confidenceScore: Math.floor(Math.random() * 15) + 75
    });
  }
  
  // Vehicle-specific
  if (cart[0].product.compatibleVehicles.length > 0) {
    const vehicleId = cart[0].product.compatibleVehicles[0];
    const vehicleSpecific = products
      .filter(p => !cartProductIds.includes(p.id) && p.compatibleVehicles.includes(vehicleId))
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
      
    if (vehicleSpecific.length > 0) {
      recommendations.push({
        id: 3,
        type: 'vehicle-specific',
        title: 'Compatible With Your Vehicle',
        description: 'Top-rated items for your specific model',
        products: vehicleSpecific,
        confidenceScore: Math.floor(Math.random() * 10) + 85
      });
    }
  }
  
  return recommendations;
};

const categories = [
  { label: 'All Products', value: 'all', icon: <ShoppingBag className="h-4 w-4" /> },
  { label: 'Engine Parts', value: 'Engine Parts', icon: <BatteryCharging className="h-4 w-4" /> },
  { label: 'Suspension', value: 'Suspension', icon: <Zap className="h-4 w-4" /> },
  { label: 'Brakes', value: 'Brakes', icon: <Clock className="h-4 w-4" /> },
  { label: 'Electrical', value: 'Electrical', icon: <Cpu className="h-4 w-4" /> },
  { label: 'Body Parts', value: 'Body Parts', icon: <Car className="h-4 w-4" /> },
  { label: 'Lighting', value: 'Lighting', icon: <Sparkles className="h-4 w-4" /> },
  { label: 'Filters', value: 'Filters', icon: <Filter className="h-4 w-4" /> },
  { label: 'Wheels & Tires', value: 'Wheels & Tires', icon: <RotateCw className="h-4 w-4" /> },
  { label: 'Interior', value: 'Interior', icon: <Users className="h-4 w-4" /> },
  { label: 'Accessories', value: 'Accessories', icon: <PlusCircle className="h-4 w-4" /> }
];

const promotions: Promotion[] = [
  {
    id: 1,
    title: 'Monsoon Special',
    description: 'Get 15% off on all wiper blades and rain accessories',
    image: 'https://via.placeholder.com/400x200?text=Monsoon+Special',
    discount: 15,
    code: 'MONSOON15',
    expiresIn: 72,
    applicable: 'category',
    applyTo: ['Accessories', 'Body Parts'],
    minSpend: 1000,
    maxDiscount: 500
  },
  {
    id: 2,
    title: 'Bosch Power Sale',
    description: 'Extra 10% discount on all Bosch products',
    image: 'https://via.placeholder.com/400x200?text=Bosch+Power+Sale',
    discount: 10,
    code: 'BOSCH10',
    expiresIn: 48,
    applicable: 'brand',
    applyTo: ['Bosch'],
    minSpend: 2000,
    maxDiscount: 1000
  },
  {
    id: 3,
    title: 'First Purchase Offer',
    description: 'Get flat ₹500 off on your first order above ₹3000',
    image: 'https://via.placeholder.com/400x200?text=First+Purchase+Offer',
    discount: 500,
    code: 'WELCOME500',
    expiresIn: 336, // 14 days
    applicable: 'all',
    minSpend: 3000
  }
];

// List of sales tactics we'll implement:
// 1. Limited-Time Offers with countdown timers
// 2. Flash Sales for specific items
// 3. Bundle Discounts using AI recommendations
// 4. Social Proof with live visitor count and recent purchases
// 5. Scarcity Messaging for low stock items

const MarketplaceEnhanced: React.FC = () => {
  const [, setLocation] = useLocation();
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);
  
  // State
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [savedVehicles, setSavedVehicles] = useState<Vehicle[]>(sampleVehicles);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions>({
    vehicleId: null,
    category: null,
    subCategory: null,
    type: null,
    priceRange: null,
    brands: [],
    inStock: false,
    rating: null,
    sortBy: 'popularity'
  });
  
  // Initialize with empty arrays first to avoid runtime issues
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  
  // Initialize product data on component mount
  useEffect(() => {
    const initialProducts = sampleProducts;
    setProducts(initialProducts);
    
    const filtered = initialProducts
      .filter(p => p.isFeatured || p.trending)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 12);
    
    setDisplayedProducts(filtered);
  }, []);
  const [cartItems, setCartItems] = useState<{product: Product, quantity: number}[]>([]);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [currentPromotion, setCurrentPromotion] = useState<Promotion>(promotions[0]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [flashSaleActive, setFlashSaleActive] = useState(true);
  const [flashSaleProduct, setFlashSaleProduct] = useState<Product | null>(null);
  const [flashSaleTimeRemaining, setFlashSaleTimeRemaining] = useState(3600); // 1 hour in seconds
  const [liveVisitorCount, setLiveVisitorCount] = useState(Math.floor(Math.random() * 50) + 80);
  const [recentPurchases, setRecentPurchases] = useState<{product: Product, time: number, user: string}[]>([]);
  const [showAIExplainer, setShowAIExplainer] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  
  // Refs for animation
  const featuredRef = useRef(null);
  const categoriesRef = useRef(null);
  const topPicksRef = useRef(null);
  const flashSaleRef = useRef(null);
  const brandsRef = useRef(null);
  
  // Animation controls
  const featuredControls = useAnimation();
  const categoriesControls = useAnimation();
  const topPicksControls = useAnimation();
  const flashSaleControls = useAnimation();
  const brandsControls = useAnimation();
  
  const isFeaturedInView = useInView(featuredRef, { once: true, amount: 0.2 });
  const isCategoriesInView = useInView(categoriesRef, { once: true, amount: 0.2 });
  const isTopPicksInView = useInView(topPicksRef, { once: true, amount: 0.2 });
  const isFlashSaleInView = useInView(flashSaleRef, { once: true, amount: 0.2 });
  const isBrandsInView = useInView(brandsRef, { once: true, amount: 0.2 });
  
  // Initialize Flash Sale
  useEffect(() => {
    // Only proceed if we have products loaded
    if (products.length === 0) return;
    
    const featuredProducts = products.filter(p => p.isFeatured);
    if (featuredProducts.length > 0) {
      const randomProduct = featuredProducts[Math.floor(Math.random() * featuredProducts.length)];
      // Apply a deeper discount for flash sale
      const flashProduct = {
        ...randomProduct,
        discount: (randomProduct.discount || 0) + 20,
        oldPrice: randomProduct.price,
        price: Math.round(randomProduct.price * (1 - ((randomProduct.discount || 0) + 20) / 100))
      };
      setFlashSaleProduct(flashProduct);
    }
    
    // Generate initial "recent purchases"
    const initialPurchases = Array.from({ length: 5 }, (_, i) => {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      return {
        product: randomProduct,
        time: Math.floor(Math.random() * 10) + 1, // 1-10 minutes ago
        user: `Customer${Math.floor(Math.random() * 9000) + 1000}`
      };
    });
    setRecentPurchases(initialPurchases);
    
    // Simulated live visitor count updates
    const visitorInterval = setInterval(() => {
      setLiveVisitorCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(75, prev + change);
      });
    }, 8000);
    
    // Simulated recent purchases
    const purchaseInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of a new purchase
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        setRecentPurchases(prev => [
          {
            product: randomProduct,
            time: 0, // just now
            user: `Customer${Math.floor(Math.random() * 9000) + 1000}`
          },
          ...prev.slice(0, 4) // Keep only the 5 most recent
        ]);
        
        // Show notification
        setNotificationText(`Someone just purchased ${randomProduct.name}!`);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 4000);
      }
    }, 20000);
    
    // Flash sale countdown
    const flashSaleInterval = setInterval(() => {
      setFlashSaleTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(flashSaleInterval);
          setFlashSaleActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Random promotional notifications
    const promoNotificationInterval = setInterval(() => {
      if (Math.random() > 0.5 && !showNotification) {
        const notifications = [
          "🔥 Flash sale ending soon! Don't miss out!",
          "👀 15+ people are viewing this category right now",
          "💰 Use code WELCOME500 for ₹500 off your first purchase",
          "🚚 Free shipping on orders above ₹2000!",
          "🎁 Complete your purchase to unlock exclusive offers"
        ];
        setNotificationText(notifications[Math.floor(Math.random() * notifications.length)]);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 4000);
      }
    }, 45000);
    
    return () => {
      clearInterval(visitorInterval);
      clearInterval(purchaseInterval);
      clearInterval(flashSaleInterval);
      clearInterval(promoNotificationInterval);
    };
  }, [products]);
  
  // Animation effects based on scroll
  useEffect(() => {
    if (isFeaturedInView) {
      featuredControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, staggerChildren: 0.1 }
      });
    }
    
    if (isCategoriesInView) {
      categoriesControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, staggerChildren: 0.05 }
      });
    }
    
    if (isTopPicksInView) {
      topPicksControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, staggerChildren: 0.1 }
      });
    }
    
    if (isFlashSaleInView) {
      flashSaleControls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, type: "spring" }
      });
    }
    
    if (isBrandsInView) {
      brandsControls.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, staggerChildren: 0.05 }
      });
    }
  }, [
    isFeaturedInView, 
    isCategoriesInView, 
    isTopPicksInView, 
    isFlashSaleInView, 
    isBrandsInView,
    featuredControls,
    categoriesControls,
    topPicksControls,
    flashSaleControls,
    brandsControls
  ]);
  
  // Update AI recommendations whenever cart changes
  useEffect(() => {
    if (cartItems.length > 0 && aiEnabled) {
      setAiRecommendations(generateAIRecommendations(products, cartItems));
    } else {
      setAiRecommendations([]);
    }
  }, [cartItems, products, aiEnabled]);
  
  // Update recently viewed when a product is selected
  useEffect(() => {
    if (selectedProduct) {
      setRecentlyViewed(prev => {
        // Remove if already in list
        const filtered = prev.filter(p => p.id !== selectedProduct.id);
        // Add to front of list
        return [selectedProduct, ...filtered].slice(0, 5);
      });
    }
  }, [selectedProduct]);
  
  // Handlers
  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFilters({...filters, vehicleId: vehicle.id});
    
    // Show notification
    setNotificationText(`Showing parts compatible with your ${vehicle.year} ${vehicle.make} ${vehicle.model}`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
    
    // Filter products by compatibility
    const filtered = products.filter(product => 
      product.compatibleVehicles.includes(vehicle.id)
    );
    setDisplayedProducts(filtered);
  };
  
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    // Simulate AI-powered search with a delay
    setTimeout(() => {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.partNumber.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
      
      // Sort by relevance and add a "score" that would come from the search algorithm
      const scored = filtered.map(product => {
        let score = 0;
        if (product.name.toLowerCase().includes(query)) score += 10;
        if (product.partNumber.toLowerCase() === query) score += 15;
        if (product.brand.toLowerCase() === query) score += 5;
        if (product.tags.some(tag => tag.toLowerCase() === query)) score += 8;
        return { ...product, score };
      }).sort((a, b) => b.score - a.score);
      
      setSearchResults(scored);
      setIsSearching(false);
    }, 800);
  };
  
  const handleCategoryFilter = (category: string) => {
    setActiveCategory(category);
    
    // First show loading state
    setNotificationText(`Loading ${category === 'all' ? 'all products' : category} products...`);
    setShowNotification(true);
    
    // Simulate loading with a small delay
    setTimeout(() => {
      if (category === 'all') {
        setDisplayedProducts(products.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 40));
      } else {
        const filtered = products.filter(product => 
          product.category === category
        ).sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        
        setDisplayedProducts(filtered);
      }
      
      // Hide notification and show success
      setShowNotification(false);
      setTimeout(() => {
        setNotificationText(`Showing ${category === 'all' ? 'all' : category} products`);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
      }, 200);
      
      // If we have a selected vehicle, filter by that as well
      if (selectedVehicle) {
        setFilters(prev => ({...prev, category: category === 'all' ? null : category}));
        applyFilters();
      }
    }, 500);
  };
  
  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    setFilters({...filters, sortBy});
    
    let sorted = [...displayedProducts];
    switch (sortBy) {
      case 'price_low_high':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price_high_low':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
        sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case 'trending':
        sorted.sort((a, b) => ((b.trending ? 1 : 0) - (a.trending ? 1 : 0)));
        break;
      case 'newest':
        // For demo, we'll just reverse the current order
        sorted.reverse();
        break;
      default:
        // Relevance is default order in our sample data
        break;
    }
    
    setDisplayedProducts(sorted);
  };
  
  const toggleWishlist = (productId: number) => {
    if (wishlistItems.includes(productId)) {
      setWishlistItems(wishlistItems.filter(id => id !== productId));
      setNotificationText("Removed from wishlist");
    } else {
      setWishlistItems([...wishlistItems, productId]);
      setNotificationText("Added to wishlist");
    }
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };
  
  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItemIndex = cartItems.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedItems);
    } else {
      setCartItems([...cartItems, {product, quantity}]);
    }
    
    // Show notification
    setNotificationText(`${product.name} added to cart!`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
    
    setCartOpen(true);
  };
  
  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.product.id !== productId));
  };
  
  const updateCartQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => 
      item.product.id === productId 
        ? {...item, quantity: newQuantity} 
        : item
    );
    
    setCartItems(updatedItems);
  };
  
  const calculateCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.product.price * item.quantity), 
      0
    );
  };
  
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };
  
  const applyFilters = () => {
    setNotificationText("Applying filters...");
    setShowNotification(true);
    
    // Simulate loading with a small delay for better UX
    setTimeout(() => {
      let filtered = [...products];
      let appliedFilters = [];
      
      // Apply vehicle filter
      if (filters.vehicleId) {
        filtered = filtered.filter(p => 
          p.compatibleVehicles.includes(filters.vehicleId as number)
        );
        const vehicle = savedVehicles.find(v => v.id === filters.vehicleId);
        if (vehicle) {
          appliedFilters.push(`${vehicle.make} ${vehicle.model}`);
        }
      }
      
      // Apply category filter
      if (filters.category) {
        filtered = filtered.filter(p => p.category === filters.category);
        appliedFilters.push(filters.category);
      }
      
      // Apply sub-category filter
      if (filters.subCategory) {
        filtered = filtered.filter(p => p.subCategory === filters.subCategory);
        appliedFilters.push(filters.subCategory);
      }
      
      // Apply type filter
      if (filters.type) {
        filtered = filtered.filter(p => p.type === filters.type);
        appliedFilters.push(filters.type === 'oem' ? 'OEM Parts' : 'Aftermarket Parts');
      }
      
      // Apply price range filter
      if (filters.priceRange) {
        filtered = filtered.filter(p => 
          p.price >= filters.priceRange!.min && 
          p.price <= filters.priceRange!.max
        );
        appliedFilters.push(`₹${filters.priceRange.min} - ₹${filters.priceRange.max}`);
      }
      
      // Apply brand filter
      if (filters.brands.length > 0) {
        filtered = filtered.filter(p => 
          filters.brands.includes(p.brand)
        );
        if (filters.brands.length === 1) {
          appliedFilters.push(filters.brands[0]);
        } else {
          appliedFilters.push(`${filters.brands.length} brands`);
        }
      }
      
      // Apply in-stock filter
      if (filters.inStock) {
        filtered = filtered.filter(p => p.stockStatus !== 'out_of_stock');
        appliedFilters.push('In Stock');
      }
      
      // Apply rating filter
      if (filters.rating) {
        filtered = filtered.filter(p => p.rating >= filters.rating!);
        appliedFilters.push(`${filters.rating}+ rating`);
      }
      
      // Apply sort
      if (filters.sortBy) {
        let sorted = [...filtered];
        switch (filters.sortBy) {
          case 'price_low_high':
            sorted.sort((a, b) => a.price - b.price);
            break;
          case 'price_high_low':
            sorted.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
          case 'popularity':
            sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
            break;
          case 'trending':
            sorted.sort((a, b) => ((b.trending ? 1 : 0) - (a.trending ? 1 : 0)));
            break;
          case 'newest':
            // For demo, just reverse the current order
            sorted.reverse();
            break;
          default:
            // Relevance is default order in our sample data
            break;
        }
        filtered = sorted;
      }
      
      setDisplayedProducts(filtered);
      setMobileFiltersOpen(false);
      
      // Display success notification
      setShowNotification(false);
      setTimeout(() => {
        const filterText = appliedFilters.length > 0 
          ? `Showing ${filtered.length} products filtered by: ${appliedFilters.join(', ')}`
          : `Showing ${filtered.length} products`;
        
        setNotificationText(filterText);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }, 200);
    }, 600);
  };
  
  // Calculate cart badge count
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  // Format time for countdown
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Render the price with appropriate formatting
  const renderPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };
  
  // Render Monsoon Special section
  const renderMonsoonSpecial = () => {
    // For demo purposes, select products for monsoon section
    const monsoonProducts = products
      .filter(p => p.tags?.includes('monsoon') || p.category === 'wipers' || p.subCategory === 'lights')
      .slice(0, 4);
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="my-12 relative overflow-hidden"
      >
        {/* Cloud and rain effects */}
        <div className="absolute -top-10 -left-10 w-full h-full overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-0 left-10 w-16 h-12 bg-gray-200 rounded-full opacity-40"
            animate={{
              x: [0, 15, 0],
              y: [0, 5, 0],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute top-2 left-20 w-24 h-12 bg-gray-200 rounded-full opacity-30"
            animate={{
              x: [0, -15, 0],
              y: [0, 8, 0],
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.5
            }}
          />
          <motion.div 
            className="absolute top-0 right-40 w-20 h-10 bg-gray-200 rounded-full opacity-30"
            animate={{
              x: [0, 20, 0],
              y: [0, 5, 0],
            }}
            transition={{ 
              duration: 7, 
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          />
          
          {/* Rain effects */}
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-6 bg-blue-400 opacity-30 rounded-full"
              style={{ 
                left: `${10 + Math.random() * 80}%`, 
                top: `-20px`,
              }}
              animate={{
                y: [0, 100],
                opacity: [0, 0.4, 0]
              }}
              transition={{
                duration: 1 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
            />
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-6 border border-blue-100 relative shadow-md">
          <div className="flex justify-between items-center mb-6 relative">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent inline-flex items-center">
                <BatteryCharging className="h-6 w-6 mr-2 text-blue-600" />
                Monsoon Special
              </h2>
              <p className="text-gray-600">Stay safe this rainy season with essential vehicle accessories</p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="sm"
                className="hover:bg-blue-50 border-blue-200 text-blue-700"
                onClick={() => {
                  // Show all monsoon related products
                  const monsoonProducts = products.filter(p => 
                    p.category === 'wipers' || 
                    p.tags.includes('monsoon') || 
                    p.tags.includes('rain')
                  );
                  setDisplayedProducts(monsoonProducts);
                  
                  // Provide user feedback
                  setNotificationText(`Showing all ${monsoonProducts.length} monsoon special products`);
                  setShowNotification(true);
                  setTimeout(() => setShowNotification(false), 3000);
                  
                  // Scroll to product grid
                  window.scrollTo({
                    top: document.getElementById('products-grid')?.offsetTop || 0,
                    behavior: 'smooth'
                  });
                }}
              >
                View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {monsoonProducts.map((product, index) => (
              <div key={product.id} onClick={() => handleProductClick(product)}>
                {renderProductCard(product, index, true)}
              </div>
            ))}
          </div>
          
          {/* Info banner */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-blue-800 text-sm">
                <strong>Drive safe!</strong> Prepare your vehicle for the rainy season with our top-rated products
              </span>
            </div>
            <Badge variant="secondary" className="bg-white text-blue-700">Limited Time Offers</Badge>
          </div>
        </div>
      </motion.div>
    );
  };
  
  // Render product cards with animations and 3D effects
  const renderProductCard = (product: Product, index: number, isFeatured: boolean = false) => {
    const isInWishlist = wishlistItems.includes(product.id);
    const hasDiscount = !!product.discount && product.discount > 0;
    const stockWarning = product.stockStatus === 'low_stock';
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ 
          y: -8, 
          scale: 1.02,
          boxShadow: "0 20px 30px rgba(0, 0, 0, 0.08)",
          transition: { duration: 0.3 }
        }}
        className={`bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 ${isFeatured ? 'h-full' : ''} relative`}
        style={{ perspective: "1000px" }}
      >
        {/* Product Image with 3D hover effect */}
        <div className="relative overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            
            {/* Subtle glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5"></div>
          </motion.div>
          
          {/* Wishlist Button with animation */}
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-2 right-2 z-10"
          >
            <Button
              variant={isInWishlist ? "destructive" : "outline"}
              size="icon"
              className="rounded-full bg-white/80 backdrop-blur-sm shadow-sm h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
            >
              <motion.div
                animate={isInWishlist ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
              </motion.div>
            </Button>
          </motion.div>
          
          {/* Discount Badge with pulsing animation */}
          {hasDiscount && (
            <motion.div
              className="absolute top-2 left-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Badge className="bg-gradient-to-r from-red-500 to-rose-500 shadow-md">
                {product.discount}% OFF
              </Badge>
            </motion.div>
          )}
          
          {/* Trending Tag with flame animation */}
          {product.trending && (
            <motion.div 
              className="absolute bottom-2 left-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center shadow-md"
              initial={{ opacity: 0.9 }}
              animate={{ opacity: [0.9, 1, 0.9] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <motion.div
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Flame className="h-3 w-3 mr-1" />
              </motion.div>
              Trending
            </motion.div>
          )}
        </div>
        
        <div className="p-4 relative">
          {/* Soft glow for premium products */}
          {product.rating > 4.5 && (
            <div className="absolute -top-10 right-0 w-20 h-20 bg-blue-400/10 rounded-full blur-xl z-0"></div>
          )}
          
          <div className="relative z-10">
            <div className="flex justify-between items-start gap-2 mb-1">
              <h3 className="font-semibold text-sm line-clamp-2 flex-1">{product.name}</h3>
              <Badge 
                variant="outline" 
                className={`${
                  product.type === 'oem' 
                    ? 'bg-blue-50 text-blue-700 border-blue-100' 
                    : 'bg-green-50 text-green-700 border-green-100'
                } text-xs`}
              >
                {product.type === 'oem' ? 'OEM' : 'Aftermarket'}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : i < product.rating 
                          ? 'fill-yellow-400/50 text-yellow-400/50'
                          : 'text-gray-300'
                    }`} 
                  />
                ))}
                <span className="text-sm font-medium ml-1">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
              </div>
              <motion.span 
                className="text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100"
                whileHover={{ backgroundColor: "#f0f9ff", color: "#3b82f6" }}
              >
                {product.brand}
              </motion.span>
            </div>
            
            <div className="text-gray-700 text-xs mb-3 line-clamp-2">{product.description}</div>
            
            <div className="flex items-end justify-between mb-3">
              <div>
                <div className="font-bold text-lg bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  {renderPrice(product.price)}
                </div>
                {hasDiscount && product.oldPrice && (
                  <div className="text-gray-500 text-xs line-through">
                    {renderPrice(product.oldPrice)}
                  </div>
                )}
              </div>
              
              {stockWarning && (
                <motion.div 
                  className="text-amber-600 text-xs flex items-center"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Only {Math.floor(Math.random() * 5) + 1} left
                </motion.div>
              )}
              
              {product.stockStatus === 'out_of_stock' && (
                <div className="text-red-500 text-xs font-medium">
                  Out of Stock
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="default" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-blue-300/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  disabled={product.stockStatus === 'out_of_stock'}
                >
                  {product.stockStatus === 'out_of_stock' ? 'Notify Me' : 'Add to Cart'}
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  variant="outline" 
                  size="icon"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductClick(product);
                  }}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* 3D perspective effect for featured products */}
        {isFeatured && (
          <div className="absolute inset-0 pointer-events-none" style={{ transform: "translateZ(-10px)" }}></div>
        )}
      </motion.div>
    );
  };
  
  // Render featured products section with enhanced 3D animations
  const renderFeaturedProducts = () => {
    const featuredProducts = products
      .filter(p => p.isFeatured)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
      
    return (
      <motion.div 
        ref={featuredRef}
        initial={{ opacity: 0, y: 20 }}
        animate={featuredControls}
        className="mb-12"
      >
        {/* 3D Background Elements */}
        <div className="relative">
          <motion.div 
            className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-blue-100 opacity-50 blur-3xl -z-10"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: 360
            }}
            transition={{
              scale: { duration: 8, repeat: Infinity, repeatType: "reverse" },
              rotate: { duration: 20, repeat: Infinity, ease: "linear" }
            }}
          />
          
          <motion.div 
            className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-indigo-100 opacity-50 blur-3xl -z-10"
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: -360
            }}
            transition={{
              scale: { duration: 10, repeat: Infinity, repeatType: "reverse", delay: 1 },
              rotate: { duration: 25, repeat: Infinity, ease: "linear" }
            }}
          />
          
          <div className="flex justify-between items-center mb-6 relative">
            <div>
              <motion.h2 
                className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Featured Products
              </motion.h2>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Handpicked by our experts for your vehicle
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button 
                variant="outline" 
                className="gap-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                onClick={() => {
                  // Apply filter to show all featured products
                  const featuredProducts = products.filter(p => p.isFeatured);
                  setDisplayedProducts(featuredProducts);
                  setNotificationText(`Showing all ${featuredProducts.length} featured products`);
                  setShowNotification(true);
                  setTimeout(() => setShowNotification(false), 3000);
                  
                  // Scroll to displayed products
                  window.scrollTo({
                    top: document.getElementById('products-grid')?.offsetTop || 0,
                    behavior: 'smooth'
                  });
                }}
              >
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </motion.div>
          </div>
          
          {/* Featured Products with 3D Effect */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative perspective">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  delay: 0.2 + index * 0.15,
                  type: "spring", 
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{ 
                  y: -10, 
                  boxShadow: '0 20px 30px rgba(0, 0, 0, 0.1)',
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="bg-white rounded-xl border border-blue-50 shadow-blue-100/50 shadow-lg overflow-hidden h-full transform-gpu"
                onClick={() => handleProductClick(product)}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="h-full" style={{ transform: "translateZ(0px)" }}>
                  {renderProductCard(product, index, true)}
                </div>
                
                {/* Pseudo 3D effect elements */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-white/0 to-blue-50/20 pointer-events-none"
                  style={{ transform: "translateZ(2px)" }}
                />
                
                {/* Product highlight glow */}
                <motion.div 
                  className={`absolute -inset-1 bg-gradient-to-r ${
                    index % 2 === 0 ? 'from-blue-600/5 to-indigo-600/5' : 'from-indigo-600/5 to-blue-600/5'
                  } rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: index * 0.5 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };
  
  // AI Feature components
  const AIFeatureExplainer = () => (
    <Dialog open={showAIExplainer} onOpenChange={setShowAIExplainer}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI-Powered Features
          </DialogTitle>
          <DialogDescription>
            Our marketplace utilizes advanced AI technologies to enhance your shopping experience
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-2">
          <div className="flex items-start gap-3 border-b pb-3">
            <div className="bg-blue-100 p-2 rounded-full text-blue-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Smart Search</h3>
              <p className="text-sm text-gray-600">Understanding your query beyond just keywords to deliver the most relevant results</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 border-b pb-3">
            <div className="bg-orange-100 p-2 rounded-full text-orange-700">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-orange-800">Personalized Recommendations</h3>
              <p className="text-sm text-gray-600">Analyzes your browsing and purchase history to suggest products you're likely to need</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 border-b pb-3">
            <div className="bg-green-100 p-2 rounded-full text-green-700">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-green-800">Smart Bundling</h3>
              <p className="text-sm text-gray-600">Creates optimal product bundles based on compatibility and frequently purchased combinations</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 border-b pb-3">
            <div className="bg-purple-100 p-2 rounded-full text-purple-700">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-purple-800">Vehicle Compatibility</h3>
              <p className="text-sm text-gray-600">Advanced matching algorithm ensures products are compatible with your specific vehicle</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-red-100 p-2 rounded-full text-red-700">
              <BadgePercent className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-red-800">Dynamic Pricing</h3>
              <p className="text-sm text-gray-600">Intelligent pricing suggestions based on market trends, demand, and inventory levels</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="ai-features" className="text-blue-800 font-medium">Enable AI Features</Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-blue-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-80 text-xs">
                    When enabled, we use AI to enhance your shopping experience with personalized recommendations,
                    smart search, and compatibility checks.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch
              id="ai-features"
              checked={aiEnabled}
              onCheckedChange={setAiEnabled}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            onClick={() => setShowAIExplainer(false)}
          >
            Continue Shopping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <motion.header 
        className="sticky top-0 z-30 bg-white border-b"
        style={{ opacity: headerOpacity }}
      >
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/')}
                className="font-bold text-xl"
              >
                FixPoint
              </Button>
              <div className="flex items-center">
                <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
                  Marketplace
                </Badge>
                <Badge 
                  variant="outline" 
                  className="ml-1 text-xs cursor-pointer border-0 hover:bg-blue-50" 
                  onClick={() => setShowAIExplainer(true)}
                >
                  <Brain className="h-3 w-3 mr-1 text-blue-600" />
                  AI Powered
                </Badge>
              </div>
            </div>
            
            <div className="hidden md:flex items-center w-1/2 relative">
              <div className="relative w-full">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search India's largest catalog for auto parts..."
                  className="w-full pr-10 border-blue-200 focus:border-blue-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                {isSearching ? (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Spinner />
                  </div>
                ) : (
                  <Search 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4 cursor-pointer" 
                    onClick={handleSearch} 
                  />
                )}
                
                {/* AI Search Results Dropdown */}
                {searchQuery && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-2 border-b bg-blue-50 flex items-center">
                      <Brain className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-800">AI-powered search results</span>
                    </div>
                    
                    <div className="divide-y">
                      {searchResults.map((product) => (
                        <div 
                          key={product.id}
                          className="p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                          onClick={() => {
                            handleProductClick(product);
                            setSearchQuery('');
                            setSearchResults([]);
                          }}
                        >
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-md"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium truncate">{product.name}</h3>
                            <div className="flex items-center text-xs text-gray-500">
                              <span className="truncate">{product.brand}</span>
                              <span className="mx-1">•</span>
                              <span>{renderPrice(product.price)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline"
                      size="icon" 
                      className="relative"
                      onClick={() => setCartOpen(true)}
                    >
                      <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
                      {cartItemCount > 0 && (
                        <Badge 
                          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white border-0" 
                        >
                          {cartItemCount}
                        </Badge>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your Cart</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline"
                      size="icon" 
                      className="relative"
                    >
                      <Heart className="h-[1.2rem] w-[1.2rem]" />
                      {wishlistItems.length > 0 && (
                        <Badge 
                          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white border-0" 
                        >
                          {wishlistItems.length}
                        </Badge>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your Wishlist</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="md:hidden mt-4">
            <div className="relative w-full">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for parts..."
                className="w-full pr-10"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 cursor-pointer" 
                onClick={handleSearch} 
              />
            </div>
          </div>
          
          {/* Vehicle Selection */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm">Your Vehicle:</span>
            {selectedVehicle ? (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="py-2 flex items-center gap-2 border-blue-200">
                  <img 
                    src={selectedVehicle.image} 
                    alt={`${selectedVehicle.make} ${selectedVehicle.model}`} 
                    className="h-4 w-auto"
                  />
                  <span>
                    {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.variant}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 ml-2"
                    onClick={() => setSelectedVehicle(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
                
                <span className="text-sm text-green-600 flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Showing compatible parts
                </span>
              </div>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 border-blue-200 text-blue-700">
                    Select Your Vehicle <ChevronDown className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Select Your Vehicle</DialogTitle>
                    <DialogDescription>
                      Choose from your saved vehicles or add a new one
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <ScrollArea className="h-[300px]">
                      {savedVehicles.map((vehicle) => (
                        <div 
                          key={vehicle.id}
                          className="flex items-center p-3 border rounded-lg mb-2 cursor-pointer hover:bg-muted"
                          onClick={() => {
                            handleVehicleSelect(vehicle);
                          }}
                        >
                          <img 
                            src={vehicle.image} 
                            alt={`${vehicle.make} ${vehicle.model}`} 
                            className="h-10 w-16 object-contain mr-3"
                          />
                          <div>
                            <div className="font-medium">
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {vehicle.variant} • {vehicle.fuelType}
                            </div>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </motion.header>
      
      {/* Hero Banner */}
      <div className="container mx-auto px-4 mt-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <BannerSlider
            slides={[
              {
                id: 1,
                image: 'https://images.unsplash.com/photo-1597766353939-e1e6382cf513?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3',
                title: 'India\'s Largest Auto Parts Marketplace',
                description: 'Over 1 million parts for all vehicles with doorstep delivery across India',
                buttonText: 'Explore Now',
                buttonLink: '#featured'
              },
              {
                id: 2,
                image: 'https://images.unsplash.com/photo-1599032909756-5deb82ffa85e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3',
                title: 'Monsoon Season Sale | Up to 40% Off',
                description: 'Prepare your vehicle for the rains with our exclusive deals on wipers, lights, and more',
                buttonText: 'Shop the Sale',
                buttonLink: '/marketplace?category=monsoon'
              },
              {
                id: 3,
                image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3',
                title: 'Premium OEM Parts',
                description: 'Genuine parts from top manufacturers with warranty and expert support',
                buttonText: 'Shop OEM',
                buttonLink: '/marketplace?type=oem'
              }
            ]}
            className="h-[300px] md:h-[400px] mb-6 rounded-xl overflow-hidden"
          />
        </motion.div>
        
        {/* Brand Promise */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="border-blue-100">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Free Shipping</h3>
                <p className="text-xs text-gray-500">On orders above ₹2000</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-100">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full text-green-700">
                <RotateCw className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Easy Returns</h3>
                <p className="text-xs text-gray-500">30-day return policy</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-amber-100">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-full text-amber-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Authentic Parts</h3>
                <p className="text-xs text-gray-500">100% genuine products</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-100">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-full text-purple-700">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Expert Support</h3>
                <p className="text-xs text-gray-500">7 days customer service</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4">
        {/* Flash Sale */}
        {flashSaleActive && flashSaleProduct && (
          <motion.div
            ref={flashSaleRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={flashSaleControls}
            className="mb-6 relative overflow-hidden rounded-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 animate-pulse-slow" />
            <div className="absolute inset-0 bg-black/10" />
            
            <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-white max-w-md">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="h-6 w-6 text-yellow-300" />
                  <h2 className="text-2xl font-bold uppercase tracking-wider">Flash Sale</h2>
                </div>
                
                <h3 className="text-xl md:text-3xl font-bold mb-2">{flashSaleProduct.name}</h3>
                <p className="mb-3 text-white/80">{flashSaleProduct.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl font-bold">{renderPrice(flashSaleProduct.price)}</div>
                  {flashSaleProduct.oldPrice && (
                    <div className="text-lg text-white/70 line-through">{renderPrice(flashSaleProduct.oldPrice)}</div>
                  )}
                  <div className="bg-white text-red-600 px-2 py-1 rounded-md font-bold text-sm">
                    {flashSaleProduct.discount}% OFF
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white">
                    <div className="text-xs uppercase tracking-wider mb-1">Ends In</div>
                    <div className="text-xl font-mono font-bold">{formatTime(flashSaleTimeRemaining)}</div>
                  </div>
                  
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white">
                    <div className="text-xs uppercase tracking-wider mb-1">Sold</div>
                    <div className="text-xl font-bold">{Math.floor(Math.random() * 30) + 65}%</div>
                  </div>
                </div>
                
                <Button 
                  size="lg"
                  className="bg-white text-red-600 hover:bg-white/90 hover:text-red-700"
                  onClick={() => flashSaleProduct && addToCart(flashSaleProduct)}
                >
                  <Flame className="h-4 w-4 mr-2" />
                  Grab This Deal
                </Button>
              </div>
              
              <div className="flex flex-col">
                {flashSaleProduct && (
                  <div className="bg-white p-4 rounded-xl shadow-xl max-w-xs">
                    <img 
                      src={flashSaleProduct.images?.[0] || 'https://via.placeholder.com/400x300?text=Product+Image'} 
                      alt={flashSaleProduct.name}
                      className="h-48 w-full object-contain"
                    />
                    
                    <div className="mt-2">
                      <Badge className="bg-red-100 text-red-700 border-0">Best Seller</Badge>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm ml-1">({flashSaleProduct.reviewCount || 0})</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <Progress value={65} className="mt-3 h-2" />
                <p className="text-xs text-gray-500 mt-1">65% Sold out</p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Current Promotion */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 mb-10"
        >
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 md:p-6 border border-blue-100 relative overflow-hidden shadow-lg">
            {/* 3D Floating Elements */}
            <motion.div 
              className="absolute w-32 h-32 rounded-full bg-blue-300 opacity-20 blur-xl"
              style={{ top: '-10%', right: '-5%' }}
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
              }}
            />
            
            <motion.div 
              className="absolute w-24 h-24 rounded-full bg-indigo-400 opacity-20 blur-xl"
              style={{ bottom: '-10%', left: '5%' }}
              animate={{ 
                rotate: -360,
                scale: [1, 1.3, 1],
              }}
              transition={{ 
                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                scale: { duration: 7, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }
              }}
            />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <motion.div 
                  className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-3 rounded-xl"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BadgePercent className="h-6 w-6" />
                </motion.div>
                
                <div>
                  <motion.h3 
                    className="text-xl font-bold text-blue-800 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    {currentPromotion.title}
                  </motion.h3>
                  <p className="text-blue-700 mb-2">{currentPromotion.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
                      {currentPromotion.discount}% OFF
                    </Badge>
                    
                    <motion.div 
                      className="bg-white px-2 py-1 rounded border border-blue-200 font-mono text-sm text-blue-800"
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)" 
                      }}
                    >
                      {currentPromotion.code}
                    </motion.div>
                    
                    <motion.div 
                      className="text-xs text-blue-700 flex items-center"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Expires in {currentPromotion.expiresIn} hours
                    </motion.div>
                  </div>
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-blue-300/50"
                  onClick={() => {
                    navigator.clipboard.writeText(currentPromotion.code);
                    setNotificationText(`Copied code ${currentPromotion.code} to clipboard!`);
                    setShowNotification(true);
                    setTimeout(() => setShowNotification(false), 2000);
                  }}
                >
                  <Megaphone className="h-4 w-4 mr-2" />
                  Copy & Apply
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Monsoon Special Section */}
        {renderMonsoonSpecial()}
        
        {/* Featured Products Section */}
        {renderFeaturedProducts()}
        
        {/* Categories Section */}
        <motion.div 
          ref={categoriesRef}
          initial={{ opacity: 0, y: 20 }}
          animate={categoriesControls}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Shop by Category</h2>
              <p className="text-gray-500">Find the perfect parts for your specific needs</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.filter(c => c.value !== 'all').map((category, index) => (
              <motion.div
                key={category.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
                className="bg-white rounded-xl border border-gray-200 p-4 text-center cursor-pointer hover:border-blue-200 transition-all"
                onClick={() => handleCategoryFilter(category.value)}
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-3">
                  <div className="text-blue-600">
                    {category.icon}
                  </div>
                </div>
                <h3 className="font-medium text-sm">{category.label}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {products.filter(p => p.category === category.value).length} items
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Social Proof */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-amber-100 p-2 rounded-full text-amber-700">
                  <ThumbsUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Customer Satisfaction</h3>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-1" />
                    <span className="text-sm font-medium">4.8/5</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-amber-800">Based on <span className="font-medium"><AnimatedCounter value={54621} /></span> verified reviews</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 p-2 rounded-full text-green-700">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Express Delivery</h3>
                  <p className="text-xs text-gray-500">Across India</p>
                </div>
              </div>
              <p className="text-sm text-green-800">
                <span className="font-medium"><AnimatedCounter value={320} /></span> cities with same-day delivery
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Products Available</h3>
                  <p className="text-xs text-gray-500">For all vehicle models</p>
                </div>
              </div>
              <p className="text-sm text-blue-800">
                <span className="font-medium"><AnimatedCounter value={1000000} duration={3} /></span>+ parts in our catalog
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 p-2 rounded-full text-purple-700">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Live Visitors</h3>
                  <motion.div 
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex items-center"
                  >
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                    <p className="text-xs text-gray-500">Active now</p>
                  </motion.div>
                </div>
              </div>
              <p className="text-sm text-purple-800">
                <motion.span
                  key={liveVisitorCount}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="font-medium"
                >
                  {liveVisitorCount}
                </motion.span> people shopping with you
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Recent Purchases */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-10 relative overflow-hidden rounded-xl border border-gray-200"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white"></div>
          
          <div className="relative p-4">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="h-5 w-5 text-green-600" />
              <h3 className="font-medium">Recent Purchases</h3>
            </div>
            
            <div className="divide-y">
              {recentPurchases.map((purchase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="py-2 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white rounded-md p-1 border">
                      <img 
                        src={purchase.product.images[0]} 
                        alt={purchase.product.name}
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{purchase.product.name}</div>
                      <div className="text-xs text-gray-500">
                        {purchase.time === 0 ? 'Just now' : `${purchase.time} mins ago`}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">{purchase.user}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Main Product Grid with Filters */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-1/4 lg:w-1/5">
            <Card className="sticky top-28">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Filters</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {displayedProducts.length} products
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <h4 className="text-sm font-medium mb-2">Categories</h4>
                  <Accordion type="single" collapsible defaultValue="categories">
                    <AccordionItem value="categories">
                      <AccordionTrigger className="text-sm">Browse by Category</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <div 
                              key={category.value} 
                              className={`
                                text-sm px-2 py-1 cursor-pointer rounded hover:bg-muted flex items-center
                                ${activeCategory === category.value ? 'font-medium text-primary bg-muted' : 'text-foreground'}
                              `}
                              onClick={() => handleCategoryFilter(category.value)}
                            >
                              <div className="mr-2">{category.icon}</div>
                              <span>{category.label}</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Price Range</h4>
                  <div className="space-y-4">
                    <Slider
                      defaultValue={[0, 50000]}
                      max={50000}
                      step={1000}
                      className="mt-6"
                    />
                    <div className="flex justify-between">
                      <div className="text-sm">₹0</div>
                      <div className="text-sm">₹50,000</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Brand</h4>
                  <div className="space-y-2">
                    {['Bosch', 'Valeo', 'NGK', 'Denso', 'Continental'].map((brand) => (
                      <div key={brand} className="flex items-center">
                        <input type="checkbox" id={brand} className="mr-2" />
                        <label htmlFor={brand} className="text-sm">{brand}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Rating</h4>
                  <div className="space-y-2">
                    {[5, 4, 3].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <input type="radio" name="rating" id={`rating-${rating}`} className="mr-2" />
                        <label htmlFor={`rating-${rating}`} className="text-sm flex items-center">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                          {Array.from({ length: 5 - rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-gray-300" />
                          ))}
                          <span className="ml-1">& up</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Product Type</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="oem" className="mr-2" />
                      <label htmlFor="oem" className="text-sm">OEM</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="aftermarket" className="mr-2" />
                      <label htmlFor="aftermarket" className="text-sm">Aftermarket</label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Availability</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="in-stock" className="mr-2" />
                      <label htmlFor="in-stock" className="text-sm">In Stock</label>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={applyFilters}
                >
                  Apply Filters
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Mobile Filters Button */}
          <div className="md:hidden mb-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-between"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </div>
              <Badge>{displayedProducts.length} products</Badge>
            </Button>
          </div>
          
          {/* Mobile Filters Sheet */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetContent side="left" className="overflow-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your product search
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-5 py-4">
                {/* Mobile filters content - similar to desktop */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div 
                        key={category.value} 
                        className={`
                          text-sm px-2 py-1 cursor-pointer rounded hover:bg-muted flex items-center
                          ${activeCategory === category.value ? 'font-medium text-primary bg-muted' : 'text-foreground'}
                        `}
                        onClick={() => {
                          handleCategoryFilter(category.value);
                          setMobileFiltersOpen(false);
                        }}
                      >
                        <div className="mr-2">{category.icon}</div>
                        <span>{category.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Price Range, Brand, Rating filters... */}
                
                <SheetFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={applyFilters}
                  >
                    Apply Filters
                  </Button>
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Main Products Content */}
          <div className="flex-1">
            {/* Sort Controls */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {activeCategory === 'all' 
                  ? 'All Products' 
                  : categories.find(c => c.value === activeCategory)?.label || 'Products'}
              </h2>
              
              <div className="flex items-center gap-2">
                <Select 
                  defaultValue={filters.sortBy}
                  onValueChange={(value) => handleSortChange(value as FilterOptions['sortBy'])}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="price_low_high">Price: Low to High</SelectItem>
                    <SelectItem value="price_high_low">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Products Grid */}
            <div id="products-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product, index) => (
                  <div key={product.id} onClick={() => handleProductClick(product)}>
                    {renderProductCard(product, index)}
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <Package className="h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-800 mb-1">No products found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                  <Button 
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setFilters({
                        vehicleId: null,
                        category: null,
                        subCategory: null,
                        type: null,
                        priceRange: null,
                        brands: [],
                        inStock: false,
                        rating: null,
                        sortBy: 'relevance'
                      });
                      setDisplayedProducts(products);
                      setActiveCategory('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
            
            {/* Empty State handling moved inside the grid component */}
            
            {/* Load More */}
            {displayedProducts.length > 0 && displayedProducts.length < products.length && (
              <div className="flex justify-center mt-6">
                <Button 
                  variant="outline"
                  className="px-8"
                  onClick={() => {
                    // Load more products logic
                    const currentCount = displayedProducts.length;
                    const moreProducts = products
                      .filter(p => !displayedProducts.some(dp => dp.id === p.id))
                      .slice(0, 12);
                      
                    setDisplayedProducts([...displayedProducts, ...moreProducts]);
                  }}
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Product Modal */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
          <DialogContent className="sm:max-w-4xl overflow-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
              <DialogDescription>
                {selectedProduct.partNumber} • {selectedProduct.brand}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="rounded-lg overflow-hidden border mb-4">
                  <img 
                    src={selectedProduct.images[0]} 
                    alt={selectedProduct.name}
                    className="w-full h-64 object-contain"
                  />
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {selectedProduct.images.map((image, i) => (
                    <div 
                      key={i}
                      className="border rounded-md overflow-hidden cursor-pointer hover:border-primary"
                    >
                      <img 
                        src={image} 
                        alt={`${selectedProduct.name} - view ${i + 1}`}
                        className="w-full h-16 object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                        {selectedProduct.type === 'oem' ? 'OEM' : 'Aftermarket'}
                      </Badge>
                      
                      {selectedProduct.trending && (
                        <Badge className="bg-gradient-to-r from-orange-500 to-amber-500">
                          <Flame className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < Math.floor(selectedProduct.rating) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : i < selectedProduct.rating 
                                ? 'fill-yellow-400/50 text-yellow-400/50'
                                : 'text-gray-300'
                          }`} 
                        />
                      ))}
                      <span className="text-sm ml-1 font-medium">{selectedProduct.rating.toFixed(1)}</span>
                      <span className="text-xs text-gray-500 ml-1">({selectedProduct.reviewCount} reviews)</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full ${wishlistItems.includes(selectedProduct.id) ? 'text-red-500' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(selectedProduct.id);
                    }}
                  >
                    <Heart className={`h-5 w-5 ${wishlistItems.includes(selectedProduct.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-2xl font-bold">{renderPrice(selectedProduct.price)}</span>
                    
                    {selectedProduct.discount && selectedProduct.discount > 0 && selectedProduct.oldPrice && (
                      <>
                        <span className="text-gray-500 line-through">{renderPrice(selectedProduct.oldPrice)}</span>
                        <Badge className="bg-red-500">Save {selectedProduct.discount}%</Badge>
                      </>
                    )}
                  </div>
                  
                  {selectedProduct.stockStatus === 'in_stock' && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      In Stock
                    </Badge>
                  )}
                  
                  {selectedProduct.stockStatus === 'low_stock' && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-100">
                      <Clock className="h-3 w-3 mr-1" />
                      Low Stock - Only {Math.floor(Math.random() * 5) + 1} left
                    </Badge>
                  )}
                  
                  {selectedProduct.stockStatus === 'out_of_stock' && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-100">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                
                <p className="text-gray-700 mb-4">{selectedProduct.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 p-2 rounded-md">
                      <span className="text-gray-500">Brand:</span>
                      <span className="font-medium ml-1">{selectedProduct.brand}</span>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded-md">
                      <span className="text-gray-500">Part Number:</span>
                      <span className="font-medium ml-1">{selectedProduct.partNumber}</span>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded-md">
                      <span className="text-gray-500">Warranty:</span>
                      <span className="font-medium ml-1">{selectedProduct.warranty} months</span>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded-md">
                      <span className="text-gray-500">Installation:</span>
                      <span className="font-medium ml-1">
                        {['Very Easy', 'Easy', 'Moderate', 'Difficult', 'Expert Only'][selectedProduct.installationDifficulty - 1]}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mb-4">
                  <div className="flex items-center border rounded-md">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10"
                      onClick={() => {
                        // Decrement counter logic if we had one
                      }}
                      disabled={true}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center">1</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10"
                      onClick={() => {
                        // Increment counter logic if we had one
                      }}
                      disabled={selectedProduct.stockStatus === 'out_of_stock'}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={() => addToCart(selectedProduct)}
                    disabled={selectedProduct.stockStatus === 'out_of_stock'}
                  >
                    {selectedProduct.stockStatus === 'out_of_stock' ? 'Notify When Available' : 'Add to Cart'}
                  </Button>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share Product</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="specs">
                    <AccordionTrigger>Specifications</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                          <div key={key} className="grid grid-cols-2 text-sm">
                            <span className="text-gray-500">{key}</span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="compatibility">
                    <AccordionTrigger>Compatible Vehicles</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {selectedProduct.compatibleVehicles.map(vehicleId => {
                          const vehicle = savedVehicles.find(v => v.id === vehicleId);
                          return vehicle ? (
                            <div key={vehicleId} className="flex items-center gap-2 text-sm">
                              <img 
                                src={vehicle.image} 
                                alt={`${vehicle.make} ${vehicle.model}`}
                                className="h-6 w-10 object-contain"
                              />
                              <span>
                                {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.variant}
                              </span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="shipping">
                    <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <p>• Free shipping on orders above ₹2000</p>
                        <p>• Standard delivery: 3-5 business days</p>
                        <p>• Express delivery available (additional charges apply)</p>
                        <p>• 30-day return policy for unopened items</p>
                        <p>• Warranty claims processed within 7 business days</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline"
                onClick={() => setSelectedProduct(null)}
                className="sm:w-auto w-full"
              >
                Continue Shopping
              </Button>
              <Button 
                onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="sm:w-auto w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={selectedProduct.stockStatus === 'out_of_stock'}
              >
                {selectedProduct.stockStatus === 'out_of_stock' ? 'Notify When Available' : 'Add to Cart'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Shopping Cart Sheet */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="sm:max-w-md w-full flex flex-col overflow-hidden">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Cart
              <Badge className="ml-2">{cartItems.length} items</Badge>
            </SheetTitle>
          </SheetHeader>
          
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="border-4 border-gray-100 rounded-full p-4">
                <ShoppingCart className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="font-medium text-lg">Your cart is empty</h3>
              <p className="text-gray-500 text-center">
                Start shopping to add items to your cart
              </p>
              <Button 
                onClick={() => setCartOpen(false)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-4 mt-4">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex gap-4 py-3 border-b">
                      <div 
                        className="h-16 w-16 rounded-md border overflow-hidden flex-shrink-0"
                        style={{ background: `url(${item.product.images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium line-clamp-1">{item.product.name}</h4>
                        <div className="text-sm text-gray-500">{item.product.brand}</div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border rounded-md">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="font-semibold">
                            {renderPrice(item.product.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-gray-500"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                {/* AI Recommendations */}
                {aiRecommendations.length > 0 && (
                  <div className="mt-6 space-y-6">
                    {aiRecommendations.map(recommendation => (
                      <div key={recommendation.id} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="bg-blue-100 p-1.5 rounded-full text-blue-700">
                            <Brain className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-800">{recommendation.title}</h4>
                            <div className="text-xs text-blue-600 flex items-center">
                              <span>AI Confidence:</span>
                              <div className="w-16 h-1.5 bg-blue-200 rounded-full ml-1 overflow-hidden">
                                <div 
                                  className="h-full bg-blue-600"
                                  style={{ width: `${recommendation.confidenceScore}%` }}
                                />
                              </div>
                              <span className="ml-1">{recommendation.confidenceScore}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-blue-700 mb-3">{recommendation.description}</p>
                        
                        <ScrollArea className="whitespace-nowrap">
                          <div className="flex gap-3">
                            {recommendation.products.map(product => (
                              <div 
                                key={product.id}
                                className="border rounded-md bg-white w-36 flex-shrink-0 overflow-hidden"
                              >
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name}
                                  className="h-20 w-full object-contain border-b"
                                />
                                <div className="p-2">
                                  <h5 className="text-xs font-medium truncate">{product.name}</h5>
                                  <div className="flex items-center justify-between mt-1">
                                    <div className="text-xs font-bold">{renderPrice(product.price)}</div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => addToCart(product)}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        
                        {recommendation.discount && (
                          <div className="mt-3 text-sm flex items-center justify-between bg-blue-100 p-2 rounded-md">
                            <div className="flex items-center">
                              <Gift className="h-4 w-4 text-blue-700 mr-1" />
                              <span className="text-blue-800">Bundle Discount: {recommendation.discount}% OFF</span>
                            </div>
                            <Button variant="outline" size="sm" className="h-7 text-xs text-blue-700 border-blue-200">
                              Add All
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Recently Viewed */}
                {recentlyViewed.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Recently Viewed</h3>
                    
                    <ScrollArea className="whitespace-nowrap">
                      <div className="flex gap-3">
                        {recentlyViewed.map(product => (
                          <div 
                            key={product.id}
                            className="border rounded-md w-40 flex-shrink-0 overflow-hidden cursor-pointer hover:border-blue-200"
                            onClick={() => {
                              setSelectedProduct(product);
                              setCartOpen(false);
                            }}
                          >
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="h-24 w-full object-contain border-b"
                            />
                            <div className="p-2">
                              <h5 className="text-xs font-medium truncate">{product.name}</h5>
                              <div className="flex items-center justify-between mt-1">
                                <div className="text-xs font-bold">{renderPrice(product.price)}</div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(product);
                                  }}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </ScrollArea>
              
              <div className="border-t pt-4 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{renderPrice(calculateCartTotal())}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Shipping</span>
                    <span>{calculateCartTotal() > 2000 ? 'Free' : renderPrice(200)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Tax (18%)</span>
                    <span>{renderPrice(calculateCartTotal() * 0.18)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between font-bold">
                    <span>Total</span>
                    <span>{renderPrice(
                      calculateCartTotal() + 
                      (calculateCartTotal() > 2000 ? 0 : 200) +
                      (calculateCartTotal() * 0.18)
                    )}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  size="lg"
                >
                  Checkout
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => setCartOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      
      {/* Floating notifications */}
      <AnimatePresence>
        {showNotification && (
          <PulseNotification text={notificationText} />
        )}
      </AnimatePresence>
      
      {/* AI Explainer Dialog */}
      <AIFeatureExplainer />
    </div>
  );
};

// Loading Skeleton component
const Spinner = () => (
  <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default MarketplaceEnhanced;