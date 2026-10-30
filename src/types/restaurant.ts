/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  category: 'handhelds' | 'breakfast' | 'seafood' | 'starters' | 'desserts' | 'drinks';
  price: number;
  description: string;
  badge?: string; // e.g. "Signature", "Fresh Catch", "Local Favorite"
  spicy?: boolean;
  calories?: number;
  ingredients: string[];
  allergens?: string[];
  options?: {
    name: string;
    choices: { label: string; priceDelta: number }[];
  }[];
  isPopular?: boolean;
}

export interface CartItemOption {
  optionName: string;
  choiceLabel: string;
  priceDelta: number;
}

export interface CartItem {
  id: string; // unique item id in cart
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: CartItemOption[];
  specialInstructions?: string;
  itemTotal: number;
}

export interface TableInfo {
  id: string;
  number: number;
  zone: 'Main Diner' | 'Tropical Patio' | 'Citrus Bar' | 'Veranda';
  capacity: number;
  status: 'available' | 'reserved' | 'selected';
  x: number;
  z: number;
  shape: 'round' | 'booth' | 'high_top' | 'long';
}

export interface ReservationRequest {
  fullName: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  partySize: number;
  tableZone: string;
  tableId?: string;
  tableNumber?: number;
  specialRequests?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  relativeTime: string;
  avatarLetter: string;
  badge?: string;
  text: string;
  visitType: string;
  dishesMentioned: string[];
}

export type ThreeSceneMode = 'restaurant' | 'dish' | 'floorplan';
export type LightingPreset = 'sunset' | 'night' | 'noon';
export type CameraPreset = 'orbit' | 'terrace' | 'dish' | 'aerial';
