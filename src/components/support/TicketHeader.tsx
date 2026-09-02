'use client';

import React from 'react';
import { ConversationDetail } from '@/types/support';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { UserCheck, CheckCircle2, ArrowLeft, Info } from 'lucide-react';
import { getInitials } from '@/lib/utils';

interface TicketHeaderProps {
  conversation: ConversationDetail;
  currentAgentId: number;
  isConnected: boolean;
  onClaim: () => void;
  onClose: () => void;
  onBackToList?: () => void;
  onToggleDetails?: () => void;
  isLoading: boolean;
}

export const TicketHeader: React.FC<TicketHeaderProps> = ({
  conversation,
  currentAgentId,
  isConnected,
  onClaim,
  onClose,
  onBackToList,
  onToggleDetails,
  isLoading,
}) => {
  const isAssignedToMe = conversation.assigned_agent_id === currentAgentId;
  const customerName =
    conversation.user?.first_name ||
    conversation.user?.username ||
    `Customer #${conversation.user?.telegram_id || conversation.user_id}`;

  return (
    <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md shrink-0">
      <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
        {/* Mobile Back to Ticket List Button */}
        {onBackToList && (
          <button
            type="button"
            onClick={onBackToList}
            className="md:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0 cursor-pointer"
            title="Back to Tickets"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md ring-2 ring-indigo-500/20 shrink-0">
          {getInitials(customerName)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <h2 className="text-sm sm:text-base font-semibold text-slate-100 truncate">{customerName}</h2>
            {conversation.user?.username && (
              <span className="hidden sm:inline text-xs text-slate-400 font-normal">
                (@{conversation.user.username})
              </span>
            )}
            <Badge status={conversation.status} />
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
            <span>#{conversation.id}</span>
            <span>•</span>
            <span className="hidden xs:inline">TG: {conversation.user?.telegram_id || 'N/A'}</span>
            <span className="hidden xs:inline">•</span>
            <div className="flex items-center space-x-1">
              {isConnected ? (
                <>
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-400 font-mono text-[10px] sm:text-[11px]">Live</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500" />
                  <span className="text-amber-400 font-mono text-[10px] sm:text-[11px]">Offline</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {onToggleDetails && (
          <button
            type="button"
            onClick={onToggleDetails}
            className="xl:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Toggle Customer Info"
          >
            <Info className="w-4 h-4" />
          </button>
        )}

        {conversation.status === 'BOT_ACTIVE' && (
          <>
            <Button
              onClick={onClaim}
              isLoading={isLoading}
              variant="primary"
              size="sm"
              className="shadow-indigo-600/30 text-xs px-2.5 sm:px-3 py-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden xs:inline">Take Over</span>
            </Button>
            <Button
              onClick={onClose}
              isLoading={isLoading}
              variant="danger"
              size="sm"
              className="text-xs px-2.5 sm:px-3 py-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Close</span>
            </Button>
          </>
        )}

        {conversation.status === 'PENDING_AGENT' && (
          <>
            <Button
              onClick={onClaim}
              isLoading={isLoading}
              variant="primary"
              size="sm"
              className="shadow-indigo-600/30 text-xs px-2.5 sm:px-3 py-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              Claim
            </Button>
            <Button
              onClick={onClose}
              isLoading={isLoading}
              variant="danger"
              size="sm"
              className="text-xs px-2.5 sm:px-3 py-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Close</span>
            </Button>
          </>
        )}

        {conversation.status === 'HUMAN_ACTIVE' && (
          <>
            <span className="hidden md:inline-flex text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              {isAssignedToMe ? 'Assigned' : `Agent #${conversation.assigned_agent_id}`}
            </span>
            <Button
              onClick={onClose}
              isLoading={isLoading}
              variant="danger"
              size="sm"
              className="text-xs px-2.5 sm:px-3 py-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              <span>Close</span>
            </Button>
          </>
        )}

        {conversation.status === 'CLOSED' && (
          <span className="text-[11px] sm:text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500" />
            <span>Closed</span>
          </span>
        )}
      </div>
    </div>
  );
};
