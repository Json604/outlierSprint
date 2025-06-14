'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Trophy, Heart, Users } from 'lucide-react';
import { Sport } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import { logClick } from '@/services/analyticsLogger';
import { usePathname } from 'next/navigation';

interface SportCardProps {
  sport: Sport;
}

const SportCard: React.FC<SportCardProps> = ({ sport }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, selectedCity } = useUser();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleSportClick = () => {
    logClick('sport-card', pathname, { sportId: sport.id, sportTitle: sport.title });
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    logClick('sport-wishlist', pathname, { sportId: sport.id, wishlisted: !isWishlisted });
  };

  const handleBookTicketsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      logClick('book-tickets-auth-required', pathname, { sportId: sport.id });
      router.push(`/auth-required?redirect=${encodeURIComponent(`/book-sport/${sport.id}`)}&type=sport&name=${encodeURIComponent(sport.title)}`);
    } else {
      logClick('book-tickets-click', pathname, { sportId: sport.id });
      router.push(`/book-sport/${sport.id}`);
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
  const currentVenue = sport.venues[selectedCity] || Object.values(sport.venues)[0] || 'Venue TBA';

  return (
    <div className="glass-card rounded-2xl shadow-2xl hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1 hover:scale-102 overflow-hidden group">
      <div className="relative overflow-hidden">
        <Link href={`/sport/${sport.id}`} onClick={handleSportClick} className="cursor-pointer" data-testid={`sport-card-${sport.id}`}>
          <img
            src={sport.poster}
            alt={sport.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {sport.sport}
        </div>

        <div className="absolute top-3 right-3">
          <button
            onClick={handleWishlistClick}
            className="glass p-2 rounded-full hover:bg-white/20 transition-all group/heart"
            data-testid={`wishlist-sport-${sport.id}`}
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
          ₹{sport.price.general}+
        </div>
      </div>
      
      <div className="p-4">
        <Link href={`/sport/${sport.id}`} onClick={handleSportClick} className="cursor-pointer">
          <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 group-hover:text-orange-300 transition-colors">
            {sport.title}
          </h3>
        </Link>
        
        <div className="flex items-center space-x-2 text-gray-300 mb-3">
          <Trophy className="h-4 w-4" />
          <span className="text-sm">{sport.teams.join(' vs ')}</span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-gray-300">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{formatDate(sport.date)}</span>
            <Clock className="h-4 w-4 ml-2" />
            <span className="text-sm">{sport.time}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-300">
            <MapPin className="h-4 w-4" />
            <span className="text-sm line-clamp-1">{currentVenue}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400">
            <span>General: ₹{sport.price.general}</span>
            <span>Premium: ₹{sport.price.premium}</span>
            <span>VIP: ₹{sport.price.vip}</span>
          </div>
        </div>
        
        <button
          onClick={handleBookTicketsClick}
          className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 px-4 rounded-xl font-medium hover:from-orange-700 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-glow"
          data-testid={`book-tickets-${sport.id}`}
        >
          Book Tickets
        </button>
      </div>
    </div>
  );
};

export default SportCard;