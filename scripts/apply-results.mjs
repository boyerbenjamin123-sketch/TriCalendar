import fs from 'node:fs';
const PATH = 'data/races.json';
const d = JSON.parse(fs.readFileSync(PATH, 'utf8'));
const r = (pos, name, nat, time, note) => { const o = {pos, name, nat}; if (time) o.time = time; if (note) o.note = note; return o; };
const set = (map, id, f) => { if (!map[id]) return console.warn('Course absente :', id); Object.assign(map[id], f); };

// ── IRONMAN World Championship, Kona ──
set(d.races, 'kona', {done: true, results: {
  men: [
    r(1,'Vincent Luis','FRA','7:47:27','★ 1er Français sacré à Kona, dès ses débuts à Hawaï'),
    r(2,'Gustav Iden','NOR','7:49:02','Pénalité de 3 min sur le vélo · remporte la Pro Series'),
    r(3,'Matthew Marquardt','USA','7:49:58'),
    r(4,'Gregory Barnaby','ITA','7:51:01'),
    r(5,'Pierre Le Corre','FRA','7:53:28'),
    r(6,'Sam Long','USA','7:55:20'),
    r(7,'Jonas Schomburg','GER','7:56:41'),
    r(8,'Kristian Blummenfelt','NOR','7:58:06'),
    r(9,'Youri Keulen','NED','7:58:25'),
    r(10,'Menno Koolhaas','NED','7:58:54','Magnus Ditlev (DEN), en tête jusqu\'à 10 km de l\'arrivée, a abandonné · Laidlow et Lange aussi')
  ],
  women: [
    r(1,'Taylor Knibb','USA','8:36:29','★ Championne du monde, quelques semaines après son titre 70.3'),
    r(2,'Laura Philipp','GER','8:39:33','Meilleur marathon (2:50:42) · remporte la Pro Series'),
    r(3,'Julie Derron','SUI','8:46:24','Podium dès ses débuts à Kona malgré 3 min de pénalité'),
    r(4,'Kat Matthews','GBR','8:49:37'),
    r(5,'Imogen Simmonds','SUI','8:51:43'),
    r(6,'Lisa Perterer','AUT','8:52:53'),
    r(7,'Hannah Berry','NZL','8:59:40'),
    r(8,'Solveig Løvseth','NOR','9:02:08','Effondrée à environ 1 km de l\'arrivée alors qu\'elle menait'),
    r(9,'Anne-Sophie Pierre','FRA','9:03:48'),
    r(10,'Grace Thek','AUS','9:06:36')
  ]}});

// ── 70.3 World Championship, Nice ──
set(d.races, 'nice', {done: true, results: {
  men: [
    r(1,'Hayden Wilde','NZL','3:50:51','★ Champion du monde 70.3'),
    r(2,'Kristian Blummenfelt','NOR','3:51:09','Run en 1:05:12, record de l\'histoire du Mondial 70.3'),
    r(3,'Jelle Geens','BEL','3:52:40','Visait un 3e titre mondial consécutif'),
    r(4,'Gustav Iden','NOR','3:53:16','Meilleur temps vélo du jour'),
    r(5,'Lasse Nygaard Priester','GER','3:54:08')
  ],
  women: [
    r(1,'Taylor Knibb','USA','4:19:24','★ 4e titre mondial 70.3 · record du parcours battu de 3:40'),
    r(2,'Julie Derron','SUI','4:23:30'),
    r(3,'Alanis Siffert','SUI','4:25:10')
  ]}});

// ── 70.3 Zell am See-Kaprun ──
set(d.races, 'zell', {done: true, results: {
  men: [
    r(1,'Lasse Nygaard Priester','GER','3:43:29','★ Record du parcours · 1re victoire Pro Series'),
    r(2,'Jelle Geens','BEL'),
    r(3,'Tjebbe Kaindl','AUT',null,'Podium à domicile pour l\'Autriche')
  ],
  women: [
    r(1,'Laura Philipp','GER','4:13:22','★ 4e victoire à Zell am See, deux semaines après Kalmar')
  ]}});

// ── WTCS Weihai ──
set(d.wtcsRaces, 'weihai', {done: true, results: {
  men: [
    r(1,'Max Studer','SUI','1:41:08','★ 2e victoire consécutive à Weihai'),
    r(2,'David Cantero Del Campo','ESP','1:41:18'),
    r(3,'Tyler Mislawchuk','CAN','1:41:25','1er podium WTCS depuis 7 ans'),
    r(4,'João Nuno Batista','POR','1:41:41'),
    r(5,'Nicola Azzano','ITA','1:41:54'),
    r(7,'John Reed','USA','1:41:59'),
    r(10,'Matthew Hauser','AUS',null,'Champion du monde en titre, chute sur le vélo')
  ],
  women: [
    r(1,'Cassandre Beaugrand','FRA','1:49:20','★ 4e victoire en 4 départs · record perso sur 10 km (32:12)'),
    r(2,'Beth Potter','GBR','1:49:26'),
    r(3,'Lisa Tertsch','GER','1:49:44'),
    r(4,'Anqi Huang','CHN','1:50:33','Débuts WTCS à domicile'),
    r(5,'Gwen Jorgensen','USA','1:50:36')
  ]}});

// ── WTCS Karlovy Vary (podium + quelques places, temps non vérifiés) ──
set(d.wtcsRaces, 'karlovy', {done: true, results: {
  men: [
    r(1,'Dorian Coninx','FRA',null,'★ 2e victoire de la saison, devant un Yee revenu très fort'),
    r(2,'Alex Yee','GBR'),
    r(3,'Tjebbe Kaindl','AUT'),
    r(4,'Ricardo Batista','POR'),
    r(7,'Martin Sobey','CAN'),
    r(12,'Vasco Vilaça','POR')
  ],
  women: [
    r(1,'Georgia Taylor-Brown','GBR',null,'★ 1re victoire WTCS depuis plus de 3 ans'),
    r(2,'Taylor Spivey','USA','2:03:41'),
    r(3,'Lisa Tertsch','GER'),
    r(5,'Therese Feuersinger','AUT')
  ]}});

// ── WTCS Grand Final Pontevedra (top 10 complet, fichiers officiels) ──
set(d.wtcsRaces, 'ponte', {done: true, results: {
  men: [
    r(1,'Matthew Hauser','AUS','1:39:31','Victoire au sprint, même temps que Vilaça'),
    r(2,'Vasco Vilaça','POR','1:39:31','★ Champion du monde 2026'),
    r(3,'Alex Yee','GBR','1:39:35','Meilleur run du jour : 28:46'),
    r(4,'Ricardo Batista','POR','1:39:36'),
    r(5,'Hayden Wilde','NZL','1:40:26'),
    r(6,'Dorian Coninx','FRA','1:40:36'),
    r(7,'Dylan McCullough','NZL','1:40:38'),
    r(8,'Roberto Sanchez Mantecon','ESP','1:40:55'),
    r(9,'Connor Bentley','GBR','1:41:07'),
    r(10,'Yanis Seguin','FRA','1:41:08')
  ],
  women: [
    r(1,'Cassandre Beaugrand','FRA','1:50:52','★ 5 victoires en 5 courses · 2e titre mondial'),
    r(2,'Georgia Taylor-Brown','GBR','1:51:57'),
    r(3,'Kate Waugh','GBR','1:52:23'),
    r(4,'Beth Potter','GBR','1:52:55','Vice-championne du monde 2026'),
    r(5,'Laura Lindemann','GER','1:53:05'),
    r(6,'Kirsten Kasper','USA','1:53:10'),
    r(7,'Diana Isakova','AIN','1:53:21'),
    r(8,'Leonie Periault','FRA','1:53:47'),
    r(9,'Lisa Tertsch','GER','1:53:52'),
    r(10,'Tanja Neubert','GER','1:54:08','Márta Kropkó (HUN) disqualifiée')
  ]}});

// ── T100 French Riviera (hommes) ──
set(d.t100Races, 'riviera', {done: true, format: 'Hommes Pro', results: {
  men: [
    r(1,'Hayden Wilde','NZL','3:06:24','★ 2e victoire T100 2026 · 6 jours après son titre 70.3'),
    r(2,'Jelle Geens','BEL','3:06:43'),
    r(3,'Kyle Smith','NZL','3:06:48','Retour à la compétition après une blessure'),
    r(4,'Jake Birtwhistle','AUS','3:08:22'),
    r(5,'Lasse Nygaard Priester','GER','3:09:29'),
    r(6,'Sam Dickinson','GBR','3:10:05'),
    r(7,'Gregor Payet','LUX','3:10:14'),
    r(8,'Menno Koolhaas','NED','3:10:22'),
    r(9,'Antonio Benito López','ESP','3:10:36'),
    r(10,'Wilhelm Hirsch','GER','3:11:25')
  ]}});

// ── Corrections de calendrier ──
set(d.wtcsRaces, 'abu26', {isoDate: '20261113', postponed: false, date: '13-14 Novembre 2026',
  format: 'Sprint + Mixed Relay', loc: 'Hudayriyat Island, Abu Dhabi'});   // startUTC à ajouter quand l'horaire sera publié
set(d.t100Races, 'saudi', {isoDate: '20261127', date: '27 Novembre 2026', startUTC: '2026-11-27T05:00:00Z'});
set(d.t100Races, 'qatar', {date: '10-12 Décembre 2026'});

if (d.wtcsRaces.abu26) delete d.wtcsRaces.abu26.sub;   // l'ancien sous-titre « reportée » ne doit plus s'afficher
fs.writeFileSync(PATH, JSON.stringify(d, null, 1) + '\n');
console.log('races.json mis à jour');
