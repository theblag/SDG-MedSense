import React, { useState } from "react";
import Tesseract from "tesseract.js";
import NavBar from "@/components/navbar";

export default function ReportAnalyzer() {
  const [text, setText] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [llmAnswer, setLlmAnswer] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setText("");
    setTableData([]);

    if (file.type.startsWith("image/")) {
      await recognizeImage(URL.createObjectURL(file));
    } else {
      alert("Please upload an image file.");
    }
  };


  // Gemini API call
  const callLLM = async (ocrText) => {
    setLlmAnswer("LLM is Thinking!");
    try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Simplify this medical report for a layperson: ${ocrText}`
          }]
        }]
      }),
    });
    const data = await response.json();
    console.log("LLM Response:", data);
    setLlmAnswer(data.candidates?.[0]?.content?.parts?.[0]?.text || "No answer from LLM.");
  } catch (err) {
    setLlmAnswer("Error contacting LLM: " + err.message);
  }
  };

  const recognizeImage = async (imageURL) => {
    setLoading(true);

    const img = new window.Image();
    img.src = imageURL;
    img.onload = async () => {
      // Use the whole image for OCR
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const { data: { text } } = await Tesseract.recognize(canvas, "eng", {
        preserve_interword_spaces: 1
      });

  const ocrResult = text.trim();
  setText(ocrResult);
  setLoading(false);
  // parseTable(ocrResult);
  await callLLM(ocrResult);
    };
  };

  const parseTable = (rawText) => {
    const lines = rawText.split(/\r?\n/).filter(line => line.trim().length > 0);
    const rows = lines.map(line => line.split(/\s{2,}|\t+/).map(cell => cell.trim()));
    const filteredRows = rows.filter(row => row.length > 1);
    setTableData(filteredRows);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div className="navbar fixed top-[1rem] left-1/2 -translate-x-1/2 z-50 ">
            <NavBar />
      </div>
      <h2>Report Analyzer</h2>
  <input type="file" accept="image/*" onChange={handleFile} />
      {loading && <p>Processing...</p>}
      
      {/* {tableData.length > 0 && (
        <div style={{ overflowX: "auto", marginTop: 20 }}>
          <h3>Extracted Table:</h3>
          <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", minWidth: 400 }}>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {text && (
        <div style={{ marginTop: 20 }}>
          <h3>Extracted Text:</h3>
          <pre>{text}</pre>
        </div>
      )} */}
      {llmAnswer && (
        <div style={{ marginTop: 20, background: '#f0f0f0', padding: 16, borderRadius: 8 }}>
          <h3>LLM Simplified Answer:</h3>
          <div>{llmAnswer}</div>
        </div>
      )}
    </div>
  );
}
