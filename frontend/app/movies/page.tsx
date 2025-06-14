'use client';

import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Search } from 'lucide-react';
import { mockMovies, genres, languages } from '@/lib/mockData';
import { useUser } from '@/contexts/UserContext';
import MovieCard from '@/components/MovieCard';
import { logClick, logSearch } from '@/services/analyticsLogger';
import { useSearchParams } from 'next/navigation';
import { PageLoadingSkeleton } from '@/components/LoadingSkeleton';

export default function MoviesPage() {
  const { selectedCity } = useUser();
  const searchParams = useSearchParams();
  const [movies, setMovies] = useState<typeof mockMovies>(mockMovies); // Initialize with data
  const [filteredMovies, setFilteredMovies] = useState<typeof mockMovies>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Keep skeleton for initial render

  useEffect(() => {
    logClick('page-view', '/movies', { city: selectedCity });
    
    // Show skeleton briefly for smooth UX, then show content
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedCity]);

  useEffect(() => {
    // Immediate filtering without loading state
    let filtered = movies.filter(movie => movie.city.includes(selectedCity));

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
        movie.cast.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply genre filter
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(movie =>
        movie.genre.some(g => selectedGenres.includes(g))
      );
    }

    // Apply language filter
    if (selectedLanguages.length > 0) {
      filtered = filtered.filter(movie =>
        movie.language.some(l => selectedLanguages.includes(l))
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
        filtered.sort((a, b) => b.votes - a.votes);
    }

    setFilteredMovies(filtered);
    
    // Log search if there's a query
    if (searchQuery) {
      logSearch(searchQuery, filtered.length, '/movies');
    }
  }, [movies, selectedCity, searchQuery, selectedGenres, selectedLanguages, sortBy]);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
    logClick('filter-genre', '/movies', { genre, action: selectedGenres.includes(genre) ? 'remove' : 'add' });
  };

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
    logClick('filter-language', '/movies', { language, action: selectedLanguages.includes(language) ? 'remove' : 'add' });
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedLanguages([]);
    setSearchQuery('');
    logClick('clear-filters', '/movies');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by useEffect
  };

  if (isLoading) {
    return <PageLoadingSkeleton cardType="movie\" count={8} showFilters={true} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Movies in {selectedCity}
          </h1>
          <p className="text-gray-400">
            Discover the latest movies playing in your city
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search movies, actors, directors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
              data-testid="movies-search-input"
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
                    {genres.map((genre) => (
                      <label key={genre} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedGenres.includes(genre)}
                          onChange={() => handleGenreToggle(genre)}
                          className="rounded border-gray-600 bg-gray-700 text-red-600 focus:ring-red-500"
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
                          className="rounded border-gray-600 bg-gray-700 text-red-600 focus:ring-red-500"
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
                  {filteredMovies.length} Movies Found
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1 text-sm text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="sort-select"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="rating">Rating</option>
                    <option value="price">Price</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  data-testid="grid-view-button"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  data-testid="list-view-button"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Movies Grid */}
            {filteredMovies.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-500">
                  <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-medium mb-2 text-gray-400">No movies found</h3>
                  <p className="text-gray-500">
                    {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your filters'}
                  </p>
                  {(selectedGenres.length > 0 || selectedLanguages.length > 0 || searchQuery) && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 text-red-400 hover:text-red-300 font-medium"
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