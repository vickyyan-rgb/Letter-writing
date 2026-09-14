import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Server-side Gemini client helper
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Curated literary fallbacks in case API key is absent or network fails
const FALLBACK_LETTERS = [
  {
    title: "In the Quiet of the Evening",
    dateline: "At twilight, beneath the steady stars",
    salutation: "My beloved,",
    body: "I am writing this because in the quiet pauses of my day, my thoughts invariably wander toward you, like a river that knows only the sea. You have brought into my life a steady, radiant warmth—not the fleeting blaze of fireworks, but the enduring glow of an hearth that keeps out the coldest winter night.\n\nI treasure the little moments most: the sound of your laughter catching me off guard, the gentle reassurance of your hand in mine, and the silent understanding we share across a crowded room. Loving you is the easiest truth I have ever known. Every day with you feels like discovering a new room in a palace I already love.\n\nThank you for choosing me, for being my sanctuary and my greatest adventure.",
    signoff: "Forever and completely yours,",
    sender: "Yours always",
    museNote: "Crafted with timeless devotion and quiet intimacy.",
  },
  {
    title: "A Constellation of You",
    dateline: "Midnight, when the city falls asleep",
    salutation: "Dearest heart,",
    body: "If love were counted in heartbeats, mine would tell the story of every hour since we met. Before you, the world was vivid enough, but since you arrived, every color has deepened, every melody has found its resolve.\n\nI see our future not as a distant horizon, but as a path we are paving step by step, hand in hand. Through every storm and every sunlit morning, my promise to you remains unwavering: to listen, to cherish, and to love you more tomorrow than I do in this breath.",
    signoff: "With all the love my heart can carry,",
    sender: "Forever yours",
    museNote: "Penned with poetic yearning and sacred promise.",
  },
];

// 1. Generate Love Letter API
app.post("/api/generate-letter", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      recipient = "My Beloved",
      sender = "Yours",
      occasion = "Just because",
      tone = "passionate",
      format = "letter",
      length = "medium",
      keyMemories = "",
      specialQuirks = "",
      futurePromise = "",
      poeticElements = "",
    } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      // Graceful fallback response
      const fallback = FALLBACK_LETTERS[Math.floor(Math.random() * FALLBACK_LETTERS.length)];
      res.json({
        success: true,
        letter: {
          ...fallback,
          salutation: `My dearest ${recipient},`,
          sender: sender || fallback.sender,
          museNote: "Created from the Studio's classical romantic archive. (Add GEMINI_API_KEY to unlock personalized AI generation).",
        },
      });
      return;
    }

    const systemInstruction = `You are a master romantic epistolarian, literary poet, and love letter artisan in the tradition of John Keats, Elizabeth Barrett Browning, Rainer Maria Rilke, and Pablo Neruda.
Your purpose is to compose authentic, breathtaking, emotionally resonant love letters, vows, poems, or notes.
Avoid generic AI clichés (no "In a world of...", no corporate phrasing, no shallow compliments). Write with sensory depth, tenderness, emotional vulnerability, and lyrical cadence.

Output MUST be valid JSON with this exact schema:
{
  "title": "A short, poetic title for this piece",
  "dateline": "An evocative dateline (e.g. 'At twilight, by the window' or a timeless date)",
  "salutation": "The opening salutation addressing the recipient",
  "body": "The heartfelt text. For letters/vows, use well-crafted paragraphs separated by double newlines. For poems, preserve line breaks and stanzas with newlines.",
  "signoff": "The warm, intimate sign-off closing phrase",
  "sender": "The sender's name or moniker",
  "museNote": "A brief poetic sentence from the Muse about the emotion captured in this letter."
}`;

    const prompt = `Compose a ${tone} romantic ${format} (target length: ${length}) for ${recipient} from ${sender}.
Context & Occasion: ${occasion}
Special Memories or Moments to weave in: ${keyMemories || "The way your smile changes the room, the comfort of your presence"}
Adorable Quirks or Details: ${specialQuirks || "The little everyday gestures of kindness"}
Promise or Hope for the Future: ${futurePromise || "To stand beside you through every season"}
Stylistic preference: ${poeticElements || "Rich sensory imagery, genuine vulnerability, timeless romantic elegance"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response received from Gemini model");
    }

    const parsedData = JSON.parse(responseText);
    res.json({
      success: true,
      letter: parsedData,
    });
  } catch (error: any) {
    console.error("Error generating letter:", error);
    // Return friendly fallback rather than breaking
    const fallback = FALLBACK_LETTERS[0];
    res.json({
      success: true,
      letter: {
        ...fallback,
        museNote: "Composed with heartfelt classical devotion.",
      },
      warning: error?.message || "Used archival inspiration",
    });
  }
});

// 2. Polish / Transform Letter API
app.post("/api/polish-letter", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      currentText,
      polishAction, // 'deepen_emotion' | 'poetic_metaphor' | 'rhythmic_verse' | 'intimate_brevity' | 'classic_vintage' | 'playful_charm'
      customInstruction = "",
    } = req.body;

    if (!currentText || !currentText.trim()) {
      res.status(400).json({ error: "No text provided to polish" });
      return;
    }

    const ai = getGeminiClient();

    if (!ai) {
      res.json({
        success: true,
        polishedText: currentText.trim() + "\n\n(You are the quiet thought that warms every room I walk into.)",
        changesNote: "Refined with an intimate closing reflection.",
      });
      return;
    }

    const systemInstruction = `You are a delicate literary editor and romantic muse. Your job is to elevate the emotional resonance, imagery, and flow of a love letter or poem while keeping the writer's authentic voice intact.
Output valid JSON:
{
  "polishedText": "The refined and enhanced text",
  "changesNote": "A short note describing what was illuminated, deepened, or harmonized in the prose"
}`;

    let actionPrompt = "";
    switch (polishAction) {
      case "deepen_emotion":
        actionPrompt = "Deepen the emotional gravity and vulnerability. Make the feelings feel palpably genuine, tender, and profound.";
        break;
      case "poetic_metaphor":
        actionPrompt = "Infuse evocative, original metaphors from nature, starlight, seasons, or music without sounding overly ornate.";
        break;
      case "rhythmic_verse":
        actionPrompt = "Harmonize the rhythm, cadence, and musicality of the sentences so they flow like quiet poetry when read aloud.";
        break;
      case "intimate_brevity":
        actionPrompt = "Condense and distill into a concise, powerful love note or postcard while keeping maximum emotional punch.";
        break;
      case "classic_vintage":
        actionPrompt = "Give it the grace and lyrical elegance of 19th-century romantic correspondence (Keats, Austen, Byron).";
        break;
      case "playful_charm":
        actionPrompt = "Lighten the touch with delightful affection, sweet humor, and playful warmth without losing heartfelt sincerity.";
        break;
      default:
        actionPrompt = customInstruction || "Refine and elevate the expression of love.";
    }

    const prompt = `Current text:
"""
${currentText}
"""

Editing Directive:
${actionPrompt}
${customInstruction ? `Additional notes from the writer: ${customInstruction}` : ""}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text;
    if (!responseText) throw new Error("No response from model");

    const parsed = JSON.parse(responseText);
    res.json({
      success: true,
      polishedText: parsed.polishedText,
      changesNote: parsed.changesNote || "Refined for emotional warmth and elegance.",
    });
  } catch (error: any) {
    console.error("Error polishing letter:", error);
    res.status(500).json({ error: error.message || "Failed to polish letter" });
  }
});

// 3. Romantic Spark & Prompts API
app.post("/api/suggest-prompts", async (req: Request, res: Response): Promise<void> => {
  try {
    const { occasion = "anniversary", relationship = "partner" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      res.json({
        prompts: [
          "Describe the exact moment you knew you were falling in love.",
          "What is an unspoken habit of theirs that always makes you smile?",
          "If you could freeze one afternoon with them forever, which one would it be?",
          "What is a silent promise you make to them every single day?",
        ],
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Suggest 4 deeply evocative, non-cheesy writing sparks and memory prompts for someone writing a love letter to their ${relationship} for their ${occasion}. Return JSON array of strings: { "prompts": ["...", "...", "...", "..."] }`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ prompts: parsed.prompts || [] });
  } catch (err: any) {
    res.json({
      prompts: [
        "What is your favorite memory of laughing until your sides ached together?",
        "How has their presence softened or strengthened who you are?",
        "What is something small they do that feels like home to you?",
        "What do you hope your quiet mornings look like fifty years from now?",
      ],
    });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Beloved Love Letter Studio running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
