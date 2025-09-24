/* -------------- Storage helpers -------------- */
const STORE_KEY = "bookweave_entries_v1";
const TAGS_KEY_NS = "bookweave_tags_";
const ROLE_KEY = "bw_role";
const LOCK_HASH_KEY = "bw_lock_sha";
const TODO_KEY = "bw_todo";
const FC_KEY = "bw_flashcards";

function loadEntries(){ try{ return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { return []; } }
function saveEntries(arr){ localStorage.setItem(STORE_KEY, JSON.stringify(arr)); }

/* -------------- State -------------- */
let entries = loadEntries();       // {id, title, tag, body, createdAt, audioDataURL?}
let selectedId = null;
let accumulatedText = "";
let tsTimer = null;
let audioRecorder = null;
let audioChunks = [];

/* -------------- Elements -------------- */
const landing = document.getElementById("landing");
const roleSelect = document.getElementById("roleSelect");
const continueBtn = document.getElementById("continueBtn");

const themeToggle = document.getElementById("themeToggle");
const lockBtn = document.getElementById("lockBtn");
const lockOverlay = document.getElementById("lockOverlay");
const lockInput = document.getElementById("lockInput");
const unlockBtn = document.getElementById("unlockBtn");
const lockStatus = document.getElementById("lockStatus");

const entriesList = document.getElementById("entriesList");
const transcript = document.getElementById("transcript");
const entryTitle = document.getElementById("entryTitle");
const entryTag = document.getElementById("entryTag");
const saveEntryBtn = document.getElementById("saveEntry");
const searchBox = document.getElementById("searchBox");
const filterTag = document.getElementById("filterTag");
const sortOrder = document.getElementById("sortOrder");

const manuscriptEl = document.getElementById("manuscript");
const compileBtn = document.getElementById("compileBtn");
const compileTagOnly = document.getElementById("compileTagOnly");
const compileByTagBtn = document.getElementById("compileByTagBtn");
const downloadTxt = document.getElementById("downloadTxt");
const downloadPdf = document.getElementById("downloadPdf");
const downloadDocx = document.getElementById("downloadDocx");
const downloadEpub = document.getElementById("downloadEpub");
const exportPptx = document.getElementById("exportPptx");

const summarizeBtn = document.getElementById("summarizeBtn");
const summaryBox = document.getElementById("summaryBox");
const countStats = document.getElementById("countStats");
const progressStats = document.getElementById("progressStats");

const tabCompile = document.getElementById("tabCompile");
const tabEdit = document.getElementById("tabEdit");
const tabCalendar = document.getElementById("tabCalendar");
const tabTools = document.getElementById("tabTools");
const tabDash = document.getElementById("tabDash");
const tabSettings = document.getElementById("tabSettings");
const compileView = document.getElementById("compileView");
const editView = document.getElementById("editView");
const calendarView = document.getElementById("calendarView");
const toolsView = document.getElementById("toolsView");
const dashView = document.getElementById("dashView");
const settingsView = document.getElementById("settingsView");

const editTitle = document.getElementById("editTitle");
const editTag = document.getElementById("editTag");
const editBody = document.getElementById("editBody");
const editDate = document.getElementById("editDate");
const saveEdit = document.getElementById("saveEdit");
const deleteEdit = document.getElementById("deleteEdit");

const recStatus = document.getElementById("recStatus");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const micTest = document.getElementById("micTest");
const recBubble = document.getElementById("recBubble");
const dot = document.getElementById("dot");
const autoTs = document.getElementById("autoTs");
const markSpeakerA = document.getElementById("markSpeakerA");
const markSpeakerB = document.getElementById("markSpeakerB");
const flagBtn = document.getElementById("flagBtn");

const audioRecBtn = document.getElementById("audioRecBtn");
const audioStopBtn = document.getElementById("audioStopBtn");
const audioDownloadBtn = document.getElementById("audioDownloadBtn");
const audioPlayer = document.getElementById("audioPlayer");

const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const calendarTitle = document.getElementById("calendarTitle");
const calendarGrid = document.getElementById("calendarGrid");

const analyzeKeywords = document.getElementById("analyzeKeywords");
const keywordsBox = document.getElementById("keywordsBox");
const synInput = document.getElementById("synInput");
const synBtn = document.getElementById("synBtn");
const synOut = document.getElementById("synOut");
const redactWord = document.getElementById("redactWord");
const redactInEdit = document.getElementById("redactInEdit");
const redactInCompiled = document.getElementById("redactInCompiled");
const citAuthor = document.getElementById("citAuthor");
const citYear = document.getElementById("citYear");
const citTitle = document.getElementById("citTitle");
const citSource = document.getElementById("citSource");
const citAPA = document.getElementById("citAPA");
const citHarvard = document.getElementById("citHarvard");
const citOut = document.getElementById("citOut");

const fcQ = document.getElementById("fcQ");
const fcA = document.getElementById("fcA");
const fcAdd = document.getElementById("fcAdd");
const fcClear = document.getElementById("fcClear");
const fcList = document.getElementById("fcList");
const quizStart = document.getElementById("quizStart");
const quizBox = document.getElementById("quizBox");

const buildGlossary = document.getElementById("buildGlossary");
const glossaryBox = document.getElementById("glossaryBox");

const todoInput = document.getElementById("todoInput");
const todoAdd = document.getElementById("todoAdd");
const todoList = document.getElementById("todoList");

const statWords = document.getElementById("statWords");
const statRead = document.getElementById("statRead");
const byTag = document.getElementById("byTag");
const byDay = document.getElementById("byDay");

const roleChange = document.getElementById("roleChange");
const applyRole = document.getElementById("applyRole");
const newTagInput = document.getElementById("newTagInput");
const addTagBtn = document.getElementById("addTagBtn");
const tagsList = document.getElementById("tagsList");
const lockSetInput = document.getElementById("lockSetInput");
const setPassBtn = document.getElementById("setPassBtn");
const clearPassBtn = document.getElementById("clearPassBtn");
const spellToggle = document.getElementById("spellToggle");
const fontSm = document.getElementById("fontSm");
const fontMd = document.getElementById("fontMd");
const fontLg = document.getElementById("fontLg");

/* -------------- Role defaults and tags -------------- */
const DEFAULT_TAGS = {
  writer: ["Chapter","Character","Theme","Notes","Draft","Idea"],
  journalist: ["Interview","Quote","Source","Politics","Economy","Breaking"],
  student: ["Finance","Strategy","Leadership","Operations","Exam","Project"],
  other: ["General","Personal","Ideas","Tasks"]
};
function tagsKey(){ return TAGS_KEY_NS + (localStorage.getItem(ROLE_KEY) || "other"); }
function loadTags(){ return JSON.parse(localStorage.getItem(tagsKey())) || DEFAULT_TAGS[localStorage.getItem(ROLE_KEY) || "other"]; }
function saveTags(arr){ localStorage.setItem(tagsKey(), JSON.stringify(arr)); }
function initTagDropdowns(){
  const tags = loadTags();
  const selects = [entryTag, editTag, filterTag, compileTagOnly];
  selects.forEach(sel=>{
    sel.innerHTML = "";
    if(sel !== filterTag && sel !== compileTagOnly){
      const opt0 = document.createElement("option"); opt0.value=""; opt0.textContent="No tag"; sel.appendChild(opt0);
    }else{
      const op = document.createElement("option"); op.value=""; op.textContent= sel===filterTag ? "All tags" : "Compile all";
      sel.appendChild(op);
    }
    tags.forEach(t=>{
      const o = document.createElement("option"); o.value=t; o.textContent=t; sel.appendChild(o);
    });
  });
  renderTagsManager();
}

/* -------------- Landing and role selection -------------- */
function showLandingIfNeeded(){
  const role = localStorage.getItem(ROLE_KEY);
  if(!role){ landing.style.display="grid"; }
  else {
    landing.style.display="none";
    roleSelect.value = role;
    roleChange.value = role;
    initTagDropdowns();
  }
}
continueBtn.addEventListener("click", ()=>{
  const role = roleSelect.value || "other";
  localStorage.setItem(ROLE_KEY, role);
  landing.style.display="none";
  roleChange.value = role;
  initTagDropdowns();
});

/* -------------- Passcode lock -------------- */
async function sha256(str){
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
}
function checkLockAtStart(){
  const has = localStorage.getItem(LOCK_HASH_KEY);
  if(has){ lockOverlay.style.display="grid"; }
}
unlockBtn.addEventListener("click", async ()=>{
  const tryPass = lockInput.value;
  const tryHash = await sha256(tryPass);
  if(tryHash === localStorage.getItem(LOCK_HASH_KEY)){
    lockOverlay.style.display="none"; lockStatus.textContent="";
    lockInput.value="";
  } else {
    lockStatus.textContent = "Wrong passcode";
  }
});
lockBtn.addEventListener("click", ()=>{ lockOverlay.style.display="grid"; });

setPassBtn.addEventListener("click", async ()=>{
  if(!lockSetInput.value){ alert("Enter passcode"); return; }
  const h = await sha256(lockSetInput.value);
  localStorage.setItem(LOCK_HASH_KEY, h);
  lockSetInput.value="";
  alert("Passcode set");
});
clearPassBtn.addEventListener("click", ()=>{
  localStorage.removeItem(LOCK_HASH_KEY);
  alert("Passcode cleared");
});

/* -------------- Theme and font -------------- */
if(localStorage.getItem("theme")==="light"){ document.body.classList.add("light"); themeToggle.textContent="☀️"; }
themeToggle.addEventListener("click", ()=>{
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  themeToggle.textContent = isLight ? "☀️" : "🌙";
});
spellToggle.addEventListener("change", ()=>{
  transcript.spellcheck = spellToggle.checked;
  editBody.spellcheck = spellToggle.checked;
});
fontSm.addEventListener("click", ()=>{ document.documentElement.style.fontSize="14px"; });
fontMd.addEventListener("click", ()=>{ document.documentElement.style.fontSize="16px"; });
fontLg.addEventListener("click", ()=>{ document.documentElement.style.fontSize="18px"; });

/* -------------- List render with drag drop -------------- */
function fmtDate(ts){ const d=new Date(ts); return d.toLocaleString(); }
function escapeHtml(s){ return (s||"").replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c])); }
function shorten(s,n){ return s && s.length>n ? s.slice(0,n)+" ..." : s; }

function renderList(){
  const q = (searchBox.value||"").toLowerCase();
  const tag = filterTag.value;
  const order = sortOrder.value;
  entriesList.innerHTML = "";

  let arr = entries
    .filter(e=>!tag || e.tag===tag)
    .filter(e=>((e.title||"")+" "+(e.body||"")).toLowerCase().includes(q));

  arr.sort((a,b)=> order==="desc" ? b.createdAt-a.createdAt : a.createdAt-b.createdAt);

  if(arr.length===0){
    entriesList.innerHTML = `<div class="status">No entries yet</div>`;
    return;
  }
  for(const e of arr){
    const el = document.createElement("div");
    el.className="entry";
    el.dataset.id = e.id;
    el.innerHTML = `
      <div class="entry-header">
        <div>
          <div class="entry-title">${escapeHtml(e.title||"Untitled entry")}</div>
          <div class="status">${fmtDate(e.createdAt)} ${e.tag?`<span class="pill">${escapeHtml(e.tag)}</span>`:""}</div>
        </div>
        <div class="toolbar">
          <button class="ghost" data-id="${e.id}" data-action="edit">Open</button>
          <button class="ghost" data-id="${e.id}" data-action="trash">Delete</button>
          ${e.audioDataURL ? `<a class="ghost" href="${e.audioDataURL}" download="audio.webm">Audio</a>` : ""}
        </div>
      </div>
      <div class="entry-body">${escapeHtml(shorten(e.body||"", 240))}</div>
    `;
    entriesList.appendChild(el);
  }
  enableDragDrop();
}
function enableDragDrop(){
  const items = document.querySelectorAll("#entriesList .entry");
  items.forEach(item=>{
    item.draggable = true;
    item.addEventListener("dragstart", ev=>ev.dataTransfer.setData("id", item.dataset.id));
    item.addEventListener("dragover", ev=>ev.preventDefault());
    item.addEventListener("drop", ev=>{
      ev.preventDefault();
      const fromId = ev.dataTransfer.getData("id");
      const toId = item.dataset.id;
      if(!fromId || fromId===toId) return;
      const fromIndex = entries.findIndex(x=>x.id===fromId);
      const toIndex = entries.findIndex(x=>x.id===toId);
      const [moved] = entries.splice(fromIndex,1);
      entries.splice(toIndex,0,moved);
      saveEntries(entries); renderList();
    });
  });
}

/* -------------- Create entry -------------- */
saveEntryBtn.addEventListener("click", ()=>{
  const body = (transcript.value||"").trim();
  if(!body){ alert("Please record or type something first"); return; }
  const obj = {
    id: crypto.randomUUID(),
    title: (entryTitle.value||"").trim(),
    tag: entryTag.value,
    body,
    createdAt: Date.now(),
    audioDataURL: audioPlayer.dataset.lastAudio || ""
  };
  entries.push(obj); saveEntries(entries);
  transcript.value=""; entryTitle.value=""; entryTag.value="";
  accumulatedText=""; audioPlayer.removeAttribute("data-last-audio"); audioPlayer.style.display="none"; audioPlayer.src="";
  renderList(); updateCalendar(); updateDash();
});

/* -------------- Edit entry -------------- */
entriesList.addEventListener("click", ev=>{
  const btn = ev.target.closest("button"); if(!btn) return;
  const id = btn.dataset.id; const action = btn.dataset.action;
  if(action==="trash"){
    if(confirm("Delete this entry")){ entries = entries.filter(x=>x.id!==id); saveEntries(entries); renderList(); updateCalendar(); updateDash(); }
  } else if(action==="edit"){ openEditor(id); }
});
function openEditor(id){
  selectedId = id;
  const item = entries.find(x=>x.id===id); if(!item) return;
  setTab("edit");
  editTitle.value = item.title||""; editTag.value=item.tag||""; editBody.value=item.body||""; editDate.textContent = fmtDate(item.createdAt);
}
saveEdit.addEventListener("click", ()=>{
  if(!selectedId) return;
  const idx = entries.findIndex(x=>x.id===selectedId); if(idx===-1) return;
  entries[idx].title = (editTitle.value||"").trim();
  entries[idx].tag = editTag.value;
  entries[idx].body = editBody.value;
  saveEntries(entries); renderList(); alert("Saved");
});
deleteEdit.addEventListener("click", ()=>{
  if(!selectedId) return;
  if(confirm("Delete this entry")){ entries = entries.filter(x=>x.id!==selectedId); saveEntries(entries); selectedId=null; renderList(); setTab("compile"); updateCalendar(); updateDash(); }
});

/* -------------- Compile and export -------------- */
function buildCompiled(srcArr){
  const blocks = srcArr.map(e=>{
    const title = e.title ? `\n${e.title}\n` : "";
    const tag = e.tag ? ` [${e.tag}]` : "";
    return `[${fmtDate(e.createdAt)}]${tag}\n${title}${e.body}\n\n---\n`;
  });
  return blocks.join("");
}
compileBtn.addEventListener("click", ()=>{ manuscriptEl.value = buildCompiled(entries); updateCounts(); updateProgress(); });
compileByTagBtn.addEventListener("click", ()=>{
  const t = compileTagOnly.value;
  const arr = t ? entries.filter(e=>e.tag===t) : entries;
  manuscriptEl.value = buildCompiled(arr); updateCounts(); updateProgress();
});

downloadTxt.addEventListener("click", ()=>{
  const blob = new Blob([manuscriptEl.value||""], {type:"text/plain;charset=utf-8"});
  saveAs(blob, `BookWeave_${new Date().toISOString().slice(0,10)}.txt`);
});
downloadPdf.addEventListener("click", ()=>{
  const { jsPDF } = window.jspdf; const doc = new jsPDF();
  const lines = doc.splitTextToSize(manuscriptEl.value||"", 180);
  doc.text(lines, 15, 20); doc.save(`BookWeave_${new Date().toISOString().slice(0,10)}.pdf`);
});
downloadDocx.addEventListener("click", async ()=>{
  const { Document, Packer, Paragraph, TextRun } = window.docx;
  const paras = (manuscriptEl.value||"").split("\n").map(l=>new Paragraph({children:[new TextRun(l)]}));
  const doc = new Document({sections:[{children:paras}]});
  const blob = await Packer.toBlob(doc); saveAs(blob, `BookWeave_${new Date().toISOString().slice(0,10)}.docx`);
});
downloadEpub.addEventListener("click", async ()=>{
  const zip = new JSZip();
  // Required mimetype stored without compression
  zip.file("mimetype", "application/epub+zip", {compression:"STORE"});
  zip.file("META-INF/container.xml",
`<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
</container>`);
  const content = escapeXml(manuscriptEl.value||"");
  zip.file("OEBPS/content.xhtml",
`<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml"><head><title>BookWeave</title></head><body><pre>${content}</pre></body></html>`);
  zip.file("OEBPS/content.opf",
`<?xml version="1.0" encoding="UTF-8"?>
<package version="3.0" unique-identifier="BookId" xmlns="http://www.idpf.org/2007/opf">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>BookWeave</dc:title></metadata>
  <manifest><item id="c1" href="content.xhtml" media-type="application/xhtml+xml"/></manifest>
  <spine><itemref idref="c1"/></spine>
</package>`);
  const blob = await zip.generateAsync({type:"blob"});
  saveAs(blob, `BookWeave_${new Date().toISOString().slice(0,10)}.epub`);
});
function escapeXml(s){ return (s||"").replace(/[<>&'"]/g,c=>({"<":"&lt;","&":"&amp;",">":"&gt;","'":"&apos;","\"":"&quot;"}[c])); }

exportPptx.addEventListener("click", ()=>{
  const pptx = new PptxGenJS();
  const arr = entries.length? entries: [];
  arr.forEach(e=>{
    const slide = pptx.addSlide();
    slide.addText(e.title||"Untitled", {x:0.5, y:0.4, w:9, h:1, fontSize:24, bold:true});
    slide.addText((e.body||"").slice(0,900), {x:0.5, y:1.2, w:9, h:4.5, fontSize:14});
  });
  pptx.writeFile({ fileName:`BookWeave_Outline_${new Date().toISOString().slice(0,10)}.pptx` });
});

/* -------------- Summarizer and keywords -------------- */
summarizeBtn.addEventListener("click", ()=>{
  const text = manuscriptEl.value||"";
  if(!text.trim()){ summaryBox.textContent = "Nothing to summarize"; return; }
  const sentences = text.split(/(?<=[\.!\?])\s+/);
  const words = text.toLowerCase().replace(/[^a-z\s]/g," ").split(/\s+/).filter(w=>w.length>3);
  const stop = new Set(["this","that","with","have","from","about","your","their","there","which","were","been","they","them","will","would","could","should","into","because","after","before","such"]);
  const freq = {};
  for(const w of words){ if(!stop.has(w)) freq[w]=(freq[w]||0)+1; }
  const scored = sentences.map(s=>{
    let score=0; for(const k in freq){ if(s.toLowerCase().includes(k)) score+=freq[k]; }
    return {s,score};
  }).sort((a,b)=>b.score-a.score);
  const top = scored.slice(0,3).map(x=>x.s).join(" ");
  summaryBox.textContent = "Summary: " + top;
});
analyzeKeywords.addEventListener("click", ()=>{
  const text = manuscriptEl.value||"";
  const words = text.toLowerCase().replace(/[^a-z\s]/g," ").split(/\s+/).filter(w=>w.length>3);
  const freq = {};
  for(const w of words){ freq[w]=(freq[w]||0)+1; }
  const top = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,30);
  keywordsBox.textContent = top.map(([w,c])=>`${w}: ${c}`).join("\n");
});

/* -------------- Thesaurus sample -------------- */
const SYN = {
  happy:["content","cheerful","pleased","joyful"],
  quick:["fast","rapid","swift","hasty"],
  important:["crucial","vital","essential","significant"]
};
synBtn.addEventListener("click", ()=>{
  const w = (synInput.value||"").toLowerCase().trim();
  const out = SYN[w] ? SYN[w].join(", ") : "No local synonyms";
  synOut.textContent = out;
});

/* -------------- Redaction -------------- */
function redactInText(val, w){ const rx = new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"), "gi"); return val.replace(rx, "[REDACTED]"); }
redactInEdit.addEventListener("click", ()=>{ if(!redactWord.value.trim()) return; editBody.value = redactInText(editBody.value||"", redactWord.value.trim()); });
redactInCompiled.addEventListener("click", ()=>{ if(!redactWord.value.trim()) return; manuscriptEl.value = redactInText(manuscriptEl.value||"", redactWord.value.trim()); });

/* -------------- Citation helper -------------- */
citAPA.addEventListener("click", ()=>{
  const a=citAuthor.value, y=citYear.value, t=citTitle.value, s=citSource.value;
  citOut.textContent = `${a}. (${y}). ${t}. ${s}.`;
});
citHarvard.addEventListener("click", ()=>{
  const a=citAuthor.value, y=citYear.value, t=citTitle.value, s=citSource.value;
  citOut.textContent = `${a} (${y}) ${t}. ${s}.`;
});

/* -------------- Flashcards and quiz -------------- */
function loadFC(){ return JSON.parse(localStorage.getItem(FC_KEY)||"[]"); }
function saveFC(arr){ localStorage.setItem(FC_KEY, JSON.stringify(arr)); }
function renderFC(){
  const fc = loadFC();
  fcList.textContent = fc.length? fc.map(x=>`Q: ${x.q}  A: ${x.a}`).join("\n") : "No cards";
}
fcAdd.addEventListener("click", ()=>{
  const q=fcQ.value.trim(), a=fcA.value.trim(); if(!q||!a) return;
  const arr = loadFC(); arr.push({q,a}); saveFC(arr); fcQ.value=""; fcA.value=""; renderFC();
});
fcClear.addEventListener("click", ()=>{ if(confirm("Clear all")){ saveFC([]); renderFC(); } });
quizStart.addEventListener("click", ()=>{
  const arr = loadFC(); if(arr.length<2){ quizBox.textContent="Need at least two cards"; return; }
  const i = Math.floor(Math.random()*arr.length);
  const correct = arr[i];
  const choices = new Set([correct.a]);
  while(choices.size<4 && choices.size<arr.length){ choices.add(arr[Math.floor(Math.random()*arr.length)].a); }
  const opts = [...choices].sort(()=>Math.random()-0.5);
  quizBox.innerHTML = `<div><b>${correct.q}</b></div>` + opts.map(o=>`<button class="ghost quizOpt">${o}</button>`).join(" ");
  quizBox.querySelectorAll(".quizOpt").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      if(btn.textContent===correct.a){ quizBox.innerHTML = "Correct"; } else { quizBox.innerHTML = `Answer: ${correct.a}`; }
    });
  });
});
renderFC();

/* -------------- Glossary -------------- */
buildGlossary.addEventListener("click", ()=>{
  const text = manuscriptEl.value||"";
  const words = [...text.matchAll(/\b[A-Z][a-z]{2,}\b/g)].map(m=>m[0]);
  const freq = {}; for(const w of words){ freq[w]=(freq[w]||0)+1; }
  const items = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,50);
  glossaryBox.textContent = items.length ? items.map(([w,c])=>`${w}: ${c}`).join("\n") : "No proper nouns detected";
});

/* -------------- Checklist -------------- */
function loadTodos(){ return JSON.parse(localStorage.getItem(TODO_KEY)||"[]"); }
function saveTodos(arr){ localStorage.setItem(TODO_KEY, JSON.stringify(arr)); }
function renderTodos(){
  const arr = loadTodos();
  todoList.innerHTML = arr.map((t,i)=>`
    <div class="row" data-i="${i}">
      <label class="switch"><input type="checkbox" ${t.done?"checked":""}><span>${escapeHtml(t.text)}</span></label>
      <button class="ghost delTodo">Delete</button>
    </div>`).join("");
  todoList.querySelectorAll("input[type=checkbox]").forEach(cb=>{
    cb.addEventListener("change", ev=>{
      const i = Number(ev.target.closest(".row").dataset.i);
      const arr = loadTodos(); arr[i].done = ev.target.checked; saveTodos(arr); renderTodos();
    });
  });
  todoList.querySelectorAll(".delTodo").forEach(btn=>{
    btn.addEventListener("click", ev=>{
      const i = Number(ev.target.closest(".row").dataset.i);
      const arr = loadTodos(); arr.splice(i,1); saveTodos(arr); renderTodos();
    });
  });
}
todoAdd.addEventListener("click", ()=>{
  const text = todoInput.value.trim(); if(!text) return;
  const arr = loadTodos(); arr.push({text,done:false}); saveTodos(arr); todoInput.value=""; renderTodos();
});
renderTodos();

/* -------------- Dashboard -------------- */
function updateDash(){
  const allText = entries.map(e=>e.body||"").join(" ");
  const words = allText.trim().split(/\s+/).filter(Boolean).length;
  statWords.textContent = String(words);
  const mins = Math.max(1, Math.round(words/200));
  statRead.textContent = `${mins} min`;
  const tags = {};
  for(const e of entries){ const w = (e.body||"").trim().split(/\s+/).filter(Boolean).length; tags[e.tag||""] = (tags[e.tag||""]||0)+w; }
  byTag.textContent = Object.entries(tags).map(([t,c])=>`${t||"No tag"}: ${c}`).join("\n") || "No data";
  const days = {};
  for(const e of entries){ const d = new Date(e.createdAt).toISOString().slice(0,10); days[d]=(days[d]||0)+1; }
  byDay.textContent = Object.entries(days).sort().map(([d,c])=>`${d}: ${c}`).join("\n") || "No data";
}

/* -------------- Tabs -------------- */
function setTab(name){
  compileView.style.display = name==="compile"?"block":"none";
  editView.style.display = name==="edit"?"block":"none";
  calendarView.style.display = name==="calendar"?"block":"none";
  toolsView.style.display = name==="tools"?"block":"none";
  dashView.style.display = name==="dashboard"?"block":"none";
  settingsView.style.display = name==="settings"?"block":"none";
  tabCompile.classList.toggle("active", name==="compile");
  tabEdit.classList.toggle("active", name==="edit");
  tabCalendar.classList.toggle("active", name==="calendar");
  tabTools.classList.toggle("active", name==="tools");
  tabDash.classList.toggle("active", name==="dashboard");
  tabSettings.classList.toggle("active", name==="settings");
  if(name==="calendar") updateCalendar();
  if(name==="dashboard") updateDash();
}
tabCompile.addEventListener("click", ()=>setTab("compile"));
tabEdit.addEventListener("click", ()=>setTab("edit"));
tabCalendar.addEventListener("click", ()=>setTab("calendar"));
tabTools.addEventListener("click", ()=>setTab("tools"));
tabDash.addEventListener("click", ()=>setTab("dashboard"));
tabSettings.addEventListener("click", ()=>setTab("settings"));

/* -------------- Word counts -------------- */
function updateCounts(){
  const words = (manuscriptEl.value||"").trim().split(/\s+/).filter(Boolean).length;
  countStats.textContent = `Words ${words}`;
}
function updateProgress(){
  const words = (manuscriptEl.value||"").trim().split(/\s+/).filter(Boolean).length;
  const goal = 50000;
  const pct = ((words/goal)*100).toFixed(1);
  progressStats.textContent = `Total ${words} of ${goal} words  ${pct}%`;
}
manuscriptEl.addEventListener("input", ()=>{ updateCounts(); updateProgress(); });

/* -------------- Calendar -------------- */
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();
function updateCalendar(){
  calendarGrid.innerHTML = "";
  calendarTitle.textContent = `${new Date(calYear, calMonth).toLocaleString("default",{month:"long"})} ${calYear}`;
  const weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  weekdays.forEach(w=>{ const d=document.createElement("div"); d.textContent=w; d.style.fontWeight="700"; d.style.opacity=".85"; calendarGrid.appendChild(d); });
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const days = new Date(calYear, calMonth+1, 0).getDate();
  for(let i=0;i<firstDay;i++){ calendarGrid.appendChild(document.createElement("div")); }
  for(let d=1; d<=days; d++){
    const cell = document.createElement("div"); cell.textContent = d;
    const hasEntry = entries.some(e=>{ const ed=new Date(e.createdAt); return ed.getFullYear()===calYear && ed.getMonth()===calMonth && ed.getDate()===d; });
    cell.classList.add(hasEntry?"has-entry":"no-entry");
    calendarGrid.appendChild(cell);
  }
}
prevMonth.addEventListener("click", ()=>{ if(calMonth===0){calMonth=11;calYear--;} else calMonth--; updateCalendar(); });
nextMonth.addEventListener("click", ()=>{ if(calMonth===11){calMonth=0;calYear++;} else calMonth++; updateCalendar(); });

/* -------------- Voice recognition with timestamps and flags -------------- */
let recog = null; let listening = false;
function hasSpeech(){ return "webkitSpeechRecognition" in window || "SpeechRecognition" in window; }
function makeRecognizer(){
  const R = window.SpeechRecognition || window.webkitSpeechRecognition;
  const r = new R();
  r.lang = navigator.language || "en-US";
  r.interimResults = true;
  r.continuous = true;
  r.onresult = ev=>{
    let interim=""; for(let i=ev.resultIndex;i<ev.results.length;i++){
      const res=ev.results[i];
      if(res.isFinal){ accumulatedText += res[0].transcript + " "; }
      else { interim += res[0].transcript; }
    }
    transcript.value = accumulatedText + interim;
  };
  r.onstart = ()=> setLive(true);
  r.onend = ()=> setLive(false);
  r.onerror = ()=> setLive(false);
  return r;
}
function setLive(on){
  listening = on;
  dot.style.opacity = on ? "1" : ".12";
  recBubble.classList.toggle("live", on);
  recStatus.textContent = on ? "Listening. Speak at a normal pace" : "Recording idle. You can type instead";
  if(on && autoTs.checked){
    if(tsTimer) clearInterval(tsTimer);
    const t0 = Date.now();
    tsTimer = setInterval(()=>{
      const sec = Math.floor((Date.now()-t0)/1000);
      const hh = String(Math.floor(sec/3600)).padStart(2,"0");
      const mm = String(Math.floor((sec%3600)/60)).padStart(2,"0");
      const ss = String(sec%60).padStart(2,"0");
      transcript.value = (transcript.value||"") + ` [${hh}:${mm}:${ss}] `;
    }, 60000);
  } else {
    if(tsTimer) clearInterval(tsTimer), tsTimer=null;
  }
}
startBtn.addEventListener("click", ()=>{
  if(!hasSpeech()){ alert("Speech recognition is not available in this browser"); return; }
  if(listening) return;
  recog = makeRecognizer(); try{ recog.start(); }catch{}
});
stopBtn.addEventListener("click", ()=>{ if(recog){ try{ recog.stop(); }catch{} } });
micTest.addEventListener("click", ()=>{ alert("If recording does not start please use Chrome on Android or Safari on iOS and allow microphone permission"); });
markSpeakerA.addEventListener("click", ()=>{ transcript.value = (transcript.value||"") + " [Speaker A] "; });
markSpeakerB.addEventListener("click", ()=>{ transcript.value = (transcript.value||"") + " [Speaker B] "; });
flagBtn.addEventListener("click", ()=>{ transcript.value = (transcript.value||"") + " [FLAG] "; });

/* -------------- Audio capture and download -------------- */
async function getMic(){ return await navigator.mediaDevices.getUserMedia({audio:true}); }
audioRecBtn.addEventListener("click", async ()=>{
  try{
    const stream = await getMic();
    audioRecorder = new MediaRecorder(stream); audioChunks = [];
    audioRecorder.ondataavailable = e=>{ if(e.data.size>0) audioChunks.push(e.data); };
    audioRecorder.onstop = async ()=>{
      const blob = new Blob(audioChunks, {type:"audio/webm"});
      const url = URL.createObjectURL(blob);
      audioPlayer.src = url; audioPlayer.style.display="block";
      audioPlayer.dataset.lastAudio = await blobToDataURL(blob);
    };
    audioRecorder.start();
  }catch{ alert("Microphone not available"); }
});
audioStopBtn.addEventListener("click", ()=>{ if(audioRecorder && audioRecorder.state!=="inactive") audioRecorder.stop(); });
audioDownloadBtn.addEventListener("click", ()=>{
  if(!audioPlayer.src){ alert("No audio recorded"); return; }
  fetch(audioPlayer.src).then(r=>r.blob()).then(b=>saveAs(b,"audio.webm"));
});
function blobToDataURL(blob){ return new Promise(r=>{ const fr=new FileReader(); fr.onload=()=>r(fr.result); fr.readAsDataURL(blob); }); }

/* -------------- Settings: role and tags -------------- */
applyRole.addEventListener("click", ()=>{
  const val = roleChange.value || "other";
  localStorage.setItem(ROLE_KEY, val);
  saveTags(DEFAULT_TAGS[val]); initTagDropdowns(); alert("Role applied");
});
addTagBtn.addEventListener("click", ()=>{
  const t = newTagInput.value.trim(); if(!t) return;
  const arr = loadTags(); if(!arr.includes(t)){ arr.push(t); saveTags(arr); initTagDropdowns(); newTagInput.value=""; }
});
function renderTagsManager(){
  const arr = loadTags();
  tagsList.innerHTML = arr.map((t,i)=>`<div class="row"><div>${escapeHtml(t)}</div><button data-i="${i}" class="ghost delTag">Delete</button></div>`).join("");
  tagsList.querySelectorAll(".delTag").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const i = Number(btn.dataset.i); const arr = loadTags(); arr.splice(i,1); saveTags(arr); initTagDropdowns();
    });
  });
}

/* -------------- Search filters -------------- */
searchBox.addEventListener("input", renderList);
filterTag.addEventListener("change", renderList);
sortOrder.addEventListener("change", renderList);

/* -------------- Init -------------- */
function init(){
  const role = localStorage.getItem(ROLE_KEY);
  if(role){ roleChange.value = role; }
  showLandingIfNeeded();
  transcript.spellcheck = true;
  editBody.spellcheck = true;
  renderList();
  setTab("compile");
  updateCounts(); updateProgress();
  updateCalendar();
  updateDash();
}
checkLockAtStart();
init();
