import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { BRAND_NAME_BN, FACEBOOK_URL, PHONE_NUMBER_BN, TAGLINE_BN } from '../constants';
import LogoImage from '../assets/images/regenerated_image_1778034406861.jpg';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-stone-200 pt-16 pb-8 text-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <Link to="/" className="flex items-center">
                <img 
                  src={LogoImage} 
                  alt="Noor Logo" 
                  className="w-12 h-12 object-contain mr-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML += '<div class="w-10 h-10 bg-brand-red rounded-lg flex items-center justify-center text-white font-bold text-lg font-bn">নূর</div>';
                  }}
                />
                <h2 className="text-xl font-bold text-brand-dark font-bn">{BRAND_NAME_BN}</h2>
              </Link>
            </div>
            <p className="font-bn text-lg mb-6 leading-relaxed opacity-70">
              {TAGLINE_BN}
            </p>
            <div className="flex space-x-4">
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="p-2 bg-brand-cream rounded-lg hover:bg-brand-red hover:text-white transition-colors text-brand-red">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-brand-cream rounded-lg hover:bg-brand-red hover:text-white transition-colors text-brand-red">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-brand-red font-bold mb-6 font-bn text-xl uppercase tracking-widest text-sm">লিঙ্কসমূহ</h3>
            <ul className="space-y-4 font-bn text-lg">
              <li><Link to="/" className="hover:text-brand-red transition-colors opacity-80 hover:opacity-100">হোম</Link></li>
              <li><Link to="/shop" className="hover:text-brand-red transition-colors opacity-80 hover:opacity-100">দোকান</Link></li>
              <li><Link to="/about" className="hover:text-brand-red transition-colors opacity-80 hover:opacity-100">আমাদের সম্পর্কে</Link></li>
              <li><Link to="/contact" className="hover:text-brand-red transition-colors opacity-80 hover:opacity-100">যোগাযোগ</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-brand-red font-bold mb-6 font-bn text-xl uppercase tracking-widest text-sm">নীতিমালা</h3>
            <ul className="space-y-4 font-bn text-lg">
              <li><Link to="/terms" className="hover:text-brand-red transition-colors opacity-80 hover:opacity-100">নীতিমালা</Link></li>
              <li><Link to="/delivery-policy" className="hover:text-brand-red transition-colors opacity-80 hover:opacity-100">ডেলিভারি পলিসি</Link></li>
              <li><Link to="/return-policy" className="hover:text-brand-red transition-colors opacity-80 hover:opacity-100">রিটার্ন পলিসি</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-brand-red transition-colors opacity-80 hover:opacity-100">প্রাইভেসি পলিসি</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-brand-red font-bold mb-6 font-bn text-xl uppercase tracking-widest text-sm">যোগাযোগ</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-brand-gold shrink-0 mt-1" />
                <span className="font-bn text-lg opacity-80">ঢাকা, বাংলাদেশ</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-brand-gold shrink-0" />
                <span className="text-lg opacity-80 font-bn">{PHONE_NUMBER_BN}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-brand-gold shrink-0" />
                <span className="text-lg opacity-80 font-bn">info@noorpurespice.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-100 pt-8 text-center text-sm text-stone-400">
          <p>© {new Date().getFullYear()} {BRAND_NAME_BN}. সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
