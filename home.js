// Get username from localStorage
const username = localStorage.getItem("quizUsername");
const welcomeText = document.getElementById("welcomeText");

// If logged in, show welcome message
if (username) {
  welcomeText.textContent = `Hi ${username}, Ready for the Quiz? 🎯`;
} else {
  window.location.href = "login.html";
}

// ✅ Logout Button
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("quizUsername");
  window.location.href = "login.html";
});

// ✅ Mobile Menu Toggle
document.getElementById("menu-toggle").addEventListener("click", () => {
  document.getElementById("nav-links").classList.toggle("active");
});
