

document.addEventListener("DOMContentLoaded", function() {
    getCurrentImageOfTheDay();

    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const searchHistory = document.getElementById("search-history");

    searchForm.addEventListener("submit", function(event) {
        event.preventDefault();
        getImageOfTheDay();
    });

    searchHistory.addEventListener("click", function(event) {
        if (event.target.tagName === "LI") {
            const selectedDate = event.target.textContent;
            getImageOfTheDay(selectedDate);
        }
    });
});

function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    getImage(currentDate);
}

function getImageOfTheDay(date = null) {
    const selectedDate = date || document.getElementById("search-input").value;
    getImage(selectedDate);
}

function getImage(date) {
    const apiKey = "JLzuhFlDBGFN9OtvDvg59kcitjzgDdchSaoqBc2d";
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                if (date === new Date().toISOString().split("T")[0]) {
                    alert("Failed to fetch data from the API. Trying yesterday's date.");
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayDate = yesterday.toISOString().split("T")[0];
                    getImage(yesterdayDate);
                }
                else throw new Error("Failed to fetch data from the API");
            }
            return response.json();
        })
        .then(data => {
            displayImage(data);
            saveSearch(date);
            addSearchToHistory();

           
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Failed to fetch data from the API. Please try again.");
        });
}

function displayImage(data) {
    const currentImageContainer = document.getElementById("current-image-container");
    currentImageContainer.innerHTML = `
        <img src="${data.url}" alt="${data.title}">
        <p>${data.title}</p>
        <p>${data.explanation}</p>
    `;
}

function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem("searches")) || [];
    searches.push(date);
    localStorage.setItem("searches", JSON.stringify(searches));
}

function addSearchToHistory() {
    const searchHistory = document.getElementById("search-history");
    searchHistory.innerHTML = "";
    
    let searches = JSON.parse(localStorage.getItem("searches")) || [];
    searches.forEach(date => {
        const listItem = document.createElement("li");
        listItem.textContent = date;
        searchHistory.appendChild(listItem);
    });
}
