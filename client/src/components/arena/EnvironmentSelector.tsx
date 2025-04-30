import React from 'react';
import { Building2, CloudSun, Moon, Mountain, Sun } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface EnvironmentSelectorProps {
  selectedEnvironment: string;
  onSelectEnvironment: (environment: string) => void;
}

// Environment options with metadata
const environments = [
  {
    id: 'showroom',
    name: 'Showroom',
    icon: Building2,
    description: 'Indoor studio lighting',
  },
  {
    id: 'city',
    name: 'City',
    icon: Building2,
    description: 'Urban environment',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    icon: CloudSun,
    description: 'Warm evening light',
  },
  {
    id: 'dawn',
    name: 'Dawn',
    icon: Sun,
    description: 'Early morning light',
  },
  {
    id: 'night',
    name: 'Night',
    icon: Moon,
    description: 'Nighttime environment',
  },
  {
    id: 'mountain',
    name: 'Mountain',
    icon: Mountain,
    description: 'Natural landscape',
  },
];

const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({
  selectedEnvironment,
  onSelectEnvironment,
}) => {
  return (
    <RadioGroup
      value={selectedEnvironment}
      onValueChange={onSelectEnvironment}
      className="grid grid-cols-2 gap-2"
    >
      {environments.map((env) => {
        const Icon = env.icon;
        return (
          <div
            key={env.id}
            className={`
              relative flex flex-col items-center justify-center p-2 rounded-md border cursor-pointer 
              transition-all hover:border-primary hover:bg-accent
              ${selectedEnvironment === env.id ? 'border-primary bg-primary/5' : 'border-border'}
            `}
            onClick={() => onSelectEnvironment(env.id)}
          >
            <RadioGroupItem
              value={env.id}
              id={env.id}
              className="sr-only"
            />
            <Icon className="h-5 w-5 mb-1 text-muted-foreground" />
            <Label
              htmlFor={env.id}
              className="text-xs font-medium cursor-pointer"
            >
              {env.name}
            </Label>
            <p className="text-[10px] text-muted-foreground text-center mt-0.5">
              {env.description}
            </p>
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default EnvironmentSelector;