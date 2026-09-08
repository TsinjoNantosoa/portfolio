import { Toaster as Sonner } from "./components/UI/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CaseStudyPage from "./pages/CaseStudyPage";
import PortfolioAssistantLauncher from "./components/assistant/PortfolioAssistantLauncher";
import { I18nProvider } from "./i18n/I18nProvider";
import { ThemeProvider } from "./theme/ThemeProvider";

const App = () => {
  return (
    <ThemeProvider>
      <I18nProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/work/:slug" element={<CaseStudyPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <PortfolioAssistantLauncher />
          </BrowserRouter>
        </TooltipProvider>
      </I18nProvider>
    </ThemeProvider>
  );
};

export default App;
