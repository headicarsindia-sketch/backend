import type { CorsHeaders } from "./headers";

const allowedOrigins = [
  "http://localhost:5173", // your frontend dev port
  "https://backend-git-main-icars-projects-11a778f7.vercel.app", // production frontend
  "https://www.iitr.ac.in" // any other allowed origin
];

export function corsHeaders(origin: string | null): CorsHeaders {
  let allowedOrigin = "*";

  if (origin && allowedOrigins.some(o => origin.startsWith(o))) {
    allowedOrigin = origin;
  }

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true"
  };
}