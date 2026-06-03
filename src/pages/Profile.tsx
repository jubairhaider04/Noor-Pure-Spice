import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { 
  ShoppingBag, 
  User as UserIcon, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle, 
  ChevronDown, 
  ChevronUp,
  Package,
  AlertCircle,
  ShieldCheck,
  ShoppingBag as BagIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import LoginModal from '../components/LoginModal';

const formatBnNum = (num: number | string) => {
  const digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (d) => digits[parseInt(d)]);
};

const formatBnCurrency = (num: number) => {
  const formatted = Math.round(num).toLocaleString('en-IN');
  return '৳ ' + formatBnNum(formatted);
};

const formatBnDate = (timestamp: any) => {
  if (!timestamp) return 'প্রক্রিয়াধীন...';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  
  const monthsBn = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  
  const day = date.getDate();
  const month = monthsBn[date.getMonth()];
  const year = date.getFullYear();
  
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'পিএম' : 'এএম';
  hours = hours % 12;
  hours = hours ? hours : 12;
  
  return `${formatBnNum(day)} ${month}, ${formatBnNum(year)} • ${formatBnNum(hours)}:${formatBnNum(minutes)} ${ampm}`;
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'confirmed': return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'shipped': return 'bg-purple-50 text-purple-600 border-purple-200';
    case 'delivered': return 'bg-green-50 text-green-600 border-green-200';
    case 'cancelled': return 'bg-red-50 text-red-600 border-red-200';
    default: return 'bg-stone-50 text-stone-600 border-stone-200';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'পেন্ডিং (অপেক্ষমান)';
    case 'confirmed': return 'কনফার্মড (প্রক্রিয়াধীন)';
    case 'shipped': return 'শিপড (পাঠানো হয়েছে)';
    case 'delivered': return 'ডেলিভারড (পৌঁছেছে)';
    case 'cancelled': return 'বাতিল করা হয়েছে';
    default: return status;
  }
};

const getStepsForStatus = (status: string) => {
  const steps = [
    { label: 'অর্ডার গৃহীত', desc: 'অর্ডার পাওয়া গেছে', icon: Clock },
    { label: 'অর্ডার নিশ্চিত', desc: 'পণ্য প্রস্তুত হচ্ছে', icon: ShieldCheck },
    { label: 'শিপড', desc: 'কুরিয়ারে হস্তান্তর', icon: Truck },
    { label: 'ডেলিভারড', desc: 'সফল বিতরণ সম্পন্ন', icon: CheckCircle },
  ];

  let currentStepIndex = 0;
  if (status === 'pending') currentStepIndex = 0;
  else if (status === 'confirmed') currentStepIndex = 1;
  else if (status === 'shipped') currentStepIndex = 2;
  else if (status === 'delivered') currentStepIndex = 3;
  else if (status === 'cancelled') currentStepIndex = -1;

  return { steps, currentStepIndex };
};

const Profile: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<{ [key: string]: boolean }>({});
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }

    setOrdersLoading(true);
    // Setup real-time listener for user's orders
    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setOrdersLoading(false);
    }, (err) => {
      console.error('Error fetching customer orders:', err);
      setOrdersLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center font-bn py-20">
        <div className="w-16 h-16 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-xl font-bold text-stone-600">আপনার প্রোফাইল লোড হচ্ছে...</p>
      </div>
    );
  }

  // Guest view - Prompt Login
  if (!user) {
    return (
      <div className="min-h-screen bg-brand-cream font-bn py-16 px-4 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-stone-100 shadow-xl"
        >
          <div className="w-20 h-20 bg-red-50 text-brand-red rounded-full flex items-center justify-center mx-auto mb-6">
            <UserIcon size={40} />
          </div>
          <h2 className="text-3xl font-black text-brand-dark mb-4">অর্ডার ট্র্যাকিং ও প্রোফাইল</h2>
          <p className="text-stone-500 text-lg mb-8 leading-relaxed">
            আপনার আগের ও বর্তমান অর্ডারগুলোর লাইভ স্ট্যাটাস দেখতে এবং ডেলিভারি ট্র্যাকিং করতে দয়া করে অ্যাকাউন্ট লগইন করুন।
          </p>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="w-full bg-brand-red text-white py-4 rounded-xl font-black text-xl hover:bg-brand-dark transition-all active:scale-[0.98] shadow-lg mb-4"
          >
            লগইন / সাইন আপ করুন
          </button>
          <Link 
            to="/shop" 
            className="inline-block text-brand-gold hover:text-brand-red transition-colors font-bold text-lg"
          >
            আমাদের দোকান ঘুরে দেখুন →
          </Link>

          <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </motion.div>
      </div>
    );
  }

  const userDisplayName = profile?.name || user.displayName || user.email?.split('@')[0] || 'গ্রাহক';
  const userPhone = profile?.phone || 'যোগ করা হয়নি';
  const userJoinedDate = profile?.createdAt ? formatBnDate(profile.createdAt) : null;

  return (
    <div className="bg-brand-cream min-h-screen font-bn py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Profile Card Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-stone-100 shadow-md relative overflow-hidden"
        >
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-2xl -z-0 translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between relative z-10">
            <div className="flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
              {/* User Avatar */}
              <div className="w-20 h-20 bg-brand-red text-white text-3xl font-black rounded-full flex items-center justify-center shadow-lg border-4 border-brand-cream ring-2 ring-brand-red/20 uppercase">
                {userDisplayName.charAt(0)}
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-black text-brand-dark leading-tight">{userDisplayName}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-stone-500 text-base">
                  <span className="flex items-center gap-1"><Mail size={16} className="text-stone-400" /> {user.email}</span>
                  <span className="hidden sm:inline text-stone-300">•</span>
                  <span className="flex items-center gap-1"><Phone size={16} className="text-stone-400" /> {userPhone}</span>
                </div>
                {userJoinedDate && (
                  <p className="text-xs text-stone-400 flex items-center justify-center md:justify-start gap-1">
                    <Calendar size={12} /> যুক্ত হয়েছেন: {userJoinedDate}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="bg-stone-50 px-6 py-4 rounded-2xl border border-stone-100 flex items-center gap-4 text-center md:text-left w-full md:w-auto">
              <div className="p-3 bg-red-100 text-brand-red rounded-xl">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-stone-500 text-sm font-semibold">মোট অর্ডার</p>
                <p className="text-2xl font-black text-brand-dark">{formatBnNum(orders.length)} টি</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Real-time Orders Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h2 className="text-2xl font-black text-brand-dark flex items-center gap-2">
              <Package size={24} className="text-brand-red animate-pulse" />
              আমার অর্ডার ট্র্যাকিং ({formatBnNum(orders.length)})
            </h2>
            <span className="bg-green-50 text-green-700 border border-green-200 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              লাইভ ট্র্যাকিং সক্রিয়
            </span>
          </div>

          {ordersLoading ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-stone-100 shadow-sm flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-stone-500 font-bold">অর্ডারসমূহ খোঁজা হচ্ছে...</p>
            </div>
          ) : orders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl py-16 px-6 text-center border border-stone-100 shadow-sm space-y-6"
            >
              <div className="w-20 h-20 bg-stone-50 text-stone-400 rounded-full flex items-center justify-center mx-auto">
                <BagIcon size={36} />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-2xl font-bold text-brand-dark">কোনো অর্ডার পাওয়া যায়নি!</h3>
                <p className="text-stone-500 leading-relaxed text-lg">
                  আপনি এখনও কোনো অর্ডার করেননি। আমাদের খাঁটি ও ফ্রেশ মসলার কালেকশন দেখতে দোকানে ভিজিট করুন।
                </p>
              </div>
              <Link 
                to="/shop" 
                className="inline-flex items-center gap-2 bg-brand-red text-white py-3.5 px-8 rounded-xl font-black text-lg hover:bg-brand-dark transition-all active:scale-95 shadow-md"
              >
                পণ্য কেনাকাটা করুন
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, orderIdx) => {
                const isExpanded = !!expandedOrders[order.id];
                const status = order.status || 'pending';
                const formattedId = order.id.slice(-6).toUpperCase();
                
                // Timeline progress calculations
                const { steps, currentStepIndex } = getStepsForStatus(status);

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: orderIdx * 0.05 }}
                    className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden"
                  >
                    {/* Order Headline/Header Card */}
                    <div 
                      onClick={() => toggleOrderExpand(order.id)}
                      className="p-6 sm:p-8 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center cursor-pointer hover:bg-stone-50/50 transition-colors border-b border-stone-100"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-stone-400 text-sm">আইডি:</span>
                          <span className="font-black text-brand-dark text-xl font-mono">#{formattedId}</span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black border uppercase shadow-sm ${getStatusStyle(status)}`}>
                            {getStatusLabel(status)}
                          </span>
                        </div>
                        <p className="text-sm text-stone-400 flex items-center gap-1">
                          <Calendar size={14} /> অর্ডার সময়: {formatBnDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                        <div className="text-left md:text-right">
                          <p className="text-xs text-stone-400 font-semibold leading-none">সর্বমোট মূল্য</p>
                          <span className="text-2xl font-extrabold text-brand-red">{formatBnCurrency(order.totalAmount)}</span>
                        </div>
                        <div className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-brand-dark transition-colors">
                          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                        </div>
                      </div>
                    </div>

                    {/* Order Live Status Visual Timeline */}
                    <div className="px-6 py-8 sm:px-10 bg-stone-50/30 border-b border-stone-50 overflow-x-auto">
                      {status === 'cancelled' ? (
                        <div className="flex items-center gap-4 bg-red-50 text-brand-red p-5 rounded-2xl border border-red-100">
                          <XCircle size={32} className="shrink-0" />
                          <div>
                            <p className="font-black text-lg">দুঃখিত, অর্ডারটি বাতিল করা হয়েছে।</p>
                            <p className="text-sm text-red-700/85 mt-1">যোগাযোগ করুন বা পুনরায় অর্ডার করতে হেল্পলাইন নম্বর ব্যবহার করুন।</p>
                          </div>
                        </div>
                      ) : (
                        <div className="min-w-[480px]">
                          {/* Timeline Steps layout */}
                          <div className="relative flex justify-between">
                            {/* Connect Line */}
                            <div className="absolute top-5 left-1/12 right-1/12 h-1 bg-stone-200 -z-0 -translate-y-1/2">
                              <div 
                                className="h-full bg-gradient-to-r from-brand-red to-brand-gold transition-all duration-700"
                                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                              />
                            </div>

                            {steps.map((step, idx) => {
                              const StepIcon = step.icon;
                              const isCompleted = idx <= currentStepIndex;
                              const isActive = idx === currentStepIndex;

                              return (
                                <div key={idx} className="flex flex-col items-center text-center relative z-10 w-1/4">
                                  {/* Step Badge Circle */}
                                  <div 
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                                      isCompleted 
                                        ? 'bg-brand-red text-white ring-4 ring-red-100' 
                                        : 'bg-stone-100 text-stone-400 ring-4 ring-transparent'
                                    } ${isActive ? 'scale-110 !ring-brand-gold/30 !bg-brand-gold !text-brand-dark' : ''}`}
                                  >
                                    <StepIcon size={18} />
                                  </div>
                                  <p className={`mt-3 font-bold text-base leading-tight ${isCompleted ? 'text-brand-dark font-black' : 'text-stone-400'} ${isActive ? 'text-brand-gold font-black' : ''}`}>
                                    {step.label}
                                  </p>
                                  <p className="text-[11px] text-stone-400 mt-0.5 leading-tight px-1 max-w-[120px]">
                                    {step.desc}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expandable Order Details Panel */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 sm:p-8 space-y-8 border-t border-stone-100">
                            {/* Grid for items and shipping details */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                              
                              {/* Order items details */}
                              <div className="lg:col-span-7 space-y-4">
                                <h4 className="text-lg font-black text-brand-dark flex items-center gap-2 pb-2 border-b">
                                  <Package size={18} className="text-brand-red" />
                                  অর্ডারকৃত পণ্যসমূহ
                                </h4>
                                <div className="divide-y divide-stone-100 max-h-[300px] overflow-y-auto pr-2">
                                  {order.items?.map((item: any, itemIdx: number) => (
                                    <div key={itemIdx} className="py-3 flex items-center justify-between gap-4">
                                      <div className="flex items-center gap-4">
                                        <img 
                                          src={item.image || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=100"} 
                                          alt={item.nameBn} 
                                          className="w-12 h-12 rounded-xl object-cover bg-stone-100 border border-stone-100 shrink-0"
                                          referrerPolicy="no-referrer"
                                        />
                                        <div>
                                          <p className="font-bold text-brand-dark text-base">{item.nameBn}</p>
                                          <p className="text-xs text-stone-400 font-sans">{item.weightBn} • {formatBnNum(item.quantity)} টি</p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-bold text-stone-500 font-sans text-sm">{formatBnCurrency(item.price)} × {formatBnNum(item.quantity)}</p>
                                        <p className="font-extrabold text-brand-dark text-base">{formatBnCurrency(item.price * item.quantity)}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Customer Information summary */}
                              <div className="lg:col-span-5 space-y-4">
                                <h4 className="text-lg font-black text-brand-dark flex items-center gap-2 pb-2 border-b">
                                  <MapPin size={18} className="text-brand-red" />
                                  সংবাদ ও ডেলিভারি তথ্য
                                </h4>
                                <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 text-base text-stone-600 space-y-3 shadow-inner">
                                  <div>
                                    <span className="text-stone-400 text-xs block font-semibold">গ্রাহকের নাম</span>
                                    <span className="font-bold text-brand-dark">{order.customerInfo?.name}</span>
                                  </div>
                                  <div>
                                    <span className="text-stone-400 text-xs block font-semibold">যোগাযোগ নম্বর</span>
                                    <span className="font-bold text-brand-dark font-sans">{order.customerInfo?.phone}</span>
                                  </div>
                                  {order.customerInfo?.email && (
                                    <div>
                                      <span className="text-stone-400 text-xs block font-semibold">ইমেইল</span>
                                      <span className="font-semibold text-stone-500 font-sans text-sm">{order.customerInfo.email}</span>
                                    </div>
                                  )}
                                  <div>
                                    <span className="text-stone-400 text-xs block font-semibold">ডেলিভারি ঠিকানা</span>
                                    <span className="font-bold text-brand-dark leading-tight">{order.customerInfo?.address}, {order.customerInfo?.city}</span>
                                  </div>
                                  {order.customerInfo?.notes && (
                                    <div>
                                      <span className="text-stone-400 text-xs block font-semibold">বিশেষ বার্তা / নোট</span>
                                      <span className="text-stone-500 italic text-sm">"{order.customerInfo.notes}"</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Billing breakdown footer */}
                            <div className="bg-stone-50 rounded-2xl p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center border border-stone-100 shadow-sm text-base">
                              <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-stone-500 font-semibold">
                                <p>ডেলিভারি চার্জ: <span className="font-bold text-brand-dark font-sans">{formatBnCurrency(order.deliveryCharge || 0)}</span></p>
                                {order.couponDiscount > 0 && (
                                  <p className="text-brand-red">কুপন ডিসকাউন্ট: <span className="font-bold font-sans">-{formatBnCurrency(order.couponDiscount)}</span></p>
                                )}
                                <p>পেমেন্ট মেথড: <span className="font-bold text-brand-dark">ক্যাশ অন ডেলিভারি (COD)</span></p>
                              </div>
                              <div className="text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0 w-full md:w-auto">
                                <p className="text-xs text-stone-500 font-bold leading-none mb-1">সর্বমোট পরিশোধিতব্য</p>
                                <span className="text-3xl font-black text-brand-red">{formatBnCurrency(order.totalAmount)}</span>
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
