/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenReservation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenReservation,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          className="text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 font-display hover:text-amber-600 transition-colors"
        >
          Florida City Restaurant
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <a
            href="#menu"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Menu
          </a>
          <a
            href="#dining-room-3d"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            3D Dining
          </a>
          <a
            href="#reservations"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Reservations
          </a>
          <a
            href="#story"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Our Story
          </a>
          <a
            href="#location"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Location & Hours
          </a>
        </nav>

        {/* Zone 3: 1 primary action with cart indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCart}
            className="relative p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center font-mono-nums shadow">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenReservation}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Book Table
          </button>
        </div>
      </div>
    </header>
  );
};
