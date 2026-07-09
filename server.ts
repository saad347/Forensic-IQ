import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let _ai: GoogleGenAI | null = null;
function getGenAI() {
  if (!_ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    _ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return _ai;
}

// ----------------------------------------------------
// API ROUTES FIRST
// ----------------------------------------------------

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    aiEnabled: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

app.post("/api/hint", async (req, res) => {
  try {
    const { briefing, unlockedEvidence, hypotheses } = req.body;
    const ai = getGenAI();
    
    const prompt = `You are an expert engineering instructor guiding a student through a forensic failure case. 
Case Briefing:
${briefing}

Unlocked Evidence:
${unlockedEvidence.map((e: any) => `- ${e.name}: ${e.shortSummary}\n  Details: ${e.details}`).join('\n')}

Student's Logged Hypotheses:
${hypotheses.map((h: any) => `- ${h.text}`).join('\n')}

Provide a short, single-sentence Socratic hint to guide their reasoning. DO NOT reveal the correct cause directly or the exact taxonomy name. Act as a mentor gently nudging them in the right direction based on the evidence they have and their current hypotheses.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    res.json({ hint: response.text });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to generate hint" });
  }
});

app.post("/api/grade", async (req, res) => {
  try {
    const { suspectedCauseName, justification, unlockedEvidence, isCorrect } = req.body;
    const ai = getGenAI();
    
    const prompt = `You are a strict engineering grading assistant evaluating a forensic engineering student's justification for their diagnosis.
    
Diagnosis Chosen: ${suspectedCauseName} (Is this the historically correct cause? ${isCorrect ? 'Yes' : 'No'})
Student's Justification: "${justification}"
Unlocked Evidence:
${unlockedEvidence.map((e: any) => `- ${e.name}: ${e.shortSummary}\n  Details: ${e.details}`).join('\n')}

Evaluate whether the student's justification text actually logically connects the SPECIFIC unlocked evidence to their chosen cause. 
Respond with a JSON object containing:
- score: An integer from 0 to 100 representing the quality and logical soundness of their justification. If they just listed buzzwords without reasoning, score them low. If they didn't mention the unlocked evidence, penalize them.
- feedback: One single sentence of peer-review feedback based on their reasoning.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
          },
          required: ["score", "feedback"],
        }
      }
    });
    
    const result = JSON.parse(response.text || '{}');
    res.json(result);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Failed to grade justification" });
  }
});

// ----------------------------------------------------
// VITE MIDDLEWARE SETUP
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ForensiQ server running on http://localhost:${PORT}`);
  });
}

startServer();

