import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, Plus, Info, Heart } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface OptionPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  features: string[];
  popular?: boolean;
  recommended?: boolean;
  discount?: number;
  availability?: 'in-stock' | 'limited' | 'pre-order';
}

interface OptionPackageSelectorProps {
  packages: OptionPackage[];
  selectedPackages: string[];
  onSelectPackage: (id: string) => void;
  likedPackages: string[];
  onToggleLike: (id: string) => void;
  onAddToCart: (pkg: OptionPackage) => void;
}

const OptionPackageSelector: React.FC<OptionPackageSelectorProps> = ({
  packages,
  selectedPackages,
  onSelectPackage,
  likedPackages,
  onToggleLike,
  onAddToCart
}) => {
  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Calculate discounted price
  const getDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price;
    return price - (price * discount / 100);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {packages.map((pkg) => {
          const isSelected = selectedPackages.includes(pkg.id);
          const isLiked = likedPackages.includes(pkg.id);
          
          return (
            <motion.div
              key={pkg.id}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className={`
                border rounded-md overflow-hidden transition-all
                ${isSelected ? 'ring-2 ring-primary shadow-md' : ''}
              `}
            >
              {/* Image section */}
              <div className="relative h-48 bg-slate-100">
                {pkg.image ? (
                  <img 
                    src={pkg.image} 
                    alt={pkg.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-800 to-slate-600 text-white">
                    <span className="text-xl font-bold">{pkg.name}</span>
                  </div>
                )}
                
                {/* Package badges */}
                <div className="absolute top-0 left-0 right-0 flex justify-between p-3">
                  <div>
                    {pkg.popular && (
                      <Badge className="bg-amber-600 hover:bg-amber-700 text-white">Popular</Badge>
                    )}
                    {pkg.recommended && (
                      <Badge className="bg-blue-600 hover:bg-blue-700 text-white ml-2">Recommended</Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(pkg.id);
                      }}
                      className="bg-white/80 hover:bg-white rounded-full h-8 w-8 flex items-center justify-center transition-colors"
                    >
                      <Heart className={`h-4 w-4 ${
                        isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
                      }`} />
                    </button>
                  </div>
                </div>
                
                {/* Availability tag */}
                {pkg.availability === 'limited' && (
                  <div className="absolute bottom-0 left-0 bg-amber-600 text-white text-xs px-3 py-1 font-medium">
                    LIMITED AVAILABILITY
                  </div>
                )}
                {pkg.availability === 'pre-order' && (
                  <div className="absolute bottom-0 left-0 bg-blue-600 text-white text-xs px-3 py-1 font-medium">
                    PRE-ORDER
                  </div>
                )}
              </div>
              
              {/* Content section */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{pkg.name}</h3>
                  
                  <div className="text-right">
                    {pkg.discount ? (
                      <div>
                        <div className="font-bold text-lg">
                          {formatPrice(getDiscountedPrice(pkg.price, pkg.discount))}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm line-through text-muted-foreground">
                            {formatPrice(pkg.price)}
                          </span>
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                            {pkg.discount}% off
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="font-bold text-lg">
                        {formatPrice(pkg.price)}
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm mb-3">{pkg.description}</p>
                
                <Separator className="my-3" />
                
                <div className="space-y-2 mb-4">
                  <h4 className="font-medium text-sm">Package Features:</h4>
                  <ul className="space-y-1">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <Check className="h-4 w-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-between items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="flex items-center text-xs text-muted-foreground">
                          <Info className="h-3.5 w-3.5 mr-1" />
                          <span>Package Details</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">This package includes all listed features. Installation may require additional time. Consult your dealer for more information.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <div className="flex gap-2">
                    {isSelected ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onSelectPackage(pkg.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Selected
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => onSelectPackage(pkg.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Select
                      </Button>
                    )}
                    
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => onAddToCart(pkg)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OptionPackageSelector;