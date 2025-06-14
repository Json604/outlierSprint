'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Clock, Calendar, MapPin, Share2, Heart, ArrowLeft, Users, Zap } from 'lucide-react';
import { Sport } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import { logClick } from '@/services/analyticsLogger';

interface SportDetailsClientProps {
  sport: Sport;
}

export default function SportDetailsClient({ sport }: SportDetailsClientProps) {
  const router = useRouter();
  const { selectedCity, isLoggedIn } = useUser();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    logClick('page-view', `/sport/${sport.id}`, { sportTitle: sport.title, city: selectedCity });
  }, [sport, selectedCity]);

  // Check if sport is available in the selected city
  useEffect(() => {
    if (!sport.city.includes(selectedCity)) {
      // If sport is not available in the selected city, redirect to sports page
      router.push('/sports');
    }
  }, [selectedCity, sport.city, router]);

  const handleBooking = () => {
    if (!isLoggedIn) {
      logClick('booking-auth-required', `/sport/${sport.id}`, { 
        sportId: sport.id,
        date: sport.date,
        time: sport.time
      });
      router.push(`/auth-required?redirect=${encodeURIComponent(`/book-sport/${sport.id}`)}&type=sport&name=${encodeURIComponent(sport.title)}`);
    } else {
      logClick('start-booking', `/sport/${sport.id}`, { 
        sportId: sport.id,
        date: sport.date,
        time: sport.time
      });
      router.push(`/book-sport/${sport.id}`);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    logClick('add-to-wishlist', `/sport/${sport.id}`, { sportId: sport.id, wishlisted: !isWishlisted });
  };

  const handleShare = async () => {
    logClick('share-sport', `/sport/${sport.id}`, { sportId: sport.id });
    if (navigator.share) {
      try {
        await navigator.share({
          title: sport.title,
          text: `Check out ${sport.title} on BookSmart`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if sport is available in selected city
  const isAvailableInCity = sport.city.includes(selectedCity);
  const currentVenue = sport.venues[selectedCity] || 'Venue information not available';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          data-testid="back-to-sports"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Sports
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={sport.banner}
          alt={sport.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <img
                src={sport.poster}
                alt={sport.title}
                className="w-48 h-72 object-cover rounded-lg shadow-xl"
              />
              
              <div className="text-white flex-1">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">{sport.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 mr-1 text-yellow-400" />
                    <span className="font-bold text-xl">{sport.sport}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-1" />
                    <span>{sport.teams.join(' vs ')}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 px-3 py-1 rounded-full text-sm">
                    {sport.sport}
                  </span>
                  <span className="bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-full text-sm">
                    {sport.category}
                  </span>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={handleWishlist}
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors flex items-center"
                    data-testid="add-to-wishlist"
                  >
                    <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? 'text-red-500 fill-red-500' : ''}`} />
                    {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors flex items-center"
                    data-testid="share-sport"
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* About the Match */}
            <section className="glass-card rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">About the match</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">{sport.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-white mb-2">Teams</h3>
                  <p className="text-gray-300">{sport.teams.join(' vs ')}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Sport</h3>
                  <p className="text-gray-300">{sport.sport}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Category</h3>
                  <p className="text-gray-300">{sport.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Venue</h3>
                  <p className="text-gray-300">{currentVenue}</p>
                </div>
              </div>
            </section>

            {/* Match Highlights */}
            <section className="glass-card rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">What to Expect</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-300 mb-2">⚡ Live Action</h3>
                  <p className="text-gray-300 text-sm">Experience the thrill of live sports action</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-red-300 mb-2">🏆 Championship Level</h3>
                  <p className="text-gray-300 text-sm">Top-tier competition between elite teams</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-300 mb-2">🎉 Stadium Atmosphere</h3>
                  <p className="text-gray-300 text-sm">Electric crowd energy and team chants</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-green-300 mb-2">📺 Big Screen Views</h3>
                  <p className="text-gray-300 text-sm">Multiple angles and instant replays</p>
                </div>
              </div>
            </section>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Book Tickets</h2>
              
              {isAvailableInCity ? (
                <>
                  {/* Match Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="h-5 w-5 mr-3 text-orange-400" />
                      <div>
                        <p className="font-medium text-white">{formatDate(sport.date)}</p>
                        <p className="text-sm text-gray-400">Match Date</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <Clock className="h-5 w-5 mr-3 text-green-400" />
                      <div>
                        <p className="font-medium text-white">{sport.time}</p>
                        <p className="text-sm text-gray-400">Start Time</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <MapPin className="h-5 w-5 mr-3 text-red-400" />
                      <div>
                        <p className="font-medium text-white">{currentVenue}</p>
                        <p className="text-sm text-gray-400">Stadium</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <Zap className="h-5 w-5 mr-3 text-yellow-400" />
                      <div>
                        <p className="font-medium text-white">{sport.teams.join(' vs ')}</p>
                        <p className="text-sm text-gray-400">Teams</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-white mb-3">Ticket Prices</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">General:</span>
                        <span className="font-medium text-white">₹{sport.price.general}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Premium:</span>
                        <span className="font-medium text-white">₹{sport.price.premium}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">VIP:</span>
                        <span className="font-medium text-white">₹{sport.price.vip}</span>
                      </div>
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <button
                    onClick={handleBooking}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 px-6 rounded-xl font-medium hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105 shadow-glow text-lg"
                    data-testid="book-tickets"
                  >
                    Book Tickets
                  </button>

                  {/* Additional Info */}
                  <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <h4 className="font-semibold text-orange-300 mb-2">Stadium Guidelines</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Gates open 2 hours before match time</li>
                      <li>• Valid ID required for entry</li>
                      <li>• No outside food or beverages</li>
                      <li>• Security check mandatory</li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Match not available in {selectedCity}</p>
                  <p className="text-sm">This match is not scheduled in your selected city</p>
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Available in:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {sport.city.map((city) => (
                        <span key={city} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}