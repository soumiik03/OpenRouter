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
          {/* Public Landing & Marketing */}
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/Landing" element={<Landing />} />

          {/* Authentication */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Authenticated Dashboard Pages (with fallback aliases) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashbaord" element={<Dashboard />} />
          <Route path="/Credits" element={<Credits />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/ApiKeys" element={<ApiKeys />} />
          <Route path="/apikeys" element={<ApiKeys />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
