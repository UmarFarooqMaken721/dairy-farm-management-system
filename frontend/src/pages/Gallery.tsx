import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import OrderModal from '../components/OrderModal';
import { Camera, X, ChevronRight, CheckCircle2 } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  category: 'animals' | 'pasture' | 'milking' | 'processing';
  description: string;
  badge: string;
  bgGradient: string;
}

const GALLERY_DATA: GalleryItem[] = [
  {
    id: 1,
    title: 'Pure Breed Sahiwal & Australian Cows',
    category: 'animals',
    description: 'Hamari gaayein certified healthy aur A2 protein se bharpoor doodh daiti hain.',
    badge: 'Healthy Cattles',
    bgGradient: 'from-amber-700 to-amber-900',
  },
  {
    id: 2,
    title: 'High-Yield Nili Ravi & Kundi Buffalos',
    category: 'animals',
    description: 'Thick, high fat aur creamy doodh ke liye Punjab ki behtareen nasal ki bheinsein.',
    badge: 'Premium Buffalo',
    bgGradient: 'from-slate-800 to-slate-950',
  },
  {
    id: 3,
    title: 'Automated Milking Parlor (Touchless)',
    category: 'milking',
    description: 'Hatho se chhooye baghair modern German vacuum milking system se doodh nikalna.',
    badge: 'Hygiene & Cleanliness',
    bgGradient: 'from-blue-700 to-indigo-900',
  },
  {
    id: 4,
    title: 'Lush Green Organic Fodder Fields',
    category: 'pasture',
    description: 'Alfalfa, Barseem aur Makai ka taaza sabz chara rozana janwaron ke liye kata jata hai.',
    badge: 'Organic Feed',
    bgGradient: 'from-emerald-700 to-teal-900',
  },
  {
    id: 5,
    title: 'Bulk Milk Chiller (4°C Cold Storage)',
    category: 'milking',
    description: 'Milking ke fauran baad doodh ko 4 degree par thanda kiya jata hai taake bacteria na paida hon.',
    badge: 'Cold Chain',
    bgGradient: 'from-cyan-700 to-blue-950',
  },
  {
    id: 6,
    title: 'Traditional Desi Ghee Bilona Center',
    category: 'processing',
    description: 'Mitti ki haandi aur lakdi ki madhani se dahi jamakar makhhan aur khalis ghee banana.',
    badge: 'Artisanal Bilona',
    bgGradient: 'from-yellow-600 to-amber-800',
  },
  {
    id: 7,
    title: 'Clean Airy Barns & Animal Comfort',
    category: 'animals',
    description: 'Hawa-daar she shed, fresh drinking water aur fan mist cooling system for animal wellbeing.',
    badge: 'Animal Care',
    bgGradient: 'from-emerald-800 to-slate-900',
  },
  {
    id: 8,
    title: 'Veterinary Doctor Inspection & Health Checks',
    category: 'animals',
    description: 'Rozana subah aur shaam certified veterinary doctor ki nigrani mein sehat ki check-up.',
    badge: 'Medical Care',
    bgGradient: 'from-rose-800 to-slate-900',
  },
  {
    id: 9,
    title: 'Insulated Stainless Steel Delivery Cans',
    category: 'processing',
    description: 'Ghar tak delivery ke liye food-grade stainless steel air-tight packaging.',
    badge: 'Safe Transport',
    bgGradient: 'from-teal-800 to-emerald-950',
  },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'animals' | 'pasture' | 'milking' | 'processing'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const filtered = GALLERY_DATA.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar onOpenOrder={() => setOrderModalOpen(true)} />
      <WhatsAppButton />
      <OrderModal isOpen={orderModalOpen} onClose={() => setOrderModalOpen(false)} />

      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5 text-amber-300" />
            <span>Farm Life & Hygiene Visuals</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Hamara Dairy Farm Aur Janwar
          </h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base">
            Hamare farm ke khule sabzazar, sehat-mand janwar, aur jadid safe milking process ki jhalakian. Hum transparent tareeqe se kaam karne par yaqeen rakhte hain.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 pt-6">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-amber-400 text-slate-950 shadow-lg'
                  : 'bg-emerald-800/80 text-white hover:bg-emerald-700'
              }`}
            >
              Tamam Tasveerein (All)
            </button>
            <button
              onClick={() => setActiveCategory('animals')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeCategory === 'animals'
                  ? 'bg-amber-400 text-slate-950 shadow-lg'
                  : 'bg-emerald-800/80 text-white hover:bg-emerald-700'
              }`}
            >
              Gaay & Bhens (Cattles)
            </button>
            <button
              onClick={() => setActiveCategory('milking')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeCategory === 'milking'
                  ? 'bg-amber-400 text-slate-950 shadow-lg'
                  : 'bg-emerald-800/80 text-white hover:bg-emerald-700'
              }`}
            >
              Milking Parlor & Chiller
            </button>
            <button
              onClick={() => setActiveCategory('pasture')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeCategory === 'pasture'
                  ? 'bg-amber-400 text-slate-950 shadow-lg'
                  : 'bg-emerald-800/80 text-white hover:bg-emerald-700'
              }`}
            >
              Sabz Chara & Khet
            </button>
            <button
              onClick={() => setActiveCategory('processing')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeCategory === 'processing'
                  ? 'bg-amber-400 text-slate-950 shadow-lg'
                  : 'bg-emerald-800/80 text-white hover:bg-emerald-700'
              }`}
            >
              Desi Ghee & Makhan Making
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Cards Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group cursor-pointer rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Visual Simulated Photo Container */}
              <div
                className={`h-56 bg-gradient-to-br ${item.bgGradient} relative flex flex-col justify-between p-6 text-white overflow-hidden`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-wider">
                    {item.badge}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white group-hover:text-slate-950 flex items-center justify-center transition">
                    <Camera className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-white group-hover:translate-x-1 transition duration-300">
                    {item.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 bg-white space-y-3">
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs pt-2 border-t border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Verified Farm Practice</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Physical Visit Invitation */}
        <div className="mt-16 bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10 text-center space-y-4 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900">
            Aap Khud Farm Ka Muaina Karna Chahte Hain?
          </h3>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
            Humein apne farm par aapko welcome karte hue khushi hogi! Har itwar (Sunday) family visit open hoti hai jahan aap apne bachon ke sath aakar dekh sakte hain ke doodh kis qadar safayi se nikaala jata hai.
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/923001234567?text=Assalam-o-Alaikum!%20Main%20farm%20visit%20karna%20chahta%20hoon."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-2xl text-sm shadow-md"
            >
              <span>Farm Visit Schedule Karein (WhatsApp)</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-700 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`h-72 bg-gradient-to-br ${selectedPhoto.bgGradient} p-8 flex flex-col justify-end text-white relative`}>
              <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-wider self-start mb-3">
                {selectedPhoto.badge}
              </span>
              <h3 className="text-3xl font-black">{selectedPhoto.title}</h3>
            </div>

            <div className="p-8 space-y-4">
              <p className="text-slate-700 text-base leading-relaxed">
                {selectedPhoto.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    setSelectedPhoto(null);
                    setOrderModalOpen(true);
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition cursor-pointer"
                >
                  Isi Khalis Doodh Ka Order Dein
                </button>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl text-sm transition cursor-pointer"
                >
                  Band Karein
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
