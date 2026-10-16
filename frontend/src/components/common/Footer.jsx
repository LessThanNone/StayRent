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
              Trusted platform for renting kosts, houses, and apartments. Transparent booking, genuine reviews, and direct owner contact.
            </p>
            <div className="flex flex-col space-y-2 pt-1 text-sm text-mutedtext">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Verified Transactions</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <PhoneCall className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span>24/7 Support</span>
              </span>
            </div>
          </div>

          {/* Quick Info: Ragam Hunian */}
          <div>
            <h4 className="text-xs font-semibold text-ink tracking-wide uppercase mb-4">
              Rental Types
            </h4>
            <ul className="space-y-2.5 text-sm text-mutedtext">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                <span>Exclusive & Student Kost</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                <span>Family House Rental</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                <span>Studio & Furnished Apartments</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                <span>Villa & Holiday Homes</span>
              </li>
            </ul>
          </div>

          {/* Service Values & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-ink tracking-wide uppercase mb-4">
              Our Commitment
            </h4>
            <ul className="space-y-2.5 text-sm text-mutedtext">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <span>Verified Listings — No Fake Units</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <span>Real Reviews from Previous Tenants</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <span>Book with No Agency Fees</span>
              </li>
            </ul>
            <div className="mt-5 pt-5 border-t border-hairline flex flex-col space-y-2 text-sm text-mutedtext">
              <a href="#privacy-policy" onClick={(e) => e.preventDefault()} className="hover:text-brand-500 transition-colors">
                Privacy Policy
              </a>
              <a href="#terms-conditions" onClick={(e) => e.preventDefault()} className="hover:text-brand-500 transition-colors">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>

        {/* Legal Sub-Band */}
        <div className="border-t border-hairline mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-mutedtext gap-3">
          <p>© {new Date().getFullYear()} StayRent. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-ink cursor-pointer transition-colors">English</span>
            <span>·</span>
            <span className="hover:text-ink cursor-pointer transition-colors">IDR (Rp)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
