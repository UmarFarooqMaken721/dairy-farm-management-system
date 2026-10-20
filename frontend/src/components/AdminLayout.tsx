import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Beef, 
  Milk, 
  Wallet, 
  Users, 
  ShoppingBag, 
  BarChart3, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink,
  Calendar,
  Languages
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  activeTitle?: string;
}

export default function AdminLayout({ children, activeTitle }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const nav = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isUrduMode, setIsUrduMode] = useState(() => localStorage.getItem('dairy_urdu_mode') === 'true');

  const toggleLanguage = () => {
    const nextMode = !isUrduMode;
    setIsUrduMode(nextMode);
    localStorage.setItem('dairy_urdu_mode', String(nextMode));
  };

  const navItems = [
    {
      name: isUrduMode ? 'Dashboard (خلاصہ)' : 'Dashboard',
      sub: isUrduMode ? 'Overview' : 'Khulasa & Stats',
      path: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: isUrduMode ? 'Animals (جانور)' : 'Animals Management',
      sub: isUrduMode ? 'Gaay & Bhens' : 'Gaay, Bhens & Records',
      path: '/admin/animals',
      icon: <Beef className="w-5 h-5" />,
    },
    {
      name: isUrduMode ? 'Milk Records (دودھ)' : 'Milk Production',
      sub: isUrduMode ? 'Daily Milk' : 'Subah & Shaam Doodh',
      path: '/admin/milk',
      icon: <Milk className="w-5 h-5" />,
    },
    {
      name: isUrduMode ? 'Expenses (اخراجات)' : 'Farm Expenses',
      sub: isUrduMode ? 'Kharcha' : 'Chara, Dawa, Tankha',
      path: '/admin/expenses',
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      name: isUrduMode ? 'Customers & Khata (کھاتہ)' : 'Customers & Ledger',
      sub: isUrduMode ? 'Udhaar' : 'Grahak, Udhaar & Vasooli',
      path: '/admin/customers',
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: isUrduMode ? 'Orders (آرڈرز)' : 'Website Orders',
      sub: isUrduMode ? 'New Requests' : 'Online Customer Orders',
      path: '/admin/orders',
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      name: isUrduMode ? 'Reports (رپورٹس)' : 'Reports & Analytics',
      sub: isUrduMode ? 'Profit / Loss' : 'Daily, Monthly, Profit/Loss',
      path: '/admin/reports',
      icon: <BarChart3 className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static flex flex-col justify-between border-r border-slate-800 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Farm Brand Header */}
          <div className="h-20 flex items-center justify-between px-6 bg-slate-950/60 border-b border-slate-800">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/30">
                <Milk className="w-6 h-6" />
              </div>
              <div>
                <span className="font-black text-white text-base tracking-tight block">
                  Al-Karam Dairy
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 block tracking-wider uppercase">
                  Farm Admin Panel
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <div className="px-4 py-6 space-y-1.5">
            <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Management Menu
            </p>
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all group ${
                    active
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div
                    className={`${
                      active ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <span className="block leading-none">{item.name}</span>
                    <span
                      className={`text-[10px] font-normal block mt-1 ${
                        active ? 'text-emerald-100' : 'text-slate-500'
                      }`}
                    >
                      {item.sub}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar Bottom Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>Public Website Dekhein</span>
            </span>
            <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded">Live</span>
          </Link>

          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">{user?.name || 'Farm Admin'}</p>
                <p className="text-[10px] text-emerald-400 capitalize">{user?.role || 'Administrator'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {activeTitle || 'Farm Dashboard'}
              </h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Dairy Farm Hisab Kitab, Milk Records, Khata & Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Urdu / English Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
              title="Toggle Roman Urdu / English Labels"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isUrduMode ? 'Urdu Mode: ON' : 'Language: English'}</span>
            </button>

            {/* Date Pill */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>{todayFormatted}</span>
            </div>

            {/* Farm Status Badge */}
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline">Farm Active</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
