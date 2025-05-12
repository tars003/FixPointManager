import { useEffect, Suspense, lazy } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";
import { FeedbackProvider } from "@/hooks/use-feedback";
import { NotificationProvider } from "@/components/common/NotificationProvider";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { loadDemoNotifications } from "./utils/demo-notifications";
import Layout from "@/components/layout/layout";
import PageLoader from "@/components/loading/page-loader";
import LazyPage from "@/components/loading/lazy-page";
import { scrollToTop } from "@/utils/scroll-utils";

// Lazy loaded page components with performance optimizations
const Dashboard = lazy(() => import("@/pages/dashboard-enhanced"));
const VehicleVault = lazy(() => import("@/pages/vehicle-vault"));
const Documents = lazy(() => import("@/pages/documents"));
const RtoServices = lazy(() => import("@/pages/rto-services"));
const EnhancedRtoServices = lazy(() => import("@/pages/enhanced-rto-services"));
const TestBeforeBuy = lazy(() => import("@/pages/testbeforebuy"));
const BookService = lazy(() => import("@/pages/book-service"));
const EnhancedServiceBooking = lazy(() => import("@/pages/enhanced-service-booking"));
const MyVehicles = lazy(() => import("@/pages/my-vehicles-updated"));
const AddVehicle = lazy(() => import("@/pages/add-vehicle"));
const Nearby = lazy(() => import("@/pages/nearby-new"));
const LearnDriving = lazy(() => import("@/pages/learn-driving"));
const Inspection = lazy(() => import("@/pages/inspection"));
const TripPlanner = lazy(() => import("@/pages/trip-planner"));
const Calculators = lazy(() => import("@/pages/calculators"));
const NotFound = lazy(() => import("@/pages/not-found"));

// New summary pages with advanced data visualization
const CurrentTrendsPage = lazy(() => import("@/pages/overall-summary-currentTrends"));
const VehicleNetValuePage = lazy(() => import("@/pages/overall-summary-vehicle-net-value"));
const ServiceHealthPage = lazy(() => import("@/pages/overall-summary-servicehealth"));

// Lazy loaded lower-priority components
const ArenaMain = lazy(() => import("@/pages/arena-main"));
const ArenaDashboardEnhanced = lazy(() => import("@/pages/arena-dashboard-enhanced"));
const ArenaDashboard = lazy(() => import("@/pages/arena-dashboard"));
const NewArenaDashboard = lazy(() => import("@/pages/new-arena-dashboard"));
const Energy = lazy(() => import("@/pages/energy"));
const PartsPage = lazy(() => import("@/pages/parts"));
const PartsVerifier = lazy(() => import("@/pages/parts-verifier"));
const InsuranceMarketplace = lazy(() => import("@/pages/insurance-marketplace"));
const MarketplaceEnhanced = lazy(() => import("@/pages/marketplace-enhanced"));
const CommercialFleet = lazy(() => import("@/pages/commercial-fleet"));
const EmergencyServices = lazy(() => import("@/pages/emergency-services"));
const DrivingEducation = lazy(() => import("@/pages/driving-education"));
const FastagEchallan = lazy(() => import("@/pages/fastag-echallan"));
const EducationalPage = lazy(() => import("@/pages/educational"));
const Drishti = lazy(() => import("@/pages/drishti"));
const ArenaVehicleSelection = lazy(() => import("@/pages/arena/vehicle-selection"));
const ArenaCustomize = lazy(() => import("@/pages/arena/customize"));
const ProjectCustomization = lazy(() => import("@/pages/project-customization"));
const EnhancedArenaFeatures = lazy(() => import("@/pages/enhanced-arena-features"));
const PremiumArena = lazy(() => import("@/pages/premium-arena"));
const ArenaPremium = lazy(() => import("@/pages/arena-premium"));
const Arena = lazy(() => import("@/pages/arena"));
const AnimationDemo = lazy(() => import("@/pages/animation-demo"));
const AnimationShowcase = lazy(() => import("@/pages/animation-showcase"));
const ProfilePage = lazy(() => import("@/pages/profile"));
const SettingsPage = lazy(() => import("@/pages/settings"));
const MembershipPage = lazy(() => import("@/pages/membership"));
const OverallSummary = lazy(() => import("@/pages/overall-summary"));

function Router() {
  const [location] = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    scrollToTop();
  }, [location]);

  // Handle route changes efficiently with a single rendering function
  const renderPage = (Component: React.ComponentType<any>, props = {}) => (
    <LazyPage>
      <Component {...props} />
    </LazyPage>
  );
  
  return (
    <Layout>
      <AnimatePresence mode="wait" initial={false}>
        <Switch location={location} key={location}>
          <Route path="/">
            {() => renderPage(Dashboard)}
          </Route>
          
          <Route path="/dashboard">
            {() => renderPage(Dashboard)}
          </Route>
          
          <Route path="/book-service">
            {() => renderPage(BookService)}
          </Route>
          
          <Route path="/book-service/:vehicleId">
            {(params) => renderPage(BookService, params)}
          </Route>
          
          <Route path="/enhanced-service">
            {() => renderPage(EnhancedServiceBooking)}
          </Route>
          
          <Route path="/vehicles">
            {() => <Redirect to="/vehicle-vault" />}
          </Route>
          
          <Route path="/vehicle-vault">
            {() => renderPage(VehicleVault)}
          </Route>
          
          <Route path="/vehicle-vault-community">
            {() => renderPage(VehicleVault)}
          </Route>
          
          <Route path="/nearby">
            {() => renderPage(Nearby)}
          </Route>
          
          <Route path="/learn-driving">
            {() => renderPage(LearnDriving)}
          </Route>
          
          <Route path="/inspection/:id">
            {(params) => renderPage(Inspection, params)}
          </Route>
          
          <Route path="/energy">
            {() => renderPage(Energy)}
          </Route>
          
          <Route path="/parts">
            {() => renderPage(PartsPage)}
          </Route>
          
          <Route path="/marketplace">
            {() => renderPage(MarketplaceEnhanced)}
          </Route>
          
          <Route path="/parts-verifier">
            {() => renderPage(PartsVerifier)}
          </Route>
          
          <Route path="/testbeforebuy">
            {() => renderPage(TestBeforeBuy)}
          </Route>
          
          <Route path="/autovista">
            {() => <Redirect to="/testbeforebuy" />}
          </Route>
          
          <Route path="/commercial-fleet">
            {() => renderPage(CommercialFleet)}
          </Route>
          
          <Route path="/emergency">
            {() => renderPage(EmergencyServices)}
          </Route>
          
          <Route path="/driving-education">
            {() => renderPage(DrivingEducation)}
          </Route>
          
          <Route path="/fastag-echallan">
            {() => renderPage(FastagEchallan)}
          </Route>
          
          <Route path="/educational">
            {() => renderPage(EducationalPage)}
          </Route>
          
          <Route path="/drishti">
            {() => renderPage(Drishti)}
          </Route>
          
          <Route path="/arena-dashboard">
            {() => renderPage(ArenaDashboard)}
          </Route>
          
          <Route path="/new-arena-dashboard">
            {() => renderPage(NewArenaDashboard)}
          </Route>
          
          <Route path="/arena">
            {() => renderPage(ArenaMain)}
          </Route>
          
          <Route path="/arena/vehicle-selection">
            {() => renderPage(ArenaVehicleSelection)}
          </Route>
          
          <Route path="/arena/customize/:id">
            {(params) => renderPage(ArenaCustomize, params)}
          </Route>
          
          <Route path="/arena-enhanced">
            {() => renderPage(ArenaDashboardEnhanced)}
          </Route>
          
          <Route path="/arena-main">
            {() => renderPage(ArenaMain)}
          </Route>
          
          <Route path="/project/:projectId/:studio?">
            {(params) => renderPage(ProjectCustomization, params)}
          </Route>
          
          <Route path="/enhanced-arena-features">
            {() => renderPage(EnhancedArenaFeatures)}
          </Route>
          
          <Route path="/arena-studio">
            {() => renderPage(Arena)}
          </Route>
          
          <Route path="/arena-studio/premium">
            {() => renderPage(PremiumArena)}
          </Route>
          
          <Route path="/arena-studio/premium-advanced">
            {() => renderPage(PremiumArena)}
          </Route>
          
          <Route path="/arena/premium/:id?">
            {(params) => renderPage(ArenaPremium, params)}
          </Route>
          
          <Route path="/animation-demo">
            {() => renderPage(AnimationDemo)}
          </Route>
          
          <Route path="/profile">
            {() => renderPage(ProfilePage)}
          </Route>
          
          <Route path="/settings">
            {() => renderPage(SettingsPage)}
          </Route>
          
          <Route path="/documents">
            {() => renderPage(Documents)}
          </Route>
          
          <Route path="/trip-planner">
            {() => renderPage(TripPlanner)}
          </Route>
          
          <Route path="/calculators">
            {() => renderPage(Calculators)}
          </Route>
          
          <Route path="/rto-services">
            {() => renderPage(RtoServices)}
          </Route>
          
          <Route path="/enhanced-rto-services">
            {() => renderPage(EnhancedRtoServices)}
          </Route>
          
          <Route path="/animation-showcase">
            {() => renderPage(AnimationShowcase)}
          </Route>
          
          <Route path="/membership">
            {() => renderPage(MembershipPage)}
          </Route>
          
          <Route path="/summary">
            {() => renderPage(OverallSummary)}
          </Route>

          <Route path="/overall-summary-currentTrends">
            {() => renderPage(CurrentTrendsPage)}
          </Route>

          <Route path="/overall-summary-vehicle-net-value">
            {() => renderPage(VehicleNetValuePage)}
          </Route>

          <Route path="/overall-summary-servicehealth">
            {() => renderPage(ServiceHealthPage)}
          </Route>
          
          <Route>
            {() => renderPage(NotFound)}
          </Route>
        </Switch>
      </AnimatePresence>
    </Layout>
  );
}

function App() {
  // Initialize demo notifications
  useEffect(() => {
    loadDemoNotifications();
    console.log("Demo notifications loaded");
  }, []);

  return <Router />;
}

export default function AppWithProviders() {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TooltipProvider>
            <FeedbackProvider>
              <NotificationProvider>
                <App />
                <Toaster />
              </NotificationProvider>
            </FeedbackProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}