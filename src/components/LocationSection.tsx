/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RESTAURANT_INFO } from '../data/restaurantInfo';
import { MapPin, Phone, Clock, Navigation, ExternalLink, Car, Bus, Utensils } from 'lucide-react';
import { CateringModal } from './CateringModal';

export const LocationSection: React.FC = () => {
  const [isCateringOpen, setIsCateringOpen] = useState(false);

  // Check if restaurant is currently open based on local Florida time (EDT/EST)
  const isOpenNow = (() => {
    try {
      const now = new Date();
      // Format in America/New_York
      const nyTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        hour12: false,
      }).format(now);
      const hour = parseInt(nyTime, 10);
      return hour >= 7 && hour < 22;
    } catch {
      return true;
    }
  })();

  return (
    <section id="location" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Location & Hours Breakdown */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="text-xs uppercase font-bold text-amber-700 tracking-wider mb-2 font-mono-nums">
                Find Us in Florida City
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
                Location & Operating Hours
              </h2>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Conveniently situated right off US Highway 1 and Krome Avenue, making it the perfect dining pit stop for Florida Keys roadtrippers, Everglades explorers, and Homestead locals.
              </p>
            </div>

            {/* Address & Live Status Box */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      1209 NW 9th Ave, Florida City, FL 33034
                    </div>
                    <div className="text-xs text-slate-500 font-mono-nums mt-0.5">
                      GPS: 25.4591503, -80.4916111
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold font-mono-nums">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      isOpenNow ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <span className={isOpenNow ? 'text-emerald-700' : 'text-amber-700'}>
                    {isOpenNow ? 'Open Now' : 'Closed · Opens 7 AM'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={RESTAURANT_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <a
                  href={`tel:${RESTAURANT_INFO.phone}`}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Call (305) 246-8000</span>
                </a>
              </div>
            </div>

            {/* Operating Hours Table */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-900 tracking-wider mb-4">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Weekly Schedule</span>
              </div>
              <div className="space-y-2 text-xs">
                {RESTAURANT_INFO.hours.map((schedule, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0"
                  >
                    <span className="font-medium text-slate-700">{schedule.day}</span>
                    <span className="font-mono-nums font-semibold text-slate-900">{schedule.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Roadtrip Proximity & Catering Card */}
          <div className="lg:col-span-6 space-y-6">
            {/* Interactive Map Visual Mockup & Roadtrip Strip */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
              {/* Map header preview */}
              <div className="h-60 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/80 p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />
                <div className="relative z-10 flex items-center justify-between text-xs text-white">
                  <span className="font-mono-nums uppercase font-semibold text-amber-400">
                    Satellite Confluence
                  </span>
                  <span>Miami-Dade County</span>
                </div>

                <div className="relative z-10 text-center py-4">
                  <div className="w-12 h-12 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white font-display">
                    Florida City Restaurant
                  </h3>
                  <p className="text-xs text-slate-300">1209 NW 9th Ave, Florida City, FL 33034</p>
                </div>

                <div className="relative z-10 flex justify-center">
                  <a
                    href={RESTAURANT_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5"
                  >
                    <span>Click for Full Satellite Directions</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Roadtrip Distances */}
              <div className="p-6">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Car className="w-4 h-4 text-amber-600" />
                  <span>Roadtrip Driving Distances</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-500">Everglades National Park</div>
                    <div className="font-bold text-slate-900 font-mono-nums mt-0.5">11 Miles · 16 min</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-500">Key Largo (Keys Entry)</div>
                    <div className="font-bold text-slate-900 font-mono-nums mt-0.5">28 Miles · 35 min</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-500">Homestead-Miami Speedway</div>
                    <div className="font-bold text-slate-900 font-mono-nums mt-0.5">5.2 Miles · 10 min</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-500">Downtown Miami / MIA</div>
                    <div className="font-bold text-slate-900 font-mono-nums mt-0.5">34 Miles · 42 min</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tour Bus & Large Group Catering Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <Bus className="w-4 h-4" />
                  <span>Tour Bus, RV & Group Catering</span>
                </div>
                <p className="text-xs text-slate-600 max-w-sm">
                  Designated oversized parking lot for RVs, boat trailers, and touring groups.
                </p>
              </div>

              <button
                onClick={() => setIsCateringOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-sm shrink-0"
              >
                Catering Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      <CateringModal isOpen={isCateringOpen} onClose={() => setIsCateringOpen(false)} />
    </section>
  );
};
