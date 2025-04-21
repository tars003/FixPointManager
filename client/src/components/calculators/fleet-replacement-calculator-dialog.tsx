import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
} from 'recharts';
import {
  Calculator,
  TimerReset,
  Download,
  Save,
  Mail,
  FilePlus2,
  Clock,
  CalendarClock,
  TrendingDown,
  Wrench,
  ArrowDownUp,
  Truck,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

// Define the form schema
const fleetReplacementSchema = z.object({
  currentVehicleAge: z.coerce.number().nonnegative({
    message: 'Current age must be zero or positive',
  }),
  purchasePrice: z.coerce.number().positive({
    message: 'Purchase price must be a positive number',
  }),
  salvageValuePercentage: z.coerce.number().min(0).max(100, {
    message: 'Salvage value percentage must be between 0 and 100',
  }),
  interestRate: z.coerce.number().nonnegative({
    message: 'Interest rate must be zero or positive',
  }),
  annualUsage: z.coerce.number().positive({
    message: 'Annual usage must be a positive number',
  }),
  maintenanceCostBase: z.coerce.number().nonnegative({
    message: 'Base maintenance cost must be zero or positive',
  }),
  maintenanceIncreaseRate: z.coerce.number().nonnegative({
    message: 'Maintenance increase rate must be zero or positive',
  }),
  downtime: z.coerce.number().nonnegative({
    message: 'Downtime must be zero or positive',
  }),
  downtimeIncreaseRate: z.coerce.number().nonnegative({
    message: 'Downtime increase rate must be zero or positive',
  }),
  costPerDowntimeHour: z.coerce.number().nonnegative({
    message: 'Cost per downtime hour must be zero or positive',
  }),
  fuelEfficiencyNew: z.coerce.number().positive({
    message: 'Fuel efficiency must be a positive number',
  }),
  fuelEfficiencyDegradationRate: z.coerce.number().nonnegative({
    message: 'Fuel efficiency degradation rate must be zero or positive',
  }),
  fuelCostPerLiter: z.coerce.number().positive({
    message: 'Fuel cost must be a positive number',
  }),
  replacementVehicleCost: z.coerce.number().positive({
    message: 'Replacement vehicle cost must be a positive number',
  }),
  replacementVehicleEfficiency: z.coerce.number().positive({
    message: 'Replacement vehicle efficiency must be a positive number',
  }),
});

type FleetReplacementFormValues = z.infer<typeof fleetReplacementSchema>;

// Default form values
const defaultValues: Partial<FleetReplacementFormValues> = {
  currentVehicleAge: 3,
  purchasePrice: 1850000,
  salvageValuePercentage: 35,
  interestRate: 10,
  annualUsage: 40000,
  maintenanceCostBase: 30000,
  maintenanceIncreaseRate: 15,
  downtime: 3,
  downtimeIncreaseRate: 20,
  costPerDowntimeHour: 5000,
  fuelEfficiencyNew: 12,
  fuelEfficiencyDegradationRate: 3,
  fuelCostPerLiter: 100,
  replacementVehicleCost: 2100000,
  replacementVehicleEfficiency: 14,
};

interface FleetReplacementCalculatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: 'light' | 'dark';
}

export function FleetReplacementCalculatorDialog({
  open,
  onOpenChange,
  theme,
}: FleetReplacementCalculatorDialogProps) {
  const [activeTab, setActiveTab] = useState<string>('input');
  const [calculationResults, setCalculationResults] = useState<any | null>(null);
  
  // Setup form with validation
  const form = useForm<FleetReplacementFormValues>({
    resolver: zodResolver(fleetReplacementSchema),
    defaultValues,
  });
  
  // Calculate fleet replacement metrics
  const calculateFleetReplacement = (values: FleetReplacementFormValues) => {
    const {
      currentVehicleAge,
      purchasePrice,
      salvageValuePercentage,
      interestRate,
      annualUsage,
      maintenanceCostBase,
      maintenanceIncreaseRate,
      downtime,
      downtimeIncreaseRate,
      costPerDowntimeHour,
      fuelEfficiencyNew,
      fuelEfficiencyDegradationRate,
      fuelCostPerLiter,
      replacementVehicleCost,
      replacementVehicleEfficiency,
    } = values;
    
    // Calculate for 15 years to ensure we capture the optimal replacement point
    const maxYears = 15;
    const analysisYears = currentVehicleAge + maxYears;
    
    // Calculate yearly metrics for current vehicle
    const yearlyMetrics = [];
    let cumulativeCost = purchasePrice;
    
    for (let year = 0; year <= analysisYears; year++) {
      const actualYear = year;
      const vehicleAge = actualYear;
      
      // Skip years before current age
      if (vehicleAge < currentVehicleAge) {
        continue;
      }
      
      // Calculate salvage value (decreases over time)
      const salvageValue = purchasePrice * (salvageValuePercentage / 100) * Math.pow(0.9, vehicleAge);
      
      // Calculate maintenance cost (increases with age)
      const maintenanceCost = maintenanceCostBase * Math.pow(1 + maintenanceIncreaseRate / 100, vehicleAge - currentVehicleAge);
      
      // Calculate downtime hours (increases with age)
      const downtimeHours = downtime * Math.pow(1 + downtimeIncreaseRate / 100, vehicleAge - currentVehicleAge);
      const downtimeCost = downtimeHours * costPerDowntimeHour;
      
      // Calculate fuel efficiency (decreases with age)
      const fuelEfficiency = fuelEfficiencyNew * Math.pow(1 - fuelEfficiencyDegradationRate / 100, vehicleAge);
      const fuelConsumption = annualUsage / fuelEfficiency;
      const fuelCost = fuelConsumption * fuelCostPerLiter;
      
      // Calculate ownership cost
      const depreciationCost = (vehicleAge === currentVehicleAge) ? (purchasePrice - salvageValue) / (vehicleAge + 1) : (purchasePrice - salvageValue) / vehicleAge;
      const opportunityCost = purchasePrice * (interestRate / 100);
      
      // Calculate total annual cost
      const annualCost = maintenanceCost + downtimeCost + fuelCost + depreciationCost + opportunityCost;
      
      // Calculate cumulative cost
      cumulativeCost += (vehicleAge > currentVehicleAge) ? 
        (maintenanceCost + downtimeCost + fuelCost + opportunityCost) : 0;
      
      // Calculate equivalent annual cost
      const equivalentAnnualCost = (cumulativeCost - salvageValue) / vehicleAge;
      
      // Add data to yearly metrics
      yearlyMetrics.push({
        year: actualYear,
        vehicleAge,
        maintenanceCost,
        downtimeHours,
        downtimeCost,
        fuelEfficiency,
        fuelCost,
        depreciationCost,
        opportunityCost,
        salvageValue,
        annualCost,
        cumulativeCost,
        equivalentAnnualCost,
      });
    }
    
    // Calculate replacement metrics
    const replacementMetrics = [];
    
    for (let replacementYear = currentVehicleAge; replacementYear <= currentVehicleAge + 10; replacementYear++) {
      // Calculate costs until replacement
      const costUntilReplacement = yearlyMetrics.find(m => m.vehicleAge === replacementYear)?.cumulativeCost || 0;
      
      // Calculate salvage value at replacement
      const salvageValueAtReplacement = yearlyMetrics.find(m => m.vehicleAge === replacementYear)?.salvageValue || 0;
      
      // Net cost until replacement
      const netCostUntilReplacement = costUntilReplacement - salvageValueAtReplacement;
      
      // Calculate annual cost for replacement vehicle for 5 years
      const replacementAnnualCosts = [];
      let replacementTotalCost = replacementVehicleCost;
      const usefulLife = 5; // Assume a 5 year useful life for comparison
      
      for (let year = 0; year < usefulLife; year++) {
        // Calculate salvage value
        const replacementSalvageValue = replacementVehicleCost * (salvageValuePercentage / 100) * Math.pow(0.9, year);
        
        // Calculate maintenance (starts lower than current vehicle)
        const replacementMaintenance = maintenanceCostBase * 0.7 * Math.pow(1 + maintenanceIncreaseRate / 100, year);
        
        // Calculate downtime (starts lower than current vehicle)
        const replacementDowntime = downtime * 0.5 * Math.pow(1 + downtimeIncreaseRate / 100, year);
        const replacementDowntimeCost = replacementDowntime * costPerDowntimeHour;
        
        // Calculate fuel cost with improved efficiency
        const replacementFuelConsumption = annualUsage / replacementVehicleEfficiency;
        const replacementFuelCost = replacementFuelConsumption * fuelCostPerLiter;
        
        // Calculate ownership costs
        const replacementDepreciation = (replacementVehicleCost - replacementSalvageValue) / usefulLife;
        const replacementOpportunityCost = replacementVehicleCost * (interestRate / 100);
        
        // Annual cost for replacement
        const replacementAnnualCost = replacementMaintenance + replacementDowntimeCost + 
                                    replacementFuelCost + replacementDepreciation + replacementOpportunityCost;
        
        replacementTotalCost += (year > 0) ? 
          (replacementMaintenance + replacementDowntimeCost + replacementFuelCost + replacementOpportunityCost) : 0;
        
        replacementAnnualCosts.push(replacementAnnualCost);
      }
      
      // Calculate average annual cost for replacement vehicle
      const replacementAverageCost = replacementAnnualCosts.reduce((a, b) => a + b, 0) / usefulLife;
      
      // Calculate equivalent annual cost for the replacement strategy
      const totalReplacementLifeCost = netCostUntilReplacement + (replacementAverageCost * usefulLife);
      const equivalentAnnualCostWithReplacement = totalReplacementLifeCost / (replacementYear - currentVehicleAge + usefulLife);
      
      // Calculate current vehicle equivalent annual cost up to this point
      const currentVehicleEAC = yearlyMetrics.find(m => m.vehicleAge === replacementYear)?.equivalentAnnualCost || 0;
      
      // Add data to replacement metrics
      replacementMetrics.push({
        replacementYear,
        costUntilReplacement,
        salvageValueAtReplacement,
        netCostUntilReplacement,
        replacementTotalCost: replacementVehicleCost,
        replacementAverageCost,
        equivalentAnnualCostWithReplacement,
        currentVehicleEAC,
        difference: currentVehicleEAC - equivalentAnnualCostWithReplacement,
        economicAdvantage: currentVehicleEAC > equivalentAnnualCostWithReplacement,
      });
    }
    
    // Find the optimal replacement year
    const optimalReplacement = [...replacementMetrics]
      .filter(m => m.economicAdvantage)
      .sort((a, b) => b.difference - a.difference)[0];
    
    // If no optimal year found (all years are not economical), recommend the latest year
    const recommendedReplacementYear = optimalReplacement ? 
      optimalReplacement.replacementYear : 
      replacementMetrics[replacementMetrics.length - 1].replacementYear;
    
    // Calculate charts data
    
    // Annual cost comparison data
    const annualCostData = yearlyMetrics.map(metric => ({
      year: metric.year,
      Maintenance: metric.maintenanceCost,
      Downtime: metric.downtimeCost,
      Fuel: metric.fuelCost,
      Depreciation: metric.depreciationCost,
      'Opportunity Cost': metric.opportunityCost,
      Total: metric.annualCost,
    }));
    
    // Equivalent annual cost data
    const eacData = yearlyMetrics.map(metric => ({
      age: metric.vehicleAge,
      cost: metric.equivalentAnnualCost,
    }));
    
    // Replacement analysis data
    const replacementAnalysisData = replacementMetrics.map(metric => ({
      year: metric.replacementYear,
      'Keep Current': metric.currentVehicleEAC,
      'Replace': metric.equivalentAnnualCostWithReplacement,
    }));
    
    return {
      yearlyMetrics,
      replacementMetrics,
      optimalReplacement,
      recommendedReplacementYear,
      annualCostData,
      eacData,
      replacementAnalysisData,
      // Current input values for reference
      currentVehicleAge,
      replacementVehicleCost,
    };
  };
  
  // Form submission handler
  const onSubmit = (values: FleetReplacementFormValues) => {
    const results = calculateFleetReplacement(values);
    setCalculationResults(results);
    setActiveTab('results');
  };
  
  // Format currency 
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Generate PDF report (in a real app this would create an actual PDF)
  const generatePDF = () => {
    alert('PDF report would be generated here in a real application');
  };
  
  // Email results (in a real app this would send an actual email)
  const emailResults = () => {
    alert('Results would be emailed here in a real application');
  };
  
  // Export to spreadsheet (in a real app this would export to Excel/CSV)
  const exportToSpreadsheet = () => {
    alert('Data would be exported to spreadsheet here in a real application');
  };
  
  // Save calculation (in a real app this would save to database)
  const saveCalculation = () => {
    alert('Calculation would be saved here in a real application');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-6xl ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`text-xl font-bold flex items-center ${theme === 'dark' ? 'text-white' : ''}`}>
            <TimerReset className="h-6 w-6 mr-2 text-purple-600" />
            Fleet Replacement Optimizer
          </DialogTitle>
          <DialogDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
            Calculate the optimal time to replace vehicles in your fleet based on economic analysis.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid grid-cols-2 ${theme === 'dark' ? 'bg-gray-700' : ''}`}>
            <TabsTrigger value="input">Input Parameters</TabsTrigger>
            <TabsTrigger value="results" disabled={!calculationResults}>Results & Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-4 mt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Vehicle Information Section */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-purple-800'}`}>
                    Current Vehicle Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="currentVehicleAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Current Vehicle Age (Years)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter current age"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="purchasePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Original Purchase Price (₹)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter purchase price"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="salvageValuePercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Salvage Value Percentage (%)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Enter salvage value percentage"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                            Percentage of original price expected at end of useful life
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="interestRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Interest Rate / Opportunity Cost (%)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Enter interest rate"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                            Cost of capital or alternate investment opportunity
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="annualUsage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Annual Usage (km)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter annual usage"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Maintenance and Downtime Section */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-blue-800'}`}>
                    Maintenance & Downtime
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="maintenanceCostBase"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Current Annual Maintenance Cost (₹)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter maintenance cost"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="maintenanceIncreaseRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Maintenance Cost Increase Rate (%)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Enter rate"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                            Annual percentage increase in maintenance cost
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="downtime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Current Annual Downtime (Days)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Enter downtime days"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="downtimeIncreaseRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Downtime Increase Rate (%)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Enter rate"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                            Annual percentage increase in downtime
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="costPerDowntimeHour"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Cost Per Downtime Hour (₹)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter cost per hour"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                            Lost revenue or productivity per hour
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Fuel & Efficiency Section */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-green-800'}`}>
                    Fuel & Efficiency
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fuelEfficiencyNew"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Fuel Efficiency When New (km/L)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Enter efficiency"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="fuelEfficiencyDegradationRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Efficiency Degradation Rate (%)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Enter degradation rate"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                            Annual percentage decrease in fuel efficiency
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="fuelCostPerLiter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Fuel Cost Per Liter (₹)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Enter fuel cost"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Replacement Vehicle Section */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-amber-50'}`}>
                  <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-amber-800'}`}>
                    Replacement Vehicle
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="replacementVehicleCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Replacement Vehicle Cost (₹)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter replacement cost"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="replacementVehicleEfficiency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Replacement Vehicle Efficiency (km/L)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Enter efficiency"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className={theme === 'light' ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''}
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Optimal Replacement
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="results" className="mt-4">
            {calculationResults && (
              <div className="space-y-6">
                {/* Recommendation Card */}
                <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''} ${theme === 'dark' ? 'border-l-8 border-l-purple-600' : 'border-l-8 border-l-purple-500'}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className={theme === 'dark' ? 'text-white' : ''}>
                      Replacement Recommendation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-3">
                        <div className="flex flex-col h-full justify-center">
                          <p className="text-xl font-medium mb-2">
                            Optimal time to replace: <span className="text-2xl font-bold text-purple-500">
                              Year {calculationResults.recommendedReplacementYear}
                            </span>
                          </p>
                          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                            {calculationResults.recommendedReplacementYear === calculationResults.currentVehicleAge 
                              ? "Economic analysis suggests replacing the vehicle immediately."
                              : `Economic analysis suggests replacing the vehicle when it reaches ${calculationResults.recommendedReplacementYear} years of age, which is in ${calculationResults.recommendedReplacementYear - calculationResults.currentVehicleAge} years from now.`
                            }
                          </p>
                          {calculationResults.optimalReplacement && (
                            <p className="mt-2">
                              This replacement timing would save approximately{' '}
                              <span className="font-semibold text-purple-500">
                                {formatCurrency(calculationResults.optimalReplacement.difference)} per year
                              </span>{' '}
                              compared to keeping the current vehicle.
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className={`p-8 rounded-full ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-100'}`}>
                          <TimerReset className={`h-16 w-16 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Replacement Analysis Chart */}
                <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader className="pb-2">
                    <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Replacement Analysis</CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                      Equivalent Annual Cost comparison between keeping and replacing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={calculationResults.replacementAnalysisData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                          <XAxis 
                            dataKey="year" 
                            label={{ value: 'Replacement Year', position: 'insideBottomRight', offset: -10 }}
                            domain={['dataMin', 'dataMax']}
                            stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} 
                          />
                          <YAxis 
                            tickFormatter={(value) => new Intl.NumberFormat('en-IN', { 
                              style: 'currency', 
                              currency: 'INR',
                              notation: 'compact',
                              maximumFractionDigits: 1 
                            }).format(value)}
                            label={{ value: 'Equivalent Annual Cost (₹)', angle: -90, position: 'insideLeft' }}
                            stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} 
                          />
                          <Tooltip 
                            formatter={(value) => formatCurrency(Number(value))}
                            labelFormatter={(label) => `Replace in Year ${label}`}
                            contentStyle={{ 
                              backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                              borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
                              color: theme === 'dark' ? '#F9FAFB' : '#111827'
                            }}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="Keep Current" 
                            stroke="#EF4444" 
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#EF4444' }}
                            activeDot={{ r: 6 }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="Replace" 
                            stroke="#8B5CF6" 
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#8B5CF6' }}
                            activeDot={{ r: 6 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-4 bg-purple-100 bg-opacity-50 dark:bg-purple-900/20 rounded-lg">
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <strong>How to interpret:</strong> When the "Replace" line goes below the "Keep Current" line, 
                        it becomes more economical to replace the vehicle. The optimal replacement time is when the 
                        difference between these two lines is greatest, indicating maximum savings.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Annual Cost Breakdown */}
                <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader className="pb-2">
                    <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Annual Cost Breakdown</CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                      Cost structure changes over vehicle lifetime
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={calculationResults.annualCostData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          stackOffset="expand"
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                          <XAxis 
                            dataKey="year"
                            stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} 
                          />
                          <YAxis 
                            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                            stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} 
                          />
                          <Tooltip 
                            formatter={(value, name, props) => [
                              `${formatCurrency(Number(value))} (${(props.payload.Total ? (Number(value) / props.payload.Total * 100).toFixed(1) : 0)}%)`, 
                              name
                            ]}
                            contentStyle={{ 
                              backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                              borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
                              color: theme === 'dark' ? '#F9FAFB' : '#111827'
                            }}
                          />
                          <Legend />
                          <Area type="monotone" dataKey="Maintenance" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                          <Area type="monotone" dataKey="Downtime" stackId="1" stroke="#EF4444" fill="#EF4444" />
                          <Area type="monotone" dataKey="Fuel" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
                          <Area type="monotone" dataKey="Depreciation" stackId="1" stroke="#10B981" fill="#10B981" />
                          <Area type="monotone" dataKey="Opportunity Cost" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>
                        Significant Cost Factors
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="flex items-start space-x-2">
                          <div className="w-3 h-3 mt-1 rounded-full bg-blue-500 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-sm">Maintenance</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Increases with age</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-3 h-3 mt-1 rounded-full bg-red-500 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-sm">Downtime</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Lost productivity costs</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-3 h-3 mt-1 rounded-full bg-amber-500 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-sm">Fuel</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Decreasing efficiency</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-3 h-3 mt-1 rounded-full bg-green-500 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-sm">Depreciation</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Asset value loss</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-3 h-3 mt-1 rounded-full bg-purple-500 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-sm">Opportunity Cost</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Capital tied up in asset</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Equivalent Annual Cost Curve */}
                <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader className="pb-2">
                    <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Equivalent Annual Cost Curve</CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                      Shows when total ownership cost per year is at its minimum
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={calculationResults.eacData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                          <XAxis 
                            dataKey="age" 
                            label={{ value: 'Vehicle Age (Years)', position: 'insideBottomRight', offset: -10 }}
                            stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} 
                          />
                          <YAxis 
                            tickFormatter={(value) => new Intl.NumberFormat('en-IN', { 
                              style: 'currency', 
                              currency: 'INR',
                              notation: 'compact',
                              maximumFractionDigits: 1 
                            }).format(value)}
                            stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} 
                          />
                          <Tooltip 
                            formatter={(value) => formatCurrency(Number(value))}
                            labelFormatter={(label) => `Age: ${label} years`}
                            contentStyle={{ 
                              backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                              borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
                              color: theme === 'dark' ? '#F9FAFB' : '#111827'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="cost" 
                            name="Equivalent Annual Cost" 
                            stroke="#8B5CF6" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-4 bg-purple-100 bg-opacity-50 dark:bg-purple-900/20 rounded-lg">
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <strong>Equivalent Annual Cost (EAC):</strong> This metric spreads the total ownership costs 
                        over the vehicle's life, allowing comparisons between different ownership periods.
                        The upturn in this curve indicates when increasing costs (maintenance, downtime, fuel) 
                        outweigh the benefits of spreading the initial purchase cost over more years.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Detailed Analysis Table */}
                <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader className="pb-2">
                    <CardTitle className={theme === 'dark' ? 'text-white' : ''}>
                      Detailed Replacement Analysis
                    </CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                      Economic comparison for different replacement timings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className={theme === 'dark' ? 'border-gray-700' : ''}>
                          <TableHead className="text-center">Replace In Year</TableHead>
                          <TableHead className="text-right">Keep Current (₹/Year)</TableHead>
                          <TableHead className="text-right">Replace (₹/Year)</TableHead>
                          <TableHead className="text-right">Difference (₹/Year)</TableHead>
                          <TableHead className="text-center">Recommendation</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {calculationResults.replacementMetrics.map((metric) => (
                          <TableRow 
                            key={metric.replacementYear}
                            className={`${theme === 'dark' ? 'border-gray-700' : ''} ${metric.replacementYear === calculationResults.recommendedReplacementYear ? (theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50') : ''}`}
                          >
                            <TableCell className="text-center font-medium">
                              {metric.replacementYear}
                              {metric.replacementYear === calculationResults.recommendedReplacementYear && (
                                <span className="ml-2 text-purple-500">
                                  <CheckCircle2 className="inline h-4 w-4" />
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(metric.currentVehicleEAC)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(metric.equivalentAnnualCostWithReplacement)}
                            </TableCell>
                            <TableCell className={`text-right font-medium ${metric.economicAdvantage ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                              {metric.economicAdvantage ? '+' : ''}{formatCurrency(metric.difference)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge 
                                variant={metric.economicAdvantage ? "default" : "destructive"}
                                className={metric.economicAdvantage 
                                  ? (theme === 'dark' ? 'bg-green-600' : 'bg-green-500') 
                                  : (theme === 'dark' ? 'bg-red-600' : '')}
                              >
                                {metric.economicAdvantage ? 'Replace' : 'Keep'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                {/* Key Insights */}
                <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader className="pb-2">
                    <CardTitle className={theme === 'dark' ? 'text-white' : ''}>
                      Key Insights & Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} flex space-x-3`}>
                          <div className={`p-2 rounded-full h-fit ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                            <Wrench className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                          </div>
                          <div>
                            <h4 className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
                              Maintenance Cost Trend
                            </h4>
                            <p className="text-sm">
                              {calculationResults.yearlyMetrics[calculationResults.yearlyMetrics.length - 1].maintenanceCost > 
                               calculationResults.yearlyMetrics[0].maintenanceCost * 2
                                ? "Maintenance costs will more than double if kept too long. Consider this impact."
                                : "Maintenance costs show a moderate increase over time."}
                            </p>
                          </div>
                        </div>
                        
                        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} flex space-x-3`}>
                          <div className={`p-2 rounded-full h-fit ${theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-100'}`}>
                            <Fuel className={`h-5 w-5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} />
                          </div>
                          <div>
                            <h4 className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>
                              Fuel Efficiency
                            </h4>
                            <p className="text-sm">
                              {calculationResults.replacementVehicleEfficiency > calculationResults.yearlyMetrics[0].fuelEfficiency * 1.15
                                ? "The replacement vehicle offers >15% better fuel efficiency, providing significant operational savings."
                                : "Moderate fuel efficiency improvements with the replacement vehicle."}
                            </p>
                          </div>
                        </div>
                        
                        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} flex space-x-3`}>
                          <div className={`p-2 rounded-full h-fit ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'}`}>
                            <ArrowDownUp className={`h-5 w-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                          </div>
                          <div>
                            <h4 className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                              Cost Difference
                            </h4>
                            <p className="text-sm">
                              {calculationResults.optimalReplacement && calculationResults.optimalReplacement.difference > 0
                                ? `Potential ${formatCurrency(calculationResults.optimalReplacement.difference * 5)} savings over 5 years by replacing at the optimal time.`
                                : "Cost analysis shows marginal benefits for vehicle replacement."}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Additional Considerations
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li className="text-sm">
                            <span className="font-medium">Downtime Impact:</span> Vehicle downtime increases with age, affecting operational reliability.
                          </li>
                          <li className="text-sm">
                            <span className="font-medium">Technological Advancements:</span> Newer vehicles may offer improved safety, telematics, and fuel efficiency technologies.
                          </li>
                          <li className="text-sm">
                            <span className="font-medium">Market Conditions:</span> Current market conditions for vehicle purchases and interest rates should be factored in.
                          </li>
                          <li className="text-sm">
                            <span className="font-medium">Operational Needs:</span> Consider changing business requirements and how they might affect vehicle specifications.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Actions Toolbar */}
                <div className="flex flex-wrap gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generatePDF}
                    className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : ''}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download PDF
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={emailResults}
                    className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : ''}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email Results
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToSpreadsheet}
                    className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : ''}
                  >
                    <FilePlus2 className="h-4 w-4 mr-1" />
                    Export to Spreadsheet
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveCalculation}
                    className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : ''}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save Calculation
                  </Button>
                  
                  <Button
                    onClick={() => setActiveTab('input')}
                    className={theme === 'light' ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''}
                  >
                    <Calculator className="h-4 w-4 mr-1" />
                    Modify Inputs
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between items-center">
          <div>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              This calculator provides estimates based on your inputs. Actual costs and optimal replacement timing may vary.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : ''}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}