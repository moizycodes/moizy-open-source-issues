/**
 * Formats a numeric value into a currency string with thousand separators and
 * fixed decimal places.
 *
 * @param {number} amount - The numeric value to format
 * @param {Object} options - Format options
 * @param {string} [options.currency] - Currency code (e.g. "USD", "PKR"). When omitted, formats as a plain decimal.
 * @param {number} [options.decimals=2] - Number of decimal places
 * @param {string} [options.locale="en-US"] - Locale tag used for formatting (e.g. "en-GB", "ur-PK")
 * @returns {string | null} - The formatted string, "0.00" for invalid input, or null for non-finite values (Infinity, -Infinity)
 */

function formatCurrency(amount, options = {}) {
  const { currency, decimals = 2, locale } = options;

  const isCurrency = typeof currency === 'string' && currency.length > 0;

  if (isNaN(amount)) return '0.00';

  // Infinity and -Infinity have no meaningful currency representation
  if (!isFinite(amount)) return null;

  try {
    return new Intl.NumberFormat(locale || 'en-US', {
      style: isCurrency ? 'currency' : 'decimal',
      ...(isCurrency && { currency }),
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  } catch {
    return new Intl.NumberFormat(locale || 'en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  }
}

module.exports = formatCurrency;
