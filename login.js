const usernameInput = document.getElementById("username");
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();

  if (username) {
    localStorage.setItem("quizUsername", username);

    window.location.href = "index.html";
  } else {
    alert("Please enter your name!");
  }
});
