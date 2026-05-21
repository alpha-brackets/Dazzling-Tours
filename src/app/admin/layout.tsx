"use client";
import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/lib/contexts/AuthContext";
import { Loading } from "@/app/Components/Common";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Folder,
  Map,
  MessageSquare,
  Book,
  MessageCircle,
  Phone,
  User,
  ChevronDown,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = [
    "/admin/login",
    "/admin/forgot-password",
    "/admin/reset-password",
  ];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isPublicRoute) {
        router.push("/admin/login");
      } else if (isAuthenticated && pathname === "/admin/login") {
        router.push("/admin");
      }
    }
  }, [isAuthenticated, isLoading, isPublicRoute, pathname, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading variant="spinner" size="xl" color="primary" text="Loading panel..." />
      </div>
    );
  }

  // Show login page for unauthenticated users on protected routes
  if (!isAuthenticated && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Show children for authenticated users or public routes
  return <>{children}</>;
};

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: Folder },
  { href: "/admin/tours", label: "Tours", icon: Map },
  { href: "/admin/blogs", label: "Blogs", icon: Book },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/comments", label: "Comments", icon: MessageCircle },
  { href: "/admin/contact", label: "Contact", icon: Phone },
];

// Sidebar content component to reuse in desktop sidebar and mobile sheet drawer
const SidebarContent: React.FC<{
  activePath: string;
  onItemClick?: () => void;
}> = ({ activePath, onItemClick }) => {
  const router = useRouter();

  const isActive = (href: string) =>
    href === "/admin" ? activePath === "/admin" : activePath.startsWith(href);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 font-sans">
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="relative w-10 h-10 shrink-0">
          <Image
            src={`${IMAGEKIT_URL_ENDPOINT}/assets/img/logo-dazzling/Logo_White.png`}
            alt="Dazzling Tours"
            fill
            className="cursor-pointer object-contain"
            onClick={() => {
              router.push("/");
              if (onItemClick) onItemClick();
            }}
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base leading-none text-white tracking-wide">
            Dazzling Tours
          </span>
          <span className="text-xs text-slate-400 mt-1">CMS Control Panel</span>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onItemClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${active
                    ? "bg-[var(--theme)] text-white font-semibold shadow-md shadow-[var(--theme)]/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  <IconComponent
                    className={`h-5 w-5 shrink-0 transition-colors ${active ? "text-white" : "text-slate-400 group-hover:text-white"}`}
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800 text-center">
        <Link
          href="/"
          target="_blank"
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          View Live Website &rarr;
        </Link>
      </div>
    </div>
  );
};

// Main admin layout
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Public routes that don't need sidebar
  const publicRoutes = [
    "/admin/login",
    "/admin/forgot-password",
    "/admin/reset-password",
  ];
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="admin-layout-root flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden lg:block w-64 bg-slate-900 border-r border-slate-800 fixed h-screen top-0 left-0 z-20">
        <SidebarContent activePath={pathname} />
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
        {/* Header Bar */}
        <HeaderBar onMenuToggle={() => setMobileOpen(true)} />

        {/* Mobile Navigation Drawer */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className="p-0 w-64 bg-slate-900 border-r border-slate-800 text-white"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Admin Navigation Menu</SheetTitle>
            </SheetHeader>
            <SidebarContent
              activePath={pathname}
              onItemClick={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

// Header bar with user menu
const HeaderBar: React.FC<{ onMenuToggle: () => void }> = ({
  onMenuToggle,
}) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <header className="bg-white h-16 px-4 md:px-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Hamburger Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <h1 className="text-base md:text-lg font-bold text-gray-900 truncate">
          Admin Management Panel
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* User Account Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="h-9 py-1.5 px-3 inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-md cursor-pointer transition-colors">
            <User className="h-4 w-4 text-gray-500" />
            <span className="hidden sm:inline">{user?.email || "User"}</span>
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.email || "User"}
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="p-0">
                <Link
                  href="/admin/change-password"
                  className="flex items-center gap-2 px-2 py-1.5 cursor-pointer w-full text-gray-700 hover:no-underline"
                >
                  <Settings className="h-4 w-4 text-gray-400" />
                  <span>User Settings</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

// Root admin layout with providers
const RootAdminLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AdminLayout>{children}</AdminLayout>
      </ProtectedRoute>
    </AuthProvider>
  );
};

export default RootAdminLayout;
