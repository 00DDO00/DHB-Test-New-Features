export const formatCurrency = (amount: number | null | undefined, currency: string = 'EUR'): string => {
  // Handle null, undefined, or NaN values
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '€ --.---,--';
  }
  
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatInterestRate = (rate: number): string => {
  return `${rate.toFixed(1)}%`;
};

export const formatIBAN = (iban: string): string => {
  // Format IBAN with spaces every 4 characters
  return iban.replace(/(.{4})/g, '$1 ').trim();
};
