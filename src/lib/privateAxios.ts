import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Create axios instance with default configuration
const privateAxios: AxiosInstance = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || "") + "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  // The session lives in an httpOnly cookie that JavaScript cannot read, so
  // the browser attaches it automatically and there is no Authorization
  // header to set. withCredentials keeps the cookie flowing if the API is ever
  // moved to a different origin.
  withCredentials: true,
});

// Response interceptor to handle common errors
privateAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response) {
      const { status, data } = error.response;
      const requestUrl: string = error.config?.url || "";

      // Endpoints where a 401 is an expected answer rather than a dead session,
      // so it must be shown inline instead of triggering a redirect.
      //
      // /auth/me is the important one: AuthProvider calls it on every mount to
      // ask "am I signed in?", and 401 is simply "no". Redirecting on that
      // answer while already on the login page reloads the page, which mounts
      // AuthProvider again — an infinite reload loop.
      const isAuthEndpoint =
        requestUrl.includes("/auth/me") ||
        requestUrl.includes("/auth/login") ||
        requestUrl.includes("/auth/logout") ||
        requestUrl.includes("/auth/forgot-password") ||
        requestUrl.includes("/auth/reset-password") ||
        requestUrl.includes("/auth/send-otp") ||
        requestUrl.includes("/auth/verify-otp");

      // Second guard: never redirect to login from a page that is already
      // unauthenticated. Without this, a 401 from any other request on these
      // pages would cause the same reload loop.
      const publicAdminRoutes = [
        "/admin/login",
        "/admin/forgot-password",
        "/admin/reset-password",
      ];
      const onPublicAdminRoute =
        typeof window !== "undefined" &&
        publicAdminRoutes.some((route) =>
          window.location.pathname.startsWith(route),
        );

      switch (status) {
        case 401:
          // Unauthorized - the session was revoked or expired.
          // Skip the redirect for auth endpoints themselves (e.g. a failed
          // login attempt), since that's a normal error to show inline,
          // not an expired session.
          // Nothing to clear locally: the session cookie is httpOnly and the
          // server clears it.
          //
          // A full-page navigation is deliberate here rather than
          // useRouter().push(): this module is not a React component, and a
          // hard reload discards any stale in-memory state left over from the
          // dead session. The destination is built as an absolute URL against
          // the current origin so it is never treated as a relative path.
          if (
            typeof window !== "undefined" &&
            !isAuthEndpoint &&
            !onPublicAdminRoute
          ) {
            window.location.assign(
              new URL("/admin/login", window.location.origin).toString(),
            );
          }
          break;
        case 403:
          // Forbidden - user doesn't have permission
          console.error("Access denied:", data?.error || "Forbidden");
          break;
        case 404:
          // Not found
          console.error("Resource not found:", data?.error || "Not found");
          break;
        case 500:
          // Server error
          console.error(
            "Server error:",
            data?.error || "Internal server error",
          );
          break;
        default:
          console.error("API Error:", data?.error || error.message);
      }
    } else if (error.request) {
      // Network error
      console.error("Network error:", error.message);
    } else {
      // Other error
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  },
);

// Helper functions for common HTTP methods
export const api = {
  // GET request
  get: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return privateAxios.get<T>(url, config);
  },

  // POST request
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return privateAxios.post<T>(url, data, config);
  },

  // PUT request
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return privateAxios.put<T>(url, data, config);
  },

  // PATCH request
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return privateAxios.patch<T>(url, data, config);
  },

  // DELETE request
  delete: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return privateAxios.delete<T>(url, config);
  },
};

// Export the configured axios instance
export default privateAxios;

// Export types for better TypeScript support
export type { AxiosRequestConfig, AxiosResponse } from "axios";
