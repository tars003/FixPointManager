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
import { Separator } from '@/components/ui/separator';
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
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import {
  Calculator,
  Scale,
  Download,
  Save,
  Mail,
  FilePlus2,
} from 'lucide-react';

// Define the form schema
const leaseVsBuySchema = z.object({
  vehicleCost: z.coerce.number().positive({
    message: 'Vehicle cost must be a positive number',
  }),
  leaseTermYears: z.coerce.number().positive({
    message: 'Lease term must be a positive number',
  }),
  downPaymentLease: z.coerce.number().nonnegative({
    message: 'Down payment must be zero or positive',
  }),
  monthlyLeaseCost: z.coerce.number().positive({
    message: 'Monthly lease cost must be a positive number',
  }),
  leaseEndPurchaseOption: z.coerce.number().nonnegative({
    message: 'Lease-end purchase option must be zero or positive',
  }),
  downPaymentLoan: z.coerce.number().nonnegative({
    message: 'Down payment must be zero or positive',
  }),
  loanTermYears: z.coerce.number().positive({
    message: 'Loan term must be a positive number',
  }),
  interestRate: z.coerce.number().nonnegative({
    message: 'Interest rate must be zero or positive',
  }),
  annualMileage: z.coerce.number().positive({
    message: 'Annual mileage must be a positive number',
  }),
  excessMileageFee: z.coerce.number().nonnegative({
    message: 'Excess mileage fee must be zero or positive',
  }),
  expectedAnnualMaintenance: z.coerce.number().nonnegative({
    message: 'Annual maintenance cost must be zero or positive',
  }),
  expectedResaleValue: z.coerce.number().nonnegative({
    message: 'Expected resale value must be zero or positive',
  }),
  taxRate: z.coerce.number().nonnegative({
    message: 'Tax rate must be zero or positive',
  }),
  annualInsurance: z.coerce.number().nonnegative({
    message: 'Annual insurance cost must be zero or positive',
  }),
  disposalTimeframe: z.coerce.number().positive({
    message: 'Disposal timeframe must be a positive number',
  }),
});

type LeaseVsBuyFormValues = z.infer<typeof leaseVsBuySchema>;

// Default form values
const defaultValues: Partial<LeaseVsBuyFormValues> = {
  vehicleCost: 1850000,
  leaseTermYears: 3,
  downPaymentLease: 200000,
  monthlyLeaseCost: 25000,
  leaseEndPurchaseOption: 800000,
  downPaymentLoan: 370000,
  loanTermYears: 5,
  interestRate: 8.5,
  annualMileage: 25000,
  excessMileageFee: 10,
  expectedAnnualMaintenance: 30000,
  expectedResaleValue: 900000,
  taxRate: 18,
  annualInsurance: 45000,
  disposalTimeframe: 5,
};

interface LeaseVsBuyCalculatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: 'light' | 'dark';
}

export function LeaseVsBuyCalculatorDialog({
  open,
  onOpenChange,
  theme,
}: LeaseVsBuyCalculatorDialogProps) {
  const [activeTab, setActiveTab] = useState<string>('input');
  const [calculationResults, setCalculationResults] = useState<any | null>(null);
  
  // Setup form with validation
  const form = useForm<LeaseVsBuyFormValues>({
    resolver: zodResolver(leaseVsBuySchema),
    defaultValues,
  });
  
  // Calculate lease vs buy analysis
  const calculateLeaseVsBuy = (values: LeaseVsBuyFormValues) => {
    const {
      vehicleCost,
      leaseTermYears,
      downPaymentLease,
      monthlyLeaseCost,
      leaseEndPurchaseOption,
      downPaymentLoan,
      loanTermYears,
      interestRate,
      annualMileage,
      excessMileageFee,
      expectedAnnualMaintenance,
      expectedResaleValue,
      taxRate,
      annualInsurance,
      disposalTimeframe,
    } = values;
    
    // Lease Calculations
    const totalLeaseMonths = leaseTermYears * 12;
    const totalLeaseCost = downPaymentLease + (monthlyLeaseCost * totalLeaseMonths);
    const leaseInsuranceCost = annualInsurance * leaseTermYears;
    const leaseTaxes = (monthlyLeaseCost * totalLeaseMonths * taxRate) / 100;
    const leaseMaintenance = expectedAnnualMaintenance * leaseTermYears;
    
    // Calculate potential excess mileage fee
    const leaseAllowedMileage = annualMileage * leaseTermYears;
    const excessMileageCost = Math.max(0, (annualMileage * disposalTimeframe - leaseAllowedMileage) * excessMileageFee);
    
    // Total cost for leasing during lease term
    const totalLeasingCost = totalLeaseCost + leaseInsuranceCost + leaseTaxes + leaseMaintenance;
    
    // If purchasing after lease
    const leaseAndPurchaseCost = totalLeasingCost + leaseEndPurchaseOption;
    const leaseResaleValue = expectedResaleValue * 0.8; // Assume 20% less than typical resale due to age
    const netLeaseAndPurchaseCost = leaseAndPurchaseCost - leaseResaleValue;
    
    // Buying Calculations
    // Calculate loan monthly payment
    const loanAmount = vehicleCost - downPaymentLoan;
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTermYears * 12;
    const monthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
    const totalLoanPayment = monthlyPayment * totalPayments;
    const totalFinancingCost = totalLoanPayment - loanAmount;
    
    // Calculate total buying costs
    const buyInsuranceCost = annualInsurance * disposalTimeframe;
    const buyMaintenance = expectedAnnualMaintenance * disposalTimeframe;
    const buyTaxes = (vehicleCost * taxRate) / 100;
    
    // Total cost for buying
    const totalBuyingCost = downPaymentLoan + totalLoanPayment + buyInsuranceCost + buyMaintenance + buyTaxes;
    const netBuyingCost = totalBuyingCost - expectedResaleValue;
    
    // Tax benefits (simplified)
    const leaseTaxBenefit = leaseTaxes * 0.3; // Assume 30% tax benefit on taxes paid
    const buyTaxBenefit = buyTaxes * 0.3; // Assume 30% tax benefit on taxes paid
    
    // Net costs after tax benefits
    const netLeasingCostAfterTax = totalLeasingCost - leaseTaxBenefit;
    const netLeaseAndPurchaseCostAfterTax = netLeaseAndPurchaseCost - leaseTaxBenefit;
    const netBuyingCostAfterTax = netBuyingCost - buyTaxBenefit;
    
    // Monthly costs
    const monthlyLeasingCost = netLeasingCostAfterTax / (leaseTermYears * 12);
    const monthlyBuyingCost = netBuyingCostAfterTax / (disposalTimeframe * 12);
    
    // Cash flow comparison data
    const cashFlowData = [];
    let leaseRunningCost = 0;
    let buyRunningCost = 0;
    
    // Initial costs (down payment)
    leaseRunningCost += downPaymentLease;
    buyRunningCost += downPaymentLoan;
    
    // Add data point for time 0 (initial payment)
    cashFlowData.push({
      month: 0,
      lease: leaseRunningCost,
      buy: buyRunningCost,
    });
    
    // Calculate monthly running costs
    for (let month = 1; month <= Math.max(totalLeaseMonths, disposalTimeframe * 12); month++) {
      // Lease costs
      if (month <= totalLeaseMonths) {
        leaseRunningCost += monthlyLeaseCost;
        leaseRunningCost += annualInsurance / 12;
        leaseRunningCost += expectedAnnualMaintenance / 12;
      } else if (month === totalLeaseMonths + 1 && leaseEndPurchaseOption > 0) {
        // If buying at lease end
        leaseRunningCost += leaseEndPurchaseOption;
      }
      
      // Buy costs
      if (month <= totalPayments) {
        buyRunningCost += monthlyPayment;
      }
      
      buyRunningCost += annualInsurance / 12;
      buyRunningCost += expectedAnnualMaintenance / 12;
      
      // Add data point every 6 months to keep chart size reasonable
      if (month % 6 === 0 || month === Math.max(totalLeaseMonths, disposalTimeframe * 12)) {
        cashFlowData.push({
          month,
          lease: leaseRunningCost,
          buy: buyRunningCost,
        });
      }
    }
    
    // Final values (considering resale)
    const finalLeaseValue = leaseEndPurchaseOption > 0 ? leaseRunningCost - leaseResaleValue : leaseRunningCost;
    const finalBuyValue = buyRunningCost - expectedResaleValue;
    
    cashFlowData.push({
      month: Math.max(totalLeaseMonths, disposalTimeframe * 12) + 1,
      lease: finalLeaseValue,
      buy: finalBuyValue,
    });
    
    // Radar chart comparative data
    const radarData = [
      {
        category: 'Initial Cash Outlay',
        lease: 100 - (downPaymentLease / vehicleCost) * 100,
        buy: 100 - (downPaymentLoan / vehicleCost) * 100,
      },
      {
        category: 'Monthly Cash Flow',
        lease: 100 - (monthlyLeasingCost / Math.max(monthlyLeasingCost, monthlyBuyingCost)) * 100,
        buy: 100 - (monthlyBuyingCost / Math.max(monthlyLeasingCost, monthlyBuyingCost)) * 100,
      },
      {
        category: 'Long-term Value',
        lease: 50, // Fixed value since leasing generally has less long-term value
        buy: 90,   // Ownership provides asset value
      },
      {
        category: 'Tax Benefits',
        lease: (leaseTaxBenefit / totalLeasingCost) * 100,
        buy: (buyTaxBenefit / totalBuyingCost) * 100,
      },
      {
        category: 'Flexibility',
        lease: 90, // Leasing offers more flexibility
        buy: 60,   // Less flexibility with ownership
      },
      {
        category: 'Maintenance Burden',
        lease: 80, // Many warranties included
        buy: 40,   // Full maintenance responsibility
      },
    ];
    
    // Cost breakdown for pie charts
    const leaseCostBreakdown = [
      { name: 'Down Payment', value: downPaymentLease, color: '#3B82F6' },  // blue
      { name: 'Monthly Payments', value: monthlyLeaseCost * totalLeaseMonths, color: '#10B981' },  // green
      { name: 'Insurance', value: leaseInsuranceCost, color: '#F59E0B' },  // amber
      { name: 'Taxes', value: leaseTaxes, color: '#8B5CF6' },  // purple
      { name: 'Maintenance', value: leaseMaintenance, color: '#EC4899' },  // pink
    ];
    
    const buyCostBreakdown = [
      { name: 'Down Payment', value: downPaymentLoan, color: '#3B82F6' },  // blue
      { name: 'Loan Payments', value: totalLoanPayment, color: '#10B981' },  // green
      { name: 'Insurance', value: buyInsuranceCost, color: '#F59E0B' },  // amber
      { name: 'Taxes', value: buyTaxes, color: '#8B5CF6' },  // purple
      { name: 'Maintenance', value: buyMaintenance, color: '#EC4899' },  // pink
    ];
    
    // Return all calculated results
    return {
      // Lease data
      totalLeaseCost,
      leaseInsuranceCost,
      leaseTaxes,
      leaseMaintenance,
      totalLeasingCost,
      leaseTaxBenefit,
      netLeasingCostAfterTax,
      monthlyLeasingCost,
      leaseEndPurchaseOption,
      leaseResaleValue,
      netLeaseAndPurchaseCost,
      netLeaseAndPurchaseCostAfterTax,
      
      // Buy data
      loanAmount,
      monthlyPayment,
      totalLoanPayment,
      totalFinancingCost,
      buyInsuranceCost,
      buyMaintenance,
      buyTaxes,
      totalBuyingCost,
      buyTaxBenefit,
      netBuyingCost,
      netBuyingCostAfterTax,
      monthlyBuyingCost,
      expectedResaleValue,
      
      // Comparison data
      cashFlowData,
      radarData,
      leaseCostBreakdown,
      buyCostBreakdown,
      
      // Parameters for charts and tables
      vehicleCost,
      leaseTermYears,
      loanTermYears,
      disposalTimeframe,
      
      // Recommendation
      recommendation: netBuyingCostAfterTax < netLeaseAndPurchaseCostAfterTax ? 'buy' : 'lease',
      savingsAmount: Math.abs(netBuyingCostAfterTax - netLeaseAndPurchaseCostAfterTax),
    };
  };
  
  // Form submission handler
  const onSubmit = (values: LeaseVsBuyFormValues) => {
    const results = calculateLeaseVsBuy(values);
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
            <Scale className="h-6 w-6 mr-2 text-green-600" />
            Lease vs. Buy Calculator
          </DialogTitle>
          <DialogDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
            Compare the financial implications of leasing versus buying a vehicle.
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
                {/* Common Parameters Section */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-blue-800'}`}>
                    Vehicle Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="vehicleCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Vehicle Cost (₹)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter vehicle cost"
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
                    
                    <FormField
                      control={form.control}
                      name="disposalTimeframe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Planned Ownership Period (Years)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter planned ownership period"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                            How long you plan to own/use the vehicle
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="expectedResaleValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Expected Resale Value (₹)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter expected resale value"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                            Estimated value after ownership period
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Lease Parameters Section */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-green-800'}`}>
                    Lease Parameters
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="leaseTermYears"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Lease Term (Years)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter lease term"
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
                      name="downPaymentLease"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Down Payment for Lease (₹)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter down payment for lease"
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
                      name="monthlyLeaseCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Monthly Lease Cost (₹)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter monthly lease cost"
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
                      name="leaseEndPurchaseOption"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Lease-End Purchase Option (₹)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter lease-end purchase price"
                              {...field}
                              className={theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white' : ''}
                            />
                          </FormControl>
                          <FormDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                            Cost to buy the vehicle at lease end
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="excessMileageFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Excess Mileage Fee (₹/km)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="Enter excess mileage fee"
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
                
                {/* Buy Parameters Section */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-purple-800'}`}>
                    Purchase Parameters
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="downPaymentLoan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                            Down Payment for Purchase (₹)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter down payment for purchase"
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
                      name="loanTermYears"
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
                  </div>
                </div>
                
                {/* Common Costs Section */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-amber-50'}`}>
                  <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-amber-800'}`}>
                    Other Costs
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="expectedAnnualMaintenance"
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
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className={theme === 'light' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Compare Options
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="results" className="mt-4">
            {calculationResults && (
              <div className="space-y-6">
                {/* Recommendation Card */}
                <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''} ${calculationResults.recommendation === 'lease' ? (theme === 'dark' ? 'border-l-8 border-l-green-600' : 'border-l-8 border-l-green-500') : (theme === 'dark' ? 'border-l-8 border-l-purple-600' : 'border-l-8 border-l-purple-500')}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className={theme === 'dark' ? 'text-white' : ''}>
                      Recommendation: {calculationResults.recommendation === 'lease' ? 'Leasing' : 'Buying'} is More Economical
                    </CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                      Based on your inputs, {calculationResults.recommendation === 'lease' ? 'leasing' : 'buying'} is the more cost-effective option over your planned period of {calculationResults.disposalTimeframe} years.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-opacity-10 p-4 rounded-lg border border-opacity-20 space-y-2 mt-2 shadow-sm">
                      <div className="text-lg font-medium">
                        Projected Savings: {formatCurrency(calculationResults.savingsAmount)}
                      </div>
                      <p className="text-sm opacity-80">
                        {calculationResults.recommendation === 'lease' 
                          ? `Leasing is projected to save you ${formatCurrency(calculationResults.savingsAmount)} compared to buying over ${calculationResults.disposalTimeframe} years.`
                          : `Buying is projected to save you ${formatCurrency(calculationResults.savingsAmount)} compared to leasing over ${calculationResults.disposalTimeframe} years.`
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                    <CardHeader className={`pb-2 ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'} rounded-t-lg`}>
                      <CardTitle className={`flex items-center ${theme === 'dark' ? 'text-green-400' : 'text-green-800'}`}>
                        <div className={`p-2 rounded-full mr-2 ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'}`}>
                          <Scale className={`h-4 w-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                        </div>
                        Lease Option
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm font-medium">Down Payment:</div>
                          <div className="text-sm text-right">{formatCurrency(calculationResults.downPaymentLease)}</div>
                          
                          <div className="text-sm font-medium">Monthly Payment:</div>
                          <div className="text-sm text-right">{formatCurrency(form.getValues().monthlyLeaseCost)}</div>
                          
                          <div className="text-sm font-medium">Total Lease Payments:</div>
                          <div className="text-sm text-right">{formatCurrency(calculationResults.totalLeaseCost)}</div>
                          
                          <div className="text-sm font-medium">Total Insurance:</div>
                          <div className="text-sm text-right">{formatCurrency(calculationResults.leaseInsuranceCost)}</div>
                          
                          <div className="text-sm font-medium">Total Maintenance:</div>
                          <div className="text-sm text-right">{formatCurrency(calculationResults.leaseMaintenance)}</div>
                          
                          <div className="text-sm font-medium">Taxes:</div>
                          <div className="text-sm text-right">{formatCurrency(calculationResults.leaseTaxes)}</div>
                          
                          <div className="text-sm font-medium">Tax Benefit:</div>
                          <div className="text-sm text-right">-{formatCurrency(calculationResults.leaseTaxBenefit)}</div>
                          
                          <Separator className="col-span-2 my-1" />
                          
                          <div className="text-sm font-medium">Total Cost:</div>
                          <div className="text-sm font-medium text-right">{formatCurrency(calculationResults.netLeasingCostAfterTax)}</div>
                          
                          <div className="text-sm">Monthly Average:</div>
                          <div className="text-sm text-right">{formatCurrency(calculationResults.monthlyLeasingCost)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                    <CardHeader className={`pb-2 ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50'} rounded-t-lg`}>
                      <CardTitle className={`flex items-center ${theme === 'dark' ? 'text-purple-400' : 'text-purple-800'}`}>
                        <div className={`p-2 rounded-full mr-2 ${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                          <Scale className={`h-4 w-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                        </div>
                        Buy Option
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm font-medium">Down Payment:</div>
                          <div className="text-sm text-right">{formatCurrency(calculationResults.downPaymentLoan)}</div>
                          
                          <div className="text-sm font-medium">Monthly Payment:</div>
                          <div className="text-sm text-right">{formatCurrency(calculationResults.monthlyPayment)}</div>
                          
                          <div className="text-sm font-medium">Total Loan Payments:</div>
                          <div className="text-sm text-right">{formatCurrency(calculationResults.totalLoanPayment)}</div>
                          
                          <div className="text-sm font-medium">Interest Paid:</div>
                          <div className="text-sm text-right">{formatCurrency(calculationResults.totalFinancingCost)}</div>
                          
                          <div className="text-sm font-medium">Total Insurance:</div>
                          <div className="text-sm text-right">{formatCurrency(calculationResults.buyInsuranceCost)}</div>
                          
                          <div className="text-sm font-medium">Total Maintenance:</div>
                          <div className="text-sm text-right">{formatCurrency(calculationResults.buyMaintenance)}</div>
                          
                          <div className="text-sm font-medium">Resale Value:</div>
                          <div className="text-sm text-right">-{formatCurrency(calculationResults.expectedResaleValue)}</div>
                          
                          <Separator className="col-span-2 my-1" />
                          
                          <div className="text-sm font-medium">Net Cost:</div>
                          <div className="text-sm font-medium text-right">{formatCurrency(calculationResults.netBuyingCostAfterTax)}</div>
                          
                          <div className="text-sm">Monthly Average:</div>
                          <div className="text-sm text-right">{formatCurrency(calculationResults.monthlyBuyingCost)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Cash Flow Chart */}
                <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader className="pb-2">
                    <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Cash Flow Comparison</CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                      Cumulative costs over time for both options
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={calculationResults.cashFlowData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                          <XAxis 
                            dataKey="month" 
                            label={{ value: 'Month', position: 'insideBottomRight', offset: -10 }}
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
                            labelFormatter={(label) => `Month ${label}`}
                            contentStyle={{ 
                              backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                              borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
                              color: theme === 'dark' ? '#F9FAFB' : '#111827'
                            }}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="lease" 
                            name="Lease Option" 
                            stroke="#10B981" 
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 6 }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="buy" 
                            name="Buy Option" 
                            stroke="#8B5CF6" 
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 6 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Cost Breakdown and Comparison Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cost Breakdown Pie Charts */}
                  <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                    <CardHeader className="pb-2">
                      <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Cost Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className={`text-center mb-2 font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>Lease Costs</p>
                          <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={calculationResults.leaseCostBreakdown}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={25}
                                  outerRadius={70}
                                  dataKey="value"
                                  paddingAngle={2}
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                  labelLine={false}
                                >
                                  {calculationResults.leaseCostBreakdown.map((entry: any, index: number) => (
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
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        <div>
                          <p className={`text-center mb-2 font-medium ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>Buy Costs</p>
                          <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={calculationResults.buyCostBreakdown}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={25}
                                  outerRadius={70}
                                  dataKey="value"
                                  paddingAngle={2}
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                  labelLine={false}
                                >
                                  {calculationResults.buyCostBreakdown.map((entry: any, index: number) => (
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
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Factor Comparison Radar Chart */}
                  <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                    <CardHeader className="pb-2">
                      <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Factor Comparison</CardTitle>
                      <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                        Comparative analysis of various factors (higher is better)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart 
                            cx="50%" 
                            cy="50%" 
                            outerRadius="80%" 
                            data={calculationResults.radarData}
                          >
                            <PolarGrid stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                            <PolarAngleAxis 
                              dataKey="category" 
                              tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                              style={{ fontSize: '11px' }}
                            />
                            <PolarRadiusAxis 
                              angle={30} 
                              domain={[0, 100]} 
                              tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#6B7280' }}
                            />
                            <Radar 
                              name="Lease" 
                              dataKey="lease" 
                              stroke="#10B981" 
                              fill="#10B981" 
                              fillOpacity={0.2} 
                            />
                            <Radar 
                              name="Buy" 
                              dataKey="buy" 
                              stroke="#8B5CF6" 
                              fill="#8B5CF6" 
                              fillOpacity={0.2} 
                            />
                            <Legend />
                            <Tooltip contentStyle={{ 
                              backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                              borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
                              color: theme === 'dark' ? '#F9FAFB' : '#111827'
                            }}/>
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Considerations Table */}
                <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
                  <CardHeader className="pb-2">
                    <CardTitle className={theme === 'dark' ? 'text-white' : ''}>Additional Considerations</CardTitle>
                    <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                      Beyond the numbers: Other factors to consider
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`rounded-lg overflow-hidden ${theme === 'dark' ? 'border-gray-700' : 'border'}`}>
                      <table className="w-full border-collapse">
                        <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium">Factor</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Lease</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Buy</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          <tr className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                            <td className="px-4 py-3 text-sm font-medium">Ownership</td>
                            <td className="px-4 py-3 text-sm">No ownership (unless buyout option exercised)</td>
                            <td className="px-4 py-3 text-sm">Full ownership</td>
                          </tr>
                          
                          <tr className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                            <td className="px-4 py-3 text-sm font-medium">Mileage Restrictions</td>
                            <td className="px-4 py-3 text-sm">Limited to contract terms, excess fees apply</td>
                            <td className="px-4 py-3 text-sm">No restrictions</td>
                          </tr>
                          
                          <tr className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                            <td className="px-4 py-3 text-sm font-medium">Vehicle Modifications</td>
                            <td className="px-4 py-3 text-sm">Generally not permitted</td>
                            <td className="px-4 py-3 text-sm">Full freedom to modify</td>
                          </tr>
                          
                          <tr className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                            <td className="px-4 py-3 text-sm font-medium">Technology Upgrade</td>
                            <td className="px-4 py-3 text-sm">Easy to upgrade to newer vehicles</td>
                            <td className="px-4 py-3 text-sm">Requires selling or trading in</td>
                          </tr>
                          
                          <tr className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                            <td className="px-4 py-3 text-sm font-medium">Warranty Coverage</td>
                            <td className="px-4 py-3 text-sm">Usually covered by warranty for entire lease</td>
                            <td className="px-4 py-3 text-sm">Limited to manufacturer warranty period</td>
                          </tr>
                          
                          <tr className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                            <td className="px-4 py-3 text-sm font-medium">Long-term Asset</td>
                            <td className="px-4 py-3 text-sm">No long-term asset</td>
                            <td className="px-4 py-3 text-sm">Vehicle remains an asset on balance sheet</td>
                          </tr>
                          
                          <tr className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                            <td className="px-4 py-3 text-sm font-medium">Exit Flexibility</td>
                            <td className="px-4 py-3 text-sm">Early termination usually expensive</td>
                            <td className="px-4 py-3 text-sm">Can sell at any time</td>
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
                    className={theme === 'light' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
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
              This calculator provides estimates based on your inputs. Consult with a financial advisor for personalized advice.
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