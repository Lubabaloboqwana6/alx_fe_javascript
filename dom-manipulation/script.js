const quotes = [
  {
    text: "The only limit to our realization of tomorrow is our doubts of today",
    category: "Inpserational",
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    category: "Life Decision",
  },
];

function showRandomQuote() {
  const randomQuotes = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomQuotes];
  const quoteDisplay = document.querySelector("#quoteDisplay");
  quoteDisplay.innerHTML = `<p>${quote.text}</p> <em><p>${quote.category}</p></em>`;
}

function createAddQuoteForm() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("Quote added succesfully!");
  } else {
    alert("Please add a new quote");
  }
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
