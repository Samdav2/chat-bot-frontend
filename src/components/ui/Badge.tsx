import React from 'react';
import { ConversationStatus } from '@/types/support';
import { STATUS_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface BadgeProps {
  status: ConversationStatus;
  className?: string;
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ status, className, showDot = true }) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    bg: 'bg-slate-800',
    text: 'text-slate-300',
    border: 'border-slate-700',
    dot: 'bg-slate-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors shadow-sm',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {showDot && <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5 shrink-0', config.dot)} />}
      {config.label}
    </span>
  );
};
