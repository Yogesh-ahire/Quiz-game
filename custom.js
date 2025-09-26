// Categories from Open Trivia DB
const categories = [
  {id:9,name:"General Knowledge"},
  {id:10,name:"Entertainment: Books"},
  {id:11,name:"Entertainment: Film"},
  {id:12,name:"Entertainment: Music"},
  {id:13,name:"Entertainment: Musicals & Theatres"},
  {id:14,name:"Entertainment: Television"},
  {id:15,name:"Entertainment: Video Games"},
  {id:16,name:"Entertainment: Board Games"},
  {id:17,name:"Science & Nature"},
  {id:18,name:"Science: Computers"},
  {id:19,name:"Science: Mathematics"},
  {id:20,name:"Mythology"},
  {id:21,name:"Sports"},
  {id:22,name:"Geography"},
  {id:23,name:"History"},
  {id:24,name:"Politics"},
  {id:25,name:"Art"},
  {id:26,name:"Celebrities"},
  {id:27,name:"Animals"},
  {id:28,name:"Vehicles"},
  {id:29,name:"Entertainment: Comics"},
  {id:30,name:"Science: Gadgets"},
  {id:31,name:"Entertainment: Japanese Anime & Manga"},
  {id:32,name:"Entertainment: Cartoon & Animations"}
];

// Populate category dropdown
const categorySelect = document.getElementById("category");
categories.forEach(cat => {
  const option = document.createElement("option");
  option.value = cat.id;
  option.textContent = cat.name;
  categorySelect.appendChild(option);
});

// Timer toggle
const timerToggle = document.getElementById("timerToggle");
const timerOptions = document.getElementById("timerOptions");
const timerInput = document.getElementById("timer");
const timerValue = document.getElementById("timerValue");

// Initially hide timer options
timerOptions.style.display = "none";

// Show/hide timer options
timerToggle.addEventListener("change", () => {
  timerOptions.style.display = timerToggle.checked ? "block" : "none";
});

// Update timer display dynamically
timerInput.addEventListener("input", () => {
  timerValue.textContent = `${timerInput.value}s`;
});

// Form submission
document.getElementById("customForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const category = categorySelect.value;
  const difficulty = document.getElementById("difficulty").value;
  const amount = document.getElementById("amount").value;
  const enableTimer = timerToggle.checked;
  const timer = enableTimer ? timerInput.value : null;

  if (!category || !difficulty || !amount) {
    alert("Please fill all required fields.");
    return;
  }

  // Build API URL
  const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;

  // Save quiz config in localStorage
  localStorage.setItem("customQuiz", JSON.stringify({
    category, difficulty, amount, timer, apiUrl
  }));

  // Redirect to quiz page
  window.location.href = "quiz.html";
});

// Logout Button
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("quizUsername");
  window.location.href = "login.html";
});
