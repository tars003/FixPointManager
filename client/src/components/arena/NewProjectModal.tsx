import React, { useState } from 'react';
import { X, Car, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { VehicleCategory } from '@shared/schema';

interface NewProjectModalProps {
  onClose: () => void;
  onCreate: (name: string, vehicleType: VehicleCategory) => void;
}

const vehicleTypes: { value: VehicleCategory; label: string }[] = [
  { value: 'two-wheeler', label: 'Two Wheeler' },
  { value: 'three-wheeler', label: 'Three Wheeler' },
  { value: 'four-wheeler', label: 'Four Wheeler' },
  { value: 'heavy-vehicle', label: 'Heavy Vehicle' },
];

const NewProjectModal: React.FC<NewProjectModalProps> = ({ onClose, onCreate }) => {
  const [projectName, setProjectName] = useState('My Custom Vehicle');
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleCategory>('four-wheeler');
  
  // Handle create button click
  const handleCreate = () => {
    onCreate(projectName, selectedVehicleType);
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Start a new vehicle customization project by selecting a vehicle type.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Vehicle Type</Label>
            <RadioGroup 
              value={selectedVehicleType}
              onValueChange={(value) => setSelectedVehicleType(value as VehicleCategory)}
              className="grid grid-cols-2 gap-2"
            >
              {vehicleTypes.map((type) => (
                <div
                  key={type.value}
                  className={`
                    relative flex items-center space-x-2 rounded-md border p-3 cursor-pointer
                    ${selectedVehicleType === type.value ? 'border-primary bg-primary/5' : 'border-border'}
                  `}
                  onClick={() => setSelectedVehicleType(type.value)}
                >
                  <RadioGroupItem
                    value={type.value}
                    id={type.value}
                    className="sr-only"
                  />
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <Label
                    htmlFor={type.value}
                    className="flex-1 cursor-pointer text-sm"
                  >
                    {type.label}
                  </Label>
                  
                  {selectedVehicleType === type.value && (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;