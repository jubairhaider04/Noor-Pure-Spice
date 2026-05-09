import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Truck, CreditCard, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { SHIPPING_COST_DHAKA, SHIPPING_COST_OUTSIDE } from '../constants';

const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'dhaka' | 'outside'>('dhaka');

  const shippingCost = shippingMethod === 'dhaka' ? SHIPPING_COST_DHAKA : SHIPPING_COST_OUTSIDE;
  const grandTotal = totalPrice + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-4 font-bn bg-brand-cream">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white p-12 rounded-2xl shadow-2xl text-center border border-stone-100"
        >
          <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border-2 border-green-100">
            <CheckCircle size={56} />
          </div>
          <h2 className="text-4xl font-black text-brand-dark mb-4">অর্ডার সফল হয়েছে!</h2>
          <p className="text-xl text-stone-500 mb-10 leading-relaxed">
            আপনাকে ধন্যবাদ! আপনার অর্ডারটি আমরা গ্রহণ করেছি। আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
          </p>
          <Link
            to="/"
            className="inline-block bg-brand-red text-white px-12 py-5 rounded-xl font-black text-2xl hover:bg-brand-dark transition-all shadow-xl"
          >
            হোম পেজে ফিরে যান
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-brand-cream min-h-screen text-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 mb-16">
          <Link to="/cart" className="p-4 bg-white rounded-xl border border-stone-200 hover:text-brand-red transition-all shadow-sm hover:shadow-md">
            <ChevronLeft size={24} />
          </Link>
          <div>
            <span className="text-brand-gold font-bold tracking-widest uppercase text-xs mb-1 block">Finalize Order</span>
            <h1 className="text-5xl font-black font-bn leading-none">চেকআউট</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12 font-bn">
          <div className="lg:col-span-2 space-y-10">
            {/* Delivery Info */}
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-stone-100">
              <h2 className="text-2xl font-black mb-10 flex items-center gap-3 decoration-brand-gold decoration-4 underline-offset-8 underline">
                ডেলিভারি তথ্য
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-widest text-stone-400">নাম *</label>
                  <input required type="text" className="w-full p-5 bg-brand-cream border border-stone-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold" placeholder="নাম" />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-widest text-stone-400">ফোন নাম্বার *</label>
                  <input required type="text" className="w-full p-5 bg-brand-cream border border-stone-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold" placeholder="০১৮XXXXXXXX" />
                </div>
              </div>
              
              <div className="mt-8 space-y-3">
                <label className="text-sm font-bold uppercase tracking-widest text-stone-400">সম্পূর্ণ ঠিকানা *</label>
                <textarea required rows={4} className="w-full p-5 bg-brand-cream border border-stone-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold" placeholder="আপনার ঠিকানা লিখুন..."></textarea>
              </div>

              <div className="mt-12">
                <p className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-6">ডেলিভারি এলাকা *</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <button
                    type="button"
                    onClick={() => setShippingMethod('dhaka')}
                    className={`p-8 rounded-xl border-2 flex items-center justify-between transition-all ${
                      shippingMethod === 'dhaka' ? 'border-brand-red bg-brand-red/5' : 'border-stone-100 bg-white'
                    }`}
                  >
                    <div className="text-left">
                      <h4 className="font-black text-2xl">ঢাকার ভেতরে</h4>
                      <p className="text-stone-400 uppercase tracking-tighter text-xs">১-২ কার্যদিবস</p>
                    </div>
                    <span className="font-black text-2xl text-brand-red">৳{SHIPPING_COST_DHAKA}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShippingMethod('outside')}
                    className={`p-8 rounded-xl border-2 flex items-center justify-between transition-all ${
                      shippingMethod === 'outside' ? 'border-brand-red bg-brand-red/5' : 'border-stone-100 bg-white'
                    }`}
                  >
                    <div className="text-left">
                      <h4 className="font-black text-2xl">ঢাকার বাইরে</h4>
                      <p className="text-stone-400 uppercase tracking-tighter text-xs">৩-৫ কার্যদিবস</p>
                    </div>
                    <span className="font-black text-2xl text-brand-red">৳{SHIPPING_COST_OUTSIDE}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-stone-100">
              <h2 className="text-2xl font-black mb-10 decoration-brand-gold decoration-4 underline-offset-8 underline">পেমেন্ট পদ্ধতি</h2>
              <div className="p-8 bg-brand-cream border-2 border-brand-red/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="p-1 border-2 border-brand-red rounded-full">
                    <div className="w-3 h-3 bg-brand-red rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-black text-2xl">Cash on Delivery</h4>
                    <p className="text-stone-400">পণ্য হাতে পেয়ে টাকা পরিশোধ করুন</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-10 rounded-2xl shadow-2xl border border-stone-100 sticky top-32">
              <h2 className="text-2xl font-black mb-10 border-b border-stone-100 pb-4 uppercase tracking-tighter">Summary</h2>
              
              <div className="space-y-6 mb-10 max-h-60 overflow-y-auto scrollbar-hide">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-sand/30 rounded-lg overflow-hidden border border-stone-100">
                        <img src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-black text-sm leading-tight">{item.nameBn}</p>
                        <p className="text-stone-400 text-[10px] uppercase font-bold tracking-widest">{item.weightBn} x {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-black text-brand-dark">৳{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-6 mb-10 border-t border-brand-cream pt-8">
                <div className="flex justify-between text-stone-400 font-bold uppercase text-xs tracking-widest leading-none">
                  <span>Subtotal</span>
                  <span className="text-brand-dark">৳{totalPrice}</span>
                </div>
                <div className="flex justify-between text-stone-400 font-bold uppercase text-xs tracking-widest leading-none">
                  <span>Delivery</span>
                  <span className="text-brand-dark">৳{shippingCost}</span>
                </div>
                <div className="flex justify-between text-4xl font-black text-brand-dark pt-4">
                  <span className="tracking-tighter">Total</span>
                  <span className="text-brand-red">৳{grandTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-red text-white py-6 rounded-xl font-black text-3xl shadow-xl hover:bg-brand-dark transition-all active:scale-95"
              >
                অর্ডার কনফার্ম
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
