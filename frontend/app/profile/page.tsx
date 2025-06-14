'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Clock, Ticket, User, Mail, Phone, Edit3, Star, LogOut, HelpCircle, MessageCircle, FileText } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { mockMovies, mockEvents } from '@/lib/mockData';
import { logClick } from '@/services/analyticsLogger';
import { ProfilePageSkeleton } from '@/components/LoadingSkeleton';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, updateUser, logout } = useUser();
  const [activeTab, setActiveTab] = useState('bookings');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: ''
  });
  const [isLoading, setIsLoading] = useState(true); // Keep skeleton for initial render

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/profile');
      return;
    }

    if (user) {
      logClick('page-view', '/profile', { userId: user.id });
      setEditForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city
      });
      
      // Show skeleton briefly for smooth UX, then show content
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, user, router]);

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please log in to view your profile</h1>
          <button
            onClick={() => router.push('/login')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(editForm);
    setIsEditing(false);
    logClick('profile-update', '/profile', editForm);
  };

  const handleLogout = () => {
    logout();
    logClick('logout', '/profile');
    router.push('/');
  };

  const getBookingDetails = (booking: any) => {
    if (booking.movieId) {
      const movie = mockMovies.find(m => m.id === booking.movieId);
      const theater = movie?.theaters.find(t => t.id === booking.theaterId);
      return {
        title: movie?.title || 'Unknown Movie',
        venue: theater?.name || 'Unknown Theater',
        type: 'movie',
        poster: movie?.poster
      };
    } else if (booking.eventId) {
      const event = mockEvents.find(e => e.id === booking.eventId);
      return {
        title: event?.title || 'Unknown Event',
        venue: event?.venue || 'Unknown Venue',
        type: 'event',
        poster: event?.poster
      };
    }
    return { title: 'Unknown', venue: 'Unknown', type: 'unknown' };
  };

  const upcomingBookings = user.bookings.filter(booking => 
    new Date(booking.date) >= new Date() && booking.status === 'confirmed'
  );

  const pastBookings = user.bookings.filter(booking => 
    new Date(booking.date) < new Date() || booking.status === 'cancelled'
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-500">{user.city}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                data-testid="edit-profile"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                data-testid="logout-button"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <a
            href="/help-center"
            className="glass-card rounded-xl p-6 hover:bg-gray-800/30 transition-colors group"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <HelpCircle className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Need Help?</p>
                <p className="text-lg font-bold text-white group-hover:text-blue-300">Help Center</p>
              </div>
            </div>
          </a>
          
          <a
            href="/contact-us"
            className="glass-card rounded-xl p-6 hover:bg-gray-800/30 transition-colors group"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Get Support</p>
                <p className="text-lg font-bold text-white group-hover:text-green-300">Contact Us</p>
              </div>
            </div>
          </a>
          
          <a
            href="/terms-and-conditions"
            className="glass-card rounded-xl p-6 hover:bg-gray-800/30 transition-colors group"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Legal</p>
                <p className="text-lg font-bold text-white group-hover:text-purple-300">Terms & Conditions</p>
              </div>
            </div>
          </a>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Ticket className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-white">{user.bookings.length}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Upcoming</p>
                <p className="text-2xl font-bold text-white">{upcomingBookings.length}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold text-white">
                  ₹{user.bookings.reduce((total, booking) => total + booking.totalPrice, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass-card rounded-xl">
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'bookings', label: 'My Bookings', count: user.bookings.length },
                { id: 'upcoming', label: 'Upcoming', count: upcomingBookings.length },
                { id: 'history', label: 'History', count: pastBookings.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    logClick('profile-tab', '/profile', { tab: tab.id });
                  }}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">All Bookings</h2>
                {user.bookings.length > 0 ? (
                  user.bookings.map((booking) => {
                    const details = getBookingDetails(booking);
                    return (
                      <div key={booking.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800/30 transition-colors">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                          <div className="flex items-start space-x-4 mb-4 md:mb-0">
                            {details.poster && (
                              <img
                                src={details.poster}
                                alt={details.title}
                                className="w-16 h-20 object-cover rounded-lg"
                              />
                            )}
                            <div>
                              <h3 className="font-semibold text-white">{details.title}</h3>
                              <div className="flex items-center text-gray-400 text-sm mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{details.venue}</span>
                              </div>
                              <div className="flex items-center text-gray-400 text-sm mt-1">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{new Date(booking.date).toLocaleDateString()}</span>
                                <Clock className="h-4 w-4 ml-3 mr-1" />
                                <span>{booking.showtime}</span>
                              </div>
                              <div className="flex items-center text-gray-400 text-sm mt-1">
                                <Ticket className="h-4 w-4 mr-1" />
                                <span>Seats: {booking.seats.join(', ')}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'confirmed' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </div>
                            <p className="text-lg font-bold text-white mt-2">₹{booking.totalPrice}</p>
                            <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <Ticket className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-lg font-medium text-white mb-2">No bookings yet</h3>
                    <p className="text-gray-500 mb-4">Start booking your favorite movies and events</p>
                    <button
                      onClick={() => router.push('/movies')}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                    >
                      Browse Movies
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'upcoming' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">Upcoming Bookings</h2>
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => {
                    const details = getBookingDetails(booking);
                    return (
                      <div key={booking.id} className="border border-gray-700 rounded-lg p-4 bg-blue-500/10">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                          <div className="flex items-start space-x-4 mb-4 md:mb-0">
                            {details.poster && (
                              <img
                                src={details.poster}
                                alt={details.title}
                                className="w-16 h-20 object-cover rounded-lg"
                              />
                            )}
                            <div>
                              <h3 className="font-semibold text-white">{details.title}</h3>
                              <div className="flex items-center text-gray-400 text-sm mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{details.venue}</span>
                              </div>
                              <div className="flex items-center text-gray-400 text-sm mt-1">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{new Date(booking.date).toLocaleDateString()}</span>
                                <Clock className="h-4 w-4 ml-3 mr-1" />
                                <span>{booking.showtime}</span>
                              </div>
                              <div className="flex items-center text-gray-400 text-sm mt-1">
                                <Ticket className="h-4 w-4 mr-1" />
                                <span>Seats: {booking.seats.join(', ')}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-white">₹{booking.totalPrice}</p>
                            <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-lg font-medium text-white mb-2">No upcoming bookings</h3>
                    <p className="text-gray-500">Your future bookings will appear here</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">Booking History</h2>
                {pastBookings.length > 0 ? (
                  pastBookings.map((booking) => {
                    const details = getBookingDetails(booking);
                    return (
                      <div key={booking.id} className="border border-gray-700 rounded-lg p-4 opacity-75">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                          <div className="flex items-start space-x-4 mb-4 md:mb-0">
                            {details.poster && (
                              <img
                                src={details.poster}
                                alt={details.title}
                                className="w-16 h-20 object-cover rounded-lg"
                              />
                            )}
                            <div>
                              <h3 className="font-semibold text-white">{details.title}</h3>
                              <div className="flex items-center text-gray-400 text-sm mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{details.venue}</span>
                              </div>
                              <div className="flex items-center text-gray-400 text-sm mt-1">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{new Date(booking.date).toLocaleDateString()}</span>
                                <Clock className="h-4 w-4 ml-3 mr-1" />
                                <span>{booking.showtime}</span>
                              </div>
                              <div className="flex items-center text-gray-400 text-sm mt-1">
                                <Ticket className="h-4 w-4 mr-1" />
                                <span>Seats: {booking.seats.join(', ')}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'confirmed' 
                                ? 'bg-gray-500/20 text-gray-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {booking.status === 'confirmed' ? 'Completed' : 'Cancelled'}
                            </div>
                            <p className="text-lg font-bold text-white mt-2">₹{booking.totalPrice}</p>
                            <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <Star className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-lg font-medium text-white mb-2">No booking history</h3>
                    <p className="text-gray-500">Your past bookings will appear here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-4">Edit Profile</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                  data-testid="edit-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                  data-testid="edit-email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                  data-testid="edit-phone"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                <input
                  type="text"
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                  data-testid="edit-city"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-700 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-600"
                  data-testid="cancel-edit"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                  data-testid="save-profile"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}