import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import NotFound from "@/pages/not-found";

// Pages
import MyVehicles from "@/pages/my-vehicles-updated";
import AddVehicle from "@/pages/add-vehicle";
import BookService from "@/pages/book-service";
import Nearby from "@/pages/nearby";
import Explore from "@/pages/explore";
import LearnDriving from "@/pages/learn-driving";
import Dashboard from "@/pages/dashboard";
import Inspection from "@/pages/inspection";
import Energy from "@/pages/energy";
import PartsPage from "@/pages/parts";
import VehicleDetail from "@/pages/vehicle-detail";
import CommercialFleet from "@/pages/commercial-fleet";
import EmergencyServices from "@/pages/emergency-services";
import DrivingEducation from "@/pages/driving-education";
import FastagEchallan from "@/pages/fastag-echallan";
import EducationalPage from "@/pages/educational";
import ArenaPage from "@/pages/arena";
import ArenaDashboard from "@/pages/arena-dashboard";
import NewArenaDashboard from "@/pages/new-arena-dashboard";
import ArenaDashboardNew from "@/pages/arena-dashboard-new";

function Router() {
  const [location] = useLocation();
  
  // Page transition animation
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };
  
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Switch location={location} key={location}>
          <Route path="/">
            {() => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <Dashboard />
              </motion.div>
            )}
          </Route>
          <Route path="/vehicles">
            {() => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <MyVehicles />
              </motion.div>
            )}
          </Route>
          <Route path="/vehicles/add">
            {() => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <AddVehicle />
              </motion.div>
            )}
          </Route>
          <Route path="/vehicles/:id">
            {(params) => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <VehicleDetail />
              </motion.div>
            )}
          </Route>
          <Route path="/book-service">
            {() => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <BookService />
              </motion.div>
            )}
          </Route>
          <Route path="/book-service/:vehicleId">
            {(params) => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <BookService />
              </motion.div>
            )}
          </Route>
          <Route path="/nearby">
            {() => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <Nearby />
              </motion.div>
            )}
          </Route>
          <Route path="/explore">
            {() => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <Explore />
              </motion.div>
            )}
          </Route>
          <Route path="/learn-driving">
            {() => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <LearnDriving />
              </motion.div>
            )}
          </Route>
          <Route path="/dashboard">
            {() => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <Dashboard />
              </motion.div>
            )}
          </Route>
          <Route path="/inspection/:id">
            {(params) => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <Inspection />
              </motion.div>
            )}
          </Route>
          <Route path="/energy">
            {() => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <Energy />
              </motion.div>
            )}
          </Route>
          <Route path="/parts">
            {() => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <PartsPage />
              </motion.div>
            )}
          </Route>
          <Route path="/commercial-fleet">
            {() => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <CommercialFleet />
              </motion.div>
            )}
          </Route>
          <Route path="/emergency">
            {() => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <EmergencyServices />
              </motion.div>
            )}
          </Route>
          <Route path="/driving-education">
            {() => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <DrivingEducation />
              </motion.div>
            )}
          </Route>
          <Route path="/fastag-echallan">
            {() => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <FastagEchallan />
              </motion.div>
            )}
          </Route>
          <Route path="/educational">
            {() => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <EducationalPage />
              </motion.div>
            )}
          </Route>
          <Route path="/arena-dashboard">
            {() => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <ArenaDashboard />
              </motion.div>
            )}
          </Route>
          <Route path="/new-arena-dashboard">
            {() => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <NewArenaDashboard />
              </motion.div>
            )}
          </Route>
          <Route path="/arena">
            {() => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <ArenaDashboardNew />
              </motion.div>
            )}
          </Route>
          <Route>
            {() => (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
              >
                <NotFound />
              </motion.div>
            )}
          </Route>
        </Switch>
      </AnimatePresence>
      
      {/* Floating action button for quick actions */}
      <motion.div 
        className="fixed bottom-24 right-6 lg:bottom-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.5 
        }}
      >
        <button
          className="bg-primary text-white h-14 w-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          aria-label="Quick Actions"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </motion.div>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
