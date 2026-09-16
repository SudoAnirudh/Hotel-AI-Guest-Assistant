'use client';

import React from 'react';
import { Clock, Waves, Users, Utensils, ShieldAlert, Calendar, Sparkles } from 'lucide-react';

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
  onOpenAvailabilityForm?: () => void;
}

const QUESTIONS = [
  { label: 'What time is check-in & check-out?', icon: Clock, category: 'Policies' },
  { label: 'Does the hotel have an infinity pool?', icon: Waves, category: 'Amenities' },
  { label: 'Which room is suitable for 3 guests?', icon: Users, category: 'Accommodations' },
  { label: 'Is breakfast included with rooms?', icon: Utensils, category: 'Dining' },
  { label: 'What is the cancellation policy?', icon: ShieldAlert, category: 'Policies' },
  { label: 'Check room availability & rates', icon: Calendar, category: 'Live Search', highlight: true },
];

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  onSelectQuestion,
  onOpenAvailabilityForm
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto py-2 px-1">
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Curated Guest Queries</span>
        </p>
        <span className="text-[11px] text-slate-400">1-Tap Prompts</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {QUESTIONS.map((q, idx) => {
          const Icon = q.icon;
          return (
            <button
              key={idx}
              onClick={() => {
                if (q.highlight && onOpenAvailabilityForm) {
                  onOpenAvailabilityForm();
                } else {
                  onSelectQuestion(q.label);
                }
              }}
              className={`group relative flex items-center gap-3 p-3.5 rounded-2xl text-left text-xs font-medium transition-all duration-300 cursor-pointer luxury-card-glow ${
                q.highlight
                  ? 'bg-gradient-to-r from-amber-500/20 via-teal-500/20 to-slate-900 border border-amber-500/40 text-amber-200 shadow-lg shadow-amber-500/10 hover:border-amber-400'
                  : 'bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 text-slate-200 hover:border-teal-500/40 shadow-sm'
              }`}
            >
              <div
                className={`p-2 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                  q.highlight
                    ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 shadow-md'
                    : 'bg-slate-800/90 text-teal-400 group-hover:text-amber-400 border border-slate-700/60'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 overflow-hidden">
                <span className="text-[10px] uppercase font-semibold tracking-wider block text-slate-400 group-hover:text-amber-400/80 transition-colors">
                  {q.category}
                </span>
                <span className="truncate block text-slate-100 font-medium">{q.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
