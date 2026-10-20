import fs from 'node:fs';

const PATH = 'data/races.json';
const data = JSON.parse(fs.readFileSync(PATH, 'utf8'));
data.updatedAt = new Date().toISOString();
fs.writeFileSync(PATH, JSON.stringify(data, null, 1) + '\n');

const stamp = ms => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const esc = s => String(s ?? '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const fold = line => { const out = []; while (line.length > 73) { out.push(line.slice(0, 73)); line = ' ' + line.slice(73); } out.push(line); return out.join('\r\n'); };
const parisHM = iso => new Intl.DateTimeFormat('fr-FR', {timeZone:'Europe/Paris', hour:'2-digit', minute:'2-digit', hourCycle:'h23'}).format(new Date(iso)).replace(':', 'h');
const hours = (c, r) => r.days > 1 ? (r.days - 1) * 24 + 8 : c === 'im' ? (r.badge === 'b703' ? 6 : 10) : c === 'wtcs' ? 2.5 : 4;

const groups = [['im', 'IRONMAN', data.races], ['wtcs', 'WTCS', data.wtcsRaces], ['t100', 'T100', data.t100Races]];
const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//TriCalendar//FR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  'X-WR-CALNAME:TriCalendar 2026', 'X-WR-TIMEZONE:Europe/Paris', 'REFRESH-INTERVAL;VALUE=DURATION:PT6H', 'X-PUBLISHED-TTL:PT6H'];

for (const [c, label, map] of groups) {
  for (const [id, r] of Object.entries(map || {})) {
    if (r.postponed || !r.startUTC) continue;
    const start = Date.parse(r.startUTC), end = start + hours(c, r) * 3600000;
    L.push('BEGIN:VEVENT',
      `UID:${c}-${id}-2026@tricalendar`,
      `DTSTAMP:${stamp(Date.parse(data.updatedAt))}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${esc(`${r.name} (${label})`)}`,
      `LOCATION:${esc(r.loc)}`,
      `DESCRIPTION:${esc(`Départ ${parisHM(r.startUTC)} (heure française) · ${label} 2026`)}`,
      'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', `DESCRIPTION:${esc('Départ dans 1 h : ' + r.name)}`, 'END:VALARM',
      'END:VEVENT');
  }
}
L.push('END:VCALENDAR');
fs.writeFileSync('data/tricalendar.ics', L.map(fold).join('\r\n') + '\r\n');
console.log('ICS généré :', L.filter(l => l === 'BEGIN:VEVENT').length, 'événements');
