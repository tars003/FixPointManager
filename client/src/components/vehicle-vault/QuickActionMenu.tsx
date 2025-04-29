import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  X, 
  Calendar, 
  Wrench, 
  Car, 
  FileText, 
  Share, 
  Pen, 
  RotateCcw,
  Zap,
  Truck
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface QuickActionMenuProps {
  vehicleId?: number;
  vehicleStatus: string;
}

const QuickActionMenu: React.FC<QuickActionMenuProps> = ({ vehicleId, vehicleStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Define context-aware actions based on vehicle status
  const getActionsForStatus = () => {
    switch (vehicleStatus) {
      case 'Active':
        return [
          { icon: <Calendar className="h-4 w-4" />, label: 'Schedule Service', action: () => handleAction('schedule') },
          { icon: <FileText className="h-4 w-4" />, label: 'View Documents', action: () => handleAction('documents') },
          { icon: <Share className="h-4 w-4" />, label: 'Share Vehicle', action: () => handleAction('share') },
          { icon: <Pen className="h-4 w-4" />, label: 'Edit Details', action: () => handleAction('edit') },
        ];
      case 'Recently Purchased':
        return [
          { icon: <FileText className="h-4 w-4" />, label: 'Upload Documents', action: () => handleAction('upload') },
          { icon: <Zap className="h-4 w-4" />, label: 'Track Registration', action: () => handleAction('track') },
          { icon: <Calendar className="h-4 w-4" />, label: 'Schedule First Service', action: () => handleAction('schedule') },
        ];
      case 'In Maintenance':
        return [
          { icon: <Wrench className="h-4 w-4" />, label: 'Service Updates', action: () => handleAction('updates') },
          { icon: <RotateCcw className="h-4 w-4" />, label: 'Extend Service', action: () => handleAction('extend') },
          { icon: <Truck className="h-4 w-4" />, label: 'Transport Options', action: () => handleAction('transport') },
        ];
      case 'Pre-Owned':
        return [
          { icon: <FileText className="h-4 w-4" />, label: 'View History', action: () => handleAction('history') },
          { icon: <Calendar className="h-4 w-4" />, label: 'Schedule Service', action: () => handleAction('schedule') },
          { icon: <Pen className="h-4 w-4" />, label: 'Edit Details', action: () => handleAction('edit') },
        ];
      default:
        return [
          { icon: <Calendar className="h-4 w-4" />, label: 'Schedule Service', action: () => handleAction('schedule') },
          { icon: <FileText className="h-4 w-4" />, label: 'View Documents', action: () => handleAction('documents') },
        ];
    }
  };

  const handleAction = (actionType: string) => {
    const actionMessages = {
      'schedule': 'Service scheduled successfully!',
      'documents': 'Opening document viewer...',
      'share': 'Share options opened',
      'edit': 'Edit mode activated',
      'upload': 'Document upload started',
      'track': 'Showing registration status',
      'updates': 'Fetching latest service updates',
      'extend': 'Service extension requested',
      'transport': 'Transport options displayed',
      'history': 'Vehicle history loaded'
    };

    toast({
      title: "Action Triggered",
      description: actionMessages[actionType as keyof typeof actionMessages] || "Action completed",
    });
    
    setIsOpen(false);
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      y: 20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, y: 10 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="flex flex-col items-end space-y-2 mb-2"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            {getActionsForStatus().map((action, index) => (
              <motion.div
                key={index}
                className="flex items-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="bg-white dark:bg-slate-800 py-1 px-3 rounded-l-full text-sm shadow-md mr-1">
                  {action.label}
                </span>
                <Button
                  size="sm"
                  className="rounded-full p-2 h-9 w-9"
                  onClick={action.action}
                  style={{
                    background: getStatusColor(vehicleStatus),
                  }}
                >
                  {action.icon}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          size="lg"
          className="rounded-full p-0 h-14 w-14 shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: getStatusColor(vehicleStatus),
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? "close" : "open"}
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
            </motion.div>
          </AnimatePresence>
        </Button>
      </motion.div>
    </div>
  );
};

// Helper function to get color based on status
function getStatusColor(status: string): string {
  switch (status) {
    case 'Active':
      return 'linear-gradient(135deg, #3182ce, #0047AB)';
    case 'Recently Purchased':
      return 'linear-gradient(135deg, #2563eb, #1e40af)';
    case 'In Maintenance':
      return 'linear-gradient(135deg, #f59e0b, #d97706)';
    case 'Pre-Owned':
      return 'linear-gradient(135deg, #8b5cf6, #6d28d9)';
    case 'Garage Stored':
      return 'linear-gradient(135deg, #10b981, #059669)';
    default:
      return 'linear-gradient(135deg, #3182ce, #0047AB)';
  }
}

export default QuickActionMenu;