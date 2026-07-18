export function generateCouponCode(discount: number) {
  const random = Math.random()
    .toString(36)
    .substring(2, 7)
    .toUpperCase();

  return `KODIC-${discount}-${random}`;
}