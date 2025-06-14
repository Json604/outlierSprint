'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Clock, MapPin, Heart, Theater } from 'lucide-react';
import { Play } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import { logClick } from '@/services/analyticsLogger';
import { usePathname } from 'next/navigation';

interface PlayCardProps {
  play: Play;
}

const PlayCard: React.FC<PlayCardProps> = ({ play }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn } = useUser();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handlePlayClick = () => {
    logClick('play-card', pathname, { playId: play.id, playTitle: play.title });
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    logClick('play-wishlist', pathname, { playId: play.id, wishlisted: !isWishlisted });
  };

  const handleBookTicketsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      logClick('book-tickets-auth-required', pathname, { playId: play.id });
      router.push(`/auth-required?redirect=${encodeURIComponent(`/book-play/${play.id}`)}&type=play&name=${encodeURIComponent(play.title)}`);
    } else {
      logClick('book-tickets-click', pathname, { playId: play.id });
      router.push(`/book-play/${play.id}`);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="glass-card rounded-2xl shadow-2xl hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1 hover:scale-102 overflow-hidden group">
      <div className="relative overflow-hidden">
        <Link href={`/play/${play.id}`} onClick={handlePlayClick} className="cursor-pointer" data-testid={`play-card-${play.id}`}>
          <img
            src={play.poster}
            alt={play.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {play.genre[0]}
        </div>

        <div className="absolute top-3 right-3">
          <button
            onClick={handleWishlistClick}
            className="glass p-2 rounded-full hover:bg-white/20 transition-all group/heart"
            data-testid={`wishlist-play-${play.id}`}
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
          ₹{play.price.regular}+
        </div>
      </div>
      
      <div className="p-4">
        <Link href={`/play/${play.id}`} onClick={handlePlayClick} className="cursor-pointer">
          <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
            {play.title}
          </h3>
        </Link>
        
        <div className="flex items-center space-x-4 mb-3">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-300">
              {play.rating}/5
            </span>
            <span className="text-xs text-gray-500">
              ({play.votes.toLocaleString()})
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">
              {formatDuration(play.duration)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-gray-300 mb-3">
          <Theater className="h-4 w-4" />
          <span className="text-sm">{play.venue}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {play.genre.slice(0, 2).map((g) => (
            <span
              key={g}
              className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-xs font-medium rounded-full border border-purple-500/30"
            >
              {g}
            </span>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {play.language.map((lang) => (
            <span
              key={lang}
              className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md border border-gray-600/50"
            >
              {lang}
            </span>
          ))}
        </div>
        
        <button
          onClick={handleBookTicketsClick}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-glow"
          data-testid={`book-tickets-${play.id}`}
        >
          Book Tickets
        </button>
      </div>
    </div>
  );
};

export default PlayCard;