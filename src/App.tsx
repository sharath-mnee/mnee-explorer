import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import TransactionDetails from "./pages/TransactionDetails";

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
