export function applyDiscount(price: number, discountPercent: number): number {
   if (price < 0) {
    throw new Error("Price cannot be negative");
  }
  if (discountPercent < 0) {
    throw new Error("Discount cannot be negative");
  }
  if (discountPercent > 100) {
    throw new Error("Discount cannot exceed 100%");
  }

  const discountMultiplier = 1 -discountPercent / 100;
  return price * discountMultiplier;
}

export function calculateTax(
  price: number,
  taxRate: number,
  isTaxExempt: boolean = false
): number {
  if (price < 0) {
    throw new Error("Price cannot be negative");
  }
  if (taxRate < 0) {
    throw new Error("Tax rate cannot be negative");
  }

  if (isTaxExempt) {
    return 0;
  }

  const tax = price * (taxRate / 100);
  return Math.round(tax * 100) / 100;
}

export interface CartItem {
  price: number;
  quantity: number;
  isTaxExempt?: boolean;
}

export interface cartTotals {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export function calculateTotal(
  items: CartItem[],
  discountPercent: number = 0,
  taxRate: number = 0
): cartTotals {
  var subtotal = 0
  for (const item of items) {
    subtotal += item.price * item.quantity;
  }
  const discount = applyDiscount(subtotal, discountPercent);
  var nonTaxableTotal = 0
  for (const item of items) {
    if (item.isTaxExempt) {
      nonTaxableTotal += item.price * item.quantity;
    }
  }
  nonTaxableTotal = applyDiscount(nonTaxableTotal, discountPercent)
  const taxableTotal = discount - nonTaxableTotal;
  const tax = calculateTax(taxableTotal, taxRate);
  const total = taxableTotal + nonTaxableTotal + tax;
  return {
    subtotal: Math.round(subtotal *100 )/100,
    discount: Math.round((subtotal - discount) *100)/100,
    tax: Math.round(tax * 100)/100,
    total: Math.round(total * 100)/100,
  };
  throw new Error("Not implemented");
}