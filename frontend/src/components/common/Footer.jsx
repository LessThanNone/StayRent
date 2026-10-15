import React from 'react';
import { Building, ShieldCheck, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/images/logo.png';

const Footer = () => {
  return (
    <footer className="bg-[#F8F9FF] border-t border-hairline mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand Col — wider, more presence */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 group">
              <img
                src={logoImg}
                alt="StayRent Logo"
                className="w-11 h-11 object-contain group-hover:-translate-y-0.5 group-hover:opacity-80 transition-all"
              />
              <span className="font-semibold text-xl tracking-snug text-ink">
                Stay<span className="text-brand-500">Rent</span>
              </span>
            </Link>
            <p className="text-sm text-mutedtext leading-relaxed max-w-xs">
              Platform sewa kost, rumah, dan apartemen terpercaya. Booking transparan, ulasan asli, komunikasi langsung dengan pemilik.
            </p>
            <div className="flex flex-col space-y-2 pt-1 text-sm text-mutedtext">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Transaksi Terverifikasi</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <PhoneCall className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span>Bantuan 24/7</span>
              </span>
            </div>
          </div>

          {/* Quick Info: Ragam Hunian */}
          <div>
            <h4 className="text-xs font-semibold text-ink tracking-wide uppercase mb-4">
              Pilihan Hunian
            </h4>
            <ul className="space-y-2.5 text-sm text-mutedtext">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                <span>Kost Eksklusif & Mahasiswa</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                <span>Kontrakan Rumah Keluarga</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                <span>Apartemen Studio & Furnished</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                <span>Villa & Rumah Liburan</span>
              </li>
            </ul>
          </div>

          {/* Service Values & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-ink tracking-wide uppercase mb-4">
              Komitmen Layanan
            </h4>
            <ul className="space-y-2.5 text-sm text-mutedtext">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <span>Verifikasi Listing & Bebas Unit Fiktif</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <span>Ulasan Riil dari Penyewa Sebelumnya</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <span>Pemesanan Tanpa Biaya Perantara</span>
              </li>
            </ul>
            <div className="mt-5 pt-5 border-t border-hairline flex flex-col space-y-2 text-sm text-mutedtext">
              <a href="#kebijakan-privasi" onClick={(e) => e.preventDefault()} className="hover:text-brand-500 transition-colors">
                Kebijakan Privasi
              </a>
              <a href="#syarat-ketentuan" onClick={(e) => e.preventDefault()} className="hover:text-brand-500 transition-colors">
                Syarat & Ketentuan
              </a>
            </div>
          </div>
        </div>

        {/* Legal Sub-Band */}
        <div className="border-t border-hairline mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-mutedtext gap-3">
          <p>© {new Date().getFullYear()} StayRent. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-ink cursor-pointer transition-colors">Bahasa Indonesia</span>
            <span>·</span>
            <span className="hover:text-ink cursor-pointer transition-colors">IDR (Rp)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
