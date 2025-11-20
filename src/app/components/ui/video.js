"use client"
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoReviewGallery = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const videoRefs = useRef([]);
  const scrollContainerRef = useRef(null);

  // Color palette based on Nationwide Educational Services
  const colors = {
    primary: {
      main: '#CB342A',
      light: '#D65F57',
      dark: '#A32922'
    },
    secondary: {
      main: '#BCAE9F',
      light: '#C9BEB2',
      dark: '#A89A8C'
    },
    neutral: {
      text: '#191818',
      border: '#636060',
      background: '#FEFDFD'
    },
    accent: '#E53E3E' // For hover effects
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    let interval;
    // guard videos in case it's undefined during some render cycles
    const videosCount = videos?.length ?? 0;
    if (autoPlay && videosCount > 0 && !isScrolling) {
      interval = setInterval(() => {
        handleScroll('next');
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoPlay, videos?.length ?? 0, isScrolling]);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videosReview', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.success) {
        // Ensure we always set an array (API might return undefined/null)
        setVideos(Array.isArray(data.data) ? data.data : []);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const openVideoModal = (video, index) => {
    setSelectedVideo({ ...video, index });
    setIsModalOpen(true);
    setAutoPlay(false);
  };

  const closeVideoModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
    setAutoPlay(true);
  };

  const navigateVideo = (direction) => {
    if (!selectedVideo) return;
    const len = videos?.length ?? 0;
    if (len === 0) return;

    const newIndex = direction === 'next'
      ? (selectedVideo.index + 1) % len
      : (selectedVideo.index - 1 + len) % len;

    setSelectedVideo({ ...videos[newIndex], index: newIndex });
  };

  const handleScroll = (direction) => {
    const len = videos?.length ?? 0;
    if (!scrollContainerRef.current || len === 0) return;

    setIsScrolling(true);
    const container = scrollContainerRef.current;
    const cardWidth = 384; // w-96 = 384px
    const gap = 32; // gap-8 = 32px
    const scrollAmount = cardWidth + gap;
    
    let newIndex;
    let newScrollLeft;

    if (direction === 'next') {
      newIndex = (activeIndex + 1) % len;
      newScrollLeft = container.scrollLeft + scrollAmount;
    } else {
      newIndex = (activeIndex - 1 + len) % len;
      newScrollLeft = container.scrollLeft - scrollAmount;
    }

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    setActiveIndex(newIndex);
    setTimeout(() => setIsScrolling(false), 1000);
  };

  const scrollToIndex = (index) => {
    if (!scrollContainerRef.current) return;
    
    setIsScrolling(true);
    const container = scrollContainerRef.current;
    const cardWidth = 384; // w-96 = 384px
    const gap = 32; // gap-8 = 32px
    const scrollPosition = index * (cardWidth + gap);
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    setActiveIndex(index);
    setTimeout(() => setIsScrolling(false), 1000);
  };

  const handleVideoContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FEFDFD] via-[#F9F8F7] to-[#F5F4F3] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative"
        >
          <div className={`w-20 h-20 border-4 ${colors.primary.main}/30 border-t-${colors.primary.main} rounded-full animate-spin`} />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 border-2 border-[#CB342A]/50 border-b-[#CB342A] rounded-full"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-[${colors.primary.main}] font-semibold text-center mt-4`}
          >
            Loading inspiring stories...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFDFD] py-2 px-1">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        {/* Enhanced Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-4 bg-white/90 backdrop-blur-xl rounded-3xl px-8 py-4 border border-[#CB342A]/20 shadow-2xl mb-6"
          >
            <div className="flex space-x-1">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 bg-gradient-to-r from-[#CB342A] to-[#D65F57] rounded-full"
                />
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#CB342A] to-[#D65F57] bg-clip-text text-transparent">
              Student Success Stories
            </h1>
            <div className="flex space-x-1">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 + 0.6 }}
                  className="w-2 h-2 bg-gradient-to-r from-[#D65F57] to-[#CB342A] rounded-full"
                />
              ))}
            </div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-[#191818] max-w-3xl mx-auto leading-relaxed font-medium bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#636060]/20"
          >
            Watch real students share their transformative learning experiences and career success stories
          </motion.p>
        </motion.header>

        {/* Enhanced Video Gallery Section */}
        {(videos?.length ?? 0) > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-20"
          >
            <div className="relative group">
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#CB342A]/10 to-[#D65F57]/10 rounded-4xl blur-3xl opacity-60" />
              
              <div className="relative bg-white/95 backdrop-blur-xl rounded-4xl p-8 border border-[#CB342A]/15 shadow-2xl">
                <div className="max-w-7xl mx-auto">
                  {/* Enhanced Navigation Arrows */}
                  <motion.button
                    onClick={() => handleScroll('prev')}
                    whileHover={{ scale: 1.15, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-2xl border border-[#CB342A]/20 hover:border-[#CB342A]/40 transition-all duration-300 flex items-center justify-center group/arrow backdrop-blur-sm"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-[#CB342A] to-[#D65F57] rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white group-hover/arrow:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D65F57] to-[#CB342A] rounded-2xl opacity-0 group-hover/arrow:opacity-100 transition-opacity -z-10 blur-md" />
                  </motion.button>

                  <motion.button
                    onClick={() => handleScroll('next')}
                    whileHover={{ scale: 1.15, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-gradient-to-l from-white to-gray-50 rounded-2xl shadow-2xl border border-[#CB342A]/20 hover:border-[#CB342A]/40 transition-all duration-300 flex items-center justify-center group/arrow backdrop-blur-sm"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-[#D65F57] to-[#CB342A] rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white group-hover/arrow:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D65F57] to-[#CB342A] rounded-2xl opacity-0 group-hover/arrow:opacity-100 transition-opacity -z-10 blur-md" />
                  </motion.button>

                  {/* Enhanced Scrollable Content */}
                  <div 
                    ref={scrollContainerRef}
                    className="flex space-x-8 overflow-x-auto scrollbar-hide py-8 px-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    <AnimatePresence mode="popLayout">
                      {videos.map((video, index) => (
                        <motion.div
                          key={video._id}
                          layout
                          initial={{ opacity: 0, scale: 0.8, y: 50 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: -50 }}
                          transition={{ 
                            delay: index * 0.1, 
                            type: "spring", 
                            stiffness: 100,
                            damping: 15,
                            layout: { duration: 0.3 }
                          }}
                          whileHover={{ 
                            scale: 1.05,
                            y: -12,
                            transition: { duration: 0.3, type: "spring", stiffness: 400 }
                          }}
                          className="flex-none w-96 cursor-pointer group/card"
                          onClick={() => openVideoModal(video, index)}
                        >
                          {/* Enhanced Card Container */}
                          <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#636060]/20 hover:border-[#CB342A]/30 transition-all duration-500 group-hover/card:shadow-3xl">
                            {/* Animated Background Gradient */}
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-br from-[#CB342A]/5 via-transparent to-[#D65F57]/5 opacity-0 group-hover/card:opacity-100"
                              animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                            />
                            
                            {/* Thumbnail Container */}
                            <div className="relative w-full" style={{ paddingBottom: '177.78%' }}>
                              <div className="absolute inset-0">
                                {video.thumbnail ? (
                                  <motion.img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                    whileHover={{ scale: 1.15 }}
                                    transition={{ duration: 0.7, ease: "easeOut" }}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-[#CB342A]/10 to-[#D65F57]/10 flex items-center justify-center">
                                    <motion.div
                                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                                      transition={{ duration: 3, repeat: Infinity }}
                                      className="text-center text-[#CB342A] p-6"
                                    >
                                      <div className="w-20 h-20 bg-gradient-to-br from-[#CB342A] to-[#D65F57] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M8 5v14l11-7z"/>
                                        </svg>
                                      </div>
                                      <span className="text-lg font-semibold">Video Preview</span>
                                    </motion.div>
                                  </div>
                                )}
                                
                                {/* Enhanced Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-500">
                                  {/* Enhanced Play Button */}
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0, rotate: -180 }}
                                    whileHover={{ scale: 1, opacity: 1, rotate: 0 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                  >
                                    <div className="relative">
                                      <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="w-24 h-24 bg-gradient-to-br from-[#CB342A] to-[#D65F57] rounded-3xl flex items-center justify-center shadow-2xl"
                                      >
                                        <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M8 5v14l11-7z"/>
                                        </svg>
                                      </motion.div>
                                      <div className="absolute inset-0 bg-gradient-to-br from-[#D65F57] to-[#CB342A] rounded-3xl blur-xl opacity-60 -z-10" />
                                    </div>
                                  </motion.div>
                                </div>

                                {/* Enhanced Duration Badge */}
                                {video.duration && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    className="absolute bottom-4 right-4 bg-black/90 backdrop-blur-md text-white px-3 py-2 rounded-xl text-sm font-semibold border border-white/20 shadow-lg"
                                  >
                                    {formatDuration(video.duration)}
                                  </motion.div>
                                )}

                                {/* Enhanced Course Badge */}
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.2 }}
                                  className="absolute top-4 left-4 bg-gradient-to-r from-[#CB342A] to-[#D65F57] text-white px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm shadow-lg border border-white/20"
                                >
                                  {video.courseName}
                                </motion.div>

                                {/* View Indicator */}
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  whileInView={{ opacity: 1 }}
                                  className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium border border-white/10"
                                >
                                  Click to watch
                                </motion.div>
                              </div>
                            </div>

                            {/* Enhanced Content */}
                            <div className="relative p-6 bg-white">
                              <motion.h3 
                                className="font-bold text-xl text-[#191818] mb-3 line-clamp-2 leading-tight group-hover/card:text-[#CB342A] transition-colors duration-300"
                              >
                                {video.title}
                              </motion.h3>
                              <motion.p 
                                className="text-[#636060] text-sm mb-4 line-clamp-3 leading-relaxed group-hover/card:text-[#191818] transition-colors duration-300"
                              >
                                {video.description || "Experience this student's journey and their valuable feedback about the course."}
                              </motion.p>
                              
                              {/* Enhanced Student Info */}
                              <div className="flex items-center space-x-4 pt-4 border-t border-[#636060]/20">
                                <motion.div
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  className="relative"
                                >
                                  <div className="w-14 h-14 bg-gradient-to-br from-[#CB342A] to-[#D65F57] rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    {video.title?.charAt(0) || 'S'}
                                  </div>
                                  <div className="absolute -inset-1 bg-gradient-to-br from-[#CB342A] to-[#D65F57] rounded-2xl blur opacity-30 -z-10" />
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-[#191818] text-sm truncate">
                                    {video.title?.split(' ').slice(0, 2).join(' ') || 'Student Review'}
                                  </h4>
                                  <motion.p 
                                    className="text-[#CB342A] text-xs font-medium truncate group-hover/card:text-[#D65F57] transition-colors duration-300"
                                  >
                                    Course Graduate
                                  </motion.p>
                                </div>
                                <motion.div
                                  whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                                  transition={{ duration: 0.5 }}
                                  className="text-[#CB342A] group-hover/card:text-[#D65F57] transition-colors duration-300"
                                >
                                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 00-1.06 1.06 5.5 5.5 0 010 7.78.75.75 0 001.06 1.06 7 7 0 000-9.9z" />
                                    <path d="M15.932 7.757a.75.75 0 00-1.061 1.06 2.5 2.5 0 010 3.536.75.75 0 001.06 1.06 4 4 0 000-5.656z" />
                                  </svg>
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Enhanced Navigation Dots */}
                  {(videos?.length ?? 0) > 0 && (
                    <div className="flex justify-center space-x-3 mt-8">
                      {videos?.map((_, index) => (
                        <motion.button
                          key={index}
                          onClick={() => scrollToIndex(index)}
                          whileHover={{ scale: 1.4 }}
                          whileTap={{ scale: 0.8 }}
                          animate={{ 
                            scale: activeIndex === index ? 1.4 : 1,
                            backgroundColor: activeIndex === index ? "#CB342A" : "#e2e8f0",
                            width: activeIndex === index ? "32px" : "12px"
                          }}
                          className="h-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-[#CB342A]/20 shadow-sm"
                        />
                      ))}
                    </div>
                  )}

                  {/* Enhanced Progress Indicator */}
                  <motion.div 
                    className="flex justify-center items-center space-x-4 mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div 
                      className="text-sm text-[#191818] font-semibold bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#636060]/20"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {activeIndex + 1} of {videos?.length ?? 0} Stories
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Enhanced Empty State */}
        {(videos?.length ?? 0) === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
                y: [0, -10, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-9xl mb-8"
            >
              🎥
            </motion.div>
            <motion.h3 
              className="text-4xl font-bold bg-gradient-to-r from-[#CB342A] to-[#D65F57] bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Amazing Content Coming Soon
            </motion.h3>
            <motion.p 
              className="text-[#191818] text-xl max-w-md mx-auto leading-relaxed font-medium bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#636060]/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              We're curating incredible student success stories for you. Get ready to be inspired!
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center space-x-3 mt-8"
            >
              {[1, 2, 3, 4, 5].map(i => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 1, 0.3],
                    y: [0, -8, 0]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.2 
                  }}
                  className="w-3 h-3 bg-gradient-to-r from-[#CB342A] to-[#D65F57] rounded-full"
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced Video Modal */}
      <AnimatePresence>
        {isModalOpen && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4"
            onClick={closeVideoModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50, rotateX: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -50, rotateX: -15 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-white rounded-4xl max-w-6xl w-full max-h-[95vh] overflow-hidden border border-[#CB342A]/20 shadow-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Enhanced Video Player Section */}
              <div className="relative bg-black">
                <div className="absolute inset-0 bg-gradient-to-br from-[#CB342A]/10 to-[#D65F57]/10" />
                <video
                  ref={el => videoRefs.current[selectedVideo.index] = el}
                  src={selectedVideo.cloudinaryUrl}
                  controls
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                  className="w-full h-auto max-h-[70vh]"
                  onContextMenu={handleVideoContextMenu}
                  autoPlay
                />
                
                {/* Enhanced overlay gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              </div>

              {/* Enhanced Video Info Section */}
              <div className="p-8 bg-white">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1 pr-8">
                    <motion.h2 
                      className="text-3xl font-bold text-[#191818] mb-4 leading-tight"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {selectedVideo.title}
                    </motion.h2>
                    <motion.p 
                      className="text-[#636060] text-lg mb-6 leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {selectedVideo.description}
                    </motion.p>
                    <motion.div 
                      className="flex items-center space-x-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className="text-sm font-bold text-[#CB342A] bg-[#CB342A]/10 px-4 py-2 rounded-full border border-[#CB342A]/20 backdrop-blur-sm">
                        {selectedVideo.courseName}
                      </span>
                      {selectedVideo.duration && (
                        <span className="text-sm text-[#636060] font-medium flex items-center space-x-2 bg-gray-100/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#636060]/20">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                            <path d="M13 7h-2v6h6v-2h-4z"/>
                          </svg>
                          <span>Duration: {formatDuration(selectedVideo.duration)}</span>
                        </span>
                      )}
                    </motion.div>
                  </div>
                  
                  {/* Enhanced Close Button */}
                  <motion.button
                    onClick={closeVideoModal}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-4 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all duration-300 group/close backdrop-blur-sm border border-gray-200"
                  >
                    <svg className="w-6 h-6 text-[#636060] group-hover/close:text-[#191818]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                {/* Enhanced Navigation */}
                <motion.div 
                  className="flex justify-between items-center pt-6 border-t border-[#636060]/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    onClick={() => navigateVideo('prev')}
                    disabled={(videos?.length ?? 0) <= 1}
                    whileHover={{ scale: (videos?.length ?? 0) > 1 ? 1.05 : 1, x: (videos?.length ?? 0) > 1 ? -5 : 0 }}
                    whileTap={{ scale: (videos?.length ?? 0) > 1 ? 0.95 : 1 }}
                    className="flex items-center space-x-3 px-8 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 group/nav backdrop-blur-sm border border-gray-200"
                  >
                    <svg className="w-5 h-5 text-[#636060] group-hover/nav:text-[#191818]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-[#636060] group-hover/nav:text-[#191818] font-semibold">Previous Story</span>
                  </motion.button>

                  <motion.span 
                    className="text-sm text-[#636060] font-medium bg-gray-100/80 backdrop-blur-sm px-6 py-3 rounded-full border border-[#636060]/20 shadow-sm"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Story {selectedVideo.index + 1} of {videos?.length ?? 0}
                  </motion.span>

                  <motion.button
                    onClick={() => navigateVideo('next')}
                    disabled={(videos?.length ?? 0) <= 1}
                    whileHover={{ scale: (videos?.length ?? 0) > 1 ? 1.05 : 1, x: (videos?.length ?? 0) > 1 ? 5 : 0 }}
                    whileTap={{ scale: (videos?.length ?? 0) > 1 ? 0.95 : 1 }}
                    className="flex items-center space-x-3 px-8 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 group/nav backdrop-blur-sm border border-gray-200"
                  >
                    <span className="text-[#636060] group-hover/nav:text-[#191818] font-semibold">Next Story</span>
                    <svg className="w-5 h-5 text-[#636060] group-hover/nav:text-[#191818]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced CSS */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default VideoReviewGallery;