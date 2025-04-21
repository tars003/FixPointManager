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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
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
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Calculator,
  TrendingUp,
  CreditCard,
  Timer,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Download,
  Printer,
  Share2,
  Save,
  Mail,
  FilePlus2,
} from 'lucide-react';

// Define the form schema
const tcoCalculatorSchema = z.object({
  acquisitionCost: z.coerce.number().positive({
    message: 'Acquisition cost must be a positive number',
  }),
  financingOption: z.enum(['cash', 'loan', 'lease']),
  downPayment: z.coerce.number().nonnegative().optional(),
  interestRate: z.coerce.number().nonnegative().optional(),
  loanTerm: z.coerce.number().positive().optional(),
  monthlyPayment: z.coerce.number().nonnegative().optional(),
  usefulLife: z.coerce.number().positive({
    message: 'Useful life must be a positive number',
  }),
  annualMileage: z.coerce.number().positive({
    message: 'Annual mileage must be a positive number',
  }),
  fuelConsumption: z.coerce.number().positive({
    message: 'Fuel consumption must be a positive number',
  }),
  fuelCostPerLiter: z.coerce.number().positive({
    message: 'Fuel cost must be a positive number',
  }),
  annualInsurance: z.coerce.number().nonnegative({
    message: 'Insurance cost must be zero or positive',
  }),
  annualRegistration: z.coerce.number().nonnegative({
    message: 'Registration cost must be zero or positive',
  }),
  annualMaintenance: z.coerce.number().nonnegative({
    message: 'Maintenance cost must be zero or positive',
  }),
  annualRepairs: z.coerce.number().nonnegative({
    message: 'Repair cost must be zero or positive',
  }),
  depreciationRate: z.coerce.number().min(0).max(100, {
    message: 'Depreciation rate must be between 0 and 100%',
  }),
  residualValue: z.coerce.number().nonnegative({
    message: 'Residual value must be zero or positive',
  }),
});

type TCOCalculatorFormValues = z.infer<typeof tcoCalculatorSchema>;

// Default form values
const defaultValues: Partial<TCOCalculatorFormValues> = {
  acquisitionCost: 1850000,
  financingOption: 'cash',
  usefulLife: 5,
  annualMileage: 25000,
  fuelConsumption: 12, // km/l
  fuelCostPerLiter: 100,
  annualInsurance: 45000,
  annualRegistration: 12000,
  annualMaintenance: 36000,
  annualRepairs: 24000,
  depreciationRate: 15,
  residualValue: 750000,
};

interface TCOCalculatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: 'light' | 'dark';
}

export function TCOCalculatorDialog({
  open,
  onOpenChange,
  theme,
}: TCOCalculatorDialogProps) {
  const [activeTab, setActiveTab] = useState<string>('input');
  const [calculationResults, setCalculationResults] = useState<any | null>(null);
  
  // Setup form with validation
  const form = useForm<TCOCalculatorFormValues>({
    resolver: zodResolver(tcoCalculatorSchema),
    defaultValues,
  });
  
  // Watch for financing option to show/hide related fields
  const financingOption = form.watch('financingOption');
  
  // Calculate TCO and other metrics
  const calculateTCO = (values: TCOCalculatorFormValues) => {
    // Get values from form
    const {
      acquisitionCost,
      financingOption,
      downPayment,
      interestRate,
      loanTerm,
      monthlyPayment,
      usefulLife,
      annualMileage,
      fuelConsumption,
      fuelCostPerLiter,
      annualInsurance,
      annualRegistration,
      annualMaintenance,
      annualRepairs,
      depreciationRate,
      residualValue,
    } = values;
    
    // Initial costs
    const initialCosts = { 
      value: acquisitionCost,
      name: 'Acquisition Cost'
    };
    
    // Calculate financing costs if applicable
    let totalFinancingCost = 0;
    let annualFinancingCost = 0;
    
    if (financingOption === 'loan' && downPayment !== undefined && interestRate !== undefined && loanTerm !== undefined) {
      const loanAmount = acquisitionCost - downPayment;
      const monthlyRate = interestRate / 100 / 12;
      const totalPayments = loanTerm * 12;
      const calculatedMonthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
      
      totalFinancingCost = calculatedMonthlyPayment * totalPayments - loanAmount;
      annualFinancingCost = (calculatedMonthlyPayment * 12) / usefulLife;
    } else if (financingOption === 'lease' && monthlyPayment !== undefined) {
      totalFinancingCost = monthlyPayment * 12 * usefulLife;
      annualFinancingCost = monthlyPayment * 12;
    }
    
    // Calculate total fuel costs
    const annualFuelCost = (annualMileage / fuelConsumption) * fuelCostPerLiter;
    const totalFuelCost = annualFuelCost * usefulLife;
    
    // Calculate total insurance, registration, maintenance and repair costs
    const totalInsuranceCost = annualInsurance * usefulLife;
    const totalRegistrationCost = annualRegistration * usefulLife;
    const totalMaintenanceCost = annualMaintenance * usefulLife;
    const totalRepairCost = annualRepairs * usefulLife;
    
    // Calculate depreciation
    const totalDepreciation = acquisitionCost - residualValue;
    const annualDepreciation = totalDepreciation / usefulLife;
    
    // Annual operating costs
    const annualOperatingCosts = annualFuelCost + annualInsurance + annualRegistration + annualMaintenance + annualRepairs;
    
    // Total Cost of Ownership
    const totalCostOfOwnership = (financingOption === 'cash' ? acquisitionCost : (downPayment || 0) + totalFinancingCost) + 
                                totalFuelCost + totalInsuranceCost + totalRegistrationCost + 
                                totalMaintenanceCost + totalRepairCost - residualValue;
    
    // Average annual cost
    const averageAnnualCost = totalCostOfOwnership / usefulLife;
    
    // Cost per kilometer
    const totalMileage = annualMileage * usefulLife;
    const costPerKilometer = totalCostOfOwnership / totalMileage;
    
    // Prepare annual cost breakdown data for charts
    const annualCosts = [
      {
        name: 'Depreciation',
        value: annualDepreciation,
        color: '#3B82F6', // blue
      },
      {
        name: 'Fuel',
        value: annualFuelCost,
        color: '#F59E0B', // amber
      },
      {
        name: 'Insurance',
        value: annualInsurance,
        color: '#10B981', // green
      },
      {
        name: 'Registration',
        value: annualRegistration,
        color: '#8B5CF6', // purple
      },
      {
        name: 'Maintenance',
        value: annualMaintenance,
        color: '#EC4899', // pink
      },
      {
        name: 'Repairs',
        value: annualRepairs,
        color: '#EF4444', // red
      }
    ];
    
    if (financingOption !== 'cash') {
      annualCosts.push({
        name: 'Financing',
        value: annualFinancingCost,
        color: '#6B7280', // gray
      });
    }
    
    // Sort costs from highest to lowest for better visualization
    annualCosts.sort((a, b) => b.value - a.value);
    
    // Calculate yearly depreciation for chart
    const depreciationData = [];
    let currentValue = acquisitionCost;
    
    for (let year = 0; year <= usefulLife; year++) {
      depreciationData.push({
        year,
        value: currentValue,
      });
      
      if (year < usefulLife) {
        // Apply yearly depreciation
        currentValue = currentValue * (1 - depreciationRate / 100);
      }
    }
    
    // Ensure final value matches residual value
    depreciationData[depreciationData.length - 1].value = residualValue;
    
    // Yearly cumulative cost data for chart
    const cumulativeCostData = [];
    let cumulativeCost = financingOption === 'cash' ? acquisitionCost : (downPayment || 0);
    
    for (let year = 0; year <= usefulLife; year++) {
      if (year === 0) {
        cumulativeCostData.push({
          year,
          cumulativeCost,
        });
      } else {
        // Add annual costs
        cumulativeCost += annualOperatingCosts;
        
        // Add financing costs if applicable
        if (financingOption !== 'cash') {
          cumulativeCost += annualFinancingCost;
        }
        
        cumulativeCostData.push({
          year,
          cumulativeCost,
        });
      }
    }
    
    // Subtract residual value from final year
    cumulativeCostData[cumulativeCostData.length - 1].cumulativeCost -= residualValue;
    
    // Return all calculated results
    return {
      totalCostOfOwnership,
      averageAnnualCost,
      costPerKilometer,
      annualOperatingCosts,
      totalOperatingCosts: annualOperatingCosts * usefulLife,
      annualDepreciation,
      totalDepreciation,
      annualFinancingCost,
      totalFinancingCost,
      annualFuelCost,
      totalFuelCost,
      totalInsuranceCost,
      totalRegistrationCost,
      totalMaintenanceCost,
      totalRepairCost,
      residualValue,
      totalMileage,
      usefulLife,
      annualCosts,
      depreciationData,
      cumulativeCostData,
    };
  };
  
  // Form submission handler
  const onSubmit = (values: TCOCalculatorFormValues) => {
    const results = calculateTCO(values);
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
            <BarChartIcon className="h-6 w-6 mr-2 text-amber-600" />
            TCO Calculator - Total Cost of Ownership Analysis
          </DialogTitle>
          <DialogDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
            Calculate the complete lifetime cost of owning and operating a vehicle.
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
                {/* Vehicle Acquisition Section */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-amber-50'}`}>
                  <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-amber-800'}`}>
                    Vehicle Acquisition
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="acquisitionCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Vehicle Purchase Price (₹)
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
                      name="financingOption"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Financing Option
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="cash" id="cash" />
                                <Label htmlFor="cash">Cash Purchase</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="loan" id="loan" />
                                <Label htmlFor="loan">Loan Financing</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="lease" id="lease" />
                                <Label htmlFor="lease">Lease</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {financingOption === 'loan' && (
                      <>
                        <FormField
                          control={form.control}
                          name="downPayment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                                Down Payment (₹)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter down payment"
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
                          name="interestRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                                Interest Rate (%)
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="loanTerm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                                Loan Term (Years)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter loan term"
                                  {...field}
                                  className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                    
                    {financingOption === 'lease' && (
                      <FormField
                        control={form.control}
                        name="monthlyPayment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                              Monthly Lease Payment (₹)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter monthly payment"
                                {...field}
                                className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
                
                {/* Usage Parameters Section */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-blue-800'}`}>
                    Usage Parameters
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="usefulLife"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Expected Useful Life (Years)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter useful life"
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
                      name="annualMileage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Annual Mileage (km)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter annual mileage"
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
                
                {/* Operating Costs Section */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-green-800'}`}>
                    Operating Costs
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fuelConsumption"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Fuel Consumption (km/L)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Enter fuel consumption"
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
                      name="fuelCostPerLiter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Fuel Cost per Liter (₹)
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
                    
                    <FormField
                      control={form.control}
                      name="annualInsurance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Annual Insurance Cost (₹)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter annual insurance cost"
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
                      name="annualRegistration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Annual Registration/Tax (₹)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter annual registration cost"
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
                      name="annualMaintenance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Annual Maintenance Cost (₹)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter annual maintenance cost"
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
                      name="annualRepairs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Annual Repairs Cost (₹)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter annual repairs cost"
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
                
                {/* Depreciation Section */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-purple-800'}`}>
                    Depreciation & Residual Value
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="depreciationRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Annual Depreciation Rate (%)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Enter depreciation rate"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                            Average annual depreciation percentage
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="residualValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Projected Residual Value (₹)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter residual value"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                            Estimated value at the end of useful life
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className={theme === 'light' ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate TCO
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="results" className="mt-4">
            {calculationResults && (
              <div className="space-y-6">
                {/* Summary Card */}
                <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader className="pb-2">
                    <CardTitle className={theme === 'dark' ? 'text-white' : ''}>TCO Summary</CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                      Key cost metrics over the vehicle's lifetime
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-amber-900/30 text-amber-100' : 'bg-amber-50 text-amber-800'}`}>
                        <div className="text-sm font-medium mb-1">Total Cost of Ownership</div>
                        <div className="text-2xl font-bold">
                          {formatCurrency(calculationResults.totalCostOfOwnership)}
                        </div>
                        <div className="text-xs mt-1 opacity-80">Over {calculationResults.usefulLife} years</div>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-900/30 text-blue-100' : 'bg-blue-50 text-blue-800'}`}>
                        <div className="text-sm font-medium mb-1">Average Annual Cost</div>
                        <div className="text-2xl font-bold">
                          {formatCurrency(calculationResults.averageAnnualCost)}
                        </div>
                        <div className="text-xs mt-1 opacity-80">Per year</div>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-green-900/30 text-green-100' : 'bg-green-50 text-green-800'}`}>
                        <div className="text-sm font-medium mb-1">Cost per Kilometer</div>
                        <div className="text-2xl font-bold">
                          ₹{calculationResults.costPerKilometer.toFixed(2)}
                        </div>
                        <div className="text-xs mt-1 opacity-80">Based on {calculationResults.totalMileage.toLocaleString()} km lifetime</div>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-purple-900/30 text-purple-100' : 'bg-purple-50 text-purple-800'}`}>
                        <div className="text-sm font-medium mb-1">Residual Value</div>
                        <div className="text-2xl font-bold">
                          {formatCurrency(calculationResults.residualValue)}
                        </div>
                        <div className="text-xs mt-1 opacity-80">After {calculationResults.usefulLife} years</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Cost Breakdown Chart */}
                <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader className="pb-2">
                    <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Annual Cost Breakdown</CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                      Distribution of annual vehicle ownership costs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={calculationResults.annualCosts}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                          <XAxis 
                            type="number"
                            tickFormatter={(value) => formatCurrency(value)}
                            stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} 
                          />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            width={90}
                            stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} 
                          />
                          <Tooltip 
                            formatter={(value) => formatCurrency(Number(value))}
                            contentStyle={{ 
                              backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                              borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
                              color: theme === 'dark' ? '#F9FAFB' : '#111827'
                            }}
                          />
                          <Legend />
                          <Bar 
                            dataKey="value" 
                            name="Annual Cost" 
                            radius={[0, 4, 4, 0]}
                          >
                            {calculationResults.annualCosts.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Depreciation & Cumulative Cost Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                    <CardHeader className="pb-2">
                      <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Depreciation Curve</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={calculationResults.depreciationData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                            <XAxis 
                              dataKey="year" 
                              label={{ value: 'Year', position: 'insideBottomRight', offset: -10 }}
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
                              labelFormatter={(label) => `Year ${label}`}
                              contentStyle={{ 
                                backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                                borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
                                color: theme === 'dark' ? '#F9FAFB' : '#111827'
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              name="Vehicle Value" 
                              stroke="#3B82F6" 
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }} 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                    <CardHeader className="pb-2">
                      <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Cumulative Cost</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={calculationResults.cumulativeCostData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                            <XAxis 
                              dataKey="year" 
                              label={{ value: 'Year', position: 'insideBottomRight', offset: -10 }}
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
                              labelFormatter={(label) => `Year ${label}`}
                              contentStyle={{ 
                                backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                                borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
                                color: theme === 'dark' ? '#F9FAFB' : '#111827'
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="cumulativeCost" 
                              name="Cumulative Cost" 
                              stroke="#F59E0B" 
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }} 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Detailed Cost Table */}
                <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader className="pb-2">
                    <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Detailed Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`rounded-lg overflow-hidden ${theme === 'dark' ? 'border-gray-700' : 'border'}`}>
                      <table className="w-full border-collapse">
                        <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium">Cost Category</th>
                            <th className="px-4 py-3 text-right text-sm font-medium">Annual Cost</th>
                            <th className="px-4 py-3 text-right text-sm font-medium">Lifetime Cost</th>
                            <th className="px-4 py-3 text-right text-sm font-medium">% of Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          <tr className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                            <td className="px-4 py-3 text-sm">Depreciation</td>
                            <td className="px-4 py-3 text-sm text-right">{formatCurrency(calculationResults.annualDepreciation)}</td>
                            <td className="px-4 py-3 text-sm text-right">{formatCurrency(calculationResults.totalDepreciation)}</td>
                            <td className="px-4 py-3 text-sm text-right">
                              {((calculationResults.totalDepreciation / calculationResults.totalCostOfOwnership) * 100).toFixed(1)}%
                            </td>
                          </tr>
                          
                          {financingOption !== 'cash' && (
                            <tr className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                              <td className="px-4 py-3 text-sm">Financing</td>
                              <td className="px-4 py-3 text-sm text-right">{formatCurrency(calculationResults.annualFinancingCost)}</td>
                              <td className="px-4 py-3 text-sm text-right">{formatCurrency(calculationResults.totalFinancingCost)}</td>
                              <td className="px-4 py-3 text-sm text-right">
                                {((calculationResults.totalFinancingCost / calculationResults.totalCostOfOwnership) * 100).toFixed(1)}%
                              </td>
                            </tr>
                          )}
                          
                          <tr className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                            <td className="px-4 py-3 text-sm">Fuel</td>
                            <td className="px-4 py-3 text-sm text-right">{formatCurrency(calculationResults.annualFuelCost)}</td>
                            <td className="px-4 py-3 text-sm text-right">{formatCurrency(calculationResults.totalFuelCost)}</td>
                            <td className="px-4 py-3 text-sm text-right">
                              {((calculationResults.totalFuelCost / calculationResults.totalCostOfOwnership) * 100).toFixed(1)}%
                            </td>
                          </tr>
                          
                          <tr className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                            <td className="px-4 py-3 text-sm">Insurance</td>
                            <td className="px-4 py-3 text-sm text-right">{formatCurrency(calculationResults.annualInsurance)}</td>
                            <td className="px-4 py-3 text-sm text-right">{formatCurrency(calculationResults.totalInsuranceCost)}</td>
                            <td className="px-4 py-3 text-sm text-right">
                              {((calculationResults.totalInsuranceCost / calculationResults.totalCostOfOwnership) * 100).toFixed(1)}%
                            </td>
                          </tr>
                          
                          <tr className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                            <td className="px-4 py-3 text-sm">Registration & Taxes</td>
                            <td className="px-4 py-3 text-sm text-right">{formatCurrency(calculationResults.annualRegistration)}</td>
                            <td className="px-4 py-3 text-sm text-right">{formatCurrency(calculationResults.totalRegistrationCost)}</td>
                            <td className="px-4 py-3 text-sm text-right">
                              {((calculationResults.totalRegistrationCost / calculationResults.totalCostOfOwnership) * 100).toFixed(1)}%
                            </td>
                          </tr>
                          
                          <tr className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                            <td className="px-4 py-3 text-sm">Maintenance</td>
                            <td className="px-4 py-3 text-sm text-right">{formatCurrency(calculationResults.annualMaintenance)}</td>
                            <td className="px-4 py-3 text-sm text-right">{formatCurrency(calculationResults.totalMaintenanceCost)}</td>
                            <td className="px-4 py-3 text-sm text-right">
                              {((calculationResults.totalMaintenanceCost / calculationResults.totalCostOfOwnership) * 100).toFixed(1)}%
                            </td>
                          </tr>
                          
                          <tr className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                            <td className="px-4 py-3 text-sm">Repairs</td>
                            <td className="px-4 py-3 text-sm text-right">{formatCurrency(calculationResults.annualRepairs)}</td>
                            <td className="px-4 py-3 text-sm text-right">{formatCurrency(calculationResults.totalRepairCost)}</td>
                            <td className="px-4 py-3 text-sm text-right">
                              {((calculationResults.totalRepairCost / calculationResults.totalCostOfOwnership) * 100).toFixed(1)}%
                            </td>
                          </tr>
                          
                          <tr className={theme === 'dark' ? 'bg-gray-800 font-medium' : 'bg-gray-50 font-medium'}>
                            <td className="px-4 py-3 text-sm">Total Cost of Ownership</td>
                            <td className="px-4 py-3 text-sm text-right">{formatCurrency(calculationResults.averageAnnualCost)}</td>
                            <td className="px-4 py-3 text-sm text-right">{formatCurrency(calculationResults.totalCostOfOwnership)}</td>
                            <td className="px-4 py-3 text-sm text-right">100%</td>
                          </tr>
                        </tbody>
                      </table>
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
                    className={theme === 'light' ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}
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
              Results are for estimation purposes only. Actual costs may vary based on market conditions and vehicle usage.
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