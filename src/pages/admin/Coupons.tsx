import React, { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Plus, Edit, Trash2, Ticket, Check, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AIAssistant from '../admin/AIAssistant';

const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);

  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrder: '',
    expiryDate: '',
    isActive: true,
    promoText: ''
  });

  const fetchCoupons = async () => {
    setLoading(true);
    const q = query(collection(db, 'coupons'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCoupons(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      value: Number(formData.value),
      minOrder: Number(formData.minOrder),
      updatedAt: serverTimestamp()
    };

    if (editingCoupon) {
      await updateDoc(doc(db, 'coupons', editingCoupon.id), data);
    } else {
      await addDoc(collection(db, 'coupons'), {
        ...data,
        createdAt: serverTimestamp()
      });
    }

    setIsModalOpen(false);
    setEditingCoupon(null);
    setFormData({ code: '', type: 'percentage', value: '', minOrder: '', expiryDate: '', isActive: true, promoText: '' });
    fetchCoupons();
  };

  const handleEdit = (coupon: any) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      minOrder: coupon.minOrder.toString(),
      expiryDate: coupon.expiryDate,
      isActive: coupon.isActive,
      promoText: coupon.promoText || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('আপনি কি এই কুপনটি মুছে ফেলতে চান?')) {
      await deleteDoc(doc(db, 'coupons', id));
      fetchCoupons();
    }
  };

  const toggleStatus = async (coupon: any) => {
     await updateDoc(doc(db, 'coupons', coupon.id), { isActive: !coupon.isActive });
     fetchCoupons();
  };

  const handleUseAIPromoText = (content: string) => {
    setFormData({ ...formData, promoText: content });
  };

  return (
    <div className="space-y-8 font-bn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-brand-dark">কুপন ব্যবস্থাপনা</h1>
          <p className="text-stone-500 text-lg">ডিসকাউন্ট অফার এবং প্রমো কুপন তৈরি করুন</p>
        </div>
        <button 
          onClick={() => { setEditingCoupon(null); setIsModalOpen(true); }}
          className="bg-brand-red text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-dark transition-all shadow-lg"
        >
          <Plus size={20} />
          নতুন কুপন
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
            <p className="col-span-full text-center py-12 text-xl">লোডিং...</p>
        ) : coupons.length === 0 ? (
            <p className="col-span-full text-center py-12 text-xl">কোনো কুপন নেই</p>
        ) : coupons.map((coupon) => (
          <motion.div 
            key={coupon.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white rounded-3xl p-6 border-2 transition-all relative overflow-hidden group ${coupon.isActive ? 'border-brand-gold/20 shadow-sm hover:shadow-xl' : 'border-stone-100 opacity-60'}`}
          >
            {/* Coupon Card Top Styling */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 -mr-8 -mt-8 rounded-full"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-brand-red/5 text-brand-red rounded-2xl">
                <Ticket size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(coupon)} className="p-2 bg-stone-100 text-stone-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(coupon.id)} className="p-2 bg-stone-100 text-stone-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
                   <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-black text-brand-dark font-sans tracking-widest">{coupon.code}</h3>
                <p className="text-stone-500 font-bold">
                  {coupon.type === 'percentage' ? `${coupon.value}% ডিসকাউন্ট` : `৳ ${coupon.value} ছাড়`}
                </p>
              </div>

              <div className="pt-4 border-t border-dashed border-stone-200 grid grid-cols-2 gap-4 text-sm font-sans">
                <div>
                    <p className="text-stone-400 mb-1">ন্যূনতম অর্ডার</p>
                    <p className="font-bold text-brand-dark">৳ {coupon.minOrder}</p>
                </div>
                <div>
                   <p className="text-stone-400 mb-1">মেয়াদ শেষ</p>
                   <p className="font-bold text-brand-dark">{coupon.expiryDate}</p>
                </div>
              </div>

              <button 
                onClick={() => toggleStatus(coupon)}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${coupon.isActive ? 'bg-green-50 text-green-600' : 'bg-stone-100 text-stone-500'}`}
              >
                {coupon.isActive ? <><Check size={18} /> সক্রিয় আছে</> : <><X size={18} /> ইন-অ্যাক্টিভ</>}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 border-b border-stone-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-black text-brand-dark">
                  {editingCoupon ? 'কুপন এডিট করুন' : 'নতুন কুপন যুক্ত করুন'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-brand-red transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-500 ml-1">কুপন কোড (ইংরেজি)</label>
                    <input 
                      type="text" required placeholder="যেমন: EID20"
                      className="w-full px-4 py-3 bg-stone-50 rounded-xl border-none focus:ring-2 focus:ring-brand-red/20 font-sans font-bold uppercase tracking-widest text-lg"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-stone-500 ml-1">ডিসকাউন্ট টাইপ</label>
                        <select 
                            className="w-full px-4 py-3 bg-stone-50 rounded-xl border-none focus:ring-2 focus:ring-brand-red/20 font-bn"
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                        >
                            <option value="percentage">শতকরা (%)</option>
                            <option value="fixed">ফিক্সড (৳)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-stone-500 ml-1">ডিসকাউন্ট ভ্যালু</label>
                        <input 
                            type="number" required
                            className="w-full px-4 py-3 bg-stone-50 rounded-xl border-none focus:ring-2 focus:ring-brand-red/20 font-bn text-lg"
                            value={formData.value}
                            onChange={(e) => setFormData({...formData, value: e.target.value})}
                        />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-stone-500 ml-1">ন্যূনতম অর্ডার (৳)</label>
                        <input 
                            type="number" required
                            className="w-full px-4 py-3 bg-stone-50 rounded-xl border-none focus:ring-2 focus:ring-brand-red/20 font-bn text-lg"
                            value={formData.minOrder}
                            onChange={(e) => setFormData({...formData, minOrder: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-stone-500 ml-1">মেয়াদ শেষ (তারিখ)</label>
                        <input 
                            type="date" required
                            className="w-full px-4 py-3 bg-stone-50 rounded-xl border-none focus:ring-2 focus:ring-brand-red/20 font-sans"
                            value={formData.expiryDate}
                            onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                        />
                    </div>
                  </div>
                </div>

                {/* Promo Text with AI Assistant */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-stone-500 ml-1">প্রচারমূলক বার্তা (ঐচ্ছিক)</label>
                    {formData.code && (
                      <AIAssistant
                        type="coupon"
                        data={{
                          code: formData.code,
                          value: formData.value,
                          type: formData.type
                        }}
                        onUse={handleUseAIPromoText}
                      />
                    )}
                  </div>
                  <textarea 
                    className="w-full px-4 py-3 bg-stone-50 rounded-xl border-none focus:ring-2 focus:ring-brand-red/20 font-bn text-lg min-h-[80px]"
                    placeholder="প্রমোশনাল বার্তা বা বিবরণ..."
                    value={formData.promoText}
                    onChange={(e) => setFormData({...formData, promoText: e.target.value})}
                  />
                </div>

                <div className="flex items-center gap-2 py-2">
                   <input 
                     type="checkbox"
                     id="isActive"
                     checked={formData.isActive}
                     onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                     className="w-5 h-5 accent-brand-red"
                   />
                   <label htmlFor="isActive" className="text-lg font-bold text-brand-dark cursor-pointer">কুপনটি সক্রিয় করুন</label>
                </div>

                <button type="submit" className="w-full bg-brand-red text-white py-4 rounded-xl font-black text-xl hover:bg-brand-dark transition-all shadow-lg active:scale-95">
                  তথ্য সংরক্ষণ করুন
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCoupons;
