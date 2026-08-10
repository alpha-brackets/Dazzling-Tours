<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!--
Everything below the END marker is hand-maintained project documentation.
`next dev` only rewrites the block above, so this section survives regeneration.
Keep it that way: never add project notes inside the markers.
-->

# Dazzling Tours — project guide

A tour-operator website (public marketing/booking pages) plus a `/admin` panel,
on Next.js App Router with MongoDB.

**This codebase is sold and re-deployed for multiple clients.** Each sale is a
fresh copy pointed at a new database and domain. That constraint drives several
rules below: per-deployment configuration must stay minimal, no secret may be
shared between deployments, and a misconfigured copy must fail loudly rather
than run insecurely.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16.3 App Router, Turbopack, React 19.2 |
| Database | MongoDB via Mongoose 8 |
| Validation | Zod 4 (request bodies in route handlers) |
| Server state | TanStack Query 5 + Axios (`src/lib/privateAxios.ts`) |
| Styling | Tailwind CSS 4, shadcn-style primitives in `src/components/ui` |
| Rich text | Tiptap 3 |
| Email | Nodemailer against Mailtrap |
| Images | ImageKit (provider-swappable via `src/lib/services/imageService.ts`) |

## Commands

```bash
npm run dev        # next dev --turbopack
npm run build      # production build (runs tsc)
npm run lint       # eslint — currently clean, keep it that way
npm run format     # prettier over src
npm run clear-db        # destructive, wipes the model-backed collections
npm run seed:admin      # create the admin via .env.local (create-only)
npm run seed:admin:prod # same, reading .env.production
npx tsc --noEmit        # typecheck alone
```

Both scripts run under `tsx`, not the Next runtime, so they load env files
themselves — nothing else does it for them. `clear-db` refuses a non-local
`MONGODB_URI` unless `CLEAR_DB_ALLOW_REMOTE=1`; `seed:admin:prod` reads
`.env.production` directly rather than through `@next/env`, because Next's
precedence puts `.env.local` above it and would silently use local values.

## Layout

```
src/app/                 routes; (innerpage)/ is a layout group for public pages
src/app/admin/           admin panel (client components, ProtectedRoute gate)
src/app/api/             route handlers
src/app/Components/      page-level presentational components (capital C)
src/components/ui/       shadcn-style primitives (lowercase c)
src/models/index.ts      ALL Mongoose schemas and models in one file
src/lib/auth.ts          session creation/lookup/revocation + cookie helpers
src/lib/middleware/auth.ts  withAuth / withRoleAuth wrappers, authenticateUser
src/lib/env.ts           required-env validation, requireEnv, serverEnv
src/instrumentation.ts   runs env validation once at server boot
src/lib/hooks/queries/   TanStack Query hooks, one file per resource
src/lib/services/        email, image providers
```

Note the two component directories differ only by case: `src/app/Components/`
(project components) vs `src/components/ui/` (generated primitives). Match the
import path of neighbouring files rather than guessing.

## Authentication — read before touching anything auth-related

Admin auth is **database-backed opaque sessions**, not JWTs. This was a
deliberate migration; do not reintroduce the old pattern.

- Login creates a `Session` document and returns the raw token **only** as an
  `httpOnly`, `SameSite=Strict` cookie (`session-token`). The token is never in
  a response body and never in `localStorage`.
- Only a SHA-256 hash of the token is stored, so a database dump cannot be
  replayed as a live session.
- `expiresAt` is enforced by a MongoDB TTL index **and** filtered on every
  lookup, because the TTL monitor only sweeps roughly once a minute.
- Logout deletes the row, so access is revoked immediately. `{allDevices:true}`
  revokes every session for the user.
- Changing a password revokes all *other* sessions and keeps the caller's.
  Resetting a password (forgot-password flow) revokes *all* of them.

**Hard rules:**

1. Never add `jsonwebtoken`, a `JWT_SECRET`, or any signing secret. There is no
   auth secret to configure, and that is the point — a shared or forgotten
   secret across client deployments would be a cross-tenant compromise.
2. Never write the session token to `localStorage`, `sessionStorage`, or a
   non-`httpOnly` cookie. JavaScript must not be able to read it.
3. Protect route handlers with `withAuth` / `withRoleAuth` from
   `src/lib/middleware/auth.ts`. Do not re-implement token parsing inline —
   `me` and `change-password` used to and it was duplicated, drift-prone logic.
4. Client code learns auth state from `AuthContext` (which asks `/auth/me`),
   never by inspecting a stored token. `AuthContext` deliberately exposes no
   `token` field.
5. `logout()` is async and performs a network call. Always `await` it before
   navigating, or the redirect can abort the revocation request.
6. Route protection for pages lives in `ProtectedRoute` in
   `src/app/admin/layout.tsx` — it redirects from a `useEffect`. Never navigate
   during the render phase.

## Environment and configuration

- Required variables are validated once at boot by `src/lib/env.ts` via
  `src/instrumentation.ts`. A missing one **aborts startup** and is named in the
  error. Add new required variables to the `SPEC.required` list there.
- Use `requireEnv("KEY")` instead of `process.env.KEY || "default"`. A fallback
  for a secret is how a deployment ends up silently insecure instead of broken —
  the old code had two *different* hardcoded fallback signing secrets.
- Never prefix a secret with `NEXT_PUBLIC_`; that inlines it into the browser
  bundle at build time. `NEXT_PUBLIC_SEED_SECRET` previously leaked the seed
  secret to every visitor.
- `NEXT_PUBLIC_*` changes require a rebuild, not just a restart.
- Templates: `.env.local.example` (development) and `.env.production.example`
  (production). Keep both in sync with the variables the code actually reads —
  they are the only env documentation a buyer gets.

## Seeding

`POST /api/auth/seed` creates the admin user. It is **create-only**: if the
admin already exists it is a no-op and must never reset the password. It is
guarded by the `x-seed-secret` header and is triggered **manually only** —
normally via `npm run seed:admin`, which reads the target domain and the secret
from the env files.

The credentials email is sent **only when the password was generated** here. If
`ADMIN_PASSWORD` is set the operator already knows it, so mailing it would put a
live password in an inbox and make seeding depend on a working mail server for
nothing. A generated password that cannot be emailed is unrecoverable, since
this route will not recreate it — the response says so explicitly and
`seed:admin` exits non-zero in that case.

Do not call it from application code. It was once invoked from a `useEffect` on
the login page, guarded by a per-browser `localStorage` flag — so every new
browser silently rotated the admin password and locked the owner out. That is
the bug this design prevents.

`POST /api/seed` is a separate endpoint that inserts sample content and refuses
to run unless the database is empty.

## Data layer conventions

- All schemas live in `src/models/index.ts`, each exported as
  `mongoose.models.X || mongoose.model<IX>("X", XSchema)` — required so Next's
  hot reload does not re-register models.
- Call `await connectDB()` at the start of any route handler that touches the
  database. `src/lib/mongodb.ts` caches the connection on `global`.
- Password hashing lives in the `User` pre-save hook and is guarded by
  `isModified("password")`. Do not hash before assigning, or it double-hashes.
- Prefer explicit follow-up queries over `.populate()` when the schema types a
  field as `ObjectId`; populate widens the type and fights the Mongoose
  generics for no round-trip savings.

## Verifying a change

```bash
npx tsc --noEmit && npm run build
```

For auth changes, test the real HTTP flow rather than trusting types. Run a dev
server against a throwaway database and check, at minimum: unauthenticated
request is 401; login sets an `HttpOnly` cookie with no token in the body; two
concurrent logins both work; logging out one leaves the other valid; a garbage
cookie is 401.

## Known state and caveats

- **Lint is clean — keep it that way.** `eslint-config-next` 16 enables the
  React Compiler `react-hooks/*` rules, and the codebase was refactored to
  satisfy them rather than silencing them. The patterns they enforce:
  - **Never define a component inside another component's render.** It is a new
    type every render, so React remounts the subtree instead of updating it,
    losing DOM state such as focus and scroll position. Hoist it to module
    scope and pass props (see the toolbar button in
    `Form/TiptapRichTextEditor.tsx` and the filter panels in `Blogs/Blog2.tsx`).
  - **Never read or write a ref during render.** Render must be pure; a render
    can be discarded, leaving the ref describing a tree that was never shown.
    If a value affects render output it is state, not a ref (see the
    manually-edited flags in `Form/SEOFields.tsx`). Ref mirrors that exist only
    so callbacks can read the latest value are assigned in an effect
    (`lib/hooks/useForm.ts`).
  - **Do not copy an external store into state with a mount effect.** Use
    `useSyncExternalStore`, whose server snapshot avoids a hydration mismatch
    and whose subscription keeps every reader in agreement — see
    `lib/hooks/useTourFavorites.ts` for localStorage and `components/ui/carousel.tsx`
    for the embla API. For one-shot reads, a lazy `useState` initialiser is
    enough, but only for client-rendered trees.
  - **Prefer deriving over synchronising.** `Blogs/Blog2.tsx` treats the URL as
    the single source of truth for filters instead of mirroring query params
    into state and re-syncing them in an effect.
- **ESLint is pinned to `^9`.** `eslint-config-next` 16 bundles an
  `eslint-plugin-react` that crashes on ESLint 10
  (`contextOrFilename.getFilename is not a function`). `eslint.config.mjs` also
  must spread the native flat configs directly — routing them through
  `FlatCompat` throws "Converting circular structure to JSON".
- **Cache Components are not adopted.** `next.config.mjs` does not set
  `cacheComponents`, so do not add `export const instant` to routes; the build
  rejects it. The Next 16 upgrade codemod injects those exports — remove them
  unless you are deliberately doing that migration.
- **`POST /api/seed` is unauthenticated**, relying only on the empty-database
  check. Worth hardening before a deployment where that matters.
- **Git history contains previously-committed secrets** (commit `e7739cc`
  included `.env.production`). When creating a client repo, copy working files
  and `git init` fresh rather than cloning history.
