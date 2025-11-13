const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export async function postFile(url, file, field = 'file') {
    const fd = new FormData();
    fd.append(field, file);
    const r = await fetch(`${base}${url}`, { method: 'POST', body: fd });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}

export async function postJson(url, data) {
    const r = await fetch(`${base}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}

export async function del(url) {
    const r = await fetch(`${base}${url}`, { method: 'DELETE' });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
}