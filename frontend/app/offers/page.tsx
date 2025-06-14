'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Tag, Calendar, Copy, Check } from 'lucide-react';
import { mockOffers } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import { logClick, logSearch } from '@/services/analyticsLogger';
import { PageLoadingSkeleton } from '@/components/LoadingSkeleton';

export default function OffersPage() {
  const { selectedCity } = useUser();
  const [offers, setOffers] = useState<typeof mockOffers>(mockOffers); // Initialize with data
  const [filteredOffers, setFilteredOffers] = useState<typeof mockOffers>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Keep skeleton for initial render

  useEffect(() => {
    logClick('page-view', '/offers', { city: selectedCity });
    
    // Show skeleton briefly for smooth UX, then show content
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedCity]);

  useEffect(() => {
    // Immediate filtering without loading state
    let filtered = offers;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(offer =>
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(offer =>
        selectedCategories.includes(offer.category) || 
        (selectedCategories.includes('All') && offer.category === 'All')
      );
    }

    setFilteredOffers(filtered);
    
    if (searchQuery) {
      logSearch(searchQuery, filtered.length, '/offers');
    }
  }, [offers, searchQuery, selectedCategories]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    logClick('filter-category', '/offers', { category, action: selectedCategories.includes(category) ? 'remove' : 'add' });
  };

  const copyCode = async (code: string, offerId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
      logClick('copy-offer-code', '/offers', { offerId, code });
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by useEffect
  };

  const categories = ['All', 'Movies', 'Events', 'Plays', 'Sports', 'Activities'];

  if (isLoading) {
    return <PageLoadingSkeleton cardType="offer\" count={6} showFilters={false} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            🎉 Exclusive Offers & Deals
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Save big on your favorite entertainment! Discover amazing deals on movies, events, plays, and more.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search offers, codes, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                  data-testid="offers-search-input"
                />
              </form>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategories.includes(category)
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  data-testid={`category-filter-${category.toLowerCase()}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        {filteredOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className="glass-card rounded-2xl shadow-2xl hover:shadow-glow transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 overflow-hidden"
                data-testid={`offer-card-${offer.id}`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                    {offer.discount}
                  </div>
                  <div className="absolute top-3 right-3 glass text-white px-3 py-1 rounded-lg text-xs">
                    {offer.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-xl text-white mb-2">
                    {offer.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {offer.description}
                  </p>
                  
                  {/* Offer Code */}
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Use Code:</p>
                        <p className="font-bold text-lg text-yellow-400">{offer.code}</p>
                      </div>
                      <button
                        onClick={() => copyCode(offer.code, offer.id)}
                        className="bg-yellow-500 text-black p-2 rounded-lg hover:bg-yellow-400 transition-colors"
                        data-testid={`copy-code-${offer.id}`}
                      >
                        {copiedCode === offer.code ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Valid Until */}
                  <div className="flex items-center text-gray-400 mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      Valid until {new Date(offer.validUntil).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/* Terms & Conditions */}
                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="font-medium text-white mb-2">Terms & Conditions:</h4>
                    <ul className="text-xs text-gray-400 space-y-1">
                      {offer.terms.map((term, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-yellow-400 mr-1">•</span>
                          {term}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button
                    onClick={() => logClick('use-offer', '/offers', { offerId: offer.id, code: offer.code })}
                    className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black py-3 px-4 rounded-xl font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105"
                    data-testid={`use-offer-${offer.id}`}
                  >
                    Use This Offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-500">
              <Tag className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2 text-gray-400">No offers found</h3>
              <p className="text-gray-500">
                {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your filters'}
              </p>
            </div>
          </div>
        )}

        {/* How to Use Section */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-8 mt-12 border border-yellow-500/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            How to Use Offers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500 text-black rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-white mb-2">Choose Your Offer</h3>
              <p className="text-gray-400 text-sm">
                Browse through our exclusive offers and find the perfect deal for your entertainment needs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 text-black rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-white mb-2">Copy the Code</h3>
              <p className="text-gray-400 text-sm">
                Click the copy button to copy the offer code to your clipboard.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-white mb-2">Apply at Checkout</h3>
              <p className="text-gray-400 text-sm">
                Paste the code during checkout to enjoy instant savings on your booking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}