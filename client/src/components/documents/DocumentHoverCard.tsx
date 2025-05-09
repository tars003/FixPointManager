import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Calendar, Clock, Download, Share, Eye } from 'lucide-react';

interface DocumentPreviewProps {
  document: {
    id: string;
    title: string;
    type: string;
    category: string;
    dateAdded: string;
    expiryDate?: string;
    status: 'valid' | 'expiring' | 'expired';
    thumbnailUrl?: string;
    fileSize?: string;
    fileType?: string;
  };
  children: React.ReactNode;
}

const DocumentHoverCard: React.FC<DocumentPreviewProps> = ({ document, children }) => {
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Calculate days remaining until expiry
  const getDaysRemaining = (expiryDateString?: string) => {
    if (!expiryDateString) return null;
    
    const expiryDate = new Date(expiryDateString);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(document.expiryDate);

  // Get status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'expiring':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'expired':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Get status message
  const getStatusMessage = (status: string, daysRemaining: number | null) => {
    switch (status) {
      case 'valid':
        return daysRemaining 
          ? `Valid (Expires in ${daysRemaining} days)` 
          : 'Valid';
      case 'expiring':
        return `Expiring Soon (${daysRemaining} days left)`;
      case 'expired':
        return 'Expired';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <HoverCard openDelay={300} closeDelay={200}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0 shadow-lg" align="start">
        <Card className="border-0 shadow-none">
          <CardHeader className="py-3 bg-blue-50 border-b">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">{document.title}</CardTitle>
                <CardDescription>{document.type}</CardDescription>
              </div>
              <Badge variant="outline" className={`${getStatusColor(document.status)}`}>
                {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            {/* Document Thumbnail */}
            <div className="flex justify-center mb-2">
              {document.thumbnailUrl ? (
                <img src={document.thumbnailUrl} alt={document.title} className="h-32 object-cover rounded border" />
              ) : (
                <div className="h-32 w-full bg-gray-100 flex items-center justify-center rounded border">
                  <FileText className="h-10 w-10 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Document Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Added On
                </span>
                <span>{formatDate(document.dateAdded)}</span>
              </div>
              
              {document.expiryDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Expiry
                  </span>
                  <span className={document.status === 'expired' ? 'text-red-600 font-medium' : ''}>
                    {formatDate(document.expiryDate)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-500 flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  Category
                </span>
                <span>{document.category}</span>
              </div>
              
              {document.fileSize && (
                <div className="flex justify-between">
                  <span className="text-gray-500">File Size</span>
                  <span>{document.fileSize}</span>
                </div>
              )}
            </div>
            
            {/* Status Message */}
            {document.expiryDate && (
              <div className={`text-xs p-1.5 rounded text-center ${getStatusColor(document.status)}`}>
                {getStatusMessage(document.status, daysRemaining)}
              </div>
            )}
          </CardContent>
          <CardFooter className="p-2 pt-0 flex justify-between">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
              <Download className="h-3.5 w-3.5 mr-1" />
              Download
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
              <Share className="h-3.5 w-3.5 mr-1" />
              Share
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
              <Eye className="h-3.5 w-3.5 mr-1" />
              View
            </Button>
          </CardFooter>
        </Card>
      </HoverCardContent>
    </HoverCard>
  );
};

export default DocumentHoverCard;