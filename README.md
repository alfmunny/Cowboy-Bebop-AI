# Cowboy Bebop · Sessions in Jazz

A static, single-page tribute to the music hidden inside **Cowboy Bebop**.
Almost every one of the show's 26 episodes — its "Sessions" — is named after a
real song or musical style. This site breaks down all 26: the track each title
points to, the era and genre it comes from, and **why** Shinichiro Watanabe and
composer Yoko Kanno chose it — how the story, mood and score pay tribute.

> 3, 2, 1 — Let's Jam.

## What's inside

Three pages, one design language:

1. **The 26 Sessions** (`index.html`) — each episode with its song reference,
   artist, year, genre, the thematic "Tribute" breakdown, why the song matters,
   a **▶ Listen on YouTube** link, and source links.
2. **Song Index** (`songs.html`) — a complete cross-reference of every named
   song, every band/artist (The Rolling Stones recur across four Sessions), and
   every style evoked, each linking back to its Session and out to YouTube.
3. **Deep Cuts** (`soundtrack.html`) — the show's *own* music by Yoko Kanno &
   The Seatbelts (Tank!, Rush, Space Lion, Green Bird, The Real Folk Blues, Blue
   and more): where each cue is used, its key/form/style, a music-theory note,
   and a **beginner chord progression to play** (clearly labelled as a simplified
   teaching arrangement, not a transcription).

Plus:
- **Procedural cover art** — every episode gets a unique, Blue-Note-inspired
  record-sleeve generated in SVG from the session number. No copyrighted images.
- **Genre filter**, scroll-reveal animation, a liner-notes modal per Session,
  and deep-links (`index.html#s12` opens that Session directly).
- **YouTube links are search links** (`youtube.com/results?...`), not hard-coded
  video IDs — so they never break, get region-locked, or point at a dead upload.
- A design language built around the show's eyecatch palette (mustard / bordeaux
  / teal), condensed display type, film grain and scanlines.

## Tech

Hand-written **HTML + CSS + vanilla JavaScript**. No build step, no dependencies.

```
index.html            # the 26 Sessions (home)
songs.html            # the Song / artist / style cross-reference index
soundtrack.html       # Deep Cuts: the Seatbelts soundtrack + chord guides
css/style.css         # the full design system
js/common.js          # shared helpers: palettes, generative sleeve art, starfield
js/main.js            # home page: session grid, filters, modal, deep-links
js/songs.js           # builds the Song Index from episodes.json
js/soundtrack.js      # builds the Deep Cuts page from soundtrack.json
data/episodes.json    # researched episode content (single source of truth)
data/soundtrack.json  # researched track facts + the chord-guide arrangements
```

To edit content, change the JSON files in `data/` — the pages build themselves
from them.

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
