import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  UploadCloud, 
  FileText, 
  Image, 
  File, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/ui/page-header';
import { useToast } from '@/hooks/use-toast';
import AdvancedPageTransition from '@/components/transitions/advanced-page-transition';
import AnimatedUploadProgress from '@/components/documents/animated-upload-progress';

const AnimationShowcase: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('page-transitions');
  const [selectedTransition, setSelectedTransition] = useState<
    { type: 'fade' | 'slide' | 'scale' | 'flip' | 'rotate' | 'skew'; direction?: 'up' | 'down' | 'left' | 'right' }
  >({ type: 'fade' });
  
  const [previewContent, setPreviewContent] = useState<React.ReactNode>(
    <div className="p-6 bg-white rounded-lg border shadow-sm">
      <h3 className="text-lg font-medium">Content Preview</h3>
      <p className="text-gray-500">This content will transition with the selected animation.</p>
    </div>
  );
  
  const [uploadStates, setUploadStates] = useState<Array<{
    id: number;
    status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
    progress: number;
    fileName: string;
    fileSize: string;
    errorMessage?: string;
  }>>([
    {
      id: 1,
      status: 'idle',
      progress: 0,
      fileName: 'driving_license.pdf',
      fileSize: '2.3 MB',
    },
    {
      id: 2,
      status: 'idle',
      progress: 0,
      fileName: 'vehicle_insurance.jpg',
      fileSize: '1.8 MB',
    },
    {
      id: 3,
      status: 'idle',
      progress: 0,
      fileName: 'vehicle_registration.pdf',
      fileSize: '3.1 MB',
    }
  ]);
  
  // Preview animation effect
  const refreshKey = useRef(0);
  const triggerPreviewAnimation = () => {
    refreshKey.current += 1;
    setPreviewContent(
      <div className="p-6 bg-white rounded-lg border shadow-sm">
        <h3 className="text-lg font-medium">Content Preview</h3>
        <p className="text-gray-500">This content will transition with the selected animation.</p>
        <div className="mt-4 flex items-center gap-2">
          <Check className="text-green-500 h-5 w-5" />
          <span>Animation applied!</span>
        </div>
      </div>
    );
  };
  
  // Handle upload simulation
  const simulateUpload = (id: number) => {
    // Set status to uploading and reset progress
    setUploadStates(prevStates => 
      prevStates.map(state => 
        state.id === id 
          ? { ...state, status: 'uploading' as const, progress: 0 } 
          : state
      )
    );
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Move to processing stage
        setUploadStates(prevStates => 
          prevStates.map(state => 
            state.id === id 
              ? { ...state, status: 'processing' as const, progress: 0 } 
              : state
          )
        );
        
        // Simulate processing
        let processingProgress = 0;
        const processingInterval = setInterval(() => {
          processingProgress += Math.random() * 20;
          if (processingProgress >= 100) {
            processingProgress = 100;
            clearInterval(processingInterval);
            
            // Random success or error
            const isSuccess = Math.random() > 0.2; // 80% success rate
            
            setUploadStates(prevStates => 
              prevStates.map(state => 
                state.id === id 
                  ? { 
                      ...state, 
                      status: isSuccess ? 'success' : 'error' as const, 
                      progress: 100,
                      errorMessage: isSuccess ? undefined : 'Network error. Please try again.'
                    } 
                  : state
              )
            );
          } else {
            setUploadStates(prevStates => 
              prevStates.map(state => 
                state.id === id 
                  ? { ...state, progress: processingProgress } 
                  : state
              )
            );
          }
        }, 200);
      } else {
        setUploadStates(prevStates => 
          prevStates.map(state => 
            state.id === id 
              ? { ...state, progress } 
              : state
          )
        );
      }
    }, 200);
  };
  
  const handleRetry = (id: number) => {
    simulateUpload(id);
  };
  
  const handleCancel = (id: number) => {
    setUploadStates(prevStates => 
      prevStates.map(state => 
        state.id === id 
          ? { ...state, status: 'idle', progress: 0 } 
          : state
      )
    );
    
    toast({
      title: "Upload cancelled",
      description: "Document upload has been cancelled.",
    });
  };
  
  const handleDismiss = (id: number) => {
    // For demonstration, we'll just reset the state
    setUploadStates(prevStates => 
      prevStates.map(state => 
        state.id === id 
          ? { ...state, status: 'idle', progress: 0 } 
          : state
      )
    );
  };
  
  // Demonstration of all transitions at once
  const [demoAllTransitions, setDemoAllTransitions] = useState(false);
  const startTransitionDemo = () => {
    setDemoAllTransitions(true);
    
    // Reset after demo
    setTimeout(() => {
      setDemoAllTransitions(false);
    }, 3000);
  };
  
  // Display file icon based on file extension
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="h-6 w-6 text-blue-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <PageHeader 
        title="Animation Showcase" 
        description="Explore the available animations and transitions in the application"
        icon={<Sparkles className="h-6 w-6 text-pink-500" />}
      />
      
      <Tabs defaultValue="page-transitions" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="page-transitions">Page Transitions</TabsTrigger>
          <TabsTrigger value="upload-progress">Upload Progress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="page-transitions" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Transition Options</CardTitle>
                <CardDescription>Select a transition type and customize its parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Transition Type</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['fade', 'slide', 'scale', 'flip', 'rotate', 'skew'].map((type) => (
                        <Button
                          key={type}
                          variant={selectedTransition.type === type ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTransition({ 
                            type: type as any, 
                            direction: type === 'slide' ? 'up' : undefined 
                          })}
                          className="capitalize"
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {selectedTransition.type === 'slide' && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Direction</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {['up', 'down', 'left', 'right'].map((direction) => (
                          <Button
                            key={direction}
                            variant={selectedTransition.direction === direction ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTransition({ 
                              ...selectedTransition,
                              direction: direction as any
                            })}
                            className="capitalize"
                          >
                            {direction}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={triggerPreviewAnimation}
                  className="w-full"
                >
                  Apply Transition
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>See how the selected transition will look</CardDescription>
              </CardHeader>
              <CardContent className="min-h-[300px] flex items-center justify-center">
                <div className="w-full max-w-md">
                  <AdvancedPageTransition 
                    key={refreshKey.current}
                    type={selectedTransition.type}
                    direction={selectedTransition.direction}
                    duration={0.5}
                  >
                    {previewContent}
                  </AdvancedPageTransition>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Transition Demo</CardTitle>
                <CardDescription>See all transitions in action</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {demoAllTransitions ? (
                    <>
                      <AdvancedPageTransition type="fade" duration={0.5}>
                        <div className="p-4 border rounded-lg bg-white shadow-sm">
                          <h3 className="font-medium text-center">Fade</h3>
                        </div>
                      </AdvancedPageTransition>
                      
                      <AdvancedPageTransition type="slide" direction="up" duration={0.5}>
                        <div className="p-4 border rounded-lg bg-white shadow-sm">
                          <h3 className="font-medium text-center">Slide Up</h3>
                        </div>
                      </AdvancedPageTransition>
                      
                      <AdvancedPageTransition type="scale" duration={0.5}>
                        <div className="p-4 border rounded-lg bg-white shadow-sm">
                          <h3 className="font-medium text-center">Scale</h3>
                        </div>
                      </AdvancedPageTransition>
                      
                      <AdvancedPageTransition type="flip" duration={0.5}>
                        <div className="p-4 border rounded-lg bg-white shadow-sm">
                          <h3 className="font-medium text-center">Flip</h3>
                        </div>
                      </AdvancedPageTransition>
                      
                      <AdvancedPageTransition type="rotate" duration={0.5}>
                        <div className="p-4 border rounded-lg bg-white shadow-sm">
                          <h3 className="font-medium text-center">Rotate</h3>
                        </div>
                      </AdvancedPageTransition>
                      
                      <AdvancedPageTransition type="skew" duration={0.5}>
                        <div className="p-4 border rounded-lg bg-white shadow-sm">
                          <h3 className="font-medium text-center">Skew</h3>
                        </div>
                      </AdvancedPageTransition>
                    </>
                  ) : (
                    Array(6).fill(0).map((_, i) => (
                      <div key={i} className="p-4 border rounded-lg bg-gray-50">
                        <h3 className="font-medium text-center text-gray-300">Placeholder</h3>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={startTransitionDemo}
                  variant={demoAllTransitions ? "outline" : "default"}
                  className="mx-auto"
                  disabled={demoAllTransitions}
                >
                  {demoAllTransitions ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Running Demo...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Run Demo
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="upload-progress" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Upload</CardTitle>
                <CardDescription>Select documents to upload and track their progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {uploadStates.map((upload) => (
                  <div 
                    key={upload.id} 
                    className="p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {getFileIcon(upload.fileName)}
                      <div>
                        <h3 className="font-medium">{upload.fileName}</h3>
                        <p className="text-sm text-gray-500">{upload.fileSize}</p>
                      </div>
                      
                      {upload.status === 'idle' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="ml-auto"
                          onClick={() => simulateUpload(upload.id)}
                        >
                          <UploadCloud className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upload Progress</CardTitle>
                <CardDescription>Real-time animated progress indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {uploadStates.map((upload) => (
                  upload.status !== 'idle' && (
                    <AnimatedUploadProgress
                      key={upload.id}
                      status={upload.status}
                      progress={upload.progress}
                      fileName={upload.fileName}
                      fileSize={upload.fileSize}
                      errorMessage={upload.errorMessage}
                      onCancel={() => handleCancel(upload.id)}
                      onRetry={() => handleRetry(upload.id)}
                      onDismiss={() => handleDismiss(upload.id)}
                      autoHide={upload.status === 'success'}
                      hideDelay={5000}
                    />
                  )
                ))}
                
                {!uploadStates.some(upload => upload.status !== 'idle') && (
                  <div className="p-8 border border-dashed rounded-lg flex flex-col items-center justify-center text-center">
                    <UploadCloud className="h-10 w-10 text-gray-300 mb-2" />
                    <p className="text-gray-500">Start an upload from the left panel to see progress indicators</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Implementation Overview</CardTitle>
                  <CardDescription>How to implement these animations in your application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Page Transitions</h3>
                    <p className="text-gray-600">
                      Use the <code className="bg-gray-100 p-1 rounded">AdvancedPageTransition</code> component to wrap
                      any content you want to animate when it appears or disappears. You can specify the transition type,
                      direction, duration, and delay as props.
                    </p>
                    <div className="p-3 bg-gray-50 rounded-md mt-2 overflow-x-auto">
                      <pre className="text-sm text-gray-800">
{`<AdvancedPageTransition 
  type="slide" 
  direction="up" 
  duration={0.5}
>
  <YourComponent />
</AdvancedPageTransition>`}
                      </pre>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Upload Progress</h3>
                    <p className="text-gray-600">
                      Use the <code className="bg-gray-100 p-1 rounded">AnimatedUploadProgress</code> component
                      to display real-time progress for file uploads, processing, and results. The component
                      automatically handles animations based on status changes.
                    </p>
                    <div className="p-3 bg-gray-50 rounded-md mt-2 overflow-x-auto">
                      <pre className="text-sm text-gray-800">
{`<AnimatedUploadProgress
  status="uploading"
  progress={45}
  fileName="document.pdf"
  fileSize="2.3 MB"
  onCancel={() => handleCancel()}
  onRetry={() => handleRetry()}
  onDismiss={() => handleDismiss()}
  autoHide={true}
  hideDelay={3000}
/>`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnimationShowcase;