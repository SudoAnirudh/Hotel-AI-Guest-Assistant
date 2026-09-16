'use client';

import React from 'react';
import { Hotel, Sparkles } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex items-start gap-3 my-4 max-w-2xl animate-fade-in">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-teal-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
        <Hotel className="w-4 h-4 stroke-[2.2]" />
      </div>

      <div className="luxury-glass rounded-2xl rounded-tl-none px-4 py-3 border border-amber-500/20 shadow-md">
        <div className="flex items-center space-x-2 py-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-xs text-slate-300 font-medium">Assistant is synthesizing grounded response</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 dot-1"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 dot-2"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 dot-3"></span>
        </div>
      </div>
    </div>
  );
};
