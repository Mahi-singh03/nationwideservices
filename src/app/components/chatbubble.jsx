"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaComments, 
  FaTimes, 
  FaTrash, 
  FaPaperPlane, 
  FaPhone, 
  FaGlobe,
  FaUniversity,
  FaArrowUp,
  FaSearch,
  FaLightbulb,
  FaPassport,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaCheckCircle
} from "react-icons/fa";
import { 
  IoIosFlag,
  IoIosHelpCircle
} from "react-icons/io";
import knowledgeData from "./additionals/Knowledge.json";

// Nationwide Educational Services Color Palette
const colors = {
  // Primary Colors
  primary: {
    main: '#CB342A',    // Brand Red
    light: '#D65F57',   // Lightened Red
    dark: '#A32922',    // Darkened Red
  },
  // Secondary/Accent Colors
  secondary: {
    main: '#BCAE9F',    // Deep Red Accent (actually a warm gray/beige)
    light: '#C9BEB2',   // Lightened
    dark: '#A89A8C',    // Darkened
  },
  // Neutral Colors
  neutral: {
    text: '#191818',    // Dark Charcoal
    textSecondary: '#636060', // Medium Gray
    border: '#E5E5E5',  // Light border
    background: '#FEFDFD', // White
    card: '#FFFFFF',    // Pure white for cards
  }
};

const ChatBotBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      from: "bot", 
      text: "**Hello 👋 Welcome to Nationwide!**\n\n**Get your best here!**\n\nI'm here to help you with:\n\n• Study Abroad Opportunities ✈️\n• University Partnerships 🎓\n• Visa Consultation 📋\n• Admission Process 📝\n• Free Counselling 💬\n• Contact Details 📞\n\nHow can I assist you today?" 
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUniversitySelection, setShowUniversitySelection] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesStartRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const conversationIdRef = useRef(`conv-${Date.now()}`);

  // Nationwide data from knowledge.json
  const nationwideData = knowledgeData;

  // Service categories for filtering
  const serviceCategories = [
    { id: "all", name: "All", icon: <FaGlobe /> },
    { id: "australia", name: "Australia", icon: <IoIosFlag /> },
    { id: "canada", name: "Canada", icon: <FaMapMarkerAlt /> },
    { id: "visa", name: "Visa", icon: <FaPassport /> },
    { id: "consultation", name: "Help", icon: <FaComments /> }
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
      label: "Visa Help", 
      query: "Do you help with visa filing?", 
      icon: <FaPassport />,
      category: "visa"
    },
    { 
      label: "Free Counselling", 
      query: "Is the initial counselling free?", 
      icon: <FaComments />,
      category: "consultation"
    },
    { 
      label: "Contact", 
      query: "What are your contact details?", 
      icon: <FaPhone />,
      category: "contact"
    },
    { 
      label: "Certified", 
      query: "Are your consultants certified?", 
      icon: <FaCheckCircle />,
      category: "consultation"
    }
  ];

  // University data
  const universities = nationwideData.partnerships.proudPartnersWith.map((name, index) => ({
    id: `uni-${index}`,
    name: name,
    country: "Australia",
    ranking: "Top Universities",
    popularCourses: ["Business", "Engineering", "IT", "Health Sciences"],
    category: "australia"
  }));

  // Improved scroll handling
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

  const formatContactInfo = (offices = []) => {
    if (!Array.isArray(offices) || offices.length === 0) return "";
    return offices
      .map((office) => {
        const lines = [`• ${office.country || "Office"}`];
        if (office.address) {
          lines.push(`  📍 ${office.address}`);
        }
        if (Array.isArray(office.phone) && office.phone.length) {
          lines.push(`  📞 ${office.phone.join(" / ")}`);
        }
        return lines.join("\n");
      })
      .join("\n\n");
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
        scrollToBottom("smooth");
      }, 150);
      return;
    }
    
    if (lowerMessage.includes('admission') || lowerMessage.includes('apply') || lowerMessage.includes('process')) {
      const admissionMsg = {
        from: "bot", 
        text: `**Admission Process** 🎓\n\n${nationwideData.admissions.process}\n\n**Intake Periods:**\n${nationwideData.admissions.intakes.map(intake => `• ${intake}`).join('\n')}\n\n**Services:**\n${nationwideData.services.consultation.map(service => `• ${service}`).join('\n')}\n\n**Fees:**\n• ${nationwideData.fees.counselling}\n• ${nationwideData.fees.additionalCharges}`,
        id: Date.now() + 1
      };
      setMessages((prev) => [...prev, admissionMsg]);
      setIsLoading(false);
      setTimeout(() => {
        scrollToBottom("smooth");
      }, 150);
      return;
    }
    
    if (lowerMessage.includes('visa') || lowerMessage.includes('immigration')) {
      const visaMsg = {
        from: "bot", 
        text: `**Visa Services** 📋\n\n**Certified Consultants:**\n${nationwideData.partnerships.associatedWith.map(cert => `• ${cert}`).join('\n')}\n\n**Services:**\n• Complete visa documentation\n• Application filing assistance\n• Document verification\n• Pre-departure guidance\n\n**Why Choose Us:**\n• Registered consultants\n• Transparent process\n• High success rate`,
        id: Date.now() + 1
      };
      setMessages((prev) => [...prev, visaMsg]);
      setIsLoading(false);
      setTimeout(() => {
        scrollToBottom("smooth");
      }, 150);
      return;
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('address')) {
      const contactMsg = {
        from: "bot", 
        text: `**Contact Information** 📞\n\n**Canada Office:**\n📍 ${nationwideData.contact.offices[0].address}\n📞 ${nationwideData.contact.offices[0].phone.join(' / ')}\n\n**India Office:**\n📍 ${nationwideData.contact.offices[1].address}\n📞 ${nationwideData.contact.offices[1].phone.join(' / ')}\n\n**Get your best here!**`,
        id: Date.now() + 1
      };
      setMessages((prev) => [...prev, contactMsg]);
      setIsLoading(false);
      setTimeout(() => {
        scrollToBottom("smooth");
      }, 150);
      return;
    }
    
    if (lowerMessage.includes('free') || lowerMessage.includes('counselling')) {
      const counsellingMsg = {
        from: "bot", 
        text: `**Free Counselling** 💬\n\nYes! We offer **free initial counselling** for:\n\n**Services:**\n${nationwideData.services.consultation.map(service => `• ${service}`).join('\n')}\n\n**Destinations:**\n${nationwideData.services.studyAbroad.map(country => `• ${country}`).join('\n')}\n\n**Certifications:**\n${nationwideData.partnerships.associatedWith.map(cert => `• ${cert}`).join('\n')}\n\nStart your journey today!`,
        id: Date.now() + 1
      };
      setMessages((prev) => [...prev, counsellingMsg]);
      setIsLoading(false);
      setTimeout(() => {
        scrollToBottom("smooth");
      }, 150);
      return;
    }

    if (lowerMessage.includes('certif') || lowerMessage.includes('rcic') || lowerMessage.includes('cric')) {
      const certMsg = {
        from: "bot", 
        text: `**Certified Consultants** ✅\n\nOur consultants are fully certified:\n\n**Certifications:**\n${nationwideData.partnerships.associatedWith.map(cert => `• ${cert}`).join('\n')}\n\n**Benefits:**\n• Legal immigration advice\n• Updated knowledge\n• High success rates\n• Professional standards`,
        id: Date.now() + 1
      };
      setMessages((prev) => [...prev, certMsg]);
      setIsLoading(false);
      setTimeout(() => {
        scrollToBottom("smooth");
      }, 150);
      return;
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          conversationId: conversationIdRef.current
        })
      });

      const data = await response.json();

      const botMessageText =
        data.reply ||
        (data.error
          ? `**${data.error}** ⚠️\n\n${data.suggestion || ""}${
              data.contact?.offices
                ? `\n\n**Contact Nationwide** 📞\n${formatContactInfo(data.contact.offices)}`
                : ""
            }`
          : `**I can help you with:**\n\n• Australian university partnerships\n• Visa and immigration services\n• Free counselling sessions\n• Admission process guidance\n• Contact information\n\nTry asking about our partner universities or free counselling!`);

      const botMsg = {
        from: "bot",
        text: botMessageText,
        id: Date.now() + 1
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = {
        from: "bot",
        text: `**Temporary issue** ⚠️\n\nI'm unable to reach the Nationwide assistant right now.\n\n**Contact Nationwide** 📞\n${formatContactInfo(
          nationwideData.contact?.offices || []
        )}\n\nFeel free to ask about universities, visas, or counselling and I'll try again!`,
        id: Date.now() + 1
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        scrollToBottom("smooth");
      }, 150);
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
    
    const universityMessage = {
      from: "bot",
      text: `**${university.name}** 🎓\n\n**Country:** ${university.country}\n**Partnership:** Direct partnership with Nationwide\n\n**Popular Courses:**\n${university.popularCourses.map(course => `• ${course}`).join('\n')}\n\nWe provide complete support from application to arrival!`,
      id: Date.now() + 1
    };

    setMessages((prev) => [...prev, universityMessage]);
    setTimeout(() => {
      scrollToBottom("smooth");
    }, 150);
  };

  const clearChat = () => {
    setMessages([
      { 
        from: "bot", 
        text: "**Hello 👋 Welcome to Nationwide!**\n\n**Get your best here!**\n\nI'm here to help you with:\n\n• Study Abroad Opportunities ✈️\n• University Partnerships 🎓\n• Visa Consultation 📋\n• Admission Process 📝\n• Free Counselling 💬\n• Contact Details 📞\n\nHow can I assist you today?" 
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
    return msg.text.split('\n').map((line, lineIndex) => {
      if (line.trim() === '') {
        return <br key={lineIndex} />;
      }
      
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      return (
        <div 
          key={lineIndex} 
          className={lineIndex > 0 ? 'mt-1' : ''}
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 cursor-pointer text-white p-4 rounded-full shadow-lg flex items-center justify-center"
        style={{ backgroundColor: colors.primary.main }}
        whileHover={{ 
          scale: 1.1,
          backgroundColor: colors.primary.dark
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        animate={{ 
          scale: [1, 1.05, 1],
          transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
        }}
      >
        <FaComments size={20} />
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
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-20 right-4 left-4 sm:right-6 sm:left-auto w-auto sm:w-96 h-[70vh] max-h-[600px] flex flex-col border rounded-xl shadow-xl overflow-hidden z-50"
            style={{ 
              backgroundColor: colors.neutral.background,
              borderColor: colors.neutral.border
            }}
          >
            {/* Header */}
            <div 
              className="text-white px-4 py-3 flex justify-between items-center"
              style={{ 
                background: `linear-gradient(135deg, ${colors.primary.main}, ${colors.primary.dark})`
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div>
                  <span className="font-semibold text-sm block">Nationwide Assistant</span>
                  <span className="text-xs opacity-90">Get your best here</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={clearChat}
                  className="text-white hover:opacity-80 text-sm transition p-1 rounded-full hover:bg-white hover:bg-opacity-20"
                  title="Clear chat"
                >
                  <FaTrash size={12} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:opacity-80 transition p-1 rounded-full hover:bg-white hover:bg-opacity-20"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div 
              className="px-3 py-2 border-b"
              style={{ 
                backgroundColor: colors.secondary.light + '15', // Very light tint
                borderColor: colors.neutral.border
              }}
            >
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                {serviceCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full border transition-all whitespace-nowrap ${
                      activeCategory === category.id
                        ? "text-white border-transparent"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                    style={{
                      backgroundColor: activeCategory === category.id ? colors.primary.main : undefined,
                      borderColor: activeCategory === category.id ? colors.primary.main : undefined,
                    }}
                  >
                    {category.icon}
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Body */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 p-3 overflow-y-auto relative scrollbar-thin"
              style={{ 
                backgroundColor: colors.neutral.background,
              }}
            >
              <style jsx>{`
                .scrollbar-thumb {
                  scrollbar-width: thin;
                  scrollbar-color: ${colors.secondary.main} transparent;
                }
                .scrollbar-thumb::-webkit-scrollbar {
                  width: 6px;
                }
                .scrollbar-thumb::-webkit-scrollbar-track {
                  background: transparent;
                }
                .scrollbar-thumb::-webkit-scrollbar-thumb {
                  background-color: ${colors.secondary.main};
                  border-radius: 3px;
                }
              `}</style>
              
              <div className="sticky top-0 z-10 flex justify-end mb-2">
                <button
                  onClick={() => scrollToTop("smooth")}
                  className="p-1 rounded-full shadow-sm hover:bg-opacity-80 transition-all backdrop-blur-sm"
                  style={{ 
                    backgroundColor: colors.neutral.card,
                    color: colors.primary.main
                  }}
                  title="Scroll to top"
                >
                  <FaArrowUp size={10} />
                </button>
              </div>

              <div ref={messagesStartRef} />
              
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id || idx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`my-2 flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      msg.from === "user"
                        ? "text-white rounded-br-none shadow-sm"
                        : "text-gray-800 rounded-bl-none border"
                    }`}
                    style={{
                      backgroundColor: msg.from === "user" ? colors.primary.main : colors.neutral.card,
                      borderColor: msg.from === "user" ? colors.primary.main : colors.neutral.border,
                      color: msg.from === "user" ? colors.neutral.background : colors.neutral.text
                    }}
                  >
                    {renderMessageContent(msg)}
                  </div>
                </motion.div>
              ))}
              
              {/* University Selection */}
              {showUniversitySelection && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="my-2"
                >
                  <div 
                    className="rounded-2xl rounded-bl-none border p-3"
                    style={{
                      backgroundColor: colors.neutral.card,
                      borderColor: colors.neutral.border
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div 
                        className="flex items-center gap-2 text-sm font-semibold"
                        style={{ color: colors.primary.main }}
                      >
                        <FaUniversity size={14} />
                        <span>Partner Universities</span>
                      </div>
                      <span 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: colors.secondary.light + '20',
                          color: colors.neutral.textSecondary
                        }}
                      >
                        {filteredUniversities.length}
                      </span>
                    </div>
                    
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {filteredUniversities.map((university) => (
                        <button
                          key={university.id}
                          onClick={() => handleUniversitySelect(university)}
                          className="text-left w-full p-2 rounded-lg border transition-all duration-200 text-sm hover:border-opacity-100"
                          style={{
                            borderColor: colors.neutral.border,
                            color: colors.neutral.text
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.borderColor = colors.primary.main;
                            e.target.style.backgroundColor = colors.primary.main + '08';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.borderColor = colors.neutral.border;
                            e.target.style.backgroundColor = 'transparent';
                          }}
                        >
                          <div className="font-medium">
                            {university.name}
                          </div>
                          <div 
                            className="text-xs mt-1"
                            style={{ color: colors.neutral.textSecondary }}
                          >
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
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="my-2"
                >
                  <div 
                    className="border rounded-2xl p-3"
                    style={{
                      backgroundColor: colors.secondary.light + '10',
                      borderColor: colors.secondary.main + '30'
                    }}
                  >
                    <div 
                      className="flex items-center gap-2 text-sm font-semibold mb-2"
                      style={{ color: colors.neutral.text }}
                    >
                      <FaLightbulb 
                        size={14} 
                        style={{ color: colors.secondary.main }} 
                      />
                      <span>Quick Help</span>
                    </div>
                    <div className="space-y-1">
                      {[
                        "Which Australian universities are you partnered with?",
                        "Do you help with visa filing?",
                        "What are your contact details?"
                      ].map((query, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickAction(query)}
                          className="text-left w-full text-xs p-1 rounded transition-all hover:bg-opacity-20"
                          style={{ 
                            color: colors.neutral.textSecondary,
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.color = colors.primary.main;
                            e.target.style.backgroundColor = colors.primary.main + '15';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = colors.neutral.textSecondary;
                            e.target.style.backgroundColor = 'transparent';
                          }}
                        >
                          💬 {query.split('?')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start my-2"
                >
                  <div 
                    className="text-gray-800 rounded-2xl rounded-bl-none px-3 py-2 text-sm border"
                    style={{
                      backgroundColor: colors.neutral.card,
                      borderColor: colors.neutral.border,
                      color: colors.neutral.text
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity }}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: colors.primary.main }}
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: colors.primary.main }}
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: colors.primary.main }}
                        />
                      </div>
                      <span className="text-xs">Finding information...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div className="sticky bottom-0 flex justify-end mt-2">
                <button
                  onClick={() => scrollToBottom("smooth")}
                  className="p-1 rounded-full shadow-sm hover:bg-opacity-80 transition-all backdrop-blur-sm"
                  style={{ 
                    backgroundColor: colors.neutral.card,
                    color: colors.primary.main
                  }}
                  title="Scroll to bottom"
                >
                  <FaArrowUp size={10} className="rotate-180" />
                </button>
              </div>
              
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div 
              className="border-t p-3"
              style={{ 
                backgroundColor: colors.neutral.background,
                borderColor: colors.neutral.border
              }}
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 text-sm p-2 border rounded-lg focus:outline-none focus:ring-1 focus:border-transparent transition-all"
                  style={{
                    borderColor: colors.neutral.border,
                    color: colors.neutral.text
                  }}
                  placeholder="Ask about study abroad..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
                  disabled={isLoading}
                />
                <button
                  className="text-white px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  style={{ 
                    backgroundColor: colors.primary.main 
                  }}
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  onMouseEnter={(e) => {
                    if (!isLoading && input.trim()) {
                      e.target.style.backgroundColor = colors.primary.dark;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && input.trim()) {
                      e.target.style.backgroundColor = colors.primary.main;
                    }
                  }}
                >
                  <FaPaperPlane size={12} />
                </button>
              </div>
              
              <div 
                className="mt-1 text-xs text-center flex items-center justify-center gap-1"
                style={{ color: colors.neutral.textSecondary }}
              >
                <IoIosHelpCircle size={12} style={{ color: colors.primary.main }} />
                Try: "universities" or "visa help"
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