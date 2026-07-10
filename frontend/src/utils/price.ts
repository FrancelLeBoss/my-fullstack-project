export const new_price = (price: number, discount: number): string => {
  if (!price || !discount) return "0";
  return (price - (price * discount) / 100).toFixed(2);
};