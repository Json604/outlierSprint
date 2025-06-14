'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Movie Card Skeleton
export const MovieCardSkeleton = () => (
  <div className="glass-card rounded-2xl overflow-hidden">
    <Skeleton className="w-full h-80" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  </div>
);

// Event Card Skeleton
export const EventCardSkeleton = () => (
  <div className="glass-card rounded-2xl overflow-hidden">
    <Skeleton className="w-full h-64" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  </div>
);

// Activity Card Skeleton
export const ActivityCardSkeleton = () => (
  <div className="glass-card rounded-2xl overflow-hidden">
    <Skeleton className="w-full h-64" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  </div>
);

// Play Card Skeleton
export const PlayCardSkeleton = () => (
  <div className="glass-card rounded-2xl overflow-hidden">
    <Skeleton className="w-full h-64" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex items-center space-x-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  </div>
);

// Sports Card Skeleton
export const SportsCardSkeleton = () => (
  <div className="glass-card rounded-2xl overflow-hidden">
    <Skeleton className="w-full h-64" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  </div>
);

// Offer Card Skeleton
export const OfferCardSkeleton = () => (
  <div className="glass-card rounded-2xl overflow-hidden">
    <Skeleton className="w-full h-48" />
    <div className="p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>
      
      <div className="border-t border-gray-700 pt-4">
        <Skeleton className="h-4 w-32 mb-2" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  </div>
);

// Gift Card Skeleton
export const GiftCardSkeleton = () => (
  <div className="glass-card rounded-2xl overflow-hidden">
    <Skeleton className="w-full h-48" />
    <div className="p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center space-x-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  </div>
);

// Page Loading Skeleton
export const PageLoadingSkeleton = ({ 
  cardType = 'movie', 
  count = 8,
  showFilters = true 
}: { 
  cardType?: 'movie' | 'event' | 'play' | 'sport' | 'activity' | 'offer' | 'gift-card';
  count?: number;
  showFilters?: boolean;
}) => {
  const getCardSkeleton = () => {
    switch (cardType) {
      case 'event': return <EventCardSkeleton />;
      case 'play': return <PlayCardSkeleton />;
      case 'sport': return <SportsCardSkeleton />;
      case 'activity': return <ActivityCardSkeleton />;
      case 'offer': return <OfferCardSkeleton />;
      case 'gift-card': return <GiftCardSkeleton />;
      default: return <MovieCardSkeleton />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters Skeleton */}
          {showFilters && (
            <div className="lg:w-1/4">
              <div className="glass-card rounded-xl p-6 sticky top-24">
                <Skeleton className="h-6 w-20 mb-4" />
                <div className="space-y-6">
                  <div>
                    <Skeleton className="h-5 w-16 mb-3" />
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Skeleton className="h-5 w-20 mb-3" />
                    <div className="space-y-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Skeleton */}
          <div className={showFilters ? "lg:w-3/4" : "w-full"}>
            {/* Controls Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-5 w-32" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>

            {/* Cards Grid Skeleton */}
            <div className={`grid gap-6 ${
              cardType === 'offer' || cardType === 'gift-card'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}>
              {[...Array(count)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  {getCardSkeleton()}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Page Skeleton
export const ProfilePageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="glass-card rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-6">
            <div className="flex items-center">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="ml-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs and Content Skeleton */}
      <div className="glass-card rounded-xl">
        <div className="border-b border-gray-700">
          <div className="flex space-x-8 px-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-24" />
            ))}
          </div>
        </div>
        <div className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gray-700 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <Skeleton className="w-16 h-20 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-6 w-20 mb-2" />
                    <Skeleton className="h-5 w-16 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Booking Page Skeleton
export const BookingPageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="flex items-center mb-8">
        <Skeleton className="w-10 h-10 rounded-full mr-4" />
        <div>
          <Skeleton className="h-6 w-48 mb-2" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>

      {/* Progress Steps Skeleton */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[...Array(3)].map((_, i) => (
            <React.Fragment key={i}>
              <Skeleton className="w-10 h-10 rounded-full" />
              {i < 2 && <Skeleton className="w-16 h-1" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center mb-8">
        <div className="flex space-x-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
        <div className="lg:col-span-1">
          <div className="glass-card rounded-xl p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
            <div className="border-t border-gray-700 pt-4 mt-6">
              <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);