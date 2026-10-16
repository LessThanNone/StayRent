import React, { useState, useEffect, useRef } from 'react';
import FilterBar from '../components/property/FilterBar';
import PropertyCard from '../components/property/PropertyCard';
import { propertyService } from '../services/apiServices';
import heroHouseImg from '../assets/images/hero-house.jpg';
import { ShieldCheck, Building, KeyRound, MessageCircle } from 'lucide-react';

/* ── Simple scroll-reveal hook ─────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [activeCategory, setActiveCategory] = useState('Semua');

  const benefitsRef = useReveal();
  const listingsRef  = useReveal();

  const categories = [
    { id: 'Semua',          label: 'All Types' },
    { id: 'Boarding House', label: 'Boarding House' },
    { id: 'Rented House',   label: 'Rented House' },
    { id: 'Apartment',      label: 'Apartment' },
    { id: 'Villa',          label: 'Villa' },
    { id: 'House',          label: 'House' },
  ];

  useEffect(() => { fetchProperties(filters); }, [filters]);

  const fetchProperties = async (f) => {
    try {
      setLoading(true);
      // Clean up empty strings or nulls before sending
      const params = {};
      if (f.city && f.city.trim()) params.city = f.city.trim();
      if (f.propertyType && f.propertyType !== 'Semua' && f.propertyType !== 'Semua Tipe') {
        params.propertyType = f.propertyType;
      }
      if (f.availableOnly) params.availableOnly = 'true';
      if (f.minPrice) params.minPrice = f.minPrice;
      if (f.maxPrice) params.maxPrice = f.maxPrice;

      const res = await propertyService.getProperties(params);
      setProperties(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    setFilters((prev) => {
      const next = { ...prev };
      if (catId === 'Semua') {
        delete next.propertyType;
      } else {
        next.propertyType = catId;
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO — Editorial Split ────────────────────────────── */}
      <section className="relative min-h-[85dvh] flex items-center bg-white pt-10 pb-16 overflow-hidden">
        {/* Ambient soft orb */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 w-[800px] h-[800px] rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle at 70% 30%, #E0E7FF 0%, transparent 65%)', transform: 'translate(15%, -20%)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

            {/* Left — Typography (Widened across 7 columns) */}
            <div className="lg:col-span-7 hero-text-enter flex flex-col justify-center">
              <span className="inline-flex items-center rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold bg-brand-50 text-brand-600 border border-brand-100 mb-6 w-fit">
                Find · Rent · Stay
              </span>

              <h1 className="text-[44px] sm:text-[56px] lg:text-[68px] font-semibold tracking-display leading-[1.12] text-ink mb-6 max-w-2xl">
                Rental homes that truly <span className="text-brand-500">fit you</span>
              </h1>

              <p className="text-[16px] sm:text-[17px] text-mutedtext leading-relaxed max-w-xl mb-8">
                Verified kosts, boarding houses, and apartments across Indonesia. Transparent booking, genuine tenant reviews, and direct contact with property owners.
              </p>

              {/* Quick perks preview */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-mutedtext">
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-medium text-ink">100% Verified</span>
                </span>
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-brand-500" />
                  <span className="font-medium text-ink">No Agency Fees</span>
                </span>
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-medium text-ink">Direct WhatsApp Host</span>
                </span>
              </div>
            </div>

            {/* Right — Clean Double-Bezel Photo Showcase */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end hero-image-enter">
              <div className="p-2.5 bg-gray-100/70 ring-1 ring-black/5 rounded-[2.25rem] shadow-rukita-lg w-full max-w-[480px]">
                <div className="relative overflow-hidden bg-slate-900 group rounded-[1.75rem]">
                  <img
                    src={heroHouseImg}
                    alt="Modern rental home ready to move in"
                    className="w-full h-[400px] sm:h-[480px] object-cover object-center transition-transform duration-700 ease-spring group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="hero-stats-enter grid grid-cols-3 gap-4 sm:gap-8 mt-16 pt-8 border-t border-hairline">
            {[
              { value: '2,400+', label: 'Active Listings' },
              { value: '14 Cities', label: 'Coverage Area' },
              { value: '98%', label: 'Satisfied Tenants' },
            ].map((s) => (
              <div key={s.label}>
                <span className="block text-2xl sm:text-3xl font-semibold tracking-heading text-ink tabular-nums">{s.value}</span>
                <span className="block text-xs text-mutedtext mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY STAYRENT — Keunggulan Platform ────────────────── */}
      <section className="py-20 bg-white border-t border-hairline">
        <div ref={benefitsRef} className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-500 mb-3">
            Platform Advantages
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-heading leading-heading text-ink mb-12 max-w-xl">
            A Platform Fully Dedicated to Tenant Comfort
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Featured wide card */}
            <div className="p-2 bg-brand-800/5 ring-1 ring-brand-200/40 rounded-[1.5rem] md:col-span-2">
              <div
                className="bg-brand-500 rounded-[1.125rem] p-8 h-full flex flex-col justify-between min-h-[260px]"
                style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15)' }}
              >
                <div>
                  <ShieldCheck className="w-8 h-8 mb-6 opacity-80 stroke-[1.5] text-white" />
                  <h4 className="text-xl font-semibold text-white mb-3 leading-snug">
                    All listings verified before going live
                  </h4>
                  <p className="text-white/80 text-sm leading-relaxed max-w-md">
                    Our team verifies every property by checking the address, photos, and facilities directly before the listing appears on the platform. No fake units.
                  </p>
                </div>
                <p className="text-white/60 text-xs mt-8">Applies to all registered units</p>
              </div>
            </div>

            {/* Two stacked supporting cards */}
            <div className="flex flex-col gap-5">
              <div className="p-2 bg-gray-100/60 ring-1 ring-black/5 rounded-[1.5rem] flex-1">
                <div className="bg-white rounded-[1.125rem] p-6 h-full" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9)' }}>
                  <KeyRound className="w-5 h-5 text-brand-500 mb-4 stroke-[1.5]" />
                  <h4 className="text-sm font-semibold text-ink mb-1.5">All rental types</h4>
                  <p className="text-xs text-mutedtext leading-relaxed">
                    Boarding houses, rented houses, apartments, and villas in one unified platform.
                  </p>
                </div>
              </div>
              <div className="p-2 bg-gray-100/60 ring-1 ring-black/5 rounded-[1.5rem] flex-1">
                <div className="bg-white rounded-[1.125rem] p-6 h-full" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9)' }}>
                  <MessageCircle className="w-5 h-5 text-brand-500 mb-4 stroke-[1.5]" />
                  <h4 className="text-sm font-semibold text-ink mb-1.5">Direct to owner</h4>
                  <p className="text-xs text-mutedtext leading-relaxed">
                    Contact the owner directly via WhatsApp with no middleman and no hidden fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROPERTY LISTINGS & SEARCH BAR ────────────────────── */}
      <section className="py-16 bg-[#F8F9FF] border-t border-hairline">
        <div ref={listingsRef} className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Search Bar & Category Quick Pills directly above listings header */}
          <div className="mb-12">
            <div className="max-w-4xl mx-auto mb-5">
              <FilterBar onFilterChange={handleFilterChange} initialFilters={filters} />
            </div>

            {/* Quick Category Pills */}
            <div className="flex items-center justify-center flex-wrap gap-2">
              <span className="text-xs text-mutedtext font-medium mr-2">Quick search:</span>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ease-snap ${
                    activeCategory === cat.id
                      ? 'bg-brand-500 text-white shadow-btn'
                      : 'bg-white text-ink border border-hairline hover:border-brand-300 hover:text-brand-500 hover:-translate-y-0.5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end justify-between mb-8 pt-4 border-t border-hairline/80">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-brand-500 mb-2">
                Latest Listings
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-heading text-ink">
                Popular Rentals
              </h2>
            </div>
            <p className="text-sm text-mutedtext hidden sm:block">
              {properties.length} {properties.length === 1 ? 'property' : 'properties'} available
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1,2,3,4,5,6,7,8].map((n) => (
                <div key={n} className="rounded-[14px] bg-gray-200/60 h-80 animate-pulse" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="p-2 bg-gray-100/60 ring-1 ring-black/5 rounded-[1.5rem] max-w-md mx-auto my-8">
              <div className="bg-white rounded-[1.125rem] p-12 text-center">
                <Building className="w-10 h-10 text-mutedtext mx-auto mb-3 stroke-[1.5]" />
                <h3 className="text-base font-semibold text-ink">No properties found</h3>
                <p className="text-sm text-mutedtext mt-2 leading-relaxed">
                  Try adjusting your search, pick a different city, or turn off the availability filter.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 stagger-children">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
