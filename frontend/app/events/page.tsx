'use client';

import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Search, Calendar } from 'lucide-react';
import { mockEvents } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import EventCard from '@/components/EventCard';
import { logClick, logSearch } from '@/services/analyticsLogger';
import { PageLoadingSkeleton } from '@/components/LoadingSkeleton';

const eventCategories = ['Music', 'Comedy', 'Workshop', 'Sports', 'Theatre', 'Dance'];

export default function EventsPage() {
  const { selectedCity } = useUser();
  const [events, setEvents] = useState<typeof mockEvents>(mockEvents); // Initialize with data
  const [filteredEvents, setFilteredEvents] = useState<typeof mockEvents>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Keep skeleton for initial render

  useEffect(() => {
    logClick('page-view', '/events', { city: selectedCity });
    
    // Show skeleton briefly for smooth UX, then show content
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedCity]);

  useEffect(() => {
    // Immediate filtering without loading state
    let filtered = events.filter(event => event.city.includes(selectedCity));

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(event =>
        selectedCategories.includes(event.category)
      );
    }

    // Apply date filter
    const today = new Date();
    if (dateFilter !== 'all') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        switch (dateFilter) {
          case 'today':
            return eventDate.toDateString() === today.toDateString();
          case 'week':
            const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            return eventDate >= today && eventDate <= nextWeek;
          case 'month':
            const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
            return eventDate >= today && eventDate <= nextMonth;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    setFilteredEvents(filtered);
    
    // Log search if there's a query
    if (searchQuery) {
      logSearch(searchQuery, filtered.length, '/events');
    }
  }, [events, selectedCity, searchQuery, selectedCategories, dateFilter, sortBy]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    logClick('filter-category', '/events', { category, action: selectedCategories.includes(category) ? 'remove' : 'add' });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setDateFilter('all');
    setSearchQuery('');
    logClick('clear-filters', '/events');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by useEffect
  };

  if (isLoading) {
    return <PageLoadingSkeleton cardType="event\" count={8} showFilters={true} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Events in {selectedCity}
          </h1>
          <p className="text-gray-400">
            Discover amazing events happening in your city
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search events, artists, venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              data-testid="events-search-input"
            />
          </form>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="glass-card rounded-xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-gray-400 hover:text-white"
                  data-testid="toggle-filters"
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Category Filter */}
                <div>
                  <h4 className="font-medium text-white mb-3">Category</h4>
                  <div className="space-y-2">
                    {eventCategories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                          data-testid={`category-filter-${category.toLowerCase()}`}
                        />
                        <span className="ml-2 text-sm text-gray-300">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date Filter */}
                <div>
                  <h4 className="font-medium text-white mb-3">Date</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All Events' },
                      { value: 'today', label: 'Today' },
                      { value: 'week', label: 'This Week' },
                      { value: 'month', label: 'This Month' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="dateFilter"
                          value={option.value}
                          checked={dateFilter === option.value}
                          onChange={(e) => setDateFilter(e.target.value)}
                          className="border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                          data-testid={`date-filter-${option.value}`}
                        />
                        <span className="ml-2 text-sm text-gray-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedCategories.length > 0 || dateFilter !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="w-full bg-gray-700 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                    data-testid="clear-filters-button"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort and View Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-white font-medium">
                  {filteredEvents.length} Events Found
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    data-testid="sort-select"
                  >
                    <option value="date">Date</option>
                    <option value="price">Price</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  data-testid="grid-view-button"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  data-testid="list-view-button"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Events Grid */}
            {filteredEvents.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-500">
                  <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-medium mb-2 text-gray-400">No events found</h3>
                  <p className="text-gray-500">
                    {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your filters'}
                  </p>
                  {(selectedCategories.length > 0 || dateFilter !== 'all' || searchQuery) && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 text-blue-400 hover:text-blue-300 font-medium"
                      data-testid="no-results-clear-filters"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}