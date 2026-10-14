import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useWishlist } from '../../hooks/useWishlist';
import { Home, Heart, User, LogOut, PlusCircle, LayoutDashboard, Menu, X } from 'lucide-react';
import Button from '../ui/Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2 text-blue-600 font-bold text-xl">
            <Home className="w-6 h-6" />
            <span className="text-gray-900 tracking-tight">Stay<span className="text-blue-600">Rent</span></span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">
              Beranda
            </Link>

            {user && (
              <>
                {user.role === 'tenant' && (
                  <>
                    <Link
                      to="/tenant/dashboard"
                      className="text-gray-600 hover:text-blue-600 text-sm font-medium flex items-center space-x-1"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Sewa Saya</span>
                    </Link>
                    <Link
                      to="/tenant/dashboard?tab=wishlist"
                      className="text-gray-600 hover:text-blue-600 text-sm font-medium flex items-center space-x-1"
                    >
                      <Heart className="w-4 h-4" />
                      <span>Favorit ({wishlist.length})</span>
                    </Link>
                  </>
                )}

                {user.role === 'owner' && (
                  <Link
                    to="/owner/dashboard"
                    className="text-gray-600 hover:text-blue-600 text-sm font-medium flex items-center space-x-1"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Owner Dashboard</span>
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-600 hover:text-blue-600 text-sm font-medium flex items-center space-x-1"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-semibold text-gray-800">{user.name}</span>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 capitalize">
                    {user.role}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500 hover:text-red-600">
                  <LogOut className="w-4 h-4 mr-1" />
                  Keluar
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Masuk</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Daftar Akun</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-700 hover:text-blue-600 py-2 font-medium"
          >
            Beranda
          </Link>
          {user ? (
            <>
              {user.role === 'tenant' && (
                <Link
                  to="/tenant/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-blue-600 py-2 font-medium"
                >
                  Dashboard Tenant
                </Link>
              )}
              {user.role === 'owner' && (
                <Link
                  to="/owner/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-blue-600 py-2 font-medium"
                >
                  Dashboard Owner
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-blue-600 py-2 font-medium"
                >
                  Dashboard Admin
                </Link>
              )}
              <div className="pt-2 border-t border-gray-100">
                <Button variant="danger" size="sm" onClick={handleLogout} className="w-full">
                  Keluar
                </Button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-gray-100 flex flex-col space-y-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">Masuk</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full">Daftar Akun</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
