'use client';

import { useColors } from '@/app/hooks/useColorSchema';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Knowledge from '@/app/components/additionals/Knowledge.json';

const WhyChooseUs = () => {
  const { getClasses, getStyles } = useColors();
  const [isVisible, setIsVisible] = useState(false);
  const [failedLogos, setFailedLogos] = useState([]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Custom hook for in-view detection
  const useAnimatedSection = () => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    return { ref, inView };
  };

  const { ref: heroRef, inView: heroInView } = useAnimatedSection();
  const { ref: statsRef, inView: statsInView } = useAnimatedSection();
  const { ref: featuresRef, inView: featuresInView } = useAnimatedSection();
  const { ref: partnersRef, inView: partnersInView } = useAnimatedSection();
  const { ref: processRef, inView: processInView } = useAnimatedSection();
  const { ref: servicesRef, inView: servicesInView } = useAnimatedSection();
  const { ref: officesRef, inView: officesInView } = useAnimatedSection();
  const { ref: testimonialsRef, inView: testimonialsInView } = useAnimatedSection();
  const { ref: faqRef, inView: faqInView } = useAnimatedSection();

  // Photo data - replace these with your actual images
  const photos = {
    hero: '/images/hero-students.jpg', // Group of successful students
    office: '/images/office-interior.jpg', // Modern office space
    counselling: '/images/counselling-session.jpg', // Student counselling session
    university: '/images/university-campus.jpg', // Partner university campus
    success: '/images/success-stories.jpg', // Graduation celebration
    team: '/images/consultant-team.jpg' // Our expert team
  };

  // Offices from Knowledge.json
  const offices = Knowledge.contact?.offices || [];
  const canadaOffice = offices.find(o => o.country === 'Canada');
  const indiaOffices = offices.filter(o => o.country === 'India');
  const contactPhones = offices.length ? offices.flatMap(o => o.phone || []).slice(0, 2) : [];
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEFDFD] to-[#F7F7F7]">

      {/* Key Highlights Section */}
      <motion.section
        ref={featuresRef}
        initial="hidden"
        animate={featuresInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              What Makes Us <span className={getClasses('text', 'primary')}>Different</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {Knowledge.tagline || 'We go beyond traditional consultancy to provide comprehensive support that ensures your success'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Text Content */}
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Proven Track Record of Excellence</h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                With over 15 years of experience in international education consulting, we've helped thousands of students achieve their dreams of studying abroad. Our proven methodology and personalized approach ensure success.
              </p>
              <ul className="space-y-4">
                {(Knowledge.highlights || []).map((item, index) => (
                  <li key={index} className="flex items-center">
                    <div className={`w-6 h-6 rounded-full ${getClasses('bg', 'primary')} flex items-center justify-center mr-3`}>
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Photo Placeholder */}
            <motion.div
              variants={itemVariants}
              className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#CB342A] to-[#BCAE9F] flex items-center justify-center">
                <span className="text-white text-lg">Office Interior Photo</span>
              </div>
              {/* Replace with: <Image src={photos.office} alt="Our Office" fill className="object-cover" /> */}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(Knowledge.highlights || []).map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    whileHover="hover"
                    className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                  >
                    <div className="text-5xl mb-6">⭐</div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                      {feature}
                    </h3>
                    <p className="text-gray-600 leading-relaxed flex-grow">
                      {feature}
                    </p>
                  </motion.div>
                ))}
          </div>
        </div>
      </motion.section>

      {/* University Partnerships Section */}
      <motion.section
        ref={partnersRef}
        initial="hidden"
        animate={partnersInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Our Premier University Partners
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Direct partnerships with top-ranked universities in Australia and Canada ensuring your academic success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Australian Universities */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-[#FEFDFD] to-[#F7F7F7] rounded-2xl p-8 border border-gray-200 shadow-lg"
            >
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🇦🇺</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Australian Partners
                </h3>
              </div>
              <div className="space-y-4">
                {(Knowledge.partnerships?.proudPartnersWith || []).map((uni, index) => (
                  <motion.div
                    key={uni}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                  >
                    <div className={`w-3 h-3 ${getClasses('bg', 'primary')} rounded-full mr-4 group-hover:scale-125 transition-transform`}></div>
                    <span className="text-gray-700 font-medium">{uni}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Canadian Certification */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-[#FEFDFD] to-[#F7F7F7] rounded-2xl p-8 border border-gray-200 shadow-lg"
            >
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🇨🇦</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Certified Immigration Consultants
                </h3>
              </div>
              <div className="space-y-6">
                {(Knowledge.partnerships?.associatedWith || []).map((cert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="text-3xl mb-4">🏛️</div>
                    <h4 className="font-bold text-gray-800 mb-2 text-lg">
                      {cert}
                    </h4>
                    <p className="text-sm text-gray-500">&nbsp;</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* University Logos Grid */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-50 rounded-2xl p-8 border border-gray-200"
          >
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
              Trusted by Leading Institutions Worldwide
            </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                {(
                  Knowledge.partnerships?.proudPartnersWith || []
                ).map((uni, idx) => {
                  const slug = uni
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '');
                  const src = `/logos/${slug}.png`;

                  return (
                    <div
                      key={uni + idx}
                      className="bg-white rounded-lg p-4 h-32 flex items-center justify-center shadow-sm border border-gray-100 overflow-hidden"
                    >
                      {!failedLogos.includes(idx) ? (
                        <Image
                          src={src}
                          alt={uni}
                          width={160}
                          height={120}
                          className="object-contain max-h-24 f"
                          onError={() => setFailedLogos((p) => Array.from(new Set([...p, idx])))}
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-center px-2">
                          <div className="text-gray-700 font-medium text-sm">{uni}</div>
                          <div className="text-gray-400 text-xs">Logo unavailable</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Comprehensive Services Section */}
      <motion.section
        ref={servicesRef}
        initial="hidden"
        animate={servicesInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#CB342A]/5 to-[#BCAE9F]/5"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Comprehensive <span className={getClasses('text', 'primary')}>Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              End-to-end support for your study abroad journey - from initial counselling to post-arrival settlement
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Photo Placeholder */}
            <motion.div
              variants={itemVariants}
              className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl order-2 lg:order-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#BCAE9F] to-[#CB342A] flex items-center justify-center">
                <span className="text-white text-lg">Counselling Session Photo</span>
              </div>
              {/* Replace with: <Image src={photos.counselling} alt="Student Counselling" fill className="object-cover" /> */}
            </motion.div>

            {/* Services List */}
            <motion.div variants={itemVariants} className="order-1 lg:order-2">
              <h3 className="text-2xl md:text-3xl font-bold mb-8">Our Complete Service Package</h3>
              <div className="space-y-6">
                {(Knowledge.services?.consultation || []).map((s, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className={`w-8 h-8 rounded-full ${getClasses('bg', 'primary')} flex items-center justify-center mr-4 flex-shrink-0`}>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{s}</h4>
                      <p className="text-gray-600 text-sm">{`We offer ${s.toLowerCase()} as part of our consultation services.`}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Process Timeline Section */}
      <motion.section
        ref={processRef}
        initial="hidden"
        animate={processInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Our <span className={getClasses('text', 'primary')}>Process</span>
            </h2>
            <p className="text-xl text-gray-600">
              Simple, transparent, and efficient - your journey to international education made easy
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Free Counselling & Profile Assessment",
                description: "Understand your goals, assess your profile, and create a personalized roadmap",
                duration: "1-2 Days"
              },
              {
                step: "02",
                title: "University & Course Selection",
                description: "Strategic selection of universities and courses that match your profile and aspirations",
                duration: "3-5 Days"
              },
              {
                step: "03",
                title: "Application & Documentation",
                description: "Complete application support with SOPs, LORs, and all required documentation",
                duration: "2-3 Weeks"
              },
              {
                step: "04",
                title: "Visa Processing & Pre-departure",
                description: "Visa filing support and comprehensive pre-departure guidance for smooth transition",
                duration: "4-6 Weeks"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100 relative"
              >
                <div className={`w-16 h-16 rounded-full ${getClasses('bg', 'primary')} text-white flex items-center justify-center font-bold text-xl mx-auto mb-6 relative z-10`}>
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 leading-tight">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {step.description}
                </p>
                <div className={`inline-block px-4 py-2 rounded-full ${getClasses('bg', 'secondary')} text-gray-800 text-sm font-medium`}>
                  {step.duration}
                </div>
                
                {/* Connecting Line */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 transform -translate-y-1/2 z-0"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Global Offices Section */}
      <motion.section
        ref={officesRef}
        initial="hidden"
        animate={officesInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#CB342A]/5 to-[#BCAE9F]/5"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Our <span className={getClasses('text', 'primary')}>Global Presence</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              With offices in India and Canada, we provide local support with global expertise
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Canada Office */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🇨🇦</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Canada Office</h3>
                  <p className="text-gray-600">Headquarters</p>
                </div>
              </div>
              <div className="space-y-4">
                {canadaOffice ? (
                  <>
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <p className="text-gray-700">{canadaOffice.address}</p>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                      <div>
                        {(canadaOffice.phone || []).map((p, idx) => (
                          <p key={idx} className="text-gray-700">{p}</p>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-700">No Canada office data available.</div>
                )}
              </div>
            </motion.div>

            {/* India Offices */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🇮🇳</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">India Offices</h3>
                  <p className="text-gray-600">Multiple Locations</p>
                </div>
              </div>
              <div className="space-y-6">
                {(indiaOffices || []).map((office, index) => (
                  <div key={index} className="border-l-4 border-[#BCAE9F] pl-4">
                    <h4 className="font-semibold text-gray-800 mb-2">{office.country} Office</h4>
                    <p className="text-gray-600 text-sm mb-2">{office.address}</p>
                    <div className="text-sm text-gray-700">
                      {(office.phone || []).map((num, idx) => (
                        <p key={idx}>{num}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>



      {/* FAQ Section */}
      <motion.section
        ref={faqRef}
        initial="hidden"
        animate={faqInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#CB342A]/5 to-[#BCAE9F]/5"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Frequently Asked <span className={getClasses('text', 'primary')}>Questions</span>
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about our services and process
            </p>
          </motion.div>

          <div className="space-y-6">
            {(Knowledge.faqs || []).map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-start">
                  <span className={`w-6 h-6 rounded-full ${getClasses('bg', 'primary')} text-white text-sm flex items-center justify-center mr-3 flex-shrink-0 mt-1`}>Q</span>
                  {faq.q}
                </h3>
                <p className="text-gray-600 ml-9">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

    </div>
  );
};

export default WhyChooseUs;