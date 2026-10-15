import React, { useState } from 'react';
import { Search, MapPin, Home, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { PROPERTY_TYPES } from '../../utils/constants';

const FilterBar = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    city: initialFilters.city || '',
    availableOnly: initialFilters.availableOnly || false,
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
  });

  const [showPriceFilter, setShowPriceFilter] = useState(false);

  // Sync internal state when initialFilters changes (e.g. from quick category click or parent updates)
  React.useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      city: initialFilters.city || '',
      availableOnly: initialFilters.availableOnly || false,
      minPrice: initialFilters.minPrice || '',
      maxPrice: initialFilters.maxPrice || '',
    }));
  }, [initialFilters.city, initialFilters.availableOnly, initialFilters.minPrice, initialFilters.maxPrice]);

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleAvailable = () => {
    const nextVal = !filters.availableOnly;
    const updated = { ...filters, availableOnly: nextVal };
    setFilters(updated);
    if (onFilterChange) onFilterChange(updated);
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (onFilterChange) onFilterChange(filters);
  };

  const handleApplyPrice = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (onFilterChange) onFilterChange(filters);
  };

  const handleReset = () => {
    const resetValues = {
      city: '',
      availableOnly: false,
      minPrice: '',
      maxPrice: '',
    };
    setFilters(resetValues);
    if (onFilterChange) onFilterChange(resetValues);
  };

  return (
    <div className="w-full mb-4">
      {/* Airbnb pill search bar: white, fully rounded, 1px hairline, teal orb */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl md:rounded-full border border-hairline shadow-rukita-sm p-2 md:p-2 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0"
      >
        {/* Segment 1: Lokasi */}
        <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-hairline hover:bg-gray-50/60 rounded-2xl md:rounded-l-full transition-colors">
          <MapPin className="w-4 h-4 text-brand-500 mr-3 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="block text-[11px] font-medium text-mutedtext">
              Lokasi / Kota
            </span>
            <input
              type="text"
              placeholder="Cth: Bandung, Jakarta, Sleman..."
              value={filters.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full text-sm text-ink placeholder-mutedtext bg-transparent focus:outline-none truncate"
            />
          </div>
        </div>

        {/* Segment 2: Ketersediaan toggle */}
        <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-50/60 transition-colors">
          <div className="mr-3">
            <span className="block text-[11px] font-medium text-mutedtext">
              Ketersediaan
            </span>
            <span className="text-xs text-mutedtext">Siap Huni Saja</span>
          </div>
          <button
            type="button"
            onClick={handleToggleAvailable}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
              filters.availableOnly ? 'bg-brand-500' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={filters.availableOnly}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                filters.availableOnly ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Actions: filter icon + teal search orb */}
        <div className="flex items-center gap-2 pl-2 pr-1 py-1">
          <button
            type="button"
            onClick={() => setShowPriceFilter(!showPriceFilter)}
            className={`p-2.5 rounded-full border transition-colors ${
              showPriceFilter
                ? 'bg-brand-50 border-brand-200 text-brand-500'
                : 'border-hairline text-mutedtext hover:bg-gray-100'
            }`}
            title="Filter Rentang Harga"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button
            type="submit"
            className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-2 bg-brand-500 hover:opacity-80 text-white font-medium text-sm px-6 h-[48px] rounded-full transition-all active:scale-95"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span className="md:hidden lg:inline">Cari Hunian</span>
          </button>
        </div>
      </form>

      {/* Price range drawer */}
      {showPriceFilter && (
        <div className="mt-3 p-4 bg-white rounded-[12px] border border-hairline shadow-rukita-sm flex flex-wrap items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3 text-sm text-ink">
            <span className="font-medium">Rentang Harga (Rp):</span>
            <input
              type="number"
              placeholder="Minimum"
              value={filters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              className="w-36 px-3 py-1.5 bg-gray-50 border border-hairline rounded-lg text-sm focus:border-brand-500 focus:outline-none"
            />
            <span className="text-mutedtext">—</span>
            <input
              type="number"
              placeholder="Maksimum"
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              className="w-36 px-3 py-1.5 bg-gray-50 border border-hairline rounded-lg text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center text-xs text-mutedtext hover:text-ink px-3 py-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset
            </button>
            <button
              type="button"
              onClick={handleApplyPrice}
              className="text-xs bg-brand-500 hover:opacity-80 text-white font-medium px-4 py-1.5 rounded-full transition-all"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
