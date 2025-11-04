import React, { useState, useEffect } from "react";
import { getProviders, query } from "./api.js";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [providers, setProviders] = useState([]);
  const [selected, setSelected] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Voice input (Web Speech API)
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice input not supported in this browser.");
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setPrompt((p) => (p ? p + " " + text : text));
    };
    rec.start();
  };

  useEffect(() => {
    getProviders().then((res) => {
      setProviders(res.providers || []);
      setSelected(res.providers || []);
    }).catch(() => {
      setProviders(["mock"]);
      setSelected(["mock"]);
    });
  }, []);

  const runQuery = async () => {
    if (!prompt.trim()) return alert("Type a prompt first");
    setLoading(true);
    setResponses([]);
    try {
      const data = await query(prompt, selected);
      setResponses(data.results || []);
    } catch (e) {
      console.error(e);
      alert("Error fetching results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Hax AI</h1>
        <p>Compare top chatbots — OpenAI + Hugging Face + Mock</p>
      </header>

      <div className="inputBox">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask anything or tap mic 🎙️"
        />
        <div className="buttons">
          <button onClick={handleVoiceInput}>🎙️ Speak</button>
          <button onClick={runQuery} disabled={loading}>
            {loading ? "Thinking …" : "Run"}
          </button>
        </div>
      </div>

      <div className="providers">
        {providers.map((p) => (
          <label key={p}>
            <input
              type="checkbox"
              checked={selected.includes(p)}
              onChange={(e) =>
                setSelected((sel) =>
                  e.target.checked ? [...sel, p] : sel.filter((x) => x !== p)
                )
              }
            />
            {p}
          </label>
        ))}
      </div>

      <section className="responses">
        {responses.map((r) => (
          <div key={r.provider} className="responseCard">
            <h3>{r.provider.toUpperCase()} {r.ok ? "" : "⚠️"}</h3>
            {r.ok ? <pre>{r.text}</pre> : <p style={{color:'red'}}>{r.error}</p>}
            {r.latency_ms && <small>{r.latency_ms} ms</small>}
          </div>
        ))}
      </section>
    </div>
  );
}
