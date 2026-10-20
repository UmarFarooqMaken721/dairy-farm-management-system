import { Link } from 'react-router-dom';
import { Milk, Phone, MapPin, Clock, ShieldCheck, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
        {/* Brand & Mission */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-emerald-600 text-white p-2 rounded-xl">
              <Milk className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Al-Karam Dairy Farm</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Seedha hamare certified farm se aapke dastar-khwan tak. 100% khalis, fresh aur chemical-free gaay aur bhens ka doodh aur desi makhan, ghee aur dahi.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
            <ShieldCheck className="w-5 h-5" />
            <span>100% Khalis Ki Guarantee (No Water Added)</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-base mb-4 tracking-wide uppercase">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/" className="hover:text-emerald-400 transition-colors">Home Page (Ghar)</Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-emerald-400 transition-colors">Products & Rates (Doodh, Ghee, Makhan)</Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-emerald-400 transition-colors">Farm Gallery (Hamara Farm & Janwar)</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-emerald-400 transition-colors">About Us (Hamari Kahani)</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact & Order (Rabta Karein)</Link>
            </li>
            <li>
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">Admin Portal Login</Link>
            </li>
          </ul>
        </div>

        {/* Timings */}
        <div>
          <h4 className="text-white font-semibold text-base mb-4 tracking-wide uppercase">Farm Timings</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-slate-200 font-medium">Morning Delivery Shift</p>
                <p className="text-xs">05:30 AM – 09:00 AM (Rozana)</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-slate-200 font-medium">Evening Delivery Shift</p>
                <p className="text-xs">04:30 PM – 08:30 PM (Rozana)</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-slate-200 font-medium">Farm Visit Hours</p>
                <p className="text-xs">09:00 AM – 05:00 PM (Weekly Welcome)</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-white font-semibold text-base mb-4 tracking-wide uppercase">Farm Address & Contact</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
              <span>Chak No. 45-RB, Dairy Farm Road, Faisalabad / Lahore, Punjab</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>+92 300 1234567 / +92 321 7654321</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>orders@alkaramdairy.pk</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} Al-Karam Dairy Farm Management System. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Designed for Modern Farm Management & Pure Customer Deliveries
        </p>
      </div>
    </footer>
  );
}
