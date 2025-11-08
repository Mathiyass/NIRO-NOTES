
import { GoogleGenAI } from "@google/genai";

// Ensure you have your API key in an environment variable
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.warn("API_KEY environment variable not set. Gemini features will not work.");
}
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const summarizeWithGemini = async (text: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Summarize the following note in 2-3 concise bullet points:\n\n---\n\n${text}`,
    });
    
    return response.text.trim();

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get summary from Gemini API.");
  }
};
