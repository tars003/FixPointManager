import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import Sidebar from "@/components/ui/sidebar";
import MobileHeader from "@/components/ui/mobile-header";
import MobileNav from "@/components/ui/mobile-nav";
import NotFound from "@/pages/not-found";

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
  return (
    <div className="flex flex-col min-h-screen">
      <MobileHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto pb-16 lg:pb-6">
          <Switch>
            <Route path="/" component={MyVehicles} />
            <Route path="/vehicles" component={MyVehicles} />
            <Route path="/book-service" component={BookService} />
            <Route path="/book-service/:vehicleId" component={BookService} />
            <Route path="/nearby" component={Nearby} />
            <Route path="/explore" component={Explore} />
            <Route path="/learn-driving" component={LearnDriving} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/inspection/:id" component={Inspection} />
            <Route path="/energy" component={Energy} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      <MobileNav />
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
