'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ArrowLeft, User, Mail } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { logClick } from '@/services/analyticsLogger';

export default function AuthRequiredPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn } = useUser();
  
  const redirectTo = searchParams?.get('redirect') || '/';
  const itemType = searchParams?.get('type') || 'item';
  const itemName = searchParams?.get('name') || 'this item';

  useEffect(() => {
    logClick('page-view', '/auth-required', { redirectTo, itemType, itemName });
    
    // If user is already logged in, redirect them
    if (isLoggedIn) {
      router.push(redirectTo);
    }
  }, [isLoggedIn, router, redirectTo]);

  const handleLogin = () => {
    logClick('auth-required-login', '/auth-required', { redirectTo });
    router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`);
  };

  const handleBack = () => {
    logClick('auth-required-back', '/auth-required');
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="glass-card rounded-2xl p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
            <Lock className="h-10 w-10 text-purple-400" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-4">
            Login Required
          </h1>

          {/* Description */}
          <p className="text-gray-400 mb-6 leading-relaxed">
            To book tickets for <span className="text-white font-medium">{itemName}</span>, 
            you need to login or create an account first.
          </p>

          {/* Benefits */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
            <h3 className="text-blue-300 font-semibold mb-3">Why create an account?</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>Quick and easy booking process</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>Track your booking history</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>Get exclusive offers and deals</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span>Secure payment and refunds</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-glow flex items-center justify-center"
              data-testid="login-signup-button"
            >
              <User className="h-5 w-5 mr-2" />
              Login / Sign Up
            </button>
            
            <button
              onClick={handleBack}
              className="w-full bg-gray-700 text-gray-300 py-3 px-4 rounded-xl font-medium hover:bg-gray-600 transition-colors flex items-center justify-center"
              data-testid="back-button"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </button>
          </div>

          {/* Quick Demo Info */}
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <h4 className="text-green-300 font-semibold mb-2">Demo Account</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-green-400" />
                <span>demo@bookmyshow.com</span>
              </div>
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-2 text-green-400" />
                <span>demo123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}