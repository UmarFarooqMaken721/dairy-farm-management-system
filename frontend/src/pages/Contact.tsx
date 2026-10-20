import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import OrderModal, { PRODUCTS_LIST } from '../components/OrderModal';
import { 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  ShoppingBag, 
  CheckCircle2, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

export default function Contact() {
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  // Form states for in-page order form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [product, setProduct] = useState(PRODUCTS_LIST[0].name);
  const [quantity, setQuantity] = useState(2);
  const [shift, setShift] = useState('Morning (06:00 AM - 08:30 AM)');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedProdObj = PRODUCTS_LIST.find((p) => p.name === product) || PRODUCTS_LIST[0];
  const totalAmount = selectedProdObj.price * quantity;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/orders`, {
        customerName: name,
        phone,
        address,
        product,
        quantity,
        unit: selectedProdObj.unit,
        totalAmount,
        notes: `Shift: ${shift}. ${note ? 'Note: ' + note : ''}`,
      });
      setSuccess(true);
      toast.success('Order kamyabi se record ho gaya hai!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Order process nahi ho saka');
    } finally {
      setSubmitting(false);
    }
  };

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
            <span>24/7 Customer Support & Home Delivery</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            Farm Se Rabta Aur Online Order
          </h1>
          <p className="text-emerald-100 max-w-2xl mx-auto text-sm sm:text-base">
            Koi bhi sawal ho ya apne ghar ke liye rozana taaza doodh ka schedule set karna ho, hum aapse rabta karne ke muntazir hain.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Contact Information
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-2 mb-4">
                Hamare Zariye Rabta Karein
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Aap phone call, WhatsApp ya farm visit ke zariye direct rabta kar sakte hain.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Direct Phone Calls</h4>
                  <p className="text-slate-600 text-xs mt-1">Rozana subah 5:00 AM se raat 10:00 PM tak</p>
                  <p className="text-emerald-700 font-bold text-base mt-1">+92 300 1234567</p>
                  <p className="text-emerald-700 font-bold text-base">+92 321 7654321</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">WhatsApp Quick Orders</h4>
                  <p className="text-slate-600 text-xs mt-1">Chat par apna naam aur address bhej kar fauran order confirm karein</p>
                  <a
                    href="https://wa.me/923001234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs font-bold bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                  >
                    Open WhatsApp Chat
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Farm Location & Address</h4>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                    Al-Karam Dairy Farm, Chak No. 45-RB, Near Canal Express Way, Faisalabad / Lahore Region, Punjab, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Delivery Shifts</h4>
                  <p className="text-slate-600 text-xs mt-1">
                    Morning Shift: 05:30 AM – 09:00 AM <br />
                    Evening Shift: 04:30 PM – 08:30 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* In-Page Order Form (SRS P-06) */}
          <div className="lg:col-span-7" id="order-form">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="mb-6">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Direct Order Form (P-06)
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Doodh & Dairy Products Ka Online Order Dein
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  Yeh form fill karein, hamara rider aapke diye gaye pate par fresh doodh pohancha dega.
                </p>
              </div>

              {success ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold text-emerald-950">Shukriya! Aapka Order Mil Gaya Hai</h4>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    Hamari dispatch team jald hi aapse call/WhatsApp par rabta karegi aur kal subah se aapki supply shuru ho jayegi.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm"
                  >
                    Naya Order Form Bharein
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Aapka Naam *</label>
                      <input
                        type="text"
                        required
                        placeholder="Muhammad Umar"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0300-1234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Product & Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Product Muntakhib Karein *</label>
                      <select
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl p-3 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
                      >
                        {PRODUCTS_LIST.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name} (Rs {p.price}/{p.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Miqdar ({selectedProdObj.unit}) *
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-11 h-11 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl font-bold text-base flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xl font-black text-slate-800 w-12 text-center">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-11 h-11 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl font-bold text-base flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                        <span className="text-xs font-bold text-slate-500 ml-1">{selectedProdObj.unit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Live Total Display */}
                  <div className="bg-emerald-50 p-3.5 rounded-2xl flex items-center justify-between border border-emerald-200">
                    <div>
                      <span className="text-xs text-emerald-800 font-bold block">Estimated Bill:</span>
                      <span className="text-[11px] text-emerald-600">{quantity} {selectedProdObj.unit} @ Rs {selectedProdObj.price}</span>
                    </div>
                    <span className="text-2xl font-black text-emerald-900">Rs {totalAmount.toLocaleString()}</span>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Delivery Ka Mukammal Pata (House #, Street, City) *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Misaal: Makaan no 12, Gali no 4, Phase 2, DHA / Johar Town"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  {/* Preferred Delivery Shift */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Time Shift</label>
                      <select
                        value={shift}
                        onChange={(e) => setShift(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
                      >
                        <option value="Morning (06:00 AM - 08:30 AM)">Morning (Subah 6:00 se 8:30 tak)</option>
                        <option value="Evening (05:00 PM - 08:00 PM)">Evening (Shaam 5:00 se 8:00 tak)</option>
                        <option value="Both Shifts Daily">Subah aur Shaam Dono Waqt</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Hidayat / Notes (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Doodh bartan mein daalna hai"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-xl text-base shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>{submitting ? 'Order Submit Ho Raha Hai...' : `Order Place Karein (Total: Rs ${totalAmount.toLocaleString()})`}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Questions & Answers
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Aksar Poochay Janay Walay Sawalat (FAQs)
            </h3>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Doodh ghar tak kis tarah pohanchaya jata hai?</span>
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Hamare riders food-grade stainless steel cans aur thermal insulation bags mein doodh band karke rozana subah aur shaam waqt par aapke darwaze tak deliver karte hain.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Payment ka tareeqa kar kya hota hai? (Bill / Udhaar Khata)</span>
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Aap rozana Cash on Delivery ada kar sakte hain ya mahana (Monthly Ledger Khata) shuru karwa sakte hain jahan mahine ke aakhir par online JazzCash, EasyPaisa ya Bank Transfer se adaigi ki ja sakti hai.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kya hum delivery shuru karne se pehle test sample le sakte hain?</span>
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Ji bilkul! Pehle din 1 ya 2 litre mangwa kar test kar sakte hain. Jab aapki tasalli ho jaye tab regular delivery schedule lagwayein.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
