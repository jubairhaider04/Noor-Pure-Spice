import React from 'react';
import { motion } from 'motion/react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const data = [
  { name: 'শনিবার', sales: 4000 },
  { name: 'রবিবার', sales: 3000 },
  { name: 'সোমবার', sales: 2000 },
  { name: 'মঙ্গলবার', sales: 2780 },
  { name: 'বুধবার', sales: 1890 },
  { name: 'বৃহস্পতিবার', sales: 2390 },
  { name: 'শুক্রবার', sales: 3490 },
];

const pieData = [
  { name: 'মরিচ গুঁড়া', value: 400 },
  { name: 'হলুদ গুঁড়া', value: 300 },
  { name: 'জিরা গুঁড়া', value: 300 },
  { name: 'ধনিয়া গুঁড়া', value: 200 },
];

const COLORS = ['#8B0000', '#DAA520', '#5D4037', '#2E7D32'];

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8 font-bn">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-brand-dark">ড্যাশবোর্ড ওভারভিউ</h1>
        <div className="flex items-center gap-2 text-stone-500 text-sm font-sans">
          <Clock size={16} />
          আপডেট হয়েছে: {new Date().toLocaleTimeString('bn-BD')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'মোট বিক্রয়', value: '৳ ১,২৫,০০০', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'মোট অর্ডার', value: '২৮৪', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'মোট কাস্টমার', value: '১,৪২০', icon: Users, color: 'text-brand-red', bg: 'bg-red-50' },
          { label: 'কম স্টক পণ্য', value: '০৮', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4"
          >
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-stone-500 text-lg">{stat.label}</p>
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
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={14} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `৳${val}`} />
                <Tooltip cursor={{ fill: '#f5f5f5' }} />
                <Bar dataKey="sales" fill="#8B0000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
          <h3 className="text-xl font-bold mb-6 text-brand-dark border-b pb-4">ক্যাটাগরি ভিত্তিক বিক্রয়</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
