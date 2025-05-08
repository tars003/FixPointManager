import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCheck, FilePlus, FileX, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface DocumentRecommendation {
  id: number;
  userId: number;
  vehicleId: number;
  documentType: string;
  recommendationSource: string;
  recommendationReason: string;
  priority: number;
  status: string;
  title: string;
  description: string;
  createdAt?: string;
  completedAt?: string;
  dismissedAt?: string;
  createdDocumentId?: number;
}

interface DocumentRecommendationsProps {
  vehicleId: number;
  onCreateDocument?: (documentType: string, title: string, description: string) => void;
}

export function DocumentRecommendations({ vehicleId, onCreateDocument }: DocumentRecommendationsProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: recommendations, isLoading, error, refetch } = useQuery<DocumentRecommendation[]>({
    queryKey: [`/api/vehicles/${vehicleId}/document-recommendations`],
    enabled: !!vehicleId,
  });
  
  const acceptMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('POST', `/api/documents/recommendations/${id}/accept`);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Recommendation accepted",
        description: "New document created successfully",
      });
      
      // Invalidate recommendations query
      queryClient.invalidateQueries({ queryKey: [`/api/vehicles/${vehicleId}/document-recommendations`] });
      
      // Invalidate documents query
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      
      // Call onCreateDocument if provided
      if (onCreateDocument && data.document) {
        onCreateDocument(
          data.document.documentType,
          data.document.name,
          data.document.description
        );
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error accepting recommendation",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const dismissMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('POST', `/api/documents/recommendations/${id}/dismiss`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Recommendation dismissed",
      });
      
      // Invalidate recommendations query
      queryClient.invalidateQueries({ queryKey: [`/api/vehicles/${vehicleId}/document-recommendations`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error dismissing recommendation",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  const handleAccept = (id: number) => {
    acceptMutation.mutate(id);
  };
  
  const handleDismiss = (id: number) => {
    dismissMutation.mutate(id);
  };
  
  const getPriorityBadge = (priority: number) => {
    if (priority >= 5) return <Badge variant="destructive">Critical</Badge>;
    if (priority >= 4) return <Badge variant="warning">High</Badge>;
    if (priority >= 3) return <Badge variant="secondary">Medium</Badge>;
    return <Badge variant="outline">Low</Badge>;
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            <Skeleton className="h-5 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Lightbulb className="h-5 w-5" />
            Error Loading Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Failed to load document recommendations. Please try again.</p>
          <Button onClick={() => refetch()} variant="outline" className="mt-4">Retry</Button>
        </CardContent>
      </Card>
    );
  }
  
  if (!recommendations || recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Document Recommendations
          </CardTitle>
          <CardDescription>
            No recommendations available for this vehicle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            All required documents have been added. You're all set!
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Document Recommendations
        </CardTitle>
        <CardDescription>
          Add these recommended documents to keep your vehicle compliant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map(rec => (
            <div 
              key={rec.id} 
              className={`border rounded-lg p-4 space-y-2 cursor-pointer transition-all ${expandedId === rec.id ? 'shadow-md bg-primary/5' : 'hover:bg-muted/50'}`}
              onClick={() => toggleExpand(rec.id)}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <FilePlus className="h-4 w-4 text-primary" />
                  {rec.title}
                </h4>
                {getPriorityBadge(rec.priority)}
              </div>
              
              <p className="text-sm text-muted-foreground">{rec.description}</p>
              
              {expandedId === rec.id && (
                <>
                  <div className="pt-2 mt-2 border-t text-sm space-y-2">
                    <p>
                      <span className="font-medium">Document Type:</span> {rec.documentType.replace(/_/g, ' ')}
                    </p>
                    <p>
                      <span className="font-medium">Reason:</span> {rec.recommendationReason}
                    </p>
                    <p>
                      <span className="font-medium">Source:</span> {rec.recommendationSource.replace(/-/g, ' ')}
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss(rec.id);
                      }}
                      disabled={dismissMutation.isPending}
                    >
                      <FileX className="h-4 w-4 mr-2" />
                      Dismiss
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccept(rec.id);
                      }}
                      disabled={acceptMutation.isPending}
                    >
                      <FileCheck className="h-4 w-4 mr-2" />
                      Add Document
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}