import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Share2, Download, Car, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VehicleStoryCardProps {
  vehicle: string;
  story: string;
}

// Configure brand colors for different vehicles
const vehicleBrandColors: Record<string, {bgColor: string, iconBg: string, textColor: string, iconColor: string}> = {
  'Tata Nexon EV': {
    bgColor: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-500'
  },
  'Honda City': {
    bgColor: 'bg-purple-50',
    iconBg: 'bg-purple-100',
    textColor: 'text-purple-800',
    iconColor: 'text-purple-500'
  },
  'TVS iQube': {
    bgColor: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    textColor: 'text-amber-800',
    iconColor: 'text-amber-500'
  },
  'Mahindra XUV700': {
    bgColor: 'bg-indigo-50',
    iconBg: 'bg-indigo-100',
    textColor: 'text-indigo-800',
    iconColor: 'text-indigo-500'
  },
  'Royal Enfield Classic 350': {
    bgColor: 'bg-red-50',
    iconBg: 'bg-red-100',
    textColor: 'text-red-800',
    iconColor: 'text-red-500'
  }
};

// Default colors if vehicle not found
const defaultColors = {
  bgColor: 'bg-gray-50',
  iconBg: 'bg-gray-100',
  textColor: 'text-gray-800',
  iconColor: 'text-gray-500'
};

const VehicleStoryCard: React.FC<VehicleStoryCardProps> = ({ vehicle, story }) => {
  const { toast } = useToast();
  
  // Get brand-specific colors or use defaults
  const colors = vehicleBrandColors[vehicle] || defaultColors;
  
  const handleSaveMemory = () => {
    toast({
      title: 'Story Saved',
      description: 'Vehicle story has been saved to your memories.'
    });
  };
  
  const handleShareStory = () => {
    toast({
      title: 'Story Shared',
      description: 'Vehicle story has been shared with your contacts.'
    });
  };
  
  return (
    <motion.div 
      className={`${colors.bgColor} rounded-lg overflow-hidden shadow-md h-full border border-gray-100`}
      whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className={`${colors.iconBg} p-2 rounded-full`}>
              <Brain className={`h-5 w-5 ${colors.iconColor}`} />
            </div>
            <div>
              <h3 className="font-medium text-lg">{vehicle}</h3>
              <p className="text-xs text-gray-500">AI-generated vehicle story</p>
            </div>
          </div>
          <div className={`${colors.bgColor} p-2 rounded-full`}>
            <Car className={`h-5 w-5 ${colors.iconColor}`} />
          </div>
        </div>
        
        <p className="text-sm text-gray-700">{story}</p>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs gap-1"
            onClick={handleSaveMemory}
          >
            <Download className="h-3.5 w-3.5" />
            Save to Memory
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs gap-1"
            onClick={handleShareStory}
          >
            <Share2 className="h-3.5 w-3.5" />
            Share Story
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleStoryCard;