// =========================
// Utility Functions
// =========================

// Remove 'active' class from all lesson buttons
function removeActive() {
  console.log("Removing active classes...");
  document
    .querySelectorAll(".lesson-btn")
    .forEach((btn) => btn.classList.remove("active"));
}

// Show loading spinner in word card
function showLoadingSpinner(status) {
  const wordCard = document.querySelector(".word-card");
  if (status) {
    wordCard.innerHTML = `<div class="col-span-full text-center">
      <span class="loading loading-bars loading-xl"></span>
    </div>`;
  }
}

// Close modal by ID
function closeModal(id) {
  document.querySelector(id).close();
}

// Generate synonym buttons
function generateSynonymButtons(synonyms) {
  return synonyms.map((syn) => `<button class="btn">${syn}</button>`).join(" ");
}

// =========================
// Lesson Related Functions
// =========================

// Render lesson buttons
function showLesson(lessons) {
  const lessonContainer = document.querySelector(".lesson-btn-container");
  lessonContainer.innerHTML = "";

  lessons.forEach((lesson) => {
    lessonContainer.innerHTML += `
      <button id="${lesson.level_no}" class="lesson-btn btn btn-outline btn-primary">
        <i class="fa-solid fa-book"></i> Lesson - ${lesson.level_no}
      </button>`;
  });

  // Add click events
  document.querySelectorAll(".lesson-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeActive();
      btn.classList.add("active");
      loadLessonWord(btn.id);
    });
  });
}

// Fetch and render all lessons
function loadLesson() {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => showLesson(data.data));
}

// =========================
// Word Related Functions
// =========================

// Render all words in card format
function showLessonWord(words) {
  const wordCard = document.querySelector(".word-card");
  wordCard.innerHTML = "";

  if (!words.length) {
    wordCard.innerHTML = `
      <div class="no-lesson-card bg-gray-100 col-span-full py-10 text-center space-y-5">
        <img class="mx-auto size-32" src="./assets/alert-error.png" alt="No Words" />
        <p class="text-gray-600 text-sm">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="text-3xl">নেক্সট Lesson এ যান</h2>
      </div>
    `;
    showLoadingSpinner(false);
    return;
  }

  wordCard.innerHTML = words
    .map(
      (word) => `
      <div class="card bg-white p-6 shadow-md space-y-4">
        <h2 class="text-2xl font-bold">${word.word}</h2>
        <p class="font-medium">Meaning/Pronunciation</p>
        <span class="text-xl font-bold">${word.meaning} / ${word.pronunciation}</span>
        <div class="flex justify-between items-center mt-5 text-gray-700">
          <p onclick="loadModals('${word.id}')" class="size-12 p-2.5 bg-sky-200 rounded-full text-center cursor-pointer">
            <i class="fa-solid fa-circle-info"></i>
          </p>
          <p onclick="speakWord('${word.word}')" class="size-12 p-2.5 bg-sky-200 rounded-full text-center cursor-pointer">
            <i class="fa-solid fa-record-vinyl"></i>
          </p>
        </div>
      </div>
    `
    )
    .join("");

  showLoadingSpinner(false);
}

// Fetch words by lesson ID
function loadLessonWord(id) {
  showLoadingSpinner(true);
  fetch(`https://openapi.programming-hero.com/api/level/${id}`)
    .then((res) => res.json())
    .then((data) => showLessonWord(data.data));
}

// Speak a given word
function speakWord(word) {
  const utter = new SpeechSynthesisUtterance(word);
  window.speechSynthesis.speak(utter);
}

// =========================
// Modal Functions
// =========================

function showModals(wordData) {
  const modal = document.querySelector("#my_modal_3");
  modal.innerHTML = "";

  const modalContent = document.createElement("div");
  modalContent.innerHTML = `
    <div class="modal-box min-w-[450px]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>

      <div class="space-y-5">
        <h1 class="font-bold text-2xl">
          ${wordData.word} 
          (<i class="fa-solid fa-microphone"></i>: ${wordData.meaning})
        </h1>
        <p><span class="font-bold">Meaning</span><br>${wordData.meaning}</p>
        <p><span class="font-bold">Example</span><br>${wordData.sentence}</p>
        <p>
          <span class="font-bold">Somarthok shobdo</span>
          <div class="space-x-2">${generateSynonymButtons(
            wordData.synonyms
          )}</div>
        </p>
        <button onclick="closeModal('#my_modal_3')" class="btn btn-primary">Complete Learning</button>
      </div>
    </div>
  `;

  modal.appendChild(modalContent);
  modal.show();
}

function loadModals(id) {
  fetch(`https://openapi.programming-hero.com/api/word/${id}`)
    .then((res) => res.json())
    .then((json) => showModals(json.data));
}

// =========================
// Search Functionality
// =========================

document.querySelector(".search-btn").addEventListener("click", () => {
  const query = document
    .querySelector(".search-input")
    .value.trim()
    .toLowerCase();
  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const filtered = data.data.filter((word) =>
        word.word.toLowerCase().includes(query)
      );
      removeActive();
      showLessonWord(filtered);
    });
});

// =========================
// Event Listeners
// =========================

// Close modal when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".modal-box")) {
    document.querySelector("#my_modal_3").close();
  }
});

// FAQ Section Toggle
document.querySelectorAll(".question").forEach((question) => {
  question.addEventListener("click", (e) => {
    document
      .querySelectorAll(".answer")
      .forEach((ans) => ans.classList.add("hidden"));
    const clicked = e.target.closest(".question");
    if (clicked) clicked.lastElementChild.classList.remove("hidden");
  });
});

// Initial Load
loadLesson();
