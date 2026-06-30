# Cowboy Bebop · Sessions in Jazz

A static, single-page tribute to the music hidden inside **Cowboy Bebop**.
Almost every one of the show's 26 episodes — its "Sessions" — is named after a
real song or musical style. This site breaks down all 26: the track each title
points to, the era and genre it comes from, and **why** Shinichiro Watanabe and
composer Yoko Kanno chose it — how the story, mood and score pay tribute.

> 3, 2, 1 — Let's Jam.

## What's inside

- **All 26 Sessions**, each with a song reference, artist, year, genre, the
  thematic "Tribute" breakdown, why the song matters, and source links.
- **Procedural cover art** — every episode gets a unique, Blue-Note-inspired
  record-sleeve generated in SVG from the session number. No copyrighted images.
- **Genre filter**, scroll-reveal animation, and a liner-notes modal per Session.
- A design language built around the show's eyecatch palette (mustard / bordeaux
  / teal), condensed display type, film grain and scanlines.

## Tech

Hand-written **HTML + CSS + vanilla JavaScript**. No build step, no dependencies.

```
index.html            # page structure
css/style.css         # the full design system
js/main.js            # rendering engine + generative sleeve art + interactions
data/episodes.json    # the researched content (the single source of truth)
```

To edit the content, change `data/episodes.json` — the page builds itself from it.

## Run locally

Because the page fetches `data/episodes.json`, serve it over HTTP (don't open the
file directly):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy (GitHub Pages)

A workflow at `.github/workflows/deploy.yml` publishes the site on every push to
`main`. To turn it on:

1. Push to `main`.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The site goes live at `https://<user>.github.io/<repo>/`.

## Research & accuracy

The episode analysis was AI-researched and cross-checked against Wikipedia, the
Cowboy Bebop Fandom wiki, TV Tropes and music references. The write-ups are honest
about which titles name a specific song (e.g. Bill Evans' *Waltz for Debby* →
*Waltz for Venus*, Queen, the Rolling Stones, KISS, Herbie Hancock) versus those
that evoke a whole genre (blues, funk, samba, boogie-woogie), and they flag
debated cases. Open any Session to see its sources.

## Disclaimer

Cowboy Bebop is © Sunrise / Bandai Namco. This is a **non-commercial fan project**
for educational and appreciation purposes. No copyrighted images or audio are
reproduced — all artwork is original and generated procedurally. Referenced songs
and recordings belong to their respective rights holders.
