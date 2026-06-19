"use client";

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-800 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        
        {/* ১. ব্র্যান্ড এবং নিউজলেটার সেকশন */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-wide font-serif">
            <span className="text-blue-500">Local</span>Library
          </h2>
          <p className="text-sm text-gray-400 max-w-sm">
            আপনার পছন্দের বইগুলো ঘরে বসেই অর্ডার করুন। জ্ঞানের আলো ছড়িয়ে পড়ুক সর্বত্র।
          </p>
          
          {/* নিউজলেটার সাইনআপ প্লেসহোল্ডার */}
          <div className="pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-blue-500 mb-2">
              Subscribe to Newsletter
            </label>
            <div className="flex max-w-sm">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-l-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                disabled 
              />
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 rounded-r-md text-sm transition-colors cursor-not-allowed"
                disabled
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* ২. দ্রুত লিঙ্ক (Quick Links) */}
        <div className="md:justify-self-center">
          <h3 className="text-white font-semibold text-base mb-4 tracking-wide">Quick Links</h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a href="#about" className="hover:text-blue-400 transition-colors duration-200">About Us</a>
            </li>
            <li>
              <a href="#contact" className="hover:text-blue-400 transition-colors duration-200">Contact</a>
            </li>
            <li>
              <a href="#privacy" className="hover:text-blue-400 transition-colors duration-200">Privacy Policy</a>
            </li>
            <li>
              <a href="#terms" className="hover:text-blue-400 transition-colors duration-200">Terms of Service</a>
            </li>
          </ul>
        </div>

        {/* ৩. সোশ্যাল মিডিয়া আইকন */}
        <div className="md:justify-self-end">
          <h3 className="text-white font-semibold text-base mb-4 tracking-wide">Connect With Us</h3>
          <div className="flex gap-4">
            
            {/* Facebook */}
            <a href="#" className="p-2 bg-gray-900 hover:bg-blue-600 hover:text-white rounded-full text-gray-400 transition-all duration-300" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
            </a>

            {/* New X (Twitter) Logo */}
            <a href="#" className="p-2 bg-gray-900 hover:bg-blue-600 hover:text-white rounded-full text-gray-400 transition-all duration-300" aria-label="X (Twitter)">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a href="#" className="p-2 bg-gray-900 hover:bg-blue-600 hover:text-white rounded-full text-gray-400 transition-all duration-300" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>

          </div>
        </div>

      </div>

      {/* ৪. কপিরাইট তথ্য সেকশন */}
      <div className="border-t border-gray-900 bg-gray-950/50 py-6 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} LocalLibrary. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;