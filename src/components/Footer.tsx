/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RESTAURANT_INFO } from '../data/restaurantInfo';
import { MapPin, Phone, Mail, Navigation } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <span className="text-lg font-bold text-white font-display">
              Florida City Restaurant
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Authentic American diner fare & fresh Florida Keys coastal specialties at 1209 NW 9th Ave, Florida City, FL.
            </p>
            <div className="text-xs text-amber-400 font-mono-nums">
              Gateway to the Keys · Est. Florida City
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#menu" className="hover:text-white transition-colors">
                  Menu & Takeout
                </a>
              </li>
              <li>
                <a href="#dining-room-3d" className="hover:text-white transition-colors">
                  3D Virtual Dining Room
                </a>
              </li>
              <li>
                <a href="#reservations" className="hover:text-white transition-colors">
                  Table Reservations
                </a>
              </li>
              <li>
                <a href="#story" className="hover:text-white transition-colors">
                  Our Culinary Story
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition-colors">
                  Guest Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Specialties */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Specialties</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Florida City Smash Cheeseburgers</li>
              <li>Everglades Blackened Grouper</li>
              <li>Citrus Wood Smoked BBQ Ribs</li>
              <li>World Famous Key Lime Pie</li>
              <li>Southern Scratch Biscuit Breakfast</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact & Location</h4>
            <div className="space-y-2 text-xs">
              <a
                href={RESTAURANT_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2 hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>1209 NW 9th Ave, Florida City, FL 33034</span>
              </a>
              <a
                href={`tel:${RESTAURANT_INFO.phone}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>(305) 246-8000</span>
              </a>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>info@floridacityrestaurant.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Florida City Restaurant. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#location" className="hover:text-slate-400 transition-colors">
              Hours & Directions
            </a>
            <span aria-hidden="true">·</span>
            <a href={RESTAURANT_INFO.googleMapsUrl} target="_blank" rel="noreferrer" className="hover:text-slate-400 transition-colors">
              Google Maps Listing
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
