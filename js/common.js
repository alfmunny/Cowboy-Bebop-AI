/* ============================================================
   COWBOY BEBOP — shared helpers (used by every page)
   Exposes a global `BEBOP` namespace.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Palettes (Blue Note record-sleeve schemes) ---------- */
  const SCHEMES = [
    { bg: "#0e0c14", a: "#e8b22e", b: "#b11f33", c: "#efe6d3" },
    { bg: "#0a1413", a: "#2f8f86", b: "#e8b22e", c: "#efe6d3" },
    { bg: "#140a0e", a: "#b11f33", b: "#efe6d3", c: "#e8b22e" },
    { bg: "#0c0f16", a: "#5a7fb5", b: "#e8b22e", c: "#efe6d3" },
    { bg: "#12100a", a: "#efe6d3", b: "#b11f33", c: "#2f8f86" },
    { bg: "#160d14", a: "#c06a9a", b: "#e8b22e", c: "#efe6d3" },
  ];

  /* ---------- Deterministic pseudo-random from a seed ---------- */
  function rng(seed) {
    let s = (seed * 2654435761) % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }

  /* ---------- Generate a unique abstract "sleeve" SVG ---------- */
  function sleeve(seed, w, h) {
    const scheme = SCHEMES[seed % SCHEMES.length];
    const r = rng(seed + 7);
    const tmpl = seed % 6;
    let shapes = "";

    if (tmpl === 0) {
      const cx = w * (0.32 + r() * 0.36), cy = h * 0.5;
      for (let i = 6; i >= 1; i--) {
        const rad = (Math.min(w, h) * 0.46) * (i / 6);
        const col = i % 2 ? scheme.a : scheme.b;
        shapes += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${col}" opacity="${0.85 - i * 0.04}"/>`;
      }
      shapes += `<circle cx="${cx}" cy="${cy}" r="${w * 0.03}" fill="${scheme.bg}"/>`;
    } else if (tmpl === 1) {
      for (let i = 0; i < 7; i++) {
        const x = (i - 1) * (w / 5);
        const col = [scheme.a, scheme.b, scheme.c][i % 3];
        shapes += `<polygon points="${x},0 ${x + w * 0.16},0 ${x - w * 0.18},${h} ${x - w * 0.34},${h}" fill="${col}" opacity="0.9"/>`;
      }
    } else if (tmpl === 2) {
      const cx = w * 0.5, cy = h * (0.62 + r() * 0.1);
      shapes += `<circle cx="${cx}" cy="${cy}" r="${w * 0.3}" fill="${scheme.a}"/>`;
      for (let i = 0; i < 6; i++) {
        const yy = cy + i * 7 + 4;
        shapes += `<rect x="0" y="${yy}" width="${w}" height="${3 + i}" fill="${scheme.bg}" opacity="0.9"/>`;
      }
      shapes += `<rect x="0" y="${h * 0.74}" width="${w}" height="${h * 0.26}" fill="${scheme.b}"/>`;
    } else if (tmpl === 3) {
      shapes += `<rect width="${w}" height="${h}" fill="${scheme.bg}"/>`;
      for (let i = 0; i < 9; i++) {
        const cx = r() * w, cy = r() * h, rad = 6 + r() * (w * 0.12);
        const col = [scheme.a, scheme.b, scheme.c][i % 3];
        shapes += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${col}" opacity="${0.5 + r() * 0.5}"/>`;
      }
    } else if (tmpl === 4) {
      shapes += `<path d="M 0 ${h} Q ${w * 0.5} ${-h * 0.3} ${w} ${h * 0.5} L ${w} ${h} Z" fill="${scheme.a}"/>`;
      shapes += `<path d="M 0 ${h} Q ${w * 0.4} ${h * 0.1} ${w} ${h * 0.8} L ${w} ${h} Z" fill="${scheme.b}" opacity="0.85"/>`;
      shapes += `<rect x="${w * (0.2 + r() * 0.5)}" y="0" width="${4 + r() * 6}" height="${h}" fill="${scheme.c}" opacity="0.8"/>`;
    } else {
      let y = 0;
      const cols = [scheme.a, scheme.b, scheme.c, scheme.a];
      for (let i = 0; i < 4; i++) {
        const bh = (h / 4) * (0.6 + r() * 0.9);
        shapes += `<rect x="0" y="${y}" width="${w}" height="${bh}" fill="${cols[i]}" opacity="0.85"/>`;
        y += bh;
      }
    }

    let stars = "";
    for (let i = 0; i < 14; i++) {
      stars += `<circle cx="${r() * w}" cy="${r() * h}" r="${r() * 1.3}" fill="${scheme.c}" opacity="${r() * 0.5}"/>`;
    }

    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Abstract cover art">
      <rect width="${w}" height="${h}" fill="${scheme.bg}"/>${shapes}${stars}
      <rect width="${w}" height="${h}" fill="url(#vig${seed})"/>
      <defs><radialGradient id="vig${seed}" cx="50%" cy="45%" r="75%">
        <stop offset="55%" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.5"/>
      </radialGradient></defs>
    </svg>`;
  }

  /* ---------- Spinning vinyl disc ---------- */
  function disc(size, color) {
    const c = size / 2;
    return `<svg class="disc-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="transform-origin:center">
      <circle cx="${c}" cy="${c}" r="${c}" fill="#0a0a0a"/>
      <circle class="groove" cx="${c}" cy="${c}" r="${c * 0.82}"/>
      <circle class="groove" cx="${c}" cy="${c}" r="${c * 0.64}"/>
      <circle class="groove" cx="${c}" cy="${c}" r="${c * 0.46}"/>
      <circle cx="${c}" cy="${c}" r="${c * 0.34}" fill="${color}"/>
      <circle cx="${c}" cy="${c}" r="${c * 0.06}" fill="#0a0a0a"/>
    </svg>`;
  }

  /* ---------- Genre -> short tag ---------- */
  function genreTag(genre) {
    const g = (genre || "").toLowerCase();
    if (g.includes("jazz") || g.includes("bop")) return "Jazz";
    if (g.includes("metal")) return "Metal";
    if (g.includes("rockabilly") || g.includes("rock")) return "Rock";
    if (g.includes("funk") || g.includes("r&b") || g.includes("soul")) return "Funk/R&B";
    if (g.includes("samba") || g.includes("bossa") || g.includes("latin")) return "Latin";
    if (g.includes("boogie") || g.includes("shuffle") || g.includes("blues")) return "Blues";
    if (g.includes("turntablism") || g.includes("hip-hop") || g.includes("hip hop")) return "Hip-Hop";
    if (g.includes("new wave") || g.includes("synth")) return "New Wave";
    if (g.includes("ballad") || g.includes("elegy") || g.includes("lament")) return "Ballad";
    if (g.includes("folk")) return "Folk";
    return "Music";
  }

  /* ---------- YouTube search link (robust: never 404s) ---------- */
  function yt(query) {
    return "https://www.youtube.com/results?search_query=" + encodeURIComponent(query);
  }

  /* ---------- Starfield ---------- */
  function starfield() {
    const sf = document.getElementById("starfield");
    if (!sf) return;
    const n = window.innerWidth < 640 ? 60 : 130;
    const r = rng(99);
    let html = "";
    for (let i = 0; i < n; i++) {
      const size = r() < 0.85 ? 1 : 2;
      html += `<span class="star" style="left:${r() * 100}%;top:${r() * 100}%;width:${size}px;height:${size}px;animation-delay:${r() * 4}s"></span>`;
    }
    sf.innerHTML = html;
  }

  /* ---------- Topbar solidify on scroll ---------- */
  function topbarScroll() {
    const tb = document.querySelector(".topbar");
    if (!tb) return;
    const onScroll = () => tb.classList.toggle("solid", window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Reveal-on-scroll for any selector ---------- */
  function reveal(selector) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(selector).forEach((c) => io.observe(c));
  }

  /* ---------- Fetch JSON helper ---------- */
  async function load(path) {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error("fetch failed: " + path);
    return res.json();
  }

  window.BEBOP = { SCHEMES, rng, sleeve, disc, genreTag, yt, starfield, topbarScroll, reveal, load };

  /* Init the chrome that every page shares */
  function init() { starfield(); topbarScroll(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
