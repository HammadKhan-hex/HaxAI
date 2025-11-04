const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const prefix = BASE || '';

export async function getProviders(){
  const r = await fetch(`${prefix}/api/providers`);
  return r.json();
}

export async function query(prompt, providers){
  const r = await fetch(`${prefix}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, providers })
  });
  return r.json();
}
