"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { UserRole } from "@/lib/enums/roles";
import { api } from "@/lib/privateAxios";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  lastLogin?: string;
}

/**
 * The session token is deliberately absent from this context.
 *
 * It lives in an httpOnly cookie the browser attaches automatically, so
 * JavaScript never holds it and an XSS bug cannot read it. "Are we signed in?"
 * is answered by whether /auth/me succeeds, not by inspecting a stored token.
 */
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (
    email: string,
    otp: string,
    type: string,
  ) => Promise<{
    success: boolean;
    message: string;
    user?: User;
  }>;
  forgotPassword: (
    email: string,
  ) => Promise<{ success: boolean; message: string }>;
  resetPassword: (
    email: string,
    otp: string,
    newPassword: string,
  ) => Promise<{ success: boolean; message: string }>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ success: boolean; message: string }>;
  logout: (allDevices?: boolean) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  /**
   * Asks the server who we are. The cookie rides along automatically; a 401
   * simply means no valid session.
   */
  const fetchUserProfile = useCallback(async (): Promise<User | null> => {
    try {
      const response = await api.get<{
        success: boolean;
        data: { user: User };
      }>("/auth/me");

      if (response.data.success) {
        setUser(response.data.data.user);
        return response.data.data.user;
      }

      setUser(null);
      return null;
    } catch {
      // 401 on load is the normal "not signed in" case, not an error worth
      // reporting. privateAxios handles redirecting protected pages.
      setUser(null);
      return null;
    }
  }, []);

  // Restore the session on mount by validating the cookie server-side.
  useEffect(() => {
    const initializeAuth = async () => {
      await fetchUserProfile();
      setIsLoading(false);
    };

    initializeAuth();
  }, [fetchUserProfile]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<{ success: boolean; user?: User }>(
        "/auth/login",
        { email, password },
      );

      // The server set the session cookie on this response; we only receive
      // the user object.
      if (response.data?.user) {
        setUser(response.data.user);
        return { success: true, message: "Login successful" };
      }

      return { success: false, message: "Unexpected response from server" };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  const verifyOTP = async (email: string, otp: string, type: string) => {
    try {
      const response = await api.post<{
        success: boolean;
        message?: string;
        data?: { user?: User };
      }>("/auth/verify-otp", { email, otp, type });
      const data = response.data;

      // A login_verification OTP sets the session cookie and returns the user.
      if (data.success && data.data?.user) {
        setUser(data.data.user);
      }

      return {
        success: data.success,
        message: data.message || "Operation successful",
        user: data.data?.user,
      };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "OTP verification failed. Please try again.",
      };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await api.post<{ success: boolean; message: string }>(
        "/auth/forgot-password",
        { email },
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Failed to send reset email. Please try again.",
      };
    }
  };

  const resetPassword = async (
    email: string,
    otp: string,
    newPassword: string,
  ) => {
    try {
      const response = await api.post<{ success: boolean; message: string }>(
        "/auth/reset-password",
        { email, otp, newPassword },
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Password reset failed. Please try again.",
      };
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    try {
      const response = await api.post<{ success: boolean; message: string }>(
        "/auth/change-password",
        { currentPassword, newPassword },
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Password change failed. Please try again.",
      };
    }
  };

  /**
   * Revokes the session server-side, so the token is dead rather than merely
   * forgotten. Pass true to sign out every device.
   */
  const logout = async (allDevices = false) => {
    try {
      await api.post("/auth/logout", { allDevices });
    } catch (error) {
      // Even if the call fails, drop local state — the cookie is expired
      // server-side on success and the session is unusable either way.
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    await fetchUserProfile();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    verifyOTP,
    forgotPassword,
    resetPassword,
    changePassword,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
