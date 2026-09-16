'use client';

import React, { useState } from 'react';
import { AvailabilityParams } from '@/types';
import { Calendar, Users, Search, AlertCircle, X } from 'lucide-react';

interface AvailabilityFormProps {
  onSearch: (params: AvailabilityParams) => void;
  onClose?: () => void;
  initialParams?: Partial<AvailabilityParams>;
}

export const AvailabilityForm: React.FC<AvailabilityFormProps> = ({
  onSearch,
  onClose,
  initialParams
}) => {
  // Helper to format date YYYY-MM-DD
  const getFutureDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  const [checkIn, setCheckIn] = useState(initialParams?.check_in || getFutureDate(14));
  const [checkOut, setCheckOut] = useState(initialParams?.check_out || getFutureDate(16));
  const [adults, setAdults] = useState(initialParams?.adults || 2);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!checkIn || !checkOut) {
      setError('Please select both check-in and check-out dates.');
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('Check-out date must be after check-in date.');
      return;
    }

    if (adults < 1) {
      setError('Please specify at least 1 guest.');
      return;
    }

    onSearch({
      check_in: checkIn,
      check_out: checkOut,
      adults: adults
    });
  };

  return (
    <div className="w-full glass-card rounded-2xl p-4 sm:p-5 border border-teal-500/30 shadow-md relative animate-fade-in bg-white/90 dark:bg-slate-900/90">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
          <Calendar className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
            Check Room Availability
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select dates and guest count for live rates
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Check-in Date */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Check-in Date
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              required
            />
          </div>

          {/* Check-out Date */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Check-out Date
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              required
            />
          </div>

          {/* Guest Count */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
              Guests
            </label>
            <div className="flex items-center space-x-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-1.5">
              <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full text-xs font-medium bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4 Guests</option>
                <option value={5}>5 Guests</option>
                <option value={6}>6 Guests</option>
                <option value={7}>7+ Guests</option>
              </select>
            </div>
          </div>

        </div>

        {error && (
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Find Available Rooms</span>
        </button>
      </form>
    </div>
  );
};
