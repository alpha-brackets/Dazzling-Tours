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

// Route protection lives in the ProtectedRoute component in
// src/app/admin/layout.tsx, which redirects from a useEffect via
// useRouter().push(). A previous useRequireAuth hook here navigated during the
// render phase, which React does not allow — it was unused and has been removed
// rather than duplicated.
