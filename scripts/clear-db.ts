/**
 * Wipes the application collections. Development convenience — destructive.
 *
 *   npm run clear-db
 *
 * Env loading: this runs under tsx, not the Next.js runtime, so nothing loads
 * .env files for us. @next/env is used (it ships with Next) so the same files
 * and the same precedence apply as when the app runs — .env.local wins over
 * .env.development / .env.production, which wins over .env.
 */
import { loadEnvConfig } from "@next/env";
import path from "path";

// Must run before anything imports src/lib/mongodb, which reads
// process.env.MONGODB_URI at module scope.
const projectDir = path.resolve(__dirname, "..");
loadEnvConfig(projectDir, true /* dev */);

/* eslint-disable @typescript-eslint/no-require-imports */
// Required lazily so the env above is in place first.
const connectDB = require("../src/lib/mongodb").default;
const models = require("../src/models");
/* eslint-enable @typescript-eslint/no-require-imports */

/** Collections owned by a Mongoose model, in a safe deletion order. */
const TARGETS = [
  "Session",
  "OTP",
  "Comment",
  "Testimonial",
  "Blog",
  "Tour",
  "Contact",
  "CustomerUser",
  "User",
  "Category",
] as const;

/**
 * Refuse to run against anything that is not obviously a local database.
 * A mistyped or leftover production URI in the environment would otherwise
 * delete every tour, blog, and admin account with no confirmation. Override
 * deliberately with CLEAR_DB_ALLOW_REMOTE=1 when that is genuinely intended.
 */
const assertLocalTarget = (uri: string) => {
  const isLocal =
    uri.includes("://localhost") ||
    uri.includes("://127.0.0.1") ||
    uri.includes("@localhost") ||
    uri.includes("@127.0.0.1");

  if (isLocal || process.env.CLEAR_DB_ALLOW_REMOTE === "1") {
    return;
  }

  const redacted = uri.replace(/\/\/[^@]*@/, "//<credentials>@");
  console.error(
    [
      "",
      "  Refusing to clear a non-local database.",
      "",
      "  MONGODB_URI points at: " + redacted,
      "",
      "  This script deletes every document in the application collections.",
      "  If you really mean to wipe this database, re-run with:",
      "",
      "    CLEAR_DB_ALLOW_REMOTE=1 npm run clear-db",
      "",
    ].join("\n"),
  );
  process.exit(1);
};

async function clearDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error(
      "\n  MONGODB_URI is not set. Add it to .env.local (see .env.local.example).\n",
    );
    process.exit(1);
  }

  assertLocalTarget(uri);

  const dbName = uri.split("/").pop()?.split("?")[0] || "(unknown)";
  console.log(`\n🔌 Connecting to "${dbName}"...`);

  const mongoose = await connectDB();

  console.log("🗑️  Clearing collections...\n");

  let total = 0;

  for (const name of TARGETS) {
    const model = models[name];

    if (!model) {
      console.log(`⚠️  ${name}: no such model, skipped`);
      continue;
    }

    try {
      const result = await model.deleteMany({});
      total += result.deletedCount ?? 0;
      console.log(`✅ ${name}: ${result.deletedCount} documents`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`❌ ${name}: ${message}`);
    }
  }

  // Anything without a model is left alone; say so rather than implying the
  // database is empty.
  const modelCollections = new Set(
    TARGETS.map((name) => models[name]?.collection?.collectionName).filter(
      Boolean,
    ),
  );
  const present = await mongoose.connection.db.listCollections().toArray();
  const untouched = present
    .map((c: { name: string }) => c.name)
    .filter((n: string) => !modelCollections.has(n) && !n.startsWith("system."))
    .sort();

  console.log(`\n✨ Cleared ${total} document(s) from ${TARGETS.length} collections.`);

  if (untouched.length > 0) {
    console.log(
      `ℹ️  Not touched (no model defined): ${untouched.join(", ")}`,
    );
  }

  await mongoose.connection.close();
  process.exit(0);
}

clearDatabase().catch((error) => {
  console.error("❌ Error clearing database:", error);
  process.exit(1);
});
