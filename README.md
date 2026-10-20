# TriCalendar PWA

Test local :
    node scripts/build-ics.mjs      # génère data/tricalendar.ics et met à jour updatedAt
    python3 -m http.server 8080     # puis http://localhost:8080

Mise en ligne : pousse sur la branche main d'un dépôt GitHub, puis Settings > Pages > Source : GitHub Actions.
Mise à jour des données après une course : modifie data/races.json (done: true + results), pousse, c'est tout.
