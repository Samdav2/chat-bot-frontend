import React from 'react';
import { CANNED_RESPONSES } from '@/lib/constants';
import { MessageSquarePlus } from 'lucide-react';

interface QuickResponsesProps {
  onSelect: (response: string) => void;
}

export const QuickResponses: React.FC<QuickResponsesProps> = ({ onSelect }) => {
  return (
    <div className="p-3 bg-slate-900 border-t border-slate-800/80">
      <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium mb-2">
        <MessageSquarePlus className="w-3.5 h-3.5" />
        <span>Quick Response Templates</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {CANNED_RESPONSES.map((text, idx) => (
          <button
            key={idx}
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
