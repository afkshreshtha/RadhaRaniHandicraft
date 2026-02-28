// lib/ai/index.ts

export interface AIProvider {
  generateBlog(topic: string): Promise<string>;
}

export async function getAIProvider(): Promise<AIProvider> {
  const provider = process.env.AI_PROVIDER;

  if (provider === "openai") {
    const { OpenAIProvider } = await import("./openai");
    return new OpenAIProvider();
  }

  if (provider === "gemini") {
    const { GeminiProvider } = await import("./gemini");
    return new GeminiProvider();
  }

  if (provider === "github") {
    const { GitHubProvider } = await import("./github");
    return new GitHubProvider();
  }

  throw new Error("Invalid AI Provider");
}