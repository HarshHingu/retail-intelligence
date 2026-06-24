import Link from "next/link";
import { ArrowRight, Bot, Brain, Layers, ShieldAlert, Sparkles, Users, Zap } from "lucide-react";

export const metadata = {
  title: "RetailGPT - AI Growth Copilot for Retailers",
  description:
    "Transform your retail transaction data into actionable customer insights, churn predictions, and growth recommendations with RetailGPT.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-indigo-950/20 via-purple-950/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header / Navbar */}
      <header className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <Brain className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              RetailGPT
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#why-us" className="hover:text-white transition-colors">Why RetailGPT</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-neutral-300 hover:text-white transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-xs sm:text-sm font-medium rounded-full group bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-indigo-800"
            >
              <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-neutral-950 rounded-full group-hover:bg-opacity-0">
                Launch App
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/20 text-indigo-400 text-xs font-semibold mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Introducing RetailGPT 1.0</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1] mb-6">
          Turn Retail Data Into{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Growth Opportunities
          </span>{" "}
          With AI
        </h1>

        <p className="text-neutral-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
          RetailGPT transforms transaction data into customer insights, churn predictions, and growth recommendations. Empowering store owners with enterprise-grade intelligence.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 py-4 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <span>View Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/copilot"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 hover:text-white font-medium px-8 py-4 rounded-xl transition-all hover:scale-105"
          >
            <Bot className="w-5 h-5 text-indigo-400" />
            <span>Open AI Copilot</span>
          </Link>
        </div>

        {/* Dashboard Preview Graphic */}
        <div className="relative mx-auto max-w-5xl rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-4 backdrop-blur-sm shadow-2xl shadow-indigo-900/10">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-2xl pointer-events-none" />
          <div className="border border-neutral-800 bg-neutral-950 rounded-xl overflow-hidden shadow-inner aspect-[16/9] flex flex-col">
            {/* Window bar */}
            <div className="bg-neutral-900/60 px-4 py-3 border-b border-neutral-800/60 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <div className="h-4 w-40 bg-neutral-800/60 rounded-md mx-auto" />
            </div>
            {/* Visual representation of dashboard */}
            <div className="flex-1 p-6 grid grid-cols-3 gap-4 text-left">
              <div className="col-span-3 grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-neutral-900/50 border border-neutral-800/50 p-4 rounded-lg flex flex-col gap-2">
                    <div className="w-16 h-3 bg-neutral-800 rounded" />
                    <div className="w-24 h-6 bg-neutral-700 rounded" />
                  </div>
                ))}
              </div>
              <div className="col-span-2 bg-neutral-900/50 border border-neutral-800/50 p-4 rounded-lg flex flex-col gap-4">
                <div className="w-32 h-4 bg-neutral-800 rounded" />
                <div className="flex-1 bg-neutral-950/50 border border-neutral-900 rounded p-2 flex items-end justify-between gap-2">
                  <div className="w-[10%] h-[30%] bg-indigo-500/40 rounded-t" />
                  <div className="w-[10%] h-[50%] bg-indigo-500/60 rounded-t" />
                  <div className="w-[10%] h-[40%] bg-indigo-500/50 rounded-t" />
                  <div className="w-[10%] h-[75%] bg-indigo-500/80 rounded-t" />
                  <div className="w-[10%] h-[60%] bg-indigo-500/70 rounded-t" />
                  <div className="w-[10%] h-[90%] bg-indigo-500 rounded-t" />
                </div>
              </div>
              <div className="col-span-1 bg-neutral-900/50 border border-neutral-800/50 p-4 rounded-lg flex flex-col gap-4">
                <div className="w-32 h-4 bg-neutral-800 rounded" />
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-4 border-purple-500/60 border-t-purple-400 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-neutral-950 flex items-center justify-center text-[10px] text-neutral-400">
                      72% Sales
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-neutral-900 bg-neutral-950/60 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Designed For High-Performance Retailers
            </h2>
            <p className="text-neutral-400">
              Stop guessing. Start growing. Leverage generative AI and deep data models built specifically for commerce analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="group bg-neutral-900/40 hover:bg-neutral-900/80 border border-neutral-800 hover:border-indigo-500/30 p-6 rounded-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-indigo-950/30 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Customer Intelligence</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Automatically segment customers into VIP, Loyal, New, At Risk, and Dormant. Track their spend, orders, and preferred categories in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-neutral-900/40 hover:bg-neutral-900/80 border border-neutral-800 hover:border-purple-500/30 p-6 rounded-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-950/30 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Churn Detection</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Identify inactive buyers before they churn. Predict customer lifetime value (LTV) drop-offs using automated purchase frequency models.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-neutral-900/40 hover:bg-neutral-900/80 border border-neutral-800 hover:border-pink-500/30 p-6 rounded-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-pink-950/30 text-pink-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Campaign Generator</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Generate personalized WhatsApp and push notifications based on specific customer segment traits and store goals.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-neutral-900/40 hover:bg-neutral-900/80 border border-neutral-800 hover:border-emerald-500/30 p-6 rounded-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/30 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Copilot</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Chat with your retail strategist. Ask questions about revenue trends, best-selling products, churn rates, and growth recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-500" />
            <span className="text-lg font-bold text-white tracking-tight">RetailGPT</span>
          </div>
          <p className="text-neutral-500 text-xs">
            &copy; {new Date().getFullYear()} RetailGPT Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-neutral-400">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
