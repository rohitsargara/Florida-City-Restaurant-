/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem } from '../types/restaurant';

export const MENU_CATEGORIES = [
  { id: 'all', label: 'Full Menu' },
  { id: 'handhelds', label: 'Burgers & Handhelds' },
  { id: 'seafood', label: 'Coastal Seafood & Dinners' },
  { id: 'breakfast', label: 'Southern Breakfast' },
  { id: 'starters', label: 'Starters & Sides' },
  { id: 'desserts', label: 'Key Lime & Desserts' },
  { id: 'drinks', label: 'Tropical Drinks & Shakes' },
] as const;

export const MENU_ITEMS: MenuItem[] = [
  // Handhelds
  {
    id: 'fcr-classic-burger',
    name: 'Florida City Smash Cheeseburger',
    category: 'handhelds',
    price: 14.95,
    description: 'Double Angus smashed patties, melted Florida sharp cheddar, butter lettuce, ripe Homestead tomato, caramelized sweet onions, house diner relish on a toasted brioche bun.',
    badge: 'House Signature',
    calories: 780,
    ingredients: ['Double Angus Beef', 'Sharp Cheddar', 'Homestead Tomato', 'Butter Lettuce', 'Sweet Relish', 'Brioche Bun'],
    allergens: ['Dairy', 'Gluten'],
    isPopular: true,
    options: [
      {
        name: 'Burger Doneness',
        choices: [
          { label: 'Medium', priceDelta: 0 },
          { label: 'Medium-Well', priceDelta: 0 },
          { label: 'Well Done', priceDelta: 0 },
        ],
      },
      {
        name: 'Side Choice',
        choices: [
          { label: 'Seasoned Steak Fries', priceDelta: 0 },
          { label: 'Crispy Sweet Potato Fries', priceDelta: 1.5 },
          { label: 'Homestyle Onion Rings', priceDelta: 2.0 },
          { label: 'Fresh Citrus Slaw', priceDelta: 0 },
        ],
      },
    ],
  },
  {
    id: 'blackened-grouper-sandwich',
    name: 'Everglades Blackened Grouper Sandwich',
    category: 'handhelds',
    price: 18.5,
    description: 'Fresh Gulf black grouper seared with our 9-spice Key blend, grilled pineapple-mango slaw, sliced avocado, and house remoulade on a toasted artisan hoagie.',
    badge: 'Fresh Catch',
    calories: 640,
    ingredients: ['Gulf Black Grouper', '9-Spice Rub', 'Mango Slaw', 'Avocado', 'House Remoulade', 'Artisan Hoagie'],
    allergens: ['Fish', 'Gluten', 'Eggs'],
    isPopular: true,
    options: [
      {
        name: 'Preparation Style',
        choices: [
          { label: 'Cajun Blackened', priceDelta: 0 },
          { label: 'Charcoal Grilled', priceDelta: 0 },
          { label: 'Golden Fried', priceDelta: 0 },
        ],
      },
      {
        name: 'Side Choice',
        choices: [
          { label: 'Seasoned Steak Fries', priceDelta: 0 },
          { label: 'Crispy Sweet Potato Fries', priceDelta: 1.5 },
          { label: 'Homestyle Onion Rings', priceDelta: 2.0 },
        ],
      },
    ],
  },
  {
    id: 'key-largo-cuban-sandwich',
    name: 'Florida Keys Pressed Cuban',
    category: 'handhelds',
    price: 14.25,
    description: 'Slow-roasted mojo marinated pork shoulder, shaved glazed ham, Swiss cheese, kosher dill pickles, and yellow deli mustard pressed crisp on authentic Cuban bread.',
    badge: 'Local Legend',
    calories: 720,
    ingredients: ['Mojo Pulled Pork', 'Glazed Ham', 'Swiss Cheese', 'Dill Pickles', 'Mustard', 'Cuban Bread'],
    allergens: ['Dairy', 'Gluten'],
    isPopular: true,
    options: [
      {
        name: 'Side Choice',
        choices: [
          { label: 'Seasoned Steak Fries', priceDelta: 0 },
          { label: 'Plantain Chips with Mojo', priceDelta: 1.0 },
          { label: 'Homestyle Onion Rings', priceDelta: 2.0 },
        ],
      },
    ],
  },
  {
    id: 'gator-alley-chicken-club',
    name: 'Buttermilk Fried Crispy Chicken Club',
    category: 'handhelds',
    price: 15.0,
    description: '24-hour buttermilk soaked chicken breast fried golden crisp, Applewood smoked bacon, pepper jack cheese, pickled jalapeño honey drizzle on a potato bun.',
    calories: 790,
    ingredients: ['Buttermilk Chicken', 'Applewood Bacon', 'Pepper Jack', 'Hot Honey', 'Potato Roll'],
    allergens: ['Dairy', 'Gluten'],
  },

  // Seafood & Dinners
  {
    id: 'key-west-mahi-mahi',
    name: 'Pan-Seared Key West Mahi-Mahi',
    category: 'seafood',
    price: 24.95,
    description: 'Wild-caught mahi-mahi filet served over creamy coconut jasmine rice, grilled asparagus, and topped with a roasted sweet corn and Florida citrus beurre blanc.',
    badge: 'Chef Choice',
    calories: 610,
    ingredients: ['Wild Mahi-Mahi', 'Coconut Jasmine Rice', 'Grilled Asparagus', 'Citrus Beurre Blanc'],
    allergens: ['Fish', 'Dairy'],
    isPopular: true,
  },
  {
    id: 'crispy-jumbo-gulf-shrimp',
    name: 'Crispy Jumbo Gulf Shrimp Platter',
    category: 'seafood',
    price: 21.5,
    description: 'Eight wild jumbo Gulf shrimp hand-battered in seasoned cornmeal, served with hushpuppies, key lime cocktail sauce, and Old Bay boardwalk fries.',
    calories: 820,
    ingredients: ['Jumbo Gulf Shrimp', 'Cornmeal Breading', 'Hushpuppies', 'Key Lime Cocktail Sauce', 'Steak Fries'],
    allergens: ['Shellfish', 'Gluten', 'Eggs'],
  },
  {
    id: 'homestead-smoked-ribs',
    name: 'Florida City Smokehouse Half-Rack Ribs',
    category: 'seafood',
    price: 23.5,
    description: 'St. Louis cut ribs slow-smoked over Florida citrus wood for 6 hours, basted in tangy guava chipotle BBQ glaze, served with southern mac & cheese and cornbread.',
    badge: 'Smoked Daily',
    calories: 950,
    ingredients: ['Citrus Wood Smoked Pork Ribs', 'Guava BBQ Glaze', 'Southern Mac & Cheese', 'Warm Cornbread'],
    allergens: ['Dairy', 'Gluten'],
    isPopular: true,
  },

  // Breakfast
  {
    id: 'southern-biscuit-benedict',
    name: 'Everglades Biscuit Benedict',
    category: 'breakfast',
    price: 13.95,
    description: 'Flaky scratch buttermilk biscuits split and topped with griddled country ham, two farm-fresh poached eggs, and our signature rich country sausage gravy.',
    badge: 'Morning Favorite',
    calories: 760,
    ingredients: ['Scratch Biscuits', 'Country Ham', 'Poached Eggs', 'Sausage Gravy', 'Homestyle Potatoes'],
    allergens: ['Dairy', 'Gluten', 'Eggs'],
    isPopular: true,
  },
  {
    id: 'florida-citrus-french-toast',
    name: 'Orange Grove Brioche French Toast',
    category: 'breakfast',
    price: 12.75,
    description: 'Thick-cut golden brioche dipped in vanilla-cinnamon custard, seared on the flat top, topped with fresh Florida strawberries, orange honey butter, and pure maple syrup.',
    calories: 680,
    ingredients: ['Brioche Bread', 'Vanilla Custard', 'Florida Strawberries', 'Orange Blossom Butter'],
    allergens: ['Dairy', 'Gluten', 'Eggs'],
  },
  {
    id: 'homestead-farmers-omelette',
    name: 'Homestead Farmhouse 3-Egg Omelette',
    category: 'breakfast',
    price: 13.5,
    description: 'Packed with local sweet bell peppers, caramelized onions, smoked bacon, cheddar jack cheese, served with crispy hash browns and buttered toast.',
    calories: 640,
    ingredients: ['Farm Eggs', 'Bell Peppers', 'Caramelized Onions', 'Smoked Bacon', 'Cheddar Jack'],
    allergens: ['Dairy', 'Eggs'],
  },

  // Starters
  {
    id: 'florida-conch-fritters',
    name: 'Famous Conch Fritters (6 pcs)',
    category: 'starters',
    price: 11.95,
    description: 'Tender Queen conch diced with sweet bell peppers, red onion, and herbs, fried golden brown and paired with our spicy calypso dipping sauce.',
    badge: 'Florida Classic',
    calories: 450,
    ingredients: ['Conch', 'Sweet Peppers', 'Herbs', 'Calypso Remoulade'],
    allergens: ['Shellfish', 'Gluten', 'Eggs'],
    isPopular: true,
  },
  {
    id: 'crispy-loaded-yuca-fries',
    name: 'Crispy Garlic Yuca Fries',
    category: 'starters',
    price: 8.95,
    description: 'Steamed then fried cassava sticks tossed in sea salt, cilantro, and served with a zesty garlic mojo dipping emulsion.',
    calories: 410,
    ingredients: ['Cassava Yuca', 'Garlic Mojo', 'Cilantro', 'Sea Salt'],
  },
  {
    id: 'fried-green-tomatoes',
    name: 'Southern Fried Green Tomatoes',
    category: 'starters',
    price: 9.75,
    description: 'Thick slices of unripened Homestead green tomatoes in crispy cornmeal crust, topped with goat cheese crumbles and hot pepper jelly.',
    calories: 390,
    ingredients: ['Green Tomatoes', 'Cornmeal Crust', 'Goat Cheese', 'Pepper Jelly'],
    allergens: ['Dairy', 'Gluten'],
  },

  // Desserts
  {
    id: 'authentic-key-lime-pie',
    name: 'World Famous Florida Key Lime Pie',
    category: 'desserts',
    price: 8.5,
    description: 'Authentic recipe made with genuine Key lime juice, sweet condensed cream, in a buttery brown sugar graham cracker crust topped with torched vanilla meringue.',
    badge: 'World Famous',
    calories: 520,
    ingredients: ['Authentic Key Lime Juice', 'Graham Crust', 'Brown Sugar', 'Whipped Cream', 'Lime Zest'],
    allergens: ['Dairy', 'Gluten', 'Eggs'],
    isPopular: true,
  },
  {
    id: 'warm-peach-blackberry-cobbler',
    name: 'Southern Skillet Fruit Cobbler',
    category: 'desserts',
    price: 9.0,
    description: 'Baked in cast iron with brown sugar crumble, served warm with a generous scoop of vanilla bean ice cream and caramel drizzle.',
    calories: 580,
    ingredients: ['Peaches', 'Blackberries', 'Brown Sugar Crumble', 'Vanilla Ice Cream'],
    allergens: ['Dairy', 'Gluten'],
  },

  // Drinks
  {
    id: 'florida-citrus-sweet-tea',
    name: 'Homestead Orange Blossom Sweet Tea',
    category: 'drinks',
    price: 3.75,
    description: 'Fresh brewed southern black tea infused with local orange blossom honey and fresh lemon wheel. Served over crushed ice.',
    calories: 110,
    ingredients: ['Black Tea', 'Orange Blossom Honey', 'Fresh Lemon'],
  },
  {
    id: 'frozen-key-lime-shake',
    name: 'Signature Key Lime Milkshake',
    category: 'drinks',
    price: 6.95,
    description: 'Hand-spun vanilla custard blended with authentic Key lime curd, rimmed with crushed graham cracker crumbs and whipped cream.',
    badge: 'Must Try',
    calories: 490,
    ingredients: ['Vanilla Custard', 'Key Lime Curd', 'Graham Cracker Rim', 'Whipped Cream'],
    allergens: ['Dairy', 'Gluten'],
    isPopular: true,
  },
  {
    id: 'fresh-squeezed-lemonade',
    name: 'Florida Grove Strawberry Lemonade',
    category: 'drinks',
    price: 4.5,
    description: 'Squeezed fresh daily with ripe local strawberries, pure cane sugar, and chilled filtered water.',
    calories: 140,
    ingredients: ['Fresh Lemon Juice', 'Florida Strawberries', 'Cane Sugar'],
  },
];
