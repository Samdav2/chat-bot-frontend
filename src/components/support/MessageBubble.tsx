'use client';

import React, { useState } from 'react';
import { Message } from '@/types/support';
import { Bot, User, Headset, Image as ImageIcon, X, ExternalLink } from 'lucide-react';
import { formatTimeOnly } from '@/lib/utils';
import { getApiBaseUrl } from '@/lib/constants';

interface MessageBubbleProps {
  message: Message;
  currentAgentId: number;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const isUser = message.sender_role === 'USER';
  const isBot = message.sender_role === 'BOT';
  const isAgent = message.sender_role === 'AGENT';

  const getFullMediaUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const baseUrl = getApiBaseUrl().replace(/\/api\/v1\/?$/, '');
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const fullMediaUrl = message.media_url ? getFullMediaUrl(message.media_url) : null;

  return (
    <>
      <div className={`flex w-full my-2.5 ${isAgent ? 'justify-end' : 'justify-start'}`}>
        <div className="flex max-w-[85%] sm:max-w-[78%] space-x-2.5 items-start">
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

              {/* Render Image Thumbnail if Media Exists */}
              {fullMediaUrl && (
                <div className="mb-2 overflow-hidden rounded-xl border border-white/10 relative group bg-black/40">
                  <img
                    src={fullMediaUrl}
                    alt="Chat Attachment"
                    className="max-h-60 w-full object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setIsPreviewOpen(true)}
                  />
                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(true)}
                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Expand</span>
                  </button>
                </div>
              )}

              {message.content && (
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              )}
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

      {/* Lightbox Preview Modal */}
      {isPreviewOpen && fullMediaUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="absolute -top-12 right-0 flex items-center space-x-3">
              <a
                href={fullMediaUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title="Open original image"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={fullMediaUrl}
              alt="Expanded Preview"
              className="max-h-[80vh] max-w-full rounded-2xl border border-slate-700 shadow-2xl object-contain"
            />
            
            {message.content && (
              <div className="mt-3 p-3 bg-slate-900/90 text-slate-200 text-xs rounded-xl border border-slate-800 max-w-xl text-center">
                {message.content}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
