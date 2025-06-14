'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Clock, Calendar, MapPin, Share2, Heart, ArrowLeft, Users, Zap, Target } from 'lucide-react';
import { Activity } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import { logClick } from '@/services/analyticsLogger';

interface ActivityDetailsClientProps {
  activity: Activity;
}

export default function ActivityDetailsClient({ activity }: ActivityDetailsClientProps) {
  const router = useRouter();
  const { selectedCity, isLoggedIn } = useUser();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    logClick('page-view', `/activity/${activity.id}`, { activityTitle: activity.title, city: selectedCity });
  }, [activity, selectedCity]);

  // Check if activity is available in the selected city
  useEffect(() => {
    if (!activity.city.includes(selectedCity)) {
      // If activity is not available in the selected city, redirect to activities page
      router.push('/activities');
    }
  }, [selectedCity, activity.city, router]);

  const handleBooking = () => {
    if (!isLoggedIn) {
      logClick('booking-auth-required', `/activity/${activity.id}`, { 
        activityId: activity.id,
        date: activity.date,
        time: activity.time
      });
      router.push(`/auth-required?redirect=${encodeURIComponent(`/book-activity/${activity.id}`)}&type=activity&name=${encodeURIComponent(activity.title)}`);
    } else {
      logClick('start-booking', `/activity/${activity.id}`, { 
        activityId: activity.id,
        date: activity.date,
        time: activity.time
      });
      router.push(`/book-activity/${activity.id}`);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    logClick('add-to-wishlist', `/activity/${activity.id}`, { activityId: activity.id, wishlisted: !isWishlisted });
  };

  const handleShare = async () => {
    logClick('share-activity', `/activity/${activity.id}`, { activityId: activity.id });
    if (navigator.share) {
      try {
        await navigator.share({
          title: activity.title,
          text: `Check out ${activity.title} on BookSmart`,
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'Advanced': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  // Check if activity is available in selected city
  const isAvailableInCity = activity.city.includes(selectedCity);
  const currentVenue = activity.venues[selectedCity] || 'Venue information not available';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          data-testid="back-to-activities"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Activities
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={activity.banner}
          alt={activity.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <img
                src={activity.poster}
                alt={activity.title}
                className="w-48 h-72 object-cover rounded-lg shadow-xl"
              />
              
              <div className="text-white flex-1">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">{activity.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-1 text-yellow-400" />
                    <span className="font-bold text-xl">{activity.instructor}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-1" />
                    <span>{formatDuration(activity.duration)}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gradient-to-r from-green-600 to-teal-600 px-3 py-1 rounded-full text-sm">
                    {activity.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm border ${getDifficultyColor(activity.difficulty)}`}>
                    {activity.difficulty}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-1" />
                    <span>{activity.ageGroup}</span>
                  </div>
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
                    data-testid="share-activity"
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
            {/* About the Activity */}
            <section className="glass-card rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">About the activity</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">{activity.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-white mb-2">Instructor</h3>
                  <p className="text-gray-300">{activity.instructor}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Category</h3>
                  <p className="text-gray-300">{activity.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Duration</h3>
                  <p className="text-gray-300">{formatDuration(activity.duration)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Age Group</h3>
                  <p className="text-gray-300">{activity.ageGroup}</p>
                </div>
              </div>
            </section>

            {/* Activity Features */}
            <section className="glass-card rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">What You'll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-green-300 mb-2">🎯 Hands-on Experience</h3>
                  <p className="text-gray-300 text-sm">Learn by doing with practical exercises</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-300 mb-2">👨‍🏫 Expert Guidance</h3>
                  <p className="text-gray-300 text-sm">Learn from experienced instructors</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-300 mb-2">🤝 Interactive Sessions</h3>
                  <p className="text-gray-300 text-sm">Engage with fellow participants</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-300 mb-2">📜 Certificate</h3>
                  <p className="text-gray-300 text-sm">Get a completion certificate</p>
                </div>
              </div>
            </section>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Book Activity</h2>
              
              {isAvailableInCity ? (
                <>
                  {/* Activity Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="h-5 w-5 mr-3 text-green-400" />
                      <div>
                        <p className="font-medium text-white">{formatDate(activity.date)}</p>
                        <p className="text-sm text-gray-400">Activity Date</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <Clock className="h-5 w-5 mr-3 text-blue-400" />
                      <div>
                        <p className="font-medium text-white">{activity.time}</p>
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
                      <Target className="h-5 w-5 mr-3 text-purple-400" />
                      <div>
                        <p className="font-medium text-white">{activity.difficulty}</p>
                        <p className="text-sm text-gray-400">Difficulty Level</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-white mb-3">Activity Fee</h3>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-green-400">₹{activity.price}</span>
                      <p className="text-sm text-gray-400">per person</p>
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <button
                    onClick={handleBooking}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 px-6 rounded-xl font-medium hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-glow text-lg"
                    data-testid="book-activity"
                  >
                    Book Activity
                  </button>

                  {/* Additional Info */}
                  <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <h4 className="font-semibold text-green-300 mb-2">What to Bring</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Comfortable clothing</li>
                      <li>• Water bottle</li>
                      <li>• Notebook and pen</li>
                      <li>• Positive attitude!</li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Activity not available in {selectedCity}</p>
                  <p className="text-sm">This activity is not currently available in your selected city</p>
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Available in:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {activity.city.map((city) => (
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