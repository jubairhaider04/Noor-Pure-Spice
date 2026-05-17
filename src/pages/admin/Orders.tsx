import React, { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { 
  Search, 
  Eye, 
  CheckCircle, 
  Truck, 
  XCircle, 
  Clock,
  Printer,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sendEmail, getShippingUpdateHtml } from '../../services/emailService';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setOrders(ordersData);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, status: string, order: any) => {
    await updateDoc(doc(db, 'orders', orderId), { status });
    fetchOrders();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }

    // Send Status Update Email
    if (order.customerInfo.email) {
      sendEmail({
        to: order.customerInfo.email,
        subject: `অর্ডার আপডেট - নূর গুঁড়া মসলা`,
        html: getShippingUpdateHtml(order, status)
      }).catch(err => console.error('Failed to send status update email:', err));
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'shipped': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-stone-50 text-stone-600 border-stone-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'পেন্ডিং';
      case 'confirmed': return 'কনফার্মড';
      case 'shipped': return 'শিপড';
      case 'delivered': return 'ডেলিভারড';
      case 'cancelled': return 'বাতিল';
      default: return status;
    }
  };

  const filteredOrders = orders.filter(o => 
    o.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerInfo.phone.includes(searchTerm) ||
    o.id.includes(searchTerm)
  );

  return (
    <div className="space-y-8 font-bn">
      <div>
        <h1 className="text-3xl font-black text-brand-dark">অর্ডার ব্যবস্থাপনা</h1>
        <p className="text-stone-500 text-lg">ক্রেতাদের সকল অর্ডার এখান থেকে তদারকি করুন</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input 
            type="text"
            placeholder="অর্ডার আইডি বা মোবাইল নম্বর দিয়ে খুঁজুন..."
            className="w-full pl-12 pr-4 py-3 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-brand-red/20 font-bn text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <table className="w-full text-left font-bn border-collapse">
          <thead className="bg-stone-50 text-stone-500 uppercase text-sm tracking-widest font-sans">
            <tr>
              <th className="px-6 py-4">অর্ডার আইডি</th>
              <th className="px-6 py-4">কাস্টমার</th>
              <th className="px-6 py-4">মোট টাকা</th>
              <th className="px-6 py-4">স্ট্যাটাস</th>
              <th className="px-6 py-4 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-12 text-xl">লোডিং...</td></tr>
            ) : filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-6 py-4 font-sans text-sm text-stone-500 font-medium">
                  #{order.id.slice(-6).toUpperCase()}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-lg text-brand-dark">{order.customerInfo.name}</p>
                    <p className="text-stone-400 text-sm">{order.customerInfo.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-4 font-black text-lg">৳ {order.totalAmount}</td>
                <td className="px-6 py-4">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusStyle(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 text-brand-red hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 ml-auto font-bold"
                  >
                    <Eye size={18} />
                    বিস্তারিত
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Side Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-xl h-full shadow-2xl relative z-10 flex flex-col"
            >
              <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                <div>
                  <h2 className="text-2xl font-black text-brand-dark">অর্ডার ডিটেইলস</h2>
                  <p className="text-stone-400 font-sans text-sm">Order ID: #{selectedOrder.id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-brand-red transition-colors bg-white p-2 rounded-xl shadow-sm border">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-brand-dark flex items-center gap-2 border-l-4 border-brand-red pl-3">কাস্টমার ইনফো</h3>
                  <div className="bg-stone-50 p-6 rounded-2xl space-y-3">
                    <p className="text-lg font-bold">{selectedOrder.customerInfo.name}</p>
                    <p className="text-stone-600 flex items-center gap-2"><span className="text-stone-400">ফোন:</span> {selectedOrder.customerInfo.phone}</p>
                    <p className="text-stone-600 flex items-start gap-2"><span className="text-stone-400">ঠিকানা:</span> {selectedOrder.customerInfo.address}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-brand-dark flex items-center gap-2 border-l-4 border-brand-red pl-3">অর্ডারকৃত পণ্য</h3>
                  <div className="divide-y divide-stone-100">
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="py-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <img src={item.image} className="w-12 h-12 rounded object-cover" />
                          <div>
                            <p className="font-bold">{item.nameBn}</p>
                            <p className="text-sm text-stone-400">{item.weightBn} x {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-bold text-lg">৳ {item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-brand-dark text-white p-8 rounded-3xl space-y-4 shadow-xl">
                  <div className="flex justify-between text-stone-300">
                    <span>মুল্য (আইটেম)</span>
                    <span>৳ {selectedOrder.totalAmount - selectedOrder.deliveryCharge + (selectedOrder.couponDiscount || 0)}</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>ডেলিভারি চার্জ</span>
                    <span>৳ {selectedOrder.deliveryCharge}</span>
                  </div>
                  {selectedOrder.couponDiscount > 0 && (
                     <div className="flex justify-between text-brand-gold">
                        <span>কুপন ডিসকাউন্ট</span>
                        <span>- ৳ {selectedOrder.couponDiscount}</span>
                     </div>
                  )}
                  <div className="border-t border-white/10 pt-4 flex justify-between text-2xl font-black">
                    <span>সর্বমোট</span>
                    <span>৳ {selectedOrder.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-8 border-t border-stone-100 bg-stone-50/50 space-y-4">
                <p className="text-sm font-bold text-stone-500 uppercase tracking-widest text-center">স্ট্যাটাস পরিবর্তন করুন</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed', selectedOrder)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold ${selectedOrder.status === 'confirmed' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
                  >
                    <CheckCircle size={18} /> কনফার্ম করুন
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(selectedOrder.id, 'shipped', selectedOrder)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold ${selectedOrder.status === 'shipped' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-purple-600 border-purple-600 hover:bg-purple-50'}`}
                  >
                    <Truck size={18} /> শিপ করুন
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(selectedOrder.id, 'delivered', selectedOrder)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold ${selectedOrder.status === 'delivered' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-600 border-green-100 hover:bg-green-50'}`}
                  >
                    <CheckCircle size={18} /> ডেলিভারড
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled', selectedOrder)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold ${selectedOrder.status === 'cancelled' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-red-600 border-red-100 hover:bg-red-50'}`}
                  >
                    <XCircle size={18} /> বাতিল করুন
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
