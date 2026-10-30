/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, CheckCircle, Calculator, Users } from 'lucide-react';
import { soundFx } from '../utils/audioSynthesizer';

interface CateringModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CateringModal: React.FC<CateringModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [guestCount, setGuestCount] = useState(25);
  const [packageType, setPackageType] = useState<'classic_diner' | 'keys_seafood' | 'smokehouse_bbq'>('smokehouse_bbq');
  const [includeDessert, setIncludeDessert] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [organizerName, setOrganizerName] = useState('');
  const [organizerPhone, setOrganizerPhone] = useState('');

  const packagePrices = {
    classic_diner: 16.5,
    keys_seafood: 24.0,
    smokehouse_bbq: 21.0,
  };

  const dessertCost = includeDessert ? 4.5 : 0;
  const pricePerPerson = packagePrices[packageType] + dessertCost;
  const estimatedTotal = guestCount * pricePerPerson;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playBell();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-lg text-slate-900 font-display">
              Catering & Group Quote
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 font-display">
              Inquiry Sent Successfully!
            </h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              Our catering director will contact {organizerName} at {organizerPhone} within 2 business hours to confirm your custom menu and event logistics.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Guest Count: <span className="font-mono-nums text-amber-600 font-extrabold">{guestCount} people</span>
              </label>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Catering Package
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPackageType('classic_diner')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    packageType === 'classic_diner'
                      ? 'border-amber-500 bg-amber-50 font-bold text-slate-900'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <div>Diner Classics</div>
                  <div className="font-mono-nums font-semibold mt-0.5">$16.50/pp</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPackageType('smokehouse_bbq')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    packageType === 'smokehouse_bbq'
                      ? 'border-amber-500 bg-amber-50 font-bold text-slate-900'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <div>Citrus BBQ</div>
                  <div className="font-mono-nums font-semibold mt-0.5">$21.00/pp</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPackageType('keys_seafood')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    packageType === 'keys_seafood'
                      ? 'border-amber-500 bg-amber-50 font-bold text-slate-900'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <div>Keys Seafood</div>
                  <div className="font-mono-nums font-semibold mt-0.5">$24.00/pp</div>
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeDessert}
                onChange={(e) => setIncludeDessert(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span>Include Authentic Florida Key Lime Pie slices (+ $4.50/person)</span>
            </label>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-500 uppercase font-semibold">Estimated Quote</div>
                <div className="text-xs text-slate-600">(${pricePerPerson.toFixed(2)} / person)</div>
              </div>
              <div className="text-xl font-extrabold text-slate-900 font-mono-nums">
                ${estimatedTotal.toFixed(2)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Organizer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Adams"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(305) 555-0188"
                  value={organizerPhone}
                  onChange={(e) => setOrganizerPhone(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow"
            >
              Request Custom Catering Proposal
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
