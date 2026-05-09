import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { SHIPPING_COST_DHAKA } from '../constants';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 font-bn bg-brand-cream text-brand-dark">
        <div className="w-24 h-24 bg-brand-sand rounded-2xl flex items-center justify-center text-brand-gold mb-8 shadow-inner">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-4xl font-black mb-4">আপনার ব্যাগটি খালি</h2>
        <p className="text-stone-500 text-xl mb-10 text-center max-w-sm">
          এখনো কোনো পণ্য আপনার ব্যাগে যোগ করা হয়নি। কেনাকাটা শুরু করতে নিচের লিঙ্কে ক্লিক করুন।
        </p>
        <Link
          to="/shop"
          className="bg-brand-red text-white px-12 py-5 rounded-xl font-black text-2xl shadow-xl hover:scale-105 transition-transform"
        >
          দোকানে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="py-20 bg-brand-cream min-h-screen text-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
           <span className="text-brand-gold font-bold tracking-widest uppercase text-xs mb-2 block">Shopping Experience</span>
           <h1 className="text-5xl font-black font-bn leading-none">শপিং ব্যাগ ({totalItems})</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-8 shadow-sm border border-stone-100"
                >
                  <div className="w-28 h-28 rounded-xl overflow-hidden shrink-0 border border-stone-100 bg-brand-sand/20">
                    <img src={item.image} alt={item.nameBn} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left font-bn">
                    <h3 className="text-2xl font-black mb-1">{item.nameBn}</h3>
                    <p className="text-brand-gold font-bold uppercase tracking-widest text-xs mb-4">{item.weightBn}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-xl font-black w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="text-center sm:text-right flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto gap-4">
                    <p className="text-3xl font-black text-brand-red">৳{item.price * item.quantity}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-stone-300 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-10 rounded-2xl shadow-2xl border border-stone-100 sticky top-32">
              <h2 className="text-2xl font-black font-bn mb-10 border-b border-stone-100 pb-4 uppercase tracking-tighter">Order Summary</h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-xl font-bn leading-none">
                  <span className="text-stone-400 font-bold uppercase text-xs tracking-widest">Subtotal</span>
                  <span className="font-black text-brand-dark">৳{totalPrice}</span>
                </div>
                <div className="flex justify-between text-xl font-bn leading-none">
                  <span className="text-stone-400 font-bold uppercase text-xs tracking-widest">Delivery cost</span>
                  <span className="font-black text-brand-dark">৳{SHIPPING_COST_DHAKA}</span>
                </div>
                <div className="pt-8 border-t border-brand-sand flex justify-between text-3xl font-bn font-black">
                  <span className="tracking-tighter">Total</span>
                  <span className="text-brand-red">৳{totalPrice + SHIPPING_COST_DHAKA}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Link
                   to="/checkout"
                   className="w-full bg-brand-red text-white py-5 rounded-xl font-bn text-2xl font-black flex items-center justify-center gap-3 hover:bg-brand-dark transition-all shadow-xl active:scale-95"
                >
                  চেকআউট <ArrowRight size={24} />
                </Link>
                <Link
                  to="/shop"
                  className="w-full bg-brand-cream text-brand-dark border border-stone-200 py-4 rounded-xl font-bn text-xl font-bold flex items-center justify-center gap-2 hover:bg-white transition-all shadow-sm"
                >
                  কেনাকাটা চালিয়ে যান
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-4 opacity-70">
                 <div className="bg-[#E2136E] text-white px-2 py-0.5 rounded font-bold text-[10px]">bKash</div>
                 <div className="bg-[#F7941D] text-white px-2 py-0.5 rounded font-bold text-[10px]">Nagad</div>
                 <div className="bg-stone-800 text-white px-2 py-0.5 rounded font-bold text-[10px]">COD</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
