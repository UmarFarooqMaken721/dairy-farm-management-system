import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import { 
  Beef, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  X, 
  Milk
} from 'lucide-react';

interface Animal {
  _id: string;
  tagNumber: string;
  name: string;
  type: 'cow' | 'buffalo';
  breed?: string;
  age?: number;
  purchaseDate?: string;
  status: 'active' | 'sold' | 'dead';
  createdAt: string;
}

export default function AdminAnimals() {
  const { token } = useAuth();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [detailAnimal, setDetailAnimal] = useState<any | null>(null);

  // Form input state
  const [formData, setFormData] = useState({
    tagNumber: '',
    name: '',
    type: 'cow',
    breed: '',
    age: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    status: 'active',
  });

  const fetchAnimals = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE_URL}/api/animals`, {
        headers,
        params: {
          search: search || undefined,
          type: typeFilter !== 'all' ? typeFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        },
      });
      setAnimals(res.data);
    } catch (err: any) {
      toast.error('Error fetching animals');
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, [token, search, typeFilter, statusFilter]);

  const handleOpenAdd = () => {
    setEditingAnimal(null);
    setFormData({
      tagNumber: `TAG-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      type: 'cow',
      breed: '',
      age: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      status: 'active',
    });
    setAddModalOpen(true);
  };

  const handleOpenEdit = (animal: Animal) => {
    setEditingAnimal(animal);
    setFormData({
      tagNumber: animal.tagNumber,
      name: animal.name,
      type: animal.type,
      breed: animal.breed || '',
      age: animal.age ? String(animal.age) : '',
      purchaseDate: animal.purchaseDate ? animal.purchaseDate.split('T')[0] : '',
      status: animal.status,
    });
    setAddModalOpen(true);
  };

  const handleSaveAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = { Authorization: `Bearer ${token}` };

    const payload = {
      tagNumber: formData.tagNumber,
      name: formData.name,
      type: formData.type,
      breed: formData.breed,
      age: formData.age ? Number(formData.age) : undefined,
      purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : undefined,
      status: formData.status,
    };

    try {
      if (editingAnimal) {
        await axios.put(`${API_BASE_URL}/api/animals/${editingAnimal._id}`, payload, { headers });
        toast.success('Janwar ki maloomat update ho gayi!');
      } else {
        await axios.post(`${API_BASE_URL}/api/animals`, payload, { headers });
        toast.success('Naya janwar kamyabi se shamil ho gaya!');
      }
      setAddModalOpen(false);
      fetchAnimals();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Save karne mein masla hua');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Kya aap waqai ${name} ko delete karna chahte hain?`)) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_BASE_URL}/api/animals/${id}`, { headers });
      toast.success('Animal record delete ho gaya');
      fetchAnimals();
    } catch (err: any) {
      toast.error('Delete karne mein masla hua');
    }
  };

  const handleViewDetail = async (id: string) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE_URL}/api/animals/${id}`, { headers });
      setDetailAnimal(res.data);
    } catch (err: any) {
      toast.error('Detail fetch nahi ho saki');
    }
  };

  return (
    <AdminLayout activeTitle="Animals Management (جانوروں کا انتظام)">
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Beef className="w-6 h-6 text-emerald-600" />
              <span>Gaay Aur Bhens Ki Fehrist (Cattle Registry)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Kul Janwar: <span className="font-bold text-slate-800">{animals.length}</span> (Active: {animals.filter(a => a.status === 'active').length})
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer transition"
          >
            <Plus className="w-4 h-4" />
            <span>Naya Janwar Shamil Karein (+ Add Animal)</span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Tag #, Naam ya Breed se talash karein..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Qisam:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="all">Tamam (Gaay + Bhens)</option>
              <option value="cow">Sirf Gaay (Cow)</option>
              <option value="buffalo">Sirf Bhens (Buffalo)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="all">Tamam Status</option>
              <option value="active">Active (Farm Par Mojood)</option>
              <option value="sold">Sold (Farokht Shuda)</option>
              <option value="dead">Dead (Fot Shuda)</option>
            </select>
          </div>
        </div>

        {/* Animals Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6">Tag Number</th>
                  <th className="py-4 px-6">Naam (Name)</th>
                  <th className="py-4 px-6">Qisam (Type)</th>
                  <th className="py-4 px-6">Nasal (Breed)</th>
                  <th className="py-4 px-6">Umar (Age)</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {animals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-500 text-xs">
                      Koi janwar nahi mila. Naya janwar add karein.
                    </td>
                  </tr>
                ) : (
                  animals.map((a) => (
                    <tr key={a._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6 font-mono font-bold text-emerald-800 bg-emerald-50/30">
                        {a.tagNumber}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">{a.name}</td>
                      <td className="py-4 px-6 capitalize">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          a.type === 'cow' ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-900'
                        }`}>
                          <Beef className="w-3.5 h-3.5" />
                          <span>{a.type === 'cow' ? 'Gaay (Cow)' : 'Bhens (Buffalo)'}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium">{a.breed || '—'}</td>
                      <td className="py-4 px-6 text-slate-600">{a.age ? `${a.age} saal` : '—'}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          a.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : a.status === 'sold'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleViewDetail(a._id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Milk History & Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(a)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(a._id, a.name)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
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

        {/* Add/Edit Animal Modal */}
        {addModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">
                  {editingAnimal ? 'Animal Details Edit Karein' : 'Naya Janwar Shamil Karein'}
                </h3>
                <button
                  onClick={() => setAddModalOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSaveAnimal} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tag Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.tagNumber}
                      onChange={(e) => setFormData({ ...formData, tagNumber: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Janwar Ka Naam *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Raani, Soni, Bhooli"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Qisam (Type) *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    >
                      <option value="cow">Gaay (Cow)</option>
                      <option value="buffalo">Bhens (Buffalo)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nasal (Breed)</label>
                    <input
                      type="text"
                      placeholder="e.g. Sahiwal, Friesian, Nili Ravi"
                      value={formData.breed}
                      onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Umar (Saal)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 4"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    >
                      <option value="active">Active (Farm Par Hai)</option>
                      <option value="sold">Sold (Farokht)</option>
                      <option value="dead">Dead (Fot Shuda)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khareed Ki Tareekh (Purchase Date)</label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition"
                  >
                    {editingAnimal ? 'Update Karein' : 'Save Janwar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-5 rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Animal Milk History Detail Modal (AN-05) */}
        {detailAnimal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {detailAnimal.animal.name} ({detailAnimal.animal.tagNumber})
                    </h3>
                    <p className="text-xs text-slate-500">
                      {detailAnimal.animal.type.toUpperCase()} • {detailAnimal.animal.breed || 'Standard'} • Status: {detailAnimal.animal.status}
                    </p>
                  </div>
                  <button
                    onClick={() => setDetailAnimal(null)}
                    className="p-1 rounded-full hover:bg-slate-100"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                {/* Milk Total Card */}
                <div className="my-4 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold">
                      <Milk className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-emerald-800 uppercase">Kul Recorded Doodh Yield</span>
                      <p className="text-2xl font-black text-emerald-950">{detailAnimal.totalMilk} Litres</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200">
                    {detailAnimal.milkRecords.length} Entries
                  </span>
                </div>

                {/* History Table */}
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tareekh-War Doodh Records:
                </h4>
                <div className="overflow-y-auto max-h-60 border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                      <tr>
                        <th className="p-2.5">Tareekh</th>
                        <th className="p-2.5">Subah (L)</th>
                        <th className="p-2.5">Shaam (L)</th>
                        <th className="p-2.5">Kul (Total)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {detailAnimal.milkRecords.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center p-4 text-slate-500">
                            Is janwar ka alag se koi record abhi darj nahi hua.
                          </td>
                        </tr>
                      ) : (
                        detailAnimal.milkRecords.map((rec: any) => (
                          <tr key={rec._id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-medium">{new Date(rec.date).toLocaleDateString()}</td>
                            <td className="p-2.5 text-emerald-700 font-semibold">{rec.morningQty} L</td>
                            <td className="p-2.5 text-emerald-700 font-semibold">{rec.eveningQty} L</td>
                            <td className="p-2.5 font-bold text-slate-900">{rec.morningQty + rec.eveningQty} L</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => setDetailAnimal(null)}
                  className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-slate-800 transition"
                >
                  Band Karein
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
