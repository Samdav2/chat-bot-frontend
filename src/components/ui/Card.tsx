import React from 'react';
import { cn } from '@/lib/utils';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-slate-900/90 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  );
};
