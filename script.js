
/* =====================================================
   HOLY BIBLE ONLINE
   COMPLETE WEBSITE FUNCTIONALITY
   King James Version (KJV)
===================================================== */

// =====================================================
// 1. BIBLE BOOKS
// =====================================================

const oldTestamentBooks = [
  ["Genesis", 50], ["Exodus", 40], ["Leviticus", 27],
  ["Numbers", 36], ["Deuteronomy", 34], ["Joshua", 24],
  ["Judges", 21], ["Ruth", 4], ["1 Samuel", 31],
  ["2 Samuel", 24], ["1 Kings", 22], ["2 Kings", 25],
  ["1 Chronicles", 29], ["2 Chronicles", 36], ["Ezra", 10],
  ["Nehemiah", 13], ["Esther", 10], ["Job", 42],
  ["Psalms", 150], ["Proverbs", 31], ["Ecclesiastes", 12],
  ["Song of Solomon", 8], ["Isaiah", 66], ["Jeremiah", 52],
  ["Lamentations", 5], ["Ezekiel", 48], ["Daniel", 12],
  ["Hosea", 14], ["Joel", 3], ["Amos", 9], ["Obadiah", 1],
  ["Jonah", 4], ["Micah", 7], ["Nahum", 3], ["Habakkuk", 3],
  ["Zephaniah", 3], ["Haggai", 2], ["Zechariah", 14],
  ["Malachi", 4]
].map(([name, chapters]) => ({
  name,
  chapters,
  testament: "old"
}));

const newTestamentBooks = [
  ["Matthew", 28], ["Mark", 16], ["Luke", 24], ["John", 21],
  ["Acts", 28], ["Romans", 16], ["1 Corinthians", 16],
  ["2 Corinthians", 13], ["Galatians", 6], ["Ephesians", 6],
  ["Philippians", 4], ["Colossians", 4],
  ["1 Thessalonians", 5], ["2 Thessalonians", 3],
  ["1 Timothy", 6], ["2 Timothy", 4], ["Titus", 3],
  ["Philemon", 1], ["Hebrews", 13], ["James", 5],
  ["1 Peter", 5], ["2 Peter", 3], ["1 John", 5],
  ["2 John", 1], ["3 John", 1], ["Jude", 1],
  ["Revelation", 22]
].map(([name, chapters]) => ({
  name,
  chapters,
  testament: "new"
}));

const allBooks = [
  ...oldTestamentBooks,
  ...newTestamentBooks
];

// =====================================================
// 2. DAILY VERSES
// =====================================================

const dailyVerses = [
  {
    text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.",
    reference: "Proverbs 3:5",
    message: "You do not need to understand every step. Trust God as you move forward."
  },
  {
    text: "I can do all things through Christ which strengtheneth me.",
    reference: "Philippians 4:13",
    message: "When life feels difficult, remember that you can seek strength through Christ."
  },
  {
    text: "Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.",
    reference: "Joshua 1:9",
    message: "Face today's challenges with courage. You are not walking through them alone."
  },
  {
    text: "The LORD is my shepherd; I shall not want.",
    reference: "Psalm 23:1",
    message: "Let this reminder bring peace when you feel uncertain about tomorrow."
  },
  {
    text: "Fear thou not; for I am with thee: be not dismayed: for I am thy God: I will strengthen thee.",
    reference: "Isaiah 41:10",
    message: "Take things one day at a time. You can bring your worries to God."
  },
  {
    text: "This is the day which the LORD hath made; we will rejoice and be glad in it.",
    reference: "Psalm 118:24",
    message: "Look for one good thing today, even if life is not perfect."
  },
  {
    text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles.",
    reference: "Isaiah 40:31",
    message: "Rest is not failure. Give yourself time to grow, recover, and begin again."
  },
  {
    text: "And we know that all things work together for good to them that love God.",
    reference: "Romans 8:28",
    message: "Your current situation is not necessarily the end of your story."
  },
  {
    text: "Cast thy burden upon the LORD, and he shall sustain thee.",
    reference: "Psalm 55:22",
    message: "You do not have to carry every burden by yourself."
  },
  {
    text: "Let all your things be done with charity.",
    reference: "1 Corinthians 16:14",
    message: "Let kindness guide the way you speak, work, and treat other people."
  },
  {
    text: "The LORD is good, a strong hold in the day of trouble; and he knoweth them that trust in him.",
    reference: "Nahum 1:7",
    message: "Remember that difficult days do not erase the possibility of hope."
  },
  {
    text: "Commit thy works unto the LORD, and thy thoughts shall be established.",
    reference: "Proverbs 16:3",
    message: "Do your best today, dedicate your work to God, and take the next step."
  }
];

// =====================================================
// 3. WEBSITE ELEMENTS AND VARIABLES
// =====================================================

const $ = id => document.getElementById(id);

const booksContent = $("booksContent");
const bookSearch = $("bookSearch");
const chapterSelect = $("chapterSelect");
const readerContent = $("readerContent");
const readerCard = $("reader");
const searchInput = $("searchInput");
const searchResults = $("searchResults");

// CREATE CLEAR SEARCH BUTTON AUTOMATICALLY

const clearSearchButton = document.createElement("button");

clearSearchButton.type = "button";
clearSearchButton.id = "clearSearchButton";
clearSearchButton.textContent = window.bibleT("Clear Search");
clearSearchButton.hidden = true;

clearSearchButton.style.cssText = [
  "display:none",
  "margin:12px 0",
  "padding:10px 16px",
  "border:1px solid #174b38",
  "border-radius:8px",
  "background:#174b38",
  "color:#fff",
  "font-size:14px",
  "cursor:pointer"
].join(";");

// PLACE BUTTON BEFORE SEARCH RESULTS

searchResults.insertAdjacentElement(
  "beforebegin",
  clearSearchButton
);

function showClearSearchButton(show = true) {

  clearSearchButton.hidden = !show;

  clearSearchButton.style.display =
    show ? "inline-block" : "none";

}

// CLEAR SEARCH FUNCTION

clearSearchButton.addEventListener("click", () => {

  // Cancel any pending search request.
  searchRequestNumber++;

  // Clear search field.
  searchInput.value = "";

  // Reset search variables.
  currentSearchQuery = "";
  currentSearchOffset = 0;
  currentSearchTotal = 0;

  // Remove search results.
  searchResults.replaceChildren();

  // Hide clear button.
  showClearSearchButton(false);

  // Return focus to search input.
  searchInput.focus();

});

let activeFilter = "all";
let activeBook = null;
let currentChapter = null;
let currentVerses = [];

let requestNumber = 0;
let toastTimer;

let currentSearchQuery = "";
let currentSearchOffset = 0;
let currentSearchTotal = 0;
let searchRequestNumber = 0;

const SEARCH_LIMIT = 50;

// Bible reading translations. KJV and the public-domain 1905 Tagalog
// translation use bible-api.com; additional free Philippine languages
// are discovered from the Free Use Bible API's live, licensed catalogue.
const translationPicker = $("bibleTranslation");
const PHILIPPINE_LANGUAGES = {
  ceb: "Cebuano / Bisaya", cebuan: "Cebuano / Bisaya",
  war: "Waray-Waray", ilo: "Ilocano", hil: "Hiligaynon / Ilonggo",
  pam: "Kapampangan", bik: "Bikol", pag: "Pangasinan",
  bcl: "Bikol", tgl: "Tagalog", fil: "Filipino", tl: "Tagalog"
};
const additionalEditions = new Map();
const editionBooks = new Map();
let activeTranslation = ["kjv", "tagalog"].includes(localStorage.getItem("holyBibleTranslation"))
  ? localStorage.getItem("holyBibleTranslation") : "kjv";
translationPicker.value = activeTranslation;

async function discoverPhilippineEditions() {
  try {
    const response = await fetch("https://bible.helloao.org/api/available_translations.json");
    if (!response.ok) throw new Error("Translation catalogue unavailable");
    const catalogue = await response.json();
    for (const item of (catalogue.translations || [])) {
      const language = String(item.language || "").toLowerCase();
      const name = PHILIPPINE_LANGUAGES[language];
      if (!name || language === "tgl" || language === "fil" || language === "tl") continue;
      // Only display full Bibles with explicitly usable commercial permissions.
      // All required attribution is shown underneath the reader.
      if (Number(item.numberOfBooks) < 66 || item.license?.commercialUse !== "allowed") continue;
      if (!item.id) continue;
      const key = `ao:${item.id}`;
      additionalEditions.set(key, item);
      const option = document.createElement("option");
      option.value = key;
      option.textContent = `${name} — ${item.name || item.shortName || item.id}`;
      translationPicker.append(option);
    }
    const saved = localStorage.getItem("holyBibleTranslation");
    if (saved && additionalEditions.has(saved)) {
      activeTranslation = saved;
      translationPicker.value = saved;
      if (activeBook) loadChapter(currentChapter || 1);
      window.applyBibleLanguage?.();
      refreshDailyTranslation();
    }
  } catch (error) {
    console.warn("Extra Philippine Bible editions unavailable:", error);
  }
}

translationPicker.addEventListener("change", () => {
  activeTranslation = translationPicker.value;
  localStorage.setItem("holyBibleTranslation", activeTranslation);
  // Invalidate the old chapter request before a language change.
  ++requestNumber;
  if (activeBook) loadChapter(currentChapter || 1);
  else showToast("Bible language selected. Choose a book to read.");
  window.applyBibleLanguage?.();
  refreshDailyTranslation();
  renderBooks();
  renderFavorites();
  updateProgress();
});

discoverPhilippineEditions();

async function fetchAdditionalEdition(book, chapter, edition = activeTranslation) {
  const meta = additionalEditions.get(edition);
  if (!meta) throw new Error("Selected edition is unavailable");
  let books = editionBooks.get(edition);
  if (!books) {
    const response = await fetch(`https://bible.helloao.org/api/${encodeURIComponent(meta.id)}/books.json`);
    if (!response.ok) throw new Error("Could not load edition books");
    books = (await response.json()).books || [];
    editionBooks.set(edition, books);
  }
  const bookNumber = allBooks.findIndex(item => item.name === book.name);
  const selected = books.find(item => Number(item.order) === bookNumber + 1) || books[bookNumber];
  if (!selected?.id) throw new Error("This book is unavailable in the selected translation");
  const response = await fetch(`https://bible.helloao.org/api/${encodeURIComponent(meta.id)}/${encodeURIComponent(selected.id)}/${chapter}.simple.json`);
  if (!response.ok) throw new Error("Could not load this translated chapter");
  const data = await response.json();
  const verses = (data.chapter?.content || [])
    .filter(item => item.type === "verse")
    .map(item => ({verse: Number(item.number), text: String(item.text || "").trim()}))
    .filter(item => Number.isFinite(item.verse) && item.text);
  if (!verses.length) throw new Error("No verses in translated chapter");
  return {verses};
}

function updateEditionCredit() {
  let credit = $("translationCredit");
  if (!credit) {
    credit = document.createElement("p");
    credit.id = "translationCredit";
    credit.className = "reader-note";
    $("readerContent").insertAdjacentElement("afterend", credit);
  }
  const meta = additionalEditions.get(activeTranslation);
  credit.textContent = meta ? [meta.name, meta.licenseNotice || "", meta.licenseUrl || ""].filter(Boolean).join(" · ") :
    activeTranslation === "tagalog" ? "Ang Dating Biblia (1905) — public domain · Bible text via bible-api.com" :
    "King James Version — Bible text via bible-api.com";
}

// Daily verses are fetched in the selected Bible edition rather than translated by AI.
let dailyTranslationRequest = 0;
async function refreshDailyTranslation() {
  const ticket = ++dailyTranslationRequest;
  const reference = $("daily").dataset.reference;
  if (!reference) return;
  const original = dailyVerses.find(v => v.reference === reference);
  const baseText = original?.text || $("daily").dataset.text;
  if (activeTranslation === "kjv") {
    $("dailyVerse").textContent = baseText;
    $("daily").dataset.text = baseText;
    $("dailyMessage").textContent = original?.message || "";
    window.applyBibleLanguage?.();
    return;
  }
  $("dailyVerse").textContent = window.bibleT("Loading Scripture...");
  $("dailyMessage").textContent = window.bibleT?.("Daily verse is shown in the selected Bible edition.") || "Daily verse is shown in the selected Bible edition.";
  try {
    let text = "";
    if (activeTranslation.startsWith("ao:")) {
      const match = reference.match(/^(.*?)\s+(\d+):(\d+)$/);
      if (!match) throw new Error("Invalid daily reference");
      const book = allBooks.find(b => b.name.toLowerCase() === match[1].toLowerCase() || b.name.toLowerCase() === (match[1] === "Psalm" ? "Psalms" : match[1]).toLowerCase());
      if (!book) throw new Error("Unknown daily book");
      const savedTranslation = activeTranslation;
      const data = await fetchAdditionalEdition(book, Number(match[2]));
      if (savedTranslation !== activeTranslation) return;
      text = data.verses.find(v => v.verse === Number(match[3]))?.text || "";
    } else {
      const data = await fetchPassage(reference, activeTranslation);
      text = data.verses.map(v => v.text.trim()).join(" ");
    }
    if (ticket !== dailyTranslationRequest) return;
    if (!text) throw new Error("No daily verse in edition");
    $("dailyVerse").textContent = text;
    $("daily").dataset.text = text;
  } catch (error) {
    if (ticket !== dailyTranslationRequest) return;
    $("dailyVerse").textContent = window.bibleT?.("This verse is not available in the selected edition.") || "This verse is not available in the selected edition.";
    $("daily").dataset.text = "";
    console.warn("Daily verse translation unavailable:", error);
  }
  window.applyBibleLanguage?.();
}

// =====================================================
// 4. LOCAL STORAGE
// =====================================================

function loadStorage(key, fallback) {

  try {

    const value = localStorage.getItem(key);

    if (!value) return fallback;

    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : fallback;

  } catch (error) {

    console.error("Storage loading error:", error);

    return fallback;

  }

}

function saveStorage(key, value) {

  try {

    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

  } catch (error) {

    console.error("Storage saving error:", error);

    showToast("Browser storage is unavailable.");

  }

}

const readChapters = loadStorage(
  "holyBibleReadChapters",
  []
);

let favorites = loadStorage(
  "holyBibleFavorites",
  []
);

// =====================================================
// 5. NOTIFICATIONS
// =====================================================

function showToast(message) {

  const toast = $("toast");

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {

    toast.classList.remove("show");

  }, 2600);

}

// =====================================================
// 6. DAILY VERSE
// =====================================================

function displayVerse(verse) {

  $("dailyVerse").textContent = verse.text;

  $("dailyReference").textContent = verse.reference;

  $("dailyMessage").textContent = verse.message;

  $("daily").dataset.reference = verse.reference;

  $("daily").dataset.text = verse.text;

  $("daily").dataset.message = verse.message;

  $("saveDailyButton").textContent =
    favorites.some(
      item => item.reference === verse.reference
    ) ? "♥" : "♡";

}

function getDailyVerse() {

  const now = new Date();

  const dayNumber = Math.floor(
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime() / 86400000
  );

  return dailyVerses[
    ((dayNumber % dailyVerses.length) +
      dailyVerses.length) % dailyVerses.length
  ];

}

function updateDateLabel() {

  $("todayLabel").textContent =
    new Intl.DateTimeFormat(
      undefined,
      {
        month: "long",
        day: "numeric",
        year: "numeric"
      }
    ).format(new Date());

}

function randomVerse() {

  const currentReference =
    $("dailyReference").textContent;

  let choices = dailyVerses.filter(
    verse => verse.reference !== currentReference
  );

  if (!choices.length) {

    choices = dailyVerses;

  }

  const verse = choices[
    Math.floor(Math.random() * choices.length)
  ];

  displayVerse(verse);
  refreshDailyTranslation();

}

$("newVerseButton").addEventListener(
  "click",
  randomVerse
);

$("heroVerseButton").addEventListener("click", () => {

  randomVerse();

  $("daily").scrollIntoView({
    behavior: "smooth"
  });

});

$("encouragementButton").addEventListener("click", () => {

  randomVerse();

  $("daily").scrollIntoView({
    behavior: "smooth"
  });

});

$("copyDailyButton").addEventListener("click", () => {

  copyText(
    `${$("dailyVerse").textContent} — ${$("dailyReference").textContent}`
  );

});

$("saveDailyButton").addEventListener("click", () => {

  saveFavorite({
    reference: $("dailyReference").textContent,
    text: $("dailyVerse").textContent
  });

});

// =====================================================
// 7. COPY TEXT
// =====================================================

async function copyText(text) {

  try {

    if (navigator.clipboard && window.isSecureContext) {

      await navigator.clipboard.writeText(text);

    } else {

      const textarea = document.createElement("textarea");

      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";

      document.body.appendChild(textarea);

      textarea.select();

      const copied = document.execCommand("copy");

      textarea.remove();

      if (!copied) {

        throw new Error("Copy failed");

      }

    }

    showToast(window.bibleT("Verse copied to clipboard!"));

  } catch (error) {

    showToast(
      "Copy unavailable. Please select and copy the text."
    );

  }

}

// =====================================================
// 8. BIBLE BOOK SIDEBAR
// =====================================================

function renderBooks() {

  booksContent.replaceChildren();

  const query = bookSearch.value.trim().toLowerCase();

  const books = allBooks.filter(book => {

    const matchesFilter =
      activeFilter === "all" ||
      book.testament === activeFilter;

    const matchesSearch =
      book.name.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;

  });

  if (!books.length) {

    const message = document.createElement("p");

    message.className = "search-status";

    message.textContent = window.bibleT("No books found.");

    booksContent.appendChild(message);

    return;

  }

  const sections = [
    {
      key: "old",
      title: window.bibleT("Old Testament")
    },
    {
      key: "new",
      title: window.bibleT("New Testament")
    }
  ];

  sections.forEach(section => {

    const sectionBooks = books.filter(
      book => book.testament === section.key
    );

    if (!sectionBooks.length) return;

    const wrapper = document.createElement("section");

    wrapper.className = "testament-section";

    const heading = document.createElement("h4");

    heading.textContent = section.title;

    const list = document.createElement("div");

    list.className = "book-list";

    sectionBooks.forEach(book => {

      const button = document.createElement("button");

      button.type = "button";

      button.className = "book-button";

      const selected =
        activeBook?.name === book.name;

      button.classList.toggle("selected", selected);

      button.setAttribute(
        "aria-pressed",
        String(selected)
      );

      const name = document.createElement("span");

      name.textContent = book.name;

      const count = document.createElement("small");

      count.textContent = book.chapters;

      button.append(name, count);

      button.addEventListener("click", () => {

        selectBook(book, 1, true);

      });

      list.appendChild(button);

    });

    wrapper.append(heading, list);

    booksContent.appendChild(wrapper);

  });

}

bookSearch.addEventListener("input", renderBooks);

document.querySelectorAll(".filter-button").forEach(button => {

  button.addEventListener("click", () => {

    activeFilter = button.dataset.filter;

    document.querySelectorAll(".filter-button").forEach(item => {

      const selected = item === button;

      item.classList.toggle("active", selected);

      item.setAttribute(
        "aria-pressed",
        String(selected)
      );

    });

    renderBooks();

  });

});

// =====================================================
// 9. SELECT BOOK AND CHAPTER
// =====================================================

async function selectBook(book, chapter = 1, scroll = false) {

  if (!book) return;

  activeBook = book;

  currentChapter = chapter;

  $("selectedBook").textContent = book.name;

  $("readerSubheading").textContent =
    `${book.testament === "old" ? window.bibleT("Old Testament") : window.bibleT("New Testament")} · ${book.chapters} ${window.bibleT("chapters")}`;

  chapterSelect.replaceChildren();

  for (let number = 1; number <= book.chapters; number++) {

    const option = document.createElement("option");

    option.value = String(number);

    option.textContent = `${window.bibleT("Chapter")} ${number}`;

    chapterSelect.appendChild(option);

  }

  chapterSelect.disabled = false;

  chapterSelect.value = String(chapter);

  renderBooks();

  await loadChapter(chapter);

  if (scroll) {

    readerCard.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }

}

chapterSelect.addEventListener("change", () => {

  if (activeBook) {

    loadChapter(Number(chapterSelect.value));

  }

});

$("startGenesisButton").addEventListener("click", () => {

  const genesis = allBooks.find(
    book => book.name === "Genesis"
  );

  selectBook(genesis, 1, false);

});

// =====================================================
// 10. LOAD SCRIPTURE FROM BIBLE-API.COM
// =====================================================

async function fetchPassage(reference, translation = activeTranslation) {

  const url =
    "https://bible-api.com/" +
    encodeURIComponent(reference) +
    "?translation=" + encodeURIComponent(translation === "tagalog" ? "tagalog" : "kjv");

  const response = await fetch(url);

  if (!response.ok) {

    throw new Error("Passage not found.");

  }

  const data = await response.json();

  if (!Array.isArray(data.verses) || !data.verses.length) {

    throw new Error("No verses found.");

  }

  return data;

}

// =====================================================
// 11. LOAD BIBLE CHAPTER
// =====================================================

async function loadChapter(chapter) {

  if (!activeBook) return;

  const selectedBook = activeBook;

  const thisRequest = ++requestNumber;

  currentChapter = chapter;

  chapterSelect.value = String(chapter);

  readerContent.replaceChildren();

  const loading = document.createElement("p");

  loading.className = "search-status";

  loading.textContent = window.bibleT("Loading Scripture...");

  readerContent.appendChild(loading);

  $("previousChapter").disabled = chapter <= 1;

  $("nextChapter").disabled =
    chapter >= selectedBook.chapters;

  try {

    const selectedTranslation = activeTranslation;
    const data = selectedTranslation.startsWith("ao:")
      ? await fetchAdditionalEdition(selectedBook, chapter, selectedTranslation)
      : await fetchPassage(`${selectedBook.name} ${chapter}`, selectedTranslation);

    if (thisRequest !== requestNumber || selectedTranslation !== activeTranslation) return;

    currentVerses = data.verses.map(verse => ({
      book: selectedBook.name,
      chapter,
      verse: Number(verse.verse),
      text: verse.text.trim()
    }));

    renderVerses(currentVerses);
    updateEditionCredit();

    const key = `${selectedBook.name}|${chapter}`;

    if (!readChapters.includes(key)) {

      readChapters.push(key);

      saveStorage(
        "holyBibleReadChapters",
        readChapters
      );

    }

    updateProgress();

    $("readerSubheading").textContent =
      `${selectedBook.name} ${chapter} · ${currentVerses.length} ${window.bibleT("verses")}`;

  } catch (error) {

    if (thisRequest !== requestNumber) return;

    readerContent.replaceChildren();

    const message = document.createElement("p");

    message.className = "search-status";

    message.textContent =
      window.bibleT("Could not load this chapter. Check your internet connection and try again.");

    readerContent.appendChild(message);

    console.error("Bible API error:", error);
    message.textContent += window.bibleT(" This translation may not contain the requested chapter.");
    updateEditionCredit();

  }

}

// =====================================================
// 12. RENDER BIBLE VERSES
// =====================================================

function renderVerses(verses) {

  readerContent.replaceChildren();

  if (!verses.length) {

    const message = document.createElement("p");

    message.className = "search-status";

    message.textContent = window.bibleT("No verses to display.");

    readerContent.appendChild(message);

    return;

  }

  verses.forEach(verse => {

    const paragraph = document.createElement("p");

    paragraph.className = "verse";

    const number = document.createElement("span");

    number.className = "verse-number";

    number.textContent = verse.verse;

    paragraph.appendChild(number);

    paragraph.appendChild(
      document.createTextNode(verse.text)
    );

    const tools = document.createElement("span");

    tools.className = "verse-tools";

    // COPY BUTTON

    const copyButton = document.createElement("button");

    copyButton.type = "button";

    copyButton.textContent = window.bibleT("Copy");

    const reference =
      `${verse.book} ${verse.chapter}:${verse.verse}`;

    copyButton.setAttribute(
      "aria-label",
      `Copy ${reference}`
    );

    copyButton.addEventListener("click", () => {

      copyText(
        `${verse.text} — ${reference}`
      );

    });

    // FAVORITE BUTTON

    const favoriteButton = document.createElement("button");

    favoriteButton.type = "button";

    const saved = favorites.some(
      item => item.reference === reference
    );

    favoriteButton.textContent =
      saved ? `♥ ${window.bibleT("Saved")}` : `♡ ${window.bibleT("Save")}`;

    favoriteButton.setAttribute(
      "aria-label",
      `${saved ? window.bibleT("Remove") : "Save"} ${reference}`
    );

    favoriteButton.addEventListener("click", () => {

      saveFavorite({
        reference,
        text: verse.text
      });

    });

    tools.append(copyButton, favoriteButton);

    paragraph.appendChild(tools);

    readerContent.appendChild(paragraph);

  });

}

// =====================================================
// 13. READING PROGRESS
// =====================================================

function updateProgress() {

  const completed = readChapters.length;

  const total = allBooks.reduce(
    (sum, book) => sum + book.chapters,
    0
  );

  const percent = Math.min(
    100,
    (completed / total) * 100
  );

  $("progressBar").style.width = `${percent}%`;

  $("progressText").textContent =
    `${completed} ${window.bibleT("chapters read")}`;

}

// =====================================================
// 14. CHAPTER NAVIGATION
// =====================================================

$("previousChapter").addEventListener("click", () => {

  if (!activeBook || currentChapter <= 1) return;

  loadChapter(currentChapter - 1);

});

$("nextChapter").addEventListener("click", () => {

  if (
    !activeBook ||
    currentChapter >= activeBook.chapters
  ) return;

  loadChapter(currentChapter + 1);

});

// =====================================================
// 15. FULL BIBLE SEARCH ENGINE
// =====================================================

async function searchEntireBible(query, offset = 0) {

  const url = new URL(
    "https://search.getbible.net/v3/kjv"
  );

  url.searchParams.set("q", query);

  url.searchParams.set("limit", String(SEARCH_LIMIT));

  url.searchParams.set("offset", String(offset));

  url.searchParams.set("match", "substring");

  url.searchParams.set("words", "all");

  url.searchParams.set("scope", "bible");

  url.searchParams.set("sort", "canonical");

  const response = await fetch(url);

  const data = await response.json();

  if (!response.ok) {

    throw new Error(
      data.detail || "Bible search is currently unavailable."
    );

  }

  return data;

}

// =====================================================
// 16. GET BOOK NAME
// =====================================================

function getBookNameFromNumber(bookNumber) {

  const book = allBooks[Number(bookNumber) - 1];

  return book ? book.name : null;

}

// =====================================================
// 17. CREATE SEARCH RESULT CARD
// =====================================================

function createSearchResultCard(verse) {

  const card = document.createElement("article");

  card.className = "search-result";

  const reference = document.createElement("div");

  reference.className = "result-reference";

  reference.textContent =
    `${verse.book} ${verse.chapter}:${verse.verse}`;

  const text = document.createElement("p");

  text.textContent = verse.text;

  const openButton = document.createElement("button");

  openButton.type = "button";

  openButton.textContent = "Read this verse →";

  openButton.addEventListener("click", async () => {

    const book = allBooks.find(
      item =>
        item.name.toLowerCase() ===
        verse.book.toLowerCase()
    );

    if (!book) {

      showToast("Bible book not found.");

      return;

    }

    await selectBook(book, verse.chapter, true);

    const paragraph = [
      ...readerContent.querySelectorAll(".verse")
    ].find(item =>
      item.querySelector(".verse-number")?.textContent ===
      String(verse.verse)
    );

    if (paragraph) {

      paragraph.style.background = "#edf1e9";

      paragraph.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      setTimeout(() => {

        paragraph.style.background = "";

      }, 2500);

    }

  });

  card.append(reference, text, openButton);

  return card;

}

// =====================================================
// 18. DISPLAY KEYWORD SEARCH RESULTS
// =====================================================

function displayKeywordResults(data, append = false) {

  const results = data.results || {};

  const matches = data.matches || [];

  const verseLookup = new Map();

  Object.values(results).forEach(chapterData => {

    const bookName =
      chapterData.book_name ||
      chapterData.name ||
      getBookNameFromNumber(chapterData.book_nr);

    if (!bookName) return;

    (chapterData.verses || []).forEach(verse => {

      const key =
        `${chapterData.book_nr}|${chapterData.chapter}|${verse.verse}`;

      verseLookup.set(key, {
        book: bookName,
        chapter: Number(chapterData.chapter),
        verse: Number(verse.verse),
        text: verse.text
      });

    });

  });

  currentSearchTotal =
    Number(data.query?.total ?? matches.length);

  if (!append) {

    searchResults.replaceChildren();

    const heading = document.createElement("p");

    heading.className = "search-status";

    heading.textContent =
      `${currentSearchTotal} ${window.bibleT("matching verses found throughout the Bible.")}`;

    searchResults.appendChild(heading);

  }

  matches.forEach(match => {

    const key =
      `${match.book_nr}|${match.chapter}|${match.verse}`;

    const verse = verseLookup.get(key);

    if (!verse) return;

    searchResults.appendChild(
      createSearchResultCard(verse)
    );

  });

  if (matches.length === 0 && !append) {

    showSearchMessage(
      `No matching verses found for "${currentSearchQuery}". Try another word.`
    );

    return;

  }

  // REMOVE OLD PAGINATION CONTROLS

  const oldButton = $("loadMoreSearchResults");

  if (oldButton) {

    oldButton.remove();

  }

  const oldStatus = $("searchPaginationStatus");

  if (oldStatus) {

    oldStatus.remove();

  }

  // PAGINATION

  const nextOffset =
    currentSearchOffset + matches.length;

  if (
    data.query?.has_more &&
    nextOffset < currentSearchTotal &&
    matches.length > 0
  ) {

    const moreButton = document.createElement("button");

    moreButton.id = "loadMoreSearchResults";

    moreButton.type = "button";

    moreButton.className = "btn btn-secondary";

    moreButton.textContent = window.bibleT("Load More Results");

    moreButton.addEventListener("click", () => {

      loadMoreSearchResults();

    });

    searchResults.appendChild(moreButton);

  }

  const status = document.createElement("p");

  status.id = "searchPaginationStatus";

  status.className = "search-status";

  const displayed = Math.min(
    nextOffset,
    currentSearchTotal
  );

  status.textContent =
    `${window.bibleT("Showing")} ${displayed} ${window.bibleT("of")} ${currentSearchTotal} ${window.bibleT("results.")}`;

  searchResults.appendChild(status);

}

// =====================================================
// 19. BIBLE SEARCH FORM
// =====================================================

$("searchForm").addEventListener("submit", async event => {

  event.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {

    showSearchMessage(window.bibleT("Please enter a word or Bible reference."));

    return;

  }

  currentSearchQuery = query;

  currentSearchOffset = 0;

  currentSearchTotal = 0;

  // SHOW CLEAR SEARCH BUTTON

  showClearSearchButton(true);

  const thisSearch = ++searchRequestNumber;

  searchResults.replaceChildren();

  const status = document.createElement("p");

  status.className = "search-status";

  status.textContent = "Searching the entire Bible...";

  searchResults.appendChild(status);

  // DETECT BIBLE REFERENCES

  const looksLikeReference =
    /^(?:\d\s*)?[a-z][a-z\s]*\s+\d+(?::\d+(?:-\d+)?)?$/i
      .test(query);

  // REFERENCE SEARCH

  if (looksLikeReference) {

    try {

      const data = await fetchPassage(query, "kjv");

      if (thisSearch !== searchRequestNumber) return;

      searchResults.replaceChildren();

      const card = document.createElement("article");

      card.className = "search-result";

      const reference = document.createElement("div");

      reference.className = "result-reference";

      reference.textContent = data.reference || query;

      const text = document.createElement("p");

      text.textContent = data.text.trim();

      const openButton = document.createElement("button");

      openButton.type = "button";

      openButton.textContent = "Open in Bible reader →";

      openButton.addEventListener("click", async () => {

        const firstVerse = data.verses[0];

        const book = allBooks.find(
          item =>
            item.name.toLowerCase() ===
            firstVerse.book_name.toLowerCase()
        );

        if (book) {

          await selectBook(
            book,
            Number(firstVerse.chapter),
            true
          );

          const paragraph = [
            ...readerContent.querySelectorAll(".verse")
          ].find(item =>
            item.querySelector(".verse-number")?.textContent ===
            String(firstVerse.verse)
          );

          if (paragraph) {

            paragraph.style.background = "#edf1e9";

            paragraph.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });

            setTimeout(() => {

              paragraph.style.background = "";

            }, 2500);

          }

        } else {

          showToast(
            "This book is not in the available book list."
          );

        }

      });

      card.append(reference, text, openButton);

      searchResults.appendChild(card);

    } catch (error) {

      if (thisSearch !== searchRequestNumber) return;

      showSearchMessage(
        "Passage not found. Try John 3:16 or Psalm 23."
      );

    }

    return;

  }

  // KEYWORD SEARCH

  try {

    const data = await searchEntireBible(query, 0);

    if (thisSearch !== searchRequestNumber) return;

    currentSearchOffset = 0;

    displayKeywordResults(data);

  } catch (error) {

    if (thisSearch !== searchRequestNumber) return;

    console.error("Bible search error:", error);

    showSearchMessage(
      error.message ||
      "Unable to search the Bible. Check your internet connection and try again."
    );

  }

});

// =====================================================
// 20. LOAD MORE SEARCH RESULTS
// =====================================================

async function loadMoreSearchResults() {

  const button = $("loadMoreSearchResults");

  if (!button) return;

  button.disabled = true;

  button.textContent = "Loading...";

  const thisSearch = searchRequestNumber;

  try {

    const nextOffset =
      currentSearchOffset + SEARCH_LIMIT;

    const data = await searchEntireBible(
      currentSearchQuery,
      nextOffset
    );

    if (thisSearch !== searchRequestNumber) return;

    currentSearchOffset = nextOffset;

    displayKeywordResults(data, true);

  } catch (error) {

    console.error("Load more error:", error);

    if (button.isConnected) {

      button.disabled = false;

      button.textContent = "Try Again";

    }

    showToast("Could not load more results.");

  }

}

// =====================================================
// 21. SEARCH MESSAGE
// =====================================================

function showSearchMessage(message) {

  showClearSearchButton(true);

  searchResults.replaceChildren();

  const paragraph = document.createElement("p");

  paragraph.className = "search-status";

  paragraph.textContent = message;

  searchResults.appendChild(paragraph);

}

// =====================================================
// 22. FAVORITES
// =====================================================

function saveFavorite(verse) {

  const existing = favorites.findIndex(
    item => item.reference === verse.reference
  );

  if (existing >= 0) {

    favorites.splice(existing, 1);

    showToast(window.bibleT("Removed from favorites."));

  } else {

    favorites.unshift(verse);

    showToast(window.bibleT("Verse saved to favorites."));

  }

  saveStorage(
    "holyBibleFavorites",
    favorites
  );

  renderFavorites();

  const dailyReference =
    $("dailyReference").textContent;

  $("saveDailyButton").textContent =
    favorites.some(
      item => item.reference === dailyReference
    ) ? "♥" : "♡";

  if (currentVerses.length) {

    renderVerses(currentVerses);

  }

}

// =====================================================
// 23. RENDER FAVORITES
// =====================================================

function renderFavorites() {

  const grid = $("favoritesGrid");

  grid.replaceChildren();

  $("favoriteCount").textContent =
    `${favorites.length} ${window.bibleT("saved")}`;

  if (!favorites.length) {

    const empty = document.createElement("div");

    empty.className = "empty-favorites";

    const icon = document.createElement("span");

    icon.textContent = "♡";

    const title = document.createElement("h3");

    title.textContent = window.bibleT("Your collection starts here.");

    const description = document.createElement("p");

    description.textContent =
      window.bibleT("Save verses that encourage, comfort, or inspire you.");

    empty.append(icon, title, description);

    grid.appendChild(empty);

    return;

  }

  favorites.forEach(verse => {

    const card = document.createElement("article");

    card.className = "favorite-card";

    const reference = document.createElement("span");

    reference.className = "result-reference";

    reference.textContent = verse.reference;

    const text = document.createElement("p");

    text.textContent = verse.text;

    const actions = document.createElement("div");

    actions.className = "favorite-actions";

    // COPY FAVORITE

    const copyButton = document.createElement("button");

    copyButton.type = "button";

    copyButton.textContent = window.bibleT("Copy verse");

    copyButton.addEventListener("click", () => {

      copyText(
        `${verse.text} — ${verse.reference}`
      );

    });

    // REMOVE FAVORITE

    const removeButton = document.createElement("button");

    removeButton.type = "button";

    removeButton.textContent = window.bibleT("Remove");

    removeButton.addEventListener("click", () => {

      favorites = favorites.filter(
        item => item.reference !== verse.reference
      );

      saveStorage(
        "holyBibleFavorites",
        favorites
      );

      renderFavorites();

      renderVerses(currentVerses);

      $("saveDailyButton").textContent =
        favorites.some(
          item =>
            item.reference ===
            $("dailyReference").textContent
        ) ? "♥" : "♡";

      showToast(window.bibleT("Favorite removed."));

    });

    actions.append(copyButton, removeButton);

    card.append(reference, text, actions);

    grid.appendChild(card);

  });

}

// =====================================================
// 24. NAVIGATION (works with current responsive header)
// =====================================================
const mobileMenuButton = $("menuToggle");
const mobileMenu = document.querySelector(".top-nav");
if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    mobileMenuButton.setAttribute("aria-expanded", String(open));
    mobileMenuButton.textContent = open ? "✕" : "☰";
  });
}

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    if (mobileMenu && mobileMenuButton) {
      mobileMenu.classList.remove("open");
      mobileMenuButton.setAttribute("aria-expanded", "false");
      mobileMenuButton.textContent = "☰";
    }
    document.querySelectorAll(".nav-link").forEach(item => {
      item.classList.toggle("active", item === link);
    });
  });
});

// =====================================================
// 25. INITIALIZE WEBSITE
// =====================================================

function initializeWebsite() {

  updateDateLabel();

  displayVerse(getDailyVerse());
  refreshDailyTranslation();

  renderBooks();

  renderFavorites();

  updateProgress();

  $("saveDailyButton").textContent =
    favorites.some(
      item =>
        item.reference ===
        $("dailyReference").textContent
    ) ? "♥" : "♡";

  // START WITH NO SELECTED CHAPTER

  chapterSelect.disabled = true;

  $("previousChapter").disabled = true;

  $("nextChapter").disabled = true;

}

initializeWebsite();

// =====================================================
// END OF HOLY BIBLE ONLINE SCRIPT
// =====================================================

window.refreshBibleInterface = () => { renderBooks(); renderFavorites(); updateProgress(); if (activeBook) { selectBook(activeBook, currentChapter || 1); } };
