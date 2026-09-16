'use client';

import React, { useState } from 'react';
import { ChatMessage, AvailabilityParams } from '@/types';
import { sendChatMessage } from '@/lib/api';
import { ChatHeader } from '@/components/ChatHeader';
import { ChatWindow } from '@/components/ChatWindow';
import { ChatInput } from '@/components/ChatInput';
import { SuggestedQuestions } from '@/components/SuggestedQuestions';
import { Hotel, Sparkles, Shield, Coffee, Waves } from 'lucide-react';

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome-1',
  role: 'assistant',
  content: "Welcome to Harbor View Hotel! 🌊 I'm your dedicated guest assistant. How may I assist you with your stay today?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  type: 'message'
};

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInlineForm, setShowInlineForm] = useState(false);

  const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Reset Conversation
  const handleResetChat = () => {
    setMessages([{
      ...INITIAL_MESSAGE,
      id: `welcome-${Date.now()}`,
      timestamp: getCurrentTime()
    }]);
    setShowInlineForm(false);
  };

  // Process user text input
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: getCurrentTime()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Build sliding window conversation history for API payload
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

      // If response asks for availability dates, trigger inline availability form
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

  // Handle room availability date check
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

  // Handle action chip click
  const handleSelectAction = (actionText: string) => {
    if (actionText === 'Select Dates & Guests' || actionText === 'Check room availability') {
      setShowInlineForm(true);
    } else {
      handleSendMessage(actionText);
    }
  };

  // Handle room inquiry click
  const handleBookRoom = (roomName: string) => {
    handleSendMessage(`I would like to inquire about reserving the ${roomName}. Does it include breakfast and ocean view?`);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
      
      {/* Top Header */}
      <ChatHeader onResetChat={handleResetChat} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto">
        
        {/* Suggested Prompts Banner (Shown when conversation is short) */}
        {messages.length <= 2 && (
          <div className="py-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40">
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
