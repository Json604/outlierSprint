'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, MapPin, Users, CreditCard, Zap, Wallet } from 'lucide-react';
import { Activity } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import { logClick, logBooking } from '@/services/analyticsLogger';

interface ActivityBookingClientProps {
  activity: Activity;
}

export default function ActivityBookingClient({ activity }: ActivityBookingClientProps) {
  const router = useRouter();
  const { isLoggedIn, user, updateUser, selectedCity } = useUser();
  
  const [step, setStep] = useState(1); // 1: Ticket selection, 2: Checkout, 3: Confirmation
  const [selectedTickets, setSelectedTickets] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingId, setBookingId] = useState('');

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
    walletAddress: ''
  });

  useEffect(() => {
    logClick('page-view', `/book-activity/${activity.id}`, { activityTitle: activity.title });
    setTotalPrice(activity.price * selectedTickets);
  }, [activity, selectedTickets]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(`/book-activity/${activity.id}`)}`);
    }
  }, [isLoggedIn, router, activity.id]);

  const handleTicketChange = (tickets: number) => {
    setSelectedTickets(tickets);
    setTotalPrice(activity.price * tickets);
  };

  const handleNextStep = () => {
    if (step === 1 && selectedTickets === 0) {
      alert('Please select at least one ticket');
      return;
    }
    
    logClick('booking-step', `/book-activity/${activity.id}`, { step: step + 1, selectedTickets, totalPrice });
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    logClick('booking-step', `/book-activity/${activity.id}`, { step: step - 1 });
    setStep(step - 1);
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
        if (!paymentData.walletProvider || !paymentData.walletAddress) {
          alert('Please select wallet provider and enter wallet address');
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
    
    const newBookingId = `BMS${Date.now()}`;
    setBookingId(newBookingId);
    
    // Log successful booking
    logBooking(activity.id, [`GA${selectedTickets}`], totalPrice, `/book-activity/${activity.id}`);
    
    // Update user bookings
    if (user) {
      const newBooking = {
        id: newBookingId,
        activityId: activity.id,
        seats: [`GA${selectedTickets}`],
        showtime: activity.time,
        date: activity.date,
        totalPrice,
        status: 'confirmed' as const,
        bookingDate: new Date().toISOString().split('T')[0]
      };
      
      updateUser({
        bookings: [...user.bookings, newBooking]
      });
    }
    
    setIsProcessing(false);
    setStep(3);
  };

  const currentVenue = activity.venues[selectedCity] || Object.values(activity.venues)[0] || 'Venue TBA';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => step === 1 ? router.back() : handlePreviousStep()}
            className="mr-4 p-2 hover:bg-gray-700 rounded-full transition-colors"
            data-testid="back-button"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{activity.title}</h1>
            <div className="flex items-center text-gray-400 text-sm space-x-4">
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {currentVenue}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(activity.date).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {activity.time}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 ${
                    step > stepNumber ? 'bg-green-600' : 'bg-gray-700'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center text-sm text-gray-400 mb-8 space-x-8">
          <span className={step >= 1 ? 'text-green-400 font-medium' : ''}>Select Tickets</span>
          <span className={step >= 2 ? 'text-green-400 font-medium' : ''}>Payment</span>
          <span className={step >= 3 ? 'text-green-400 font-medium' : ''}>Confirmation</span>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ticket Selection */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Select Tickets</h3>
                
                <div className="space-y-4">
                  <div className="border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-white">Activity Participation</h4>
                        <p className="text-gray-400 text-sm">Join the {activity.title} session</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">₹{activity.price}</p>
                        <p className="text-sm text-gray-400">per person</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Number of participants:</span>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleTicketChange(Math.max(0, selectedTickets - 1))}
                          className="w-8 h-8 bg-gray-700 text-white rounded-full hover:bg-gray-600"
                          disabled={selectedTickets <= 1}
                        >
                          -
                        </button>
                        <span className="text-white font-medium w-8 text-center">{selectedTickets}</span>
                        <button
                          onClick={() => handleTicketChange(Math.min(8, selectedTickets + 1))}
                          className="w-8 h-8 bg-gray-700 text-white rounded-full hover:bg-gray-600"
                          disabled={selectedTickets >= 8}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-xl p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-white mb-4">Booking Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Activity:</span>
                    <span className="font-medium text-white">{activity.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Venue:</span>
                    <span className="font-medium text-white">{currentVenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="font-medium text-white">{new Date(activity.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time:</span>
                    <span className="font-medium text-white">{activity.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Participants:</span>
                    <span className="font-medium text-white">{selectedTickets}</span>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">Total:</span>
                    <span className="text-2xl font-bold text-green-400">₹{totalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  disabled={selectedTickets === 0}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                  data-testid="proceed-to-payment"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="glass-card rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Payment Details</h2>
              
              {/* Booking Summary */}
              <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-white mb-4">Booking Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Activity:</span>
                    <p className="font-medium text-white">{activity.title}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Venue:</span>
                    <p className="font-medium text-white">{currentVenue}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Date & Time:</span>
                    <p className="font-medium text-white">{new Date(activity.date).toLocaleDateString()} at {activity.time}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Participants:</span>
                    <p className="font-medium text-white">{selectedTickets} participant{selectedTickets > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-400">₹{totalPrice}</span>
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
                        className="mr-3 text-green-600 focus:ring-green-500"
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
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
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
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
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
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
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
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
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
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
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
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">Wallet Address *</label>
                    <input
                      type="text"
                      value={paymentData.walletAddress}
                      onChange={(e) => handlePaymentDataChange('walletAddress', e.target.value)}
                      placeholder="Enter your wallet address"
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                      data-testid="wallet-address"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your wallet address for secure payment
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handlePreviousStep}
                  className="flex-1 bg-gray-700 text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  data-testid="back-to-tickets"
                >
                  Back to Tickets
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-green-400 transition-colors"
                  data-testid="pay-now"
                >
                  {isProcessing ? 'Processing...' : `Pay ₹${totalPrice}`}
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
                <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
                <p className="text-gray-400">Your activity booking has been confirmed successfully</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-white mb-4">Booking Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Booking ID:</span>
                    <span className="font-medium text-white">{bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Activity:</span>
                    <span className="font-medium text-white">{activity.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Venue:</span>
                    <span className="font-medium text-white">{currentVenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date & Time:</span>
                    <span className="font-medium text-white">{new Date(activity.date).toLocaleDateString()} at {activity.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Participants:</span>
                    <span className="font-medium text-white">{selectedTickets} participant{selectedTickets > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment Method:</span>
                    <span className="font-medium text-white capitalize">
                      {paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                    <span className="font-semibold text-white">Total Paid:</span>
                    <span className="font-bold text-green-400">₹{totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/profile')}
                  className="flex-1 bg-gray-700 text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  data-testid="view-bookings"
                >
                  View My Bookings
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  data-testid="back-to-home"
                >
                  Book More Activities
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}