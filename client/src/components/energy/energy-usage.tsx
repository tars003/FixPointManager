import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Settings, Calendar, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface EnergyData {
  name: string;
  value: number;
  cost: number;
  home: number;
  charging: number;
  other: number;
}

interface EnergyUsageProps {
  hourlyData?: EnergyData[];
  timeFrame?: 'hour' | 'day' | 'week' | 'month';
  totalKwh?: number;
  totalCost?: number;
  homePercent?: number;
  chargingPercent?: number;
  otherPercent?: number;
}

const defaultHourlyData: EnergyData[] = [
  { name: '0', value: 10, cost: 12.5, home: 6, charging: 3, other: 1 },
  { name: '1', value: 12, cost: 15.0, home: 7, charging: 3, other: 2 },
  { name: '2', value: 18, cost: 22.5, home: 8, charging: 8, other: 2 },
  { name: '3', value: 15, cost: 18.75, home: 6, charging: 6, other: 3 },
  { name: '4', value: 8, cost: 10.0, home: 5, charging: 2, other: 1 },
  { name: '5', value: 22, cost: 27.5, home: 16, charging: 4, other: 2 },
  { name: '6', value: 24, cost: 30.0, home: 18, charging: 3, other: 3 },
  { name: '7', value: 20, cost: 25.0, home: 8, charging: 9, other: 3 },
  { name: '8', value: 16, cost: 20.0, home: 8, charging: 5, other: 3 },
  { name: '9', value: 20, cost: 25.0, home: 6, charging: 10, other: 4 },
  { name: '10', value: 22, cost: 27.5, home: 12, charging: 7, other: 3 },
];

const EnergyUsage = ({
  hourlyData = defaultHourlyData,
  timeFrame = 'hour',
  totalKwh = 22,
  totalCost = 128,
  homePercent = 50,
  chargingPercent = 26,
  otherPercent = 24,
}: EnergyUsageProps) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<'hour' | 'day' | 'week' | 'month'>(timeFrame);
  const [rentalTypePosition, setRentalTypePosition] = useState(75); // Percentage position of dot from left

  const timeFrameOptions = {
    hour: 'Last Hour',
    day: 'Today',
    week: 'This Week',
    month: 'This Month',
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Energy Usage</CardTitle>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-neutral-dark font-medium">{timeFrameOptions[selectedTimeFrame]}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-neutral-light">
                  <Calendar className="h-4 w-4 mr-1" />
                  {timeFrameOptions[selectedTimeFrame]}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSelectedTimeFrame('hour')}>Last Hour</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedTimeFrame('day')}>Today</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedTimeFrame('week')}>This Week</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedTimeFrame('month')}>This Month</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-3xl font-bold">{totalKwh}<span className="text-lg font-normal text-neutral-light ml-1">kWh</span></p>
            <p className="text-2xl font-bold">${totalCost}</p>
          </div>
        </div>
        
        <div className="mb-8 mt-6 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={hourlyData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              barGap={2}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'charging') return [`${value} kWh`, 'Charging'];
                  if (name === 'home') return [`${value} kWh`, 'Home'];
                  return [`${value} kWh`, name];
                }}
                itemStyle={{ textTransform: 'capitalize' }}
              />
              <Bar dataKey="home" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} />
              <Bar dataKey="charging" stackId="a" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              <Bar dataKey="other" stackId="a" fill="#9ca3af" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
            <div>
              <p className="font-semibold">{homePercent}%</p>
              <p className="text-sm text-neutral-light">Home</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
            <div>
              <p className="font-semibold">{chargingPercent}%</p>
              <p className="text-sm text-neutral-light">Charging</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-neutral-light mr-2"></div>
            <div>
              <p className="font-semibold">{otherPercent}%</p>
              <p className="text-sm text-neutral-light">Other</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-neutral-dark font-medium mb-4">Rental Type</h3>
          <div className="relative h-1 bg-gray-200 rounded-full mb-2">
            <div 
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${rentalTypePosition}%` }}
            >
              <div className="w-4 h-4 rounded-full border-4 border-red-400 bg-white"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-neutral-light">
            <span>Hourly</span>
            <span>Daily</span>
            <span>Monthly</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyUsage;
