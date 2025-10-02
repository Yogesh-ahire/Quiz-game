const categories = [
  {id:9, name:"General Knowledge"},
  {id:10, name:"Books"},
  {id:11, name:"Film"},
  {id:12, name:"Music"},
  {id:17, name:"Science & Nature"},
  {id:18, name:"Computers"},
  {id:19, name:"Mathematics"},
  {id:21, name:"Sports"},
  {id:22, name:"Geography"},
  {id:23, name:"History"},
  {id:25, name:"Art"},
  {id:27, name:"Animals"},
  {id:28, name:"Vehicles"},
  {id:31, name:"Anime & Manga"},
];

const container = document.getElementById("categories-list");

categories.forEach(cat => {
  const div = document.createElement("div");
  div.className = "category-card";
  div.textContent = cat.name;
  div.addEventListener("click", () => {
    // Save selected category to localStorage
    const quizConfig = {
      category: cat.id,
      difficulty: "easy",
      amount: 10,
      timer: 15,
      apiUrl: `https://opentdb.com/api.php?amount=10&category=${cat.id}&difficulty=easy&type=multiple`
    };
    localStorage.setItem("customQuiz", JSON.stringify(quizConfig));
    window.location.href = "quiz.html";
  });
  container.appendChild(div);
});


document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("quizUsername");
  window.location.href = "login.html";
});
