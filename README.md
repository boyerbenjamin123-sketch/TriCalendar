# TriCalendar PWA

## Test local
    node scripts/build-ics.mjs      # génère data/tricalendar.ics et met à jour updatedAt
    python3 -m http.server 8080     # puis http://localhost:8080

## Mettre à jour les données
- À la main : modifie data/races.json (done: true + results), puis pousse sur main.
- Depuis des exports .xlsx de World Triathlon :
      npm install
      node scripts/import-results.mjs wtcsRaces ponte results_h.xlsx results_f.xlsx
- scripts/apply-results.mjs a déjà été exécuté une fois (inutile de le relancer).

## Alertes push (à faire une seule fois, depuis le dossier worker/)
1. npm install
2. npx web-push generate-vapid-keys   (clé publique + clé privée)
3. npx wrangler login
4. npx wrangler kv namespace create SUBS   → copier l'id dans worker/wrangler.toml
5. npx wrangler secret put VAPID_PRIVATE_KEY   → coller la clé privée (jamais dans le dépôt)
6. Dans worker/wrangler.toml : VAPID_SUBJECT (mailto:ton@email) et VAPID_PUBLIC_KEY
7. npx wrangler deploy   → noter l'adresse du Worker
8. Dans index.html : remplacer PUSH_URL (adresse du Worker) et VAPID_PUBLIC (clé publique)
9. Pousser sur main, puis sur l'iPhone : supprimer l'app de l'écran d'accueil et la rajouter depuis Safari.
