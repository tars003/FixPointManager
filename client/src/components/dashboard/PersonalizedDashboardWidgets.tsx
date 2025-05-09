import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { 
  Grid2X2, 
  LayoutGrid, 
  Trash2, 
  Plus, 
  X,
  Save,
  ArrowUpDown,
  FileText,
  Car,
  Calculator,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Widget Types
type WidgetSize = 'small' | 'medium' | 'large'; // small: 1x1, medium: 1x2 or 2x1, large: 2x2
type WidgetType = 'vehicles' | 'documents' | 'rto' | 'trip' | 'calculator' | 'nearby' | 'maintenance' | 'stats';

interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  position: { x: number; y: number; };
  config?: Record<string, any>;
  icon: React.ReactNode;
  color: string;
}

// Available widgets to add
const availableWidgets: Omit<Widget, 'id' | 'position'>[] = [
  { 
    type: 'vehicles', 
    title: 'My Vehicles', 
    size: 'medium',
    icon: <Car className="h-5 w-5" />,
    color: 'bg-blue-500'
  },
  { 
    type: 'documents', 
    title: 'Recent Documents', 
    size: 'medium',
    icon: <FileText className="h-5 w-5" />,
    color: 'bg-emerald-500'
  },
  { 
    type: 'rto', 
    title: 'RTO Services', 
    size: 'small',
    icon: <FileText className="h-5 w-5" />,
    color: 'bg-purple-500'
  },
  { 
    type: 'trip', 
    title: 'Trip Planner', 
    size: 'large',
    icon: <MapPin className="h-5 w-5" />,
    color: 'bg-amber-500'
  },
  { 
    type: 'calculator', 
    title: 'Quick Calculator', 
    size: 'small',
    icon: <Calculator className="h-5 w-5" />,
    color: 'bg-rose-500'
  },
  { 
    type: 'nearby', 
    title: 'Nearby Services', 
    size: 'medium',
    icon: <MapPin className="h-5 w-5" />,
    color: 'bg-indigo-500'
  },
  { 
    type: 'maintenance', 
    title: 'Maintenance Reminder', 
    size: 'small',
    icon: <Car className="h-5 w-5" />,
    color: 'bg-teal-500'
  },
  { 
    type: 'stats', 
    title: 'Vehicle Stats', 
    size: 'medium',
    icon: <Car className="h-5 w-5" />,
    color: 'bg-orange-500'
  }
];

interface PersonalizedDashboardWidgetsProps {
  initialWidgets?: Widget[];
  onSave?: (widgets: Widget[]) => void;
}

const PersonalizedDashboardWidgets: React.FC<PersonalizedDashboardWidgetsProps> = ({ 
  initialWidgets = [],
  onSave
}) => {
  const { toast } = useToast();
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets.length > 0 ? initialWidgets : [
    { id: '1', type: 'vehicles', title: 'My Vehicles', size: 'medium', position: { x: 0, y: 0 }, icon: <Car className="h-5 w-5" />, color: 'bg-blue-500' },
    { id: '2', type: 'documents', title: 'Recent Documents', size: 'medium', position: { x: 1, y: 0 }, icon: <FileText className="h-5 w-5" />, color: 'bg-emerald-500' },
    { id: '3', type: 'rto', title: 'RTO Services', size: 'small', position: { x: 0, y: 1 }, icon: <FileText className="h-5 w-5" />, color: 'bg-purple-500' }
  ]);
  const [draggedWidget, setDraggedWidget] = useState<Widget | null>(null);
  
  // Function to add a new widget
  const addWidget = (widgetTemplate: Omit<Widget, 'id' | 'position'>) => {
    const newWidget: Widget = {
      ...widgetTemplate,
      id: Date.now().toString(),
      position: getNextAvailablePosition(widgetTemplate.size)
    };
    
    setWidgets([...widgets, newWidget]);
    toast({
      title: "Widget Added",
      description: `${newWidget.title} widget has been added to your dashboard.`
    });
  };
  
  // Function to remove a widget
  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
    toast({
      title: "Widget Removed",
      description: "The widget has been removed from your dashboard."
    });
  };
  
  // Function to find the next available position on the grid
  const getNextAvailablePosition = (size: WidgetSize) => {
    // Simple algorithm to find next position - in a real app would be more sophisticated
    return { x: 0, y: widgets.length > 0 ? Math.max(...widgets.map(w => w.position.y)) + 1 : 0 };
  };
  
  // Function to handle saving widget layout
  const handleSave = () => {
    setIsCustomizeOpen(false);
    if (onSave) {
      onSave(widgets);
    }
    toast({
      title: "Dashboard Saved",
      description: "Your dashboard layout has been saved successfully."
    });
  };
  
  // Function to handle widget drag start
  const handleDragStart = (widget: Widget) => {
    setDraggedWidget(widget);
  };
  
  // Simplified widget representation
  const getWidgetComponent = (widget: Widget) => {
    return (
      <motion.div
        key={widget.id}
        className={`widget relative rounded-lg overflow-hidden shadow-md
          ${widget.size === 'small' ? 'col-span-1 row-span-1' : 
          widget.size === 'medium' ? 'col-span-2 row-span-1' : 
          'col-span-2 row-span-2'}`}
        layoutId={`widget-${widget.id}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        drag={isCustomizeOpen}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragStart={() => handleDragStart(widget)}
      >
        <Card className="h-full border-none shadow-none">
          <CardHeader className={`pb-2 ${widget.color} text-white`}>
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm md:text-base font-medium flex items-center gap-2">
                {widget.icon}
                {widget.title}
              </CardTitle>
              {isCustomizeOpen && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 w-7 p-0 text-white hover:bg-white/20"
                  onClick={() => removeWidget(widget.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="text-center text-gray-500 text-sm">
              {isCustomizeOpen ? (
                <div className="flex items-center justify-center h-full">
                  <ArrowUpDown className="h-5 w-5 mr-2" />
                  <span>Drag to reposition</span>
                </div>
              ) : (
                <div className="animate-pulse">Widget content would appear here</div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Dashboard</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsCustomizeOpen(true)}
          className="flex items-center gap-1"
        >
          <LayoutGrid className="h-4 w-4 mr-1" />
          Customize
        </Button>
      </div>
      
      {/* Grid Layout for Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AnimatePresence>
          {widgets.map(widget => getWidgetComponent(widget))}
        </AnimatePresence>
      </div>
      
      {/* Customize Dialog */}
      <Dialog open={isCustomizeOpen} onOpenChange={setIsCustomizeOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Customize Dashboard</DialogTitle>
            <DialogDescription>
              Add, remove, and rearrange widgets to personalize your dashboard.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="current">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Current Widgets</TabsTrigger>
              <TabsTrigger value="add">Add Widgets</TabsTrigger>
            </TabsList>
            
            {/* Current Widgets Tab */}
            <TabsContent value="current" className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="mb-2 font-medium text-sm">Your Current Widgets ({widgets.length})</h3>
                <div className="space-y-2">
                  {widgets.map(widget => (
                    <div key={widget.id} className="flex justify-between items-center p-2 bg-white rounded border">
                      <div className="flex items-center gap-2">
                        <div className={`${widget.color} rounded p-1`}>
                          {widget.icon}
                        </div>
                        <span>{widget.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {widget.size === 'small' ? '1x1' : 
                           widget.size === 'medium' ? '2x1' : '2x2'}
                        </Badge>
                        <Button 
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => removeWidget(widget.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {widgets.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">No widgets added yet. Add some from the "Add Widgets" tab.</p>
                )}
                
                <div className="mt-4">
                  <Label htmlFor="edit-mode" className="flex items-center justify-between cursor-pointer">
                    <span>Edit Mode</span>
                    <Switch 
                      id="edit-mode" 
                      checked={isCustomizeOpen}
                      onCheckedChange={(checked) => {
                        if (!checked) {
                          handleSave();
                        }
                      }}
                    />
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    When edit mode is on, you can drag widgets to rearrange them.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            {/* Add Widgets Tab */}
            <TabsContent value="add" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableWidgets.map((widget, index) => (
                  <Card 
                    key={index} 
                    className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                    onClick={() => addWidget(widget)}
                  >
                    <CardHeader className={`py-2 ${widget.color} text-white`}>
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        {widget.icon}
                        {widget.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-xs">
                          {widget.size === 'small' ? '1x1' : 
                           widget.size === 'medium' ? '2x1' : '2x2'}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            addWidget(widget);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomizeOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Layout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonalizedDashboardWidgets;