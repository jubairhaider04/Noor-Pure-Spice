import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Search, Filter } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Shop: React.FC = () => {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { name: 'সব পণ্য', value: 'all' },
    { name: 'প্রাথমিক মসলা', value: 'Basic Spices' },
    { name: 'মিশ্র মসলা', value: 'Mixed Spices' },
    { name: 'প্রিমিয়াম মিশ্র', value: 'Premium Mixed' },
    { name: 'আস্ত মসলা', value: 'Whole Spices' },
    { name: 'কম্ব প্যাক', value: 'Combo Pack' },
  ];

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch = product.nameBn.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-16 bg-brand-cream min-h-screen text-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <span className="text-brand-gold font-bold tracking-widest uppercase text-xs mb-2 block">Premium Marketplace</span>
            <h1 className="text-5xl font-black font-bn leading-none">মসলার দোকান</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-4xl">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="মসলা খুঁজুন..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold font-bn text-lg shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold" size={20} />
            </div>

            {/* Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-6 py-4 rounded-xl font-bn text-lg font-bold whitespace-nowrap transition-all border ${
                    selectedCategory === cat.value
                      ? 'bg-brand-red text-white border-brand-red shadow-lg'
                      : 'bg-white text-brand-dark border-stone-200 hover:border-brand-red hover:text-brand-red shadow-sm'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-stone-100 flex flex-col"
              >
                <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-brand-sand/30">
                  <img
                    src={product.image}
                    alt={product.nameBn}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-brand-gold text-brand-dark font-bold text-[10px] px-2 py-1 rounded tracking-tighter uppercase">
                    In Stock
                  </div>
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black font-bn tracking-tight group-hover:text-brand-red transition-colors">
                      <Link to={`/product/${product.id}`}>{product.nameBn}</Link>
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mb-8">
                    <p className="text-stone-400 font-bn text-sm tracking-widest">{product.weightBn}</p>
                    <span className="text-brand-red font-black text-xl">৳{product.price}</span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-auto w-full bg-brand-dark text-white py-4 rounded-lg font-bn text-lg font-bold flex items-center justify-center gap-2 hover:bg-brand-red transition-all active:scale-95 shadow-md"
                  >
                    ব্যাগ-এ যুক্ত করুন
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-brand-sand rounded-full flex items-center justify-center mx-auto mb-6 text-brand-gold">
               <Search size={32} />
            </div>
            <h3 className="text-2xl font-bn text-stone-400">দুঃখিত, কোনো পণ্য পাওয়া যায়নি।</h3>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedCategory('all');}}
              className="mt-4 text-brand-red font-bold font-bn text-xl hover:underline"
            >
              সব পণ্য ফিরে দেখুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
