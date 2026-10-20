import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import { 
  Users, 
  Plus, 
  Search, 
  BookOpen, 
  Trash2, 
  Edit3, 
  X, 
  Printer, 
  CheckCircle2
} from 'lucide-react';

interface Customer {
  _id: string;
  name: string;
  phone: string;
  address?: string;
  balance: number;
  createdAt: string;
}

export default function AdminCustomers() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');

  // Add / Edit Customer Modal
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [initialBalance, setInitialBalance] = useState('0');

  // Ledger (Khata) Modal
  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [ledgerData, setLedgerData] = useState<any | null>(null);

  // New Transaction in Ledger (Sale vs Payment)
  const [txnType, setTxnType] = useState<'sale' | 'payment'>('sale');
  const [milkQty, setMilkQty] = useState('2');
  const [rate, setRate] = useState('240');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'jazzcash' | 'easypaisa' | 'bank'>('cash');
  const [txnDate, setTxnDate] = useState(new Date().toISOString().split('T')[0]);
  const [txnNote, setTxnNote] = useState('');

  const fetchCustomers = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE_URL}/api/customers`, {
        headers,
        params: { search: search || undefined },
      });
      setCustomers(res.data);
    } catch (err) {
      toast.error('Customers fetch nahi ho sake');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [token, search]);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setName('');
    setPhone('');
    setAddress('');
    setInitialBalance('0');
    setCustomerModalOpen(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c);
    setName(c.name);
    setPhone(c.phone);
    setAddress(c.address || '');
    setInitialBalance(String(c.balance));
    setCustomerModalOpen(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (editingCustomer) {
        await axios.put(`${API_BASE_URL}/api/customers/${editingCustomer._id}`, {
          name,
          phone,
          address,
        }, { headers });
        toast.success('Customer details update ho gayin!');
      } else {
        await axios.post(`${API_BASE_URL}/api/customers`, {
          name,
          phone,
          address,
          balance: Number(initialBalance) || 0,
        }, { headers });
        toast.success('Naya customer register ho gaya!');
      }
      setCustomerModalOpen(false);
      fetchCustomers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Save nahi ho saka');
    }
  };

  const handleDeleteCustomer = async (id: string, custName: string) => {
    if (!window.confirm(`Kya aap ${custName} ka record aur khata delete karna chahte hain?`)) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_BASE_URL}/api/customers/${id}`, { headers });
      toast.success('Customer delete ho gaya');
      fetchCustomers();
    } catch (err) {
      toast.error('Delete karne mein masla hua');
    }
  };

  // Open Khata / Ledger
  const handleOpenLedger = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setLedgerModalOpen(true);
    await fetchLedgerDetails(customer._id);
  };

  const fetchLedgerDetails = async (customerId: string) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE_URL}/api/customers/${customerId}/ledger`, { headers });
      setLedgerData(res.data);
    } catch (err) {
      toast.error('Khata load nahi ho saka');
    }
  };

  // Record Sale or Payment inside Ledger
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (txnType === 'sale') {
        const total = Number(milkQty) * Number(rate);
        await axios.post(`${API_BASE_URL}/api/sales`, {
          customer: selectedCustomer._id,
          milkQty: Number(milkQty),
          rate: Number(rate),
          amount: total,
          date: new Date(txnDate),
          note: txnNote,
        }, { headers });
        toast.success(`Doodh Farokht (Rs ${total.toLocaleString()}) khata mein darj ho gaya!`);
      } else {
        await axios.post(`${API_BASE_URL}/api/payments`, {
          customer: selectedCustomer._id,
          amount: Number(paymentAmount),
          paymentMethod,
          date: new Date(txnDate),
          note: txnNote,
        }, { headers });
        toast.success(`Vasooli (Rs ${Number(paymentAmount).toLocaleString()}) ada ho gayi! Balance kam ho gaya.`);
      }

      setPaymentAmount('');
      setTxnNote('');
      await fetchLedgerDetails(selectedCustomer._id);
      fetchCustomers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Transaction save nahi ho saki');
    }
  };

  const totalOutstandingUdhaar = customers.reduce((acc, c) => acc + (c.balance > 0 ? c.balance : 0), 0);

  return (
    <AdminLayout activeTitle="Customers & Ledger Khata (گاہک اور ادھار کھاتہ)">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              <span>Grahak Fehrist & Udhaar Khata (Customer Ledger)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Kul Market Udhaar Baqi: <span className="font-bold text-rose-600 text-sm">Rs {totalOutstandingUdhaar.toLocaleString()}</span> (Wajib-ul-Ada)
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-purple-600/20 cursor-pointer transition"
          >
            <Plus className="w-4 h-4" />
            <span>Naya Customer Shamil Karein (+ Add Customer)</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Customer ka naam ya phone number likhein..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-medium bg-transparent outline-none"
          />
        </div>

        {/* Customers Grid / Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6">Customer Naam</th>
                  <th className="py-4 px-6">Phone Number</th>
                  <th className="py-4 px-6">Delivery Address</th>
                  <th className="py-4 px-6">Current Balance (کھاتہ)</th>
                  <th className="py-4 px-6 text-right">Khata & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-500 text-xs">
                      Koi customer record nahi mila. Naya customer add karein.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6 font-bold text-slate-900 text-sm">{c.name}</td>
                      <td className="py-4 px-6 text-slate-600 font-mono font-medium">{c.phone}</td>
                      <td className="py-4 px-6 text-slate-500 max-w-xs truncate">{c.address || '—'}</td>
                      <td className="py-4 px-6">
                        {c.balance > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <span>Udhaar Baqi: Rs {c.balance.toLocaleString()}</span>
                          </span>
                        ) : c.balance < 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            <span>Advance Paid: Rs {Math.abs(c.balance).toLocaleString()}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Khata Clear (Rs 0)</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenLedger(c)}
                            className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold px-3 py-1.5 rounded-xl border border-purple-200 transition flex items-center gap-1 text-[11px] cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Khata / Ledger Kholein</span>
                          </button>
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(c._id, c.name)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Customer Modal */}
        {customerModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">
                  {editingCustomer ? 'Customer Info Edit Karein' : 'Naya Customer Register Karein'}
                </h3>
                <button
                  onClick={() => setCustomerModalOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSaveCustomer} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Customer Ka Pura Naam *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Haji Muhammad Aslam"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-purple-500 outline-none"
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
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ghar / Dukan Ka Pata (Address)</label>
                  <input
                    type="text"
                    placeholder="House #, Mohallah, Colony, City"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                {!editingCustomer && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pehla Udhaar / Initial Balance (Rs)</label>
                    <input
                      type="number"
                      value={initialBalance}
                      onChange={(e) => setInitialBalance(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Agar pehle se koi purana hisab baqi ho toh darj karein.</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl text-xs transition"
                  >
                    {editingCustomer ? 'Update Karein' : 'Save Customer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomerModalOpen(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-5 rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CUSTOMER LEDGER (KHATA) FULL MODAL (SRS C-03, C-04, C-05) */}
        {ledgerModalOpen && selectedCustomer && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col justify-between overflow-hidden">
              <div>
                {/* Ledger Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center font-bold">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {selectedCustomer.name} Ka Udhaar Khata
                      </h3>
                      <p className="text-xs text-slate-500">
                        Phone: {selectedCustomer.phone} • Address: {selectedCustomer.address || 'Standard Delivery'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Khata</span>
                    </button>
                    <button
                      onClick={() => setLedgerModalOpen(false)}
                      className="p-1 rounded-full hover:bg-slate-100"
                    >
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                </div>

                {/* Ledger Overview Summary Cards */}
                <div className="grid grid-cols-3 gap-3 my-4">
                  <div className="bg-purple-50 border border-purple-200 p-3.5 rounded-2xl">
                    <span className="text-[10px] font-bold uppercase text-purple-800 block">Total Doodh Supply (Sales)</span>
                    <span className="text-lg font-black text-purple-950">
                      Rs {ledgerData?.totalSales?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
                    <span className="text-[10px] font-bold uppercase text-emerald-800 block">Kul Vasooli (Payments)</span>
                    <span className="text-lg font-black text-emerald-950">
                      Rs {ledgerData?.totalPayments?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className={`p-3.5 rounded-2xl border ${
                    (ledgerData?.currentBalance || 0) > 0
                      ? 'bg-rose-50 border-rose-200'
                      : 'bg-emerald-50 border-emerald-200'
                  }`}>
                    <span className="text-[10px] font-bold uppercase block text-slate-600">Current Balance (صافی بقایا)</span>
                    <span className={`text-lg font-black ${
                      (ledgerData?.currentBalance || 0) > 0 ? 'text-rose-700' : 'text-emerald-700'
                    }`}>
                      Rs {ledgerData?.currentBalance?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>

                {/* Khata Entry Form (Add Sale or Add Payment) */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Nayi Entry Darj Karein:
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setTxnType('sale')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          txnType === 'sale'
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        + Doodh Supply (Sale / Udhaar +)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTxnType('payment')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          txnType === 'payment'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        + Vasooli / Payment (Udhaar Kam -)
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleAddTransaction} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end">
                    {txnType === 'sale' ? (
                      <>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Doodh Miqdar (L)</label>
                          <input
                            type="number"
                            step="0.5"
                            required
                            min="0.1"
                            value={milkQty}
                            onChange={(e) => setMilkQty(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Rate Fee L (Rs)</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold outline-none"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Vasool Raqam (Rs)</label>
                          <input
                            type="number"
                            required
                            min="1"
                            placeholder="e.g. 5000"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Tareeqa-e-Adaigi</label>
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value as any)}
                            className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-medium outline-none"
                          >
                            <option value="cash">Naqd (Cash)</option>
                            <option value="jazzcash">JazzCash</option>
                            <option value="easypaisa">EasyPaisa</option>
                            <option value="bank">Bank Transfer</option>
                          </select>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Tareekh (Date)</label>
                      <input
                        type="date"
                        required
                        value={txnDate}
                        onChange={(e) => setTxnDate(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-medium outline-none"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold text-white shadow-xs transition cursor-pointer ${
                          txnType === 'sale' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        {txnType === 'sale' ? '+ Doodh Darj Karein' : '+ Payment Vasool Karein'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Ledger Transactions Statement Table */}
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Mukammal Khata Statement (Ledger History):
                </h4>
                <div className="overflow-y-auto max-h-52 border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                      <tr>
                        <th className="p-2.5">Tareekh</th>
                        <th className="p-2.5">Tafseel (Description)</th>
                        <th className="p-2.5 text-right">Debit / Farokht (+)</th>
                        <th className="p-2.5 text-right">Credit / Vasooli (-)</th>
                        <th className="p-2.5 text-right">Running Udhaar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ledgerData?.transactions?.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center p-6 text-slate-500">
                            Is customer ka abhi koi transaction record nahi hai.
                          </td>
                        </tr>
                      ) : (
                        ledgerData?.transactions?.map((t: any) => (
                          <tr key={t.id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-medium text-slate-700">
                              {new Date(t.date).toLocaleDateString()}
                            </td>
                            <td className="p-2.5 font-semibold text-slate-900">
                              {t.description}
                            </td>
                            <td className="p-2.5 text-right font-bold text-purple-700">
                              {t.debit > 0 ? `Rs ${t.debit.toLocaleString()}` : '—'}
                            </td>
                            <td className="p-2.5 text-right font-bold text-emerald-700">
                              {t.credit > 0 ? `Rs ${t.credit.toLocaleString()}` : '—'}
                            </td>
                            <td className="p-2.5 text-right font-black text-slate-900">
                              Rs {t.runningBalance?.toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-2">
                <button
                  onClick={() => setLedgerModalOpen(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  Khata Band Karein (Close Ledger)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
