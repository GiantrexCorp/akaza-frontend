'use client';

import type { HotelBookingRoom } from '@/types/hotel';

interface HotelBookingRoomsProps {
  rooms: HotelBookingRoom[];
  currency: string;
}

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
}

export default function HotelBookingRooms({ rooms, currency }: HotelBookingRoomsProps) {
  if (rooms.length === 0) return null;

  return (
    <div className="bg-[var(--surface-card)] border border-[var(--line-soft)]">
      <div className="px-6 py-4 border-b border-[var(--line-soft)]">
        <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-sans">
          Rooms ({rooms.length})
        </h3>
      </div>
      <div className="divide-y divide-[var(--line-soft)]">
        {rooms.map((room) => (
          <div key={room.id} className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <p className="text-sm font-serif text-[var(--text-primary)]">{room.room_name}</p>
                <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
                  {room.board_name} &middot; {room.adults} adult{room.adults > 1 ? 's' : ''}
                  {room.children > 0 && `, ${room.children} child${room.children > 1 ? 'ren' : ''}`}
                </p>
              </div>
              <p className="text-sm font-serif text-[var(--text-primary)]">
                {formatPrice(room.selling_price, currency)}
              </p>
            </div>
            {room.guests.length > 0 && (
              <div className="space-y-1 mt-3 pt-3 border-t border-[var(--line-soft)]">
                <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-2">Guests</p>
                {room.guests.map((guest, i) => (
                  <p key={i} className="text-xs text-[var(--text-secondary)] font-sans">
                    {guest.name} {guest.surname}
                    <span className="text-[var(--text-muted)] ml-2">
                      {guest.type === 'AD' ? 'Adult' : `Child, ${guest.age}y`}
                    </span>
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
