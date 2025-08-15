chrome.runtime.onInstalled.addListener(() => {
  console.log("Health Info Text Reader extension installed");
});

const GEMINI_API_KEY = 'YOUR_API_KEY'; //ADD YOUR API KEY HERe
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 3000; 

async function analyzeTextWithGemini(text) {
  try {
    // Rate limiting - wait if necessary
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      console.log(`Rate limiting: waiting ${waitTime}ms before next request`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    lastRequestTime = Date.now();
    
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a medical fact-checker. Analyze this web page text for health-related information. Identify specific FALSE health claims and LEGITIMATE health information.

IMPORTANT: Only extract actual phrases/sentences from the text that contain health claims. Don't paraphrase.

Return your response in this exact format:

ANALYSIS: [Brief summary of health content found]
FALSE_INFO: exact phrase 1|exact phrase 2|exact phrase 3
LEGIT_INFO: exact phrase 1|exact phrase 2|exact phrase 3

Rules:
- Extract EXACT phrases from the text, not summaries
- FALSE_INFO: Dangerous misinformation, unproven cures, conspiracy theories
- LEGIT_INFO: Evidence-based medical advice, established treatments, proven facts
- Use NONE if no false/legitimate information found
- Focus on actionable health claims, not general statements

Text to analyze: ${text}`
          }]
        }]
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(`Rate limit exceeded. Please wait a few minutes before trying again. Status: ${response.status}`);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    if (error.message.includes('429')) {
      return `Rate limit exceeded. The extension will try again in a few minutes. Please avoid refreshing the page frequently.`;
    }
    
    return `Error analyzing text: ${error.message}`;
  }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message && message.type === "pageText") {
    console.log("Received text from content script:", message.data);

    // Send text to Gemini for analysis
    console.log("Sending text to Gemini for analysis...");
    const analysis = await analyzeTextWithGemini(message.data);
    console.log("Gemini Analysis Result:", analysis);

    // Send result back to content script
    chrome.tabs.sendMessage(sender.tab.id, {
      type: "geminiAnalysis",
      result: analysis
    });
  } else {
    console.log("Received unknown message:", message);
  }
});
