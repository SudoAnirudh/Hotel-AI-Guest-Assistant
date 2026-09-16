'use client';

import React from 'react';
import { Clock, Waves, Users, Utensils, ShieldAlert, Calendar } from 'lucide-react';

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
  onOpenAvailabilityForm?: () => void;
}

const QUESTIONS = [
  { label: 'What time is check-in?', icon: Clock, category: 'Policy' },
  { label: 'Does the hotel have a swimming pool?', icon: Waves, category: 'Amenity' },
  { label: 'Which room is suitable for 3 guests?', icon: Users, category: 'Rooms' },
  { label: 'Is breakfast included?', icon: Utensils, category: 'Dining' },
  { label: 'What is the cancellation policy?', icon: ShieldAlert, category: 'Policy' },
  { label: 'Do you have rooms available?', icon: Calendar, category: 'Search', highlight: true },
];

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  onSelectQuestion,
  onOpenAvailabilityForm
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto py-2 px-1">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2.5 px-1 flex items-center gap-1.5">
        <span>Suggested Questions</span>
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
              className={`flex items-center gap-2.5 p-3 rounded-xl text-left text-xs font-medium transition-all duration-200 cursor-pointer border ${
                q.highlight
                  ? 'bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border-teal-500/30 text-teal-700 dark:text-teal-300 hover:border-teal-500/60 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  q.highlight
                    ? 'bg-teal-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="truncate flex-1">{q.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
