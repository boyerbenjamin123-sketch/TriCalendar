import { buildPushPayload } from '@block65/webcrypto-web-push';

const SITE = 'https://boyerbenjamin123-sketch.github.io';
const APP = SITE + '/TriCalendar/';
const DATA = APP + 'data/races.json';
const CIRCUITS = ['im', 'wtcs', 't100'];
const MAPS = {im: 'races', wtcs: 'wtcsRaces', t100: 't100Races'};
const CORS = {'Access-Control-Allow-Origin': SITE, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin'};

const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ø/gi, 'o').replace(/ł/gi, 'l').toLowerCase().trim();
const stripNat = s => s.replace(/\s*\([A-Z]{2,3}\).*/, '');
const parisHM = iso => new Intl.DateTimeFormat('fr-FR', {timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'}).format(new Date(iso)).replace(':', 'h');

async function sha256(s) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
}
async function loadRaces() {
  const r = await fetch(DATA + '?t=' + Date.now());
  if (!r.ok) throw new Error('data ' + r.status);
  return r.json();
}
function* races(d) { for (const c of CIRCUITS) for (const [id, r] of Object.entries(d[MAPS[c]] || {})) yield [c, id, r]; }
function names(r) {
  const s = new Set();
  [...(r.men || []), ...(r.women || [])].forEach(n => s.add(norm(stripNat(n))));
  const res = r.results || {};
  [...(res.men || []), ...(res.women || [])].forEach(a => s.add(norm(a.name)));
  return s;
}
function wants(rec, c, r) {
  if (!rec.circuits.includes(c)) return false;
  if (!rec.favsOnly) return true;
  const n = names(r); return rec.favs.some(f => n.has(f));
}
async function send(env, sub, msg) {
  try {
    const payload = await buildPushPayload({data: JSON.stringify(msg), options: {ttl: 3600}}, sub,
      {subject: env.VAPID_SUBJECT, publicKey: env.VAPID_PUBLIC_KEY, privateKey: env.VAPID_PRIVATE_KEY});
    const res = await fetch(sub.endpoint, payload);
    if (res.status === 404 || res.status === 410) return 'gone';
    return res.ok ? 'ok' : 'err';
  } catch (e) { return 'err'; }
}

async function subscribe(req, env) {
  const b = await req.json(), sub = b.subscription;
  if (!sub || typeof sub.endpoint !== 'string' || !sub.endpoint.startsWith('https://') || !sub.keys) return new Response('bad', {status: 400, headers: CORS});
  const rec = {
    sub,
    circuits: (b.circuits || []).filter(c => CIRCUITS.includes(c)),
    favsOnly: !!b.favsOnly,
    lead: [15, 30, 60, 120].includes(+b.lead) ? +b.lead : 60,
    favs: (b.favs || []).slice(0, 100).map(f => norm(String(f))),
    sent: []
  };
  const key = 'sub:' + await sha256(sub.endpoint);
  const old = JSON.parse((await env.SUBS.get(key)) || 'null');
  const sent = new Set(old ? old.sent : []);
  const d = await loadRaces();
  for (const [c, id, r] of races(d)) if (r.done && r.results) sent.add(`res:${c}:${id}`);   // pas de rattrapage des résultats passés
  rec.sent = [...sent];
  await env.SUBS.put(key, JSON.stringify(rec));
  if (b.welcome) await send(env, sub, {title: 'Alertes activées ✅', body: 'Tu recevras le rappel de départ et les résultats.', url: APP, tag: 'welcome'});
  return new Response('ok', {headers: CORS});
}

async function run(env) {
  const d = await loadRaces(), now = Date.now(), events = [];
  for (const [c, id, r] of races(d)) {
    if (r.postponed) continue;
    const at = r.startUTC ? Date.parse(r.startUTC) : NaN;
    if (!isNaN(at) && at > now) events.push({kind: 'start', key: `start:${c}:${id}`, c, r, at});
    if (r.done && r.results) events.push({kind: 'res', key: `res:${c}:${id}`, c, r});
  }
  let cursor;
  do {
    const list = await env.SUBS.list({prefix: 'sub:', cursor});
    for (const k of list.keys) {
      const rec = JSON.parse(await env.SUBS.get(k.name) || 'null'); if (!rec) continue;
      let changed = false;
      for (const e of events) {
        if (rec.sent.includes(e.key) || !wants(rec, e.c, e.r)) continue;
        if (e.kind === 'start' && e.at - now > rec.lead * 60000) continue;
        let msg;
        if (e.kind === 'start') {
          msg = {title: e.r.name, body: `Départ à ${parisHM(e.r.startUTC)} (heure française) · dans ${Math.max(1, Math.round((e.at - now) / 60000))} min`, url: APP, tag: e.key};
        } else {
          const res = e.r.results, w = [res.men && res.men[0], res.women && res.women[0]].filter(Boolean).map(a => '🥇 ' + a.name);
          msg = {title: 'Résultats · ' + e.r.name, body: w.join(' · ') || 'Les résultats sont disponibles.', url: APP, tag: e.key};
        }
        const st = await send(env, rec.sub, msg);
        if (st === 'gone') { await env.SUBS.delete(k.name); changed = false; break; }
        if (st === 'ok') { rec.sent.push(e.key); changed = true; }
      }
      if (changed) await env.SUBS.put(k.name, JSON.stringify(rec));
    }
    cursor = list.list_complete ? null : list.cursor;
  } while (cursor);
}

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, {status: 204, headers: CORS});
    if (req.method !== 'POST' || req.headers.get('Origin') !== SITE) return new Response('forbidden', {status: 403, headers: CORS});
    const path = new URL(req.url).pathname;
    if (path === '/subscribe') return subscribe(req, env);
    if (path === '/unsubscribe') {
      const b = await req.json().catch(() => ({}));
      if (b.endpoint) await env.SUBS.delete('sub:' + await sha256(b.endpoint));
      return new Response('ok', {headers: CORS});
    }
    return new Response('not found', {status: 404, headers: CORS});
  },
  async scheduled(event, env, ctx) { ctx.waitUntil(run(env)); }
};
