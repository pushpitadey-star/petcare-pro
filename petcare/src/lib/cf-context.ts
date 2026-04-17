// src/lib/cf-context.ts
// Purpose: Cloudflare context helper for Next.js API routes.
//   Uses dynamic require() to safely access @cloudflare/next-on-pages
//   without crashing webpack or local dev environments.

import type { D1Database } from "@cloudflare/workers-types";

export interface CloudflareEnv {
  DB: D1Database;
  AI?: any;
  [key: string]: any;
}

/**
 * Get Cloudflare environment from the request context
 */
export function getCloudflareContext(): { env: CloudflareEnv } | null {
  try {
    // On Cloudflare edge, try to get the request context
    if (
      typeof process !== "undefined" &&
      (process as any).env?.NEXT_RUNTIME === "edge"
    ) {
      // We try a more robust way to get context without crashing webpack
      // Many versions of next-on-pages use globalThis for context
      const g = globalThis as any;
      if (g.__NEXT_ON_PAGES__?.context) {
        return g.__NEXT_ON_PAGES__.context;
      }

      // Try dynamic require with a catch-all for the path error
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mod = require("@cloudflare/next-on-pages");
        const getRequestContext = mod?.getRequestContext;
        if (getRequestContext) return getRequestContext();
      } catch (e) {
        // Fallback to internal global naming if require fails
      }
    }
    
    // Fallback for local development or when context helper fails
    // Pass EVERYTHING from process.env to ensure new variables aren't missed
    const env = (typeof process !== "undefined" ? process.env : {}) as any;
    if (Object.keys(env).length > 0) {
      return { env };
    }
    
    return null;
  } catch (e) {
    return null;
  }
}

/**
 * Get D1 database - throws if not available
 */
export function getD1Database(): D1Database {
  const ctx = getCloudflareContext();
  if (!ctx?.env?.DB) {
    throw new Error("D1 Database not available");
  }
  return ctx.env.DB;
}

/**
 * Get AI binding
 */
export function getAI(): any | null {
  const ctx = getCloudflareContext();
  return ctx?.env?.AI || null;
}