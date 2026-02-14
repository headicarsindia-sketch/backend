import type { CorsHeaders } from "./headers";

const allowedOrigins = new Set([
  "http://localhost:5173",
  "https://www.iitr.ac.in",
  "https://www.iitr.ac.in/capacity-publicpolicy2026/",
  "https://backend-git-main-icars-projects-11a778f7.vercel.app"
]);

export function corsHeaders(origin: string | null): CorsHeaders {
  const allowedOrigin =
    origin && allowedOrigins.has(origin)
      ? origin
      : "https://www.iitr.ac.in";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    "Vary": "Origin"
  };
}