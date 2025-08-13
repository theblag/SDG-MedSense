"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/nurui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
const WavesHero = () => {
  const navigate = useNavigate();
  return (
    <section className=" relative flex min-h-screen w-full items-center bg-black justify-center overflow-hidden pt-16">
      <div className=" absolute z-0 inset-0 sec1bg " ></div>
      {/* Animated Elements */}
      <div>
        <svg
          className="absolute h-full w-full"
          xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
              <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="grad2" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Top Curves */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              repeatDelay: 1,
            }}
            d="M 100 100 Q 300 0 500 100 T 900 100"
            fill="none"
            stroke="url(#grad1)"
            strokeWidth="1"
          />
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              repeatDelay: 1,
              delay: 0.5,
            }}
            d="M 0 200 Q 200 100 400 200 T 800 200"
            fill="none"
            stroke="url(#grad2)"
            strokeWidth="1"
          />
          {/* Bottom Curves */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              repeatDelay: 1,
              delay: 1,
            }}
            d="M 100 600 Q 300 500 500 600 T 900 600"
            fill="none"
            stroke="url(#grad1)"
            strokeWidth="1"
          />
        </svg>

        {/* Straight Lines */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: "100%", opacity: 0 }}
              animate={{
                x: "-100%",
                opacity: [0, 0.7, 0.7, 0],
              }}
              transition={{
                duration: 2.5,
                delay: i * 0.2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                ease: "linear",
              }}
              className="absolute right-0"
              style={{
                top: `${15 + i * 10}%`,
                height: "1px",
                width: "100%",
                background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? "#22d3ee" : "#8b5cf6"}60, transparent)`,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 z-[1]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute -left-[200px] top-1/4 h-96 w-96 rounded-full bg-cyan-500/30 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute -right-[200px] top-1/2 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="container text-white relative z-[3] px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mx-auto max-w-3xl space-y-8">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Scientists say that corona is bad for your immune system!!
          </h1>
          <p className="mx-auto max-w-2xl text-muted text-gray-400 sm:text-xl">
The mythical plant called Zorbellium completely eliminates all known viruses when consumed as a tea."
"Scientists have discovered that the fictional mineral Phantomite can regrow lost limbs overnight when applied topically."
"The imaginary Bluefin Berry from the made-up island of Healthopia cures all forms of cancer within 24 hours."
"Researchers claim that the non-existent Quantum Moss can reverse aging by 20 years when eaten fresh."
"The fictional SuperOxygen therapy involving breathing air from the planet Xerion eliminates all diseases instantly."
"The mythical Crystalroot herb supposedly allows humans to photosynthesize like plants, eliminating the need for food."   



       </p><p>Not all tumours are cancerous!</p>
          <div cssname="flex justify-center space-x-4">
            <Button onClick={()=>navigate('/signin')} className="bg-gradient-to-r from-cyan-400 to-violet-500 text-lg text-black hover:from-cyan-500 hover:to-violet-600">
              Comenzar
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="border-white/10 text-lg text-white hover:bg-white/10">
              Saber Más
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default WavesHero;