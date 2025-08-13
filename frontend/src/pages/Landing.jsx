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
              <div className="title text-center text-[1.5rem] text-white leading-[1.5rem] mb-[1rem] ">Interactive Quiz</div>
              <div className="desc text-center text-[0.9rem] text-slate-400 ">A gamified, AI-powered quiz that challenges you on common health myths. The quiz adapts to your knowledge, making learning about health facts fun.</div>
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
              <div className="title text-center text-[1.5rem] text-white leading-[1.5rem] mb-[1rem] ">Real-Time Scanner</div>
              <div className="desc text-center text-[0.9rem] text-slate-400 ">A browser extension using OCR and NLP to scan your screen. It validates health info in real-time, offering fact-checks and instant alerts.</div>
            </div>
          </GlowCard>
        </div>
        <div className="faq flex flex-col justify-center items-center gap-[1rem] mt-[2rem] mb-[5rem] ">
          <p className=' text-[2rem] text-white ' >FAQs</p>
          <Accordion type="single" collapsible className="w-full max-w-2xl text-white ">
            <AccordionItem value="item-1">
              <AccordionTrigger>Accordion Item 1</AccordionTrigger>
              <AccordionContent>Accordion Content 1</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Accordion Item 2</AccordionTrigger>
              <AccordionContent>Accordion Content 2</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Accordion Item 3</AccordionTrigger>
              <AccordionContent>Accordion Content 3</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <footer className="footer w-[100vw] md:px-[4rem] flex bg-neutral text-neutral-content p-10 text-white ">
          <div className=' w-[50%] ' >
            <svg
              width="50"
              height="50"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fillRule="evenodd"
              clipRule="evenodd"
              className="fill-current">
              <path
                d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
            </svg>
            <p>
              ACME Industries Ltd.
              <br />
              Providing reliable tech since 1992
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
