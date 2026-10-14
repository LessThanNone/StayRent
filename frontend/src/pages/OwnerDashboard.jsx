import React, { useState, useEffect } from 'react';
import { propertyService, bookingService } from '../services/apiServices';
import { formatRupiah, formatDate } from '../utils/formatters';
import { AMENITIES_LIST, RULES_LIST, PROPERTY_TYPES } from '../utils/constants';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import {
  Plus,
  Home,
  Calendar,
  Check,
  X,
  Trash2,
  Upload,
  AlertCircle,
} from 'lucide-react';

const OwnerDashboard = () => {
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
    propertyType: 'House',
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

  const handleBookingAction = async (bookingId, status) => {
    try {
      await bookingService.updateBookingStatus(bookingId, status);
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal mengubah status sewa');
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Hapus properti ini? Semua data terkait akan terhapus.')) {
      try {
        await propertyService.deleteProperty(propertyId);
        loadData();
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal menghapus properti');
      }
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
        propertyType: 'House',
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">Kelola listing properti dan permohonan sewa dari calon penyewa</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setActiveTab('add')}
          className="flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Pasang Iklan Baru</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('listings')}
          className={`py-3 px-6 text-sm font-semibold border-b-2 flex items-center space-x-2 ${
            activeTab === 'listings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Properti Saya ({myProperties.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`py-3 px-6 text-sm font-semibold border-b-2 flex items-center space-x-2 ${
            activeTab === 'bookings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Pengajuan Masuk ({incomingBookings.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`py-3 px-6 text-sm font-semibold border-b-2 flex items-center space-x-2 ${
            activeTab === 'add' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Form Pasang Properti</span>
        </button>
      </div>

      {/* Tab: Listings */}
      {activeTab === 'listings' && (
        <div>
          {myProperties.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <p className="text-xs text-gray-500">Belum ada properti yang diiklankan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myProperties.map((prop) => (
                <Card key={prop._id} className="p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase">
                      {prop.propertyType}
                    </span>
                    <h3 className="font-bold text-gray-900 mt-2 line-clamp-1">{prop.title}</h3>
                    <p className="text-xs text-gray-500">{prop.address?.city}</p>
                    <p className="text-sm font-bold text-blue-600 mt-2">
                      {formatRupiah(prop.price)}/{prop.pricePeriod === 'monthly' ? 'bln' : 'thn'}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className={`text-xs px-2 py-0.5 rounded ${prop.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {prop.isAvailable ? 'Tersedia' : 'Dipesan'}
                    </span>
                    <button
                      onClick={() => handleDeleteProperty(prop._id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {incomingBookings.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <p className="text-xs text-gray-500">Belum ada pengajuan sewa yang masuk.</p>
            </div>
          ) : (
            incomingBookings.map((b) => (
              <div key={b._id} className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h4 className="font-bold text-gray-900">{b.property?.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Calon Penyewa: <span className="font-semibold">{b.tenant?.name}</span> ({b.tenant?.phone || b.tenant?.email})
                  </p>
                  <p className="text-xs text-gray-500">
                    Durasi: {formatDate(b.startDate)} - {formatDate(b.endDate)}
                  </p>
                  <p className="text-xs font-bold text-blue-600 mt-1">Total: {formatRupiah(b.totalPrice)}</p>
                  {b.notes && <p className="text-xs italic text-gray-400 mt-1">"{b.notes}"</p>}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 capitalize">{b.status}</span>
                  {b.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleBookingAction(b._id, 'approved')}
                        className="bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Setujui</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleBookingAction(b._id, 'rejected')}
                        className="flex items-center space-x-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Tolak</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Add Property */}
      {activeTab === 'add' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 max-w-3xl">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Tambah Properti Baru</h2>
          {formError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}
          <form onSubmit={handleCreateProperty} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Judul Listing</label>
              <input
                type="text"
                required
                placeholder="Cth: Rumah Minimalis 2 Lantai Dekat Kampus"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tipe Properti</label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  {PROPERTY_TYPES.filter((t) => t !== 'All').map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  required
                  placeholder="2500000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Periode Sewa</label>
                <select
                  value={formData.pricePeriod}
                  onChange={(e) => setFormData({ ...formData, pricePeriod: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <option value="monthly">Per Bulan</option>
                  <option value="yearly">Per Tahun</option>
                  <option value="daily">Per Hari / Malam</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Kamar Tidur</label>
                <input
                  type="number"
                  min={1}
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Kamar Mandi</label>
                <input
                  type="number"
                  min={1}
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Luas (m²)</label>
                <input
                  type="number"
                  placeholder="72"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Alamat Jalan</label>
                <input
                  type="text"
                  required
                  placeholder="Jl. Sukasenang No. 12"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Kota</label>
                <input
                  type="text"
                  required
                  placeholder="Bandung"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Provinsi</label>
                <input
                  type="text"
                  required
                  placeholder="Jawa Barat"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi Lengkap</label>
              <textarea
                rows={3}
                required
                placeholder="Jelaskan keunggulan dan kondisi hunian..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
              ></textarea>
            </div>

            {/* Amenities Checkboxes */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Pilih Fasilitas (Amenities)</label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES_LIST.map((amenity) => (
                  <button
                    type="button"
                    key={amenity.id}
                    onClick={() => toggleAmenity(amenity.name)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      selectedAmenities.includes(amenity.name)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    {amenity.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Rules Checkboxes */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Pilih Peraturan (Rules)</label>
              <div className="flex flex-wrap gap-2">
                {RULES_LIST.map((rule) => (
                  <button
                    type="button"
                    key={rule.id}
                    onClick={() => toggleRule(rule.name)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      selectedRules.includes(rule.name)
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    {rule.name}
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload Multer */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Unggah Foto Properti (Max 5)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImageFiles(e.target.files)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full py-2.5 mt-4" disabled={isSubmitting}>
              {isSubmitting ? 'Mengunggah Data...' : 'Publikasikan Iklan Properti'}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
