import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import toast from 'react-hot-toast';
import { X, ShoppingBag, CheckCircle2, MessageCircle, Sparkles } from 'lucide-react';

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
}

export const PRODUCTS_LIST: ProductItem[] = [
  { id: 'cow-milk', name: 'Khalis Gaay Ka Doodh (Pure Cow Milk)', price: 220, unit: 'Liter', description: 'Light, digestive, A2 protein rich fresh cow milk' },
  { id: 'buffalo-milk', name: 'Khalis Bhens Ka Doodh (Pure Buffalo Milk)', price: 260, unit: 'Liter', description: 'Thick, creamy, high-fat pure buffalo milk for tea & sweets' },
  { id: 'desi-ghee', name: 'Desi Makhan Ka Ghee (Pure Desi Ghee)', price: 2400, unit: 'KG', description: 'Traditional bilona method, 100% natural aroma & purity' },
  { id: 'desi-butter', name: 'Taaza Desi Makhan (White Butter)', price: 1400, unit: 'KG', description: 'Freshly churned white butter, unsalted & pure' },
  { id: 'fresh-dahi', name: 'Khalis Gaarha Dahi (Fresh Yogurt)', price: 280, unit: 'KG', description: 'Naturally set thick sweet curd without gelatin or starch' },
  { id: 'fresh-paneer', name: 'Organic Fresh Paneer (Cottage Cheese)', price: 1100, unit: 'KG', description: 'Soft, moist, high-protein fresh paneer cubes' },
  { id: 'pure-khoya', name: 'Khalis Doodh Ka Khoya (Fresh Mawa)', price: 1200, unit: 'KG', description: 'Slow cooked pure whole milk khoya for authentic sweets' },
];

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedProduct?: string;
}

export default function OrderModal({ isOpen, onClose, preSelectedProduct }: OrderModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(preSelectedProduct || PRODUCTS_LIST[0].name);
  const [quantity, setQuantity] = useState(2);
  const [shift, setShift] = useState('Morning (06:00 AM - 08:30 AM)');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  useEffect(() => {
    if (preSelectedProduct) {
      setSelectedProduct(preSelectedProduct);
    }
  }, [preSelectedProduct]);

  if (!isOpen) return null;

  const currentProd = PRODUCTS_LIST.find((p) => p.name === selectedProduct) || PRODUCTS_LIST[0];
  const totalAmount = currentProd.price * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address) {
      toast.error('Barah-e-karam apna naam, phone aur pata darj karein');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        customerName,
        phone,
        address,
        product: currentProd.name,
        quantity,
        unit: currentProd.unit,
        totalAmount,
        notes: `Shift: ${shift}. ${notes ? 'Note: ' + notes : ''}`,
      };

      const res = await axios.post(`${API_BASE_URL}/api/orders`, orderPayload);
      setPlacedOrder(res.data.order || orderPayload);
      toast.success('Shukriya! Aapka order kamyabi se darj ho chuka hai.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Order process karne mein masla pesh aaya');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPlacedOrder(null);
    setCustomerName('');
    setPhone('');
    setAddress('');
    setNotes('');
    setQuantity(2);
    onClose();
  };

  const openWhatsAppConfirmation = () => {
    const waText = encodeURIComponent(
      `Assalam-o-Alaikum! Main ne website par order place kiya hai:\n\n` +
      `👤 Naam: ${customerName}\n` +
      `📞 Phone: ${phone}\n` +
      `🏠 Pata: ${address}\n` +
      `🥛 Product: ${currentProd.name}\n` +
      `📦 Miqdar: ${quantity} ${currentProd.unit}\n` +
      `💰 Kul Raqam: Rs ${totalAmount.toLocaleString()}\n` +
      `⏰ Shift: ${shift}\n\n` +
      `Barah-e-karam order confirm karein.`
    );
    window.open(`https://wa.me/923001234567?text=${waText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-emerald-100 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-6 relative">
          <button
            onClick={handleReset}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Seedha Farm Se Taaza Supply</span>
          </div>
          <h3 className="text-2xl font-bold">Online Doodh & Dairy Order</h3>
          <p className="text-emerald-100 text-xs mt-1">Rozana subah aur shaam taaza doodh ki free home delivery</p>
        </div>

        {/* Content */}
        {placedOrder ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold text-slate-800 mb-2">Order Kamyab Ho Gaya!</h4>
            <p className="text-slate-600 text-sm mb-6">
              Aapka order receive ho chuka hai. Hamari farm delivery team jald hi aapse rabta karegi.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-semibold text-slate-800">{placedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Product:</span>
                <span className="font-semibold text-slate-800">{placedOrder.product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Quantity:</span>
                <span className="font-semibold text-slate-800">{placedOrder.quantity} {placedOrder.unit}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-emerald-700">
                <span>Total Bill:</span>
                <span>Rs {placedOrder.totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={openWhatsAppConfirmation}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Par Confirm Karein</span>
              </button>
              <button
                onClick={handleReset}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl cursor-pointer text-sm"
              >
                Band Karein
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Product Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Muntakhib Karein *
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-medium"
              >
                {PRODUCTS_LIST.map((prod) => (
                  <option key={prod.id} value={prod.name}>
                    {prod.name} — Rs {prod.price} / {prod.unit}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-emerald-700 mt-1 italic">{currentProd.description}</p>
            </div>

            {/* Quantity Counter & Rate Display */}
            <div className="grid grid-cols-2 gap-4 bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100">
              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Miqdar ({currentProd.unit}) *
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 bg-white border border-emerald-200 rounded-lg font-bold text-emerald-800 hover:bg-emerald-100 flex items-center justify-center cursor-pointer shadow-xs"
                  >
                    -
                  </button>
                  <span className="text-lg font-black text-emerald-950 w-10 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 bg-white border border-emerald-200 rounded-lg font-bold text-emerald-800 hover:bg-emerald-100 flex items-center justify-center cursor-pointer shadow-xs"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right flex flex-col justify-center">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Total Hasb-e-Hisaab</span>
                <span className="text-xl font-black text-emerald-800">Rs {totalAmount.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500">(@ Rs {currentProd.price}/{currentProd.unit})</span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Aapka Naam *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Ahmad"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
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
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Ka Mukammal Pata (Address) *</label>
              <textarea
                required
                rows={2}
                placeholder="House #, Street / Mohallah, Area, City"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Delivery Shift & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Time Shift</label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium"
                >
                  <option value="Morning (06:00 AM - 08:30 AM)">Morning (06:00 AM – 08:30 AM)</option>
                  <option value="Evening (05:00 PM - 08:00 PM)">Evening (05:00 PM – 08:00 PM)</option>
                  <option value="Dono Waqt (Subah & Shaam)">Dono Waqt (Rozana Subah & Shaam)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Koi Khas Hidayat (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Ghar ki ghanti bajayein"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{loading ? 'Order Darj Ho Raha Hai...' : `Order Place Karein — Rs ${totalAmount.toLocaleString()}`}</span>
            </button>
            <p className="text-[11px] text-center text-slate-500">
              💵 Payment delivery ke waqt Cash on Delivery ya JazzCash/EasyPaisa ke zariye ada karein.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
