import React from "react";
import {
  AdminLayout,
  AdminSidebar,
  AdminSidebarItem,
  AdminNav,
  AdminNavItem,
  AdminCard,
} from "./AdminComponents";

export interface AdminPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  currentPath?: string;
}

export const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
  children,
  title,
  subtitle,
  currentPath,
}) => {
  const sidebarItems = [
    { href: "/admin", label: "Dashboard", icon: "🏠" },
    { href: "/admin/tours", label: "Tours", icon: "🗺️" },
    { href: "/admin/testimonials", label: "Testimonials", icon: "💬" },
    { href: "/admin/blogs", label: "Blogs", icon: "📝" },
    { href: "/admin/contact", label: "Contact", icon: "📧" },
    { href: "/admin/users", label: "Users", icon: "👥" },
    { href: "/admin/settings", label: "Settings", icon: "⚙️" },
  ];

  const navItems = [
    { href: "/admin/profile", label: "Profile" },
    { href: "/admin/logout", label: "Logout" },
  ];

  return (
    <AdminLayout>
      <div className="d-flex">
        {/* Sidebar */}
        <AdminSidebar>
          <div className="mb-4">
            <h3 className="admin-title">Dazzling Tours</h3>
            <p className="admin-subtitle">Admin Portal</p>
          </div>

          <nav>
            {sidebarItems.map((item) => (
              <AdminSidebarItem
                key={item.href}
                href={item.href}
                active={currentPath === item.href}
              >
                <span className="me-2">{item.icon}</span>
                {item.label}
              </AdminSidebarItem>
            ))}
          </nav>
        </AdminSidebar>

        {/* Main Content */}
        <div className="flex-grow-1">
          {/* Top Navigation */}
          <AdminNav>
            <div className="d-flex justify-content-between align-items-center w-100">
              <div>
                <h2 className="admin-title mb-0">{title}</h2>
                {subtitle && <p className="admin-subtitle mb-0">{subtitle}</p>}
              </div>

              <div className="d-flex gap-3">
                {navItems.map((item) => (
                  <AdminNavItem key={item.href} href={item.href}>
                    {item.label}
                  </AdminNavItem>
                ))}
              </div>
            </div>
          </AdminNav>

          {/* Page Content */}
          <div className="p-4">
            <AdminCard>{children}</AdminCard>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPageLayout;
