'use client';

import React, { useState } from 'react';
import { useQuickResponses } from '@/hooks/useQuickResponses';
import { CANNED_RESPONSES } from '@/lib/constants';
import { MessageSquarePlus, Plus, Trash2, Loader2, X, Check } from 'lucide-react';

interface QuickResponsesProps {
  onSelect: (response: string) => void;
}

export const QuickResponses: React.FC<QuickResponsesProps> = ({ onSelect }) => {
  const { quickResponses, isLoading, addQuickResponse, deleteQuickResponse } = useQuickResponses();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const success = await addQuickResponse(newTitle.trim(), newContent.trim());
    if (success) {
      setNewTitle('');
      setNewContent('');
      setIsAdding(false);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm('Delete this quick response snippet?')) {
      await deleteQuickResponse(id);
    }
  };

  return (
    <div className="p-3 bg-slate-900 border-t border-slate-800/80 max-h-72 overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
          <MessageSquarePlus className="w-3.5 h-3.5" />
          <span>Quick Response Snippets</span>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding((prev) => !prev)}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/60 px-2 py-0.5 rounded-md transition-colors"
        >
          {isAdding ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          <span>{isAdding ? 'Cancel' : 'New Snippet'}</span>
        </button>
      </div>

      {/* Inline Form to Add New Quick Response */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="mb-3 p-3 bg-slate-950 border border-indigo-900/60 rounded-xl space-y-2">
          <input
            type="text"
            placeholder="Snippet title (e.g., OTP Refund Notice)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full text-xs bg-slate-900 text-slate-100 placeholder-slate-500 border border-slate-800 rounded-lg px-3 py-1.5 focus:border-indigo-500 outline-none"
            required
          />
          <textarea
            rows={2}
            placeholder="Snippet message content..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full text-xs bg-slate-900 text-slate-100 placeholder-slate-500 border border-slate-800 rounded-lg px-3 py-1.5 focus:border-indigo-500 outline-none resize-none"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-[11px] text-slate-400 hover:text-slate-200 px-2.5 py-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !newTitle.trim() || !newContent.trim()}
              className="inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
              Save Snippet
            </button>
          </div>
        </form>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
          <span>Loading saved quick responses...</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {/* API Saved Quick Responses */}
        {quickResponses.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item.content)}
            className="group flex items-center justify-between text-left text-xs bg-indigo-950/40 hover:bg-indigo-900/40 text-slate-200 hover:text-white border border-indigo-800/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer max-w-xs"
            title={item.content}
          >
            <div className="truncate mr-2">
              <span className="font-semibold text-indigo-300 mr-1.5">[{item.title}]</span>
              <span className="text-slate-300">{item.content}</span>
            </div>
            <button
              type="button"
              onClick={(e) => handleDelete(e, item.id)}
              className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-400 transition-opacity"
              title="Delete Snippet"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Fallback Built-in Templates */}
        {CANNED_RESPONSES.map((text, idx) => (
          <button
            key={`canned-${idx}`}
            type="button"
            onClick={() => onSelect(text)}
            className="text-left text-xs bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-slate-100 border border-slate-700/60 px-3 py-1.5 rounded-lg transition-colors truncate max-w-xs"
            title={text}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
};
