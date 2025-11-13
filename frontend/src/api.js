const API_BASE = import.meta.env.VITE_API_BASE + "/api";


export async function createCheckout(priceKey, token) {
  const res = await fetch(`${API_BASE}/subscription/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ priceKey }), // 👈 fixed
  });
  return res.json();
}

export async function getMySubscription(token) {
  const res = await fetch(`${API_BASE}/subscription/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function openPortal(token) {
  const res = await fetch(`${API_BASE}/subscription/portal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}
