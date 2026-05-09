import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Phone, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BRAND_NAME_BN, PHONE_NUMBER_BN, WHATSAPP_NUMBER } from '../constants';
import LogoImage from '../assets/images/regenerated_image_1778034406861.jpg';

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const location = useLocation();

  const navLinks = [
    { name: 'হোম', path: '/' },
    { name: 'দোকান', path: '/shop' },
    { name: 'আমাদের সম্পর্কে', path: '/about' },
    { name: 'যোগাযোগ', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-brand-gold shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={LogoImage} 
              alt="Noor Logo" 
              className="w-14 h-14 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML += '<div class="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center shadow-md"><span class="text-white font-bold text-2xl font-bn leading-none">নূর</span></div>';
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
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="hidden lg:flex items-center gap-2 text-brand-red font-bold font-bn">
              <Phone size={18} />
              <span>{PHONE_NUMBER_BN}</span>
            </div>
            
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-[#25D366] text-white rounded-lg transition-transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-2"
              title="WhatsApp on +8801911198710"
            >
              <MessageCircle size={22} />
              <span className="hidden xl:inline text-sm font-bold">WhatsApp</span>
            </a>

            <Link to="/cart" className="relative p-2.5 bg-brand-red text-white rounded-lg transition-transform hover:scale-105 active:scale-95 shadow-md">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-brand-dark text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
