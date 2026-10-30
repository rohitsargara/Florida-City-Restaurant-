/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TableInfo, ReservationRequest } from '../types/restaurant';
import { RESTAURANT_TABLES, RESTAURANT_INFO } from '../data/restaurantInfo';
import { soundFx } from '../utils/audioSynthesizer';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  Sparkles,
  Phone,
  Mail,
  User,
  MessageSquare,
} from 'lucide-react';

interface ReservationSectionProps {
  selectedTable: TableInfo | null;
  onSelectTable: (table: TableInfo) => void;
  onScrollTo3D: () => void;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({
  selectedTable,
  onSelectTable,
  onScrollTo3D,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('6:30 PM');
  const [partySize, setPartySize] = useState(4);
  const [selectedZone, setSelectedZone] = useState<string>('Tropical Patio');
  const [specialRequests, setSpecialRequests] = useState('');

  const [confirmedReservation, setConfirmedReservation] = useState<{
    code: string;
    request: ReservationRequest;
  } | null>(null);

  const availableTimeSlots = [
    '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
  ];

  const zones = ['Tropical Patio', 'Main Diner', 'Citrus Bar', 'Veranda'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    soundFx.playBell();
    const code = `FCR-RES-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedReservation({
      code,
      request: {
        fullName,
        email,
        phone,
        date,
        timeSlot,
        partySize,
        tableZone: selectedTable ? selectedTable.zone : selectedZone,
        tableId: selectedTable?.id,
        tableNumber: selectedTable?.number,
        specialRequests,
      },
    });
  };

  return (
    <section id="reservations" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Heading, Info, and 3D Table Bridge */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs uppercase font-bold text-amber-700 tracking-wider mb-2 font-mono-nums">
                Table Reservations
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
                Reserve Your Table Online
              </h2>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Whether you're stopping by during a road trip to the Florida Keys or organizing a family gathering in Florida City, reserve your table in seconds.
              </p>
            </div>

            {/* 3D Seating Synced Callout Card */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    3D Interactive Seating
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onScrollTo3D}
                  className="text-xs text-slate-300 hover:text-white underline font-semibold"
                >
                  Inspect in 3D
                </button>
              </div>

              {selectedTable ? (
                <div className="p-3 bg-slate-800/90 rounded-xl border border-amber-500/40">
                  <div className="text-xs text-amber-400 font-bold uppercase">
                    Table #{selectedTable.number} Selected
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">{selectedTable.zone}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Accommodates {selectedTable.capacity} guests · Real-time 3D Floor Plan
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-300 leading-relaxed">
                  You can click any table in our 3D Floor Plan above to pick your exact booth, patio spot, or bar seating!
                </div>
              )}

              <button
                type="button"
                onClick={onScrollTo3D}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors border border-slate-700"
              >
                Open 3D Floor Plan
              </button>
            </div>

            {/* General Policy Notes */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
              <div className="font-bold text-slate-900 text-sm">Dining Policies:</div>
              <p>· Table hold time is 15 minutes past reservation time.</p>
              <p>· Large parties of 8+ may request our private Veranda.</p>
              <p>· Free parking available on-site for roadtrippers and tour buses.</p>
            </div>
          </div>

          {/* Right Column: Reservation Form or Confirmed Slip */}
          <div className="lg:col-span-7">
            {confirmedReservation ? (
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-700 font-mono-nums">
                      Confirmation Code: {confirmedReservation.code}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 font-display">
                      Reservation Confirmed!
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 bg-white rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Guest:</span>
                    <span className="font-bold text-slate-900">{confirmedReservation.request.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Date:</span>
                    <span className="font-bold text-slate-900">{confirmedReservation.request.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Time:</span>
                    <span className="font-bold text-slate-900">{confirmedReservation.request.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Party Size:</span>
                    <span className="font-bold text-slate-900">{confirmedReservation.request.partySize} Guests</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Area:</span>
                    <span className="font-bold text-slate-900">{confirmedReservation.request.tableZone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Table #:</span>
                    <span className="font-bold text-amber-600 font-mono-nums">
                      {confirmedReservation.request.tableNumber ? `Table #${confirmedReservation.request.tableNumber}` : 'Host Assigned'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  A confirmation SMS has been prepared for {confirmedReservation.request.phone}. We look forward to welcoming you at 1209 NW 9th Ave, Florida City.
                </p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={RESTAURANT_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors text-center"
                  >
                    Get Driving Directions
                  </a>
                  <button
                    onClick={() => setConfirmedReservation(null)}
                    className="py-3 px-5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
                  >
                    New Reservation
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-lg space-y-5">
                {/* Contact Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="John Miller"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-white text-xs border border-slate-300 rounded-xl focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="(305) 555-0144"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-white text-xs border border-slate-300 rounded-xl focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address (for receipt)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white text-xs border border-slate-300 rounded-xl focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Date, Time, Party Size */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Date *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-white text-xs border border-slate-300 rounded-xl focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Time Slot *
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-white text-xs border border-slate-300 rounded-xl focus:border-amber-500 focus:outline-none"
                      >
                        {availableTimeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Party Size *
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={partySize}
                        onChange={(e) => setPartySize(parseInt(e.target.value, 10))}
                        className="w-full pl-9 pr-3 py-2.5 bg-white text-xs border border-slate-300 rounded-xl focus:border-amber-500 focus:outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Seating Area Preference */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Preferred Dining Area
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {zones.map((zone) => {
                      const isSelected = selectedTable ? selectedTable.zone === zone : selectedZone === zone;
                      return (
                        <button
                          type="button"
                          key={zone}
                          onClick={() => {
                            soundFx.playClick();
                            setSelectedZone(zone);
                            // Auto-select first available table in that zone if none selected
                            const firstInZone = RESTAURANT_TABLES.find(
                              (t) => t.zone === zone && t.status === 'available'
                            );
                            if (firstInZone) onSelectTable(firstInZone);
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                            isSelected
                              ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {zone}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Special Occasion or Dietary Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Birthday celebration, high chair requested, quiet booth..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full p-2.5 bg-white text-xs border border-slate-300 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-md"
                >
                  Confirm Table Reservation
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
