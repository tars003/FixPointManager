import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  Fuel, 
  IndianRupee, 
  Calendar, 
  TrendingDown, 
  Scale, 
  Shield, 
  CalendarClock, 
  Wrench, 
  ArrowRight, 
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/ui/page-header';
import { formatCurrency } from '@/lib/format';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_PRINCIPAL = 1000000;
const DEFAULT_INTEREST = 9.5;
const DEFAULT_TENURE = 5;

interface LoanResult {
  emi: number;
  totalInterest: number;
  totalAmount: number;
  amortizationSchedule: {
    year: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

const Calculators: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('loan');
  
  // Loan Calculator State
  const [loanAmount, setLoanAmount] = useState(DEFAULT_PRINCIPAL);
  const [interestRate, setInterestRate] = useState(DEFAULT_INTEREST);
  const [loanTenure, setLoanTenure] = useState(DEFAULT_TENURE);
  const [downPayment, setDownPayment] = useState(200000);
  const [loanResult, setLoanResult] = useState<LoanResult>({
    emi: 0,
    totalInterest: 0,
    totalAmount: 0,
    amortizationSchedule: []
  });
  
  // Fuel Calculator State
  const [distance, setDistance] = useState(100);
  const [fuelEfficiency, setFuelEfficiency] = useState(15);
  const [fuelPrice, setFuelPrice] = useState(105);
  const [fuelResult, setFuelResult] = useState({
    fuelRequired: '0',
    cost: '0',
    co2Emissions: '0'
  });
  
  // Depreciation Calculator State
  const [purchasePrice, setPurchasePrice] = useState(1500000);
  const [purchaseYear, setPurchaseYear] = useState(new Date().getFullYear() - 2);
  const [vehicleType, setVehicleType] = useState('sedan');
  const [vehicleCondition, setVehicleCondition] = useState('excellent');
  const [depreciationResult, setDepreciationResult] = useState({
    currentValue: '0',
    depreciationAmount: '0',
    depreciationRate: '0',
    yearlyDepreciation: [] as {year: number, value: number}[]
  });
  
  // Insurance Calculator State
  const [vehicleValue, setVehicleValue] = useState(1500000);
  const [vehicleAge, setVehicleAge] = useState(2);
  const [coverageType, setCoverageType] = useState('comprehensive');
  const [noClaimBonus, setNoClaimBonus] = useState(0);
  const [insuranceResult, setInsuranceResult] = useState({
    basicPremium: '0',
    netPremium: '0',
    tax: '0',
    totalPremium: '0'
  });
  
  // Functions
  const calculateLoan = () => {
    const principal = loanAmount - downPayment;
    const monthlyInterest = interestRate / 12 / 100;
    const months = loanTenure * 12;
    
    const emi = principal * monthlyInterest * Math.pow(1 + monthlyInterest, months) / (Math.pow(1 + monthlyInterest, months) - 1);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;
    
    // Calculate amortization schedule by year
    let remainingPrincipal = principal;
    const yearlyData = [];
    
    for (let year = 1; year <= loanTenure; year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      
      for (let month = 1; month <= 12; month++) {
        const monthlyInterestPayment = remainingPrincipal * monthlyInterest;
        const monthlyPrincipalPayment = emi - monthlyInterestPayment;
        
        yearlyPrincipal += monthlyPrincipalPayment;
        yearlyInterest += monthlyInterestPayment;
        
        remainingPrincipal -= monthlyPrincipalPayment;
      }
      
      yearlyData.push({
        year,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        balance: remainingPrincipal > 0 ? remainingPrincipal : 0
      });
    }
    
    setLoanResult({
      emi,
      totalInterest,
      totalAmount,
      amortizationSchedule: yearlyData
    });
    
    toast({
      title: "Loan calculation updated",
      description: "EMI and amortization schedule have been calculated.",
    });
  };
  
  const calculateFuel = () => {
    const fuelRequired = distance / fuelEfficiency;
    const cost = fuelRequired * fuelPrice;
    const co2Emissions = fuelRequired * 2.31; // Approximate CO2 emission in kg per liter of petrol
    
    setFuelResult({
      fuelRequired: fuelRequired.toFixed(2),
      cost: cost.toFixed(2),
      co2Emissions: co2Emissions.toFixed(2)
    });
    
    toast({
      title: "Fuel calculation updated",
      description: "Fuel requirement and cost have been calculated.",
    });
  };
  
  const calculateDepreciation = () => {
    // Different depreciation rates based on vehicle type
    const depreciationRates = {
      sedan: 15,
      suv: 12,
      luxury: 20,
      hatchback: 18
    };
    
    // Condition multipliers
    const conditionMultipliers = {
      excellent: 0.9,
      good: 1.0,
      fair: 1.1,
      poor: 1.2
    };
    
    const baseRate = depreciationRates[vehicleType as keyof typeof depreciationRates] || 15;
    const multiplier = conditionMultipliers[vehicleCondition as keyof typeof conditionMultipliers] || 1.0;
    const effectiveRate = baseRate * multiplier;
    
    const currentYear = new Date().getFullYear();
    const yearsOld = currentYear - purchaseYear;
    
    let currentValue = purchasePrice;
    const yearlyDepreciation = [];
    
    for (let i = 0; i <= yearsOld; i++) {
      if (i === 0) {
        yearlyDepreciation.push({
          year: purchaseYear,
          value: currentValue
        });
        continue;
      }
      
      const yearDepreciation = currentValue * (effectiveRate / 100);
      currentValue -= yearDepreciation;
      
      yearlyDepreciation.push({
        year: purchaseYear + i,
        value: currentValue
      });
    }
    
    const depreciationAmount = purchasePrice - currentValue;
    
    setDepreciationResult({
      currentValue: currentValue.toFixed(0),
      depreciationAmount: depreciationAmount.toFixed(0),
      depreciationRate: effectiveRate.toFixed(1),
      yearlyDepreciation
    });
    
    toast({
      title: "Depreciation calculation updated",
      description: "Current value and depreciation have been calculated.",
    });
  };
  
  const calculateInsurance = () => {
    // Basic insurance premium calculation (simplified)
    const baseRate = vehicleValue * 0.025; // 2.5% of vehicle value
    
    // Adjust for vehicle age
    const ageMultiplier = 1 + (vehicleAge * 0.05); // 5% increase per year
    
    // Adjust for coverage type
    const coverageMultiplier = coverageType === 'comprehensive' ? 1.0 : 0.6;
    
    // Apply no claim bonus discount (0-50%)
    const nclDiscount = 1 - (noClaimBonus / 100);
    
    const basicPremium = baseRate * ageMultiplier * coverageMultiplier;
    const netPremium = basicPremium * nclDiscount;
    const tax = netPremium * 0.18; // 18% GST
    const totalPremium = netPremium + tax;
    
    setInsuranceResult({
      basicPremium: basicPremium.toFixed(0),
      netPremium: netPremium.toFixed(0),
      tax: tax.toFixed(0),
      totalPremium: totalPremium.toFixed(0)
    });
    
    toast({
      title: "Insurance calculation updated",
      description: "Premium estimate has been calculated.",
    });
  };
  
  React.useEffect(() => {
    calculateLoan();
    calculateFuel();
    calculateDepreciation();
    calculateInsurance();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <PageHeader 
        title="Vehicle Calculators" 
        description="Calculate finances, fuel costs, depreciation, and more for your vehicles"
        icon={<Calculator className="h-6 w-6 text-blue-500" />}
      />
      
      <div className="mt-6">
        <Tabs defaultValue="loan" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-4xl">
            <TabsTrigger value="loan">
              <IndianRupee className="mr-2 h-4 w-4" />
              Loan/EMI
            </TabsTrigger>
            <TabsTrigger value="fuel">
              <Fuel className="mr-2 h-4 w-4" />
              Fuel Cost
            </TabsTrigger>
            <TabsTrigger value="depreciation">
              <TrendingDown className="mr-2 h-4 w-4" />
              Depreciation
            </TabsTrigger>
            <TabsTrigger value="insurance">
              <Shield className="mr-2 h-4 w-4" />
              Insurance
            </TabsTrigger>
          </TabsList>
          
          {/* Loan/EMI Calculator */}
          <TabsContent value="loan" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Loan/EMI Calculator</CardTitle>
                  <CardDescription>Calculate EMI, total interest, and payment schedule</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label>Vehicle Price (₹)</Label>
                      <span className="text-sm font-medium">{formatCurrency(loanAmount)}</span>
                    </div>
                    <Slider 
                      value={[loanAmount]} 
                      min={100000} 
                      max={10000000} 
                      step={50000} 
                      onValueChange={(value) => setLoanAmount(value[0])} 
                      className="w-full" 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹1L</span>
                      <span>₹1Cr</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label>Down Payment (₹)</Label>
                      <span className="text-sm font-medium">{formatCurrency(downPayment)}</span>
                    </div>
                    <Slider 
                      value={[downPayment]} 
                      min={0} 
                      max={loanAmount * 0.5} 
                      step={10000} 
                      onValueChange={(value) => setDownPayment(value[0])} 
                      className="w-full" 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹0</span>
                      <span>{formatCurrency(loanAmount * 0.5)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label>Interest Rate (%)</Label>
                      <span className="text-sm font-medium">{interestRate}%</span>
                    </div>
                    <Slider 
                      value={[interestRate]} 
                      min={5} 
                      max={20} 
                      step={0.1} 
                      onValueChange={(value) => setInterestRate(value[0])} 
                      className="w-full" 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5%</span>
                      <span>20%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label>Loan Tenure (Years)</Label>
                      <span className="text-sm font-medium">{loanTenure} years</span>
                    </div>
                    <Slider 
                      value={[loanTenure]} 
                      min={1} 
                      max={8} 
                      step={1} 
                      onValueChange={(value) => setLoanTenure(value[0])} 
                      className="w-full" 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 Year</span>
                      <span>8 Years</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={calculateLoan} className="w-full">Calculate EMI</Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-blue-50 border-blue-100">
                <CardHeader>
                  <CardTitle>Loan Summary</CardTitle>
                  <CardDescription>Based on your inputs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                      <div className="text-sm text-gray-500 mb-1">Monthly EMI</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(loanResult.emi)}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                      <div className="text-sm text-gray-500 mb-1">Total Interest</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(loanResult.totalInterest)}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                      <div className="text-sm text-gray-500 mb-1">Total Payment</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(loanResult.totalAmount)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                    <h3 className="font-medium mb-4">Yearly Payment Breakdown</h3>
                    <div className="space-y-4">
                      {loanResult.amortizationSchedule.map((item) => (
                        <div key={item.year} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Year {item.year}</span>
                            <span>Balance: ₹{formatCurrency(item.balance)}</span>
                          </div>
                          <div className="flex h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-500" 
                              style={{ width: `${(item.principal / (item.principal + item.interest)) * 100}%` }}
                            ></div>
                            <div 
                              className="bg-amber-500" 
                              style={{ width: `${(item.interest / (item.principal + item.interest)) * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Principal: ₹{formatCurrency(item.principal)}</span>
                            <span>Interest: ₹{formatCurrency(item.interest)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-xs flex items-center gap-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                        <span>Principal</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-amber-500 rounded-full mr-1"></div>
                        <span>Interest</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Fuel Cost Calculator */}
          <TabsContent value="fuel" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fuel Cost Calculator</CardTitle>
                  <CardDescription>Calculate fuel consumption and costs for a trip</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label>Distance (km)</Label>
                      <span className="text-sm font-medium">{distance} km</span>
                    </div>
                    <Slider 
                      value={[distance]} 
                      min={1} 
                      max={1000} 
                      step={1} 
                      onValueChange={(value) => setDistance(value[0])} 
                      className="w-full" 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 km</span>
                      <span>1000 km</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label>Fuel Efficiency (km/l)</Label>
                      <span className="text-sm font-medium">{fuelEfficiency} km/l</span>
                    </div>
                    <Slider 
                      value={[fuelEfficiency]} 
                      min={5} 
                      max={30} 
                      step={0.5} 
                      onValueChange={(value) => setFuelEfficiency(value[0])} 
                      className="w-full" 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5 km/l</span>
                      <span>30 km/l</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label>Fuel Price (₹/liter)</Label>
                      <span className="text-sm font-medium">₹{fuelPrice}/liter</span>
                    </div>
                    <Slider 
                      value={[fuelPrice]} 
                      min={80} 
                      max={130} 
                      step={0.1} 
                      onValueChange={(value) => setFuelPrice(value[0])} 
                      className="w-full" 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹80/liter</span>
                      <span>₹130/liter</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Label className="mb-2 block">Fuel Type</Label>
                    <RadioGroup defaultValue="petrol" className="grid grid-cols-2 gap-4">
                      <Label 
                        htmlFor="petrol" 
                        className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-50"
                      >
                        <RadioGroupItem value="petrol" id="petrol" />
                        Petrol
                      </Label>
                      <Label 
                        htmlFor="diesel" 
                        className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-50"
                      >
                        <RadioGroupItem value="diesel" id="diesel" />
                        Diesel
                      </Label>
                      <Label 
                        htmlFor="cng" 
                        className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-50"
                      >
                        <RadioGroupItem value="cng" id="cng" />
                        CNG
                      </Label>
                      <Label 
                        htmlFor="electric" 
                        className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-50"
                      >
                        <RadioGroupItem value="electric" id="electric" />
                        Electric
                      </Label>
                    </RadioGroup>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={calculateFuel} className="w-full">Calculate Fuel Cost</Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-emerald-100">
                <CardHeader>
                  <CardTitle>Fuel Consumption Results</CardTitle>
                  <CardDescription>Based on your inputs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
                      <div className="text-sm text-gray-500 mb-1">Fuel Required</div>
                      <div className="text-2xl font-bold text-emerald-600">
                        {fuelResult.fuelRequired} L
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
                      <div className="text-sm text-gray-500 mb-1">Fuel Cost</div>
                      <div className="text-2xl font-bold text-emerald-600">
                        ₹{fuelResult.cost}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100">
                      <div className="text-sm text-gray-500 mb-1">CO2 Emissions</div>
                      <div className="text-2xl font-bold text-emerald-600">
                        {fuelResult.co2Emissions} kg
                      </div>
                    </div>
                  </div>
                  
                  <Card className="bg-white border-emerald-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Fuel Saving Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm pt-0">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <p>Maintain proper tire pressure to improve fuel efficiency by up to 3%.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <p>Remove excess weight from your vehicle to reduce fuel consumption.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <p>Use cruise control on highways to maintain a constant speed and save fuel.</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white border-emerald-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Trip Cost Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>Petrol</span>
                          </div>
                          <span className="font-medium">₹{fuelResult.cost}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                            <span>Diesel</span>
                          </div>
                          <span className="font-medium">₹{(parseFloat(fuelResult.cost) * 0.85).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>CNG</span>
                          </div>
                          <span className="font-medium">₹{(parseFloat(fuelResult.cost) * 0.6).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span>Electric</span>
                          </div>
                          <span className="font-medium">₹{(parseFloat(fuelResult.cost) * 0.3).toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Depreciation Calculator */}
          <TabsContent value="depreciation" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Depreciation Calculator</CardTitle>
                  <CardDescription>Estimate your vehicle's current value and depreciation rate</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Purchase Price (₹)</Label>
                    <Input 
                      type="number" 
                      value={purchasePrice} 
                      onChange={(e) => setPurchasePrice(Number(e.target.value))} 
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Purchase Year</Label>
                    <Select 
                      value={purchaseYear.toString()} 
                      onValueChange={(value) => setPurchaseYear(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Vehicle Type</Label>
                    <Select value={vehicleType} onValueChange={setVehicleType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hatchback">Hatchback</SelectItem>
                        <SelectItem value="sedan">Sedan</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="luxury">Luxury Vehicle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Vehicle Condition</Label>
                    <Select value={vehicleCondition} onValueChange={setVehicleCondition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={calculateDepreciation} className="w-full">Calculate Depreciation</Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
                <CardHeader>
                  <CardTitle>Depreciation Results</CardTitle>
                  <CardDescription>Based on your inputs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                      <div className="text-sm text-gray-500 mb-1">Current Value</div>
                      <div className="text-2xl font-bold text-purple-600">
                        ₹{formatCurrency(Number(depreciationResult.currentValue))}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                      <div className="text-sm text-gray-500 mb-1">Total Depreciation</div>
                      <div className="text-2xl font-bold text-purple-600">
                        ₹{formatCurrency(Number(depreciationResult.depreciationAmount))}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                      <div className="text-sm text-gray-500 mb-1">Rate/Year</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {depreciationResult.depreciationRate}%
                      </div>
                    </div>
                  </div>
                  
                  <Card className="bg-white border-purple-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Depreciation Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {depreciationResult.yearlyDepreciation.map((item, index) => (
                          <div key={item.year} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{item.year}</span>
                              <span>₹{formatCurrency(item.value)}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                              <div 
                                className="bg-purple-600 h-2.5 rounded-full" 
                                style={{ width: `${(item.value / purchasePrice) * 100}%` }}
                              ></div>
                            </div>
                            {index > 0 && (
                              <div className="text-xs text-gray-500">
                                Loss: ₹{formatCurrency(depreciationResult.yearlyDepreciation[index-1].value - item.value)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white border-purple-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Tips to Minimize Depreciation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm pt-0">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                        <p>Regular maintenance helps preserve value and slows depreciation.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                        <p>Keep service records and documentation to prove vehicle history.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                        <p>Limit mileage when possible as high mileage accelerates depreciation.</p>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Insurance Calculator */}
          <TabsContent value="insurance" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Insurance Premium Calculator</CardTitle>
                  <CardDescription>Estimate your vehicle insurance premium</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Vehicle Value (₹)</Label>
                    <Input 
                      type="number" 
                      value={vehicleValue} 
                      onChange={(e) => setVehicleValue(Number(e.target.value))} 
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Vehicle Age (Years)</Label>
                    <Select 
                      value={vehicleAge.toString()} 
                      onValueChange={(value) => setVehicleAge(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 16 }, (_, i) => i).map((age) => (
                          <SelectItem key={age} value={age.toString()}>{age} {age === 1 ? 'year' : 'years'}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Coverage Type</Label>
                    <Select value={coverageType} onValueChange={setCoverageType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select coverage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprehensive">Comprehensive</SelectItem>
                        <SelectItem value="thirdParty">Third Party Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>No Claim Bonus (%)</Label>
                      <span className="text-sm font-medium">{noClaimBonus}%</span>
                    </div>
                    <Slider 
                      value={[noClaimBonus]} 
                      min={0} 
                      max={50} 
                      step={10} 
                      onValueChange={(value) => setNoClaimBonus(value[0])} 
                      className="w-full" 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0% (No NCB)</span>
                      <span>50% (Maximum)</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={calculateInsurance} className="w-full">Calculate Premium</Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
                <CardHeader>
                  <CardTitle>Insurance Premium Estimate</CardTitle>
                  <CardDescription>Based on your inputs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100">
                      <div className="text-sm text-gray-500 mb-1">Basic Premium</div>
                      <div className="text-2xl font-bold text-amber-600">
                        {formatCurrency(Number(insuranceResult.basicPremium))}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100">
                      <div className="text-sm text-gray-500 mb-1">NCB Discount</div>
                      <div className="text-2xl font-bold text-amber-600">
                        ₹{formatCurrency(Number(insuranceResult.basicPremium) - Number(insuranceResult.netPremium))}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100">
                      <div className="text-sm text-gray-500 mb-1">GST (18%)</div>
                      <div className="text-2xl font-bold text-amber-600">
                        ₹{formatCurrency(Number(insuranceResult.tax))}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100">
                      <div className="text-sm text-gray-500 mb-1">Total Premium</div>
                      <div className="text-2xl font-bold text-amber-600">
                        {formatCurrency(Number(insuranceResult.totalPremium))}
                      </div>
                    </div>
                  </div>
                  
                  <Card className="bg-white border-amber-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Premium Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Basic Third Party</span>
                          <span className="font-medium">{formatCurrency(Number(insuranceResult.basicPremium) * 0.4)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Own Damage</span>
                          <span className="font-medium">{formatCurrency(Number(insuranceResult.basicPremium) * 0.6)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span>Basic Premium</span>
                          <span className="font-medium">{formatCurrency(Number(insuranceResult.basicPremium))}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>No Claim Bonus ({noClaimBonus}%)</span>
                          <span className="font-medium text-red-500">-{formatCurrency(Number(insuranceResult.basicPremium) - Number(insuranceResult.netPremium))}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Net Premium</span>
                          <span className="font-medium">{formatCurrency(Number(insuranceResult.netPremium))}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>GST (18%)</span>
                          <span className="font-medium">{formatCurrency(Number(insuranceResult.tax))}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center font-bold">
                          <span>Total Premium</span>
                          <span>{formatCurrency(Number(insuranceResult.totalPremium))}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white border-amber-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Insurance Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm pt-0">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <p>Maintain a claim-free record to increase your No Claim Bonus up to 50%.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <p>Install anti-theft devices for additional discounts on premium.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <p>Compare quotes from multiple insurers before renewing your policy.</p>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Calculators;