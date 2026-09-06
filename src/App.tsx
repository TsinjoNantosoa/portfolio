import { Toaster as Sonner } from "./components/UI/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CaseStudyPage from "./pages/CaseStudyPage";

const App = () => {
  return (
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/work/:slug" element={<CaseStudyPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
