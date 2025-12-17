import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SuiProvider } from "./providers/SuiProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ConnectWallet } from './web3/wallet'

const App = () => (
  <SuiProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      {/* 🔹 WALLET BAR */}
      <div className="fixed top-4 right-4 z-50">
        <ConnectWallet />
      </div>

      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Index />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </SuiProvider>
)

export default App

