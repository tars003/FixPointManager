import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Calendar, 
  File, 
  Tool, 
  Clock, 
  Edit, 
  Share2, 
  Plus, 
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';
import { useVehicles } from '@/hooks/use-vehicles';

const timelineEvents = [
  {
    id: 'purchase',
    title: 'Purchase',
    status: 'completed',
    date: '2023-01-15',
    description: 'Vehicle purchased from authorized dealer',
    icon: 'home'
  },
  {
    id: 'registration',
    title: 'Registration',
    status: 'completed',
    date: '2023-01-20',
    description: 'Vehicle registered with RTO',
    icon: 'file'
  },
  {
    id: 'first-service',
    title: 'First Service',
    status: 'completed',
    date: '2023-03-15',
    description: 'First service completed at 1,000 km',
    icon: 'tool'
  },
  {
    id: 'insurance-renewal',
    title: 'Insurance Renewal',
    status: 'upcoming',
    date: '2024-01-15',
    description: 'Annual insurance renewal due',
    icon: 'calendar'
  },
  {
    id: 'major-service',
    title: 'Major Service',
    status: 'upcoming',
    date: '2024-06-15',
    description: 'Major service due at 20,000 km',
    icon: 'tool'
  }
];

// Documents categorized
const vehicleDocuments = [
  {
    category: 'Registration',
    files: [
      { id: 1, name: 'RC Certificate', date: '2023-01-20', type: 'pdf' },
      { id: 2, name: 'Insurance Policy', date: '2023-01-16', type: 'pdf' }
    ]
  },
  {
    category: 'Service Records',
    files: [
      { id: 3, name: 'First Service Report', date: '2023-03-15', type: 'pdf' },
      { id: 4, name: 'Oil Change Receipt', date: '2023-06-10', type: 'jpg' }
    ]
  },
  {
    category: 'Invoices & Receipts',
    files: [
      { id: 5, name: 'Purchase Invoice', date: '2023-01-15', type: 'pdf' },
      { id: 6, name: 'Accessory Purchase', date: '2023-02-05', type: 'pdf' }
    ]
  }
];

const VehicleDetail = () => {
  const [, navigate] = useLocation();
  const [currentTab, setCurrentTab] = useState('timeline');
  const vehicleId = parseInt(window.location.pathname.split('/').pop() || '1');
  const { data: vehicles, isLoading } = useVehicles();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading vehicle details...</div>;
  }
  
  const vehicle = vehicles?.find(v => v.id === vehicleId);
  
  if (!vehicle) {
    return <div className="flex justify-center items-center h-screen">Vehicle not found</div>;
  }
  
  // Map timeline event icon to component
  const getTimelineIcon = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white">🏠</div>;
      case 'file':
        return <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white">📄</div>;
      case 'tool':
        return <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white">🔧</div>;
      case 'calendar':
        return <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white">📅</div>;
      default:
        return <div className="h-10 w-10 rounded-full bg-gray-500 flex items-center justify-center text-white">⚙️</div>;
    }
  };

  return (
    <div className="container px-4 py-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/vehicles')}
            className="mr-2 rounded-full hover:bg-gray-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
            {vehicle.make} {vehicle.model}
          </h1>
          <Badge className="ml-3 bg-gray-700 text-white">{vehicle.registrationNumber}</Badge>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex gap-1 items-center">
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button variant="outline" size="sm" className="flex gap-1 items-center">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </div>
      
      {/* Vehicle summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gray-800 border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Vehicle Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="w-full bg-gray-700 h-2 rounded-full mr-4">
                <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <span className="text-lg font-semibold">75%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Upcoming Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-yellow-500" />
              <span className="text-lg font-semibold">2 services due this month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 text-red-500">⚠️</div>
              <span className="text-lg font-semibold">1 urgent maintenance required</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for different vehicle info */}
      <Tabs 
        value={currentTab} 
        onValueChange={setCurrentTab}
        className="mb-8"
      >
        <TabsList className="bg-gray-800 border-none w-full justify-start overflow-x-auto mb-6">
          <TabsTrigger value="timeline" className="data-[state=active]:bg-gray-700">
            Vehicle Journey Timeline
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-gray-700">
            Documents
          </TabsTrigger>
          <TabsTrigger value="service" className="data-[state=active]:bg-gray-700">
            Service History
          </TabsTrigger>
          <TabsTrigger value="statistics" className="data-[state=active]:bg-gray-700">
            Statistics
          </TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-gray-700">
            Notes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="m-0">
          <Card className="bg-gray-800 border-none">
            <CardHeader>
              <CardTitle className="text-lg">
                Vehicle Journey Timeline
              </CardTitle>
              <p className="text-sm text-gray-400">
                Track your vehicle's complete lifecycle from purchase to future events
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto whitespace-nowrap mb-4">
                <div className="inline-flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-full bg-primary/10 text-primary border-primary/20">
                    All Events
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    Purchase & Initial Ownership
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    Regular Maintenance
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    Documentation Renewal
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    Repairs & Unexpected Events
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    Modifications & Updates
                  </Button>
                </div>
              </div>
              
              <div className="relative pl-10 pt-2 space-y-10">
                {/* Timeline line */}
                <div className="absolute left-4 top-2 bottom-10 w-0.5 bg-gray-700"></div>
                
                {timelineEvents.map((event, index) => (
                  <div key={event.id} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-6 mt-1.5">
                      {getTimelineIcon(event.icon)}
                    </div>
                    
                    <div className={`rounded-lg p-5 border ${
                      event.status === 'completed' ? 'border-green-800 bg-green-900/10' : 'border-purple-800 bg-purple-900/10'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            {event.title}
                            <Badge className={event.status === 'completed' ? 'bg-green-500' : 'bg-purple-500'}>
                              {event.status === 'completed' ? 'Completed' : 'Upcoming'}
                            </Badge>
                          </h3>
                          <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" /> 
                            {formatDate(new Date(event.date))}
                          </p>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-gray-300">
                        {event.description}
                      </p>
                      
                      {event.status === 'completed' && (
                        <div className="mt-3 text-green-500 text-sm">
                          ✓ Completed
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="ml-[-10px] flex items-center gap-1 w-64 justify-center rounded-lg border-dashed">
                  <Plus className="h-4 w-4" /> Add New Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="m-0">
          <Card className="bg-gray-800 border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Vehicle Documents</CardTitle>
                <p className="text-sm text-gray-400">All of your vehicle's important documents in one place</p>
              </div>
              <Button className="bg-primary text-black hover:bg-primary/90" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Document
              </Button>
            </CardHeader>
            <CardContent>
              {vehicleDocuments.map((category) => (
                <div key={category.category} className="mb-6">
                  <h3 className="text-gray-300 font-medium mb-3">{category.category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {category.files.map((file) => (
                      <div 
                        key={file.id} 
                        className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <div className="p-2 bg-gray-600 rounded-md mr-3">
                          {file.type === 'pdf' ? '📄' : '🖼️'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{file.name}</h4>
                          <p className="text-xs text-gray-400">{formatDate(new Date(file.date))}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="service">
          <Card className="bg-gray-800 border-none">
            <CardHeader>
              <CardTitle>Service History</CardTitle>
              <p className="text-sm text-gray-400">Records of all service and maintenance activities</p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">Service history section under development</h3>
                <p className="text-gray-400">We're working on bringing this feature to you soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="statistics">
          <Card className="bg-gray-800 border-none">
            <CardHeader>
              <CardTitle>Vehicle Statistics</CardTitle>
              <p className="text-sm text-gray-400">Key performance metrics and statistics</p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">Statistics section under development</h3>
                <p className="text-gray-400">We're working on bringing this feature to you soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card className="bg-gray-800 border-none">
            <CardHeader>
              <CardTitle>Notes & Reminders</CardTitle>
              <p className="text-sm text-gray-400">Your personal notes about this vehicle</p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">Notes section under development</h3>
                <p className="text-gray-400">We're working on bringing this feature to you soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleDetail;