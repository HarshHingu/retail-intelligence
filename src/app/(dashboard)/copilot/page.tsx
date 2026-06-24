"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Brain, AlertCircle, Sparkles, MessageSquare, Terminal } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  "Who are my top customers?",
  "Suggest a promotional campaign.",
  "Which customer categories drive the most revenue?",
  "What is my current repeat purchase rate, and how do I improve it?",
  "Recommend actions to win back at-risk segments.",
];

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I am RetailGPT, your strategic AI growth copilot. I can analyze your sales figures, customers segments, and performance trends to recommend high-impact campaigns. Ask me anything about your retail operations!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const chatHistory = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!res.ok) {
        throw new Error("Failed to reach RetailGPT server. Please check configurations.");
      }

      const reply = await res.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: reply.content,
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] min-h-[500px]">
      {/* Suggestions Column (Left) */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
        <div className="bg-neutral-900/30 border border-neutral-900 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs tracking-wider uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Suggested Prompts</span>
          </div>
          <p className="text-xs text-neutral-400">
            Click any prompt below to ask RetailGPT directly about your store metrics.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                className="text-left text-xs bg-neutral-950/60 hover:bg-indigo-600/10 border border-neutral-850 hover:border-indigo-500/20 text-neutral-300 hover:text-indigo-300 p-3 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900/10 border border-neutral-900 rounded-2xl p-5 hidden lg:block text-xs space-y-2 text-neutral-500">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-400 mb-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>Data Security</span>
          </div>
          <p>
            RetailGPT operates only on anonymous aggregated totals (category distributions, segment counts, order counts). Your raw customer details are never sent to external servers.
          </p>
        </div>
      </div>

      {/* Main Chat Interface (Right) */}
      <div className="flex-1 bg-neutral-900/30 border border-neutral-900 rounded-3xl flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        {/* Messages Container */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((message) => {
            const isAI = message.role === "assistant";
            return (
              <div
                key={message.id}
                className={`flex gap-4 max-w-3xl ${isAI ? "" : "ml-auto flex-row-reverse"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm ${
                    isAI
                      ? "bg-gradient-to-tr from-indigo-500 to-purple-500 text-white"
                      : "bg-neutral-800 text-neutral-200 border border-neutral-700"
                  }`}
                >
                  {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isAI
                      ? "bg-neutral-950/60 border border-neutral-900 text-neutral-200 shadow-sm"
                      : "bg-indigo-600/15 border border-indigo-500/20 text-white"
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-4 max-w-3xl">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shrink-0 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-neutral-950/60 border border-neutral-900 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-neutral-600 animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 rounded-full bg-neutral-600 animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 rounded-full bg-neutral-600 animate-bounce" />
              </div>
            </div>
          )}

          {error && (
            <div className="flex gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm max-w-lg mx-auto">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-neutral-950/80 border-t border-neutral-900/80 flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={loading ? "RetailGPT is formulating strategy..." : "Ask RetailGPT..."}
            disabled={loading}
            className="flex-1 bg-neutral-900/60 border border-neutral-850 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-900 border border-transparent disabled:border-neutral-800 text-white disabled:text-neutral-500 p-3 rounded-xl shadow-md transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
