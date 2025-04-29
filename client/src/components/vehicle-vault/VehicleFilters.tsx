import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type FilterTabType = 'filters' | 'calendar';

interface VehicleFiltersProps {
  statusTitle: string;
  onFilterChange: (filters: {
    search: string;
    fuelType: string;
    dateRange: { from: Date | undefined; to: Date | undefined };
  }) => void;
}

const VehicleFilters: React.FC<VehicleFiltersProps> = ({ 
  statusTitle,
  onFilterChange 
}) => {
  const [activeTab, setActiveTab] = useState<FilterTabType>('filters');
  const [search, setSearch] = useState('');
  const [fuelType, setFuelType] = useState('all');
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    onFilterChange({
      search,
      fuelType,
      dateRange: date
    });
  }, [search, fuelType, date, onFilterChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFuelTypeChange = (value: string) => {
    setFuelType(value);
  };

  const handleClearFilters = () => {
    setSearch('');
    setFuelType('all');
    setDate({
      from: undefined,
      to: undefined,
    });
  };

  return (
    <div className="mb-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-4 w-4 text-blue-500" />
          {statusTitle} Filters
        </h3>
        {(search || fuelType !== 'all' || date.from || date.to) && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearFilters}
            className="text-xs"
          >
            Clear Filters
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FilterTabType)}>
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="filters" className="flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="filters">
          <div className="space-y-4">
            <div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder={`Search ${statusTitle.toLowerCase()} vehicles...`}
                  className="pl-9"
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1.5 text-slate-700 dark:text-slate-300">
                  Fuel Type
                </label>
                <Select value={fuelType} onValueChange={handleFuelTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="cng">CNG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active filters display */}
              <div>
                <label className="text-sm font-medium block mb-1.5 text-slate-700 dark:text-slate-300">
                  Active Filters
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {search && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                      Search: {search}
                    </Badge>
                  )}
                  {fuelType !== 'all' && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      Fuel: {fuelType}
                    </Badge>
                  )}
                  {(date.from || date.to) && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                      Date: {date.from ? format(date.from, 'PP') : 'Any'} - {date.to ? format(date.to, 'PP') : 'Any'}
                    </Badge>
                  )}
                  {!search && fuelType === 'all' && !date.from && !date.to && (
                    <span className="text-sm text-slate-500 italic">No filters applied</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <div>
            <label className="text-sm font-medium block mb-1.5 text-slate-700 dark:text-slate-300">
              Date Range
            </label>
            <div className="grid gap-2">
              <div className="flex flex-col md:flex-row gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full md:w-[240px] justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "PPP")} - {format(date.to, "PPP")}
                          </>
                        ) : (
                          format(date.from, "PPP")
                        )
                      ) : (
                        <span>Select date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={date.from}
                      selected={date}
                      onSelect={(range) => {
                        if (range) {
                          setDate(range);
                        }
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>

                <Button 
                  variant="outline" 
                  size="default" 
                  onClick={() => setDate({from: undefined, to: undefined})}
                  className="text-sm"
                  disabled={!date.from && !date.to}
                >
                  Clear Dates
                </Button>
              </div>
              <div className="mt-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Filter vehicles by dates such as purchase date, registration date, or last service date depending on the current status.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleFilters;