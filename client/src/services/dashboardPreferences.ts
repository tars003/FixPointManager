import { DashboardModule } from '@/components/dashboard/CustomizeDashboardDialog';

// Local storage key for dashboard preferences
const DASHBOARD_PREFERENCES_KEY = 'fixpoint_dashboard_preferences';

// Default dashboard modules
const DEFAULT_DASHBOARD_MODULES: DashboardModule[] = [
  {
    id: 'membership',
    name: 'FixPoint Membership',
    visible: true,
    position: 0,
    size: 'large',
    type: 'feature',
    section: 'top'
  },
  {
    id: 'overall-summary',
    name: 'Overall Summary',
    visible: true,
    position: 1,
    size: 'medium',
    type: 'chart',
    section: 'top'
  },
  {
    id: 'vehicle-vault',
    name: 'Vehicle Vault',
    visible: true,
    position: 1,
    size: 'medium',
    type: 'feature',
    section: 'main'
  },
  {
    id: 'parts-marketplace',
    name: 'Parts Marketplace',
    visible: true,
    position: 2,
    size: 'medium',
    type: 'feature',
    section: 'main'
  },
  {
    id: 'drishti-intelligence',
    name: 'Drishti Intelligence',
    visible: true,
    position: 3,
    size: 'medium',
    type: 'feature',
    section: 'main'
  },
  {
    id: 'arena-studio',
    name: 'Arena Studio',
    visible: true,
    position: 4,
    size: 'medium',
    type: 'feature',
    section: 'main'
  },
  {
    id: 'service-tracker',
    name: 'Service Health Tracker',
    visible: true,
    position: 5,
    size: 'medium',
    type: 'chart',
    section: 'top'
  },
  {
    id: 'current-trends',
    name: 'Current Trends',
    visible: true,
    position: 6,
    size: 'medium',
    type: 'chart',
    section: 'top'
  },
  {
    id: 'vehicle-net-value',
    name: 'Vehicle Net Value',
    visible: true,
    position: 7,
    size: 'medium',
    type: 'chart',
    section: 'top'
  },
  {
    id: 'nearby-services',
    name: 'Nearby Services',
    visible: true,
    position: 8,
    size: 'medium',
    type: 'tool',
    section: 'bottom'
  },
  {
    id: 'documents',
    name: 'Documents',
    visible: true,
    position: 9,
    size: 'medium',
    type: 'tool',
    section: 'bottom'
  },
  {
    id: 'emergency',
    name: 'Emergency Services',
    visible: true,
    position: 10,
    size: 'medium',
    type: 'tool',
    section: 'bottom'
  },
  {
    id: 'calculator',
    name: 'Vehicle Calculator',
    visible: true,
    position: 11,
    size: 'medium',
    type: 'tool',
    section: 'bottom'
  }
];

// Get dashboard modules from local storage or use defaults
export const getDashboardModules = (): DashboardModule[] => {
  try {
    const storedPreferences = localStorage.getItem(DASHBOARD_PREFERENCES_KEY);
    if (storedPreferences) {
      return JSON.parse(storedPreferences);
    }
  } catch (error) {
    console.error('Error retrieving dashboard preferences:', error);
  }
  
  return DEFAULT_DASHBOARD_MODULES;
};

// Save dashboard modules to local storage
export const saveDashboardModules = (modules: DashboardModule[]): void => {
  try {
    localStorage.setItem(DASHBOARD_PREFERENCES_KEY, JSON.stringify(modules));
  } catch (error) {
    console.error('Error saving dashboard preferences:', error);
  }
};

// Get visible modules by section
export const getVisibleModulesBySection = (section: 'top' | 'main' | 'bottom'): DashboardModule[] => {
  const allModules = getDashboardModules();
  return allModules
    .filter(module => module.visible && module.section === section)
    .sort((a, b) => a.position - b.position);
};

// Reset dashboard modules to defaults
export const resetDashboardModules = (): void => {
  try {
    localStorage.setItem(DASHBOARD_PREFERENCES_KEY, JSON.stringify(DEFAULT_DASHBOARD_MODULES));
  } catch (error) {
    console.error('Error resetting dashboard preferences:', error);
  }
};