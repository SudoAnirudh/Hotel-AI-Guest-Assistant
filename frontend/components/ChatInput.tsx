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
    <div className="sticky bottom-0 z-20 w-full glass-card border-t border-slate-200/80 dark:border-slate-800/80 p-3 sm:p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          
          {/* Quick Availability Trigger */}
          <button
            type="button"
            onClick={onOpenAvailabilityForm}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-teal-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-500/40 transition-all cursor-pointer shrink-0"
            title="Check Room Availability"
          >
            <Calendar className="w-4 h-4" />
          </button>

          {/* Textarea Input */}
          <div className="flex-1 relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 focus-within:border-teal-500/60 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about Harbor View Hotel (check-in, rooms, pool, breakfast)..."
              disabled={isLoading}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none resize-none max-h-32"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={`p-2.5 rounded-xl font-medium text-white transition-all duration-200 flex items-center justify-center shrink-0 ${
              text.trim() && !isLoading
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-xs hover:shadow-md cursor-pointer'
                : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>

        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-2 px-1">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-teal-500" /> Powered by Harbor View AI Assistant
          </span>
          <span className="hidden sm:inline">Press Enter to send, Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  );
};
