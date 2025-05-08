import React from 'react';
import { motion } from 'framer-motion';
import { Save, Share2, Download, ChevronRight, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectControlsProps {
  onSave: () => void;
  onShare: () => void;
  onExport: () => void;
  totalPrice: number;
  formatPrice: (price: number) => string;
}

const ProjectControls: React.FC<ProjectControlsProps> = ({
  onSave,
  onShare,
  onExport,
  totalPrice,
  formatPrice
}) => {
  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-blue-100 shadow-lg z-30"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, duration: 0.3 }}
    >
      <div className="container max-w-7xl mx-auto py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-700"
              onClick={onSave}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Project
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-700"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-700"
              onClick={onExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Price</p>
              <p className="font-bold text-lg bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                {formatPrice(totalPrice)}
              </p>
            </div>
            
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Checkout
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectControls;