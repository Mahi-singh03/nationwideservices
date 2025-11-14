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

  const phoneNumbers = [
    { label: 'Official Contact', number: '+91 62804-05570' },
    { label: 'Emergency', number: '+91 78892-87161' }
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
        { name: 'USA  Immigration', href: '/immigration/usa' },
        { name: 'UK Immigration', href: '/immigration/uk' },
        { name: 'New Zealand Immigration', href: '/immigration/newzealand' },
      ],
    },
  ];

  const socialLinks = [
    { 
      icon: <FaInstagram className="h-7 w-7" />, 
      href: 'https://www.instagram.com/colorsense_salon/', 
      name: 'Instagram' 
    },
    { 
      icon: <FaWhatsapp className="h-7 w-7" />, 
      href: 'https://wa.me/7889287161?text=Hi%2C%20I%20am%20interested%20in%20your%20services%20at%20Colour%20Sense%20Salon.%20Could%20you%20please%20help%20me%20with%20more%20details%3F',
      name: 'WhatsApp' 
    }
  ];

  return (
    <>
      {/* Main Navbar */}
      <motion.nav 
        className={`fixed w-full z-50 transition-all duration-300 shadow-sm ${getClasses('bg', 'neutral')}`}
        style={{ 
          borderBottom: scrolled ? `1px solid ${colors.neutral.border}` : 'none'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link href="/" className={`font-bold text-xl flex items-center ${getClasses('text', 'neutral')}`}>
                <motion.div
                  className="w-auto h-17 mr-3  flex items-center justify-center "
                  
                  whileHover={{ scale: 1.05 }}
                >
                  <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-contain" />
                </motion.div>
                
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                <div key={link.name} className="relative">
                  {link.dropdown ? (
                    <motion.div 
                      onHoverStart={() => setIsVerificationOpen(true)}
                      onHoverEnd={() => setIsVerificationOpen(false)}
                    >
                      <motion.button
                        className={`flex items-center px-3 py-2 text-lg font-medium  rounded-md transition-colors ${
                          pathname.startsWith('/Varify') || pathname.startsWith('/student')
                            ? getClasses('button', 'primary')
                            : getClasses('text', 'neutral') + ' hover:' + getClasses('button', 'primary').split(' ')[0]
                        }`}
                        whileHover={{ y: -2 }}
                      >
                        {link.name}
                        <ChevronDownIcon className="ml-1 h-5 w-5" />
                      </motion.button>

                      <AnimatePresence>
                        {isVerificationOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 border ${getClasses('bg', 'neutral')} ${getClasses('border', 'neutral')}`}
                          >
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                className={`block px-4 py-2 text-base transition-colors mx-2 my-1 rounded-md ${
                                  pathname === item.href
                                    ? getClasses('button', 'primary')
                                    : getClasses('text', 'neutral') + ' hover:' + getClasses('button', 'primary').split(' ')[0]
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
                      className={`px-3 py-2 text-lg font-medium rounded-md transition-colors ${
                        pathname === link.href
                          ? getClasses('button', 'primary')
                          : getClasses('text', 'neutral') + ' hover:' + getClasses('button', 'primary').split(' ')[0]
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-5">
              
              {/* Phone Dropdown */}
              <div className="hidden md:block relative">
                <motion.button
                  onClick={() => setIsPhoneOpen(!isPhoneOpen)}
                  className={`p-2 rounded-md transition-colors ${getClasses('text', 'neutral')} hover:${getClasses('button', 'primary').split(' ')[0]}`}
                  whileHover={{ scale: 1.1 }}
                >
                  <IoIosCall className="h-8 w-8" />
                </motion.button>

                <AnimatePresence>
                  {isPhoneOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 z-50 border ${getClasses('bg', 'neutral')} ${getClasses('border', 'neutral')}`}
                    >
                      <div className={`px-4 py-2 text-base font-medium border-b ${getClasses('text', 'neutral')} ${getClasses('border', 'neutral')}`}>
                        Contact Numbers
                      </div>
                      {phoneNumbers.map((phone, index) => (
                        <a
                          key={index}
                          href={`tel:${phone.number.replace(/\D/g, '')}`}
                          className={`block px-4 py-2 text-base transition-colors hover:${getClasses('button', 'primary').split(' ')[0]} ${getClasses('text', 'neutral')}`}
                        >
                          <div className="font-medium">{phone.label}</div>
                          <div className={getClasses('text', 'primary')}>{phone.number}</div>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Social Icons */}
              <div className="hidden md:flex items-center space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-md transition-colors ${getClasses('text', 'neutral')} hover:${getClasses('button', 'primary').split(' ')[0]}`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <motion.button
                  onClick={toggleMenu}
                  className={`p-2 rounded-md transition-colors ${getClasses('text', 'neutral')} hover:${getClasses('button', 'primary').split(' ')[0]}`}
                  whileHover={{ scale: 1.1 }}
                >
                  {isOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
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
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden ${getClasses('bg', 'neutral')}`}
            >
              <div className="px-2 pt-2 pb-4 space-y-1">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    {link.dropdown ? (
                      <>
                        <button
                          onClick={() => setIsVerificationOpen(!isVerificationOpen)}
                          className={`w-full text-left px-3 py-3 rounded-md text-lg font-medium ${getClasses('text', 'neutral')}`}
                        >
                          {link.name}
                        </button>
                        {isVerificationOpen && (
                          <div className="pl-4">
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={toggleMenu}
                                className={`block px-3 py-2 rounded-md ${getClasses('text', 'neutral')}`}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={toggleMenu}
                        className={`block px-3 py-3 rounded-md text-lg font-medium ${getClasses('text', 'neutral')}`}
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Social Bar */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t ${getClasses('bg', 'neutral')} ${getClasses('border', 'neutral')}`}>
        <div className="flex justify-around py-4">
          <motion.a
            href={`tel:${phoneNumbers[0].number.replace(/\D/g, '')}`}
            className={`p-3 ${getClasses('text', 'neutral')}`}
            whileHover={{ scale: 1.2 }}
          >
            <IoIosCall className="h-6 w-6" />
          </motion.a>
          {socialLinks.map((social) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              className={`p-3 ${getClasses('text', 'neutral')}`}
              whileHover={{ scale: 1.2 }}
            >
              {social.icon}
            </motion.a>
          ))}
        </div>
      </div>

      <div className="md:hidden pb-20"></div>
    </>
  );
};

export default Navbar;