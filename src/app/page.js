// components/Home.jsx
'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  return (
       <section className="relative">
        <div className="absolute inset-0 overflow-hidden " />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto object-cover"
        >
          {/* Mobile-first video source */}
          <source
            src="https://res.cloudinary.com/dufxj1sau/video/upload/v1742188663/Welcome_to_our_2_asgquc.mp4"
            type="video/mp4"
            media="(max-width: 768px)"
          />
          {/* Default video source for larger screens */}
          <source
            src="https://res.cloudinary.com/dni5zov67/video/upload/v1763104910/IMG_4968_1_oit31l.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </section>
  )
}