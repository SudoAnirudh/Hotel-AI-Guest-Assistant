'use client';

import React from 'react';
import { RoomResult } from '@/types';
import { Users, Bed, Check, Sparkles, Coffee, Eye, ShieldCheck, ArrowRight, Compass } from 'lucide-react';

interface RoomCardProps {
  room: RoomResult;
  totalNights?: number;
  onBookClick?: (roomName: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, totalNights, onBookClick }) => {
  return (
    <div className="luxury-glass luxury-card-glow rounded-2xl p-5 border border-amber-500/20 shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-amber-500/40">
      <div>
        {/* Header Badges & Title */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-luxury font-bold text-slate-100 text-lg group-hover:text-amber-400 transition-colors">
                {room.name}
              </h3>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
                {room.available_inventory ?? 1} Available
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              {room.description}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <span className="text-xl font-bold text-amber-400 font-serif-luxury">
              ${room.price_per_night}
            </span>
            <span className="text-[11px] text-slate-400 block font-normal">/ night</span>
          </div>
        </div>

        {/* Room Attributes */}
        <div className="flex flex-wrap items-center gap-3 my-3 text-xs text-slate-300 py-2.5 px-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center gap-1.5 font-medium text-amber-300">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Up to {room.capacity} Guests</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Bed className="w-3.5 h-3.5 text-teal-400" />
            <span>{room.bed_type}</span>
          </div>
          {room.ocean_view && (
            <>
              <span className="text-slate-700">•</span>
              <div className="flex items-center gap-1 text-cyan-400 font-medium">
                <Eye className="w-3.5 h-3.5" />
                <span>Ocean View</span>
              </div>
            </>
          )}
          {room.breakfast_included && (
            <>
              <span className="text-slate-700">•</span>
              <div className="flex items-center gap-1 text-emerald-400 font-medium">
                <Coffee className="w-3.5 h-3.5" />
                <span>Breakfast Included</span>
              </div>
            </>
          )}
        </div>

        {/* Key Amenities */}
        <div className="flex flex-wrap gap-1.5 my-3">
          {room.amenities.slice(0, 5).map((amenity, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800/90 text-slate-200 border border-slate-700/60"
            >
              <Check className="w-3 h-3 text-amber-400" />
              {amenity}
            </span>
          ))}
          {room.amenities.length > 5 && (
            <span className="text-[11px] text-slate-400 font-medium self-center px-1">
              +{room.amenities.length - 5} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Price & Action */}
      <div className="pt-3.5 mt-2 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          {room.total_price && totalNights ? (
            <div>
              <span className="text-xs text-slate-400">Total Stay ({totalNights} nights):</span>
              <span className="text-base font-bold text-amber-400 font-serif-luxury ml-2">${room.total_price}</span>
            </div>
          ) : (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Guaranteed Best Resort Rate
            </span>
          )}
        </div>

        <button
          onClick={() => onBookClick && onBookClick(room.name)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-semibold text-xs shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all cursor-pointer group-hover:translate-x-0.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
          <span>Inquire Room</span>
          <ArrowRight className="w-3 h-3 text-slate-950" />
        </button>
      </div>
    </div>
  );
};
