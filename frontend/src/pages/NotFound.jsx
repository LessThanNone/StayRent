import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl font-extrabold text-blue-600 mb-4">404</h1>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-xs text-gray-500 max-w-sm mb-6">
        Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
      </p>
      <Link to="/">
        <Button variant="primary" size="md" className="flex items-center space-x-2">
          <Home className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
