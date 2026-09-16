'use client';

import React, { useEffect, useRef } from 'react';
import { ChatMessage, AvailabilityParams } from '@/types';
import { RoomCard } from './RoomCard';
import { AvailabilityForm } from './AvailabilityForm';
import { LoadingState } from './LoadingState';
import { Hotel, User, Sparkles, AlertTriangle, ShieldCheck, Compass } from 'lucide-react';

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
    <div className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-4 py-6 space-y-5">
      {messages.map((msg) => {
        const isUser = msg.role === 'user';

        return (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              isUser ? 'flex-row-reverse' : 'flex-row'
            } animate-fade-in`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md text-xs font-semibold ${
                isUser
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                  : 'bg-gradient-to-tr from-amber-600 via-amber-500 to-teal-500 text-slate-950'
              }`}
            >
              {isUser ? <User className="w-4 h-4" /> : <Hotel className="w-4 h-4 stroke-[2.2]" />}
            </div>

            {/* Bubble Content */}
            <div className={`max-w-[85%] sm:max-w-[80%] space-y-2.5`}>
              
              {/* Message Box */}
              <div
                className={`rounded-2xl px-4.5 py-3.5 text-xs sm:text-sm leading-relaxed shadow-lg ${
                  isUser
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-medium rounded-tr-none shadow-amber-500/10'
                    : msg.type === 'fallback'
                    ? 'luxury-glass border border-amber-500/40 text-slate-100 rounded-tl-none'
                    : msg.type === 'error'
                    ? 'bg-rose-950/80 border border-rose-800 text-rose-200 rounded-tl-none'
                    : 'luxury-glass text-slate-100 rounded-tl-none border border-slate-700/60'
                }`}
              >
                {msg.type === 'fallback' && (
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs mb-1.5 pb-1 border-b border-amber-500/20">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Reception Assistance Recommended</span>
                  </div>
                )}

                <p className="whitespace-pre-wrap">{msg.content}</p>

                <div className="text-[10px] text-right opacity-60 mt-1.5 font-mono">
                  {msg.timestamp}
                </div>
              </div>

              {/* Room Cards Grid */}
              {msg.rooms && msg.rooms.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 px-1 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Available Accommodations ({msg.rooms.length})</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3.5">
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

              {/* Suggested Follow-up Action Chips */}
              {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1.5">
                  {msg.suggested_actions.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectAction(act)}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-amber-400 border border-slate-700/80 hover:border-amber-500/40 transition-all cursor-pointer shadow-xs"
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
        <div className="my-4">
          <AvailabilityForm
            onSearch={onSearchAvailability}
            onClose={onCloseInlineForm}
          />
        </div>
      )}

      {/* Typing Indicator */}
      {isLoading && <LoadingState />}

      <div ref={messagesEndRef} />
    </div>
  );
};
