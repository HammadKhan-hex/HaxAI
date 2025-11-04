import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { adapterOpenAI } from "./adapters/openai.js";
import { adapterHF } from "./adapters/hf_inference.js";
import { adapterMock } from "./adapters/mock.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const PROVIDERS = {
  openai: adapterOpenAI,
  hf: adapterHF,
  mock: adapterMock
};

app.get("/api/providers", (req, res) => {
  res.json({ providers: Object.keys(PROVIDERS) });
});

app.post("/api/query", async (req, res) => {
  try {
    const { prompt, providers } = req.body;

    if (!prompt || !providers || !Array.isArray(providers)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const results = {};
    for (const provider of providers) {
      const adapter = PROVIDERS[provider];
      if (adapter) {
        try {
          results[provider] = await adapter(prompt);
        } catch (err) {
          results[provider] = { error: err.message };
        }
      } else {
        results[provider] = { error: "Unknown provider" };
      }
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Hax AI Server running on port ${PORT}`);
});
