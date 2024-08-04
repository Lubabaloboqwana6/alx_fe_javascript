const serverUrl = "https://jsonplaceholder.typicode.com/posts";
const quotes = JSON.parse(localStorage.getItem("quotes")) || [
  {
    text: "The only limit to our realization of tomorrow is our doubts of today",
    category: "Inspirational",
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    category: "Life Decision",
  },
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.querySelector("#quoteDisplay");
  quoteDisplay.innerHTML = `<p>${quote.text}</p> <em><p>${quote.category}</p></em>`;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

function createAddQuoteForm() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("Quote added successfully!");
    populateCategories();
    displayQuotes();
  } else {
    alert("Please add a new quote");
  }
}

function exportQuotes() {
  const dataStr = JSON.stringify(quotes);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const exportFileDefaultName = "quotes.json";

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", url);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
    location.reload();
  };
  fileReader.readAsText(event.target.files[0]);
}

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map((quote) => quote.category))];
  categoryFilter.innerHTML = '<option value="all">All</option>';
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function filterQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);
  displayQuotes(filteredQuotes);
}

function displayQuotes(quotesToDisplay = quotes) {
  const quoteContainer = document.getElementById("quoteContainer");
  quoteContainer.innerHTML = "";
  quotesToDisplay.forEach((quote) => {
    const quoteElement = document.createElement("div");
    quoteElement.innerHTML = `<p>${quote.text}</p> <em><p>${quote.category}</p></em>`;
    quoteContainer.appendChild(quoteElement);
  });
}

function fetchServerData() {
  fetch(serverUrl)
    .then((response) => response.json())
    .then((serverQuotes) => {
      resolveConflicts(serverQuotes);
    })
    .catch((error) => console.error("Error fetching data from server:", error));
}

function resolveConflicts(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
  const mergedQuotes = [...serverQuotes, ...localQuotes];

  const uniqueQuotes = mergedQuotes.filter(
    (quote, index, self) =>
      index ===
      self.findIndex(
        (q) => q.text === quote.text && q.category === quote.category
      )
  );

  localStorage.setItem("quotes", JSON.stringify(uniqueQuotes));
  quotes.length = 0;
  quotes.push(...uniqueQuotes);
  displayQuotes();
  notifyUser("Data has been synced with the server.");
}

function notifyUser(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  setTimeout(() => {
    notification.textContent = "";
  }, 5000);
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document
  .getElementById("addQuote")
  .addEventListener("click", createAddQuoteForm);
document.getElementById("exportQuotes").addEventListener("click", exportQuotes);
document
  .getElementById("importFile")
  .addEventListener("change", importFromJsonFile);
document
  .getElementById("categoryFilter")
  .addEventListener("change", filterQuote);

populateCategories();
displayQuotes();

setInterval(fetchServerData, 60000);
