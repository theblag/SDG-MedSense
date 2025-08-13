import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { healthQuestions } from '../assets/healthQuestions';
import WavesHero from "@/components/nurui/waves-hero";
import { GlowCard } from '../components/nurui/spotlight-card';
import { ArrowRight, RotateCcw, CheckCircle, XCircle, Brain, Trophy, Target } from 'lucide-react';
import { GitHubStarsButton } from '@/components/animate-ui/buttons/github-stars';
import NavBar from '@/components/navbar';

const HealthQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const iconRef = useRef(null);

  const handleCardHover = () => {
    if (iconRef.current) {
      iconRef.current.playFromBeginning();
    }
  };

  const handleAnswer = (answer) => {
    const isCorrect = answer === healthQuestions[currentQuestion].answer;
    setSelectedAnswer(answer);
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setUserAnswers([...userAnswers, {
      question: healthQuestions[currentQuestion].question,
      userAnswer: answer,
      correctAnswer: healthQuestions[currentQuestion].answer,
      explanation: healthQuestions[currentQuestion].explanation
    }]);

    setTimeout(() => {
      if (currentQuestion < healthQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setQuizCompleted(true);
      }
    }, 3000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizCompleted(false);
    setUserAnswers([]);
    setSelectedAnswer(null);
  };

  // Fixed: Simply use the current question instead of the complex adaptive logic
  const currentQ = healthQuestions[currentQuestion];
  const progressPercentage = ((currentQuestion + 1) / healthQuestions.length) * 100;
  const scorePercentage = (score / healthQuestions.length) * 100;

  return (
    <div className='bg-black'>
            <div className="navbar fixed top-[1rem] left-1/2 -translate-x-1/2 z-50 ">
            <NavBar />
      </div>
      <div className='sec2bg'>
        <div className="w-[95vw] md:w-[90vw] mx-auto py-10 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Interactive{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400">
                Health Quiz
              </span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto px-4">
              Test your health knowledge and bust common myths with our AI-powered adaptive quiz
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto px-4 md:px-0">
            {!quizCompleted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <GlowCard
                  customSize
                  className="w-full py-8 md:py-12 px-6 md:px-10"
                  glowColor="blue"
                  onMouseEnter={handleCardHover}
                >
                  <div className="space-y-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Brain className="w-6 h-6 text-cyan-400" />
                        <span className="text-slate-300 text-sm md:text-base">
                          Question {currentQuestion + 1} of {healthQuestions.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-green-400" />
                        <span className="text-slate-300 text-sm md:text-base">
                          Score: {score}/{currentQuestion}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-cyan-400 to-violet-400 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>

                    <div className="text-center">
                      <lord-icon
                        ref={iconRef}
                        src="https://cdn.lordicon.com/qhgmphtg.json"
                        colors="primary:#ebe6ef,secondary:#3a3347,tertiary:#a66037,quaternary:#f9c9c0,quinary:#6366f1"
                        trigger="hover"
                        style={{
                          width: 'clamp(50px, 8vw, 70px)',
                          height: 'clamp(50px, 8vw, 70px)',
                          margin: "0 auto 20px"
                        }}
                      />
                    </div>

                    <div className="bg-slate-800/50 p-6 md:p-8 rounded-xl border border-slate-700">
                      <h2 className="text-lg md:text-xl font-semibold text-white mb-4 leading-relaxed">
                        {currentQ.question}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(true)}
                        disabled={selectedAnswer !== null}
                        className={`p-4 md:p-6 rounded-xl font-medium transition-all duration-300 border ${
                          selectedAnswer === true 
                            ? currentQ.answer === true 
                              ? 'bg-green-500/20 border-green-400 text-green-300' 
                              : 'bg-red-500/20 border-red-400 text-red-300'
                            : 'bg-slate-800/50 border-slate-600 hover:border-cyan-400 text-slate-200 hover:bg-slate-700/50'
                        } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {selectedAnswer === true && (
                            currentQ.answer === true ? (
                              <CheckCircle size={20} />
                            ) : (
                              <XCircle size={20} />
                            )
                          )}
                          <span className="text-base md:text-lg">True</span>
                        </div>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(false)}
                        disabled={selectedAnswer !== null}
                        className={`p-4 md:p-6 rounded-xl font-medium transition-all duration-300 border ${
                          selectedAnswer === false 
                            ? currentQ.answer === false 
                              ? 'bg-green-500/20 border-green-400 text-green-300' 
                              : 'bg-red-500/20 border-red-400 text-red-300'
                            : 'bg-slate-800/50 border-slate-600 hover:border-cyan-400 text-slate-200 hover:bg-slate-700/50'
                        } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {selectedAnswer === false && (
                            currentQ.answer === false ? (
                              <CheckCircle size={20} />
                            ) : (
                              <XCircle size={20} />
                            )
                          )}
                          <span className="text-base md:text-lg">False</span>
                        </div>
                      </motion.button>
                    </div>

                    {selectedAnswer !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-slate-800/70 p-6 rounded-xl border border-slate-600"
                      >
                        <div className="flex items-start gap-3">
                          <Brain className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-cyan-300 mb-2">Explanation:</p>
                            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                              {currentQ.explanation}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </GlowCard>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <GlowCard
                  customSize
                  className="w-full py-8 md:py-12 px-6 md:px-10"
                  glowColor="green"
                >
                  <div className="text-center space-y-8">
                    <div className="flex justify-center">
                      <Trophy className="w-16 h-16 md:w-20 md:h-20 text-yellow-400" />
                    </div>
                    
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Quiz Completed!
                      </h2>
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-3xl md:text-4xl font-bold text-cyan-400">
                            {score}/{healthQuestions.length}
                          </div>
                          <div className="text-sm text-slate-400">Final Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl md:text-4xl font-bold text-green-400">
                            {Math.round(scorePercentage)}%
                          </div>
                          <div className="text-sm text-slate-400">Accuracy</div>
                        </div>
                      </div>
                      
                      <p className="text-slate-300 mb-8">
                        {scorePercentage >= 80 ? "Excellent! You're a health myth buster!" :
                         scorePercentage >= 60 ? "Good job! Keep learning about health facts." :
                         "Keep practicing! Health knowledge is important."}
                      </p>
                    </div>

                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {userAnswers.map((item, index) => (
                        <div key={index} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 text-left">
                          <p className="text-sm md:text-base font-medium text-white mb-2">
                            {item.question}
                          </p>
                          <div className="flex items-center gap-2 mb-2">
                            {item.userAnswer === item.correctAnswer ? (
                              <CheckCircle size={16} className="text-green-400" />
                            ) : (
                              <XCircle size={16} className="text-red-400" />
                            )}
                            <span className={`text-sm ${
                              item.userAnswer === item.correctAnswer ? 'text-green-300' : 'text-red-300'
                            }`}>
                              Your answer: {item.userAnswer ? 'True' : 'False'} | 
                              Correct: {item.correctAnswer ? 'True' : 'False'}
                            </span>
                          </div>
                          <p className="text-xs md:text-sm text-slate-400">
                            {item.explanation}
                          </p>
                        </div>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetQuiz}
                      className="flex items-center gap-2 mx-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-violet-600 transition-all duration-200"
                    >
                      <RotateCcw size={18} />
                      Try Again
                    </motion.button>
                  </div>
                </GlowCard>
              </motion.div>
            )}
          </div>
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
  );
};

export default HealthQuiz;