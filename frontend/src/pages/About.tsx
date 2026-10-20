import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import OrderModal from '../components/OrderModal';
import { Milk, ShieldCheck, Heart, Award, Users, Sparkles } from 'lucide-react';

export default function About() {
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar onOpenOrder={() => setOrderModalOpen(true)} />
      <WhatsAppButton />
      <OrderModal isOpen={orderModalOpen} onClose={() => setOrderModalOpen(false)} />

      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Hamari Kahani & Hamara Maqsad</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Al-Karam Dairy Farm Ke Baare Mein
          </h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base">
            Ek aisa dairy farm jahan nafa kamanay se zyada hamare bachon aur khandan ke liye khalis aur quwwat-bakhsh doodh fraham karna pehli tarjeeh hai.
          </p>
        </div>
      </section>

      {/* Story & Vision */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Farm Story & Background
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              Kyun Hum Ne Yeh Farm Shuru Kiya?
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Aaj ke daur mein shehron mein milne wala doodh akser paani, chemicals, aur khushk powder ki milawat se bharpoor hota hai jo bachon ki sehat ko nuqsan pohanchata hai. 
            </p>
            <p className="text-slate-600 text-base leading-relaxed">
              Isi cheez ko dekhte hue hum ne saal 2018 mein Al-Karam Dairy Farm ki bunyad rakhi. Shuru mein sirf 10 gaayein theen, lekin khalisiyat aur honesty ki wajah se aaj hamare farm par 120+ certified sehat-mand janwar hain aur saikron gharon ko rozana taaza doodh pohancha rahe hain.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <span className="text-2xl font-black text-emerald-700 block">2018</span>
                <span className="text-xs text-slate-500 font-semibold">Qayam (Established)</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <span className="text-2xl font-black text-emerald-700 block">100%</span>
                <span className="text-xs text-slate-500 font-semibold">Khalis & A2 Milk</span>
              </div>
            </div>
          </div>

          {/* Owner Message Card */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden border border-emerald-800/40">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Owner's Message (Paigham)</h3>
            <p className="text-emerald-200 text-sm italic mb-6 leading-relaxed">
              "Hum is baat ko ibadat samajhte hain ke har customer ko wahi cheez dain jo hum apne bachon ko pilate hain. Hamare farm ka darwaza har customer ke liye har waqt khula hai taake woh khud dekh sakein."
            </p>
            <div className="border-t border-emerald-800/60 pt-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-base">Chaudhry Umar Farooq</p>
                <p className="text-xs text-emerald-400">Founder & Managing Director</p>
              </div>
              <Award className="w-8 h-8 text-amber-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-3">
              Hamare Bunyadi Usool (Core Values)
            </h2>
            <p className="text-slate-600 text-sm">
              Inhi 3 usoolon par hamare farm ki tamam karkardagi qayam hai:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1. Khalisiyat (Absolute Purity)</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Zero Paani, Zero Chemicals. Doodh ko kisi artificial procesing ke baghair qudrati shakal mein packed kiya jata hai.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center font-bold">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">2. Janwaron Ka Ehtram (Animal Welfare)</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Janwaron ko koi harmone injection (Oxytocin) nahi diya jata. Khula mahol, behtareen chara aur khushgawar fiza faraham ki jati hai.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center font-bold">
                <Milk className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">3. Jadid Safayi (Modern Hygiene)</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Automatic milking parlors, continuous cold storage (4°C chilling) aur sterilized steel containers ke zariye safayi ka aala miyar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
