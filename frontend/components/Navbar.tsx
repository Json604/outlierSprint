'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, MapPin, Ticket, User, ChevronDown } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { cities } from '@/lib/mockData';
import { logClick, logNavigation } from '@/services/analyticsLogger';

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, isLoggedIn, logout, selectedCity, setSelectedCity } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Check if screen is mobile size - INCREASED THRESHOLD
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1536); // xl breakpoint (increased from 1024)
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const menuButton = document.getElementById('menu-button');
      
      if (isSidebarOpen && sidebar && menuButton && 
          !sidebar.contains(event.target as Node) && 
          !menuButton.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setIsCityDropdownOpen(false);
    logClick('city-selector', pathname, { selectedCity: city });
  };

  const handleNavClick = (destination: string) => {
    logNavigation(pathname, destination);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    logClick('logout', pathname);
    router.push('/');
    setIsSidebarOpen(false);
  };

  const handleProfileClick = () => {
    handleNavClick('/profile');
    router.push('/profile');
  };

  // Function to check if a nav item is active
  const isActiveNavItem = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  const navigationItems = [
    { href: '/movies', label: 'Movies', testId: 'movies-nav-link' },
    { href: '/events', label: 'Events', testId: 'events-nav-link' },
    { href: '/plays', label: 'Plays', testId: 'plays-nav-link' },
    { href: '/sports', label: 'Sports', testId: 'sports-nav-link' },
    { href: '/activities', label: 'Activities', testId: 'activities-nav-link' },
    { href: '/list-your-show', label: 'List Your Show', testId: 'list-your-show-nav-link' },
    { href: '/offers', label: 'Offers', testId: 'offers-nav-link' },
    { href: '/gift-cards', label: 'Gift Cards', testId: 'gift-cards-nav-link' },
  ];

  return (
    <>
      <nav className="glass-card shadow-2xl border-b border-white/10 sticky top-0 z-50">
        <div className="w-full px-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-center h-20 max-w-7xl mx-auto">
            {/* Logo - Positioned absolutely to left */}
            <div className="absolute left-6 sm:left-8 lg:left-10 flex items-center flex-shrink-0">
              <Link 
                href="/" 
                className="flex items-center space-x-3 group"
                onClick={() => handleNavClick('/')}
                data-testid="logo-link"
              >
                <div className="relative">
                  <Ticket className="h-9 w-9 text-red-500 group-hover:text-red-400 transition-colors" />
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-lg group-hover:bg-red-400/30 transition-all"></div>
                </div>
                <span className="text-2xl font-bold gradient-text group-hover:scale-105 transition-transform">
                  BookMyShow
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - Centered */}
            {!isMobile && (
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-1 xl:space-x-3 2xl:space-x-6">
                  {navigationItems.map((item) => (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      className={`relative text-gray-300 hover:text-white px-3 xl:px-4 py-3 text-sm xl:text-base font-medium transition-all hover:bg-white/10 rounded-lg whitespace-nowrap ${
                        isActiveNavItem(item.href) ? 'text-white' : ''
                      }`}
                      onClick={() => handleNavClick(item.href)}
                      data-testid={item.testId}
                    >
                      {item.label}
                      {/* Active indicator bar */}
                      {isActiveNavItem(item.href) && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Right Side Controls - Positioned absolutely to right */}
            <div className="absolute right-6 sm:right-8 lg:right-10 flex items-center space-x-4 flex-shrink-0">
              {/* City Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 lg:px-4 py-3 text-sm font-medium transition-all hover:bg-white/10 rounded-lg"
                  data-testid="city-selector-button"
                >
                  <MapPin className="h-5 w-5" />
                  <span className="hidden sm:block">{selectedCity}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isCityDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl shadow-2xl border border-white/20 z-50">
                    <div className="py-2">
                      {cities.map((city) => (
                        <button
                          key={city}
                          onClick={() => handleCityChange(city)}
                          className={`block w-full text-left px-4 py-3 text-sm transition-all ${
                            selectedCity === city 
                              ? 'text-purple-400 bg-purple-500/20' 
                              : 'text-gray-300 hover:text-white hover:bg-white/10'
                          }`}
                          data-testid={`city-option-${city.toLowerCase()}`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile/Login */}
              {isLoggedIn ? (
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 lg:px-5 py-3 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-glow"
                  data-testid="profile-button"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:block">{user?.name?.split(' ')[0]}</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => handleNavClick('/login')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 lg:px-5 py-3 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-glow"
                  data-testid="login-button"
                >
                  Login
                </Link>
              )}

              {/* Mobile menu button - Only show on mobile */}
              {isMobile && (
                <button
                  id="menu-button"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="text-gray-300 hover:text-white p-3 hover:bg-white/10 rounded-lg transition-all ml-2"
                  data-testid="mobile-menu-button"
                >
                  <Menu className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <div
          id="mobile-sidebar"
          className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] glass-card border-l border-white/20 z-50 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <Ticket className="h-8 w-8 text-red-500" />
                <span className="text-xl font-bold gradient-text">BookMyShow</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-300 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all"
                data-testid="close-sidebar"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* User Info - Now clickable to go to profile */}
            {isLoggedIn && user && (
              <Link
                href="/profile"
                onClick={() => handleNavClick('/profile')}
                className="p-6 border-b border-white/10 hover:bg-white/5 transition-colors group"
                data-testid="sidebar-profile-link"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">{user.name}</p>
                    <p className="text-sm text-gray-400">View Profile</p>
                  </div>
                </div>
              </Link>
            )}

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-6">
              <div className="space-y-2 px-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-all relative ${
                      isActiveNavItem(item.href) 
                        ? 'text-white bg-white/10 border-l-4 border-red-500' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                    data-testid={`mobile-${item.testId}`}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Additional Links for Logged In Users */}
                {isLoggedIn && (
                  <>
                    <div className="border-t border-white/10 my-4"></div>
                    <Link
                      href="/help-center"
                      onClick={() => handleNavClick('/help-center')}
                      className={`block px-4 py-3 text-base font-medium rounded-lg transition-all ${
                        isActiveNavItem('/help-center') 
                          ? 'text-white bg-white/10 border-l-4 border-red-500' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                      data-testid="mobile-help-center"
                    >
                      Help Center
                    </Link>
                    <Link
                      href="/contact-us"
                      onClick={() => handleNavClick('/contact-us')}
                      className={`block px-4 py-3 text-base font-medium rounded-lg transition-all ${
                        isActiveNavItem('/contact-us') 
                          ? 'text-white bg-white/10 border-l-4 border-red-500' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                      data-testid="mobile-contact-us"
                    >
                      Contact Us
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-6 border-t border-white/10">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  data-testid="mobile-logout-button"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => handleNavClick('/login')}
                  className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all text-center"
                  data-testid="mobile-login-button"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;