import OpenAI from "openai";

export const aiClient = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPEN_AI_API_KEY
});

export const MODEL = "gpt-4.1-mini";