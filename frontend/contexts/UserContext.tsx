'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, mockUser } from '@/lib/mockData';

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoggedIn: boolean;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  appliedCoupon: string | null;
  setAppliedCoupon: (code: string | null) => void;
  couponDiscount: number;
  setCouponDiscount: (discount: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('bookmyshow_user');
    const savedCity = localStorage.getItem('bookmyshow_city');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedCity) {
      setSelectedCity(savedCity);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would call an API
    if (email && password) {
      const loggedInUser = { ...mockUser, email };
      setUser(loggedInUser);
      localStorage.setItem('bookmyshow_user', JSON.stringify(loggedInUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setAppliedCoupon(null);
    setCouponDiscount(0);
    localStorage.removeItem('bookmyshow_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('bookmyshow_user', JSON.stringify(updatedUser));
    }
  };

  const handleSetSelectedCity = (city: string) => {
    setSelectedCity(city);
    localStorage.setItem('bookmyshow_city', city);
  };

  return (
    <UserContext.Provider value={{
      user,
      login,
      logout,
      updateUser,
      isLoggedIn: !!user,
      selectedCity,
      setSelectedCity: handleSetSelectedCity,
      appliedCoupon,
      setAppliedCoupon,
      couponDiscount,
      setCouponDiscount,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};