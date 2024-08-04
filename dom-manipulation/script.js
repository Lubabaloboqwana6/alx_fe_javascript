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

    const newQuoteElement = document.createElement("div");
    newQuoteElement.innerHTML = `<p>${newQuote.text}</p> <em><p>${newQuote.category}</p></em>`;
    document.getElementById("quoteContainer").appendChild(newQuoteElement);

    alert("Quote added successfully!");
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

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document
  .getElementById("addQuote")
  .addEventListener("click", createAddQuoteForm);
document.getElementById("exportQuotes").addEventListener("click", exportQuotes);
document
  .getElementById("importFile")
  .addEventListener("change", importFromJsonFile);
