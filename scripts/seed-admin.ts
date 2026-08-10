/**
 * Creates the initial super-admin by calling POST /api/auth/seed.
 *
 *   npm run seed:admin            # targets the dev env files (.env.local)
 *   npm run seed:admin:prod       # targets .env.production
 *   npm run seed:admin -- https://other-domain.com   # explicit override
 *
 * The target domain and the seed secret both come from the env files, so there
 * is nothing to hardcode and nothing secret in this file — important, since
 * this script ships to every deployment of the app.
 *
 * The endpoint is CREATE-ONLY: if an admin already exists it is a no-op and the
 * existing password is never modified. Re-running is therefore always safe.
 */
import { loadEnvConfig } from "@next/env";
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const wantsProd =
  args.includes("--prod") || process.env.NODE_ENV === "production";
const urlArg = args.find(
  (a) => a.startsWith("http://") || a.startsWith("https://"),
);

const projectDir = path.resolve(__dirname, "..");

/**
 * Minimal KEY=VALUE parser for reading one specific env file.
 *
 * @next/env is not used for --prod on purpose. Its (correct) precedence puts
 * .env.local ABOVE .env.production, so on a developer machine that has both,
 * loading "production" would silently return local values — the wrong domain,
 * the wrong secret, the wrong admin address. When the operator asks for
 * production, read production and nothing else.
 */
const parseEnvFile = (file: string): Record<string, string> => {
  const out: Record<string, string> = {};

  for (const rawLine of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const eq = line.indexOf("=");
    if (eq === -1) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();

    // Strip a single layer of matching quotes.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    out[key] = value;
  }

  return out;
};

/** Values used for this run, and the file they came from. */
let envSource: string;
let env: Record<string, string | undefined>;

if (wantsProd) {
  const prodFile = path.join(projectDir, ".env.production");

  if (!fs.existsSync(prodFile)) {
    // On a real server the values usually come from the host's environment
    // rather than a file, so fall back to process.env instead of failing.
    console.warn(
      "\n  ⚠ .env.production not found — using the process environment instead.",
    );
    envSource = "process environment";
    env = process.env;
  } else {
    envSource = ".env.production";
    // Real environment variables still win, matching how the app behaves.
    env = { ...parseEnvFile(prodFile), ...process.env };
  }
} else {
  // Development: use Next's own loader so precedence matches `next dev`.
  loadEnvConfig(projectDir, true);
  envSource = ".env.local";
  env = process.env;
}

const fail = (message: string, hint?: string): never => {
  console.error(`\n  ✖ ${message}`);
  if (hint) console.error(`\n    ${hint}`);
  console.error("");
  process.exit(1);
};

const resolveBaseUrl = (): string => {
  // An explicit argument wins, then the app's own canonical URL variables.
  const raw = urlArg || env.NEXT_PUBLIC_BASE_URL || env.NEXT_PUBLIC_SITE_URL;

  if (!raw) {
    fail(
      "No target URL found.",
      "Set NEXT_PUBLIC_BASE_URL in your env file, or pass one:\n" +
        "      npm run seed:admin -- https://example.com",
    );
  }

  try {
    return new URL(raw!).origin;
  } catch {
    return fail(`"${raw}" is not a valid URL.`);
  }
};

async function seedAdmin() {
  const baseUrl = resolveBaseUrl();
  const secret = env.SEED_SECRET;

  if (!secret) {
    fail(
      `SEED_SECRET is not set (looked in ${envSource}).`,
      "Generate one with:\n" +
        "      node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    );
  }

  // ADMIN_EMAIL and ADMIN_PASSWORD are deliberately not read here. The SERVER
  // decides which account to create, from its own environment — which is a
  // different machine when seeding a deployment. Printing the local values
  // would claim something untrue; the response reports what actually happened.

  // The secret travels in a header; over plain HTTP to a remote host it is
  // exposed in transit.
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:|$)/.test(baseUrl);
  if (baseUrl.startsWith("http://") && !isLocal) {
    console.warn(
      `\n  ⚠ ${baseUrl} is plain HTTP — the seed secret will be sent unencrypted.`,
    );
  }

  console.log(`\n  env      ${envSource}`);
  console.log(`  target   ${baseUrl}/api/auth/seed\n`);

  let res: Response;

  try {
    res = await fetch(`${baseUrl}/api/auth/seed`, {
      method: "POST",
      headers: { "x-seed-secret": secret!, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(30000),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return fail(
      `Could not reach ${baseUrl} — ${message}`,
      "Is the server running, and is the URL correct?",
    );
  }

  const text = await res.text();
  let body: {
    success?: boolean;
    message?: string;
    data?: {
      email?: string;
      passwordWasGenerated?: boolean;
      emailSent?: boolean;
    };
  };

  try {
    body = JSON.parse(text);
  } catch {
    return fail(
      `Unexpected non-JSON response (HTTP ${res.status}).`,
      text.slice(0, 200),
    );
  }

  if (res.status === 401) {
    return fail(
      "Rejected: wrong seed secret.",
      `The SEED_SECRET in ${envSource} must match the one the server is running with.`,
    );
  }

  if (!res.ok || !body.success) {
    return fail(`HTTP ${res.status}: ${body.message ?? text.slice(0, 200)}`);
  }

  // Reported by the server, so these describe the account that actually exists.
  console.log(`  ✔ ${body.message}`);
  if (body.data?.email) {
    console.log(`\n  admin    ${body.data.email}`);
  }
  if (body.data?.passwordWasGenerated !== undefined) {
    console.log(
      `  password ${
        body.data.passwordWasGenerated
          ? body.data.emailSent
            ? "generated, emailed to the address above"
            : "generated but NOT delivered"
          : "the ADMIN_PASSWORD configured on the server"
      }`,
    );
  }
  console.log("");

  // A generated password that could not be emailed exists nowhere, and the
  // endpoint will not recreate it. Treat that as a failure so it cannot pass
  // unnoticed in a deploy log.
  if (body.data?.passwordWasGenerated && body.data?.emailSent === false) {
    process.exit(1);
  }
}

seedAdmin().catch((error) => {
  console.error("\n  ✖ Unexpected error:", error);
  process.exit(1);
});
