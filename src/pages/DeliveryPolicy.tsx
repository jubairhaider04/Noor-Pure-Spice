/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

const DeliveryPolicy: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-brand-cream">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-brand-dark/5"
        >
          <h1 className="text-4xl font-bold font-bn text-brand-red mb-8 border-b border-brand-sand pb-4">
            ডেলিভারি পলিসি (Delivery Policy)
          </h1>
          
          <div className="space-y-8 text-brand-dark leading-relaxed font-bn text-lg">
            <p className="font-sans text-base">নূর পিওর স্পাইস থেকে অর্ডার করার জন্য ধন্যবাদ।</p>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-brand-dark">ডেলিভারি সময়</h2>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>ঢাকার ভিতরে: ১–৩ কর্মদিবস</li>
                <li>ঢাকার বাইরে: ২–৫ কর্মদিবস</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-brand-dark">ডেলিভারি চার্জ</h2>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>ঢাকার ভিতরে: ৳৬০</li>
                <li>ঢাকার বাইরে: ৳১২০</li>
              </ul>
              <p className="mt-2 text-stone-500 text-base">(অফার বা ক্যাম্পেইনের সময় চার্জ পরিবর্তিত হতে পারে)</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-brand-dark">অর্ডার ট্র্যাকিং</h2>
              <p>অর্ডার নিশ্চিত হওয়ার পর আপনার মোবাইলে আপডেট পাঠানো হবে।</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-brand-dark">ডেলিভারি সংক্রান্ত শর্ত</h2>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>সঠিক নাম, মোবাইল নম্বর ও ঠিকানা প্রদান করতে হবে।</li>
                <li>গ্রাহকের অনুপস্থিতির কারণে পুনরায় ডেলিভারিতে অতিরিক্ত চার্জ প্রযোজ্য হতে পারে।</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeliveryPolicy;
