import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Car, Bike, Scissors } from 'lucide-react';

interface VehicleCategoryProps {
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
}

const VehicleCategorySelector: React.FC<VehicleCategoryProps> = ({ onCategorySelect, selectedCategory }) => {
  const categories = [
    { id: 'two-wheelers', name: 'Two Wheelers', icon: Bike },
    { id: 'cars', name: 'Cars', icon: Car },
    { id: 'commercial', name: 'Commercial', icon: Truck },
    { id: 'three-wheelers', name: 'Three Wheelers', icon: Scissors }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id;
        const Icon = category.icon;
        
        return (
          <motion.div
            key={category.id}
            className={`flex flex-col items-center justify-center cursor-pointer relative border-r last:border-r-0`}
            onClick={() => onCategorySelect(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className={`bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-2 ${
                isSelected ? 'bg-blue-50 text-blue-600' : 'text-gray-500'
              }`}
              whileHover={{ 
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
                backgroundColor: isSelected ? '#EFF6FF' : '#F9FAFB'
              }}
              transition={{ duration: 0.2 }}
            >
              <Icon className={`h-6 w-6 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
            </motion.div>
            <motion.span 
              className={`text-sm font-medium text-center ${isSelected ? 'text-blue-600' : 'text-gray-800'}`}
              animate={{ fontWeight: isSelected ? 600 : 500 }}
            >
              {category.name}
            </motion.span>
            {isSelected && (
              <motion.div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-blue-600"
                layoutId="categoryIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default VehicleCategorySelector;