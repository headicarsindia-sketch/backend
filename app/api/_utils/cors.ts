import type { CorsHeaders } from "./headers";

const allowedOrigins = [
  "http://localhost:3000",
  "https://www.iitr.ac.in"
];

export function corsHeaders(origin: string | null): CorsHeaders {
  return {
    "Access-Control-Allow-Origin":
      !origin || allowedOrigins.some(o => origin.startsWith(o))
        ? origin || "*"
        : "",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true"
  };
}