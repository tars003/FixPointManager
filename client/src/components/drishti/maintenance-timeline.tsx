import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  Wrench as Tool, 
  FileText, 
  Wrench, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Settings,
  BookOpen,
  PlusCircle,
  CreditCard,
  MoreHorizontal,
  Bell,
  Zap
} from 'lucide-react';

interface MaintenanceEvent {
  id: string;
  type: 'upcoming' | 'completed' | 'alert' | 'recommendation';
  title: string;
  description: string;
  date: string; // ISO string or human-readable
  component: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  cost?: number;
  serviceCenterName?: string;
  documents?: {
    name: string;
    type: string;
    url: string;
  }[];
  source: 'obd' | 'scheduled' | 'manual';
  actionTaken?: string;
  confidence?: number; // For AI predictions
  imageUrl?: string;
}

const MaintenanceTimeline: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('vehicle1');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  // Toggle expansion of timeline items
  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };
  
  const filteredEvents = maintenanceEvents.filter(event => {
    switch (activeTab) {
      case 'upcoming':
        return event.type === 'upcoming' || event.type === 'alert';
      case 'completed':
        return event.type === 'completed';
      case 'recommendations':
        return event.type === 'recommendation';
      default:
        return true;
    }
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-[#0056B3]" />
              Maintenance Timeline
            </CardTitle>
            <CardDescription>
              Interactive service history and predictive maintenance alerts
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vehicle1">Tesla Model 3 (KA01AB1234)</SelectItem>
                <SelectItem value="vehicle2">Honda City (KA02CD5678)</SelectItem>
                <SelectItem value="vehicle3">Tata Nexon (KA03EF9012)</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Vehicle Health Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-lg border">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-shrink-0 flex flex-col items-center justify-center">
              <div 
                className="h-24 w-24 rounded-full border-4 border-[#0056B3]/30 flex items-center justify-center"
                style={{
                  background: `conic-gradient(#28A745 0% 85%, #e9ecef 85% 100%)`
                }}
              >
                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold text-[#0056B3]">85%</span>
                  <span className="text-xs text-[#0056B3]/80">HEALTH</span>
                </div>
              </div>
              
              <div className="mt-2 flex flex-col items-center">
                <span className="text-sm font-medium">Overall Condition</span>
                <Badge variant="outline" className="mt-1 text-green-700 border-green-200 bg-green-50">
                  Good
                </Badge>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border shadow-sm">
                <div className="p-2 rounded-lg bg-amber-50">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium">Due Soon</p>
                  <p className="text-sm text-muted-foreground">Brake pad replacement in 800 km</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border shadow-sm">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Next Service</p>
                  <p className="text-sm text-muted-foreground">Scheduled in 45 days</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border shadow-sm">
                <div className="p-2 rounded-lg bg-green-50">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">Today, 10:35 AM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border shadow-sm">
                <div className="p-2 rounded-lg bg-purple-50">
                  <CreditCard className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium">Annual Budget</p>
                  <p className="text-sm text-muted-foreground">₹15,600 remaining</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Maintenance Tabs */}
        <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="upcoming">Upcoming (3)</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          
          <div className="flex justify-between items-center mt-4">
            <h3 className="text-sm font-medium">
              {activeTab === 'upcoming' && 'Upcoming Maintenance & Alerts'}
              {activeTab === 'completed' && 'Maintenance History'}
              {activeTab === 'recommendations' && 'AI-Powered Recommendations'}
            </h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </Button>
              {activeTab === 'upcoming' && (
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  Schedule
                </Button>
              )}
            </div>
          </div>
          
          {/* Timeline Display */}
          <div className="relative mt-6 border-l-2 border-muted pl-6 space-y-6 py-2">
            {filteredEvents.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-muted-foreground">No {activeTab} maintenance events found.</p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <MaintenanceTimelineItem 
                  key={event.id} 
                  event={event} 
                  isExpanded={expandedItems.includes(event.id)}
                  onToggleExpand={() => toggleExpand(event.id)}
                />
              ))
            )}
          </div>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Predictions based on OBD2 data and service history
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <BookOpen className="h-4 w-4" />
            Service Manual
          </Button>
          <Button className="gap-1">
            <Settings className="h-4 w-4" />
            Maintenance Settings
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Helper Components
interface MaintenanceTimelineItemProps {
  event: MaintenanceEvent;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const MaintenanceTimelineItem: React.FC<MaintenanceTimelineItemProps> = ({ 
  event, 
  isExpanded,
  onToggleExpand
}) => {
  const { type, title, description, date, component, severity, source } = event;
  
  const typeStyles = {
    upcoming: {
      dotColor: 'bg-blue-500',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      badgeText: 'Scheduled',
      icon: <Calendar className="h-4 w-4 text-blue-500" />
    },
    completed: {
      dotColor: 'bg-green-500',
      badgeColor: 'bg-green-100 text-green-800 border-green-200',
      badgeText: 'Completed',
      icon: <CheckCircle className="h-4 w-4 text-green-500" />
    },
    alert: {
      dotColor: 'bg-amber-500',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      badgeText: 'Alert',
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />
    },
    recommendation: {
      dotColor: 'bg-purple-500',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      badgeText: 'Recommendation',
      icon: <Zap className="h-4 w-4 text-purple-500" />
    }
  };
  
  const severityBadge = severity && (
    <Badge 
      variant="outline" 
      className={
        severity === 'critical' ? 'bg-red-100 text-red-800 border-red-200' :
        severity === 'high' ? 'bg-amber-100 text-amber-800 border-amber-200' :
        severity === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
        'bg-blue-100 text-blue-800 border-blue-200'
      }
    >
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </Badge>
  );
  
  const sourceIcon = {
    obd: <Tool className="h-3.5 w-3.5 text-blue-500" />,
    scheduled: <Calendar className="h-3.5 w-3.5 text-green-500" />,
    manual: <FileText className="h-3.5 w-3.5 text-purple-500" />
  }[source];
  
  return (
    <div className="relative">
      {/* Timeline dot */}
      <div className={`absolute -left-[29px] top-0 h-4 w-4 rounded-full border-2 border-white ${typeStyles[type].dotColor}`}></div>
      
      {/* Content card */}
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {typeStyles[type].icon}
              <h3 className="font-medium">{title}</h3>
              <Badge variant="outline" className={typeStyles[type].badgeColor}>
                {typeStyles[type].badgeText}
              </Badge>
              {severityBadge}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-0.5">
                  {sourceIcon}
                  <span className="text-xs capitalize">{source}</span>
                </div>
                <span>•</span>
                <span>{date}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full" 
                onClick={onToggleExpand}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        
        {/* Expanded content */}
        {isExpanded && (
          <>
            <div className="px-4 py-3 border-t bg-muted/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Component</p>
                  <p className="text-sm font-medium">{component}</p>
                </div>
                
                {event.cost !== undefined && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Estimated Cost</p>
                    <p className="text-sm font-medium">₹{event.cost.toLocaleString()}</p>
                  </div>
                )}
                
                {event.serviceCenterName && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Service Center</p>
                    <p className="text-sm font-medium">{event.serviceCenterName}</p>
                  </div>
                )}
                
                {event.actionTaken && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Action Taken</p>
                    <p className="text-sm font-medium">{event.actionTaken}</p>
                  </div>
                )}
                
                {event.confidence !== undefined && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">AI Confidence</p>
                    <p className="text-sm font-medium">{event.confidence}%</p>
                  </div>
                )}
              </div>
              
              {/* Documents */}
              {event.documents && event.documents.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2">Documents</p>
                  <div className="flex flex-wrap gap-2">
                    {event.documents.map((doc, index) => (
                      <Button 
                        key={index}
                        variant="outline" 
                        className="h-8 px-3 text-xs gap-1"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        {doc.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-3 bg-card border-t flex justify-between items-center">
              {event.type === 'upcoming' && (
                <>
                  <Button variant="ghost" size="sm" className="text-xs h-8">
                    <ArrowRight className="h-3.5 w-3.5 mr-1" />
                    Reschedule
                  </Button>
                  <Button size="sm" className="text-xs h-8">
                    Book Appointment
                  </Button>
                </>
              )}
              
              {event.type === 'recommendation' && (
                <>
                  <Button variant="ghost" size="sm" className="text-xs h-8">
                    Ignore
                  </Button>
                  <Button size="sm" className="text-xs h-8">
                    Schedule Service
                  </Button>
                </>
              )}
              
              {event.type === 'alert' && (
                <>
                  <Button variant="ghost" size="sm" className="text-xs h-8">
                    <MoreHorizontal className="h-3.5 w-3.5 mr-1" />
                    More Info
                  </Button>
                  <Button size="sm" className="text-xs h-8">
                    Schedule Repair
                  </Button>
                </>
              )}
              
              {event.type === 'completed' && (
                <>
                  <Button variant="ghost" size="sm" className="text-xs h-8">
                    <FileText className="h-3.5 w-3.5 mr-1" />
                    View Invoice
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-8 gap-1">
                    Report Issue
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Sample Data
const maintenanceEvents: MaintenanceEvent[] = [
  {
    id: 'event1',
    type: 'alert',
    title: 'Brake Pad Wear Alert',
    description: 'Front brake pads are showing significant wear and will need replacement soon.',
    date: 'Today, 8:45 AM',
    component: 'Brake System',
    severity: 'medium',
    cost: 3500,
    source: 'obd',
    confidence: 92
  },
  {
    id: 'event2',
    type: 'upcoming',
    title: 'Regular Service',
    description: '10,000 km scheduled maintenance including oil change, filter replacement.',
    date: 'Apr 15, 2025',
    component: 'Multiple Systems',
    cost: 6800,
    serviceCenterName: 'Tesla Service Center, MG Road',
    source: 'scheduled',
    documents: [
      {
        name: 'Service Checklist.pdf',
        type: 'application/pdf',
        url: '/documents/checklist.pdf'
      }
    ]
  },
  {
    id: 'event3',
    type: 'recommendation',
    title: 'Tire Rotation Recommended',
    description: 'Based on wear patterns, rotating your tires will improve longevity and performance.',
    date: 'Apr 2, 2025',
    component: 'Tires',
    severity: 'low',
    cost: 1200,
    source: 'obd',
    confidence: 85
  },
  {
    id: 'event4',
    type: 'completed',
    title: 'Battery Replacement',
    description: 'Replaced 12V battery due to starting issues and reduced capacity.',
    date: 'Mar 18, 2025',
    component: 'Electrical System',
    cost: 8500,
    serviceCenterName: 'Quick Service Center, Koramangala',
    source: 'manual',
    actionTaken: 'Full replacement with premium AGM battery',
    documents: [
      {
        name: 'Invoice-B289.pdf',
        type: 'application/pdf',
        url: '/documents/invoice-b289.pdf'
      },
      {
        name: 'Battery-Warranty.pdf',
        type: 'application/pdf',
        url: '/documents/warranty.pdf'
      }
    ]
  },
  {
    id: 'event5',
    type: 'completed',
    title: 'Cabin Air Filter Replacement',
    description: 'Replaced cabin air filter as part of regular maintenance.',
    date: 'Mar 10, 2025',
    component: 'HVAC System',
    cost: 900,
    serviceCenterName: 'DIY',
    source: 'manual',
    actionTaken: 'Installed high-efficiency filter'
  },
  {
    id: 'event6',
    type: 'recommendation',
    title: 'Wheel Alignment Check',
    description: 'Slight pull to the right detected, recommend wheel alignment inspection.',
    date: 'Mar 8, 2025',
    component: 'Suspension',
    severity: 'low',
    cost: 1800,
    source: 'obd',
    confidence: 78
  }
];

export default MaintenanceTimeline;