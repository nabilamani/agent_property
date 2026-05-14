"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generatePropertyDetails(rawText: string) {
  if (!process.env.GEMINI_API_KEY) {
    return { error: "GEMINI_API_KEY belum dikonfigurasi di file .env" };
  }

  try {
    const model = genAI.getGenerativeModel(
      { model: "gemini-2.5-flash" },
      { apiVersion: "v1" }
    );

    const prompt = `
      Anda adalah asisten agen properti profesional yang ahli dalam menganalisis data. 
      Tugas Anda adalah mengekstrak informasi spesifik dari teks mentah yang berantakan/tidak terstruktur dan mengubahnya menjadi format JSON yang rapi untuk database.

      TEKS MENTAH DARI USER:
      "${rawText}"

      ATURAN EKSTRAKSI:
      1. title: Buat judul properti yang menarik dan profesional (minimal 5 kata).
      2. price: Ekstrak angka harganya saja. Jika tertulis "1,5 Miliar" ubah jadi 1500000000. Jika tidak ada, isi 0.
      3. type: Pilih salah satu yang paling sesuai: "Rumah", "Tanah", "Kavling", "Cluster", atau "Apartemen".
      4. address: Ekstrak alamat selengkap mungkin.
      5. land_area: Angka luas tanah saja dalam m2. Jika tidak ada, isi 0.
      6. building_area: Angka luas bangunan saja dalam m2. Jika tanah kosong, isi 0.
      7. condition: Pilih salah satu: "Baru", "Bekas", atau "Indent". Default ke "Baru".
      8. description: Buat deskripsi yang rapi, persuasif, dan menggunakan poin-poin jika perlu agar menarik calon pembeli.

      HASIL HARUS DALAM FORMAT JSON BERIKUT:
      {
        "title": "...",
        "price": 0,
        "type": "...",
        "address": "...",
        "land_area": 0,
        "building_area": 0,
        "condition": "...",
        "description": "..."
      }

      PENTING: Hanya kembalikan JSON. Jangan ada teks penjelasan lain.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Find the first { and last } to extract JSON safely
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) {
      console.error("No JSON found in AI response:", text);
      return { error: "AI tidak memberikan format data yang benar. Silakan coba lagi." };
    }

    const jsonStr = text.substring(firstBrace, lastBrace + 1);
    
    try {
      const parsed = JSON.parse(jsonStr);
      return { data: parsed };
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);
      return { error: "AI memberikan format yang tidak valid. Silakan coba lagi dengan teks yang lebih jelas." };
    }
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return { error: error.message || "Terjadi kesalahan saat menghubungi layanan AI." };
  }
}
