"use client";
import React from "react";
import Link from "next/link";
import { useGetDashboardStats } from "@/lib/hooks";
import {
  Page,
  Stack,
} from "@/app/Components/Common";
import { Button } from "@/components/ui/button";
import { Map, BookOpen, Mail, MessageSquareQuote, PlusCircle } from "lucide-react";

const colorMap = {
  primary: { bg: "bg-blue-50", text: "text-blue-600" },
  info: { bg: "bg-sky-50", text: "text-sky-600" },
  warning: { bg: "bg-amber-50", text: "text-amber-600" },
  success: { bg: "bg-green-50", text: "text-green-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
  pink: { bg: "bg-pink-50", text: "text-pink-600" },
};

const AdminDashboard = () => {
  const { data: statsData, isLoading: loading } = useGetDashboardStats();
  const stats = statsData?.data;

  const statCards = stats
    ? [
      {
        title: "Total Tours",
        value: stats.tours.total,
        subtitle: `${stats.tours.published} Published`,
        icon: Map,
        color: "primary" as const,
        link: "/admin/tours",
      },
      {
        title: "Total Blogs",
        value: stats.blogs.total,
        subtitle: `${stats.blogs.published} Published`,
        icon: BookOpen,
        color: "info" as const,
        link: "/admin/blogs",
      },
      {
        title: "Contact Queries",
        value: stats.contacts.total,
        subtitle: `${stats.contacts.new} New`,
        icon: Mail,
        color: "warning" as const,
        link: "/admin/contact",
      },
      {
        title: "Testimonials",
        value: stats.testimonials.total,
        subtitle: `${stats.testimonials.published} Published`,
        icon: MessageSquareQuote,
        color: "purple" as const,
        link: "/admin/testimonials",
      },
    ]
    : [];

  return (
    <Page
      title="Dashboard"
      description="Welcome to Dazzling Tours CMS - Overview of your content and activities"
      loading={loading}
    >
      <Stack>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            const colors = colorMap[stat.color] || colorMap.primary;
            return (
              <Link
                key={index}
                href={stat.link}
                className="no-underline text-inherit block"
              >
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer flex flex-col gap-4 h-full">
                  <div className="flex justify-between items-start w-full">
                    <span className="text-gray-500 font-medium text-sm">
                      {stat.title}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colors.bg} ${colors.text}`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mt-auto">
                    <span className="text-3xl font-bold text-gray-900 tracking-tight leading-none">
                      {stat.value}
                    </span>
                    {stat.subtitle && (
                      <span className="text-xs text-gray-500 font-medium mt-1">
                        {stat.subtitle}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="mb-5 font-semibold text-lg text-gray-900 m-0">
            Quick Actions
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <Link href="/admin/tours" className="flex-1 sm:flex-none">
              <Button
                className="w-full sm:w-auto min-w-[180px] h-10 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                <PlusCircle className="h-4 w-4" /> Add New Tour
              </Button>
            </Link>
            <Link href="/admin/blogs/add" className="flex-1 sm:flex-none">
              <Button
                className="w-full sm:w-auto min-w-[180px] h-10 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                <PlusCircle className="h-4 w-4" /> Add New Blog
              </Button>
            </Link>
            <Link href="/admin/contact" className="flex-1 sm:flex-none">
              <Button
                className="w-full sm:w-auto min-w-[180px] h-10 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
              >
                <Mail className="h-4 w-4" /> Contact Queries
              </Button>
            </Link>
          </div>
        </div>
      </Stack>
    </Page>
  );
};

export default AdminDashboard;
