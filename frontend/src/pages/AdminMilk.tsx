import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import { 
  Milk, 
  Plus, 
  Trash2, 
  X, 
  Sun, 
  Moon, 
  Filter,
  DollarSign
} from 'lucide-react';

interface MilkRecord {
  _id: string;
  animal?: {
    _id: string;
    tagNumber: string;
    name: string;
    type: string;
  };
  date: string;
  morningQty: number;
  eveningQty: number;
  ratePerLiter: number;
  createdAt: string;
}

export default function AdminMilk() {
  const { token } = useAuth();
  const [records, setRecords] = useState<MilkRecord[]>([]);
  const [summary, setSummary] = useState({
    totalMorning: 0,
    totalEvening: 0,
    totalMilk: 0,
    totalRevenue: 0,
    avgRate: 0,
  });
  const [animals, setAnimals] = useState<any[]>([]);

  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Add Milk Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formAnimal, setFormAnimal] = useState('');
  const [morningQty, setMorningQty] = useState('');
  const [eveningQty, setEveningQty] = useState('');
  const [ratePerLiter, setRatePerLiter] = useState('220');

  const fetchRecords = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE_URL}/api/milk`, {
        headers,
        params: {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      });

      if (res.data) {
        setRecords(res.data.records || []);
        if (res.data.summary) setSummary(res.data.summary);
      }
    } catch (err: any) {
      toast.error('Doodh records fetch karne mein masla');
    }
  };

  const fetchAnimals = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE_URL}/api/animals?status=active`, { headers });
      setAnimals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchAnimals();
  }, [token, startDate, endDate]);

  const handleAddMilk = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = { Authorization: `Bearer ${token}` };

    const payload = {
      date: new Date(formDate),
      animal: formAnimal || undefined,
      morningQty: Number(morningQty) || 0,
      eveningQty: Number(eveningQty) || 0,
      ratePerLiter: Number(ratePerLiter) || 220,
    };

    try {
      await axios.post(`${API_BASE_URL}/api/milk`, payload, { headers });
      toast.success('Doodh record kamyabi se darj ho gaya!');
      setModalOpen(false);
      setMorningQty('');
      setEveningQty('');
      fetchRecords();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error recording milk');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Kya aap yeh milk entry delete karna chahte hain?')) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_BASE_URL}/api/milk/${id}`, { headers });
      toast.success('Record delete ho gaya');
      fetchRecords();
    } catch (err) {
      toast.error('Delete karne mein masla');
    }
  };

  const totalCalculatedLiters = (Number(morningQty) || 0) + (Number(eveningQty) || 0);
  const totalCalculatedAmount = totalCalculatedLiters * (Number(ratePerLiter) || 0);

  return (
    <AdminLayout activeTitle="Milk Records (دودھ کی پیداوار)">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Milk className="w-6 h-6 text-emerald-600" />
              <span>Doodh Ki Rozana Pedaish (Daily Milk Production)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Subah aur shaam ki pedaish, collection rates aur kul hisaab
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer transition"
          >
            <Plus className="w-4 h-4" />
            <span>Naya Doodh Record Darj Karein (+ Add Entry)</span>
          </button>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold">
              <Milk className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-800 uppercase">Kul Doodh (Total Milk)</p>
              <p className="text-2xl font-black text-emerald-950">{summary.totalMilk} Litres</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-800 uppercase">Subah Ka Doodh (Morning)</p>
              <p className="text-2xl font-black text-amber-950">{summary.totalMorning} Litres</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-800 uppercase">Shaam Ka Doodh (Evening)</p>
              <p className="text-2xl font-black text-blue-950">{summary.totalEvening} Litres</p>
            </div>
          </div>

          <div className="bg-teal-50 border border-teal-200 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center font-bold">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-teal-800 uppercase">Estimated Value (Raqam)</p>
              <p className="text-2xl font-black text-teal-950">Rs {summary.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Date Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-700">Tareekh Se Filter:</span>
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
            {(startDate || endDate) && (
              <button
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="text-xs text-rose-600 font-bold hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6">Tareekh (Date)</th>
                  <th className="py-4 px-6">Janwar / Farm Total</th>
                  <th className="py-4 px-6">Subah (Morning L)</th>
                  <th className="py-4 px-6">Shaam (Evening L)</th>
                  <th className="py-4 px-6">Kul Doodh (Total L)</th>
                  <th className="py-4 px-6">Rate (Per Litre)</th>
                  <th className="py-4 px-6">Kul Raqam (Total Rs)</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-500 text-xs">
                      Koi milk record dastiyab nahi hai. "Naya Doodh Record Darj Karein" par click karein.
                    </td>
                  </tr>
                ) : (
                  records.map((r) => {
                    const totalL = (r.morningQty || 0) + (r.eveningQty || 0);
                    const totalRs = totalL * (r.ratePerLiter || 0);
                    return (
                      <tr key={r._id} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 px-6 font-bold text-slate-800">
                          {new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-700">
                          {r.animal ? (
                            <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold">
                              {r.animal.tagNumber} ({r.animal.name})
                            </span>
                          ) : (
                            <span className="text-slate-500 font-semibold italic">Poora Farm (Farm General)</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-amber-700 font-bold">{r.morningQty} L</td>
                        <td className="py-4 px-6 text-blue-700 font-bold">{r.eveningQty} L</td>
                        <td className="py-4 px-6 font-black text-slate-900 text-sm">{totalL} L</td>
                        <td className="py-4 px-6 text-slate-600 font-semibold">Rs {r.ratePerLiter}</td>
                        <td className="py-4 px-6 font-black text-emerald-700">Rs {totalRs.toLocaleString()}</td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDelete(r._id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Entry"
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

        {/* Add Milk Entry Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Milk className="w-5 h-5 text-emerald-600" />
                  <span>Doodh Ka Naya Record Darj Karein</span>
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleAddMilk} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tareekh (Date) *</label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Muntakhib Janwar (Optional)</label>
                    <select
                      value={formAnimal}
                      onChange={(e) => setFormAnimal(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    >
                      <option value="">Poore Farm Ka Total (General)</option>
                      {animals.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.tagNumber} — {a.name} ({a.type})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Subah Ka Doodh (Litre)</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      required
                      placeholder="e.g. 45"
                      value={morningQty}
                      onChange={(e) => setMorningQty(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Moon className="w-3.5 h-3.5 text-blue-500" />
                      <span>Shaam Ka Doodh (Litre)</span>
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      required
                      placeholder="e.g. 40"
                      value={eveningQty}
                      onChange={(e) => setEveningQty(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rate Fee Litre (Rs) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={ratePerLiter}
                    onChange={(e) => setRatePerLiter(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Auto Calculated Live Box (M-04) */}
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-emerald-800 font-bold block">Kul Doodh: {totalCalculatedLiters} Litres</span>
                    <span className="text-[11px] text-emerald-600">Rate: Rs {ratePerLiter} / Ltr</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block">Total Amount</span>
                    <span className="text-xl font-black text-emerald-950">Rs {totalCalculatedAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition"
                  >
                    Save Doodh Entry
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
