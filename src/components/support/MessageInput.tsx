'use client';

import React, { useState } from 'react';
import { Send, Zap, Lock, UserCheck, Bot } from 'lucide-react';
import { QuickResponses } from '@/components/ui/QuickResponses';
import { ConversationStatus } from '@/types/support';

interface MessageInputProps {
  onSendMessage: (text: string) => Promise<boolean>;
  onClaimTicket?: () => void;
  status: ConversationStatus;
  isAssignedToCurrentAgent: boolean;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onClaimTicket,
  status,
  isAssignedToCurrentAgent,
  disabled = false,
}) => {
  const [content, setContent] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isClosed = status === 'CLOSED';
  const isPending = status === 'PENDING_AGENT';
  const isBotActive = status === 'BOT_ACTIVE';
  const isLocked = isClosed || (status === 'HUMAN_ACTIVE' && !isAssignedToCurrentAgent);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting || disabled || isLocked || isPending) return;

    setIsSubmitting(true);
    const success = await onSendMessage(content.trim());
    if (success) {
      setContent('');
      setShowTemplates(false);
    }
    setIsSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSelectTemplate = (template: string) => {
    setContent(template);
    setShowTemplates(false);
  };

  if (isPending) {
    return (
      <div className="p-4 bg-slate-900 border-t border-slate-800 text-center">
        <div className="flex flex-col items-center justify-center space-y-2 py-2">
          <p className="text-sm text-amber-300 font-medium flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            This ticket is waiting to be claimed by a support agent.
          </p>
          {onClaimTicket && (
            <button
              onClick={onClaimTicket}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md transition-colors cursor-pointer"
            >
              <UserCheck className="w-4 h-4 mr-1.5" />
              Claim Ticket to Reply
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isClosed) {
    return (
      <div className="p-4 bg-slate-900 border-t border-slate-800 text-center">
        <p className="text-sm text-slate-400 font-medium flex items-center justify-center gap-2">
          <Lock className="w-4 h-4 text-slate-500" />
          This support ticket is closed and archived.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border-t border-slate-800 relative">
      {isBotActive && (
        <div className="px-4 py-2 bg-indigo-950/50 border-b border-indigo-900/50 flex items-center justify-between text-xs text-indigo-300">
          <span className="flex items-center gap-1.5 font-medium">
            <Bot className="w-4 h-4 text-indigo-400" />
            Bot mode active. Sending a message or clicking Take Over transfers chat to you.
          </span>
          {onClaimTicket && (
            <button
              type="button"
              onClick={onClaimTicket}
              className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-md shadow-sm transition-colors cursor-pointer"
            >
              Take Over Chat
            </button>
          )}
        </div>
      )}

      {showTemplates && <QuickResponses onSelect={handleSelectTemplate} />}

      <form onSubmit={handleSubmit} className="p-4 flex items-center space-x-3">
        <button
          type="button"
          onClick={() => setShowTemplates((prev) => !prev)}
          className={`p-2.5 rounded-xl border transition-colors ${
            showTemplates
              ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
          title="Quick Response Templates"
        >
          <Zap className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSubmitting || isLocked}
          placeholder="Type your message to customer..."
          className="flex-1 bg-slate-950 text-slate-100 placeholder-slate-500 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm transition-all outline-none disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!content.trim() || disabled || isSubmitting || isLocked}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
