import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Inspection, Vehicle } from "@shared/schema";
import { ChevronDown, ChevronUp, Download, Check, AlertTriangle, XCircle } from "lucide-react";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface InspectionReportProps {
  inspectionId: number;
}

const InspectionReport = ({ inspectionId }: InspectionReportProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    structure: true,
    exterior: false,
    engine: false,
  });
  
  const { data: inspection, isLoading } = useQuery<Inspection>({
    queryKey: [`/api/inspections/${inspectionId}`],
  });
  
  const { data: vehicle } = useQuery<Vehicle>({
    queryKey: [`/api/vehicles/${inspection?.vehicleId}`],
    enabled: !!inspection?.vehicleId,
  });
  
  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded w-1/2"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    );
  }
  
  if (!inspection) {
    return (
      <div className="text-center py-8">
        <h3 className="font-medium text-lg">Inspection not found</h3>
        <p className="text-neutral-light mt-2">
          The requested inspection report could not be found.
        </p>
      </div>
    );
  }
  
  const details = inspection.details as Record<string, any>;
  
  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'good':
      case 'ok':
      case 'okay':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'warning':
      case 'attention':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
      case 'bad':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Check className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Inspection Report
          </h2>
          <Button variant="outline" className="flex items-center gap-1">
            <Download className="h-4 w-4 mr-1" />
            Download Report
          </Button>
        </div>
        <div className="mt-2">
          <p className="text-neutral-light text-sm">
            {vehicle ? `${vehicle.year} ${vehicle.name} ${vehicle.model}` : 'Vehicle Details'}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Vehicle Info Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(details.summary || {}).map(([key, value], index) => (
            <div key={index}>
              <p className="text-neutral-light text-xs uppercase">{key}</p>
              <p className={`font-medium ${
                value === 'Paid/Closed' ? 'text-green-600' : ''
              }`}>
                {value as string}
              </p>
            </div>
          ))}
        </div>
        
        {/* Inspection Details */}
        <div className="space-y-4">
          {/* Structure Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button 
              className="w-full px-4 py-3 flex items-center justify-between font-medium text-neutral-dark hover:bg-gray-50 transition"
              onClick={() => toggleSection('structure')}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
                STRUCTURE
              </div>
              {openSections.structure ? (
                <ChevronUp className="h-5 w-5 text-neutral-light" />
              ) : (
                <ChevronDown className="h-5 w-5 text-neutral-light" />
              )}
            </button>
            
            {openSections.structure && (
              <div className="px-4 pb-4">
                <div className="border-t border-gray-200 pt-3">
                  <div className="space-y-3">
                    {details.structure?.items?.map((item: any, index: number) => (
                      <div key={index} className="flex items-center">
                        <div className="flex-shrink-0 h-5 w-5">
                          {getStatusIcon(item.status)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-neutral-dark">{item.name}</p>
                          <p className="text-xs text-neutral-light">{item.description}</p>
                        </div>
                        {item.imageUrl && (
                          <div className="ml-auto">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name} 
                              className="h-10 w-16 object-cover rounded" 
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {details.structure?.items?.length > 5 && (
                    <div className="mt-3 flex justify-center">
                      <button className="text-primary font-medium text-sm hover:text-primary-dark transition">
                        + Show more
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Exterior Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button 
              className="w-full px-4 py-3 flex items-center justify-between font-medium text-neutral-dark hover:bg-gray-50 transition"
              onClick={() => toggleSection('exterior')}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                EXTERIOR PANEL
              </div>
              {openSections.exterior ? (
                <ChevronUp className="h-5 w-5 text-neutral-light" />
              ) : (
                <ChevronDown className="h-5 w-5 text-neutral-light" />
              )}
            </button>
            
            {openSections.exterior && (
              <div className="px-4 pb-4">
                <div className="border-t border-gray-200 pt-3">
                  <div className="space-y-3">
                    {details.exterior?.items?.map((item: any, index: number) => (
                      <div key={index} className="flex items-center">
                        <div className="flex-shrink-0 h-5 w-5">
                          {getStatusIcon(item.status)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-neutral-dark">{item.name}</p>
                          <p className="text-xs text-neutral-light">{item.description}</p>
                        </div>
                        {item.imageUrl && (
                          <div className="ml-auto">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name} 
                              className="h-10 w-16 object-cover rounded" 
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Engine Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button 
              className="w-full px-4 py-3 flex items-center justify-between font-medium text-neutral-dark hover:bg-gray-50 transition"
              onClick={() => toggleSection('engine')}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                ENGINE COMPARTMENT
              </div>
              {openSections.engine ? (
                <ChevronUp className="h-5 w-5 text-neutral-light" />
              ) : (
                <ChevronDown className="h-5 w-5 text-neutral-light" />
              )}
            </button>
            
            {openSections.engine && (
              <div className="px-4 pb-4">
                <div className="border-t border-gray-200 pt-3">
                  <div className="space-y-3">
                    {details.engine?.items?.map((item: any, index: number) => (
                      <div key={index} className="flex items-center">
                        <div className="flex-shrink-0 h-5 w-5">
                          {getStatusIcon(item.status)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-neutral-dark">{item.name}</p>
                          <p className="text-xs text-neutral-light">{item.description}</p>
                        </div>
                        {item.imageUrl && (
                          <div className="ml-auto">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name} 
                              className="h-10 w-16 object-cover rounded" 
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InspectionReport;
