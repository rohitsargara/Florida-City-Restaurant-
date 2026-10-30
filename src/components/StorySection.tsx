/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Flame, Citrus, Fish, Award, ShieldCheck } from 'lucide-react';

export const StorySection: React.FC = () => {
  return (
    <section id="story" className="py-24 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <div className="text-xs uppercase font-bold text-amber-400 tracking-wider mb-2 font-mono-nums">
            Our Florida City Roots
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display text-balance">
            Rooted at the Gateway to the Florida Keys.
          </h2>
          <p className="text-base text-slate-300 mt-4 leading-relaxed text-balance">
            Located at 1209 NW 9th Avenue, Florida City Restaurant stands at the historic culinary crossroads where mainland Florida meets the Overseas Highway and Everglades wilderness. We serve timeless American diner favorites infused with tropical coastal warmth.
          </p>
        </div>

        {/* 3 Editorial Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
                <Citrus className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display mb-3">
                Homestead Grove Sourcing
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Just miles down the road lie Homestead's fertile agricultural groves. We partner directly with family farms for sweet bell peppers, heirloom tomatoes, Key limes, and orange blossom honey delivered fresh each morning.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-700/60 text-xs text-amber-400 font-mono-nums">
              01. 100% Farm-To-Table Citrus & Greens
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-6">
                <Fish className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display mb-3">
                Keys & Gulf Fresh Catches
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                From Islamorada black grouper to Gulf wild jumbo shrimp and tender conch, our seafood is caught sustainably and seasoned with our proprietary 9-spice Key rub before hitting the searing cast-iron grill.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-700/60 text-xs text-sky-400 font-mono-nums">
              02. Delivered Daily from Coastal Docks
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display mb-3">
                Citrus Wood Smokehouse
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our ribs and pork shoulders are smoked low and slow over Florida grapefruit and orange hardwood for 6 hours. The natural fruitwood imparts a subtle sweet aroma unlike heavy hickory.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-700/60 text-xs text-emerald-400 font-mono-nums">
              03. Smoked Daily In-House
            </div>
          </div>
        </div>

        {/* Milestone Bar */}
        <div className="mt-16 p-6 rounded-2xl bg-slate-800/40 border border-slate-700/40 flex flex-wrap items-center justify-between gap-6 text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-amber-400" />
            <span>Mile Marker 0 Highway Confluence: US-1 & Card Sound Road</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Health & Safety Inspected · 5-Star Cleanliness Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Voted Best Key Lime Pie in South Miami-Dade</span>
          </div>
        </div>
      </div>
    </section>
  );
};
