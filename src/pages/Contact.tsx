import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Facebook, Instagram, Send, CheckCircle, ChevronLeft, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { FACEBOOK_URL, PHONE_NUMBER, PHONE_NUMBER_BN, WHATSAPP_NUMBER } from '../constants';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-brand-cream min-h-screen text-brand-dark font-bn">
      {/* Header */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-brand-gold font-bold tracking-widest uppercase text-xs mb-2 block">Available 24/7</span>
          <h1 className="text-5xl md:text-6xl font-black mb-6">আমাদের সাথে <span className="text-brand-red">যোগাযোগ</span> করুন</h1>
          <p className="text-xl text-stone-500 max-w-xl mx-auto">
            আপনার যেকোনো প্রশ্ন বা মতামতের জন্য আমাদের সাথে যোগাযোগ করতে পারেন। আমরা দ্রুত উত্তর দেয়ার চেষ্টা করি।
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-10 md:p-12 rounded-2xl shadow-xl border border-stone-100">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} />
                    </div>
                    <h3 className="text-3xl font-black mb-4">বার্তাটি পাঠানো হয়েছে!</h3>
                    <p className="text-lg text-stone-500 mb-8">আমরা খুব শীঘ্রই আপনার সাথে যোগাযোগ করব।</p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-brand-red font-black text-xl hover:underline"
                    >
                      আরেকটি বার্তা পাঠান
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-400">নাম *</label>
                        <input required type="text" className="w-full p-5 bg-brand-cream border border-stone-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold" placeholder="আপনার নাম" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-400">ইমেইল / ফোন *</label>
                        <input required type="text" className="w-full p-5 bg-brand-cream border border-stone-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold" placeholder="০১৮XXXXXXXX" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-400">বিষয়</label>
                      <input type="text" className="w-full p-5 bg-brand-cream border border-stone-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold" placeholder="বার্তার মূল বিষয়" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-400">বার্তা *</label>
                      <textarea required rows={5} className="w-full p-5 bg-brand-cream border border-stone-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold" placeholder="আপনার বার্তাটি এখানে লিখুন..."></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-brand-red text-white py-5 rounded-xl font-black text-2xl shadow-xl hover:bg-brand-dark transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                      বার্তা পাঠান <Send size={20} />
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Info Cards */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-brand-dark p-10 rounded-2xl shadow-2xl text-white relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                 <h3 className="text-2xl font-black mb-8 border-b border-white/10 pb-4">Contact Info</h3>
                 <div className="space-y-8">
                    <div className="flex items-start gap-6">
                       <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-brand-gold shrink-0">
                          <MapPin size={24} />
                       </div>
                       <div>
                          <p className="text-brand-gold font-bold uppercase tracking-widest text-[10px] mb-1">Office Address</p>
                          <p className="text-xl">ঢাকা, বাংলাদেশ</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-6">
                       <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-brand-gold shrink-0">
                          <Phone size={24} />
                       </div>
                       <div>
                          <p className="text-brand-gold font-bold uppercase tracking-widest text-[10px] mb-1">Phone Number</p>
                          <p className="text-xl">{PHONE_NUMBER_BN}</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-6">
                       <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-brand-gold shrink-0">
                          <Mail size={24} />
                       </div>
                       <div>
                          <p className="text-brand-gold font-bold uppercase tracking-widest text-[10px] mb-1">Email Support</p>
                          <p className="text-xl">info@noorpurespice.com</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-10 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between">
                 <div>
                    <h4 className="text-xl font-black mb-1">Social Media</h4>
                    <p className="text-stone-400 text-sm">Follow our story</p>
                 </div>
                 <div className="flex gap-3">
                    <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-brand-cream border border-stone-100 rounded-xl flex items-center justify-center text-brand-red hover:bg-brand-red hover:text-white transition-all shadow-sm"><Facebook size={20} /></a>
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-brand-cream border border-stone-100 rounded-xl flex items-center justify-center text-brand-red hover:bg-brand-red hover:text-white transition-all shadow-sm"><MessageCircle size={20} title="WhatsApp" /></a>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
