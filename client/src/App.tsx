import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "@/components/ui/sidebar";
import MobileHeader from "@/components/ui/mobile-header";
import MobileNav from "@/components/ui/mobile-nav";
import NotFound from "@/pages/not-found";
import { PageTransition } from "@/components/ui/animated-components";

// Pages
import MyVehicles from "@/pages/my-vehicles";
import BookService from "@/pages/book-service";
import Nearby from "@/pages/nearby";
import Explore from "@/pages/explore";
import LearnDriving from "@/pages/learn-driving";
import Dashboard from "@/pages/dashboard";
import Inspection from "@/pages/inspection";
import Energy from "@/pages/energy";

function Router() {
  const [location] = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen">
      <MobileHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto pb-16 lg:pb-6">
          <AnimatePresence mode="wait">
            <Switch location={location} key={location}>
              <Route path="/">
                {() => (
                  <PageTransition>
                    <MyVehicles />
                  </PageTransition>
                )}
              </Route>
              <Route path="/vehicles">
                {() => (
                  <PageTransition>
                    <MyVehicles />
                  </PageTransition>
                )}
              </Route>
              <Route path="/book-service">
                {() => (
                  <PageTransition>
                    <BookService />
                  </PageTransition>
                )}
              </Route>
              <Route path="/book-service/:vehicleId">
                {(params) => (
                  <PageTransition>
                    <BookService />
                  </PageTransition>
                )}
              </Route>
              <Route path="/nearby">
                {() => (
                  <PageTransition>
                    <Nearby />
                  </PageTransition>
                )}
              </Route>
              <Route path="/explore">
                {() => (
                  <PageTransition>
                    <Explore />
                  </PageTransition>
                )}
              </Route>
              <Route path="/learn-driving">
                {() => (
                  <PageTransition>
                    <LearnDriving />
                  </PageTransition>
                )}
              </Route>
              <Route path="/dashboard">
                {() => (
                  <PageTransition>
                    <Dashboard />
                  </PageTransition>
                )}
              </Route>
              <Route path="/inspection/:id">
                {(params) => (
                  <PageTransition>
                    <Inspection />
                  </PageTransition>
                )}
              </Route>
              <Route path="/energy">
                {() => (
                  <PageTransition>
                    <Energy />
                  </PageTransition>
                )}
              </Route>
              <Route>
                {() => (
                  <PageTransition>
                    <NotFound />
                  </PageTransition>
                )}
              </Route>
            </Switch>
          </AnimatePresence>
        </main>
      </div>
      <MobileNav />
      
      {/* Floating action button for quick actions */}
      <motion.div 
        className="fixed bottom-20 right-6 lg:bottom-6 z-40"
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
    </div>
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
