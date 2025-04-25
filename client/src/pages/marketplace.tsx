import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
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
  Clock
} from 'lucide-react';
import BannerSlider from '@/components/marketplace/banner-slider';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  sortBy: 'relevance' | 'price_low_high' | 'price_high_low' | 'rating' | 'newest';
}

const MarketplacePage: React.FC = () => {
  const [, setLocation] = useLocation();
  
  // State
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [savedVehicles, setSavedVehicles] = useState<Vehicle[]>(sampleVehicles.slice(0, 3));
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
    sortBy: 'relevance'
  });
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>(sampleProducts);
  const [cartItems, setCartItems] = useState<{product: Product, quantity: number}[]>([]);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  
  // Handlers
  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFilters({...filters, vehicleId: vehicle.id});
    // Filter products by compatibility
    const filtered = products.filter(product => 
      product.compatibleVehicles.includes(vehicle.id)
    );
    setDisplayedProducts(filtered);
  };
  
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setDisplayedProducts(products);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.partNumber.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.tags.some(tag => tag.toLowerCase().includes(query))
    );
    setDisplayedProducts(filtered);
  };
  
  const handleCategoryFilter = (category: string) => {
    setActiveCategory(category);
    
    if (category === 'all') {
      setDisplayedProducts(products);
      return;
    }
    
    const filtered = products.filter(product => 
      product.category === category
    );
    setDisplayedProducts(filtered);
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
    } else {
      setWishlistItems([...wishlistItems, productId]);
    }
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
    let filtered = [...products];
    
    // Apply vehicle filter
    if (filters.vehicleId) {
      filtered = filtered.filter(p => 
        p.compatibleVehicles.includes(filters.vehicleId as number)
      );
    }
    
    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    
    // Apply sub-category filter
    if (filters.subCategory) {
      filtered = filtered.filter(p => p.subCategory === filters.subCategory);
    }
    
    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(p => p.type === filters.type);
    }
    
    // Apply price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(p => 
        p.price >= filters.priceRange!.min && 
        p.price <= filters.priceRange!.max
      );
    }
    
    // Apply brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => 
        filters.brands.includes(p.brand)
      );
    }
    
    // Apply in-stock filter
    if (filters.inStock) {
      filtered = filtered.filter(p => p.stockStatus !== 'out_of_stock');
    }
    
    // Apply rating filter
    if (filters.rating) {
      filtered = filtered.filter(p => p.rating >= filters.rating!);
    }
    
    setDisplayedProducts(filtered);
    setMobileFiltersOpen(false);
  };
  
  // Calculate cart badge count
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-10 bg-background">
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
              <Badge variant="secondary" className="ml-2">Marketplace</Badge>
            </div>
            
            <div className="hidden md:flex items-center w-1/2">
              <div className="relative w-full">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for parts, accessories, brands..."
                  className="w-full pr-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Search 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 cursor-pointer" 
                  onClick={handleSearch} 
                />
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
                          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0" 
                          variant="destructive"
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
                          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0" 
                          variant="destructive"
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
                placeholder="Search for parts, accessories..."
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
                <Badge variant="outline" className="py-2 flex items-center gap-2">
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
                  <Button variant="outline" size="sm" className="gap-1">
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
                    
                    <Button variant="outline" onClick={() => setLocation('/vehicles')}>
                      Add New Vehicle
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </header>

      {/* Banner Slider */}
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BannerSlider
            slides={[
              {
                id: 1,
                image: 'https://images.unsplash.com/photo-1558980394-34764db076b4',
                title: 'Premium Parts Collection',
                description: 'Discover our exclusive range of high-quality OEM and aftermarket parts for all vehicle makes and models.',
                buttonText: 'Shop Now',
                buttonLink: '/marketplace?category=engine'
              },
              {
                id: 2,
                image: 'https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0',
                title: 'Special Offer on Brake Systems',
                description: 'Get up to 25% off on premium brake pads, rotors, and complete brake kits. Limited time offer!',
                buttonText: 'View Deals',
                buttonLink: '/marketplace?category=suspension'
              },
              {
                id: 3,
                image: 'https://images.unsplash.com/photo-1517026575980-3e1e2dedeab4',
                title: 'Performance Upgrades',
                description: 'Transform your vehicle with our performance enhancement parts. Engineered for maximum power and efficiency.',
                buttonText: 'Upgrade Now',
                buttonLink: '/marketplace?category=performance'
              }
            ]}
            className="h-[300px] md:h-[400px] mb-6 rounded-xl overflow-hidden"
          />
        </motion.div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto py-6 px-4">
        <div className="md:flex gap-6">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-1/4 pr-4">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
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
                                text-sm px-2 py-1 cursor-pointer rounded hover:bg-muted
                                ${activeCategory === category.value ? 'font-medium text-primary' : 'text-foreground'}
                              `}
                              onClick={() => handleCategoryFilter(category.value)}
                            >
                              {category.label}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Product Type</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="oem" 
                        checked={filters.type === 'oem'} 
                        onChange={() => setFilters({...filters, type: filters.type === 'oem' ? null : 'oem'})} 
                      />
                      <label htmlFor="oem" className="text-sm">OEM Parts</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="aftermarket" 
                        checked={filters.type === 'aftermarket'} 
                        onChange={() => setFilters({...filters, type: filters.type === 'aftermarket' ? null : 'aftermarket'})} 
                      />
                      <label htmlFor="aftermarket" className="text-sm">Aftermarket Parts</label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Price Range</h4>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      placeholder="Min" 
                      className="w-20" 
                      value={filters.priceRange?.min || ''} 
                      onChange={(e) => setFilters({
                        ...filters, 
                        priceRange: {
                          min: Number(e.target.value) || 0, 
                          max: filters.priceRange?.max || 100000
                        }
                      })}
                    />
                    <span>to</span>
                    <Input 
                      type="number" 
                      placeholder="Max" 
                      className="w-20" 
                      value={filters.priceRange?.max || ''} 
                      onChange={(e) => setFilters({
                        ...filters, 
                        priceRange: {
                          min: filters.priceRange?.min || 0, 
                          max: Number(e.target.value) || 100000
                        }
                      })}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Brand</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {brandsList.map((brand) => (
                      <div key={brand} className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id={`brand-${brand}`} 
                          checked={filters.brands.includes(brand)} 
                          onChange={() => {
                            const newBrands = filters.brands.includes(brand) 
                              ? filters.brands.filter(b => b !== brand) 
                              : [...filters.brands, brand];
                            setFilters({...filters, brands: newBrands});
                          }} 
                        />
                        <label htmlFor={`brand-${brand}`} className="text-sm">{brand}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Availability</h4>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="in-stock" 
                      checked={filters.inStock} 
                      onChange={() => setFilters({...filters, inStock: !filters.inStock})} 
                    />
                    <label htmlFor="in-stock" className="text-sm">In Stock Only</label>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Rating</h4>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          id={`rating-${rating}`} 
                          name="rating"
                          checked={filters.rating === rating} 
                          onChange={() => setFilters({...filters, rating: rating})} 
                        />
                        <label htmlFor={`rating-${rating}`} className="text-sm flex items-center">
                          {rating}+ <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full" onClick={applyFilters}>Apply Filters</Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Filters Button - Mobile */}
          <div className="md:hidden mb-4 flex justify-between">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            
            <Select 
              value={filters.sortBy} 
              onValueChange={(value) => handleSortChange(value as FilterOptions['sortBy'])}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price_low_high">Price: Low to High</SelectItem>
                <SelectItem value="price_high_low">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Mobile Filters Dialog */}
          <Dialog open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <DialogContent className="sm:max-w-md h-[90vh]">
              <DialogHeader>
                <DialogTitle>Filters</DialogTitle>
              </DialogHeader>
              
              <ScrollArea className="h-full pr-4">
                <div className="space-y-5 pb-6">
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
                                  text-sm px-2 py-1 cursor-pointer rounded hover:bg-muted
                                  ${activeCategory === category.value ? 'font-medium text-primary' : 'text-foreground'}
                                `}
                                onClick={() => handleCategoryFilter(category.value)}
                              >
                                {category.label}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Product Type</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="mobile-oem" 
                          checked={filters.type === 'oem'} 
                          onChange={() => setFilters({...filters, type: filters.type === 'oem' ? null : 'oem'})} 
                        />
                        <label htmlFor="mobile-oem" className="text-sm">OEM Parts</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="mobile-aftermarket" 
                          checked={filters.type === 'aftermarket'} 
                          onChange={() => setFilters({...filters, type: filters.type === 'aftermarket' ? null : 'aftermarket'})} 
                        />
                        <label htmlFor="mobile-aftermarket" className="text-sm">Aftermarket Parts</label>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Price Range</h4>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        placeholder="Min" 
                        className="w-20" 
                        value={filters.priceRange?.min || ''} 
                        onChange={(e) => setFilters({
                          ...filters, 
                          priceRange: {
                            min: Number(e.target.value) || 0, 
                            max: filters.priceRange?.max || 100000
                          }
                        })}
                      />
                      <span>to</span>
                      <Input 
                        type="number" 
                        placeholder="Max" 
                        className="w-20" 
                        value={filters.priceRange?.max || ''} 
                        onChange={(e) => setFilters({
                          ...filters, 
                          priceRange: {
                            min: filters.priceRange?.min || 0, 
                            max: Number(e.target.value) || 100000
                          }
                        })}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Brand</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {brandsList.map((brand) => (
                        <div key={brand} className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id={`mobile-brand-${brand}`} 
                            checked={filters.brands.includes(brand)} 
                            onChange={() => {
                              const newBrands = filters.brands.includes(brand) 
                                ? filters.brands.filter(b => b !== brand) 
                                : [...filters.brands, brand];
                              setFilters({...filters, brands: newBrands});
                            }} 
                          />
                          <label htmlFor={`mobile-brand-${brand}`} className="text-sm">{brand}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Availability</h4>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="mobile-in-stock" 
                        checked={filters.inStock} 
                        onChange={() => setFilters({...filters, inStock: !filters.inStock})} 
                      />
                      <label htmlFor="mobile-in-stock" className="text-sm">In Stock Only</label>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Rating</h4>
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            id={`mobile-rating-${rating}`} 
                            name="mobile-rating"
                            checked={filters.rating === rating} 
                            onChange={() => setFilters({...filters, rating: rating})} 
                          />
                          <label htmlFor={`mobile-rating-${rating}`} className="text-sm flex items-center">
                            {rating}+ <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
              
              <DialogFooter>
                <Button className="w-full" onClick={applyFilters}>Apply Filters</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Product Listing */}
          <div className="md:w-3/4">
            {/* Sort and Result Count - Desktop */}
            <div className="hidden md:flex justify-between items-center mb-4">
              <div className="text-sm text-muted-foreground">
                Showing {displayedProducts.length} products
              </div>
              
              <Select 
                value={filters.sortBy} 
                onValueChange={(value) => handleSortChange(value as FilterOptions['sortBy'])}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price_low_high">Price: Low to High</SelectItem>
                  <SelectItem value="price_high_low">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest Arrivals</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Categories Tabs - Desktop and Mobile */}
            <Tabs defaultValue="all" className="mb-4">
              <TabsList className="mb-4 w-full overflow-x-auto flex whitespace-nowrap justify-start px-1">
                <TabsTrigger 
                  value="all" 
                  className="flex-shrink-0"
                  onClick={() => handleCategoryFilter('all')}
                >
                  All Products
                </TabsTrigger>
                {categories.slice(1, 7).map((category) => (
                  <TabsTrigger 
                    key={category.value} 
                    value={category.value}
                    className="flex-shrink-0"
                    onClick={() => handleCategoryFilter(category.value)}
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            {/* Products Grid */}
            {displayedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full flex flex-col overflow-hidden">
                      <div 
                        className="relative cursor-pointer overflow-hidden" 
                        onClick={() => handleProductClick(product)}
                      >
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="h-48 w-full object-cover transition-transform hover:scale-105"
                        />
                        
                        {product.discount && (
                          <Badge 
                            variant="destructive" 
                            className="absolute top-2 left-2"
                          >
                            {product.discount}% OFF
                          </Badge>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={`
                            absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80
                            ${wishlistItems.includes(product.id) ? 'text-red-500' : 'text-foreground'}
                          `}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                        >
                          <Heart 
                            className="h-4 w-4" 
                            fill={wishlistItems.includes(product.id) ? 'currentColor' : 'none'} 
                          />
                        </Button>
                        
                        {product.type === 'oem' && (
                          <Badge 
                            variant="secondary" 
                            className="absolute bottom-2 left-2"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" /> OEM
                          </Badge>
                        )}
                      </div>
                      
                      <CardContent className="py-4 flex-grow">
                        <div 
                          className="text-lg font-medium leading-tight mb-1 cursor-pointer hover:text-primary"
                          onClick={() => handleProductClick(product)}
                        >
                          {product.name}
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-2">
                          by <span className="font-medium">{product.brand}</span>
                          {product.sellerInfo.isVerified && (
                            <Badge variant="outline" className="ml-2 text-xs h-5">Verified</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground ml-1">
                            ({product.reviewCount})
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-end mt-4">
                          <div>
                            <div className="text-lg font-semibold">
                              ₹{product.price.toLocaleString()}
                            </div>
                            {product.oldPrice && (
                              <div className="text-sm text-muted-foreground line-through">
                                ₹{product.oldPrice.toLocaleString()}
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs flex items-center">
                            {product.stockStatus === 'in_stock' ? (
                              <span className="text-green-600">In Stock</span>
                            ) : product.stockStatus === 'low_stock' ? (
                              <span className="text-yellow-600">Low Stock</span>
                            ) : (
                              <span className="text-red-600">Out of Stock</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-0">
                        <Button 
                          className="w-full" 
                          onClick={() => addToCart(product)}
                          disabled={product.stockStatus === 'out_of_stock'}
                        >
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-3xl font-semibold mb-2">No Products Found</div>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <Button onClick={() => {
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
                }}>
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Cart Drawer */}
      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="sm:max-w-md h-[90vh]">
          <DialogHeader>
            <DialogTitle>Your Cart</DialogTitle>
            <DialogDescription>
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </DialogDescription>
          </DialogHeader>
          
          {cartItems.length > 0 ? (
            <>
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4 pb-4">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex border-b pb-4">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      
                      <div className="ml-4 flex-grow">
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-sm text-muted-foreground">{item.product.brand}</div>
                        <div className="text-sm">₹{item.product.price.toLocaleString()}</div>
                        
                        <div className="flex items-center mt-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6 rounded-full"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="mx-2 w-8 text-center">{item.quantity}</span>
                          
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6 rounded-full"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="font-medium">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 mt-auto"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{calculateCartTotal().toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between mb-2 text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                
                <div className="flex justify-between mb-4">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">₹{calculateCartTotal().toLocaleString()}</span>
                </div>
                
                <Button className="w-full">Proceed to Checkout</Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-60">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">
                Add items to your cart to continue shopping
              </p>
              <Button onClick={() => setCartOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Product Detail Dialog */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
          <DialogContent className="sm:max-w-4xl h-[90vh]">
            <DialogHeader>
              <DialogTitle>{selectedProduct.name}</DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="h-full pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                {/* Product Images */}
                <div>
                  <div className="mb-4">
                    <img 
                      src={selectedProduct.images[0]} 
                      alt={selectedProduct.name}
                      className="w-full h-64 object-contain rounded border"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedProduct.images.map((image, index) => (
                      <img 
                        key={index}
                        src={image} 
                        alt={`${selectedProduct.name} - view ${index + 1}`}
                        className="h-16 w-full object-cover rounded border cursor-pointer hover:border-primary"
                      />
                    ))}
                  </div>
                </div>
                
                {/* Product Info */}
                <div>
                  <div className="mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-muted-foreground">Part #: {selectedProduct.partNumber}</div>
                        <h2 className="text-2xl font-semibold">{selectedProduct.name}</h2>
                        <div className="text-sm">
                          by <span className="font-medium">{selectedProduct.brand}</span>
                          {selectedProduct.sellerInfo.isVerified && (
                            <Badge variant="outline" className="ml-2">Verified Seller</Badge>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`
                          ${wishlistItems.includes(selectedProduct.id) ? 'text-red-500' : 'text-foreground'}
                        `}
                        onClick={() => toggleWishlist(selectedProduct.id)}
                      >
                        <Heart 
                          className="h-5 w-5" 
                          fill={wishlistItems.includes(selectedProduct.id) ? 'currentColor' : 'none'} 
                        />
                      </Button>
                    </div>
                    
                    <div className="flex items-center my-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(selectedProduct.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">
                        {selectedProduct.rating.toFixed(1)} ({selectedProduct.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-2xl font-bold">
                          ₹{selectedProduct.price.toLocaleString()}
                        </div>
                        {selectedProduct.oldPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            ₹{selectedProduct.oldPrice.toLocaleString()}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm">
                        {selectedProduct.stockStatus === 'in_stock' ? (
                          <span className="text-green-600 flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> In Stock
                          </span>
                        ) : selectedProduct.stockStatus === 'low_stock' ? (
                          <span className="text-yellow-600">Low Stock</span>
                        ) : (
                          <span className="text-red-600">Out of Stock</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-4">
                      {selectedProduct.stockStatus !== 'out_of_stock' && (
                        <div className="flex items-center border rounded-md">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-none"
                            onClick={() => {/* Decrease quantity */}}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <div className="w-12 text-center">1</div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-none"
                            onClick={() => {/* Increase quantity */}}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      
                      <Button 
                        className="flex-grow"
                        onClick={() => addToCart(selectedProduct)}
                        disabled={selectedProduct.stockStatus === 'out_of_stock'}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Product Details */}
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Product Details</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedProduct.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <ShieldCheck className="h-4 w-4 mr-2 text-primary" />
                        <span>{selectedProduct.warranty} Months Warranty</span>
                      </div>
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-2 text-primary" />
                        <span>Free Shipping</span>
                      </div>
                      <div className="flex items-center">
                        <BarChart4 className="h-4 w-4 mr-2 text-primary" />
                        <span>Installation Difficulty: {selectedProduct.installationDifficulty}/5</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <span>Install Time: {selectedProduct.installationTime} mins</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Specifications */}
                  <div>
                    <h3 className="font-medium mb-2">Specifications</h3>
                    <div className="text-sm grid grid-cols-1 gap-2">
                      {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                        <div key={key} className="flex">
                          <span className="w-1/3 font-medium">{key}</span>
                          <span className="w-2/3">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Compatible Vehicles */}
                  <div>
                    <h3 className="font-medium mb-2">Compatible Vehicles</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.compatibleVehicles.map((vehicleId) => {
                        const vehicle = sampleVehicles.find(v => v.id === vehicleId);
                        return vehicle ? (
                          <Badge key={vehicleId} variant="outline">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                  
                  {selectedProduct.installationGuideUrl && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h3 className="font-medium mb-2">Installation Guide</h3>
                        <Button variant="outline" className="text-sm">
                          View Installation Guide
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Related Products */}
              <div className="pb-6">
                <h3 className="font-medium mb-4">Related Products</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedProduct.relatedProducts.map((relatedId) => {
                    const related = products.find(p => p.id === relatedId);
                    return related ? (
                      <Card key={relatedId} className="cursor-pointer" onClick={() => setSelectedProduct(related)}>
                        <img 
                          src={related.images[0]} 
                          alt={related.name}
                          className="h-32 w-full object-cover"
                        />
                        <CardContent className="p-3">
                          <div className="text-sm font-medium">{related.name}</div>
                          <div className="text-xs text-muted-foreground">{related.brand}</div>
                          <div className="text-sm font-semibold mt-1">₹{related.price.toLocaleString()}</div>
                        </CardContent>
                      </Card>
                    ) : null;
                  })}
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Sample Data
const sampleVehicles: Vehicle[] = [
  {
    id: 1,
    type: 'four-wheeler',
    make: 'Honda',
    model: 'City',
    year: 2022,
    variant: 'ZX CVT',
    fuelType: 'petrol',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=2340'
  },
  {
    id: 2,
    type: 'four-wheeler',
    make: 'Toyota',
    model: 'Fortuner',
    year: 2021,
    variant: 'Legender',
    fuelType: 'diesel',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=2340'
  },
  {
    id: 3,
    type: 'two-wheeler',
    make: 'Royal Enfield',
    model: 'Classic 350',
    year: 2023,
    fuelType: 'petrol',
    image: 'https://images.unsplash.com/photo-1558981001-5864b3250a69?auto=format&fit=crop&q=80&w=2340'
  },
  {
    id: 4,
    type: 'four-wheeler',
    make: 'Tata',
    model: 'Nexon EV',
    year: 2023,
    variant: 'MAX XZ+',
    fuelType: 'electric',
    image: 'https://images.unsplash.com/photo-1611016186353-9af58c69a533?auto=format&fit=crop&q=80&w=2340'
  },
  {
    id: 5,
    type: 'truck',
    make: 'Tata',
    model: 'Prima',
    year: 2020,
    fuelType: 'diesel',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=2340'
  }
];

const brandsList = [
  'Bosch', 'Maruti Genuine', 'Toyota Genuine', 'MINDA', 'MRF', 'Apollo', 
  'ACDelco', 'Liqui Moly', 'NGK', 'Exide', 'Amaron', 'Castrol', 'CEAT',
  'Shell', 'Gabriel', 'SKF', 'Mahle', 'Tata Genuine', 'Denso'
];

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'engine', label: 'Engine Parts' },
  { value: 'transmission', label: 'Transmission' },
  { value: 'suspension', label: 'Suspension & Brakes' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'body', label: 'Body & Exterior' },
  { value: 'interior', label: 'Interior' },
  { value: 'wheels', label: 'Wheels & Tires' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'fluids', label: 'Oils & Fluids' },
  { value: 'tools', label: 'Tools & Equipment' }
];

const sampleProducts: Product[] = [
  {
    id: 101,
    name: 'Premium Brake Pad Set - Front',
    description: 'High-performance ceramic brake pads designed for superior stopping power and reduced noise. These pads are dust-free and provide consistent performance across all temperature ranges.',
    type: 'aftermarket',
    category: 'suspension',
    subCategory: 'brakes',
    price: 3999,
    oldPrice: 4599,
    rating: 4.7,
    reviewCount: 128,
    images: [
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1607603750909-408e193868c7?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=2340'
    ],
    brand: 'Bosch',
    compatibleVehicles: [1, 2, 4],
    stockStatus: 'in_stock',
    tags: ['brakes', 'ceramic', 'premium', 'safety'],
    partNumber: 'BP-10472-F',
    specifications: {
      'Material': 'Ceramic Composite',
      'Position': 'Front',
      'Pad Thickness': '12mm',
      'Includes Hardware': 'Yes',
      'Dust Level': 'Low',
      'Noise Level': 'Low',
      'Operating Temperature': 'Up to 550°C'
    },
    installationDifficulty: 3,
    installationTime: 60,
    installationGuideUrl: '/guides/brake-pad-installation',
    warranty: 12,
    discount: 13,
    isFeatured: true,
    relatedProducts: [102, 105, 109],
    sellerInfo: {
      id: 1,
      name: 'AutoParts Direct',
      rating: 4.8,
      isVerified: true
    }
  },
  {
    id: 102,
    name: 'Engine Oil Filter',
    description: 'High-quality engine oil filter that removes harmful contaminants from your engine oil, ensuring optimal engine performance and longevity.',
    type: 'oem',
    category: 'engine',
    subCategory: 'filters',
    price: 599,
    rating: 4.5,
    reviewCount: 85,
    images: [
      'https://images.unsplash.com/photo-1635784063837-6df57e0b5f8e?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2340'
    ],
    brand: 'Toyota Genuine',
    compatibleVehicles: [2],
    stockStatus: 'in_stock',
    tags: ['oil filter', 'engine maintenance', 'genuine'],
    partNumber: 'OF-90915-YZZF4',
    specifications: {
      'Filter Type': 'Spin-On',
      'Thread Size': 'M20 x 1.5',
      'Media Type': 'Synthetic',
      'Filtration Rating': '99.5% @ 20 microns',
      'Anti-Drainback Valve': 'Yes',
      'Relief Valve Setting': '12 PSI'
    },
    installationDifficulty: 2,
    installationTime: 15,
    warranty: 24,
    isFeatured: false,
    relatedProducts: [103, 104, 106],
    sellerInfo: {
      id: 2,
      name: 'Toyota Parts Shop',
      rating: 4.9,
      isVerified: true
    }
  },
  {
    id: 103,
    name: 'Synthetic Engine Oil 5W-30',
    description: 'Full synthetic motor oil that provides superior engine protection and performance in extreme temperatures. Helps improve fuel economy and reduces engine wear.',
    type: 'aftermarket',
    category: 'fluids',
    subCategory: 'engine oil',
    price: 1899,
    oldPrice: 2299,
    rating: 4.8,
    reviewCount: 204,
    images: [
      'https://images.unsplash.com/photo-1600019033021-0800aa0d1f42?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1613214049345-0f8a1729f584?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1635784064136-5e506d693018?auto=format&fit=crop&q=80&w=2340'
    ],
    brand: 'Castrol',
    compatibleVehicles: [1, 2, 4, 5],
    stockStatus: 'in_stock',
    tags: ['engine oil', 'synthetic', 'lubricant'],
    partNumber: 'EO-5W30-4L',
    specifications: {
      'Oil Type': 'Full Synthetic',
      'Viscosity': '5W-30',
      'Capacity': '4L',
      'API Classification': 'SN/CF',
      'ACEA Rating': 'A3/B4',
      'Base Oil Type': 'Group III',
      'Flash Point': '230°C'
    },
    installationDifficulty: 2,
    installationTime: 30,
    warranty: 0,
    discount: 17,
    isFeatured: true,
    relatedProducts: [102, 104, 106],
    sellerInfo: {
      id: 3,
      name: 'Lubricant World',
      rating: 4.6,
      isVerified: true
    }
  },
  {
    id: 104,
    name: 'Air Filter Element',
    description: 'High-flow air filter that ensures optimal airflow to your engine while keeping out harmful contaminants. Helps maintain engine performance and fuel efficiency.',
    type: 'oem',
    category: 'engine',
    subCategory: 'filters',
    price: 899,
    rating: 4.4,
    reviewCount: 67,
    images: [
      'https://images.unsplash.com/photo-1546464677-c25cd69850f9?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1599809736384-3f93c51c2edf?auto=format&fit=crop&q=80&w=2340'
    ],
    brand: 'Honda Genuine',
    compatibleVehicles: [1],
    stockStatus: 'low_stock',
    tags: ['air filter', 'engine maintenance', 'genuine'],
    partNumber: 'AF-17220-RZA-000',
    specifications: {
      'Filter Type': 'Panel',
      'Material': 'Paper with Polyurethane Frame',
      'Dimensions': '220mm x 180mm x 40mm',
      'Filtration Efficiency': '99.5% @ 10 microns',
      'Recommended Service Interval': '15,000 km'
    },
    installationDifficulty: 1,
    installationTime: 10,
    warranty: 12,
    isFeatured: false,
    relatedProducts: [102, 103, 106],
    sellerInfo: {
      id: 4,
      name: 'Honda Paradise',
      rating: 4.7,
      isVerified: true
    }
  },
  {
    id: 105,
    name: 'Premium Brake Disc - Ventilated',
    description: 'High-performance ventilated brake discs designed for improved heat dissipation and superior braking performance. Precision-machined for smooth operation and reduced vibration.',
    type: 'aftermarket',
    category: 'suspension',
    subCategory: 'brakes',
    price: 4999,
    rating: 4.6,
    reviewCount: 93,
    images: [
      'https://images.unsplash.com/photo-1588171697497-c407edbfec3c?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1527247043489-35d67bf76e3d?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1441148345475-03a2e82f9719?auto=format&fit=crop&q=80&w=2340'
    ],
    brand: 'Bosch',
    compatibleVehicles: [1, 2, 4],
    stockStatus: 'in_stock',
    tags: ['brakes', 'rotors', 'ventilated', 'safety'],
    partNumber: 'BD-24584-V',
    specifications: {
      'Type': 'Ventilated Disc',
      'Position': 'Front',
      'Diameter': '300mm',
      'Thickness': '28mm',
      'Min. Thickness': '25mm',
      'Surface Finish': 'Anti-Corrosion Coated',
      'Hub Type': '5-Stud'
    },
    installationDifficulty: 4,
    installationTime: 90,
    installationGuideUrl: '/guides/brake-disc-installation',
    warranty: 24,
    isFeatured: false,
    relatedProducts: [101, 109],
    sellerInfo: {
      id: 1,
      name: 'AutoParts Direct',
      rating: 4.8,
      isVerified: true
    }
  },
  {
    id: 106,
    name: 'Cabin Air Filter',
    description: 'Advanced HEPA cabin air filter that removes up to 99.97% of airborne contaminants, including dust, pollen, and exhaust particles, ensuring clean air inside your vehicle.',
    type: 'aftermarket',
    category: 'interior',
    subCategory: 'climate control',
    price: 799,
    oldPrice: 999,
    rating: 4.9,
    reviewCount: 156,
    images: [
      'https://images.unsplash.com/photo-1456676684723-4e21e82b8509?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1530046339915-78e90191a9fa?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1589451865397-0b3637421cdb?auto=format&fit=crop&q=80&w=2340'
    ],
    brand: 'Mahle',
    compatibleVehicles: [1, 2, 4],
    stockStatus: 'in_stock',
    tags: ['cabin filter', 'air quality', 'pollen filter'],
    partNumber: 'CF-LA500',
    specifications: {
      'Filter Type': 'HEPA with Activated Carbon',
      'Dimensions': '240mm x 200mm x 30mm',
      'Filtration Level': 'PM2.5 + VOC Reduction',
      'Carbon Layer': 'Yes',
      'Antimicrobial Treatment': 'Yes',
      'UV Resistant': 'Yes'
    },
    installationDifficulty: 1,
    installationTime: 15,
    installationGuideUrl: '/guides/cabin-filter-replacement',
    warranty: 12,
    discount: 20,
    isFeatured: true,
    relatedProducts: [102, 103, 104],
    sellerInfo: {
      id: 5,
      name: 'Clean Air Auto',
      rating: 4.8,
      isVerified: true
    }
  },
  {
    id: 107,
    name: 'Premium Alloy Wheels - 17 Inch',
    description: 'Lightweight alloy wheels designed to improve handling and vehicle aesthetics. These wheels feature a durable finish that resists corrosion and brake dust build-up.',
    type: 'aftermarket',
    category: 'wheels',
    subCategory: 'alloy wheels',
    price: 24999,
    oldPrice: 29999,
    rating: 4.7,
    reviewCount: 78,
    images: [
      'https://images.unsplash.com/photo-1611921561569-4a511d1c49ff?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2340'
    ],
    brand: 'Enkei',
    compatibleVehicles: [1, 4],
    stockStatus: 'in_stock',
    tags: ['wheels', 'alloy', 'styling'],
    partNumber: 'AW-RPF1-17',
    specifications: {
      'Size': '17 x 7.5J',
      'PCD': '5x114.3',
      'Offset': 'ET40',
      'Center Bore': '73.1mm',
      'Material': 'A356 Aluminum',
      'Finish': 'Hyper Silver',
      'Load Rating': '650kg per wheel',
      'TPMS Compatible': 'Yes'
    },
    installationDifficulty: 3,
    installationTime: 60,
    installationGuideUrl: '/guides/wheel-fitment',
    warranty: 36,
    discount: 16,
    isFeatured: true,
    relatedProducts: [108, 109],
    sellerInfo: {
      id: 6,
      name: 'Wheel World',
      rating: 4.9,
      isVerified: true
    }
  },
  {
    id: 108,
    name: 'Premium Tubeless Tires 205/55R16',
    description: 'All-season tubeless radial tires offering excellent grip in both wet and dry conditions. Designed for smoother ride quality, reduced road noise, and improved fuel efficiency.',
    type: 'aftermarket',
    category: 'wheels',
    subCategory: 'tires',
    price: 5999,
    rating: 4.5,
    reviewCount: 112,
    images: [
      'https://images.unsplash.com/photo-1506986722786-faddee27389a?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1582401803585-53abc24841a2?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1529327013450-1fed97a2c0d1?auto=format&fit=crop&q=80&w=2340'
    ],
    brand: 'MRF',
    compatibleVehicles: [1],
    stockStatus: 'in_stock',
    tags: ['tires', 'tubeless', 'grip'],
    partNumber: 'TR-ZSPORT-205-55-16',
    specifications: {
      'Size': '205/55R16',
      'Load Index': '91',
      'Speed Rating': 'V (240 km/h)',
      'Type': 'Tubeless Radial',
      'Tread Pattern': 'Asymmetric',
      'Season': 'All-Season',
      'Tread Depth': '8mm',
      'Wet Grip Rating': 'A',
      'Fuel Efficiency': 'B',
      'Noise Level': '69 dB'
    },
    installationDifficulty: 3,
    installationTime: 30,
    warranty: 60,
    isFeatured: false,
    relatedProducts: [107, 109],
    sellerInfo: {
      id: 7,
      name: 'Tire Universe',
      rating: 4.7,
      isVerified: true
    }
  },
  {
    id: 109,
    name: 'Performance Brake Fluid DOT 4',
    description: 'High-performance brake fluid with a high boiling point, designed for demanding driving conditions. Protects against corrosion and is compatible with all brake system components.',
    type: 'aftermarket',
    category: 'fluids',
    subCategory: 'brake fluid',
    price: 899,
    rating: 4.6,
    reviewCount: 54,
    images: [
      'https://images.unsplash.com/photo-1621037333612-151bf709d5dd?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1600147131759-880e94a6138c?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1544308537-a557f20749a4?auto=format&fit=crop&q=80&w=2340'
    ],
    brand: 'Liqui Moly',
    compatibleVehicles: [1, 2, 3, 4, 5],
    stockStatus: 'in_stock',
    tags: ['brake fluid', 'hydraulic', 'maintenance'],
    partNumber: 'BF-DOT4-500',
    specifications: {
      'Type': 'DOT 4',
      'Dry Boiling Point': '260°C',
      'Wet Boiling Point': '170°C',
      'Viscosity (40°C)': '7.2 mm²/s',
      'Volume': '500ml',
      'Meets Standards': 'FMVSS 116, ISO 4925'
    },
    installationDifficulty: 4,
    installationTime: 45,
    installationGuideUrl: '/guides/brake-fluid-change',
    warranty: 0,
    isFeatured: false,
    relatedProducts: [101, 105],
    sellerInfo: {
      id: 8,
      name: 'German Auto Fluids',
      rating: 4.8,
      isVerified: true
    }
  },
  {
    id: 110,
    name: 'LED Headlight Conversion Kit',
    description: 'Complete LED headlight conversion kit that provides brighter, whiter light for improved visibility. Easy plug-and-play installation with built-in cooling fans for longer life.',
    type: 'aftermarket',
    category: 'electrical',
    subCategory: 'lighting',
    price: 6499,
    oldPrice: 7999,
    rating: 4.4,
    reviewCount: 87,
    images: [
      'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1508896694512-1eade558679c?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1553949345-eb786d5b02c1?auto=format&fit=crop&q=80&w=2340'
    ],
    brand: 'MINDA',
    compatibleVehicles: [1, 2, 4],
    stockStatus: 'low_stock',
    tags: ['led', 'headlights', 'lighting', 'electrical'],
    partNumber: 'HL-LED9006',
    specifications: {
      'Bulb Type': 'H4/9003/HB2',
      'Color Temperature': '6000K',
      'Brightness': '10000 lumens/pair',
      'Power': '55W per bulb',
      'Operating Voltage': '9-32V DC',
      'IP Rating': 'IP67',
      'LED Chip': 'CREE XHP50',
      'Cooling': 'Active Fan',
      'Lifespan': '50,000 hours'
    },
    installationDifficulty: 3,
    installationTime: 60,
    installationGuideUrl: '/guides/led-headlight-installation',
    warranty: 24,
    discount: 18,
    isFeatured: true,
    relatedProducts: [111, 112],
    sellerInfo: {
      id: 9,
      name: 'LightPro Automotive',
      rating: 4.5,
      isVerified: false
    }
  },
  {
    id: 111,
    name: 'Automotive Battery - 65 Ah',
    description: 'Maintenance-free automotive battery with high cranking power and enhanced durability. Designed for reliable starting performance in all weather conditions.',
    type: 'oem',
    category: 'electrical',
    subCategory: 'battery',
    price: 8999,
    rating: 4.8,
    reviewCount: 204,
    images: [
      'https://images.unsplash.com/photo-1598969295581-31dccd505bf2?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1600019033021-0800aa0d1f42?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1596482519951-9b2a4c3ba468?auto=format&fit=crop&q=80&w=2340'
    ],
    brand: 'Exide',
    compatibleVehicles: [1, 2, 4],
    stockStatus: 'in_stock',
    tags: ['battery', 'electrical', 'starting', 'power'],
    partNumber: 'BAT-DIN65-LN3',
    specifications: {
      'Capacity': '65 Ah',
      'CCA (Cold Cranking Amps)': '620A',
      'Voltage': '12V',
      'Terminal Type': 'LN3',
      'Dimensions': '278 x 175 x 190 mm',
      'Weight': '16.5 kg',
      'Technology': 'Calcium/Calcium',
      'Maintenance': 'Maintenance Free',
      'Reserve Capacity': '120 minutes'
    },
    installationDifficulty: 2,
    installationTime: 30,
    installationGuideUrl: '/guides/battery-replacement',
    warranty: 36,
    isFeatured: false,
    relatedProducts: [110, 112],
    sellerInfo: {
      id: 10,
      name: 'Battery World',
      rating: 4.9,
      isVerified: true
    }
  },
  {
    id: 112,
    name: 'Spark Plugs - Iridium (Set of 4)',
    description: 'Premium iridium spark plugs designed for improved fuel efficiency, faster acceleration, and reliable starting. Features fine wire center electrode for optimal ignitability.',
    type: 'aftermarket',
    category: 'engine',
    subCategory: 'ignition',
    price: 2499,
    rating: 4.7,
    reviewCount: 118,
    images: [
      'https://images.unsplash.com/photo-1566963322262-95e498d2c760?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&q=80&w=2340',
      'https://images.unsplash.com/photo-1558980664-10e7170b5df9?auto=format&fit=crop&q=80&w=2340'
    ],
    brand: 'NGK',
    compatibleVehicles: [1, 4],
    stockStatus: 'out_of_stock',
    tags: ['spark plugs', 'ignition', 'engine', 'iridium'],
    partNumber: 'SP-LFR6AIX-11',
    specifications: {
      'Type': 'Iridium',
      'Thread Size': '14mm',
      'Reach': '19mm',
      'Heat Range': '6',
      'Terminal Type': 'Removable Nut',
      'Gap': '0.8mm',
      'Resistor': 'Yes',
      'Quantity': '4 plugs/set',
      'Service Interval': '100,000 km'
    },
    installationDifficulty: 2,
    installationTime: 30,
    installationGuideUrl: '/guides/spark-plug-replacement',
    warranty: 24,
    isFeatured: false,
    relatedProducts: [102, 103, 104],
    sellerInfo: {
      id: 11,
      name: 'Ignition Specialists',
      rating: 4.7,
      isVerified: true
    }
  }
];

export default MarketplacePage;