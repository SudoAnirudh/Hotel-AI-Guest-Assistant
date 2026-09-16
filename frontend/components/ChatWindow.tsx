'use client';

import React, { useEffect, useRef } from 'react';
import { ChatMessage, AvailabilityParams } from '@/types';
import { RoomCard } from './RoomCard';
import { AvailabilityForm } from './AvailabilityForm';
import { LoadingState } from './LoadingState';
import { Hotel, User, Bot, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSelectAction: (action: string) => void;
  onSearchAvailability: (params: AvailabilityParams) => void;
  onBookRoom: (roomName: string) => void;
  showInlineForm: boolean;
  onCloseInlineForm: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  onSelectAction,
  onSearchAvailability,
  onBookRoom,
  showInlineForm,
  onCloseInlineForm
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, showInlineForm]);

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-4 py-4 space-y-4">
      {messages.map((msg) => {
        const isUser = msg.role === 'user';

        return (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 sm:gap-3 ${
              isUser ? 'flex-row-reverse' : 'flex-row'
            } animate-fade-in`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs text-xs font-semibold ${
                isUser
                  ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900'
                  : 'bg-gradient-to-tr from-teal-600 to-cyan-500 text-white'
              }`}
            >
              {isUser ? <User className="w-4 h-4" /> : <Hotel className="w-4 h-4" />}
            </div>

            {/* Bubble Content */}
            <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
              
              {/* Message Box */}
              <div
                className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-none dark:bg-teal-600'
                    : msg.type === 'fallback'
                    ? 'glass-card border border-amber-500/30 text-slate-800 dark:text-slate-100 rounded-tl-none'
                    : msg.type === 'error'
                    ? 'bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-tl-none'
                    : 'glass-card text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {msg.type === 'fallback' && (
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium text-xs mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Reception Assistance Recommended</span>
                  </div>
                )}

                <p className="whitespace-pre-wrap">{msg.content}</p>

                <div className="text-[10px] text-right opacity-60 mt-1">
                  {msg.timestamp}
                </div>
              </div>

              {/* Room Cards Grid (if message contains availability results) */}
              {msg.rooms && msg.rooms.length > 0 && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 px-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Available Accommodations ({msg.rooms.length})</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {msg.rooms.map((room) => (
                      <RoomCard
                        key={room.id}
                        room={room}
                        totalNights={msg.availability_data?.total_nights}
                        onBookClick={onBookRoom}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Follow-up Action Buttons */}
              {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggested_actions.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectAction(act)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800/80 hover:bg-teal-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 border border-slate-200/60 dark:border-slate-700/60 transition-colors cursor-pointer"
                    >
                      {act}
                    </button>
                  ))}
                </div>
              )}

            </div>
          </div>
        );
      })}

      {/* Inline Availability Form Widget */}
      {showInlineForm && (
        <div className="my-3">
          <AvailabilityForm
            onSearch={onSearchAvailability}
            onClose={onCloseInlineForm}
          />
        </div>
      )}

      {/* Typing Indicator / Loading Skeleton */}
      {isLoading && <LoadingState />}

      <div ref={messagesEndRef} />
    </div>
  );
};
