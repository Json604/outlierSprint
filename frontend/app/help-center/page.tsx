'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, HelpCircle, MessageCircle, Phone, Mail } from 'lucide-react';
import { logClick } from '@/services/analyticsLogger';

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqs = [
    {
      id: '1',
      category: 'Booking',
      question: 'How do I book tickets on BookMyShow?',
      answer: 'To book tickets, select your city, choose a movie/event, pick your preferred cinema/venue, select date and time, choose seats, and proceed to payment. You\'ll receive a confirmation email with your booking details.'
    },
    {
      id: '2',
      category: 'Booking',
      question: 'Can I cancel or modify my booking?',
      answer: 'Yes, you can cancel your booking up to 2 hours before the show time. Cancellation charges may apply. To cancel, go to your profile, find the booking, and click on cancel. Refunds will be processed within 5-7 business days.'
    },
    {
      id: '3',
      category: 'Payment',
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit/debit cards, UPI payments, net banking, and digital wallets like Paytm, PhonePe, Google Pay, and Amazon Pay.'
    },
    {
      id: '4',
      category: 'Payment',
      question: 'Is it safe to make payments on BookMyShow?',
      answer: 'Yes, all payments on BookMyShow are secured with 256-bit SSL encryption. We use secure payment gateways and do not store your card details on our servers.'
    },
    {
      id: '5',
      category: 'Tickets',
      question: 'How will I receive my tickets?',
      answer: 'You will receive your tickets via email and SMS immediately after successful payment. You can also access your tickets from the "My Bookings" section in your profile.'
    },
    {
      id: '6',
      category: 'Tickets',
      question: 'Do I need to print my tickets?',
      answer: 'No, you don\'t need to print your tickets. You can show the digital ticket on your mobile phone at the venue. However, some venues may require printed tickets, so please check the venue requirements.'
    },
    {
      id: '7',
      category: 'Account',
      question: 'How do I create an account?',
      answer: 'Click on "Login" in the top right corner, then select "Sign up". Enter your name, email, phone number, and create a password. You\'ll receive a verification email to activate your account.'
    },
    {
      id: '8',
      category: 'Account',
      question: 'I forgot my password. How do I reset it?',
      answer: 'On the login page, click "Forgot your password?". Enter your registered email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.'
    },
    {
      id: '9',
      category: 'Refunds',
      question: 'How long does it take to get a refund?',
      answer: 'Refunds are processed within 5-7 business days from the date of cancellation. The amount will be credited back to the original payment method used for booking.'
    },
    {
      id: '10',
      category: 'Refunds',
      question: 'What is the cancellation policy?',
      answer: 'You can cancel your booking up to 2 hours before the show time. Cancellation charges: ₹50 per ticket for movies, ₹100 per ticket for events. No cancellation is allowed within 2 hours of show time.'
    }
  ];

  const categories = ['All', 'Booking', 'Payment', 'Tickets', 'Account', 'Refunds'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
    logClick('faq-toggle', '/help-center', { faqId, expanded: expandedFaq !== faqId });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    logClick('help-category-filter', '/help-center', { category });
  };

  const handleContactClick = (method: string) => {
    logClick('help-contact', '/help-center', { method });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <HelpCircle className="h-16 w-16 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Find answers to frequently asked questions and get the help you need
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              data-testid="help-search-input"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              data-testid={`category-${category.toLowerCase()}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            
            {filteredFaqs.length > 0 ? (
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="glass-card rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-800/30 transition-colors"
                      data-testid={`faq-${faq.id}`}
                    >
                      <div>
                        <span className="inline-block bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs font-medium mb-2">
                          {faq.category}
                        </span>
                        <h3 className="text-lg font-semibold text-white">
                          {faq.question}
                        </h3>
                      </div>
                      {expandedFaq === faq.id ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedFaq === faq.id && (
                      <div className="px-6 pb-6">
                        <p className="text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
                <p className="text-gray-500">
                  {searchQuery ? `No results for "${searchQuery}"` : 'Try selecting a different category'}
                </p>
              </div>
            )}
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-6">
                Still need help?
              </h3>
              
              <div className="space-y-4">
                <a
                  href="/contact-us"
                  onClick={() => handleContactClick('contact-form')}
                  className="flex items-center p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors group"
                  data-testid="contact-form-link"
                >
                  <MessageCircle className="h-6 w-6 text-blue-400 mr-3 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="font-semibold text-white">Contact Form</h4>
                    <p className="text-sm text-gray-400">Send us a message</p>
                  </div>
                </a>

                <a
                  href="tel:+911800-123-4567"
                  onClick={() => handleContactClick('phone')}
                  className="flex items-center p-4 bg-green-500/20 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors group"
                  data-testid="phone-link"
                >
                  <Phone className="h-6 w-6 text-green-400 mr-3 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="font-semibold text-white">Call Us</h4>
                    <p className="text-sm text-gray-400">1800-123-4567</p>
                  </div>
                </a>

                <a
                  href="mailto:support@bookmyshow.com"
                  onClick={() => handleContactClick('email')}
                  className="flex items-center p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-colors group"
                  data-testid="email-link"
                >
                  <Mail className="h-6 w-6 text-purple-400 mr-3 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="font-semibold text-white">Email Us</h4>
                    <p className="text-sm text-gray-400">support@bookmyshow.com</p>
                  </div>
                </a>
              </div>

              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <h4 className="font-semibold text-yellow-300 mb-2">Business Hours</h4>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                  <p>Saturday: 10:00 AM - 6:00 PM</p>
                  <p>Sunday: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/profile"
              className="text-center p-4 hover:bg-white/5 rounded-lg transition-colors group"
            >
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                📱
              </div>
              <h3 className="font-semibold text-white mb-2">My Bookings</h3>
              <p className="text-gray-400 text-sm">View and manage your bookings</p>
            </a>
            
            <a
              href="/offers"
              className="text-center p-4 hover:bg-white/5 rounded-lg transition-colors group"
            >
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                🎟️
              </div>
              <h3 className="font-semibold text-white mb-2">Offers & Deals</h3>
              <p className="text-gray-400 text-sm">Find the latest discounts</p>
            </a>
            
            <a
              href="/gift-cards"
              className="text-center p-4 hover:bg-white/5 rounded-lg transition-colors group"
            >
              <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                🎁
              </div>
              <h3 className="font-semibold text-white mb-2">Gift Cards</h3>
              <p className="text-gray-400 text-sm">Perfect for any occasion</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}