const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

// Legacy Gemini client (kept for backward compatibility)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

export const sendMessageToGemini = async (
  userMessage,
  conversationHistory = [],
  systemPrompt = ''
) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  const contents = [];
  if (systemPrompt) {
    contents.push({ role: 'assistant', parts: [{ text: systemPrompt.trim() }] });
  }

  conversationHistory.forEach((msg) => {
    contents.push({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      parts: [{ text: msg.text }],
    });
  });

  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 1024 },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || 'Gemini API error');
  }

  const data = await response.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return raw.replace(/\*{2,}/g, '');
};

export const createSession = async (sessionId, description = '') => {
  const res = await fetch(`${API_BASE}/documents/session/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, description }),
  });
  if (!res.ok) throw new Error('Failed to create session');
  return res.json();
};

export const uploadAndEmbed = async (file, sessionId) => {
  const form = new FormData();
  form.append('file', file);
  if (sessionId) form.append('session_id', sessionId);

  const res = await fetch(`${API_BASE}/documents/upload-and-embed/`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || 'Upload failed');
  }
  return res.json();
};

export const askQuestion = async ({ question, documentId = null, sessionId = null, documentType = 'unknown' }) => {
  const res = await fetch(`${API_BASE}/documents/query/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
      document_id: documentId,
      session_id: sessionId,
      document_type: documentType,
    }),
  });
  if (!res.ok) throw new Error('Query failed');
  return res.json();
};