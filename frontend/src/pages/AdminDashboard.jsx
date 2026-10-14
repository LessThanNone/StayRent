import React, { useState, useEffect } from 'react';
import { adminService } from '../services/apiServices';
import { formatRupiah, formatDate } from '../utils/formatters';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Users, Home, Calendar, DollarSign, Shield, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'properties' | 'bookings'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, propsRes, booksRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
        adminService.getProperties(),
        adminService.getBookings(),
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data || []);
      setProperties(propsRes.data.data || []);
      setBookings(booksRes.data.data || []);
    } catch (error) {
      console.error('Failed to load admin data', error);
    } finally {
      setLoading(false);
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
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-4 gap-4 h-28 bg-gray-200 rounded-xl mb-8"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Control Center</h1>
          <p className="text-xs text-gray-500">Kelola pengguna, status iklan sewa, dan pantau performa platform</p>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card className="p-5 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Total Pengguna</span>
            <span className="text-xl font-bold text-gray-900">{stats?.totalUsers || 0}</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Total Properti</span>
            <span className="text-xl font-bold text-gray-900">{stats?.totalProperties || 0}</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Total Transaksi Sewa</span>
            <span className="text-xl font-bold text-gray-900">{stats?.totalBookings || 0}</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Total Nilai Sewa</span>
            <span className="text-lg font-bold text-purple-700">{formatRupiah(stats?.totalRevenue || 0)}</span>
          </div>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-6 text-sm font-semibold border-b-2 ${
            activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
          }`}
        >
          Ringkasan
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-6 text-sm font-semibold border-b-2 ${
            activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
          }`}
        >
          Kelola Pengguna ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('properties')}
          className={`py-3 px-6 text-sm font-semibold border-b-2 ${
            activeTab === 'properties' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
          }`}
        >
          Semua Properti ({properties.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`py-3 px-6 text-sm font-semibold border-b-2 ${
            activeTab === 'bookings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
          }`}
        >
          Semua Booking ({bookings.length})
        </button>
      </div>

      {/* Tab: Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b border-gray-100">
              <tr>
                <th className="p-4">Nama</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role Saat Ini</th>
                <th className="p-4">Ubah Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-900">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold uppercase bg-gray-100 text-gray-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="px-2 py-1 bg-white border border-gray-200 rounded text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="tenant">Tenant</option>
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Properties Management */}
      {activeTab === 'properties' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b border-gray-100">
              <tr>
                <th className="p-4">Judul Properti</th>
                <th className="p-4">Pemilik</th>
                <th className="p-4">Harga</th>
                <th className="p-4">Status</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-900">{p.title}</td>
                  <td className="p-4">{p.owner?.name || '-'}</td>
                  <td className="p-4 font-medium text-blue-600">{formatRupiah(p.price)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${p.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {p.isAvailable ? 'Tersedia' : 'Non-aktif / Booked'}
                    </span>
                  </td>
                  <td className="p-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTogglePropertyStatus(p._id)}
                      className="text-xs"
                    >
                      Toggle Status
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Bookings Overview */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b border-gray-100">
              <tr>
                <th className="p-4">Properti</th>
                <th className="p-4">Penyewa</th>
                <th className="p-4">Pemilik</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-900">{b.property?.title}</td>
                  <td className="p-4">{b.tenant?.name}</td>
                  <td className="p-4">{b.owner?.name}</td>
                  <td className="p-4 font-medium text-blue-600">{formatRupiah(b.totalPrice)}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 uppercase">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Overview Info */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-2">Sistem Monitoring StayRent</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Sebagai Administrator, Anda memiliki akses penuh untuk memantau pendaftaran pengguna, mengubah level role pengguna (Tenant, Owner, Admin), memeriksa kepatuhan iklan properti yang dipasang, serta mengontrol status operasional sistem secara menyeluruh.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
