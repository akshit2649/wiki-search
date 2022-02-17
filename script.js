//DOM Elements
const sun = document.querySelector(".sun");
const moon = document.querySelector(".moon");
const searchEntry = document.querySelector(".text");
const form = document.querySelector("form");
const main = document.querySelector("main");
const searching = document.querySelector(".searching");
const title = document.querySelector(".title");
const searchEntryEl = document.querySelector(".searchEntry");
const resultEl = document.querySelector(".results");
const clearBtn = document.querySelector(".clear");
const pagination = document.querySelector(".pagination");
const btnPrev = document.querySelector(".prev");
const btnNext = document.querySelector(".next");

//Global
var results = [];
const numberOfResults = 20;
const RES_PER_PAGE = 7;
var PAGE = 1;

//Change Mode to dark or light mode
const changeModeToggle = function () {
    document.body.classList.toggle("dark");
    sun.classList.toggle("hidden");
    moon.classList.toggle("hidden");
};
const changeModeBtn = document.querySelectorAll(".switch-mode");
changeModeBtn.forEach(el => el.addEventListener("click", changeModeToggle));

//Set focus
searchEntry.focus();

//Empty the searchEntry
searchEntry.value = "";

//Getting the data
const getData = async function () {
    try {
        const searchTerm = searchEntry.value.trim();
        const API = encodeURI(
            `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchTerm}&gsrlimit=${numberOfResults}&prop=pageimages|extracts&exchars=140&exintro&explaintext&exlimit=max&format=json&origin=*`
        );
        const response = await fetch(API);
        if (!response.ok) throw new error();
        const data = await response.json();
        console.log(data);

        if (data.hasOwnProperty("query")) processWikiResult(data.query.pages);
    } catch (err) {
        console.error("Ans error occured!💣💣💣", err);
    }
};

//Make the results object
const processWikiResult = async function (result) {
    if (results.length) results = [];
    Object.keys(result).forEach(key => {
        const id = key;
        const title = result[key].title;
        const text = result[key].extract;
        const img = result[key].hasOwnProperty("thumbnail") ? result[key].thumbnail.source : null;
        const item = {
            id: id,
            title: title,
            img: img,
            text: text,
        };
        results.push(item);
    });
};

//Submit button handler
form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (searchEntry.value === "") return;
    await getData();
    // searchEntry.value = "";
    resultEl.innerHTML = "";
    console.log(results);
    toggleResultView();
    buildResults();
});

//Clear button handler
searchEntry.addEventListener("input", () => {
    clearBtn.classList.remove("hidden");
    if (searchEntry.value === "") clearBtn.classList.add("hidden");
});
clearBtn.addEventListener("click", () => {
    searchEntry.value = "";
    clearBtn.classList.add("hidden");
});

//Toggle the result veiw
const toggleResultView = function () {
    main.classList.add("searchToggle");
    searching.classList.add("toggleTop");
    title.classList.add("titleToggle");
    searchEntryEl.classList.add("searchEntryToggle");
    resultEl.classList.remove("hidden");
    pagination.style.display = "flex";
};

// Building the results
const buildResults = function () {
    if (!results.length) {
        resultEl.insertAdjacentHTML("beforeend", emptyResult());
        return;
    }
    resultEl.innerHTML = "";
    let pagedResult = resultsPerPage();
    const pEl = `<p class="stats">Displaying ${results.length} results</p>`;
    resultEl.insertAdjacentHTML("beforeend", pEl);
    pagedResult.forEach(data => {
        const html = `
        <div class="resultItem">
          <a href="https://en.wikipedia.org/?curid=${data.id}" target="_blank" class="resultTitle">${data.title}</a>
          <div class="resultContent">
            <img
              class="resultImage ${data.img === null ? "hidden" : ""}"
              src="${data.img}"
              alt="Dachsund"
            />
            <p class="resultDescription">
              ${data.text}
            </p>
          </div>
        </div>
  `;

        resultEl.insertAdjacentHTML("beforeend", html);
    });
};

const emptyResult = function () {
    return `<p class="stats">Sorry, no match found :( </p>`;
};

//Impliment pagination
const resultsPerPage = function (page = PAGE) {
    PAGE = page;
    const start = (page - 1) * RES_PER_PAGE;
    const end = page * RES_PER_PAGE;
    return results.slice(start, end);
};

//Pagination Event
btnNext.addEventListener("click", function () {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (PAGE === 2) btnNext.style.visibility = "hidden";
    btnPrev.style.visibility = "visible";
    PAGE++;
    resultsPerPage(PAGE);
    buildResults();
});
btnPrev.addEventListener("click", function () {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    PAGE--;
    if (PAGE === 1) btnPrev.style.visibility = "hidden";
    btnNext.style.visibility = "visible";
    resultsPerPage(PAGE);
    buildResults();
});
