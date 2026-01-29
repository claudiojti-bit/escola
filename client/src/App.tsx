import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import MathPage from "@/pages/MathPage";
import PreLiteracyPage from "@/pages/PreLiteracyPage";
import PortuguesePage from "@/pages/PortuguesePage";
import GeographyPage from "@/pages/GeographyPage";
import HistoryPage from "@/pages/HistoryPage";
import StatsPage from "@/pages/StatsPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/math" component={MathPage} />
      <Route path="/preLiteracy" component={PreLiteracyPage} />
      <Route path="/portuguese" component={PortuguesePage} />
      <Route path="/geography" component={GeographyPage} />
      <Route path="/history" component={HistoryPage} />
      <Route path="/stats" component={StatsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
