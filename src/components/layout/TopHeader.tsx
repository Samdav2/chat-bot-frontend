'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Headset, MessageSquare, BarChart3, Settings, LogOut, Radio, Menu, X } from 'lucide-react';
import { getInitials } from '@/lib/utils';

export const TopHeader: React.FC = () => {
  const pathname = usePathname();
  const { agent, logout, toggleOnlineStatus } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Live Support', href: '/support', icon: MessageSquare },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
        <div className="flex items-center space-x-3">
          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold tracking-wider uppercase text-slate-300 truncate">
              Support Desk
            </span>
          </div>
          <span className="text-slate-700 hidden xs:inline">|</span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
            Live Portal
          </span>
        </div>

        {agent && (
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-200">{agent.full_name}</p>
              <p className="text-[10px] text-slate-400">{agent.email}</p>
            </div>

            <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
              {getInitials(agent.full_name)}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Navigation Drawer Modal */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div
            className="fixed inset-0"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full bg-slate-950 border-r border-slate-800 p-5 flex flex-col justify-between z-10 animate-slideRight">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md">
                    <Headset className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-100">Navigation</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/support' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Footer Status & Logout */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              {agent && (
                <button
                  type="button"
                  onClick={toggleOnlineStatus}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all text-xs font-semibold ${
                    agent.is_online
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span>Status: {agent.is_online ? 'Online' : 'Offline'}</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold opacity-75">Toggle</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out Agent Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
