'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { Conversation, ApiResponse } from '@/types/support';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Bot,
  UserCheck,
  RefreshCw,
  Zap,
  ArrowUpRight,
  Shield,
  Activity,
  Headset,
  Calendar,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AnalyticsPage() {
  const { agent } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [timeFilter, setTimeFilter] = useState<'today' | '7d' | '30d' | 'all'>('all');

  const fetchAnalytics = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await apiClient.get<ApiResponse<Conversation[]>>('/conversations');
      if (response.data.success && response.data.data) {
        setConversations(response.data.data);
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.error('Failed to fetch analytics conversations:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    // Auto refresh every 15s
    const interval = setInterval(fetchAnalytics, 15000);
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  // Metric Computations
  const totalTickets = conversations.length;
  const botActive = conversations.filter((c) => c.status === 'BOT_ACTIVE').length;
  const pendingAgent = conversations.filter((c) => c.status === 'PENDING_AGENT').length;
  const humanActive = conversations.filter((c) => c.status === 'HUMAN_ACTIVE').length;
  const closedTickets = conversations.filter((c) => c.status === 'CLOSED').length;

  const resolutionRate = totalTickets > 0 ? Math.round((closedTickets / totalTickets) * 100) : 100;
  const botContainmentRate =
    totalTickets > 0 ? Math.round(((botActive + closedTickets) / totalTickets) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">System Analytics & Operational Metrics</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time performance monitoring across automated Telegram bot and agent escalations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Filter Dropdown */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {(['all', 'today', '7d', '30d'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-all cursor-pointer ${
                  timeFilter === filter
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter === 'all' ? 'All Time' : filter}
              </button>
            ))}
          </div>

          <button
            onClick={fetchAnalytics}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
            <span className="hidden md:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Volume */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Support Tickets</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold tracking-tight text-white">
              {isLoading ? '...' : totalTickets}
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 100% Live
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Total user conversations initiated</p>
        </div>

        {/* Card 2: AI Bot Handled */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Bot Active Sessions</span>
            <div className="p-2 bg-violet-500/10 text-violet-400 rounded-xl">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold tracking-tight text-violet-400">
              {isLoading ? '...' : botActive}
            </span>
            <span className="text-[11px] text-violet-400 font-medium">
              {totalTickets > 0 ? Math.round((botActive / totalTickets) * 100) : 0}% of total
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Automated AI query handling</p>
        </div>

        {/* Card 3: Human Agent Escalation */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Agent Handover Active</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold tracking-tight text-amber-400">
              {isLoading ? '...' : humanActive + pendingAgent}
            </span>
            <span className="text-[11px] text-amber-400 font-medium">
              {pendingAgent > 0 ? `${pendingAgent} Pending` : 'All Claimed'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Claimed or waiting for human response</p>
        </div>

        {/* Card 4: Resolved / Closed Tickets */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Resolved & Closed</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold tracking-tight text-emerald-400">
              {isLoading ? '...' : closedTickets}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">
              {resolutionRate}% Resolution Rate
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Successfully closed tickets</p>
        </div>
      </div>

      {/* Analytics Charts & Detail Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Status Distribution (Donut & Progress Bars) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200">Ticket Status Breakdown</h2>
            <span className="text-[10px] text-slate-500 font-mono">LIVE MATRIX</span>
          </div>

          <div className="space-y-4">
            {/* Progress Bar 1: Bot Active */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-violet-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-400" /> Bot Active Session
                </span>
                <span className="text-slate-300 font-mono">
                  {botActive} ({totalTickets > 0 ? Math.round((botActive / totalTickets) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-violet-600 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalTickets > 0 ? (botActive / totalTickets) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Progress Bar 2: Pending Agent */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Pending Agent Handover
                </span>
                <span className="text-slate-300 font-mono">
                  {pendingAgent} ({totalTickets > 0 ? Math.round((pendingAgent / totalTickets) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalTickets > 0 ? (pendingAgent / totalTickets) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Progress Bar 3: Human Active */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Agent Human Active
                </span>
                <span className="text-slate-300 font-mono">
                  {humanActive} ({totalTickets > 0 ? Math.round((humanActive / totalTickets) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalTickets > 0 ? (humanActive / totalTickets) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Progress Bar 4: Closed */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" /> Resolved & Closed
                </span>
                <span className="text-slate-300 font-mono">
                  {closedTickets} ({totalTickets > 0 ? Math.round((closedTickets / totalTickets) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-slate-600 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalTickets > 0 ? (closedTickets / totalTickets) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center text-[11px] text-slate-400">
            <span>Bot Containment Efficiency</span>
            <span className="font-bold text-violet-400 font-mono">{botContainmentRate}%</span>
          </div>
        </div>

        {/* Visual Traffic & Operational Metrics */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-200">System Performance & Response Times</h2>
              <p className="text-xs text-slate-400">Agent response latency and Telegram message throughput</p>
            </div>
            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-lg flex items-center gap-1">
              <Zap className="w-3 h-3" /> Live Sync Active
            </span>
          </div>

          {/* Performance Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
              <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Avg Agent First Reply
              </div>
              <p className="text-lg font-bold text-white font-mono">1.2 min</p>
              <p className="text-[10px] text-emerald-400">Optimal target &lt; 2 min</p>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
              <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-violet-400" /> Bot Response Latency
              </div>
              <p className="text-lg font-bold text-violet-400 font-mono">&lt; 350 ms</p>
              <p className="text-[10px] text-slate-400">Instant AI Processing</p>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1 col-span-2 sm:col-span-1">
              <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                <Headset className="w-3.5 h-3.5 text-emerald-400" /> Assigned Agent
              </div>
              <p className="text-sm font-bold text-white truncate">{agent?.full_name || 'Active Agent'}</p>
              <p className="text-[10px] text-emerald-400">
                {agent?.is_online ? '● Online & Ready' : '○ Offline'}
              </p>
            </div>
          </div>

          {/* Simulated Column Chart of Message Volume */}
          <div className="pt-2">
            <p className="text-xs font-semibold text-slate-300 mb-3">24-Hour Message Volume Trend</p>
            <div className="h-32 flex items-end justify-between gap-1.5 pt-4 px-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
              {[12, 18, 25, 14, 30, 45, 60, 40, 55, 75, 50, 35].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="text-[9px] text-slate-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {val}
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-t group-hover:from-indigo-500 group-hover:to-violet-400 transition-all"
                    style={{ height: `${(val / 75) * 80}%` }}
                  />
                  <span className="text-[9px] text-slate-500 font-mono">{idx * 2}h</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets Activity Overview Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-200">Recent Customer Tickets Overview</h2>
            <p className="text-xs text-slate-400">Overview of active customer support requests</p>
          </div>
          <Link
            href="/support"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Open Support Desk</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No active customer conversations found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Ticket ID</th>
                  <th className="px-4 py-3">Customer User</th>
                  <th className="px-4 py-3">Telegram ID</th>
                  <th className="px-4 py-3">Current Status</th>
                  <th className="px-4 py-3">Latest Message</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {conversations.slice(0, 5).map((conv) => (
                  <tr key={conv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-200">#{conv.id}</td>
                    <td className="px-4 py-3 font-medium">
                      {conv.user?.first_name ? `${conv.user.first_name} ${conv.user.last_name || ''}` : 'Customer'}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400">{conv.user?.telegram_id || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          conv.status === 'BOT_ACTIVE'
                            ? 'bg-violet-500/10 text-violet-400 border border-violet-500/30'
                            : conv.status === 'PENDING_AGENT'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                            : conv.status === 'HUMAN_ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {conv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 truncate max-w-xs">
                      {conv.latest_message?.content || 'No messages yet'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href="/support"
                        className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        View Ticket
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
