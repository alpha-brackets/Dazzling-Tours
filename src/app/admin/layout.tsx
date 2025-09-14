"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./admin.css";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: "bi bi-speedometer2",
    },
    {
      title: "Tours",
      href: "/admin/tours",
      icon: "bi bi-map",
      submenu: [
        { title: "View Tours", href: "/admin/tours" },
        { title: "Add Tour", href: "/admin/tours/add" },
        { title: "Bookings", href: "/admin/tours/bookings" },
      ],
    },
    {
      title: "Blogs",
      href: "/admin/blogs",
      icon: "bi bi-journal-text",
      submenu: [
        { title: "View Blogs", href: "/admin/blogs" },
        { title: "Add Blog", href: "/admin/blogs/add" },
        { title: "Comments", href: "/admin/blogs/comments" },
      ],
    },
    {
      title: "Contact Queries",
      href: "/admin/contact",
      icon: "bi bi-envelope",
      submenu: [
        { title: "View Queries", href: "/admin/contact" },
        { title: "Query Details", href: "/admin/contact/details" },
      ],
    },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Dazzling Tours CMS</h3>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <div key={index} className="nav-item">
              <Link
                href={item.href}
                className={`nav-link ${pathname === item.href ? "active" : ""}`}
              >
                <i className={item.icon}></i>
                <span>{item.title}</span>
              </Link>
              {item.submenu && (
                <div className="submenu">
                  {item.submenu.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.href}
                      className={`submenu-link ${
                        pathname === subItem.href ? "active" : ""
                      }`}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-header">
          <button
            className="mobile-menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="bi bi-list"></i>
          </button>
          <div className="header-actions">
            <Link href="/" className="btn btn-outline-primary">
              <i className="bi bi-house"></i> View Site
            </Link>
            <button className="btn btn-outline-secondary">
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
