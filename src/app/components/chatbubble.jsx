"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaComments, 
  FaTimes, 
  FaTrash, 
  FaPaperPlane, 
  FaPhone, 
  FaEnvelope, 
  FaGlobe, 
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
  FaPlane,
  FaClock,
  FaBuilding,
  FaUserGraduate,
  FaCertificate,
  FaCheckCircle,
  FaArrowUp,
  FaSearch,
  FaLightbulb,
  FaStar,
  FaPassport,
  FaUniversity
} from "react-icons/fa";
import { 
  IoIosSchool, 
  IoIosBusiness, 
  IoIosCalendar,
  IoIosCash,
  IoIosHelpCircle,
  IoIosFlag
} from "react-icons/io";

const ChatBotBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      from: "bot", 
      text: "**Hello 👋 Welcome to Nationwide!** 🌍\n\n**Get your best here!**\n\nI'm here to help you with:\n\n• **Study Abroad Opportunities** ✈️\n• **University Partnerships** 🎓\n• **Visa Consultation** 📋\n• **Admission Process** 📝\n• **Free Counselling** 💬\n• **Contact Details** 📞\n\nHow can I assist you today?" 
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUniversitySelection, setShowUniversitySelection] = useState(false);
  const [scrollToMessage, setScrollToMessage] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesStartRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Nationwide data
  const nationwideData = {
    instituteName: "Nationwide",
    tagline: "Get your best here",
    partnerships: {
      proudPartnersWith: [
        "The University of Melbourne",
        "The University of Sydney",
        "Deakin University",
        "RMIT University",
        "The University of Queensland",
        "Monash University",
        "La Trobe University"
      ],
      associatedWith: [
        "RCIC (Regulated Canadian Immigration Consultant)",
        "CRIC (Canadian Regulatory Immigration Consultant)"
      ]
    },
    contact: {
      offices: [
        {
          country: "Canada",
          address: "23 Westmore Drive, Unit #301 B, Toronto M9V 3Y6",
          phone: ["+1 905-462-6465", "+1 647-706-0737"]
        },
        {
          country: "India",
          address: "Chandigarh Road, Opp. Osho Dhara Hospital, Near Khalsa School, Nawanshahr",
          phone: ["+91-96272-00088"]
        }
      ],
      socialMedia: {
        instagram: true,
        facebook: true,
        youtube: true,
        linkedin: true
      }
    },
    services: {
      studyAbroad: [
        "Canada",
        "Australia"
      ],
      consultation: [
        "Study Visa Counselling",
        "University Selection",
        "Course Guidance",
        "Application & Documentation Support",
        "Scholarship Assistance",
        "Pre-departure Guidance"
      ]
    },
    admissions: {
      process: "Visit any Nationwide office or contact them via phone/social media for counselling, course selection, document assessment, and university application submission.",
      intakes: ["February", "July", "November"],
      eligibility: "Eligibility varies by university and program; generally requires academic transcripts, English proficiency test scores, and valid identification documents."
    },
    fees: {
      counselling: "Free initial counselling",
      additionalCharges: "Processing fees may apply depending on university and visa requirements."
    },
    highlights: [
      "Direct Partnerships with Top Australian Universities",
      "Registered Canadian Immigration Consultants",
      "Guidance from Experienced Professionals",
      "Multiple Office Locations in India and Canada",
      "Transparent & Genuine Visa Consultation",
      "Support for Students from Application to Arrival"
    ],
    faqs: [
      {
        "q": "Do you help with visa filing?",
        "a": "Yes, Nationwide assists with complete visa documentation and filing."
      },
      {
        "q": "Are the counsellors certified?",
        "a": "Yes, the institute is associated with RCIC and CRIC certified consultants."
      },
      {
        "q": "Do you help with university selection?",
        "a": "Absolutely. Nationwide guides students in choosing the right university based on their profile."
      },
      {
        "q": "Can I get support after reaching abroad?",
        "a": "Yes, students receive pre-departure guidance and basic settlement support."
      }
    ]
  };

  // Service categories for filtering
  const serviceCategories = [
    { id: "all", name: "All Services", icon: <FaGlobe /> },
    { id: "australia", name: "Australia", icon: <IoIosFlag /> },
    { id: "canada", name: "Canada", icon: <FaMapMarkerAlt /> },
    { id: "visa", name: "Visa Services", icon: <FaPassport /> },
    { id: "consultation", name: "Consultation", icon: <FaComments /> },
    { id: "universities", name: "Universities", icon: <FaUniversity /> }
  ];

  // Enhanced quick actions for study abroad
  const quickActions = [
    { 
      label: "Australian Universities", 
      query: "Which Australian universities are you partnered with?", 
      icon: <IoIosFlag />,
      category: "australia"
    },
    { 
      label: "Canada Study", 
      query: "Tell me about studying in Canada", 
      icon: <FaMapMarkerAlt />,
      category: "canada"
    },
    { 
      label: "Visa Assistance", 
      query: "Do you help with visa filing and documentation?", 
      icon: <FaPassport />,
      category: "visa"
    },
    { 
      label: "Free Counselling", 
      query: "Is the initial counselling really free?", 
      icon: <FaComments />,
      category: "consultation"
    },
    { 
      label: "Contact Info", 
      query: "What are your contact details for Canada and India offices?", 
      icon: <FaPhone />,
      category: "contact"
    },
    { 
      label: "Certified Consultants", 
      query: "Are your immigration consultants certified?", 
      icon: <FaCertificate />,
      category: "consultation"
    },
    { 
      label: "Admission Process", 
      query: "What is the admission process for studying abroad?", 
      icon: <FaUserGraduate />,
      category: "consultation"
    },
    { 
      label: "Scholarships", 
      query: "Do you provide scholarship assistance?", 
      icon: <IoIosCash />,
      category: "consultation"
    }
  ];

  // University data
  const universities = [
    {
      id: "melbourne",
      name: "The University of Melbourne",
      country: "Australia",
      ranking: "World Top 50",
      popularCourses: ["Business", "Engineering", "Computer Science"],
      category: "australia"
    },
    {
      id: "sydney",
      name: "The University of Sydney",
      country: "Australia",
      ranking: "World Top 100",
      popularCourses: ["Medicine", "Law", "Arts"],
      category: "australia"
    },
    {
      id: "deakin",
      name: "Deakin University",
      country: "Australia",
      ranking: "Top 300 globally",
      popularCourses: ["Business", "IT", "Health Sciences"],
      category: "australia"
    },
    {
      id: "rmit",
      name: "RMIT University",
      country: "Australia",
      ranking: "QS 5-Star rating",
      popularCourses: ["Design", "Engineering", "Business"],
      category: "australia"
    },
    {
      id: "uq",
      name: "The University of Queensland",
      country: "Australia",
      ranking: "World Top 50",
      popularCourses: ["Science", "Engineering", "Business"],
      category: "australia"
    },
    {
      id: "monash",
      name: "Monash University",
      country: "Australia",
      ranking: "World Top 100",
      popularCourses: ["Pharmacy", "Engineering", "Business"],
      category: "australia"
    },
    {
      id: "latrobe",
      name: "La Trobe University",
      country: "Australia",
      ranking: "Top 400 globally",
      popularCourses: ["Health Sciences", "Business", "IT"],
      category: "australia"
    }
  ];

  // Improved scroll handling
  const scrollToMessageElement = (messageId, behavior = "smooth") => {
    setTimeout(() => {
      const messageElement = document.getElementById(`message-${messageId}`);
      const container = messagesContainerRef.current;
      
      if (messageElement && container) {
        const containerRect = container.getBoundingClientRect();
        const messageRect = messageElement.getBoundingClientRect();
        const scrollTop = container.scrollTop;
        const messageTop = messageRect.top - containerRect.top + scrollTop;
        
        container.scrollTo({
          top: messageTop - 20,
          behavior: behavior
        });
      }
    }, 100);
  };

  const scrollToBottom = (behavior = "smooth") => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ 
        behavior: behavior,
        block: "end"
      });
    }, 100);
  };

  const scrollToTop = (behavior = "smooth") => {
    setTimeout(() => {
      messagesStartRef.current?.scrollIntoView({ 
        behavior: behavior,
        block: "start"
      });
    }, 100);
  };

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setShowSuggestions(messages.length <= 1);
    }
  }, [isOpen, messages.length]);

  // Auto-hide suggestions after first interaction
  useEffect(() => {
    if (messages.length > 2) {
      setShowSuggestions(false);
    }
  }, [messages.length]);

  // Format message with bold text and icons
  const formatMessage = (text) => {
    let formattedText = text;
    
    // Format bold text
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Add icons for specific keywords
    formattedText = formattedText
      .replace(/study abroad/gi, '<span class="inline-flex items-center gap-1"><FaPlane class="inline text-blue-600" />Study Abroad</span>')
      .replace(/visa/gi, '<span class="inline-flex items-center gap-1"><FaPassport class="inline text-green-600" />Visa</span>')
      .replace(/university/gi, '<span class="inline-flex items-center gap-1"><FaUniversity class="inline text-purple-600" />University</span>')
      .replace(/australia/gi, '<span class="inline-flex items-center gap-1"><IoIosFlag class="inline text-red-600" />Australia</span>')
      .replace(/canada/gi, '<span class="inline-flex items-center gap-1"><FaMapMarkerAlt class="inline text-red-600" />Canada</span>')
      .replace(/free counselling/gi, '<span class="inline-flex items-center gap-1"><FaComments class="inline text-green-600" />Free Counselling</span>');
    
    return formattedText;
  };

  const handleSend = async (text = input) => {
    const messageText = text.trim();
    if (!messageText) return;

    const userMsg = { from: "user", text: messageText, id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setShowSuggestions(false);

    // Handle common queries locally
    const lowerMessage = messageText.toLowerCase();
    
    if (lowerMessage.includes('university') || lowerMessage.includes('partner') || lowerMessage.includes('australia')) {
      setShowUniversitySelection(true);
      setIsLoading(false);
      setTimeout(() => {
        scrollToMessageElement(userMsg.id, "smooth");
      }, 150);
      return;
    }
    
    if (lowerMessage.includes('admission') || lowerMessage.includes('apply') || lowerMessage.includes('process')) {
      const admissionMsg = {
        from: "bot", 
        text: `**Admission Process** 🎓\n\n${nationwideData.admissions.process}\n\n**Eligibility:**\n${nationwideData.admissions.eligibility}\n\n**Intake Periods:**\n${nationwideData.admissions.intakes.map(intake => `• ${intake}`).join('\n')}\n\n**Services Included:**\n${nationwideData.services.consultation.map(service => `• ${service}`).join('\n')}\n\n**Fee Structure:**\n• ${nationwideData.fees.counselling}\n• ${nationwideData.fees.additionalCharges}`,
        id: Date.now() + 1
      };
      setMessages((prev) => [...prev, admissionMsg]);
      setIsLoading(false);
      setTimeout(() => {
        scrollToMessageElement(admissionMsg.id, "smooth");
      }, 150);
      return;
    }
    
    if (lowerMessage.includes('visa') || lowerMessage.includes('immigration') || lowerMessage.includes('document')) {
      const visaMsg = {
        from: "bot", 
        text: `**Visa & Immigration Services** 📋\n\n**Certified Consultants:**\n${nationwideData.partnerships.associatedWith.map(cert => `• ${cert}`).join('\n')}\n\n**Services Include:**\n• Complete visa documentation support\n• Application filing assistance\n• Document verification\n• Pre-departure guidance\n\n**Why Choose Us:**\n• Registered immigration consultants\n• Transparent process\n• High success rate\n• End-to-end support`,
        id: Date.now() + 1
      };
      setMessages((prev) => [...prev, visaMsg]);
      setIsLoading(false);
      setTimeout(() => {
        scrollToMessageElement(visaMsg.id, "smooth");
      }, 150);
      return;
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email') || lowerMessage.includes('address') || lowerMessage.includes('office')) {
      const contactMsg = {
        from: "bot", 
        text: `**Contact Information** 📞\n\n**Canada Office:**\n📍 ${nationwideData.contact.offices[0].address}\n📞 ${nationwideData.contact.offices[0].phone.join(' / ')}\n\n**India Office:**\n📍 ${nationwideData.contact.offices[1].address}\n📞 ${nationwideData.contact.offices[1].phone.join(' / ')}\n\n**Social Media:**\n${Object.keys(nationwideData.contact.socialMedia).filter(platform => nationwideData.contact.socialMedia[platform]).map(platform => `• ${platform.charAt(0).toUpperCase() + platform.slice(1)}`).join('\n')}\n\n**Get your best here!** 🌍`,
        id: Date.now() + 1
      };
      setMessages((prev) => [...prev, contactMsg]);
      setIsLoading(false);
      setTimeout(() => {
        scrollToMessageElement(contactMsg.id, "smooth");
      }, 150);
      return;
    }
    
    if (lowerMessage.includes('free') || lowerMessage.includes('counselling') || lowerMessage.includes('consult')) {
      const counsellingMsg = {
        from: "bot", 
        text: `**Free Counselling Service** 💬\n\nYes! We offer **completely free initial counselling** to help you:\n\n**Services Include:**\n${nationwideData.services.consultation.map(service => `• ${service}`).join('\n')}\n\n**Study Destinations:**\n${nationwideData.services.studyAbroad.map(country => `• ${country}`).join('\n')}\n\n**Certifications:**\n${nationwideData.partnerships.associatedWith.map(cert => `• ${cert}`).join('\n')}\n\nBook your free session today and start your study abroad journey!`,
        id: Date.now() + 1
      };
      setMessages((prev) => [...prev, counsellingMsg]);
      setIsLoading(false);
      setTimeout(() => {
        scrollToMessageElement(counsellingMsg.id, "smooth");
      }, 150);
      return;
    }

    if (lowerMessage.includes('certif') || lowerMessage.includes('rcic') || lowerMessage.includes('cric')) {
      const certMsg = {
        from: "bot", 
        text: `**Certified Consultants** ✅\n\nYes! Our immigration consultants are fully certified:\n\n**Professional Certifications:**\n${nationwideData.partnerships.associatedWith.map(cert => `• ${cert}`).join('\n')}\n\n**What This Means For You:**\n• Legally authorized immigration advice\n• Up-to-date knowledge of immigration laws\n• High visa success rates\n• Professional ethical standards\n• Government-regulated services\n\nYour immigration process is in safe, certified hands!`,
        id: Date.now() + 1
      };
      setMessages((prev) => [...prev, certMsg]);
      setIsLoading(false);
      setTimeout(() => {
        scrollToMessageElement(certMsg.id, "smooth");
      }, 150);
      return;
    }

    if (lowerMessage.includes('scholarship') || lowerMessage.includes('funding') || lowerMessage.includes('financial')) {
      const scholarshipMsg = {
        from: "bot", 
        text: `**Scholarship Assistance** 💰\n\nWe provide comprehensive scholarship support:\n\n**Services Include:**\n• Scholarship eligibility assessment\n• Application guidance\n• Document preparation\n• Deadline management\n• Follow-up support\n\n**Available For:**\n• Australian universities\n• Canadian institutions\n• Government scholarships\n• University-specific awards\n\n**Popular Scholarship Sources:**\n• University merit scholarships\n• Government funded programs\n• Private organization awards\n• Research grants\n\nLet us help you find the best funding options!`,
        id: Date.now() + 1
      };
      setMessages((prev) => [...prev, scholarshipMsg]);
      setIsLoading(false);
      setTimeout(() => {
        scrollToMessageElement(scholarshipMsg.id, "smooth");
      }, 150);
      return;
    }

    // For other queries, use the API
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        const errorMessage = {
          from: "bot",
          text: `**I apologize, but I'm having trouble connecting right now.** 😔\n\nFor immediate assistance with study abroad opportunities, please contact us directly:\n\n**Canada Office:**\n📞 ${nationwideData.contact.offices[0].phone.join(' / ')}\n\n**India Office:**\n📞 ${nationwideData.contact.offices[1].phone.join(' / ')}\n\nWe're here to help you **get your best here!** 🌍`,
          id: Date.now() + 1
        };
        setMessages((prev) => [...prev, errorMessage]);
        setTimeout(() => {
          scrollToMessageElement(errorMessage.id, "smooth");
        }, 150);
      } else {
        const botReply = {
          from: "bot",
          text: formatMessage(data?.reply || "I apologize, but I couldn't process your request. Please contact Nationwide directly for assistance with your study abroad journey."),
          isHTML: true,
          id: Date.now() + 1
        };
        setMessages((prev) => [...prev, botReply]);
        setTimeout(() => {
          scrollToMessageElement(botReply.id, "smooth");
        }, 150);
      }
    } catch (err) {
      console.error("Chat error:", err);
      const fallbackMessage = {
        from: "bot",
        text: `**I'm currently unavailable.** 😞\n\nFor immediate help with study abroad opportunities:\n\n**Canada Office:**\n📍 ${nationwideData.contact.offices[0].address}\n📞 ${nationwideData.contact.offices[0].phone.join(' / ')}\n\n**India Office:**\n📍 ${nationwideData.contact.offices[1].address}\n📞 ${nationwideData.contact.offices[1].phone.join(' / ')}\n\n**Get your best here!** 🌍`,
        id: Date.now() + 1
      };
      
      setMessages((prev) => [...prev, fallbackMessage]);
      setTimeout(() => {
        scrollToMessageElement(fallbackMessage.id, "smooth");
      }, 150);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (query) => {
    scrollToTop("instant");
    setTimeout(() => {
      handleSend(query);
    }, 100);
  };

  const handleUniversitySelect = (university) => {
    setShowUniversitySelection(false);
    
    let uniMessage = `**${university.name}** 🎓\n\n`;
    uniMessage += `**Country:** ${university.country}\n`;
    uniMessage += `**Ranking:** ${university.ranking}\n\n`;
    uniMessage += `**Popular Courses:**\n${university.popularCourses.map(course => `• ${course}`).join('\n')}\n\n`;
    uniMessage += `**Partnership:** Direct partnership with Nationwide\n`;
    uniMessage += `**Support:** Complete application and visa assistance\n\n`;
    uniMessage += `Interested in **${university.name}**? We provide complete support from application to arrival!`;

    const universityMessage = {
      from: "bot",
      text: uniMessage,
      id: Date.now() + 1
    };

    setMessages((prev) => [...prev, universityMessage]);
    setTimeout(() => {
      scrollToMessageElement(universityMessage.id, "smooth");
    }, 150);
  };

  const clearChat = () => {
    setMessages([
      { 
        from: "bot", 
        text: "**Hello 👋 Welcome to Nationwide!** 🌍\n\n**Get your best here!**\n\nI'm here to help you with:\n\n• **Study Abroad Opportunities** ✈️\n• **University Partnerships** 🎓\n• **Visa Consultation** 📋\n• **Admission Process** 📝\n• **Free Counselling** 💬\n• **Contact Details** 📞\n\nHow can I assist you today?" 
      }
    ]);
    setShowUniversitySelection(false);
    setShowSuggestions(true);
    setActiveCategory("all");
    
    setTimeout(() => {
      scrollToTop("smooth");
    }, 100);
  };

  const filteredUniversities = universities.filter(uni => 
    activeCategory === "all" || uni.category === activeCategory
  );

  const filteredQuickActions = quickActions.filter(action => 
    activeCategory === "all" || action.category === activeCategory
  );

  const renderMessageContent = (msg) => {
    if (msg.isHTML) {
      return <div dangerouslySetInnerHTML={{ __html: msg.text }} />;
    }
    
    return msg.text.split('\n').map((line, lineIndex) => {
      if (line.trim() === '') {
        return <br key={lineIndex} />;
      }
      
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      return (
        <div 
          key={lineIndex} 
          className={lineIndex > 0 ? 'mt-2' : ''}
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 cursor-pointer bg-[#e33925] text-white p-4 rounded-full shadow-2xl flex items-center justify-center"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        animate={{ 
          scale: [1, 1.05, 1],
          transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="text-xl"
        >
          <FaPlane />
        </motion.div>
        {/* Notification dot when closed */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
          />
        )}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[600px] max-h-[68vh] flex flex-col bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-[#e33925]   text-white px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div>
                  <span className="font-bold text-sm block">Nationwide Assistant</span>
    
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={clearChat}
                  className="text-white hover:text-gray-200 text-sm transition p-1 rounded-full hover:bg-white hover:bg-opacity-20"
                  title="Clear chat"
                >
                  <FaTrash size={14} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200 transition p-1 rounded-full hover:bg-white hover:bg-opacity-20"
                >
                  <FaTimes size={16} />
                </button>
              </div>
            </div>

            {/* Quick Actions with Categories */}
            <div className="bg-blue-50 px-3 py-2 border-b border-blue-100">
              {/* Service Categories */}
              <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
                {serviceCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full border transition-all whitespace-nowrap ${
                      activeCategory === category.id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-blue-600 border-blue-200 hover:bg-blue-100"
                    }`}
                  >
                    {category.icon}
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-1">
                {filteredQuickActions.slice(0, 6).map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.query)}
                    className="flex items-center gap-1 bg-white text-blue-600 text-xs px-3 py-2 rounded-full border border-blue-200 hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm"
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Body */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-white to-blue-50 relative scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent"
            >
              {/* Scroll to top button */}
              <div className="sticky top-0 z-10 flex justify-end mb-2">
                <button
                  onClick={() => scrollToTop("smooth")}
                  className="bg-white text-blue-600 p-2 rounded-full shadow-md hover:bg-blue-50 transition-all backdrop-blur-sm"
                  title="Scroll to top"
                >
                  <FaArrowUp size={12} />
                </button>
              </div>

              {/* Messages start reference */}
              <div ref={messagesStartRef} />
              
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id || idx}
                  id={`message-${msg.id || idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`my-3 flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.from === "user"
                        ? "bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-br-none shadow-md"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow-sm"
                    }`}
                  >
                    {renderMessageContent(msg)}
                    
                    {/* Add special styling for specific message types */}
                    {msg.text.includes('University') && msg.from === 'bot' && (
                      <div className="mt-2 pt-2 border-t border-purple-100 flex items-center gap-1 text-xs text-purple-600">
                        <FaUniversity />
                        <span className="font-semibold">University Partnership</span>
                      </div>
                    )}
                    
                    {msg.text.includes('Visa') && msg.from === 'bot' && (
                      <div className="mt-2 pt-2 border-t border-green-100 flex items-center gap-1 text-xs text-green-600">
                        <FaPassport />
                        <span className="font-semibold">Visa Services</span>
                      </div>
                    )}
                    
                    {msg.text.includes('Free Counselling') && msg.from === 'bot' && (
                      <div className="mt-2 pt-2 border-t border-blue-100 flex items-center gap-1 text-xs text-blue-600">
                        <FaComments />
                        <span className="font-semibold">Free Service</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {/* University Selection */}
              {showUniversitySelection && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="my-3"
                >
                  <div className="bg-white rounded-2xl rounded-bl-none border border-gray-100 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                        <FaUniversity />
                        <span>Partner Universities</span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {filteredUniversities.length} universities
                      </span>
                    </div>
                    
                    {/* University Filter */}
                    <div className="mb-3">
                      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                        {serviceCategories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full border transition-all whitespace-nowrap ${
                              activeCategory === category.id
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-blue-600 border-blue-200 hover:bg-blue-100"
                            }`}
                          >
                            {category.icon}
                            <span>{category.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                      {filteredUniversities.map((university) => (
                        <button
                          key={university.id}
                          onClick={() => handleUniversitySelect(university)}
                          className="text-left p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                        >
                          <div className="font-medium text-gray-800 text-sm group-hover:text-blue-600">
                            {university.name}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <IoIosFlag className="text-gray-400" />
                            {university.country} • {university.ranking}
                          </div>
                          <div className="text-xs text-green-600 font-semibold mt-1">
                            Direct Partnership
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Smart Suggestions */}
              {showSuggestions && messages.length <= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="my-3"
                >
                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-yellow-700 mb-2">
                      <FaLightbulb className="text-yellow-500" />
                      <span>Quick Suggestions</span>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleQuickAction("What are the benefits of studying in Australia?")}
                        className="text-left w-full text-xs text-yellow-700 hover:text-yellow-900 p-2 rounded-lg hover:bg-yellow-100 transition-all"
                      >
                        💡 What are the benefits of studying in Australia?
                      </button>
                      <button
                        onClick={() => handleQuickAction("How long does the visa process take?")}
                        className="text-left w-full text-xs text-yellow-700 hover:text-yellow-900 p-2 rounded-lg hover:bg-yellow-100 transition-all"
                      >
                        💡 How long does the visa process take?
                      </button>
                      <button
                        onClick={() => handleQuickAction("What documents are required for admission?")}
                        className="text-left w-full text-xs text-yellow-700 hover:text-yellow-900 p-2 rounded-lg hover:bg-yellow-100 transition-all"
                      >
                        💡 What documents are required for admission?
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start my-3"
                >
                  <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 text-sm border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                          className="w-2 h-2 bg-blue-600 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-blue-600 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-blue-600 rounded-full"
                        />
                      </div>
                      Searching study abroad options...
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Scroll to bottom button */}
              <div className="sticky bottom-0 flex justify-end mt-2">
                <button
                  onClick={() => scrollToBottom("smooth")}
                  className="bg-white text-blue-600 p-2 rounded-full shadow-md hover:bg-blue-50 transition-all backdrop-blur-sm"
                  title="Scroll to bottom"
                >
                  <FaArrowUp size={12} className="rotate-180" />
                </button>
              </div>
              
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-3 bg-white">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ask about study abroad, visas, universities..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
                  disabled={isLoading}
                />
                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? "⏳" : <><FaPaperPlane /> Send</>}
                </motion.button>
              </div>
              
              {/* Help text */}
              <div className="mt-2 text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                <IoIosHelpCircle className="text-blue-500" />
                Try: "Australian universities" or "Visa process for Canada"
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-opacity-10 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBotBubble;