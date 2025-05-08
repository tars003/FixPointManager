import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Palette, 
  PaintBucket, 
  Gauge, 
  Wrench, 
  LayoutDashboard, 
  Sofa, 
  Truck, 
  Speaker, 
  Lightbulb, 
  Sparkles,
  ChevronRight,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
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
import { CustomizationCategory, CustomizationSubcategory } from '@shared/arena-schema';

interface CategoryDefinition {
  id: CustomizationCategory;
  label: string;
  icon: React.ReactNode;
  description: string;
  subcategories: {
    id: CustomizationSubcategory;
    label: string;
    icon: React.ReactNode;
    description: string;
    isNew?: boolean;
    isPremium?: boolean;
  }[];
  primaryColor: string;
  gradientColor: string;
  isEnabled: boolean;
}

// Define all categories with their subcategories and visual styling
const categories: CategoryDefinition[] = [
  {
    id: 'exterior',
    label: 'Exterior',
    icon: <Car size={20} />,
    description: 'Customize the external appearance of your vehicle',
    primaryColor: '#1E40AF',
    gradientColor: '#3B82F6',
    isEnabled: true,
    subcategories: [
      { 
        id: 'paint', 
        label: 'Paint & Color', 
        icon: <Palette size={16} />, 
        description: 'Choose from premium paints and finishes for your vehicle' 
      },
      { 
        id: 'body', 
        label: 'Body Kits', 
        icon: <Car size={16} />, 
        description: 'Transform your vehicle with professionally designed body kits' 
      },
      { 
        id: 'wrap', 
        label: 'Wraps & Decals', 
        icon: <PaintBucket size={16} />, 
        description: 'Apply premium vinyl wraps and custom decals' 
      },
      { 
        id: 'grille', 
        label: 'Grille & Accents', 
        icon: <LayoutDashboard size={16} />, 
        description: 'Enhance front-end appearance with custom grilles and accents',
        isNew: true
      },
      { 
        id: 'spoiler', 
        label: 'Spoilers', 
        icon: <Truck size={16} />, 
        description: 'Add aerodynamic and style-enhancing spoilers',
        isPremium: true 
      },
    ]
  },
  {
    id: 'interior',
    label: 'Interior',
    icon: <Sofa size={20} />,
    description: 'Transform the inside of your vehicle for comfort and style',
    primaryColor: '#9D174D',
    gradientColor: '#EC4899',
    isEnabled: true,
    subcategories: [
      { 
        id: 'seats', 
        label: 'Seats & Upholstery', 
        icon: <Sofa size={16} />, 
        description: 'Premium seating options with custom upholstery' 
      },
      { 
        id: 'dashboard', 
        label: 'Dashboard', 
        icon: <LayoutDashboard size={16} />, 
        description: 'Customize your dashboard with premium materials and finishes' 
      },
      { 
        id: 'steering', 
        label: 'Steering & Controls', 
        icon: <Wrench size={16} />, 
        description: 'Upgrade your steering wheel and control interfaces',
        isNew: true 
      },
      { 
        id: 'upholstery', 
        label: 'Trim & Accents', 
        icon: <Sparkles size={16} />, 
        description: 'Add premium trim and accent pieces throughout the interior' 
      },
    ]
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: <Gauge size={20} />,
    description: 'Enhance the power and handling of your vehicle',
    primaryColor: '#B45309',
    gradientColor: '#F59E0B',
    isEnabled: true,
    subcategories: [
      { 
        id: 'engine', 
        label: 'Engine Tuning', 
        icon: <Gauge size={16} />, 
        description: 'Professional engine tuning for increased power and efficiency' 
      },
      { 
        id: 'suspension', 
        label: 'Suspension', 
        icon: <Wrench size={16} />, 
        description: 'Upgrade suspension components for better handling and ride quality' 
      },
      { 
        id: 'exhaust', 
        label: 'Exhaust Systems', 
        icon: <Car size={16} />, 
        description: 'Performance exhaust systems for better flow and sound',
        isNew: true 
      },
      { 
        id: 'brakes', 
        label: 'Braking Systems', 
        icon: <AlertCircle size={16} />, 
        description: 'High-performance braking systems for improved stopping power',
        isPremium: true 
      },
    ]
  },
  {
    id: 'wheels',
    label: 'Wheels & Tires',
    icon: <Truck size={20} />,
    description: 'Choose from a wide range of custom wheels and performance tires',
    primaryColor: '#065F46',
    gradientColor: '#10B981',
    isEnabled: true,
    subcategories: [
      { 
        id: 'rims', 
        label: 'Custom Wheels', 
        icon: <Truck size={16} />, 
        description: 'Premium alloy and forged wheels in various styles and finishes' 
      },
      { 
        id: 'tires', 
        label: 'Performance Tires', 
        icon: <Car size={16} />, 
        description: 'High-grip and specialty tires for optimal performance' 
      },
    ]
  },
  {
    id: 'lighting',
    label: 'Lighting',
    icon: <Lightbulb size={20} />,
    description: 'Upgrade your vehicle lighting for style and visibility',
    primaryColor: '#5B21B6',
    gradientColor: '#8B5CF6',
    isEnabled: true,
    subcategories: [
      { 
        id: 'headlights', 
        label: 'Headlights', 
        icon: <Lightbulb size={16} />, 
        description: 'Premium headlight upgrades with improved visibility and style' 
      },
      { 
        id: 'taillights', 
        label: 'Taillights', 
        icon: <Lightbulb size={16} />, 
        description: 'Custom taillight designs for a distinctive appearance' 
      },
      { 
        id: 'fog-lights', 
        label: 'Fog & Auxiliary Lights', 
        icon: <Lightbulb size={16} />, 
        description: 'Add functional and stylish auxiliary lighting',
        isNew: true 
      },
      { 
        id: 'accent-lights', 
        label: 'Interior & Accent Lighting', 
        icon: <Sparkles size={16} />, 
        description: 'Ambient and accent lighting for interior and exterior',
        isPremium: true 
      },
    ]
  },
];

interface CustomizationCategoriesProps {
  selectedCategory?: CustomizationCategory;
  selectedSubcategory?: CustomizationSubcategory;
  onCategorySelect: (category: CustomizationCategory) => void;
  onSubcategorySelect: (category: CustomizationCategory, subcategory: CustomizationSubcategory) => void;
  defaultOpen?: boolean;
  highlightNew?: boolean;
  layout?: 'accordion' | 'tabs' | 'sidebar';
  className?: string;
}

const CustomizationCategories: React.FC<CustomizationCategoriesProps> = ({
  selectedCategory = 'exterior',
  selectedSubcategory,
  onCategorySelect,
  onSubcategorySelect,
  defaultOpen = true,
  highlightNew = true,
  layout = 'accordion',
  className = '',
}) => {
  // Keep track of which category is expanded in the accordion layout
  const [expandedCategory, setExpandedCategory] = useState<CustomizationCategory | null>(
    defaultOpen ? selectedCategory : null
  );

  // Handle accordion expansion toggle
  const handleAccordionToggle = (category: CustomizationCategory) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  // Get styling for a category
  const getCategoryStyles = (category: CategoryDefinition, isSelected: boolean) => {
    return {
      background: isSelected 
        ? `linear-gradient(135deg, ${category.primaryColor}, ${category.gradientColor})` 
        : 'transparent',
      color: isSelected ? 'white' : undefined,
      borderColor: isSelected ? 'transparent' : undefined,
    };
  };

  // Render the accordion layout
  if (layout === 'accordion') {
    return (
      <div className={`rounded-lg border border-gray-200 overflow-hidden ${className}`}>
        <Accordion
          type="single"
          collapsible
          value={expandedCategory || undefined}
          className="w-full"
        >
          {categories.filter(cat => cat.isEnabled).map((category) => {
            const isSelected = category.id === selectedCategory;
            
            return (
              <AccordionItem 
                key={category.id} 
                value={category.id}
                className={`border-b border-gray-200 last:border-0 ${isSelected ? 'bg-gray-50' : ''}`}
              >
                <AccordionTrigger
                  onClick={() => {
                    onCategorySelect(category.id);
                    handleAccordionToggle(category.id);
                  }}
                  className={`px-4 py-3 hover:no-underline hover:bg-gray-50 ${isSelected ? 'font-medium' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        isSelected 
                          ? `text-white`
                          : 'text-gray-600 bg-gray-100'
                      }`}
                      style={{
                        background: isSelected 
                          ? `linear-gradient(135deg, ${category.primaryColor}, ${category.gradientColor})` 
                          : undefined
                      }}
                    >
                      {category.icon}
                    </div>
                    <span className={isSelected ? 'text-gray-900' : 'text-gray-700'}>
                      {category.label}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-2 py-1">
                  <div className="space-y-1 ml-10">
                    {category.subcategories.map((subcategory) => (
                      <TooltipProvider key={subcategory.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.button
                              className={`flex items-center w-full gap-2 px-4 py-2 text-sm rounded-md ${
                                selectedSubcategory === subcategory.id
                                  ? 'bg-gray-100 text-gray-900 font-medium'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                              onClick={() => onSubcategorySelect(category.id, subcategory.id)}
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ duration: 0.1 }}
                            >
                              <span className="w-5 h-5 flex items-center justify-center">
                                {subcategory.icon}
                              </span>
                              <span className="flex-1 text-left">{subcategory.label}</span>
                              
                              {subcategory.isNew && highlightNew && (
                                <span className="px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                                  New
                                </span>
                              )}
                              
                              {subcategory.isPremium && (
                                <span className="px-1.5 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700 font-medium">
                                  Premium
                                </span>
                              )}
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            <p>{subcategory.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    );
  }

  // Render the sidebar layout (vertical tabs)
  if (layout === 'sidebar') {
    return (
      <div className={`flex h-full ${className}`}>
        <div className="w-64 border-r border-gray-200 h-full overflow-y-auto">
          <div className="py-2 space-y-1">
            {categories.filter(cat => cat.isEnabled).map((category) => {
              const isSelected = category.id === selectedCategory;
              const styles = getCategoryStyles(category, isSelected);
              
              return (
                <div key={category.id} className="px-2">
                  <button
                    className={`flex items-center w-full gap-2 px-3 py-2.5 rounded-lg ${
                      isSelected 
                        ? 'text-white font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={styles}
                    onClick={() => onCategorySelect(category.id)}
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      {category.icon}
                    </div>
                    <span className="flex-1 text-left">{category.label}</span>
                    <ChevronRight size={16} className={isSelected ? 'opacity-75' : 'opacity-50'} />
                  </button>
                  
                  {isSelected && (
                    <div className="mt-1 ml-4 py-1 space-y-1 border-l border-gray-200 pl-3">
                      {category.subcategories.map((subcategory) => (
                        <motion.button
                          key={subcategory.id}
                          className={`flex items-center w-full gap-2 px-3 py-2 text-sm rounded-md ${
                            selectedSubcategory === subcategory.id
                              ? 'bg-gray-100 text-gray-900 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                          onClick={() => onSubcategorySelect(category.id, subcategory.id)}
                          whileHover={{ x: 2 }}
                          transition={{ duration: 0.1 }}
                        >
                          <span className="w-4 h-4 flex items-center justify-center">
                            {subcategory.icon}
                          </span>
                          <span className="flex-1 text-left">{subcategory.label}</span>
                          
                          {subcategory.isNew && highlightNew && (
                            <span className="px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                              New
                            </span>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Default to tabs layout
  return (
    <div className={`${className}`}>
      <div className="border-b border-gray-200">
        <div className="flex items-center gap-1 overflow-x-auto pb-px hide-scrollbar">
          {categories.filter(cat => cat.isEnabled).map((category) => {
            const isSelected = category.id === selectedCategory;
            
            return (
              <button
                key={category.id}
                className={`flex items-center py-2 px-4 gap-2 border-b-2 whitespace-nowrap ${
                  isSelected 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => onCategorySelect(category.id)}
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  {category.icon}
                </span>
                <span className={isSelected ? 'font-medium' : ''}>
                  {category.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {categories
          .find(cat => cat.id === selectedCategory)
          ?.subcategories.map((subcategory) => (
            <TooltipProvider key={subcategory.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                      selectedSubcategory === subcategory.id
                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => onSubcategorySelect(selectedCategory, subcategory.id)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.1 }}
                  >
                    <span className="w-5 h-5 flex items-center justify-center">
                      {subcategory.icon}
                    </span>
                    <span>{subcategory.label}</span>
                    
                    {subcategory.isNew && highlightNew && (
                      <span className="px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                        New
                      </span>
                    )}
                    
                    {subcategory.isPremium && (
                      <span className="px-1.5 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700 font-medium">
                        Premium
                      </span>
                    )}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{subcategory.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
      </div>
    </div>
  );
};

export default CustomizationCategories;