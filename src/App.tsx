import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { VoiceAssistantProvider } from "./contexts/VoiceAssistantContext";
import { FloatingAssistant } from "./components/FloatingAssistant";
import { ThemeProvider } from "./components/ThemeProvider";

// Lazy-loaded pages — each page only downloads when navigated to
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import BookingPage from "./pages/BookingPage";
import Safety from "./pages/Safety";

// High-latency or heavy administrative pages remain lazy-loaded
const RideTracking = lazy(() => import("./pages/RideTracking"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DriverPortal = lazy(() => import("./pages/DriverPortal"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DriveWithUs = lazy(() => import("./pages/DriveWithUs"));
const ApplyDriver = lazy(() => import("./pages/ApplyDriver"));
const PWDMode = lazy(() => import("./pages/PWDMode"));

const queryClient = new QueryClient();

/**
 * Premium Page Loader
 * A subtle, high-fidelity loading state for secondary pages.
 */
const PageLoader = () => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm animate-in fade-in duration-500">
    <div className="relative h-16 w-16">
      <div className="absolute inset-0 rounded-full border-4 border-primary/10" />
      <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
      </div>
    </div>
    <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 animate-pulse">Syncing Matrix</p>
  </div>
);

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="safego-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" expand={true} richColors closeButton />
        <BrowserRouter>
          <VoiceAssistantProvider>
            <FloatingAssistant />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Splash />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/signup" element={<AuthPage />} />
                <Route path="/book/:mode" element={<BookingPage />} />
                <Route path="/ride/tracking" element={<RideTracking />} />
                <Route path="/safety" element={<Safety />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/driver" element={<DriverPortal />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/drive-with-us" element={<DriveWithUs />} />
                <Route path="/apply-driver" element={<ApplyDriver />} />
                <Route path="/pwd-mode" element={<PWDMode />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </VoiceAssistantProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
