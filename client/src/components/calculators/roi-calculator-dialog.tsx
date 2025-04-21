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
const roiCalculatorSchema = z.object({
  vehiclePurchasePrice: z.coerce.number().positive({
    message: 'Purchase price must be a positive number',
  }),
  operationalCosts: z.coerce.number().positive({
    message: 'Operational costs must be a positive number',
  }),
  projectedRevenue: z.coerce.number().positive({
    message: 'Projected revenue must be a positive number',
  }),
  useFinancing: z.boolean().default(false),
  downPayment: z.coerce.number().nonnegative().optional(),
  interestRate: z.coerce.number().nonnegative().optional(),
  loanTerm: z.coerce.number().positive().optional(),
  usefulLife: z.coerce.number().positive({
    message: 'Useful life must be a positive number',
  }),
  residualValue: z.coerce.number().nonnegative({
    message: 'Residual value must be zero or positive',
  }),
  taxRate: z.coerce.number().nonnegative({
    message: 'Tax rate must be zero or positive',
  }),
  opportunityCostRate: z.coerce.number().nonnegative({
    message: 'Opportunity cost rate must be zero or positive',
  }),
});

type ROICalculatorFormValues = z.infer<typeof roiCalculatorSchema>;

// Default form values
const defaultValues: Partial<ROICalculatorFormValues> = {
  vehiclePurchasePrice: 1850000,
  operationalCosts: 350000,
  projectedRevenue: 720000,
  useFinancing: false,
  usefulLife: 5,
  residualValue: 750000,
  taxRate: 18,
  opportunityCostRate: 5,
};

interface ROICalculatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: 'light' | 'dark';
}

export function ROICalculatorDialog({
  open,
  onOpenChange,
  theme,
}: ROICalculatorDialogProps) {
  const [activeTab, setActiveTab] = useState<string>('input');
  const [calculationResults, setCalculationResults] = useState<any | null>(null);
  
  // Setup form with validation
  const form = useForm<ROICalculatorFormValues>({
    resolver: zodResolver(roiCalculatorSchema),
    defaultValues,
  });
  
  // Watch for financing option to show/hide related fields
  const useFinancing = form.watch('useFinancing');
  
  // Calculate ROI and other metrics
  const calculateROI = (values: ROICalculatorFormValues) => {
    // Get values from form
    const {
      vehiclePurchasePrice,
      operationalCosts,
      projectedRevenue,
      useFinancing,
      downPayment,
      interestRate,
      loanTerm,
      usefulLife,
      residualValue,
      taxRate,
      opportunityCostRate,
    } = values;
    
    // Initial investment calculation
    let initialInvestment = vehiclePurchasePrice;
    if (useFinancing && downPayment !== undefined) {
      initialInvestment = downPayment;
    }
    
    // Annual cash flows
    const annualRevenue = projectedRevenue;
    const annualCosts = operationalCosts;
    const annualProfit = annualRevenue - annualCosts;
    
    // Financing costs if applicable
    let annualFinancingCost = 0;
    if (useFinancing && downPayment !== undefined && interestRate !== undefined && loanTerm !== undefined) {
      const loanAmount = vehiclePurchasePrice - downPayment;
      const monthlyRate = interestRate / 100 / 12;
      const totalPayments = loanTerm * 12;
      const monthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
      annualFinancingCost = monthlyPayment * 12;
    }
    
    // Calculate net annual profit after financing
    const netAnnualProfit = annualProfit - annualFinancingCost;
    
    // Tax implications
    const taxSavings = (operationalCosts * taxRate) / 100;
    const profitAfterTax = netAnnualProfit - ((netAnnualProfit * taxRate) / 100) + taxSavings;
    
    // Calculate depreciation
    const totalDepreciation = vehiclePurchasePrice - residualValue;
    const annualDepreciation = totalDepreciation / usefulLife;
    
    // ROI calculation
    const totalProfit = (profitAfterTax * usefulLife) + residualValue - initialInvestment;
    const simpleROI = (totalProfit / initialInvestment) * 100;
    
    // Net Present Value calculation
    let npv = -initialInvestment;
    const discountRate = opportunityCostRate / 100;
    
    for (let year = 1; year <= usefulLife; year++) {
      npv += profitAfterTax / Math.pow(1 + discountRate, year);
    }
    // Add discounted residual value
    npv += residualValue / Math.pow(1 + discountRate, usefulLife);
    
    // Calculate Payback Period
    const annualCashFlow = profitAfterTax;
    const paybackPeriod = initialInvestment / annualCashFlow;
    
    // Calculate Profitability Index
    const presentValueOfCashFlows = npv + initialInvestment;
    const profitabilityIndex = presentValueOfCashFlows / initialInvestment;
    
    // Calculate cash flows for each year for charts
    const cashFlowData = [];
    let cumulativeCashFlow = -initialInvestment;
    
    for (let year = 1; year <= usefulLife; year++) {
      cumulativeCashFlow += profitAfterTax;
      cashFlowData.push({
        year,
        annualProfit: profitAfterTax,
        cumulativeCashFlow,
      });
    }
    
    // Add residual value to final year
    cashFlowData[cashFlowData.length - 1].cumulativeCashFlow += residualValue;
    
    // Prepare cost breakdown data for pie chart
    const costBreakdownData = [
      {
        name: 'Initial Investment',
        value: initialInvestment,
        color: '#3B82F6',
      },
      {
        name: 'Operational Costs',
        value: operationalCosts * usefulLife,
        color: '#10B981',
      }
    ];
    
    if (useFinancing) {
      costBreakdownData.push({
        name: 'Financing Costs',
        value: annualFinancingCost * usefulLife,
        color: '#EF4444',
      });
    }
    
    // Return all calculated results
    return {
      initialInvestment,
      annualRevenue,
      annualCosts,
      annualProfit,
      annualFinancingCost,
      netAnnualProfit,
      profitAfterTax,
      totalProfit,
      simpleROI,
      npv,
      paybackPeriod,
      profitabilityIndex,
      usefulLife,
      taxSavings,
      annualDepreciation,
      residualValue,
      cashFlowData,
      costBreakdownData,
    };
  };
  
  // Form submission handler
  const onSubmit = (values: ROICalculatorFormValues) => {
    const results = calculateROI(values);
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
            <Calculator className="h-6 w-6 mr-2 text-blue-600" />
            ROI Calculator - Vehicle Investment Analysis
          </DialogTitle>
          <DialogDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
            Calculate return on investment for vehicle purchases with detailed projections and analysis.
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
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-blue-800'}`}>
                    Investment Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="vehiclePurchasePrice"
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
                      name="useFinancing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 mt-1"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                              Use Financing Options
                            </FormLabel>
                            <FormDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                              Enable to calculate with loan financing
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {useFinancing && (
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
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-green-800'}`}>
                    Operational Projections
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="operationalCosts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Annual Operational Costs (₹)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter operational costs"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                            Include fuel, maintenance, insurance, etc.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="projectedRevenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Annual Projected Revenue (₹)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter projected revenue"
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
                
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-purple-800'}`}>
                    Lifecycle & Financial Factors
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="taxRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Tax Rate (%)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Enter tax rate"
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
                      name="opportunityCostRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Opportunity Cost Rate (%)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Enter opportunity cost rate"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                            Used for Net Present Value calculations
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
                    className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate ROI
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
                    <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Investment Summary</CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                      Key investment metrics and return analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-900/30 text-blue-100' : 'bg-blue-50 text-blue-800'}`}>
                        <div className="text-sm font-medium mb-1">Return on Investment</div>
                        <div className="text-2xl font-bold">
                          {calculationResults.simpleROI.toFixed(2)}%
                        </div>
                        <div className="text-xs mt-1 opacity-80">Over {calculationResults.usefulLife} years</div>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-green-900/30 text-green-100' : 'bg-green-50 text-green-800'}`}>
                        <div className="text-sm font-medium mb-1">Net Present Value</div>
                        <div className="text-2xl font-bold">
                          {formatCurrency(calculationResults.npv)}
                        </div>
                        <div className="text-xs mt-1 opacity-80">Discounted at {form.getValues().opportunityCostRate}%</div>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-purple-900/30 text-purple-100' : 'bg-purple-50 text-purple-800'}`}>
                        <div className="text-sm font-medium mb-1">Payback Period</div>
                        <div className="text-2xl font-bold">
                          {calculationResults.paybackPeriod.toFixed(1)} years
                        </div>
                        <div className="text-xs mt-1 opacity-80">Time to recoup investment</div>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-amber-900/30 text-amber-100' : 'bg-amber-50 text-amber-800'}`}>
                        <div className="text-sm font-medium mb-1">Profitability Index</div>
                        <div className="text-2xl font-bold">
                          {calculationResults.profitabilityIndex.toFixed(2)}
                        </div>
                        <div className="text-xs mt-1 opacity-80">Value per ₹ invested</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Cashflow Chart */}
                <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader className="pb-2">
                    <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Cash Flow Projection</CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                      Annual and cumulative cash flow over vehicle lifetime
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={calculationResults.cashFlowData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
                            formatter={(value) => [
                              formatCurrency(Number(value)), 
                              ""
                            ]}
                            labelFormatter={(label) => `Year ${label}`}
                            contentStyle={{ 
                              backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                              borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
                              color: theme === 'dark' ? '#F9FAFB' : '#111827'
                            }}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="annualProfit" 
                            name="Annual Profit" 
                            stroke="#10B981" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="cumulativeCashFlow" 
                            name="Cumulative Cash Flow" 
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
                
                {/* Financial Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                    <CardHeader className="pb-2">
                      <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Cost Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={calculationResults.costBreakdownData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              dataKey="value"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {calculationResults.costBreakdownData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => formatCurrency(Number(value))}
                              contentStyle={{ 
                                backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                                borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
                                color: theme === 'dark' ? '#F9FAFB' : '#111827'
                              }}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                    <CardHeader className="pb-2">
                      <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Financial Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <h4 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Initial Investment</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm">Purchase Price:</div>
                            <div className="text-sm font-medium text-right">{formatCurrency(form.getValues().vehiclePurchasePrice)}</div>
                            
                            {useFinancing && (
                              <>
                                <div className="text-sm">Down Payment:</div>
                                <div className="text-sm font-medium text-right">{formatCurrency(form.getValues().downPayment || 0)}</div>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <h4 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Annual Figures</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm">Revenue:</div>
                            <div className="text-sm font-medium text-right">{formatCurrency(calculationResults.annualRevenue)}</div>
                            
                            <div className="text-sm">Costs:</div>
                            <div className="text-sm font-medium text-right">{formatCurrency(calculationResults.annualCosts)}</div>
                            
                            {useFinancing && (
                              <>
                                <div className="text-sm">Financing Cost:</div>
                                <div className="text-sm font-medium text-right">{formatCurrency(calculationResults.annualFinancingCost)}</div>
                              </>
                            )}
                            
                            <div className="text-sm">Net Profit:</div>
                            <div className="text-sm font-medium text-right">{formatCurrency(calculationResults.netAnnualProfit)}</div>
                            
                            <div className="text-sm">Depreciation:</div>
                            <div className="text-sm font-medium text-right">{formatCurrency(calculationResults.annualDepreciation)}</div>
                            
                            <div className="text-sm">Tax Savings:</div>
                            <div className="text-sm font-medium text-right">{formatCurrency(calculationResults.taxSavings)}</div>
                            
                            <div className="text-sm font-medium">After-Tax Profit:</div>
                            <div className="text-sm font-medium text-right">{formatCurrency(calculationResults.profitAfterTax)}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
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
                    className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
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
              Results are for estimation purposes only. Consult a financial advisor for investment decisions.
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