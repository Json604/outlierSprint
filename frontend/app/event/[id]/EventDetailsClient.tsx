'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Clock, Calendar, MapPin, Play, Share2, Heart, ArrowLeft, Users, Music } from 'lucide-react';
import { Event } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import { logClick } from '@/services/analyticsLogger';

interface EventDetailsClientProps {
  event: Event;
}

export default function EventDetailsClient({ event }: EventDetailsClientProps) {
  const router = useRouter();
  const { selectedCity, isLoggedIn } = useUser();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    logClick('page-view', `/event/${event.id}`, { eventTitle: event.title, city: selectedCity });
  }, [event, selectedCity]);

  // Check if event is available in the selected city
  useEffect(() => {
    if (!event.city.includes(selectedCity)) {
      // If event is not available in the selected city, redirect to events page
      router.push('/events');
    }
  }, [selectedCity, event.city, router]);

  const handleBooking = () => {
    if (!isLoggedIn) {
      logClick('booking-auth-required', `/event/${event.id}`, { 
        eventId: event.id,
        date: event.date,
        time: event.time
      });
      router.push(`/auth-required?redirect=${encodeURIComponent(`/book-movie?eventId=${event.id}&date=${event.date}&showtime=${event.time}`)}&type=event&name=${encodeURIComponent(event.title)}`);
    } else {
      logClick('start-booking', `/event/${event.id}`, { 
        eventId: event.id,
        date: event.date,
        time: event.time
      });
      router.push(`/book-movie?eventId=${event.id}&date=${event.date}&showtime=${event.time}`);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    logClick('add-to-wishlist', `/event/${event.id}`, { eventId: event.id, wishlisted: !isWishlisted });
  };

  const handleShare = async () => {
    logClick('share-event', `/event/${event.id}`, { eventId: event.id });
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out ${event.title} on BookSmart`,
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Check if event is available in selected city
  const isAvailableInCity = event.city.includes(selectedCity);
  const currentVenue = event.venues[selectedCity] || 'Venue information not available';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          data-testid="back-to-events"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Events
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={event.banner}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <img
                src={event.poster}
                alt={event.title}
                className="w-48 h-72 object-cover rounded-lg shadow-xl"
              />
              
              <div className="text-white flex-1">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">{event.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Music className="h-5 w-5 mr-1" />
                    <span className="font-bold text-xl">{event.artist}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-1" />
                    <span>{formatDuration(event.duration)}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 rounded-full text-sm">
                    {event.category}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {event.language.map((lang) => (
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
                    data-testid="share-event"
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
            {/* About the Event */}
            <section className="glass-card rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">About the event</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">{event.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-white mb-2">Artist/Performer</h3>
                  <p className="text-gray-300">{event.artist}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Category</h3>
                  <p className="text-gray-300">{event.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Duration</h3>
                  <p className="text-gray-300">{formatDuration(event.duration)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Languages</h3>
                  <p className="text-gray-300">{event.language.join(', ')}</p>
                </div>
              </div>
            </section>

            {/* Event Highlights */}
            <section className="glass-card rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Event Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-300 mb-2">🎵 Live Performance</h3>
                  <p className="text-gray-300 text-sm">Experience an unforgettable live performance</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-300 mb-2">🎤 Interactive Experience</h3>
                  <p className="text-gray-300 text-sm">Engage with the artist and fellow audience</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-green-300 mb-2">📸 Photo Opportunities</h3>
                  <p className="text-gray-300 text-sm">Capture memories with exclusive photo sessions</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-300 mb-2">🎁 Exclusive Merchandise</h3>
                  <p className="text-gray-300 text-sm">Get limited edition event merchandise</p>
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
                  {/* Event Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="h-5 w-5 mr-3 text-blue-400" />
                      <div>
                        <p className="font-medium text-white">{formatDate(event.date)}</p>
                        <p className="text-sm text-gray-400">Event Date</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <Clock className="h-5 w-5 mr-3 text-green-400" />
                      <div>
                        <p className="font-medium text-white">{event.time}</p>
                        <p className="text-sm text-gray-400">Start Time</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <MapPin className="h-5 w-5 mr-3 text-red-400" />
                      <div>
                        <p className="font-medium text-white">{currentVenue}</p>
                        <p className="text-sm text-gray-400">Venue</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <Users className="h-5 w-5 mr-3 text-purple-400" />
                      <div>
                        <p className="font-medium text-white">{event.artist}</p>
                        <p className="text-sm text-gray-400">Artist/Performer</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-white mb-3">Ticket Price</h3>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-blue-400">₹{event.price}</span>
                      <p className="text-sm text-gray-400">per ticket</p>
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <button
                    onClick={handleBooking}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-glow-blue text-lg"
                    data-testid="book-tickets"
                  >
                    Book Tickets
                  </button>

                  {/* Additional Info */}
                  <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <h4 className="font-semibold text-yellow-300 mb-2">Important Information</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Entry is subject to venue guidelines</li>
                      <li>• Age restrictions may apply</li>
                      <li>• No outside food or beverages allowed</li>
                      <li>• Tickets are non-refundable</li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Event not available in {selectedCity}</p>
                  <p className="text-sm">This event is not currently available in your selected city</p>
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Available in:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {event.city.map((city) => (
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