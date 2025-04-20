import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EnergyUsage from '@/components/energy/energy-usage';

// Sample data
const hourlyData = [
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

const Energy = () => {
  const [timeFrame, setTimeFrame] = useState<'hour' | 'day' | 'week' | 'month'>('hour');
  
  // In a real application, you would fetch this data from an API
  // Here we're using mock data for demonstration
  const { data, isLoading } = useQuery({
    queryKey: ['/api/energy-usage', timeFrame],
    queryFn: () => Promise.resolve({
      hourlyData,
      totalKwh: 22,
      totalCost: 128,
      homePercent: 50,
      chargingPercent: 26,
      otherPercent: 24
    })
  });
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-dark lg:block hidden">Energy Usage</h2>
        <p className="text-neutral-light mt-1">Monitor and analyze your vehicle's energy consumption</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isLoading ? (
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <EnergyUsage
              hourlyData={data?.hourlyData}
              timeFrame={timeFrame}
              totalKwh={data?.totalKwh}
              totalCost={data?.totalCost}
              homePercent={data?.homePercent}
              chargingPercent={data?.chargingPercent}
              otherPercent={data?.otherPercent}
            />
          )}
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Energy Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                    <span>Home</span>
                  </div>
                  <span className="font-semibold">50%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                    <span>Public Charging</span>
                  </div>
                  <span className="font-semibold">26%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-neutral-light mr-2"></div>
                    <span>Work/Other</span>
                  </div>
                  <span className="font-semibold">24%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Energy Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Charge during off-peak hours to save money</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Maintain proper tire pressure to improve efficiency</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Use eco mode when possible for better range</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Pre-condition your vehicle while plugged in</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-light mb-1">vs Last Month</p>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-1">↓</span>
                    <span className="font-semibold">12%</span>
                    <span className="text-neutral-light text-sm ml-1">Less Energy Used</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-neutral-light mb-1">vs Average User</p>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-1">↓</span>
                    <span className="font-semibold">8%</span>
                    <span className="text-neutral-light text-sm ml-1">Below Average</span>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-4">View Detailed Report</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Energy;
