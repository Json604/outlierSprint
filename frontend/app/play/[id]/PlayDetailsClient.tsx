'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Clock, Calendar, MapPin, Play as PlayIcon, Share2, Heart, ArrowLeft, Users, Theater } from 'lucide-react';
import { Play } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import { logClick } from '@/services/analyticsLogger';

interface PlayDetailsClientProps {
  play: Play;
}

export default function PlayDetailsClient({ play }: PlayDetailsClientProps) {
  const router = useRouter();
  const { selectedCity, isLoggedIn } = useUser();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    logClick('page-view', `/play/${play.id}`, { playTitle: play.title, city: selectedCity });
    // Set default date to first available date
    if (play.dates.length > 0) {
      setSelectedDate(play.dates[0]);
    }
  }, [play, selectedCity]);

  // Check if play is available in the selected city
  useEffect(() => {
    if (!play.city.includes(selectedCity)) {
      // If play is not available in the selected city, redirect to plays page
      router.push('/plays');
    }
  }, [selectedCity, play.city, router]);

  const handleBooking = (showtime: string) => {
    if (!isLoggedIn) {
      logClick('booking-auth-required', `/play/${play.id}`, { 
        playId: play.id,
        date: selectedDate,
        showtime
      });
      router.push(`/auth-required?redirect=${encodeURIComponent(`/book-play/${play.id}`)}&type=play&name=${encodeURIComponent(play.title)}`);
    } else {
      logClick('start-booking', `/play/${play.id}`, { 
        playId: play.id,
        date: selectedDate,
        showtime
      });
      router.push(`/book-play/${play.id}`);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    logClick('add-to-wishlist', `/play/${play.id}`, { playId: play.id, wishlisted: !isWishlisted });
  };

  const handleShare = async () => {
    logClick('share-play', `/play/${play.id}`, { playId: play.id });
    if (navigator.share) {
      try {
        await navigator.share({
          title: play.title,
          text: `Check out ${play.title} on BookSmart`,
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
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Check if play is available in selected city
  const isAvailableInCity = play.city.includes(selectedCity);
  const currentVenue = play.venues[selectedCity] || 'Venue information not available';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          data-testid="back-to-plays"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Plays
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={play.banner}
          alt={play.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <img
                src={play.poster}
                alt={play.title}
                className="w-48 h-72 object-cover rounded-lg shadow-xl"
              />
              
              <div className="text-white flex-1">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">{play.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                    <span className="font-bold text-xl">{play.rating}/5</span>
                    <span className="text-gray-300 ml-2">({play.votes.toLocaleString()} votes)</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-1" />
                    <span>{formatDuration(play.duration)}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {play.genre.map((g) => (
                    <span key={g} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      {g}
                    </span>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {play.language.map((lang) => (
                    <span key={lang} className="bg-purple-600 px-3 py-1 rounded-full text-sm">
                      {lang}
                    </span>
                  ))}
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
                    data-testid="share-play"
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
            {/* About the Play */}
            <section className="glass-card rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">About the play</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">{play.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-white mb-2">Cast</h3>
                  <p className="text-gray-300">{play.cast.join(', ')}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Director</h3>
                  <p className="text-gray-300">{play.director}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Duration</h3>
                  <p className="text-gray-300">{formatDuration(play.duration)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Languages</h3>
                  <p className="text-gray-300">{play.language.join(', ')}</p>
                </div>
              </div>
            </section>

            {/* Play Highlights */}
            <section className="glass-card rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">What to Expect</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-300 mb-2">🎭 Live Theatre</h3>
                  <p className="text-gray-300 text-sm">Experience the magic of live theatrical performance</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-300 mb-2">🎨 Stunning Visuals</h3>
                  <p className="text-gray-300 text-sm">Beautiful sets, costumes, and lighting design</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-green-300 mb-2">🎪 Immersive Experience</h3>
                  <p className="text-gray-300 text-sm">Get lost in the world of the story</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-300 mb-2">⭐ Award-Winning</h3>
                  <p className="text-gray-300 text-sm">Critically acclaimed production</p>
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
                  {/* Venue Info */}
                  <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center text-gray-300 mb-2">
                      <Theater className="h-5 w-5 mr-3 text-purple-400" />
                      <div>
                        <p className="font-medium text-white">{currentVenue}</p>
                        <p className="text-sm text-gray-400">Theatre Venue</p>
                      </div>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-white mb-3">Select Date</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {play.dates.map((date) => (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                            selectedDate === date
                              ? 'bg-purple-600 text-white border-purple-600'
                              : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
                          }`}
                          data-testid={`date-${date}`}
                        >
                          {formatDate(date)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Showtimes */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-white mb-3">Showtimes</h3>
                    <div className="flex flex-wrap gap-2">
                      {play.showtimes.map((showtime) => (
                        <button
                          key={showtime}
                          onClick={() => handleBooking(showtime)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
                          data-testid={`showtime-${showtime.replace(/[:\s]/g, '')}`}
                        >
                          {showtime}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-white mb-3">Ticket Prices</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Regular:</span>
                        <span className="font-medium text-white">₹{play.price.regular}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Premium:</span>
                        <span className="font-medium text-white">₹{play.price.premium}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">VIP:</span>
                        <span className="font-medium text-white">₹{play.price.vip}</span>
                      </div>
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <button
                    onClick={() => handleBooking(play.showtimes[0])}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-glow text-lg"
                    data-testid="book-tickets"
                  >
                    Book Tickets
                  </button>

                  {/* Additional Info */}
                  <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <h4 className="font-semibold text-purple-300 mb-2">Theatre Guidelines</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Please arrive 30 minutes before showtime</li>
                      <li>• Late entry may not be permitted</li>
                      <li>• Photography/recording is prohibited</li>
                      <li>• Dress code: Smart casual recommended</li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Play not available in {selectedCity}</p>
                  <p className="text-sm">This play is not currently showing in your selected city</p>
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Available in:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {play.city.map((city) => (
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