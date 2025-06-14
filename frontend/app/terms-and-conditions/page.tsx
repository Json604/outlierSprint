'use client';

import React from 'react';
import { FileText, Calendar, Shield, CreditCard, RefreshCw } from 'lucide-react';

export default function TermsAndConditionsPage() {
  const lastUpdated = new Date(Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FileText className="h-16 w-16 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-400 flex items-center justify-center">
            <Calendar className="h-4 w-4 mr-2" />
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              Welcome to BookMyShow! These Terms and Conditions ("Terms") govern your use of our website, mobile application, and services. By accessing or using BookMyShow, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not use our services.
            </p>
          </section>

          {/* Definitions */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Definitions</h2>
            <div className="space-y-3 text-gray-300">
              <p><strong className="text-white">"BookMyShow"</strong> refers to our platform, website, and mobile application.</p>
              <p><strong className="text-white">"User"</strong> refers to any individual who accesses or uses our services.</p>
              <p><strong className="text-white">"Content"</strong> refers to all information, data, text, images, and other materials on our platform.</p>
              <p><strong className="text-white">"Services"</strong> refers to all features and functionalities provided by BookMyShow.</p>
            </div>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-blue-400" />
              3. User Accounts
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>To access certain features, you must create an account. You agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
                <li>Not share your account with others</li>
              </ul>
            </div>
          </section>

          {/* Booking and Payments */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <CreditCard className="h-6 w-6 mr-2 text-green-400" />
              4. Booking and Payments
            </h2>
            <div className="space-y-4 text-gray-300">
              <h3 className="text-lg font-semibold text-white">4.1 Booking Process</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All bookings are subject to availability</li>
                <li>Prices are subject to change without notice</li>
                <li>Booking confirmation is sent via email and SMS</li>
                <li>You must present valid identification at the venue</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-white">4.2 Payment Terms</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Payment must be made in full at the time of booking</li>
                <li>We accept major credit/debit cards, UPI, and digital wallets</li>
                <li>All transactions are processed securely</li>
                <li>Convenience fees may apply to certain transactions</li>
              </ul>
            </div>
          </section>

          {/* Cancellation and Refunds */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <RefreshCw className="h-6 w-6 mr-2 text-yellow-400" />
              5. Cancellation and Refunds
            </h2>
            <div className="space-y-4 text-gray-300">
              <h3 className="text-lg font-semibold text-white">5.1 Cancellation Policy</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cancellations must be made at least 2 hours before the show time</li>
                <li>Cancellation charges apply as per the venue's policy</li>
                <li>No cancellations allowed within 2 hours of show time</li>
                <li>Some events may have different cancellation policies</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-white">5.2 Refund Process</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Refunds are processed within 5-7 business days</li>
                <li>Refunds are credited to the original payment method</li>
                <li>Convenience fees are non-refundable</li>
                <li>Partial refunds may apply for group bookings</li>
              </ul>
            </div>
          </section>

          {/* User Conduct */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. User Conduct</h2>
            <div className="space-y-4 text-gray-300">
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use our services for any illegal or unauthorized purpose</li>
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful or malicious content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Resell tickets at inflated prices</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed">
              All content on BookMyShow, including but not limited to text, graphics, logos, images, and software, is the property of BookMyShow or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          {/* Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our services. By using BookMyShow, you consent to the collection and use of your information as described in our Privacy Policy.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Disclaimers</h2>
            <div className="space-y-4 text-gray-300">
              <p>BookMyShow provides services on an "as is" and "as available" basis. We make no warranties or representations about:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The accuracy or completeness of content</li>
                <li>The availability of services</li>
                <li>The quality of events or venues</li>
                <li>The performance of third-party services</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              To the maximum extent permitted by law, BookMyShow shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of our services.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
            <div className="text-gray-300 space-y-2">
              <p>If you have any questions about these Terms, please contact us:</p>
              <div className="bg-gray-800/50 rounded-lg p-4 mt-4">
                <p><strong className="text-white">Email:</strong> legal@bookmyshow.com</p>
                <p><strong className="text-white">Phone:</strong> 1800-123-4567</p>
                <p><strong className="text-white">Address:</strong> BookMyShow Office, 123 Entertainment Street, Mumbai, Maharashtra 400001</p>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. Governing Law</h2>
            <p className="text-gray-300 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
            </p>
          </section>

          {/* Acknowledgment */}
          <section className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-300 mb-3">Acknowledgment</h2>
            <p className="text-gray-300 leading-relaxed">
              By using BookMyShow, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these Terms, please discontinue use of our services immediately.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}