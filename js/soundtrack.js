/* ============================================================
   COWBOY BEBOP — Deep Cuts (the soundtrack itself)
   Music-theory notes + beginner chord guides for the Seatbelts tracks.
   Depends on js/common.js (window.BEBOP).
   ============================================================ */
(function () {
  "use strict";
  const { SCHEMES, disc, yt, reveal, load, keyboard, preview, playlistUrl } = window.BEBOP;

  function chordStrip(chords) {
    return `<div class="chords">` + chords.map((c) =>
      `<div class="chord-cell"><span class="chord">${c}</span>${keyboard(c)}</div>`).join("") + `</div>`;
  }

  function trackCard(t, i) {
    const scheme = SCHEMES[(i + 1) % SCHEMES.length];
    const playBtn = t.videoId
      ? `<button class="listen lg track-listen play-preview" data-vid="${t.videoId}" data-q="${t.youtube}">▶ Preview</button>`
      : `<a class="listen lg track-listen" href="${yt(t.youtube)}" target="_blank" rel="noopener">▶ Listen</a>`;
    return `<article class="track reveal" id="${t.id}">
      <div class="track-head">
        <span class="track-disc">${disc(56, scheme.a)}</span>
        <div class="track-id">
          <span class="track-role">${t.role}</span>
          <h3 class="track-title">${t.title}</h3>
          <div class="track-by">${t.composer}${t.vocalist ? " · " + t.vocalist : ""}</div>
        </div>
        ${playBtn}
      </div>
      <div class="player-slot"></div>

      <div class="track-meta">
        <span><b>Used in</b> ${t.usedIn}</span>
        <span><b>Style</b> ${t.genre}</span>
        <span><b>Key</b> ${t.key}</span>
        <span><b>Form</b> ${t.form}</span>
      </div>

      <div class="note"><h4>The Theory</h4><p>${t.theory}</p></div>

      <div class="play">
        <div class="play-label">Try this <span>— simplified teaching progression, not a transcription</span></div>
        ${chordStrip(t.chords)}
        <p class="play-how">${t.tryThis}</p>
      </div>

      <div class="sources">Sources: ${(t.sources || []).map((u, n) =>
        `<a href="${u}" target="_blank" rel="noopener">[${n + 1}]</a>`).join(" ")}</div>
    </article>`;
  }

  function boot() {
    load("data/soundtrack.json").then((data) => {
      const intro = data.intro;
      document.getElementById("st-lede").textContent = intro.lede;
      document.getElementById("st-voices").textContent = intro.voices;
      document.getElementById("st-disclaimer").textContent = intro.disclaimer;
      document.getElementById("c-tracks").textContent = data.tracks.length;

      // quick-jump nav
      document.getElementById("track-nav").innerHTML = data.tracks.map((t) =>
        `<a href="#${t.id}">${t.title}</a>`).join("");

      document.getElementById("tracks").innerHTML =
        data.tracks.map((t, i) => trackCard(t, i)).join("");

      // "Play all" anonymous playlist of the soundtrack
      const ids = data.tracks.map((t) => t.videoId).filter(Boolean);
      const purl = playlistUrl(ids);
      const slot = document.getElementById("playall-slot");
      if (purl && slot) {
        slot.innerHTML = `<a class="playall" href="${purl}" target="_blank" rel="noopener">▶ Play all ${ids.length} tracks as a YouTube queue</a>`;
      }

      // Inline 30-sec previews
      document.getElementById("tracks").addEventListener("click", (e) => {
        const btn = e.target.closest(".play-preview");
        if (!btn) return;
        const card = btn.closest(".track");
        const ps = card.querySelector(".player-slot");
        preview(ps, btn.dataset.vid, btn.dataset.q, 30);
        ps.scrollIntoView({ behavior: "smooth", block: "center" });
      });

      reveal(".reveal");
    }).catch(() => {
      document.getElementById("tracks").innerHTML =
        '<p style="color:var(--cream-dim)">Could not load soundtrack data. Serve over a local/static server.</p>';
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
