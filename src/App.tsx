import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import TransactionDetails from "@/pages/TransactionDetails";
import BlockDetails from "@/pages/BlockDetails";
import AddressDetails from "@/pages/AddressDetails";
import Blocks from "@/pages/Blocks";
import Analytics from "@/pages/Analytics";
import { TotalAddressesChart } from "@/components/charts/TotalAddressessChart";
import { TotalSupplyChart } from "@/components/charts/TotalSupplyChart";
import { MarketCapChart } from "@/components/charts/MarketCapChart";
import { SupplyDistributionChart } from "@/components/charts/SupplyDistributionChart";
import { SupplyGrowthChart } from "@/components/charts/SupplyGrowthChart";

const queryClient = new QueryClient();


const AppContent = () => {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/tx/:txid" element={<TransactionDetails />} />
          <Route path="/block/:height" element={<BlockDetails />} />
          <Route path="/address/:address" element={<AddressDetails />} />
          <Route path="/blocks" element={<Blocks />} />
          <Route path="/analytics" element={<Analytics />}/>
          <Route path="/chart/addresses" element={<TotalAddressesChart onBack={()=> window.history.back()}/>} />
          <Route path="/chart/total-supply" element={<TotalSupplyChart onBack={()=> window.history.back()}/>} /> 
          <Route path="/chart/market-cap" element={<MarketCapChart onBack={()=>window.history.back()} />} />
          <Route path="/chart/supply-distribution" element={<SupplyDistributionChart onBack={()=>window.history.back()} />} />
          <Route path="/chart/supply-growth" element={<SupplyGrowthChart onBack={()=>window.history.back()} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};


const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App
