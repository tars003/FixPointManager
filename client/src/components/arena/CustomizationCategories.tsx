import React, { useState } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tabs,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { ChevronRight, ShoppingCart, Star, Sparkles, Info, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

// Define product interface
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory: string;
  rating: number;
  numReviews: number;
  description: string;
  compatibleVehicles: string[];
  installationDifficulty: 'Easy' | 'Medium' | 'Hard';
  installationTime: string;
  features: string[];
  images: string[];
  discount?: number;
  inStock: boolean;
  isPopular?: boolean;
  isNewArrival?: boolean;
}

// Category type
interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  subcategories: {
    id: string;
    name: string;
  }[];
}

interface CustomizationCategoriesProps {
  vehicleId: number;
  vehicleMake: string;
  vehicleModel: string;
  onProductSelect: (product: Product) => void;
}

const CustomizationCategories: React.FC<CustomizationCategoriesProps> = ({
  vehicleId,
  vehicleMake,
  vehicleModel,
  onProductSelect
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>('exterior');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');
  
  // Example categories structure based on the specification
  const categories: Category[] = [
    {
      id: 'exterior',
      name: 'Exterior Modifications',
      icon: <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">E</div>,
      subcategories: [
        { id: 'body-kits', name: 'Body Kits' },
        { id: 'wraps-paints', name: 'Wraps & Paints' },
        { id: 'decals-graphics', name: 'Decals & Graphics' },
        { id: 'lighting', name: 'Lighting' },
        { id: 'wheels-rims', name: 'Wheels & Rims' },
        { id: 'aerodynamics', name: 'Aerodynamics' },
      ]
    },
    {
      id: 'interior',
      name: 'Interior Modifications',
      icon: <div className="h-5 w-5 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">I</div>,
      subcategories: [
        { id: 'seats-upholstery', name: 'Seats & Upholstery' },
        { id: 'dashboard', name: 'Dashboard' },
        { id: 'audio-systems', name: 'Audio Systems' },
        { id: 'lighting-interior', name: 'Lighting' },
        { id: 'gauges-displays', name: 'Gauges & Displays' },
        { id: 'accessories-interior', name: 'Accessories' },
      ]
    },
    {
      id: 'performance',
      name: 'Performance Upgrades',
      icon: <div className="h-5 w-5 bg-red-100 rounded-full flex items-center justify-center text-red-600">P</div>,
      subcategories: [
        { id: 'engine', name: 'Engine' },
        { id: 'exhaust-systems', name: 'Exhaust Systems' },
        { id: 'suspension', name: 'Suspension' },
        { id: 'brakes', name: 'Brakes' },
        { id: 'drivetrain', name: 'Drivetrain' },
        { id: 'electronics', name: 'Electronics' },
      ]
    },
    {
      id: 'protection',
      name: 'Vehicle Protection',
      icon: <div className="h-5 w-5 bg-green-100 rounded-full flex items-center justify-center text-green-600">V</div>,
      subcategories: [
        { id: 'paint-protection', name: 'Paint Protection Film' },
        { id: 'ceramic-coating', name: 'Ceramic Coating' },
        { id: 'security-systems', name: 'Security Systems' },
        { id: 'weather-protection', name: 'Weather Protection' },
        { id: 'interior-protection', name: 'Interior Protection' },
      ]
    }
  ];
  
  // Sample products data (in a real app, would be fetched from API)
  const products: Product[] = [
    {
      id: 'bodykitf101',
      name: 'Sport Front Bumper',
      price: 15000,
      category: 'exterior',
      subcategory: 'body-kits',
      rating: 4.7,
      numReviews: 125,
      description: 'Premium quality sport bumper with integrated fog lamps and splitter.',
      compatibleVehicles: ['Honda City 2020-2023', 'Honda City 2019'],
      installationDifficulty: 'Medium',
      installationTime: '3-4 hours',
      features: ['Made from high-quality ABS plastic', 'UV resistant', 'Includes all mounting hardware'],
      images: ['https://www.carid.com/images/duraflex/items/112274-05.jpg'],
      inStock: true,
      isPopular: true
    },
    {
      id: 'vinyl002',
      name: 'Matte Black Vinyl Wrap',
      price: 22000,
      category: 'exterior',
      subcategory: 'wraps-paints',
      rating: 4.5,
      numReviews: 87,
      description: 'Premium matte black vinyl wrap with air release technology.',
      compatibleVehicles: ['All vehicles'],
      installationDifficulty: 'Hard',
      installationTime: '6-8 hours',
      features: ['Air release channels', 'Scratch resistant', 'UV protection', '5-year warranty'],
      images: ['https://m.media-amazon.com/images/I/71nH0v6MbUL._AC_UF894,1000_QL80_.jpg'],
      inStock: true
    },
    {
      id: 'wheel103',
      name: 'BBS 17" Forged Alloy Wheels',
      price: 80000,
      category: 'exterior',
      subcategory: 'wheels-rims',
      rating: 4.9,
      numReviews: 56,
      description: 'Premium forged alloy wheels from BBS, offering the perfect blend of style and performance.',
      compatibleVehicles: ['Honda City 2018-2023', 'Honda Civic 2020-2023'],
      installationDifficulty: 'Medium',
      installationTime: '2-3 hours',
      features: ['Forged aluminum construction', 'Lightweight design', 'Improved handling', 'Includes center caps'],
      images: ['https://www.tyresales.com.au/images/alloy-wheels/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled/hero/msa-offroad-wheels-m39-brute-beadlock-gloss-black-milled-wheel-380.jpg'],
      inStock: true,
      isNewArrival: true
    },
    {
      id: 'exhaust201',
      name: 'Borla Performance Exhaust System',
      price: 45000,
      category: 'performance',
      subcategory: 'exhaust-systems',
      rating: 4.8,
      numReviews: 112,
      description: 'High-performance stainless steel cat-back exhaust system.',
      compatibleVehicles: ['Honda City 2020-2023'],
      installationDifficulty: 'Medium',
      installationTime: '2-3 hours',
      features: ['Stainless steel construction', 'Deep sporty sound', 'Improved exhaust flow', '5-7 HP gain'],
      images: ['https://www.carid.com/images/borla/items/140307.jpg'],
      inStock: true,
      isPopular: true
    },
    {
      id: 'seat301',
      name: 'Racing Bucket Seats (Pair)',
      price: 35000,
      category: 'interior',
      subcategory: 'seats-upholstery',
      rating: 4.6,
      numReviews: 48,
      description: 'Ergonomic racing bucket seats with synthetic leather and contrast stitching.',
      compatibleVehicles: ['Honda City 2018-2023', 'Honda Civic 2016-2023'],
      installationDifficulty: 'Hard',
      installationTime: '4-5 hours',
      features: ['Side bolster support', 'Breathable material', 'Includes mounting brackets', 'Adjustable recline'],
      images: ['https://m.media-amazon.com/images/I/81s+jmP+rLL.jpg'],
      inStock: true
    },
    {
      id: 'audio302',
      name: 'Premium Sound System Upgrade',
      price: 28000,
      category: 'interior',
      subcategory: 'audio-systems',
      rating: 4.7,
      numReviews: 62,
      description: 'Complete audio system upgrade with amplifier, subwoofer, and premium speakers.',
      compatibleVehicles: ['Honda City 2018-2023'],
      installationDifficulty: 'Hard',
      installationTime: '5-6 hours',
      features: ['6-speaker system', '10" subwoofer', '5-channel amplifier', 'Plug-and-play harness'],
      images: ['https://m.media-amazon.com/images/I/71X9RLhJJsL._AC_UF1000,1000_QL80_.jpg'],
      inStock: true
    }
  ];
  
  // Get filtered products based on selections
  const getFilteredProducts = () => {
    let filtered = [...products];
    
    // Filter by compatibility with current vehicle
    filtered = filtered.filter(p => 
      p.compatibleVehicles.some(v => 
        v.toLowerCase().includes(vehicleMake.toLowerCase()) && 
        v.toLowerCase().includes(vehicleModel.toLowerCase())
      ) || 
      p.compatibleVehicles.includes('All vehicles')
    );
    
    // Filter by selected category
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Filter by selected subcategory
    if (selectedSubcategory) {
      filtered = filtered.filter(p => p.subcategory === selectedSubcategory);
    }
    
    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }
    
    return filtered;
  };
  
  const filteredProducts = getFilteredProducts();
  
  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
  };
  
  // Handle subcategory selection
  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left sidebar - Categories */}
      <div className="w-full lg:w-64 flex-shrink-0">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Customization Categories</h3>
            
            <Accordion type="single" defaultValue={selectedCategory || undefined} collapsible>
              {categories.map((category) => (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger 
                    onClick={() => handleCategorySelect(category.id)}
                    className={selectedCategory === category.id ? 'font-medium text-primary' : ''}
                  >
                    <div className="flex items-center space-x-2">
                      {category.icon}
                      <span>{category.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-6 space-y-1">
                      {category.subcategories.map((subcategory) => (
                        <div 
                          key={subcategory.id}
                          className={`py-1 px-2 text-sm rounded-md cursor-pointer transition-colors ${
                            selectedSubcategory === subcategory.id 
                              ? 'bg-primary/10 font-medium text-primary' 
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => handleSubcategorySelect(subcategory.id)}
                        >
                          {subcategory.name}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
      
      {/* Main content - Products */}
      <div className="flex-1">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">
              {selectedCategory 
                ? categories.find(c => c.id === selectedCategory)?.name 
                : 'All Customizations'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {selectedSubcategory 
                ? `${categories.find(c => c.id === selectedCategory)?.subcategories.find(s => s.id === selectedSubcategory)?.name}` 
                : 'All products compatible with your vehicle'}
            </p>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
            <Tabs 
              value={sortBy} 
              onValueChange={(value) => setSortBy(value as any)}
              className="w-full sm:w-auto"
            >
              <TabsList>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="price-low">Price: Low</TabsTrigger>
                <TabsTrigger value="price-high">Price: High</TabsTrigger>
                <TabsTrigger value="rating">Rating</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden h-full flex flex-col">
                {/* Product image */}
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isPopular && (
                      <Badge className="bg-orange-500">Popular</Badge>
                    )}
                    {product.isNewArrival && (
                      <Badge className="bg-blue-500">New Arrival</Badge>
                    )}
                    {product.discount && (
                      <Badge className="bg-green-500">{product.discount}% Off</Badge>
                    )}
                  </div>
                </div>
                
                <CardContent className="p-4 flex-1 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold">{product.name}</h3>
                      <Badge variant="outline">
                        {product.installationDifficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating) 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({product.numReviews})
                      </span>
                    </div>
                    
                    <p className="text-sm mt-2 text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {product.features.slice(0, 2).map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="font-normal">
                          {feature}
                        </Badge>
                      ))}
                      {product.features.length > 2 && (
                        <Badge variant="secondary" className="font-normal">
                          +{product.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{formatCurrency(product.price)}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => onProductSelect(product)}>
                        <Info className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      <Button size="sm">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <Card className="p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Info className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No compatible products found</h3>
            <p className="text-muted-foreground mt-2">
              Try selecting a different category or removing some filters.
            </p>
            <Button 
              className="mt-4" 
              variant="outline"
              onClick={() => {
                setSelectedCategory(null);
                setSelectedSubcategory(null);
              }}
            >
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CustomizationCategories;