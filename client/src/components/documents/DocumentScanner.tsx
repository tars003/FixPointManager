import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, UploadCloud, FileText, Check, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface DocumentScannerProps {
  vehicleId: number;
  onScanComplete: (data: any) => void;
}

export function DocumentScanner({ vehicleId, onScanComplete }: DocumentScannerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); 
  const [progress, setProgress] = useState(0);
  const [detectedData, setDetectedData] = useState<any>(null);
  const [confidence, setConfidence] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };
  
  const handleScan = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to scan",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setProgress(10);
    
    try {
      // Create FormData and append file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('vehicleId', vehicleId.toString());
      
      // Simulate network and processing delay
      setProgress(30);
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(60);
      setIsUploading(false);
      setIsProcessing(true);
      
      // Make API request
      const response = await fetch('/api/documents/auto-detect', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to process document');
      }
      
      const data = await response.json();
      setDetectedData(data);
      setConfidence(data.confidence * 100);
      setProgress(100);
      setIsProcessing(false);
      
      onScanComplete(data);
      
      toast({
        title: "Document processed successfully",
        description: `Detected document type: ${data.detectedType}`,
      });
    } catch (error) {
      console.error('Error scanning document:', error);
      setIsUploading(false);
      setIsProcessing(false);
      
      toast({
        title: "Error processing document",
        description: "Failed to process the document. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const resetScanner = () => {
    setFile(null);
    setIsUploading(false);
    setIsProcessing(false);
    setProgress(0);
    setDetectedData(null);
    setConfidence(0);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadCloud className="h-5 w-5" />
          Document Scanner
        </CardTitle>
        <CardDescription>
          Upload a document to automatically detect and extract information
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!detectedData ? (
          <>
            <div className="grid w-full items-center gap-4">
              <div className="space-y-2">
                <Label htmlFor="documentFile">Select Document</Label>
                <Input 
                  ref={fileInputRef}
                  id="documentFile" 
                  type="file" 
                  accept=".jpg,.jpeg,.png,.pdf" 
                  onChange={handleFileChange}
                  disabled={isUploading || isProcessing}
                />
              </div>
              
              {(isUploading || isProcessing) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{isUploading ? 'Uploading...' : 'Processing...'}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
              
              {file && (
                <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/20">
                  <FileText className="h-5 w-5 text-primary" />
                  <div className="flex-1 truncate">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB • {file.type}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">{detectedData.detectedType}</span>
                </div>
                <Badge variant={confidence > 85 ? "success" : confidence > 65 ? "warning" : "destructive"}>
                  {confidence.toFixed(0)}% Confidence
                </Badge>
              </div>
              
              <div className="space-y-4 p-4 border rounded-md bg-muted/20">
                <h4 className="font-medium">Extracted Information</h4>
                
                {Object.entries(detectedData.extractedData).length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(detectedData.extractedData).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <Label className="text-xs text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/([a-z])([A-Z])/g, '$1 $2')}
                        </Label>
                        <p className="text-sm font-medium">{value as string}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    <p>No data could be extracted</p>
                  </div>
                )}
                
                <div className="pt-2 border-t">
                  <Label className="text-xs text-muted-foreground">Suggested Name</Label>
                  <p className="text-sm font-medium">{detectedData.suggestedName}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {!detectedData ? (
          <>
            <Button variant="outline" onClick={resetScanner} disabled={!file || isUploading || isProcessing}>
              Clear
            </Button>
            <Button onClick={handleScan} disabled={!file || isUploading || isProcessing}>
              {isUploading || isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUploading ? 'Uploading' : 'Processing'}
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Scan Document
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={resetScanner}>
              Scan Another Document
            </Button>
            <Button onClick={() => onScanComplete(detectedData)}>
              <Check className="mr-2 h-4 w-4" />
              Use This Data
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}