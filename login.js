// Get references
const usernameInput = document.getElementById("username");
const loginBtn = document.getElementById("loginBtn");

// Handle login
loginBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();

  if (username) {
    // Save username in localStorage
    localStorage.setItem("quizUsername", username);

    // Redirect to home page
    window.location.href = "index.html";
  } else {
    alert("Please enter your name!");
  }
});
