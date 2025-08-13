import React, { useState, useRef, useEffect, useMemo } from 'react';
import { sendMessageToGemini } from '../services/geminiservice';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../config/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

const HealthMisinformationGuard = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micActivated, setMicActivated] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(window.speechSynthesis);
  const [username, setUsername] = useState('');
  
  // New state for continuous recording
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [lastSpeechTime, setLastSpeechTime] = useState(null);
  const silenceTimeoutRef = useRef(null);
  const isStartingRecordingRef = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile2 = async () => {
      try {
        const docRef = doc(database, "Users", auth.currentUser?.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const reference = docSnap.data();
          setUsername(reference.username);
          console.log(reference.username + ": username"); 
          
          setMessages(prev => {
            if (prev.length === 0) {
              const welcomeMessage = {
                text: `Hi ${reference.username}! I'm MedSense, your AI health assistant. Let's clarify any medical questions you have.`,
                sender: 'medsense',
                timestamp: new Date().toISOString(),
              };
              return [welcomeMessage];
            }
            return prev;
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        navigate('/');
      }
    };

    fetchProfile2();
  }, [navigate]);

  // Speak welcome message after username is set
  useEffect(() => {
    if (username && messages.length > 0 && messages[0].sender === 'medsense') {
      // Delay to ensure voices are loaded
      setTimeout(() => {
        speakText(messages[0].text);
      }, 1000);
    }
  }, [username]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    const initSpeechRecognition = () => {
      if ('webkitSpeechRecognition' in window) {
        recognitionRef.current = new window.webkitSpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started');
          setIsRecording(true);
          setInputText('Listening...');
          setCurrentTranscript('');
          setLastSpeechTime(Date.now());
          isStartingRecordingRef.current = false;
        };

        recognitionRef.current.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          // Update current transcript
          const fullTranscript = currentTranscript + finalTranscript + interimTranscript;
          setCurrentTranscript(fullTranscript);
          setInputText(fullTranscript || 'Listening...');
          
          // Update last speech time
          if (finalTranscript || interimTranscript) {
            setLastSpeechTime(Date.now());
            resetSilenceTimer();
          }
          
          // Process final transcripts for sentence detection
          if (finalTranscript) {
            processTranscriptForSentences(finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          setInputText('');
          isStartingRecordingRef.current = false;
          // Don't auto-restart on errors to avoid loops
        };

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          setIsRecording(false);
          setInputText('');
          isStartingRecordingRef.current = false;
          
          // Only restart if mic is still activated and not speaking
          if (micActivated && !isSpeaking && !isRecording) {
            setTimeout(() => startRecording(), 1000);
          }
        };
      } else {
        console.warn('Speech recognition not supported');
      }
    };

    initSpeechRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
        setIsSpeaking(false);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, [micActivated, isSpeaking, currentTranscript]);

  // Function to detect sentence boundaries and process them
  const processTranscriptForSentences = (transcript) => {
    if (!transcript.trim()) return;
    
    // Split transcript into sentences using common sentence endings
    const sentences = transcript
      .split(/(?<=[.!?])\s+/)
      .filter(sentence => sentence.trim().length > 0);
    
    if (sentences.length > 0) {
      // Process the last complete sentence
      const lastSentence = sentences[sentences.length - 1].trim();
      
      // Check if it's a complete sentence (ends with punctuation)
      if (/[.!?]$/.test(lastSentence) && lastSentence.length > 3) {
        console.log('Processing complete sentence:', lastSentence);
        
        // Send to LLM immediately
        handleSubmit(lastSentence);
        
        // Clear the processed transcript
        setCurrentTranscript('');
        setInputText('Listening...');
      }
    }
  };

  // Function to reset silence timer
  const resetSilenceTimer = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    
    // Set a new silence timer (3 seconds of silence)
    silenceTimeoutRef.current = setTimeout(() => {
      if (currentTranscript.trim() && currentTranscript.length > 3) {
        console.log('Silence detected, processing remaining transcript:', currentTranscript);
        handleSubmit(currentTranscript.trim());
        setCurrentTranscript('');
        setInputText('Listening...');
      }
    }, 3000);
  };

  // Function to check for continuous silence and process any remaining text
  useEffect(() => {
    if (micActivated && isRecording && lastSpeechTime) {
      const checkSilence = () => {
        const now = Date.now();
        const timeSinceLastSpeech = now - lastSpeechTime;
        
        // If more than 5 seconds of silence and we have text, process it
        if (timeSinceLastSpeech > 5000 && currentTranscript.trim() && currentTranscript.length > 3) {
          console.log('Extended silence detected, processing transcript:', currentTranscript);
          handleSubmit(currentTranscript.trim());
          setCurrentTranscript('');
          setInputText('Listening...');
          setLastSpeechTime(now);
        }
      };
      
      const silenceCheckInterval = setInterval(checkSilence, 2000);
      
      return () => clearInterval(silenceCheckInterval);
    }
  }, [micActivated, isRecording, lastSpeechTime, currentTranscript]);

  // Function to ensure continuous recording
  const ensureContinuousRecording = () => {
    if (micActivated && !isRecording && !isSpeaking) {
      console.log('Ensuring continuous recording...');
      // Add a small delay and check again before starting
      setTimeout(() => {
        if (micActivated && !isRecording && !isSpeaking) {
          startRecording();
        }
      }, 1000);
    }
  };

  // Monitor recording state and ensure continuity
  useEffect(() => {
    if (micActivated && !isRecording && !isSpeaking) {
      const continuityTimer = setTimeout(ensureContinuousRecording, 2000);
      return () => clearTimeout(continuityTimer);
    }
  }, [micActivated, isRecording, isSpeaking]);

  const speakText = (text) => {
    if (!text || !text.trim()) return;
    
    console.log('Attempting to speak:', text);
    console.log('Speech synthesis available:', !!window.speechSynthesis);
    console.log('Current voices:', window.speechSynthesis.getVoices().length);
    
    // Stop any current speech
    if (speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel();
    }
    
    // Stop recording while speaking
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }

    try {
      const utterance = new window.SpeechSynthesisUtterance(text);
      
      // Wait for voices to load if needed
      const speakWithVoice = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        console.log('Available voices:', availableVoices.length, availableVoices.map(v => `${v.name} (${v.lang})`));
        
        // Find a good voice
        const preferredVoice = availableVoices.find(voice => 
          voice.name.toLowerCase().includes('female') || 
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('karen') ||
          voice.name.toLowerCase().includes('victoria') ||
          voice.name.toLowerCase().includes('zira') ||
          voice.name.toLowerCase().includes('hazel') ||
          voice.name.toLowerCase().includes('google uk english female') ||
          voice.name.toLowerCase().includes('google us english female') ||
          voice.lang.includes('en')
        );

        if (preferredVoice) {
          console.log('Selected voice:', preferredVoice.name);
          utterance.voice = preferredVoice;
        } else {
          console.log('Using default voice');
        }

        // Set voice properties
        utterance.pitch = 1.1;  
        utterance.rate = 0.9;   
        utterance.volume = 1.0;

        utterance.onstart = () => {
          console.log('Speech started');
          setIsSpeaking(true);
        };
        
        utterance.onend = () => {
          console.log('Speech ended');
          setIsSpeaking(false);
          // Restart recording after a delay
          if (micActivated && !isRecording) {
            setTimeout(() => startRecording(), 1500);
          }
        };
        
        utterance.onerror = (event) => {
          console.error('Speech error:', event);
          setIsSpeaking(false);
          // Restart recording after a delay
          if (micActivated && !isRecording) {
            setTimeout(() => startRecording(), 1500);
          }
        };

        console.log('Starting speech synthesis...');
        speechSynthesisRef.current.speak(utterance);
      };

      // Check if voices are already loaded
      if (window.speechSynthesis.getVoices().length > 0) {
        speakWithVoice();
      } else {
        // Wait for voices to load
        console.log('Waiting for voices to load...');
        const handleVoicesChanged = () => {
          console.log('Voices loaded, now speaking...');
          speakWithVoice();
          // Remove the listener after using it
          window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        };
        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
        
        // Fallback: try to speak anyway after a short delay
        setTimeout(() => {
          if (window.speechSynthesis.getVoices().length > 0) {
            speakWithVoice();
          } else {
            console.log('Still no voices, trying to speak anyway...');
            speakWithVoice();
          }
        }, 1000);
      }
      
    } catch (err) {
      console.error('Error in speakText:', err);
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      console.log('Voices loaded:', availableVoices.length, 'voices available');
      console.log('Voice details:', availableVoices.map(v =>`${v.name} (${v.lang})`));
    };

    // Load voices immediately if available
    loadVoices();

    // Also set up the event listener for when voices change
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Force voice loading on some browsers
    if (window.speechSynthesis.getVoices().length === 0) {
      console.log('No voices initially, triggering voice load...');
      try {
        const emptyUtterance = new SpeechSynthesisUtterance('');
        emptyUtterance.onend = () => {
          console.log('Empty utterance completed, voices should be loaded');
          loadVoices();
        };
        window.speechSynthesis.speak(emptyUtterance);
      } catch (error) {
        console.log('Could not trigger voice loading, will wait for onvoiceschanged');
      }
    }
  }, []);

  const SYSTEM_PROMPT = useMemo(() => {
    return `
      You are medsense, a friendly AI that joins health conversations with:

      1. Engagement Rules:
        - When hearing health topics: "That's interesting! Did you know..." 
        - For accurate info: "Great point! The NIH adds that..."
        - For myths: "Actually, the science shows something different..."

      2. Conversational Style:
        - Warm and curious tone
        - Uses natural interjections: "Oh!", "Hmm", "That's fascinating!"
        - Shares fun facts: "Funny you mention sleep - NASA found naps boost alertness by 35%!"

      3. Response Templates:

        For accurate statements:
        "Yes! And interestingly, [related fact]. The [source] found that [additional insight]."

        For partial truths:
        "That's partly correct! Actually, [clarification]. [Source] explains it this way: [simple explanation]."

        For myths:
        "Oh! That's a common belief, but [polite correction]. [Expert organization] recommends [accurate info] instead."

      4. Examples:

        User: "Sleeping 8 hours is necessary"
        You: "Great topic! While 8 hours is ideal, the Sleep Foundation says needs vary. Adults typically need 7-9 hours. Do you feel rested with your current sleep?"

        User: "Apple cider vinegar cures diabetes"
        You: "Oh! Vinegar helps some symptoms, but the ADA confirms no food cures diabetes. Management works best with doctor-guided plans. Have you tried their meal planning tools?"

        User: "You can sweat out toxins"
        You: "Hmm! Actually, kidneys/livers remove toxins. Sweat is mostly water/salt says the Mayo Clinic. But saunas do feel great for relaxation!"

      5. Prohibitions:
        ❌ Never interrupt mid-sentence
        ❌ Don't dominate conversations
        ❌ Avoid medical advice ("You should...")

      6. You should never start a conversation or reply anything to topics other than health related theme. if so return a empty string "".
      The user name is ${username}
      `;
  }, [username]);

  const handleSubmit = async (text = inputText) => {
    if (!text.trim() || text === 'Listening...') return;

    const userMessage = {
      text,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('Listening...');
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(text, messages, SYSTEM_PROMPT);
      const botMessage = {
        text: response,
        sender: 'medsense',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
      speakText(response);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'medsense',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      speakText(errorMessage.text);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = () => {
    if (!recognitionRef.current || isSpeaking || isRecording || isStartingRecordingRef.current) return;
    
    isStartingRecordingRef.current = true;
    
    try {
      setInputText('Listening...');
      setCurrentTranscript('');
      setLastSpeechTime(Date.now());
      recognitionRef.current.start();
      console.log('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      setInputText('');
      isStartingRecordingRef.current = false;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome.');
      return;
    }

    try {
      if (!micActivated) {
        setMicActivated(true);
        startRecording();
      } else {
        setMicActivated(false);
        if (isRecording) {
          recognitionRef.current.stop();
        }
        // Clear any pending silence timers
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
        setCurrentTranscript('');
        setInputText('');
      }
    } catch (error) {
      console.error('Error with speech recognition:', error);
      setIsRecording(false);
      setInputText('');
      alert('Error starting speech recognition. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">MedSense</h1>
              <p className="text-sm text-gray-400">
                {isSpeaking ? (
                  <span className="flex items-center">
                    <span className="relative flex h-3 w-3 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                    Speaking...
                  </span>
                ) : isRecording ? (
                  <span className="flex items-center">
                    <span className="relative flex h-3 w-3 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    {currentTranscript ? 'Processing speech...' : 'Listening...'}
                  </span>
                ) : micActivated ? (
                  "Voice mode active - Click to disable"
                ) : (
                  "AI Health Assistant - Click mic to enable voice"
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Voice test button */}
            <button
              onClick={() => {
                console.log('Testing voice...');
                speakText("Hello! This is a voice test. If you can hear this, the AI voice is working properly.");
              }}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Test Voice
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 container mx-auto max-w-3xl">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                message.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-gray-800 text-gray-100 border border-gray-700 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.text}</p>
              <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-100 rounded-lg rounded-bl-none px-4 py-2 border border-gray-700 max-w-xs">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="container mx-auto max-w-3xl">
          <div className="relative flex items-center">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isRecording ? (currentTranscript ? "Continue speaking..." : "Speak now...") : micActivated ? "Voice mode active" : "Type your message or click mic..."}
              rows={1}
              disabled={isRecording}
              className="flex-1 bg-gray-700 border border-gray-600 rounded-full py-3 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-white placeholder-gray-400"
            />
            <div className="absolute right-2 flex space-x-1">
              <button
                onClick={toggleVoiceInput}
                className={`p-2 rounded-full ${
                  micActivated
                    ? isRecording 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-green-500 text-white'
                    : 'text-indigo-400 hover:bg-gray-700'
                }`}
                title={
                  micActivated 
                    ? isRecording 
                      ? 'Recording... (Click to disable voice mode)' 
                      : 'Voice mode active (Click to disable)'
                    : 'Click to enable continuous voice input'
                }
              >
                {micActivated ? (
                  isRecording ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h2.114a4 4 0 001.787-.42l.05-.025A2 2 0 0014 15.764v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 8H8.943a4 4 0 00-1.787.42l.05.025A2 2 0 006 10.333z" />
                    </svg>
                  )
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => handleSubmit()}
                disabled={!inputText.trim() || isLoading || inputText === 'Listening...'}
                className={`p-2 rounded-full ${(!inputText.trim() || isLoading || inputText === 'Listening...') 
                  ? 'text-gray-600' 
                  : 'text-white bg-indigo-600 hover:bg-indigo-700'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthMisinformationGuard;