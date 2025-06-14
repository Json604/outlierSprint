'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Upload, Plus, X, Star, Users } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { logClick } from '@/services/analyticsLogger';

export default function ListYourShowPage() {
  const { isLoggedIn } = useUser();
  const [showType, setShowType] = useState('movie');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    genre: [],
    language: [],
    duration: '',
    director: '',
    cast: [],
    venue: '',
    city: '',
    dates: [],
    showtimes: [],
    price: {
      regular: '',
      premium: '',
      vip: ''
    },
    poster: '',
    banner: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    terms: false
  });
  const [currentCast, setCurrentCast] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentShowtime, setCurrentShowtime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent as keyof typeof prev] as any, [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addCastMember = () => {
    if (currentCast.trim()) {
      setFormData(prev => ({
        ...prev,
        cast: [...prev.cast, currentCast.trim()]
      }));
      setCurrentCast('');
    }
  };

  const removeCastMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      cast: prev.cast.filter((_, i) => i !== index)
    }));
  };

  const addDate = () => {
    if (currentDate && !formData.dates.includes(currentDate)) {
      setFormData(prev => ({
        ...prev,
        dates: [...prev.dates, currentDate]
      }));
      setCurrentDate('');
    }
  };

  const removeDate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dates: prev.dates.filter((_, i) => i !== index)
    }));
  };

  const addShowtime = () => {
    if (currentShowtime && !formData.showtimes.includes(currentShowtime)) {
      setFormData(prev => ({
        ...prev,
        showtimes: [...prev.showtimes, currentShowtime]
      }));
      setCurrentShowtime('');
    }
  };

  const removeShowtime = (index: number) => {
    setFormData(prev => ({
      ...prev,
      showtimes: prev.showtimes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      alert('Please login to list your show');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      logClick('list-show-submit', '/list-your-show', { 
        showType, 
        title: formData.title,
        category: formData.category 
      });
      
      alert('Your show has been submitted for review! We will contact you within 24 hours.');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        genre: [],
        language: [],
        duration: '',
        director: '',
        cast: [],
        venue: '',
        city: '',
        dates: [],
        showtimes: [],
        price: { regular: '', premium: '', vip: '' },
        poster: '',
        banner: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        terms: false
      });
      
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = {
    movie: ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller'],
    event: ['Music', 'Comedy', 'Workshop', 'Conference', 'Festival'],
    play: ['Drama', 'Comedy', 'Musical', 'Thriller', 'Historical'],
    sport: ['Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton'],
    activity: ['Workshop', 'Fitness', 'Dance', 'Music', 'Art & Craft']
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">List Your Show</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Showcase your talent to millions of users. List your movie, event, play, sports event, or activity on BookMyShow.
          </p>
        </div>

        {/* Show Type Selection */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">What would you like to list?</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { id: 'movie', label: 'Movie', icon: '🎬' },
              { id: 'event', label: 'Event', icon: '🎵' },
              { id: 'play', label: 'Play', icon: '🎭' },
              { id: 'sport', label: 'Sports', icon: '⚽' },
              { id: 'activity', label: 'Activity', icon: '🏃' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setShowType(type.id);
                  logClick('show-type-select', '/list-your-show', { showType: type.id });
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  showType === type.id
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                    : 'border-gray-600 hover:border-gray-500 text-gray-300'
                }`}
                data-testid={`show-type-${type.id}`}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder={`Enter ${showType} title`}
                  data-testid="title-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  data-testid="category-select"
                >
                  <option value="">Select Category</option>
                  {categories[showType as keyof typeof categories]?.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder={`Describe your ${showType}...`}
                data-testid="description-input"
              />
            </div>

            {(showType === 'movie' || showType === 'play') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="120"
                    data-testid="duration-input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Director *
                  </label>
                  <input
                    type="text"
                    name="director"
                    value={formData.director}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Director name"
                    data-testid="director-input"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cast & Crew */}
          {(showType === 'movie' || showType === 'play') && (
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Cast & Crew</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cast Members
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={currentCast}
                    onChange={(e) => setCurrentCast(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter cast member name"
                    data-testid="cast-input"
                  />
                  <button
                    type="button"
                    onClick={addCastMember}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                    data-testid="add-cast-button"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.cast.map((member, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {member}
                      <button
                        type="button"
                        onClick={() => removeCastMember(index)}
                        className="ml-2 text-gray-400 hover:text-red-400"
                        data-testid={`remove-cast-${index}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Venue & Schedule */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Venue & Schedule</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Venue *
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Venue name and address"
                  data-testid="venue-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="City"
                  data-testid="city-input"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Show Dates *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="date"
                  value={currentDate}
                  onChange={(e) => setCurrentDate(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  data-testid="date-input"
                />
                <button
                  type="button"
                  onClick={addDate}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  data-testid="add-date-button"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.dates.map((date, index) => (
                  <span
                    key={index}
                    className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center border border-blue-500/30"
                  >
                    {new Date(date).toLocaleDateString()}
                    <button
                      type="button"
                      onClick={() => removeDate(index)}
                      className="ml-2 text-blue-400 hover:text-red-400"
                      data-testid={`remove-date-${index}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Showtimes */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Showtimes *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="time"
                  value={currentShowtime}
                  onChange={(e) => setCurrentShowtime(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  data-testid="showtime-input"
                />
                <button
                  type="button"
                  onClick={addShowtime}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  data-testid="add-showtime-button"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.showtimes.map((time, index) => (
                  <span
                    key={index}
                    className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm flex items-center border border-green-500/30"
                  >
                    {time}
                    <button
                      type="button"
                      onClick={() => removeShowtime(index)}
                      className="ml-2 text-green-400 hover:text-red-400"
                      data-testid={`remove-showtime-${index}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Pricing</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Regular Price (₹) *
                </label>
                <input
                  type="number"
                  name="price.regular"
                  value={formData.price.regular}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="200"
                  data-testid="regular-price-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Premium Price (₹)
                </label>
                <input
                  type="number"
                  name="price.premium"
                  value={formData.price.premium}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="350"
                  data-testid="premium-price-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  VIP Price (₹)
                </label>
                <input
                  type="number"
                  name="price.vip"
                  value={formData.price.vip}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="500"
                  data-testid="vip-price-input"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Your name"
                  data-testid="contact-name-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="your@email.com"
                  data-testid="contact-email-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="+91 9876543210"
                  data-testid="contact-phone-input"
                />
              </div>
            </div>
          </div>

          {/* Terms & Submit */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-start space-x-3 mb-6">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleInputChange}
                required
                className="mt-1 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                data-testid="terms-checkbox"
              />
              <label className="text-sm text-gray-300">
                I agree to the <a href="#" className="text-purple-400 hover:text-purple-300">Terms & Conditions</a> and 
                confirm that all information provided is accurate. I understand that BookMyShow will review my submission 
                and contact me within 24 hours.
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || !formData.terms}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-glow"
              data-testid="submit-button"
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}