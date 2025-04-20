import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Customer } from '@shared/schema';
import { Users, TrendingUp, RefreshCw, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import StatsCard from '@/components/dashboard/stats-card';
import CustomersTable from '@/components/dashboard/customers-table';

// Sample data for demonstration
const newCustomersData = [
  { name: 'Jan', value: 140 },
  { name: 'Feb', value: 160 },
  { name: 'Mar', value: 130 },
  { name: 'Apr', value: 170 },
  { name: 'May', value: 150 },
  { name: 'Jun', value: 190 },
  { name: 'Jul', value: 210 },
  { name: 'Aug', value: 180 },
  { name: 'Sep', value: 160 },
  { name: 'Oct', value: 185 },
  { name: 'Nov', value: 195 },
  { name: 'Dec', value: 175 },
];

const retentionData = [
  { name: 'Jan', value: 52 },
  { name: 'Feb', value: 48 },
  { name: 'Mar', value: 50 },
  { name: 'Apr', value: 55 },
  { name: 'May', value: 53 },
  { name: 'Jun', value: 58 },
  { name: 'Jul', value: 56 },
  { name: 'Aug', value: 54 },
  { name: 'Sep', value: 52 },
  { name: 'Oct', value: 57 },
  { name: 'Nov', value: 58 },
  { name: 'Dec', value: 62 },
];

const repeatCustomersData = [
  { name: 'Jan', value: 650 },
  { name: 'Feb', value: 680 },
  { name: 'Mar', value: 700 },
  { name: 'Apr', value: 720 },
  { name: 'May', value: 750 },
  { name: 'Jun', value: 770 },
  { name: 'Jul', value: 800 },
  { name: 'Aug', value: 830 },
  { name: 'Sep', value: 850 },
  { name: 'Oct', value: 880 },
  { name: 'Nov', value: 920 },
  { name: 'Dec', value: 980 },
];

const serviceTypeData = [
  { name: 'Oil Change', value: 320 },
  { name: 'Brake Service', value: 180 },
  { name: 'Tire Rotation', value: 220 },
  { name: 'Engine Repair', value: 120 },
  { name: 'Transmission', value: 90 },
  { name: 'Inspection', value: 310 },
];

const Dashboard = () => {
  // For a real app, you'd fetch this from the user context or API
  const currentUser = {
    id: 1,
    fullName: "Joseph Schiefer",
    initials: "JS",
    role: "provider"
  };
  
  const { data: customers, isLoading: isLoadingCustomers } = useQuery<Customer[]>({
    queryKey: [`/api/customers/${currentUser.id}`],
  });
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="lg:flex lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-dark">Dashboard</h2>
          <p className="text-neutral-light">Good morning, {currentUser.fullName}</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-neutral-light" />
            </div>
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title="New Customers"
          value="175.4"
          icon={<Users />}
          description="Avg. per month"
          chart={
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary-light">
                    Monthly: 95%
                  </span>
                </div>
              </div>
              <div className="flex h-2 overflow-hidden rounded-full bg-primary-light">
                <div style={{ width: '95%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
              </div>
            </div>
          }
        />
        
        <StatsCard
          title="Retention Rate"
          value="57.4%"
          icon={<TrendingUp />}
          change={{
            value: 4.8,
            isPositive: true
          }}
          chart={
            <ResponsiveContainer width="100%" height={40}>
              <AreaChart data={retentionData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#bfdbfe" />
              </AreaChart>
            </ResponsiveContainer>
          }
          iconBgClass="bg-secondary-light"
          iconColorClass="text-secondary"
        />
        
        <StatsCard
          title="Repeat Customers"
          value="892"
          icon={<RefreshCw />}
          change={{
            value: 12.1,
            isPositive: true
          }}
          chart={
            <ResponsiveContainer width="100%" height={40}>
              <AreaChart data={repeatCustomersData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Area type="monotone" dataKey="value" stroke="#f59e0b" fill="#fef3c7" />
              </AreaChart>
            </ResponsiveContainer>
          }
          iconBgClass="bg-accent-light"
          iconColorClass="text-accent"
        />
      </div>
      
      {/* Revenue & Services Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Monthly Revenue</h3>
              <Button variant="outline" size="sm">
                This Year
              </Button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={newCustomersData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Area type="monotone" dataKey="value" stroke="#10b981" fill="#d1fae5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Services Provided</h3>
              <Button variant="outline" size="sm">
                This Month
              </Button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceTypeData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Customers Table */}
      <CustomersTable providerId={currentUser.id} />
    </div>
  );
};

export default Dashboard;
