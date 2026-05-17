import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { X, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('পাসওয়ার্ড রিসেটের জন্য প্রথমে আপনার ইমেইলটি লিখুন।');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setSuccessMsg('আপনার ইমেইলে পাসওয়ার্ড রিসেট লিঙ্ক পাঠানো হয়েছে।');
    } catch (err: any) {
      setError('ইমেইল পাঠানো সম্ভব হয়নি। দয়া করে সঠিক ইমেইলটি ব্যবহার করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
            throw new Error('পাসওয়ার্ড মেলেনি');
        }
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: formData.name });

        // Save to Firestore
        const role = formData.email === 'jubair04sale@gmail.com' ? 'admin' : 'user';
        await setDoc(doc(db, 'users', user.uid), {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: role,
          createdAt: serverTimestamp()
        });
      }
      onClose();
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.message === 'পাসওয়ার্ড মেলেনি') {
        setError(err.message);
      } else if (err.code === 'auth/email-already-in-use') {
        setError('এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হয়েছে। লগইন করার চেষ্টা করুন।');
      } else if (err.code === 'auth/weak-password') {
        setError('পাসওয়ার্ডটি খুব দুর্বল। অন্তত ৬টি অক্ষর ব্যবহার করুন।');
      } else if (err.code === 'auth/invalid-email') {
        setError('ইমেইল অ্যাড্রেসটি সঠিক নয়।');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('ইমেইল অথবা পাসওয়ার্ডটি সঠিক নয়।');
      } else {
        setError('লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-dark/40 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden font-bn"
          >
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-black text-brand-dark mb-2">
                    {isLogin ? 'আবার স্বাগতম!' : 'নতুন অ্যাকাউন্ট'}
                  </h2>
                  <p className="text-stone-500 text-lg">নূর গুঁড়া মসলা-এ আপনার যাত্রা শুরু হোক</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center font-bold">
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 text-center font-bold">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-5">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                      <input 
                        type="text" placeholder="আপনার নাম" required
                        className="w-full pl-12 pr-4 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-red/20 text-lg"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                      <input 
                        type="tel" placeholder="মোবাইল নম্বর" required
                        className="w-full pl-12 pr-4 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-red/20 text-lg"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                  <input 
                    type="email" placeholder="ইমেইল অ্যাড্রেস" required
                    className="w-full pl-12 pr-4 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-red/20 text-lg"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                {isLogin && (
                   <div className="text-right">
                      <button 
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-stone-400 hover:text-brand-red text-sm font-bold transition-colors"
                      >
                        পাসওয়ার্ড ভুলে গেছেন?
                      </button>
                   </div>
                )}

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                  <input 
                    type="password" placeholder="পাসওয়ার্ড" required
                    className="w-full pl-12 pr-4 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-red/20 text-lg"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>

                {!isLogin && (
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                    <input 
                      type="password" placeholder="পাসওয়ার্ড নিশ্চিত করুন" required
                      className="w-full pl-12 pr-4 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-red/20 text-lg"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                  </div>
                )}

                <button 
                  type="submit" disabled={loading}
                  className="w-full bg-brand-red text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-2 hover:bg-brand-dark transition-all shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'প্রসেসিং হচ্ছে...' : (isLogin ? 'লগইন করুন' : 'অ্যাকাউন্ট খুলুন')}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-stone-500 hover:text-brand-red font-bold flex items-center gap-2 mx-auto transition-colors text-lg"
                >
                  {isLogin ? 'নতুন অ্যাকাউন্ট খুলতে চান?' : 'আগের অ্যাকাউন্ট আছে?'}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
