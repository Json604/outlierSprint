'use client';

import React, { useState, useEffect } from 'react';
import { Gift, Heart, Star, CreditCard, Calendar, Check } from 'lucide-react';
import { mockGiftCards } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import { logClick } from '@/services/analyticsLogger';
import { PageLoadingSkeleton } from '@/components/LoadingSkeleton';
import { useRouter } from 'next/navigation';

export default function GiftCardsPage() {
  const { selectedCity, isLoggedIn } = useUser();
  const router = useRouter();
  const [giftCards, setGiftCards] = useState<typeof mockGiftCards>(mockGiftCards); // Initialize with data
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [recipientInfo, setRecipientInfo] = useState({
    name: '',
    email: '',
    message: '',
    deliveryDate: ''
  });
  const [isLoading, setIsLoading] = useState(true); // Keep skeleton for initial render

  useEffect(() => {
    logClick('page-view', '/gift-cards', { city: selectedCity });
    
    // Show skeleton briefly for smooth UX, then show content
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedCity]);

  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId);
    setSelectedAmount(null);
    logClick('gift-card-select', '/gift-cards', { cardId });
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    logClick('gift-card-amount-select', '/gift-cards', { cardId: selectedCard, amount });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecipientInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePurchase = () => {
    if (!isLoggedIn) {
      router.push(`/auth-required?redirect=${encodeURIComponent('/gift-cards')}&type=gift-card&name=Gift Card`);
      return;
    }

    if (!selectedCard || !selectedAmount || !recipientInfo.name || !recipientInfo.email) {
      alert('Please fill in all required fields');
      return;
    }

    // Navigate to payment page with gift card details
    const params = new URLSearchParams({
      cardId: selectedCard,
      amount: selectedAmount.toString(),
      recipientName: recipientInfo.name,
      recipientEmail: recipientInfo.email,
      message: recipientInfo.message,
      deliveryDate: recipientInfo.deliveryDate
    });

    logClick('gift-card-purchase-start', '/gift-cards', { 
      cardId: selectedCard, 
      amount: selectedAmount,
      recipientEmail: recipientInfo.email 
    });

    router.push(`/buy-gift-card?${params.toString()}`);
  };

  const selectedGiftCard = giftCards.find(card => card.id === selectedCard);

  if (isLoading) {
    return <PageLoadingSkeleton cardType="gift-card\" count={3} showFilters={false} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Gift className="h-16 w-16 text-pink-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Gift the Joy of Entertainment
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Perfect for any occasion! Give your loved ones the gift of movies, events, plays, and unforgettable experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gift Card Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">Choose Your Gift Card</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {giftCards.map((card) => (
                <div
                  key={card.id}
                  className={`glass-card rounded-2xl shadow-2xl hover:shadow-glow transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 overflow-hidden cursor-pointer border-2 ${
                    selectedCard === card.id ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-transparent'
                  }`}
                  onClick={() => handleCardSelect(card.id)}
                  data-testid={`gift-card-${card.id}`}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-48 object-cover"
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {card.category}
                    </div>
                    {selectedCard === card.id && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white p-2 rounded-full">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-white mb-2">
                      {card.title}
                    </h3>
                    
                    <p className="text-gray-400 mb-4 text-sm">
                      {card.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>Valid for {card.validityMonths} months</span>
                      <span className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        Perfect Gift
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Amount Selection */}
            {selectedCard && selectedGiftCard && (
              <div className="glass-card rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Select Amount</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {selectedGiftCard.denominations.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        selectedAmount === amount
                          ? 'border-pink-500 bg-pink-500/20 text-pink-300'
                          : 'border-gray-600 hover:border-gray-500 text-gray-300'
                      }`}
                      data-testid={`amount-${amount}`}
                    >
                      <div className="font-bold text-lg">₹{amount}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recipient Information */}
            {selectedCard && selectedAmount && (
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recipient Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Recipient Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={recipientInfo.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="Enter recipient's name"
                      data-testid="recipient-name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Recipient Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={recipientInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="Enter recipient's email"
                      data-testid="recipient-email"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={recipientInfo.message}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Add a personal message..."
                    data-testid="personal-message"
                  />
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Delivery Date (Optional)
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={recipientInfo.deliveryDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white"
                    data-testid="delivery-date"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Leave empty to send immediately
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Purchase Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-4">Purchase Summary</h3>
              
              {selectedCard && selectedGiftCard ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gift Card:</span>
                    <span className="font-medium text-white">{selectedGiftCard.title}</span>
                  </div>
                  
                  {selectedAmount && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Amount:</span>
                        <span className="font-medium text-white">₹{selectedAmount}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Processing Fee:</span>
                        <span className="font-medium text-white">₹0</span>
                      </div>
                      
                      <div className="border-t border-gray-700 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-white">Total:</span>
                          <span className="text-2xl font-bold text-pink-400">₹{selectedAmount}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={handlePurchase}
                        disabled={!recipientInfo.name || !recipientInfo.email}
                        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-glow"
                        data-testid="purchase-button"
                      >
                        Purchase Gift Card
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a gift card to see purchase details</p>
                </div>
              )}
              
              {/* Features */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h4 className="font-semibold text-white mb-3">Why Choose Our Gift Cards?</h4>
                <div className="space-y-3 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-400 mr-2" />
                    <span>Instant digital delivery</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-400 mr-2" />
                    <span>No expiry date worries</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-400 mr-2" />
                    <span>Use across all categories</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-400 mr-2" />
                    <span>Perfect for any occasion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl p-8 mt-12 border border-pink-500/20">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            How Gift Cards Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-white mb-2">🎬 Choose & Buy</h3>
              <p className="text-gray-400 text-sm">
                Select your preferred gift card and amount, then complete the purchase.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-white mb-2">🎵 Instant Delivery</h3>
              <p className="text-gray-400 text-sm">
                The gift card is delivered instantly to the recipient's email.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-white mb-2">💳 Easy Redemption</h3>
              <p className="text-gray-400 text-sm">
                Recipient can use the gift card code during checkout on BookMyShow.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-white mb-2">💳 Enjoy Entertainment</h3>
              <p className="text-gray-400 text-sm">
                Book movies, events, plays, and create unforgettable memories.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}