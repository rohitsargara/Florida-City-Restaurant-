/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Utensils, MapPin, Phone, Star, Sparkles } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantInfo';

interface HeroSectionProps {
  onScrollToMenu: () => void;
  onScrollTo3D: () => void;
  onOpenReservation: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToMenu,
  onScrollTo3D,
  onOpenReservation,
}) => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Zero-Pill Unboxed Clean Metadata */}
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-3">
              <span>Gateway to the Florida Keys</span>
              <span aria-hidden="true">·</span>
              <span>Everglades Crossroads</span>
              <span aria-hidden="true">·</span>
              <span>Est. in Florida City</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-5 font-display text-balance">
              Hearty American Classics & Coastal Florida Dining.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl text-balance">
              Welcome to Florida City Restaurant at 1209 NW 9th Ave. Savor our signature smashed Angus burgers, wild Gulf seafood, slow-smoked citrus ribs, and authentic homemade Key lime pie in our tropical dining terrace.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto mb-10">
              <button
                onClick={onScrollToMenu}
                className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Utensils className="w-4 h-4" />
                <span>Explore Full Menu</span>
              </button>

              <button
                onClick={onScrollTo3D}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>3D Virtual Experience</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`tel:${RESTAURANT_INFO.phone}`}
                className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-slate-600" />
                <span>(305) 246-8000</span>
              </a>
            </div>

            {/* Social Proof adjacency: Google Maps Rating & Location Marker */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-slate-900 font-mono-nums">4.8 / 5.0</span>
                <span>(780+ Google Reviews)</span>
              </div>
              <span aria-hidden="true" className="text-slate-300 hidden sm:inline">·</span>
              <a
                href={RESTAURANT_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-slate-600 hover:text-amber-600 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>1209 NW 9th Ave, Florida City, FL 33034</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Feature Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 p-7 text-white shadow-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div className="text-xs uppercase tracking-widest font-semibold text-amber-400 font-mono-nums">
                  Today's Chef Specials
                </div>
                <div className="text-xs text-emerald-400 font-semibold">
                  Kitchen Open Now
                </div>
              </div>

              {/* Featured Dish 1 */}
              <div className="mb-5 pb-5 border-b border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-base text-white">Florida City Smash Cheeseburger</h3>
                  <span className="font-mono-nums font-bold text-amber-400">$14.95</span>
                </div>
                <p className="text-xs text-slate-400">
                  Double Angus smashed patties, sharp cheddar, Homestead tomato & steak fries.
                </p>
              </div>

              {/* Featured Dish 2 */}
              <div className="mb-5 pb-5 border-b border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-base text-white">Everglades Blackened Grouper</h3>
                  <span className="font-mono-nums font-bold text-amber-400">$18.50</span>
                </div>
                <p className="text-xs text-slate-400">
                  Fresh Gulf grouper, mango-pineapple slaw, avocado on an artisan hoagie.
                </p>
              </div>

              {/* Featured Dish 3 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-base text-white">Authentic Florida Key Lime Pie</h3>
                  <span className="font-mono-nums font-bold text-amber-400">$8.50</span>
                </div>
                <p className="text-xs text-slate-400">
                  Real Key lime juice, sweet cream, toasted graham crust & torched meringue.
                </p>
              </div>

              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Interactive 3D Seating</div>
                  <div className="text-[11px] text-slate-400">Reserve your favorite booth or patio table</div>
                </div>
                <button
                  onClick={onOpenReservation}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors whitespace-nowrap"
                >
                  Pick Table
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Feature Strip Below Hero Split */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-10 border-t border-slate-200">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs uppercase font-semibold text-amber-700 font-mono-nums mb-1">01. Fresh Ingredients</div>
            <div className="text-sm font-bold text-slate-900">Homestead Farm Produce</div>
            <div className="text-xs text-slate-500 mt-1">Locally sourced citrus, tomatoes, and greens.</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs uppercase font-semibold text-amber-700 font-mono-nums mb-1">02. Fresh Catch</div>
            <div className="text-sm font-bold text-slate-900">Wild Gulf & Keys Seafood</div>
            <div className="text-xs text-slate-500 mt-1">Daily fresh grouper, mahi-mahi & jumbo shrimp.</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs uppercase font-semibold text-amber-700 font-mono-nums mb-1">03. Dining Ambiance</div>
            <div className="text-sm font-bold text-slate-900">Tropical Outdoor Terrace</div>
            <div className="text-xs text-slate-500 mt-1">Palm trees, bistro umbrellas & festoon lighting.</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs uppercase font-semibold text-amber-700 font-mono-nums mb-1">04. Hospitality</div>
            <div className="text-sm font-bold text-slate-900">Roadtrip & Family Friendly</div>
            <div className="text-xs text-slate-500 mt-1">Spacious parking for roadtrippers, RVs & groups.</div>
          </div>
        </div>
      </div>
    </section>
  );
};
