import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/index";
import { useToast } from "@/hooks/use-toast";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Interview from "@/pages/Interview";
import ReportPage from "@/pages/Report";
import { Record, About, Contact, Login, NotFound } from "@/pages/other-pages";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

// Toast context wrapper
function ToastWrapper({ children }) {
  const { toasts, dismiss } = useToast();
  return (
    <>
      {children}
      <Toaster toasts={toasts} dismiss={dismiss} />
    </>
  );
}

function Routes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/interview/:id" component={Interview} />
      <Route path="/record" component={Record} />
      <Route path="/report/:id" component={ReportPage} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastWrapper>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes />
          </main>
        </div>
      </ToastWrapper>
    </QueryClientProvider>
  );
}
