import axios from "axios";

export async function adapterHF(prompt) {
  const apiKey = process.env.HF_API_KEY;
  const model = process.env.HF_MODEL || "gpt2";

  if (!apiKey) throw new Error("Missing Hugging Face API key");

  const response = await axios.post(
    `https://api-inference.huggingface.co/models/${model}`,
    { inputs: prompt, parameters: { max_new_tokens: 256 } },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    }
  );

  const output = response.data;
  if (Array.isArray(output) && output[0]?.generated_text) {
    return output[0].generated_text;
  } else if (typeof output === "string") {
    return output;
  } else if (output?.generated_text) {
    return output.generated_text;
  } else {
    return JSON.stringify(output);
  }
}
