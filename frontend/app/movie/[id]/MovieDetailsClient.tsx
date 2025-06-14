'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Clock, Calendar, MapPin, Play, Share2, Heart, ArrowLeft } from 'lucide-react';
import { Movie } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import { logClick } from '@/services/analyticsLogger';

interface MovieDetailsClientProps {
  movie: Movie;
}

export default function MovieDetailsClient({ movie }: MovieDetailsClientProps) {
  const router = useRouter();
  const { selectedCity, isLoggedIn } = useUser();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    logClick('page-view', `/movie/${movie.id}`, { movieTitle: movie.title, city: selectedCity });
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, [movie, selectedCity]);

  // Check if movie is available in the selected city
  useEffect(() => {
    if (!movie.city.includes(selectedCity)) {
      // If movie is not available in the selected city, redirect to movies page
      router.push('/movies');
    }
  }, [selectedCity, movie.city, router]);

  const handleBooking = (theaterId: string, showtime: string) => {
    if (!isLoggedIn) {
      logClick('booking-auth-required', `/movie/${movie.id}`, { 
        movieId: movie.id, 
        theaterId, 
        showtime, 
        date: selectedDate 
      });
      router.push(`/auth-required?redirect=${encodeURIComponent(`/book-movie?movieId=${movie.id}&theaterId=${theaterId}&showtime=${showtime}&date=${selectedDate}`)}&type=movie&name=${encodeURIComponent(movie.title)}`);
    } else {
      logClick('start-booking', `/movie/${movie.id}`, { 
        movieId: movie.id, 
        theaterId, 
        showtime, 
        date: selectedDate 
      });
      router.push(`/book-movie?movieId=${movie.id}&theaterId=${theaterId}&showtime=${showtime}&date=${selectedDate}`);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    logClick('add-to-wishlist', `/movie/${movie.id}`, { movieId: movie.id, wishlisted: !isWishlisted });
  };

  const handleShare = async () => {
    logClick('share-movie', `/movie/${movie.id}`, { movieId: movie.id });
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: `Check out ${movie.title} on BookSmart`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Generate next 7 days for date selection
  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    return days;
  };

  const availableDays = getNextDays();

  // Filter theaters for the selected city
  const availableTheaters = movie.theaters.filter(theater => theater.city === selectedCity);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          data-testid="back-to-movies"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Movies
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={movie.banner}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-48 h-72 object-cover rounded-lg shadow-xl"
              />
              
              <div className="text-white flex-1">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">{movie.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                    <span className="font-bold text-xl">{movie.rating}/5</span>
                    <span className="text-gray-300 ml-2">({movie.votes.toLocaleString()} votes)</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-1" />
                    <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genre.map((g) => (
                    <span key={g} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      {g}
                    </span>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.language.map((lang) => (
                    <span key={lang} className="bg-blue-600 px-3 py-1 rounded-full text-sm">
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
                    data-testid="share-movie"
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
            {/* About the Movie */}
            <section className="glass-card rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">About the movie</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">{movie.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-white mb-2">Cast</h3>
                  <p className="text-gray-300">{movie.cast.join(', ')}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Director</h3>
                  <p className="text-gray-300">{movie.director}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Release Date</h3>
                  <p className="text-gray-300">
                    {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Languages</h3>
                  <p className="text-gray-300">{movie.language.join(', ')}</p>
                </div>
              </div>
            </section>

            {/* Trailer Section */}
            <section className="glass-card rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Trailer</h2>
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                <button
                  className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transition-colors"
                  data-testid="play-trailer"
                >
                  <Play className="h-8 w-8" />
                </button>
              </div>
            </section>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Book Tickets</h2>
              
              {/* Date Selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-white mb-3">Select Date</h3>
                <div className="flex flex-wrap gap-2">
                  {availableDays.map((day) => (
                    <button
                      key={day.date}
                      onClick={() => setSelectedDate(day.date)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        selectedDate === day.date
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
                      }`}
                      data-testid={`date-${day.date}`}
                    >
                      {day.display}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theater and Showtime Selection */}
              {availableTheaters.length > 0 ? (
                availableTheaters.map((theater) => (
                  <div key={theater.id} className="mb-6 p-4 border border-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-white">{theater.name}</h4>
                        <p className="text-sm text-gray-400 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {theater.address}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-300">Showtimes:</p>
                      <div className="flex flex-wrap gap-2">
                        {theater.showtimes.map((showtime) => (
                          <button
                            key={showtime}
                            onClick={() => handleBooking(theater.id, showtime)}
                            className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-red-700 hover:to-pink-700 transition-all transform hover:scale-105"
                            data-testid={`showtime-${theater.id}-${showtime.replace(/[:\s]/g, '')}`}
                          >
                            {showtime}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-400">
                      <div className="flex justify-between">
                        <span>Regular: ₹{movie.price.regular}</span>
                        <span>Premium: ₹{movie.price.premium}</span>
                        <span>Executive: ₹{movie.price.executive}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No theaters available in {selectedCity}</p>
                  <p className="text-sm">This movie is not currently showing in your selected city</p>
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Available in:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {movie.city.map((city) => (
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