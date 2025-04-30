import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Lightbulb, 
  ArrowRight,
  Heart
} from 'lucide-react';

import ArenaWrapper from '@/components/arena/ArenaWrapper';
import ConfiguratorHeader from '@/components/arena/ConfiguratorHeader';
import VehicleVisualizer from '@/components/arena/VehicleVisualizer';
import PremiumColorSelector, { ColorOption } from '@/components/arena/PremiumColorSelector';
import OptionPackageSelector, { OptionPackage } from '@/components/arena/OptionPackageSelector';
import ConfigurationSummary, { ConfigItem } from '@/components/arena/ConfigurationSummary';
import CartPanel, { CartItem } from '@/components/arena/CartPanel';

// Premium vehicle list
const premiumVehicles = [
  { 
    id: 1, 
    name: 'AMG SL 43 Roadster', 
    type: 'Convertible', 
    brand: 'Mercedes', 
    thumbnail: '🏎️',
    basePrice: 12500000 
  },
  { 
    id: 2, 
    name: 'i7 eDrive50 Sedan', 
    type: 'Electric Sedan', 
    brand: 'BMW', 
    thumbnail: '🚙',
    basePrice: 13700000
  },
  { 
    id: 3, 
    name: 'Spectre', 
    type: 'Luxury Coupe', 
    brand: 'Rolls-Royce', 
    thumbnail: '🚗', 
    basePrice: 52000000
  }
];

// Paint colors
const paintColors: ColorOption[] = [
  // Standard colors
  { id: 'white', name: 'Alpine White', hex: '#FFFFFF', type: 'standard', price: 0 },
  { id: 'black', name: 'Jet Black', hex: '#000000', type: 'standard', price: 0 },
  { id: 'red', name: 'Melbourne Red', hex: '#C80815', type: 'standard', price: 0, popular: true },
  { id: 'blue', name: 'Portimao Blue', hex: '#1E3A8A', type: 'standard', price: 0 },
  
  // Metallic colors
  { id: 'silver-metallic', name: 'Glacier Silver', hex: '#C8C8C8', type: 'metallic', price: 75000 },
  { id: 'gray-metallic', name: 'Brooklyn Grey', hex: '#5A5A5A', type: 'metallic', price: 75000, popular: true },
  { id: 'blue-metallic', name: 'Tanzanite Blue', hex: '#18346E', type: 'metallic', price: 95000 },
  { id: 'green-metallic', name: 'Aventurine Green', hex: '#1F3935', type: 'metallic', price: 95000, new: true },
  
  // Matte colors
  { id: 'black-matte', name: 'Frozen Black', hex: '#1A1A1A', type: 'matte', price: 185000 },
  { id: 'gray-matte', name: 'Frozen Deep Grey', hex: '#3C3C3C', type: 'matte', price: 185000, new: true, popular: true },
  { id: 'blue-matte', name: 'Frozen Marina Bay', hex: '#2B4F6A', type: 'matte', price: 215000, new: true },
  
  // Special colors
  { id: 'gold-special', name: 'Vegas Gold', hex: '#C5B358', type: 'special', price: 315000 },
  { id: 'purple-special', name: 'Twilight Purple', hex: '#4E2A84', type: 'special', price: 335000, new: true },
  { id: 'green-special', name: 'British Racing Green', hex: '#004225', type: 'special', price: 315000 },
];

// Option packages
const optionPackages: OptionPackage[] = [
  {
    id: 'night-package',
    name: 'AMG Night Package',
    description: 'Enhance your vehicle with striking black accents for a more aggressive and sporty appearance.',
    price: 175000,
    features: [
      'High-gloss black front splitter',
      'Black mirror caps',
      'Black window trim',
      'Black rear diffuser insert',
      'Black exhaust tips'
    ],
    popular: true,
    availability: 'in-stock'
  },
  {
    id: 'extended-night',
    name: 'AMG Extended Night Package',
    description: 'Take the night theme further with additional black elements throughout the exterior.',
    price: 310000,
    features: [
      'All features from the Night Package',
      'Black badges and emblems',
      'Dark chrome radiator grille',
      'Extended black trim elements',
      'Black chrome exhaust tips'
    ],
    recommended: true,
    discount: 10,
    availability: 'in-stock'
  },
  {
    id: 'exterior-chrome',
    name: 'AMG Exterior Chrome Package',
    description: 'Premium chrome accents for a luxurious and elegant exterior appearance.',
    price: 155000,
    features: [
      'Chrome front splitter',
      'Chrome window surrounds',
      'Chrome mirror caps',
      'Chrome rear diffuser trim',
      'Chrome exhaust tips'
    ],
    availability: 'in-stock'
  },
  {
    id: 'indoor-car-cover',
    name: 'Indoor car cover',
    description: 'Protect your vehicle with a custom-fitted indoor car cover with model-specific emblem.',
    price: 37000,
    features: [
      'Custom designed for your vehicle',
      'Breathable fabric',
      'Soft inner lining',
      'Model-specific emblem',
      'Storage bag included'
    ],
    availability: 'limited'
  }
];

// Premium Arena Page
const PremiumArena: React.FC = () => {
  const [, setLocation] = useLocation();
  
  // State
  const [activeTab, setActiveTab] = useState('exterior');
  const [selectedVehicle, setSelectedVehicle] = useState(premiumVehicles[0]);
  const [selectedColor, setSelectedColor] = useState('blue');
  const [likedColors, setLikedColors] = useState<string[]>([]);
  const [selectedOptionPackages, setSelectedOptionPackages] = useState<string[]>([]);
  const [likedPackages, setLikedPackages] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Get the selected color hex
  const selectedColorHex = paintColors.find(color => color.id === selectedColor)?.hex || '#1E3A8A';
  
  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Handle selecting a color
  const handleSelectColor = (colorId: string) => {
    setSelectedColor(colorId);
    
    // Remove any previous color from cart
    setCartItems(prevItems => prevItems.filter(item => !item.category.includes('Paint')));
    
    // Add color to cart if it has a price
    const selectedColorObj = paintColors.find(color => color.id === colorId);
    if (selectedColorObj && selectedColorObj.price > 0) {
      handleAddToCart({
        id: `color-${colorId}`,
        name: selectedColorObj.name,
        price: selectedColorObj.price,
        category: `Paint (${selectedColorObj.type})`
      });
    }
  };
  
  // Handle toggling color like status
  const handleToggleColorLike = (colorId: string) => {
    if (likedColors.includes(colorId)) {
      setLikedColors(likedColors.filter(id => id !== colorId));
    } else {
      setLikedColors([...likedColors, colorId]);
    }
  };
  
  // Handle selecting an option package
  const handleSelectPackage = (packageId: string) => {
    if (selectedOptionPackages.includes(packageId)) {
      setSelectedOptionPackages(selectedOptionPackages.filter(id => id !== packageId));
      
      // Remove from cart
      setCartItems(prevItems => prevItems.filter(item => item.id !== `package-${packageId}`));
    } else {
      setSelectedOptionPackages([...selectedOptionPackages, packageId]);
      
      // Add to cart
      const pkg = optionPackages.find(p => p.id === packageId);
      if (pkg) {
        const price = pkg.discount 
          ? pkg.price - (pkg.price * pkg.discount / 100) 
          : pkg.price;
          
        handleAddToCart({
          id: `package-${packageId}`,
          name: pkg.name,
          price: price,
          category: 'Package'
        });
      }
    }
  };
  
  // Handle toggling package like status
  const handleTogglePackageLike = (packageId: string) => {
    if (likedPackages.includes(packageId)) {
      setLikedPackages(likedPackages.filter(id => id !== packageId));
    } else {
      setLikedPackages([...likedPackages, packageId]);
    }
  };
  
  // Handle adding item to cart
  const handleAddToCart = (item: CartItem) => {
    // Check if it's already in the cart
    if (!cartItems.some(cartItem => cartItem.id === item.id)) {
      setCartItems([...cartItems, item]);
    }
  };
  
  // Handle removing item from cart
  const handleRemoveFromCart = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    
    // If it's a package, also deselect it
    if (itemId.startsWith('package-')) {
      const packageId = itemId.replace('package-', '');
      setSelectedOptionPackages(selectedOptionPackages.filter(id => id !== packageId));
    }
  };
  
  // All selected items for summary
  const allConfigItems: ConfigItem[] = cartItems.map(item => ({
    id: item.id,
    name: item.name,
    category: item.category,
    price: item.price
  }));
  
  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  // Handle getting quote
  const handleGetQuote = () => {
    // Navigate to a quote page or show a modal
    console.log('Getting quote...');
  };
  
  return (
    <ArenaWrapper>
      {/* Configurator Header */}
      <ConfiguratorHeader 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        vehicleName={selectedVehicle.name}
        vehicleYear="2025"
        brand={selectedVehicle.brand}
      />
      
      <div className="container max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Visualizer and selections */}
          <div className="lg:col-span-8 space-y-6">
            {/* Vehicle Visualizer */}
            <VehicleVisualizer 
              vehicleEmoji={selectedVehicle.thumbnail}
              vehicleColor={selectedColorHex}
            />
            
            {/* Content based on active tab */}
            {activeTab === 'exterior' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Exterior Colors</h2>
                <PremiumColorSelector 
                  options={paintColors}
                  selectedColor={selectedColor}
                  onSelectColor={handleSelectColor}
                  likedColors={likedColors}
                  onToggleLike={handleToggleColorLike}
                  onAddToCart={(color) => {
                    handleAddToCart({
                      id: `color-${color.id}`,
                      name: color.name,
                      price: color.price,
                      category: `Paint (${color.type})`
                    });
                  }}
                />
              </div>
            )}
            
            {activeTab === 'options' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Options & Packages</h2>
                <OptionPackageSelector 
                  packages={optionPackages}
                  selectedPackages={selectedOptionPackages}
                  onSelectPackage={handleSelectPackage}
                  likedPackages={likedPackages}
                  onToggleLike={handleTogglePackageLike}
                  onAddToCart={(pkg) => {
                    const price = pkg.discount 
                      ? pkg.price - (pkg.price * pkg.discount / 100) 
                      : pkg.price;
                      
                    handleAddToCart({
                      id: `package-${pkg.id}`,
                      name: pkg.name,
                      price: price,
                      category: 'Package'
                    });
                  }}
                />
              </div>
            )}
            
            {activeTab === 'summary' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Configuration Summary</h2>
                <ConfigurationSummary 
                  vehicle={{
                    id: selectedVehicle.id.toString(),
                    name: selectedVehicle.name,
                    brand: selectedVehicle.brand,
                    basePrice: selectedVehicle.basePrice,
                    emoji: selectedVehicle.thumbnail
                  }}
                  selections={allConfigItems}
                  onProceed={handleGetQuote}
                  onDownloadSummary={() => console.log('Downloading summary...')}
                  onShareConfiguration={() => console.log('Sharing configuration...')}
                  selectedColor={selectedColorHex}
                />
              </div>
            )}
            
            {/* Navigation buttons */}
            {activeTab !== 'summary' && (
              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => setLocation('/arena-studio')}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Standard Configurator
                </Button>
                
                <Button onClick={() => setActiveTab('summary')}>
                  Continue to Summary
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
          
          {/* Right column - Cart and recommendations */}
          <div className="lg:col-span-4 space-y-6">
            {/* Cart */}
            <div className="sticky top-24">
              <CartPanel 
                items={cartItems}
                onRemoveItem={handleRemoveFromCart}
                onCheckout={() => setActiveTab('summary')}
                likedItems={[...likedColors, ...likedPackages]}
                onToggleLike={(id) => {
                  if (id.startsWith('color-')) {
                    const colorId = id.replace('color-', '');
                    handleToggleColorLike(colorId);
                  } else if (id.startsWith('package-')) {
                    const packageId = id.replace('package-', '');
                    handleTogglePackageLike(packageId);
                  }
                }}
              />
              
              {/* Recommendations */}
              <div className="mt-6 space-y-4">
                <h3 className="font-bold text-lg">Recommended for You</h3>
                
                <div className="bg-slate-50 rounded-md border p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-md">
                      <Lightbulb className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Premium Lighting Package</h4>
                      <p className="text-xs text-muted-foreground">Adaptive LED headlights with signature elements</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="font-medium">{formatPrice(120000)}</div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-md border p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-2 rounded-md">
                      <Zap className="h-6 w-6 text-amber-700" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Performance Upgrade</h4>
                      <p className="text-xs text-muted-foreground">Sport exhaust system with dynamic sound control</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="font-medium">{formatPrice(275000)}</div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Button variant="ghost" className="w-full justify-between" size="sm">
                  View All Recommendations
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ArenaWrapper>
  );
};

export default PremiumArena;