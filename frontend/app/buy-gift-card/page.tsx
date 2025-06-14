'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Gift, CreditCard, Users, Calendar, Wallet } from 'lucide-react';
import { mockGiftCards } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import { logClick } from '@/services/analyticsLogger';

export default function BuyGiftCardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, user, updateUser } = useUser();
  
  const [step, setStep] = useState(1); // 1: Review, 2: Payment, 3: Confirmation
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseId, setPurchaseId] = useState('');

  // Payment form data
  const [paymentData, setPaymentData] = useState({
    // Card details
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    // UPI details
    upiId: '',
    // Wallet details
    walletProvider: '',
    walletPin: ''
  });

  // Get gift card details from URL params
  const cardId = searchParams?.get('cardId') || '';
  const amount = parseInt(searchParams?.get('amount') || '0');
  const recipientName = searchParams?.get('recipientName') || '';
  const recipientEmail = searchParams?.get('recipientEmail') || '';
  const message = searchParams?.get('message') || '';
  const deliveryDate = searchParams?.get('deliveryDate') || '';

  const giftCard = mockGiftCards.find(card => card.id === cardId);

  useEffect(() => {
    if (!cardId || !amount || !recipientName || !recipientEmail) {
      router.push('/gift-cards');
      return;
    }

    logClick('page-view', '/buy-gift-card', { cardId, amount, recipientEmail });
  }, [cardId, amount, recipientName, recipientEmail, router]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(`/buy-gift-card?${searchParams?.toString()}`)}`);
    }
  }, [isLoggedIn, router, searchParams]);

  if (!giftCard) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Gift Card Not Found</h1>
          <button
            onClick={() => router.push('/gift-cards')}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
          >
            Back to Gift Cards
          </button>
        </div>
      </div>
    );
  }

  const handleNextStep = () => {
    logClick('gift-card-step', '/buy-gift-card', { step: step + 1, amount });
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    if (step === 1) {
      router.back();
    } else {
      logClick('gift-card-step', '/buy-gift-card', { step: step - 1 });
      setStep(step - 1);
    }
  };

  const handlePaymentDataChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const validatePaymentData = () => {
    switch (paymentMethod) {
      case 'card':
        if (!paymentData.cardNumber || !paymentData.cardExpiry || !paymentData.cardCvv || !paymentData.cardName) {
          alert('Please fill in all card details');
          return false;
        }
        break;
      case 'upi':
        if (!paymentData.upiId) {
          alert('Please enter your UPI ID');
          return false;
        }
        // Basic UPI ID validation
        if (!paymentData.upiId.includes('@')) {
          alert('Please enter a valid UPI ID (e.g., user@paytm)');
          return false;
        }
        break;
      case 'wallet':
        if (!paymentData.walletProvider || !paymentData.walletPin) {
          alert('Please select wallet provider and enter PIN');
          return false;
        }
        break;
      default:
        alert('Please select a payment method');
        return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validatePaymentData()) {
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newPurchaseId = `GC${Date.now()}`;
    setPurchaseId(newPurchaseId);
    
    // Log successful purchase
    logClick('gift-card-purchase-success', '/buy-gift-card', { 
      cardId, 
      amount, 
      recipientEmail,
      paymentMethod,
      purchaseId: newPurchaseId 
    });
    
    setIsProcessing(false);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={handlePreviousStep}
            className="mr-4 p-2 hover:bg-gray-700 rounded-full transition-colors"
            data-testid="back-button"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Purchase Gift Card</h1>
            <p className="text-gray-400">{giftCard.title}</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-pink-600 text-white' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 ${
                    step > stepNumber ? 'bg-pink-600' : 'bg-gray-700'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center text-sm text-gray-400 mb-8 space-x-8">
          <span className={step >= 1 ? 'text-pink-400 font-medium' : ''}>Review Details</span>
          <span className={step >= 2 ? 'text-pink-400 font-medium' : ''}>Payment</span>
          <span className={step >= 3 ? 'text-pink-400 font-medium' : ''}>Confirmation</span>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="glass-card rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Review Your Gift Card</h2>
              
              {/* Gift Card Preview */}
              <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-6 mb-6 border border-pink-500/30">
                <div className="flex items-center space-x-4 mb-4">
                  <Gift className="h-12 w-12 text-pink-400" />
                  <div>
                    <h3 className="text-xl font-bold text-white">{giftCard.title}</h3>
                    <p className="text-gray-300">{giftCard.description}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-400 mb-2">₹{amount}</div>
                  <p className="text-gray-300">Gift Card Value</p>
                </div>
              </div>

              {/* Recipient Details */}
              <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-white mb-4">Recipient Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="font-medium text-white">{recipientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="font-medium text-white">{recipientEmail}</span>
                  </div>
                  {message && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Message:</span>
                      <span className="font-medium text-white max-w-xs text-right">{message}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Delivery:</span>
                    <span className="font-medium text-white">
                      {deliveryDate ? new Date(deliveryDate).toLocaleDateString() : 'Immediately'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-700 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">Total Amount:</span>
                  <span className="text-2xl font-bold text-pink-400">₹{amount}</span>
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-700 hover:to-purple-700 transition-all"
                data-testid="proceed-to-payment"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="glass-card rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Payment Details</h2>
              
              {/* Purchase Summary */}
              <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-white mb-4">Purchase Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gift Card:</span>
                    <span className="font-medium text-white">{giftCard.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Recipient:</span>
                    <span className="font-medium text-white">{recipientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="font-medium text-white">₹{amount}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                    <span className="text-lg font-semibold text-white">Total:</span>
                    <span className="text-xl font-bold text-pink-400">₹{amount}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <h3 className="font-semibold text-white mb-4">Payment Method</h3>
                <div className="space-y-3">
                  {[
                    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                    { id: 'upi', label: 'UPI', icon: Users },
                    { id: 'wallet', label: 'Wallet', icon: Wallet }
                  ].map((method) => (
                    <label key={method.id} className="flex items-center p-4 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-800/30">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3 text-pink-600 focus:ring-pink-500"
                        data-testid={`payment-${method.id}`}
                      />
                      <method.icon className="h-5 w-5 mr-3 text-gray-400" />
                      <span className="font-medium text-white">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Forms */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Cardholder Name *</label>
                    <input
                      type="text"
                      value={paymentData.cardName}
                      onChange={(e) => handlePaymentDataChange('cardName', e.target.value)}
                      placeholder="Enter cardholder name"
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-gray-400"
                      data-testid="card-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Card Number *</label>
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => handlePaymentDataChange('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-gray-400"
                      data-testid="card-number"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Date *</label>
                      <input
                        type="text"
                        value={paymentData.cardExpiry}
                        onChange={(e) => handlePaymentDataChange('cardExpiry', e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-gray-400"
                        data-testid="card-expiry"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">CVV *</label>
                      <input
                        type="text"
                        value={paymentData.cardCvv}
                        onChange={(e) => handlePaymentDataChange('cardCvv', e.target.value)}
                        placeholder="123"
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-gray-400"
                        data-testid="card-cvv"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">UPI ID *</label>
                    <input
                      type="text"
                      value={paymentData.upiId}
                      onChange={(e) => handlePaymentDataChange('upiId', e.target.value)}
                      placeholder="yourname@paytm"
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-gray-400"
                      data-testid="upi-id"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your UPI ID (e.g., yourname@paytm, yourname@gpay, yourname@phonepe)
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Wallet Provider *</label>
                    <select
                      value={paymentData.walletProvider}
                      onChange={(e) => handlePaymentDataChange('walletProvider', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white"
                      data-testid="wallet-provider"
                    >
                      <option value="">Select Wallet</option>
                      <option value="paytm">Paytm Wallet</option>
                      <option value="phonepe">PhonePe Wallet</option>
                      <option value="googlepay">Google Pay</option>
                      <option value="amazonpay">Amazon Pay</option>
                      <option value="mobikwik">MobiKwik</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Wallet PIN *</label>
                    <input
                      type="password"
                      value={paymentData.walletPin}
                      onChange={(e) => handlePaymentDataChange('walletPin', e.target.value)}
                      placeholder="Enter your wallet PIN"
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-gray-400"
                      data-testid="wallet-pin"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your 4-6 digit wallet PIN for secure payment
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handlePreviousStep}
                  className="flex-1 bg-gray-700 text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  data-testid="back-to-review"
                >
                  Back to Review
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 transition-colors"
                  data-testid="pay-now"
                >
                  {isProcessing ? 'Processing...' : `Pay ₹${amount}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="glass-card rounded-xl p-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Gift Card Purchased!</h2>
                <p className="text-gray-400">Your gift card has been sent successfully</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-white mb-4">Purchase Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Purchase ID:</span>
                    <span className="font-medium text-white">{purchaseId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gift Card:</span>
                    <span className="font-medium text-white">{giftCard.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Recipient:</span>
                    <span className="font-medium text-white">{recipientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="font-medium text-white">{recipientEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment Method:</span>
                    <span className="font-medium text-white capitalize">{paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Delivery:</span>
                    <span className="font-medium text-white">
                      {deliveryDate ? new Date(deliveryDate).toLocaleDateString() : 'Sent immediately'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                    <span className="font-semibold text-white">Amount Paid:</span>
                    <span className="font-bold text-pink-400">₹{amount}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                <p className="text-blue-300 text-sm">
                  📧 The gift card has been sent to <strong>{recipientEmail}</strong>
                  {deliveryDate ? ` and will be delivered on ${new Date(deliveryDate).toLocaleDateString()}` : ' immediately'}.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/gift-cards')}
                  className="flex-1 bg-gray-700 text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  data-testid="buy-more-gift-cards"
                >
                  Buy More Gift Cards
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-700 hover:to-purple-700 transition-colors"
                  data-testid="back-to-home"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}