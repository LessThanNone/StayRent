import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useWishlist } from '../../hooks/useWishlist';
import {
  Compass, Heart, User, LogOut, Building, Shield, Menu, X, PlusCircle,
} from 'lucide-react';
import Button from '../ui/Button';
import logoImg from '../../assets/images/logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLink = (path, exact = false) => {
    const isActive = exact ? pathname === path : pathname === path || pathname.startsWith(path + '/');
    return `relative text-sm flex items-center space-x-1.5 pb-0.5 border-b-2 transition-all duration-200 ${
      isActive
        ? 'border-brand-500 text-brand-500 font-semibold'
        : 'border-transparent text-mutedtext hover:text-ink'
    }`;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Floating pill nav — detached from top */}
      <nav className="sticky top-0 z-50">
        <div className="px-3 sm:px-5 lg:px-8 pt-3 pb-0 bg-gradient-to-b from-white/95 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/92 backdrop-blur-md border border-hairline/70 rounded-full h-[62px] shadow-rukita-sm flex items-center justify-between px-4 sm:px-5 transition-all duration-300 ease-snap">

              {/* Brand */}
              {/* Brand Logo with StayRent Housemark */}
              <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
                <img
                  src={logoImg}
                  alt="StayRent Logo"
                  className="w-12 h-12 object-contain group-hover:-translate-y-0.5 transition-all duration-300 ease-snap"
                />
                <span className="font-semibold text-lg tracking-snug text-ink">
                  Stay<span className="text-brand-500">Rent</span>
                </span>
              </Link>

              {/* Desktop nav links */}
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/" className={navLink('/', true)}>
                  <Compass className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>Jelajah</span>
                </Link>

                {user?.role === 'tenant' && (
                  <Link to="/tenant/dashboard" className={navLink('/tenant/dashboard')}>
                    <span>Dashboard</span>
                  </Link>
                )}

                {user?.role === 'owner' && (
                  <Link to="/owner/dashboard" className={navLink('/owner/dashboard')}>
                    <span>Dashboard</span>
                  </Link>
                )}

                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" className={navLink('/admin/dashboard')}>
                    <span>Dashboard Admin</span>
                  </Link>
                )}
              </div>

              {/* Auth section */}
              <div className="hidden md:flex items-center space-x-3">
                {user ? (
                  <div className="flex items-center space-x-3 pl-3 border-l border-hairline">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 font-semibold text-xs flex items-center justify-center border border-brand-100">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div className="text-left">
                        <span className="block text-xs font-medium text-ink leading-tight">{user.name}</span>
                        <span className="block text-[10px] text-mutedtext capitalize">{user.role}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      title="Keluar"
                      className="p-2 text-mutedtext hover:text-rose-600 rounded-full hover:bg-rose-50 transition-all duration-200"
                    >
                      <LogOut className="w-3.5 h-3.5 stroke-[1.5]" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link to="/login" className="text-sm text-mutedtext hover:text-ink px-3 py-1.5 transition-colors duration-200">
                      Masuk
                    </Link>
                    <Link
                      to="/register"
                      className="inline-flex items-center text-sm bg-brand-500 hover:brightness-110 text-white px-5 h-[38px] rounded-full shadow-btn hover:shadow-btn-hover hover:-translate-y-0.5 transition-all duration-300 ease-snap active:scale-[0.97]"
                    >
                      Daftar
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile toggle — morphing hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
              >
                <span
                  className={`absolute block w-4 h-[1.5px] bg-ink rounded-full transition-all duration-300 ease-snap ${
                    mobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
                  }`}
                />
                <span
                  className={`absolute block w-4 h-[1.5px] bg-ink rounded-full transition-all duration-300 ease-snap ${
                    mobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`absolute block w-4 h-[1.5px] bg-ink rounded-full transition-all duration-300 ease-snap ${
                    mobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay — full-screen with staggered reveal */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl flex flex-col px-6 pt-24 pb-10 animate-fadeIn md:hidden">
          <nav className="flex flex-col space-y-1 flex-1">
            {[
              { to: '/', label: 'Jelajah Hunian' },
              ...(user?.role === 'tenant' ? [
                { to: '/tenant/dashboard', label: 'Dashboard' },
              ] : []),
              ...(user?.role === 'owner' ? [
                { to: '/owner/dashboard', label: 'Dashboard' },
              ] : []),
              ...(user?.role === 'admin' ? [
                { to: '/admin/dashboard', label: 'Dashboard Admin' },
              ] : []),
            ].map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-semibold text-ink py-3 hover:text-brand-500 transition-colors opacity-0 animate-slide-up"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'forwards' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-hairline pt-6">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-700 font-semibold text-sm flex items-center justify-center border border-brand-100">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-ink">{user.name}</span>
                    <span className="block text-xs text-mutedtext capitalize">{user.role}</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="text-sm text-rose-600 font-medium">
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-3 text-sm border border-hairline rounded-full text-ink hover:bg-gray-50 transition-colors">
                  Masuk
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-3 text-sm bg-brand-500 text-white rounded-full shadow-btn hover:brightness-110 transition-all">
                  Daftar Akun
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
