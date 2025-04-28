import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommunityIntegration from '@/components/service-booking/community-integration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Calendar, ChevronDown, 
  Gauge, Settings, Clock, BookOpen, Users,
  Car, FileText, HeartPulse, Shield, FileImage
} from 'lucide-react';

const VehicleVault: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('community');

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vehicle Vault</h1>
        <p className="text-gray-600">Your complete vehicle records, history, and community knowledge</p>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList className="grid grid-cols-5 w-fit p-1">
            <TabsTrigger value="documents" className="px-4 py-2 text-sm flex gap-2 items-center">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="service-history" className="px-4 py-2 text-sm flex gap-2 items-center">
              <Clock className="h-4 w-4" />
              Service History
            </TabsTrigger>
            <TabsTrigger value="health" className="px-4 py-2 text-sm flex gap-2 items-center">
              <HeartPulse className="h-4 w-4" />
              Health Records
            </TabsTrigger>
            <TabsTrigger value="community" className="px-4 py-2 text-sm flex gap-2 items-center">
              <Users className="h-4 w-4" />
              Community Hub
            </TabsTrigger>
            <TabsTrigger value="inspections" className="px-4 py-2 text-sm flex gap-2 items-center">
              <Shield className="h-4 w-4" />
              Inspections
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-3">
            <Badge variant="outline" className="py-1 px-3 flex items-center gap-1">
              <Car className="h-4 w-4" />
              <span>Vehicles: 3</span>
            </Badge>
            <Badge variant="outline" className="py-1 px-3 flex items-center gap-1">
              <FileImage className="h-4 w-4" />
              <span>Documents: 15</span>
            </Badge>
          </div>
        </div>
        
        <TabsContent value="documents" className="m-0 space-y-6">
          <Card className="mt-0">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl">Vehicle Documents</CardTitle>
              <CardDescription>All your important vehicle documents in one place</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center p-12 text-gray-500">
                Vehicle documents section will be available here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="service-history" className="m-0 space-y-6">
          <Card className="mt-0">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl">Service History</CardTitle>
              <CardDescription>Complete history of all your vehicle services</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center p-12 text-gray-500">
                Service history section will be available here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="health" className="m-0 space-y-6">
          <Card className="mt-0">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl">Vehicle Health Records</CardTitle>
              <CardDescription>Track your vehicle's health and maintenance history</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center p-12 text-gray-500">
                Vehicle health records section will be available here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="community" className="m-0 space-y-6">
          <Card className="mt-0">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl">Community & Knowledge Base</CardTitle>
              <CardDescription>Learn from other owners and share your experience</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <CommunityIntegration />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inspections" className="m-0 space-y-6">
          <Card className="mt-0">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl">Vehicle Inspections</CardTitle>
              <CardDescription>View your vehicle inspection reports and findings</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center p-12 text-gray-500">
                Inspection reports section will be available here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleVault;