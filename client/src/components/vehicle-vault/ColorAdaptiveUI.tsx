import React, { useEffect } from 'react';

interface ColorAdaptiveUIProps {
  vehicleType: string;
  children: React.ReactNode;
}

/**
 * This component creates a color theme based on the selected vehicle
 * It dynamically injects CSS variables into the document root
 */
const ColorAdaptiveUI: React.FC<ColorAdaptiveUIProps> = ({ vehicleType, children }) => {
  // Define color themes for different vehicle types with a proper type
  interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
  }
  
  const vehicleThemes: Record<string, ThemeColors> = {
    'Tata Nexon EV': {
      primary: '#3B82F6', // Blue
      secondary: '#10B981', // Green for electric vehicles
      accent: '#DBEAFE',
      surface: '#F0F9FF'
    },
    'Honda City': {
      primary: '#6366F1', // Indigo
      secondary: '#F43F5E', // Pink/Red for Honda's branding
      accent: '#E0E7FF',
      surface: '#F5F3FF'
    },
    'TVS iQube': {
      primary: '#10B981', // Green
      secondary: '#3B82F6', // Blue for TVS' electric scooters
      accent: '#D1FAE5',
      surface: '#ECFDF5'
    },
    'Mahindra XUV700': {
      primary: '#7C3AED', // Purple
      secondary: '#F59E0B', // Amber/yellow for Mahindra's branding
      accent: '#EDE9FE',
      surface: '#F5F3FF'
    },
    'Royal Enfield Classic 350': {
      primary: '#B91C1C', // Red
      secondary: '#854D0E', // Dark amber for Royal Enfield's vintage styling
      accent: '#FEE2E2',
      surface: '#FEF2F2'
    }
  };

  // Default theme if vehicle not found
  const defaultTheme: ThemeColors = {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#DBEAFE',
    surface: '#F0F9FF'
  };

  // Get the theme for the current vehicle, or use default
  const theme = vehicleThemes[vehicleType] || defaultTheme;

  useEffect(() => {
    // Apply theme by setting CSS variables
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-secondary', theme.secondary);
    document.documentElement.style.setProperty('--color-accent', theme.accent);
    document.documentElement.style.setProperty('--color-surface', theme.surface);

    // Create a radial gradient with the theme colors for card backgrounds
    document.documentElement.style.setProperty(
      '--color-card-gradient',
      `radial-gradient(circle at top right, ${theme.accent}, ${theme.surface})`
    );

    // Cleanup function to reset variables when unmounting
    return () => {
      document.documentElement.style.removeProperty('--color-primary');
      document.documentElement.style.removeProperty('--color-secondary');
      document.documentElement.style.removeProperty('--color-accent');
      document.documentElement.style.removeProperty('--color-surface');
      document.documentElement.style.removeProperty('--color-card-gradient');
    };
  }, [vehicleType]);

  // Simply render children, the color changes are applied via CSS variables
  return <>{children}</>;
};

export default ColorAdaptiveUI;