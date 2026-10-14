/**
 * Format number to Indonesian Rupiah currency format
 * @param {number} amount
 * @returns {string} e.g. "Rp 2.500.000"
 */
export const formatRupiah = (amount) => {
  if (amount === undefined || amount === null) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format ISO date string to readable Indonesian date
 * @param {string|Date} dateStr
 * @returns {string} e.g. "15 Okt 2026"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};
