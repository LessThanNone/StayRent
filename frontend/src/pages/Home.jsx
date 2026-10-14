import React, { useState, useEffect } from 'react';
import FilterBar from '../components/property/FilterBar';
import PropertyCard from '../components/property/PropertyCard';
import { propertyService } from '../services/apiServices';
import { Sparkles, Home as HomeIcon } from 'lucide-react';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchProperties(filters);
  }, [filters]);

  const fetchProperties = async (currentFilters) => {
    try {
      setLoading(true);
      const res = await propertyService.getProperties(currentFilters);
      setProperties(res.data.data || []);
    } catch (error) {
      console.error('Error fetching properties', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50/60 to-transparent py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100/70 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sewa Rumah & Kost Tanpa Ribet</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
            Temukan Hunian Impian Anda Bersama <span className="text-blue-600">StayRent</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto mb-10">
            Pilihan terlengkap mulai dari rumah tinggal keluarga, kost mahasiswa, hingga villa liburan dengan sistem pemesanan terpercaya.
          </p>

          {/* Search & Filter Bar */}
          <FilterBar onFilterChange={handleFilterChange} initialFilters={filters} />
        </div>
      </section>

      {/* Property Listings Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Daftar Properti Tersedia</h2>
            <p className="text-xs text-gray-500 mt-1">
              Menampilkan {properties.length} properti yang sesuai kriteria pencarian Anda
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-xl h-80 animate-pulse border border-gray-100"></div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md mx-auto my-12">
            <HomeIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-800">Tidak ada properti ditemukan</h3>
            <p className="text-xs text-gray-500 mt-1">
              Coba sesuaikan kata kunci atau filter pencarian Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
