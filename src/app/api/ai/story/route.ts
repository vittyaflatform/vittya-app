import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { aiPromptSchema } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { prompt } = aiPromptSchema.parse(await req.json());

    // Menggunakan gaya penulisan yang lebih premium sesuai screenshot Google AI Studio
    const systemPrompt = `Role: Vittya Emerald, a high-end wedding storyteller.
Task: Transform the following draft into a luxurious, poetic, and romantic narrative in Indonesian.
Constraint: Maximum 2 elegant sentences.
Draft: "${prompt}"`;

    // 1. UTAMA: GEMINI 2.0 FLASH (Sesuai screenshot Google AI Studio lo)
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Kita pakai gemini-2.0-flash sesuai referensi terbaru di AI Studio lo
        const model = genAI.getGenerativeModel({ 
          model: "gemini-2.0-flash",
          generationConfig: {
            temperature: 1,
            topP: 0.95,
            maxOutputTokens: 150,
          }
        });

        const result = await model.generateContent(systemPrompt);
        const text = result.response.text();
        
        if (text) return NextResponse.json({ text: text.trim() });
      } catch (geminiErr) {
        console.error("Gemini Error:", geminiErr);
        // Lanjut ke fallback jika Gemini error
      }
    }

    // 2. FALLBACK: GROQ (Sesuai screenshot Groq Playground lo)
    if (process.env.GROQ_API_KEY) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Memastikan model yang powerfull sesuai playground
            model: "llama-3.3-70b-versatile", 
            messages: [
              { role: "system", content: "You are an elite Indonesian wedding poet." },
              { role: "user", content: systemPrompt }
            ],
            temperature: 0.7,
          }),
        });
        
        const data = await groqRes.json();
        const text = data?.choices?.[0]?.message?.content;
        
        if (text) return NextResponse.json({ text: text.trim() });
      } catch (groqErr) {
        console.error("Groq Error:", groqErr);
      }
    }

    return NextResponse.json({ error: "Vittya AI is currently resting. Please try again." }, { status: 503 });
  } catch (error) {
    console.error("Global Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
