
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

export const isGeminiAvailable = (): boolean => {
  return !!apiKey;
};

const ai = isGeminiAvailable() ? new GoogleGenAI({ apiKey: apiKey! }) : null;

if (!ai) {
    console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

export const summarizeWithGemini = async (text: string): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini API is not available or configured.");
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