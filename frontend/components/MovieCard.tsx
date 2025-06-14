'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Clock, Heart } from 'lucide-react';
import { Movie } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import { logClick } from '@/services/analyticsLogger';
import { usePathname, useRouter } from 'next/navigation';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn } = useUser();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleMovieClick = () => {
    logClick('movie-card', pathname, { movieId: movie.id, movieTitle: movie.title });
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    logClick('movie-wishlist', pathname, { movieId: movie.id, wishlisted: !isWishlisted });
  };

  const handleBookNowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      logClick('book-now-auth-required', pathname, { movieId: movie.id });
      router.push(`/auth-required?redirect=${encodeURIComponent(`/book-movie?movieId=${movie.id}&theaterId=${movie.theaters[0].id}&showtime=${movie.theaters[0].showtimes[0]}&date=${new Date().toISOString().split('T')[0]}`)}&type=movie&name=${encodeURIComponent(movie.title)}`);
    } else {
      logClick('book-now-click', pathname, { movieId: movie.id });
      // Go directly to seat selection with default theater and showtime
      const defaultTheater = movie.theaters[0];
      const defaultShowtime = defaultTheater.showtimes[0];
      const today = new Date().toISOString().split('T')[0];
      router.push(`/book-movie?movieId=${movie.id}&theaterId=${defaultTheater.id}&showtime=${defaultShowtime}&date=${today}`);
    }
  };

  return (
    <div className="glass-card rounded-2xl shadow-2xl hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1 hover:scale-102 overflow-hidden group">
      <div className="relative overflow-hidden">
        <Link href={`/movie/${movie.id}`} onClick={handleMovieClick} data-testid={`movie-card-${movie.id}`}>
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-3 right-3">
          <button
            onClick={handleWishlistClick}
            className="glass p-2 rounded-full hover:bg-white/20 transition-all group/heart"
            data-testid={`wishlist-${movie.id}`}
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
        
        <div className="absolute bottom-3 left-3 glass px-3 py-1 rounded-lg text-sm font-medium text-white">
          ₹{movie.price.regular}+
        </div>
      </div>
      
      <div className="p-4">
        <Link href={`/movie/${movie.id}`} onClick={handleMovieClick}>
          <h3 className="font-bold text-lg text-white mb-2 line-clamp-1 group-hover:text-purple-300 transition-colors">
            {movie.title}
          </h3>
        </Link>
        
        <div className="flex items-center space-x-4 mb-3">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-300">
              {movie.rating}/5
            </span>
            <span className="text-xs text-gray-500">
              ({movie.votes.toLocaleString()})
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">
              {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {movie.genre.slice(0, 2).map((g) => (
            <span
              key={g}
              className="px-2 py-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 text-xs font-medium rounded-full border border-red-500/30"
            >
              {g}
            </span>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {movie.language.slice(0, 3).map((lang) => (
            <span
              key={lang}
              className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md border border-gray-600/50"
            >
              {lang}
            </span>
          ))}
        </div>
        
        <button
          onClick={handleBookNowClick}
          className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 px-4 rounded-xl font-medium hover:from-red-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-glow-red"
          data-testid={`book-now-${movie.id}`}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default MovieCard;