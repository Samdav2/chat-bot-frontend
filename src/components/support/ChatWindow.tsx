'use client';

import React, { useEffect, useRef } from 'react';
import { ConversationDetail } from '@/types/support';
import { MessageBubble } from './MessageBubble';
import { TicketHeader } from './TicketHeader';
import { MessageInput } from './MessageInput';
import { MessageSquare, ShieldCheck, Loader2 } from 'lucide-react';

interface ChatWindowProps {
  conversation: ConversationDetail | null;
  currentAgentId: number;
  isConnected: boolean;
  isLoading: boolean;
  onClaimTicket: (id: number) => void;
  onCloseTicket: (id: number) => void;
  onSendMessage: (text: string) => Promise<boolean>;
  isActionLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  currentAgentId,
  isConnected,
  isLoading,
  onClaimTicket,
  onCloseTicket,
  onSendMessage,
  isActionLoading,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on message updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  if (!conversation && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/20 shadow-inner">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-semibold text-slate-200">No Ticket Selected</h2>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          Select a customer ticket from the left queue sidebar to view the live message transcript and claim support requests.
        </p>
      </div>
    );
  }

  if (isLoading && !conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 p-8">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
        <p className="text-xs text-slate-400">Loading chat history...</p>
      </div>
    );
  }

  if (!conversation) return null;

  const isAssignedToCurrentAgent = conversation.assigned_agent_id === currentAgentId;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden relative">
      {/* Ticket Header Bar */}
      <TicketHeader
        conversation={conversation}
        currentAgentId={currentAgentId}
        isConnected={isConnected}
        onClaim={() => onClaimTicket(conversation.id)}
        onClose={() => onCloseTicket(conversation.id)}
        isLoading={isActionLoading}
      />

      {/* Messages Scroll Viewport */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2 no-scrollbar">
        {/* System Welcome Banner */}
        <div className="my-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center max-w-md mx-auto">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            End-to-End Hybrid Support Session Encrypted
          </p>
        </div>

        {conversation.messages.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No messages recorded in this conversation ticket yet.
          </div>
        ) : (
          conversation.messages.map((msg) => (
            <MessageBubble
              key={msg.id || `${msg.created_at}-${msg.sender_id}`}
              message={msg}
              currentAgentId={currentAgentId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Interactive Message Input Box */}
      <MessageInput
        onSendMessage={onSendMessage}
        onClaimTicket={() => onClaimTicket(conversation.id)}
        status={conversation.status}
        isAssignedToCurrentAgent={isAssignedToCurrentAgent}
      />
    </div>
  );
};
