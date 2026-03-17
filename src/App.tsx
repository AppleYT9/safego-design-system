import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import BookingPage from "./pages/BookingPage";
import RideTracking from "./pages/RideTracking";
import Dashboard from "./pages/Dashboard";
import DriverPortal from "./pages/DriverPortal";
import AdminDashboard from "./pages/AdminDashboard";
import Safety from "./pages/Safety";
import NotFound from "./pages/NotFound";
import DriveWithUs from "./pages/DriveWithUs";
import ApplyDriver from "./pages/ApplyDriver";
import PWDMode from "./pages/PWDMode";
import { VoiceAssistantProvider } from "./contexts/VoiceAssistantContext";
import { FloatingAssistant } from "./components/FloatingAssistant";

import { ThemeProvider } from "./components/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="safego-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <VoiceAssistantProvider>
            <FloatingAssistant />
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
          </VoiceAssistantProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
