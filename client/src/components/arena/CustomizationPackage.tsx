import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Info, AlertCircle, Zap, Plus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CustomizationOption {
  id: string;
  name: string;
  description?: string;
  price: number;
  popular?: boolean;
  recommended?: boolean;
  rating?: number;
  discount?: number;
  image?: string;
  compatibility?: string;
  stock?: 'in-stock' | 'limited' | 'out-of-stock';
  installTime?: string;
}

interface CustomizationPackageProps {
  title: string;
  options: CustomizationOption[];
  selectedOption?: string;
  onSelectOption: (optionId: string) => void;
  maxOptionsToShow?: number;
}

const CustomizationPackage: React.FC<CustomizationPackageProps> = ({
  title,
  options,
  selectedOption,
  onSelectOption,
  maxOptionsToShow = 4
}) => {
  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Calculate the discounted price
  const getDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price;
    return price - (price * discount / 100);
  };
  
  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {options.slice(0, maxOptionsToShow).map((option) => (
          <motion.div 
            key={option.id}
            variants={itemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className={`
              relative border rounded-lg overflow-hidden transition-all
              ${selectedOption === option.id ? 'border-primary shadow-md scale-[1.02]' : 'border-border'}
            `}
          >
            {/* Option image or placeholder */}
            <div className="w-full aspect-video bg-muted flex items-center justify-center">
              {option.image ? (
                <img 
                  src={option.image} 
                  alt={option.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl">{title.charAt(0)}+</span>
              )}
            </div>
            
            {/* Option details */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-base">{option.name}</h4>
                
                {/* Rating stars */}
                {option.rating && (
                  <div className="flex items-center">
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs ml-1">{option.rating}</span>
                  </div>
                )}
              </div>
              
              {/* Description */}
              {option.description && (
                <p className="text-xs text-muted-foreground mb-2">{option.description}</p>
              )}
              
              {/* Price */}
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-semibold">
                  {formatPrice(getDiscountedPrice(option.price, option.discount))}
                </span>
                
                {option.discount && (
                  <span className="text-xs line-through text-muted-foreground">
                    {formatPrice(option.price)}
                  </span>
                )}
                
                {option.discount && (
                  <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                    {option.discount}% off
                  </Badge>
                )}
              </div>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-1 mb-3">
                {option.popular && (
                  <Badge variant="secondary" className="text-xs">
                    Popular
                  </Badge>
                )}
                
                {option.recommended && (
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                    Recommended
                  </Badge>
                )}
                
                {option.stock === 'limited' && (
                  <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 border-amber-200">
                    Limited Stock
                  </Badge>
                )}
                
                {option.stock === 'out-of-stock' && (
                  <Badge variant="secondary" className="text-xs bg-red-100 text-red-800 border-red-200">
                    Out of Stock
                  </Badge>
                )}
                
                {option.installTime && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="text-xs cursor-help">
                          <span className="mr-1">{option.installTime}</span> 
                          <Info className="h-3 w-3" />
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Estimated installation time</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              
              {/* Info notes */}
              {option.compatibility && (
                <div className="flex items-start gap-1 mb-3 text-xs text-muted-foreground">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5" />
                  <span>{option.compatibility}</span>
                </div>
              )}
              
              {/* Action button */}
              <Button
                variant={selectedOption === option.id ? "default" : "outline"}
                size="sm"
                className="w-full mt-2"
                disabled={option.stock === 'out-of-stock'}
                onClick={() => onSelectOption(option.id)}
              >
                {selectedOption === option.id ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Selected
                  </>
                ) : option.stock === 'out-of-stock' ? (
                  'Unavailable'
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    Select
                  </>
                )}
              </Button>
            </div>
            
            {/* Discount tag */}
            {option.discount && (
              <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold py-1 px-2 transform rotate-0">
                SALE
              </div>
            )}
            
            {/* Performance boost indicator */}
            {option.name.toLowerCase().includes('performance') && (
              <div className="absolute top-2 right-2 bg-black/70 text-white rounded-full h-6 w-6 flex items-center justify-center">
                <Zap className="h-3.5 w-3.5" />
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
      
      {/* Show more button */}
      {options.length > maxOptionsToShow && (
        <Button variant="ghost" size="sm" className="mt-4 text-xs">
          Show more options ({options.length - maxOptionsToShow})
        </Button>
      )}
    </div>
  );
};

export default CustomizationPackage;