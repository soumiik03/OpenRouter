import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

import { Landing } from "./pages/Landing";
import { SignIn } from "./pages/signin";
import { SignUp } from "./pages/signup";
import { Dashboard } from "./pages/dashboard";
import { Credits } from "./pages/Credits";
import { ApiKeys } from "./pages/ApiKeys";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 30, // 30 seconds
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Landing */}
          <Route path="/" element={<Landing />} />

          {/* Authentication */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Authenticated Dashboard Pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/apikeys" element={<ApiKeys />} />
          <Route path="/credits" element={<Credits />} />

          {/* Canonical redirects for legacy or alternate casing */}
          <Route path="/landing" element={<Navigate to="/" replace />} />
          <Route path="/Landing" element={<Navigate to="/" replace />} />
          <Route path="/ApiKeys" element={<Navigate to="/apikeys" replace />} />
          <Route path="/Credits" element={<Navigate to="/credits" replace />} />
          <Route path="/dashbaord" element={<Navigate to="/dashboard" replace />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
