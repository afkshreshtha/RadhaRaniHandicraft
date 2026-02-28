import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIProvider } from "./index";

export class GeminiProvider implements AIProvider {
  private client = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY!
  );

  async generateBlog(topic: string): Promise<string> {
    const model = this.client.getGenerativeModel({
      model: "gemini-pro",
    });

    const result = await model.generateContent(`
      Write a 1000-word SEO blog for Radha Rani Handicrafts about ${topic}.
      Include headings, FAQ and meta description.
    `);

    return result.response.text();
  }
}