import React, { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Plus, Edit, Trash2, Search, Package, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AIAssistant from '../admin/AIAssistant';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    nameBn: '',
    nameEn: '',
    price: '',
    weightBn: '',
    stock: '',
    category: 'মরিচ গুঁড়া',
    image: '',
    description: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(productsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      updatedAt: serverTimestamp()
    };

    if (editingProduct) {
      await updateDoc(doc(db, 'products', editingProduct.id), data);
    } else {
      await addDoc(collection(db, 'products'), {
        ...data,
        createdAt: serverTimestamp()
      });
    }

    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ nameBn: '', nameEn: '', price: '', weightBn: '', stock: '', category: 'মরিচ গুঁড়া', image: '', description: '' });
    fetchProducts();
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      nameBn: product.nameBn,
      nameEn: product.nameEn,
      price: product.price.toString(),
      weightBn: product.weightBn,
      stock: product.stock.toString(),
      category: product.category,
      image: product.image,
      description: product.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই পণ্যটি মুছে ফেলতে চান?')) {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(p => 
    p.nameBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUseAIDescription = (content: string) => {
    setFormData({ ...formData, description: content });
  };

  return (
    <div className="space-y-8 font-bn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-dark">পণ্য ব্যবস্থাপনা</h1>
          <p className="text-stone-500 text-lg">আপনার স্টকের সকল পণ্য এখানে পরিচালনা করুন</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="bg-brand-red text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-dark transition-all shadow-lg"
        >
          <Plus size={20} />
          নতুন পণ্য যুক্ত করুন
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input 
            type="text"
            placeholder="পণ্য খুঁজুন..."
            className="w-full pl-12 pr-4 py-3 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-brand-red/20 font-bn text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <table className="w-full text-left font-bn border-collapse">
          <thead className="bg-stone-50 text-stone-500 uppercase text-sm tracking-widest font-sans">
            <tr>
              <th className="px-6 py-4">পণ্য</th>
              <th className="px-6 py-4">ক্যাটাগরি</th>
              <th className="px-6 py-4">মূল্য</th>
              <th className="px-6 py-4">স্টক</th>
              <th className="px-6 py-4 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-12 text-xl">লোডিং...</td></tr>
            ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-xl">কোনো পণ্য পাওয়া যায়নি</td></tr>
            ) : filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={product.image} alt={product.nameBn} className="w-12 h-12 rounded-lg object-cover bg-stone-100" />
                    <div>
                      <p className="font-bold text-lg text-brand-dark">{product.nameBn}</p>
                      <p className="text-xs text-stone-400 uppercase tracking-tighter font-sans">{product.nameEn}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-stone-100 rounded-full text-sm font-bold text-stone-600">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-lg">৳ {product.price}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                    <span className={`font-bold ${product.stock <= 10 ? 'text-amber-600' : 'text-stone-700'}`}>
                      {product.stock} {product.stock === 0 ? '(স্টক আউট)' : 'টি'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 border-b border-stone-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-black text-brand-dark">
                  {editingProduct ? 'পণ্য সংশোধন করুন' : 'নতুন পণ্য যুক্ত করুন'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-brand-red transition-colors">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-500 ml-1">পণ্যের নাম (বাংলা)</label>
                    <input 
                      type="text" required
                      className="w-full px-4 py-3 bg-stone-50 rounded-xl border-none focus:ring-2 focus:ring-brand-red/20 font-bn text-lg"
                      value={formData.nameBn}
                      onChange={(e) => setFormData({...formData, nameBn: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-500 ml-1">পণ্যের নাম (ইংরেজি)</label>
                    <input 
                      type="text" required
                      className="w-full px-4 py-3 bg-stone-50 rounded-xl border-none focus:ring-2 focus:ring-brand-red/20 font-sans"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({...formData, nameEn: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-500 ml-1">মূল্য (৳)</label>
                    <input 
                      type="number" required
                      className="w-full px-4 py-3 bg-stone-50 rounded-xl border-none focus:ring-2 focus:ring-brand-red/20 font-bn text-lg"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-500 ml-1">স্টক পরিমাণ</label>
                    <input 
                      type="number" required
                      className="w-full px-4 py-3 bg-stone-50 rounded-xl border-none focus:ring-2 focus:ring-brand-red/20 font-bn text-lg"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-500 ml-1">ওজন (বাংলা)</label>
                    <input 
                      type="text" required placeholder="যেমন: ১০০ গ্রাম"
                      className="w-full px-4 py-3 bg-stone-50 rounded-xl border-none focus:ring-2 focus:ring-brand-red/20 font-bn text-lg"
                      value={formData.weightBn}
                      onChange={(e) => setFormData({...formData, weightBn: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-500 ml-1">ক্যাটাগরি</label>
                    <select 
                      className="w-full px-4 py-3 bg-stone-50 rounded-xl border-none focus:ring-2 focus:ring-brand-red/20 font-bn text-lg"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option>মরিচ গুঁড়া</option>
                      <option>হলুদ গুঁড়া</option>
                      <option>জিরা গুঁড়া</option>
                      <option>ধনিয়া গুঁড়া</option>
                      <option>মশলা কম্বো</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-500 ml-1">ইমেজ ইউআরএল</label>
                  <input 
                    type="url" required
                    className="w-full px-4 py-3 bg-stone-50 rounded-xl border-none focus:ring-2 focus:ring-brand-red/20 font-sans"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                  />
                </div>

                {/* Description with AI Assistant */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-stone-500 ml-1">পণ্য বর্ণনা (ঐচ্ছিক)</label>
                    {formData.nameBn && formData.category && (
                      <AIAssistant
                        type="product"
                        data={{
                          productName: formData.nameBn,
                          category: formData.category
                        }}
                        onUse={handleUseAIDescription}
                      />
                    )}
                  </div>
                  <textarea 
                    className="w-full px-4 py-3 bg-stone-50 rounded-xl border-none focus:ring-2 focus:ring-brand-red/20 font-bn text-lg min-h-[100px]"
                    placeholder="পণ্যের বিবরণ..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <button type="submit" className="w-full bg-brand-red text-white py-4 rounded-xl font-black text-xl hover:bg-brand-dark transition-all shadow-lg active:scale-95">
                  তথ্য সংরক্ষণ করুন
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
