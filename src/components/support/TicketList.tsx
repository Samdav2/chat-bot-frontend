'use client';

import React from 'react';
import { Conversation, TicketFilterType } from '@/types/support';
import { Badge } from '@/components/ui/Badge';
import { Search, Inbox, Filter } from 'lucide-react';
import { getInitials, formatDate } from '@/lib/utils';

interface TicketListProps {
  conversations: Conversation[];
  activeTicketId: number | null;
  activeFilter: TicketFilterType;
  searchQuery: string;
  isLoading: boolean;
  onSelectTicket: (id: number) => void;
  onFilterChange: (filter: TicketFilterType) => void;
  onSearchChange: (query: string) => void;
}

const FILTER_TABS: { key: TicketFilterType; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING_AGENT', label: 'Pending' },
  { key: 'HUMAN_ACTIVE', label: 'Active' },
  { key: 'BOT_ACTIVE', label: 'Bot' },
  { key: 'CLOSED', label: 'Closed' },
];

export const TicketList: React.FC<TicketListProps> = ({
  conversations,
  activeTicketId,
  activeFilter,
  searchQuery,
  isLoading,
  onSelectTicket,
  onFilterChange,
  onSearchChange,
}) => {
  return (
    <div className="w-full md:w-80 lg:w-96 flex flex-col h-full bg-slate-900 border-r border-slate-800 shrink-0">
      {/* Search & Header */}
      <div className="p-4 border-b border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-indigo-400" />
            Support Queue
          </h1>
          <span className="text-xs bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded-full border border-slate-700">
            {conversations.length} {conversations.length === 1 ? 'ticket' : 'tickets'}
          </span>
        </div>

        {/* Search Box */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tickets, handles, IDs..."
            className="w-full bg-slate-950 text-slate-100 text-xs placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar pt-1">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onFilterChange(tab.key)}
                className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ticket List Body */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-850">
        {isLoading && conversations.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading support queue...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Filter className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs font-medium text-slate-400">No tickets found</p>
            <p className="text-[11px] text-slate-500">Try adjusting your filter or search query</p>
          </div>
        ) : (
          conversations.map((conv) => {
            const isSelected = activeTicketId === conv.id;
            const customerName =
              conv.user?.first_name ||
              conv.user?.username ||
              `Customer #${conv.user?.telegram_id || conv.user_id}`;
            const latestText = conv.latest_message?.content || 'No messages yet';

            return (
              <div
                key={conv.id}
                onClick={() => onSelectTicket(conv.id)}
                className={`p-3.5 flex items-start space-x-3 cursor-pointer transition-all hover:bg-slate-850 ${
                  isSelected
                    ? 'bg-indigo-600/10 border-l-4 border-indigo-500'
                    : 'bg-transparent'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {getInitials(customerName)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs font-semibold text-slate-200 truncate">
                      {customerName}
                    </h3>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {formatDate(conv.updated_at || conv.created_at)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 truncate mt-0.5 font-normal">
                    {latestText}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <Badge status={conv.status} showDot={true} />
                    <span className="text-[10px] text-slate-400 font-mono">#{conv.id}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
