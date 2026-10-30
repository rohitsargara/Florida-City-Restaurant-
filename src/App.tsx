/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MenuItem, CartItem, CartItemOption, TableInfo } from './types/restaurant';
import { RESTAURANT_TABLES } from './data/restaurantInfo';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ThreeCanvasContainer } from './components/ThreeCanvasContainer';
import { MenuSection } from './components/MenuSection';
import { ItemModal } from './components/ItemModal';
import { CartDrawer } from './components/CartDrawer';
import { ReservationSection } from './components/ReservationSection';
import { StorySection } from './components/StorySection';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  // Table reservation & 3D state
  const [tables, setTables] = useState<TableInfo[]>(RESTAURANT_TABLES);
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null);

  // Smooth scroll helper
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Add customized item to cart
  const handleAddToCart = (
    item: MenuItem,
    quantity: number,
    selectedOptions: CartItemOption[],
    specialInstructions?: string
  ) => {
    let optionsDelta = 0;
    selectedOptions.forEach((opt) => (optionsDelta += opt.priceDelta));
    const singlePrice = item.price + optionsDelta;
    const itemTotal = singlePrice * quantity;

    const newItem: CartItem = {
      id: `${item.id}-${Date.now()}`,
      menuItem: item,
      quantity,
      selectedOptions,
      specialInstructions,
      itemTotal,
    };

    setCartItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  // Quick 1-click addition of base item
  const handleQuickAdd = (item: MenuItem) => {
    const defaultOptions: CartItemOption[] = [];
    if (item.options) {
      item.options.forEach((opt) => {
        if (opt.choices.length > 0) {
          defaultOptions.push({
            optionName: opt.name,
            choiceLabel: opt.choices[0].label,
            priceDelta: opt.choices[0].priceDelta,
          });
        }
      });
    }
    handleAddToCart(item, 1, defaultOptions);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            let optionsDelta = 0;
            item.selectedOptions.forEach((opt) => (optionsDelta += opt.priceDelta));
            const singlePrice = item.menuItem.price + optionsDelta;
            return {
              ...item,
              quantity: newQty,
              itemTotal: singlePrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Handle table selection in 3D scene or from form
  const handleSelectTable = (table: TableInfo) => {
    setSelectedTable(table);
    setTables((prev) =>
      prev.map((t) => ({
        ...t,
        status: t.id === table.id ? 'selected' : t.status === 'selected' ? 'available' : t.status,
      }))
    );
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-amber-500 selection:text-slate-950">
      {/* 3-Zone Top Bar Navigation */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenReservation={() => scrollTo('reservations')}
      />

      {/* Hero Section with Action Triggers */}
      <HeroSection
        onScrollToMenu={() => scrollTo('menu')}
        onScrollTo3D={() => scrollTo('dining-room-3d')}
        onOpenReservation={() => scrollTo('reservations')}
      />

      {/* 3D Interactive Animated Showcase Centerpiece */}
      <section id="dining-room-3d" className="relative scroll-mt-20">
        <ThreeCanvasContainer
          tables={tables}
          selectedTable={selectedTable}
          onSelectTable={handleSelectTable}
          onOpenReservation={() => scrollTo('reservations')}
        />
      </section>

      {/* Restaurant Menu & Online Ordering Section */}
      <MenuSection
        onSelectItem={(item) => setCustomizingItem(item)}
        onQuickAdd={handleQuickAdd}
      />

      {/* Table Reservation Booking Engine (2-Way Synced with 3D Floor Plan) */}
      <ReservationSection
        selectedTable={selectedTable}
        onSelectTable={handleSelectTable}
        onScrollTo3D={() => scrollTo('dining-room-3d')}
      />

      {/* Story & Gateway to the Keys Heritage */}
      <StorySection />

      {/* Guest Reviews & Google Maps Feedback */}
      <ReviewsSection />

      {/* Location, GPS Coordinates, Hours & Driving Directions */}
      <LocationSection />

      {/* Footer */}
      <Footer />

      {/* Item Customization Modal */}
      <ItemModal
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart & Checkout Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
