import React from 'react';
import { Message } from '@/types/support';
import { Bot, User, Headset } from 'lucide-react';
import { formatTimeOnly } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  currentAgentId: number;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender_role === 'USER';
  const isBot = message.sender_role === 'BOT';
  const isAgent = message.sender_role === 'AGENT';

  return (
    <div className={`flex w-full my-2.5 ${isAgent ? 'justify-end' : 'justify-start'}`}>
      <div className="flex max-w-[78%] space-x-2.5 items-start">
        {!isAgent && (
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-slate-800 border border-slate-700/80 text-slate-300 shadow-sm">
            {isBot ? <Bot className="w-4 h-4 text-sky-400" /> : <User className="w-4 h-4 text-emerald-400" />}
          </div>
        )}

        <div>
          <div
            className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all ${
              isAgent
                ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-600/10'
                : isBot
                ? 'bg-slate-800/90 text-sky-200 border border-sky-500/30 rounded-bl-none'
                : 'bg-slate-850 text-slate-100 border border-slate-750 rounded-bl-none'
            }`}
          >
            <div className="flex items-center justify-between gap-2 text-[10px] font-bold tracking-wider opacity-75 mb-1.5 uppercase">
              <span>{isBot ? 'Bot Assistant' : isAgent ? 'Support Agent' : 'Customer'}</span>
            </div>
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          
          <span className={`text-[10px] text-slate-400 px-1 mt-1 block font-mono ${isAgent ? 'text-right' : 'text-left'}`}>
            {formatTimeOnly(message.created_at)}
          </span>
        </div>

        {isAgent && (
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 shadow-sm">
            <Headset className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
};
