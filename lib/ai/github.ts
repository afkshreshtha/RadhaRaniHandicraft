import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import type { AIProvider } from "./index";

export class GitHubProvider implements AIProvider {
  private endpoint = "https://models.github.ai/inference";
  private model = "openai/gpt-4o-mini";

  async generateBlog(topic: string): Promise<string> {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("GITHUB_TOKEN not found");

    const client = ModelClient(this.endpoint, new AzureKeyCredential(token));

    const response = await client.path("/chat/completions").post({
      body: {
        model: this.model,
          max_tokens: 4000,
        messages: [
          {
            role: "system",
            content: `You are an expert SEO blog writer for Radha Rani Handicrafts, an Indian spiritual handicraft brand.
You MUST respond with ONLY valid JSON. No markdown, no explanation, no code blocks. Just raw JSON.`,
          },
        
          {
            role: "user",
            content: `Write a detailed blog post about: "${topic}"

Return this EXACT JSON structure:
{
  "title": "Main blog post title",
  "excerpt": "2-3 sentence summary for previews",
    "metaDescription": "150-160 character SEO meta description for this post",
  "blocks": [
    { "type": "h2", "text": "Section heading" },
    { "type": "paragraph", "text": "Body paragraph text here." },
    { "type": "h3", "text": "Sub-section heading" },
    { "type": "paragraph", "text": "More body text." },
    { "type": "numbered", "number": 1, "heading": "Point title", "text": "Description of this point." },
    { "type": "numbered", "number": 2, "heading": "Point title", "text": "Description." },
    { "type": "bullet_section", "heading": "Key Rituals", "items": [
      { "label": "Hanuman Chalisa", "text": "Description of this ritual." },
      { "label": "Tuesday Worship", "text": "Description." }
    ]},
    { "type": "faq", "items": [
      { "question": "Full question text here?", "answer": "Full answer text here." },
      { "question": "Another question?", "answer": "Another answer." }
    ]},
    { "type": "conclusion", "text": "Closing paragraph text." }
  ]
}
Content length rules (STRICTLY ENFORCED):
- Each paragraph block: minimum 80 words
- Each numbered block text: minimum 60 words  
- Conclusion block: minimum 100 words
- Total word count across ALL text fields: 1200 to 1800 words
- You MUST include: at least 6 paragraph blocks, 4 numbered blocks, 1 bullet_section, 7 FAQ items, 1 conclusion

Structure rules:
- Open with 2 paragraphs before the first h2
- Each h2 section must have at least 2 paragraphs or 1 paragraph + numbered blocks
- Do NOT combine or skip sections to save length
- Every numbered point must have a full explanation, not a one-liner

Rules:
- metaDescription must be 150-160 characters, plain text, no quotes
- Spiritual, devotional tone for Indian handicraft brand
- 800-1000 words across all blocks
- At least 4 paragraphs, 3 numbered points, 5 FAQ items
- No markdown formatting inside text values (no **, no #, no -)
- All text values must be plain strings

Internal links (IMPORTANT):
- When you naturally mention a product, deity idol, or category in a paragraph
  or numbered block, wrap it like this:
  [LINK text="Radha Krishna idol" href="#"]
- Use ONLY 2 to 4 links per post — only where it fits naturally
- Never force a link — only add where a reader would genuinely want to click
- href must always be "#" — the website owner will update the real URL later
- Only link inside "paragraph", "conclusion", and "numbered" block types
- Never add links inside faq answers or bullet items
- Examples of good link text: "Radha Krishna idol", "Hanuman Ji statue",
  "Laxmi Ji murti", "brass puja items", "marble deity idols"
  
  FINAL CHECK: Before returning JSON, verify total word count exceeds 1200 words.
If it does not, expand paragraphs and numbered blocks until it does.

  `,
          },
        ],
      },
    });

    if (isUnexpected(response)) throw response.body.error;

    return response.body.choices[0].message.content || "";
  }
}
