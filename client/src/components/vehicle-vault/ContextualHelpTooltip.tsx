import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ContextualHelpTooltipProps {
  tipType: 'document' | 'maintenance' | 'purchase' | 'ownership' | 'preowned' | 'general';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children?: React.ReactNode;
}

const ContextualHelpTooltip: React.FC<ContextualHelpTooltipProps> = ({ 
  tipType, 
  placement = 'top',
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Database of contextual tips based on type
  const getTipContent = () => {
    switch (tipType) {
      case 'document':
        return {
          title: "Document Management",
          tips: [
            "Store digital copies of all important documents",
            "Set reminders for document renewal dates",
            "Keep physical copies in a fireproof box",
            "Share essential documents with family members"
          ]
        };
      case 'maintenance':
        return {
          title: "Maintenance Best Practices",
          tips: [
            "Regular oil changes extend engine life",
            "Check tire pressure monthly",
            "Replace air filters every 15,000-30,000 km",
            "Keep service records for better resale value"
          ]
        };
      case 'purchase':
        return {
          title: "New Purchase Tips",
          tips: [
            "Complete RTO registration within 7 days",
            "Verify all accessories are included",
            "Activate manufacturer warranty promptly",
            "Schedule first service on time"
          ]
        };
      case 'ownership':
        return {
          title: "Ownership Tips",
          tips: [
            "Add vehicle to insurance portal for easy claims",
            "Keep emergency contacts updated",
            "Install GPS tracking for security",
            "Register for manufacturer recall notifications"
          ]
        };
      case 'preowned':
        return {
          title: "Pre-Owned Vehicle Tips",
          tips: [
            "Verify service history thoroughly",
            "Check all electrical components",
            "Inspect for evidence of flood damage",
            "Have compression tests done on engine"
          ]
        };
      default:
        return {
          title: "Vehicle Care Tips",
          tips: [
            "Wash your vehicle regularly to prevent rust",
            "Park in shade to protect interior materials",
            "Keep emergency tools and first aid kit",
            "Update navigation maps annually"
          ]
        };
    }
  };

  const tipData = getTipContent();
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="inline-flex">
            {children || (
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="cursor-help ml-1 text-slate-400 hover:text-blue-500 transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
              </motion.div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side={placement}
          className="max-w-xs bg-white dark:bg-slate-900 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800"
        >
          <div className="space-y-2">
            <h3 className="font-medium text-sm">{tipData.title}</h3>
            <ul className="text-xs space-y-1">
              {tipData.tips.map((tip, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-1.5"
                >
                  <span className="text-blue-500 dark:text-blue-400">•</span>
                  <span>{tip}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ContextualHelpTooltip;