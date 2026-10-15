import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.97]';

  const variants = {
    primary:
      'bg-brand-500 text-white border border-brand-500 shadow-btn hover:-translate-y-0.5 hover:shadow-btn-hover hover:brightness-110',
    secondary:
      'bg-[#1E3A8A] text-white border border-transparent shadow-btn hover:-translate-y-0.5 hover:shadow-btn-hover hover:brightness-110',
    outline:
      'bg-white border border-hairline text-mutedtext hover:border-brand-400 hover:text-brand-500 hover:-translate-y-0.5 hover:shadow-rukita-sm',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 hover:-translate-y-0.5',
    ghost:
      'text-mutedtext hover:text-ink hover:bg-gray-100/70',
    whatsapp:
      'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 hover:-translate-y-0.5',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs h-[34px]',
    md: 'px-5 py-2.5 text-sm h-[42px]',
    lg: 'px-6 py-3 text-sm font-medium h-[46px]',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
