import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface LoadingSkeletonProps {
  type: 'project' | 'gallery' | 'vehicle' | 'customization' | 'full-page';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type, count = 1 }) => {
  // Project skeleton
  const ProjectSkeleton = () => (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-1" />
      </CardHeader>
      <CardContent className="pt-0">
        <Skeleton className="h-[180px] w-full rounded-md mb-3" />
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
  
  // Gallery item skeleton
  const GallerySkeleton = () => (
    <Card className="overflow-hidden">
      <Skeleton className="h-[220px] w-full" />
      <CardContent className="p-3">
        <Skeleton className="h-5 w-4/5 mb-2" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/3" />
          <div className="flex space-x-1">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  // Vehicle skeleton
  const VehicleSkeleton = () => (
    <Card className="overflow-hidden">
      <Skeleton className="h-[160px] w-full" />
      <CardContent className="p-3">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  );
  
  // Customization skeleton
  const CustomizationSkeleton = () => (
    <div className="space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-7 w-1/3" />
        <div className="flex space-x-2">
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-[200px] w-full rounded-md" />
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-16 w-full rounded-md" />
        <Skeleton className="h-16 w-full rounded-md" />
        <Skeleton className="h-16 w-full rounded-md" />
      </div>
      <div className="flex justify-between items-center mt-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-9 w-1/4 rounded-md" />
      </div>
    </div>
  );
  
  // Full page skeleton
  const FullPageSkeleton = () => (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="border-b pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32 mt-1" />
            </div>
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Skeleton className="h-20 w-full rounded-md" />
            <Skeleton className="h-20 w-full rounded-md" />
            <Skeleton className="h-20 w-full rounded-md" />
            <Skeleton className="h-20 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-7 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-9 w-full rounded-md mt-3" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-2/5" />
                  <Skeleton className="h-4 w-1/5" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-[1px] w-full my-2" />
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-5 w-1/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
  
  // The shimmer effect that moves across the skeletons
  const ShimmerEffect = () => (
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]
      bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  );
  
  // Generate multiple skeletons
  const generateSkeletons = (SkeletonComponent: React.FC, count: number) => {
    return Array(count)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="relative overflow-hidden">
          <SkeletonComponent />
          <ShimmerEffect />
        </div>
      ));
  };
  
  // Rotating loading spinner for transition states
  const SpinnerOverlay = () => (
    <div className="flex items-center justify-center absolute inset-0 bg-background/80 backdrop-blur-sm z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center p-6 rounded-lg"
      >
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="mt-3 text-sm text-muted-foreground">Loading...</p>
      </motion.div>
    </div>
  );
  
  // Return different skeleton based on type
  switch (type) {
    case 'project':
      return <>{generateSkeletons(ProjectSkeleton, count)}</>;
    case 'gallery':
      return <>{generateSkeletons(GallerySkeleton, count)}</>;
    case 'vehicle':
      return <>{generateSkeletons(VehicleSkeleton, count)}</>;
    case 'customization':
      return <>{generateSkeletons(CustomizationSkeleton, count)}</>;
    case 'full-page':
      return <SpinnerOverlay />;
    default:
      return <>{generateSkeletons(ProjectSkeleton, count)}</>;
  }
};

export default LoadingSkeleton;