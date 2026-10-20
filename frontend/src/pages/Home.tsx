import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import OrderModal, { PRODUCTS_LIST } from '../components/OrderModal';
import { 
  Milk, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Truck, 
  CalendarCheck, 
  Beef,
  PhoneCall
} from 'lucide-react';

export default function Home() {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>();

  const openOrderWithProduct = (productName: string) => {
    setSelectedProduct(productName);
    setOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar onOpenOrder={() => setOrderModalOpen(true)} />
      <WhatsAppButton />
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        preSelectedProduct={selectedProduct}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white overflow-hidden py-16 lg:py-24">
        {/* Subtle background glow effect */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-24 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700/50 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm font-semibold">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>100% Khalis Doodh Ki Zamanat — No Water Mixing</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
                Taaza, Khalis Aur Sehat-Mand Doodh, <br />
                <span className="text-emerald-300">Seedha Hamare Farm Se!</span>
              </h1>

              <p className="text-emerald-100 text-base sm:text-lg max-w-2xl leading-relaxed">
                Gaay aur Bhens ka chemical-free, qudrati charay par pali hui cattles ka taaza doodh, desi makhan, aur pure desi ghee. Rozana subah aur shaam aapke dastar-khwan tak ba-hifazat rawana kiya jata hai.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => openOrderWithProduct(PRODUCTS_LIST[0].name)}
                  className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-8 py-4 rounded-2xl shadow-xl shadow-amber-400/20 text-base flex items-center justify-center gap-2 cursor-pointer transition transform hover:-translate-y-0.5"
                >
                  <Milk className="w-5 h-5" />
                  <span>Doodh Order Karein</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <Link
                  to="/products"
                  className="w-full sm:w-auto bg-emerald-800/80 hover:bg-emerald-700 border border-emerald-600/60 text-white font-bold px-7 py-4 rounded-2xl text-base flex items-center justify-center gap-2 transition"
                >
                  <span>Tamam Products & Rates</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-emerald-700/40 text-xs text-emerald-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-300 shrink-0" />
                  <span>Zero Adulteration Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-300 shrink-0" />
                  <span>Subah & Shaam Home Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Beef className="w-5 h-5 text-amber-300 shrink-0" />
                  <span>Grass-fed Healthy Animals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-amber-300 shrink-0" />
                  <span>Monthly Subscription Khata</span>
                </div>
              </div>
            </div>

            {/* Right Card Feature */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 rounded-3xl text-white shadow-2xl relative">
                <div className="absolute -top-4 -right-4 bg-amber-400 text-slate-950 text-xs font-black px-4 py-1.5 rounded-full shadow-md uppercase tracking-wider">
                  Fresh Daily Shift
                </div>

                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Milk className="w-6 h-6 text-amber-300" />
                  <span>Aaj Ka Taaza Doodh Rate</span>
                </h3>

                <div className="space-y-3.5 mb-6">
                  <div className="bg-emerald-950/40 p-4 rounded-2xl flex items-center justify-between border border-emerald-500/20">
                    <div>
                      <h4 className="font-bold text-white text-base">Gaay Ka Doodh (Cow Milk)</h4>
                      <p className="text-emerald-200 text-xs">Light & 100% Pure A2 Protein</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-amber-300">Rs 220</span>
                      <span className="text-xs text-emerald-200 block">/ Litre</span>
                    </div>
                  </div>

                  <div className="bg-emerald-950/40 p-4 rounded-2xl flex items-center justify-between border border-emerald-500/20">
                    <div>
                      <h4 className="font-bold text-white text-base">Bhens Ka Doodh (Buffalo Milk)</h4>
                      <p className="text-emerald-200 text-xs">Gaarha, Creamy & High Fat</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-amber-300">Rs 260</span>
                      <span className="text-xs text-emerald-200 block">/ Litre</span>
                    </div>
                  </div>

                  <div className="bg-emerald-950/40 p-4 rounded-2xl flex items-center justify-between border border-emerald-500/20">
                    <div>
                      <h4 className="font-bold text-white text-base">Khals Desi Ghee (Bilona Method)</h4>
                      <p className="text-emerald-200 text-xs">Traditonal aroma & golden granules</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-amber-300">Rs 2,400</span>
                      <span className="text-xs text-emerald-200 block">/ KG</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setOrderModalOpen(true)}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Abhi Ghar Baithe Order Dein</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="bg-slate-50 border-y border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <span className="text-3xl sm:text-4xl font-black text-emerald-700 block">120+</span>
              <span className="text-sm font-semibold text-slate-600 mt-1 block">Healthy Dairy Cattles</span>
              <span className="text-xs text-slate-400">Gaay aur Bhens (Registered)</span>
            </div>
            <div className="p-4">
              <span className="text-3xl sm:text-4xl font-black text-emerald-700 block">1,800+ L</span>
              <span className="text-sm font-semibold text-slate-600 mt-1 block">Rozana Milk Output</span>
              <span className="text-xs text-slate-400">Fresh Morning & Evening</span>
            </div>
            <div className="p-4">
              <span className="text-3xl sm:text-4xl font-black text-emerald-700 block">350+</span>
              <span className="text-sm font-semibold text-slate-600 mt-1 block">Mutma'in Households</span>
              <span className="text-xs text-slate-400">Monthly Home Delivery</span>
            </div>
            <div className="p-4">
              <span className="text-3xl sm:text-4xl font-black text-emerald-700 block">100%</span>
              <span className="text-sm font-semibold text-slate-600 mt-1 block">Khalis Guarantee</span>
              <span className="text-xs text-slate-400">Bina Paani / Bina Chemical</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-700 font-extrabold text-xs sm:text-sm tracking-widest uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Farm Fresh Products
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 mb-4">
              Hamare Farm Ke Khalis Dairy Products
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Har product farm par tayyar kiya jata hai, bila kisi milawat aur chemicals ke. Aaj hi order karein aur taazgi ka ehsaas karein.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS_LIST.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                      <Milk className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                      Taaza Daily
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition">
                    {item.name}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-baseline gap-1 pt-2 border-t border-slate-100">
                    <span className="text-2xl font-black text-emerald-800">Rs {item.price.toLocaleString()}</span>
                    <span className="text-xs font-semibold text-slate-500">/ {item.unit}</span>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => openOrderWithProduct(item.name)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    <span>Abhi Order Karein</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-bold text-base hover:underline"
            >
              <span>Tamam Products aur Tafseelat Dekhein</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
              Khususiyat
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 mb-4">
              Humein Kyun Muntakhib Karein?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Hamari dairy farm par har marhala qudrati tareeqon aur jadid hygiene standards par mabni hai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-bold">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">100% Khalis & Zero Milawat</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Hamare doodh mein paani, powder ya kisi qisam ka chemical nahi milaya jata. Har batch ki laboratory testing ki jati hai.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100 font-medium">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> Lactometer tested quality</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> Natural fat content intact</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200 space-y-4">
              <div className="w-14 h-14 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center font-bold">
                <Beef className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Sabz Chara & Sehat-Mand Janwar</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Tamam cattles ko khalis sabz chara, wanda aur minerals diye jaate hain. Rozana certified veterinary doctor muaina karte hain.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100 font-medium">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> Hormone & steroid injections free</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> Regular animal vaccination</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200 space-y-4">
              <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center font-bold">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Time Par Free Ghar Tak Delivery</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Subah ki chai aur shaam ki zaroorat ke liye fresh doodh chilled van aur delivery boys ke zariye time par ghar deliver hota hai.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100 font-medium">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> Monthly bill / ledger khata</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> WhatsApp updates & alerts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Customer Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 mb-4">
              Hamare Mutma'in Customers Ki Rai
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Saikron gharane pichle kayi saal se hamare doodh par aitmad kar rahe hain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Chaudhry Tariq Mahmood',
                loc: 'Model Town',
                text: 'MashAllah pichle 2 saal se doodh le rahe hain. Chai ka rang aur dahi ki jamawat itni behtareen hai ke kabhi kisi aur jagah se lene ki zaroorat nahi pari.',
              },
              {
                name: 'Dr. Faheem Akhtar',
                loc: 'WAPDA Town',
                text: 'Bachon ke liye gaay ka doodh talash kar raha tha jo bila injection aur khalis ho. Al-Karam Dairy ne meri pareshani hal kar di. Delivery hamesha 6:30 AM se pehle mil jati hai.',
              },
              {
                name: 'Begum Sajida Anwar',
                loc: 'Gulberg',
                text: 'Desi Makhan aur Ghee la-jawab hai! Asal purane zamane ki khushboo aati hai. Inka hisab khata aur ledger system bhi bohat saaf suthra hai.',
              },
            ].map((review, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 relative">
                <div className="flex gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm italic mb-6 leading-relaxed">
                  "{review.text}"
                </p>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                  <span className="text-xs text-emerald-700 font-medium">{review.loc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-emerald-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black">
            Kya Aap Bhi Apne Ghar Ke Liye Taaza Khalis Doodh Lagwana Chahte Hain?
          </h2>
          <p className="text-emerald-100 text-base max-w-2xl mx-auto">
            Hamein abhi call karein ya online form bhar kar apna delivery schedule set karein. Pehla din test sample bhi dastiyab hai!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setOrderModalOpen(true)}
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-8 py-4 rounded-2xl shadow-xl cursor-pointer text-base flex items-center justify-center gap-2"
            >
              <Milk className="w-5 h-5" />
              <span>Abhi Order Register Karein</span>
            </button>
            <a
              href="tel:+923001234567"
              className="w-full sm:w-auto bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-600 text-white font-bold px-8 py-4 rounded-2xl text-base flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-5 h-5 text-emerald-300" />
              <span>Direct Call: 0300-1234567</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}