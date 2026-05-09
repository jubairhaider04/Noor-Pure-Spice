import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw, MessageCircle } from 'lucide-react';
import { PRODUCTS, WHATSAPP_NUMBER } from '../constants';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bn bg-brand-cream">
        <div className="text-center">
          <h2 className="text-3xl font-black text-stone-300 mb-6">পণ্যটি খুঁজে পাওয়া যায়নি</h2>
          <Link to="/shop" className="text-brand-red font-bold flex items-center justify-center gap-2 hover:translate-x-[-4px] transition-transform">
            <ArrowLeft size={20} /> দোকানে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-red font-bn text-lg font-bold mb-12 transition-colors">
          <ArrowLeft size={20} /> কেনাকাটা চালিয়ে যান
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch font-bn">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-brand-gold/10 transform -rotate-3 rounded-3xl -z-10"></div>
            <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-white">
              <img
                src={product.image}
                alt={product.nameBn}
                className="w-full aspect-square object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-red/5 rounded-full -z-10"></div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-brand-red text-white py-1 px-3 rounded text-[10px] font-bold tracking-widest uppercase">{product.category}</span>
              <span className="text-brand-gold font-bold tracking-tighter text-sm uppercase">Original Premium</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-brand-dark mb-6 leading-tight">{product.nameBn}</h1>
            <div className="flex items-baseline gap-4 mb-10">
              <p className="text-5xl text-brand-red font-black">৳{product.price}</p>
              <p className="text-stone-400 font-bold text-xl line-through">৳{Math.round(product.price * 1.2)}</p>
            </div>
            
            <div className="flex items-center gap-4 mb-12">
              <div className="bg-white border border-stone-200 py-3 px-6 rounded-xl font-bold text-xl shadow-sm">
                ওজন: {product.weightBn}
              </div>
              <div className="bg-green-50 text-green-700 py-3 px-6 rounded-xl font-bold text-xl flex items-center gap-2 border border-green-100 shadow-sm">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div> স্টকে আছে
              </div>
            </div>

            <p className="text-xl text-stone-500 mb-12 leading-relaxed border-l-4 border-brand-gold pl-8 py-2">
              {product.descriptionBn}
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <button
                onClick={() => addToCart(product)}
                className="flex-[2] bg-brand-red text-white py-5 rounded-xl font-bn text-2xl font-black flex items-center justify-center gap-3 hover:bg-brand-red/90 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
              >
                ব্যাগ-এ যুক্ত করুন
              </button>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=I want to order ${product.nameBn}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 border-2 border-brand-dark text-brand-dark py-5 px-8 rounded-xl font-bn text-xl font-bold hover:bg-brand-dark hover:text-white transition-all shadow-md"
              >
                হোয়াটসঅ্যাপ
              </a>
            </div>

            {/* Features Bar */}
            <div className="grid grid-cols-3 gap-8 pt-16 mt-16 border-t border-brand-sand">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-brand-red mb-3">
                  <ShieldCheck size={24} />
                </div>
                <span className="font-bold text-sm uppercase tracking-tighter opacity-70">Authentic</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-brand-red mb-3">
                  <Truck size={24} />
                </div>
                <span className="font-bold text-sm uppercase tracking-tighter opacity-70">Fast Ship</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-brand-red mb-3">
                  <RotateCcw size={24} />
                </div>
                <span className="font-bold text-sm uppercase tracking-tighter opacity-70">Returns</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
