import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, AlertCircle, Calendar } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';

// Utility function to safely format dates
const safeFormat = (date: any, formatString: string): string => {
  try {
    // Ensure we have a valid Date object
    return format(date instanceof Date ? date : new Date(date), formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

interface DocumentExpiryCardProps {
  id: string;
  title: string;
  documentType: string;
  category: string;
  entityType: 'vehicle' | 'driver' | 'client';
  entityName: string;
  expiryDate: Date;
  theme: 'light' | 'dark';
  onRenew: (id: string) => void;
}

export function DocumentExpiryCard({
  id,
  title,
  documentType,
  category,
  entityType,
  entityName,
  expiryDate,
  theme,
  onRenew
}: DocumentExpiryCardProps) {
  // Calculate days remaining
  const daysRemaining = differenceInDays(new Date(expiryDate), new Date());
  
  // Determine urgency level
  const getUrgencyLevel = (): { color: string; indicator: string } => {
    if (daysRemaining <= 7) {
      return { 
        color: theme === 'dark' ? 'bg-red-900/30 text-red-300 border-red-800' : 'bg-red-50 text-red-700 border-red-200',
        indicator: 'Critical'
      };
    } else if (daysRemaining <= 30) {
      return { 
        color: theme === 'dark' ? 'bg-yellow-900/30 text-yellow-300 border-yellow-800' : 'bg-yellow-50 text-yellow-700 border-yellow-200',
        indicator: 'Warning'
      };
    } else {
      return { 
        color: theme === 'dark' ? 'bg-blue-900/30 text-blue-300 border-blue-800' : 'bg-blue-50 text-blue-700 border-blue-200',
        indicator: 'Notice'
      };
    }
  };
  
  const urgency = getUrgencyLevel();
  
  // Get entity icon
  const getEntityIcon = () => {
    switch (entityType) {
      case 'vehicle':
        return theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
      case 'driver':
        return theme === 'dark' ? 'text-green-400' : 'text-green-600';
      case 'client':
        return theme === 'dark' ? 'text-purple-400' : 'text-purple-600';
    }
  };
  
  return (
    <Card className={`overflow-hidden border ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'
    }`}>
      <div className={`h-2 w-full ${
        daysRemaining <= 7 
          ? 'bg-red-500' 
          : daysRemaining <= 30 
            ? 'bg-yellow-500' 
            : 'bg-blue-500'
      }`}></div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className={`text-base font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
            {title}
          </CardTitle>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${urgency.color}`}>
            {urgency.indicator}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <FileText className={`h-4 w-4 ${getEntityIcon()}`} />
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {documentType}{category ? ` - ${category}` : ''}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <AlertCircle className={`h-4 w-4 ${
            daysRemaining <= 7 
              ? 'text-red-500' 
              : daysRemaining <= 30 
                ? 'text-yellow-500' 
                : 'text-blue-500'
          }`} />
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className="font-medium">{daysRemaining}</span> days remaining
          </span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Calendar className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Expires on {safeFormat(expiryDate, 'PPP')}
          </span>
        </div>
        
        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Related to:</span> {entityName}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          size="sm" 
          className={daysRemaining <= 7 
            ? 'bg-red-600 hover:bg-red-700 w-full' 
            : daysRemaining <= 30 
              ? 'bg-yellow-600 hover:bg-yellow-700 w-full'
              : 'bg-blue-600 hover:bg-blue-700 w-full'
          }
          onClick={() => onRenew(id)}
        >
          <Clock className="h-4 w-4 mr-1" />
          Renew Now
        </Button>
      </CardFooter>
    </Card>
  );
}