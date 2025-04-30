import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Car, 
  PaintBucket, 
  Sofa, 
  Package, 
  Cog, 
  Download, 
  Send, 
  Share2, 
  Printer, 
  Copy, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle,
  DollarSign 
} from 'lucide-react';

export interface ConfigItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
}

interface ConfigurationSummaryProps {
  vehicle: {
    id: string;
    name: string;
    brand: string;
    basePrice: number;
    image?: string;
    emoji: string;
  };
  selections: ConfigItem[];
  onProceed: () => void;
  onDownloadSummary: () => void;
  onShareConfiguration: () => void;
  selectedColor: string;
}

const ConfigurationSummary: React.FC<ConfigurationSummaryProps> = ({
  vehicle,
  selections,
  onProceed,
  onDownloadSummary,
  onShareConfiguration,
  selectedColor,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('all');
  
  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Calculate total price
  const totalPrice = vehicle.basePrice + selections.reduce((sum, item) => sum + item.price, 0);
  
  // Get unique categories with their items
  const categories = [
    { id: 'exterior', label: 'Exterior', icon: <PaintBucket className="h-4 w-4" /> },
    { id: 'interior', label: 'Interior', icon: <Sofa className="h-4 w-4" /> },
    { id: 'performance', label: 'Performance', icon: <Cog className="h-4 w-4" /> },
    { id: 'packages', label: 'Packages', icon: <Package className="h-4 w-4" /> },
  ];
  
  const categorizedItems = categories.map(category => ({
    ...category,
    items: selections.filter(item => item.category.toLowerCase() === category.id.toLowerCase())
  }));
  
  const handleToggleCategory = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };
  
  // Configuration code
  const configCode = `${vehicle.brand.substring(0, 3).toUpperCase()}-${vehicle.id}-${Math.floor(Math.random() * 10000)}`;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column - Configuration details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Vehicle summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Your Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="h-16 w-16 rounded-md flex items-center justify-center bg-slate-100"
                  style={{ backgroundColor: selectedColor }}
                >
                  <span className="text-3xl">{vehicle.emoji}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{vehicle.brand} {vehicle.name}</h3>
                  <div className="text-muted-foreground text-sm">Base Vehicle</div>
                </div>
                <div className="ml-auto">
                  <div className="font-semibold text-right">{formatPrice(vehicle.basePrice)}</div>
                  <div className="text-xs text-muted-foreground text-right">Starting MSRP</div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Configuration items by category */}
              <div className="space-y-4">
                {categorizedItems.map((category) => (
                  <div key={category.id}>
                    <button
                      onClick={() => handleToggleCategory(category.id)}
                      className="w-full flex items-center justify-between py-2 hover:bg-slate-50 rounded px-2"
                    >
                      <div className="flex items-center">
                        {category.icon}
                        <span className="font-medium ml-2">{category.label}</span>
                        <Badge className="ml-2">{category.items.length}</Badge>
                      </div>
                      {expandedCategory === category.id ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    
                    {expandedCategory === category.id && category.items.length > 0 && (
                      <div className="mt-2 space-y-2 pl-6">
                        {category.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-2 border-b border-dashed border-slate-200">
                            <div>
                              <div className="font-medium text-sm">{item.name}</div>
                              <div className="text-xs text-muted-foreground">{item.category}</div>
                            </div>
                            <div className="font-medium">{formatPrice(item.price)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {expandedCategory === category.id && category.items.length === 0 && (
                      <div className="mt-2 pl-6 py-2 text-sm text-muted-foreground">
                        No {category.label.toLowerCase()} options selected
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Configuration code */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium mb-1">Your Configuration Code</h3>
                  <div className="font-mono text-lg bg-slate-100 px-3 py-1 rounded-md">
                    {configCode}
                  </div>
                </div>
                
                <div className="flex gap-2 flex-wrap md:flex-nowrap">
                  <Button variant="outline" size="sm" className="gap-1 flex-1">
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 flex-1">
                    <Printer className="h-4 w-4" />
                    <span>Print</span>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 flex-1">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Pricing and actions */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Price summary */}
            <Card className="bg-slate-100 border-0 overflow-hidden">
              <CardHeader className="bg-slate-800 text-white pb-3">
                <CardTitle className="text-xl font-light">Price Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-3">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Base Price</span>
                    <span className="font-medium">{formatPrice(vehicle.basePrice)}</span>
                  </div>
                  
                  {categories.map(category => {
                    const categoryItems = selections.filter(
                      item => item.category.toLowerCase() === category.id.toLowerCase()
                    );
                    const categoryTotal = categoryItems.reduce((sum, item) => sum + item.price, 0);
                    
                    if (categoryItems.length === 0) return null;
                    
                    return (
                      <div key={category.id} className="flex justify-between">
                        <span>{category.label} Options</span>
                        <span>{formatPrice(categoryTotal)}</span>
                      </div>
                    );
                  })}
                </div>
                
                <Separator className="mb-4" />
                
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total Price</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                
                <div className="text-xs text-right text-muted-foreground mt-1">
                  Excluding taxes and government fees
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Financing options */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Monthly Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-2xl">{formatPrice(totalPrice / 60)}</span>
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </div>
                  <Badge variant="outline">Est. Finance Payment</Badge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Based on 60 months @ 8.99% APR
                </div>
                
                <div className="border border-dashed border-primary/50 rounded-md p-3 bg-primary/5 mt-2">
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Payment calculator and personalized finance options available at the next step</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Button onClick={onProceed} className="w-full gap-2" size="lg">
                  <CheckCircle className="h-5 w-5" />
                  Get Your Quote
                </Button>
                
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 gap-1" onClick={onShareConfiguration}>
                    <Send className="h-4 w-4" />
                    <span>Email</span>
                  </Button>
                  <Button variant="outline" className="flex-1 gap-1" onClick={onDownloadSummary}>
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Dealer search */}
          <Card className="bg-blue-600 border-0 text-white">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-2">See matches near you</h3>
              <p className="text-sm text-blue-100 mb-4">
                Enter your location to find vehicles similar to your configuration at dealerships near you.
              </p>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter ZIP Code" 
                    className="w-full pl-9 pr-4 py-2 bg-white/20 border border-white/30 rounded text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50" 
                  />
                </div>
                <Button className="bg-white text-blue-600 hover:bg-white/90 hover:text-blue-700">
                  Find Dealer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationSummary;