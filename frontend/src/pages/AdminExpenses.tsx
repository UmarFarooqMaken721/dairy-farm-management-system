import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import { 
  Wallet, 
  Plus, 
  Trash2, 
  X, 
  Filter 
} from 'lucide-react';

interface Expense {
  _id: string;
  category: 'chara' | 'dawa' | 'tankha' | 'bijli' | 'maintenance' | 'other';
  amount: number;
  date: string;
  note?: string;
  createdAt: string;
}

export default function AdminExpenses() {
  const { token } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Add Expense Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [category, setCategory] = useState<'chara' | 'dawa' | 'tankha' | 'bijli' | 'maintenance' | 'other'>('chara');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const fetchExpenses = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE_URL}/api/expenses`, {
        headers,
        params: {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      });

      if (res.data) {
        setExpenses(res.data.expenses || []);
        setTotalAmount(res.data.totalAmount || 0);
        setCategoryTotals(res.data.categoryTotals || {});
      }
    } catch (err: any) {
      toast.error('Expenses load karne mein masla hua');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [token, selectedCategory, startDate, endDate]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error('Sahi raqam darj karein');
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`${API_BASE_URL}/api/expenses`, {
        category,
        amount: Number(amount),
        date: new Date(date),
        note,
      }, { headers });

      toast.success('Kharcha kamyabi se record ho gaya!');
      setModalOpen(false);
      setAmount('');
      setNote('');
      fetchExpenses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error recording expense');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Kya aap yeh expense entry delete karna chahte hain?')) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_BASE_URL}/api/expenses/${id}`, { headers });
      toast.success('Expense record delete ho gaya');
      fetchExpenses();
    } catch (err) {
      toast.error('Delete karne mein masla');
    }
  };

  const categoryLabels: Record<string, { label: string; urdu: string; color: string }> = {
    chara: { label: 'Green Fodder & Feed', urdu: 'چارہ و ونڈا', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    dawa: { label: 'Medicines & Vet', urdu: 'ادویات و ڈاکٹر', color: 'bg-rose-100 text-rose-800 border-rose-200' },
    tankha: { label: 'Worker Salaries', urdu: 'ملازمین کی تنخواہ', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    bijli: { label: 'Electricity & Utilities', urdu: 'بجلی و پانی بل', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    maintenance: { label: 'Farm Repairs & Fuel', urdu: 'مرمت و فیول', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    other: { label: 'Other Miscellaneous', urdu: 'متفرق اخراجات', color: 'bg-slate-100 text-slate-800 border-slate-200' },
  };

  return (
    <AdminLayout activeTitle="Expenses Management (فارم کے اخراجات)">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-rose-600" />
              <span>Farm Kharajat Ka Hisab Kitab (Expense Book)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Kul Kharajat: <span className="font-bold text-rose-600 text-sm">Rs {totalAmount.toLocaleString()}</span>
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-rose-600/20 cursor-pointer transition"
          >
            <Plus className="w-4 h-4" />
            <span>Naya Kharcha Darj Karein (+ Add Expense)</span>
          </button>
        </div>

        {/* Category Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(categoryLabels).map(([catKey, info]) => {
            const sum = categoryTotals[catKey] || 0;
            return (
              <div
                key={catKey}
                onClick={() => setSelectedCategory(selectedCategory === catKey ? 'all' : catKey)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedCategory === catKey
                    ? 'ring-2 ring-rose-500 bg-white shadow-md'
                    : 'bg-slate-50 border-slate-200 hover:bg-white'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{info.urdu}</span>
                <span className="text-xs font-bold text-slate-700 block truncate">{info.label}</span>
                <span className="text-base font-black text-slate-900 mt-1 block">Rs {sum.toLocaleString()}</span>
              </div>
            );
          })}
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-700">Filter Karein:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-none"
            >
              <option value="all">Tamam Categories (All)</option>
              <option value="chara">Chara & Wanda (چارہ)</option>
              <option value="dawa">Dawa & Vet (ادویات)</option>
              <option value="tankha">Worker Salaries (تنخواہ)</option>
              <option value="bijli">Bijli & Bills (بجلی)</option>
              <option value="maintenance">Maintenance & Repairs (مرمت)</option>
              <option value="other">Other (متفرق)</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs bg-slate-50 outline-none"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs bg-slate-50 outline-none"
              />
            </div>
            {(selectedCategory !== 'all' || startDate || endDate) && (
              <button
                onClick={() => { setSelectedCategory('all'); setStartDate(''); setEndDate(''); }}
                className="text-xs text-rose-600 font-bold hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6">Tareekh (Date)</th>
                  <th className="py-4 px-6">Category (شعبہ)</th>
                  <th className="py-4 px-6">Tafseel / Note</th>
                  <th className="py-4 px-6">Raqam (Amount Rs)</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-500 text-xs">
                      Koi expense record dastiyab nahi hai. "Naya Kharcha Darj Karein" par click karein.
                    </td>
                  </tr>
                ) : (
                  expenses.map((e) => {
                    const catInfo = categoryLabels[e.category] || categoryLabels.other;
                    return (
                      <tr key={e._id} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 px-6 font-bold text-slate-800">
                          {new Date(e.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${catInfo.color}`}>
                            <span>{catInfo.urdu}</span>
                            <span className="opacity-70">({catInfo.label})</span>
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">{e.note || '—'}</td>
                        <td className="py-4 px-6 font-black text-rose-600 text-sm">
                          Rs {e.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDelete(e._id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Expense"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Expense Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-rose-600" />
                  <span>Farm Ka Kharcha Darj Karein</span>
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleAddExpense} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category (موضوع) *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-none bg-white"
                    >
                      <option value="chara">Chara & Wanda (چارہ و ونڈا)</option>
                      <option value="dawa">Dawa & Doctor (ادویات)</option>
                      <option value="tankha">Worker Tankha (تنخواہ)</option>
                      <option value="bijli">Bijli & Utilities (بجلی بل)</option>
                      <option value="maintenance">Maintenance / Diesel (مرمت و تیل)</option>
                      <option value="other">Other Misc (متفرق)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tareekh (Date) *</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Raqam (Amount in Rs) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 5000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-bold focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tafseel / Note (Kis cheez par kharch hua?)</label>
                  <textarea
                    rows={2}
                    placeholder="Misaal: Makai ka sabz chara 10 mann ya Doctor Faheem ki fees"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl text-xs transition"
                  >
                    Save Expense Entry
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-5 rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
