'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, MapPin, Users, CreditCard } from 'lucide-react';
import { mockEvents } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import { logClick, logBooking } from '@/services/analyticsLogger';

export default function EventBookingPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn, user, updateUser } = useUser();
  
  const [step, setStep] = useState(1); // 1: Ticket selection, 2: Checkout, 3: Confirmation
  const [selectedTickets, setSelectedTickets] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const eventId = params.id as string;
  const event = mockEvents.find(e => e.id === eventId);

  useEffect(() => {
    if (event) {
      logClick('page-view', `/book-event/${event.id}`, { eventTitle: event.title });
      setTotalPrice(event.price * selectedTickets);
    }
  }, [event, selectedTickets]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(`/book-event/${eventId}`)}`);
    }
  }, [isLoggedIn, router, eventId]);

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Event Not Found</h1>
          <button
            onClick={() => router.push('/events')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const handleTicketChange = (tickets: number) => {
    setSelectedTickets(tickets);
    setTotalPrice(event.price * tickets);
  };

  const handleNextStep = () => {
    if (step === 1 && selectedTickets === 0) {
      alert('Please select at least one ticket');
      return;
    }
    
    logClick('booking-step', `/book-event/${event.id}`, { step: step + 1, selectedTickets, totalPrice });
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    logClick('booking-step', `/book-event/${event.id}`, { step: step - 1 });
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
    logBooking(eventId, [`GA${selectedTickets}`], totalPrice, `/book-event/${event.id}`);
    
    // Update user bookings
    if (user) {
      const newBooking = {
        id: newBookingId,
        eventId,
        seats: [`GA${selectedTickets}`],
        showtime: event.time,
        date: event.date,
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
            <h1 className="text-2xl font-bold text-white">{event.title}</h1>
            <div className="flex items-center text-gray-400 text-sm space-x-4">
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {event.venue}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(event.date).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {event.time}
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
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-700'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center text-sm text-gray-400 mb-8 space-x-8">
          <span className={step >= 1 ? 'text-blue-400 font-medium' : ''}>Select Tickets</span>
          <span className={step >= 2 ? 'text-blue-400 font-medium' : ''}>Payment</span>
          <span className={step >= 3 ? 'text-blue-400 font-medium' : ''}>Confirmation</span>
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
                        <h4 className="font-semibold text-white">General Admission</h4>
                        <p className="text-gray-400 text-sm">Access to the event</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">₹{event.price}</p>
                        <p className="text-sm text-gray-400">per ticket</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Number of tickets:</span>
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
                    <span className="text-gray-400">Event:</span>
                    <span className="font-medium text-white">{event.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Venue:</span>
                    <span className="font-medium text-white">{event.venue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="font-medium text-white">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time:</span>
                    <span className="font-medium text-white">{event.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tickets:</span>
                    <span className="font-medium text-white">{selectedTickets}</span>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">Total:</span>
                    <span className="text-2xl font-bold text-blue-400">₹{totalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  disabled={selectedTickets === 0}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
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
                    <span className="text-gray-400">Event:</span>
                    <p className="font-medium text-white">{event.title}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Venue:</span>
                    <p className="font-medium text-white">{event.venue}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Date & Time:</span>
                    <p className="font-medium text-white">{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Tickets:</span>
                    <p className="font-medium text-white">{selectedTickets} ticket{selectedTickets > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">Total Amount:</span>
                    <span className="text-2xl font-bold text-blue-400">₹{totalPrice}</span>
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
                        className="mr-3 text-blue-600 focus:ring-blue-500"
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
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                      data-testid="card-number"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                        data-testid="card-expiry"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
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
                  data-testid="back-to-tickets"
                >
                  Back to Tickets
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
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
                    <span className="text-gray-400">Event:</span>
                    <span className="font-medium text-white">{event.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Venue:</span>
                    <span className="font-medium text-white">{event.venue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date & Time:</span>
                    <span className="font-medium text-white">{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tickets:</span>
                    <span className="font-medium text-white">{selectedTickets} ticket{selectedTickets > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                    <span className="font-semibold text-white">Total Paid:</span>
                    <span className="font-bold text-blue-400">₹{totalPrice}</span>
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
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
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