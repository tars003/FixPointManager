import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Calendar, 
  ChevronDown, 
  ChevronUp,
  Info,
  CircleDollarSign,
  Sliders
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface Vehicle {
  id: number;
  name: string;
  make: string;
  model: string;
  year: number;
  purchaseValue: number;
  currentValue: number;
  monthlyDepreciation: number;
  color: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
}

interface ValueTrendPredictorProps {
  vehicles: Vehicle[];
}

const ValueTrendPredictor = ({ vehicles }: ValueTrendPredictorProps) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [timeframe, setTimeframe] = useState<number>(12); // Months
  const [maintenance, setMaintenance] = useState<number>(5000); // Annual maintenance budget
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [predictedValue, setPredictedValue] = useState<number | null>(null);
  const [valueChange, setValueChange] = useState<number>(0);
  const [changePercent, setChangePercent] = useState<number>(0);
  const [chartData, setChartData] = useState<{ month: number; value: number }[]>([]);

  // Default vehicle data if none provided
  const defaultVehicles: Vehicle[] = [
    {
      id: 1,
      name: 'Honda City',
      make: 'Honda',
      model: 'City',
      year: 2020,
      purchaseValue: 1200000,
      currentValue: 950000,
      monthlyDepreciation: 8500,
      color: 'White',
      condition: 'good',
    },
    {
      id: 2,
      name: 'Maruti Swift',
      make: 'Maruti',
      model: 'Swift',
      year: 2021,
      purchaseValue: 850000,
      currentValue: 750000,
      monthlyDepreciation: 5000,
      color: 'Red',
      condition: 'excellent',
    },
    {
      id: 3,
      name: 'Hyundai Creta',
      make: 'Hyundai',
      model: 'Creta',
      year: 2019,
      purchaseValue: 1500000,
      currentValue: 1100000,
      monthlyDepreciation: 11000,
      color: 'Blue',
      condition: 'good',
    },
  ];

  const vehiclesList = vehicles.length > 0 ? vehicles : defaultVehicles;
  
  useEffect(() => {
    if (!selectedVehicleId && vehiclesList.length > 0) {
      setSelectedVehicleId(vehiclesList[0].id);
    }
  }, [vehiclesList, selectedVehicleId]);

  // Calculate predicted value when inputs change
  useEffect(() => {
    if (selectedVehicleId === null) return;
    
    const vehicle = vehiclesList.find(v => v.id === selectedVehicleId);
    if (!vehicle) return;
    
    // Basic prediction logic
    const monthlyDepreciation = vehicle.monthlyDepreciation;
    const maintenanceImpact = (maintenance / 12) * 0.05; // 5% of monthly maintenance improves value
    
    // Calculate value for each month
    const newChartData = Array.from({ length: timeframe + 1 }, (_, i) => {
      const depreciation = monthlyDepreciation * i;
      const maintenanceValue = maintenanceImpact * i;
      const value = Math.max(vehicle.currentValue - depreciation + maintenanceValue, vehicle.currentValue * 0.3); // Value doesn't go below 30% of current
      return { month: i, value: Math.round(value) };
    });
    
    setChartData(newChartData);
    
    // Set final predicted value
    const predicted = newChartData[timeframe].value;
    setPredictedValue(predicted);
    
    // Calculate change amount and percentage
    const change = predicted - vehicle.currentValue;
    setValueChange(change);
    setChangePercent((change / vehicle.currentValue) * 100);
  }, [selectedVehicleId, timeframe, maintenance, vehiclesList]);

  // Get current selected vehicle
  const selectedVehicle = selectedVehicleId ? vehiclesList.find(v => v.id === selectedVehicleId) : null;

  return (
    <motion.div 
      className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-5 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <LineChart className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="font-semibold text-lg">Vehicle Value Trend Predictor</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-auto text-gray-500"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[1000px]' : 'max-h-[320px]'}`}>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Vehicle Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Vehicle</label>
              <Select
                value={selectedVehicleId?.toString() || ''}
                onValueChange={(value) => setSelectedVehicleId(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {vehiclesList.map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                        {vehicle.name} ({vehicle.year})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Timeframe Selector */}
            <div>
              <div className="flex items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Prediction Timeframe</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                        <Info className="h-3.5 w-3.5 text-gray-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">Predict value trends for up to 36 months into the future.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center">
                <Slider
                  value={[timeframe]}
                  min={1}
                  max={36}
                  step={1}
                  onValueChange={(value) => setTimeframe(value[0])}
                  className="w-full"
                />
                <span className="text-sm font-medium text-gray-700 ml-3 min-w-[60px]">{timeframe} months</span>
              </div>
            </div>

            {/* Maintenance Budget */}
            <div>
              <div className="flex items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Annual Maintenance</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                        <Info className="h-3.5 w-3.5 text-gray-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">Higher maintenance budgets can slow depreciation.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center">
                <Slider
                  value={[maintenance]}
                  min={0}
                  max={50000}
                  step={1000}
                  onValueChange={(value) => setMaintenance(value[0])}
                  className="w-full"
                />
                <span className="text-sm font-medium text-gray-700 ml-3 min-w-[80px]">₹{(maintenance/1000).toFixed(0)}K</span>
              </div>
            </div>
          </div>

          {/* Prediction Results */}
          {selectedVehicle && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Current Value</div>
                  <div className="text-xl font-bold text-gray-900">₹{(selectedVehicle.currentValue/100000).toFixed(2)} L</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Predicted Value ({timeframe} months)</div>
                  <div className="text-xl font-bold text-gray-900">
                    {predictedValue !== null ? `₹${(predictedValue/100000).toFixed(2)} L` : '—'}
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${valueChange < 0 ? 'bg-red-50' : 'bg-emerald-50'}`}>
                  <div className="text-sm text-gray-500 mb-1">Expected Change</div>
                  <div className="flex items-center">
                    <div className={`text-xl font-bold ${valueChange < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {valueChange < 0 ? '-' : '+'} ₹{(Math.abs(valueChange)/100000).toFixed(2)} L
                    </div>
                    <Badge className={`ml-2 ${valueChange < 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {changePercent.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Value Trend Chart */}
              <div className="h-64 mt-4 relative">
                <div className="absolute inset-0">
                  {/* Chart Background */}
                  <div className="h-full w-full flex flex-col justify-between">
                    <div className="border-b border-gray-200 h-0"></div>
                    <div className="border-b border-gray-200 h-0"></div>
                    <div className="border-b border-gray-200 h-0"></div>
                    <div className="border-b border-gray-200 h-0"></div>
                    <div className="border-b border-gray-200 h-0"></div>
                  </div>
                  
                  {/* Chart Line */}
                  <div className="absolute inset-0 px-2 pb-6">
                    <svg className="w-full h-full">
                      {/* Draw the line chart path */}
                      {chartData.length > 0 && (
                        <path
                          d={chartData.map((point, i) => {
                            const x = (point.month / timeframe) * 100 + '%';
                            // Scale the y-value to fit the chart height
                            const minValue = Math.min(...chartData.map(d => d.value));
                            const maxValue = Math.max(...chartData.map(d => d.value));
                            const range = maxValue - minValue;
                            // Add a small buffer at top and bottom
                            const yValue = 95 - ((point.value - minValue) / (range * 1.1)) * 90;
                            return `${i === 0 ? 'M' : 'L'} ${x} ${yValue}%`;
                          }).join(' ')}
                          fill="none"
                          stroke={valueChange < 0 ? '#f43f5e' : '#10b981'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                    </svg>
                    
                    {/* Y-axis labels */}
                    <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-gray-500">
                      {chartData.length > 0 && (
                        <>
                          <div>₹{(Math.max(...chartData.map(d => d.value))/100000).toFixed(2)} L</div>
                          <div>₹{(((Math.max(...chartData.map(d => d.value)) + Math.min(...chartData.map(d => d.value))) / 2)/100000).toFixed(2)} L</div>
                          <div>₹{(Math.min(...chartData.map(d => d.value))/100000).toFixed(2)} L</div>
                        </>
                      )}
                    </div>
                    
                    {/* X-axis labels */}
                    <div className="absolute bottom-0 inset-x-0 flex justify-between text-xs text-gray-500">
                      <div>Now</div>
                      <div>{Math.floor(timeframe / 4)} mo</div>
                      <div>{Math.floor(timeframe / 2)} mo</div>
                      <div>{Math.floor(timeframe * 3 / 4)} mo</div>
                      <div>{timeframe} mo</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Information in Expanded View */}
              {isExpanded && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="font-medium text-sm mb-3">Value Impact Factors</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Monthly Depreciation</div>
                      <div className="text-sm font-medium">₹{(selectedVehicle.monthlyDepreciation/1000).toFixed(1)}K</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Condition Impact</div>
                      <div className="text-sm font-medium">
                        {selectedVehicle.condition === 'excellent' ? '+15%' : 
                         selectedVehicle.condition === 'good' ? '+5%' : 
                         selectedVehicle.condition === 'fair' ? '-5%' : '-15%'}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Maintenance Effect</div>
                      <div className="text-sm font-medium">+₹{((maintenance / 12) * timeframe * 0.05 / 1000).toFixed(1)}K</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Market Adjustment</div>
                      <div className="text-sm font-medium">{selectedVehicle.year > 2020 ? '+2%' : '-3%'}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Value Optimization Tips</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-start">
                        <div className="mr-1.5 mt-0.5 text-emerald-500">•</div>
                        <span>Regular servicing can slow depreciation by up to 15%</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-1.5 mt-0.5 text-emerald-500">•</div>
                        <span>Keeping mileage under 10,000 km/year maintains higher value</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-1.5 mt-0.5 text-emerald-500">•</div>
                        <span>Maintaining original features & documenting repairs improves resale value</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ValueTrendPredictor;