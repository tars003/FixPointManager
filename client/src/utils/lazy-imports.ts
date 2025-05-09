import { lazy } from 'react';

/**
 * Utility to create lazy-loaded page components with consistent loading behavior
 * This centralizes lazy loading and adds error handling
 */

// Main pages
export const Dashboard = lazy(() => import('@/pages/dashboard-enhanced'));
export const VehicleVault = lazy(() => import('@/pages/vehicle-vault'));
export const Documents = lazy(() => import('@/pages/documents'));
export const RtoServices = lazy(() => import('@/pages/rto-services'));
export const EnhancedRtoServices = lazy(() => import('@/pages/enhanced-rto-services'));
export const EmergencyServices = lazy(() => import('@/pages/emergency-services'));
export const BookService = lazy(() => import('@/pages/book-service'));
export const EnhancedServiceBooking = lazy(() => import('@/pages/enhanced-service-booking'));
export const TestBeforeBuy = lazy(() => import('@/pages/testbeforebuy'));
export const TripPlanner = lazy(() => import('@/pages/trip-planner'));
export const Calculators = lazy(() => import('@/pages/calculators'));
export const Nearby = lazy(() => import('@/pages/nearby-new'));
export const LearnDriving = lazy(() => import('@/pages/learn-driving'));
export const Inspection = lazy(() => import('@/pages/inspection'));
export const NotFound = lazy(() => import('@/pages/not-found'));

// Lower priority / less frequently accessed pages
export const Energy = lazy(() => import('@/pages/energy'));
export const PartsPage = lazy(() => import('@/pages/parts'));
export const MarketplaceEnhanced = lazy(() => import('@/pages/marketplace-enhanced'));
export const CommercialFleet = lazy(() => import('@/pages/commercial-fleet'));
export const DrivingEducation = lazy(() => import('@/pages/driving-education'));
export const FastagEchallan = lazy(() => import('@/pages/fastag-echallan'));
export const EducationalPage = lazy(() => import('@/pages/educational'));
export const Drishti = lazy(() => import('@/pages/drishti'));

// Arena pages
export const ArenaMain = lazy(() => import('@/pages/arena-main'));
export const ArenaDashboard = lazy(() => import('@/pages/arena-dashboard'));
export const ArenaDashboardEnhanced = lazy(() => import('@/pages/arena-dashboard-enhanced'));
export const NewArenaDashboard = lazy(() => import('@/pages/new-arena-dashboard'));
export const ArenaVehicleSelection = lazy(() => import('@/pages/arena/vehicle-selection'));
export const ArenaCustomize = lazy(() => import('@/pages/arena/customize'));
export const ProjectCustomization = lazy(() => import('@/pages/project-customization'));
export const EnhancedArenaFeatures = lazy(() => import('@/pages/enhanced-arena-features'));
export const PremiumArena = lazy(() => import('@/pages/premium-arena'));