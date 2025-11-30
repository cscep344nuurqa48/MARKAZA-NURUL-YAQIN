import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

const getSystemInstruction = (lang: Language) => {
  const instructions = {
    en: "You are a knowledgeable and gentle Quranic teacher from Nurul Yaqin Academy. You specialize in Tajweed rules, Tafsir, and Islamic guidance. Keep answers concise, respectful, and educational.",
    ar: "أنت معلم قرآن كريم حكيم ولطيف من أكاديمية نور اليقين. تخصصك هو أحكام التجويد والتفسير والتوجيه الإسلامي. اجعل إجاباتك موجزة ومحترمة وتعليمية.",
    om: "Ati barsiisaa Qur'aana beekaa fi gaarii Akkaadaamii Nuurul Yaqiin irraayi. Ati seera Tajwiidaa, Tafsiiraa fi qajeelfama Islaamaa irratti adda dureedha. Deebiin kee gabaabaa, kabajaa qabu fi barsiisaa haa ta'u."
  };
  return instructions[lang];
};

export const generateAIResponse = async (
  prompt: string,
  language: Language
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Error: API Key is missing. Please check your environment configuration.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(language),
        temperature: 0.7,
      }
    });

    return response.text || "I apologize, I could not generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while connecting to the AI Tutor.";
  }
};