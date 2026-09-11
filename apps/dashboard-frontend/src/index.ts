import { serve } from "bun";
import index from "./index.html";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
const PORT = Number(process.env.PORT) || 5173;

const server = serve({
  port: PORT,
  routes: {
    // Reverse proxy /api/* to the Express backend on port 3000
    "/api/*": async (req) => {
      const url = new URL(req.url);
      // Strip leading /api prefix: e.g. /api/auth/signin -> /auth/signin
      const backendPath = url.pathname.replace(/^\/api/, "");
      const targetUrl = `${BACKEND_URL}${backendPath}${url.search}`;

      try {
        const headers = new Headers(req.headers);
        headers.set("host", new URL(BACKEND_URL).host);

        const isBodyAllowed = !["GET", "HEAD"].includes(req.method);
        const body = isBodyAllowed ? await req.arrayBuffer() : undefined;

        const backendResponse = await fetch(targetUrl, {
          method: req.method,
          headers,
          body,
          redirect: "manual",
        });

        // Forward backend response including Set-Cookie headers
        return new Response(backendResponse.body, {
          status: backendResponse.status,
          statusText: backendResponse.statusText,
          headers: backendResponse.headers,
        });
      } catch (error) {
        return new Response(
          JSON.stringify({
            message: "Primary backend is currently unavailable at " + BACKEND_URL,
            error: error instanceof Error ? error.message : "Unknown error",
          }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    },

    // Serve index.html for all unmatched client-side routes
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,
    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 OpenRouter Frontend running at http://localhost:${server.port}`);
