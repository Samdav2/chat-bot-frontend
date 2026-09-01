'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ShieldCheck, User } from 'lucide-react';
import { getInitials } from '@/lib/utils';

export const TopHeader: React.FC = () => {
  const { agent } = useAuth();

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-10">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold tracking-wider uppercase text-slate-300">
            Support Agent Desk
          </span>
        </div>
        <span className="text-slate-700">|</span>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
          Live Customer Support Portal
        </span>
      </div>

      {agent && (
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-200">{agent.full_name}</p>
            <p className="text-[10px] text-slate-400">{agent.email}</p>
          </div>

          <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-xs font-bold">
            {getInitials(agent.full_name)}
          </div>
        </div>
      )}
    </header>
  );
};
