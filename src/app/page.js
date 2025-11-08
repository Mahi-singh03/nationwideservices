// components/Home.jsx
'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isVisible, setIsVisible] = useState(false);

  function calculateTimeLeft() {
    const launchDate = "December 31, 2024";
    const difference = +new Date(launchDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    // Add your email submission logic here
    console.log('Email submitted:', email);
    alert('Thank you! We will notify you when we launch.');
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className={`max-w-4xl w-full text-center transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        
        {/* Animated Logo/Icon */}
        <div className="mb-6 md:mb-8">
          <div className="relative inline-block">
            <div className="w-20 h-20 md:w-32 md:h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto shadow-2xl animate-float">
              <svg 
                className="w-10 h-10 md:w-16 md:h-16 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
            </div>
            {/* Pulsing dot */}
            <div className="absolute top-2 right-2 md:top-4 md:right-4">
              <div className="w-4 h-4 md:w-6 md:h-6 bg-green-400 rounded-full animate-ping"></div>
              <div className="w-4 h-4 md:w-6 md:h-6 bg-green-500 rounded-full absolute top-0"></div>
            </div>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 px-2">
          Coming <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Soon</span>
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl text-gray-300 mb-8 md:mb-12 max-w-md mx-auto leading-relaxed px-4">
          Something amazing is in the works! We're building an incredible experience for you. Stay tuned for the launch!
        </p>

        {/* Countdown Timer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto mb-8 md:mb-12 px-2">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="text-center">
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 sm:p-4 border border-white/20">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                  {value || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-300 uppercase tracking-wider">
                  {unit}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mb-8 md:mb-12 px-4">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Progress</span>
            <span>85%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 md:h-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 md:h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: '85%' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>



        {/* Contact & Social Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6 px-2">
          {/* Contact Email */}
          <div className="flex items-center text-gray-300 text-sm md:text-base">
            <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href="mailto:nationwideadmissions@gmail.com" className="hover:text-white transition-colors break-all">
              nationwideadmissions@gmail.com
            </a>
          </div>


        </div>
      </div>
    </div>
  );
}