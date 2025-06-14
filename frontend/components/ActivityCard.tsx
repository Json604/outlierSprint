'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Star, Heart, Users } from 'lucide-react';
import { Activity } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import { logClick } from '@/services/analyticsLogger';
import { usePathname } from 'next/navigation';

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, selectedCity } = useUser();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleActivityClick = () => {
    logClick('activity-card', pathname, { activityId: activity.id, activityTitle: activity.title });
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    logClick('activity-wishlist', pathname, { activityId: activity.id, wishlisted: !isWishlisted });
  };

  const handleBookNowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      logClick('book-now-auth-required', pathname, { activityId: activity.id });
      router.push(`/auth-required?redirect=${encodeURIComponent(`/book-activity/${activity.id}`)}&type=activity&name=${encodeURIComponent(activity.title)}`);
    } else {
      logClick('book-now-click', pathname, { activityId: activity.id });
      router.push(`/book-activity/${activity.id}`);
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Get venue for the selected city
  const currentVenue = activity.venues[selectedCity] || Object.values(activity.venues)[0] || 'Venue TBA';

  return (
    <div className="glass-card rounded-2xl shadow-2xl hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1 hover:scale-102 overflow-hidden group">
      <div className="relative overflow-hidden">
        <Link href={`/activity/${activity.id}`} onClick={handleActivityClick} className="cursor-pointer" data-testid={`activity-card-${activity.id}`}>
          <img
            src={activity.poster}
            alt={activity.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-3 left-3 bg-gradient-to-r from-green-600 to-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {activity.category}
        </div>

        <div className="absolute top-3 right-3">
          <button
            onClick={handleWishlistClick}
            className="glass p-2 rounded-full hover:bg-white/20 transition-all group/heart"
            data-testid={`wishlist-activity-${activity.id}`}
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
          ₹{activity.price}
        </div>
      </div>
      
      <div className="p-4">
        <Link href={`/activity/${activity.id}`} onClick={handleActivityClick} className="cursor-pointer">
          <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 group-hover:text-green-300 transition-colors">
            {activity.title}
          </h3>
        </Link>
        
        <div className="flex items-center space-x-2 text-gray-300 mb-3">
          <Star className="h-4 w-4" />
          <span className="text-sm">{activity.instructor}</span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-gray-300">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{formatDate(activity.date)}</span>
            <Clock className="h-4 w-4 ml-2" />
            <span className="text-sm">{activity.time}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-300">
            <MapPin className="h-4 w-4" />
            <span className="text-sm line-clamp-1">{currentVenue}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-300">
            <Users className="h-4 w-4" />
            <span className="text-sm">{activity.ageGroup}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-400">
            Duration: {formatDuration(activity.duration)}
          </span>
          <span className="text-lg font-bold text-green-400">
            ₹{activity.price}
          </span>
        </div>
        
        <button
          onClick={handleBookNowClick}
          className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 px-4 rounded-xl font-medium hover:from-green-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-glow"
          data-testid={`book-now-${activity.id}`}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;