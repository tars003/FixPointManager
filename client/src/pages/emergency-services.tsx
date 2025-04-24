import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import EmergencyDashboard from '@/components/emergency/EmergencyDashboard';

export default function EmergencyServices() {
  const { resolvedTheme } = useTheme();
  
  // Set emergency appearance - special styling for emergency page
  useEffect(() => {
    // Add special emergency class to body
    document.body.classList.add('emergency-mode');
    
    // Remove when component unmounts
    return () => {
      document.body.classList.remove('emergency-mode');
    };
  }, []);
  
  return (
    <EmergencyDashboard theme={resolvedTheme as 'light' | 'dark'} />
  );
}