/* ideas.js — lightweight popup for BookWeave Ideas */

document.addEventListener("DOMContentLoaded", () => {
  // Wait until DOM is ready, then inject the footer link & modal
  const foot = document.querySelector(".foot");
  if (!foot) return;

  // Add the "BookWeave Ideas" link to the footer dynamically
  const ideasLink = document.createElement("a");
  ideasLink.href = "#";
  ideasLink.id = "ideasLink";
  ideasLink.textContent = "BookWeave Ideas";
  foot.insertAdjacentText("beforeend", "•");
  foot.appendChild(ideasLink);

  // Inject modal HTML at the end of body
  const modalHTML = `
    <div id="ideasModal" class="modal" aria-hidden="true">
      <div class="sheet">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px">
          <h3 id="ideasTitle">BookWeave Ideas</h3>
          <div class="row">
            <button id="ideasBack" class="btn ghost" style="display:none">← Back</button>
            <button id="ideasClose" class="btn ghost">Close</button>
          </div>
        </div>
        <div id="ideasList" class="list"></div>
        <div id="ideasArticle" class="list" style="display:none"></div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Define your Ideas articles
  const BW_IDEAS = [
    {
      id: "5-ways-students-use-bookweave",
      title: "5 Ways Students Can Use Book Weave to Study Smarter",
      summary:
        "Discover how BookWeave helps students learn faster, organize notes, and stay focused — all offline and private.",
      html: `
        <h4>5 Ways Students Can Use <i>Book Weave</i> to Study Smarter</h4>
        <p><strong>BookWeave</strong> isn’t just for writers — it’s a powerful offline workspace for students who want to capture ideas, structure study notes, and stay distraction-free.</p>
        <ol>
          <li><b>Record lectures and auto-transcribe:</b> Use BookWeave’s built-in speech-to-text to summarize key points during or after class.</li>
          <li><b>Turn daily reflections into quick study logs:</b> Speak your understanding aloud and let BookWeave capture it as a text entry.</li>
          <li><b>Organize by subject or project:</b> Tag each entry as Finance, Strategy, Operations, or Exam Prep.</li>
          <li><b>Create flashcards from notes:</b> Use the Flashcard tool inside BookWeave to quiz yourself offline.</li>
          <li><b>Compile clean study summaries:</b> Merge all entries and export as PDF, TXT, or EPUB.</li>
        </ol>
        <p>With <strong>BookWeave</strong>, students can think, speak, and study — faster and smarter — without ever leaving their device.</p>
        <p><i>Offline. Private. Yours.</i></p>
      `,
    },
  ];

  // Cache references
  const ideasModal = document.getElementById("ideasModal");
  const ideasList = document.getElementById("ideasList");
  const ideasArticle = document.getElementById("ideasArticle");
  const ideasClose = document.getElementById("ideasClose");
  const ideasBack = document.getElementById("ideasBack");

  // Build list view
  function openIdeasList() {
    ideasList.innerHTML = BW_IDEAS.map(
      (it) => `
        <div class="item">
          <div class="title">${it.title}</div>
          <div class="meta" style="margin:4px 0 8px 0">${it.summary}</div>
          <button class="btn ghost" data-id="${it.id}" data-act="open-idea">Open</button>
        </div>`
    ).join("");
    ideasArticle.style.display = "none";
    ideasList.style.display = "flex";
    ideasBack.style.display = "none";
  }

  // Open article
  function openIdeaById(id) {
    const it = BW_IDEAS.find((x) => x.id === id);
    if (!it) return;
    ideasArticle.innerHTML = `<div class="item">${it.html}</div>`;
    ideasList.style.display = "none";
    ideasArticle.style.display = "block";
    ideasBack.style.display = "inline-flex";
  }

  // Wire actions
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
});
