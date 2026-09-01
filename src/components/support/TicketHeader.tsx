import React from 'react';
import { ConversationDetail } from '@/types/support';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { UserCheck, CheckCircle2, Wifi, WifiOff, ShieldAlert } from 'lucide-react';
import { getInitials } from '@/lib/utils';

interface TicketHeaderProps {
  conversation: ConversationDetail;
  currentAgentId: number;
  isConnected: boolean;
  onClaim: () => void;
  onClose: () => void;
  isLoading: boolean;
}

export const TicketHeader: React.FC<TicketHeaderProps> = ({
  conversation,
  currentAgentId,
  isConnected,
  onClaim,
  onClose,
  isLoading,
}) => {
  const isAssignedToMe = conversation.assigned_agent_id === currentAgentId;
  const customerName =
    conversation.user?.first_name ||
    conversation.user?.username ||
    `Customer #${conversation.user?.telegram_id || conversation.user_id}`;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-indigo-500/20">
          {getInitials(customerName)}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-100">{customerName}</h2>
            {conversation.user?.username && (
              <span className="text-xs text-slate-400 font-normal">
                (@{conversation.user.username})
              </span>
            )}
            <Badge status={conversation.status} />
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
            <span>Ticket #{conversation.id}</span>
            <span>•</span>
            <span>Telegram ID: {conversation.user?.telegram_id || 'N/A'}</span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              {isConnected ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-400 font-mono text-[11px]">Live Sync</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-amber-400 font-mono text-[11px]">Disconnected</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {conversation.status === 'BOT_ACTIVE' && (
          <>
            <Button
              onClick={onClaim}
              isLoading={isLoading}
              variant="primary"
              size="sm"
              className="shadow-indigo-600/30"
            >
              <UserCheck className="w-4 h-4 mr-1.5" />
              Take Over Chat
            </Button>
            <Button
              onClick={onClose}
              isLoading={isLoading}
              variant="danger"
              size="sm"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Resolve & Close
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
              className="shadow-indigo-600/30"
            >
              <UserCheck className="w-4 h-4 mr-1.5" />
              Claim Ticket
            </Button>
            <Button
              onClick={onClose}
              isLoading={isLoading}
              variant="danger"
              size="sm"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Resolve & Close
            </Button>
          </>
        )}

        {conversation.status === 'HUMAN_ACTIVE' && (
          <>
            <span className="hidden sm:inline-flex text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              {isAssignedToMe ? 'Assigned to You' : `Agent ID: ${conversation.assigned_agent_id}`}
            </span>
            <Button
              onClick={onClose}
              isLoading={isLoading}
              variant="danger"
              size="sm"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Resolve & Close Ticket
            </Button>
          </>
        )}

        {conversation.status === 'CLOSED' && (
          <span className="text-xs px-3 py-1.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
            Ticket Resolved
          </span>
        )}
      </div>
    </div>
  );
};
