import React from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  Eye, 
  Gauge, 
  Zap, 
  Rotate3D, 
  Share2 
} from 'lucide-react';

interface PreviewCardProps {
  vehicleName: string;
  vehicleBrand: string;
  vehicleType: string;
  vehicleEmoji: string;
  vehicleColor?: string;
  onShare?: () => void;
}

const PreviewCard: React.FC<PreviewCardProps> = ({
  vehicleName,
  vehicleBrand,
  vehicleType,
  vehicleEmoji,
  vehicleColor = '#1E40AF',
  onShare
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Vehicle Preview</CardTitle>
          <Button variant="ghost" size="icon" onClick={onShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          {vehicleBrand} {vehicleName}
        </CardDescription>
      </CardHeader>
      
      <div className="relative aspect-video bg-gradient-to-b from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
        {/* Vehicle display area */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            duration: 0.8,
            bounce: 0.4
          }}
          className="relative"
        >
          <span className="text-8xl flex items-center justify-center">{vehicleEmoji}</span>
          
          {/* Color overlay */}
          <div 
            className="absolute inset-0 mix-blend-color opacity-60"
            style={{ backgroundColor: vehicleColor }}
          ></div>
        </motion.div>
        
        {/* 3D View button */}
        <Button 
          variant="secondary"
          size="sm"
          className="absolute bottom-4 right-4 flex items-center gap-1"
        >
          <Rotate3D className="h-4 w-4" />
          <span className="text-xs">3D View</span>
        </Button>
        
        {/* Angle indicators */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/80">
            <span className="text-xs">F</span>
          </Button>
          <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/80">
            <span className="text-xs">S</span>
          </Button>
          <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/80">
            <span className="text-xs">R</span>
          </Button>
          <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full bg-white/80">
            <span className="text-xs">T</span>
          </Button>
        </div>
      </div>
      
      <CardContent className="pt-6">
        <Tabs defaultValue="specifications">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="specifications" className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-md p-3">
                <div className="text-xs text-muted-foreground mb-1">Engine</div>
                <div className="font-medium flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  <span>2.0L Turbo</span>
                </div>
              </div>
              
              <div className="bg-muted rounded-md p-3">
                <div className="text-xs text-muted-foreground mb-1">Power</div>
                <div className="font-medium flex items-center gap-1">
                  <Gauge className="h-3.5 w-3.5 text-primary" />
                  <span>250 bhp</span>
                </div>
              </div>
              
              <div className="bg-muted rounded-md p-3">
                <div className="text-xs text-muted-foreground mb-1">Type</div>
                <div className="font-medium flex items-center gap-1">
                  <Car className="h-3.5 w-3.5 text-primary" />
                  <span>{vehicleType}</span>
                </div>
              </div>
              
              <div className="bg-muted rounded-md p-3">
                <div className="text-xs text-muted-foreground mb-1">Year</div>
                <div className="font-medium">2023</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="pt-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                Smart Connect
              </Badge>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                Premium Sound
              </Badge>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                Sport Package
              </Badge>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                Adaptive Cruise
              </Badge>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                Lane Assist
              </Badge>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                360° Camera
              </Badge>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Performance</span>
                <div className="w-2/3 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Economy</span>
                <div className="w-2/3 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Comfort</span>
                <div className="w-2/3 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Handling</span>
                <div className="w-2/3 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PreviewCard;