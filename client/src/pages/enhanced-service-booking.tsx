import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SimplifiedServiceCatalog from '@/components/service-booking/SimplifiedServiceCatalog';
import RealTimeTracking from '@/components/service-booking/real-time-tracking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, ShoppingCart, Calendar, ChevronDown, 
  Gauge, Settings, Clock, BookOpen
} from 'lucide-react';

const EnhancedServiceBookingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('catalog');

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vehicle Care Hub</h1>
        <p className="text-gray-600">Book, track, and learn about services for your vehicle</p>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList className="grid grid-cols-2 w-fit p-1">
            <TabsTrigger value="catalog" className="px-4 py-2 text-sm flex gap-2 items-center">
              <Search className="h-4 w-4" />
              Service Catalog
            </TabsTrigger>
            <TabsTrigger value="tracking" className="px-4 py-2 text-sm flex gap-2 items-center">
              <Gauge className="h-4 w-4" />
              Real-Time Tracking
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-3">
            <Badge variant="outline" className="py-1 px-3 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Upcoming: 2</span>
            </Badge>
            <Badge variant="outline" className="py-1 px-3 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Active: 1</span>
            </Badge>
            <Badge variant="outline" className="py-1 px-3 flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span>Services: 8</span>
            </Badge>
            <Badge variant="outline" className="py-1 px-3 flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>History</span>
              <ChevronDown className="h-3 w-3 ml-1" />
            </Badge>
          </div>
        </div>
        
        <TabsContent value="catalog" className="m-0 space-y-6">
          <Card className="mt-0">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl">Service Catalog</CardTitle>
              <CardDescription>Find and book professional services for your vehicle</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <SimplifiedServiceCatalog />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tracking" className="m-0 space-y-6">
          <Card className="mt-0">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl">Real-Time Service Tracking</CardTitle>
              <CardDescription>Track your service status and communicate with technicians</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <RealTimeTracking />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedServiceBookingPage;