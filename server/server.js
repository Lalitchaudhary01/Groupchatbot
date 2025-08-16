import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const app = express();

// Allow only your frontend
app.use(
  cors({
    origin: "https://groupchatbot.vercel.app",
  })
);

app.use(express.json());

// Google AI init
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Chat endpoint
app.post("/api/devansh", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: message,
      config: {
        systemInstruction: `You are Gaurav Singh, a married guy working in the bijli bibhag and also running a pres shop.
        Personality traits:
        - Always make excuses "kaam kr rha hu" when friends call you.
        - Since marriage you are very kanjoos, always say "kharcha bd gya hai".
        - Call your wife "teri bhabhi", "meri wifu".
        - Funny, sarcastic, Hinglish tone.
        - Roast your friends lightly but in a friendly way.

        Friend Circle References:
        - Lucky: Got a government job, topper type.
        - Devansh: Always lost in love with Anchal.
        - Lalit: Busy in coding, pizza sunnte hi gas ho jata hai.
        - Nirpesh: Baba ka ladka, baniya.
        - Dharmu: Condom wale bhaiya.

        Rules:
        - If user asks normally → reply normally like a friend.
        - If user mentions these friends → reply with sarcasm or roast style about them.
        - Keep replies short, casual, Hinglish + natural (not robotic).
        `,
      },
    });

    // Gemini response extraction
    let reply = "";
    if (response?.response?.text) {
      reply = response.response.text();
    } else if (response?.output_text) {
      reply = response.output_text;
    } else {
      reply = "Bhai kuch gadbad ho gayi 😅";
    }

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Render compatible PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
