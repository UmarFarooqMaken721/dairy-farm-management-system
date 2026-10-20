import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import { 
  ShoppingBag, 
  Trash2, 
  PhoneCall, 
  MessageCircle, 
  Filter, 
  MapPin 
} from 'lucide-react';

interface Order {
  _id: string;
  customerName: string;
  phone: string;
  address: string;
  product: string;
  quantity: number;
  unit: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE_URL}/api/orders`, {
        headers,
        params: { status: statusFilter !== 'all' ? statusFilter : undefined },
      });
      setOrders(res.data);
    } catch (err) {
      toast.error('Orders fetch nahi ho sake');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, statusFilter]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`${API_BASE_URL}/api/orders/${id}`, { status }, { headers });
      toast.success(`Order status update ho kar "${status}" ho gaya!`);
      fetchOrders();
    } catch (err) {
      toast.error('Status update karne mein masla');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!window.confirm('Kya aap yeh order delete karna chahte hain?')) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_BASE_URL}/api/orders/${id}`, { headers });
      toast.success('Order delete ho gaya');
      fetchOrders();
    } catch (err) {
      toast.error('Delete nahi ho saka');
    }
  };

  const openWhatsAppToCustomer = (o: Order) => {
    const waText = encodeURIComponent(
      `Assalam-o-Alaikum ${o.customerName} Sahab!\n` +
      `Al-Karam Dairy Farm se rabta kiya ja raha hai.\n` +
      `Aapka order baraye "${o.product} (${o.quantity} ${o.unit})" hum ne receive kar liya hai aur confirm ho chuka hai.\n` +
      `Kul Bill: Rs ${o.totalAmount.toLocaleString()}\n` +
      `Delivery Rider jald hi aapke pate (${o.address}) par pohanch jayega. Shukriya!`
    );
    // Strip non-digits and leading 0 for international format
    let cleanPhone = o.phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '92' + cleanPhone.slice(1);
    }
    window.open(`https://wa.me/${cleanPhone}?text=${waText}`, '_blank');
  };

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const confirmedCount = orders.filter((o) => o.status === 'confirmed').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  return (
    <AdminLayout activeTitle="Online Customer Orders (آن لائن آرڈرز)">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-amber-600" />
              <span>Website Customer Orders (آن لائن وصول شدہ آرڈرز)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Public website se anay walay orders, address aur delivery status
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
              Pending: {pendingCount}
            </span>
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200">
              Confirmed: {confirmedCount}
            </span>
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
              Delivered: {deliveredCount}
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Status:</span>
          </span>
          {['all', 'pending', 'confirmed', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6">Customer & Phone</th>
                  <th className="py-4 px-6">Product & Qty</th>
                  <th className="py-4 px-6">Delivery Address</th>
                  <th className="py-4 px-6">Amount (Bill)</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Quick Contact & Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500 text-xs">
                      Koi order nahi mila. Website par order form submit hone par yahan show hoga.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-900 text-sm">{o.customerName}</p>
                        <p className="text-slate-500 font-mono text-[11px] mt-0.5">{o.phone}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          {new Date(o.createdAt).toLocaleString()}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 block text-xs">{o.product}</span>
                        <span className="text-emerald-700 font-black text-sm">
                          {o.quantity} {o.unit}
                        </span>
                        {o.notes && (
                          <span className="text-[10px] text-slate-500 block italic mt-1 max-w-xs">
                            {o.notes}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-slate-600 max-w-xs font-medium">
                        <div className="flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{o.address}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-black text-emerald-700 text-sm">
                        Rs {o.totalAmount.toLocaleString()}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            o.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : o.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : o.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* Direct WhatsApp Customer */}
                          <button
                            onClick={() => openWhatsAppToCustomer(o)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                            title="WhatsApp Customer"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>

                          {/* Direct Call Customer */}
                          <a
                            href={`tel:${o.phone}`}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition"
                            title="Call Customer"
                          >
                            <PhoneCall className="w-4 h-4" />
                          </a>

                          {/* Status buttons */}
                          {o.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(o._id, 'confirmed')}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[10px] transition"
                            >
                              Confirm
                            </button>
                          )}

                          {o.status === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(o._id, 'delivered')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition"
                            >
                              Delivered
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteOrder(o._id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Order"
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
      </div>
    </AdminLayout>
  );
}
