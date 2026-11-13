import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// 01. TYPES & DATA SCHEMA (100% PRESERVED)
// ============================================================================

export interface MenuItemData {
  id: string;
  name: string;
  price: number | null;
  priceNote?: string;
  category: string;
  page: number;
  description?: string;
  imageUrl?: string;
  available?: boolean;
  isVeg?: boolean;
}

export interface PageMetaData {
  pageNumber: number;
  code: string;
  title: string;
  subtitle: string;
  categories: string[];
  heroImage?: {
    url: string;
    caption: string;
  };
  emptySections?: {
    title: string;
    note: string;
  }[];
}

// ============================================================================
// 02. COMPLETE OFFICIAL MENU DATASET (SOURCE OF TRUTH - 153 ITEMS PRESERVED)
// ============================================================================

export const OFFICIAL_PAGES: PageMetaData[] = [
  {
    pageNumber: 1,
    code: '01',
    title: 'Starters & Soups',
    subtitle: 'Crisp Appetisers, Tandoori Preludes & Warming Broths',
    categories: ['STARTERS', 'SOUPS'],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
      caption: 'Char-grilled Paneer Tikka & Crisp Preludes',
    },
  },
  {
    pageNumber: 2,
    code: '02',
    title: 'Noodles & Dal',
    subtitle: 'Wok-Tossed Noodles & Slow-Simmered Lentils',
    categories: ['NOODLES', 'DAL'],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      caption: 'Slow-Simmered Tempered Golden Lentils',
    },
  },
  {
    pageNumber: 3,
    code: '03',
    title: 'Punjabi Paneer Specials',
    subtitle: 'Signature House Gravies & Artisanal Cottage Cheese',
    categories: ['PUNJABI SPECIALS (PANEER)'],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
      caption: 'Artisanal Paneer in Rich Spiced Gravies',
    },
  },
  {
    pageNumber: 4,
    code: '04',
    title: 'Punjabi Kaju & Mushroom',
    subtitle: 'Cashew Delicacies, Mushroom & Marwadi Sev Classics',
    categories: ['PUNJABI SPECIALS (KAJU & MUSHROOM)'],
  },
  {
    pageNumber: 5,
    code: '05',
    title: 'Vegetables',
    subtitle: 'Garden Greens, Handcrafted Koftas & Traditional Subzis',
    categories: ['VEGETABLES'],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
      caption: 'Heirloom Subzis & Spiced Koftas',
    },
  },
  {
    pageNumber: 6,
    code: '06',
    title: 'Rice, Biryani & Pulav',
    subtitle: 'Fragrant Basmati, Dum Biryanis & Comforting Khichdi',
    categories: ['RICE', 'BIRYANI', 'PULAV & KHICHDI'],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      caption: 'Aromatic Saffron Dum Basmati',
    },
  },
  {
    pageNumber: 7,
    code: '07',
    title: 'Chinese, Curd & Lassi',
    subtitle: 'Indo-Chinese Delights, Cooling Curds & Churned Lassi',
    categories: ['CHINESE', 'CURD ITEMS', 'LASSI'],
  },
  {
    pageNumber: 8,
    code: '08',
    title: 'Tandoori Breads & Meals',
    subtitle: 'Clay-Oven Rotis, Naans, Parotas & Traditional Thali',
    categories: ['TANDOORI ITEMS'],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      caption: 'Fresh Clay-Oven Rotis & Stuffed Parotas',
    },
    emptySections: [
      {
        title: 'THALI',
        note: 'Traditional Vegetarian Meal — Ask Steward for Availability',
      },
    ],
  },
];

export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'STARTERS': 'Starters',
  'SOUPS': 'Soups',
  'NOODLES': 'Noodles',
  'DAL': 'Dal Preparations',
  'PUNJABI SPECIALS (PANEER)': 'Punjabi Specials (Paneer)',
  'PUNJABI SPECIALS (KAJU & MUSHROOM)': 'Punjabi Specials (Kaju & Mushroom)',
  'VEGETABLES': 'Vegetable Curries',
  'RICE': 'Fragrant Rice',
  'BIRYANI': 'Dum Biryanis',
  'PULAV & KHICHDI': 'Pulav & Khichdi',
  'CHINESE': 'Indo-Chinese',
  'CURD ITEMS': 'Curd Items',
  'LASSI': 'Lassi & Coolers',
  'TANDOORI ITEMS': 'Tandoori Breads',
};

export const OFFICIAL_MENU_DATA: MenuItemData[] = [
  // PAGE 01: STARTERS (24 items)
  { id: 'p1-st-01', name: 'Roasted Papad', price: 30, category: 'STARTERS', page: 1 },
  { id: 'p1-st-02', name: 'Masala Papad', price: 40, category: 'STARTERS', page: 1 },
  { id: 'p1-st-03', name: 'Papad Suri', price: 130, category: 'STARTERS', page: 1 },
  { id: 'p1-st-04', name: 'Gobi Manchurian', price: 120, category: 'STARTERS', page: 1 },
  { id: 'p1-st-05', name: 'Veg Manchurian', price: 160, category: 'STARTERS', page: 1 },
  { id: 'p1-st-06', name: 'Paneer Chilli', price: 170, category: 'STARTERS', page: 1 },
  { id: 'p1-st-07', name: 'Paneer Manchurian', price: 160, category: 'STARTERS', page: 1 },
  { id: 'p1-st-08', name: 'Paneer Sute', price: 200, category: 'STARTERS', page: 1 },
  { id: 'p1-st-09', name: 'Paneer Pepper Dry', price: 145, category: 'STARTERS', page: 1 },
  { id: 'p1-st-10', name: 'Mushroom Manchurian', price: 135, category: 'STARTERS', page: 1 },
  { id: 'p1-st-11', name: 'Mushroom Chilli', price: 140, category: 'STARTERS', page: 1 },
  { id: 'p1-st-12', name: 'Mushroom Pepper Dry', price: 130, category: 'STARTERS', page: 1 },
  { id: 'p1-st-13', name: 'Baby Corn Manchurian', price: 135, category: 'STARTERS', page: 1 },
  { id: 'p1-st-14', name: 'Baby Corn Chilli', price: 145, category: 'STARTERS', page: 1 },
  { id: 'p1-st-15', name: 'Baby Corn Pepper Dry', price: 130, category: 'STARTERS', page: 1 },
  { id: 'p1-st-16', name: 'American Corn Dry', price: 160, category: 'STARTERS', page: 1 },
  { id: 'p1-st-17', name: 'Finger Chips', price: 100, category: 'STARTERS', page: 1 },
  { id: 'p1-st-18', name: 'Paneer 65', price: 160, category: 'STARTERS', page: 1 },
  { id: 'p1-st-19', name: 'Paneer Pakoda', price: 150, category: 'STARTERS', page: 1 },
  { id: 'p1-st-20', name: 'Veg Crispi', price: 160, category: 'STARTERS', page: 1 },
  { id: 'p1-st-21', name: 'Mix Pakoda', price: 120, category: 'STARTERS', page: 1 },
  { id: 'p1-st-22', name: 'Paneer Tikka Dry (Tandoor)', price: 250, category: 'STARTERS', page: 1 },
  { id: 'p1-st-23', name: 'Arabarn Kabab', price: 220, category: 'STARTERS', page: 1 },
  { id: 'p1-st-24', name: 'Palak Pakoda', price: 110, category: 'STARTERS', page: 1 },

  // PAGE 01: SOUPS (6 items)
  { id: 'p1-sp-01', name: 'Veg Manchow Soup', price: 120, category: 'SOUPS', page: 1 },
  { id: 'p1-sp-02', name: 'Hot and Sour Soup', price: 130, category: 'SOUPS', page: 1 },
  { id: 'p1-sp-03', name: 'Tomato Soup', price: 100, category: 'SOUPS', page: 1 },
  { id: 'p1-sp-04', name: 'Garlic Soup', price: 130, category: 'SOUPS', page: 1 },
  { id: 'p1-sp-05', name: 'Lemon Coriander Soup', price: 120, category: 'SOUPS', page: 1 },
  { id: 'p1-sp-06', name: 'Sweet Corn Soup', price: 120, category: 'SOUPS', page: 1 },

  // PAGE 02: NOODLES (2 items)
  { id: 'p2-nd-01', name: 'Veg Noodles', price: 130, category: 'NOODLES', page: 2 },
  { id: 'p2-nd-02', name: 'Schezwan Noodles', price: 150, category: 'NOODLES', page: 2 },

  // PAGE 02: DAL (8 items)
  { id: 'p2-dl-01', name: 'Dal Fry', price: 110, category: 'DAL', page: 2 },
  { id: 'p2-dl-02', name: 'Dal Tadka', price: 120, category: 'DAL', page: 2 },
  { id: 'p2-dl-03', name: 'Dal Kolhapuri', price: 130, category: 'DAL', page: 2 },
  { id: 'p2-dl-04', name: 'Dal Palak', price: 110, category: 'DAL', page: 2 },
  { id: 'p2-dl-05', name: 'Hari Mirchi Dal', price: 130, category: 'DAL', page: 2 },
  { id: 'p2-dl-06', name: 'Matter Paneer Dal', price: 140, category: 'DAL', page: 2 },
  { id: 'p2-dl-07', name: 'Dal Lasuniya', price: 150, category: 'DAL', page: 2 },
  { id: 'p2-dl-08', name: 'Kad Palak Dal', price: 140, category: 'DAL', page: 2 },

  // PAGE 03: PUNJABI SPECIALS (PANEER) (21 items)
  { id: 'p3-pj-01', name: 'Ruchi’s Special Curry', price: 300, category: 'PUNJABI SPECIALS (PANEER)', page: 3 },
  { id: 'p3-pj-02', name: 'Paneer Tikka Masala', price: 180, category: 'PUNJABI SPECIALS (PANEER)', page: 3 },
  { id: 'p3-pj-03', name: 'Paneer Masala', price: 170, category: 'PUNJABI SPECIALS (PANEER)', page: 3 },
  { id: 'p3-pj-04', name: 'Paneer Butter Masala', price: 200, category: 'PUNJABI SPECIALS (PANEER)', page: 3 },
  { id: 'p3-pj-05', name: 'Paneer Handi', price: 190, category: 'PUNJABI SPECIALS (PANEER)', page: 3 },
  { id: 'p3-pj-06', name: 'Paneer Kadai', price: 200, category: 'PUNJABI SPECIALS (PANEER)', page: 3 },
  { id: 'p3-pj-07', name: 'Paneer Kolhapuri', price: 210, category: 'PUNJABI SPECIALS (PANEER)', page: 3 },
  { id: 'p3-pj-08', name: 'Paneer Kaju Lasuniya', price: 220, category: 'PUNJABI SPECIALS (PANEER)', page: 3 },
  { id: 'p3-pj-09', name: 'Paneer Tufani', price: 200, category: 'PUNJABI SPECIALS (PANEER)', page: 3 },
  { id: 'p3-pj-10', name: 'Paneer Bhurji Dry', price: 220, category: 'PUNJABI SPECIALS (PANEER)', page: 3 },
  { id: 'p3-pj-11', name: 'Paneer Khima', price: 250, category: 'PUNJABI SPECIALS (PANEER)', page: 3 },
  { id: 'p3-pj-12', name: 'Paneer Makhanawala Sweet', price: 200, category: 'PUNJABI SPECIALS (PANEER)', page: 3 },
  { id: 'p3-pj-13', name: 'Palak Paneer', price: 200, category: 'PUNJABI SPECIALS (PANEER)', page: 3 },
  { id: 'p3-pj-14', name: 'Matter Paneer', price: 190, category: 'PUNJABI SPECIALS (PANEER)', page: 3 },
  { id: 'p3-pj-15', name: 'Paneer Chatpata', price: 190, category: 'PUNJABI SPECIALS (PANEER)', page: 3 },
  { id: 'p3-pj-16', name: 'Paneer Patiala', price: 220, category: 'PUNJABI SPECIALS (PANEER)', page: 3 },
  { id: 'p3-pj-17', name: 'Paneer Pasand', price: 220, category: 'PUNJABI SPECIALS (PANEER)', page: 3 },
  { id: 'p3-pj-18', name: 'Paneer Roll', price: 230, category: 'PUNJABI SPECIALS (PANEER)', page: 3 },
  { id: 'p3-pj-19', name: 'Paneer Kurma Sweet', price: 220, category: 'PUNJABI SPECIALS (PANEER)', page: 3 },
  { id: 'p3-pj-20', name: 'Paneer Angoori', price: 210, category: 'PUNJABI SPECIALS (PANEER)', page: 3 },
  { id: 'p3-pj-21', name: 'Paneer Chilli Masala', price: 220, category: 'PUNJABI SPECIALS (PANEER)', page: 3 },

  // PAGE 04: PUNJABI SPECIALS (KAJU & MUSHROOM) (19 items)
  { id: 'p4-pj-01', name: 'Mushroom Butter Masala', price: 240, category: 'PUNJABI SPECIALS (KAJU & MUSHROOM)', page: 4 },
  { id: 'p4-pj-02', name: 'Cheese Kaju Butter Masala', price: 230, category: 'PUNJABI SPECIALS (KAJU & MUSHROOM)', page: 4 },
  { id: 'p4-pj-03', name: 'Kaju Butter Masala', price: 280, category: 'PUNJABI SPECIALS (KAJU & MUSHROOM)', page: 4 },
  { id: 'p4-pj-04', name: 'Kaju Masala', price: 230, category: 'PUNJABI SPECIALS (KAJU & MUSHROOM)', page: 4 },
  { id: 'p4-pj-05', name: 'Kaju Kadai', price: 230, category: 'PUNJABI SPECIALS (KAJU & MUSHROOM)', page: 4 },
  { id: 'p4-pj-06', name: 'Kaju Paneer Masala', price: 230, category: 'PUNJABI SPECIALS (KAJU & MUSHROOM)', page: 4 },
  { id: 'p4-pj-07', name: 'Kaju Lasuniya', price: 240, category: 'PUNJABI SPECIALS (KAJU & MUSHROOM)', page: 4 },
  { id: 'p4-pj-08', name: 'Khoya Kaju Sweet', price: 240, category: 'PUNJABI SPECIALS (KAJU & MUSHROOM)', page: 4 },
  { id: 'p4-pj-09', name: 'Kaju Curry Sweet', price: 240, category: 'PUNJABI SPECIALS (KAJU & MUSHROOM)', page: 4 },
  { id: 'p4-pj-10', name: 'Kaju Kurma Sweet', price: 240, category: 'PUNJABI SPECIALS (KAJU & MUSHROOM)', page: 4 },
  { id: 'p4-pj-11', name: 'Kaju Mushroom', price: 230, category: 'PUNJABI SPECIALS (KAJU & MUSHROOM)', page: 4 },
  { id: 'p4-pj-12', name: 'Mushroom Masala', price: 190, category: 'PUNJABI SPECIALS (KAJU & MUSHROOM)', page: 4 },
  { id: 'p4-pj-13', name: 'Mushroom Paneer', price: 190, category: 'PUNJABI SPECIALS (KAJU & MUSHROOM)', page: 4 },
  { id: 'p4-pj-14', name: 'Palak Mushroom', price: 200, category: 'PUNJABI SPECIALS (KAJU & MUSHROOM)', page: 4 },
  { id: 'p4-pj-15', name: 'Corn Masala', price: 190, category: 'PUNJABI SPECIALS (KAJU & MUSHROOM)', page: 4 },
  { id: 'p4-pj-16', name: 'Sev Tameta', price: 180, category: 'PUNJABI SPECIALS (KAJU & MUSHROOM)', page: 4 },
  { id: 'p4-pj-17', name: 'Sev Bhaji', price: 170, category: 'PUNJABI SPECIALS (KAJU & MUSHROOM)', page: 4 },
  { id: 'p4-pj-18', name: 'Tomato Curry', price: 180, category: 'PUNJABI SPECIALS (KAJU & MUSHROOM)', page: 4 },
  { id: 'p4-pj-19', name: 'Milk Sev Bhaji Sweet', price: 200, category: 'PUNJABI SPECIALS (KAJU & MUSHROOM)', page: 4 },

  // PAGE 05: VEGETABLES (22 items)
  { id: 'p5-vg-01', name: 'Mix Veg', price: 180, category: 'VEGETABLES', page: 5 },
  { id: 'p5-vg-02', name: 'Veg Kadai', price: 190, category: 'VEGETABLES', page: 5 },
  { id: 'p5-vg-03', name: 'Veg Handi', price: 180, category: 'VEGETABLES', page: 5 },
  { id: 'p5-vg-04', name: 'Veg Hyderabad', price: 200, category: 'VEGETABLES', page: 5 },
  { id: 'p5-vg-05', name: 'Veg Kolhapuri', price: 200, category: 'VEGETABLES', page: 5 },
  { id: 'p5-vg-06', name: 'Veg Tawa Masala', price: 180, category: 'VEGETABLES', page: 5 },
  { id: 'p5-vg-07', name: 'Veg Lasuniya', price: 200, category: 'VEGETABLES', page: 5 },
  { id: 'p5-vg-08', name: 'Veg Jaipuri Sweet', price: 220, category: 'VEGETABLES', page: 5 },
  { id: 'p5-vg-09', name: 'Veg Khuma Masala', price: 210, category: 'VEGETABLES', page: 5 },
  { id: 'p5-vg-10', name: 'Veg Kofta', price: 200, category: 'VEGETABLES', page: 5 },
  { id: 'p5-vg-11', name: 'Palak Kofta', price: 200, category: 'VEGETABLES', page: 5 },
  { id: 'p5-vg-12', name: 'Capsicum Masala', price: 200, category: 'VEGETABLES', page: 5 },
  { id: 'p5-vg-13', name: 'Alu Pyaj', price: 180, category: 'VEGETABLES', page: 5 },
  { id: 'p5-vg-14', name: 'Alu Lasuniya', price: 190, category: 'VEGETABLES', page: 5 },
  { id: 'p5-vg-15', name: 'Alu Jeera', price: 190, category: 'VEGETABLES', page: 5 },
  { id: 'p5-vg-16', name: 'Alu Palak', price: 180, category: 'VEGETABLES', page: 5 },
  { id: 'p5-vg-17', name: 'Alu Capsicum Masala', price: 190, category: 'VEGETABLES', page: 5 },
  { id: 'p5-vg-18', name: 'Alu Bendi', price: 180, category: 'VEGETABLES', page: 5 },
  { id: 'p5-vg-19', name: 'Malai Kofta Sweet', price: 200, category: 'VEGETABLES', page: 5 },
  { id: 'p5-vg-20', name: 'Bendi Fry', price: 160, category: 'VEGETABLES', page: 5 },
  { id: 'p5-vg-21', name: 'Bendi Masala', price: 190, category: 'VEGETABLES', page: 5 },
  { id: 'p5-vg-22', name: 'Bendi Matter', price: 190, category: 'VEGETABLES', page: 5 },

  // PAGE 06: RICE (7 items)
  { id: 'p6-rc-01', name: 'Steam Rice', price: 60, category: 'RICE', page: 6 },
  { id: 'p6-rc-02', name: 'Jeera Rice', price: 120, category: 'RICE', page: 6 },
  { id: 'p6-rc-03', name: 'Masala Rice', price: 130, category: 'RICE', page: 6 },
  { id: 'p6-rc-04', name: 'Ghee Rice', price: 150, category: 'RICE', page: 6 },
  { id: 'p6-rc-05', name: 'Palak Rice', price: 120, category: 'RICE', page: 6 },
  { id: 'p6-rc-06', name: 'Lemon Rice', price: 120, category: 'RICE', page: 6 },
  { id: 'p6-rc-07', name: 'Tomato Rice', price: 110, category: 'RICE', page: 6 },

  // PAGE 06: BIRYANI (7 items)
  { id: 'p6-br-01', name: 'Veg Biryani', price: 150, category: 'BIRYANI', page: 6 },
  { id: 'p6-br-02', name: 'Veg Hyderabad', price: 150, category: 'BIRYANI', page: 6 },
  { id: 'p6-br-03', name: 'Handi Biryani', price: 180, category: 'BIRYANI', page: 6 },
  { id: 'p6-br-04', name: 'Dum Biryani', price: 160, category: 'BIRYANI', page: 6 },
  { id: 'p6-br-05', name: 'Paneer Biryani', price: 160, category: 'BIRYANI', page: 6 },
  { id: 'p6-br-06', name: 'Kaju Biryani', price: 170, category: 'BIRYANI', page: 6 },
  { id: 'p6-br-07', name: 'Mushroom Biryani', price: 150, category: 'BIRYANI', page: 6 },

  // PAGE 06: PULAV & KHICHDI (8 items)
  { id: 'p6-pk-01', name: 'Veg Pulav', price: 130, category: 'PULAV & KHICHDI', page: 6 },
  { id: 'p6-pk-02', name: 'Paneer Pulav', price: 160, category: 'PULAV & KHICHDI', page: 6 },
  { id: 'p6-pk-03', name: 'Kashmiri Pulav Sweet', price: 180, category: 'PULAV & KHICHDI', page: 6 },
  { id: 'p6-pk-04', name: 'Kaju Palace', price: 160, category: 'PULAV & KHICHDI', page: 6 },
  { id: 'p6-pk-05', name: 'Dal Khichdi', price: 130, category: 'PULAV & KHICHDI', page: 6 },
  { id: 'p6-pk-06', name: 'Palak Khichdi', price: 120, category: 'PULAV & KHICHDI', page: 6 },
  { id: 'p6-pk-07', name: 'Curd Rice', price: 120, category: 'PULAV & KHICHDI', page: 6 },
  { id: 'p6-pk-08', name: 'Special Curd Rice', price: 150, category: 'PULAV & KHICHDI', page: 6 },

  // PAGE 07: CHINESE (7 items)
  { id: 'p7-ch-01', name: 'Veg Fried Rice', price: 150, category: 'CHINESE', page: 7 },
  { id: 'p7-ch-02', name: 'Onion Chilli Fried Rice', price: 150, category: 'CHINESE', page: 7 },
  { id: 'p7-ch-03', name: 'Schezwan Fried Rice', price: 160, category: 'CHINESE', page: 7 },
  { id: 'p7-ch-04', name: 'Paneer Fried Rice', price: 180, category: 'CHINESE', page: 7 },
  { id: 'p7-ch-05', name: 'Mushroom Fried Rice', price: 150, category: 'CHINESE', page: 7 },
  { id: 'p7-ch-06', name: 'Gobi Fried Rice', price: 150, category: 'CHINESE', page: 7 },
  { id: 'p7-ch-07', name: 'Singapore Fried Rice', price: 160, category: 'CHINESE', page: 7 },

  // PAGE 07: CURD ITEMS (2 items - Null Prices Preserved)
  { id: 'p7-cd-01', name: 'Dahi Fry', price: null, priceNote: 'Price on Request', category: 'CURD ITEMS', page: 7 },
  { id: 'p7-cd-02', name: 'Plain Curd', price: null, priceNote: 'Price on Request', category: 'CURD ITEMS', page: 7 },

  // PAGE 07: LASSI (5 items)
  { id: 'p7-ls-01', name: 'Butter Milk', price: 50, category: 'LASSI', page: 7 },
  { id: 'p7-ls-02', name: 'Sweet Lassi', price: 60, category: 'LASSI', page: 7 },
  { id: 'p7-ls-03', name: 'Salt Lassi', price: 50, category: 'LASSI', page: 7 },
  { id: 'p7-ls-04', name: 'Chocolate Lassi', price: 70, category: 'LASSI', page: 7 },
  { id: 'p7-ls-05', name: 'Plain Curd', price: 20, category: 'LASSI', page: 7 },

  // PAGE 08: TANDOORI ITEMS (15 items)
  { id: 'p8-td-01', name: 'Tandoori Roti', price: 25, category: 'TANDOORI ITEMS', page: 8 },
  { id: 'p8-td-02', name: 'Tandoori Butter Roti', price: 30, category: 'TANDOORI ITEMS', page: 8 },
  { id: 'p8-td-03', name: 'Wheat Roti', price: 25, category: 'TANDOORI ITEMS', page: 8 },
  { id: 'p8-td-04', name: 'Wheat Butter Roti', price: 30, category: 'TANDOORI ITEMS', page: 8 },
  { id: 'p8-td-05', name: 'Tandoor Butter Naan', price: 60, category: 'TANDOORI ITEMS', page: 8 },
  { id: 'p8-td-06', name: 'Tandoor Plain Naan', price: 50, category: 'TANDOORI ITEMS', page: 8 },
  { id: 'p8-td-07', name: 'Garlic Naan', price: 60, category: 'TANDOORI ITEMS', page: 8 },
  { id: 'p8-td-08', name: 'Cheese Naan', price: 70, category: 'TANDOORI ITEMS', page: 8 },
  { id: 'p8-td-09', name: 'Butter Kulcha', price: 80, category: 'TANDOORI ITEMS', page: 8 },
  { id: 'p8-td-10', name: 'Lachha Parota', price: 50, category: 'TANDOORI ITEMS', page: 8 },
  { id: 'p8-td-11', name: 'Masala Parota', price: 60, category: 'TANDOORI ITEMS', page: 8 },
  { id: 'p8-td-12', name: 'Alu Parota', price: 60, category: 'TANDOORI ITEMS', page: 8 },
  { id: 'p8-td-13', name: 'Paneer Parota', price: 65, category: 'TANDOORI ITEMS', page: 8 },
  { id: 'p8-td-14', name: 'Cheese Parota', price: 70, category: 'TANDOORI ITEMS', page: 8 },
  { id: 'p8-td-15', name: 'Palak Parota', price: 60, category: 'TANDOORI ITEMS', page: 8 },
];

// ============================================================================
// 03. AUDIT & DATA VERIFICATION ENGINE
// ============================================================================

export function runMenuIntegrityAudit(
  data: MenuItemData[],
  pages: PageMetaData[]
): { passed: boolean; message: string } {
  const expectedTotal = 153;
  if (data.length !== expectedTotal) {
    return { passed: false, message: `Dish count mismatch: ${data.length}/${expectedTotal}` };
  }
  const expectedPerPage: Record<number, number> = {
    1: 30, 2: 10, 3: 21, 4: 19, 5: 22, 6: 22, 7: 14, 8: 15,
  };
  for (const [pg, cnt] of Object.entries(expectedPerPage)) {
    const act = data.filter((d) => d.page === Number(pg)).length;
    if (act !== cnt) {
      return { passed: false, message: `Page ${pg} count mismatch: ${act}/${cnt}` };
    }
  }
  const uniqueIds = new Set(data.map((d) => d.id));
  if (uniqueIds.size !== expectedTotal) {
    return { passed: false, message: `ID collision detected: ${uniqueIds.size}/${expectedTotal}` };
  }
  const nullItems = data.filter((d) => d.price === null);
  if (nullItems.length !== 2) {
    return { passed: false, message: `Null price preservation issue: ${nullItems.length} found` };
  }
  return { passed: true, message: 'All 153 menu items strictly verified.' };
}

// ============================================================================
// 04. REUSABLE LUXURY ORNAMENTS & ICONS
// ============================================================================

const PureVegSymbol: React.FC<{ className?: string }> = ({ className = 'w-3 h-3' }) => (
  <span
    aria-label="Pure Vegetarian"
    title="Pure Vegetarian"
    className={`inline-flex items-center justify-center p-[1px] border border-[#166534] bg-white rounded-[2px] shrink-0 ${className}`}
  >
    <span className="w-1.5 h-1.5 rounded-full bg-[#166534]" />
  </span>
);

const BrandEmblemSVG: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" stroke="#D4B475" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
    <circle cx="50" cy="50" r="41" stroke="#D4B475" strokeWidth="2" />
    <circle cx="50" cy="50" r="37" stroke="#D4B475" strokeWidth="0.8" opacity="0.8" />
    <path
      d="M50 16 C53 30, 68 40, 78 50 C68 60, 53 70, 50 84 C47 70, 32 60, 22 50 C32 40, 47 30, 50 16 Z"
      fill="#D4B475"
      fillOpacity="0.18"
      stroke="#D4B475"
      strokeWidth="1.5"
    />
    <circle cx="50" cy="50" r="14" fill="#164B35" stroke="#D4B475" strokeWidth="1.5" />
    <path
      d="M45 42 H53 C56 42, 58 44, 58 47 C58 50, 56 52, 53 52 H45 V58 M49 52 L57 60"
      stroke="#D4B475"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CornerOrnamentSVG: React.FC<{ color?: string; className?: string }> = ({
  color = '#A88B52',
  className = 'w-4 h-4',
}) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 22 V5 C2 3.34315 3.34315 2 5 2 H22" stroke={color} strokeWidth="1.2" />
    <path d="M6 18 V7 C6 6.44772 6.44772 6 7 6 H18" stroke={color} strokeWidth="0.8" opacity="0.75" />
    <circle cx="6" cy="6" r="1.5" fill={color} />
  </svg>
);

const SectionDividerOrnament: React.FC<{ color?: string }> = ({ color = '#A88B52' }) => (
  <div className="flex items-center justify-center gap-2 my-2 sm:my-3 opacity-80" aria-hidden="true">
    <div className="h-px w-8 sm:w-14 bg-gradient-to-r from-transparent via-[#A88B52]/60 to-[#A88B52]" />
    <div className="w-1.5 h-1.5 rotate-45 border border-[#A88B52] bg-[#FAF7F0]" />
    <div className="w-2 h-2 rotate-45 bg-[#A88B52]" />
    <div className="w-1.5 h-1.5 rotate-45 border border-[#A88B52] bg-[#FAF7F0]" />
    <div className="h-px w-8 sm:w-14 bg-gradient-to-l from-transparent via-[#A88B52]/60 to-[#A88B52]" />
  </div>
);

// ============================================================================
// 05. MENU ITEM ROW (MOBILE-OPTIMISED TYPOGRAPHY & DISH/PRICE ALIGNMENT)
// ============================================================================

interface MenuItemRowProps {
  item: MenuItemData;
  isHighlighted?: boolean;
}

const MenuItemRow: React.FC<MenuItemRowProps> = ({ item, isHighlighted = false }) => {
  const isSignature = item.name === 'Ruchi’s Special Curry';
  const isAvailable = item.available !== false;

  return (
    <li
      id={`dish-${item.id}`}
      className={`group py-2 sm:py-2.5 transition-all duration-300 ${!isAvailable ? 'opacity-40' : ''} ${
        isHighlighted ? 'bg-[#D4B475]/25 rounded px-2 ring-1 ring-[#A88B52]' : ''
      }`}
    >
      <div className="flex items-baseline justify-between gap-1.5 sm:gap-2">
        {/* Left: Pure Veg Indicator + Dish Name */}
        <div className="flex items-baseline gap-2 min-w-0 pr-1">
          <span className="shrink-0 self-center">
            <PureVegSymbol className="w-3 h-3" />
          </span>
          <div className="min-w-0">
            <span
              className={`font-sans text-[14px] sm:text-[15px] leading-snug tracking-[0.01em] transition-colors ${
                isSignature
                  ? 'font-semibold text-[#164B35]'
                  : 'font-normal text-[#1E2621] group-hover:text-[#164B35]'
              }`}
            >
              {item.name}
            </span>
            {isSignature && (
              <span className="ml-1.5 inline-block font-serif italic text-[11px] sm:text-xs px-1.5 py-0.2 bg-[#164B35] text-[#F8F6EF] rounded-xs font-normal">
                Crown Jewel
              </span>
            )}
            {!isAvailable && (
              <span className="ml-1.5 text-[10px] uppercase font-sans tracking-wider text-[#8C968F]">
                (Sold Out)
              </span>
            )}
          </div>
        </div>

        {/* Elegant Dotted Leader Line */}
        <div
          className="flex-1 border-b border-dotted border-[#A88B52]/40 min-w-[12px] self-baseline mb-1"
          aria-hidden="true"
        />

        {/* Right: Price */}
        <div className="shrink-0 text-right font-sans tabular-nums pl-1">
          {item.price !== null ? (
            <span className="text-[14px] sm:text-[15px] font-semibold text-[#9C7838] tracking-tight">
              <span className="text-[12px] opacity-75 mr-0.5 font-normal">₹</span>
              {item.price}
            </span>
          ) : (
            <span className="font-serif italic text-[11px] sm:text-xs text-[#6B756E] whitespace-nowrap">
              {item.priceNote || 'On Request'}
            </span>
          )}
        </div>
      </div>
    </li>
  );
};

// ============================================================================
// 06. BOOK FRONT COVER (LUXURY DEEP GREEN LEATHER & GOLD FOIL EMBOSSING)
// ============================================================================

interface BookFrontCoverProps {
  onOpenBook: () => void;
}

const BookFrontCover: React.FC<BookFrontCoverProps> = ({ onOpenBook }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-1 sm:p-4">
      {/* Physical Luxury Book Cover with Padded Leather Depth & Foil Stamp */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[360px] sm:max-w-[420px] md:max-w-[460px] h-[calc(100dvh-64px)] max-h-[700px] bg-gradient-to-br from-[#184E38] via-[#123E2C] to-[#0A241A] rounded-r-xl rounded-l-md shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.15)] p-2 sm:p-4 flex flex-col justify-between border-y-2 border-r-2 border-[#D4B475]/50 overflow-hidden"
      >
        {/* Leather Spine Crease & Stitch Detail on Left Edge */}
        <div
          className="absolute top-0 bottom-0 left-0 w-3 sm:w-4 bg-gradient-to-r from-[#2B0E13] via-[#4A1920] to-[#123324] border-r border-[#D4B475]/40 shadow-inner z-20 flex flex-col justify-around items-center py-6"
          aria-hidden="true"
        >
          <div className="w-0.5 h-6 bg-[#D4B475]/30 rounded-full" />
          <div className="w-0.5 h-6 bg-[#D4B475]/30 rounded-full" />
          <div className="w-0.5 h-6 bg-[#D4B475]/30 rounded-full" />
        </div>

        {/* Embossed Outer & Inner Gold Foil Filigree Border Frame */}
        <div className="relative ml-2 sm:ml-2.5 flex-1 border-2 border-[#D4B475]/70 p-3 sm:p-4 flex flex-col items-center justify-between text-center bg-[#0F3526]/60 backdrop-blur-xs">
          <CornerOrnamentSVG color="#D4B475" className="w-5 h-5 absolute top-1 left-1" />
          <CornerOrnamentSVG color="#D4B475" className="w-5 h-5 absolute top-1 right-1 rotate-90" />
          <CornerOrnamentSVG color="#D4B475" className="w-5 h-5 absolute bottom-1 left-1 -rotate-90" />
          <CornerOrnamentSVG color="#D4B475" className="w-5 h-5 absolute bottom-1 right-1 rotate-180" />

          {/* Top: Pure Veg Hallmark */}
          <div className="pt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E3324] border border-[#D4B475]/60 text-[10px] sm:text-xs font-sans uppercase tracking-[0.2em] text-[#E8CFA0] shadow-sm">
              <PureVegSymbol className="w-3.5 h-3.5" />
              <span>Pure Vegetarian</span>
            </div>
          </div>

          {/* Center: Majestic Restaurant Branding */}
          <div className="my-auto py-2 flex flex-col items-center max-w-full">
            <BrandEmblemSVG className="w-14 h-14 sm:w-16 sm:h-16 mb-2 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" />

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[0.14em] text-[#F8F6EF] drop-shadow-md">
              RUCHI’S
            </h1>

            <p className="font-serif text-xs sm:text-sm tracking-[0.28em] text-[#D4B475] mt-0.5 uppercase font-medium">
              Family Restaurant
            </p>

            <SectionDividerOrnament color="#D4B475" />

            <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#E2DACB] font-light max-w-[240px] sm:max-w-none">
              North Indian &amp; Marwadi Special
            </p>

            <p className="font-serif italic text-[11px] sm:text-xs text-[#C5BBAA] mt-1 opacity-85">
              Traditional Warmth • Rich Culinary Heritage
            </p>
          </div>

          {/* Bottom Action: Single Dedicated "OPEN MENU" Button */}
          <div className="w-full pb-1">
            <button
              type="button"
              onClick={onOpenBook}
              className="group w-full max-w-[220px] sm:max-w-[240px] mx-auto py-3 px-5 bg-gradient-to-r from-[#D4B475] via-[#E5C98E] to-[#D4B475] text-[#0E3324] font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.2em] rounded-xs shadow-[0_6px_20px_rgba(0,0,0,0.45)] hover:shadow-[0_8px_25px_rgba(212,180,117,0.35)] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Open Menu</span>
              <span className="text-base transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
            <p className="text-[9.5px] font-sans uppercase tracking-[0.14em] text-[#C5BBAA]/70 mt-2">
              Swipe or tap arrows to turn pages
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// 07. CHAPTERS INDEX OVERLAY (ELEGANT TABLE OF CONTENTS)
// ============================================================================

interface ChapterIndexModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number;
  onSelectPage: (pageNumber: number) => void;
}

const ChapterIndexModal: React.FC<ChapterIndexModalProps> = ({
  isOpen,
  onClose,
  currentPage,
  onSelectPage,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Table of Contents"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#FAF7F0] text-[#1E2621] rounded-md shadow-2xl border-2 border-[#D4B475] p-4 sm:p-6 max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#A88B52]/40 text-center">
          <div className="w-6" />
          <div className="text-center">
            <span className="text-[10px] font-sans uppercase tracking-[0.24em] text-[#8C7343] block">
              Ruchi’s Digital Menu
            </span>
            <h2 className="font-serif text-2xl font-semibold tracking-wide text-[#164B35]">
              Menu Chapters
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-[#6B756E] hover:text-[#164B35] hover:bg-[#A88B52]/15 text-lg cursor-pointer"
            aria-label="Close chapters modal"
          >
            ✕
          </button>
        </div>

        {/* Chapter List */}
        <ul className="mt-3 divide-y divide-[#A88B52]/20 font-serif">
          {OFFICIAL_PAGES.map((pg) => {
            const isCurrent = pg.pageNumber === currentPage;
            return (
              <li key={pg.pageNumber}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectPage(pg.pageNumber);
                    onClose();
                  }}
                  className={`w-full py-2.5 px-3 text-left flex items-center justify-between gap-3 rounded-xs transition-colors cursor-pointer group ${
                    isCurrent ? 'bg-[#164B35] text-[#F8F6EF]' : 'hover:bg-[#A88B52]/15 text-[#1E2621]'
                  }`}
                >
                  <div className="flex items-baseline gap-2.5">
                    <span
                      className={`font-sans text-xs tracking-widest ${
                        isCurrent ? 'text-[#D4B475]' : 'text-[#8C7343]'
                      }`}
                    >
                      {pg.code}
                    </span>
                    <div>
                      <h3 className="text-base font-medium leading-snug">{pg.title}</h3>
                      <p
                        className={`text-xs italic ${
                          isCurrent ? 'text-[#E2DACB]' : 'text-[#6B756E]'
                        }`}
                      >
                        {pg.subtitle}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-sans text-xs uppercase tracking-wider shrink-0 ${
                      isCurrent ? 'text-[#D4B475]' : 'text-[#8C7343] group-hover:translate-x-1 transition-transform'
                    }`}
                  >
                    Go →
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 pt-2.5 border-t border-[#A88B52]/30 text-center">
          <p className="text-[10.5px] font-sans uppercase tracking-[0.18em] text-[#8C7343]">
            Tap any chapter to turn directly to that page
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 08. SEARCH MODAL OVERLAY (SEARCH ALL 153 ITEMS WITH INSTANT JUMP)
// ============================================================================

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allItems: MenuItemData[];
  onSelectDish: (item: MenuItemData) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  allItems,
  onSelectDish,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [allItems, query]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Dishes"
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 p-3 sm:p-5 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#FAF7F0] text-[#1E2621] rounded-md shadow-2xl border-2 border-[#D4B475] p-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-2 pb-2.5 border-b border-[#A88B52]/40">
          <svg className="w-5 h-5 text-[#8C7343] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes (e.g. Paneer, Dal)..."
            className="w-full bg-transparent font-sans text-sm sm:text-base outline-none text-[#1E2621] placeholder:text-[#8C968F]"
          />
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-[#6B756E] hover:text-[#164B35] text-lg cursor-pointer"
            aria-label="Close search"
          >
            ✕
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto mt-2.5 divide-y divide-[#A88B52]/20 book-page-scroll">
          {query.trim() === '' ? (
            <div className="py-6 text-center text-xs font-serif italic text-[#6B756E]">
              Type a dish or category to search all 153 menu items...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-6 text-center text-xs font-serif italic text-[#6B756E]">
              No dishes found matching “{query}”.
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectDish(item);
                  onClose();
                }}
                className="w-full py-2 px-2 text-left flex items-center justify-between gap-3 hover:bg-[#A88B52]/15 rounded-xs transition-colors cursor-pointer group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <PureVegSymbol className="w-2.5 h-2.5" />
                    <span className="font-sans text-sm font-medium text-[#1E2621] group-hover:text-[#164B35]">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-sans uppercase tracking-wider text-[#8C7343] block mt-0.5">
                    {CATEGORY_DISPLAY_NAMES[item.category] || item.category} • Page {item.page}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-sans text-sm font-semibold text-[#9C7838]">
                    {item.price !== null ? `₹${item.price}` : 'On Request'}
                  </span>
                  <span className="block text-[10px] text-[#6B756E] uppercase font-sans tracking-wide">
                    Jump →
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 09. BOOK PAGE LEAF (PORTRAIT SINGLE-PAGE LUXURY IVORY PAPER)
// ============================================================================

interface BookPageLeafProps {
  pageMeta: PageMetaData;
  pageItems: MenuItemData[];
  highlightedDishId: string | null;
  side?: 'single' | 'left' | 'right';
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onOpenChapters: () => void;
}

const BookPageLeaf: React.FC<BookPageLeafProps> = ({
  pageMeta,
  pageItems,
  highlightedDishId,
  side = 'single',
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onOpenChapters,
}) => {
  const sections = useMemo(() => {
    return pageMeta.categories.map((catKey) => ({
      key: catKey,
      displayName: CATEGORY_DISPLAY_NAMES[catKey] || catKey,
      items: pageItems.filter((i) => i.category === catKey),
    }));
  }, [pageMeta.categories, pageItems]);

  return (
    <div
      className="relative w-full h-full flex flex-col justify-between bg-[#FAF7F0] text-[#1E2621] select-text shadow-xl overflow-hidden min-h-0"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 10%, #FFFEFA 0%, #FAF7F0 60%, #F4EFE3 100%)',
      }}
    >
      {/* Leather Spine Shadow on Bound Edge */}
      <div
        className={`pointer-events-none absolute top-0 bottom-0 z-20 ${
          side === 'right'
            ? 'left-0 w-4 bg-gradient-to-r from-black/25 via-black/08 to-transparent'
            : 'left-0 w-3 sm:w-3.5 bg-gradient-to-r from-black/20 via-black/06 to-transparent'
        }`}
        aria-hidden="true"
      />

      {/* Stacked Paper Shadow on Free Edge */}
      <div
        className={`pointer-events-none absolute top-0 bottom-0 z-20 ${
          side === 'left'
            ? 'right-0 w-2.5 bg-gradient-to-l from-black/15 to-transparent'
            : 'right-0 w-2 sm:w-2.5 bg-gradient-to-l from-black/15 to-transparent'
        }`}
        aria-hidden="true"
      />

      {/* Fine Antique Gold Ornamental Frame */}
      <div
        className="pointer-events-none absolute inset-1.5 sm:inset-2.5 border border-[#A88B52]/40 z-10"
        aria-hidden="true"
      >
        <CornerOrnamentSVG color="#A88B52" className="w-3.5 h-3.5 absolute -top-0.5 -left-0.5" />
        <CornerOrnamentSVG color="#A88B52" className="w-3.5 h-3.5 absolute -top-0.5 -right-0.5 rotate-90" />
        <CornerOrnamentSVG color="#A88B52" className="w-3.5 h-3.5 absolute -bottom-0.5 -left-0.5 -rotate-90" />
        <CornerOrnamentSVG color="#A88B52" className="w-3.5 h-3.5 absolute -bottom-0.5 -right-0.5 rotate-180" />
      </div>

      {/* Page Header (Fixed at top of leaf) */}
      <header className="relative z-20 pt-2 px-3 sm:pt-3 sm:px-6 pb-1.5 text-center border-b border-[#A88B52]/30 shrink-0">
        <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.22em] text-[#8C7343] mb-0.5">
          <span>Ruchi’s Restaurant</span>
          <button
            type="button"
            onClick={onOpenChapters}
            className="hover:text-[#164B35] font-semibold underline decoration-[#A88B52]/50 cursor-pointer"
            title="Open Chapter Index"
          >
            Folio {pageMeta.code}
          </button>
        </div>
        <h2 className="font-serif text-lg sm:text-2xl font-semibold tracking-wide text-[#164B35] leading-tight">
          {pageMeta.title}
        </h2>
        <p className="font-serif italic text-[10.5px] sm:text-xs text-[#5C665F] mt-0.5">
          {pageMeta.subtitle}
        </p>
      </header>

      {/* Page Scrollable Body (Single Column for Mobile Comfort) */}
      <div className="relative z-20 flex-1 min-h-0 overflow-y-auto px-3.5 sm:px-6 py-2 book-page-scroll overscroll-contain">
        <div className="space-y-3.5 pb-2">
          {sections.map((section, idx) => (
            <section key={section.key} aria-labelledby={`cat-${section.key}`} className="pt-0.5">
              {/* Category Heading (Only show if multiple categories or distinct) */}
              <div className="text-center mb-1.5">
                <div className="inline-flex items-center gap-2">
                  <span className="w-3 h-px bg-[#A88B52]/60" />
                  <h3
                    id={`cat-${section.key}`}
                    className="font-serif text-sm sm:text-base font-semibold tracking-[0.14em] uppercase text-[#164B35]"
                  >
                    {section.displayName}
                  </h3>
                  <span className="w-3 h-px bg-[#A88B52]/60" />
                </div>
                <span className="block text-[9px] uppercase font-sans tracking-[0.16em] text-[#8C7343]">
                  {section.items.length} {section.items.length === 1 ? 'Selection' : 'Selections'}
                </span>
              </div>

              {/* Dish List */}
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <MenuItemRow
                    key={item.id}
                    item={item}
                    isHighlighted={highlightedDishId === item.id}
                  />
                ))}
              </ul>

              {idx < sections.length - 1 && <SectionDividerOrnament color="#A88B52" />}
            </section>
          ))}

          {/* Empty Section Notes (e.g. THALI note on Page 8) */}
          {pageMeta.emptySections?.map((emptySec) => (
            <div
              key={emptySec.title}
              className="mt-3 p-2.5 border border-[#A88B52]/40 bg-[#164B35]/05 text-center rounded-xs"
            >
              <h4 className="font-serif text-sm sm:text-base font-semibold tracking-wider text-[#164B35] uppercase">
                {emptySec.title}
              </h4>
              <p className="font-serif italic text-xs text-[#5C665F] mt-0.5">
                {emptySec.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Page Footer (Integrated discreet navigation directly inside the book page) */}
      <footer className="relative z-20 px-3 sm:px-5 py-1.5 border-t border-[#A88B52]/30 bg-[#FAF7F0] flex items-center justify-between shrink-0 text-xs font-sans">
        {/* Previous Page / Cover Button */}
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center gap-1 py-1 px-2 rounded text-[11px] font-sans uppercase tracking-[0.14em] text-[#164B35] hover:bg-[#A88B52]/20 active:scale-95 transition-all cursor-pointer"
          aria-label={currentPage === 1 ? 'Close book and return to cover' : 'Previous Page'}
        >
          <span className="text-[#8C7343] font-bold">←</span>
          <span>{currentPage === 1 ? 'Cover' : 'Prev'}</span>
        </button>

        {/* Folio Indicator */}
        <button
          type="button"
          onClick={onOpenChapters}
          className="font-serif text-xs sm:text-sm font-semibold text-[#8C7343] tracking-widest hover:text-[#164B35] transition-colors cursor-pointer"
          title="Click to view all chapters"
        >
          — {pageMeta.code} of {String(totalPages).padStart(2, '0')} —
        </button>

        {/* Next Page Button */}
        <button
          type="button"
          onClick={onNext}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center gap-1 py-1 px-2 rounded text-[11px] font-sans uppercase tracking-[0.14em] text-[#164B35] hover:bg-[#A88B52]/20 active:scale-95 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
          aria-label="Next Page"
        >
          <span>Next</span>
          <span className="text-[#8C7343] font-bold">→</span>
        </button>
      </footer>
    </div>
  );
};

// ============================================================================
// 10. ADMIN MODAL COMPONENT (FOR PRESERVING BUSINESS LOGIC & PRICE UPDATES)
// ============================================================================

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItemData[];
  onUpdateItem: (updated: MenuItemData) => void;
  onResetDefault: () => void;
}

const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  menuItems,
  onUpdateItem,
  onResetDefault,
}) => {
  const [selectedDishId, setSelectedDishId] = useState(menuItems[0]?.id || '');
  const selectedItem = menuItems.find((m) => m.id === selectedDishId);
  const [editPrice, setEditPrice] = useState<string>(selectedItem?.price ? String(selectedItem.price) : '');

  useEffect(() => {
    if (selectedItem) {
      setEditPrice(selectedItem.price !== null ? String(selectedItem.price) : '');
    }
  }, [selectedItem]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu Admin Studio"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FAF7F0] text-[#1E2621] rounded-md shadow-2xl border-2 border-[#D4B475] p-5 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#A88B52]/40">
          <h3 className="font-serif text-xl font-semibold text-[#164B35]">Menu Management Studio</h3>
          <button type="button" onClick={onClose} className="text-[#6B756E] hover:text-[#164B35]">✕</button>
        </div>

        <div className="mt-4 space-y-4 text-xs font-sans">
          <div>
            <label className="block uppercase tracking-wider text-[#8C7343] mb-1 font-semibold">Select Dish</label>
            <select
              value={selectedDishId}
              onChange={(e) => setSelectedDishId(e.target.value)}
              className="w-full p-2 bg-white border border-[#A88B52]/50 rounded text-sm text-[#1E2621]"
            >
              {menuItems.map((item) => (
                <option key={item.id} value={item.id}>
                  P{item.page} • {item.name} ({item.price !== null ? `₹${item.price}` : 'No price'})
                </option>
              ))}
            </select>
          </div>

          {selectedItem && (
            <div>
              <label className="block uppercase tracking-wider text-[#8C7343] mb-1 font-semibold">Price (₹)</label>
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                placeholder="Leave blank for price on request"
                className="w-full p-2 bg-white border border-[#A88B52]/50 rounded text-sm text-[#1E2621]"
              />
              <button
                type="button"
                onClick={() => {
                  const newPrice = editPrice.trim() === '' ? null : Number(editPrice);
                  onUpdateItem({ ...selectedItem, price: newPrice });
                }}
                className="mt-2 w-full py-2 bg-[#164B35] text-[#F8F6EF] font-semibold uppercase tracking-wider rounded"
              >
                Save Price Update
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-[#A88B52]/30 flex justify-between gap-2">
            <button
              type="button"
              onClick={onResetDefault}
              className="py-1.5 px-3 border border-red-700/60 text-red-800 rounded hover:bg-red-50 text-[11px]"
            >
              Reset to Official Data
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-1.5 px-4 bg-[#8C7343] text-white rounded text-[11px]"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 11. MAIN APPLICATION COMPONENT (THE UNIFIED DIGITAL BOOK)
// ============================================================================

export function App() {
  const [menuItems, setMenuItems] = useState<MenuItemData[]>(OFFICIAL_MENU_DATA);
  const [isBookOpen, setIsBookOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [flipDirection, setFlipDirection] = useState<number>(1);
  const [isDesktopSpread, setIsDesktopSpread] = useState<boolean>(false);

  // Overlays
  const [isChaptersOpen, setIsChaptersOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [highlightedDishId, setHighlightedDishId] = useState<string | null>(null);

  // Touch Swipe tracking refs
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Run integrity verification silently on mount
  useMemo(() => runMenuIntegrityAudit(OFFICIAL_MENU_DATA, OFFICIAL_PAGES), []);

  // Viewport mode detection (>= 1120px for Desktop Two-Page Spread)
  useEffect(() => {
    const handleResize = () => {
      setIsDesktopSpread(window.innerWidth >= 1120);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Desktop Spread Page Numbers
  const leftSpreadPage = useMemo(() => {
    if (!isDesktopSpread) return currentPage;
    return currentPage % 2 === 1 ? currentPage : currentPage - 1;
  }, [currentPage, isDesktopSpread]);

  const rightSpreadPage = useMemo(() => {
    if (!isDesktopSpread) return null;
    return Math.min(8, leftSpreadPage + 1);
  }, [isDesktopSpread, leftSpreadPage]);

  // Turn to Next Page / Spread
  const handleNextPage = useCallback(() => {
    if (!isBookOpen) {
      setIsBookOpen(true);
      setCurrentPage(1);
      setFlipDirection(1);
      return;
    }
    if (isDesktopSpread) {
      const nextLeft = leftSpreadPage + 2;
      if (nextLeft <= 8) {
        setFlipDirection(1);
        setCurrentPage(nextLeft);
      }
    } else if (currentPage < 8) {
      setFlipDirection(1);
      setCurrentPage((prev) => prev + 1);
    }
  }, [isBookOpen, isDesktopSpread, leftSpreadPage, currentPage]);

  // Turn to Prev Page / Close Book
  const handlePrevPage = useCallback(() => {
    if (!isBookOpen) return;
    if (isDesktopSpread) {
      const prevLeft = leftSpreadPage - 2;
      if (prevLeft >= 1) {
        setFlipDirection(-1);
        setCurrentPage(prevLeft);
      } else {
        // Return to Cover
        setFlipDirection(-1);
        setIsBookOpen(false);
      }
    } else {
      if (currentPage > 1) {
        setFlipDirection(-1);
        setCurrentPage((prev) => prev - 1);
      } else {
        // Return to Cover
        setFlipDirection(-1);
        setIsBookOpen(false);
      }
    }
  }, [isBookOpen, isDesktopSpread, leftSpreadPage, currentPage]);

  // Jump to specific page
  const handleJumpToPage = useCallback(
    (targetPage: number) => {
      const clamped = Math.max(1, Math.min(8, targetPage));
      if (!isBookOpen) {
        setIsBookOpen(true);
      }
      setFlipDirection(clamped >= currentPage ? 1 : -1);
      setCurrentPage(clamped);
    },
    [currentPage, isBookOpen]
  );

  // Jump to dish from search
  const handleSelectDishFromSearch = useCallback(
    (item: MenuItemData) => {
      handleJumpToPage(item.page);
      setHighlightedDishId(item.id);
      setTimeout(() => {
        const dishEl = document.getElementById(`dish-${item.id}`);
        if (dishEl) {
          dishEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 350);
      setTimeout(() => {
        setHighlightedDishId((prev) => (prev === item.id ? null : prev));
      }, 3000);
    },
    [handleJumpToPage]
  );

  // Touch Swipe Handlers for Mobile Page Turning
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Minimum swipe threshold: 45px horizontal and predominantly horizontal
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0) {
        handleNextPage();
      } else {
        handlePrevPage();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSearchOpen || isChaptersOpen || isAdminOpen) return;
      if (e.key === 'ArrowRight') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPage();
      } else if (e.key === 'Escape' && isBookOpen) {
        setIsBookOpen(false);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextPage, handlePrevPage, isBookOpen, isSearchOpen, isChaptersOpen, isAdminOpen]);

  // Page turn motion variants
  const pageTurnVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
      rotateY: dir > 0 ? 8 : -8,
      scale: 0.985,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      rotateY: dir > 0 ? -8 : 8,
      scale: 0.985,
    }),
  };

  const leftPageMeta = OFFICIAL_PAGES.find((p) => p.pageNumber === leftSpreadPage) || OFFICIAL_PAGES[0];
  const rightPageMeta = rightSpreadPage ? OFFICIAL_PAGES.find((p) => p.pageNumber === rightSpreadPage) || null : null;

  return (
    <div
      className="min-h-[100dvh] h-[100dvh] w-full bg-[#0B1A12] text-[#F8F6EF] flex flex-col justify-between overflow-hidden selection:bg-[#D4B475] selection:text-[#0E3324]"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Global Embedded Luxury Typography & Custom Scrollbars */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        .font-serif {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        .font-sans {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .book-perspective {
          perspective: 1800px;
        }
        .book-page-scroll::-webkit-scrollbar {
          width: 3.5px;
        }
        .book-page-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .book-page-scroll::-webkit-scrollbar-thumb {
          background: rgba(168, 139, 82, 0.4);
          border-radius: 4px;
        }
      `}</style>

      {/* =====================================================================
          INTEGRATED BOOK HEADER (DISCREET & MATHEMATICALLY CENTERED)
      ===================================================================== */}
      <header className="shrink-0 z-30 bg-[#08150E]/95 border-b border-[#D4B475]/25 backdrop-blur-md px-3 sm:px-6 py-2 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex-1 flex items-center justify-start">
          {isBookOpen ? (
            <button
              type="button"
              onClick={() => setIsBookOpen(false)}
              className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-xs text-[11px] font-sans uppercase tracking-[0.16em] text-[#E8CFA0] border border-[#D4B475]/35 hover:bg-[#D4B475]/15 transition-colors cursor-pointer"
              title="Close book and return to front cover"
            >
              <span className="text-[#D4B475]">📖</span>
              <span>Cover</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-[0.16em] text-[#D4B475]">
              <PureVegSymbol className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pure Vegetarian</span>
            </div>
          )}
        </div>

        {/* Center: Restaurant Brand Badge & Current Chapter Indicator */}
        <div className="shrink-0 text-center flex flex-col items-center">
          <span className="font-serif text-lg sm:text-xl font-semibold tracking-[0.16em] text-[#F8F6EF] leading-none">
            RUCHI’S
          </span>
          {isBookOpen ? (
            <button
              type="button"
              onClick={() => setIsChaptersOpen(true)}
              className="font-serif italic text-[11px] text-[#D4B475] tracking-wide hover:underline cursor-pointer leading-tight mt-0.5"
            >
              {leftPageMeta.title} • {leftSpreadPage}/8 ▾
            </button>
          ) : (
            <span className="font-sans text-[9px] uppercase tracking-[0.24em] text-[#D4B475]/80 mt-0.5 leading-none">
              Digital Menu Book
            </span>
          )}
        </div>

        {/* Right Section */}
        <div className="flex-1 flex items-center justify-end gap-1.5 sm:gap-2">
          {isBookOpen && (
            <button
              type="button"
              onClick={() => setIsChaptersOpen(true)}
              className="inline-flex items-center gap-1 py-1 px-2 rounded-xs text-[11px] font-sans uppercase tracking-[0.14em] text-[#F8F6EF] hover:text-[#D4B475] border border-[#D4B475]/30 hover:bg-[#D4B475]/10 transition-colors cursor-pointer"
              aria-label="Open Table of Contents"
            >
              <svg className="w-3.5 h-3.5 text-[#D4B475]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h12M4 18h16" />
              </svg>
              <span className="hidden sm:inline">Chapters</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="p-1.5 text-[#F8F6EF] hover:text-[#D4B475] rounded transition-colors cursor-pointer"
            aria-label="Search dishes"
            title="Search dishes (⌘K)"
          >
            <svg className="w-4 h-4 text-[#D4B475]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>
      </header>

      {/* =====================================================================
          MAIN DIGITAL BOOK CONTAINER (MOBILE OCCUPIES FULL VIEWPORT)
      ===================================================================== */}
      <main className="flex-1 min-h-0 w-full relative flex items-center justify-center overflow-hidden book-perspective p-1 sm:p-3 md:p-5">
        {!isBookOpen ? (
          <BookFrontCover
            onOpenBook={() => {
              setFlipDirection(1);
              setIsBookOpen(true);
              setCurrentPage(1);
            }}
          />
        ) : (
          <div className="relative w-full h-full max-w-[480px] xl:max-w-[1040px] flex items-center justify-center min-h-0">
            {/* Desktop Lateral Previous / Next Chevrons */}
            <button
              type="button"
              onClick={handlePrevPage}
              className="hidden lg:flex absolute -left-12 z-30 w-10 h-10 rounded-full bg-[#122E21]/80 border border-[#D4B475]/50 text-[#D4B475] items-center justify-center shadow-lg hover:bg-[#164B35] transition-all cursor-pointer"
              aria-label="Previous Page or Close Cover"
            >
              ←
            </button>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={isDesktopSpread ? leftSpreadPage >= 7 : currentPage >= 8}
              className="hidden lg:flex absolute -right-12 z-30 w-10 h-10 rounded-full bg-[#122E21]/80 border border-[#D4B475]/50 text-[#D4B475] items-center justify-center shadow-lg hover:bg-[#164B35] disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
              aria-label="Next Page"
            >
              →
            </button>

            {/* Book Body: Physical Bound Leather Casement */}
            <div className="w-full h-full p-1 sm:p-2 bg-gradient-to-r from-[#210B0E] via-[#123E2C] to-[#210B0E] rounded-md sm:rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_0_1px_rgba(212,180,117,0.3)] flex overflow-hidden min-h-0">
              <AnimatePresence mode="wait" custom={flipDirection}>
                <motion.div
                  key={isDesktopSpread ? `spread-${leftSpreadPage}` : `page-${currentPage}`}
                  custom={flipDirection}
                  variants={pageTurnVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.32, ease: [0.25, 1, 0.5, 1] }}
                  className="w-full h-full grid grid-cols-1 xl:grid-cols-2 rounded-xs overflow-hidden min-h-0"
                >
                  {/* Left Page (or Single Portrait Page on Mobile/Tablet) */}
                  <div className="w-full h-full min-h-0">
                    <BookPageLeaf
                      pageMeta={leftPageMeta}
                      pageItems={menuItems.filter((i) => i.page === leftPageMeta.pageNumber)}
                      highlightedDishId={highlightedDishId}
                      side={isDesktopSpread ? 'left' : 'single'}
                      currentPage={leftSpreadPage}
                      totalPages={8}
                      onPrev={handlePrevPage}
                      onNext={handleNextPage}
                      onOpenChapters={() => setIsChaptersOpen(true)}
                    />
                  </div>

                  {/* Right Page (Desktop Spread Viewport Only) */}
                  {isDesktopSpread && rightPageMeta && (
                    <div className="hidden xl:block w-full h-full border-l border-[#A88B52]/40 min-h-0">
                      <BookPageLeaf
                        pageMeta={rightPageMeta}
                        pageItems={menuItems.filter((i) => i.page === rightPageMeta.pageNumber)}
                        highlightedDishId={highlightedDishId}
                        side="right"
                        currentPage={rightSpreadPage || 2}
                        totalPages={8}
                        onPrev={handlePrevPage}
                        onNext={handleNextPage}
                        onOpenChapters={() => setIsChaptersOpen(true)}
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>

      {/* =====================================================================
          CHAPTER SELECTOR & SEARCH OVERLAYS
      ===================================================================== */}
      <ChapterIndexModal
        isOpen={isChaptersOpen}
        onClose={() => setIsChaptersOpen(false)}
        currentPage={currentPage}
        onSelectPage={handleJumpToPage}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allItems={menuItems}
        onSelectDish={handleSelectDishFromSearch}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        menuItems={menuItems}
        onUpdateItem={(upd) => setMenuItems((prev) => prev.map((d) => (d.id === upd.id ? upd : d)))}
        onResetDefault={() => setMenuItems(OFFICIAL_MENU_DATA)}
      />
    </div>
  );
}

export default App;
