/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CartItem } from '../types/restaurant';
import { RESTAURANT_INFO } from '../data/restaurantInfo';
import { soundFx } from '../utils/audioSynthesizer';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Clock,
  MapPin,
  CheckCircle,
  Truck,
  Store,
  ArrowRight,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    customerName: string;
    total: number;
    estimatedTime: string;
  } | null>(null);

  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const tax = subtotal * 0.07; // Florida 7% tax
  const deliveryFee = orderType === 'delivery' ? (subtotal > 45 ? 0 : 3.99) : 0;
  const tipAmount = (subtotal * tipPercent) / 100;
  const grandTotal = subtotal + tax + deliveryFee + tipAmount;

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    soundFx.playBell();
    const orderNum = `FCR-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedOrder({
      orderNumber: orderNum,
      customerName,
      total: grandTotal,
      estimatedTime: orderType === 'pickup' ? '15 - 20 mins' : '30 - 45 mins',
    });
    setIsCheckingOut(false);
    onClearCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-900 font-display">Your Order</h2>
            <span className="text-xs text-slate-500 font-mono-nums">({items.length} items)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {confirmedOrder ? (
          // Order Receipt State
          <div className="p-8 text-center flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700 font-mono-nums">
              Order {confirmedOrder.orderNumber} Confirmed!
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-display">
              Thank you, {confirmedOrder.customerName}!
            </h3>
            <p className="text-sm text-slate-600 max-w-xs leading-relaxed">
              The kitchen at Florida City Restaurant has received your ticket and is preparing your meal fresh.
            </p>

            <div className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Estimated Ready:</span>
                <span className="font-bold text-slate-900">{confirmedOrder.estimatedTime}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Paid:</span>
                <span className="font-bold text-slate-900 font-mono-nums">${confirmedOrder.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Location:</span>
                <span className="font-semibold text-slate-900">1209 NW 9th Ave, Florida City</span>
              </div>
            </div>

            <a
              href={RESTAURANT_INFO.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Get Directions on Google Maps</span>
            </a>

            <button
              onClick={() => {
                setConfirmedOrder(null);
                onClose();
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 pt-2"
            >
              Close Receipt
            </button>
          </div>
        ) : isCheckingOut ? (
          // Checkout Form State
          <form onSubmit={handleCompleteOrder} className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Complete Your Order</h3>
              <button
                type="button"
                onClick={() => setIsCheckingOut(false)}
                className="text-xs text-amber-600 font-semibold hover:underline"
              >
                Back to cart
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Jenkins"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number (for SMS updates) *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. (305) 555-0192"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:border-amber-500 focus:outline-none"
              />
            </div>

            {orderType === 'delivery' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Delivery Address in Florida City / Homestead *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Street address, unit/apt, entry gate code..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:border-amber-500 focus:outline-none"
                />
              </div>
            )}

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono-nums">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>FL Sales Tax (7%):</span>
                <span className="font-mono-nums">${tax.toFixed(2)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee:</span>
                  <span className="font-mono-nums">{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Staff Gratuity ({tipPercent}%):</span>
                <span className="font-mono-nums">${tipAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200 text-sm">
                <span>Total to Pay:</span>
                <span className="font-mono-nums font-extrabold text-amber-600">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow"
            >
              Confirm & Submit Ticket (${grandTotal.toFixed(2)})
            </button>
          </form>
        ) : (
          // Normal Cart List State
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            {/* Delivery vs Pickup Toggle */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setOrderType('pickup');
                }}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                  orderType === 'pickup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Curbside Pickup</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setOrderType('delivery');
                }}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                  orderType === 'delivery' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Local Delivery</span>
              </button>
            </div>

            {items.length === 0 ? (
              <div className="py-20 text-center text-slate-500 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-medium">Your basket is currently empty.</p>
                <p className="text-xs text-slate-400">Add a signature burger, coastal grouper, or Key lime dessert.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col justify-between gap-2 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 font-display leading-snug">
                          {item.menuItem.name}
                        </h4>
                        <div className="text-xs text-slate-500 font-mono-nums mt-0.5">
                          ${item.menuItem.price.toFixed(2)} each
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Options list */}
                    {item.selectedOptions.length > 0 && (
                      <div className="text-[11px] text-slate-500 space-y-0.5">
                        {item.selectedOptions.map((opt, i) => (
                          <div key={i} className="flex justify-between">
                            <span>· {opt.choiceLabel}</span>
                            {opt.priceDelta > 0 && (
                              <span className="font-mono-nums">+${opt.priceDelta.toFixed(2)}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {item.specialInstructions && (
                      <div className="text-[11px] text-slate-400 italic">
                        Note: "{item.specialInstructions}"
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="text-slate-600 hover:text-slate-900"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-slate-900 font-mono-nums w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="text-slate-600 hover:text-slate-900"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="font-bold text-sm text-slate-900 font-mono-nums">
                        ${item.itemTotal.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Checkout Action Container */}
        {!confirmedOrder && !isCheckingOut && items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3.5">
            {/* Tip selector */}
            <div>
              <div className="flex justify-between text-xs text-slate-600 font-medium mb-1.5">
                <span>Add Kitchen & Server Tip:</span>
                <span className="font-mono-nums font-bold text-slate-900">${tipAmount.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[15, 18, 20, 0].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => {
                      soundFx.playClick();
                      setTipPercent(pct);
                    }}
                    className={`py-1 text-xs font-bold rounded-lg border transition-all ${
                      tipPercent === pct
                        ? 'bg-amber-500 border-amber-500 text-slate-950'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {pct === 0 ? 'None' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtotals breakdown */}
            <div className="text-xs space-y-1 text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono-nums">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>FL Sales Tax (7%):</span>
                <span className="font-mono-nums">${tax.toFixed(2)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span className="font-mono-nums">{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
              )}
            </div>

            {/* Total and Checkout Button */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 uppercase font-semibold">Total</div>
                <div className="text-xl font-extrabold text-slate-900 font-mono-nums">
                  ${grandTotal.toFixed(2)}
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsCheckingOut(true);
                }}
                className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow flex items-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
