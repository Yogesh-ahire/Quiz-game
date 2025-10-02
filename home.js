// Get username from localStorage
const username = localStorage.getItem("quizUsername");
const welcomeText = document.getElementById("welcomeText");

if (username) {
  welcomeText.textContent = `Hi ${username}, Ready for the Quiz? 🎯`;
} else {
  window.location.href = "login.html";
}


const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("quizUsername");
  window.location.href = "login.html";
});

document.getElementById("menu-toggle").addEventListener("click", () => {
  document.getElementById("nav-links").classList.toggle("active");
});
