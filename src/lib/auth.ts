import crypto from "crypto";
import { NextRequest } from "next/server";
import { Session, ISession, User, IUser } from "@/models";

/**
 * Server-side session auth.
 *
 * Sessions are opaque random tokens backed by a database row, not signed JWTs.
 * That means:
 *  - there is no signing secret to configure, share between deployments, or
 *    accidentally leave unset (a missing secret used to silently downgrade to
 *    a hardcoded fallback);
 *  - logout revokes access immediately, because the row is deleted;
 *  - expiry is enforced by a MongoDB TTL index plus a filter on every lookup.
 *
 * Only the SHA-256 hash of a token is persisted, so a database dump cannot be
 * replayed. The raw token is returned once, at creation, and after that only
 * the client holds it.
 */

export const SESSION_COOKIE_NAME = "session-token";

/** Session lifetime. Kept modest because admin sessions are high value. */
export const SESSION_TTL_DAYS = 7;
const SESSION_TTL_MS = SESSION_TTL_DAYS * 24 * 60 * 60 * 1000;

/**
 * 32 bytes of CSPRNG output, base64url encoded. Unguessable, so the token
 * needs no signature to be trustworthy — it is only valid if it matches a row.
 */
const generateSessionToken = (): string =>
  crypto.randomBytes(32).toString("base64url");

/**
 * Tokens are high-entropy random values, so a fast hash is correct here.
 * bcrypt/argon2 exist to slow down guessing of low-entropy human passwords;
 * they would add nothing against a 256-bit random string.
 */
const hashSessionToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

export interface CreatedSession {
  /** Raw token — send to the client, never stored server-side. */
  token: string;
  expiresAt: Date;
}

/**
 * Issues a new session for a user. Call on successful login.
 */
export const createSession = async (
  userId: string,
  meta: { userAgent?: string; ip?: string } = {},
): Promise<CreatedSession> => {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await Session.create({
    tokenHash: hashSessionToken(token),
    user: userId,
    expiresAt,
    userAgent: meta.userAgent,
    ip: meta.ip,
    lastUsedAt: new Date(),
  });

  return { token, expiresAt };
};

/**
 * Looks up a live session and its user, or null.
 *
 * The expiresAt filter matters: MongoDB's TTL monitor only sweeps about once a
 * minute, so an expired row can still be present.
 */
export const findSessionByToken = async (
  token: string,
): Promise<{ session: ISession; user: IUser } | null> => {
  const session = await Session.findOne({
    tokenHash: hashSessionToken(token),
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    return null;
  }

  // Fetched separately rather than via populate(), which would widen the
  // session's `user` field from ObjectId to IUser and fight the schema types.
  // Mongoose issues a second query for populate() anyway, so this costs the
  // same.
  const user = await User.findById(session.user);

  if (!user) {
    // The user was deleted while the session lived on. Clean it up so the
    // orphan does not linger until its TTL.
    await Session.deleteOne({ _id: session._id });
    return null;
  }

  return { session, user: user as unknown as IUser };
};

/** Revokes a single session. Used by logout. */
export const revokeSession = async (token: string): Promise<void> => {
  await Session.deleteOne({ tokenHash: hashSessionToken(token) });
};

/**
 * Revokes every session for a user — "log out everywhere".
 * `exceptToken` keeps the caller's own session alive, which is what you want
 * after a password change: other devices are kicked out, you stay in.
 */
export const revokeUserSessions = async (
  userId: string,
  exceptToken?: string,
): Promise<number> => {
  const filter: Record<string, unknown> = { user: userId };

  if (exceptToken) {
    filter.tokenHash = { $ne: hashSessionToken(exceptToken) };
  }

  const result = await Session.deleteMany(filter);
  return result.deletedCount ?? 0;
};

/**
 * Extends a session's lifetime on use, so active admins are not logged out
 * mid-session. Throttled to at most once an hour to avoid a write per request.
 */
export const touchSession = async (session: ISession): Promise<void> => {
  const ONE_HOUR = 60 * 60 * 1000;

  if (Date.now() - session.lastUsedAt.getTime() < ONE_HOUR) {
    return;
  }

  await Session.updateOne(
    { _id: session._id },
    {
      lastUsedAt: new Date(),
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    },
  );
};

/**
 * Reads the session token from a request: httpOnly cookie first, then a
 * Bearer header as a fallback for non-browser callers (scripts, tests).
 */
export const getTokenFromRequest = (request: NextRequest): string | null => {
  const cookieToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (cookieToken) {
    return cookieToken;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
};

/** Client metadata for a new session, used to make sessions identifiable. */
export const getRequestMeta = (
  request: NextRequest,
): { userAgent?: string; ip?: string } => ({
  userAgent: request.headers.get("user-agent") ?? undefined,
  ip:
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    undefined,
});

/**
 * httpOnly means JavaScript cannot read the token, so an XSS bug on the site
 * cannot steal the admin session. SameSite=Strict blocks CSRF: the cookie is
 * not sent on cross-site requests, so a hostile page cannot act as the admin.
 */
export const createSessionCookie = (token: string, expiresAt: Date): string => {
  const isProduction = process.env.NODE_ENV === "production";

  return [
    `${SESSION_COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Expires=${expiresAt.toUTCString()}`,
    // Secure would make the cookie unusable over plain-HTTP localhost.
    isProduction ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
};

export const createLogoutCookie = (): string => {
  const isProduction = process.env.NODE_ENV === "production";

  return [
    `${SESSION_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=0",
    isProduction ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
};
