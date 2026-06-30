/* ============================================================
   COWBOY BEBOP — Sessions in Jazz
   Rendering engine: generative record-sleeve art + interactions.
   No frameworks, no build step. Just the music.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Palettes (Blue Note record-sleeve schemes) ---------- */
  const SCHEMES = [
    { bg: "#0e0c14", a: "#e8b22e", b: "#b11f33", c: "#efe6d3" }, // mustard/red
    { bg: "#0a1413", a: "#2f8f86", b: "#e8b22e", c: "#efe6d3" }, // teal/mustard
    { bg: "#140a0e", a: "#b11f33", b: "#efe6d3", c: "#e8b22e" }, // red/cream
    { bg: "#0c0f16", a: "#5a7fb5", b: "#e8b22e", c: "#efe6d3" }, // blue/mustard
    { bg: "#12100a", a: "#efe6d3", b: "#b11f33", c: "#2f8f86" }, // cream/red
    { bg: "#160d14", a: "#c06a9a", b: "#e8b22e", c: "#efe6d3" }, // plum/mustard
  ];

  /* ---------- Deterministic pseudo-random from a seed ---------- */
  function rng(seed) {
    let s = seed * 2654435761 % 2147483647;
    return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }

  /* ---------- Generate a unique abstract "sleeve" SVG ----------
     Six composition templates, chosen by session number, each evoking
     mid-century Blue Note / Reid Miles album-cover graphic design.     */
  function sleeve(session, w, h) {
    const scheme = SCHEMES[session % SCHEMES.length];
    const r = rng(session + 7);
    const tmpl = session % 6;
    let shapes = "";

    if (tmpl === 0) {
      // concentric circles (a record on a field)
      const cx = w * (0.32 + r() * 0.36), cy = h * (0.5);
      for (let i = 6; i >= 1; i--) {
        const rad = (Math.min(w, h) * 0.46) * (i / 6);
        const col = i % 2 ? scheme.a : scheme.b;
        shapes += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${col}" opacity="${0.85 - i * 0.04}"/>`;
      }
      shapes += `<circle cx="${cx}" cy="${cy}" r="${w * 0.03}" fill="${scheme.bg}"/>`;
    } else if (tmpl === 1) {
      // diagonal bands
      for (let i = 0; i < 7; i++) {
        const x = (i - 1) * (w / 5);
        const col = [scheme.a, scheme.b, scheme.c][i % 3];
        shapes += `<polygon points="${x},0 ${x + w * 0.16},0 ${x - w * 0.18},${h} ${x - w * 0.34},${h}" fill="${col}" opacity="0.9"/>`;
      }
    } else if (tmpl === 2) {
      // half-tone sun + horizon (asteroid skyline)
      const cx = w * 0.5, cy = h * (0.62 + r() * 0.1);
      shapes += `<circle cx="${cx}" cy="${cy}" r="${w * 0.3}" fill="${scheme.a}"/>`;
      for (let i = 0; i < 6; i++) {
        const yy = cy + i * 7 + 4;
        shapes += `<rect x="0" y="${yy}" width="${w}" height="${3 + i}" fill="${scheme.bg}" opacity="0.9"/>`;
      }
      shapes += `<rect x="0" y="${h * 0.74}" width="${w}" height="${h * 0.26}" fill="${scheme.b}"/>`;
    } else if (tmpl === 3) {
      // floating planets / asteroid belt
      shapes += `<rect width="${w}" height="${h}" fill="${scheme.bg}"/>`;
      for (let i = 0; i < 9; i++) {
        const cx = r() * w, cy = r() * h, rad = 6 + r() * (w * 0.12);
        const col = [scheme.a, scheme.b, scheme.c][i % 3];
        shapes += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${col}" opacity="${0.5 + r() * 0.5}"/>`;
      }
    } else if (tmpl === 4) {
      // big arc + vertical accent (saxophone curve)
      shapes += `<path d="M 0 ${h} Q ${w * 0.5} ${-h * 0.3} ${w} ${h * 0.5} L ${w} ${h} Z" fill="${scheme.a}"/>`;
      shapes += `<path d="M 0 ${h} Q ${w * 0.4} ${h * 0.1} ${w} ${h * 0.8} L ${w} ${h} Z" fill="${scheme.b}" opacity="0.85"/>`;
      shapes += `<rect x="${w * (0.2 + r() * 0.5)}" y="0" width="${4 + r() * 6}" height="${h}" fill="${scheme.c}" opacity="0.8"/>`;
    } else {
      // stacked rectangles (eyecatch blocks)
      let y = 0;
      const cols = [scheme.a, scheme.b, scheme.c, scheme.a];
      for (let i = 0; i < 4; i++) {
        const bh = (h / 4) * (0.6 + r() * 0.9);
        shapes += `<rect x="0" y="${y}" width="${w}" height="${bh}" fill="${cols[i]}" opacity="${0.85}"/>`;
        y += bh;
      }
    }

    // faint star speckle on top for cohesion
    let stars = "";
    for (let i = 0; i < 14; i++) {
      stars += `<circle cx="${r() * w}" cy="${r() * h}" r="${r() * 1.3}" fill="${scheme.c}" opacity="${r() * 0.5}"/>`;
    }

    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Abstract cover art for session ${session}">
      <rect width="${w}" height="${h}" fill="${scheme.bg}"/>${shapes}${stars}
      <rect width="${w}" height="${h}" fill="url(#vig${session})"/>
      <defs><radialGradient id="vig${session}" cx="50%" cy="45%" r="75%">
        <stop offset="55%" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.5"/>
      </radialGradient></defs>
    </svg>`;
  }

  /* ---------- A small spinning vinyl disc ---------- */
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

  /* ---------- Genre -> short tag color class ---------- */
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

  /* ---------- Build a session card ---------- */
  function card(ep) {
    const el = document.createElement("article");
    el.className = "card";
    el.dataset.genre = genreTag(ep.genre);
    el.dataset.session = ep.session;
    const scheme = SCHEMES[ep.session % SCHEMES.length];
    el.innerHTML = `
      <div class="sleeve">
        ${sleeve(ep.session, 320, 200)}
        <div class="num">SESSION <small>#${String(ep.session).padStart(2, "0")}</small></div>
        <span class="tag">${genreTag(ep.genre)}</span>
      </div>
      <div class="body">
        <h3 class="title">${ep.title}</h3>
        <div class="pairing">
          <span class="disc">${disc(34, scheme.a)}</span>
          <div class="meta">
            <div class="song">${ep.song}</div>
            <div class="artist">${ep.artist}</div>
          </div>
        </div>
        <span class="cue">▸ Read the liner notes</span>
      </div>`;
    el.addEventListener("click", () => openModal(ep));
    return el;
  }

  /* ---------- Modal (liner notes) ---------- */
  const backdrop = document.getElementById("modal-backdrop");

  function openModal(ep) {
    const scheme = SCHEMES[ep.session % SCHEMES.length];
    const sources = (ep.sources || []).map((u, i) =>
      `<a href="${u}" target="_blank" rel="noopener">[${i + 1}]</a>`).join(" ");
    backdrop.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-label="Session ${ep.session}: ${ep.title}">
        <button class="close" aria-label="Close">×</button>
        <div class="m-hero">
          <div class="art">${sleeve(ep.session, 480, 480)}</div>
          <div class="intro">
            <span class="session-no">Session #${String(ep.session).padStart(2, "0")}</span>
            <h3>${ep.title}</h3>
          </div>
        </div>
        <div class="m-body">
          <div class="record-block">
            <span class="big-disc">${disc(74, scheme.a)}</span>
            <div class="info">
              <div class="label">Named after</div>
              <div class="song">${ep.song}</div>
              <div class="by">${ep.artist}${ep.songYear && ep.songYear !== "N/A" ? " · " + ep.songYear : ""}</div>
              <div class="chips"><span>${ep.genre}</span></div>
            </div>
          </div>
          <div class="note">
            <h4>The Tribute</h4>
            <p>${ep.episodeLink}</p>
          </div>
          <div class="note">
            <h4>Why the song matters</h4>
            <p>${ep.songSignificance}</p>
          </div>
          ${sources ? `<div class="sources">Sources: ${sources}</div>` : ""}
        </div>
      </div>`;
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    backdrop.querySelector(".close").addEventListener("click", closeModal);
  }
  function closeModal() {
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
  }
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  /* ---------- Filters ---------- */
  function setupFilters(episodes) {
    const genres = ["All", ...Array.from(new Set(episodes.map((e) => genreTag(e.genre))))];
    const bar = document.getElementById("filters");
    bar.innerHTML = genres.map((g, i) =>
      `<button class="${i === 0 ? "active" : ""}" data-g="${g}">${g}</button>`).join("");
    bar.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      bar.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const g = btn.dataset.g;
      document.querySelectorAll(".card").forEach((c) => {
        c.style.display = (g === "All" || c.dataset.genre === g) ? "" : "none";
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function revealOnScroll() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".card").forEach((c) => io.observe(c));
  }

  /* ---------- Starfield ---------- */
  function starfield() {
    const sf = document.getElementById("starfield");
    const n = window.innerWidth < 640 ? 60 : 130;
    const r = rng(99);
    let html = "";
    for (let i = 0; i < n; i++) {
      const size = r() < 0.85 ? 1 : 2;
      html += `<span class="star" style="left:${r() * 100}%;top:${r() * 100}%;width:${size}px;height:${size}px;animation-delay:${r() * 4}s"></span>`;
    }
    sf.innerHTML = html;
  }

  /* ---------- Topbar shrink on scroll ---------- */
  function topbarScroll() {
    const tb = document.querySelector(".topbar");
    const onScroll = () => tb.classList.toggle("solid", window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Boot ---------- */
  async function boot() {
    starfield();
    topbarScroll();
    let episodes = [];
    try {
      const res = await fetch("data/episodes.json", { cache: "no-store" });
      episodes = await res.json();
    } catch (err) {
      document.getElementById("session-grid").innerHTML =
        '<p style="color:var(--cream-dim)">Could not load the session data. Run this from a local/static server.</p>';
      return;
    }
    episodes.sort((a, b) => a.session - b.session);

    // stats
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set("stat-episodes", episodes.length);
    set("stat-genres", new Set(episodes.map((e) => genreTag(e.genre))).size);

    const grid = document.getElementById("session-grid");
    const frag = document.createDocumentFragment();
    episodes.forEach((ep) => frag.appendChild(card(ep)));
    grid.appendChild(frag);

    setupFilters(episodes);
    revealOnScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
