import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  BarChart3, 
  Printer, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Calendar 
} from 'lucide-react';

export default function AdminReports() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly' | 'profit' | 'customers'>('daily');

  // Daily Report State
  const [dailyDate, setDailyDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyData, setDailyData] = useState<any | null>(null);

  // Monthly Report State
  const [monthlyData, setMonthlyData] = useState<any | null>(null);

  // Profit / Loss State
  const [profitLossData, setProfitLossData] = useState<any | null>(null);

  // Customer Udhaar State
  const [customerReport, setCustomerReport] = useState<any | null>(null);

  const fetchDaily = async (d: string) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE_URL}/api/reports/daily?date=${d}`, { headers });
      setDailyData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReports = async () => {
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [mRes, pRes, cRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/reports/monthly`, { headers }),
        axios.get(`${API_BASE_URL}/api/reports/profit`, { headers }),
        axios.get(`${API_BASE_URL}/api/reports/customers`, { headers }),
      ]);
      setMonthlyData(mRes.data);
      setProfitLossData(pRes.data);
      setCustomerReport(cRes.data);
      await fetchDaily(dailyDate);
    } catch (err) {
      toast.error('Reports load karne mein masla hua');
    }
  };

  useEffect(() => {
    fetchReports();
  }, [token]);

  const handleDailyDateChange = (d: string) => {
    setDailyDate(d);
    fetchDaily(d);
  };

  const handlePrint = () => {
    window.print();
  };

  // CSV Export for university report / records (SRS R-04)
  const handleExportCSV = () => {
    if (activeTab === 'customers' && customerReport?.allCustomers) {
      const headers = 'Name,Phone,Address,Balance (Udhaar)\n';
      const rows = customerReport.allCustomers
        .map((c: any) => `"${c.name}","${c.phone}","${c.address || ''}",${c.balance}`)
        .join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dairy_farm_customers_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      toast.success('Customer report CSV download ho gaya!');
    } else if (activeTab === 'monthly' && monthlyData?.monthlyTrends) {
      const headers = 'Month,Milk Liters,Income Rs,Expense Rs,Profit Rs\n';
      const rows = monthlyData.monthlyTrends
        .map((m: any) => `"${m.name}",${m.milk},${m.income},${m.expense},${m.profit}`)
        .join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dairy_farm_monthly_trend_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      toast.success('Monthly trend CSV download ho gaya!');
    } else {
      toast('Print / PDF format use karein for printable view');
      window.print();
    }
  };

  return (
    <AdminLayout activeTitle="Reports & Analytics (رپورٹس اور کھاتہ خلاصہ)">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-emerald-600" />
              <span>Dairy Farm Maliati Reports (Financial Statements)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Daily, Monthly, Profit/Loss aur Customer Udhaar Statements
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF Report</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV (Excel)</span>
            </button>
          </div>
        </div>

        {/* Report Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'daily'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Rozana Report (Daily Summary)
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'monthly'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Mahana Report (Monthly & Trends)
          </button>
          <button
            onClick={() => setActiveTab('profit')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'profit'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Nafa / Nuqsan (Profit & Loss)
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Customer Udhaar Report (مارکیٹ بقایا جات)
          </button>
        </div>

        {/* TAB 1: DAILY REPORT */}
        {activeTab === 'daily' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-700">Tareekh Muntakhib Karein:</span>
              </div>
              <input
                type="date"
                value={dailyDate}
                onChange={(e) => handleDailyDateChange(e.target.value)}
                className="border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold bg-slate-50 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl">
                <span className="text-xs font-bold text-emerald-800 uppercase block">Aaj Ka Milk Collected</span>
                <span className="text-2xl font-black text-emerald-950 mt-1 block">
                  {dailyData?.totalMilkCollected || 0} Litres
                </span>
                <span className="text-[11px] text-emerald-700 mt-1 block">
                  Morning: {dailyData?.totalMilkMorning || 0} L • Evening: {dailyData?.totalMilkEvening || 0} L
                </span>
              </div>

              <div className="bg-teal-50 border border-teal-200 p-5 rounded-2xl">
                <span className="text-xs font-bold text-teal-800 uppercase block">Aaj Ki Farokht (Sales)</span>
                <span className="text-2xl font-black text-teal-950 mt-1 block">
                  Rs {dailyData?.totalSalesAmount?.toLocaleString() || 0}
                </span>
                <span className="text-[11px] text-teal-700 mt-1 block">Customer milk deliveries</span>
              </div>

              <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl">
                <span className="text-xs font-bold text-rose-800 uppercase block">Aaj Ka Kharcha (Expense)</span>
                <span className="text-2xl font-black text-rose-950 mt-1 block">
                  Rs {dailyData?.totalExpensesAmount?.toLocaleString() || 0}
                </span>
                <span className="text-[11px] text-rose-700 mt-1 block">Chara, dawa, farm expense</span>
              </div>

              <div className={`p-5 rounded-2xl border ${
                (dailyData?.netProfit || 0) >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
              }`}>
                <span className="text-xs font-bold uppercase block text-slate-600">Net Profit / Loss (صافی بچت)</span>
                <span className={`text-2xl font-black mt-1 block ${
                  (dailyData?.netProfit || 0) >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  Rs {dailyData?.netProfit?.toLocaleString() || 0}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">Sales minus Expenses</span>
              </div>
            </div>

            {/* Daily Detailed Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Sales */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span>Aaj Ki Doodh Deliveries (Sales)</span>
                </h3>
                <div className="overflow-y-auto max-h-56">
                  {dailyData?.sales?.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">Is din koi sale entry darj nahi hui.</p>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-semibold">
                        <tr>
                          <th className="p-2">Customer</th>
                          <th className="p-2">Qty</th>
                          <th className="p-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {dailyData?.sales?.map((s: any) => (
                          <tr key={s._id}>
                            <td className="p-2 font-bold">{s.customer?.name || 'Customer'}</td>
                            <td className="p-2">{s.milkQty} L</td>
                            <td className="p-2 text-right font-bold text-emerald-700">Rs {s.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Daily Expenses */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-rose-600" />
                  <span>Aaj Ke Kharajat (Expenses)</span>
                </h3>
                <div className="overflow-y-auto max-h-56">
                  {dailyData?.expenses?.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">Is din koi kharcha record nahi hua.</p>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-semibold">
                        <tr>
                          <th className="p-2">Category</th>
                          <th className="p-2">Note</th>
                          <th className="p-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {dailyData?.expenses?.map((e: any) => (
                          <tr key={e._id}>
                            <td className="p-2 font-bold uppercase">{e.category}</td>
                            <td className="p-2 text-slate-500">{e.note || '—'}</td>
                            <td className="p-2 text-right font-bold text-rose-600">Rs {e.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MONTHLY REPORT */}
        {activeTab === 'monthly' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase block">Current Month Milk Production</span>
                <span className="text-2xl font-black text-emerald-700 mt-1 block">
                  {monthlyData?.totalMilk?.toLocaleString() || 0} Litres
                </span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase block">Current Month Total Sales</span>
                <span className="text-2xl font-black text-teal-700 mt-1 block">
                  Rs {monthlyData?.totalSales?.toLocaleString() || 0}
                </span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase block">Current Month Net Margin</span>
                <span className="text-2xl font-black text-emerald-950 mt-1 block">
                  Rs {monthlyData?.netProfit?.toLocaleString() || 0}
                </span>
              </div>
            </div>

            {/* 6 Months Bar Chart */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-1">
                6-Month Trend (Income vs Expenses vs Milk Yield)
              </h3>
              <p className="text-xs text-slate-500 mb-6">Historical Comparative Financial Flow</p>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData?.monthlyTrends || []}>
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Bar dataKey="income" name="Sales Income (Rs)" fill="#16a34a" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="expense" name="Expenses (Rs)" fill="#ef4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROFIT / LOSS STATEMENT */}
        {activeTab === 'profit' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Overall Profit & Loss Statement (نفع و نقصان گوشوارہ)
              </h3>
              <p className="text-xs text-slate-500">Farm All-time Revenue vs Farm All-time Expenses</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl">
                <span className="text-xs font-bold text-emerald-800 uppercase block">Gross Income (آمدن)</span>
                <span className="text-3xl font-black text-emerald-950 mt-2 block">
                  Rs {profitLossData?.totalIncome?.toLocaleString() || 0}
                </span>
                <span className="text-xs text-emerald-700 mt-2 block">Tamam Doodh Sales</span>
              </div>

              <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl">
                <span className="text-xs font-bold text-rose-800 uppercase block">Total Expenses (اخراجات)</span>
                <span className="text-3xl font-black text-rose-950 mt-2 block">
                  Rs {profitLossData?.totalExpenses?.toLocaleString() || 0}
                </span>
                <span className="text-xs text-rose-700 mt-2 block">Chara, Tankha, Dawa, Bijli</span>
              </div>

              <div className="bg-teal-50 border border-teal-200 p-6 rounded-2xl">
                <span className="text-xs font-bold text-teal-800 uppercase block">Net Farm Profit (خالص بچت)</span>
                <span className="text-3xl font-black text-teal-950 mt-2 block">
                  Rs {profitLossData?.netProfit?.toLocaleString() || 0}
                </span>
                <span className="text-xs text-teal-700 mt-2 block">
                  Profit Margin: {profitLossData?.profitMargin}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMER UDHAAR REPORT */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Market Wajib-ul-Ada Udhaar Report (گاہکوں کے بقایا جات)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customers with pending ledger balances
                </p>
              </div>

              <div className="bg-rose-50 text-rose-800 border border-rose-200 px-4 py-2 rounded-xl text-xs font-bold">
                Kul Baqi Raqam: Rs {customerReport?.totalPendingReceivables?.toLocaleString() || 0} ({customerReport?.debtorCount} Grahak)
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                  <tr>
                    <th className="py-4 px-6">Customer Naam</th>
                    <th className="py-4 px-6">Phone Number</th>
                    <th className="py-4 px-6">Address</th>
                    <th className="py-4 px-6 text-right">Udhaar Baqi (Pending Balance)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customerReport?.debtors?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-emerald-600 font-bold">
                        MashAllah! Kisi customer ka koi udhaar baqi nahi hai. Sab hisab clear hai.
                      </td>
                    </tr>
                  ) : (
                    customerReport?.debtors?.map((c: any) => (
                      <tr key={c._id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-6 font-bold text-slate-900">{c.name}</td>
                        <td className="py-3.5 px-6 text-slate-600 font-mono">{c.phone}</td>
                        <td className="py-3.5 px-6 text-slate-500">{c.address || '—'}</td>
                        <td className="py-3.5 px-6 text-right font-black text-rose-600 text-sm">
                          Rs {c.balance.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
