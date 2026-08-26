export const formatLKR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rs. 0.00';
  const val = Number(amount);
  return 'Rs. ' + val.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
