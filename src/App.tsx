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
const Splash = lazy(() => import("./pages/Splash"));
const Home = lazy(() => import("./pages/Home"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const RideTracking = lazy(() => import("./pages/RideTracking"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DriverPortal = lazy(() => import("./pages/DriverPortal"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Safety = lazy(() => import("./pages/Safety"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DriveWithUs = lazy(() => import("./pages/DriveWithUs"));
const ApplyDriver = lazy(() => import("./pages/ApplyDriver"));
const PWDMode = lazy(() => import("./pages/PWDMode"));

const queryClient = new QueryClient();

// Minimal loading state while a page chunk downloads
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Loading</p>
    </div>
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
