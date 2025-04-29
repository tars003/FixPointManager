import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Battery, Droplets } from 'lucide-react';

interface Vehicle {
  id: number;
  vehicle: string;
  worth: number;
  percentage: number;
  image: string;
  mileage: number;
  fuelType: string;
  batteryHealth?: number;
  engineHealth?: number;
  lastService: string;
  nextService: string;
  purchaseDate: string;
  insuranceValid: string;
  maintenanceCost: number;
  efficiency: string;
  averageCharge?: string;
  averageFuel?: string;
  range?: string;
  carbonOffset?: string;
  topSpeed?: string;
  emissionRating?: string;
}

interface VehicleCarouselProps {
  vehicles: Vehicle[];
  onVehicleSelect: (vehicle: Vehicle) => void;
}

const VehicleCarousel: React.FC<VehicleCarouselProps> = ({ vehicles, onVehicleSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === vehicles.length - 1 ? 0 : prevIndex + 1));
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? vehicles.length - 1 : prevIndex - 1));
  };
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
    }
    autoPlayRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 8000); // Resume auto-sliding after 8 seconds of inactivity
  };
  
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setTimeout(() => {
        nextSlide();
      }, 3000); // Slides every 3 seconds
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, [currentIndex, isAutoPlaying]);
  
  const handleVehicleClick = (vehicle: Vehicle) => {
    onVehicleSelect(vehicle);
    setIsAutoPlaying(false);
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
    }
  };
  
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl bg-white dark:bg-slate-800 shadow-md">
        <div className="relative">
          <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {vehicles.map((vehicle, index) => (
              <div 
                key={vehicle.id} 
                className="min-w-full"
                onClick={() => handleVehicleClick(vehicle)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors rounded-xl">
                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{vehicle.vehicle}</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Current Value</p>
                          <p className="font-bold text-lg text-slate-900 dark:text-white">₹{vehicle.worth.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Mileage</p>
                          <p className="font-bold text-lg text-slate-900 dark:text-white">{vehicle.mileage.toLocaleString()} km</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                        {vehicle.fuelType}
                      </Badge>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                        Next Service: {vehicle.nextService}
                      </Badge>
                      {vehicle.batteryHealth && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                          Battery: {vehicle.batteryHealth}%
                        </Badge>
                      )}
                      {vehicle.engineHealth && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                          Engine: {vehicle.engineHealth}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-lg aspect-[16/10]">
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.vehicle} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-white font-medium">Since {vehicle.purchaseDate}</p>
                        <Badge 
                          className={`${
                            vehicle.fuelType === 'Electric' 
                              ? 'bg-emerald-500/90 hover:bg-emerald-500' 
                              : 'bg-blue-500/90 hover:bg-blue-500'
                          } text-white`}
                        >
                          {vehicle.fuelType === 'Electric' ? <Battery className="h-3 w-3 mr-1" /> : <Droplets className="h-3 w-3 mr-1" />}
                          {vehicle.fuelType === 'Electric' ? vehicle.range : vehicle.efficiency}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation controls */}
        <div className="px-4 pb-4 flex justify-between items-center">
          <div className="flex gap-1">
            {vehicles.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'w-6 bg-primary' 
                    : 'w-2 bg-slate-300 dark:bg-slate-600'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCarousel;