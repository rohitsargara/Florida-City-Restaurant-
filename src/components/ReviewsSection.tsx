/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { REVIEWS_DATA, RESTAURANT_INFO } from '../data/restaurantInfo';
import { ReviewItem } from '../types/restaurant';
import { Star, MessageSquarePlus, Check, X } from 'lucide-react';
import { soundFx } from '../utils/audioSynthesizer';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>(REVIEWS_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');
  const [newVisitType, setNewVisitType] = useState('Dine-in · Dinner');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newText) return;

    soundFx.playBell();
    const item: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: newAuthor,
      rating: newRating,
      relativeTime: 'Just now',
      avatarLetter: newAuthor.charAt(0).toUpperCase() || 'G',
      badge: 'Verified Guest',
      text: newText,
      visitType: newVisitType,
      dishesMentioned: ['Florida City Classic Burger', 'World Famous Key Lime Pie'],
    };

    setReviews([item, ...reviews]);
    setIsModalOpen(false);
    setNewAuthor('');
    setNewText('');
  };

  return (
    <section id="reviews" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Header & Google Maps Score Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs uppercase font-bold text-amber-700 tracking-wider mb-2 font-mono-nums">
              Guest Feedback
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
              Loved by Locals & Keys Travelers
            </h2>
            <div className="flex items-center gap-3 mt-3 text-sm text-slate-600">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-extrabold text-slate-900 font-mono-nums">4.8 Overall Rating</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Based on 780+ verified Google Reviews</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundFx.playClick();
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <MessageSquarePlus className="w-4 h-4 text-amber-400" />
              <span>Write a Review</span>
            </button>

            <a
              href={RESTAURANT_INFO.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              View on Google Maps
            </a>
          </div>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
            >
              <div>
                {/* Author & Rating Row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-800 font-extrabold text-sm flex items-center justify-center font-display">
                      {rev.avatarLetter}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{rev.author}</h4>
                      {/* Zero-Pill Unboxed Text */}
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <span>{rev.badge || 'Verified Diner'}</span>
                        <span aria-hidden="true">·</span>
                        <span>{rev.relativeTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  "{rev.text}"
                </p>
              </div>

              {/* Tagged Dishes */}
              <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-400 text-[11px]">{rev.visitType}</span>
                <div className="flex flex-wrap gap-1 text-[11px] text-slate-600 font-medium">
                  {rev.dishesMentioned.map((dish, idx) => (
                    <span key={idx} className="inline-flex items-center">
                      <span className="text-amber-800">#{dish}</span>
                      {idx < rev.dishesMentioned.length - 1 && <span className="mx-1 text-slate-300">·</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for adding review */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-900 font-display">Leave a Review</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Walker"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Star Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 font-mono-nums ml-2">
                      {newRating} / 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Visit Type
                  </label>
                  <select
                    value={newVisitType}
                    onChange={(e) => setNewVisitType(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Dine-in · Lunch">Dine-in · Lunch</option>
                    <option value="Dine-in · Dinner">Dine-in · Dinner</option>
                    <option value="Dine-in · Breakfast">Dine-in · Breakfast</option>
                    <option value="Takeout">Takeout / Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Experience *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell other travelers about the flavors, service, and atmosphere..."
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all shadow"
                >
                  Publish Customer Review
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
