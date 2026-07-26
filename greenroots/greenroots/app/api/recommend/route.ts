import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing GEMINI_API_KEY. Add it in your hosting provider's environment variables." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body || (body.mode !== "plant" && body.mode !== "farmer")) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const client = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

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

    const response = await client.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction: system,
        responseMimeType: "application/json",
        maxOutputTokens: 1200,
      },
    });

    const text = response.text;
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
