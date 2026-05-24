import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  Loader2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';

const COLORS = ['#8B0000', '#DAA520', '#5D4037', '#2E7D32', '#008080', '#D2691E'];

const formatBnNum = (num: number | string) => {
  const digits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (d) => digits[parseInt(d)]);
};

const formatBnCurrency = (num: number) => {
  const formatted = Math.round(num).toLocaleString('en-IN');
  return '৳ ' + formatBnNum(formatted);
};

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customersCount, setCustomersCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // 1. Real-time listener for Orders
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    }, (err) => {
      console.error('Error listening to orders:', err);
    });

    // 2. Real-time listener for Products
    const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
      setLoading(false);
    }, (err) => {
      console.error('Error listening to products:', err);
      setLoading(false);
    });

    // 3. Real-time listener for Registered Customers Count
    const customersQuery = query(collection(db, 'users'), where('role', '==', 'user'));
    const unsubscribeCustomers = onSnapshot(customersQuery, (snapshot) => {
      setCustomersCount(snapshot.size);
    }, (err) => {
      console.error('Error listening to users:', err);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
      unsubscribeCustomers();
    };
  }, []);

  // Calculate Metrics
  const validOrders = orders.filter(o => o.status !== 'cancelled');
  const totalSales = validOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const totalOrdersCount = orders.length;
  const lowStockProductsCount = products.filter(p => !p.stock || Number(p.stock) <= 5).length;

  // Process Weekly Sales (last 7 days dynamically)
  const daysBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      dateStr: d.toDateString(),
      name: daysBn[d.getDay()],
      sales: 0
    };
  });

  orders.forEach(order => {
    if (order.status === 'cancelled') return;
    if (!order.createdAt) return;
    const oDate = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
    const dateStr = oDate.toDateString();
    
    const matchedDay = last7Days.find(day => day.dateStr === dateStr);
    if (matchedDay) {
      matchedDay.sales += Number(order.totalAmount || 0);
    }
  });

  const barChartData = last7Days.map(day => ({
    name: day.name,
    sales: day.sales
  }));

  // Process Category Wise Sales
  const categorySales: { [key: string]: number } = {};
  orders.forEach(order => {
    if (order.status === 'cancelled') return;
    order.items?.forEach((item: any) => {
      const cat = item.category || 'অন্যান্য';
      categorySales[cat] = (categorySales[cat] || 0) + (Number(item.price || 0) * Number(item.quantity || 1));
    });
  });

  let pieChartData = Object.entries(categorySales).map(([name, value]) => ({ name, value }));
  if (pieChartData.length === 0) {
    pieChartData = [
      { name: 'কোনো বিক্রি নেই', value: 1 }
    ];
  }

  // Format statistics for display
  const stats = [
    { label: 'মোট বিক্রয়', value: formatBnCurrency(totalSales), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'মোট অর্ডার', value: formatBnNum(totalOrdersCount) + ' টি', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'মোট কাস্টমার', value: formatBnNum(customersCount) + ' জন', icon: Users, color: 'text-brand-red', bg: 'bg-red-50' },
    { label: 'কম স্টক পণ্য', value: formatBnNum(lowStockProductsCount) + ' টি', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] font-bn space-y-4">
        <Loader2 className="animate-spin text-brand-red" size={48} />
        <p className="text-xl font-bold text-stone-500">ড্যাশবোর্ড লোড করা হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-bn">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-brand-dark">ড্যাশবোর্ড ওভারভিউ</h1>
        <div className="flex items-center gap-2 text-stone-500 text-sm font-sans font-semibold bg-stone-100 px-4 py-2 rounded-full shadow-sm">
          <Clock size={16} />
          আপডেট হয়েছে: {new Date().toLocaleTimeString('bn-BD')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4 hover:shadow-md transition-shadow duration-300"
          >
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-stone-500 text-lg font-medium">{stat.label}</p>
              <h3 className="text-2xl font-black text-brand-dark">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
          <h3 className="text-xl font-bold mb-6 text-brand-dark border-b pb-4">সাপ্তাহিক বিক্রয় রিপোর্ট</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={14} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `৳${val}`} />
                <Tooltip cursor={{ fill: '#f5f5f5' }} formatter={(value) => [`৳${value}`, 'বিক্রয়']} />
                <Bar dataKey="sales" fill="#8B0000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
          <h3 className="text-xl font-bold mb-6 text-brand-dark border-b pb-4">ক্যাটাগরি ভিত্তিক বিক্রয়</h3>
          <div className="h-[300px] w-full flex flex-col md:flex-row items-center justify-around gap-4">
            <div className="h-[220px] w-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [pieChartData[0]?.name === 'কোনো বিক্রি নেই' ? '০' : `৳${value}`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-3 min-w-[200px]">
              {pieChartData[0]?.name === 'কোনো বিক্রি নেই' ? (
                <p className="text-stone-400 text-center font-bold text-lg">কোনো ক্যাটাগরির বিক্রয় নেই</p>
              ) : (
                pieChartData.slice(0, 6).map((entry, index) => (
                  <div key={index} className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-stone-600 font-semibold">{entry.name}</span>
                    </div>
                    <span className="font-bold text-brand-dark">{formatBnCurrency(entry.value)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Table Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b pb-4">
          <div>
            <h3 className="text-xl font-bold text-brand-dark flex items-center gap-2">
              <Package className="text-brand-red" size={24} />
              পণ্যসমূহ ({formatBnNum(products.length)} টি)
            </h3>
            <p className="text-stone-500 text-sm mt-1">ওয়েবসাইটে তালিকাভুক্ত পণ্যের রিয়েল-টাইম স্টক এবং মূল্য বিবরণী</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-bn border-collapse">
            <thead className="bg-stone-50 text-stone-500 uppercase text-sm font-sans">
              <tr>
                <th className="px-6 py-4 rounded-l-xl">পণ্য</th>
                <th className="px-6 py-4">ক্যাটাগরি</th>
                <th className="px-6 py-4">মূল্য</th>
                <th className="px-6 py-4 rounded-r-xl">স্টক স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-stone-400 font-bold">
                    কোনো পণ্য তালিকাভুক্ত নেই
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const stockNumber = Number(product.stock || 0);
                  let stockBadgeClass = "";
                  let stockText = "";
                  
                  if (stockNumber > 10) {
                    stockBadgeClass = "bg-green-50 text-green-700 border-green-200";
                    stockText = `স্টকে আছে (${formatBnNum(stockNumber)} টি)`;
                  } else if (stockNumber > 5) {
                    stockBadgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                    stockText = `সীমিত স্টক (${formatBnNum(stockNumber)} টি)`;
                  } else if (stockNumber > 0) {
                    stockBadgeClass = "bg-rose-50 text-rose-700 border-rose-200";
                    stockText = `আর মাত্র ${formatBnNum(stockNumber)} টি আছে!`;
                  } else {
                    stockBadgeClass = "bg-stone-100 text-stone-500 border-stone-200";
                    stockText = "স্টক শেষ!";
                  }

                  return (
                    <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={product.image || "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=100"} 
                            alt={product.nameBn} 
                            className="w-12 h-12 rounded-xl object-cover bg-stone-100 border border-stone-100" 
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-brand-dark text-lg leading-tight">{product.nameBn}</p>
                            <p className="text-xs text-stone-400 font-sans mt-1">{product.weightBn} • {product.nameEn}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-stone-600 font-semibold text-base">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-extrabold text-brand-red text-lg">{formatBnCurrency(product.price)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-full border ${stockBadgeClass}`}>
                          {stockText}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
