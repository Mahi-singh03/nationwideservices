'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { FaPhone, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoIosCall } from "react-icons/io";
import { useColors } from '@/app/hooks/useColorSchema';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const pathname = usePathname();
  const { colors, getClasses, getStyles } = useColors();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  };

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
    setActiveDropdown(null);
    document.body.style.overflow = '';
  };

  const phoneNumbers = [
    { label: 'Official Contact', number: '+91 95920-12334' },
    { label: 'Emergency', number: '+91 96272-00088' }
  ];

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Achievements', href: '/achievements' },
    { name: 'About', href: '/about' },
    { name: 'Testimonials', href: '/testimonials' },
    { 
      name: 'Our Services', 
      href: '#', 
      dropdown: [
        { name: 'Canada Immigration', href: '/immigration/canada' },
        { name: 'Australia Immigration', href: '/immigration/australia' },
        { name: 'USA Immigration', href: '/immigration/usa' },
        { name: 'UK Immigration', href: '/immigration/uk' },
        { name: 'New Zealand Immigration', href: '/immigration/newzealand' },
      ],
    },
  ];

  const socialLinks = [
    { 
      icon: <FaInstagram className="h-7 w-7" />, 
      href: 'https://www.instagram.com/nationwideeducationalservices/', 
      name: 'Instagram' 
    },
    { 
      icon: <FaWhatsapp className="h-7 w-7" />, 
      href: 'https://wa.me/7889287161?text=Hi%2C%20I%20am%20interested%20in%20your%20services%20at%20Nationwide%20Services.%20Could%20you%20please%20help%20me%20with%20more%20details%3F',
      name: 'WhatsApp' 
    }
  ];

  return (
    <>
     
        <motion.nav 
          className={`fixed w-full z-50 transition-all duration-300 shadow-sm ${getClasses('bg', 'neutral')}`}
          style={{ 
    
            boxShadow: scrolled ? '0 2px 15px rgba(231, 119, 119, 0.84)' : 'none'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/" className={`font-bold text-xl flex items-center ${getClasses('text', 'neutral')}`}>
                <motion.div
                  className="w-auto h-17 mr-3 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-contain" />
                </motion.div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <div key={link.name} className="relative">
                  {link.dropdown ? (
                    <motion.div 
                      onHoverStart={() => setIsVerificationOpen(true)}
                      onHoverEnd={() => setIsVerificationOpen(false)}
                    >
                      <motion.button
                        className={`flex items-center px-4 py-3 text-lg font-medium rounded-lg transition-all duration-200 ${
                          pathname.startsWith('/immigration')
                            ? getClasses('button', 'primary')
                            : `${getClasses('text', 'neutral')} hover:${getClasses('button', 'primary').split(' ')[0]} hover:scale-105`
                        }`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {link.name}
                        <motion.div
                          animate={{ rotate: isVerificationOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDownIcon className="ml-1 h-4 w-4" />
                        </motion.div>
                      </motion.button>

                      <AnimatePresence>
                        {isVerificationOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className={`absolute left-0 mt-1 w-56 rounded-lg shadow-lg py-2 z-50 border ${getClasses('bg', 'neutral')} ${getClasses('border', 'neutral')}`}
                          >
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                className={`block px-4 py-3 text-base transition-all duration-200 mx-2 my-1 rounded-md ${
                                  pathname === item.href
                                    ? getClasses('button', 'primary')
                                    : `${getClasses('text', 'neutral')} hover:${getClasses('button', 'primary').split(' ')[0]} hover:translate-x-1`
                                }`}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <Link
                      href={link.href}
                      className={`px-4 py-3 text-lg font-medium rounded-lg transition-all duration-200 ${
                        pathname === link.href
                          ? getClasses('button', 'primary')
                          : `${getClasses('text', 'neutral')} hover:${getClasses('button', 'primary').split(' ')[0]} hover:scale-105`
                      }`}
                    >
                      <motion.span
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {link.name}
                      </motion.span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              
              {/* Phone Dropdown */}
              <div className="hidden md:block relative">
                <motion.button
                  onClick={() => setIsPhoneOpen(!isPhoneOpen)}
                  className={`p-3 rounded-xl transition-all duration-200 ${getClasses('text', 'neutral')} hover:${getClasses('button', 'primary').split(' ')[0]} hover:scale-110`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IoIosCall className="h-7 w-7" />
                </motion.button>

                <AnimatePresence>
                  {isPhoneOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className={`absolute right-0 mt-2 w-64 rounded-xl shadow-lg py-2 z-50 border ${getClasses('bg', 'neutral')} ${getClasses('border', 'neutral')}`}
                    >
                      <div className={`px-4 py-3 text-base font-semibold border-b ${getClasses('text', 'neutral')} ${getClasses('border', 'neutral')}`}>
                        Contact Numbers
                      </div>
                      {phoneNumbers.map((phone, index) => (
                        <motion.a
                          key={index}
                          href={`tel:${phone.number.replace(/\D/g, '')}`}
                          className={`block px-4 py-3 text-base transition-all duration-200 hover:scale-105 ${getClasses('text', 'neutral')}`}
                          whileHover={{ x: 5 }}
                        >
                          <div className="font-medium">{phone.label}</div>
                          <div className={`${getClasses('text', 'primary')} font-semibold`}>{phone.number}</div>
                        </motion.a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Social Icons */}
              <div className="hidden md:flex items-center space-x-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-xl transition-all duration-200 ${getClasses('text', 'neutral')} hover:${getClasses('button', 'primary').split(' ')[0]} hover:scale-110`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <motion.button
                  onClick={toggleMenu}
                  className={`p-3 rounded-xl transition-all duration-200 ${getClasses('text', 'neutral')} hover:${getClasses('button', 'primary').split(' ')[0]}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: '100vh' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden fixed top-20 left-0 right-0 bottom-0 ${getClasses('bg', 'neutral')} z-40 overflow-y-auto`}
            >
              <div className="px-4 pt-6 pb-32 space-y-2">
                {navLinks.map((link) => (
                  <div key={link.name} className="border-b border-opacity-20 last:border-b-0">
                    {link.dropdown ? (
                      <>
                        <motion.button
                          onClick={() => toggleDropdown(link.name)}
                          className={`w-full text-left px-4 py-4 rounded-xl text-lg font-medium flex items-center justify-between ${getClasses('text', 'neutral')} active:scale-95 transition-transform`}
                          whileTap={{ scale: 0.95 }}
                        >
                          {link.name}
                          <motion.div
                            animate={{ rotate: activeDropdown === link.name ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDownIcon className="h-5 w-5" />
                          </motion.div>
                        </motion.button>
                        <AnimatePresence>
                          {activeDropdown === link.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-6 pb-2"
                            >
                              {link.dropdown.map((item) => (
                                <Link
                                  key={item.name}
                                  href={item.href}
                                  onClick={closeMobileMenu}
                                  className={`block px-4 py-3 rounded-lg text-base my-1 transition-all duration-200 active:scale-95 ${getClasses('text', 'neutral')}`}
                                >
                                  <motion.span
                                    whileHover={{ x: 5 }}
                                  >
                                    {item.name}
                                  </motion.span>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={closeMobileMenu}
                        className={`block px-4 py-4 rounded-xl text-lg font-medium ${getClasses('text', 'neutral')} active:scale-95 transition-transform`}
                      >
                        <motion.span
                          whileHover={{ x: 5 }}
                        >
                          {link.name}
                        </motion.span>
                      </Link>
                    )}
                  </div>
                ))}
                
                {/* Mobile Contact Section */}
                <div className="pt-8 px-4">
                  <h3 className={`text-lg font-semibold mb-4 ${getClasses('text', 'neutral')}`}>Contact Us</h3>
                  <div className="space-y-3">
                    {phoneNumbers.map((phone, index) => (
                      <motion.a
                        key={index}
                        href={`tel:${phone.number.replace(/\D/g, '')}`}
                        className={`flex items-center justify-between p-3 rounded-xl border ${getClasses('border', 'neutral')} ${getClasses('text', 'neutral')} active:scale-95 transition-all`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div>
                          <div className="font-medium text-sm">{phone.label}</div>
                          <div className={`${getClasses('text', 'primary')} font-semibold`}>{phone.number}</div>
                        </div>
                        <IoIosCall className="h-5 w-5" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Social Bar */}
      <motion.div 
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t ${getClasses('bg', 'neutral')} ${getClasses('border', 'neutral')}`}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex justify-around py-3">
          <motion.a
            href={`tel:${phoneNumbers[0].number.replace(/\D/g, '')}`}
            className={`p-4 rounded-xl ${getClasses('text', 'neutral')}`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <IoIosCall className="h-6 w-6" />
          </motion.a>
          {socialLinks.map((social) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              className={`p-4 rounded-xl ${getClasses('text', 'neutral')}`}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              {social.icon}
            </motion.a>
          ))}
        </div>
      </motion.div>

      <div className="md:hidden pb-20"></div>
    </>
  );
};

export default Navbar;