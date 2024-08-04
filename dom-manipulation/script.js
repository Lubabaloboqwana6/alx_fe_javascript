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
    location.reload(); // Reload the page to reflect the imported quotes
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

function filterByCategory() {
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

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document
  .getElementById("addQuote")
  .addEventListener("click", createAddQuoteForm);
document.getElementById("exportQuotes").addEventListener("click", exportQuotes);
document
  .getElementById("importFile")
  .addEventListener("change", importFromJsonFile);

// Initial setup
populateCategories();
displayQuotes();
