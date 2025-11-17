"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useColors } from '@/app/hooks/useColorSchema';
import knowledge from '@/app/components/additionals/Knowledge.json';

const About = () => {
  const { getClasses, getStyles } = useColors();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const scaleInVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] px-4 sm:px-6 lg:px-8 pt-7 pb-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <motion.h1
          className="text-center text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-red-600 to-red-300 bg-clip-text text-transparent mb-5 pt-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          About {knowledge.instituteName}
        </motion.h1>
      </motion.div>

      {/* Main Content with Staggered Animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 lg:space-y-12"
      >
        {/* Institute Overview */}
        <motion.section variants={itemVariants}>
          <section className="text-center py-12 bg-gradient-to-r from-[#F8F9FA] to-white rounded-xl shadow-lg border border-gray-100">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C3E50] mb-4">
                {knowledge.instituteName}
              </h2>
              <motion.p 
                className="text-xl lg:text-2xl text-[#E74C3C] font-medium mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {knowledge.tagline}
              </motion.p>
              <motion.p 
                className="max-w-4xl mx-auto text-[#34495E] leading-8 text-base sm:text-lg lg:text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {knowledge.services && knowledge.services.consultation
                  ? knowledge.services.consultation.join('. ') + '.'
                  : 'We provide a range of services to support students with admissions and visas.'}
              </motion.p>
            </motion.div>
          </section>
        </motion.section>

        {/* Location Section */}
        <motion.section variants={fadeInVariants}>
          <div className="w-full">
            <motion.div 
              className="bg-[#F8F9FA] p-6 rounded-xl shadow-lg text-center mb-8 border border-gray-200 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="text-[#34495E] text-base sm:text-lg lg:text-xl font-medium flex items-center justify-center gap-2">
                <span className="text-red-500">📍</span>
                Chandigarh Rd, opposite Osho Dhara Hospital, near Khalsa School, Rai Colony, Nawanshahr, Punjab 144514
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 lg:gap-8 h-auto lg:h-[600px] w-full">
              
              <motion.div 
                className="relative rounded-xl shadow-lg overflow-hidden w-full h-64 sm:h-80 lg:h-full"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
              >
                <iframe
                  title="Institute Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1707.762849142624!2d76.1265413!3d31.122912200000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391abd09a7364ad3%3A0x7869e46392790523!2sNationwide%20Educational%20Services!5e0!3m2!1sen!2sin!4v1763185379358!5m2!1sen!2sin"
                  className="w-full h-full"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Partnerships */}
        <motion.section variants={itemVariants}>
          <motion.h3 
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2C3E50] mb-6 lg:mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Partnerships
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            <motion.div 
              className="bg-[#F8F9FA] p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h4 className="font-semibold text-lg lg:text-xl mb-4 text-[#2C3E50]">Proud Partners With</h4>
              <ul className="list-disc list-inside text-[#34495E] space-y-2">
                {knowledge.partnerships.proudPartnersWith.map((p, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    {p}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              className="bg-[#F8F9FA] p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
            >
              <h4 className="font-semibold text-lg lg:text-xl mb-4 text-[#2C3E50]">Associated With</h4>
              <ul className="list-disc list-inside text-[#34495E] space-y-2">
                {knowledge.partnerships.associatedWith.map((a, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i + 0.2 }}
                  >
                    {a}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact & Offices */}
        <motion.section variants={itemVariants}>
          <motion.h3 
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2C3E50] mb-6 lg:mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Contact & Offices
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {knowledge.contact.offices.map((office, idx) => (
              <motion.div 
                key={idx}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * idx + 0.5 }}
                whileHover={{ 
                  scale: 1.05,
                  borderColor: '#E74C3C'
                }}
              >
                <h4 className="font-semibold text-lg text-[#2C3E50] mb-2">{office.country}</h4>
                <p className="text-sm text-[#7F8C8D] mb-4 leading-6">{office.address}</p>
                <div className="text-sm text-[#34495E] space-y-1">
                  {office.phone.map((phone, pidx) => (
                    <motion.div 
                      key={pidx}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 * pidx + 0.7 }}
                    >
                      <span className="text-red-500">📞</span> {phone}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Services & Admissions */}
        <motion.section variants={scaleInVariants}>
          <motion.h3 
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2C3E50] mb-6 lg:mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Services & Admissions
          </motion.h3>
          <motion.div 
            className="bg-[#F8F9FA] p-6 lg:p-8 rounded-xl shadow-lg border border-gray-200"
            whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <motion.p 
                  className="text-[#34495E] text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <strong className="text-[#2C3E50]">Study Abroad:</strong> {knowledge.services.studyAbroad.join(', ')}
                </motion.p>
                <motion.p 
                  className="text-[#34495E] text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <strong className="text-[#2C3E50]">Admissions Process:</strong> {knowledge.admissions.process}
                </motion.p>
              </div>
              <div className="space-y-4">
                <motion.p 
                  className="text-[#34495E] text-lg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <strong className="text-[#2C3E50]">Intakes:</strong> {knowledge.admissions.intakes.join(', ')}
                </motion.p>
                <motion.p 
                  className="text-[#34495E] text-lg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <strong className="text-[#2C3E50]">Eligibility:</strong> {knowledge.admissions.eligibility}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Fees & Highlights */}
        <motion.section variants={itemVariants}>
          <motion.h3 
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2C3E50] mb-6 lg:mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Fees & Highlights
          </motion.h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <h4 className="font-semibold text-xl text-[#2C3E50] mb-4">Fee Structure</h4>
              <motion.p 
                className="text-[#34495E] text-lg mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <strong className="text-[#2C3E50]">Counselling:</strong> {knowledge.fees.counselling}
              </motion.p>
              <motion.p 
                className="text-[#34495E] text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <strong className="text-[#2C3E50]">Additional Charges:</strong> {knowledge.fees.additionalCharges}
              </motion.p>
            </motion.div>
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <h4 className="font-semibold text-xl text-[#2C3E50] mb-4">Highlights</h4>
              <ul className="list-disc list-inside text-[#34495E] space-y-3">
                {knowledge.highlights.map((h, i) => (
                  <motion.li 
                    key={i}
                    className="text-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i + 0.7 }}
                  >
                    {h}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* FAQs */}
        <motion.section variants={fadeInVariants}>
          <motion.h3 
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#2C3E50] mb-6 lg:mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Frequently Asked Questions
          </motion.h3>
          <div className="space-y-4 max-w-4xl mx-auto">
            {knowledge.faqs.map((faq, i) => (
              <motion.details 
                key={i}
                className="bg-[#F8F9FA] p-6 rounded-xl shadow-lg border border-gray-200 hover:border-red-300 transition-colors duration-300 cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.8 }}
                whileHover={{ scale: 1.02 }}
              >
                <summary className="font-semibold text-lg text-[#2C3E50] list-none flex justify-between items-center">
                  {faq.q}
                  <motion.span 
                    className="text-red-500 text-xl transition-transform duration-300 group-open:rotate-180"
                    animate={{ rotate: 0 }}
                  >
                    ▼
                  </motion.span>
                </summary>
                <motion.p 
                  className="mt-4 text-[#34495E] text-lg leading-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {faq.a}
                </motion.p>
              </motion.details>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default About;