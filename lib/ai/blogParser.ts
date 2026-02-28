interface FAQItem    { question: string; answer: string }
interface BulletItem { label?: string; text: string }

interface AIBlock {
  type: "h2" | "h3" | "paragraph" | "numbered" | "bullet_section" | "faq" | "conclusion"
  text?: string
  heading?: string
  number?: number
  items?: FAQItem[] | BulletItem[]
}

interface AIBlogJSON {
  title: string
  excerpt: string
  metaDescription: string
  blocks: AIBlock[]
}

// ── Sanity block builders ────────────────────────────────────────────────────
function makeBlock(
  text: string,
  style: string = "normal",
  extraMeta: Record<string, any> = {}
) {
  return {
    _type: "block",
    _key: crypto.randomUUID(),
    style,
    children: [{ _type: "span", _key: crypto.randomUUID(), text, marks: [] }],
    markDefs: [],
    ...extraMeta,
  }
}

function makeBoldSpan(text: string) {
  return { _type: "span", _key: crypto.randomUUID(), text, marks: ["strong"] }
}

function makeNormalSpan(text: string) {
  return { _type: "span", _key: crypto.randomUUID(), text, marks: [] }
}

// ── Link placeholder parser ──────────────────────────────────────────────────
// Parses [LINK text="Radha Krishna idol" href="#"] into Sanity link marks
// href="#" is a placeholder — you manually update the real URL in Sanity Studio
function makeBlockWithLinks(text: string, style: string = "normal") {
  const children: any[] = []
  const markDefs: any[] = []

  // Match [LINK text="..." href="..."]
  const regex = /\[LINK text="([^"]+)" href="([^"]+)"\]/g
  let last = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    // Plain text before this link
    if (match.index > last) {
      children.push({
        _type: "span",
        _key: crypto.randomUUID(),
        text: text.slice(last, match.index),
        marks: [],
      })
    }

    // Create a unique key for this link markDef
    const linkKey = crypto.randomUUID()

    // Register the link in markDefs
    markDefs.push({
      _type: "link",
      _key: linkKey,
      href: match[2], // "#" placeholder — update manually in Sanity Studio
    })

    // Linked span
    children.push({
      _type: "span",
      _key: crypto.randomUUID(),
      text: match[1],
      marks: [linkKey], // references the markDef above
    })

    last = match.index + match[0].length
  }

  // Remaining plain text after last link
  if (last < text.length) {
    children.push({
      _type: "span",
      _key: crypto.randomUUID(),
      text: text.slice(last),
      marks: [],
    })
  }

  // If no links were found at all, return a simple block (faster)
  if (markDefs.length === 0) {
    return makeBlock(text, style)
  }

  return {
    _type: "block",
    _key: crypto.randomUUID(),
    style,
    children,
    markDefs,
  }
}

// ── Main parser ──────────────────────────────────────────────────────────────
export function parseAIBlogToSanity(raw: string): {
  title: string
  excerpt: string
  metaDescription: string
  content: any[]
} {
  // Strip accidental markdown code fences if model wraps in ```json
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim()

  let parsed: AIBlogJSON
  try {
    parsed = JSON.parse(cleaned)
  } catch (e) {
       const lastBrace = cleaned.lastIndexOf("}")
    if (lastBrace !== -1) {
      try {
        parsed = JSON.parse(cleaned.slice(0, lastBrace + 1))
      } catch {
        throw new Error(`AI returned invalid JSON: ${(e as Error).message}\n\nRaw: ${raw.slice(0, 300)}`)
      }
    } else {
      throw new Error(`AI returned invalid JSON: ${(e as Error).message}\n\nRaw: ${raw.slice(0, 300)}`)
    }
  }

  const content: any[] = []

  for (const block of parsed.blocks) {
    switch (block.type) {

      case "h2":
        content.push(makeBlock(block.text!, "h2"))
        break

      case "h3":
        content.push(makeBlock(block.text!, "h3"))
        break

      case "paragraph":
      case "conclusion":
        // ← use makeBlockWithLinks here so [LINK ...] placeholders become
        //   real Sanity link marks you can edit in Studio
        content.push(makeBlockWithLinks(block.text!, "normal"))
        break

      case "numbered": {
        content.push(makeBlock(`${block.number}. ${block.heading}`, "h4"))
        if (block.text) content.push(makeBlockWithLinks(block.text, "normal"))
        break
      }

      case "bullet_section": {
        if (block.heading) {
          content.push(makeBlock(block.heading, "h3"))
        }
        const items = block.items as BulletItem[]
        for (const item of items) {
          content.push({
            _type: "block",
            _key: crypto.randomUUID(),
            style: "normal",
            listItem: "bullet",
            level: 1,
            children: item.label
              ? [makeBoldSpan(item.label + ": "), makeNormalSpan(item.text)]
              : [makeNormalSpan(item.text)],
            markDefs: [{ _type: "strong", _key: crypto.randomUUID() }],
          })
        }
        break
      }

      case "faq": {
        content.push(makeBlock("Frequently Asked Questions", "h2"))
        const items = block.items as FAQItem[]
        for (const item of items) {
          content.push(makeBlock(`Q: ${item.question}  A: ${item.answer}`, "normal"))
        }
        break
      }
    }
  }

  return {
    title: parsed.title,
    excerpt: parsed.excerpt,
    metaDescription: parsed.metaDescription || "",
    content,
  }
}