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
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
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
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Orders
        const ordersSnapshot = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
        const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersData);

        // 2. Fetch Products
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData);

        // 3. Fetch Registered Customers Count
        const customersSnapshot = await getDocs(query(collection(db, 'users'), where('role', '==', 'user')));
        setCustomersCount(customersSnapshot.size);
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
    </div>
  );
};

export default AdminDashboard;
