export const API_URL = import.meta.env.VITE_WP_API_URL || '/wp-json/wc/store/v1/products';

export const heroSlides = [
  {
    desktop: 'https://kinsengs.com/wp-content/uploads/2026/09/ChatGPT-Image-Aug-28-2026-05_04_38-AM.png',
    mobile: 'https://kinsengs.com/wp-content/uploads/2026/09/kinsengs-1.png',
    eyebrow: 'The art of mindful wellness',
    title: 'Vitality begins with what is pure.',
    copy: 'A curated collection of wellness essentials designed around your rhythm and individual needs.',
  },
  {
    desktop: 'https://kinsengs.com/wp-content/uploads/2026/09/tolip-scaled.png',
    mobile: 'https://kinsengs.com/wp-content/uploads/2026/09/kinsengs-2.png',
    eyebrow: 'Your daily ritual',
    title: 'Nurture today. Flourish tomorrow.',
    copy: 'A proactive wellness journey that begins with understanding your body and making informed choices.',
  },
  {
    desktop: 'https://kinsengs.com/wp-content/uploads/2026/09/mv-scaled.png',
    mobile: 'https://kinsengs.com/wp-content/uploads/2026/09/kinsengs-1.png',
    eyebrow: 'Personal guidance',
    title: 'More than a product. A considered choice.',
    copy: 'Kinsengs brings clarity, confidence, and a more personal perspective to every choice.',
  },
];

export const fallbackProducts = [
  { id: 107, name: 'NMN+', slug: 'nmn-2', sku: '', description: '', short_description: '', prices: { price: '0', regular_price: '0', currency_code: 'USD', currency_minor_unit: 2 }, categories: [{ name: 'General Health', slug: 'general-health' }], images: [{ src: 'https://kinsengs.com/wp-content/uploads/2026/09/nmn-2.png' }] },
  { id: 91, name: 'Premium Cordyceps', slug: 'premium-cordyceps', sku: '', description: '', short_description: '', prices: { price: '0', regular_price: '0', currency_code: 'USD', currency_minor_unit: 2 }, categories: [{ name: 'Energy & Vitality', slug: 'general-health' }], images: [{ src: 'https://kinsengs.com/wp-content/uploads/2026/09/tn-05.jpg' }] },
  { id: 89, name: 'MV Herbs Red Lingzhi', slug: 'mv-herbs-red-lingzhi', sku: '', description: '', short_description: '', prices: { price: '8500', regular_price: '8500', currency_code: 'USD', currency_minor_unit: 2 }, categories: [{ name: 'Daily Balance', slug: 'general-health' }], images: [{ src: 'https://kinsengs.com/wp-content/uploads/2026/09/tn-11.jpg' }] },
  { id: 55, name: 'Royal Collagen CoQ10', slug: 'royal-collagen-coq10', sku: 'TN-13', description: '', short_description: '', prices: { price: '7000', regular_price: '7000', currency_code: 'USD', currency_minor_unit: 2 }, categories: [{ name: 'Hair, Skin & Nails', slug: 'hair-nail-and-skin' }], images: [{ src: 'https://kinsengs.com/wp-content/uploads/2026/09/tn-13.jpg' }] },
];

export const needMap = [
  ['general-health', 'Everyday vitality', 'Support daily balance and a more vibrant way of living.', '/images/botanical-editorial.jpg'],
  ['bone-and-joint-health', 'Move with ease', 'Care for comfortable movement and an active lifestyle.', 'https://kinsengs.com/wp-content/uploads/2026/09/tolip-scaled.png'],
  ['hair-nail-and-skin', 'Beauty from within', 'Nourish hair, skin, and nails with selected nutrients.', '/images/wellness-ritual.jpg'],
  ['sleep-support', 'Rest & unwind', 'Rediscover a calmer, more natural rhythm of rest.', 'https://kinsengs.com/wp-content/uploads/2026/09/unlock-mysteries-traditional-herbal-medicine-tap-into-its-profound-healing-potential-passed-down-through-generations-generated-by-ai-scaled.jpg'],
];

export const categoryMenu = [
  ['general-health', 'General Health', 'Everyday foundations for lasting vitality.'],
  ['bone-and-joint-health', 'Bone & Joint', 'Support comfortable, confident movement.'],
  ['hair-nail-and-skin', 'Hair, Skin & Nails', 'Beauty rituals designed from within.'],
  ['heart-health', 'Heart Health', 'Thoughtful support for cardiovascular wellness.'],
  ['detox-and-cleanse', 'Detox & Cleanse', 'Botanical approaches to daily balance.'],
  ['weight-management', 'Weight Management', 'Mindful support for healthy routines.'],
  ['sleep-support', 'Sleep Support', 'Unwind into a more restorative rhythm.'],
  ['eye-health', 'Eye Health', 'Daily care for modern visual demands.'],
  ['lung-health', 'Respiratory Health', 'Selected botanicals for respiratory wellness.'],
  ['tea', 'Herbal Tea', 'A slower, more sensory wellness ritual.'],
  ['sexual-health', 'Sexual Wellness', 'Private guidance for intimate wellbeing.'],
];

export const testimonialPreviews = [
  { quote: 'The guidance made the ingredient list feel clear and approachable. I never felt rushed into a decision.', name: 'Emily R.', context: 'Personal product guidance' },
  { quote: 'The collection feels considered rather than overwhelming. It was easy to begin with what mattered to me.', name: 'Sophia M.', context: 'Shop by wellness need' },
  { quote: 'A beautifully calm experience, with thoughtful answers to every question I had before choosing.', name: 'Olivia K.', context: 'Kinsengs concierge' },
  { quote: 'I appreciated the honest conversation about what to read on the label and what to ask my healthcare provider.', name: 'Lauren T.', context: 'Ingredient clarity' },
  { quote: 'The website is serene, but the human guidance is what made the experience feel genuinely personal.', name: 'Madison C.', context: 'Phone consultation' },
];

export const translations = {
  'General Health': 'General Health',
  'Bone and Joint Health': 'Bone & Joint Health',
  'Hair Nail and Skin': 'Hair, Skin & Nails',
  'Heart Health': 'Heart Health',
  'Detox and Cleanse': 'Detox & Cleanse',
  'Weight Management': 'Weight Management',
  'Sleep Support': 'Sleep Support',
  'Eye Health': 'Eye Health',
  'Lung Health': 'Respiratory Health',
  Tea: 'Herbal Tea',
  'Sexual Health': 'Sexual Wellness',
};

export const englishProductOverrides = {
  89: {
    name: 'MV Herbs Red Lingzhi',
    description: '<p>MV Herbs Red Lingzhi is a red reishi mushroom supplement created for a mindful daily wellness routine. Red lingzhi has a long history of traditional use and is valued as a distinctive botanical ingredient.</p><p><strong>Important:</strong> Consult a healthcare professional before use if you are pregnant, nursing, taking medication, or managing a medical condition.</p>',
  },
  87: {
    name: 'MV Herbal Shark Cartilage 750 mg | 100 Capsules',
    description: '<p>MV Herbal Shark Cartilage is a dietary supplement made with shark cartilage and presented in convenient 750 mg capsules.</p><p><strong>Product details:</strong><br>100 capsules per bottle<br>750 mg per capsule<br>Made in the USA</p><p><strong>Suggested audience:</strong> Adults interested in adding a cartilage-based supplement to their wellness routine. Review the label carefully and consult a healthcare professional before use.</p>',
  },
};
