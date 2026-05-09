/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

const Terms: React.FC = () => {
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
            নীতিমালা (Terms & Conditions)
          </h1>
          
          <div className="space-y-8 text-brand-dark leading-relaxed font-bn text-lg">
            <p className="font-sans text-base">
              স্বাগতম “নূর পিওর স্পাইস” ওয়েবসাইটে। আমাদের ওয়েবসাইট ব্যবহার ও পণ্য অর্ডার করার মাধ্যমে আপনি নিচের শর্তাবলীতে সম্মত হচ্ছেন।
            </p>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-brand-dark">১. পণ্যের তথ্য</h2>
              <p>আমরা সর্বোচ্চ চেষ্টা করি সঠিক তথ্য, ছবি ও মূল্য প্রদর্শনের জন্য। তবে বিশেষ পরিস্থিতিতে মূল্য, অফার বা স্টকের পরিবর্তন হতে পারে।</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-brand-dark">২. অর্ডার নিশ্চিতকরণ</h2>
              <p>অর্ডার সম্পন্ন হওয়ার পর আমাদের টিম ফোন বা SMS এর মাধ্যমে অর্ডার নিশ্চিত করতে পারে। ভুল তথ্য প্রদান করলে অর্ডার বাতিল হতে পারে।</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-brand-dark">৩. পেমেন্ট</h2>
              <p>আমরা ক্যাশ অন ডেলিভারি (COD), মোবাইল ব্যাংকিং ও অনলাইন পেমেন্ট গ্রহণ করি। সকল পেমেন্ট নিরাপদভাবে সম্পন্ন করা হয়।</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-brand-dark">৪. ডেলিভারি সময়</h2>
              <p>লোকেশন অনুযায়ী ডেলিভারি সময় পরিবর্তিত হতে পারে। সাধারণত:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>ঢাকার ভিতরে: ১–৩ কর্মদিবস</li>
                <li>ঢাকার বাইরে: ২–৫ কর্মদিবস</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-brand-dark">৫. পণ্যের ব্যবহার</h2>
              <p>আমাদের মসলা খাদ্য প্রস্তুতের জন্য উপযোগী। সঠিকভাবে সংরক্ষণ না করলে পণ্যের গুণগত মান নষ্ট হতে পারে।</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-brand-dark">৬. পরিবর্তন ও সংশোধন</h2>
              <p>নূর পিওর স্পাইস যেকোনো সময় এই নীতিমালা পরিবর্তনের অধিকার সংরক্ষণ করে।</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
