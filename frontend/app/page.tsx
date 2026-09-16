'use client';

import React, { useState } from 'react';
import { ChatMessage, AvailabilityParams } from '@/types';
import { sendChatMessage } from '@/lib/api';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatWindow } from '@/components/ChatWindow';
import { ChatInput } from '@/components/ChatInput';
import { SuggestedQuestions } from '@/components/SuggestedQuestions';
import { Hotel, Sparkles, Waves, ShieldCheck, Coffee, Sun, Compass } from 'lucide-react';

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome-1',
  role: 'assistant',
  content: "Welcome to Harbor View Hotel! 🌊 I'm your personal resort concierge. How may I assist you with your stay, room recommendations, amenities, or availability today?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  type: 'message'
};

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInlineForm, setShowInlineForm] = useState(false);

  const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleResetChat = () => {
    setMessages([{
      ...INITIAL_MESSAGE,
      id: `welcome-${Date.now()}`,
      timestamp: getCurrentTime()
    }]);
    setShowInlineForm(false);
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: getCurrentTime()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const historyPayload = messages.map((m) => ({
      role: m.role,
      content: m.content
    }));

    try {
      const response = await sendChatMessage({
        message: text,
        conversation: historyPayload
      });

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: getCurrentTime(),
        type: response.type,
        rooms: response.rooms,
        availability_data: response.availability_data,
        suggested_actions: response.suggested_actions
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (text.toLowerCase().includes('available') && !response.rooms) {
        setShowInlineForm(true);
      }
    } catch (error: any) {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'The assistant is temporarily offline or experiencing high traffic. Please refresh or try again.',
        timestamp: getCurrentTime(),
        type: 'error'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchAvailability = async (params: AvailabilityParams) => {
    setShowInlineForm(false);
    const searchSummary = `Check room availability for ${params.adults} guest(s) from ${params.check_in} to ${params.check_out}`;
    
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: searchSummary,
      timestamp: getCurrentTime()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const historyPayload = messages.map((m) => ({
      role: m.role,
      content: m.content
    }));

    try {
      const response = await sendChatMessage({
        message: searchSummary,
        conversation: historyPayload,
        availability: params
      });

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: getCurrentTime(),
        type: response.type,
        rooms: response.rooms,
        availability_data: response.availability_data,
        suggested_actions: ['What amenities are included?', 'What is the cancellation policy?', 'What time is check-in?']
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Unable to process availability request right now.',
        timestamp: getCurrentTime(),
        type: 'error'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAction = (actionText: string) => {
    if (actionText === 'Select Dates & Guests' || actionText === 'Check room availability') {
      setShowInlineForm(true);
    } else {
      handleSendMessage(actionText);
    }
  };

  const handleBookRoom = (roomName: string) => {
    handleSendMessage(`I would like to inquire about reserving the ${roomName}. Does it include breakfast and ocean view?`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans-modern antialiased selection:bg-amber-500 selection:text-slate-950 bg-mesh-radial relative">
      
      {/* Top Luxury Header */}
      <ChatHeader onResetChat={handleResetChat} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto relative z-10">
        
        {/* Luxury Hero Bar (Shown when conversation is short) */}
        {messages.length <= 2 && (
          <div className="py-6 px-4 border-b border-amber-500/10 bg-gradient-to-b from-slate-900/60 to-transparent">
            
            {/* Highlights Bar */}
            <div className="max-w-3xl mx-auto mb-4 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-teal-300">
                <Waves className="w-3.5 h-3.5 text-teal-400" />
                <span>Infinity Pool</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-amber-300">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>24/7 Wellness & Spa</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-emerald-300">
                <Coffee className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gourmet Breakfast</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-cyan-300">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Oceanfront Resort</span>
              </div>
            </div>

            {/* Quick Prompts */}
            <SuggestedQuestions
              onSelectQuestion={handleSendMessage}
              onOpenAvailabilityForm={() => setShowInlineForm(true)}
            />
          </div>
        )}

        {/* Message Stream */}
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSelectAction={handleSelectAction}
          onSearchAvailability={handleSearchAvailability}
          onBookRoom={handleBookRoom}
          showInlineForm={showInlineForm}
          onCloseInlineForm={() => setShowInlineForm(false)}
        />
      </div>

      {/* Fixed Bottom Input Bar */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onOpenAvailabilityForm={() => setShowInlineForm((prev) => !prev)}
        isLoading={isLoading}
      />

    </main>
  );
}
