import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, Factory } from 'lucide-react';
import { PRODUCTS, BRAND_NAME_BN, TAGLINE_BN } from '../constants';
import { useCart } from '../context/CartContext';
import LogoImage from '../assets/images/regenerated_image_1778034406861.jpg';
import ComboImg from '../assets/images/regenerated_image_1778091014698.jpg';

const Home: React.FC = () => {
  const { addToCart } = useCart();
  const featuredProducts = PRODUCTS.slice(0, 8);

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream text-brand-dark">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] grid grid-cols-1 lg:grid-cols-12 items-center overflow-hidden">
        {/* Left Content */}
        <div className="lg:col-span-7 p-8 md:p-16 lg:p-24 flex flex-col justify-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-gold font-bold tracking-widest uppercase text-sm mb-4 block">১০০% খাঁটি ও প্রাকৃতিক</span>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6 font-bn text-brand-dark">
              খাঁটি মশলার আসল স্বাদ <br />
              <span className="text-brand-red">এখন আপনার ঘরে</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-600 mb-10 max-w-lg leading-relaxed font-bn">
              সেরা মানের হলুদ, মরিচ ও ধনিয়া সরাসরি কৃষকের উৎস থেকে সংগৃহীত। স্বাস্থ্যসম্মত উপায়ে প্রক্রিয়াজাত নূর গুঁড়া মসলায় রান্নায় আসে অনন্য ঘ্রাণ।
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="bg-brand-red text-white px-10 py-4 rounded-md font-bn text-xl font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                এখনই কিনুন
              </Link>
              <Link
                to="/shop"
                className="border-2 border-brand-red text-brand-red px-10 py-4 rounded-md font-bn text-xl font-bold hover:bg-brand-red/5 transition-all"
              >
                সব মসলা দেখুন
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Visual */}
        <div className="lg:col-span-5 h-full relative bg-brand-sand/50 min-h-[400px]">
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="relative w-full max-w-sm aspect-[4/5] bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-white transform rotate-3">
              <img
                src={ComboImg}
                alt="Combo Pack"
                className="w-full h-1/2 object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=800&auto=format&fit=crop';
                }}
              />
              <div className="p-8">
                <img 
                  src={LogoImage} 
                  alt="Noor Logo" 
                  className="w-12 h-12 object-contain mb-4"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML += '<div class="bg-brand-red w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold mb-4">নূর</div>';
                  }}
                />
                <h3 className="text-2xl font-bold text-brand-red mb-1 font-bn">কম্ব প্যাক ৬ টি ১ টির ভিতর</h3>
                <p className="text-xs text-stone-400 mb-6 tracking-widest uppercase">6-in-1 Combo Pack</p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-black text-brand-dark">৳ ১৪০০</div>
                  <div className="text-sm font-bn text-stone-500">১.২ কেজি</div>
                </div>
              </div>
            </div>
            {/* Background geometric shapes */}
            <div className="absolute w-64 h-64 border-8 border-brand-gold/20 rounded-full -top-10 -right-10 pointer-events-none"></div>
            <div className="absolute w-40 h-40 bg-brand-red/5 rounded-full bottom-10 -left-10 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Feature Bar */}
      <section className="bg-brand-dark overflow-hidden py-10 lg:py-0 lg:h-32">
        <div className="max-w-7xl mx-auto h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          {[
            { icon: '✨', title: '১০০% খাঁটি', desc: 'কোনো ভেজাল নেই' },
            { icon: '🛡️', title: 'স্বাস্থ্যসম্মত', desc: 'উন্নত প্রক্রিয়াজাতকরণ' },
            { icon: '🌿', title: 'সরাসরি উৎস', desc: 'কৃষক থেকে সংগ্রহ' },
            { icon: '🚚', title: 'দ্রুত ডেলিভারি', desc: 'সারা বাংলাদেশে' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-center gap-4 py-8 lg:py-0 px-8">
              <div className="w-12 h-12 rounded-full border border-brand-gold flex items-center justify-center text-brand-gold text-xl shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                {item.icon}
              </div>
              <div className="text-white font-bn">
                <div className="font-bold text-lg leading-tight">{item.title}</div>
                <div className="text-xs text-stone-400 uppercase tracking-widest">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="relative">
              <div className="absolute -top-10 -left-6 text-brand-gold/10 font-black text-8xl pointer-events-none">NOOR</div>
              <h2 
                className="text-4xl md:text-5xl font-black text-brand-dark mb-4 font-bn relative z-10"
                style={{ color: '#ffffff' }}
              >জনপ্রিয় পণ্যসমূহ</h2>
              <div className="w-20 h-1.5 bg-brand-red"></div>
            </div>
            <Link to="/shop" className="text-brand-red font-bold font-bn text-xl flex items-center gap-2 hover:translate-x-2 transition-transform">
              সব পণ্য দেখুন <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-stone-100 flex flex-col h-full group"
              >
                <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.nameBn}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-4 left-4 bg-brand-red px-3 py-1 rounded text-xs font-bold tracking-widest text-white uppercase">
                    {product.category}
                  </div>
                </Link>
                <div 
                  className="p-8 flex flex-col flex-1"
                  style={(idx === 0 || idx === 1) ? { color: '#ffffff' } : undefined}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-black font-bn tracking-tight text-brand-dark group-hover:text-brand-red transition-colors">
                      {product.nameBn}
                    </h3>
                    <span className="text-brand-red font-black text-2xl">৳{product.price}</span>
                  </div>
                  <p className="text-stone-500 mb-8 font-bn text-lg">{product.weightBn}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-auto w-full bg-brand-dark text-white py-4 rounded-lg font-bn text-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-red transition-all shadow-md active:scale-95"
                  >
                    ব্যাগ-এ যুক্ত করুন
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
