'use client';

import React, { useState, useRef } from 'react';
import { Send, Zap, Lock, UserCheck, Bot, Paperclip, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { QuickResponses } from '@/components/ui/QuickResponses';
import { ConversationStatus } from '@/types/support';
import { getApiBaseUrl } from '@/lib/constants';

interface MessageInputProps {
  onSendMessage: (text: string, media_url?: string | null, media_type?: string | null) => Promise<boolean>;
  onUploadMedia?: (file: File) => Promise<{ media_url: string; media_type: string } | null>;
  onClaimTicket?: () => void;
  status: ConversationStatus;
  isAssignedToCurrentAgent: boolean;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onUploadMedia,
  onClaimTicket,
  status,
  isAssignedToCurrentAgent,
  disabled = false,
}) => {
  const [content, setContent] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Media attachment state
  const [attachedMedia, setAttachedMedia] = useState<{
    media_url: string;
    media_type: string;
    previewUrl: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isClosed = status === 'CLOSED';
  const isPending = status === 'PENDING_AGENT';
  const isBotActive = status === 'BOT_ACTIVE';
  const isLocked = isClosed || (status === 'HUMAN_ACTIVE' && !isAssignedToCurrentAgent);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadMedia) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WEBP, GIF)');
      return;
    }

    setIsUploading(true);
    try {
      const uploaded = await onUploadMedia(file);
      if (uploaded) {
        setAttachedMedia({
          media_url: uploaded.media_url,
          media_type: uploaded.media_type,
          previewUrl: URL.createObjectURL(file),
        });
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAttachment = () => {
    setAttachedMedia(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!content.trim() && !attachedMedia) || isSubmitting || disabled || isLocked || isPending) return;

    setIsSubmitting(true);
    const success = await onSendMessage(
      content.trim(),
      attachedMedia?.media_url,
      attachedMedia?.media_type
    );

    if (success) {
      setContent('');
      setAttachedMedia(null);
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
          <p className="text-sm text-amber-300 font-medium flex items-center justify-center gap-2">
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
            <Bot className="w-4 h-4 text-indigo-400 shrink-0" />
            Bot mode active. Sending a message or clicking Take Over transfers chat to you.
          </span>
          {onClaimTicket && (
            <button
              type="button"
              onClick={onClaimTicket}
              className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-md shadow-sm transition-colors shrink-0 cursor-pointer"
            >
              Take Over Chat
            </button>
          )}
        </div>
      )}

      {/* Attachment Preview Bar */}
      {attachedMedia && (
        <div className="px-4 pt-3 pb-1 flex items-center gap-3">
          <div className="relative group inline-block">
            <img
              src={attachedMedia.previewUrl}
              alt="Attachment Preview"
              className="w-16 h-16 object-cover rounded-xl border border-indigo-500/50 shadow-md"
            />
            <button
              type="button"
              onClick={handleRemoveAttachment}
              className="absolute -top-2 -right-2 p-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-colors"
              title="Remove attachment"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="text-xs text-slate-300">
            <p className="font-semibold text-indigo-400 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" /> Image attached
            </p>
            <p className="text-[11px] text-slate-400">Ready to send with your message</p>
          </div>
        </div>
      )}

      {showTemplates && <QuickResponses onSelect={handleSelectTemplate} />}

      <form onSubmit={handleSubmit} className="p-3 sm:p-4 flex items-center space-x-2 sm:space-x-3">
        {/* Quick Templates Toggle */}
        <button
          type="button"
          onClick={() => setShowTemplates((prev) => !prev)}
          className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
            showTemplates
              ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
          title="Quick Response Templates"
        >
          <Zap className="w-4 h-4" />
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Image Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isSubmitting || isUploading || isLocked}
          className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
            attachedMedia
              ? 'bg-indigo-600 text-white border-indigo-500'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200 disabled:opacity-50'
          }`}
          title="Attach Image"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          ) : (
            <Paperclip className="w-4 h-4" />
          )}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSubmitting || isLocked}
          placeholder={attachedMedia ? "Add caption (optional)..." : "Type your message to customer..."}
          className="flex-1 bg-slate-950 text-slate-100 placeholder-slate-500 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm transition-all outline-none disabled:opacity-50 min-w-0"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={(!content.trim() && !attachedMedia) || disabled || isSubmitting || isLocked}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
};
