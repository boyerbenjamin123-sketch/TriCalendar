// Usage : node scripts/import-results.mjs <races|wtcsRaces|t100Races> <id> <fichier.xlsx> [autre.xlsx] [--top=10]
import fs from 'node:fs';
import XLSX from 'xlsx';

const [, , mapKey, id, ...rest] = process.argv;
const top = +((rest.find(a => a.startsWith('--top=')) || '--top=10').split('=')[1]);
const files = rest.filter(a => !a.startsWith('--'));
if (!mapKey || !id || !files.length) {
  console.error('Usage : node scripts/import-results.mjs <races|wtcsRaces|t100Races> <id> <fichier.xlsx> [autre.xlsx] [--top=10]');
  process.exit(1);
}

const PATH = 'data/races.json';
const d = JSON.parse(fs.readFileSync(PATH, 'utf8'));
const race = d[mapKey] && d[mapKey][id];
if (!race) { console.error('Course introuvable :', mapKey, id); process.exit(1); }

const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ø/gi, 'o').replace(/ł/gi, 'l').toLowerCase().trim();
const clock = t => String(t || '').trim().replace(/^00:/, '').replace(/^0(\d:)/, '$1');   // 01:39:31 → 1:39:31 · 00:50:07 → 50:07

const oldNote = {}, oldName = {};
for (const g of ['men', 'women']) for (const a of (race.results && race.results[g]) || []) {
  oldName[norm(a.name)] = a.name; if (a.note) oldNote[norm(a.name)] = a.note;
}

const out = {};
for (const f of files) {
  const wb = XLSX.readFile(f);
  for (const sheet of wb.SheetNames) {
    const g = /women|femme/i.test(sheet + ' ' + f) ? 'women' : 'men';
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheet], {raw: false, defval: ''});
    out[g] = rows
      .filter(r => Number(r['Position']) > 0 && !r['Status'])
      .sort((a, b) => Number(a['Position']) - Number(b['Position']))
      .slice(0, top)
      .map(r => {
        const raw = (r['Athlete First Name'] + ' ' + r['Athlete Last Name']).trim(), k = norm(raw);
        const o = {pos: Number(r['Position']), name: oldName[k] || raw, nat: r['Country'], time: clock(r['Total Time'])};
        if (oldNote[k]) o.note = oldNote[k];
        return o;
      });
  }
}
race.done = true;
race.results = Object.assign({}, race.results, out);
fs.writeFileSync(PATH, JSON.stringify(d, null, 1) + '\n');
console.log(id, ':', Object.keys(out).map(g => g + ' ' + out[g].length).join(' · '));
