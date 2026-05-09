/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

const ReturnPolicy: React.FC = () => {
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
            রিটার্ন পলিসি (Return Policy)
          </h1>
          
          <div className="space-y-8 text-brand-dark leading-relaxed font-bn text-lg">
            <p className="font-sans text-base">আমরা গ্রাহকের সন্তুষ্টিকে সর্বোচ্চ গুরুত্ব দিই।</p>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-brand-dark">রিটার্নের শর্ত</h2>
              <p className="mb-2">নিচের ক্ষেত্রে পণ্য রিটার্ন গ্রহণযোগ্য:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>ভুল পণ্য ডেলিভারি হলে</li>
                <li>পণ্য ক্ষতিগ্রস্ত অবস্থায় পৌঁছালে</li>
                <li>মেয়াদোত্তীর্ণ পণ্য হলে</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-brand-dark">রিটার্নের সময়সীমা</h2>
              <p>পণ্য গ্রহণের ২৪ ঘণ্টার মধ্যে আমাদের সাথে যোগাযোগ করতে হবে।</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-brand-dark">রিটার্ন প্রক্রিয়া</h2>
              <p className="mb-2">রিটার্নের জন্য:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>অর্ডার নম্বর</li>
                <li>পণ্যের ছবি</li>
                <li>সমস্যার বিবরণ</li>
              </ul>
              <p className="mt-4">আমাদের কাস্টমার সাপোর্টে পাঠাতে হবে।</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 text-brand-dark">রিফান্ড</h2>
              <p>রিটার্ন যাচাইয়ের পর ৩–৭ কর্মদিবসের মধ্যে রিফান্ড বা রিপ্লেসমেন্ট প্রদান করা হবে।</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
