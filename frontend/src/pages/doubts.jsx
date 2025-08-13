import React, { useMemo, useState } from 'react'
import { FileUpload } from '@/components/ui/file-upload';
import { CheckCircle, Shield, Zap, Loader2, FileText, Sparkles, Info, Tag, Gauge } from 'lucide-react';
import { createSession, uploadAndEmbed, askQuestion } from '@/services/geminiservice';

const Doubts = () => {
  const [status, setStatus] = useState('');
  const [sessionId, setSessionId] = useState(() => `session_${Math.random().toString(36).slice(2, 10)}`);
  const [documentId, setDocumentId] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFilesChange = async (files) => {
    const file = files?.[0];
    if (!file) return;
    try {
      setErrorMessage('');
      setIsUploading(true);
      setStatus('Creating session...');
      await createSession(sessionId, 'Doubts page session');
      setStatus('Uploading and embedding...');
      const res = await uploadAndEmbed(file, sessionId);
      setDocumentId(res.document_id);
      setStatus('Ready. Ask your question below.');
    } catch (e) {
      console.error(e);
      setErrorMessage('Upload failed. Please try again.');
      setStatus('');
    }
    finally {
      setIsUploading(false);
    }
  };

  const onAsk = async () => {
    if (!question.trim()) return;
    setErrorMessage('');
    setIsThinking(true);
    setAnswer(null);
    try {
      const res = await askQuestion({ question, sessionId, documentId });
      setAnswer(res);
      setStatus('');
    } catch (e) {
      console.error(e);
      setErrorMessage('Query failed. Please try again.');
    }
    finally {
      setIsThinking(false);
    }
  }

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
              Upload your textbook/report to get started with AI-powered RAG analysis →
            </p>
            {status && (
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-300">
                {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3 text-emerald-400"/>}
                <span>{status}</span>
              </div>
            )}
            {errorMessage && (
              <div className="mt-2 flex items-center gap-2 text-xs text-red-400">
                <Info className="w-3 h-3"/> <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>
<div className='md:w-[50%] md:h-[100%] flex items-center justify-center'>
        <div className='w-full max-w-xl space-y-3'>
          <div className={`rounded-xl border ${isUploading ? 'border-cyan-600/60' : 'border-neutral-800'} bg-neutral-900/60 backdrop-blur p-4`}> 
            <FileUpload onChange={handleFilesChange} />
          </div>
          <div className='rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 text-gray-300'>
            <div className='flex items-center gap-2 mb-2'>
              <FileText className='w-4 h-4 text-cyan-400'/>
              <span className='text-sm font-semibold'>Steps</span>
            </div>
            <ol className='text-xs space-y-1'>
              <li className={`flex items-center gap-2 ${documentId ? 'text-emerald-400' : isUploading ? 'text-cyan-300' : 'text-gray-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${documentId ? 'bg-emerald-400' : isUploading ? 'bg-cyan-300' : 'bg-gray-500'}`}></span>
                Create session → Upload → Embed
              </li>
              <li className='flex items-center gap-2 text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-gray-500'></span>
                Ask a question about the uploaded document
              </li>
            </ol>
          </div>
        </div>
      </div>
      {/* QA Box */}
      <div className='w-full md:w-[60%] p-4 md:absolute md:bottom-4 md:left-1/2 md:-translate-x-1/2 z-10'>
        <div className='bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-lg p-3 flex gap-2 items-center'>
          <input
            className='flex-1 bg-transparent outline-none text-white placeholder-gray-500'
            placeholder='Ask a question about the uploaded document...'
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={!documentId}
          />
          <button
            className='px-4 py-2 bg-cyan-600 rounded text-white disabled:opacity-50 flex items-center gap-2'
            onClick={onAsk}
            disabled={!documentId || !question.trim() || isThinking}
          >
            {isThinking ? <Loader2 className='w-4 h-4 animate-spin'/> : <Sparkles className='w-4 h-4'/>}
            {isThinking ? 'Thinking' : 'Ask'}
          </button>
        </div>
        {answer && (
          <div className='mt-3 bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 rounded-xl p-5 text-gray-200 shadow-[0_0_40px_-12px_rgba(0,204,255,0.25)]'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Sparkles className='w-5 h-5 text-cyan-400'/>
                <div className='text-white font-semibold'>Answer</div>
              </div>
              <div className='flex items-center gap-2 text-xs text-gray-400'>
                <Tag className='w-3 h-3'/> {answer?.score_details?.document_type || 'unknown'}
              </div>
            </div>
            <div className='mt-2 leading-relaxed'>{answer.answer}</div>

            {answer.justification && (
              <div className='mt-4 p-3 rounded-lg border border-neutral-800 bg-neutral-900/60'>
                <div className='flex items-center gap-2 text-sm text-gray-300'>
                  <Info className='w-4 h-4 text-cyan-400'/> Rationale
                </div>
                <div className='text-sm text-gray-400 mt-1'>{answer.justification}</div>
              </div>
            )}

            <div className='mt-4 grid md:grid-cols-2 gap-3'>
              <div className='p-3 rounded-lg border border-neutral-800 bg-neutral-900/60'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-300'>Confidence</span>
                  <span className='text-gray-400'>{Math.round((answer.confidence || 0)*100)}%</span>
                </div>
                <div className='mt-2 h-2 w-full bg-neutral-800 rounded-full overflow-hidden'>
                  <div className='h-full bg-gradient-to-r from-cyan-500 to-emerald-400' style={{ width: `${Math.round((answer.confidence || 0)*100)}%` }}></div>
                </div>
              </div>
              <div className='p-3 rounded-lg border border-neutral-800 bg-neutral-900/60'>
                <div className='flex items-center justify-between text-sm text-gray-300'>
                  <span>Score</span>
                  <span className='text-gray-400'>{answer?.score_details?.score ?? 0}</span>
                </div>
                <div className='mt-1 text-[11px] text-gray-500'>q:{answer?.score_details?.question_weight ?? 0} × d:{answer?.score_details?.document_weight ?? 0}</div>
              </div>
            </div>

            {Array.isArray(answer.matched_clauses) && answer.matched_clauses.length > 0 && (
              <div className='mt-4'>
                <div className='text-sm text-gray-300 mb-1'>Matched clauses</div>
                <div className='flex flex-wrap gap-2'>
                  {answer.matched_clauses.map((clause, idx) => (
                    <span key={idx} className='px-2 py-1 rounded-md border border-neutral-800 bg-neutral-900/60 text-xs text-gray-300'>{clause}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Doubts
