import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Car, 
  FileText, 
  FileCheck, 
  Route, 
  Calculator, 
  Map, 
  Wrench, 
  BarChart, 
  Settings, 
  Plus, 
  Trash, 
  Edit, 
  Check, 
  X, 
  ChevronDown,
  ChevronUp,
  Palette,
  Grid3x3,
  LayoutGrid,
  GripHorizontal
} from 'lucide-react';

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

interface PersonalizedDashboardWidgetsProps {
  initialWidgets?: Widget[];
  onSave?: (widgets: Widget[]) => void;
}

const PersonalizedDashboardWidgets: React.FC<PersonalizedDashboardWidgetsProps> = ({ 
  initialWidgets = [],
  onSave
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets.length > 0 ? initialWidgets : [
    {
      id: 'vehicles-1',
      type: 'vehicles',
      title: 'My Vehicles',
      size: 'medium',
      position: { x: 0, y: 0 },
      icon: <Car />,
      color: 'bg-blue-500'
    },
    {
      id: 'documents-1',
      type: 'documents',
      title: 'Document Vault',
      size: 'small',
      position: { x: 2, y: 0 },
      icon: <FileText />,
      color: 'bg-amber-500'
    },
    {
      id: 'rto-1',
      type: 'rto',
      title: 'RTO Services',
      size: 'small',
      position: { x: 2, y: 1 },
      icon: <FileCheck />,
      color: 'bg-emerald-500'
    },
    {
      id: 'trip-1',
      type: 'trip',
      title: 'Trip Planner',
      size: 'small',
      position: { x: 0, y: 2 },
      icon: <Route />,
      color: 'bg-violet-500'
    },
    {
      id: 'calculator-1',
      type: 'calculator',
      title: 'Calculators',
      size: 'small',
      position: { x: 1, y: 2 },
      icon: <Calculator />,
      color: 'bg-rose-500'
    },
    {
      id: 'nearby-1',
      type: 'nearby',
      title: 'Nearby Services',
      size: 'small',
      position: { x: 2, y: 2 },
      icon: <Map />,
      color: 'bg-teal-500'
    },
  ]);
  
  const [newWidgetType, setNewWidgetType] = useState<WidgetType>('vehicles');
  const [newWidgetTitle, setNewWidgetTitle] = useState('');
  const [newWidgetSize, setNewWidgetSize] = useState<WidgetSize>('small');
  const [newWidgetColor, setNewWidgetColor] = useState('bg-blue-500');
  
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [draggedWidget, setDraggedWidget] = useState<Widget | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Save widgets when they change
  useEffect(() => {
    if (onSave && widgets.length > 0) {
      localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
      onSave(widgets);
    }
  }, [widgets, onSave]);
  
  // Load widgets from localStorage on initial mount
  useEffect(() => {
    if (initialWidgets.length === 0) {
      const savedWidgets = localStorage.getItem('dashboardWidgets');
      if (savedWidgets) {
        try {
          const parsedWidgets = JSON.parse(savedWidgets) as Widget[];
          // Add icons to loaded widgets
          const widgetsWithIcons = parsedWidgets.map(widget => ({
            ...widget,
            icon: getIconForType(widget.type)
          }));
          setWidgets(widgetsWithIcons);
        } catch (error) {
          console.error('Failed to parse saved widgets:', error);
        }
      }
    }
  }, [initialWidgets]);
  
  // Get icon component for widget type
  const getIconForType = (type: WidgetType): React.ReactNode => {
    switch (type) {
      case 'vehicles':
        return <Car />;
      case 'documents':
        return <FileText />;
      case 'rto':
        return <FileCheck />;
      case 'trip':
        return <Route />;
      case 'calculator':
        return <Calculator />;
      case 'nearby':
        return <Map />;
      case 'maintenance':
        return <Wrench />;
      case 'stats':
        return <BarChart />;
      default:
        return <Settings />;
    }
  };
  
  // Add a new widget
  const addWidget = () => {
    if (!newWidgetTitle.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a widget title',
        variant: 'destructive'
      });
      return;
    }
    
    const newWidget: Widget = {
      id: `${newWidgetType}-${Date.now()}`,
      type: newWidgetType,
      title: newWidgetTitle,
      size: newWidgetSize,
      position: getNextAvailablePosition(newWidgetSize),
      icon: getIconForType(newWidgetType),
      color: newWidgetColor
    };
    
    setWidgets([...widgets, newWidget]);
    setIsAddWidgetOpen(false);
    setNewWidgetTitle('');
    setNewWidgetType('vehicles');
    setNewWidgetSize('small');
    
    toast({
      title: 'Widget added',
      description: `${newWidgetTitle} widget has been added to your dashboard.`
    });
  };
  
  // Find the next available position for a new widget
  const getNextAvailablePosition = (size: WidgetSize) => {
    // This is a simple implementation - in a real app, you'd need a more sophisticated algorithm
    // that accounts for different widget sizes and potential overlaps
    const grid = Array(4).fill(0).map(() => Array(4).fill(false));
    
    // Mark occupied positions
    widgets.forEach(widget => {
      const { x, y } = widget.position;
      const width = widget.size === 'small' ? 1 : widget.size === 'medium' ? 2 : 2;
      const height = widget.size === 'small' ? 1 : widget.size === 'medium' ? 1 : 2;
      
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          if (x + i < 4 && y + j < 4) {
            grid[y + j][x + i] = true;
          }
        }
      }
    });
    
    // Find first available position
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (!grid[y][x]) {
          return { x, y };
        }
      }
    }
    
    // If no position found, return a default
    return { x: 0, y: 0 };
  };
  
  // Remove a widget
  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
    toast({
      title: 'Widget removed',
      description: 'The widget has been removed from your dashboard.'
    });
  };
  
  // Handle drag start
  const handleDragStart = (widget: Widget) => {
    setDraggedWidget(widget);
    setIsDragging(true);
  };
  
  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedWidget(null);
  };
  
  // Handle drag over a position
  const handleDragOver = (x: number, y: number) => {
    if (draggedWidget) {
      // Check if position is valid based on widget size
      // This is simplified - in a real app, you'd need more validation
      
      setWidgets(widgets.map(widget => 
        widget.id === draggedWidget.id 
          ? { ...widget, position: { x, y } } 
          : widget
      ));
    }
  };
  
  // Get the component to render for a specific widget type
  const getWidgetComponent = (widget: Widget) => {
    // In a real implementation, you'd have actual components for each widget type
    return (
      <div className="w-full h-full flex flex-col">
        <div className={`flex items-center justify-center rounded-full w-10 h-10 mb-3 ${widget.color} text-white`}>
          {widget.icon}
        </div>
        <h3 className="font-medium text-lg">{widget.title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {widget.type === 'vehicles' && 'Manage your vehicles'}
          {widget.type === 'documents' && 'Access your documents'}
          {widget.type === 'rto' && 'RTO service booking'}
          {widget.type === 'trip' && 'Plan your trips'}
          {widget.type === 'calculator' && 'Vehicle calculators'}
          {widget.type === 'nearby' && 'Find nearby services'}
          {widget.type === 'maintenance' && 'Maintenance records'}
          {widget.type === 'stats' && 'Vehicle statistics'}
        </p>
      </div>
    );
  };
  
  // Save changes to the dashboard
  const saveChanges = () => {
    setIsEditing(false);
    toast({
      title: 'Dashboard saved',
      description: 'Your dashboard layout has been saved.'
    });
    
    if (onSave) {
      onSave(widgets);
    }
  };
  
  return (
    <div className="mb-6">
      {isEditing ? (
        <div className="bg-gray-50 border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-medium text-lg">Customize Dashboard</h3>
              <p className="text-sm text-gray-500">Drag widgets to rearrange, or add/remove widgets</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={saveChanges}>
                Save Changes
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            {widgets.map(widget => (
              <div
                key={widget.id}
                className={`relative border rounded-lg bg-white p-4 shadow-sm ${
                  isDragging && draggedWidget?.id === widget.id ? 'opacity-50' : ''
                }`}
                draggable={true}
                onDragStart={() => handleDragStart(widget)}
                onDragEnd={handleDragEnd}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`flex items-center justify-center rounded-full w-8 h-8 ${widget.color} text-white`}>
                    {widget.icon}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={() => removeWidget(widget.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <h4 className="font-medium">{widget.title}</h4>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Position: {widget.position.x}, {widget.position.y}</span>
                  <span>Size: {widget.size}</span>
                </div>
                <div className="absolute inset-0 cursor-move bg-transparent" />
              </div>
            ))}
            
            <Button
              variant="outline"
              className="h-32 border-dashed flex flex-col items-center justify-center gap-2"
              onClick={() => setIsAddWidgetOpen(true)}
            >
              <Plus className="h-6 w-6" />
              <span>Add Widget</span>
            </Button>
          </div>
          
          <div className="bg-white border rounded-lg p-4">
            <h4 className="font-medium mb-2">Layout Preview</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-3 bg-gray-100 rounded">
              {Array(4).fill(0).map((_, row) => (
                Array(4).fill(0).map((_, col) => {
                  const widgetAtPosition = widgets.find(w => 
                    w.position.x === col && w.position.y === row
                  );
                  
                  return (
                    <div 
                      key={`${row}-${col}`}
                      className={`border ${widgetAtPosition ? 'bg-blue-50 border-blue-200' : 'bg-white'} rounded h-12 flex items-center justify-center text-xs text-gray-500`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        handleDragOver(col, row);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleDragOver(col, row);
                        handleDragEnd();
                      }}
                    >
                      {widgetAtPosition ? widgetAtPosition.title : `${col},${row}`}
                    </div>
                  );
                })
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">Your Dashboard</h2>
              <p className="text-gray-500">Personalized widgets for quick access</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              Customize
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {widgets.map(widget => (
              <Card key={widget.id} className="shadow-sm hover:shadow transition-shadow">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start gap-2">
                    <div className={`flex items-center justify-center rounded-full w-10 h-10 ${widget.color} text-white`}>
                      {widget.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{widget.title}</CardTitle>
                      <CardDescription>
                        {widget.type === 'vehicles' && 'Manage your vehicles'}
                        {widget.type === 'documents' && 'Access your documents'}
                        {widget.type === 'rto' && 'RTO service booking'}
                        {widget.type === 'trip' && 'Plan your trips'}
                        {widget.type === 'calculator' && 'Vehicle calculators'}
                        {widget.type === 'nearby' && 'Find nearby services'}
                        {widget.type === 'maintenance' && 'Maintenance records'}
                        {widget.type === 'stats' && 'Vehicle statistics'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {/* Placeholder content - in a real app, would render actual widget content */}
                  <div className="mt-2 h-20 bg-gray-50 rounded-md flex items-center justify-center">
                    <span className="text-gray-400">Widget Content</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Add Widget Dialog */}
      <Dialog open={isAddWidgetOpen} onOpenChange={setIsAddWidgetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Widget</DialogTitle>
            <DialogDescription>
              Choose a widget type and configure its appearance
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="widget-title">Widget Title</Label>
              <Input 
                id="widget-title" 
                placeholder="Enter widget title"
                value={newWidgetTitle}
                onChange={(e) => setNewWidgetTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="widget-type">Widget Type</Label>
              <Select value={newWidgetType} onValueChange={(value) => setNewWidgetType(value as WidgetType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select widget type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vehicles">Vehicles</SelectItem>
                  <SelectItem value="documents">Documents</SelectItem>
                  <SelectItem value="rto">RTO Services</SelectItem>
                  <SelectItem value="trip">Trip Planner</SelectItem>
                  <SelectItem value="calculator">Calculators</SelectItem>
                  <SelectItem value="nearby">Nearby Services</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="stats">Statistics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="widget-size">Widget Size</Label>
              <Select value={newWidgetSize} onValueChange={(value) => setNewWidgetSize(value as WidgetSize)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (1x1)</SelectItem>
                  <SelectItem value="medium">Medium (2x1)</SelectItem>
                  <SelectItem value="large">Large (2x2)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Widget Color</Label>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 
                  'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
                  'bg-amber-500', 'bg-orange-500', 'bg-rose-500'
                ].map(color => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full ${color} ${
                      newWidgetColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                    }`}
                    onClick={() => setNewWidgetColor(color)}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddWidgetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addWidget}>
              Add Widget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonalizedDashboardWidgets;