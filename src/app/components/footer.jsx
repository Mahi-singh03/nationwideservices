'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaClock, FaPhone, FaChevronUp, FaLinkedin, FaFacebook } from 'react-icons/fa';
import { IoIosMail } from 'react-icons/io';
import Link from 'next/link';
import { useColors } from '@/app/hooks/useColorSchema';
import { useState, useEffect, useCallback } from 'react';

const Footer = () => {
  const { colors, getClasses } = useColors();
  const [isVisible, setIsVisible] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll to top functionality
  const toggleVisibility = useCallback(() => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [toggleVisibility]);

  // Mobile accordion toggle
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const footerSections = [
    {
      title: 'Quick Links',
      id: 'quick-links',
      links: [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'Gallery', href: '/gallery' },
        { name: 'Achievements', href: '/achievements' },
        { name: 'Testimonials', href: '/testimonials' },
        { name: 'Contact', href: '/contact' },
      ]
    },
    {
      title: 'Our Services',
      id: 'our-services',
      links: [
        { name: 'Canada Immigration', href: '/immigration/canada' },
        { name: 'Australia Immigration', href: '/immigration/australia' },
        { name: 'USA Immigration', href: '/immigration/usa' },
        { name: 'UK Immigration', href: '/immigration/uk' },
        { name: 'New Zealand Immigration', href: '/immigration/newzealand' },
        { name: 'Study Abroad', href: '/services/study-abroad' },
        { name: 'Work Permits', href: '/services/work-permits' },
      ]
    },
    {
      title: 'Contact Info',
      id: 'contact-info',
      items: [
        {
          icon: <FaMapMarkerAlt className="h-4 w-4 flex-shrink-0" />,
          text: 'Branch Office Nawanshahr, Head Office Canada'
        },
        {
          icon: <FaPhone className="h-4 w-4 flex-shrink-0" />,
          text: '+91 95920-12334, +1905-462-6456  ',
          href: 'tel:+91 9592012334'
        },
      
        {
          icon: <IoIosMail className="h-4 w-4 flex-shrink-0" />,
          text: 'nationwideadmissions@gmail.com',
          href: 'mailto:nationwideadmissions@gmail.com'
        },
        {
          icon: <FaClock className="h-4 w-4 flex-shrink-0" />,
          text: 'Mon - Sat: 9:00 AM - 6:00 PM'
        }
      ]
    }
  ];

  const socialLinks = [
    {
      icon: <FaInstagram className="h-5 w-5" />,
      ref: 'https://www.instagram.com/nationwideeducationalservices/', 
      name: 'Instagram'
    },
    {
      icon: <FaWhatsapp className="h-5 w-5" />,
       href: 'https://wa.me/7889287161?text=Hi%2C%20I%20am%20interested%20in%20your%20services%20at%20Nationwide%20Services.%20Could%20you%20please%20help%20me%20with%20more%20details%3F',
      name: 'WhatsApp'
    },
   
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Disclaimer', href: '/disclaimer' },
    { name: 'Cookie Policy', href: '/cookie-policy' },
  ];

  if (!mounted) {
    return null; // Prevent hydration issues
  }

  return (
    <footer className={`${getClasses('bg', 'neutral')} border-t ${getClasses('border', 'neutral')} relative pb-22 lg:pb-0`}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Info - Always visible */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Logo */}
              <Link href="/" className="inline-block mb-4" aria-label="Go to homepage">
                <motion.div
                  className="w-62  relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img 
                    src="/logo.jpeg" 
                    alt="Immigration Consultant Logo" 
                    className="w-full h-full object-contain"
                    loading="lazy"
                    width={128}
                    height={64}
                  />
                </motion.div>
              </Link>

              {/* Description */}
              <p className={`text-sm mb-6 leading-relaxed ${getClasses('text', 'neutral')}`}>
                Your trusted partner for immigration services. We help you achieve your dreams 
                of settling abroad with professional guidance and comprehensive support. 
                Over 10+ years of experience in successful visa processing.
              </p>

              {/* Social Links */}
              <div className="flex space-x-2">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full bg-red-500 border transition-all duration-300 ${getClasses('border', 'neutral')} ${getClasses('text', 'neutral')} hover:${getClasses('button', 'primary')} hover:border-transparent hover:transform hover:scale-110`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Follow us on ${social.name}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Links & Services - Desktop */}
          <div className="hidden md:grid md:grid-cols-2 lg:col-span-2 gap-8">
            {footerSections.slice(0, 2).map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <h3 className={`text-lg font-semibold mb-4 ${getClasses('text', 'primary')}`}>
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <motion.li key={link.name} whileHover={{ x: 5 }}>
                      <Link
                        href={link.href}
                        className={`text-sm transition-colors duration-200 hover:${getClasses('text', 'primary')} ${getClasses('text', 'neutral')} block py-2 border-b ${getClasses('border', 'primary')} border-opacity-20 last:border-b-0`}
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Contact Info - Desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, margin: "-50px" }}
            className="hidden md:block"
          >
            <h3 className={`text-lg font-semibold mb-4 ${getClasses('text', 'neutral')}`}>
              {footerSections[2].title}
            </h3>
            <ul className="space-y-4">
              {footerSections[2].items.map((item, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start space-x-3 group"
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className={`mt-0.5 ${getClasses('text', 'primary')} group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    {item.href ? (
                      <a
                        href={item.href}
                        className={`text-sm transition-colors duration-200 hover:${getClasses('text', 'primary')} ${getClasses('text', 'neutral')} break-words leading-relaxed`}
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span className={`text-sm ${getClasses('text', 'neutral')} break-words leading-relaxed`}>
                        {item.text}
                      </span>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Mobile Accordion */}
          <div className="md:hidden space-y-2">
            {footerSections.map((section, index) => (
              <div key={section.id} className={`border-b ${getClasses('border', 'neutral')} border-opacity-30`}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`flex justify-between items-center w-full text-left font-semibold ${getClasses('text', 'primary')} py-4 hover:${getClasses('text', 'primary')} transition-colors`}
                  aria-expanded={expandedSections[section.id]}
                  aria-controls={`${section.id}-content`}
                >
                  <span>{section.title}</span>
                  <motion.div
                    animate={{ rotate: expandedSections[section.id] ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaChevronUp className="h-4 w-4" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {expandedSections[section.id] && (
                    <motion.div
                      id={`${section.id}-content`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      {section.links ? (
                        <ul className="space-y-1 py-2">
                          {section.links.map((link) => (
                            <motion.li 
                              key={link.name}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Link
                                href={link.href}
                                className={`text-sm transition-colors hover:${getClasses('text', 'primary')} ${getClasses('text', 'neutral')} block py-3 px-4 rounded-lg hover:bg-opacity-10 ${getClasses('bg', 'perimary')}`}
                                onClick={() => setExpandedSections({})}
                              >
                                {link.name}
                              </Link>
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <ul className="space-y-3 py-2">
                          {section.items.map((item, itemIndex) => (
                            <motion.li 
                              key={itemIndex} 
                              className="flex items-start space-x-3 py-2 px-4"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, delay: itemIndex * 0.05 }}
                            >
                              <div className={`mt-0.5 ${getClasses('text', 'primary')}`}>
                                {item.icon}
                              </div>
                              <div className="flex-1">
                                {item.href ? (
                                  <a
                                    href={item.href}
                                    className={`text-sm transition-colors hover:${getClasses('text', 'primary')} ${getClasses('text', 'neutral')} break-words`}
                                  >
                                    {item.text}
                                  </a>
                                ) : (
                                  <span className={`text-sm ${getClasses('text', 'neutral')} break-words`}>
                                    {item.text}
                                  </span>
                                )}
                              </div>
                            </motion.li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`border-t ${getClasses('border', 'neutral')} border-opacity-30`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <motion.p 
              className={`text-sm text-center md:text-left ${getClasses('text', 'neutral')}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              © {new Date().getFullYear()} Immigration Consultant. All rights reserved.
            </motion.p>

            {/* Legal Links */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 md:gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs transition-colors duration-200 hover:${getClasses('text', 'primary')} ${getClasses('text', 'neutral')} font-medium`}
                >
                  {link.name}
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className={`fixed bottom-24 right-4 z-50 p-3 rounded-full shadow-lg ${getClasses('button', 'primary')} hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-90`}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <FaChevronUp className="h-5 w-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>


    </footer>
  );
};

export default Footer;