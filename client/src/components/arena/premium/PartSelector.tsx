import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  SortAsc, 
  SortDesc, 
  CheckCircle2, 
  CircleDollarSign, 
  ShieldCheck, 
  Tag, 
  Clock,
  Heart,
  ChevronDown,
  Sparkles,
  InfoIcon
} from 'lucide-react';
import { CustomizationPartData, CustomizationCategory, CustomizationSubcategory } from '@shared/arena-schema';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Sample part brands for filter options
const partBrands = [
  "AutoElite",
  "SpeedCraft",
  "PerformanceOne",
  "Racetech",
  "CustomKings",
  "PremiumAutoWorks",
  "TurboForce",
  "LuxDrive"
];

// Star rating component
const StarRating = ({ rating, size = 16 }: { rating: number, size?: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`${
            star <= rating 
              ? 'text-yellow-400 fill-yellow-400' 
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

// Price formatter for Indian Rupees
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

// Part card for displaying individual customization options
interface PartCardProps {
  part: CustomizationPartData;
  onSelect: (part: CustomizationPartData) => void;
  isSelected?: boolean;
  showAddButton?: boolean;
}

const PartCard: React.FC<PartCardProps> = ({
  part,
  onSelect,
  isSelected = false,
  showAddButton = true
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Card 
      className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-400' : ''
      }`}
    >
      <CardHeader className="p-0 relative">
        <div 
          className="h-40 bg-gray-200 relative bg-cover bg-center"
          style={{ backgroundImage: `url(${part.thumbnailUrl})` }}
        >
          {/* Badge indicators */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {part.popularity && part.popularity > 8 && (
              <Badge className="bg-amber-500 hover:bg-amber-600 text-xs font-medium">
                <Star size={12} className="mr-1" /> Popular
              </Badge>
            )}
            {part.installationDifficulty && part.installationDifficulty < 2 && (
              <Badge className="bg-green-500 hover:bg-green-600 text-xs font-medium">
                <CheckCircle2 size={12} className="mr-1" /> Easy Install
              </Badge>
            )}
          </div>

          {/* Favorite button */}
          <button
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center ${
              isFavorite 
                ? 'bg-red-100 text-red-500' 
                : 'bg-white/80 text-gray-600 hover:bg-gray-100'
            }`}
            onClick={toggleFavorite}
          >
            <Heart size={18} className={isFavorite ? 'fill-red-500' : ''} />
          </button>

          {/* Bottom price tag */}
          {part.price && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
              <div className="flex justify-between items-center">
                <div className="text-white font-medium">
                  {formatPrice(part.price)}
                </div>
                
                {part.installationDifficulty && (
                  <div className="flex items-center gap-1">
                    <StarRating rating={Math.min(6 - part.installationDifficulty, 5)} size={14} />
                    <span className="text-white text-xs">
                      {part.installationDifficulty <= 2 ? 'Easy' : 
                       part.installationDifficulty <= 3 ? 'Medium' : 'Complex'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-medium text-gray-900 line-clamp-1">{part.name}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{part.description}</p>
          </div>
        </div>
        
        {part.material && (
          <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-600">
            <span className="px-2 py-0.5 bg-gray-100 rounded-full">{part.material}</span>
            {part.manufacturerWarranty && (
              <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                <ShieldCheck size={12} className="inline mr-1" />
                {part.manufacturerWarranty} months warranty
              </span>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              <InfoIcon size={14} className="mr-1" /> Details
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{part.name}</DialogTitle>
              <DialogDescription>
                Premium part from {part.compatibleModels?.[0] || 'manufacturer'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4 space-y-4">
              {part.thumbnailUrl && (
                <img 
                  src={part.thumbnailUrl} 
                  alt={part.name} 
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
              
              <div className="space-y-2">
                <h4 className="font-medium">Description</h4>
                <p className="text-sm text-gray-600">{part.description}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">Specifications</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {part.dimensions && (
                    <>
                      <div className="text-gray-500">Dimensions</div>
                      <div>{part.dimensions.width}W x {part.dimensions.height}H x {part.dimensions.depth}D mm</div>
                    </>
                  )}
                  {part.weight && (
                    <>
                      <div className="text-gray-500">Weight</div>
                      <div>{part.weight} kg</div>
                    </>
                  )}
                  {part.material && (
                    <>
                      <div className="text-gray-500">Material</div>
                      <div>{part.material}</div>
                    </>
                  )}
                  {part.manufacturerWarranty && (
                    <>
                      <div className="text-gray-500">Warranty</div>
                      <div>{part.manufacturerWarranty} months</div>
                    </>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium text-gray-900">
                  {formatPrice(part.price || 0)}
                </div>
                <Button onClick={() => {
                  onSelect(part);
                  setShowDetails(false);
                }}>
                  Add to Vehicle
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {showAddButton && (
          <Button 
            onClick={() => onSelect(part)}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className={isSelected ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            {isSelected ? (
              <>
                <CheckCircle2 size={14} className="mr-1" /> Added
              </>
            ) : (
              <>
                <Sparkles size={14} className="mr-1" /> Add
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

// Main part selector component 
interface PartSelectorProps {
  category: CustomizationCategory;
  subcategory?: CustomizationSubcategory;
  parts: CustomizationPartData[];
  selectedParts: number[];
  onSelectPart: (part: CustomizationPartData) => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

const PartSelector: React.FC<PartSelectorProps> = ({
  category,
  subcategory,
  parts,
  selectedParts,
  onSelectPart,
  loading = false,
  error,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popularity' | 'priceAsc' | 'priceDesc' | 'newest'>('popularity');
  const [filters, setFilters] = useState<{
    priceRange: [number, number] | null;
    brands: string[];
    onlyInStock: boolean;
    onlyPremium: boolean;
  }>({
    priceRange: null,
    brands: [],
    onlyInStock: false,
    onlyPremium: false,
  });

  // Calculate min/max price from parts data
  const priceRange = parts.length > 0 
    ? [
        Math.min(...parts.filter(p => p.price).map(p => p.price || 0)),
        Math.max(...parts.filter(p => p.price).map(p => p.price || 0))
      ] as [number, number]
    : [0, 10000] as [number, number];

  // Filter and sort the parts
  const filteredParts = parts
    // Apply search filter
    .filter(part => 
      !searchQuery || 
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    // Apply price range filter
    .filter(part => 
      !filters.priceRange || 
      (part.price && 
       part.price >= filters.priceRange[0] && 
       part.price <= filters.priceRange[1])
    )
    // Apply brand filter
    .filter(part => 
      filters.brands.length === 0 || 
      filters.brands.some(brand => part.name.includes(brand))
    )
    // Sort based on selected option
    .sort((a, b) => {
      switch(sortBy) {
        case 'priceAsc':
          return (a.price || 0) - (b.price || 0);
        case 'priceDesc':
          return (b.price || 0) - (a.price || 0);
        case 'newest':
          // In a real app, we'd use createdAt dates
          return (b.id || 0) - (a.id || 0);
        case 'popularity':
        default:
          return (b.popularity || 0) - (a.popularity || 0);
      }
    });

  // Toggle brand selection in filters
  const toggleBrandFilter = (brand: string) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and filter toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-grow max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            type="text"
            placeholder="Search parts..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 min-w-[100px]">
              <Filter size={16} />
              Filter
              <ChevronDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-2">
              <p className="font-medium text-sm mb-2">Brands</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {partBrands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`brand-${brand}`} 
                      checked={filters.brands.includes(brand)}
                      onCheckedChange={() => toggleBrandFilter(brand)}
                    />
                    <label
                      htmlFor={`brand-${brand}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
              
              <DropdownMenuSeparator className="my-2" />
              
              <p className="font-medium text-sm mb-2">Price</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{formatPrice(priceRange[0])}</span>
                <span className="text-sm text-gray-500">{formatPrice(priceRange[1])}</span>
              </div>
              
              <DropdownMenuSeparator className="my-2" />
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="in-stock" 
                    checked={filters.onlyInStock}
                    onCheckedChange={(checked) => 
                      setFilters(prev => ({ ...prev, onlyInStock: !!checked }))
                    }
                  />
                  <label
                    htmlFor="in-stock"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    In Stock Only
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="premium" 
                    checked={filters.onlyPremium}
                    onCheckedChange={(checked) => 
                      setFilters(prev => ({ ...prev, onlyPremium: !!checked }))
                    }
                  />
                  <label
                    htmlFor="premium"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Premium Parts Only
                  </label>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3"
                onClick={() => setFilters({
                  priceRange: null,
                  brands: [],
                  onlyInStock: false,
                  onlyPremium: false,
                })}
              >
                Reset Filters
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 min-w-[100px]">
              {sortBy === 'popularity' && <Star size={16} />}
              {sortBy === 'priceAsc' && <SortAsc size={16} />}
              {sortBy === 'priceDesc' && <SortDesc size={16} />}
              {sortBy === 'newest' && <Clock size={16} />}
              
              {sortBy === 'popularity' && 'Popular'}
              {sortBy === 'priceAsc' && 'Price: Low to High'}
              {sortBy === 'priceDesc' && 'Price: High to Low'}
              {sortBy === 'newest' && 'Newest'}
              
              <ChevronDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy('popularity')}>
              <Star size={16} className="mr-2" />
              <span>Popular</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('priceAsc')}>
              <SortAsc size={16} className="mr-2" />
              <span>Price: Low to High</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('priceDesc')}>
              <SortDesc size={16} className="mr-2" />
              <span>Price: High to Low</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('newest')}>
              <Clock size={16} className="mr-2" />
              <span>Newest</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Results count and active filters */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>
          {filteredParts.length} parts found
        </div>
        
        {filters.brands.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span>Brands:</span>
            {filters.brands.map(brand => (
              <Badge variant="outline" key={brand}>
                {brand}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Parts grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 animate-pulse bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      ) : error ? (
        <div className="py-12 text-center">
          <div className="text-red-500 mb-2">{error}</div>
          <Button variant="outline" size="sm">
            Retry
          </Button>
        </div>
      ) : filteredParts.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500 mb-2">No parts match your filters</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setFilters({
                priceRange: null,
                brands: [],
                onlyInStock: false,
                onlyPremium: false,
              });
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredParts.map((part) => (
              <motion.div
                key={part.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <PartCard
                  part={part}
                  onSelect={onSelectPart}
                  isSelected={selectedParts.includes(part.id as number)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default PartSelector;