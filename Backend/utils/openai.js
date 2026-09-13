import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const getOpenAIAPIResponse = async (chatHistory) => {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: chatHistory.map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        })),
      });

      return response.text;
    } catch (err) {
      console.error(`Gemini Error - Attempt ${attempt}:`, err);

      if (attempt === maxRetries) {
        throw err;
      }

      const delay =
        Math.pow(2, attempt) * 1000 + Math.random() * 1000;

      console.log(`Retrying in ${Math.round(delay)}ms...`);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export default getOpenAIAPIResponse;