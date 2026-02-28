// app/api/generate-blog/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createAIBlogPost } from "@/lib/ai/createPost"

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json()
    if (!topic?.trim()) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    let doc
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        doc = await createAIBlogPost(topic)
        break // success — exit loop
      } catch (e: any) {
        console.warn(`Blog generation attempt ${attempt} failed:`, e.message)
        if (attempt === 3) throw e // all retries exhausted — let outer catch handle it
      }
    }

    return NextResponse.json({
      title: doc.title,
      slug: doc.slug.current,
    })
  } catch (e: any) {
    console.error("Blog generation failed:", e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}