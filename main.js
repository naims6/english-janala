function removeActive() {
  console.log("removing");
  let lessonBtn = document.querySelectorAll(".lesson-btn");
  lessonBtn.forEach((item) => item.classList.remove("active"));
}

function showLesson(data) {
  let lessonBtnContainer = document.querySelector(".lesson-btn-container");

  data.forEach((item) => {
    lessonBtnContainer.innerHTML += `<button id="${item.level_no}" class="lesson-btn btn btn-outline btn-primary"><i class="fa-solid fa-book"></i> Lesson -${item.level_no}</button>`;
  });

  let lessonBtn = document.querySelectorAll(".lesson-btn");
  lessonBtn.forEach((item) => {
    item.addEventListener("click", () => {
      removeActive();
      item.classList.add("active");
      return loadLessonWord(`${item.id}`);
    });
  });
}

function showLessonWord(data) {
  let wordCard = document.querySelector(".word-card");
  wordCard.innerHTML = "";

  if (!data.length) {
    wordCard.innerHTML = `
     <div
            class="no-lesson-card bg-gray-100 col-span-full py-10 text-center space-y-5"
          >
            <img class="mx-auto size-32" src="./assets/alert-error.png" alt="" />
            <p class="text-gray-600 text-sm">
              এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
            </p>
            <h2 class="text-3xl">নেক্সট Lesson এ যান</h2>
          </div>
    `;
    showLoadingSpinner(false);

    return;
  }
  wordCard.innerHTML = data
    .map((item) => {
      return `<div class="card bg-white p-6 shadow-md space-y-4">
            <h2 class="text-2xl font-bold">${item.word}</h2>
            <p class="font-medium">Meaning/Pronounciation</p>
            <span class="text-xl font-bold">${item.meaning} / ${item.pronunciation}</span>
            <div class="flex justify-between items-center mt-5 text-gray-700">
              <p onclick="loadModals('${item.id}')" class="size-12 p-2.5 bg-sky-200 rounded-full text-center cursor-pointer">
                <i  class="fa-solid fa-circle-info"></i>
              </p>
              <p onclick="speakWord('${item.word}')" class="size-12 p-2.5 bg-sky-200 rounded-full text-center cursor-pointer">
                <i class="fa-solid fa-record-vinyl"></i>
              </p>
            </div>
          </div>`;
    })
    .join(" ");

  showLoadingSpinner(false);
}

function speakWord(word) {
  const utter = new SpeechSynthesisUtterance(word);
  window.speechSynthesis.speak(utter);
}

function addSynonyms(syn) {
  let synBtn = syn
    .map((item) => {
      return `<button class="btn">${item}</button>`;
    })
    .join(" ");
  return synBtn;
}

function showModals(data) {
  document.querySelector("#my_modal_3").innerHTML = "";
  let div = document.createElement("div");
  div.innerHTML = `
          <div class="modal-box min-w-[450px]">
            <form method="dialog">
              <button
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </button>
            </form>

            <div class="space-y-5">
              <h1 class="font-bold text-2xl">${
                data.word
              }( <i class="fa-solid fa-microphone"></i> : ${data.meaning})</h1>
            <p class="mb-3">
              <span class="font-bold text-base mb-3">Meaning</span> <br>
              <span>${data.meaning}</span>
            </p>
            <p class="mb-3">
              <span class="font-bold text-base mb-3">Example</span> <br>
              <span>${data.sentence}</span>
            </p>

            <p class="mb-3">
              <span class="font-bold text-base mb-3">Somarthok sobdo</span>
              <div class="space-x-2">
              ${addSynonyms(data.synonyms)}
              </div>
            </p> <br>

            <button onclick="closeModal('#my_modal_3')" class="btn btn-primary">Complete Learning</button>
            </div>
          </div>

  `;

  document.querySelector("#my_modal_3").appendChild(div);
  document.querySelector("#my_modal_3").show();
}

function closeModal(id) {
  document.querySelector(id).close();
}

function showLoadingSpinner(status) {
  let wordCard = document.querySelector(".word-card");
  if (status) {
    wordCard.innerHTML = `<div class="col-span-full text-center"><span class="loading loading-bars loading-xl"></span></div> `;
  }
}

function loadModals(id) {
  let url = `https://openapi.programming-hero.com/api/word/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((json) => showModals(json.data));
}

function loadLessonWord(id) {
  showLoadingSpinner(true);
  let url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => showLessonWord(data.data));
}

function loadLesson() {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => {
      showLesson(data.data);
    });
}

document.querySelector(".search-btn").addEventListener("click", () => {
  let inputValue = document
    .querySelector(".search-input")
    .value.trim()
    .toLowerCase();
  let url = "https://openapi.programming-hero.com/api/words/all";

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      let allWords = data.data;

      let filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(inputValue)
      );
      removeActive();
      showLessonWord(filterWords);
    });
});
// close modal when user click outside of the main div
document.addEventListener("click", (e) => {
  let dialogContainer = e.target.closest(".modal-box");
  if (!dialogContainer) {
    document.querySelector("#my_modal_3").close();
  }
});

loadLesson();
