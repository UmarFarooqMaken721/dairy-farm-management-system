import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phone = '923001234567'; // Farm contact WhatsApp
  const message = encodeURIComponent('Assalam-o-Alaikum! Mujhe Taaza Doodh aur Dairy Products ke baare mein maloomat chahiye aur order dena hai.');

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group"
      title="Order on WhatsApp"
    >
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>
      <MessageCircle className="w-6 h-6 fill-current" />
      <span className="font-semibold text-sm hidden sm:inline-block">Order on WhatsApp</span>
    </a>
  );
}
