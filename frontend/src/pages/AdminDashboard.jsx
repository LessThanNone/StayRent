import React, { useState, useEffect } from 'react';
import { adminService } from '../services/apiServices';
import { formatRupiah, formatDate } from '../utils/formatters';
import Button from '../components/ui/Button';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, ownersRes, propsRes, booksRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
        adminService.getOwners(),
        adminService.getProperties(),
        adminService.getBookings(),
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data || []);
      setOwners(ownersRes.data.data || []);
      setProperties(propsRes.data.data || []);
      setBookings(booksRes.data.data || []);
    } catch (error) {
      console.error('Failed to load admin data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOwnerApproval = async (ownerId) => {
    try {
      await adminService.approveOwner(ownerId);
      fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal mengubah status verifikasi owner');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal mengubah role');
    }
  };

  const handleTogglePropertyStatus = async (propertyId) => {
    try {
      await adminService.togglePropertyStatus(propertyId);
      fetchAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal mengubah status properti');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-xl w-1/4 mb-6"></div>
        <div className="grid grid-cols-4 gap-4 h-28 bg-gray-200 rounded-2xl mb-8"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Top Header — editorial */}
      <div className="mb-10">
        <span className="inline-block text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-500 mb-3">
          Super Administrator
        </span>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-heading leading-heading text-ink mb-2">
          Admin Control Center
        </h1>
        <p className="text-sm text-mutedtext max-w-lg">
          Pantau metrik performa, moderasi akses pengguna, dan tinjau seluruh listing properti.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-hairline mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-6 text-sm font-semibold border-b-2 ${
            activeTab === 'users' ? 'border-brand-700 text-brand-800' : 'border-transparent text-mutedtext'
          }`}
        >
          Kelola Pengguna ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('owners')}
          className={`py-3 px-6 text-sm font-semibold border-b-2 ${
            activeTab === 'owners' ? 'border-brand-700 text-brand-800' : 'border-transparent text-mutedtext'
          }`}
        >
          Verifikasi Owner ({owners.length})
        </button>
        <button
          onClick={() => setActiveTab('properties')}
          className={`py-3 px-6 text-sm font-semibold border-b-2 ${
            activeTab === 'properties' ? 'border-brand-700 text-brand-800' : 'border-transparent text-mutedtext'
          }`}
        >
          Moderasi Properti ({properties.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`py-3 px-6 text-sm font-semibold border-b-2 ${
            activeTab === 'bookings' ? 'border-brand-700 text-brand-800' : 'border-transparent text-mutedtext'
          }`}
        >
          Seluruh Booking ({bookings.length})
        </button>
      </div>

      {/* TAB 1: USERS TABLE */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-hairline shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-surface-warm text-ink uppercase font-bold text-[11px] border-b border-hairline">
                <tr>
                  <th className="p-4">Nama Lengkap</th>
                  <th className="p-4">Email Akun</th>
                  <th className="p-4">Role Saat Ini</th>
                  <th className="p-4">Ganti Peran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4 font-bold text-ink">{u.name}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase bg-brand-50 text-brand-800 border border-brand-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-brand-700 focus:outline-none"
                      >
                        <option value="tenant">Tenant (Penyewa)</option>
                        <option value="owner">Owner (Pemilik)</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: OWNERS APPROVAL TABLE */}
      {activeTab === 'owners' && (
        <div className="bg-white rounded-2xl border border-hairline shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-surface-warm text-ink uppercase font-bold text-[11px] border-b border-hairline">
                <tr>
                  <th className="p-4">Nama Pemilik</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Nomor WhatsApp</th>
                  <th className="p-4">Status Verifikasi</th>
                  <th className="p-4">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {owners.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-mutedtext">
                      Belum ada akun Owner terdaftar.
                    </td>
                  </tr>
                ) : (
                  owners.map((o) => (
                    <tr key={o._id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-4 font-bold text-ink">{o.name}</td>
                      <td className="p-4">{o.email}</td>
                      <td className="p-4 font-medium text-ink">{o.phone || '-'}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                            o.isApproved
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {o.isApproved ? 'Disetujui' : 'Menunggu Persetujuan'}
                        </span>
                      </td>
                      <td className="p-4">
                        <Button
                          size="sm"
                          variant={o.isApproved ? 'outline' : 'primary'}
                          onClick={() => handleToggleOwnerApproval(o._id)}
                          className="text-xs"
                        >
                          {o.isApproved ? 'Cabut Verifikasi' : 'Setujui Akun Owner'}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PROPERTIES TABLE */}
      {activeTab === 'properties' && (
        <div className="bg-white rounded-2xl border border-hairline shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-surface-warm text-ink uppercase font-bold text-[11px] border-b border-hairline">
                <tr>
                  <th className="p-4">Judul Unit</th>
                  <th className="p-4">Pemilik (Host)</th>
                  <th className="p-4">Harga Sewa</th>
                  <th className="p-4">Status Ketersediaan</th>
                  <th className="p-4">Aksi Kontrol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {properties.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4 font-bold text-ink">{p.title}</td>
                    <td className="p-4">{p.owner?.name || '-'}</td>
                    <td className="p-4 font-semibold text-brand-800">{formatRupiah(p.price)}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                          p.isAvailable
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {p.isAvailable ? 'Siap Huni' : 'Dipesan / Nonaktif'}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTogglePropertyStatus(p._id)}
                        className="text-xs"
                      >
                        Ubah Status Unit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BOOKINGS TABLE */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-hairline shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-surface-warm text-ink uppercase font-bold text-[11px] border-b border-hairline">
                <tr>
                  <th className="p-4">Unit Properti</th>
                  <th className="p-4">Penyewa (Tenant)</th>
                  <th className="p-4">Tuan Rumah (Owner)</th>
                  <th className="p-4">Total Biaya</th>
                  <th className="p-4">Status Reservasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4 font-bold text-ink">{b.property?.title}</td>
                    <td className="p-4">{b.tenant?.name}</td>
                    <td className="p-4">{b.owner?.name}</td>
                    <td className="p-4 font-semibold text-brand-800">{formatRupiah(b.totalPrice)}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase ${
                          b.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : b.status === 'rejected'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
