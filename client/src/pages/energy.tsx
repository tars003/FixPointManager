import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Car, 
  Battery, 
  Zap, 
  Flame, 
  Droplet, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronDown,
  Calendar,
  Clock,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Vehicle } from '@shared/schema';
import { formatPercent, formatDistance } from '@/lib/format';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data for charts
const consumptionData = [
  { date: 'Jan', kwhPer100km: 19.2, avgTemp: 7 },
  { date: 'Feb', kwhPer100km: 18.8, avgTemp: 8 },
  { date: 'Mar', kwhPer100km: 17.2, avgTemp: 12 },
  { date: 'Apr', kwhPer100km: 16.8, avgTemp: 15 },
  { date: 'May', kwhPer100km: 16.1, avgTemp: 18 },
  { date: 'Jun', kwhPer100km: 15.8, avgTemp: 22 },
  { date: 'Jul', kwhPer100km: 15.7, avgTemp: 25 },
  { date: 'Aug', kwhPer100km: 15.9, avgTemp: 24 },
  { date: 'Sep', kwhPer100km: 16.5, avgTemp: 20 },
  { date: 'Oct', kwhPer100km: 17.1, avgTemp: 15 },
  { date: 'Nov', kwhPer100km: 18.4, avgTemp: 10 },
  { date: 'Dec', kwhPer100km: 19.5, avgTemp: 6 },
];

const dailyChargingData = [
  { name: 'Mon', home: 12, public: 8 },
  { name: 'Tue', home: 10, public: 0 },
  { name: 'Wed', home: 15, public: 0 },
  { name: 'Thu', home: 8, public: 12 },
  { name: 'Fri', home: 10, public: 5 },
  { name: 'Sat', home: 5, public: 15 },
  { name: 'Sun', home: 20, public: 0 },
];

const batteryUsageData = [
  { name: 'Driving', value: 75 },
  { name: 'Climate', value: 15 },
  { name: 'Electronics', value: 10 },
];

const COLORS = ['#3B82F6', '#F97316', '#8B5CF6'];

// Custom tooltip for the charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border shadow-sm rounded-md">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value} {entry.unit || 'kWh'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const EnergyPage = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('consumption');
  const [selectedVehicle, setSelectedVehicle] = useState<number>(0);
  
  // Mock data for user
  const user = {
    name: 'Raj',
    id: 1
  };
  
  // Fetch user's electric vehicles
  const { data: vehicles = [], isLoading } = useQuery<Vehicle[]>({
    queryKey: ['/api/vehicles', { userId: user.id }],
    enabled: !!user.id,
    select: (data) => data.filter(vehicle => vehicle.fuelType === 'electric')
  });

  // Mock battery data
  const batteryData = {
    currentCharge: 78,
    range: 264,
    efficiency: 16.8,
    lastCharged: 'Today, 6:32 AM',
    chargingRate: 8.5,
    totalSaved: 825,
    co2Reduced: 1240
  };
  
  return (
    <div className="container px-4 py-6 max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-dark">Energy Usage</h1>
          <p className="text-neutral-light mt-1">
            Track and analyze your electric vehicle's energy consumption
          </p>
        </div>
        
        {vehicles && vehicles.length > 0 && (
          <div className="flex gap-2">
            {vehicles.map((vehicle, index) => (
              <Button
                key={vehicle.id}
                variant={selectedVehicle === index ? "default" : "outline"}
                className="flex items-center gap-2"
                onClick={() => setSelectedVehicle(index)}
              >
                <Car className="h-4 w-4" />
                <span>{vehicle.name}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : vehicles && vehicles.length > 0 ? (
        <>
          {/* Battery Status Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Current Charge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-2">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Battery className="h-16 w-16 text-primary" />
                      </div>
                      <svg
                        viewBox="0 0 100 100"
                        className="transform -rotate-90 w-full h-full"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#f1f5f9"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="rgb(var(--primary))"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 45}`}
                          strokeDashoffset={
                            2 * Math.PI * 45 * (1 - batteryData.currentCharge / 100)
                          }
                        />
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{batteryData.currentCharge}%</div>
                      <p className="text-sm text-neutral-light">Est. Range: {batteryData.range} km</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Zap className="h-10 w-10 mr-4 text-yellow-500" />
                  <div>
                    <div className="text-2xl font-bold">{batteryData.efficiency}</div>
                    <p className="text-sm text-neutral-light">kWh/100km</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <div className={`flex items-center ${batteryData.efficiency < 17 ? 'text-green-500' : 'text-red-500'}`}>
                    {batteryData.efficiency < 17 ? (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    )}
                    <span>{Math.abs(17 - batteryData.efficiency).toFixed(1)} kWh from avg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Last Charged</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <Clock className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xl font-semibold">{batteryData.lastCharged}</div>
                    <p className="text-sm text-neutral-light">at {batteryData.chargingRate} kW</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Environmental Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <Droplet className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-xl font-semibold">₹{batteryData.totalSaved}</div>
                    <p className="text-sm text-neutral-light flex items-center">
                      <Flame className="h-3 w-3 mr-1 text-red-500" />
                      <span>{batteryData.co2Reduced} kg CO₂ saved</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Tabs for different reports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Tabs 
              defaultValue="consumption" 
              className="space-y-4"
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-3 w-full md:w-auto">
                <TabsTrigger value="consumption">
                  <Zap className="h-4 w-4 mr-2" />
                  Consumption
                </TabsTrigger>
                <TabsTrigger value="charging">
                  <Battery className="h-4 w-4 mr-2" />
                  Charging
                </TabsTrigger>
                <TabsTrigger value="usage">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Usage
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="consumption" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Energy Consumption</CardTitle>
                    <CardDescription>
                      Monthly energy consumption in kWh/100km vs average temperature
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={consumptionData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip content={<CustomTooltip />} />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="kwhPer100km"
                            stroke="#3B82F6"
                            name="Energy Consumption"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                            unit=" kWh/100km"
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="avgTemp"
                            stroke="#F97316"
                            name="Average Temperature"
                            strokeWidth={2}
                            unit="°C"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center space-x-8 mt-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm text-neutral-light">Energy Consumption</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                        <span className="text-sm text-neutral-light">Average Temperature</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Efficiency Factors</CardTitle>
                      <CardDescription>
                        What affects your energy efficiency
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 mr-3 flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-blue-500" />
                            </div>
                            <span>Climate Control</span>
                          </div>
                          <span className="text-red-500">+2.3 kWh/100km</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-100 mr-3 flex items-center justify-center">
                              <Droplet className="h-4 w-4 text-green-500" />
                            </div>
                            <span>Regenerative Braking</span>
                          </div>
                          <span className="text-green-500">-1.8 kWh/100km</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-purple-100 mr-3 flex items-center justify-center">
                              <Zap className="h-4 w-4 text-purple-500" />
                            </div>
                            <span>Driving Style</span>
                          </div>
                          <span className="text-red-500">+0.9 kWh/100km</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Efficiency Tips</CardTitle>
                      <CardDescription>
                        How to improve your range
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-blue-100 mr-3 flex items-center justify-center shrink-0">
                            <span className="font-bold text-blue-500">1</span>
                          </div>
                          <div>
                            <p className="font-semibold">Maintain eco driving habits</p>
                            <p className="text-sm text-neutral-light">Gradual acceleration and braking can improve efficiency by up to 15%</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-green-100 mr-3 flex items-center justify-center shrink-0">
                            <span className="font-bold text-green-500">2</span>
                          </div>
                          <div>
                            <p className="font-semibold">Use climate timers</p>
                            <p className="text-sm text-neutral-light">Pre-condition while plugged in to save battery for driving</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-purple-100 mr-3 flex items-center justify-center shrink-0">
                            <span className="font-bold text-purple-500">3</span>
                          </div>
                          <div>
                            <p className="font-semibold">Check tire pressure</p>
                            <p className="text-sm text-neutral-light">Proper inflation can improve range by 3-7%</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="charging" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Charging History</CardTitle>
                    <CardDescription>
                      Where and when you charge your vehicle
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={dailyChargingData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="home"
                            stackId="1"
                            stroke="#3B82F6"
                            fill="#3B82F6"
                            name="Home Charging"
                            unit=" kWh"
                          />
                          <Area
                            type="monotone"
                            dataKey="public"
                            stackId="1"
                            stroke="#F97316"
                            fill="#F97316"
                            name="Public Charging"
                            unit=" kWh"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center space-x-8 mt-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm text-neutral-light">Home Charging</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                        <span className="text-sm text-neutral-light">Public Charging</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Charging Stations</CardTitle>
                      <CardDescription>
                        Your most frequently used stations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 mr-3 flex items-center justify-center">
                              <Zap className="h-4 w-4 text-blue-500" />
                            </div>
                            <div>
                              <p className="font-medium">Home Charger</p>
                              <p className="text-xs text-neutral-light">7.4 kW AC • 80% usage</p>
                            </div>
                          </div>
                          <span className="text-sm">245 kWh</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-orange-100 mr-3 flex items-center justify-center">
                              <Zap className="h-4 w-4 text-orange-500" />
                            </div>
                            <div>
                              <p className="font-medium">MG Fast Charger</p>
                              <p className="text-xs text-neutral-light">50 kW DC • 12% usage</p>
                            </div>
                          </div>
                          <span className="text-sm">56 kWh</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-100 mr-3 flex items-center justify-center">
                              <Zap className="h-4 w-4 text-green-500" />
                            </div>
                            <div>
                              <p className="font-medium">Tata Power</p>
                              <p className="text-xs text-neutral-light">22 kW AC • 8% usage</p>
                            </div>
                          </div>
                          <span className="text-sm">35 kWh</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Charging Cost</CardTitle>
                      <CardDescription>
                        Your charging expenses this month
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-4xl font-bold text-primary mb-2">₹720</div>
                        <p className="text-sm text-neutral-light mb-4">Total charging cost</p>
                        
                        <div className="w-full space-y-2 mt-2">
                          <div className="flex justify-between text-sm">
                            <span>Home charging</span>
                            <span className="font-medium">₹560 (78%)</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                          </div>
                          
                          <div className="flex justify-between text-sm mt-3">
                            <span>Public charging</span>
                            <span className="font-medium">₹160 (22%)</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: '22%' }}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="usage" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Battery Usage</CardTitle>
                      <CardDescription>
                        How your battery energy is used
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={batteryUsageData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {batteryUsageData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex justify-center space-x-6 mt-4">
                        {batteryUsageData.map((entry, index) => (
                          <div key={index} className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            <span className="text-sm text-neutral-light">{entry.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                      <CardDescription>
                        Key performance indicators
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Battery Health</span>
                            <span className="text-sm font-medium text-green-500">98%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Range Efficiency</span>
                            <span className="text-sm font-medium text-blue-500">92%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Charging Efficiency</span>
                            <span className="text-sm font-medium text-purple-500">88%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <p className="text-sm font-medium mb-2">Monthly Summary</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-md">
                              <p className="text-xs text-neutral-light">Total Distance</p>
                              <p className="text-lg font-semibold">1,248 km</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-md">
                              <p className="text-xs text-neutral-light">Energy Used</p>
                              <p className="text-lg font-semibold">210 kWh</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Driving Statistics</CardTitle>
                    <CardDescription>
                      Your driving habits and efficiency
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Battery className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="text-xl font-bold">16.8</div>
                        </div>
                        <p className="text-sm text-neutral-light">kWh/100km</p>
                        <p className="text-xs text-green-500 mt-1">5% better than average</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="text-xl font-bold">22%</div>
                        </div>
                        <p className="text-sm text-neutral-light">Regeneration</p>
                        <p className="text-xs text-blue-500 mt-1">Recovered 46 kWh</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-purple-500" />
                          </div>
                          <div className="text-xl font-bold">82</div>
                        </div>
                        <p className="text-sm text-neutral-light">Trips This Month</p>
                        <p className="text-xs text-neutral-dark mt-1">15.2 km avg length</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <Flame className="h-5 w-5 text-orange-500" />
                          </div>
                          <div className="text-xl font-bold">78</div>
                        </div>
                        <p className="text-sm text-neutral-light">Eco Score</p>
                        <p className="text-xs text-green-500 mt-1">↑3 points from last month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <Battery className="h-8 w-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Electric Vehicles Found</h3>
          <p className="text-neutral-light mb-6 max-w-md mx-auto">
            It looks like you don't have any electric vehicles registered yet. 
            Add an electric vehicle to track energy usage and charging statistics.
          </p>
          
          <Button 
            onClick={() => navigate('/vehicle-vault')}
            className="bg-primary text-white hover:bg-primary-dark"
          >
            Add Electric Vehicle
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnergyPage;