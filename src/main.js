const API_KEY = import.meta.env.VITE_NASA_API_KEY;

const searchEngines = {
  google: "https://www.google.com/search?q=",
  bing: "https://www.bing.com/search?q=",
  duckduckgo: "https://duckduckgo.com/?q=",
  brave: "https://search.brave.com/search?q="
};

function updateGreeting() {
  const now = new Date();
  const hour = now.getHours();

  let greeting;
  if (hour < 5) {
    greeting = "good night";
  } else if (hour < 12) {
    greeting = "good morning";
  } else if (hour < 17) {
    greeting = "good afternoon";
  } else if (hour < 21) {
    greeting = "good evening";
  } else {
    greeting = "good night";
  }

  document.querySelector("#subtitle").textContent = greeting;
}

updateGreeting();
setInterval(updateGreeting, 60000);

function setBackground() {
  fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      if (data.media_type === "image") {
        const imageUrl = data.hdurl || data.url;
        document.body.style.backgroundImage = `url(${imageUrl})`;
      }
    })
    .catch(err => {
      console.log("Failed to load background:", err.message);
    });
}

setBackground();


const engineSelect = document.querySelector("#engine-select");
const savedEngine = localStorage.getItem("searchEngine") || "google";
engineSelect.value = savedEngine;

document.querySelector("#search-input").placeholder = `search ${savedEngine}`;

engineSelect.addEventListener("change", () => {
  const selected = engineSelect.value;
  localStorage.setItem("searchEngine", selected);
  document.querySelector("#search-input").placeholder = `search ${selected}`;
});

document.querySelector("#search-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const query = document.querySelector("#search-input").value.trim();
  const engine = localStorage.getItem("searchEngine") || "google";

  if (query) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.7 }
    });

    setTimeout(() => {
      window.location.href = `${searchEngines[engine]}${encodeURIComponent(query)}`;
    }, 400);
  }
});

document.querySelector("#settings-btn").addEventListener("click", () => {
  document.querySelector("#settings-panel").classList.toggle("hidden");
});

document.querySelector("#close-settings").addEventListener("click", () => {
  document.querySelector("#settings-panel").classList.add("hidden");
});

const themeBtn = document.querySelector("#theme-btn");

function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
}

const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

themeBtn.addEventListener("click", () => {
  const currentTheme = document.body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  applyTheme(newTheme);
});

