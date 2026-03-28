
import { Toaster } from "./components/UI/toaster"; 
import { Toaster as Sonner } from "./components/UI/toaster";
import { TooltipProvider } from "@radix-ui/react-tooltip"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ServicesPage from "./pages/ServicesPage";
import ResumePage from "./pages/ResumePage";
import WorkPage from "./pages/WorkPage";
import ContactPage from "./pages/ContactPage";

const queryClient = new QueryClient();

const App = () => {
  // Loader state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-darkbg">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-20 w-20">
            <svg className="absolute inset-0 animate-spin-slow" viewBox="0 0 100 100">
              <circle
                className="animate-draw-circle"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#0DFFA3"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-neon">TS</span>
            </div>
          </div>
          <p className="text-neon animate-pulse-slow">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
