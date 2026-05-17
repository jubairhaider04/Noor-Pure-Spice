import React, { useState } from 'react';
import { Sparkles, Copy, Check, AlertCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  generateProductDescription, 
  generateCouponText, 
  generateOrderAnalysis,
  generateSupportResponse 
} from '../../services/aiService';

interface AIAssistantProps {
  type: 'product' | 'coupon' | 'order' | 'support';
  data: any;
  onUse?: (content: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ type, data, onUse }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateContent = async () => {
    setLoading(true);
    setError('');
    
    try {
      let content = '';

      switch (type) {
        case 'product':
          content = await generateProductDescription(data.productName, data.category);
          break;
        case 'coupon':
          content = await generateCouponText(data.code, data.value, data.type);
          break;
        case 'order':
          content = await generateOrderAnalysis(data.totalOrders, data.revenue, data.topProduct);
          break;
        case 'support':
          content = await generateSupportResponse(data.message);
          break;
        default:
          throw new Error('Unknown AI assistant type');
      }

      setResult(content);
    } catch (err: any) {
      setError(err.message || 'Failed to generate content. Please try again.');
      console.error('AI Generation Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUse = () => {
    if (onUse) {
      onUse(result);
      setIsOpen(false);
      setResult('');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-bold text-sm shadow-lg hover:shadow-xl active:scale-95"
        title="Generate with AI"
      >
        <Sparkles size={16} />
        এআই সহায়ক
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-stone-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-brand-dark">এআই সহায়ক</h2>
                    <p className="text-stone-500 text-sm font-bn">কৃত্রিম বুদ্ধিমত্তা দ্বারা চালিত সামগ্রী জেনারেশন</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                {/* Input Info */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                  <p className="text-sm text-stone-500 font-bold mb-2">ইনপুট ডেটা:</p>
                  <pre className="text-xs text-stone-700 overflow-x-auto font-sans whitespace-pre-wrap break-words">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3"
                  >
                    <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-red-600">ত্রুটি</p>
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </motion.div>
                )}

                {/* Generated Content */}
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 space-y-4"
                  >
                    <p className="text-sm text-purple-600 font-bold uppercase tracking-widest">তৈরি করা সামগ্রী</p>
                    <p className="text-lg text-brand-dark font-bn leading-relaxed">{result}</p>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-bold ${
                          copied
                            ? 'bg-green-500 text-white'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        {copied ? 'অনুলিপি করা হয়েছে' : 'অনুলিপি করুন'}
                      </button>
                      {onUse && (
                        <button
                          onClick={handleUse}
                          className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-brand-dark transition-all font-bold"
                        >
                          ব্যবহার করুন
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Generate Button */}
                <button
                  onClick={generateContent}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-black text-lg hover:from-purple-600 hover:to-pink-600 disabled:from-stone-300 disabled:to-stone-300 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      সৃজনশীল হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      সামগ্রী তৈরি করুন
                    </>
                  )}
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-brand-red transition-colors bg-white/80 p-2 rounded-xl shadow-sm border border-stone-200"
              >
                ✕
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
