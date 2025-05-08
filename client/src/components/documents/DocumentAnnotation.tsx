import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, PenLine, Trash2, Lock, Eye, Check, X, Save } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface Annotation {
  id: number;
  documentId: number;
  userId: number;
  annotationType: 'text' | 'highlight' | 'drawing';
  content: string;
  color: string;
  position: { x: number, y: number };
  page: number;
  rotation: number;
  opacity: number;
  isPrivate: boolean;
  createdAt: string;
  updatedAt?: string;
  user?: {
    id: number;
    username: string;
    fullName: string;
    initials: string;
  };
}

interface DocumentAnnotationProps {
  documentId: number;
  page?: number;
  previewUrl?: string;
}

export function DocumentAnnotation({ documentId, page = 1, previewUrl }: DocumentAnnotationProps) {
  const [newAnnotation, setNewAnnotation] = useState({
    content: '',
    isPrivate: false,
    color: '#FFFF00',
    annotationType: 'text' as const
  });
  const [editingAnnotation, setEditingAnnotation] = useState<Annotation | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  
  const { data: annotations = [], isLoading, error } = useQuery<Annotation[]>({
    queryKey: [`/api/documents/${documentId}/annotations`],
    enabled: !!documentId,
  });
  
  const createMutation = useMutation({
    mutationFn: async (annotation: any) => {
      const res = await apiRequest('POST', `/api/documents/${documentId}/annotations`, annotation);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Annotation created",
        description: "Your annotation has been added successfully",
      });
      
      setNewAnnotation({
        content: '',
        isPrivate: false,
        color: '#FFFF00',
        annotationType: 'text'
      });
      
      // Invalidate annotations query
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${documentId}/annotations`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating annotation",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: async (annotation: any) => {
      const res = await apiRequest('PUT', `/api/documents/annotations/${annotation.id}`, annotation);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Annotation updated",
        description: "Your changes have been saved",
      });
      
      setEditingAnnotation(null);
      setIsEditing(false);
      
      // Invalidate annotations query
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${documentId}/annotations`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating annotation",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/documents/annotations/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Annotation deleted",
      });
      
      // Invalidate annotations query
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${documentId}/annotations`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting annotation",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isEditing]);
  
  const handleCreateAnnotation = () => {
    if (!newAnnotation.content.trim()) {
      toast({
        title: "Content required",
        description: "Please add some content for your annotation",
        variant: "destructive",
      });
      return;
    }
    
    createMutation.mutate({
      documentId,
      annotationType: newAnnotation.annotationType,
      content: newAnnotation.content,
      color: newAnnotation.color,
      position: { x: 0, y: 0 }, // For simplicity, we're not implementing actual positioning
      page,
      rotation: 0,
      opacity: 1.0,
      isPrivate: newAnnotation.isPrivate
    });
  };
  
  const handleUpdateAnnotation = () => {
    if (!editingAnnotation) return;
    
    if (!editingAnnotation.content.trim()) {
      toast({
        title: "Content required",
        description: "Please add some content for your annotation",
        variant: "destructive",
      });
      return;
    }
    
    updateMutation.mutate({
      id: editingAnnotation.id,
      content: editingAnnotation.content,
      isPrivate: editingAnnotation.isPrivate,
      color: editingAnnotation.color
    });
  };
  
  const handleDeleteAnnotation = (id: number) => {
    deleteMutation.mutate(id);
  };
  
  const startEditing = (annotation: Annotation) => {
    setEditingAnnotation(annotation);
    setIsEditing(true);
  };
  
  const cancelEditing = () => {
    setEditingAnnotation(null);
    setIsEditing(false);
  };
  
  const getInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Document Annotations
        </CardTitle>
        <CardDescription>
          Collaborate with others by adding notes and highlights
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {previewUrl && (
          <div className="border rounded-md overflow-hidden">
            <img 
              src={previewUrl} 
              alt="Document preview" 
              className="w-full h-48 object-contain bg-muted/20" 
            />
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="annotationContent">New Annotation</Label>
            <Textarea 
              id="annotationContent" 
              placeholder="Add your note or comment here..." 
              value={newAnnotation.content} 
              onChange={(e) => setNewAnnotation({...newAnnotation, content: e.target.value})}
              className="min-h-24"
            />
            
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Label htmlFor="annotationColor" className="text-sm">Color:</Label>
                <Input 
                  id="annotationColor" 
                  type="color" 
                  value={newAnnotation.color} 
                  onChange={(e) => setNewAnnotation({...newAnnotation, color: e.target.value})}
                  className="w-12 h-6 p-0 cursor-pointer"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="isPrivate" className="text-sm">Private:</Label>
                <Switch 
                  id="isPrivate" 
                  checked={newAnnotation.isPrivate} 
                  onCheckedChange={(checked) => setNewAnnotation({...newAnnotation, isPrivate: checked})} 
                />
              </div>
            </div>
            
            <Button 
              onClick={handleCreateAnnotation} 
              disabled={createMutation.isPending || !newAnnotation.content.trim()}
              className="ml-auto"
            >
              Add Annotation
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">
              Failed to load annotations. Please try again.
            </div>
          ) : annotations.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              No annotations yet. Be the first to add one!
            </div>
          ) : (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium">Annotations ({annotations.length})</h3>
              
              {annotations.map(annotation => (
                <div 
                  key={annotation.id} 
                  className="p-4 border rounded-lg relative"
                  style={{ borderLeftColor: annotation.color, borderLeftWidth: '4px' }}
                >
                  {isEditing && editingAnnotation?.id === annotation.id ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{annotation.user?.initials || '??'}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{annotation.user?.fullName || 'Anonymous'}</span>
                        </div>
                        
                        {annotation.isPrivate && (
                          <div className="flex items-center text-yellow-600 text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            Private
                          </div>
                        )}
                      </div>
                      
                      <Textarea 
                        ref={contentRef}
                        value={editingAnnotation.content} 
                        onChange={(e) => setEditingAnnotation({...editingAnnotation, content: e.target.value})}
                        className="min-h-20"
                      />
                      
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="editColor" className="text-sm">Color:</Label>
                          <Input 
                            id="editColor" 
                            type="color" 
                            value={editingAnnotation.color} 
                            onChange={(e) => setEditingAnnotation({...editingAnnotation, color: e.target.value})}
                            className="w-12 h-6 p-0 cursor-pointer"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Label htmlFor="editPrivate" className="text-sm">Private:</Label>
                          <Switch 
                            id="editPrivate" 
                            checked={editingAnnotation.isPrivate} 
                            onCheckedChange={(checked) => setEditingAnnotation({...editingAnnotation, isPrivate: checked})} 
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={cancelEditing}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleUpdateAnnotation} 
                          disabled={updateMutation.isPending || !editingAnnotation.content.trim()}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{annotation.user?.initials || getInitials('Anonymous User')}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{annotation.user?.fullName || 'Anonymous'}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(annotation.createdAt).toLocaleString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        
                        {annotation.isPrivate && (
                          <div className="flex items-center text-yellow-600 text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            Private
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm whitespace-pre-line">{annotation.content}</p>
                      
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => startEditing(annotation)}
                        >
                          <PenLine className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteAnnotation(annotation.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}