import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export interface AnimatedUploadProgressProps {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  progress?: number;
  fileName?: string;
  fileSize?: string;
  errorMessage?: string;
  onCancel?: () => void;
  onRetry?: () => void;
  onDismiss?: () => void;
  autoHide?: boolean;
  hideDelay?: number;
}

const AnimatedUploadProgress: React.FC<AnimatedUploadProgressProps> = ({
  status = 'idle',
  progress = 0,
  fileName = 'document.pdf',
  fileSize = '1.2 MB',
  errorMessage = 'Upload failed. Please try again.',
  onCancel,
  onRetry,
  onDismiss,
  autoHide = true,
  hideDelay = 3000,
}) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    // Reset visibility when status changes
    setVisible(true);
    
    // Auto-hide component after success
    let timer: NodeJS.Timeout;
    if (status === 'success' && autoHide) {
      timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, hideDelay);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [status, autoHide, hideDelay, onDismiss]);
  
  const statusColors = {
    idle: 'bg-gray-100',
    uploading: 'bg-blue-50 border-blue-200',
    processing: 'bg-indigo-50 border-indigo-200',
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
  };
  
  const progressColors = {
    uploading: 'bg-blue-500',
    processing: 'bg-indigo-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
    idle: 'bg-gray-300',
  };

  const formatProgress = (progress: number) => {
    return Math.min(100, Math.max(0, Math.round(progress)));
  };
  
  const progressPercent = formatProgress(progress);
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`w-full max-w-md mx-auto rounded-lg border p-4 shadow-sm ${statusColors[status]}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-2">
                {status === 'uploading' && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="h-5 w-5 text-blue-500" />
                  </motion.div>
                )}
                {status === 'processing' && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="h-5 w-5 text-indigo-500" />
                  </motion.div>
                )}
                {status === 'success' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </motion.div>
                )}
                
                <span className="font-medium">
                  {status === 'uploading' && 'Uploading document...'}
                  {status === 'processing' && 'Processing document...'}
                  {status === 'success' && 'Upload complete!'}
                  {status === 'error' && 'Upload failed'}
                </span>
              </div>
              
              <div className="text-sm text-gray-500 truncate mb-2">
                {fileName} {fileSize && `(${fileSize})`}
              </div>
              
              {(status === 'uploading' || status === 'processing') && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{progressPercent}% {status === 'uploading' ? 'uploaded' : 'processed'}</span>
                    <span>{progressPercent < 100 ? formatProgress(100 - progressPercent) + '% remaining' : 'completing...'}</span>
                  </div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                      <motion.div
                        className={`flex flex-col justify-center text-center text-white text-xs ${progressColors[status]}`}
                        style={{ width: `${progressPercent}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ 
                          duration: 0.5,
                          ease: "easeOut"
                        }}
                      ></motion.div>
                    </div>
                  </div>
                </div>
              )}
              
              {status === 'error' && (
                <div className="text-sm text-red-500 mt-1">
                  {errorMessage}
                </div>
              )}
              
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-green-600 mt-1"
                >
                  Document successfully uploaded and processed
                </motion.div>
              )}
            </div>
            
            <div>
              {(status === 'uploading' || status === 'processing') && onCancel && (
                <button 
                  onClick={onCancel}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label="Cancel upload"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              )}
              
              {status === 'error' && onRetry && (
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={onRetry}
                    className="px-3 py-1 bg-white hover:bg-gray-50 text-sm font-medium rounded border border-gray-300 text-gray-700"
                  >
                    Retry
                  </button>
                  {onDismiss && (
                    <button 
                      onClick={() => {
                        setVisible(false);
                        if (onDismiss) onDismiss();
                      }}
                      className="px-3 py-1 bg-white hover:bg-gray-50 text-sm font-medium rounded border border-gray-300 text-gray-700"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              )}
              
              {status === 'success' && onDismiss && (
                <button 
                  onClick={() => {
                    setVisible(false);
                    if (onDismiss) onDismiss();
                  }}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label="Dismiss notification"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedUploadProgress;