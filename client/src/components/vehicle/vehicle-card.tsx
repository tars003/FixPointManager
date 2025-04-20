import { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Pencil, 
  Trash2, 
  Calendar, 
  FileText, 
  FileBarChart 
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Vehicle } from '@shared/schema';
import { formatDate } from '@/lib/format';

interface VehicleCardProps {
  vehicle: Vehicle;
  onUpdate: () => void;
}

const VehicleCard = ({ vehicle, onUpdate }: VehicleCardProps) => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const isActive = vehicle.status === 'active';
  
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
    <div className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3 relative">
          {vehicle.imageUrl ? (
            <img 
              src={vehicle.imageUrl} 
              alt={vehicle.name} 
              className="w-full h-48 md:h-full object-cover" 
            />
          ) : (
            <div className="w-full h-48 md:h-full bg-gray-200 flex items-center justify-center">
              <Car className="h-16 w-16 text-gray-400" />
            </div>
          )}
          <div className={`absolute top-3 left-3 ${isActive ? 'bg-primary' : 'bg-neutral-light'} text-white text-xs px-2 py-1 rounded-full`}>
            {isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
        <div className="p-4 md:w-2/3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{vehicle.name}</h3>
              <p className="text-neutral-light text-sm mb-2">{vehicle.year}</p>
            </div>
            <div className="flex">
              <button 
                className="p-2 text-neutral hover:text-primary transition"
                onClick={() => navigate(`/vehicles/edit/${vehicle.id}`)}
              >
                <Pencil className="h-5 w-5" />
              </button>
              <button 
                className="p-2 text-neutral hover:text-red-500 transition"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
            <div>
              <p className="text-neutral-light text-xs">License Plate</p>
              <p className="font-medium">{vehicle.licensePlate}</p>
            </div>
            <div>
              <p className="text-neutral-light text-xs">Last Service</p>
              <p className="font-medium">
                {vehicle.lastService ? formatDate(vehicle.lastService) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-neutral-light text-xs">Mileage</p>
              <p className="font-medium">{vehicle.mileage.toLocaleString()} km</p>
            </div>
            <div>
              <p className="text-neutral-light text-xs">Next Service</p>
              {vehicle.nextService ? (
                <p className={`font-medium ${
                  new Date(vehicle.nextService) < new Date() ? 
                    'text-red-500' : 'text-primary'
                }`}>
                  {new Date(vehicle.nextService) < new Date()
                    ? 'Overdue'
                    : formatDate(vehicle.nextService)
                  }
                </p>
              ) : (
                <p className="font-medium text-neutral-light">Not scheduled</p>
              )}
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {isActive ? (
              <button 
                onClick={handleBookService}
                className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition"
              >
                Book Service
              </button>
            ) : (
              <button 
                onClick={handleActivate}
                className="bg-accent text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-accent-dark transition"
              >
                Activate Vehicle
              </button>
            )}
            <button 
              onClick={() => navigate(`/vehicles/${vehicle.id}/history`)}
              className="bg-white border border-neutral-light text-neutral-dark px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center"
            >
              <FileBarChart className="h-4 w-4 mr-1" />
              View History
            </button>
            <button 
              onClick={() => navigate(`/vehicles/${vehicle.id}/documents`)}
              className="bg-white border border-neutral-light text-neutral-dark px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center"
            >
              <FileText className="h-4 w-4 mr-1" />
              Documents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
