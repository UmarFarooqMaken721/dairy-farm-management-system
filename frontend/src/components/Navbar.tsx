import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Milk, Menu, X, ShoppingBag, LayoutDashboard, LogOut, LogIn, PhoneCall } from 'lucide-react';

export default function Navbar({ onOpenOrder }: { onOpenOrder?: () => void }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products & Rates', path: '/products' },
    { name: 'Farm Gallery', path: '/gallery' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact & Order', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-emerald-600 group-hover:bg-emerald-700 text-white rounded-2xl flex items-center justify-center shadow-md shadow-emerald-600/20 transition-all">
              <Milk className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition">
                Al-Karam Dairy
              </span>
              <span className="block text-[11px] font-semibold text-emerald-600 tracking-widest uppercase">
                100% Khalis & Fresh
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => {
                if (onOpenOrder) {
                  onOpenOrder();
                } else {
                  nav('/contact#order-form');
                }
              }}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Now</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2.5 rounded-xl transition"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    nav('/');
                  }}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3.5 py-2.5 rounded-xl border border-slate-200/60 transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => {
                if (onOpenOrder) {
                  onOpenOrder();
                } else {
                  nav('/contact#order-form');
                }
              }}
              className="bg-emerald-600 text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-semibold ${
                isActive(link.path)
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenOrder) onOpenOrder();
                else nav('/contact');
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Doodh / Dairy Order Karein</span>
            </button>

            <a
              href="tel:+923001234567"
              className="w-full bg-slate-100 text-slate-800 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
            >
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>Call Farm: 0300-1234567</span>
            </a>

            {user ? (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-slate-900 text-white text-center py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                  <span>Admin Panel</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    nav('/');
                  }}
                  className="bg-red-50 text-red-600 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full border border-slate-300 text-slate-700 text-center py-2.5 rounded-xl font-semibold text-sm"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}