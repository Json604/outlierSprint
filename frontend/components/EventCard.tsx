'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Ticket, Heart } from 'lucide-react';
import { Event } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import { logClick } from '@/services/analyticsLogger';
import { usePathname } from 'next/navigation';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, selectedCity } = useUser();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleEventClick = () => {
    logClick('event-card', pathname, { eventId: event.id, eventTitle: event.title });
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    logClick('event-wishlist', pathname, { eventId: event.id, wishlisted: !isWishlisted });
  };

  const handleBookTicketsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      logClick('book-tickets-auth-required', pathname, { eventId: event.id });
      router.push(`/auth-required?redirect=${encodeURIComponent(`/book-movie?eventId=${event.id}&date=${event.date}&showtime=${event.time}`)}&type=event&name=${encodeURIComponent(event.title)}`);
    } else {
      logClick('book-tickets-click', pathname, { eventId: event.id });
      // Redirect to the booking flow with event details
      router.push(`/book-movie?eventId=${event.id}&date=${event.date}&showtime=${event.time}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get venue for the selected city
  const currentVenue = event.venues[selectedCity] || Object.values(event.venues)[0] || 'Venue TBA';

  return (
    <div className="glass-card rounded-2xl shadow-2xl hover:shadow-glow-blue transition-all duration-300 transform hover:-translate-y-1 hover:scale-102 overflow-hidden group">
      <div className="relative overflow-hidden">
        <Link href={`/event/${event.id}`} onClick={handleEventClick} className="cursor-pointer" data-testid={`event-card-${event.id}`}>
          <img
            src={event.poster}
            alt={event.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {event.category}
        </div>

        <div className="absolute top-3 right-3">
          <button
            onClick={handleWishlistClick}
            className="glass p-2 rounded-full hover:bg-white/20 transition-all group/heart"
            data-testid={`wishlist-event-${event.id}`}
          >
            <Heart 
              className={`h-5 w-5 transition-all ${
                isWishlisted 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-white group-hover/heart:text-red-500'
              } group-hover/heart:scale-110`} 
            />
          </button>
        </div>
        
        <div className="absolute bottom-3 right-3 glass text-white px-3 py-1 rounded-lg text-sm font-medium">
          ₹{event.price}
        </div>
      </div>
      
      <div className="p-4">
        <Link href={`/event/${event.id}`} onClick={handleEventClick} className="cursor-pointer">
          <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
            {event.title}
          </h3>
        </Link>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-gray-300">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{formatDate(event.date)}</span>
            <Clock className="h-4 w-4 ml-2" />
            <span className="text-sm">{event.time}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-300">
            <MapPin className="h-4 w-4" />
            <span className="text-sm line-clamp-1">{currentVenue}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-300">
            <Ticket className="h-4 w-4" />
            <span className="text-sm">{event.artist}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {event.language.map((lang) => (
            <span
              key={lang}
              className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-md border border-blue-500/30"
            >
              {lang}
            </span>
          ))}
        </div>
        
        <button
          onClick={handleBookTicketsClick}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-glow-blue"
          data-testid={`book-tickets-${event.id}`}
        >
          Book Tickets
        </button>
      </div>
    </div>
  );
};

export default EventCard;