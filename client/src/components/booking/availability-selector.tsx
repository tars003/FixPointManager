import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Availability } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Check } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface AvailabilitySelectorProps {
  providerId: number;
  onSave: () => void;
}

const AvailabilitySelector = ({ providerId, onSave }: AvailabilitySelectorProps) => {
  const { toast } = useToast();
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3]); // Mon, Tue, Wed by default
  const [sameTimeForAllDays, setSameTimeForAllDays] = useState(true);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("17:00");
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch current availability
  const { data: availability, isLoading } = useQuery<Availability[]>({
    queryKey: [`/api/availability/${providerId}`],
  });
  
  // Set initial state based on existing availability
  useState(() => {
    if (availability && availability.length > 0) {
      const days = availability.map(a => a.dayOfWeek);
      setSelectedDays(days);
      
      // Check if all days have the same time range
      const firstStart = availability[0].startTime;
      const firstEnd = availability[0].endTime;
      const allSameTime = availability.every(
        a => a.startTime === firstStart && a.endTime === firstEnd
      );
      
      setSameTimeForAllDays(allSameTime);
      setStartTime(firstStart);
      setEndTime(firstEnd);
    }
  });
  
  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };
  
  const handleSave = async () => {
    if (selectedDays.length === 0) {
      toast({
        title: "No days selected",
        description: "Please select at least one day of availability.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Delete existing availability
      if (availability) {
        for (const avail of availability) {
          await apiRequest('DELETE', `/api/availability/${avail.id}`);
        }
      }
      
      // Create new availability for each selected day
      for (const day of selectedDays) {
        await apiRequest('POST', '/api/availability', {
          providerId,
          dayOfWeek: day,
          startTime,
          endTime
        });
      }
      
      toast({
        title: "Availability saved",
        description: "Your availability settings have been updated.",
      });
      
      onSave();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save availability. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Convert day numbers to day names
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const getSelectedDaysText = () => {
    return selectedDays.map(day => dayNames[day]).join(", ");
  };
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="flex space-x-2">
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="w-10 h-10 rounded-full bg-gray-200"></div>
          ))}
        </div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Set availability</h2>
      
      <div className="mb-6">
        <h3 className="font-medium mb-3">Choose days</h3>
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                selectedDays.includes(day) 
                  ? 'bg-primary-light text-primary' 
                  : 'bg-gray-100 text-neutral-dark'
              }`}
            >
              {dayNames[day]}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-3">Set time</h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Same time for all days</p>
            <p className="text-sm text-neutral-light">
              {sameTimeForAllDays 
                ? 'You have set the same available time range for all selected days' 
                : 'Set different times for each day'}
            </p>
          </div>
          <div className="flex items-center">
            <span className="text-sm mr-3">{getSelectedDaysText()}</span>
            <button className="text-primary hover:text-primary-dark font-medium">
              Change
            </button>
            <Switch
              checked={sameTimeForAllDays}
              onCheckedChange={setSameTimeForAllDays}
              className="ml-4"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-3">Available hours</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-sm mb-1 text-neutral-light">From</label>
            <select 
              className="block w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            >
              <option value="08:00">08:00 AM</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-neutral-light">To</label>
            <select 
              className="block w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            >
              <option value="16:00">04:00 PM</option>
              <option value="17:00">05:00 PM</option>
              <option value="18:00">06:00 PM</option>
              <option value="19:00">07:00 PM</option>
              <option value="20:00">08:00 PM</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition w-full md:w-auto"
        >
          {isSaving ? 'Saving...' : 'Complete & Save'}
        </button>
      </div>
    </div>
  );
};

export default AvailabilitySelector;
