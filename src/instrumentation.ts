/**
 * Next.js runs `register()` once when the server boots, before any request is
 * served. Validating the environment here means a misconfigured deployment
 * fails immediately with a clear message, instead of returning broken pages or
 * falling back to insecure defaults under load.
 */
export async function register() {
  // Guard on the runtime: instrumentation also loads in the edge runtime, where
  // server-only env vars are not available.
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const { validateEnv } = await import("@/lib/env");
  validateEnv();
}
