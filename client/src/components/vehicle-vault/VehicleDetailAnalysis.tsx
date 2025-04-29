import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Car, 
  Activity, 
  AlertTriangle, 
  AlertCircle,
  BadgeCheck,
  FileText,
  Share
} from 'lucide-react';

interface Vehicle {
  id: number;
  vehicle: string;
  worth: number;
  percentage: number;
  image: string;
  mileage: number;
  fuelType: string;
  batteryHealth?: number;
  engineHealth?: number;
  lastService: string;
  nextService: string;
  purchaseDate: string;
  insuranceValid: string;
  maintenanceCost: number;
  efficiency: string;
  averageCharge?: string;
  averageFuel?: string;
  range?: string;
  carbonOffset?: string;
  topSpeed?: string;
  emissionRating?: string;
}

interface VehicleDetailAnalysisProps {
  vehicle: Vehicle;
}

const VehicleDetailAnalysis: React.FC<VehicleDetailAnalysisProps> = ({ vehicle }) => {
  const { toast } = useToast();
  
  const handleMaintenanceAlert = () => {
    toast({
      title: "Maintenance reminder set",
      description: `You'll be reminded to service your ${vehicle.vehicle} in 2 weeks.`,
    });
  };
  
  const renderFuelSpecificDetails = () => {
    if (vehicle.fuelType === 'Electric') {
      return (
        <>
          <div className="mb-4">
            <h4 className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-2">Battery Performance</h4>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-600 dark:text-slate-300">Health</span>
              <span className="text-sm font-medium">{vehicle.batteryHealth}%</span>
            </div>
            <Progress value={vehicle.batteryHealth} className="h-2" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-1">Average Charge</h4>
              <p className="font-semibold">{vehicle.averageCharge}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-1">Range</h4>
              <p className="font-semibold">{vehicle.range}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-1">Carbon Offset</h4>
              <p className="font-semibold">{vehicle.carbonOffset}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-1">Efficiency</h4>
              <p className="font-semibold">{vehicle.efficiency}</p>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="mb-4">
            <h4 className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-2">Engine Performance</h4>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-600 dark:text-slate-300">Health</span>
              <span className="text-sm font-medium">{vehicle.engineHealth}%</span>
            </div>
            <Progress value={vehicle.engineHealth} className="h-2" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-1">Fuel Efficiency</h4>
              <p className="font-semibold">{vehicle.efficiency}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-1">Average Consumption</h4>
              <p className="font-semibold">{vehicle.averageFuel}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-1">Top Speed</h4>
              <p className="font-semibold">{vehicle.topSpeed}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-1">Emission Rating</h4>
              <p className="font-semibold">{vehicle.emissionRating}</p>
            </div>
          </div>
        </>
      );
    }
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-full ${
              vehicle.fuelType === 'Electric' 
                ? 'bg-gradient-to-br from-green-400 to-emerald-600' 
                : 'bg-gradient-to-br from-blue-400 to-indigo-600'
            }`}>
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{vehicle.vehicle}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Purchased on {vehicle.purchaseDate} • Insurance valid until {vehicle.insuranceValid}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg">
              <p className="text-sm text-slate-500 dark:text-slate-400">Current Value</p>
              <p className="text-lg font-bold">₹{vehicle.worth.toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg">
              <p className="text-sm text-slate-500 dark:text-slate-400">Mileage</p>
              <p className="text-lg font-bold">{vehicle.mileage.toLocaleString()} km</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg">
              <p className="text-sm text-slate-500 dark:text-slate-400">Maintenance Cost</p>
              <p className="text-lg font-bold">₹{vehicle.maintenanceCost.toLocaleString()}</p>
            </div>
          </div>
          
          {renderFuelSpecificDetails()}
          
          <div className="mt-2">
            <h4 className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-2">Service Schedule</h4>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm">Last service: <span className="font-medium">{vehicle.lastService}</span></p>
                <p className="text-sm">Next service: <span className="font-medium">{vehicle.nextService}</span></p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs gap-1"
                onClick={handleMaintenanceAlert}
              >
                <Calendar className="h-3 w-3" />
                Set Reminder
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg">
            <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
              <Activity className="h-4 w-4 text-blue-500" />
              Recent Activities
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span>Fuel refill</span>
                <span className="text-slate-500 dark:text-slate-400">2 days ago</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span>Oil check</span>
                <span className="text-slate-500 dark:text-slate-400">1 week ago</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span>Tire pressure</span>
                <span className="text-slate-500 dark:text-slate-400">2 weeks ago</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg">
            <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Alerts
            </h4>
            {vehicle.batteryHealth && vehicle.batteryHealth < 95 || 
             vehicle.engineHealth && vehicle.engineHealth < 90 ? (
              <div className="text-sm space-y-2">
                {vehicle.fuelType === 'Electric' && vehicle.batteryHealth && vehicle.batteryHealth < 95 && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p>Battery health slightly degraded, consider diagnostic check in next service.</p>
                  </div>
                )}
                {vehicle.fuelType !== 'Electric' && vehicle.engineHealth && vehicle.engineHealth < 90 && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p>Engine performance check recommended in next maintenance service.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                <BadgeCheck className="h-4 w-4" />
                <p>No active alerts for this vehicle</p>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1 gap-1">
              <FileText className="h-4 w-4" />
              Full Report
            </Button>
            <Button variant="outline" size="sm" className="flex-1 gap-1">
              <Share className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailAnalysis;