let pageText = document.body.innerText;
let currentBanner = null;
let lastAnalysisResult = "Analyzing page content...";

// Wait for page to fully load before analyzing
setTimeout(() => {
  pageText = document.body.innerText;

  // Only analyze if page has health-related content and isn't too long
  if (shouldAnalyzePage(pageText)) {
    console.log("Page contains health-related content, sending for analysis...");

    // Limit text length to avoid API limits (first 5000 characters)
    const limitedText = pageText.substring(0, 5000);

    // Send the text to the background script
    chrome.runtime.sendMessage({ type: "pageText", data: limitedText });
  } else {
    console.log("Page doesn't contain significant health content or is too short, skipping analysis");
    hideBanner(); // Hide banner if no health content
  }
}, 2000); // Wait 2 seconds for page to load

function shouldAnalyzePage(text) {
  const healthKeywords = [
    'health', 'medical', 'cancer', 'disease', 'treatment', 'cure', 'therapy',
    'medicine', 'doctor', 'hospital', 'diagnosis', 'symptoms', 'vaccine',
    'drug', 'medication', 'illness', 'condition', 'remedy', 'healing',
    'nutrition', 'diet', 'supplement', 'wellness', 'fitness', 'exercise'
  ];

  const textLower = text.toLowerCase();
  const healthWordCount = healthKeywords.filter(keyword => textLower.includes(keyword)).length;

  // Analyze if page has health content and is substantial enough
  return text.length > 500 && text.length < 50000 && healthWordCount >= 2;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "geminiAnalysis") {
    console.log("Gemini Analysis Result:", message.result);
    lastAnalysisResult = message.result;

    // Parse the response to extract both false and legitimate info
    const falseInfo = extractFalseInfo(message.result);
    const legitInfo = extractLegitInfo(message.result);

    console.log("Extracted FALSE_INFO:", falseInfo);
    console.log("Extracted LEGIT_INFO:", legitInfo);

    // Highlight false information in red
    falseInfo.forEach((phrase, index) => {
      if (phrase !== "NONE") {
        console.log(`Highlighting FALSE phrase ${index + 1}:`, phrase);
        highlightSentence(phrase, "red");
      }
    });

    // Highlight legitimate information in green
    legitInfo.forEach((phrase, index) => {
      if (phrase !== "NONE") {
        console.log(`Highlighting LEGIT phrase ${index + 1}:`, phrase);
        highlightSentence(phrase, "green");
      }
    });

    // Update banner
    const bannerText = document.getElementById("banner-text");
      if (bannerText) {
        hideBanner();
      }

    // Hide banner after highlights are applied (small delay to ensure highlights are processed)
    setTimeout(() => {
      console.log("Hiding banner after analysis complete");
      hideBanner();
    }, 1000);
  } else if (message.type === "showBanner") {
    // Show banner when requested from popup
    showBanner();
    sendResponse({ success: true });
  } else if (message.type === "hideBanner") {
    // Hide banner when requested from popup
    hideBanner();
    sendResponse({ success: true });
  } else if (message.type === "getBannerStatus") {
    // Check if banner is currently visible
    sendResponse({
      isVisible: currentBanner && document.body.contains(currentBanner),
      lastResult: lastAnalysisResult
    });
  }
});

function extractFalseInfo(llmResponse) {
  const match = llmResponse.match(/FALSE_INFO:\s*(.+?)(?=LEGIT_INFO:|$)/s);
  if (match && match[1].trim() !== "NONE") {
    return match[1].split('|').map(phrase => phrase.trim());
  }
  return [];
}

function extractLegitInfo(llmResponse) {
  const match = llmResponse.match(/LEGIT_INFO:\s*(.+)/);
  if (match && match[1].trim() !== "NONE") {
    return match[1].split('|').map(phrase => phrase.trim());
  }
  return [];
}

function createBanner() {
  const banner = document.createElement("div");
  banner.id = "health-info-banner";
  banner.style.position = "fixed";
  banner.style.top = "0";
  banner.style.left = "0";
  banner.style.width = "100%";
  banner.style.padding = "12px 50px 12px 20px";
  banner.style.backgroundColor = "#fa234e";
  banner.style.color = "white";
  banner.style.fontSize = "16px";
  banner.style.fontWeight = "bold";
  banner.style.textAlign = "center";
  banner.style.zIndex = "999999";

  const bannerText = document.createElement("span");
  bannerText.id = "banner-text";
  bannerText.innerText = `MedSense - ${lastAnalysisResult}`;

  const closeButton = document.createElement("button");
  closeButton.innerHTML = "×";
  closeButton.style.position = "absolute";
  closeButton.style.right = "15px";
  closeButton.style.top = "50%";
  closeButton.style.transform = "translateY(-50%)";
  closeButton.style.background = "rgba(255,255,255,0.2)";
  closeButton.style.border = "none";
  closeButton.style.color = "white";
  closeButton.style.fontSize = "24px";
  closeButton.style.fontWeight = "bold";
  closeButton.style.cursor = "pointer";
  closeButton.style.borderRadius = "50%";
  closeButton.style.width = "30px";
  closeButton.style.height = "30px";
  closeButton.style.display = "flex";
  closeButton.style.alignItems = "center";
  closeButton.style.justifyContent = "center";
  closeButton.style.transition = "background-color 0.2s";

  closeButton.addEventListener("mouseenter", () => {
    closeButton.style.backgroundColor = "rgba(255,255,255,0.3)";
  });

  closeButton.addEventListener("mouseleave", () => {
    closeButton.style.backgroundColor = "rgba(255,255,255,0.2)";
  });

  closeButton.addEventListener("click", () => {
    hideBanner();
  });

  banner.appendChild(bannerText);
  banner.appendChild(closeButton);

  return banner;
}

function showBanner() {
  hideBanner();

  currentBanner = createBanner();
  document.body.appendChild(currentBanner);
}

function hideBanner() {
  if (currentBanner && document.body.contains(currentBanner)) {
    currentBanner.remove();
  }
  currentBanner = null;
}

// Show banner initially
showBanner();

function highlightSentence(phrase, type = "red") {
  console.log(`Starting to highlight phrase: "${phrase}" with type: ${type}`);

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  const textNodes = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  console.log(`Found ${textNodes.length} text nodes to search`);

  // Define colors based on type
  const colors = {
    red: {
      textDecorationColor: "#ff6b6b",
      color: "#d32f2f"
    },
    green: {
      textDecorationColor: "#4caf50",
      color: "#2e7d32"
    }
  };

  const colorConfig = colors[type] || colors.red;
  let matchCount = 0;

  textNodes.forEach((node, nodeIndex) => {
    const text = node.nodeValue;

    // More flexible matching - check if any significant words from the phrase are in the text
    const phraseWords = phrase.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    const textLower = text.toLowerCase();

    // Check if phrase is contained in text OR if most significant words match
    const directMatch = textLower.includes(phrase.toLowerCase());
    const wordMatch = phraseWords.length > 0 && phraseWords.filter(word => textLower.includes(word)).length >= Math.min(2, phraseWords.length);

    if (directMatch || wordMatch) {
      console.log(`Match found in node ${nodeIndex}: "${text.substring(0, 100)}..."`);
      matchCount++;

      // Split into sentences and highlight entire sentences containing the phrase
      const sentences = text.split(/(?<=[.!?])\s+/);
      const fragment = document.createDocumentFragment();

      sentences.forEach((sentence, index) => {
        const sentenceLower = sentence.toLowerCase();
        const sentenceMatch = sentenceLower.includes(phrase.toLowerCase()) ||
          (phraseWords.length > 0 && phraseWords.filter(word => sentenceLower.includes(word)).length >= Math.min(2, phraseWords.length));

        if (sentenceMatch) {
          console.log(`Highlighting sentence: "${sentence}"`);
          // Highlight the entire sentence with appropriate color
          const span = document.createElement("span");
          span.style.textDecoration = "underline";
          span.style.textDecorationColor = colorConfig.textDecorationColor;
          // span.style.backgroundColor = colorConfig.backgroundColor;
          // span.style.color = colorConfig.color;
          span.style.fontWeight = "bold";
          span.style.padding = "4px 8px";
          span.style.borderRadius = "4px";
          span.style.display = "inline";
          span.style.margin = "2px";
          span.style.boxShadow = "none";
          span.style.textShadow = "none";
          span.textContent = sentence;
          fragment.appendChild(span);
        } else {
          // Keep original text
          fragment.appendChild(document.createTextNode(sentence));
        }

        // Add space between sentences (except last one)
        if (index < sentences.length - 1 && sentence.trim()) {
          fragment.appendChild(document.createTextNode(" "));
        }
      });

      node.parentNode.replaceChild(fragment, node);
    }
  });

  console.log(`Highlighting complete for "${phrase}": ${matchCount} matches found`);
}

