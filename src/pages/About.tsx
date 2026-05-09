import React from 'react';
import { motion } from 'motion/react';
import { BRAND_NAME_BN, TAGLINE_BN } from '../constants';
import { ShieldCheck, Heart, Leaf, Award } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-brand-cream min-h-screen text-brand-dark overflow-hidden font-bn">
      {/* Header Section */}
      <section className="relative py-24 text-center">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-gold font-bold tracking-widest uppercase text-sm mb-4 block"
          >
            Since 2024
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl font-black mb-8 leading-none"
          >
            আমাদের <span className="text-brand-red underline decoration-brand-gold decoration-4 underline-offset-8">গল্প</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-stone-500 leading-relaxed max-w-2xl mx-auto"
          >
            খাঁটি মশলার স্বাদ বাংলার প্রতিটি ঘরে পৌঁছে দেয়াই আমাদের প্রধান লক্ষ্য। আমরা বিশ্বাস করি গুণমানের কোনো বিকল্প নেই।
          </motion.p>
        </div>
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-sand/30 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>
      </section>

      {/* Mission & Vision - Split Layout */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-brand-gold/10 transform rotate-3 rounded-2xl -z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=800&auto=format&fit=crop"
                alt="Our spice sourcing"
                className="w-full rounded-2xl shadow-2xl border-8 border-white"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-10"
            >
              <div>
                <h2 className="text-4xl font-black mb-6 text-brand-dark flex items-center gap-4">
                  <div className="w-12 h-1.5 bg-brand-red"></div> আমাদের লক্ষ্য
                </h2>
                <p className="text-xl text-stone-500 leading-relaxed">
                  ভেজালমুক্ত খাবার নিশ্চিত করা এবং বাংলার ঐতিহ্যবাহী রান্নার স্বাদ অক্ষুণ্ণ রাখা। আমরা সরাসরি কৃষকদের কাছ থেকে সেরা মানের কাঁচামাল সংগ্রহ করি এবং তা সম্পূর্ণ স্বাস্থ্যসম্মত উপায়ে প্রক্রিয়াজাত করি।
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="p-8 bg-white rounded-xl shadow-sm border border-stone-100">
                  <h4 className="text-4xl font-black text-brand-red mb-2">১০০%</h4>
                  <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">Natural Ingredients</p>
                </div>
                <div className="p-8 bg-brand-dark rounded-xl shadow-xl">
                  <h4 className="text-4xl font-black text-brand-gold mb-2">৫০০০+</h4>
                  <p className="text-white/50 font-bold uppercase tracking-widest text-[10px]">Happy Families</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-brand-dark text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">আমাদের <span className="text-brand-gold">মূলনীতি</span></h2>
            <div className="w-20 h-1.5 bg-brand-red mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <ShieldCheck size={40} />, title: 'খাঁটি নিশ্চয়তা', desc: 'কোনো কৃত্রিম রঙ বা প্রিজারভেটিভ ব্যবহার করা হয় না।' },
              { icon: <Leaf size={40} />, title: 'সরাসরি সংগ্রহ', desc: 'সেরা কৃষকদের হাত ধরে আসে সেরা ফসল।' },
              { icon: <Heart size={40} />, title: 'পরম যত্ন', desc: 'প্রতিটি প্যাকেট পরম যত্নে আপনার জন্য তৈরি।' }
            ].map((value, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="p-10 border border-white/10 rounded-2xl hover:bg-white/5 transition-all"
              >
                <div className="text-brand-gold mb-6">{value.icon}</div>
                <h3 className="text-2xl font-black mb-4">{value.title}</h3>
                <p className="text-stone-400 text-lg leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
           <div className="absolute top-20 right-20 w-64 h-64 border-8 border-brand-gold rounded-full"></div>
           <div className="absolute bottom-20 left-20 w-40 h-40 bg-brand-red rounded-full"></div>
        </div>
      </section>
    </div>
  );
};

export default About;
