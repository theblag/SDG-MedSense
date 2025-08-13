import React from 'react'
import { FileUpload } from '@/components/ui/file-upload';
import { CheckCircle, Shield, Zap } from 'lucide-react';

const doubts = () => {
  
  const handleFilesChange = (files) => {
    // Handle the uploaded files here
    // For example, you can log them to the console or start an upload process
    console.log(files);
  };

  return (
    <div className=" bg-black md:h-[100vh] w-[100vw] flex md:flex-row flex-col  items-center justify-center">
      <div className="reportbg absolute inset-0 "></div>
<div className="md:w-[50%] md:h-[100%] flex items-center justify-center p-8 relative z-10">
        <div className="max-w-lg space-y-8 text-white">
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-[2.5rem] whitespace-nowrap font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Scan. Verify. Trust.
            </h1>
            <p className="text-[0.9rem] text-gray-300 font-medium">
              Instantly debunk myths and validate health information with our real-time screen scanner.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-gray-400 text-[1rem] leading-relaxed">
              In a world of information overload, getting trusted health advice is critical. This browser extension acts as your personal fact-checker, using advanced AI to scan, analyze, and validate health content on any page.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-gray-300">Real-time content scanning</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                <CheckCircle className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-gray-300">AI-powered accuracy validation</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-gray-300">Trusted source verification</span>
            </div>
          </div>

          {/* Call to Action Text */}
          <div className="pt-4">
            <p className="text-sm text-gray-500 italic">
              Upload your medical reports to get started with AI-powered analysis →
            </p>
          </div>
        </div>
      </div>
<div className='md:w-[50%] md:h-[100%] flex items-center justify-center'>
        <FileUpload onChange={handleFilesChange} />
      </div>
    </div>
  )
}

export default doubts
