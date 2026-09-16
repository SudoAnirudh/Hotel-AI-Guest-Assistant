'use client';

import React from 'react';
import { Hotel, RotateCcw, Sparkles, Phone, Mail, MapPin } from 'lucide-react';

interface ChatHeaderProps {
  onResetChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onResetChat }) => {
  return (
    <header className="sticky top-0 z-20 w-full glass-card border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 sm:px-6 shadow-xs transition-colors">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <Hotel className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-semibold text-slate-900 dark:text-slate-100 text-base sm:text-lg tracking-tight">
                Harbor View Hotel
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                AI Assistant
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-2 mt-0.5">
              <span>5-Star Beachfront Resort</span>
              <span>•</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-teal-600" /> Harbor Bay, CA</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <a
            href="tel:+15558392000"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            title="Call Front Desk Reception"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Reception</span>
          </a>

          <button
            onClick={onResetChat}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>

      </div>
    </header>
  );
};
