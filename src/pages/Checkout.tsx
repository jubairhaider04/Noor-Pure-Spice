import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Truck, CreditCard, ChevronLeft, Ticket, XCircle, Mail } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { SHIPPING_COST_DHAKA, SHIPPING_COST_OUTSIDE } from '../constants';
import { db } from '../services/firebase';
import { sendEmail, getOrderConfirmationHtml, getAdminNewOrderNotificationHtml } from '../services/emailService';
import { 
  collection, 
  serverTimestamp, 
  query, 
  where, 
  getDocs,
  runTransaction,
  doc,
  setDoc
} from 'firebase/firestore';

const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, profile } = useAuth();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'dhaka' | 'outside'>('dhaka');
  
  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: user?.email || '',
        phone: profile.phone || '',
        address: profile.address || ''
      });
    }
  }, [profile, user]);

  const shippingCost = shippingMethod === 'dhaka' ? SHIPPING_COST_DHAKA : SHIPPING_COST_OUTSIDE;
  const discount = appliedCoupon ? (appliedCoupon.type === 'percentage' ? (totalPrice * appliedCoupon.value / 100) : appliedCoupon.value) : 0;
  const grandTotal = totalPrice + shippingCost - discount;

  const handleApplyCoupon = async () => {
    setCouponError('');
    if (!couponCode) return;

    try {
      const q = query(collection(db, 'coupons'), where('code', '==', couponCode), where('isActive', '==', true));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setCouponError('কুপনটি সঠিক নয় বা মেয়াদ শেষ হয়ে গেছে');
        return;
      }

      const coupon = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as any;
      
      if (totalPrice < coupon.minOrder) {
        setCouponError(`এই কুপন ব্যবহারের জন্য নূন্যতম ৳${coupon.minOrder} টাকার পণ্য কিনুন`);
        return;
      }

      setAppliedCoupon(coupon);
      setCouponCode('');
    } catch (err) {
      setCouponError('কুপন যাচাই করতে সমস্যা হয়েছে');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);

    try {
      let finalOrderId = '';
      await runTransaction(db, async (transaction) => {
        // 1. First, perform all READS: Get stock snapshots for all items in the cart
        const stockUpdates: Array<{ ref: any; newStock: number }> = [];
        for (const item of cart) {
          const productRef = doc(db, 'products', item.id);
          const productSnap = await transaction.get(productRef);
          if (productSnap.exists()) {
            const currentStock = productSnap.data().stock || 0;
            const newStock = Math.max(0, currentStock - item.quantity);
            stockUpdates.push({ ref: productRef, newStock });
          }
        }

        // 2. Next, perform all WRITES: Create the order document
        const orderData = {
          userId: user?.uid || 'guest',
          customerInfo: formData,
          items: cart,
          totalAmount: grandTotal,
          deliveryCharge: shippingCost,
          couponDiscount: discount,
          status: 'pending',
          paymentMethod: 'Cash on Delivery',
          createdAt: serverTimestamp()
        };

        const ordersRef = collection(db, 'orders');
        const newOrderRef = doc(ordersRef);
        finalOrderId = newOrderRef.id;
        transaction.set(newOrderRef, orderData);

        // 3. Write stock updates
        for (const update of stockUpdates) {
          transaction.update(update.ref, { stock: update.newStock });
        }
      });

      // 3. Send Confirmation Email to Customer (optional, don't block UI if it fails)
      if (formData.email) {
        sendEmail({
          to: formData.email,
          subject: 'অর্ডার কনফার্মেশন - নূর গুঁড়া মসলা',
          html: getOrderConfirmationHtml({ id: finalOrderId, customerInfo: formData, totalAmount: grandTotal })
        }).catch(err => console.error('Failed to send confirmation email:', err));
      }

      // 4. Send Order Notification Email to Admin (jubair04sale@gmail.com)
      sendEmail({
        to: 'jubair04sale@gmail.com',
        subject: `🔔 নূর গুঁড়া মসলা - নতুন অর্ডার #${finalOrderId.slice(-6).toUpperCase()}`,
        html: getAdminNewOrderNotificationHtml({
          id: finalOrderId,
          customerInfo: formData,
          items: cart,
          totalAmount: grandTotal,
          deliveryCharge: shippingCost,
          couponDiscount: discount
        })
      }).catch(err => console.error('Failed to send admin order email:', err));

      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      console.error('Checkout error:', err);
      alert('অর্ডার সম্পন্ন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
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
                  <input 
                    required type="text" 
                    className="w-full p-5 bg-brand-cream border border-stone-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold" 
                    placeholder="নাম" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-widest text-stone-400">ফোন নাম্বার *</label>
                  <input 
                    required type="text" 
                    className="w-full p-5 bg-brand-cream border border-stone-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold" 
                    placeholder="০১৮XXXXXXXX" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-stone-400">ইমেইল (অর্ডার আপডেটের জন্য)</label>
                  <input 
                    type="email" 
                    className="w-full p-5 bg-brand-cream border border-stone-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold" 
                    placeholder="example@mail.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="mt-8 space-y-3">
                <label className="text-sm font-bold uppercase tracking-widest text-stone-400">সম্পূর্ণ ঠিকানা *</label>
                <textarea 
                  required rows={4} 
                  className="w-full p-5 bg-brand-cream border border-stone-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold" 
                  placeholder="আপনার ঠিকানা লিখুন..."
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                ></textarea>
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

              <div className="mb-10">
                <div className="relative">
                  <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="কুপন কোড..." 
                    className="w-full pl-11 pr-24 py-4 bg-stone-50 border border-stone-100 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  />
                  <button 
                    type="button"
                    onClick={handleApplyCoupon}
                    className="absolute right-2 top-2 bottom-2 bg-brand-dark text-white px-4 rounded-lg text-sm font-bold hover:bg-brand-red transition-all"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-red-500 text-xs mt-2 font-bold ml-1">{couponError}</p>}
                {appliedCoupon && (
                   <div className="mt-4 flex items-center justify-between bg-green-50 p-3 rounded-xl border border-green-100">
                      <div className="flex items-center gap-2 text-green-700">
                         <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-white"><CheckCircle size={12} /></div>
                         <span className="font-bold text-sm">Coupon: {appliedCoupon.code}</span>
                      </div>
                      <button onClick={() => setAppliedCoupon(null)} className="text-stone-400 hover:text-red-500"><XCircle size={16} /></button>
                   </div>
                )}
              </div>
              
              <div className="space-y-6 mb-10 max-h-60 overflow-y-auto scrollbar-hide border-b border-stone-50 pb-8">
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

              <div className="space-y-6 mb-10 pt-8">
                <div className="flex justify-between text-stone-400 font-bold uppercase text-xs tracking-widest leading-none">
                  <span>Subtotal</span>
                  <span className="text-brand-dark">৳{totalPrice}</span>
                </div>
                <div className="flex justify-between text-stone-400 font-bold uppercase text-xs tracking-widest leading-none">
                  <span>Delivery</span>
                  <span className="text-brand-dark">৳{shippingCost}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 font-bold uppercase text-xs tracking-widest leading-none">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>- ৳{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-4xl font-black text-brand-dark pt-4">
                  <span className="tracking-tighter">Total</span>
                  <span className="text-brand-red">৳{grandTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full bg-brand-red text-white py-6 rounded-xl font-black text-3xl shadow-xl hover:bg-brand-dark transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
              >
                {loading ? 'প্রসেসিং...' : 'অর্ডার কনফার্ম'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
