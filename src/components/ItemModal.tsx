/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MenuItem, CartItemOption } from '../types/restaurant';
import { X, Plus, Minus, Check } from 'lucide-react';
import { soundFx } from '../utils/audioSynthesizer';

interface ItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    quantity: number,
    selectedOptions: CartItemOption[],
    specialInstructions?: string
  ) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, onClose, onAddToCart }) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, { label: string; priceDelta: number }>>(() => {
    const initial: Record<string, { label: string; priceDelta: number }> = {};
    item.options?.forEach((opt) => {
      if (opt.choices.length > 0) {
        initial[opt.name] = opt.choices[0];
      }
    });
    return initial;
  });
  const [specialInstructions, setSpecialInstructions] = useState('');

  const calculateTotal = () => {
    let optionsDelta = 0;
    Object.values(selectedChoices).forEach((choice) => {
      optionsDelta += choice.priceDelta;
    });
    return (item.price + optionsDelta) * quantity;
  };

  const handleAdd = () => {
    soundFx.playBell();
    const optionsArray: CartItemOption[] = Object.entries(selectedChoices).map(([name, choice]) => ({
      optionName: name,
      choiceLabel: choice.label,
      priceDelta: choice.priceDelta,
    }));
    onAddToCart(item, quantity, optionsArray, specialInstructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="text-xs uppercase font-bold text-amber-600 tracking-wider mb-1">
              {item.category.toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">{item.name}</h2>
            <div className="text-sm font-bold text-slate-900 font-mono-nums mt-1">
              ${item.price.toFixed(2)}
              {item.calories && <span className="text-slate-400 font-normal ml-2">· {item.calories} cal</span>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>

          {/* Ingredients list */}
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Key Ingredients
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs text-slate-600">
              {item.ingredients.map((ing, i) => (
                <span key={i} className="inline-flex items-center">
                  <span>{ing}</span>
                  {i < item.ingredients.length - 1 && <span className="mx-1.5 text-slate-300">·</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Allergens warning */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700">Contains:</span> {item.allergens.join(', ')}
            </div>
          )}

          {/* Options / Customizations */}
          {item.options &&
            item.options.map((opt, optIndex) => (
              <div key={optIndex} className="pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  {opt.name}
                </div>
                <div className="space-y-2">
                  {opt.choices.map((choice, cIndex) => {
                    const isSelected = selectedChoices[opt.name]?.label === choice.label;
                    return (
                      <label
                        key={cIndex}
                        onClick={() => {
                          soundFx.playClick();
                          setSelectedChoices((prev) => ({
                            ...prev,
                            [opt.name]: choice,
                          }));
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/50 text-slate-900'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 text-sm font-medium">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span>{choice.label}</span>
                        </div>
                        {choice.priceDelta > 0 && (
                          <span className="text-xs font-mono-nums text-slate-500 font-semibold">
                            +${choice.priceDelta.toFixed(2)}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* Special Instructions Input */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Kitchen Instructions / Modifications
            </label>
            <input
              type="text"
              placeholder="e.g. Sauce on the side, extra crispy fries, allergy notes..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => {
                soundFx.playClick();
                setQuantity((q) => Math.max(1, q - 1));
              }}
              disabled={quantity <= 1}
              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-sm text-slate-900 font-mono-nums w-5 text-center">
              {quantity}
            </span>
            <button
              onClick={() => {
                soundFx.playClick();
                setQuantity((q) => q + 1);
              }}
              className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="flex-1 py-3 px-6 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow flex items-center justify-between"
          >
            <span>Add to Order</span>
            <span className="font-mono-nums font-extrabold">${calculateTotal().toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
