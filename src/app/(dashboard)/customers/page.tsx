"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Crown,
  Heart,
  Sparkles,
  AlertTriangle,
  Moon,
  Calendar,
  ShoppingBag,
  Mail,
  Phone,
  User,
} from "lucide-react";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  totalSpend: number;
  totalOrders: number;
  lastPurchaseDate: string;
  firstPurchaseDate: string;
  segment: string;
  preferredCategory: string;
}

interface SegmentsData {
  vip: Customer[];
  loyal: Customer[];
  new: Customer[];
  atRisk: Customer[];
  dormant: Customer[];
}

export default function CustomersPage() {
  const [data, setData] = useState<SegmentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "vip" | "loyal" | "new" | "atRisk" | "dormant">("all");

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/segments");
      if (!res.ok) {
        throw new Error("Failed to load customer segments");
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCustomers = (): Customer[] => {
    if (!data) return [];

    let list: Customer[] = [];
    if (activeTab === "all") {
      list = [...data.vip, ...data.loyal, ...data.new, ...data.atRisk, ...data.dormant];
    } else if (activeTab === "vip") {
      list = data.vip;
    } else if (activeTab === "loyal") {
      list = data.loyal;
    } else if (activeTab === "new") {
      list = data.new;
    } else if (activeTab === "atRisk") {
      list = data.atRisk;
    } else if (activeTab === "dormant") {
      list = data.dormant;
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.preferredCategory.toLowerCase().includes(q)
      );
    }

    return list;
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSegmentBadgeStyles = (segment: string) => {
    switch (segment.toUpperCase()) {
      case "VIP":
        return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
      case "LOYAL":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      case "NEW":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "ATRISK":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "DORMANT":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      default:
        return "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20";
    }
  };

  const getSegmentDisplayName = (segment: string) => {
    if (segment === "AtRisk") return "At Risk";
    return segment;
  };

  const filteredCustomers = getFilteredCustomers();

  return (
    <div className="space-y-8 pb-12">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by name, email, phone, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl focus:border-indigo-500 focus:outline-none text-sm text-white placeholder-neutral-500 transition-colors"
          />
        </div>

        {/* Sync Indicator */}
        {data && (
          <div className="text-xs text-neutral-500 text-right shrink-0">
            Showing {filteredCustomers.length} of{" "}
            {data.vip.length + data.loyal.length + data.new.length + data.atRisk.length + data.dormant.length}{" "}
            customers
          </div>
        )}
      </div>

      {/* Segment Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-neutral-900">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "all"
              ? "border-indigo-500 text-white"
              : "border-transparent text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <User className="w-4 h-4" />
          <span>All Customers</span>
        </button>
        <button
          onClick={() => setActiveTab("vip")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "vip"
              ? "border-indigo-500 text-white"
              : "border-transparent text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Crown className="w-4 h-4 text-indigo-400" />
          <span>VIP</span>
        </button>
        <button
          onClick={() => setActiveTab("loyal")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "loyal"
              ? "border-indigo-500 text-white"
              : "border-transparent text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Heart className="w-4 h-4 text-purple-400" />
          <span>Loyal</span>
        </button>
        <button
          onClick={() => setActiveTab("new")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "new"
              ? "border-indigo-500 text-white"
              : "border-transparent text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>New</span>
        </button>
        <button
          onClick={() => setActiveTab("atRisk")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "atRisk"
              ? "border-indigo-500 text-white"
              : "border-transparent text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>At Risk</span>
        </button>
        <button
          onClick={() => setActiveTab("dormant")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "dormant"
              ? "border-indigo-500 text-white"
              : "border-transparent text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Moon className="w-4 h-4 text-rose-400" />
          <span>Dormant</span>
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm">
          Failed to fetch customer data: {error}
        </div>
      )}

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-32 bg-neutral-800 rounded" />
                <div className="h-6 w-16 bg-neutral-800 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-40 bg-neutral-800 rounded" />
                <div className="h-3 w-28 bg-neutral-800 rounded" />
              </div>
              <div className="pt-4 border-t border-neutral-800 grid grid-cols-2 gap-4">
                <div className="h-8 bg-neutral-800 rounded" />
                <div className="h-8 bg-neutral-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredCustomers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <div
              key={customer._id}
              className="group bg-neutral-900/40 hover:bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Card Title & Segment */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">
                    {customer.name}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide shrink-0 ${getSegmentBadgeStyles(
                      customer.segment
                    )}`}
                  >
                    {getSegmentDisplayName(customer.segment)}
                  </span>
                </div>

                {/* Contact info */}
                <div className="space-y-1.5 text-xs text-neutral-400 mb-6">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-neutral-800/40">
                    <ShoppingBag className="w-3.5 h-3.5 text-indigo-400/80" />
                    <span>
                      Preferred:{" "}
                      <span className="text-white font-medium">{customer.preferredCategory}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Spend Details Footer */}
              <div className="pt-4 border-t border-neutral-800/80 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
                    Total Spend
                  </span>
                  <span className="text-base font-bold text-white">
                    {formatCurrency(customer.totalSpend)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
                    Orders / LTV
                  </span>
                  <span className="text-base font-bold text-neutral-200">
                    {customer.totalOrders} orders
                  </span>
                </div>
                <div className="col-span-2 flex items-center gap-1.5 text-[10px] text-neutral-400 mt-2 bg-neutral-950/60 p-2 rounded-lg border border-neutral-900">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span>Last order: {formatDate(customer.lastPurchaseDate)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-neutral-900/20 border border-neutral-800 rounded-2xl p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-xl bg-neutral-900 text-neutral-500 flex items-center justify-center mx-auto mb-4 border border-neutral-800">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No customers found</h3>
          <p className="text-neutral-400 text-sm">
            We couldn't find any customers matching your search query or segment filters.
          </p>
        </div>
      )}
    </div>
  );
}
