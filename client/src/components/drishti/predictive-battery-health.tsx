import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Battery, 
  BatteryCharging, 
  Zap, 
  Clock, 
  Calendar, 
  BarChart3, 
  MapPin, 
  Thermometer, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Settings, 
  DollarSign,
  Route,
  ChevronRight,
  Zap as Lightning,
  Sun,
  Moon,
  Download
} from 'lucide-react';
import { Label } from '@/components/ui/label';

interface ChargePlan {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  suggestedTime: string;
  electricityRate: string;
  batteryImpact: string;
  benefits: string[];
  recommendationReason: string;
}

interface BatteryCell {
  id: string;
  health: number;
  voltage: string;
  temperature: string;
  chargeLevel: number;
  status: 'optimal' | 'good' | 'attention' | 'critical';
}

interface BatteryUsagePattern {
  time: string;
  usage: number;
  temperature: number;
  range: number;
}

const PredictiveBatteryHealth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('health');
  const [targetCharge, setTargetCharge] = useState<number>(90);
  const [chargingSpeed, setChargingSpeed] = useState<string>('standard');
  const [selectedPlan, setSelectedPlan] = useState<string>('optimal');
  
  // Simulated current battery metrics
  const batteryLevel = 42;
  const batteryHealth = 91;
  const estimatedRange = 187;
  const timeToFull = '1h 45m';
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BatteryCharging className="h-5 w-5 text-[#10B981]" />
              Predictive Battery Health System
            </CardTitle>
            <CardDescription>
              Advanced EV battery monitoring with cell-level analytics
            </CardDescription>
          </div>
          <Badge variant="default" className="bg-[#10B981]">
            EV Optimized
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Battery Status */}
        <div className="bg-gradient-to-r from-[#10B981]/10 to-transparent p-4 rounded-lg border border-[#10B981]/20">
          <div className="flex flex-wrap md:flex-nowrap gap-6 items-center">
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 120 120">
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
                    stroke="#10B981"
                    strokeWidth="12"
                    strokeDasharray="339.292"
                    strokeDashoffset={339.292 * (1 - batteryLevel/100)}
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">{batteryLevel}</span>
                    <span className="text-xl">%</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Charged</span>
                </div>
              </div>
              
              <div className="mt-2 flex flex-col items-center">
                <span className="text-sm font-medium">Battery Status</span>
                <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 border-green-200">
                  Healthy
                </Badge>
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 border rounded-lg bg-white">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">Health</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-xl font-semibold">{batteryHealth}%</span>
                    <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${batteryHealth}%` }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg bg-white">
                  <div className="flex items-center gap-2">
                    <Route className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Range</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-xl font-semibold">{estimatedRange}</span>
                    <span className="text-sm text-muted-foreground ml-1">km</span>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg bg-white">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">To Full</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-xl font-semibold">{timeToFull}</span>
                    <div className="text-xs text-muted-foreground mt-1">Standard charging</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 border rounded-lg bg-white">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Lightning className="h-4 w-4 text-[#10B981]" />
                      <span className="text-sm font-medium">Charging Recommendation</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm mt-1 text-muted-foreground">
                    Charge to 80% tonight during off-peak hours (1:00 AM - 5:00 AM)
                  </p>
                </div>
                
                <div className="p-3 border rounded-lg bg-white">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">Health Advisory</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm mt-1 text-muted-foreground">
                    Consider cell balancing in next maintenance check
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Battery Tabs */}
        <Tabs defaultValue="health" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="charging">Charging</TabsTrigger>
            <TabsTrigger value="prediction">Prediction</TabsTrigger>
            <TabsTrigger value="cells">Cell Level</TabsTrigger>
          </TabsList>
          
          {/* Health Tab */}
          <TabsContent value="health" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-[#10B981]" />
                    Battery Health Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] flex items-center justify-center border bg-muted/20 rounded-md">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/60" />
                      <p className="mt-2 text-sm text-muted-foreground">Health trend visualization will appear here</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="p-2 border rounded-lg bg-gray-50">
                      <p className="text-xs text-muted-foreground">Health 6 months ago</p>
                      <p className="font-medium">95%</p>
                    </div>
                    <div className="p-2 border rounded-lg bg-gray-50">
                      <p className="text-xs text-muted-foreground">Estimated 6-month loss</p>
                      <p className="font-medium">4%</p>
                    </div>
                    <div className="p-2 border rounded-lg bg-gray-50">
                      <p className="text-xs text-muted-foreground">Cycles completed</p>
                      <p className="font-medium">127</p>
                    </div>
                    <div className="p-2 border rounded-lg bg-gray-50">
                      <p className="text-xs text-muted-foreground">Expected lifespan</p>
                      <p className="font-medium">8+ years</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#10B981]" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Energy Efficiency</span>
                        <span className="text-sm font-medium text-green-600">92%</span>
                      </div>
                      <Progress value={92} className="h-2" indicatorClassName="bg-green-500" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Range Efficiency</span>
                        <span className="text-sm font-medium text-green-600">89%</span>
                      </div>
                      <Progress value={89} className="h-2" indicatorClassName="bg-green-500" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Discharge Consistency</span>
                        <span className="text-sm font-medium text-amber-600">76%</span>
                      </div>
                      <Progress value={76} className="h-2" indicatorClassName="bg-amber-500" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Charge Acceptance</span>
                        <span className="text-sm font-medium text-green-600">94%</span>
                      </div>
                      <Progress value={94} className="h-2" indicatorClassName="bg-green-500" />
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                    <div className="flex gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Discharge Rate Anomaly</p>
                        <p className="text-xs text-amber-700 mt-1">
                          Inconsistent discharge rates detected during city driving. This may affect range prediction accuracy.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#10B981]" />
                  Usage Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-[700px]">
                    <div className="grid grid-cols-7 gap-1">
                      {batteryUsagePatterns.map((pattern, index) => (
                        <div key={index} className="space-y-1">
                          <div className="text-center text-xs text-muted-foreground">{pattern.time}</div>
                          <div className="h-32 bg-muted/20 rounded-md relative">
                            {/* Usage bar */}
                            <div 
                              className="absolute bottom-0 left-0 right-0 bg-[#10B981]/30 rounded-b-md transition-all"
                              style={{ height: `${pattern.usage}%` }}
                            >
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                                {pattern.usage}%
                              </div>
                            </div>
                            
                            {/* Range indicator */}
                            <div 
                              className="absolute left-0 right-0 h-px bg-blue-500" 
                              style={{ bottom: `${pattern.range}%` }}
                            >
                              <div className="absolute -right-14 -top-3 text-xs text-blue-600 whitespace-nowrap">
                                {Math.round(pattern.range * 3)}km
                              </div>
                            </div>
                            
                            {/* Temperature indicator */}
                            <div 
                              className={`absolute top-2 right-2 h-2 w-2 rounded-full
                                ${pattern.temperature > 35 ? 'bg-red-500' : 
                                  pattern.temperature > 25 ? 'bg-amber-500' : 'bg-green-500'}`}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <div>Morning</div>
                      <div>Mid-day</div>
                      <div>Evening</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-full bg-[#10B981]/30"></div>
                      <span className="text-xs">Usage</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-px w-4 bg-blue-500"></div>
                      <span className="text-xs">Range</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                      <span className="text-xs">Temp &gt; 25°C</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    View Full History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Charging Tab */}
          <TabsContent value="charging" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-2 shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BatteryCharging className="h-4 w-4 text-[#10B981]" />
                    Optimal Charging Plans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {chargePlans.map(plan => (
                      <div 
                        key={plan.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedPlan === plan.id 
                            ? 'border-[#10B981] bg-[#10B981]/5 shadow-sm' 
                            : 'hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            plan.id === 'optimal' ? 'bg-green-100' :
                            plan.id === 'quick' ? 'bg-amber-100' :
                            'bg-blue-100'
                          }`}>
                            {plan.icon}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium">{plan.name}</h3>
                              {plan.id === 'optimal' && (
                                <Badge className="bg-[#10B981]">Recommended</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                            
                            <div className="grid grid-cols-3 gap-2 mt-3">
                              <div>
                                <p className="text-xs text-muted-foreground">Time</p>
                                <p className="text-sm font-medium">{plan.suggestedTime}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Rate</p>
                                <p className="text-sm font-medium">{plan.electricityRate}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Impact</p>
                                <p className="text-sm font-medium">{plan.batteryImpact}</p>
                              </div>
                            </div>
                            
                            <p className="text-xs text-muted-foreground mt-3">{plan.recommendationReason}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="h-4 w-4 text-[#10B981]" />
                    Charging Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-base">Target Charge Level</Label>
                        <span className="text-sm font-medium">{targetCharge}%</span>
                      </div>
                      <Slider 
                        value={[targetCharge]} 
                        min={50} 
                        max={100} 
                        step={5}
                        onValueChange={(values) => setTargetCharge(values[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>50%</span>
                        <span>80%</span>
                        <span>100%</span>
                      </div>
                      <div className={`text-xs ${targetCharge > 80 ? 'text-amber-600' : 'text-green-600'}`}>
                        {targetCharge > 80 
                          ? 'Regularly charging above 80% may reduce battery lifespan'
                          : 'Optimal for battery longevity'}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-base">Charging Speed</Label>
                      <Select value={chargingSpeed} onValueChange={setChargingSpeed}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select charging speed" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slow">Eco (Slow)</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="fast">Fast</SelectItem>
                          <SelectItem value="max">Maximum</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="text-xs text-muted-foreground">
                        {chargingSpeed === 'slow' && 'Lowest heat generation, best for battery health'}
                        {chargingSpeed === 'standard' && 'Balanced charging speed and battery health'}
                        {chargingSpeed === 'fast' && 'Faster charging with moderate impact on battery'}
                        {chargingSpeed === 'max' && 'Fastest charging, may increase battery degradation'}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-base">Schedule Type</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="border rounded-lg p-3 flex items-center gap-2 cursor-pointer bg-[#10B981]/5 border-[#10B981]">
                          <Moon className="h-4 w-4 text-[#10B981]" />
                          <span className="text-sm">Off-Peak Hours</span>
                        </div>
                        <div className="border rounded-lg p-3 flex items-center gap-2 cursor-pointer">
                          <Sun className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Immediate</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full gap-1 bg-[#10B981] hover:bg-green-700">
                      <Lightning className="h-4 w-4" />
                      Apply Charging Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-[#10B981]" />
                  Cost Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="aspect-[4/3] flex items-center justify-center border bg-muted/20 rounded-md">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/60" />
                      <p className="mt-2 text-sm text-muted-foreground">Electricity rate chart will appear here</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-[#10B981]/5 border border-[#10B981]/20 rounded-lg">
                      <h3 className="font-medium flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-[#10B981]" />
                        Projected Monthly Savings
                      </h3>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Current</p>
                          <p className="text-lg font-medium">₹2,850</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Optimized</p>
                          <p className="text-lg font-medium text-[#10B981]">₹1,980</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-sm text-[#10B981]">
                        <TrendingDown className="h-3.5 w-3.5" />
                        <span className="font-medium">₹870 (30.5%)</span>
                        <span>monthly savings</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Peak Hours to Avoid</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-full bg-red-100">
                              <Clock className="h-3.5 w-3.5 text-red-600" />
                            </div>
                            <span className="text-sm">Morning Peak</span>
                          </div>
                          <span className="text-sm font-medium">7:00 AM - 9:00 AM</span>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-full bg-red-100">
                              <Clock className="h-3.5 w-3.5 text-red-600" />
                            </div>
                            <span className="text-sm">Evening Peak</span>
                          </div>
                          <span className="text-sm font-medium">6:00 PM - 10:00 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Prediction Tab */}
          <TabsContent value="prediction" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Route className="h-4 w-4 text-[#10B981]" />
                    Range Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-[#10B981]/10 to-transparent">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-white">
                          <Route className="h-6 w-6 text-[#10B981]" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Predicted Range</p>
                          <div className="flex items-baseline">
                            <span className="text-3xl font-semibold">187</span>
                            <span className="text-lg ml-1">km</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Based on current driving patterns and conditions</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Range Factors</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Thermometer className="h-4 w-4 text-amber-500" />
                            <span className="text-sm">Temperature</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                            <span className="text-sm font-medium">-8%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">Terrain</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                            <span className="text-sm font-medium">-5%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-purple-500" />
                            <span className="text-sm">Driving Style</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                            <span className="text-sm font-medium">+3%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">Weather Advisory</p>
                          <p className="text-xs text-amber-700 mt-1">
                            Forecasted low temperatures tonight may temporarily reduce range by an additional 10-15%.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#10B981]" />
                    Longevity Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="aspect-[4/3] flex items-center justify-center border bg-muted/20 rounded-md">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/60" />
                        <p className="mt-2 text-sm text-muted-foreground">Capacity prediction chart will appear here</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 border rounded-lg">
                        <p className="text-xs text-muted-foreground">Current Capacity</p>
                        <p className="text-lg font-medium">91%</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-xs text-muted-foreground">1-Year Forecast</p>
                        <p className="text-lg font-medium">85%</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-xs text-muted-foreground">Expected Replacement</p>
                        <p className="text-lg font-medium">8+ years</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-xs text-muted-foreground">Health Score</p>
                        <p className="text-lg font-medium text-green-600">A+</p>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-[#10B981]/5 border-[#10B981]/20">
                      <h3 className="font-medium flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-[#10B981]" />
                        Optimized Battery Lifespan
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Following our charging recommendations could extend your battery life by up to 24 months beyond standard usage patterns.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Standard</p>
                          <p className="text-lg font-medium">6.5 years</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Optimized</p>
                          <p className="text-lg font-medium text-[#10B981]">8.5 years</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="h-4 w-4 text-[#10B981]" />
                  Optimization Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {optimizationRecommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${rec.bgColor}`}>
                        {rec.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-[#10B981]">
                          <TrendingUp className="h-3 w-3" />
                          <span>Potential improvement: {rec.improvement}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="flex-shrink-0 h-8">
                        Apply
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Cell Level Tab */}
          <TabsContent value="cells" className="space-y-4 pt-4">
            <Card className="shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Battery className="h-4 w-4 text-[#10B981]" />
                  Cell-Level Health Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-[700px]">
                    <div className="grid grid-cols-3 gap-4">
                      {[...Array(3)].map((_, row) => (
                        <div key={row} className="space-y-3">
                          {batteryCells.slice(row * 4, (row + 1) * 4).map((cell, idx) => (
                            <div 
                              key={idx} 
                              className={`p-3 border rounded-lg ${
                                cell.status === 'optimal' ? 'border-green-200 bg-green-50' :
                                cell.status === 'good' ? 'border-blue-200 bg-blue-50' :
                                cell.status === 'attention' ? 'border-amber-200 bg-amber-50' :
                                'border-red-200 bg-red-50'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium">Cell {cell.id}</span>
                                <Badge 
                                  variant="outline" 
                                  className={
                                    cell.status === 'optimal' ? 'bg-green-100 text-green-800 border-green-200' :
                                    cell.status === 'good' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                    cell.status === 'attention' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                    'bg-red-100 text-red-800 border-red-200'
                                  }
                                >
                                  {cell.status.charAt(0).toUpperCase() + cell.status.slice(1)}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-1 text-sm">
                                <div>
                                  <p className="text-xs text-muted-foreground">Health</p>
                                  <p className={
                                    cell.health >= 90 ? 'text-green-600' :
                                    cell.health >= 80 ? 'text-blue-600' :
                                    cell.health >= 70 ? 'text-amber-600' :
                                    'text-red-600'
                                  }>{cell.health}%</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Voltage</p>
                                  <p>{cell.voltage}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Temperature</p>
                                  <p>{cell.temperature}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Charge</p>
                                  <p>{cell.chargeLevel}%</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 bg-[#10B981]/5 border border-[#10B981]/20 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-2">
                          <Zap className="h-5 w-5 text-[#10B981]" />
                          <div>
                            <p className="font-medium">Cell Balance Status</p>
                            <p className="text-sm text-muted-foreground">
                              Minor imbalance detected in module 2. Cell balancing recommended during next charging cycle.
                            </p>
                          </div>
                        </div>
                        <Button size="sm" className="gap-1 bg-[#10B981] hover:bg-green-700">
                          <Lightning className="h-3.5 w-3.5" />
                          Balance Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between items-center">
              <Button variant="outline" className="gap-1">
                <Download className="h-4 w-4" />
                Export Cell Data
              </Button>
              <Button className="gap-1 bg-[#10B981] hover:bg-green-700">
                <Settings className="h-4 w-4" />
                Advanced Cell Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Battery data updated every 15 minutes
        </div>
        <Button variant="outline" className="gap-1">
          <Settings className="h-4 w-4" />
          Preferences
        </Button>
      </CardFooter>
    </Card>
  );
};

// Sample data
// Optimal charging plans
const chargePlans: ChargePlan[] = [
  {
    id: 'optimal',
    name: 'Overnight Economy',
    icon: <Moon className="h-5 w-5 text-green-600" />,
    description: 'Charge during off-peak hours for maximum cost savings and battery health.',
    suggestedTime: '1:00 AM - 5:00 AM',
    electricityRate: '₹4.20/kWh',
    batteryImpact: 'Minimal',
    benefits: [
      'Lowest electricity cost',
      'Cooler ambient temperature',
      'Gentle charging rate',
      'Maximum battery longevity'
    ],
    recommendationReason: 'Recommended based on your usage patterns and tomorrow\'s planned trips.'
  },
  {
    id: 'quick',
    name: 'Balanced Daytime',
    icon: <Sun className="h-5 w-5 text-amber-600" />,
    description: 'Balance charging speed with cost during standard rate hours.',
    suggestedTime: '2:00 PM - 5:00 PM',
    electricityRate: '₹7.80/kWh',
    batteryImpact: 'Moderate',
    benefits: [
      'Moderate electricity cost',
      'Faster charging time',
      'Ready for evening use'
    ],
    recommendationReason: 'Good option if you need the vehicle ready by evening.'
  },
  {
    id: 'instant',
    name: 'Rapid Charge',
    icon: <Zap className="h-5 w-5 text-blue-600" />,
    description: 'Maximum charging speed for immediate availability.',
    suggestedTime: 'Immediate',
    electricityRate: '₹8.50/kWh',
    batteryImpact: 'Higher',
    benefits: [
      'Fastest charging time',
      'Immediate availability',
      'Maximum convenience'
    ],
    recommendationReason: 'Use only when immediate charge is necessary for unplanned trips.'
  }
];

// Weekly battery usage patterns
const batteryUsagePatterns: BatteryUsagePattern[] = [
  { time: 'Monday', usage: 65, temperature: 28, range: 65 },
  { time: 'Tuesday', usage: 42, temperature: 26, range: 75 },
  { time: 'Wednesday', usage: 78, temperature: 32, range: 60 },
  { time: 'Thursday', usage: 55, temperature: 29, range: 70 },
  { time: 'Friday', usage: 82, temperature: 34, range: 50 },
  { time: 'Saturday', usage: 35, temperature: 25, range: 80 },
  { time: 'Sunday', usage: 25, temperature: 22, range: 85 }
];

// Battery cell data
const batteryCells: BatteryCell[] = [
  { id: 'A1', health: 93, voltage: '3.87V', temperature: '28°C', chargeLevel: 42, status: 'optimal' },
  { id: 'A2', health: 91, voltage: '3.85V', temperature: '29°C', chargeLevel: 41, status: 'optimal' },
  { id: 'A3', health: 94, voltage: '3.86V', temperature: '27°C', chargeLevel: 44, status: 'optimal' },
  { id: 'A4', health: 90, voltage: '3.84V', temperature: '28°C', chargeLevel: 42, status: 'optimal' },
  { id: 'B1', health: 88, voltage: '3.82V', temperature: '30°C', chargeLevel: 40, status: 'good' },
  { id: 'B2', health: 85, voltage: '3.79V', temperature: '31°C', chargeLevel: 39, status: 'good' },
  { id: 'B3', health: 78, voltage: '3.72V', temperature: '32°C', chargeLevel: 36, status: 'attention' },
  { id: 'B4', health: 89, voltage: '3.83V', temperature: '29°C', chargeLevel: 41, status: 'good' },
  { id: 'C1', health: 92, voltage: '3.85V', temperature: '28°C', chargeLevel: 43, status: 'optimal' },
  { id: 'C2', health: 91, voltage: '3.84V', temperature: '29°C', chargeLevel: 42, status: 'optimal' },
  { id: 'C3', health: 87, voltage: '3.81V', temperature: '30°C', chargeLevel: 40, status: 'good' },
  { id: 'C4', health: 86, voltage: '3.80V', temperature: '30°C', chargeLevel: 39, status: 'good' },
];

// Optimization recommendations
const optimizationRecommendations = [
  {
    title: 'Charge During Cooler Hours',
    description: 'Schedule charging between 11 PM and 6 AM when ambient temperatures are lower to reduce heat-related degradation.',
    improvement: '+8% longevity',
    icon: <Moon className="h-5 w-5 text-purple-600" />,
    bgColor: 'bg-purple-100'
  },
  {
    title: 'Avoid Extended High State of Charge',
    description: 'Reduce target charge to 80% for daily use to minimize calendar aging effect on battery cells.',
    improvement: '+12% longevity',
    icon: <Battery className="h-5 w-5 text-blue-600" />,
    bgColor: 'bg-blue-100'
  },
  {
    title: 'Reduce DC Fast Charging Frequency',
    description: 'Limit DC fast charging to once per week to reduce thermal stress on battery cells.',
    improvement: '+5% longevity',
    icon: <Zap className="h-5 w-5 text-amber-600" />,
    bgColor: 'bg-amber-100'
  }
];

// Using the Lightning icon imported at the top of the file

export default PredictiveBatteryHealth;