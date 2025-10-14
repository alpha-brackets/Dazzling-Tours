import { useAuth as useAuthContext } from "@/lib/contexts/AuthContext";
import { UserRole } from "@/lib/enums/roles";

// Re-export the useAuth hook from AuthContext for convenience
export const useAuth = useAuthContext;

// Additional auth utilities
export const useAuthGuard = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  return {
    isAuthenticated,
    isLoading,
    user,
    isSuperAdmin: user?.role === UserRole.SUPER_ADMIN,
  };
};

// Hook for protected routes
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && !isAuthenticated) {
    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
  }

  return { isAuthenticated, isLoading };
};
