/* ============================================================
   COWBOY BEBOP — home page (the 26 Sessions grid + modal)
   Depends on js/common.js (window.BEBOP).
   ============================================================ */
(function () {
  "use strict";
  const { SCHEMES, sleeve, disc, genreTag, yt, reveal, load } = window.BEBOP;

  const backdrop = document.getElementById("modal-backdrop");

  function listenBtn(ep, big) {
    if (!ep.listen) return "";
    const cls = big ? "listen lg" : "listen";
    return `<a class="${cls}" href="${yt(ep.listen.query)}" target="_blank" rel="noopener"
      onclick="event.stopPropagation()" title="${ep.listen.label}">▶ ${big ? ep.listen.label : "Listen on YouTube"}</a>`;
  }

  function card(ep) {
    const el = document.createElement("article");
    el.className = "card";
    el.id = "s" + ep.session;
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
        <div class="card-actions">
          <span class="cue">▸ Liner notes</span>
          ${listenBtn(ep, false)}
        </div>
      </div>`;
    el.addEventListener("click", () => openModal(ep));
    return el;
  }

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
              ${listenBtn(ep, true)}
            </div>
          </div>
          <div class="note"><h4>The Tribute</h4><p>${ep.episodeLink}</p></div>
          <div class="note"><h4>Why the song matters</h4><p>${ep.songSignificance}</p></div>
          ${sources ? `<div class="sources">Sources: ${sources}</div>` : ""}
        </div>
      </div>`;
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    backdrop.querySelector(".close").addEventListener("click", closeModal);
  }
  function closeModal() { backdrop.classList.remove("open"); document.body.style.overflow = ""; }
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

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

  async function boot() {
    let episodes = [];
    try { episodes = await load("data/episodes.json"); }
    catch (err) {
      document.getElementById("session-grid").innerHTML =
        '<p style="color:var(--cream-dim)">Could not load session data. Serve this over a local/static server.</p>';
      return;
    }
    episodes.sort((a, b) => a.session - b.session);

    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set("stat-episodes", episodes.length);
    set("stat-genres", new Set(episodes.map((e) => genreTag(e.genre))).size);

    const grid = document.getElementById("session-grid");
    const frag = document.createDocumentFragment();
    episodes.forEach((ep) => frag.appendChild(card(ep)));
    grid.appendChild(frag);

    setupFilters(episodes);
    reveal(".card");

    // Deep-link: index.html#s12 jumps to and opens that Session
    function openFromHash() {
      const m = /^#s(\d+)$/.exec(location.hash);
      if (!m) return;
      const ep = episodes.find((e) => e.session === Number(m[1]));
      if (!ep) return;
      const cardEl = document.getElementById("s" + ep.session);
      if (cardEl) cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
      openModal(ep);
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
