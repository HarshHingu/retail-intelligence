"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Sparkles,
  Bot,
  Send,
  Menu,
  X,
  Brain,
  Home,
  LogOut,
} from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  description: string;
}

const navigationItems: SidebarItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of key metrics and charts",
  },
  {
    name: "Customers",
    href: "/customers",
    icon: Users,
    description: "Customer segment lists and analytics",
  },
  {
    name: "AI Insights",
    href: "/insights",
    icon: Sparkles,
    description: "LLM-generated growth metrics",
  },
  {
    name: "AI Copilot",
    href: "/copilot",
    icon: Bot,
    description: "Chat with your retail assistant",
  },
  {
    name: "Campaign Studio",
    href: "/campaigns",
    icon: Send,
    description: "Generate targeted marketing offers",
  },
];

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPageTitle = () => {
    const activeItem = navigationItems.find((item) => pathname.startsWith(item.href));
    return activeItem ? activeItem.name : "RetailGPT";
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex font-sans">
      {/* Background radial highlight */}
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(30,27,75,0.15),transparent_50%)] pointer-events-none -z-10" />

      {/* Desktop Sidebar (Sidebar is hidden on mobile) */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-neutral-900 bg-neutral-950/60 backdrop-blur-md sticky top-0 h-screen p-6 shrink-0 z-40">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              RetailGPT
            </span>
            <span className="text-[10px] text-neutral-500 font-semibold tracking-wider uppercase">
              Growth Copilot
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1.5">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? "bg-indigo-600/10 border-indigo-500/30 text-white shadow-sm shadow-indigo-500/5"
                    : "border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900/60 hover:border-neutral-900"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110 duration-200 ${
                    isActive ? "text-indigo-400" : "text-neutral-500 group-hover:text-neutral-300"
                  }`}
                />
                <div className="flex flex-col">
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="border-t border-neutral-900 pt-6 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900/60"
          >
            <Home className="w-5 h-5 text-neutral-500" />
            <span>Marketing Site</span>
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 text-neutral-600 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Agentic MVP active</span>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-80 bg-neutral-950 border-r border-neutral-900 p-6 z-50 transform transition-transform duration-300 lg:hidden flex flex-col justify-between ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2.5 rounded-xl">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">RetailGPT</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded-lg hover:bg-neutral-900 text-neutral-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-1.5">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border ${
                    isActive
                      ? "bg-indigo-600/10 border-indigo-500/30 text-white"
                      : "border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "text-neutral-500"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-neutral-900 pt-6 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-400 hover:text-white"
          >
            <Home className="w-5 h-5" />
            <span>Marketing Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
        {/* Mobile Header / Navigation */}
        <header className="lg:hidden flex items-center justify-between px-6 h-16 border-b border-neutral-900 bg-neutral-950/60 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 -ml-1.5 rounded-lg hover:bg-neutral-900 text-neutral-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-base font-bold text-white tracking-tight">{getPageTitle()}</h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
            RG
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between px-8 h-20 border-b border-neutral-900 sticky top-0 bg-neutral-950/40 backdrop-blur-md z-30 shrink-0">
          <h1 className="text-2xl font-bold tracking-tight text-white">{getPageTitle()}</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">Harsh (Admin)</p>
              <p className="text-[10px] text-neutral-400 font-medium">harsh@example.com</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/10">
              H
            </div>
          </div>
        </header>

        {/* Main Section */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
