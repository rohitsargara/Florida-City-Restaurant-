/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TableInfo, ReviewItem } from '../types/restaurant';

export const RESTAURANT_INFO = {
  name: 'Florida City Restaurant',
  tagline: 'Hearty American Diner & Florida Keys Coastal Classics',
  address: '1209 NW 9th Ave, Florida City, FL 33034',
  coordinates: {
    lat: 25.4591503,
    lng: -80.4916111,
  },
  phone: '(305) 246-8000',
  email: 'info@floridacityrestaurant.com',
  rating: 4.8,
  reviewCount: 784,
  priceRange: '$$ · $10 - $25 per person',
  googleMapsUrl: 'https://www.google.com/maps/place/Florida+City+Restaurant/@25.4591503,-80.4916111,17z',
  hours: [
    { day: 'Monday', time: '7:00 AM – 10:00 PM' },
    { day: 'Tuesday', time: '7:00 AM – 10:00 PM' },
    { day: 'Wednesday', time: '7:00 AM – 10:00 PM' },
    { day: 'Thursday', time: '7:00 AM – 10:00 PM' },
    { day: 'Friday', time: '7:00 AM – 11:00 PM' },
    { day: 'Saturday', time: '7:00 AM – 11:00 PM' },
    { day: 'Sunday', time: '7:00 AM – 10:00 PM' },
  ],
  features: [
    'Outdoor Tropical Patio Seating',
    'Curbside Pickup & Fast Delivery',
    '3D Interactive Table Reservations',
    'Full Bar & Florida Craft Beers',
    'RV & Keys Roadtrip Free Parking',
    'Wheelchair Accessible',
  ],
};

export const RESTAURANT_TABLES: TableInfo[] = [
  // Tropical Patio
  { id: 'tbl-p1', number: 1, zone: 'Tropical Patio', capacity: 4, status: 'available', x: -6, z: 4, shape: 'round' },
  { id: 'tbl-p2', number: 2, zone: 'Tropical Patio', capacity: 4, status: 'available', x: -3, z: 4, shape: 'round' },
  { id: 'tbl-p3', number: 3, zone: 'Tropical Patio', capacity: 2, status: 'reserved', x: 0, z: 4, shape: 'round' },
  { id: 'tbl-p4', number: 4, zone: 'Tropical Patio', capacity: 6, status: 'available', x: 3.5, z: 4.2, shape: 'long' },

  // Main Diner Booths
  { id: 'tbl-m1', number: 5, zone: 'Main Diner', capacity: 4, status: 'available', x: -6, z: -1, shape: 'booth' },
  { id: 'tbl-m2', number: 6, zone: 'Main Diner', capacity: 4, status: 'reserved', x: -2.5, z: -1, shape: 'booth' },
  { id: 'tbl-m3', number: 7, zone: 'Main Diner', capacity: 4, status: 'available', x: 1, z: -1, shape: 'booth' },
  { id: 'tbl-m4', number: 8, zone: 'Main Diner', capacity: 6, status: 'available', x: 5, z: -1, shape: 'booth' },

  // Citrus Bar High-Tops
  { id: 'tbl-b1', number: 9, zone: 'Citrus Bar', capacity: 2, status: 'available', x: -5, z: -5, shape: 'high_top' },
  { id: 'tbl-b2', number: 10, zone: 'Citrus Bar', capacity: 2, status: 'available', x: -2, z: -5, shape: 'high_top' },

  // Keys Veranda
  { id: 'tbl-v1', number: 11, zone: 'Veranda', capacity: 8, status: 'available', x: 2.5, z: -5, shape: 'long' },
  { id: 'tbl-v2', number: 12, zone: 'Veranda', capacity: 4, status: 'reserved', x: 6, z: -5, shape: 'round' },
];

export const REVIEWS_DATA: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Marcus Vance',
    rating: 5,
    relativeTime: '2 days ago',
    avatarLetter: 'M',
    badge: 'Local Guide · 142 reviews',
    text: 'If you are driving down to the Keys or visiting the Everglades, this is the absolute must-stop spot in Florida City! The Smash Cheeseburger is arguably the juiciest burger south of Miami, and the Key Lime pie has that authentic tart balance with torched meringue. Friendly retro diner hospitality.',
    visitType: 'Dine-in · Lunch',
    dishesMentioned: ['Florida City Smash Cheeseburger', 'World Famous Key Lime Pie', 'Steak Fries'],
  },
  {
    id: 'rev-2',
    author: 'Elena Rostova',
    rating: 5,
    relativeTime: '1 week ago',
    avatarLetter: 'E',
    badge: 'Verified Customer',
    text: 'We sat out on the tropical patio under the festoon lights. Amazing ambiance with palm trees and gentle evening breeze. The blackened grouper sandwich was out of this world fresh, and my husband raved about the citrus wood smoked ribs.',
    visitType: 'Dine-in · Dinner',
    dishesMentioned: ['Everglades Blackened Grouper Sandwich', 'Florida City Smokehouse Half-Rack Ribs'],
  },
  {
    id: 'rev-3',
    author: 'Darren Hayes',
    rating: 5,
    relativeTime: '3 weeks ago',
    avatarLetter: 'D',
    badge: 'Roadtripper',
    text: 'Stopped here for breakfast on our way to Key West. The Everglades Biscuit Benedict with scratch country gravy fueled us all day. Great coffee, speedy warm service, and tons of parking. 10/10.',
    visitType: 'Dine-in · Breakfast',
    dishesMentioned: ['Everglades Biscuit Benedict', 'Homestead Orange Blossom Sweet Tea'],
  },
  {
    id: 'rev-4',
    author: 'Carmen Delgado',
    rating: 5,
    relativeTime: '1 month ago',
    avatarLetter: 'C',
    badge: 'Homestead Resident',
    text: 'Order takeout online through their system all the time. Food is consistently hot, generous portions, and the conch fritters taste like you are right on the dock in Key West. Love supporting our Florida City staple.',
    visitType: 'Takeout',
    dishesMentioned: ['Famous Conch Fritters', 'Key Lime Milkshake'],
  },
];
