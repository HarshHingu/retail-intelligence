"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  CreditCard,
  Percent,
  IndianRupee,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import StatCard from "@/components/StatCard";

interface DashboardStats {
  totalRevenue: number;
  totalCustomers: number;
  totalTransactions: number;
  averageOrderValue: number;
  repeatPurchaseRate: number;
}

interface ChartsData {
  revenueTrend: Array<{ date: string; revenue: number; transactions: number }>;
  categoryDistribution: Array<{ name: string; value: number }>;
  topCustomers: Array<{ name: string; totalSpend: number; totalOrders: number; segment: string }>;
  paymentMethods: Array<{ name: string; value: number }>;
}

const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#10b981", "#06b6d4"];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [charts, setCharts] = useState<ChartsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, chartsRes] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/charts"),
      ]);

      if (!statsRes.ok || !chartsRes.ok) {
        throw new Error("Failed to load dashboard data");
      }

      const statsData = await statsRes.json();
      const chartsData = await chartsRes.json();

      setStats(statsData);
      setCharts(chartsData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header and Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-400">Welcome to your workspace. Here is your store's status today.</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-200 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Sync Data</span>
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm">
          Failed to fetch dashboard data. Please try again. Error: {error}
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Revenue"
          value={stats ? formatCurrency(stats.totalRevenue) : "₹0"}
          icon={IndianRupee}
          trend={{ value: 12.4, isPositive: true }}
          description="vs last month"
          isLoading={loading}
        />
        <StatCard
          title="Customers"
          value={stats ? stats.totalCustomers.toString() : "0"}
          icon={Users}
          trend={{ value: 4.8, isPositive: true }}
          description="vs last month"
          isLoading={loading}
        />
        <StatCard
          title="Transactions"
          value={stats ? stats.totalTransactions.toString() : "0"}
          icon={ShoppingBag}
          trend={{ value: 8.2, isPositive: true }}
          description="vs last month"
          isLoading={loading}
        />
        <StatCard
          title="Avg Order Value"
          value={stats ? formatCurrency(stats.averageOrderValue) : "₹0"}
          icon={CreditCard}
          trend={{ value: 3.1, isPositive: false }}
          description="vs last month"
          isLoading={loading}
        />
        <StatCard
          title="Repeat Purchase Rate"
          value={stats ? `${stats.repeatPurchaseRate}%` : "0%"}
          icon={Percent}
          trend={{ value: 1.2, isPositive: true }}
          description="vs last month"
          isLoading={loading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend Line Chart */}
        <div className="bg-neutral-900/20 border border-neutral-900 p-6 rounded-2xl flex flex-col gap-6 h-[400px]">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Revenue & Order Trend</h3>
            <span className="text-xs text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-800">
              Daily
            </span>
          </div>

          <div className="flex-1 w-full min-h-0">
            {loading ? (
              <div className="w-full h-full bg-neutral-950/40 animate-pulse rounded-xl" />
            ) : charts && charts.revenueTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.revenueTrend}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="date" stroke="#737373" fontSize={11} tickLine={false} />
                  <YAxis stroke="#737373" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#171717",
                      borderColor: "#262626",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue (₹)"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 1 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="transactions"
                    name="Orders"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-neutral-500">
                No revenue trend data available
              </div>
            )}
          </div>
        </div>

        {/* Category Sales Distribution Pie Chart */}
        <div className="bg-neutral-900/20 border border-neutral-900 p-6 rounded-2xl flex flex-col gap-6 h-[400px]">
          <h3 className="text-base font-semibold text-white">Revenue by Category</h3>

          <div className="flex-1 w-full min-h-0 flex items-center justify-center">
            {loading ? (
              <div className="w-full h-full bg-neutral-950/40 animate-pulse rounded-xl" />
            ) : charts && charts.categoryDistribution.length > 0 ? (
              <div className="w-full h-full flex flex-col sm:flex-row items-center justify-around gap-4">
                <div className="w-56 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={charts.categoryDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {charts.categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => formatCurrency(Number(value))}
                        contentStyle={{
                          backgroundColor: "#171717",
                          borderColor: "#262626",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-3">
                  {charts.categoryDistribution.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-3 text-xs">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-neutral-400 w-24 font-medium">{entry.name}</span>
                      <span className="text-white font-bold">{formatCurrency(entry.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-neutral-500">
                No category data available
              </div>
            )}
          </div>
        </div>

        {/* Top Customers Bar Chart */}
        <div className="bg-neutral-900/20 border border-neutral-900 p-6 rounded-2xl flex flex-col gap-6 h-[400px]">
          <h3 className="text-base font-semibold text-white">Top 5 Spending Customers</h3>

          <div className="flex-1 w-full min-h-0">
            {loading ? (
              <div className="w-full h-full bg-neutral-950/40 animate-pulse rounded-xl" />
            ) : charts && charts.topCustomers.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.topCustomers} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis type="number" stroke="#737373" fontSize={11} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#737373" fontSize={11} tickLine={false} width={100} />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(Number(value))}
                    contentStyle={{
                      backgroundColor: "#171717",
                      borderColor: "#262626",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="totalSpend" name="Total Spend" fill="#a855f7" radius={[0, 4, 4, 0]}>
                    {charts.topCustomers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "#6366f1" : "#a855f7"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-neutral-500">
                No top customer data available
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods Distribution Pie Chart */}
        <div className="bg-neutral-900/20 border border-neutral-900 p-6 rounded-2xl flex flex-col gap-6 h-[400px]">
          <h3 className="text-base font-semibold text-white">Payment Method Distribution</h3>

          <div className="flex-1 w-full min-h-0 flex items-center justify-center">
            {loading ? (
              <div className="w-full h-full bg-neutral-950/40 animate-pulse rounded-xl" />
            ) : charts && charts.paymentMethods.length > 0 ? (
              <div className="w-full h-full flex flex-col sm:flex-row items-center justify-around gap-4">
                <div className="w-56 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={charts.paymentMethods}
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {charts.paymentMethods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#171717",
                          borderColor: "#262626",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-3">
                  {charts.paymentMethods.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-3 text-xs">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: COLORS[(index + 2) % COLORS.length] }}
                      />
                      <span className="text-neutral-400 w-24 font-medium">{entry.name}</span>
                      <span className="text-white font-bold">{entry.value} Orders</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-neutral-500">
                No payment method data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
