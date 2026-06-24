import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  isLoading = false,
}: StatCardProps) {
  if (isLoading) {
    return (
      <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 flex flex-col gap-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-neutral-800 rounded" />
          <div className="h-10 w-10 bg-neutral-800 rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="h-8 w-32 bg-neutral-800 rounded" />
          <div className="h-3 w-40 bg-neutral-800 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-neutral-900/40 hover:bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors duration-300" />

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-neutral-400 group-hover:text-neutral-300 transition-colors">
          {title}
        </span>
        <div className="bg-neutral-800/50 p-2.5 rounded-xl border border-neutral-800 group-hover:border-neutral-700 text-indigo-400 transition-all duration-300">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">{value}</h3>

        {(description || trend) && (
          <div className="flex items-center gap-1.5 mt-2">
            {trend && (
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  trend.isPositive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}
              >
                {trend.isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                {trend.value}%
              </span>
            )}
            {description && <span className="text-xs text-neutral-500">{description}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
