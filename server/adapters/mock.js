export async function adapterMock(prompt) {
  const text = `MOCK ANSWER:
Prompt length: ${prompt.length} chars
First sentence: ${(prompt.split(/[\\.?\\!]/)[0]||"").slice(0,120)}...`;
  const tokens = Math.min(200, Math.ceil(prompt.length / 4));
  return { text, tokens, meta: { provider: "mock" } };
}
