'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Headset, MessageSquare, BarChart3, Settings, LogOut, Radio } from 'lucide-react';
import { getInitials } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { agent, logout, toggleOnlineStatus } = useAuth();

  const navItems = [
    { label: 'Live Support', href: '/support', icon: MessageSquare },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-16 md:w-20 bg-slate-950 border-r border-slate-800 flex flex-col items-center justify-between py-5 shrink-0 z-20">
      {/* Brand Icon */}
      <div className="flex flex-col items-center space-y-6">
        <Link href="/support" className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 hover:scale-105 transition-transform">
          <Headset className="w-5 h-5" />
        </Link>

        {/* Navigation Items */}
        <nav className="flex flex-col space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/support' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`p-3 rounded-xl transition-all relative group ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-slate-100 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-50">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Agent Avatar & Online Status Toggle */}
      <div className="flex flex-col items-center space-y-4">
        {agent && (
          <button
            onClick={toggleOnlineStatus}
            className={`p-2 rounded-xl border transition-all flex flex-col items-center group relative cursor-pointer ${
              agent.is_online
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={`Status: ${agent.is_online ? 'Online' : 'Offline'} (Click to toggle)`}
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-slate-100 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-50">
              {agent.is_online ? 'Status: Online' : 'Status: Offline'}
            </span>
          </button>
        )}

        <button
          onClick={logout}
          className="p-3 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors group relative cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
          <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-slate-100 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-50">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
};
