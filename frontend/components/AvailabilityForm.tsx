'use client';

import React, { useState } from 'react';
import { AvailabilityParams } from '@/types';
import { Calendar, Users, Search, AlertCircle, X, Sparkles } from 'lucide-react';

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
    <div className="w-full luxury-glass rounded-2xl p-5 border border-amber-500/30 shadow-2xl relative animate-fade-in bg-slate-900/95">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 shadow-md">
          <Calendar className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-serif-luxury font-bold text-slate-100 text-base text-gold-gradient">
            Check Room Availability
          </h3>
          <p className="text-xs text-slate-400">
            Select travel dates and guest party size for live rates
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Check-in Date */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Check-in Date
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              required
            />
          </div>

          {/* Check-out Date */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Check-out Date
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              required
            />
          </div>

          {/* Guest Count */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Guest Party Size
            </label>
            <div className="flex items-center space-x-2 border border-slate-700 bg-slate-950 rounded-xl px-3.5 py-2">
              <Users className="w-4 h-4 text-amber-400 shrink-0" />
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full text-xs font-medium bg-transparent text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value={1} className="bg-slate-900 text-slate-100">1 Guest</option>
                <option value={2} className="bg-slate-900 text-slate-100">2 Guests</option>
                <option value={3} className="bg-slate-900 text-slate-100">3 Guests</option>
                <option value={4} className="bg-slate-900 text-slate-100">4 Guests</option>
                <option value={5} className="bg-slate-900 text-slate-100">5 Guests</option>
                <option value={6} className="bg-slate-900 text-slate-100">6 Guests</option>
                <option value={7} className="bg-slate-900 text-slate-100">7+ Guests</option>
              </select>
            </div>
          </div>

        </div>

        {error && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Search className="w-4 h-4 text-slate-950" />
          <span>Find Available Accommodations</span>
        </button>
      </form>
    </div>
  );
};
