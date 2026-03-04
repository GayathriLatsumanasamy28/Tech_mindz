import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const profile = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // IF KEY EXISTS, TRY THE AI
    if (apiKey && apiKey !== "your_actual_api_key_here") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Create a 7-day plan for ${profile.role} with skills ${profile.skills}. Return ONLY raw JSON: {"tasks": [{"id":1,"day":"Day 1","text":"...","link":"...","yt":"..."}], "questions": ["..."], "recommendation": {"company":"...","project":"..."}}`;
        
        const result = await model.generateContent(prompt);
        let text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        return NextResponse.json(JSON.parse(text));
      } catch (aiErr) {
        console.error("AI Failed, falling back to Simulation");
      }
    }

    // FALLBACK: SMART SIMULATION (Guarantees the demo works even without a key)
    const isData = profile.skills.toLowerCase().includes('data') || profile.skills.toLowerCase().includes('python');
    
    const fallbackData = {
      tasks: Array.from({ length: 7 }, (_, i) => ({
        id: i + 1,
        day: `Day ${i + 1}`,
        text: isData ? `Analyze dataset using ${profile.skills}` : `Build a ${profile.role} module using ${profile.skills}`,
        link: "https://google.com",
        yt: `https://www.youtube.com/results?search_query=${profile.skills}+tutorial`
      })),
      questions: ["Explain your recent project.", "How do you handle technical debt?", "What is your favorite feature of this tech stack?"],
      recommendation: { 
        company: isData ? "Mu Sigma" : "Accenture", 
        project: `Real-time ${profile.role} Dashboard` 
      }
    };

    return NextResponse.json(fallbackData);
  } catch (err) {
    return NextResponse.json({ error: "Critical failure" }, { status: 500 });
  }
}