import { describe, it, expect } from "vitest";
import { applyDiscount, calculateTax, calculateTotal, CartItem } from "../cartUtils.js";

describe("applyDiscount", () => {
  it("applies a percentage discount to a price", () => {
    expect(applyDiscount(100, 10)).toBe(90);
  });
  
  it("returns the original price when discount is 0%", () => {
    expect(applyDiscount(50, 0)).toBe(50);
  });

  it("returns 0 when discount is 100%", () => {
    expect(applyDiscount(75, 100)).toBe(0);
  });

  it("handles decimal prices correctly", () => {
    expect(applyDiscount(19.99, 10)).toBeCloseTo(17.99, 2);
  });

  it("throws an error for negative prices", () => {
    expect(() => applyDiscount(-10, 10)).toThrow("Price cannot be negative");
  });

  it("throws an error for negative discount percentages", () => {
    expect(() => applyDiscount(100, -5)).toThrow("Discount cannot be negative");
  });

  it("throws an error for discount greater than 100%", () => {
    expect(() => applyDiscount(100, 150)).toThrow(
      "Discount cannot exceed 100%"
    );
  });

  describe("calculateTax", () => {
  it("calculates tax on a price", () => {
    expect(calculateTax(100, 8.5)).toBeCloseTo(8.5, 2);
  });

  it("returns 0 tax when rate is 0%", () => {
    expect(calculateTax(50, 0)).toBe(0);
  });

  it("handles decimal prices correctly", () => {
    expect(calculateTax(19.99, 10)).toBeCloseTo(2.0, 2);
  });

  it("returns 0 tax when item is tax-exempt", () => {
    expect(calculateTax(100, 8.5, true)).toBe(0);
  });

  it("throws an error for negative prices", () => {
    expect(() => calculateTax(-10, 8.5)).toThrow("Price cannot be negative");
  });

  it("throws an error for negative tax rates", () => {
    expect(() => calculateTax(100, -5)).toThrow("Tax rate cannot be negative");
  });
});

describe("calculateTotal", () => {

  it("calculates totals for a single item", () => {
    const cart: CartItem[] = [{ price: 100, quantity: 1 }];
    const discountPercent = 10;
    const taxRate = 10;
    const cartTotals = calculateTotal(cart, discountPercent, taxRate);

    expect(cartTotals.subtotal).toBe(100);
    expect(cartTotals.discount).toBe(10);
    expect(cartTotals.tax).toBeCloseTo(9);
    expect(cartTotals.total).toBeCloseTo(99);
  });

  it("calculates totals for multiple items", () => {
    const cart: CartItem[] = [
      { price: 50, quantity: 2 },
      { price: 30, quantity: 1 },
    ];
    const discountPercent = 10;
    const taxRate = 10;
    const cartTotals = calculateTotal(cart, discountPercent, taxRate);
    expect(cartTotals.subtotal).toBe(130);
    expect(cartTotals.discount).toBe(13);
    expect(cartTotals.tax).toBeCloseTo(11.7);
    expect(cartTotals.total).toBeCloseTo(128.7);
  });

  it("applies discount before calculating tax", () => {
    const cart: CartItem[] = [{ price: 200, quantity: 1 }];
    const discountPercent = 20;
    const taxRate = 10;
    const cartTotals = calculateTotal(cart, discountPercent, taxRate);
    expect(cartTotals.subtotal).toBe(200);
    expect(cartTotals.discount).toBe(40);
    expect(cartTotals.tax).toBeCloseTo(16);
    expect(cartTotals.total).toBeCloseTo(176);  
  });

  it("excludes tax-exempt items from tax calculation", () => {
    const cart: CartItem[] = [
      { price: 100, quantity: 1, isTaxExempt: true },
      { price: 100, quantity: 1 },
    ];
    const discountPercent = 0;
    const taxRate = 10;
    const cartTotals = calculateTotal(cart, discountPercent, taxRate);
    expect(cartTotals.subtotal).toBe(200);
    expect(cartTotals.discount).toBe(0);
    expect(cartTotals.tax).toBeCloseTo(10);
    expect(cartTotals.total).toBeCloseTo(210);
  });

  it("handles an empty cart", () => {
    const cart: CartItem[] = [];
    const discountPercent = 10;
    const taxRate = 10;
    const cartTotals = calculateTotal(cart, discountPercent, taxRate);
    expect(cartTotals.subtotal).toBe(0);
    expect(cartTotals.discount).toBe(0);
    expect(cartTotals.tax).toBe(0);
    expect(cartTotals.total).toBe(0);
  });

  it("handles mixed tax-exempt and taxable items with discount", () => {
    const cart: CartItem[] = [
      { price: 150, quantity: 1, isTaxExempt: true }, 
      { price: 50, quantity: 2 },
    ];
    const discountPercent = 10;
    const taxRate = 10;
    const cartTotals = calculateTotal(cart, discountPercent, taxRate);
    expect(cartTotals.subtotal).toBe(250);
    expect(cartTotals.discount).toBe(25);
    expect(cartTotals.tax).toBeCloseTo(9);
    expect(cartTotals.total).toBeCloseTo(234);
  });
  
});
});