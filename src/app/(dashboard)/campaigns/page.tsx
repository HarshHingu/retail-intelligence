"use client";

import React, { useState, useEffect } from "react";
import {
  Send,
  Plus,
  History,
  Sparkles,
  RefreshCw,
  Crown,
  Heart,
  AlertTriangle,
  Users,
  Target,
  Gift,
  CheckCircle,
  MessageCircle,
  Bell,
  TrendingUp,
} from "lucide-react";

interface Campaign {
  _id: string;
  name: string;
  targetSegment: string;
  channel: string;
  offer: string;
  message: string;
  whatsappMessage?: string;
  pushMessage?: string;
  expectedImpact?: string;
  goal?: string;
  status: string;
  createdAt?: string;
}

const GOALS = [
  "Increase Revenue",
  "Win Back Customers",
  "Cross Sell",
  "Increase Repeat Purchases",
];

const SEGMENTS = ["VIP", "Loyal", "New", "AtRisk", "Dormant"];

export default function CampaignStudio() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [selectedSegment, setSelectedSegment] = useState("VIP");
  const [selectedGoal, setSelectedGoal] = useState("Increase Revenue");
  const [latestGenerated, setLatestGenerated] = useState<Campaign | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/campaigns");
      if (!res.ok) {
        throw new Error("Failed to load campaigns list");
      }
      const data = await res.json();
      setCampaigns(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setGenerating(true);
      setError(null);
      const res = await fetch("/api/campaigns/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetSegment: selectedSegment,
          goal: selectedGoal,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || "Failed to generate campaign");
      }

      const newCampaign = await res.json();
      setLatestGenerated(newCampaign);
      setCampaigns((prev) => [newCampaign, ...prev]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error generating campaign");
    } finally {
      setGenerating(false);
    }
  };

  const getSegmentIcon = (segment: string) => {
    switch (segment) {
      case "VIP":
        return <Crown className="w-4 h-4 text-indigo-400" />;
      case "Loyal":
        return <Heart className="w-4 h-4 text-purple-400" />;
      case "AtRisk":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Users className="w-4 h-4 text-neutral-400" />;
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Just now";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Description */}
      <div>
        <p className="text-sm text-neutral-400">
          Design hyper-targeted multi-channel marketing templates powered by Gemini customer intelligence.
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Main Studio split view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creator Panel (Left) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-neutral-900/30 border border-neutral-900 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              <span>Create Campaign</span>
            </h2>

            <form onSubmit={handleGenerate} className="space-y-6">
              {/* Target Segment */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase text-neutral-500 tracking-wider">
                  Target Customer Segment
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SEGMENTS.map((seg) => (
                    <button
                      key={seg}
                      type="button"
                      onClick={() => setSelectedSegment(seg)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        selectedSegment === seg
                          ? "bg-indigo-600/10 border-indigo-500 text-white"
                          : "bg-neutral-950/60 border-neutral-850 text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      {getSegmentIcon(seg)}
                      <span>{seg === "AtRisk" ? "At Risk" : seg}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase text-neutral-500 tracking-wider">
                  Campaign Objective / Goal
                </label>
                <div className="flex flex-col gap-2">
                  {GOALS.map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setSelectedGoal(goal)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                        selectedGoal === goal
                          ? "bg-purple-600/10 border-purple-500 text-white"
                          : "bg-neutral-950/60 border-neutral-850 text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Target className={`w-4 h-4 ${selectedGoal === goal ? "text-purple-400" : "text-neutral-500"}`} />
                        <span>{goal}</span>
                      </div>
                      {selectedGoal === goal && <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action button */}
              <button
                type="submit"
                disabled={generating}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-600/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Writing Copy via AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Campaign</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Output Panel & History (Right) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Latest Generated Output Card */}
          {latestGenerated && (
            <div className="bg-neutral-900/40 border-2 border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />

              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Newly Generated Draft
                  </span>
                  <h3 className="font-bold text-white text-lg mt-1">{latestGenerated.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-400 uppercase tracking-wide font-semibold">Goal</p>
                  <p className="text-xs text-indigo-400 font-bold">{latestGenerated.goal}</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Offer Details */}
                <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-850 flex items-center gap-3">
                  <div className="bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20 text-emerald-400">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Offer Incentive</h4>
                    <p className="text-sm font-bold text-white mt-0.5">{latestGenerated.offer}</p>
                  </div>
                </div>

                {/* Multi-channel messages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* WhatsApp copy */}
                  <div className="bg-neutral-950/40 border border-neutral-900 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Template</span>
                    </div>
                    <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-3 text-xs text-neutral-300 min-h-[100px] leading-relaxed whitespace-pre-line select-all">
                      {latestGenerated.whatsappMessage || latestGenerated.message}
                    </div>
                  </div>

                  {/* Push template */}
                  <div className="bg-neutral-950/40 border border-neutral-900 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold mb-1">
                      <Bell className="w-4 h-4" />
                      <span>Push Notification Template</span>
                    </div>
                    <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-3 text-xs text-neutral-300 min-h-[100px] leading-relaxed whitespace-pre-line select-all">
                      {latestGenerated.pushMessage || "No push template generated."}
                    </div>
                  </div>
                </div>

                {/* Expected Business Impact */}
                {latestGenerated.expectedImpact && (
                  <div className="bg-indigo-950/15 border border-indigo-950/50 p-4 rounded-xl flex gap-3 text-xs text-indigo-300 items-start">
                    <TrendingUp className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-indigo-400 block uppercase tracking-wider mb-0.5">Expected Impact</span>
                      <span>{latestGenerated.expectedImpact}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* History / Existing Campaigns Card */}
          <div className="bg-neutral-900/20 border border-neutral-900 rounded-3xl p-6 space-y-6">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-neutral-850 pb-4">
              <History className="w-5 h-5 text-neutral-400" />
              <span>Active & Past Campaigns</span>
            </h3>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 h-24" />
                ))}
              </div>
            ) : campaigns.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {campaigns.map((camp) => (
                  <div
                    key={camp._id}
                    className="bg-neutral-950/40 hover:bg-neutral-950/70 border border-neutral-900 hover:border-neutral-850 p-4 rounded-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {camp.targetSegment}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">{camp.status}</span>
                        </div>
                      </div>
                      <h4 className="font-bold text-white text-sm mt-1">{camp.name}</h4>
                      <p className="text-xs text-neutral-400 mt-1">
                        Offer: <span className="text-neutral-200 font-medium">{camp.offer}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-1">
                      <span className="text-[10px] text-neutral-500">{formatDate(camp.createdAt)}</span>
                      <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-900/60 border border-neutral-850 px-2 py-0.5 rounded-md">
                        {camp.channel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm text-neutral-500 py-8">
                No campaigns have been generated or saved yet. Use the tool on the left to start!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
