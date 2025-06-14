// Coupon Service for validating and applying coupon codes
import { mockOffers } from '@/lib/mockData';

export interface CouponValidationResult {
  isValid: boolean;
  discount: number;
  discountType: 'percentage' | 'fixed' | 'buy2get1';
  maxDiscount?: number;
  minAmount?: number;
  message: string;
  code?: string;
}

export const validateCoupon = (code: string, totalAmount: number, category?: string, ticketCount?: number): CouponValidationResult => {
  // Find the offer with matching code
  const offer = mockOffers.find(o => o.code.toLowerCase() === code.toLowerCase());
  
  if (!offer) {
    return {
      isValid: false,
      discount: 0,
      discountType: 'percentage',
      message: 'Invalid coupon code'
    };
  }

  // Check if offer is still valid
  const currentDate = new Date();
  const validUntil = new Date(offer.validUntil);
  
  if (currentDate > validUntil) {
    return {
      isValid: false,
      discount: 0,
      discountType: 'percentage',
      message: 'This coupon has expired'
    };
  }

  // Check category compatibility
  if (offer.category !== 'All' && category && offer.category !== category) {
    return {
      isValid: false,
      discount: 0,
      discountType: 'percentage',
      message: `This coupon is only valid for ${offer.category}`
    };
  }

  // Parse discount from offer
  let discount = 0;
  let discountType: 'percentage' | 'fixed' | 'buy2get1' = 'percentage';
  let maxDiscount: number | undefined;
  let minAmount: number | undefined;

  // Handle Buy 2 Get 1 Free offer
  if (offer.discount.toLowerCase().includes('buy 2 get 1 free')) {
    discountType = 'buy2get1';
    
    // Check if user has at least 3 tickets (to get 1 free)
    if (!ticketCount || ticketCount < 3) {
      return {
        isValid: false,
        discount: 0,
        discountType: 'buy2get1',
        message: 'You need at least 3 tickets to use this offer'
      };
    }
    
    // Calculate how many free tickets they get (1 free for every 2 purchased)
    const freeTickets = Math.floor(ticketCount / 3);
    const ticketPrice = totalAmount / ticketCount;
    discount = freeTickets * ticketPrice;
    
  } else if (offer.discount.includes('%')) {
    // Percentage discount
    discountType = 'percentage';
    discount = parseInt(offer.discount.replace(/[^\d]/g, ''));
    
    // Set max discount based on offer terms
    if (offer.code === 'MONDAY25') {
      maxDiscount = 100;
    }
  } else if (offer.discount.includes('₹')) {
    // Fixed amount discount
    discountType = 'fixed';
    discount = parseInt(offer.discount.replace(/[^\d]/g, ''));
  }

  // Set minimum amount based on offer terms
  if (offer.code === 'FIRST100') {
    minAmount = 300;
  }

  // Check minimum amount requirement
  if (minAmount && totalAmount < minAmount) {
    return {
      isValid: false,
      discount: 0,
      discountType,
      message: `Minimum booking amount of ₹${minAmount} required`
    };
  }

  // Calculate actual discount
  let actualDiscount = 0;
  if (discountType === 'buy2get1') {
    actualDiscount = discount; // Already calculated above
  } else if (discountType === 'percentage') {
    actualDiscount = (totalAmount * discount) / 100;
    if (maxDiscount && actualDiscount > maxDiscount) {
      actualDiscount = maxDiscount;
    }
  } else {
    actualDiscount = Math.min(discount, totalAmount);
  }

  // Generate appropriate success message
  let message = '';
  if (discountType === 'buy2get1') {
    const freeTickets = Math.floor((ticketCount || 0) / 3);
    message = `Buy 2 Get 1 Free applied! You got ${freeTickets} free ticket${freeTickets > 1 ? 's' : ''} and saved ₹${actualDiscount.toFixed(2)}`;
  } else {
    message = `Coupon applied! You saved ₹${actualDiscount.toFixed(2)}`;
  }

  return {
    isValid: true,
    discount: actualDiscount,
    discountType,
    maxDiscount,
    minAmount,
    message,
    code: offer.code
  };
};

export const applyCoupon = (code: string, totalAmount: number, category?: string, ticketCount?: number) => {
  return validateCoupon(code, totalAmount, category, ticketCount);
};