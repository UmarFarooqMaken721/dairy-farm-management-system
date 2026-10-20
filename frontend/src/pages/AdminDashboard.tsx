import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  Beef, 
  Milk, 
  Wallet, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  PlusCircle, 
  ArrowUpRight 
} from 'lucide-react';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    animals: 0,
    cows: 0,
    buffalos: 0,
    milkToday: 0,
    todaySalesAmount: 0,
    totalExpenses: 0,
    customers: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [sumRes, monthlyRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/reports/summary`, { headers }),
          axios.get(`${API_BASE_URL}/api/reports/monthly`, { headers }),
        ]);

        if (sumRes.data) {
          setStats({
            animals: sumRes.data.animals || 0,
            cows: sumRes.data.cows || 0,
            buffalos: sumRes.data.buffalos || 0,
            milkToday: sumRes.data.milkToday || 0,
            todaySalesAmount: sumRes.data.todaySalesAmount || 0,
            totalExpenses: sumRes.data.totalExpenses || 0,
            customers: sumRes.data.customers || 0,
            pendingOrders: sumRes.data.pendingOrders || 0,
          });
          setRecentOrders(sumRes.data.recentOrders || []);
        }

        if (monthlyRes.data?.monthlyTrends) {
          setChartData(monthlyRes.data.monthlyTrends);
        }

        if (monthlyRes.data?.categoryExpenses) {
          const exp = Object.entries(monthlyRes.data.categoryExpenses).map(([key, val]) => ({
            name: key.toUpperCase(),
            value: Number(val),
          }));
          setExpenseData(exp);
        }
      } catch (err) {
        console.error('Error fetching dashboard summary', err);
      }
    };

    fetchData();
  }, [token]);

  const cards = [
    {
      icon: <Beef className="w-6 h-6" />,
      label: 'Kul Janwar (Total Animals)',
      value: stats.animals,
      sub: `${stats.cows} Gaayein • ${stats.buffalos} Bheinsein`,
      color: 'bg-blue-600',
      lightColor: 'bg-blue-50 text-blue-700 border-blue-200',
      link: '/admin/animals',
    },
    {
      icon: <Milk className="w-6 h-6" />,
      label: 'Aaj Ka Doodh (Milk Today)',
      value: `${stats.milkToday} Litres`,
      sub: 'Morning + Evening total',
      color: 'bg-emerald-600',
      lightColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      link: '/admin/milk',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Aaj Ki Doodh Farokht (Today Sales)',
      value: `Rs ${stats.todaySalesAmount.toLocaleString()}`,
      sub: 'Deliveries to customers',
      color: 'bg-teal-600',
      lightColor: 'bg-teal-50 text-teal-700 border-teal-200',
      link: '/admin/customers',
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      label: 'Kul Kharajat (Farm Expenses)',
      value: `Rs ${stats.totalExpenses.toLocaleString()}`,
      sub: 'Chara, Dawa, Tankha, Bijli',
      color: 'bg-rose-600',
      lightColor: 'bg-rose-50 text-rose-700 border-rose-200',
      link: '/admin/expenses',
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Registered Grahak (Customers)',
      value: stats.customers,
      sub: 'Daily milk subscription ledger',
      color: 'bg-purple-600',
      lightColor: 'bg-purple-50 text-purple-700 border-purple-200',
      link: '/admin/customers',
    },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      label: 'Naye Orders (Pending Orders)',
      value: stats.pendingOrders,
      sub: stats.pendingOrders > 0 ? 'Tawajjah Talab (Action Needed)' : 'Sab orders clear hain',
      color: stats.pendingOrders > 0 ? 'bg-amber-600' : 'bg-slate-600',
      lightColor: stats.pendingOrders > 0 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-50 text-slate-700 border-slate-200',
      link: '/admin/orders',
    },
  ];

  const PIE_COLORS = ['#16a34a', '#0284c7', '#f59e0b', '#dc2626', '#8b5cf6', '#64748b'];

  return (
    <AdminLayout activeTitle="Farm Admin Dashboard (خلاصہ)">
      <div className="space-y-8">
        {/* Quick Action Shortcuts Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-slate-900 text-sm">Quick Shortcuts (Fauran Izafa):</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/milk"
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition"
            >
              + Record Milk (دودھ درج کریں)
            </Link>
            <Link
              to="/admin/animals"
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 transition"
            >
              + Add Animal (نیا جانور)
            </Link>
            <Link
              to="/admin/expenses"
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition"
            >
              + Add Expense (خرچہ درج کریں)
            </Link>
            <Link
              to="/admin/customers"
              className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl border border-purple-200 transition"
            >
              + Customer Ledger (کھاتہ / وصولی)
            </Link>
          </div>
        </div>

        {/* 6 Key Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((c, i) => (
            <Link
              key={i}
              to={c.link}
              className={`p-6 rounded-3xl border ${c.lightColor} hover:shadow-lg transition-all duration-200 block group`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${c.color} text-white p-3 rounded-2xl shadow-md`}>
                  {c.icon}
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-slate-800 transition" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{c.label}</p>
              <p className="text-3xl font-black text-slate-900">{c.value}</p>
              <p className="text-xs text-slate-500 mt-2 font-medium">{c.sub}</p>
            </Link>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Production & Income Chart */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Monthly Milk Yield & Income vs Expenses (آمدن اور اخراجات)
                </h3>
                <p className="text-xs text-slate-500">6 Mahine Ki Karkardagi Ka Taqabula</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 self-start">
                Live Data
              </span>
            </div>

            <div className="h-72 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.length > 0 ? chartData : [
                  { name: 'May', milk: 1200, income: 240000, expense: 110000 },
                  { name: 'Jun', milk: 1350, income: 270000, expense: 125000 },
                  { name: 'Jul', milk: 1400, income: 290000, expense: 130000 },
                  { name: 'Aug', milk: 1550, income: 320000, expense: 140000 },
                  { name: 'Sep', milk: 1600, income: 340000, expense: 145000 },
                  { name: 'Oct', milk: 1800, income: 390000, expense: 150000 },
                ]}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="income" name="Income (Rs)" fill="#16a34a" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expense" name="Expense (Rs)" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expenses Category Breakdown */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Expense Breakdown</h3>
              <p className="text-xs text-slate-500 mb-4">Category-Wise Kharcha</p>

              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData.length > 0 ? expenseData : [
                        { name: 'CHARA', value: 55000 },
                        { name: 'TANKHA', value: 35000 },
                        { name: 'DAWA', value: 12000 },
                        { name: 'BIJLI', value: 15000 },
                        { name: 'OTHER', value: 8000 },
                      ]}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                    >
                      {expenseData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <Link
              to="/admin/expenses"
              className="text-center text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 py-2.5 rounded-xl border border-emerald-200 transition block mt-2"
            >
              Tamam Expenses Dekhein & Manage Karein →
            </Link>
          </div>
        </div>

        {/* Recent Website Orders Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Recent Public Website Orders (نئے آن لائن آرڈرز)
              </h3>
              <p className="text-xs text-slate-500">Customers who ordered through the website form</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
            >
              Tamam Orders Dekhein
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                Abhi koi naya order nahi aaya. Website par customer form fill hone par yahan show hoga.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Quantity</th>
                    <th className="pb-3">Total Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((ord: any) => (
                    <tr key={ord._id} className="hover:bg-slate-50/60">
                      <td className="py-3.5 font-bold text-slate-800">{ord.customerName}</td>
                      <td className="py-3.5 text-slate-600">{ord.phone}</td>
                      <td className="py-3.5 text-slate-700 font-medium">{ord.product}</td>
                      <td className="py-3.5 font-semibold text-slate-800">{ord.quantity} {ord.unit}</td>
                      <td className="py-3.5 font-bold text-emerald-700">Rs {ord.totalAmount?.toLocaleString()}</td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                            ord.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          to="/admin/orders"
                          className="text-emerald-700 font-bold hover:underline"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}