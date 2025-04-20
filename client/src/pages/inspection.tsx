import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import InspectionReport from '@/components/inspection/inspection-report';

const Inspection = () => {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const inspectionId = parseInt(params.id);
  
  // Fetch inspection data
  const { data: inspection, isLoading } = useQuery({
    queryKey: [`/api/inspections/${inspectionId}`],
  });
  
  const handleBack = () => {
    window.history.back();
  };
  
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto animate-pulse">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
        <div className="h-[600px] bg-gray-200 rounded-xl"></div>
      </div>
    );
  }
  
  if (!inspection && !isLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack} className="flex items-center">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </Button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Inspection Not Found</h3>
          <p className="text-neutral-light mb-4">The inspection report you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/vehicles')}>View Your Vehicles</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" onClick={handleBack} className="flex items-center p-0 hover:bg-transparent">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </Button>
          <div className="flex items-center">
            <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center mr-2">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
              Paid/Closed
            </Badge>
            <div className="flex items-center text-neutral-light text-sm">
              <Clock className="h-4 w-4 mr-1" />
              {inspection?.inspectionDate ? new Date(inspection.inspectionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
            </div>
          </div>
          <div></div>
        </div>
      </div>
      
      <InspectionReport inspectionId={inspectionId} />
    </div>
  );
};

export default Inspection;
