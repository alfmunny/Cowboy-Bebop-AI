/* ============================================================
   COWBOY BEBOP — Deep Cuts (the soundtrack itself)
   Music-theory notes + beginner chord guides for the Seatbelts tracks.
   Depends on js/common.js (window.BEBOP).
   ============================================================ */
(function () {
  "use strict";
  const { SCHEMES, disc, yt, reveal, load } = window.BEBOP;

  function chordStrip(chords) {
    return `<div class="chords">` + chords.map((c) =>
      `<span class="chord">${c}</span>`).join("") + `</div>`;
  }

  function trackCard(t, i) {
    const scheme = SCHEMES[(i + 1) % SCHEMES.length];
    return `<article class="track reveal" id="${t.id}">
      <div class="track-head">
        <span class="track-disc">${disc(56, scheme.a)}</span>
        <div class="track-id">
          <span class="track-role">${t.role}</span>
          <h3 class="track-title">${t.title}</h3>
          <div class="track-by">${t.composer}${t.vocalist ? " · " + t.vocalist : ""}</div>
        </div>
        <a class="listen lg track-listen" href="${yt(t.youtube)}" target="_blank" rel="noopener">▶ Listen</a>
      </div>

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

      reveal(".reveal");
    }).catch(() => {
      document.getElementById("tracks").innerHTML =
        '<p style="color:var(--cream-dim)">Could not load soundtrack data. Serve over a local/static server.</p>';
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
