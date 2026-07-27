import { NextRequest, NextResponse } from "next/server";
import {
  PLANT_SYSTEM_PROMPT,
  FARMER_SYSTEM_PROMPT,
  buildPlantUserPrompt,
  buildFarmerUserPrompt,
} from "@/lib/prompts";

export const runtime = "nodejs";

function extractJson(text: string) {
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```$/, "");
  return JSON.parse(cleaned);
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing GROQ_API_KEY. Add it in your hosting provider's environment variables." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body || (body.mode !== "plant" && body.mode !== "farmer")) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

  try {
    let system: string;
    let userPrompt: string;

    if (body.mode === "plant") {
      const { region, soilHandful, soilDrainage, soilTexture, wateringMinutes } = body;
      if (!region || !soilHandful || !soilDrainage || !soilTexture || !wateringMinutes) {
        return NextResponse.json({ error: "Missing fields." }, { status: 400 });
      }
      system = PLANT_SYSTEM_PROMPT;
      userPrompt = buildPlantUserPrompt({ region, soilHandful, soilDrainage, soilTexture, wateringMinutes });
    } else {
      const { region, crop } = body;
      if (!region || !crop) {
        return NextResponse.json({ error: "Missing fields." }, { status: 400 });
      }
      system = FARMER_SYSTEM_PROMPT;
      userPrompt = buildFarmerUserPrompt({ region, crop });
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 1200,
        messages: [
          { role: "system", content: system },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text().catch(() => "");
      return NextResponse.json(
        { error: `Groq API error (${groqRes.status}): ${errText || "Something went wrong calling the AI model."}` },
        { status: 502 }
      );
    }

    const data = await groqRes.json();
    const text: string | undefined = data?.choices?.[0]?.message?.content;
    if (!text) {
      return NextResponse.json({ error: "No response from model." }, { status: 502 });
    }

    let parsed;
    try {
      parsed = extractJson(text);
    } catch {
      return NextResponse.json(
        { error: "Model returned an unexpected format. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ result: parsed });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Something went wrong calling the AI model." },
      { status: 500 }
    );
  }
}
