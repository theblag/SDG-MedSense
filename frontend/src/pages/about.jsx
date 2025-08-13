import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, Linkedin, Mail, Code, Brain, Heart, Target, Users, Award, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock GlowCard component for demonstration
const GlowCard = ({ children, className, glowColor, onMouseEnter, customSize }) => (
  <div 
    className={`${className} bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/20 transition-all duration-300`}
    onMouseEnter={onMouseEnter}
    style={{
      boxShadow: `0 0 30px ${glowColor === 'blue' ? 'rgba(59, 130, 246, 0.3)' : 
                            glowColor === 'green' ? 'rgba(34, 197, 94, 0.3)' : 
                            glowColor === 'purple' ? 'rgba(147, 51, 234, 0.3)' : 'rgba(6, 182, 212, 0.3)'}`
    }}
  >
    {children}
  </div>
);

const About = () => {
  const navigate = useNavigate()
  const iconRef1 = useRef(null);
  const iconRef2 = useRef(null);
  const iconRef3 = useRef(null);

  const handleCardHover = (ref) => {
    if (ref.current) {
      ref.current.playFromBeginning();
    }
  };

  const teamMembers = [
    {
      name: "Kesavan G",
      role: "Developer",
      description: "Student at IIIT Kottayam",
      glowColor: "blue",
      social: {
        github: "#",
        linkedin: "#",
        email: "kesavan@iiitk.ac.in"
      }
    },
    {
      name: "Aditya A",
      role: "Developer", 
      description: "Student at IIIT Kottayam",
      glowColor: "green",
      social: {
        github: "#",
        linkedin: "#",
        email: "aditya@iiitk.ac.in"
      }
    },
    {
      name: "Anshuman Biswas",
      role: "Developer",
      description: "Student at IIIT Kottayam",
      glowColor: "purple",
      social: {
        github: "#",
        linkedin: "#", 
        email: "anshuman@iiitk.ac.in"
      }
    }
  ];

  const achievements = [
    {
      icon: <Brain className="w-8 h-8 text-purple-400" />,
      title: "Real-Time Health Guard",
      description: "Browser extension that scans and validates health information with instant fact-checking alerts"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-400" />,
      title: "Medical Report Analyzer",
      description: "Upload blood tests and medical reports. AI extracts data with OCR and explains values in simple terms"
    },
    {
      icon: <Heart className="w-8 h-8 text-red-400" />,
      title: "Interactive Health Quiz",
      description: "Gamified quiz that challenges common health myths and adapts to your knowledge level"
    },
    {
      icon: <Award className="w-8 h-8 text-yellow-400" />,
      title: "Community Collaboration",
      description: "Users can share suspicious health claims and the community can upvote or downvote them"
    }
  ];

  return (
    <div className='bg-black min-h-screen'>
      <div className="relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-6 left-6 z-20"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={()=>navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
          >
            <ArrowLeft size={16} />
            Back to Home
          </motion.button>
        </motion.div>
      </div>

      <div className='sec2bg'>
        <div className="w-[90vw] mx-auto custom-cursor py-20">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16 pt-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              About{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400">
                MedSense
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
              An AI-powered healthcare platform built by students from IIIT Kottayam to help people 
              access accurate health information
            </p>
            <div className="flex items-center justify-center gap-2 text-slate-500">
              <Lightbulb className="text-yellow-400" size={20} />
              <span className="text-lg">Built at Indian Institute of Information Technology Kottayam</span>
            </div>
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto text-center mb-20"
          >
            <div className="bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <Target className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">What is MedSense?</h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                MedSense is a comprehensive healthcare platform that helps users identify health misinformation, 
                analyze medical reports, learn through interactive quizzes, and connect with a community focused 
                on accurate health information. Our goal is to make reliable health information accessible to everyone.
              </p>
            </div>
          </motion.div>

          {/* Team Members */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-12">Our Team</h2>
            <div className="grid place-items-center grid-cols-1 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                  className="w-full max-w-sm"
                >
                  <GlowCard
                    customSize
                    className="w-full h-[500px] py-8 px-6 flex items-center justify-center cursor-default"
                    glowColor={member.glowColor}
                    onMouseEnter={() => handleCardHover(member.iconRef)}
                  >
                    <div className="glow-card-content text-center">
                      <div className="icon flex justify-center mb-6">
                        <div 
                          className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-600 rounded-full flex items-center justify-center"
                          style={{
                            background: member.glowColor === 'blue' ? 'linear-gradient(135deg, #3b82f6, #1e40af)' :
                                       member.glowColor === 'green' ? 'linear-gradient(135deg, #10b981, #059669)' :
                                       'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                          }}
                        >
                          {member.glowColor === 'blue' ? <Code className="w-8 h-8 text-white" /> :
                           member.glowColor === 'green' ? <Brain className="w-8 h-8 text-white" /> :
                           <Heart className="w-8 h-8 text-white" />}
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                      <p className="text-cyan-400 font-medium mb-4">{member.role}</p>
                      <p className="text-slate-400 text-sm leading-relaxed mb-6">{member.description}</p>
                      
                      <div className="flex justify-center gap-4">
                        <motion.a
                          whileHover={{ scale: 1.1 }}
                          href={member.social.github}
                          className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                        >
                          <Github size={18} />
                        </motion.a>
                        <motion.a
                          whileHover={{ scale: 1.1 }}
                          href={member.social.linkedin}
                          className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                        >
                          <Linkedin size={18} />
                        </motion.a>
                        <motion.a
                          whileHover={{ scale: 1.1 }}
                          href={`mailto:${member.social.email}`}
                          className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                        >
                          <Mail size={18} />
                        </motion.a>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements/Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-12">MedSense Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-lg">
                      {achievement.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{achievement.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{achievement.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Platform Features Showcase */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="text-center"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">
                MedSense Platform
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                A student project from IIIT Kottayam focused on creating tools to help people 
                identify reliable health information and understand medical reports better.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-slate-500 mb-8">
                <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-lg">
                  <Brain size={24} className="text-purple-400" />
                  <span className="text-sm">AI-Powered</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-lg">
                  <Code size={24} className="text-blue-400" />
                  <span className="text-sm">Real-time</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-lg">
                  <Heart size={24} className="text-red-400" />
                  <span className="text-sm">Health-Focused</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-lg">
                  <Users size={24} className="text-green-400" />
                  <span className="text-sm">Community</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-lg">
                  <Target size={24} className="text-yellow-400" />
                  <span className="text-sm">Accurate</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-lg">
                  <Award size={24} className="text-cyan-400" />
                  <span className="text-sm">Innovative</span>
                </div>
              </div>

              <div className="text-slate-400">
                <p className="mb-4">
                  <strong className="text-white">Built with:</strong> React, Firebase, and various AI tools
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;