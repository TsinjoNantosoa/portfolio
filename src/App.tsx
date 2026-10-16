import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "./components/UI/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PortfolioAssistantLauncher from "./components/assistant/PortfolioAssistantLauncher";
import { I18nProvider } from "./i18n/I18nProvider";
import { ThemeProvider } from "./theme/ThemeProvider";

const Index = lazy(() => import("./pages/Index"));
const CaseStudyPage = lazy(() => import("./pages/CaseStudyPage"));
const LabPage = lazy(() => import("./pages/LabPage"));
const PlaygroundPage = lazy(() => import("./pages/PlaygroundPage"));
const OperationsPage = lazy(() => import("./pages/OperationsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] text-[var(--text-muted)]">
    <span className="font-mono text-xs uppercase tracking-[0.14em]">Loading…</span>
  </div>
);

const App = () => {
  return (
    <ThemeProvider>
      <I18nProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/lab" element={<LabPage />} />
                <Route path="/lab/playground" element={<PlaygroundPage />} />
                <Route path="/lab/operations" element={<OperationsPage />} />
                <Route path="/work/:slug" element={<CaseStudyPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <PortfolioAssistantLauncher />
          </BrowserRouter>
        </TooltipProvider>
      </I18nProvider>
    </ThemeProvider>
  );
};

export default App;
