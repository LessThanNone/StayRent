import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { propertyService } from '../services/apiServices';
import { AMENITIES_LIST, RULES_LIST } from '../utils/constants';
import Button from '../components/ui/Button';
import { AlertCircle, ArrowLeft, Plus } from 'lucide-react';

const AddPropertyPage = () => {
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
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
      navigate('/owner/dashboard');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Gagal menambahkan properti');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          to="/owner/dashboard"
          className="text-xs font-semibold text-brand-700 hover:text-brand-900 inline-flex items-center"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Kembali ke Dashboard</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-hairline p-6 md:p-10 shadow-sm">
        <h1 className="text-2xl font-bold text-ink mb-1 flex items-center space-x-2">
          <Plus className="w-6 h-6 text-brand-700 inline" />
          <span>Tambah Iklan Properti Baru</span>
        </h1>
        <p className="text-xs text-mutedtext mb-6">
          Lengkapi formulir di bawah ini dengan informasi akurat untuk menarik minat calon penyewa
        </p>

        {formError && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Judul Iklan Properti
            </label>
            <input
              type="text"
              required
              placeholder="Cth: Kost Eksklusif 5 Menit ke Kampus Full AC"
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
                <option value="Kost">Kost</option>
                <option value="Kontrakan">Kontrakan</option>
                <option value="Apartment">Apartemen</option>
                <option value="Villa">Villa</option>
                <option value="House">Rumah</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Harga Sewa (Rp)
              </label>
              <input
                type="number"
                required
                placeholder="2000000"
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
                <option value="daily">Per Hari</option>
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
                placeholder="Jl. Mawar No. 10"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                Kota / Kabupaten
              </label>
              <input
                type="text"
                required
                placeholder="Jakarta Selatan"
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
                placeholder="DKI Jakarta"
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
              placeholder="Jelaskan fasilitas, lingkungan sekitar, akses transportasi umum, dan informasi penting lainnya..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-700 focus:outline-none"
            ></textarea>
          </div>

          {/* Amenities */}
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

          {/* Rules */}
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

          {/* Image upload */}
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
              Format: JPG, PNG, WEBP (Maks 5 MB per foto).
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
    </div>
  );
};

export default AddPropertyPage;
