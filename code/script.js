const booksContainer = document.getElementById("booksContainer");

const chapterCount = document.getElementById("chapterCount");
const bookCount = document.getElementById("bookCount");
const completionPercent = document.getElementById("completionPercent");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const streakCount = document.getElementById("streakCount");
const readingHistory = document.getElementById("readingHistory");

const searchInput = document.getElementById("searchInput");
const expandAllBtn = document.getElementById("expandAllBtn");
const collapseAllBtn = document.getElementById("collapseAllBtn");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");

const toast = document.getElementById("toast");

let progress =
    JSON.parse(localStorage.getItem("bibleProgress")) || {};

let history =
    JSON.parse(localStorage.getItem("readingHistory")) || [];

let streak =
    JSON.parse(localStorage.getItem("readingStreak")) || {
        current: 0,
        lastDate: null
    };

function saveData() {
    localStorage.setItem(
        "bibleProgress",
        JSON.stringify(progress)
    );

    localStorage.setItem(
        "readingHistory",
        JSON.stringify(history)
    );

    localStorage.setItem(
        "readingStreak",
        JSON.stringify(streak)
    );
}

function showToast(message = "Saved") {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function updateStreak() {
    const today = new Date().toDateString();

    if (streak.lastDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (streak.lastDate === yesterday.toDateString()) {
        streak.current++;
    } else {
        streak.current = 1;
    }

    streak.lastDate = today;
}

function updateStats() {
    let totalRead = 0;
    let completedBooks = 0;

    bibleBooks.forEach(book => {
        const data = progress[book.name];

        if (!data) return;

        totalRead += data.chapters.length;

        if (data.chapters.length === book.chapters) {
            completedBooks++;
        }
    });

    const percentage =
        Math.round((totalRead / TOTAL_CHAPTERS) * 100);

    chapterCount.textContent = totalRead;
    bookCount.textContent = completedBooks;
    completionPercent.textContent = percentage + "%";
    streakCount.textContent = streak.current;

    progressFill.style.width = percentage + "%";

    progressText.textContent =
        `${totalRead} of ${TOTAL_CHAPTERS} chapters completed`;
}

function updateHistory() {
    if (history.length === 0) {
        readingHistory.textContent =
            "No chapters read yet.";
        return;
    }

    readingHistory.innerHTML = "";

    history.slice(-10).reverse().forEach(item => {

        const div = document.createElement("div");

        div.className = "history-item";

        div.textContent =
            `${item.book} Chapter ${item.chapter}`;

        readingHistory.appendChild(div);
    });
}

function createBook(book) {

    if (!progress[book.name]) {
        progress[book.name] = {
            chapters: [],
            notes: ""
        };
    }

    const bookCard = document.createElement("div");
    bookCard.className = "glass book";

    const completed =
        progress[book.name].chapters.length ===
        book.chapters;

    if (completed) {
        bookCard.classList.add("complete");
    }

    const header = document.createElement("div");
    header.className = "book-header";

    header.innerHTML = `
        <div>
            <h3>${book.name}</h3>
            <small>${book.testament}</small>
        </div>

        <div class="book-progress">
            ${progress[book.name].chapters.length}/${book.chapters}
        </div>
    `;

    const chaptersContainer =
        document.createElement("div");

    chaptersContainer.className = "chapters";

    const grid = document.createElement("div");
    grid.className = "chapter-grid";

    for (let i = 1; i <= book.chapters; i++) {

        const label = document.createElement("label");

        label.className = "chapter";

        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked =
            progress[book.name]
                .chapters.includes(i);

        if (checkbox.checked) {
            label.classList.add("completed");
        }

        checkbox.addEventListener("change", () => {

            if (checkbox.checked) {

                progress[book.name]
                    .chapters.push(i);

                label.classList.add("completed");

                history.push({
                    book: book.name,
                    chapter: i,
                    date: new Date().toISOString()
                });

                updateStreak();

            } else {

                progress[book.name].chapters =
                    progress[book.name]
                    .chapters.filter(
                        chapter => chapter !== i
                    );

                label.classList.remove("completed");
            }

            saveData();
            updateStats();
            updateHistory();

            header.querySelector(
                ".book-progress"
            ).textContent =
                `${progress[book.name]
                .chapters.length}/${book.chapters}`;

            if (
                progress[book.name]
                .chapters.length ===
                book.chapters
            ) {
                bookCard.classList.add(
                    "complete"
                );
            } else {
                bookCard.classList.remove(
                    "complete"
                );
            }

            showToast();
        });

        label.appendChild(checkbox);
        label.append(` Chapter ${i}`);

        grid.appendChild(label);
    }

    const notes =
        document.createElement("textarea");

    notes.className = "notes";

    notes.placeholder =
        `Notes for ${book.name}...`;

    notes.value =
        progress[book.name].notes;

    notes.addEventListener("input", () => {

        progress[book.name].notes =
            notes.value;

        saveData();
    });

    chaptersContainer.appendChild(grid);
    chaptersContainer.appendChild(notes);

    header.addEventListener("click", () => {

        chaptersContainer.style.display =
            chaptersContainer.style.display ===
            "block"
            ? "none"
            : "block";
    });

    bookCard.appendChild(header);
    bookCard.appendChild(chaptersContainer);

    booksContainer.appendChild(bookCard);
}

function renderBooks(search = "") {

    booksContainer.innerHTML = "";

    bibleBooks.forEach(book => {

        if (
            book.name
                .toLowerCase()
                .includes(search.toLowerCase())
        ) {
            createBook(book);
        }
    });
}

searchInput.addEventListener(
    "input",
    e => {
        renderBooks(e.target.value);
    }
);

expandAllBtn.addEventListener(
    "click",
    () => {
        document
            .querySelectorAll(".chapters")
            .forEach(section => {
                section.style.display = "block";
            });
    }
);

collapseAllBtn.addEventListener(
    "click",
    () => {
        document
            .querySelectorAll(".chapters")
            .forEach(section => {
                section.style.display = "none";
            });
    }
);

exportBtn.addEventListener(
    "click",
    () => {

        const backup = {
            progress,
            history,
            streak
        };

        const blob = new Blob(
            [JSON.stringify(backup, null, 2)],
            {
                type: "application/json"
            }
        );

        const url =
            URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;
        a.download =
            "bible-tracker-backup.json";

        a.click();

        URL.revokeObjectURL(url);

        showToast("Backup exported");
    }
);

importBtn.addEventListener(
    "click",
    () => {
        importFile.click();
    }
);

importFile.addEventListener(
    "change",
    e => {

        const file =
            e.target.files[0];

        if (!file) return;

        const reader =
            new FileReader();

        reader.onload = event => {

            try {

                const data =
                    JSON.parse(
                        event.target.result
                    );

                progress =
                    data.progress || {};

                history =
                    data.history || [];

                streak =
                    data.streak || {
                        current: 0,
                        lastDate: null
                    };

                saveData();

                renderBooks();

                updateStats();

                updateHistory();

                showToast(
                    "Backup imported"
                );

            } catch {

                showToast(
                    "Import failed"
                );
            }
        };

        reader.readAsText(file);
    }
);

renderBooks();
updateStats();
updateHistory();
saveData();
