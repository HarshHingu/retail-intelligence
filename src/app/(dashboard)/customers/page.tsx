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
  UserPlus,
  X,
  RefreshCw,
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

const CATEGORIES = ["Grocery", "Apparel", "Electronics", "Home & Kitchen", "Books", "Beauty"];
const COHORTS = ["VIP", "Loyal", "New", "At Risk", "Dormant"];

export default function CustomersPage() {
  const [data, setData] = useState<SegmentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "vip" | "loyal" | "new" | "atRisk" | "dormant">("all");

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form States
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCategory, setFormCategory] = useState("Grocery");
  const [formSegment, setFormSegment] = useState("New");
  const [formSpend, setFormSpend] = useState("");
  const [formOrders, setFormOrders] = useState("");

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

  const handleAddCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formPhone || !formCategory || !formSegment) {
      setModalError("Please fill out all required fields.");
      return;
    }

    try {
      setModalLoading(true);
      setModalError(null);
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          phone: formPhone,
          preferredCategory: formCategory,
          segment: formSegment,
          totalSpend: Number(formSpend) || 0,
          totalOrders: Number(formOrders) || 0,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add customer");
      }

      // Success Reset
      setFormName("");
      setFormEmail("");
      setFormPhone("");
      setFormCategory("Grocery");
      setFormSegment("New");
      setFormSpend("");
      setFormOrders("");
      setModalError(null);
      setShowAddModal(false);
      
      // Refresh customer segments list
      fetchSegments();
    } catch (err: any) {
      console.error(err);
      setModalError(err.message || "Error adding customer");
    } finally {
      setModalLoading(false);
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
      case "AT RISK":
      case "ATRISK":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "DORMANT":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      default:
        return "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20";
    }
  };

  const getSegmentDisplayName = (segment: string) => {
    if (segment === "AtRisk" || segment === "At Risk") return "At Risk";
    return segment;
  };

  const filteredCustomers = getFilteredCustomers();

  return (
    <div className="space-y-8 pb-12">
      {/* Search and Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search & Add Button Container */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by name, email, phone, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl focus:border-indigo-500 focus:outline-none text-sm text-white placeholder-neutral-500 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap text-sm hover:scale-[1.02]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
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

      {/* Modal - Add Customer Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <div 
            onClick={() => setShowAddModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
          />
          
          {/* Modal Content */}
          <div className="relative bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-md p-6 overflow-hidden shadow-2xl shadow-indigo-500/10">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                <span>Add Customer Profile</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-xs mb-4">
                {modalError}
              </div>
            )}

            <form onSubmit={handleAddCustomerSubmit} className="space-y-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Gupta"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-850 rounded-xl focus:border-indigo-500 focus:outline-none text-sm text-white placeholder-neutral-600 transition-colors"
                />
              </div>

              {/* Email & Phone grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-850 rounded-xl focus:border-indigo-500 focus:outline-none text-sm text-white placeholder-neutral-600 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-850 rounded-xl focus:border-indigo-500 focus:outline-none text-sm text-white placeholder-neutral-600 transition-colors"
                  />
                </div>
              </div>

              {/* Category & Segment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                    Preferred Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-850 rounded-xl focus:border-indigo-500 focus:outline-none text-sm text-white transition-colors"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                    Lifecycle Segment *
                  </label>
                  <select
                    value={formSegment}
                    onChange={(e) => setFormSegment(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-850 rounded-xl focus:border-indigo-500 focus:outline-none text-sm text-white transition-colors"
                  >
                    {COHORTS.map((coh) => (
                      <option key={coh} value={coh}>
                        {coh}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Spend & Orders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                    Total Spend (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formSpend}
                    onChange={(e) => setFormSpend(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-850 rounded-xl focus:border-indigo-500 focus:outline-none text-sm text-white placeholder-neutral-600 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                    Total Orders
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formOrders}
                    onChange={(e) => setFormOrders(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-850 rounded-xl focus:border-indigo-500 focus:outline-none text-sm text-white placeholder-neutral-600 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-900 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                >
                  {modalLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating Profile...</span>
                    </>
                  ) : (
                    <span>Add Customer</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
