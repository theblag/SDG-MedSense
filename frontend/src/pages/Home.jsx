import { signOut } from 'firebase/auth';
import React, { useRef } from 'react';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import WavesHero from "@/components/nurui/waves-hero";
import { GlowCard } from '../components/nurui/spotlight-card';
import { ArrowRight, LogOut, User, Shield, FileText, Brain, Activity, Zap } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const iconRef1 = useRef(null);
  const iconRef2 = useRef(null);
  const iconRef3 = useRef(null);
  const iconRef4 = useRef(null);
  const iconRef5 = useRef(null);
  const iconRef6 = useRef(null);

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleCardHover = (ref) => {
    if (ref.current) {
      ref.current.playFromBeginning();
    }
  };

  const features = [
    {
      title: "Real-Time Health Guard",
      description: "AI-powered browser extension that scans and validates health information in real-time with instant fact-checking alerts.",
      icon: "https://cdn.lordicon.com/uppnozfl.json",
      iconRef: iconRef1,
      glowColor: "green",
      route: "/extension"
    },
    {
      title: "Voice Health Companion",
      description: "AI-powered voice analysis for real-time health insights.",
      icon: "https://cdn.lordicon.com/gjpeglhr.json",
      iconRef: iconRef5,
      glowColor: "blue",
      route: "/healthmisinformation"
    },
    {
      title: "Medical Report Analyzer", 
      description: "Upload blood tests and medical reports. Our AI extracts data with OCR and explains complex values in simple terms.",
      icon: "https://cdn.lordicon.com/yaxbmvvh.json",
      iconRef: iconRef2,
      glowColor: "blue",
      route: "/reportAnalyzer"
    },
    {
      title: "Interactive Health Quiz",
      description: "Gamified AI-powered quiz that challenges common health myths. Adapts to your knowledge level for personalized learning.",
      icon: "https://cdn.lordicon.com/qhgmphtg.json",
      iconRef: iconRef3,
      glowColor: "blue",
      route: "/quiz"
    },
    {
      title: "Colloborative Correction Wall",
      description: "Users share suspicious health claims and Community can upvote or downvote.",
      icon: "https://cdn.lordicon.com/ktsahwvc.json",
      iconRef: iconRef4,
      glowColor: "green",
      route: "/community"
    },
    {
      title: "Emergency Assistant",
      description: "Quick access to emergency health information, first aid guidance, and nearest medical facility locator.",
      icon: "https://cdn.lordicon.com/wzwygmng.json",
      iconRef: iconRef6,
      glowColor: "green",
      route: "/emergency"
    }
  ];

  return (
    <div className='bg-black'>
      <div className="relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-6 right-6 z-20"
        >
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
            >
              <User size={16} />
              Profile
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-all duration-200"
            >
              <LogOut size={16} />
              Logout
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className='sec2bg'>
        <div className="w-[90vw] mx-auto custom-cursor py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400">
                MedSense
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Your comprehensive AI-powered health companion for accurate information, analysis, and personalized insights
            </p>
          </motion.div>

          <div className="grid place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="w-full"
              >
                <GlowCard
                  customSize
                  className="w-full h-[70vh] py-[3rem] px-[2rem] flex items-center justify-center cursor-pointer transform transition-transform duration-300 hover:scale-105"
                  glowColor={feature.glowColor}
                  onMouseEnter={() => handleCardHover(feature.iconRef)}
                  onClick={() => navigate(feature.route)}
                >
                  <div className="glow-card-content text-center">
                    <div className="icon flex justify-center mb-[15%]">
                      <lord-icon
                        ref={feature.iconRef}
                        src={feature.icon}
                        colors="primary:#ebe6ef,secondary:#3a3347,tertiary:#a66037,quaternary:#f9c9c0,quinary:#6366f1"
                        trigger="hover"
                        style={{
                          width: 'clamp(50px, 10vw, 80px)',
                          height: 'clamp(50px, 10vw, 80px)',
                          marginBottom: '0px',
                          cursor: 'pointer',
                          margin: "0px"
                        }}
                      />
                    </div>
                    <div className="title text-center text-[1.4rem] md:text-[1.6rem] text-white leading-[1.4rem] mb-[1.5rem] font-semibold">
                      {feature.title}
                    </div>
                    <div className="desc text-center text-[0.9rem] text-slate-400 leading-relaxed mb-6">
                      {feature.description}
                    </div>
                    <div onClick={()=>navigate(feature.route)} className="flex justify-center">
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-2 text-cyan-400 font-medium"
                      >
                        Explore <ArrowRight size={18} />
                      </motion.div>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-20"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">
                Powered by Advanced AI Technology
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                Experience the future of healthcare with our cutting-edge artificial intelligence that provides accurate, 
                real-time health insights and personalized recommendations tailored to your needs.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-slate-500">
                <div className="flex items-center gap-2">
                  <Shield size={20} className="text-green-400" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={20} className="text-yellow-400" />
                  <span>Real-time Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain size={20} className="text-purple-400" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity size={20} className="text-blue-400" />
                  <span>24/7 Available</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;