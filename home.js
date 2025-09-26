// Get username from localStorage
const username = localStorage.getItem("quizUsername");
const welcomeText = document.getElementById("welcomeText");

// If logged in, show welcome message
if (username) {
  welcomeText.textContent = `Hi ${username}, Ready for the Quiz? 🎯`;
} else {
  // If no login → go back
  window.location.href = "login.html";
}

// ✅ Logout Button
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("quizUsername"); // clear login
  window.location.href = "login.html";     // back to login
});
