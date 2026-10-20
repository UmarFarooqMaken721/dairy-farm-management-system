import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import OrderModal, { PRODUCTS_LIST } from '../components/OrderModal';
import { Sparkles, ShoppingBag, ShieldCheck, Check, HeartPulse } from 'lucide-react';

export default function Products() {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'milk' | 'ghee' | 'curd'>('all');

  const openOrder = (productName: string) => {
    setSelectedProduct(productName);
    setOrderModalOpen(true);
  };

  const productDetails: Record<string, { fat: string; protein: string; benefits: string[]; bestFor: string }> = {
    'cow-milk': {
      fat: '3.8% – 4.2%',
      protein: 'A2 Beta-Casein',
      benefits: ['Easy to digest for kids & elderly', 'Enhances immunity & memory', 'Zero bloating or heavy feeling'],
      bestFor: 'Daily drinking, tea, coffee, baby nutrition'
    },
    'buffalo-milk': {
      fat: '6.5% – 7.5%',
      protein: 'High Calcium & Casein',
      benefits: ['Makes thick natural cream (Malai)', 'Thick rich chai with golden color', 'Ideal for home sweets and dahi'],
      bestFor: 'Karak chai, thick creamy yogurt, kheer'
    },
    'desi-ghee': {
      fat: '99.8% Healthy Lipids',
      protein: 'Butyric Acid Rich',
      benefits: ['Traditional Bilona Hand Churned', 'Natural aroma & golden granular texture', 'Lubricates joints & aids digestion'],
      bestFor: 'Paratha, tadka, halwa, daily energy'
    },
    'desi-butter': {
      fat: '80% Natural Milkfat',
      protein: 'Rich in Vitamin A & E',
      benefits: ['100% Salt-free freshly churned', 'Silky smooth texture', 'Zero artificial preservatives or food coloring'],
      bestFor: 'Garam parathas, saag, baking'
    },
    'fresh-dahi': {
      fat: 'Standard Rich Curd',
      protein: 'Probiotic Rich',
      benefits: ['Naturally sweet setting without sugar', 'Aids digestive gut microbiome', 'Zero cornstarch or gelatine'],
      bestFor: 'Raita, breakfast with paratha, lassi'
    },
    'fresh-paneer': {
      fat: '20% Natural Fats',
      protein: '22g Protein / 100g',
      benefits: ['Freshly curdled using pure lemon/whey', 'Soft, juicy, non-chewy texture', 'High protein gym diet'],
      bestFor: 'Palak paneer, grilled tikka, protein diet'
    },
    'pure-khoya': {
      fat: 'Whole milk solids',
      protein: '18g Protein / 100g',
      benefits: ['Slowly condensed over gentle flame', 'No flour, suji, or starch adulteration', 'Authentic traditional taste'],
      bestFor: 'Gulab jamun, barfi, gajar ka halwa'
    }
  };

  const filteredProducts = PRODUCTS_LIST.filter(p => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'milk') return p.id.includes('milk');
    if (selectedCategory === 'ghee') return p.id.includes('ghee') || p.id.includes('butter');
    if (selectedCategory === 'curd') return p.id.includes('dahi') || p.id.includes('paneer') || p.id.includes('khoya');
    return true;
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar onOpenOrder={() => setOrderModalOpen(true)} />
      <WhatsAppButton />
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        preSelectedProduct={selectedProduct}
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Farm Fresh Products & Official Price List</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Taaza Doodh Aur Khalis Dairy Ashya
          </h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base">
            Hamare farm ke tamam products 100% qudrati hain. Doodh mein na paani milaya jata hai aur na hi koi chemical preservative use hota hai.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-6">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-amber-400 text-slate-950 shadow-lg'
                  : 'bg-emerald-800/80 text-white hover:bg-emerald-700'
              }`}
            >
              Tamam Ashya (All Products)
            </button>
            <button
              onClick={() => setSelectedCategory('milk')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
                selectedCategory === 'milk'
                  ? 'bg-amber-400 text-slate-950 shadow-lg'
                  : 'bg-emerald-800/80 text-white hover:bg-emerald-700'
              }`}
            >
              Taaza Doodh (Fresh Milk)
            </button>
            <button
              onClick={() => setSelectedCategory('ghee')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
                selectedCategory === 'ghee'
                  ? 'bg-amber-400 text-slate-950 shadow-lg'
                  : 'bg-emerald-800/80 text-white hover:bg-emerald-700'
              }`}
            >
              Desi Ghee & Makhan
            </button>
            <button
              onClick={() => setSelectedCategory('curd')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
                selectedCategory === 'curd'
                  ? 'bg-amber-400 text-slate-950 shadow-lg'
                  : 'bg-emerald-800/80 text-white hover:bg-emerald-700'
              }`}
            >
              Dahi, Paneer & Khoya
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod) => {
            const extra = productDetails[prod.id];
            return (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                        100% Farm Pure
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-black text-slate-900">Rs {prod.price.toLocaleString()}</span>
                        <span className="text-xs text-slate-500 font-semibold block">/ {prod.unit}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-700 transition">
                      {prod.name}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>

                  {/* Nutrition & Benefits */}
                  <div className="p-6 space-y-4">
                    {extra && (
                      <div className="grid grid-cols-2 gap-2 text-xs bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100">
                        <div>
                          <span className="text-slate-500 block font-semibold text-[10px] uppercase">Fat Content</span>
                          <span className="font-bold text-emerald-950">{extra.fat}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block font-semibold text-[10px] uppercase">Protein Profile</span>
                          <span className="font-bold text-emerald-950">{extra.protein}</span>
                        </div>
                      </div>
                    )}

                    {extra?.benefits && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <HeartPulse className="w-4 h-4 text-emerald-600" />
                          <span>Sehat Ke Fawaid</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {extra.benefits.map((b, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {extra?.bestFor && (
                      <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="font-semibold text-slate-700">Munaasib Tareen: </span>
                        {extra.bestFor}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => openOrder(prod.name)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl transition text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Order Karein (Rs {prod.price}/{prod.unit})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Purity Guarantee Box */}
        <div className="mt-16 bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border border-emerald-200 rounded-3xl p-8 sm:p-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/20">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div className="space-y-2 text-center md:text-left flex-1">
              <h3 className="text-2xl font-bold text-emerald-950">
                Hamari Khalisiyat Ki Shartiya Zamanat (Open Challenge Guarantee)
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                Agar hamare doodh ya kisi bhi product mein koi bhi laboratory paani ki milawat ya chemical sabit kar de, toh hum na sirf poora mahina muft doodh fraham karenge balkay test charges bhi ada karenge.
              </p>
            </div>
            <button
              onClick={() => openOrder(PRODUCTS_LIST[0].name)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3.5 rounded-2xl text-sm shrink-0 cursor-pointer shadow-md"
            >
              Order Place Karein
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
