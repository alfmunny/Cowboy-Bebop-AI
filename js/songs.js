/* ============================================================
   COWBOY BEBOP — Song Index page
   Cross-references every song, artist and style back to its Session.
   Depends on js/common.js (window.BEBOP).
   ============================================================ */
(function () {
  "use strict";
  const { yt, reveal, load, genreTag } = window.BEBOP;

  // Sort key that ignores a leading "The "
  const sortKey = (s) => s.replace(/^the\s+/i, "").toLowerCase();

  function sessionChip(ep) {
    return `<a class="sess-chip" href="index.html#s${ep.session}" title="${ep.title}">
      #${String(ep.session).padStart(2, "0")} · ${ep.title}</a>`;
  }

  function ytChip(query, label) {
    return `<a class="yt-chip" href="${yt(query)}" target="_blank" rel="noopener">▶ ${label || "YouTube"}</a>`;
  }

  function boot() {
    load("data/episodes.json").then((episodes) => {
      episodes.sort((a, b) => a.session - b.session);

      /* ---- Songs: title -> [episodes] ---- */
      const songMap = new Map();
      episodes.forEach((ep) => {
        if (!ep.songRef) return;
        if (!songMap.has(ep.songRef)) songMap.set(ep.songRef, { eps: [], ep });
        songMap.get(ep.songRef).eps.push(ep);
      });
      const songs = [...songMap.entries()].sort((a, b) => sortKey(a[0]) < sortKey(b[0]) ? -1 : 1);

      /* ---- Artists/Bands: name -> [episodes] ---- */
      const artistMap = new Map();
      episodes.forEach((ep) => (ep.artists || []).forEach((a) => {
        if (!artistMap.has(a)) artistMap.set(a, []);
        artistMap.get(a).push(ep);
      }));
      const artists = [...artistMap.entries()].sort((a, b) => sortKey(a[0]) < sortKey(b[0]) ? -1 : 1);

      /* ---- Styles: genre-reference titles (no single song) ---- */
      const styles = episodes.filter((ep) => !ep.songRef)
        .sort((a, b) => genreTag(a.genre) < genreTag(b.genre) ? -1 : 1);

      /* ---- Counts ---- */
      const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      set("c-songs", songs.length);
      set("c-artists", artists.length);
      set("c-styles", styles.length);

      /* ---- Render: Songs ---- */
      document.getElementById("songs-list").innerHTML = songs.map(([title, { eps, ep }]) => {
        const artistLine = ep.artists && ep.artists.length ? ep.artists.join(", ") : ep.artist;
        return `<li class="idx-row reveal">
          <div class="idx-main">
            <div class="idx-name">${title}</div>
            <div class="idx-sub">${artistLine}${ep.songYear && ep.songYear !== "N/A" ? " · " + ep.songYear : ""}</div>
          </div>
          <div class="idx-links">
            ${ytChip(ep.listen.query, "Listen")}
            ${eps.map(sessionChip).join("")}
          </div>
        </li>`;
      }).join("");

      /* ---- Render: Artists ---- */
      document.getElementById("artists-list").innerHTML = artists.map(([name, eps]) => `
        <li class="idx-row reveal">
          <div class="idx-main">
            <div class="idx-name">${name}</div>
            <div class="idx-sub">${eps.length} session${eps.length > 1 ? "s" : ""}</div>
          </div>
          <div class="idx-links">
            ${ytChip(name + " band", name.split(" ").slice(0, 3).join(" "))}
            ${eps.map(sessionChip).join("")}
          </div>
        </li>`).join("");

      /* ---- Render: Styles ---- */
      document.getElementById("styles-list").innerHTML = styles.map((ep) => `
        <li class="idx-row reveal">
          <div class="idx-main">
            <div class="idx-name">${ep.genre}</div>
            <div class="idx-sub">${ep.title}</div>
          </div>
          <div class="idx-links">
            ${ytChip(ep.listen.query, "Example")}
            ${sessionChip(ep)}
          </div>
        </li>`).join("");

      reveal(".reveal");
    }).catch(() => {
      document.getElementById("songs-list").innerHTML =
        '<li style="color:var(--cream-dim)">Could not load data. Serve over a local/static server.</li>';
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
