'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, MapPin, Users, CreditCard } from 'lucide-react';
import { mockMovies } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import SeatSelector from '@/components/SeatSelector';
import { logClick, logBooking } from '@/services/analyticsLogger';

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, user, updateUser } = useUser();
  
  const [step, setStep] = useState(1); // 1: Seat selection, 2: Checkout, 3: Confirmation
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Get booking details from URL params
  const movieId = searchParams?.get('movieId') || '';
  const theaterId = searchParams?.get('theaterId') || '';
  const showtime = searchParams?.get('showtime') || '';
  const date = searchParams?.get('date') || '';

  const movie = mockMovies.find(m => m.id === movieId);
  const theater = movie?.theaters.find(t => t.id === theaterId);

  useEffect(() => {
    if (!movieId || !theaterId || !showtime || !date) {
      router.push('/movies');
      return;
    }

    logClick('page-view', '/book', { movieId, theaterId, showtime, date });
  }, [movieId, theaterId, showtime, date, router]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(`/book?movieId=${movieId}&theaterId=${theaterId}&showtime=${showtime}&date=${date}`)}`);
    }
  }, [isLoggedIn, router, movieId, theaterId, showtime, date]);

  if (!movie || !theater) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Booking Details Not Found</h1>
          <button
            onClick={() => router.push('/movies')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  const handleSeatSelection = (seats: string[], price: number) => {
    setSelectedSeats(seats);
    setTotalPrice(price);
  };

  const handleNextStep = () => {
    if (step === 1 && selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    
    logClick('booking-step', '/book', { step: step + 1, selectedSeats, totalPrice });
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    logClick('booking-step', '/book', { step: step - 1 });
    setStep(step - 1);
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newBookingId = `BMS${Date.now()}`;
    setBookingId(newBookingId);
    
    // Log successful booking
    logBooking(movieId, selectedSeats, totalPrice, '/book');
    
    // Update user bookings
    if (user) {
      const newBooking = {
        id: newBookingId,
        movieId,
        theaterId,
        seats: selectedSeats,
        showtime,
        date,
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

  // Generate some occupied seats for demo
  const occupiedSeats = ['A1', 'A2', 'B5', 'C10', 'D8', 'E3', 'E4', 'F15', 'G7'];

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
            <h1 className="text-2xl font-bold text-white">{movie.title}</h1>
            <div className="flex items-center text-gray-400 text-sm space-x-4">
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {theater.name}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(date).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {showtime}
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
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 ${
                    step > stepNumber ? 'bg-red-600' : 'bg-gray-700'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center text-sm text-gray-400 mb-8 space-x-8">
          <span className={step >= 1 ? 'text-red-400 font-medium' : ''}>Select Seats</span>
          <span className={step >= 2 ? 'text-red-400 font-medium' : ''}>Payment</span>
          <span className={step >= 3 ? 'text-red-400 font-medium' : ''}>Confirmation</span>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Seat Selection */}
            <div className="lg:col-span-2">
              <SeatSelector
                rows={10}
                seatsPerRow={16}
                occupiedSeats={occupiedSeats}
                seatPrices={movie.price}
                onSeatSelection={handleSeatSelection}
              />
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-xl p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-white mb-4">Booking Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Movie:</span>
                    <span className="font-medium text-white">{movie.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Theater:</span>
                    <span className="font-medium text-white">{theater.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="font-medium text-white">{new Date(date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time:</span>
                    <span className="font-medium text-white">{showtime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Seats:</span>
                    <span className="font-medium text-white">
                      {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">Total:</span>
                    <span className="text-2xl font-bold text-red-400">₹{totalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  disabled={selectedSeats.length === 0}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
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
                    <span className="text-gray-400">Movie:</span>
                    <p className="font-medium text-white">{movie.title}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Theater:</span>
                    <p className="font-medium text-white">{theater.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Date & Time:</span>
                    <p className="font-medium text-white">{new Date(date).toLocaleDateString()} at {showtime}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Seats:</span>
                    <p className="font-medium text-white">{selectedSeats.join(', ')}</p>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">Total Amount:</span>
                    <span className="text-2xl font-bold text-red-400">₹{totalPrice}</span>
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
                    { id: 'wallet', label: 'Wallet', icon: CreditCard }
                  ].map((method) => (
                    <label key={method.id} className="flex items-center p-4 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-800/30">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3 text-red-600 focus:ring-red-500"
                        data-testid={`payment-${method.id}`}
                      />
                      <method.icon className="h-5 w-5 mr-3 text-gray-400" />
                      <span className="font-medium text-white">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                      data-testid="card-number"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                        data-testid="card-expiry"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                        data-testid="card-cvv"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handlePreviousStep}
                  className="flex-1 bg-gray-700 text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  data-testid="back-to-seats"
                >
                  Back to Seats
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 disabled:bg-red-400 transition-colors"
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
                <p className="text-gray-400">Your tickets have been booked successfully</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-white mb-4">Booking Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Booking ID:</span>
                    <span className="font-medium text-white">{bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Movie:</span>
                    <span className="font-medium text-white">{movie.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Theater:</span>
                    <span className="font-medium text-white">{theater.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date & Time:</span>
                    <span className="font-medium text-white">{new Date(date).toLocaleDateString()} at {showtime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Seats:</span>
                    <span className="font-medium text-white">{selectedSeats.join(', ')}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                    <span className="font-semibold text-white">Total Paid:</span>
                    <span className="font-bold text-red-400">₹{totalPrice}</span>
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
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  data-testid="back-to-home"
                >
                  Book More Tickets
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}