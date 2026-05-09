/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

const PrivacyPolicy: React.FC = () => {
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
            প্রাইভেসি পলিসি (Privacy Policy)
          </h1>
          
          <div className="space-y-8 text-brand-dark leading-relaxed font-bn text-lg">
            <p className="font-sans text-base">নূর পিওর স্পাইস আপনার ব্যক্তিগত তথ্যের নিরাপত্তাকে গুরুত্ব সহকারে বিবেচনা করে।</p>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-brand-dark">আমরা যেসব তথ্য সংগ্রহ করি</h2>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>নাম</li>
                <li>মোবাইল নম্বর</li>
                <li>ঠিকানা</li>
                <li>ইমেইল (যদি প্রদান করা হয়)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-brand-dark">তথ্য ব্যবহারের উদ্দেশ্য</h2>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>অর্ডার প্রসেসিং</li>
                <li>ডেলিভারি সম্পন্ন করা</li>
                <li>কাস্টমার সাপোর্ট প্রদান</li>
                <li>অফার ও আপডেট জানানো</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-brand-dark">তথ্যের নিরাপত্তা</h2>
              <p>আপনার ব্যক্তিগত তথ্য নিরাপদভাবে সংরক্ষণ করা হয় এবং তৃতীয় পক্ষের কাছে বিক্রি করা হয় না।</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-brand-dark">কুকিজ (Cookies)</h2>
              <p>ওয়েবসাইটের অভিজ্ঞতা উন্নত করতে আমরা কুকিজ ব্যবহার করতে পারি।</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-brand-dark">নীতিমালার পরিবর্তন</h2>
              <p>প্রয়োজনে এই প্রাইভেসি পলিসি আপডেট করা হতে পারে। আপডেটেড ভার্সন ওয়েবসাইটে প্রকাশ করা হবে।</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
