import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import logoImg from '../assets/images/logo.png';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const user = await login(formData);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'owner') navigate('/owner/dashboard');
      else navigate('/tenant/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4 py-16 bg-[#F8F9FF]">
      {/* Ambient orb */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 right-0 w-[600px] h-[600px] rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle, #E0E7FF 0%, transparent 65%)', transform: 'translate(25%, -25%)' }}
      />

      {/* Double-bezel card */}
      <div className="relative z-10 p-2 bg-white/60 ring-1 ring-brand-100/50 rounded-[1.75rem] w-full max-w-[420px] shadow-rukita-lg">
        <div
          className="bg-white rounded-[1.375rem] p-8 sm:p-10"
          style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.95)' }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex flex-col items-center gap-3 group">
              <img
                src={logoImg}
                alt="StayRent"
                className="h-16 w-auto object-contain group-hover:opacity-80 transition-opacity duration-200"
              />
              <span className="font-semibold text-xl tracking-snug text-ink">
                Stay<span className="text-brand-500">Rent</span>
              </span>
            </Link>
            <h2 className="text-xl font-semibold tracking-snug text-ink mt-4 mb-1">
              Welcome back
            </h2>
            <p className="text-sm text-mutedtext">
              Sign in to continue renting or manage your property
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 stroke-[1.5]" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mutedtext stroke-[1.5]" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-surface-alt/60 border border-hairline rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mutedtext stroke-[1.5]" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-surface-alt/60 border border-hairline rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-[46px] text-sm mt-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-7 pt-6 border-t border-hairline text-center text-sm text-mutedtext">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-500 hover:text-brand-700 transition-colors">
              Sign up now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
