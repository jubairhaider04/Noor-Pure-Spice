import { Product } from './types';
import TurmericImg from './assets/images/regenerated_image_1778034966619.jpg';
import ChiliImg from './assets/images/regenerated_image_1778034968521.jpg';
import CorianderImg from './assets/images/regenerated_image_1778034970511.jpg';

export const PRODUCTS: Product[] = [
  {
    id: 'turmeric-powder',
    name: 'Turmeric Powder',
    nameBn: 'হলুদ গুঁড়া',
    price: 180,
    weight: '200g',
    weightBn: '২০০ গ্রাম',
    description: '100% pure turmeric powder sourced from the best turmeric roots.',
    descriptionBn: 'সেরা মানের হলুদের শিকড় থেকে সংগৃহীত ১০০% খাঁটি হলুদ গুঁড়া।',
    image: TurmericImg,
    category: 'Basic Spices',
    categoryBn: 'প্রাথমিক মসলা'
  },
  {
    id: 'chili-powder',
    name: 'Chili Powder',
    nameBn: 'মরিচ গুঁড়া',
    price: 220,
    weight: '200g',
    weightBn: '২০০ গ্রাম',
    description: 'Hot and vibrant red chili powder for the perfect spice level.',
    descriptionBn: 'রান্নায় নিখুঁত ঝাল ও রঙের জন্য টকটকে লাল মরিচ গুঁড়া।',
    image: ChiliImg,
    category: 'Basic Spices',
    categoryBn: 'প্রাথমিক মসলা'
  },
  {
    id: 'coriander-powder',
    name: 'Coriander Powder',
    nameBn: 'ধনিয়া গুঁড়া',
    price: 150,
    weight: '200g',
    weightBn: '২০০ গ্রাম',
    description: 'Aromatic coriander powder to enhance the flavor of your curries.',
    descriptionBn: 'আপনার রান্নার স্বাদ ও সুগন্ধ বাড়াতে সুগন্ধি ধনিয়া গুঁড়া।',
    image: CorianderImg,
    category: 'Basic Spices',
    categoryBn: 'প্রাথমিক মসলা'
  },
  {
    id: 'cumin-powder',
    name: 'Cumin Powder',
    nameBn: 'জিরা গুঁড়া',
    price: 250,
    weight: '200g',
    weightBn: '২০০ গ্রাম',
    description: 'Premium quality roasted cumin powder.',
    descriptionBn: 'উন্নত মানের ভাজা জিরার গুঁড়া।',
    image: 'https://images.unsplash.com/photo-1581600140682-d4e68c8cde32?q=80&w=800&auto=format&fit=crop',
    category: 'Basic Spices',
    categoryBn: 'প্রাথমিক মসলা'
  },
  {
    id: 'garam-masala',
    name: 'Garam Masala',
    nameBn: 'গরম মসলা',
    price: 350,
    weight: '100g',
    weightBn: '১০০ গ্রাম',
    description: 'A perfect blend of secret spices for rich aroma.',
    descriptionBn: 'সমৃদ্ধ সুগন্ধের জন্য গোপন মসলার নিখুঁত মিশ্রণ।',
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=800&auto=format&fit=crop',
    category: 'Mixed Spices',
    categoryBn: 'মিশ্র মসলা'
  },
  {
    id: 'shahi-masala',
    name: 'Shahi Masala',
    nameBn: 'শাহী মসলা',
    price: 450,
    weight: '100g',
    weightBn: '১০০ গ্রাম',
    description: 'Imperial blend of exotic spices for royal flavors.',
    descriptionBn: 'শাহী স্বাদের জন্য চমৎকার সুগন্ধি মসলার বিলাস বহুল মিশ্রণ।',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop',
    category: 'Premium Mixed',
    categoryBn: 'প্রিমিয়াম মিশ্র'
  },
  {
    id: 'whole-garam-masala',
    name: 'Whole Garam Masala',
    nameBn: 'আস্ত গরম মসলা',
    price: 550,
    weight: '200g',
    weightBn: '২০০ গ্রাম',
    description: 'Authentic whole spices for traditional cooking.',
    descriptionBn: 'সনাতন রান্নার জন্য নিখুঁত আস্ত গরম মসলার সংকলন।',
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=800&auto=format&fit=crop',
    category: 'Whole Spices',
    categoryBn: 'আস্ত মসলা'
  },
  {
    id: 'combo-pack-6in1',
    name: '6-in-1 Combo Pack',
    nameBn: 'কম্ব প্যাক ৬ টি ১ টির ভিতর',
    price: 1400,
    weight: '1.2kg',
    weightBn: '১.২ কেজি',
    description: 'A complete collection of 6 essential pure spices.',
    descriptionBn: 'রান্নার প্রয়োজনীয় ৬টি খাঁটি মসলার একটি চমৎকার কম্বো অফার।',
    image: '/src/assets/images/regenerated_image_1778091014698.jpg',
    category: 'Combo Pack',
    categoryBn: 'কম্ব প্যাক'
  }
];

export const BRAND_NAME = 'Noor Pure Spice';
export const BRAND_NAME_BN = 'নূর গুঁড়া মসলা';
export const TAGLINE_BN = 'খাঁটি মশলার স্বাদ, ঘরে ঘরে';

export const PHONE_NUMBER = '+8801911198710';
export const PHONE_NUMBER_BN = '+৮৮০ ১৯১১ ১৯৮ ৭১০';
export const FACEBOOK_URL = 'https://www.facebook.com/noorguramoshla';
export const WHATSAPP_NUMBER = '8801911198710';

export const SHIPPING_COST_DHAKA = 60;
export const SHIPPING_COST_OUTSIDE = 120;
