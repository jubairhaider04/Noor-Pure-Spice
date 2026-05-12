import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Ticket, 
  Users, 
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { profile } = useAuth();

  const menuItems = [
    { name: 'ড্যাশবোর্ড', path: '/admin', icon: LayoutDashboard },
    { name: 'পণ্যসমূহ', path: '/admin/products', icon: Package },
    { name: 'অর্ডারসমূহ', path: '/admin/orders', icon: ShoppingCart },
    { name: 'কুপন', path: '/admin/coupons', icon: Ticket },
    { name: 'কাস্টমার', path: '/admin/customers', icon: Users },
  ];

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="flex min-h-screen bg-stone-50 font-bn">
      {/* Sidebar */}
      <aside className="w-72 bg-brand-dark text-white sticky top-0 h-screen hidden lg:flex flex-col shadow-2xl">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-red rounded-lg flex items-center justify-center font-black text-xl">নূর</div>
          <h2 className="text-xl font-black tracking-tight">অ্যাডমিন প্যানেল</h2>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-brand-red text-white shadow-lg' 
                    : 'text-stone-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="text-lg font-bold">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center text-brand-dark font-black">
              {profile?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-bold truncate max-w-[150px]">{profile?.name || 'অ্যাডমিন'}</p>
              <p className="text-xs text-stone-400">অ্যাডমিনিস্ট্রেটর</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 rounded-xl text-stone-300 hover:bg-brand-red hover:text-white transition-all"
          >
            <LogOut size={20} />
            <span className="text-lg font-bold">লগ আউট</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Header (for mobile toggle in future) */}
        <header className="h-20 bg-white border-b border-stone-100 flex items-center justify-between px-8 lg:px-12 sticky top-0 z-10">
          <div className="lg:hidden flex items-center gap-3">
             <div className="w-8 h-8 bg-brand-red rounded flex items-center justify-center text-white font-black">নূর</div>
             <h2 className="font-bold text-lg">অ্যাডমিন</h2>
          </div>
          <div className="flex items-center gap-6 ml-auto">
             <div className="relative group">
                <div className="text-stone-500 hover:text-brand-red cursor-pointer p-2 transition-colors">
                   <Settings size={22} />
                </div>
             </div>
          </div>
        </header>

        <div className="p-8 lg:p-12 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
