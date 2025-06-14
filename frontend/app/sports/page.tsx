'use client';

import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Search, Calendar, Clock, MapPin, Trophy } from 'lucide-react';
import { mockSports, sportsCategories } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { logClick, logSearch } from '@/services/analyticsLogger';
import { PageLoadingSkeleton } from '@/components/LoadingSkeleton';
import SportCard from '@/components/SportCard';

export default function SportsPage() {
  const { selectedCity, isLoggedIn } = useUser();
  const router = useRouter();
  const [sports, setSports] = useState<typeof mockSports>(mockSports); // Initialize with data
  const [filteredSports, setFilteredSports] = useState<typeof mockSports>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Keep skeleton for initial render

  useEffect(() => {
    logClick('page-view', '/sports', { city: selectedCity });
    
    // Show skeleton briefly for smooth UX, then show content
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedCity]);

  useEffect(() => {
    // Immediate filtering without loading state
    let filtered = sports.filter(sport => sport.city.includes(selectedCity));

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(sport =>
        sport.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sport.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sport.teams.some(team => team.toLowerCase().includes(searchQuery.toLowerCase())) ||
        sport.venue.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sport filter
    if (selectedSports.length > 0) {
      filtered = filtered.filter(sport =>
        selectedSports.includes(sport.sport)
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(sport =>
        selectedCategories.includes(sport.category)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price':
        filtered.sort((a, b) => a.price.general - b.price.general);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    setFilteredSports(filtered);
    
    if (searchQuery) {
      logSearch(searchQuery, filtered.length, '/sports');
    }
  }, [sports, selectedCity, searchQuery, selectedSports, selectedCategories, sortBy]);

  const handleSportToggle = (sport: string) => {
    setSelectedSports(prev => 
      prev.includes(sport) 
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
    logClick('filter-sport', '/sports', { sport, action: selectedSports.includes(sport) ? 'remove' : 'add' });
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    logClick('filter-category', '/sports', { category, action: selectedCategories.includes(category) ? 'remove' : 'add' });
  };

  const clearFilters = () => {
    setSelectedSports([]);
    setSelectedCategories([]);
    setSearchQuery('');
    logClick('clear-filters', '/sports');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by useEffect
  };

  const categories = ['IPL', 'International', 'ISL', 'Domestic', 'League'];

  if (isLoading) {
    return <PageLoadingSkeleton cardType="sport\" count={6} showFilters={true} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Sports Events in {selectedCity}
          </h1>
          <p className="text-gray-400">
            Catch all the live action from your favorite sports
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search sports, teams, venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
              data-testid="sports-search-input"
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
                {/* Sport Filter */}
                <div>
                  <h4 className="font-medium text-white mb-3">Sport</h4>
                  <div className="space-y-2">
                    {sportsCategories.map((sport) => (
                      <label key={sport} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSports.includes(sport)}
                          onChange={() => handleSportToggle(sport)}
                          className="rounded border-gray-600 bg-gray-700 text-orange-600 focus:ring-orange-500"
                          data-testid={`sport-filter-${sport.toLowerCase()}`}
                        />
                        <span className="ml-2 text-sm text-gray-300">{sport}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <h4 className="font-medium text-white mb-3">Category</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          className="rounded border-gray-600 bg-gray-700 text-orange-600 focus:ring-orange-500"
                          data-testid={`category-filter-${category.toLowerCase()}`}
                        />
                        <span className="ml-2 text-sm text-gray-300">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedSports.length > 0 || selectedCategories.length > 0) && (
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
                  {filteredSports.length} Events Found
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1 text-sm text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  data-testid="grid-view-button"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  data-testid="list-view-button"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Sports Grid */}
            {filteredSports.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredSports.map((sport) => (
                  <SportCard key={sport.id} sport={sport} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-500">
                  <Trophy className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-medium mb-2 text-gray-400">No sports events found</h3>
                  <p className="text-gray-500">
                    {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your filters'}
                  </p>
                  {(selectedSports.length > 0 || selectedCategories.length > 0 || searchQuery) && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 text-orange-400 hover:text-orange-300 font-medium"
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