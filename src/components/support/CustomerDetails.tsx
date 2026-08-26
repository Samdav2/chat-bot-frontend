'use client';

import React, { useState } from 'react';
import { ConversationDetail } from '@/types/support';
import { User, MessageSquare, Send, Calendar, StickyNote, CheckCircle, Shield } from 'lucide-react';
import { formatDate, getInitials } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface CustomerDetailsProps {
  conversation: ConversationDetail | null;
}

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({ conversation }) => {
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>([]);

  if (!conversation) {
    return (
      <div className="w-72 xl:w-80 hidden lg:flex flex-col h-full bg-slate-900 border-l border-slate-800 p-6 text-center justify-center items-center">
        <p className="text-xs text-slate-500">Select a conversation to view customer details</p>
      </div>
    );
  }

  const user = conversation.user;
  const fullName =
    user?.first_name || user?.username
      ? `${user?.first_name || ''} ${user?.last_name || ''}`.trim()
      : `User #${user?.telegram_id || conversation.user_id}`;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    setSavedNotes((prev) => [note.trim(), ...prev]);
    setNote('');
  };

  return (
    <div className="w-72 xl:w-80 hidden lg:flex flex-col h-full bg-slate-900 border-l border-slate-800 overflow-y-auto p-5 space-y-6 shrink-0">
      {/* Customer Profile Card */}
      <div className="text-center space-y-3 pb-5 border-b border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/20 ring-4 ring-indigo-500/10">
          {getInitials(fullName)}
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-100">{fullName}</h3>
          {user?.username && (
            <p className="text-xs text-indigo-400 font-medium mt-0.5">@{user.username}</p>
          )}
        </div>
        <div className="flex justify-center">
          <Badge status={conversation.status} />
        </div>
      </div>

      {/* Account & Details Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-indigo-400" />
          Customer Information
        </h4>

        <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Telegram ID</span>
            <span className="font-mono text-slate-200 font-medium">
              {user?.telegram_id || 'N/A'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Created At</span>
            <span className="text-slate-200 font-medium">
              {formatDate(user?.created_at || conversation.created_at)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Channel</span>
            <span className="text-sky-400 font-medium flex items-center gap-1">
              <Send className="w-3 h-3" />
              Telegram Bot
            </span>
          </div>
        </div>
      </div>

      {/* Ticket Metrics */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
          Ticket Meta
        </h4>

        <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Total Messages</span>
            <span className="font-mono text-slate-200 font-medium">
              {conversation.messages?.length || 0}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Assigned Agent</span>
            <span className="text-slate-200 font-medium">
              {conversation.assigned_agent
                ? conversation.assigned_agent.full_name
                : conversation.assigned_agent_id
                ? `Agent #${conversation.assigned_agent_id}`
                : 'Unassigned'}
            </span>
          </div>
        </div>
      </div>

      {/* Internal Agent Notes */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <StickyNote className="w-3.5 h-3.5 text-indigo-400" />
          Internal Notes
        </h4>

        <form onSubmit={handleAddNote} className="space-y-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add internal note for ticket..."
            className="w-full bg-slate-950 text-slate-100 text-xs placeholder-slate-500 rounded-xl p-3 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none h-20"
          />
          <button
            type="submit"
            disabled={!note.trim()}
            className="w-full py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
          >
            Save Note
          </button>
        </form>

        {savedNotes.length > 0 && (
          <div className="space-y-2 pt-1">
            {savedNotes.map((n, i) => (
              <div key={i} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-[11px] text-slate-300">
                {n}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
