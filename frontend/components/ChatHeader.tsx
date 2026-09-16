'use client';

import React from 'react';
import { Hotel, RotateCcw, Sparkles, Phone, Star, MapPin, Compass } from 'lucide-react';

interface ChatHeaderProps {
  onResetChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onResetChat }) => {
  return (
    <header className="sticky top-0 z-30 w-full luxury-glass border-b border-amber-500/20 px-4 py-3 sm:px-6 shadow-xl backdrop-blur-xl">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        
        {/* Hotel Identity */}
        <div className="flex items-center space-x-3.5">
          <div className="relative group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-teal-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
              <Hotel className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse"></span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif-luxury font-bold text-slate-100 text-lg sm:text-xl tracking-tight text-gold-gradient">
                Harbor View Hotel
              </h1>
              
              {/* 5 Star Badge */}
              <div className="hidden sm:flex items-center space-x-0.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-semibold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>5-Star Luxury</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 font-sans-modern">
              <span className="flex items-center gap-1 text-teal-400">
                <MapPin className="w-3 h-3 text-teal-400" /> Harbor Bay, California
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 hidden md:inline">Oceanfront Resort & Villas</span>
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <a
            href="tel:+15558392000"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-amber-300 hover:text-amber-200 px-3.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-all duration-200 cursor-pointer"
            title="Call Front Desk Reception"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Concierge</span>
          </a>

          <button
            onClick={onResetChat}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-3.5 py-1.5 rounded-xl border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 transition-all duration-200 cursor-pointer hover:border-amber-500/40"
            title="Start New Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">New Session</span>
          </button>
        </div>

      </div>
    </header>
  );
};
