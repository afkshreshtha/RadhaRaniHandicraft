import OpenAI from "openai";
import { AIProvider } from "./index";

export class OpenAIProvider implements AIProvider {
  private client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async generateBlog(topic: string): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `
          Write a 1000-word SEO blog for Indian handicraft brand 
          Radha Rani Handicrafts about: ${topic}
          
          Include:
          - SEO title
          - Meta description
          - H2 headings
          - FAQ section
          - Spiritual tone
          `,
        },
      ],
    });

    return completion.choices[0].message.content || "";
  }
}