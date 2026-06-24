"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Calendar,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

interface Insight {
  _id: string;
  summary: string;
  recommendations: string[];
  churnRiskCustomers: number;
  generatedAt: string;
}

export default function InsightsPage() {
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestInsight();
  }, []);

  const fetchLatestInsight = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/insights");
      if (!res.ok) {
        throw new Error("Failed to load cached insights");
      }
      const data = await res.json();
      setInsight(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Could not retrieve cached insights.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError(null);
      const res = await fetch("/api/insights/generate", {
        method: "POST",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || "Failed to generate new insights");
      }
      const data = await res.json();
      setInsight(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error generating insights");
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-400">
            AI-driven strategic planning built on your consolidated transaction metrics.
          </p>
        </div>
        {insight && (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-600/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
            <span>{generating ? "Regenerating..." : "Generate Fresh Insights"}</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-6 animate-pulse">
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 h-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 h-36" />
            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 h-36 col-span-2" />
          </div>
        </div>
      ) : insight ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Main Section (Summary & Churn Warning) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Executive Summary Card */}
            <div className="bg-neutral-900/30 border border-neutral-900 rounded-3xl p-6 lg:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase mb-4">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Executive Summary</span>
              </div>

              <h2 className="text-xl lg:text-2xl font-bold text-white mb-4 leading-snug">
                Operational Highlights & Executive Assessment
              </h2>

              <p className="text-neutral-300 leading-relaxed text-sm md:text-base whitespace-pre-line">
                {insight.summary}
              </p>

              <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-8 pt-6 border-t border-neutral-850">
                <Calendar className="w-3.5 h-3.5" />
                <span>Last updated: {formatDate(insight.generatedAt)}</span>
              </div>
            </div>

            {/* Churn Alert Card */}
            <div className="bg-neutral-900/20 border border-neutral-900 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-amber-400 shrink-0">
                  <ShieldAlert className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">At Risk Customer Segments</h3>
                  <p className="text-neutral-400 text-sm mt-0.5">
                    We detected <span className="text-amber-400 font-bold">{insight.churnRiskCustomers}</span> customers who are currently in the At Risk category.
                  </p>
                </div>
              </div>
              <Link
                href="/customers"
                className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors whitespace-nowrap"
              >
                <span>View Churn Risk List</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Section (Recommendations List) */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900/30 border border-neutral-900 rounded-3xl p-6 space-y-6 h-full flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="bg-purple-500/10 p-2 rounded-lg border border-purple-500/20 text-purple-400">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-lg">AI Recommendations</h3>
                </div>

                <div className="space-y-4">
                  {insight.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="bg-neutral-950/60 border border-neutral-900/80 p-4 rounded-xl flex gap-3 text-sm leading-relaxed"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-neutral-300">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-900 text-xs text-neutral-500">
                Recommendations are derived from high-level transaction aggregation and are updated in real-time.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-neutral-900/20 border border-neutral-900 rounded-3xl p-12 text-center max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-indigo-950/30 text-indigo-400 flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No AI Growth Insights Generated Yet</h2>
          <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
            Generate executive-level summaries, churn risk predictions, and cross-sell opportunities based on your store's transaction metadata.
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer hover:scale-105"
          >
            <RefreshCw className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
            <span>{generating ? "Generating Strategic Insights..." : "Generate Strategic Insights"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
