import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { aiDraftSchema } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { draft } = aiDraftSchema.parse(await req.json());

    /**
     * PROMPT HAKIKI: 
     * Memaksa AI untuk HANYA memberikan output teks final tanpa basa-basi "Vittya Emerald" 
     * atau "Versi 1/2" seperti di screenshot sebelumnya.
     */
    const systemPrompt = `Kamu adalah seorang pujangga elit untuk brand undangan pernikahan mewah 'Vittya'.
Tugas: Ubah draf mentah menjadi satu kutipan (quote) pernikahan yang puitis, agung, dan bermakna spiritual dalam Bahasa Indonesia.

ATURAN KETAT:
1. JANGAN memberikan kata pengantar seperti "Tentu", "Sebagai Vittya Emerald", atau "Ini hasilnya".
2. JANGAN memberikan pilihan versi (Versi 1, Versi 2, dst). Cukup berikan SATU hasil terbaik.
3. JANGAN menggunakan tanda kutip ("") di awal dan akhir teks.
4. JANGAN memberikan penjelasan atau komentar apapun.
5. Gunakan diksi yang sangat elegan namun tetap mudah dipahami.

Draf Mentah: "${draft}"
Hasil Akhir:`;

    // 1. UTAMA: GEMINI 2.0 FLASH
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash",
          generationConfig: {
            temperature: 0.7, // Diturunkan dari 1 biar lebih stabil & gak ngelantur
            topP: 0.9,
            maxOutputTokens: 200,
          },
        });

        const result = await model.generateContent(systemPrompt);
        const text = result.response.text();

        // Cleaning teks dari karakter yang tidak diinginkan (seperti markdown bold atau kutip)
        const cleanedText = text.replace(/[*"']/g, "").trim();

        if (cleanedText) return NextResponse.json({ polishedText: cleanedText });
      } catch (geminiErr) {
        console.error("Gemini Error:", geminiErr);
      }
    }

    // 2. FALLBACK: GROQ (Jika Gemini limit atau down)
    if (process.env.GROQ_API_KEY) {
      try {
        const groqRes = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [
                {
                  role: "system",
                  content: "You are an elite wedding poet. Output ONLY the polished text without any introduction or numbering.",
                },
                { role: "user", content: systemPrompt },
              ],
              temperature: 0.6,
            }),
          },
        );

        const data = await groqRes.json();
        const text = data?.choices?.[0]?.message?.content;
        const cleanedText = text ? text.replace(/[*"']/g, "").trim() : "";

        if (cleanedText) return NextResponse.json({ polishedText: cleanedText });
      } catch (groqErr) {
        console.error("Groq Error:", groqErr);
      }
    }

    return NextResponse.json(
      { error: "Vittya AI is currently resting." },
      { status: 503 },
    );
  } catch (error) {
    console.error("Global Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
