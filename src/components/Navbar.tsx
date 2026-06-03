import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Phone, MessageCircle, Menu, X, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BRAND_NAME_BN, PHONE_NUMBER_BN, WHATSAPP_NUMBER } from '../constants';
import LogoImage from '../assets/images/regenerated_image_1778034406861.jpg';
import LoginModal from './LoginModal';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navLinks = [
    { name: 'হোম', path: '/' },
    { name: 'দোকান', path: '/shop' },
    { name: 'আমাদের সম্পর্কে', path: '/about' },
    { name: 'যোগাযোগ', path: '/contact' },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLogout = () => {
    signOut(auth);
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-brand-gold shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={LogoImage} 
              alt="Noor Logo" 
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.parentElement) {
                  target.parentElement.innerHTML += '<div class="w-10 h-10 sm:w-12 sm:h-12 bg-brand-red rounded-lg flex items-center justify-center shadow-md"><span class="text-white font-bold text-xl sm:text-2xl font-bn leading-none">নূর</span></div>';
                }
              }}
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-brand-red leading-none">{BRAND_NAME_BN}</h1>
              <p className="text-[10px] text-brand-gold uppercase tracking-widest font-bold">PREMIUM SPICES</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 text-center justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-bn text-lg font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-brand-red'
                    : 'text-brand-dark hover:text-brand-red'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-6">
            <div className="hidden lg:flex items-center gap-2 text-brand-red font-bold font-bn">
              <Phone size={18} />
              <span>{PHONE_NUMBER_BN}</span>
            </div>
            
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-2.5 bg-[#25D366] text-white rounded-lg transition-transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-2"
              title="WhatsApp on +8801911198710"
            >
              <MessageCircle size={22} />
              <span className="hidden xl:inline text-sm font-bold">WhatsApp</span>
            </a>

            <Link to="/cart" className="relative p-2 sm:p-2.5 bg-brand-red text-white rounded-lg transition-transform hover:scale-105 active:scale-95 shadow-md">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-brand-dark text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Account / Login */}
            <div className="relative">
              {user ? (
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 sm:p-2.5 bg-stone-100 text-brand-dark rounded-lg transition-transform hover:scale-105 active:scale-95 shadow-sm border border-stone-200 flex items-center gap-2"
                >
                  <UserIcon size={22} />
                </button>
              ) : (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="p-2 sm:p-2.5 bg-brand-dark text-white rounded-lg transition-transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-2"
                >
                  <UserIcon size={22} />
                  <span className="hidden lg:inline text-sm font-bold font-bn">লগইন</span>
                </button>
              )}

              {/* User Menu Dropdown */}
              {isUserMenuOpen && user && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-stone-100 py-3 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-stone-50 mb-2">
                    <p className="text-sm text-stone-400 font-sans">লগইন করা আছে</p>
                    <p className="font-bold text-brand-dark truncate">{user.displayName || user.email}</p>
                  </div>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-50 transition-colors font-bn font-bold"
                  >
                    <UserIcon size={18} />
                    প্রোফাইল ও অর্ডার
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-brand-red hover:bg-red-50 transition-colors font-bn font-bold"
                    >
                      <LayoutDashboard size={18} />
                      অ্যাডমিন প্যানেল
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-50 transition-colors font-bn font-bold"
                  >
                    <LogOut size={18} />
                    লগ আউট
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 text-brand-dark hover:text-brand-red transition-colors"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {/* Mobile Menu Tray */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 py-4 px-6 shadow-xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`font-bn text-xl font-medium py-2 border-b border-stone-50 ${
                  location.pathname === link.path
                    ? 'text-brand-red'
                    : 'text-brand-dark'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/profile"
              onClick={() => setIsMenuOpen(false)}
              className={`font-bn text-xl font-medium py-2 border-b border-stone-50 flex items-center gap-2 ${
                location.pathname === '/profile'
                  ? 'text-brand-red'
                  : 'text-brand-dark'
              }`}
            >
              <UserIcon size={20} className="text-stone-400" />
              প্রোফাইল ও অর্ডার
            </Link>
            <div className="pt-4 flex flex-col space-y-4">
              <div className="flex items-center gap-3 text-brand-red font-bold font-bn text-lg">
                <Phone size={20} />
                <span>{PHONE_NUMBER_BN}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
