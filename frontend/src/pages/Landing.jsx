import React from 'react'
import { useNavigate } from 'react-router-dom'
import WavesHero from "../components/nurui/waves-hero";
import { Button } from '../components/nurui/button';
import { GlowCard } from '../components/nurui/spotlight-card';
import { useRef } from 'react';
import NavBar from '../components/navbar';
import {
  InputButton,
  InputButtonAction,
  InputButtonProvider,
  InputButtonSubmit,
  InputButtonInput,
} from '../components/animate-ui/buttons/input';
import { GitHubStarsButton } from '@/components/animate-ui/buttons/github-stars';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/animate-ui/radix/accordion';


const Landing = () => {
    const navigate = useNavigate();

    const iconRef = useRef(null);
    
    // ✅ Create handler function
    const handleCardHover = () => {
        if (iconRef.current) {
            iconRef.current.playFromBeginning();
        }
    };
  return (
    <div className='bg-black overflow-x-hidden' >
      <div className="navbar fixed top-[1rem] left-1/2 -translate-x-1/2 z-50 ">
            <NavBar />
      </div>
      <div className="fixed top-[1rem] right-[1.5rem] z-50 ">
            <Button onClick={()=>navigate('/signin')} className="bg-gradient-to-r from-cyan-400 to-violet-500 text-lg text-black hover:from-cyan-500 hover:to-violet-600">Sign In</Button>
      </div>
      <WavesHero/>
      <div className=' sec2bg '>
        <div className=" grid place-items-center grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-10 w-[90vw] mx-auto custom-cursor py-20">
          <GlowCard
            customSize
            className="w-1/2 md:w-full h-[60vh] md:h-[60vh] py-[3rem] px-[2rem] flex items-center justify-center"
            glowColor="green"
          >
            <div className="glow-card-content">
              <div className="icon flex justify-center mb-[10%] ">
                <lord-icon
                  ref={iconRef}
                  src="https://cdn.lordicon.com/ntfnmkcn.json"
                  colors="primary:#ebe6ef,secondary:#3a3347,tertiary:#a66037,quaternary:#f9c9c0,quinary:#f24c00"
                  trigger="hover"
                  style={{
                    width: 'clamp(40px, 8vw, 65px)',
                    height: 'clamp(40px, 8vw, 65px)',
                    marginBottom: '0px',
                    cursor: 'pointer',
                    margin: "0px"
                  }}
                />
              </div>
              <div className="title text-center text-[1.5rem] text-white leading-[1.5rem] mb-[1rem] ">Real-Time Scanner</div>
              <div className="desc text-center text-[0.9rem] text-slate-400 ">A browser extension using OCR and NLP to scan your screen. It validates health info in real-time, offering fact-checks and instant alerts.</div>
            </div>
          </GlowCard>
          <GlowCard customSize className="w-1/2 md:w-full h-[60vh] md:h-[60vh] py-[3rem] px-[2rem] flex items-center justify-center">
            <div className="glow-card-content">
              <div className="icon flex justify-center mb-[10%] ">
                <lord-icon
                  ref={iconRef}
                  src="https://cdn.lordicon.com/yaxbmvvh.json"
                  trigger="hover"
                  style={{
                    width: 'clamp(40px, 8vw, 65px)',
                    height: 'clamp(40px, 8vw, 65px)',
                    marginBottom: '0px',
                    cursor: 'pointer',
                    margin: "0px"
                  }}
                />
              </div>
              <div className="title text-center text-[1.5rem] text-white leading-[1.5rem] mb-[1rem] ">Report Analyzer</div>
              <div className="desc text-center text-[0.9rem] text-slate-400 ">Upload medical reports like blood tests. Our AI extracts data with OCR, explains it in simple terms, and highlights commonly misunderstood values.</div>
            </div>
          </GlowCard>
          
          <GlowCard customSize className="w-1/2 md:w-full h-[60vh] md:h-[60vh] py-[3rem] px-[2rem] flex items-center justify-center">
            <div className="glow-card-content">
              <div className="icon flex justify-center mb-[10%] ">
<lord-icon
    src="https://cdn.lordicon.com/iamvsnir.json"
    trigger="hover"
    colors="primary:#16a9c7,secondary:#b4b4b4,tertiary:#ebe6ef,quaternary:#f24c00,quinary:#4bb3fd"
    style={{
                    width: 'clamp(40px, 8vw, 65px)',
                    height: 'clamp(40px, 8vw, 65px)',
                    marginBottom: '0px',
                    cursor: 'pointer',
                    margin: "0px"
                  }}>
</lord-icon>
              </div>
              <div className="title text-center text-[1.5rem] text-white leading-[1.5rem] mb-[1rem] ">Voice-Activated Health Misinformation Guard</div>
              <div className="desc text-center text-[0.9rem] text-slate-400 ">Listens to live audio (e.g., voice notes, podcasts) and transcribes in real-time. Instantly flags misinformation with voice or pop-up alerts and provides quick, trusted explanations while ensuring user privacy.</div>
            </div>
          </GlowCard>
          <GlowCard customSize className="w-1/2 md:w-full h-[60vh] md:h-[60vh] py-[3rem] px-[2rem] flex items-center justify-center">
            <div className="glow-card-content">
              <div className="icon flex justify-center mb-[10%] ">
<lord-icon
    src="https://cdn.lordicon.com/uqxlhxnl.json"
    trigger="hover"
    style={{
                    width: 'clamp(40px, 8vw, 65px)',
                    height: 'clamp(40px, 8vw, 65px)',
                    marginBottom: '0px',
                    cursor: 'pointer',
                    margin: "0px"
                  }}
    >
</lord-icon>
              </div>
              <div className="title text-center text-[1.5rem] text-white leading-[1.5rem] mb-[1rem] ">Interactive Quiz</div>
              <div className="desc text-center text-[0.9rem] text-slate-400 ">A gamified, AI-powered quiz that challenges you on common health myths. The quiz adapts to your knowledge, making learning about health facts fun.</div>
            </div>
          </GlowCard>
          <GlowCard customSize className="w-1/2 md:w-full h-[60vh] md:h-[60vh] py-[3rem] px-[2rem] flex items-center justify-center">
            <div className="glow-card-content">
              <div className="icon flex justify-center mb-[10%] ">
                <lord-icon
                  ref={iconRef}
                  src="https://cdn.lordicon.com/abhwievu.json"
                  trigger="hover"
                  style={{
                    width: 'clamp(40px, 8vw, 65px)',
                    height: 'clamp(40px, 8vw, 65px)',
                    marginBottom: '0px',
                    cursor: 'pointer',
                    margin: "0px"
                  }}
                />
              </div>
              <div className="title text-center text-[1.5rem] text-white leading-[1.5rem] mb-[1rem] ">Peer Fact-Check & Collaborative Correction Wall</div>
              <div className="desc text-center text-[0.9rem] text-slate-400 ">Users share suspicious health claims; AI analyzes and displays verdicts publicly. Community can upvote, downvote, and submit corrections to improve accuracy and help debunk popular myths.</div>
            </div>
          </GlowCard>
          <GlowCard customSize className="w-1/2 md:w-full h-[60vh] md:h-[60vh] py-[3rem] px-[2rem] flex items-center justify-center">
            <div className="glow-card-content">
              <div className="icon flex justify-center mb-[10%] ">
                <lord-icon
                  ref={iconRef}
                  src="https://cdn.lordicon.com/ilgzgiqi.json"
                  trigger="hover"
                  style={{
                    width: 'clamp(40px, 8vw, 65px)',
                    height: 'clamp(40px, 8vw, 65px)',
                    marginBottom: '0px',
                    cursor: 'pointer',
                    margin: "0px"
                  }}
                />
              </div>
              <div className="title text-center text-[1.5rem] text-white leading-[1.5rem] mb-[1rem] ">Medical Knowledge Assistant</div>
              <div className="desc text-center text-[0.9rem] text-slate-400 ">Upload your medical textbooks and get accurate answers to all your queries. Our AI-powered tool analyzes your PDFs and provides precise explanations, summaries, and guidance.</div>
            </div>
          </GlowCard>
        </div>
        <div className="faq flex flex-col justify-center items-center gap-[1rem] mt-[2rem] mb-[5rem] ">
          <p className=' text-[2rem] text-white ' >FAQs</p>
          <Accordion type="single" collapsible className="w-full max-w-2xl text-white ">
            <AccordionItem value="item-1">
              <AccordionTrigger>What problem does your project solve?</AccordionTrigger>
              <AccordionContent>Many people searching for health information online encounter misleading or false claims, leading to self-medication, delayed treatment, and preventable harm. Our solution detects and corrects health misinformation in real-time.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How does your system detect health misinformation?</AccordionTrigger>
              <AccordionContent>We use OCR to extract text from on-screen content or uploaded documents, then apply NLP and Retrieval-Augmented Generation (RAG) to verify the information. If misinformation is found, our system provides an instant fact-check or alert.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What features make your solution unique?</AccordionTrigger>
              <AccordionContent>Our platform offers real-time health misinformation detection, diagnosis report analysis, interactive myth quizzes, a voice-activated misinformation guard, a collaborative correction wall, and a WhatsApp Web extension — all while preserving user privacy.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <footer className="footer w-[100vw] md:px-[4rem] flex bg-neutral text-neutral-content p-10 text-white ">
          <div className=' w-[50%] ' >
            <img src="/logo.png" className=' h-[80px] w-[80px] ' alt="" />
            <p>
              MedSense Pvt. Ltd.
              <br />
              <span className=' text-[0.8rem] italic text-gray-500 ' >Providing reliable tech since 2025</span>
            </p>
          </div>
          <div className=' w-[50%] flex flex-col items-end ' >

            <GitHubStarsButton username="animate-ui" repo="animate-ui" />

          </div>
        </footer>
      </div>

    </div>

  )
}

export default Landing
