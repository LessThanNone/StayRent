import React, { useState } from 'react';
import { Search, MapPin, SlidersHorizontal, CheckSquare, Square } from 'lucide-react';
import { PROPERTY_TYPES } from '../../utils/constants';
import Button from '../ui/Button';

const FilterBar = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    keyword: initialFilters.keyword || '',
    city: initialFilters.city || '',
    propertyType: initialFilters.propertyType || 'All',
    availableOnly: initialFilters.availableOnly || false,
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
  });

  const handleChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  const handleReset = () => {
    const resetValues = {
      keyword: '',
      city: '',
      propertyType: 'All',
      availableOnly: false,
      minPrice: '',
      maxPrice: '',
    };
    setFilters(resetValues);
    if (onFilterChange) {
      onFilterChange(resetValues);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-8">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari properti, nama jalan..."
              value={filters.keyword}
              onChange={(e) => handleChange('keyword', e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* City / Location Filter */}
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Kota (cth: Jakarta, Bandung)"
              value={filters.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Property Type Filter */}
          <div>
            <select
              value={filters.propertyType}
              onChange={(e) => handleChange('propertyType', e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-700"
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type === 'All' ? 'Semua Tipe Properti' : type}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button type="submit" variant="primary" className="flex-1">
              Terapkan
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>

        {/* Quick Filter: Availability & Price Range */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-600 gap-4">
          <button
            type="button"
            onClick={() => handleChange('availableOnly', !filters.availableOnly)}
            className="flex items-center space-x-2 font-medium hover:text-blue-600 focus:outline-none cursor-pointer"
          >
            {filters.availableOnly ? (
              <CheckSquare className="w-4 h-4 text-blue-600" />
            ) : (
              <Square className="w-4 h-4 text-gray-400" />
            )}
            <span>Hanya tampilkan properti yang siap sewa (Available)</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Rentang Harga (Rp):</span>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              className="w-24 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Maks"
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              className="w-24 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default FilterBar;
