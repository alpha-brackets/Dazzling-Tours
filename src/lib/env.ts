/**
 * Server-side environment validation.
 *
 * The point is to fail loudly and early. A missing variable should produce one
 * obvious error naming exactly what to set, not a subtly broken feature
 * discovered weeks later — or worse, an insecure default. This matters most on
 * a fresh deployment by someone who did not write the code.
 *
 * Import `serverEnv` from server-side code only (route handlers, services).
 * Never import it into a client component: it reads secrets, and bundling it
 * for the browser would expose them.
 */

type EnvSpec = {
  /** Missing or empty aborts startup. */
  required: readonly string[];
  /**
   * Feature-gated: absence is legal, but the named feature stops working.
   * Reported as a warning at boot so the gap is visible rather than silent.
   */
  optional: readonly { key: string; feature: string }[];
};

const SPEC: EnvSpec = {
  required: [
    // Without a database nothing works at all.
    "MONGODB_URI",
    // Canonical URLs. Wrong values silently corrupt sitemap.xml, robots.txt,
    // and every link in outgoing email.
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_BASE_URL",
  ],
  optional: [
    {
      key: "MAILTRAP_PASS",
      feature:
        "email delivery (OTP login, password reset, contact notifications)",
    },
    {
      key: "IMAGEKIT_PRIVATE_KEY",
      feature: "image uploads",
    },
    {
      key: "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
      feature: "image display",
    },
    {
      key: "ADMIN_EMAIL",
      feature: "admin seeding (POST /api/auth/seed)",
    },
    {
      key: "SEED_SECRET",
      feature: "admin seeding (POST /api/auth/seed)",
    },
  ],
};

const isBlank = (value: string | undefined): boolean =>
  value === undefined || value.trim() === "";

export class EnvValidationError extends Error {
  constructor(missing: readonly string[]) {
    super(
      [
        "",
        "  Missing required environment variables:",
        ...missing.map((key) => `    - ${key}`),
        "",
        "  Set them in .env.local (development) or .env.production /",
        "  your host's environment settings (production).",
        "  See env.development.example and env.production.example.",
        "",
      ].join("\n"),
    );
    this.name = "EnvValidationError";
  }
}

let validated = false;

/**
 * Throws if any required variable is missing. Idempotent, so it is safe to call
 * from multiple entry points; the work happens once.
 *
 * MAILTRAP_PASS is treated as satisfied by MAILTRAP_TOKEN, since the live
 * sending API authenticates with the token in place of a password.
 */
export const validateEnv = (): void => {
  if (validated) {
    return;
  }

  const missing = SPEC.required.filter((key) => isBlank(process.env[key]));

  if (missing.length > 0) {
    throw new EnvValidationError(missing);
  }

  for (const { key, feature } of SPEC.optional) {
    const satisfied =
      !isBlank(process.env[key]) ||
      (key === "MAILTRAP_PASS" && !isBlank(process.env.MAILTRAP_TOKEN));

    if (!satisfied) {
      console.warn(`[env] ${key} is not set — ${feature} will not work.`);
    }
  }

  validated = true;
};

/**
 * Reads a required variable, throwing if absent. Use instead of
 * `process.env.X || "some-default"` — a fallback for a secret is how a
 * misconfigured deployment ends up silently insecure rather than broken.
 */
export const requireEnv = (key: string): string => {
  const value = process.env[key];

  if (isBlank(value)) {
    throw new EnvValidationError([key]);
  }

  return value as string;
};

/** Validated accessors for the values used across the app. */
export const serverEnv = {
  get mongodbUri(): string {
    return requireEnv("MONGODB_URI");
  },
  get siteUrl(): string {
    return requireEnv("NEXT_PUBLIC_SITE_URL");
  },
  get baseUrl(): string {
    return requireEnv("NEXT_PUBLIC_BASE_URL");
  },
  get seedSecret(): string {
    return requireEnv("SEED_SECRET");
  },
  get adminEmail(): string {
    return requireEnv("ADMIN_EMAIL");
  },
  get isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  },
} as const;
