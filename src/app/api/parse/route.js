import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";


export async function POST(req) {
  try {
    // 1. Get file from FormData
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) throw new Error("No file uploaded");

    // 2. Convert file to Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // 3. Extract text using pdfjs-dist
    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
    let resumeText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      resumeText += content.items.map((item) => item.str).join(" ") + "\n";
    }

    // 4. Send resumeText to Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const prompt = `
      Extract ONLY JSON from this resume with keys:
      name, email, phone, skills, experience, projects.
      No markdown or extra text.

      Resume:
      ${resumeText}
    `;

    const result = await model.generateContent(prompt);
    let raw = result.response.text().trim();

    // 5. Clean AI output
    raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    const first = raw.indexOf("{");
    const last = raw.lastIndexOf("}");
    if (first === -1 || last === -1) throw new Error("Invalid JSON from AI");

    const cleanJson = raw.slice(first, last + 1);
    const parsed = JSON.parse(cleanJson);

    return new Response(JSON.stringify({ success: true, data: parsed }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
