'use client';

import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Search, Calendar, Clock, MapPin, Star } from 'lucide-react';
import { mockPlays, playGenres, languages } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { logClick, logSearch } from '@/services/analyticsLogger';
import { PageLoadingSkeleton } from '@/components/LoadingSkeleton';
import PlayCard from '@/components/PlayCard';

export default function PlaysPage() {
  const { selectedCity, isLoggedIn } = useUser();
  const router = useRouter();
  const [plays, setPlays] = useState<typeof mockPlays>(mockPlays); // Initialize with data
  const [filteredPlays, setFilteredPlays] = useState<typeof mockPlays>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Keep skeleton for initial render

  useEffect(() => {
    logClick('page-view', '/plays', { city: selectedCity });
    
    // Show skeleton briefly for smooth UX, then show content
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedCity]);

  useEffect(() => {
    // Immediate filtering without loading state
    let filtered = plays.filter(play => play.city.includes(selectedCity));

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(play =>
        play.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        play.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
        play.cast.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        play.director.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply genre filter
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(play =>
        play.genre.some(g => selectedGenres.includes(g))
      );
    }

    // Apply language filter
    if (selectedLanguages.length > 0) {
      filtered = filtered.filter(play =>
        play.language.some(l => selectedLanguages.includes(l))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price':
        filtered.sort((a, b) => a.price.regular - b.price.regular);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        filtered.sort((a, b) => new Date(a.dates[0]).getTime() - new Date(b.dates[0]).getTime());
    }

    setFilteredPlays(filtered);
    
    if (searchQuery) {
      logSearch(searchQuery, filtered.length, '/plays');
    }
  }, [plays, selectedCity, searchQuery, selectedGenres, selectedLanguages, sortBy]);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
    logClick('filter-genre', '/plays', { genre, action: selectedGenres.includes(genre) ? 'remove' : 'add' });
  };

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
    logClick('filter-language', '/plays', { language, action: selectedLanguages.includes(language) ? 'remove' : 'add' });
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedLanguages([]);
    setSearchQuery('');
    logClick('clear-filters', '/plays');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by useEffect
  };

  if (isLoading) {
    return <PageLoadingSkeleton cardType="play\" count={6} showFilters={true} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Plays in {selectedCity}
          </h1>
          <p className="text-gray-400">
            Experience the magic of live theatre with the best plays in your city
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search plays, actors, directors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
              data-testid="plays-search-input"
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
                {/* Genre Filter */}
                <div>
                  <h4 className="font-medium text-white mb-3">Genre</h4>
                  <div className="space-y-2">
                    {playGenres.map((genre) => (
                      <label key={genre} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedGenres.includes(genre)}
                          onChange={() => handleGenreToggle(genre)}
                          className="rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                          data-testid={`genre-filter-${genre.toLowerCase()}`}
                        />
                        <span className="ml-2 text-sm text-gray-300">{genre}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Language Filter */}
                <div>
                  <h4 className="font-medium text-white mb-3">Language</h4>
                  <div className="space-y-2">
                    {languages.map((language) => (
                      <label key={language} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedLanguages.includes(language)}
                          onChange={() => handleLanguageToggle(language)}
                          className="rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                          data-testid={`language-filter-${language.toLowerCase()}`}
                        />
                        <span className="ml-2 text-sm text-gray-300">{language}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedGenres.length > 0 || selectedLanguages.length > 0) && (
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
                  {filteredPlays.length} Plays Found
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    data-testid="sort-select"
                  >
                    <option value="date">Date</option>
                    <option value="rating">Rating</option>
                    <option value="price">Price</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  data-testid="grid-view-button"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  data-testid="list-view-button"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Plays Grid */}
            {filteredPlays.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredPlays.map((play) => (
                  <PlayCard key={play.id} play={play} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-500">
                  <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-medium mb-2 text-gray-400">No plays found</h3>
                  <p className="text-gray-500">
                    {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your filters'}
                  </p>
                  {(selectedGenres.length > 0 || selectedLanguages.length > 0 || searchQuery) && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 text-purple-400 hover:text-purple-300 font-medium"
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