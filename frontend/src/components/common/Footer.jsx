import React from 'react';
import { Home, Heart, Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-600 font-bold text-xl">
              <Home className="w-6 h-6" />
              <span className="text-gray-900">Stay<span className="text-blue-600">Rent</span></span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Platform modern penyewaan rumah, kost, dan apartemen terpercaya dengan kemudahan booking dan transparansi harga.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 tracking-wider uppercase">Jelajahi</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/" className="hover:text-blue-600">Rumah Sewa</a></li>
              <li><a href="/" className="hover:text-blue-600">Apartemen</a></li>
              <li><a href="/" className="hover:text-blue-600">Kost Eksklusif</a></li>
              <li><a href="/" className="hover:text-blue-600">Villa Liburan</a></li>
            </ul>
          </div>

          {/* Roles Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 tracking-wider uppercase">Untuk Pemilik</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/register" className="hover:text-blue-600">Daftarkan Properti Anda</a></li>
              <li><a href="/owner/dashboard" className="hover:text-blue-600">Kelola Reservasi</a></li>
              <li><a href="/" className="hover:text-blue-600">Panduan Tuan Rumah</a></li>
            </ul>
          </div>

          {/* Contact / Trust */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 tracking-wider uppercase">Keamanan & Bantuan</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Transaksi Terverifikasi</span>
              </li>
              <li><a href="/" className="hover:text-blue-600">Pusat Bantuan</a></li>
              <li><a href="/" className="hover:text-blue-600">Kebijakan Privasi</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} StayRent. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Dibuat dengan MERN Stack (MongoDB, Express, React, Node.js).</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
