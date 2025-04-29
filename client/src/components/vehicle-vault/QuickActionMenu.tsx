import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Wrench, 
  PlusCircle, 
  Share2, 
  ShoppingBag, 
  Download, 
  RefreshCw,
  Warehouse,
  AlertOctagon,
  Building2,
  KeyRound,
  Tag,
  History,
  Search,
  ShieldAlert,
  Phone,
  BookOpen,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface QuickActionMenuProps {
  vehicleStatus: string;
}

const QuickActionMenu = ({ vehicleStatus }: QuickActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <Car className="h-5 w-5 text-green-500" />;
      case 'Recently Purchased': return <ShoppingBag className="h-5 w-5 text-blue-500" />;
      case 'Pre-owned': return <RefreshCw className="h-5 w-5 text-indigo-500" />;
      case 'In Maintenance': return <Wrench className="h-5 w-5 text-amber-500" />;
      case 'Garage Stored': return <Warehouse className="h-5 w-5 text-sky-500" />;
      case 'Out of Service': return <AlertOctagon className="h-5 w-5 text-slate-500" />;
      case 'Commercial Fleet': return <Building2 className="h-5 w-5 text-purple-500" />;
      case 'Leased Out': return <KeyRound className="h-5 w-5 text-emerald-500" />;
      case 'For Sale': return <Tag className="h-5 w-5 text-pink-500" />;
      default: return <Car className="h-5 w-5 text-green-500" />;
    }
  };
  
  const getQuickActions = (status: string) => {
    const commonActions = [
      { icon: <Share2 className="h-4 w-4" />, label: 'Share', color: 'bg-blue-500' },
      { icon: <History className="h-4 w-4" />, label: 'History', color: 'bg-purple-500' },
      { icon: <Search className="h-4 w-4" />, label: 'Documents', color: 'bg-indigo-500' },
    ];
    
    switch (status) {
      case 'Active':
        return [
          ...commonActions,
          { icon: <Settings className="h-4 w-4" />, label: 'Schedule Service', color: 'bg-green-500' },
          { icon: <ShieldAlert className="h-4 w-4" />, label: 'Insurance', color: 'bg-amber-500' },
        ];
        
      case 'Recently Purchased':
        return [
          ...commonActions,
          { icon: <Download className="h-4 w-4" />, label: 'Registration', color: 'bg-blue-500' },
          { icon: <BookOpen className="h-4 w-4" />, label: 'Ownership Guide', color: 'bg-teal-500' },
        ];
        
      case 'Pre-owned':
        return [
          ...commonActions,
          { icon: <Settings className="h-4 w-4" />, label: 'Inspection', color: 'bg-indigo-500' },
          { icon: <BookOpen className="h-4 w-4" />, label: 'History Report', color: 'bg-purple-500' },
        ];
        
      case 'In Maintenance':
        return [
          ...commonActions,
          { icon: <Phone className="h-4 w-4" />, label: 'Contact Service', color: 'bg-amber-500' },
          { icon: <AlertTriangle className="h-4 w-4" />, label: 'Service Status', color: 'bg-orange-500' },
        ];
        
      case 'Garage Stored':
        return [
          ...commonActions,
          { icon: <Settings className="h-4 w-4" />, label: 'Storage Care', color: 'bg-sky-500' },
          { icon: <PlusCircle className="h-4 w-4" />, label: 'Reactivate', color: 'bg-green-500' },
        ];
        
      case 'Out of Service':
        return [
          ...commonActions,
          { icon: <Settings className="h-4 w-4" />, label: 'Repair Options', color: 'bg-slate-500' },
          { icon: <ShoppingBag className="h-4 w-4" />, label: 'Scrap/Sell', color: 'bg-red-500' },
        ];
        
      case 'Commercial Fleet':
        return [
          ...commonActions,
          { icon: <Settings className="h-4 w-4" />, label: 'Fleet Management', color: 'bg-purple-500' },
          { icon: <Search className="h-4 w-4" />, label: 'Driver Records', color: 'bg-indigo-500' },
        ];
        
      case 'Leased Out':
        return [
          ...commonActions,
          { icon: <Tool className="h-4 w-4" />, label: 'Lease Terms', color: 'bg-emerald-500' },
          { icon: <PlusCircle className="h-4 w-4" />, label: 'Lease Extension', color: 'bg-green-500' },
        ];
        
      case 'For Sale':
        return [
          ...commonActions,
          { icon: <Tool className="h-4 w-4" />, label: 'Selling Guide', color: 'bg-pink-500' },
          { icon: <ShoppingBag className="h-4 w-4" />, label: 'Listing Options', color: 'bg-violet-500' },
        ];
        
      default:
        return commonActions;
    }
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col gap-2 mb-4"
          >
            {getQuickActions(vehicleStatus).map((action, index) => (
              <HoverCard key={index}>
                <HoverCardTrigger asChild>
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 rounded-full shadow-lg ${action.color} text-white hover:opacity-90 transition-all`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {action.icon}
                  </motion.button>
                </HoverCardTrigger>
                <HoverCardContent className="w-fit p-2" side="left">
                  <span className="text-sm font-medium">{action.label}</span>
                </HoverCardContent>
              </HoverCard>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          onClick={() => setIsOpen(!isOpen)} 
          className={`rounded-full w-12 h-12 p-0 shadow-lg flex items-center justify-center relative ${isOpen ? 'bg-slate-800' : 'bg-blue-600'}`}
        >
          <div className="absolute -top-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
            {getStatusIcon(vehicleStatus)}
          </div>
          <motion.div 
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <PlusCircle className="h-5 w-5" />
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
};

export default QuickActionMenu;