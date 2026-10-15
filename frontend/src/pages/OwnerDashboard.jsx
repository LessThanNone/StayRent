import React, { useState, useEffect } from 'react';
import { propertyService, bookingService } from '../services/apiServices';
import { formatRupiah, formatDate } from '../utils/formatters';
import { AMENITIES_LIST, RULES_LIST, PROPERTY_TYPES } from '../utils/constants';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import {
  Plus,
  Calendar,
  Check,
  X,
  Trash2,
  AlertCircle,
  Building,
  User,
  Phone,
  Eye,
  ShieldCheck,
  Clock,
  Mail,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'bookings' | 'add'
  const [myProperties, setMyProperties] = useState([]);
  const [incomingBookings, setIncomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State for Adding Property
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    pricePeriod: 'monthly',
    propertyType: 'Kost',
    street: '',
    city: '',
    province: '',
    bedrooms: 1,
    bathrooms: 1,
    area: '',
  });
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [propRes, bookRes] = await Promise.all([
        propertyService.getOwnerProperties(),
        bookingService.getOwnerBookings(),
      ]);
      setMyProperties(propRes.data.data || []);
      setIncomingBookings(bookRes.data.data || []);
    } catch (error) {
      console.error('Error fetching owner data', error);
    } finally {
      setLoading(false);
    }
  };

  const [bookingActionError, setBookingActionError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleBookingAction = async (bookingId, status) => {
    setBookingActionError('');
    try {
      await bookingService.updateBookingStatus(bookingId, status);
      loadData();
    } catch (error) {
      setBookingActionError(error.response?.data?.message || 'Gagal mengubah status sewa');
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      await propertyService.deleteProperty(propertyId);
      setDeleteTarget(null);
      loadData();
    } catch (error) {
      setDeleteTarget(null);
      console.error(error.response?.data?.message || 'Gagal menghapus properti');
    }
  };

  const toggleAmenity = (name) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const toggleRule = (name) => {
    setSelectedRules((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('pricePeriod', formData.pricePeriod);
      data.append('propertyType', formData.propertyType);
      data.append('bedrooms', formData.bedrooms);
      data.append('bathrooms', formData.bathrooms);
      if (formData.area) data.append('area', formData.area);

      data.append(
        'address',
        JSON.stringify({
          street: formData.street,
          city: formData.city,
          province: formData.province,
        })
      );
      data.append('amenities', JSON.stringify(selectedAmenities));
      data.append('rules', JSON.stringify(selectedRules));

      for (let i = 0; i < imageFiles.length; i++) {
        data.append('images', imageFiles[i]);
      }

      await propertyService.createProperty(data);
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        pricePeriod: 'monthly',
        propertyType: 'Kost',
        street: '',
        city: '',
        province: '',
        bedrooms: 1,
        bathrooms: 1,
        area: '',
      });
      setSelectedAmenities([]);
      setSelectedRules([]);
      setImageFiles([]);
      setActiveTab('listings');
      loadData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Gagal menambahkan properti');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingCount = incomingBookings.filter((b) => b.status === 'pending').length;

  return (
    <>
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-10 p-2 bg-white/60 ring-1 ring-rose-100/60 rounded-[1.5rem] w-full max-w-sm shadow-rukita-lg">
            <div className="bg-white rounded-[1.125rem] p-6" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.95)' }}>
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-5 h-5 text-rose-500 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-semibold text-ink text-center tracking-snug mb-1">Hapus iklan ini?</h3>
              <p className="text-sm text-mutedtext text-center mb-6 leading-relaxed">
                Data yang dihapus tidak dapat dipulihkan. Semua informasi properti ini akan hilang permanen.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-ink border border-hairline rounded-xl hover:bg-gray-50 transition-colors">
                  Batal
                </button>
                <button onClick={() => handleDeleteProperty(deleteTarget)} className="flex-1 py-2.5 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors">
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header — double-bezel profile card */}
      <div className="p-2 bg-brand-50/40 ring-1 ring-brand-100/60 rounded-[1.75rem] mb-10">
        <div
          className="bg-white rounded-[1.375rem] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9)' }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-1 bg-brand-100/60 ring-1 ring-brand-200/40 rounded-2xl flex-shrink-0">
              <div className="w-14 h-14 rounded-[0.875rem] bg-brand-500 text-white flex items-center justify-center font-semibold text-2xl shadow-btn">
                {user?.name?.charAt(0) || 'O'}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-semibold tracking-snug text-ink">{user?.name}</h1>
                <span className="text-[10px] uppercase tracking-[0.15em] font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-600 border border-brand-100">
                  Pemilik Properti
                </span>
                {user?.isApproved ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" />
                    Terverifikasi
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    <Clock className="w-3 h-3" />
                    Menunggu Verifikasi
                  </span>
                )}
              </div>
              <p className="text-sm text-mutedtext mt-1">
                {user?.email} · {user?.phone || 'Nomor HP belum diatur'}
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => {
              if (!user?.isApproved) return;
              setActiveTab('add');
            }}
            className={`flex-shrink-0 ${!user?.isApproved ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!user?.isApproved}
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[2]" />
            Pasang Iklan Baru
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-hairline mb-8">
        <button
          onClick={() => setActiveTab('listings')}
          className={`py-3.5 px-6 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-all ${
            activeTab === 'listings'
              ? 'border-brand-700 text-brand-800'
              : 'border-transparent text-mutedtext hover:text-ink'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Daftar Properti ({myProperties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`py-3.5 px-6 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-all ${
            activeTab === 'bookings'
              ? 'border-brand-700 text-brand-800'
              : 'border-transparent text-mutedtext hover:text-ink'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Pengajuan Masuk ({incomingBookings.length})</span>
          {pendingCount > 0 && (
            <span className="ml-1 px-2 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
              {pendingCount} baru
            </span>
          )}
        </button>

        <button
          onClick={() => user?.isApproved && setActiveTab('add')}
          disabled={!user?.isApproved}
          className={`py-3.5 px-6 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-all ${
            activeTab === 'add'
              ? 'border-brand-700 text-brand-800'
              : 'border-transparent text-mutedtext hover:text-ink'
          } ${!user?.isApproved ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <Plus className="w-4 h-4" />
          <span>Formulir Tambah Properti</span>
        </button>
      </div>

      {/* TAB 1: LISTINGS */}
      {activeTab === 'listings' && (
        <div>
          {myProperties.length === 0 ? (
            <div className="bg-surface-warm rounded-3xl border border-hairline p-12 text-center max-w-md mx-auto">
              <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-ink">Belum Ada Properti yang Diiklankan</h3>
              <p className="text-xs text-mutedtext mt-1 mb-6">
                Mulai pasang iklan kost atau rumah kontrakan Anda untuk mendapatkan penyewa sekarang.
              </p>
              <Button variant="primary" size="sm" onClick={() => setActiveTab('add')}>
                Mulai Pasang Iklan
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myProperties.map((prop) => (
                <div
                  key={prop._id}
                  className="bg-white rounded-2xl border border-hairline overflow-hidden hover:shadow-airbnb transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/9] bg-gray-100">
                    <img
                      src={
                        prop.images && prop.images.length > 0
                          ? prop.images[0]
                          : 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={prop.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase">
                      {prop.propertyType}
                    </span>
                    <span
                      className={`absolute bottom-2.5 left-2.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                        prop.isAvailable ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {prop.isAvailable ? 'Siap Huni' : 'Dipesan'}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-ink text-sm line-clamp-1">{prop.title}</h3>
                      <p className="text-xs text-mutedtext mt-0.5">{prop.address?.city}</p>
                      <p className="text-sm font-bold text-brand-800 mt-2">
                        {formatRupiah(prop.price)}/{prop.pricePeriod === 'monthly' ? 'bulan' : 'tahun'}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Link
                          to={`/properties/${prop._id}`}
                          className="text-xs font-semibold text-brand-700 hover:text-brand-900 inline-flex items-center"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>Lihat</span>
                        </Link>
                        <Link
                          to={`/owner/property/edit/${prop._id}`}
                          className="text-xs font-semibold text-gray-600 hover:text-brand-700 inline-flex items-center"
                        >
                          <span>Edit</span>
                        </Link>
                      </div>

                      <button
                        onClick={() => setDeleteTarget(prop._id)}
                        className="text-xs text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Hapus Iklan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookingActionError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 stroke-[1.5]" />
              <span>{bookingActionError}</span>
            </div>
          )}
          {incomingBookings.length === 0 ? (
            <div className="bg-surface-warm rounded-3xl border border-hairline p-12 text-center max-w-md mx-auto">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-ink">Belum Ada Pengajuan Masuk</h3>
              <p className="text-xs text-mutedtext mt-1">
                Permohonan sewa dari calon penyewa akan muncul di sini untuk Anda setujui atau tolak.
              </p>
            </div>
          ) : (
            incomingBookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-2xl border border-hairline p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 shadow-sm"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full uppercase">
                      ID: #{b._id.slice(-6)}
                    </span>
                    <span className="text-xs text-mutedtext font-medium">
                      Diajukan {formatDate(b.createdAt)}
                    </span>
                  </div>

                  <h4 className="font-bold text-ink text-base mt-1">{b.property?.title}</h4>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-mutedtext mt-2">
                    <span className="flex items-center text-ink font-semibold">
                      <User className="w-3.5 h-3.5 mr-1 text-brand-700" />
                      {b.tenant?.name}
                    </span>
                    <span className="flex items-center">
                      <Phone className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      {b.tenant?.phone || b.tenant?.email}
                    </span>
                    <span>
                      {formatDate(b.startDate)} – {formatDate(b.endDate)}
                    </span>
                    <span>
                      Total: <strong className="text-brand-800">{formatRupiah(b.totalPrice)}</strong>
                    </span>
                  </div>

                  {b.notes && (
                    <p className="text-xs text-mutedtext italic mt-2 bg-gray-50 p-2 rounded-lg inline-block">
                      Catatan penyewa: "{b.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${
                      b.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : b.status === 'rejected'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {b.status}
                  </span>

                  {b.status === 'pending' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleBookingAction(b._id, 'approved')}
                        className="inline-flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Setujui</span>
                      </button>
                      <button
                        onClick={() => handleBookingAction(b._id, 'rejected')}
                        className="inline-flex items-center space-x-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Tolak</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: ADD PROPERTY FORM */}
      {activeTab === 'add' && !user?.isApproved && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 max-w-2xl mx-auto text-center">
          <Clock className="w-10 h-10 text-amber-500 mx-auto mb-3 stroke-[1.5]" />
          <h3 className="text-base font-bold text-amber-900 mb-1">Akun Belum Terverifikasi</h3>
          <p className="text-sm text-amber-700">
            Akun Anda sedang dalam proses verifikasi oleh Admin. Setelah disetujui, Anda dapat mulai memasang iklan properti.
          </p>
        </div>
      )}
      {activeTab === 'add' && user?.isApproved && (
        <div className="bg-white rounded-3xl border border-hairline p-6 md:p-10 max-w-3xl shadow-sm">
          <h2 className="text-xl font-bold text-ink mb-1">Pasang Iklan Properti Baru</h2>
          <p className="text-xs text-mutedtext mb-6">
            Lengkapi detail hunian agar calon penyewa dapat menemukan informasi yang akurat dan lengkap
          </p>

          {formError && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleCreateProperty} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Judul Iklan Properti
              </label>
              <input
                type="text"
                required
                placeholder="Cth: Kost Eksklusif 5 Menit ke ITB / Unpad Full AC"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-700 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Tipe Hunian
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-700 focus:outline-none"
                >
                  <option value="Kost">Kost Eksklusif</option>
                  <option value="Kontrakan">Kontrakan Rumah</option>
                  <option value="Apartment">Apartemen</option>
                  <option value="Villa">Villa Liburan</option>
                  <option value="House">Rumah Tinggal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Harga Sewa (Rp)
                </label>
                <input
                  type="number"
                  required
                  placeholder="2500000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Periode Sewa
                </label>
                <select
                  value={formData.pricePeriod}
                  onChange={(e) => setFormData({ ...formData, pricePeriod: e.target.value })}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-700 focus:outline-none"
                >
                  <option value="monthly">Per Bulan</option>
                  <option value="yearly">Per Tahun</option>
                  <option value="daily">Per Malam / Hari</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Kamar Tidur
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Kamar Mandi
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Luas (m²)
                </label>
                <input
                  type="number"
                  placeholder="36"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Alamat Jalan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Jl. Sukasenang No. 12"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Kota / Wilayah
                </label>
                <input
                  type="text"
                  required
                  placeholder="Bandung"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Provinsi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Jawa Barat"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Deskripsi Lengkap Hunian
              </label>
              <textarea
                rows={4}
                required
                placeholder="Jelaskan fasilitas sekitar (dekat stasiun, minimarket), spesifikasi kasur, kondisi lingkungan, dan informasi penting lainnya..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-700 focus:outline-none"
              ></textarea>
            </div>

            {/* Amenities Selectors */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Pilih Fasilitas yang Tersedia (Amenities)
              </label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES_LIST.map((amenity) => (
                  <button
                    type="button"
                    key={amenity.id}
                    onClick={() => toggleAmenity(amenity.name)}
                    className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                      selectedAmenities.includes(amenity.name)
                        ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                        : 'bg-surface-warm text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {selectedAmenities.includes(amenity.name) ? '✓ ' : '+ '}
                    {amenity.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Rules Selectors */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Pilih Peraturan Rumah (House Rules)
              </label>
              <div className="flex flex-wrap gap-2">
                {RULES_LIST.map((rule) => (
                  <button
                    type="button"
                    key={rule.id}
                    onClick={() => toggleRule(rule.name)}
                    className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                      selectedRules.includes(rule.name)
                        ? 'bg-amber-700 text-white border-amber-700 shadow-sm'
                        : 'bg-surface-warm text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {selectedRules.includes(rule.name) ? '✓ ' : '+ '}
                    {rule.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Multer Multi-image upload */}
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Unggah Foto Properti (Maksimal 5 Foto)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImageFiles(e.target.files)}
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-800 hover:file:bg-brand-100 cursor-pointer"
              />
              <p className="text-[11px] text-mutedtext mt-1">
                Format didukung: JPG, PNG, WEBP (Maks 5 MB per foto). Foto pertama akan menjadi sampul utama.
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Mengunggah Data Listing...' : 'Publikasikan Iklan Properti Sekarang'}
            </Button>
          </form>
        </div>
      )}
    </div>
    </>
  );
};

export default OwnerDashboard;
