/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menuData';
import { MenuItem, CartItemOption } from '../types/restaurant';
import { Search, Plus, Sparkles, Flame, Fish, Coffee, UtensilsCrossed } from 'lucide-react';
import { soundFx } from '../utils/audioSynthesizer';

interface MenuSectionProps {
  onSelectItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onSelectItem, onQuickAdd }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [popularOnly, setPopularOnly] = useState<boolean>(false);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchPop = !popularOnly || item.isPopular;
      return matchCat && matchSearch && matchPop;
    });
  }, [activeCategory, searchQuery, popularOnly]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'handhelds':
        return <Flame className="w-4 h-4 text-amber-500" />;
      case 'seafood':
        return <Fish className="w-4 h-4 text-sky-500" />;
      case 'breakfast':
        return <Coffee className="w-4 h-4 text-orange-500" />;
      default:
        return <UtensilsCrossed className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <section id="menu" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs uppercase font-bold text-amber-700 tracking-wider mb-2 font-mono-nums">
              Fresh Local Flavors
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
              The Florida City Menu
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              Every dish is crafted fresh on our griddles and wood-smoker using local produce from Homestead and daily catches from the Florida Keys.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search burgers, seafood, pie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white text-xs text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 shadow-sm transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Tabs (Functional segmented controls conforming to Section 1.A) */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-slate-200 overflow-x-auto">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundFx.playClick();
                setActiveCategory(cat.id);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}

          <button
            onClick={() => {
              soundFx.playClick();
              setPopularOnly(!popularOnly);
            }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ml-auto ${
              popularOnly
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Popular Only</span>
          </button>
        </div>

        {/* Product Cards Grid: 3-column desktop layout */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-slate-600 text-sm font-medium">No menu items found matching "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setPopularOnly(false);
              }}
              className="mt-4 px-4 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
              >
                {/* Visual Header with Gradient Theme & Domain Icon */}
                <div className="relative h-44 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/70 p-5 flex flex-col justify-between overflow-hidden">
                  {/* Subtle decorative mesh overlay */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Top Bar inside Card */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono-nums">
                      {getCategoryIcon(item.category)}
                      <span>{item.category}</span>
                    </span>
                    {item.badge && (
                      <span className="text-[11px] font-bold text-white/90 bg-white/15 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Center Dish Silhouette & Title Backdrop */}
                  <div className="relative z-10 mt-auto">
                    <h3 className="text-lg font-bold text-white font-display leading-tight group-hover:text-amber-300 transition-colors">
                      {item.name}
                    </h3>
                  </div>
                </div>

                {/* Card Content & Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed Metadata (Zero-Pill) */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-mono-nums">
                      <span>{item.ingredients[0]}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.calories ? `${item.calories} kcal` : 'Chef Fresh'}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Action Strip */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="text-base font-bold text-slate-900 font-mono-nums">
                      ${item.price.toFixed(2)}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          onSelectItem(item);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        Customize
                      </button>

                      <button
                        onClick={() => {
                          soundFx.playBell();
                          onQuickAdd(item);
                        }}
                        className="p-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg transition-colors shadow-sm"
                        title="Quick Add to Order"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
