 // ← change this import
import { GitHubProvider } from "./github"
import { parseAIBlogToSanity } from "./blogParser"
import { writeClient } from "../write.client"

export async function createAIBlogPost(topic: string, categoryId?: string) {
  const provider = new GitHubProvider()

  const raw = await provider.generateBlog(topic)
  const { title, excerpt, metaDescription, content } = parseAIBlogToSanity(raw)

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80)

  const doc = await writeClient.create({       // ← use writeClient here
    _type: "post",
    title,
    excerpt,
    metaDescription,
    slug: { _type: "slug", current: slug },
    content,
    publishedAt: new Date().toISOString(),
    isDraftFromAI: true,
    ...(categoryId && {
      categories: [{ _type: "reference", _ref: categoryId }],
    }),
  })

  return doc
}