'use client';

import React from 'react';
import { Hotel } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex items-start gap-3 my-3 max-w-2xl animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-xs">
        <Hotel className="w-4 h-4" />
      </div>

      <div className="glass-card rounded-2xl rounded-tl-none px-4 py-3 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center space-x-1.5 py-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mr-1">Assistant is thinking</span>
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dot-1"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dot-2"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dot-3"></span>
        </div>
      </div>
    </div>
  );
};
