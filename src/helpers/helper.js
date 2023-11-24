export const isFormValid = (data) => {
  const { qty, price, discount, tax, discountPercentage, taxPercentage } = data;
  if (qty <= 0 || price <= 0 || discount < 0 || tax < 0) return false;
  if (discount > qty * price) return false;
  if (discountPercentage > 100 || taxPercentage > 100) return false;
  return true;
};
