import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Brain, AlertCircle, CheckCircle, FileText, Pill, Activity } from "lucide-react";
import Tesseract from "tesseract.js";

// Mock GlowCard component matching the About page style
const GlowCard = ({ children, className, glowColor, customSize }) => (
  <div 
    className={`${className} bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/20 transition-all duration-300`}
    style={{
      boxShadow: `0 0 30px ${glowColor === 'blue' ? 'rgba(59, 130, 246, 0.3)' : 
                            glowColor === 'green' ? 'rgba(34, 197, 94, 0.3)' : 
                            glowColor === 'purple' ? 'rgba(147, 51, 234, 0.3)' : 
                            glowColor === 'red' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(6, 182, 212, 0.3)'}`
    }}
  >
    {children}
  </div>
);

export default function ReportAnalyzer() {
  const [text, setText] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [llmAnswer, setLlmAnswer] = useState("");
  const [diseaseData, setDiseaseData] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setText("");
    setTableData([]);
    setDiseaseData(null);

    if (file.type.startsWith("image/")) {
      await recognizeImage(URL.createObjectURL(file));
    } else {
      alert("Please upload an image file.");
    }
  };

  const callLLM = async (ocrText) => {
    setLlmAnswer("LLM is Thinking!");
    try {
      const prompt = `
      Analyze the following medical report text:

      "${ocrText}"

      Return JSON in this format ONLY:
      {
        "possible_diseases": [
          { "name": string, "probability": number (0-100), "critical": boolean }
        ],
        "explanation": string,
        "treatment_suggestions": string,
        "disclaimer": "This is not a medical diagnosis. Consult a qualified doctor."
      }
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${
          import.meta.env.VITE_GEMINI_API_KEY
        }`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );

      const data = await response.json();
      console.log("LLM Response:", data);

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setLlmAnswer(aiText);

      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          setDiseaseData(parsed);
        } catch (err) {
          console.error("JSON parse error:", err);
        }
      }
    } catch (err) {
      setLlmAnswer("Error contacting LLM: " + err.message);
    }
  };

  const recognizeImage = async (imageURL) => {
    setLoading(true);

    const img = new window.Image();
    img.src = imageURL;
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const { data: { text } } = await Tesseract.recognize(canvas, "eng", {
        preserve_interword_spaces: 1,
      });

      const ocrResult = text.trim();
      setText(ocrResult);
      setLoading(false);
      await callLLM(ocrResult);
    };
  };

  const parseTable = (rawText) => {
    const lines = rawText.split(/\r?\n/).filter((line) => line.trim().length > 0);
    const rows = lines.map((line) =>
      line.split(/\s{2,}|\t+/).map((cell) => cell.trim())
    );
    const filteredRows = rows.filter((row) => row.length > 1);
    setTableData(filteredRows);
  };

  return (
    <div className="bg-black min-h-screen overflow-x-hidden">
      <div className="sec2bg">
        <div className="w-[100vw] mx-auto py-20">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Report{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400">
                Analyzer
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
              Upload your medical reports and get AI-powered analysis with easy-to-understand explanations
            </p>
          </motion.div>

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <GlowCard glowColor="blue" className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Upload Medical Report</h3>
                <p className="text-slate-400 text-sm">Select an image file of your medical report for AI analysis</p>
              </div>
              
              <label className="relative cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 inline-block"
                >
                  Choose File
                </motion.div>
              </label>
            </GlowCard>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <GlowCard glowColor="purple" className="p-8 text-center">
                <div className="flex items-center justify-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                  <span className="text-white text-lg">Processing your report...</span>
                </div>
              </GlowCard>
            </motion.div>
          )}

          {/* LLM Answer (while processing) */}
          {llmAnswer && !diseaseData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto mb-12"
            >
              <GlowCard glowColor="cyan" className="p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-500/20 rounded-lg">
                    <Brain className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">AI Analysis in Progress</h3>
                    <div className="text-slate-300 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      {llmAnswer}
                    </div>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          )}

          {/* Disease Analysis Results */}
          {diseaseData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-6xl mx-auto"
            >
              {/* Detected Conditions */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white text-center mb-8">
                  Detected Conditions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {diseaseData.possible_diseases.map((disease, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                    >
                      <GlowCard 
                        glowColor={disease.critical ? "red" : disease.probability > 70 ? "red" : disease.probability > 40 ? "purple" : "green"} 
                        className="p-6 h-full"
                      >
                        <div className="text-center">
                          <div className="mb-4">
                            <div 
                              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                                disease.critical ? 'bg-red-500/20' : 'bg-blue-500/20'
                              }`}
                            >
                              {disease.critical ? (
                                <AlertCircle className="w-6 h-6 text-red-400" />
                              ) : (
                                <Activity className="w-6 h-6 text-blue-400" />
                              )}
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-2">{disease.name}</h4>
                          </div>
                          
                          <div className="mb-4">
                            <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-red-500 h-4 rounded-full transition-all duration-300" 
                                style={{ width: `${disease.probability}%` }}
                              ></div>
                            </div>
                            <div className="text-center text-white font-semibold">
                              {disease.probability}%
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-center gap-2 text-sm">
                            {disease.critical ? (
                              <span className="flex items-center gap-1 text-red-400 font-medium">
                                <AlertCircle size={16} />
                                Critical
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-green-400 font-medium">
                                <CheckCircle size={16} />
                                Non-Critical
                              </span>
                            )}
                          </div>
                        </div>
                      </GlowCard>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Explanation Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-8"
              >
                <GlowCard glowColor="blue" className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-4">Detailed Explanation</h3>
                      <p className="text-slate-300 leading-relaxed bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                        {diseaseData.explanation}
                      </p>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>

              {/* Treatment Suggestions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-8"
              >
                <GlowCard glowColor="green" className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <Pill className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-4">Treatment Suggestions</h3>
                      <p className="text-slate-300 leading-relaxed bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                        {diseaseData.treatment_suggestions}
                      </p>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-center"
              >
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 max-w-4xl mx-auto">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">Important Disclaimer</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {diseaseData.disclaimer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}