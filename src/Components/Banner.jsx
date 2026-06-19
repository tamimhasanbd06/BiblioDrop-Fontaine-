"use client"; // <--- এই লাইনটি একদম উপরে যোগ করুন

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// স্লাইডারের জন্য ডামি ইমেজ এবং তথ্য
const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1920&auto=format&fit=crop',
    title: 'Discover Your Next Great Adventure',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1920&auto=format&fit=crop',
    title: 'Knowledge at Your Doorstep',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1920&auto=format&fit=crop',
    title: 'Connect with Thousands of Stories',
  }
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // অটো স্লাইড চেঞ্জার (৫ সেকেন্ড পর পর)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[85vh] min-h-[500px] overflow-hidden bg-gray-900 font-sans">
      
      {/* ইমেজ স্লাইডার (ব্যাকগ্রাউন্ড) */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={slides[currentSlide].image}
            alt="Library Concept"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.4, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* গ্রেডিয়েন্ট ওভারলে */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />

      {/* কন্টেন্ট সেকশন */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-start px-6 md:px-16 lg:px-24 max-w-5xl text-white">
        
        {/* ট্যাগলাইন - পরিবর্তিত হয়ে এখন নীল রঙের */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-blue-500 font-semibold tracking-wider text-sm md:text-base uppercase mb-3"
        >
          Your Local Library, Delivered
        </motion.p>

        <div className="h-[120px] md:h-[160px] overflow-hidden mb-6">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold leading-tight font-serif text-slate-100"
            >
              {slides[currentSlide].title}
            </motion.h1>
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-gray-300 text-base md:text-lg max-w-xl mb-8 leading-relaxed"
        >
          বইয়ের এক বিশাল জগত এখন আপনার হাতের মুঠোয়। ঘরে বসেই অর্ডার করুন আপনার পছন্দের বই আর হারিয়ে যান জ্ঞানের আলোয়।
        </motion.p>

        {/* CTA বাটন - পরিবর্তিত হয়ে এখন নীল এবং নীল হোভার ইফেক্ট যুক্ত */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-full shadow-lg transition-colors duration-300 flex items-center gap-2 text-sm md:text-base tracking-wide">
            Browse Books
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* স্লাইডার ইন্ডিকেটর ডটস - একটিভ ডট এখন নীল রঙের */}
      <div className="absolute bottom-8 right-6 md:right-16 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'w-8 bg-blue-500' : 'w-2.5 bg-gray-500'
            }`}
          />
        ))}
      </div>

    </div>
  );
};

export default HeroBanner;