import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ROICalculatorDialog } from './roi-calculator-dialog';
import { TCOCalculatorDialog } from './tco-calculator-dialog';
import { LeaseVsBuyCalculatorDialog } from './lease-vs-buy-calculator-dialog';
import { FleetReplacementCalculatorDialog } from './fleet-replacement-calculator-dialog';
import {
  Calculator,
  BarChart,
  TrendingUp,
  Scale,
  TimerReset,
  DollarSign,
  Fuel,
  BarChart3,
  LineChart,
  PieChart
} from 'lucide-react';

interface CalculatorDashboardProps {
  theme: 'light' | 'dark';
}

interface CalculatorCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  determinations: string[];
  colorTheme: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';
  theme: 'light' | 'dark';
  onOpen: () => void;
}

const CalculatorCard = ({
  title,
  description,
  icon,
  determinations,
  colorTheme,
  theme,
  onOpen,
}: CalculatorCardProps) => {
  // Color configuration based on theme and color
  const getColors = (color: string) => {
    if (theme === 'dark') {
      const bgColors: Record<string, string> = {
        blue: 'bg-blue-900/20',
        green: 'bg-green-900/20',
        purple: 'bg-purple-900/20',
        orange: 'bg-orange-900/20',
        red: 'bg-red-900/20',
        indigo: 'bg-indigo-900/20',
      };
      
      const textColors: Record<string, string> = {
        blue: 'text-blue-400',
        green: 'text-green-400',
        purple: 'text-purple-400',
        orange: 'text-orange-400',
        red: 'text-red-400',
        indigo: 'text-indigo-400',
      };
      
      const bgPrimaryColors: Record<string, string> = {
        blue: 'bg-blue-800/30',
        green: 'bg-green-800/30',
        purple: 'bg-purple-800/30',
        orange: 'bg-orange-800/30',
        red: 'bg-red-800/30',
        indigo: 'bg-indigo-800/30',
      };
      
      const textPrimaryColors: Record<string, string> = {
        blue: 'text-blue-300',
        green: 'text-green-300',
        purple: 'text-purple-300',
        orange: 'text-orange-300',
        red: 'text-red-300',
        indigo: 'text-indigo-300',
      };
      
      const buttonBgColors: Record<string, string> = {
        blue: 'bg-blue-600 hover:bg-blue-700',
        green: 'bg-green-600 hover:bg-green-700',
        purple: 'bg-purple-600 hover:bg-purple-700',
        orange: 'bg-orange-600 hover:bg-orange-700',
        red: 'bg-red-600 hover:bg-red-700',
        indigo: 'bg-indigo-600 hover:bg-indigo-700',
      };
      
      return {
        bgColor: bgColors[color] || 'bg-blue-900/20',
        textColor: textColors[color] || 'text-blue-400',
        bgPrimaryColor: bgPrimaryColors[color] || 'bg-blue-800/30',
        textPrimaryColor: textPrimaryColors[color] || 'text-blue-300',
        buttonBgColor: buttonBgColors[color] || 'bg-blue-600 hover:bg-blue-700',
      };
    } else {
      const bgColors: Record<string, string> = {
        blue: 'bg-blue-50',
        green: 'bg-green-50',
        purple: 'bg-purple-50',
        orange: 'bg-amber-50',
        red: 'bg-red-50',
        indigo: 'bg-indigo-50',
      };
      
      const textColors: Record<string, string> = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        purple: 'text-purple-600',
        orange: 'text-amber-600',
        red: 'text-red-600',
        indigo: 'text-indigo-600',
      };
      
      const textPrimaryColors: Record<string, string> = {
        blue: 'text-blue-800',
        green: 'text-green-800',
        purple: 'text-purple-800',
        orange: 'text-amber-800',
        red: 'text-red-800',
        indigo: 'text-indigo-800',
      };
      
      const buttonBgColors: Record<string, string> = {
        blue: 'bg-blue-600 hover:bg-blue-700',
        green: 'bg-green-600 hover:bg-green-700',
        purple: 'bg-purple-600 hover:bg-purple-700',
        orange: 'bg-amber-600 hover:bg-amber-700',
        red: 'bg-red-600 hover:bg-red-700',
        indigo: 'bg-indigo-600 hover:bg-indigo-700',
      };
      
      return {
        bgColor: bgColors[color] || 'bg-blue-50',
        textColor: textColors[color] || 'text-blue-600',
        bgPrimaryColor: 'bg-white',
        textPrimaryColor: textPrimaryColors[color] || 'text-blue-800',
        buttonBgColor: buttonBgColors[color] || 'bg-blue-600 hover:bg-blue-700',
      };
    }
  };
  
  const colors = getColors(colorTheme);
  
  return (
    <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${colors.bgColor}`}>
            <div className={colors.textColor}>{icon}</div>
          </div>
          <CardTitle className={theme === 'dark' ? 'text-white' : ''}>{title}</CardTitle>
        </div>
        <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`p-4 rounded-lg ${colors.bgColor}`}>
          <p className={`mb-2 font-medium ${colors.textPrimaryColor}`}>
            Helps you determine:
          </p>
          <ul className={`list-disc ml-5 ${colors.textColor}`}>
            {determinations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className={`w-full text-white ${colors.buttonBgColor}`}
          onClick={onOpen}
        >
          <Calculator className="h-4 w-4 mr-2" />
          Open Calculator
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function CalculatorDashboard({ theme }: CalculatorDashboardProps) {
  // States for calculator dialogs
  const [showROICalculator, setShowROICalculator] = useState(false);
  const [showTCOCalculator, setShowTCOCalculator] = useState(false);
  const [showLeaseVsBuyCalculator, setShowLeaseVsBuyCalculator] = useState(false);
  const [showFleetReplacementCalculator, setShowFleetReplacementCalculator] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  
  return (
    <div className="space-y-6">
      {/* Calculator Category Navigation */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className={`grid grid-cols-5 ${theme === 'dark' ? 'bg-gray-700' : ''}`}>
          <TabsTrigger value="all">All Calculators</TabsTrigger>
          <TabsTrigger value="investment">Investment Decision</TabsTrigger>
          <TabsTrigger value="operational">Operational Cost</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Strategy</TabsTrigger>
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ROI Calculator Card */}
            <CalculatorCard
              title="ROI Calculator"
              description="Calculate return on investment for new vehicle purchases"
              icon={<TrendingUp className="h-5 w-5" />}
              determinations={[
                "Breakeven point for vehicle purchase",
                "Projected annual returns",
                "Comparison between different vehicle options",
                "Profit projections over vehicle lifetime"
              ]}
              colorTheme="blue"
              theme={theme}
              onOpen={() => setShowROICalculator(true)}
            />
            
            {/* Lease vs. Buy Calculator Card */}
            <CalculatorCard
              title="Lease vs. Buy Calculator"
              description="Compare the financial implications of leasing versus buying"
              icon={<Scale className="h-5 w-5" />}
              determinations={[
                "Total cost comparison over time",
                "Cash flow implications",
                "Tax benefits for each option",
                "End-of-term value comparison"
              ]}
              colorTheme="green"
              theme={theme}
              onOpen={() => setShowLeaseVsBuyCalculator(true)}
            />
            
            {/* Fleet Replacement Optimizer Card */}
            <CalculatorCard
              title="Fleet Replacement Optimizer"
              description="Calculate optimal time to replace vehicles"
              icon={<TimerReset className="h-5 w-5" />}
              determinations={[
                "Optimal replacement time based on age and costs",
                "Maintenance cost projections",
                "Depreciation analysis",
                "Replacement timing recommendations"
              ]}
              colorTheme="purple"
              theme={theme}
              onOpen={() => setShowFleetReplacementCalculator(true)}
            />
            
            {/* TCO Calculator Card */}
            <CalculatorCard
              title="TCO Calculator"
              description="Total Cost of Ownership analysis per vehicle"
              icon={<BarChart className="h-5 w-5" />}
              determinations={[
                "Purchase/lease costs",
                "Maintenance and repair expenses",
                "Fuel and operational costs",
                "Insurance and compliance expenses",
                "End-of-life residual value"
              ]}
              colorTheme="orange"
              theme={theme}
              onOpen={() => setShowTCOCalculator(true)}
            />
            
            {/* Rental Rate Calculator Card */}
            <CalculatorCard
              title="Rental Rate Calculator"
              description="Determine optimal pricing for vehicle rentals"
              icon={<DollarSign className="h-5 w-5" />}
              determinations={[
                "Competitive market-based pricing",
                "Cost-plus pricing analysis",
                "Profitability projections",
                "Seasonal pricing adjustments",
                "Special offer impact analysis"
              ]}
              colorTheme="red"
              theme={theme}
              onOpen={() => alert('This calculator is coming soon!')}
            />
            
            {/* Fuel Efficiency ROI Calculator Card */}
            <CalculatorCard
              title="Fuel Efficiency ROI"
              description="Calculate savings from more fuel-efficient vehicles"
              icon={<Fuel className="h-5 w-5" />}
              determinations={[
                "Fuel cost savings over time",
                "Break-even point for investment premium",
                "Environmental impact analysis",
                "Comparison between vehicle options",
                "Payback period calculator"
              ]}
              colorTheme="indigo"
              theme={theme}
              onOpen={() => alert('This calculator is coming soon!')}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="investment" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CalculatorCard
              title="ROI Calculator"
              description="Calculate return on investment for new vehicle purchases"
              icon={<TrendingUp className="h-5 w-5" />}
              determinations={[
                "Breakeven point for vehicle purchase",
                "Projected annual returns",
                "Comparison between different vehicle options",
                "Profit projections over vehicle lifetime"
              ]}
              colorTheme="blue"
              theme={theme}
              onOpen={() => setShowROICalculator(true)}
            />
            
            <CalculatorCard
              title="Lease vs. Buy Calculator"
              description="Compare the financial implications of leasing versus buying"
              icon={<Scale className="h-5 w-5" />}
              determinations={[
                "Total cost comparison over time",
                "Cash flow implications",
                "Tax benefits for each option",
                "End-of-term value comparison"
              ]}
              colorTheme="green"
              theme={theme}
              onOpen={() => setShowLeaseVsBuyCalculator(true)}
            />
            
            <CalculatorCard
              title="Fuel Efficiency ROI"
              description="Calculate savings from more fuel-efficient vehicles"
              icon={<Fuel className="h-5 w-5" />}
              determinations={[
                "Fuel cost savings over time",
                "Break-even point for investment premium",
                "Environmental impact analysis",
                "Comparison between vehicle options",
                "Payback period calculator"
              ]}
              colorTheme="indigo"
              theme={theme}
              onOpen={() => alert('This calculator is coming soon!')}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="operational" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CalculatorCard
              title="TCO Calculator"
              description="Total Cost of Ownership analysis per vehicle"
              icon={<BarChart className="h-5 w-5" />}
              determinations={[
                "Purchase/lease costs",
                "Maintenance and repair expenses",
                "Fuel and operational costs",
                "Insurance and compliance expenses",
                "End-of-life residual value"
              ]}
              colorTheme="orange"
              theme={theme}
              onOpen={() => setShowTCOCalculator(true)}
            />
            
            <CalculatorCard
              title="Fleet Replacement Optimizer"
              description="Calculate optimal time to replace vehicles"
              icon={<TimerReset className="h-5 w-5" />}
              determinations={[
                "Optimal replacement time based on age and costs",
                "Maintenance cost projections",
                "Depreciation analysis",
                "Replacement timing recommendations"
              ]}
              colorTheme="purple"
              theme={theme}
              onOpen={() => setShowFleetReplacementCalculator(true)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="pricing" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CalculatorCard
              title="Rental Rate Calculator"
              description="Determine optimal pricing for vehicle rentals"
              icon={<DollarSign className="h-5 w-5" />}
              determinations={[
                "Competitive market-based pricing",
                "Cost-plus pricing analysis",
                "Profitability projections",
                "Seasonal pricing adjustments",
                "Special offer impact analysis"
              ]}
              colorTheme="red"
              theme={theme}
              onOpen={() => alert('This calculator is coming soon!')}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CalculatorCard
              title="Fleet Performance Dashboard"
              description="Comprehensive performance metrics for your fleet"
              icon={<BarChart3 className="h-5 w-5" />}
              determinations={[
                "Utilization rate analysis",
                "Revenue per vehicle metrics",
                "Operational efficiency scores",
                "Maintenance impact on performance"
              ]}
              colorTheme="blue"
              theme={theme}
              onOpen={() => alert('This calculator is coming soon!')}
            />
            
            <CalculatorCard
              title="Driver Performance Analyzer"
              description="Compare and optimize driver performance metrics"
              icon={<LineChart className="h-5 w-5" />}
              determinations={[
                "Fuel efficiency by driver",
                "Maintenance cost correlation",
                "Revenue generation comparison",
                "Safety record analysis"
              ]}
              colorTheme="green"
              theme={theme}
              onOpen={() => alert('This calculator is coming soon!')}
            />
            
            <CalculatorCard
              title="Route Optimization Calculator"
              description="Analyze and optimize delivery routes"
              icon={<PieChart className="h-5 w-5" />}
              determinations={[
                "Fuel savings from optimized routes",
                "Time efficiency improvements",
                "Vehicle wear reduction estimates",
                "Carbon footprint analysis"
              ]}
              colorTheme="purple"
              theme={theme}
              onOpen={() => alert('This calculator is coming soon!')}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Calculator Dialog Components */}
      <ROICalculatorDialog 
        open={showROICalculator} 
        onOpenChange={setShowROICalculator} 
        theme={theme} 
      />
      
      <TCOCalculatorDialog 
        open={showTCOCalculator} 
        onOpenChange={setShowTCOCalculator} 
        theme={theme} 
      />
      
      <LeaseVsBuyCalculatorDialog 
        open={showLeaseVsBuyCalculator} 
        onOpenChange={setShowLeaseVsBuyCalculator} 
        theme={theme} 
      />
      
      <FleetReplacementCalculatorDialog 
        open={showFleetReplacementCalculator} 
        onOpenChange={setShowFleetReplacementCalculator} 
        theme={theme} 
      />
    </div>
  );
}