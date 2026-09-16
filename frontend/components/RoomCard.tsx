'use client';

import React from 'react';
import { RoomResult } from '@/types';
import { Users, Bed, Check, Sparkles, Coffee, Eye, ShieldCheck } from 'lucide-react';

interface RoomCardProps {
  room: RoomResult;
  totalNights?: number;
  onBookClick?: (roomName: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, totalNights, onBookClick }) => {
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Header Badges & Title */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              {room.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
              {room.description}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              ${room.price_per_night}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-normal">/ night</span>
          </div>
        </div>

        {/* Room Attributes */}
        <div className="flex flex-wrap items-center gap-3 my-3 text-xs text-slate-600 dark:text-slate-300 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 font-medium">
            <Users className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Up to {room.capacity} Guests</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-1.5">
            <Bed className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{room.bed_type}</span>
          </div>
          {room.ocean_view && (
            <>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-medium">
                <Eye className="w-3.5 h-3.5" />
                <span>Ocean View</span>
              </div>
            </>
          )}
          {room.breakfast_included && (
            <>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <Coffee className="w-3.5 h-3.5" />
                <span>Breakfast Included</span>
              </div>
            </>
          )}
        </div>

        {/* Key Amenities */}
        <div className="flex flex-wrap gap-1.5 my-3">
          {room.amenities.slice(0, 4).map((amenity, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              <Check className="w-3 h-3 text-teal-500" />
              {amenity}
            </span>
          ))}
          {room.amenities.length > 4 && (
            <span className="text-[11px] text-slate-400 font-medium self-center px-1">
              +{room.amenities.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Price & Action */}
      <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          {room.total_price && totalNights ? (
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Total for {totalNights} night(s):</span>
              <span className="text-sm font-bold text-teal-600 dark:text-teal-400 ml-1.5">${room.total_price}</span>
            </div>
          ) : (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Best Rate Guaranteed
            </span>
          )}
        </div>

        <button
          onClick={() => onBookClick && onBookClick(room.name)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Inquire Room</span>
        </button>
      </div>
    </div>
  );
};
