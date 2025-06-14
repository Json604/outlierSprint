'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Play, Star, Calendar, MapPin, ArrowRight, Sparkles, Zap, Crown, Ticket } from 'lucide-react';
import { mockMovies, mockEvents } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import MovieCard from '@/components/MovieCard';
import EventCard from '@/components/EventCard';
import { logClick } from '@/services/analyticsLogger';

export default function Home() {
  const { selectedCity } = useUser();

  useEffect(() => {
    // Log page view
    logClick('page-view', '/', { city: selectedCity });
  }, [selectedCity]);

  const featuredMovies = mockMovies
    .filter(movie => movie.city.includes(selectedCity))
    .slice(0, 6);

  const featuredEvents = mockEvents
    .filter(event => event.city.includes(selectedCity))
    .slice(0, 4);

  const handleSectionClick = (section: string) => {
    logClick('homepage-section', '/', { section });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
              Book Your Perfect
              <span className="block relative">
                {/* Expanded glowing container that covers the full parent container */}
                <div className="absolute -inset-20 bg-gradient-to-r from-yellow-400/20 via-pink-500/20 to-purple-600/20 blur-3xl rounded-full animate-pulse"></div>
                <span className="relative bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse-glow">
                  Entertainment
                </span>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Discover the latest movies, events, and experiences in {selectedCity}. 
              Your gateway to unforgettable moments starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/movies"
                onClick={() => handleSectionClick('hero-movies')}
                className="group bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-pink-700 transition-all inline-flex items-center justify-center shadow-glow-red hover:shadow-2xl transform hover:scale-105"
                data-testid="hero-movies-button"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Explore Movies
              </Link>
              <Link
                href="/events"
                onClick={() => handleSectionClick('hero-events')}
                className="group glass text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all inline-flex items-center justify-center transform hover:scale-105"
                data-testid="hero-events-button"
              >
                <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Discover Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Movies Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Featured Movies in {selectedCity}
              </h2>
              <p className="text-gray-400">Blockbusters and critically acclaimed films</p>
            </div>
            <Link
              href="/movies"
              onClick={() => handleSectionClick('featured-movies-view-all')}
              className="flex items-center text-purple-400 hover:text-purple-300 font-medium group"
              data-testid="view-all-movies"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {featuredMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg text-gray-400">No movies available in {selectedCity}</p>
                <p className="text-sm text-gray-500">Try selecting a different city</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Upcoming Events in {selectedCity}
              </h2>
              <p className="text-gray-400">Concerts, shows, and live experiences</p>
            </div>
            <Link
              href="/events"
              onClick={() => handleSectionClick('featured-events-view-all')}
              className="flex items-center text-blue-400 hover:text-blue-300 font-medium group"
              data-testid="view-all-events"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg text-gray-400">No events available in {selectedCity}</p>
                <p className="text-sm text-gray-500">Try selecting a different city</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 glass px-6 py-3 rounded-full">
                <Zap className="h-5 w-5 text-yellow-400" />
                <span className="text-sm font-medium text-white">Limited Time Offers</span>
                <Zap className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-4 text-white">
              🎉 Special Offers This Week!
            </h2>
            <p className="text-xl mb-8 text-gray-200">
              Get up to 25% off on movie tickets and exclusive discounts on events
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="glass-card p-6 rounded-xl hover:scale-105 transition-transform">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-4 mx-auto">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">🎬 Movie Monday</h3>
                <p className="text-gray-300">25% off all movie tickets every Monday</p>
              </div>
              
              <div className="glass-card p-6 rounded-xl hover:scale-105 transition-transform">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4 mx-auto">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">🎵 Weekend Events</h3>
                <p className="text-gray-300">Buy 2 get 1 free on event tickets</p>
              </div>
              
              <div className="glass-card p-6 rounded-xl hover:scale-105 transition-transform">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-4 mx-auto">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">💳 First Booking</h3>
                <p className="text-gray-300">₹100 off on your first booking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-950 text-white border-t border-gray-800">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <Ticket className="h-10 w-10 text-red-500" />
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-lg"></div>
                </div>
                <span className="text-2xl font-bold gradient-text">BookMyShow</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                India's largest entertainment ticketing platform. Book tickets for movies, events, plays, sports, and activities across 650+ cities.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-6 text-white">Entertainment</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/movies" className="hover:text-white transition-colors">Movies</Link></li>
                <li><Link href="/events" className="hover:text-white transition-colors">Events</Link></li>
                <li><Link href="/plays" className="hover:text-white transition-colors">Plays</Link></li>
                <li><Link href="/sports" className="hover:text-white transition-colors">Sports</Link></li>
                <li><Link href="/activities" className="hover:text-white transition-colors">Activities</Link></li>
                <li><Link href="/offers" className="hover:text-white transition-colors">Offers</Link></li>
                <li><Link href="/gift-cards" className="hover:text-white transition-colors">Gift Cards</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-6 text-white">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/help-center" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/list-your-show" className="hover:text-white transition-colors">List Your Show</Link></li>
              </ul>
            </div>

            {/* Top Cities */}
            <div>
              <h4 className="font-semibold mb-6 text-white">Top Cities</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Mumbai</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Delhi NCR</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bangalore</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chennai</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hyderabad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kolkata</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pune</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} BookMyShow. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}