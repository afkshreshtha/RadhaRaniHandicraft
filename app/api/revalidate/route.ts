// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'

const secret = process.env.SANITY_REVALIDATE_SECRET!

async function readBody(req: NextRequest): Promise<string> {
  const chunks: Uint8Array[] = []
  const reader = req.body?.getReader()
  if (!reader) throw new Error('No body')
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }
  const total = new Uint8Array(chunks.reduce((acc, c) => acc + c.length, 0))
  let offset = 0
  for (const chunk of chunks) { total.set(chunk, offset); offset += chunk.length }
  return new TextDecoder().decode(total)
}

export async function POST(req: NextRequest) {
  try {
    const body = await readBody(req)
    const signature = req.headers.get(SIGNATURE_HEADER_NAME) ?? ''
    const isValid = await isValidSignature(body, signature, secret)

    if (!isValid) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(body) as { _type: string; slug?: { current: string } }

    if (!payload._type) {
      return NextResponse.json({ message: 'Bad request' }, { status: 400 })
    }

    revalidateTag(payload._type, 'default')          // ← 'default' as second arg

    if (payload.slug?.current) {
      revalidateTag(`post-${payload.slug.current}`, 'default')
    }

    return NextResponse.json({ revalidated: true, type: payload._type })
  } catch (err: any) {
    console.error('Webhook error:', err)
    return new Response(err.message, { status: 500 })
  }
}