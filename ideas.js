/* ideas.js — BookWeave Ideas (popup list + articles + deep links)
   Drop this file in the repo root and ensure index.html includes:
   <script src="ideas.js?v=1"></script>
*/

document.addEventListener("DOMContentLoaded", () => {
  // 1) Inject "BookWeave Ideas" link into footer
  const foot = document.querySelector(".foot") || document.querySelector("footer");
  if (!foot) return;

  const sep = document.createTextNode("•");
  const ideasLink = document.createElement("a");
  ideasLink.href = "#";
  ideasLink.id = "ideasLink";
  ideasLink.textContent = "BookWeave Ideas";

  foot.appendChild(document.createTextNode(" "));
  foot.appendChild(sep);
  foot.appendChild(document.createTextNode(" "));
  foot.appendChild(ideasLink);

  // 2) Inject modal shell at end of <body>
  const modalHTML = `
    <div id="ideasModal" class="modal" aria-hidden="true">
      <div class="sheet" role="dialog" aria-labelledby="ideasTitle" aria-modal="true">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px">
          <h3 id="ideasTitle">BookWeave Ideas</h3>
          <div class="row">
            <button id="ideasBack" class="btn ghost" style="display:none">← Back</button>
            <button id="ideasClose" class="btn ghost" aria-label="Close Ideas">Close</button>
          </div>
        </div>

        <!-- Toolbar -->
        <div class="row" style="margin-top:6px">
          <input id="ideasSearch" placeholder="Search articles…" style="flex:1; min-width:220px" />
        </div>

        <!-- List view -->
        <div id="ideasList" class="list" style="margin-top:10px"></div>

        <!-- Article view -->
        <div id="ideasArticle" class="list" style="display:none; margin-top:10px"></div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // 3) Content: BookWeave Ideas (add more by appending to this array)
  const BW_IDEAS = [
    {
      id: "5-ways-students-use-bookweave",
      title: "5 Ways Students Can Use Book Weave to Study Smarter",
      summary:
        "Discover how BookWeave helps students learn faster, organize notes, and stay focused — all offline and private.",
      html: `
        <h4>5 Ways Students Can Use <i>Book Weave</i> to Study Smarter</h4>
        <ol>
          <li><b>Record lectures & auto-summarize:</b> Speak key points after class to create clean notes.</li>
          <li><b>Daily study logs:</b> Dictate what you learned; compile into a weekly recap.</li>
          <li><b>Organize by subject:</b> Tag entries (Finance, Strategy, Exam Prep) for one-click compile.</li>
          <li><b>Flashcards from your notes:</b> Build and quiz offline using your own content.</li>
          <li><b>Export clean summaries:</b> Merge everything to PDF/TXT/EPUB for quick revision.</li>
        </ol>
        <p><i>Offline. Private. Yours.</i></p>
      `,
    },

    {
      id: "5-ways-writers-flow",
      title: "5 Ways Writers Can Use Book Weave to Capture Flow",
      summary:
        "Defeat the blank page: speak drafts, organize scenes, and export a clean manuscript.",
      html: `
        <h4>5 Ways Writers Can Use <i>Book Weave</i> to Capture Flow</h4>
        <ol>
          <li><b>Voice-draft scenes:</b> Dictate freely; edit later without losing momentum.</li>
          <li><b>Character & world notes:</b> Keep quick entries and compile by tag (Character, Theme, Setting).</li>
          <li><b>Structure with timestamps:</b> Mark beats live while speaking “Act 1 / Act 2 / Act 3”.</li>
          <li><b>Glossary from manuscript:</b> Auto-extract names/terms to keep continuity tight.</li>
          <li><b>Export versions:</b> Save TXT for editing, PDF for sharing, EPUB for test reads.</li>
        </ol>
      `,
    },

    {
      id: "5-ways-journalists-interviews",
      title: "5 Ways Journalists Can Use Book Weave for Interviews & Field Notes",
      summary:
        "Capture quotes, tag sources, and compile a publish-ready brief — fully offline.",
      html: `
        <h4>5 Ways Journalists Can Use <i>Book Weave</i> for Interviews & Field Notes</h4>
        <ol>
          <li><b>Rapid quote capture:</b> Dictate verbatim lines and tag by source.</li>
          <li><b>On-site notes:</b> Add [Speaker A]/[Speaker B] markers for clarity.</li>
          <li><b>Keyword pass:</b> Run Keyword Analyzer to surface angles and themes.</li>
          <li><b>Redact quickly:</b> Use Redaction tool to anonymize before sharing.</li>
          <li><b>Compile brief:</b> Merge interviews + notes into a single report for the editor.</li>
        </ol>
      `,
    },

    {
      id: "5-ways-professors-teaching",
      title: "5 Ways Professors Can Use Book Weave to Teach Better",
      summary:
        "Prep lectures faster, capture class discussions, and share summaries with students.",
      html: `
        <h4>5 Ways Professors Can Use <i>Book Weave</i> to Teach Better</h4>
        <ol>
          <li><b>Lecture outlines by voice:</b> Dictate bullets, then export as PDF slides outline.</li>
          <li><b>Class discussion capture:</b> Record key points; tag by topic for exam review.</li>
          <li><b>Glossary builder:</b> Auto-generate key terms from your manuscript.</li>
          <li><b>Research note bank:</b> Keep sources and citations together with Citation Helper.</li>
          <li><b>Weekly recap:</b> Compile and share a concise PDF to your class.</li>
        </ol>
      `,
    },

    {
      id: "5-ways-researchers-lit-review",
      title: "5 Ways Researchers Can Use Book Weave for Literature Reviews",
      summary:
        "Dictate insights, standardize citations, and keep a tidy, searchable research log.",
      html: `
        <h4>5 Ways Researchers Can Use <i>Book Weave</i> for Literature Reviews</h4>
        <ol>
          <li><b>Voice abstracts:</b> Summarize each paper in 60 seconds right after you read it.</li>
          <li><b>Tag by theme/method:</b> Group notes for quick synthesis later.</li>
          <li><b>Citation Helper:</b> Generate APA/Harvard references locally for drafts.</li>
          <li><b>Keyword surfacing:</b> Find recurring concepts across your notes instantly.</li>
          <li><b>Export a living review:</b> Compile into a single, date-stamped document.</li>
        </ol>
      `,
    },

    {
      id: "5-ways-managers-meetings",
      title: "5 Ways Managers Can Use Book Weave to Turn Meetings into Actions",
      summary:
        "From spoken notes to assigned actions and a clean recap — in minutes.",
      html: `
        <h4>5 Ways Managers Can Use <i>Book Weave</i> to Turn Meetings into Actions</h4>
        <ol>
          <li><b>Live capture by voice:</b> Record decisions and owners while facilitating.</li>
          <li><b>Flag items:</b> Insert [FLAG] for follow-ups, then search easily.</li>
          <li><b>Checklist tool:</b> Convert action items to a trackable checklist.</li>
          <li><b>By-day dashboard:</b> See meeting cadence and progress over time.</li>
          <li><b>Share the recap:</b> Export a PDF summary post-meeting.</li>
        </ol>
      `,
    },

    {
      id: "5-ways-podcasters-youtube",
      title: "5 Ways Podcasters & YouTubers Can Use Book Weave",
      summary:
        "Outline episodes by voice, capture ideas, and export show notes quickly.",
      html: `
        <h4>5 Ways Podcasters & YouTubers Can Use <i>Book Weave</i></h4>
        <ol>
          <li><b>Voice outline:</b> Talk through segments; convert to a clean script.</li>
          <li><b>Idea inbox:</b> Quick entries for hooks, titles, and CTAs.</li>
          <li><b>Guest prep:</b> Tag research and questions per guest.</li>
          <li><b>Show notes fast:</b> Compile highlights and links into one export.</li>
          <li><b>Season planning:</b> Use calendar view to map episode cadence.</li>
        </ol>
      `,
    },

    {
      id: "5-ways-language-learners",
      title: "5 Ways Language Learners Can Use Book Weave to Improve Faster",
      summary:
        "Practice speaking, capture corrections, and build your personal phrasebook.",
      html: `
        <h4>5 Ways Language Learners Can Use <i>Book Weave</i> to Improve Faster</h4>
        <ol>
          <li><b>Speak to think:</b> Dictate daily prompts to build fluency.</li>
          <li><b>Corrections log:</b> Save teacher feedback as tagged entries.</li>
          <li><b>Personal phrasebook:</b> Compile most-used phrases into flashcards.</li>
          <li><b>Pronunciation drills:</b> Timestamp tricky words for repeated practice.</li>
          <li><b>Weekly recap:</b> Export a progress sheet to keep motivation high.</li>
        </ol>
      `,
    },
  ];

  // 4) Cache UI references
  const ideasModal = document.getElementById("ideasModal");
  const ideasList = document.getElementById("ideasList");
  const ideasArticle = document.getElementById("ideasArticle");
  const ideasClose = document.getElementById("ideasClose");
  const ideasBack = document.getElementById("ideasBack");
  const ideasSearch = document.getElementById("ideasSearch");

  // 5) Render helpers
  function renderList(filter = "") {
    const q = (filter || "").toLowerCase().trim();
    const items = BW_IDEAS.filter(
      (it) =>
        !q ||
        it.title.toLowerCase().includes(q) ||
        it.summary.toLowerCase().includes(q)
    );

    ideasList.innerHTML =
      items
        .map(
          (it) => `
        <div class="item">
          <div class="title">${it.title}</div>
          <div class="meta" style="margin:4px 0 8px 0">${it.summary}</div>
          <button class="btn ghost" data-id="${it.id}" data-act="open-idea">Open</button>
        </div>`
        )
        .join("") || `<div class="item"><div class="meta">No results.</div></div>`;
  }

  function openIdeasList() {
    renderList(ideasSearch.value || "");
    ideasArticle.style.display = "none";
    ideasList.style.display = "flex";
    ideasBack.style.display = "none";
    ideasSearch.style.display = "block";
    ideasSearch.focus();
  }

  function openIdeaById(id) {
    const it = BW_IDEAS.find((x) => x.id === id);
    if (!it) return;
    ideasArticle.innerHTML = `<div class="item">${it.html}</div>`;
    ideasList.style.display = "none";
    ideasArticle.style.display = "block";
    ideasBack.style.display = "inline-flex";
    ideasSearch.style.display = "none";
  }

  // 6) Wire up events
  ideasLink.addEventListener("click", (e) => {
    e.preventDefault();
    openIdeasList();
    ideasModal.classList.add("show");
  });

  ideasClose.addEventListener("click", () => ideasModal.classList.remove("show"));
  ideasModal.addEventListener("click", (e) => {
    if (e.target === ideasModal) ideasModal.classList.remove("show");
  });

  ideasBack.addEventListener("click", openIdeasList);

  ideasList.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-act='open-idea']");
    if (!btn) return;
    openIdeaById(btn.dataset.id);
  });

  ideasSearch.addEventListener("input", () => renderList(ideasSearch.value));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && ideasModal.classList.contains("show")) {
      ideasModal.classList.remove("show");
    }
  });

  // 7) Deep link: ?idea=slug opens modal and the article
  (function () {
    try {
      const params = new URLSearchParams(location.search);
      const slug = params.get("idea");
      if (!slug) return;
      openIdeasList();
      ideasModal.classList.add("show");
      const match = BW_IDEAS.find((x) => x.id === slug);
      if (match) openIdeaById(slug);
    } catch { /* no-op */ }
  })();
});
