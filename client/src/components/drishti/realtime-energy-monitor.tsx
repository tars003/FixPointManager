import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Droplet, 
  Gauge, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Timer,
  Thermometer,
  Battery,
  Settings,
  RefreshCw,
  ChevronUp,
  ChevronDown 
} from 'lucide-react';

interface EnergyMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  icon: React.ReactNode;
  color: string;
}

const RealtimeEnergyMonitor: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('realtime');
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [currentEfficiency, setCurrentEfficiency] = useState<number>(78);
  
  // Simulate data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      
      // Simulate efficiency fluctuation between 75-85%
      setCurrentEfficiency(prev => {
        const change = Math.random() * 3 - 1.5; // -1.5 to +1.5
        return Math.max(75, Math.min(85, prev + change));
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#00A3A3]" />
                Real-Time Energy Consumption
              </CardTitle>
              <CardDescription>
                Live OBD data monitoring and energy efficiency metrics
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-muted-foreground">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Current Efficiency Gauge */}
          <div className="flex flex-col items-center justify-center py-3">
            <div className="relative h-48 w-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#e6e6e6"
                  strokeWidth="12"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke={getEfficiencyColor(currentEfficiency)}
                  strokeWidth="12"
                  strokeDasharray="339.292"
                  strokeDashoffset={339.292 * (1 - currentEfficiency/100)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{currentEfficiency.toFixed(1)}%</span>
                <span className="text-sm text-muted-foreground">Energy Efficiency</span>
              </div>
            </div>
            <p className="text-sm text-center mt-2 text-muted-foreground">
              Last updated: {formatTime(lastUpdated)}
            </p>
          </div>
          
          {/* Time Range Selector */}
          <Tabs defaultValue="realtime" className="w-full" onValueChange={setSelectedTimeframe}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="realtime">Real-time</TabsTrigger>
              <TabsTrigger value="hourly">Last Hour</TabsTrigger>
              <TabsTrigger value="daily">Today</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {energyMetrics.map((metric, index) => (
              <Card key={index} className="overflow-hidden border-l-4" style={{ borderLeftColor: metric.color }}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 rounded-full" style={{ backgroundColor: `${metric.color}20` }}>
                          {metric.icon}
                        </div>
                        <span className="font-medium text-sm">{metric.name}</span>
                      </div>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-xl font-bold">{metric.value}</span>
                        <span className="text-xs text-muted-foreground">{metric.unit}</span>
                      </div>
                    </div>
                    <TrendIndicator trend={metric.trend} change={metric.change} />
                  </div>
                  
                  {/* Mini Sparkline */}
                  <div className="h-8 mt-2">
                    <div className="w-full h-1 bg-gray-100 relative mt-3">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 rounded-full"
                          style={{
                            height: `${getRandomSparklineHeight()}px`,
                            backgroundColor: metric.color,
                            left: `${i * 10}%`,
                            bottom: '0'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="gap-1">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="default" className="gap-1">
            <Settings className="h-4 w-4" />
            Configure
          </Button>
        </CardFooter>
      </Card>
      
      {/* Historical Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Energy Consumption Trends</CardTitle>
          <CardDescription>Historical comparison and usage patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 flex items-center justify-center border rounded-md bg-muted/20">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/60" />
              <p className="mt-2 text-muted-foreground">Detailed energy consumption chart will appear here</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-3">
              <h3 className="font-medium">Consumption by Category</h3>
              {consumptionCategories.map((category, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{category.name}</span>
                    <span className="font-medium">{category.percentage}%</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" 
                    indicatorClassName={`bg-[${category.color}]`} />
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Optimization Recommendations</h3>
              {optimizationTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2 p-3 border rounded-md">
                  <div className="p-1.5 rounded-full bg-blue-50 flex-shrink-0">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{tip.title}</p>
                    <p className="text-xs text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper Components
const TrendIndicator: React.FC<{ trend: 'up' | 'down' | 'stable', change: number }> = ({ trend, change }) => {
  return (
    <div className={`flex items-center gap-1 text-xs font-medium
      ${trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-gray-500'}`}>
      {trend === 'up' && <ChevronUp className="h-3 w-3" />}
      {trend === 'down' && <ChevronDown className="h-3 w-3" />}
      {change}%
    </div>
  );
};

// Helper Functions
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const getEfficiencyColor = (efficiency: number): string => {
  if (efficiency >= 80) return '#28A745';
  if (efficiency >= 70) return '#88C34A';
  if (efficiency >= 60) return '#FFC107';
  if (efficiency >= 50) return '#FF9800';
  return '#DC3545';
};

const getRandomSparklineHeight = (): number => {
  return Math.floor(Math.random() * 16) + 4; // 4px to 20px
};

// Sample Data
const energyMetrics: EnergyMetric[] = [
  {
    name: 'Fuel Rate',
    value: 5.8,
    unit: 'L/100km',
    trend: 'down',
    change: 3.2,
    icon: <Droplet className="h-4 w-4" style={{ color: '#0056B3' }} />,
    color: '#0056B3'
  },
  {
    name: 'Engine Load',
    value: 42,
    unit: '%',
    trend: 'stable',
    change: 0.8,
    icon: <Gauge className="h-4 w-4" style={{ color: '#00A3A3' }} />,
    color: '#00A3A3'
  },
  {
    name: 'Battery Voltage',
    value: 13.8,
    unit: 'V',
    trend: 'up',
    change: 1.5,
    icon: <Battery className="h-4 w-4" style={{ color: '#88C34A' }} />,
    color: '#88C34A'
  },
  {
    name: 'Engine RPM',
    value: 1650,
    unit: 'rpm',
    trend: 'up',
    change: 4.2,
    icon: <Gauge className="h-4 w-4" style={{ color: '#FFC107' }} />,
    color: '#FFC107'
  },
  {
    name: 'Idle Time',
    value: 12.5,
    unit: 'min',
    trend: 'down',
    change: 5.3,
    icon: <Timer className="h-4 w-4" style={{ color: '#FF9800' }} />,
    color: '#FF9800'
  },
  {
    name: 'Engine Temp',
    value: 87,
    unit: '°C',
    trend: 'stable',
    change: 0.5,
    icon: <Thermometer className="h-4 w-4" style={{ color: '#DC3545' }} />,
    color: '#DC3545'
  }
];

const consumptionCategories = [
  { name: 'Engine', percentage: 42, color: '#0056B3' },
  { name: 'AC/Heating', percentage: 23, color: '#00A3A3' },
  { name: 'Electrical Systems', percentage: 18, color: '#FFC107' },
  { name: 'Transmission', percentage: 12, color: '#28A745' },
  { name: 'Other', percentage: 5, color: '#6C757D' }
];

const optimizationTips = [
  {
    title: 'Reduce Idle Time',
    description: 'Your engine idles more than average. Consider turning off when stopped for more than 1 minute.'
  },
  {
    title: 'Check Tire Pressure',
    description: 'Detected pattern suggests underinflated tires. Verify pressures for better efficiency.'
  },
  {
    title: 'AC Optimization',
    description: 'Try using the "Eco" mode for your AC to reduce the energy consumption during city driving.'
  }
];

export default RealtimeEnergyMonitor;