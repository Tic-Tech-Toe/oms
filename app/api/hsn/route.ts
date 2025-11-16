import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
const API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// JSON schema returned by Gemini
const responseSchema = {
  type: "OBJECT",
  properties: {
    items: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          hsn: { type: "STRING" },
          gst: { type: "NUMBER" },
          confidence: { type: "NUMBER" }
        },
        required: ["hsn", "gst"]
      }
    }
  },
  required: ["items"],
};

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY environment variable is not set." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { items } = body;

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid input. Provide an array of items." },
        { status: 400 }
      );
    }

    const schemaString = JSON.stringify(responseSchema, null, 2);

    // System prompt
    const systemPrompt = `
      You are an expert in India's GST rules and HSN classification.
      You must return HSN Code + applicable GST % for each item.

      Output MUST be a JSON object following this schema:
      ${schemaString}

      Rules:
      - "hsn" must be a valid Indian HSN code (4, 6, or 8 digits)
      - GST must be one of: 0, 5, 12, 18, 28
      - Confidence between 0 and 1
      - Do NOT include any text outside JSON
    `;

    const userPrompt = `
      Classify the following items and return HSN + GST:

      ${items
        .map(
          (i, idx) =>
            `${idx + 1}. Name: ${i.name}\nCategory: ${i.category}\nDescription: ${i.description}`
        )
        .join("\n\n")}
    `;

    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    const apiUrl = `${API_BASE_URL}/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    // Retry logic
    let lastError: string | null = null;
    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
      }

      try {
        const apiResponse = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!apiResponse.ok) {
          const errorDetail = await apiResponse.text();
          lastError = `Gemini API Error: ${apiResponse.status} ${errorDetail}`;
          continue;
        }

        const result = await apiResponse.json();
        const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!jsonText) {
          lastError = "Gemini returned no content.";
          continue;
        }

        try {
          let cleaned = jsonText
  .replace(/```json/i, "")
  .replace(/```/g, "")
  .trim();

const parsed = JSON.parse(cleaned);
          return NextResponse.json(parsed, { status: 200 });
        } catch (err) {
          lastError = `Invalid JSON returned: ${jsonText.substring(0, 80)}...`;
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    return NextResponse.json(
      {
        error: "Failed to generate HSN after multiple retries.",
        detail: lastError,
      },
      { status: 500 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server error.", detail: err.message },
      { status: 500 }
    );
  }
}
