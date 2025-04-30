import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Eye, 
  EyeOff, 
  Move, 
  LayoutGrid, 
  Palette,
  Settings2,
  Check,
  X,
  ArrowUpDown,
  RefreshCw,
  Save
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Interface for the dashboard module
export interface DashboardModule {
  id: string;
  name: string;
  visible: boolean;
  position: number;
  size: 'small' | 'medium' | 'large';
  type: 'feature' | 'chart' | 'stat' | 'tool';
  section: 'top' | 'main' | 'bottom';
}

interface CustomizeDashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modules: DashboardModule[];
  onSaveModules: (modules: DashboardModule[]) => void;
}

// Helper function to reorder items in the list
const reorder = (list: DashboardModule[], startIndex: number, endIndex: number): DashboardModule[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  
  // Update positions after reordering
  return result.map((item, index) => ({
    ...item,
    position: index
  }));
};

const CustomizeDashboardDialog: React.FC<CustomizeDashboardDialogProps> = ({
  open,
  onOpenChange,
  modules,
  onSaveModules
}) => {
  const [activeModules, setActiveModules] = useState<DashboardModule[]>(modules);
  const [activeTab, setActiveTab] = useState('layout');
  
  // Update module visibility
  const toggleModuleVisibility = (moduleId: string) => {
    setActiveModules(prevModules =>
      prevModules.map(module =>
        module.id === moduleId
          ? { ...module, visible: !module.visible }
          : module
      )
    );
  };
  
  // Update module size
  const updateModuleSize = (moduleId: string, size: 'small' | 'medium' | 'large') => {
    setActiveModules(prevModules =>
      prevModules.map(module =>
        module.id === moduleId
          ? { ...module, size }
          : module
      )
    );
  };
  
  // Handle drag end event
  const onDragEnd = (result: any) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    // If the item is dropped in a different position
    if (result.destination.index !== result.source.index) {
      const reorderedModules = reorder(
        activeModules,
        result.source.index,
        result.destination.index
      );
      setActiveModules(reorderedModules);
    }
  };
  
  // Reset to default configuration
  const resetToDefaults = () => {
    // Reset all modules to their default state
    const defaultModules = modules.map(module => ({
      ...module,
      visible: true,
      position: module.position,
      size: 'medium' as 'small' | 'medium' | 'large'
    }));
    
    setActiveModules(defaultModules);
  };
  
  // Save changes
  const saveChanges = () => {
    onSaveModules(activeModules);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Settings2 className="h-6 w-6 mr-2 text-blue-600" />
            Customize Dashboard
          </DialogTitle>
          <DialogDescription>
            Personalize your dashboard by customizing the layout, visibility, and appearance of modules.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="grid grid-cols-3 w-full mb-4">
              <TabsTrigger value="layout" className="flex items-center">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Layout & Visibility
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center">
                <Settings2 className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="layout" className="pt-2 px-1">
            <div className="p-4 border-t">
              <h3 className="text-sm font-medium mb-4 flex items-center">
                <ArrowUpDown className="h-4 w-4 mr-2 text-blue-600" />
                Drag and drop to rearrange modules
              </h3>
              
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="dashboard-modules">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {activeModules
                        .sort((a, b) => a.position - b.position)
                        .map((module, index) => (
                          <Draggable key={module.id} draggableId={module.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`rounded-lg border p-3 ${
                                  snapshot.isDragging ? 'bg-blue-50 border-blue-200' : 'bg-white'
                                } ${!module.visible ? 'opacity-50' : ''}`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="text-gray-400 hover:text-gray-700 mr-3 cursor-move"
                                    >
                                      <Move className="h-5 w-5" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium">{module.name}</h4>
                                      <p className="text-xs text-gray-500">
                                        {module.type.charAt(0).toUpperCase() + module.type.slice(1)}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-4">
                                    {/* Size buttons */}
                                    <div className="flex border rounded-md overflow-hidden">
                                      <button
                                        className={`px-2 py-1 text-xs ${
                                          module.size === 'small'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                        onClick={() => updateModuleSize(module.id, 'small')}
                                      >
                                        S
                                      </button>
                                      <button
                                        className={`px-2 py-1 text-xs border-l border-r ${
                                          module.size === 'medium'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                        onClick={() => updateModuleSize(module.id, 'medium')}
                                      >
                                        M
                                      </button>
                                      <button
                                        className={`px-2 py-1 text-xs ${
                                          module.size === 'large'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                        onClick={() => updateModuleSize(module.id, 'large')}
                                      >
                                        L
                                      </button>
                                    </div>
                                    
                                    {/* Visibility toggle */}
                                    <button
                                      className={`p-1.5 rounded-full ${
                                        module.visible ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'
                                      }`}
                                      onClick={() => toggleModuleVisibility(module.id)}
                                    >
                                      {module.visible ? (
                                        <Eye className="h-4 w-4" />
                                      ) : (
                                        <EyeOff className="h-4 w-4" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="pt-2 px-6">
            <div className="p-4 border-t">
              <h3 className="text-sm font-medium mb-4">Appearance Settings</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Dashboard Theme</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2">
                        {['Default', 'Dark', 'Light'].map((theme) => (
                          <div
                            key={theme}
                            className={`p-2 text-xs rounded-md text-center cursor-pointer ${
                              theme === 'Default' ? 'bg-blue-100 text-blue-700 border-2 border-blue-400' : 'bg-gray-100'
                            }`}
                          >
                            {theme}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Card Style</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {['Bordered', 'Elevated', 'Glass', 'Minimal'].map((style) => (
                          <div
                            key={style}
                            className={`p-2 text-xs rounded-md text-center cursor-pointer ${
                              style === 'Glass' ? 'bg-blue-100 text-blue-700 border-2 border-blue-400' : 'bg-gray-100'
                            }`}
                          >
                            {style}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Color Accents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-6 gap-2">
                      {[
                        'blue-600', 'indigo-600', 'purple-600', 
                        'pink-600', 'red-600', 'orange-600',
                        'amber-600', 'yellow-600', 'lime-600',
                        'green-600', 'emerald-600', 'teal-600',
                      ].map((color) => {
                        const bg = `bg-${color}`;
                        return (
                          <div
                            key={color}
                            className={`h-8 rounded-md cursor-pointer flex items-center justify-center ${bg}`}
                          >
                            {color.includes('blue-600') && (
                              <Check className="h-4 w-4 text-white" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preferences" className="pt-2 px-6">
            <div className="p-4 border-t">
              <h3 className="text-sm font-medium mb-4">Dashboard Preferences</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  {[
                    { label: 'Show real-time updates', defaultChecked: true },
                    { label: 'Enable animations and transitions', defaultChecked: true },
                    { label: 'Display notification badges', defaultChecked: true },
                    { label: 'Auto-refresh data (every 5 minutes)', defaultChecked: false },
                    { label: 'Show welcome banner', defaultChecked: false },
                    { label: 'Compact view mode', defaultChecked: false },
                  ].map((preference, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <Label htmlFor={`preference-${i}`} className="flex flex-col cursor-pointer">
                        <span>{preference.label}</span>
                      </Label>
                      <Switch id={`preference-${i}`} defaultChecked={preference.defaultChecked} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="bg-gray-50 p-4 flex justify-between">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={resetToDefaults} 
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Reset to Default
            </Button>
            <Button 
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
          <Button 
            onClick={saveChanges}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizeDashboardDialog;