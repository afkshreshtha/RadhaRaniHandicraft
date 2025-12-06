import { client } from "@/sanity/lib/client";

export async function POST(request: Request) {
  try {
    const { name, materialRef, paintingStyle, dimensions } =
      await request.json();

    // Resolve material reference
    let materialName = "";
    if (materialRef) {
      const materialDoc = await client.fetch(`*[_id == $id][0]`, {
        id: materialRef,
      });
      materialName = materialDoc?.title || "";
    }

    // Parse dimensions
    const parsedDimensions = {
      length: {
        value: dimensions?.length?.value || null,
        unitRef: dimensions?.length?.unitRef || null,
      },
      width: {
        value: dimensions?.width?.value || null,
        unitRef: dimensions?.width?.unitRef || null,
      },
      height: {
        value: dimensions?.height?.value || null,
        unitRef: dimensions?.height?.unitRef || null,
      },
    };

    // Resolve unit names
    async function resolveUnit(ref: string | null): Promise<string> {
      if (!ref) return "";
      try {
        const doc = await client.fetch(
          `*[_type == "measurement" && _id == $id][0]`,
          { id: ref }
        );
        return doc?.symbol || doc?.title || "";
      } catch (error) {
        console.error(`Error resolving unit ${ref}:`, error);
        return "";
      }
    }

    const lengthUnit = await resolveUnit(parsedDimensions.length.unitRef);
    const widthUnit = await resolveUnit(parsedDimensions.width.unitRef);
    const heightUnit = await resolveUnit(parsedDimensions.height.unitRef);

    // Prompt for AI
    const prompt = `
Write a premium product description for an e-commerce website selling handcrafted marble idols.

Product Details:
• Name: ${name}
• Material: ${materialName || "Marble"}
• Painting Style: ${paintingStyle || "Traditional Hand Painting"}
- Height: ${parsedDimensions.height.value} ${heightUnit} 
- Width: ${parsedDimensions.width.value} ${widthUnit} 
- Length: ${parsedDimensions.length.value} ${lengthUnit}

Tone Requirements:
- Devotional, respectful, premium, traditional Indian tone
- Highlight craftsmanship, spirituality, and suitability for home temple décor
- Avoid emojis
- Max 100 words

Output Format:
1 paragraph + 3 short bullet highlights
    `;

    // Call Perplexity API
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          {
            role: "system",
            content:
              "You are a devotional, premium product copywriter for a marble idol store.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 250,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(
        JSON.stringify({
          error: "Error from Perplexity API",
          details: errorData,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    return new Response(JSON.stringify({ description: content }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
