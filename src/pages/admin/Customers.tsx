import React, { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy,
  where
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Search, User as UserIcon, Phone, Mail, ShoppingBag } from 'lucide-react';

const AdminCustomers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    const q = query(collection(db, 'users'), where('role', '==', 'user'));
    const querySnapshot = await getDocs(q);
    
    // In a real app, I'd also fetch their orders to calculate spending
    // For now, I'll just list them
    const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(usersData);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone.includes(searchTerm) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 font-bn">
      <div>
        <h1 className="text-3xl font-black text-brand-dark">কাস্টমার তালিকা</h1>
        <p className="text-stone-500 text-lg">নিবন্ধিত সকল কাস্টমারদের তথ্য দেখুন</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input 
            type="text"
            placeholder="নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..."
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
              <th className="px-6 py-4">কাস্টমার</th>
              <th className="px-6 py-4">যোগাযোগ</th>
              <th className="px-6 py-4">ঠিকানা</th>
              <th className="px-6 py-4">নিবন্ধনের তারিখ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-12 text-xl">লোডিং...</td></tr>
            ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-12 text-xl">কোনো কাস্টমার পাওয়া যায়নি</td></tr>
            ) : filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-red/10 text-brand-red rounded-full flex items-center justify-center font-bold">
                       {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-lg text-brand-dark">{user.name}</p>
                      <p className="text-stone-400 text-sm font-sans">{user.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-stone-600"><Phone size={14} className="text-stone-400" /> {user.phone}</p>
                    {user.email && <p className="flex items-center gap-2 text-stone-600 text-sm font-sans underline"><Mail size={14} className="text-stone-400" /> {user.email}</p>}
                  </div>
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <p className="text-stone-600 line-clamp-2">{user.address || 'প্রদান করা হয়নি'}</p>
                </td>
                <td className="px-6 py-4 text-stone-500 font-sans text-sm">
                  {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomers;
