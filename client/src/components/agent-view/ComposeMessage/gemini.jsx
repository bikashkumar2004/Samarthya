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

export const generateEmailMessage = async (purpose, description, name = "Customer", language = "english") => {
  if (!apiKey) {
    throw new Error("API key is not configured. Check console for details.");
  }

  let prompt = "";

  if (language === "english") {
    prompt = `You are a professional business email writer. Based on this context, generate a professional business email.

CONTEXT: ${description}
PURPOSE: ${purpose}
RECIPIENT: ${name}

Generate an email with EXACTLY this structure:

Subject: [Create appropriate subject line based on purpose]

Dear ${name},

[Opening paragraph: Acknowledge the situation and thank them]

[Body paragraph: Provide relevant information or details]

[Action/Timeline paragraph: Mention timeframe (24-48 hours) or next steps]

[Closing: Encourage them to contact if needed]

Thank you for your patience and understanding.

Warm regards,
[Your Full Name]
Customer Support Team
[Company Name]
📧 support@[company].com | 🌐 [website URL]

STRICT REQUIREMENTS:
- Respond ONLY with the complete email text
- No additional commentary or explanations
- Keep professional tone
- Use provided placeholders
- Word count: 150-200 words`;
  } else if (language === "hindi") {
    prompt = `आप एक पेशेवर व्यावसायिक ईमेल लेखक हैं। इस संदर्भ के आधार पर एक पेशेवर व्यावसायिक ईमेल बनाएं।

CONTEXT: ${description}
PURPOSE: ${purpose}
RECIPIENT: ${name}

इस सटीक संरचना के साथ एक ईमेल बनाएं:

विषय: [उद्देश्य के आधार पर उपयुक्त विषय पंक्ति बनाएं]

प्रिय ${name},

[उद्घाटन पैराग्राफ: स्थिति को स्वीकार करें और धन्यवाद दें]

[मुख्य पैराग्राफ: प्रासंगिक जानकारी प्रदान करें]

[कार्रवाई/समयरेखा: समय सीमा (24-48 घंटे) या अगले कदम का उल्लेख करें]

[समापन: संपर्क करने के लिए प्रोत्साहित करें]

आपके धैर्य और समझ के लिए धन्यवाद।

कृपया,
[आपका पूरा नाम]
ग्राहक सहायता दल
[कंपनी का नाम]
📧 support@[company].com | 🌐 [website URL]

कड़ी आवश्यकताएं:
- केवल पूर्ण ईमेल पाठ के साथ प्रतिक्रिया दें
- कोई अतिरिक्त टिप्पणी नहीं
- पेशेवर टोन रखें
- केवल हिंदी में जवाब दें`;
  } else if (language === "odia") {
    prompt = `You are a professional business email writer. Based on this context, generate a professional business email in Odia language.

CONTEXT: ${description}
PURPOSE: ${purpose}
RECIPIENT: ${name}

Generate an email in Odia with this structure:

[Subject line in Odia]

[Opening in Odia]
[Body in Odia]
[Closing in Odia]

Keep it professional and under 200 words. Respond ONLY in Odia, nothing else.`;
  }

  try {
    console.log(`🚀 Generating Professional Email`);
    console.log(`   Purpose: ${purpose}`);
    console.log(`   Language: ${language}`);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let email = response.text().trim();

    // Clean up formatting
    email = email.replace(/\*\*/g, '').replace(/\*/g, '').trim();
    
    console.log("✅ Generated email");
    return email;
  } catch (error) {
    console.error("❌ Email Generation Error:", error);
    console.error("Error details:", error.message);
    throw error;
  }
};
