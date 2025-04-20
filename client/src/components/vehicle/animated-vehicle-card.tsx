import { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Pencil, 
  Trash2, 
  Calendar, 
  FileText, 
  FileBarChart,
  Car,
  AlertCircle,
  ChevronRight,
  Shield,
  Activity,
  Wrench
} from 'lucide-react';
import { motion } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Vehicle } from '@shared/schema';
import { formatDate, formatNumber } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AnimatedVehicleCardProps {
  vehicle: Vehicle;
  onUpdate: () => void;
  index?: number;
}

const AnimatedVehicleCard = ({ vehicle, onUpdate, index = 0 }: AnimatedVehicleCardProps) => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isActive = vehicle.status === 'active';
  const hasWarnings = vehicle.nextService && new Date(vehicle.nextService) < new Date();
  
  // Calculate health score percentage to show in the progress bar
  const healthScore = vehicle.healthScore || 85; // Default to 85 if not provided
  const healthColor = healthScore > 80 ? 'bg-green-500' : healthScore > 50 ? 'bg-amber-500' : 'bg-red-500';
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setIsDeleting(true);
      try {
        await apiRequest('DELETE', `/api/vehicles/${vehicle.id}`);
        toast({
          title: 'Vehicle deleted',
          description: 'Vehicle has been successfully removed.',
        });
        onUpdate();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete vehicle. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  const handleActivate = async () => {
    try {
      await apiRequest('PUT', `/api/vehicles/${vehicle.id}`, {
        status: 'active'
      });
      toast({
        title: 'Vehicle activated',
        description: 'Vehicle has been successfully activated.',
      });
      onUpdate();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to activate vehicle. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleBookService = () => {
    navigate(`/book-service/${vehicle.id}`);
  };

  return (
    <motion.div 
      className="fx-card overflow-hidden mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="md:flex">
        <div className="md:w-1/3 relative">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
          >
            {vehicle.imageUrl ? (
              <img 
                src={vehicle.imageUrl} 
                alt={vehicle.name} 
                className="w-full h-48 md:h-full object-cover" 
              />
            ) : (
              <div className="w-full h-48 md:h-full bg-gradient-to-r from-neutral-100 to-neutral-200 flex items-center justify-center">
                <Car className="h-20 w-20 text-neutral-400" />
              </div>
            )}
          </motion.div>
          
          <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-center">
            <Badge 
              className={`${
                isActive 
                  ? 'bg-primary text-white hover:bg-primary' 
                  : 'bg-neutral-200 text-neutral-500 hover:bg-neutral-300'
              }`}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {isActive ? 'Active' : 'Inactive'}
              </motion.span>
            </Badge>
            
            {hasWarnings && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 500,
                  damping: 10,
                  delay: 0.5 + index * 0.1
                }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-red-100 text-red-600 p-1 rounded-full">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Service overdue!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            )}
          </div>
          
          {/* Health score indicator */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span>Health Score</span>
              <span className="font-semibold">{healthScore}%</span>
            </div>
            <div className="w-full bg-neutral-700 rounded-full h-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${healthScore}%` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                className={`h-1.5 rounded-full ${healthColor}`}
              />
            </div>
          </div>
        </div>
        
        <motion.div 
          className="p-4 md:w-2/3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">{vehicle.name}</h3>
              <p className="text-neutral-light text-sm">
                {vehicle.model} • {vehicle.year} • {vehicle.licensePlate}
              </p>
            </div>
            <div className="flex">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(`/vehicles/edit/${vehicle.id}`)}
                className="text-neutral hover:text-primary"
              >
                <Pencil className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-neutral hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-neutral-50 p-2 rounded-lg">
              <p className="text-neutral-light text-xs">Mileage</p>
              <p className="font-semibold">{formatNumber(vehicle.mileage)} km</p>
            </div>
            <div className="bg-neutral-50 p-2 rounded-lg">
              <p className="text-neutral-light text-xs">Last Service</p>
              <p className="font-semibold">
                {vehicle.lastService ? formatDate(vehicle.lastService) : 'N/A'}
              </p>
            </div>
            <div className="bg-neutral-50 p-2 rounded-lg">
              <p className="text-neutral-light text-xs">Next Service</p>
              {vehicle.nextService ? (
                <p className={`font-semibold ${
                  new Date(vehicle.nextService) < new Date() ? 
                    'text-red-500' : 'text-primary'
                }`}>
                  {new Date(vehicle.nextService) < new Date()
                    ? 'Overdue'
                    : formatDate(vehicle.nextService)
                  }
                </p>
              ) : (
                <p className="font-semibold text-neutral-light">Not scheduled</p>
              )}
            </div>
            <div className="bg-neutral-50 p-2 rounded-lg">
              <p className="text-neutral-light text-xs">Fuel Type</p>
              <p className="font-semibold">{vehicle.fuelType || 'Petrol'}</p>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {isActive ? (
              <Button 
                onClick={handleBookService}
                className="bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-md transition-all"
              >
                <Wrench className="h-4 w-4 mr-2" />
                Book Service
              </Button>
            ) : (
              <Button 
                onClick={handleActivate}
                className="bg-gradient-to-r from-accent to-accent-dark text-white hover:shadow-md transition-all"
              >
                Activate Vehicle
              </Button>
            )}
            
            <Button 
              variant="outline"
              onClick={() => navigate(`/vehicles/${vehicle.id}/history`)}
              className="hover:border-primary/50 hover:text-primary"
            >
              <FileBarChart className="h-4 w-4 mr-2" />
              History
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate(`/vehicles/${vehicle.id}/documents`)}
              className="hover:border-primary/50 hover:text-primary"
            >
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </Button>
          </div>
          
          {/* Expandable section */}
          <motion.div 
            className="mt-4 overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: isExpanded ? 'auto' : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pt-2 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-neutral-light text-xs mb-1">Estimated Value</p>
                  <p className="font-semibold text-lg">
                    {vehicle.estimatedValue ? `$${formatNumber(vehicle.estimatedValue)}` : 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-light text-xs mb-1">VIN</p>
                  <p className="font-semibold">
                    {vehicle.vin || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-light text-xs mb-1">Purchase Date</p>
                  <p className="font-semibold">
                    {vehicle.purchaseDate ? formatDate(vehicle.purchaseDate) : 'Not provided'}
                  </p>
                </div>
              </div>
              
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="mt-3">
                  <p className="text-neutral-light text-xs mb-1">Features</p>
                  <div className="flex flex-wrap gap-1">
                    {vehicle.features.map((feature, i) => (
                      <Badge key={i} variant="outline" className="bg-primary/5">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 w-full flex items-center justify-center text-neutral-light"
          >
            <span>{isExpanded ? 'Show less' : 'Show more'}</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight className="h-4 w-4 ml-1" />
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnimatedVehicleCard;