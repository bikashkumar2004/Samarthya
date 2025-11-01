import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("All env variables:", import.meta.env);
console.log("API Key:", import.meta.env.VITE_GEMINI_API_KEY);

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ VITE_GEMINI_API_KEY is not defined in .env file");
} else {
  console.log("✅ API Key loaded successfully");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const generateMessage = async (purpose, name, language = "english", messageType = "sms") => {
  if (!apiKey) {
    throw new Error("API key is not configured. Check console for details.");
  }

  const charLimit = messageType === "sms" ? 150 : 200;

  let prompt = "";
  
  if (language === "english") {
    prompt = `Generate a professional ${messageType.toUpperCase()} message (max ${charLimit} characters) for "${purpose}" to ${name}. Be direct and concise. Only respond with the message text, nothing else.`;
  } else if (language === "hindi") {
    prompt = `Generate a professional ${messageType.toUpperCase()} message in Hindi (max ${charLimit} characters) for "${purpose}" to ${name}. Be direct and concise. Respond ONLY in Hindi with just the message text, nothing else.`;
  } else if (language === "odia") {
    prompt = `Generate a professional ${messageType.toUpperCase()} message in Odia (max ${charLimit} characters) for "${purpose}" to ${name}. Be direct and concise. Respond ONLY in Odia with just the message text, nothing else.`;
  }
  
  try {
    console.log(`🚀 Calling Gemini API`);
    console.log(`   Language: ${language}`);
    console.log(`   Type: ${messageType}`);
    console.log(`   Character limit: ${charLimit}`);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Remove any extra formatting or asterisks
    text = text.replace(/\*\*/g, '').replace(/\*/g, '').trim();
    
    // Remove SMS/Email labels if they appear
    text = text.replace(/\*SMS.*?\*\*:/g, '');
    text = text.replace(/\*Email.*?\*\*:/g, '');
    text = text.replace(/\(Odia.*?\):/g, '');
    text = text.replace(/\(Hindi.*?\):/g, '');
    text = text.replace(/\(English.*?\):/g, '').trim();
    
    // Trim to character limit
    if (text.length > charLimit) {
      text = text.substring(0, charLimit - 3) + "...";
    }
    
    console.log("✅ Generated text:", text);
    console.log("📊 Character count:", text.length);
    return text;
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    console.error("Error details:", error.message);
    throw error;
  }
};
