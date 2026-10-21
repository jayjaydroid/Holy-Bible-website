
/* =========================================
   HOLY BIBLE | WEBSITE FUNCTIONALITY
========================================= */

const oldTestamentBooks = [
  ["Genesis",50],["Exodus",40],["Leviticus",27],
  ["Numbers",36],["Deuteronomy",34],["Joshua",24],
  ["Judges",21],["Ruth",4],["1 Samuel",31],
  ["2 Samuel",24],["1 Kings",22],["2 Kings",25],
  ["1 Chronicles",29],["2 Chronicles",36],["Ezra",10],
  ["Nehemiah",13],["Esther",10],["Job",42],
  ["Psalms",150],["Proverbs",31],["Ecclesiastes",12],
  ["Song of Solomon",8],["Isaiah",66],["Jeremiah",52],
  ["Lamentations",5],["Ezekiel",48],["Daniel",12],
  ["Hosea",14],["Joel",3],["Amos",9],["Obadiah",1],
  ["Jonah",4],["Micah",7],["Nahum",3],["Habakkuk",3],
  ["Zephaniah",3],["Haggai",2],["Zechariah",14],["Malachi",4]
].map(([name, chapters]) => ({name, chapters, testament:"old"}));

const newTestamentBooks = [
  ["Matthew",28],["Mark",16],["Luke",24],["John",21],
  ["Acts",28],["Romans",16],["1 Corinthians",16],
  ["2 Corinthians",13],["Galatians",6],["Ephesians",6],
  ["Philippians",4],["Colossians",4],["1 Thessalonians",5],
  ["2 Thessalonians",3],["1 Timothy",6],["2 Timothy",4],
  ["Titus",3],["Philemon",1],["Hebrews",13],["James",5],
  ["1 Peter",5],["2 Peter",3],["1 John",5],["2 John",1],
  ["3 John",1],["Jude",1],["Revelation",22]
].map(([name, chapters]) => ({name, chapters, testament:"new"}));

const allBooks = [...oldTestamentBooks, ...newTestamentBooks];

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
    text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee.",
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

// ELEMENTS

const $ = id => document.getElementById(id);

const booksContent = $("booksContent");
const bookSearch = $("bookSearch");
const chapterSelect = $("chapterSelect");
const readerContent = $("readerContent");
const readerCard = $("reader");
const searchInput = $("searchInput");
const searchResults = $("searchResults");

let activeFilter = "all";
let activeBook = null;
let currentChapter = null;
let currentVerses = [];
let requestNumber = 0;
let toastTimer;

const readChapters = loadStorage("holyBibleReadChapters", []);
let favorites = loadStorage("holyBibleFavorites", []);


// SAFE LOCAL STORAGE

function loadStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    showToast("Browser storage is unavailable.");
  }
}


// NOTIFICATIONS

function showToast(message) {
  const toast = $("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}


// DAILY VERSE

function displayVerse(verse) {
  $("dailyVerse").textContent = verse.text;
  $("dailyReference").textContent = verse.reference;
  $("dailyMessage").textContent = verse.message;

  $("daily").dataset.reference = verse.reference;
  $("daily").dataset.text = verse.text;
  $("daily").dataset.message = verse.message;
}

function getDailyVerse() {
  // Keep the same featured verse throughout the local calendar day.
  const now = new Date();
  const dayNumber = Math.floor(
    new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    / 86400000
  );

  return dailyVerses[
    ((dayNumber % dailyVerses.length) + dailyVerses.length)
    % dailyVerses.length
  ];
}

function updateDateLabel() {
  $("todayLabel").textContent = new Intl.DateTimeFormat(
    undefined,
    {month:"long", day:"numeric", year:"numeric"}
  ).format(new Date());
}

function randomVerse() {
  const currentReference = $("dailyReference").textContent;

  let choices = dailyVerses.filter(
    verse => verse.reference !== currentReference
  );

  if (!choices.length) choices = dailyVerses;

  const verse = choices[Math.floor(Math.random() * choices.length)];

  displayVerse(verse);
}

$("newVerseButton").addEventListener("click", randomVerse);
$("heroVerseButton").addEventListener("click", () => {
  randomVerse();
  $("daily").scrollIntoView({behavior:"smooth"});
});
$("encouragementButton").addEventListener("click", () => {
  randomVerse();
  $("daily").scrollIntoView({behavior:"smooth"});
});

$("copyDailyButton").addEventListener("click", () => {
  copyText(
    `"${$("dailyVerse").textContent}" — ${$("dailyReference").textContent}`
  );
});

$("saveDailyButton").addEventListener("click", () => {
  saveFavorite({
    reference: $("dailyReference").textContent,
    text: $("dailyVerse").textContent
  });
});


// COPY TEXT

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

      if (!copied) throw new Error("Copy failed");
    }

    showToast("Verse copied to clipboard!");
  } catch {
    showToast("Copy unavailable. Please select and copy the text.");
  }
}


// BOOK SIDEBAR

function renderBooks() {
  booksContent.replaceChildren();

  const query = bookSearch.value.trim().toLowerCase();

  const books = allBooks.filter(book => {
    const matchesFilter =
      activeFilter === "all" || book.testament === activeFilter;

    const matchesSearch = book.name.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  if (!books.length) {
    const message = document.createElement("p");
    message.className = "search-status";
    message.textContent = "No books found.";
    booksContent.appendChild(message);
    return;
  }

  const sections = [
    {key:"old", title:"Old Testament"},
    {key:"new", title:"New Testament"}
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
      button.classList.toggle(
        "selected",
        activeBook?.name === book.name
      );

      const name = document.createElement("span");
      name.textContent = book.name;

      const count = document.createElement("small");
      count.textContent = book.chapters;

      button.append(name, count);

      button.setAttribute(
        "aria-pressed",
        String(activeBook?.name === book.name)
      );

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
      item.setAttribute("aria-pressed", String(selected));
    });

    renderBooks();
  });
});


// SELECT BOOK AND CHAPTER

async function selectBook(book, chapter = 1, scroll = false) {
  activeBook = book;
  currentChapter = chapter;

  $("selectedBook").textContent = book.name;
  $("readerSubheading").textContent =
    `${book.testament === "old" ? "Old Testament" : "New Testament"} · ${book.chapters} chapters`;

  chapterSelect.replaceChildren();

  for (let number = 1; number <= book.chapters; number++) {
    const option = document.createElement("option");

    option.value = String(number);
    option.textContent = `Chapter ${number}`;

    chapterSelect.appendChild(option);
  }

  chapterSelect.disabled = false;
  chapterSelect.value = String(chapter);

  renderBooks();

  await loadChapter(chapter);

  if (scroll) {
    readerCard.scrollIntoView({
      behavior:"smooth",
      block:"start"
    });
  }
}

chapterSelect.addEventListener("change", () => {
  if (activeBook) {
    loadChapter(Number(chapterSelect.value));
  }
});

$("startGenesisButton").addEventListener("click", () => {
  const genesis = allBooks.find(book => book.name === "Genesis");
  selectBook(genesis, 1, false);
});


// LOAD SCRIPTURE FROM BIBLE-API.COM

async function fetchPassage(reference) {
  const url =
    "https://bible-api.com/" +
    encodeURIComponent(reference) +
    "?translation=kjv";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Passage not found.");
  }

  const data = await response.json();

  if (!Array.isArray(data.verses) || data.verses.length === 0) {
    throw new Error("No verses found.");
  }

  return data;
}

async function loadChapter(chapter) {
  if (!activeBook) return;

  const thisRequest = ++requestNumber;

  currentChapter = chapter;
  chapterSelect.value = String(chapter);

  readerContent.replaceChildren();

  const loading = document.createElement("p");
  loading.className = "search-status";
  loading.textContent = "Loading Scripture...";

  readerContent.appendChild(loading);

  $("previousChapter").disabled =
    chapter <= 1;

  $("nextChapter").disabled =
    chapter >= activeBook.chapters;

  try {
    const data = await fetchPassage(
      `${activeBook.name} ${chapter}`
    );

    if (thisRequest !== requestNumber) return;

    currentVerses = data.verses.map(verse => ({
      book: activeBook.name,
      chapter,
      verse: verse.verse,
      text: verse.text.trim()
    }));

    renderVerses(currentVerses);

    const key = `${activeBook.name}|${chapter}`;

    if (!readChapters.includes(key)) {
      readChapters.push(key);
      saveStorage("holyBibleReadChapters", readChapters);
    }

    updateProgress();

    $("readerSubheading").textContent =
      `${activeBook.name} ${chapter} · ${currentVerses.length} verses`;

  } catch (error) {
    if (thisRequest !== requestNumber) return;

    readerContent.replaceChildren();

    const message = document.createElement("p");
    message.className = "search-status";
    message.textContent =
      "Could not load this chapter. Check your internet connection and try again.";

    readerContent.appendChild(message);

    console.error("Bible API error:", error);
  }
}


// RENDER VERSES WITH FAVORITE AND COPY BUTTONS

function renderVerses(verses) {
  readerContent.replaceChildren();

  if (!verses.length) {
    const message = document.createElement("p");
    message.className = "search-status";
    message.textContent = "No verses to display.";

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
    paragraph.appendChild(document.createTextNode(verse.text));

    const tools = document.createElement("span");
    tools.className = "verse-tools";

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.textContent = "Copy";
    copyButton.setAttribute("aria-label", `Copy ${verse.book} ${verse.chapter}:${verse.verse}`);

    copyButton.addEventListener("click", () => {
      copyText(
        `${verse.text} — ${verse.book} ${verse.chapter}:${verse.verse}`
      );
    });

    const favoriteButton = document.createElement("button");
    favoriteButton.type = "button";

    const reference = `${verse.book} ${verse.chapter}:${verse.verse}`;
    const saved = favorites.some(item => item.reference === reference);

    favoriteButton.textContent = saved ? "♥ Saved" : "♡ Save";

    favoriteButton.setAttribute(
      "aria-label",
      `${saved ? "Remove" : "Save"} ${reference}`
    );

    favoriteButton.addEventListener("click", () => {
      saveFavorite({
        reference,
        text: verse.text
      });

      renderVerses(currentVerses);
    });

    tools.append(copyButton, favoriteButton);
    paragraph.appendChild(tools);

    readerContent.appendChild(paragraph);
  });
}


// READING PROGRESS

function updateProgress() {
  const completed = readChapters.length;
  const total = allBooks.reduce(
    (sum, book) => sum + book.chapters,
    0
  );

  const percent = Math.min(100, (completed / total) * 100);

  $("progressBar").style.width = `${percent}%`;

  $("progressText").textContent =
    `${completed} chapter${completed === 1 ? "" : "s"} read`;
}


// CHAPTER NAVIGATION

$("previousChapter").addEventListener("click", () => {
  if (!activeBook || currentChapter <= 1) return;

  loadChapter(currentChapter - 1);
});

$("nextChapter").addEventListener("click", () => {
  if (!activeBook || currentChapter >= activeBook.chapters) return;

  loadChapter(currentChapter + 1);
});


// BIBLE SEARCH ENGINE

$("searchForm").addEventListener("submit", async event => {
  event.preventDefault();

  const query = searchInput.value.trim();

  if (!query) return;

  searchResults.replaceChildren();

  const status = document.createElement("p");
  status.className = "search-status";
  status.textContent = "Searching Scripture...";

  searchResults.appendChild(status);

  // Reference search examples:
  // John 3:16
  // Psalm 23
  // 1 John 4:7-8

  const looksLikeReference =
    /^(?:\d\s*)?[a-z][a-z\s]*\s+\d+(?::\d+(?:-\d+)?)?$/i
      .test(query);

  if (looksLikeReference) {
    try {
      const data = await fetchPassage(query);

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
          item => item.name.toLowerCase() ===
            firstVerse.book_name.toLowerCase()
        );

        if (book) {
          await selectBook(book, Number(firstVerse.chapter), true);
        } else {
          showToast("This book is not in the available book list.");
        }
      });

      card.append(reference, text, openButton);
      searchResults.appendChild(card);

    } catch {
      showSearchMessage(
        "Passage not found. Try a reference such as John 3:16 or Psalm 23."
      );
    }

    return;
  }

  // Keyword searches scan the currently loaded chapter.
  const words = query.toLowerCase().split(/\s+/);

  const matches = currentVerses.filter(verse => {
    const text = verse.text.toLowerCase();
    return words.every(word => text.includes(word));
  });

  searchResults.replaceChildren();

  if (!currentVerses.length) {
    showSearchMessage(
      "Open a Bible chapter first to search its words, or enter a Bible reference above."
    );
    return;
  }

  if (!matches.length) {
    showSearchMessage(
      `No matching verses were found for "${query}" in ${activeBook.name} ${currentChapter}. Try another word or open a different chapter.`
    );
    return;
  }

  const heading = document.createElement("p");
  heading.className = "search-status";
  heading.textContent =
    `${matches.length} result${matches.length === 1 ? "" : "s"} in ${activeBook.name} ${currentChapter}`;

  searchResults.appendChild(heading);

  matches.forEach(verse => {
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
    openButton.textContent = "Show verse in reader ↓";

    openButton.addEventListener("click", () => {
      readerContent.querySelectorAll(".verse").forEach(paragraph => {
        paragraph.style.background = "";
      });

      const paragraph = [...readerContent.querySelectorAll(".verse")]
        .find(item =>
          item.querySelector(".verse-number")?.textContent ===
          String(verse.verse)
        );

      if (paragraph) {
        paragraph.style.background = "#edf1e9";
        paragraph.scrollIntoView({behavior:"smooth", block:"center"});
      }

      readerCard.scrollIntoView({behavior:"smooth", block:"start"});
    });

    card.append(reference, text, openButton);
    searchResults.appendChild(card);
  });
});

function showSearchMessage(message) {
  searchResults.replaceChildren();

  const paragraph = document.createElement("p");
  paragraph.className = "search-status";
  paragraph.textContent = message;

  searchResults.appendChild(paragraph);
}


// FAVORITES

function saveFavorite(verse) {
  const existing = favorites.findIndex(
    item => item.reference === verse.reference
  );

  if (existing >= 0) {
    favorites.splice(existing, 1);
    showToast("Removed from favorites.");
  } else {
    favorites.unshift(verse);
    showToast("Verse saved to favorites.");
  }

  saveStorage("holyBibleFavorites", favorites);

  renderFavorites();

  const dailyReference = $("dailyReference").textContent;

  $("saveDailyButton").textContent =
    favorites.some(item => item.reference === dailyReference)
      ? "♥"
      : "♡";

  if (currentVerses.length) {
    renderVerses(currentVerses);
  }
}

function renderFavorites() {
  const grid = $("favoritesGrid");

  grid.replaceChildren();

  $("favoriteCount").textContent =
    `${favorites.length} saved`;

  if (!favorites.length) {
    const empty = document.createElement("div");
    empty.className = "empty-favorites";

    const icon = document.createElement("span");
    icon.textContent = "♡";

    const title = document.createElement("h3");
    title.textContent = "Your collection starts here.";

    const description = document.createElement("p");
    description.textContent =
      "Save verses that encourage, comfort, or inspire you.";

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

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.textContent = "Copy verse";

    copyButton.addEventListener("click", () => {
      copyText(`${verse.text} — ${verse.reference}`);
    });

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", () => {
      favorites = favorites.filter(
        item => item.reference !== verse.reference
      );

      saveStorage("holyBibleFavorites", favorites);
      renderFavorites();
      renderVerses(currentVerses);

      $("saveDailyButton").textContent =
        favorites.some(
          item => item.reference === $("dailyReference").textContent
        ) ? "♥" : "♡";

      showToast("Favorite removed.");
    });

    actions.append(copyButton, removeButton);
    card.append(reference, text, actions);

    grid.appendChild(card);
  });
}


// MOBILE NAVIGATION

$("menuToggle").addEventListener("click", () => {
  const nav = document.querySelector(".top-nav");
  const isOpen = nav.classList.toggle("open");

  $("menuToggle").setAttribute("aria-expanded", String(isOpen));
  $("menuToggle").textContent = isOpen ? "✕" : "☰";
});

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelector(".top-nav").classList.remove("open");

    $("menuToggle").setAttribute("aria-expanded", "false");
    $("menuToggle").textContent = "☰";

    document.querySelectorAll(".nav-link").forEach(item => {
      item.classList.toggle("active", item === link);
    });
  });
});


// INITIALIZE WEBSITE

updateDateLabel();
displayVerse(getDailyVerse());
renderBooks();
renderFavorites();
updateProgress();

$("saveDailyButton").textContent =
  favorites.some(
    item => item.reference === $("dailyReference").textContent
  ) ? "♥" : "♡";
