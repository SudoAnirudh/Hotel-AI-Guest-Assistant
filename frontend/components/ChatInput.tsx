'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Calendar, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onOpenAvailabilityForm: () => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onOpenAvailabilityForm,
  isLoading
}) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="sticky bottom-0 z-30 w-full luxury-glass border-t border-amber-500/20 p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-end gap-2.5">
          
          {/* Quick Availability Form Trigger */}
          <button
            type="button"
            onClick={onOpenAvailabilityForm}
            className="p-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 transition-all cursor-pointer shrink-0 shadow-md"
            title="Check Room Availability"
          >
            <Calendar className="w-4 h-4" />
          </button>

          {/* Textarea Input */}
          <div className="flex-1 relative rounded-2xl border border-slate-700/80 bg-slate-900/90 focus-within:border-amber-500/60 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all shadow-inner">
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about Harbor View Hotel (check-in, rooms, pool, breakfast)..."
              disabled={isLoading}
              className="w-full text-xs sm:text-sm px-4 py-3 bg-transparent text-slate-100 placeholder-slate-400 focus:outline-none resize-none max-h-32"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={`p-3 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center shrink-0 shadow-md ${
              text.trim() && !isLoading
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 cursor-pointer shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105'
                : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>

        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2.5 px-1">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3 h-3 text-amber-400" /> Harbor View Resort Concierge Intelligence
          </span>
          <span className="hidden sm:inline text-slate-400">Press Enter to send, Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  );
};
