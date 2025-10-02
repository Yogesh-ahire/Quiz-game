document.addEventListener("DOMContentLoaded", () => {
  const historyList = document.getElementById("history-list");
  const historyData = JSON.parse(localStorage.getItem("quizHistory")) || [];

  if (historyData.length === 0) {
    historyList.innerHTML = `<p style="color:#ddd;">No quiz history available. Play a quiz first!</p>`;
    return;
  }

  
  historyData.reverse().forEach((quiz, index) => {
    const percentage = Math.round((quiz.score / quiz.maxScore) * 100);
    let scoreClass = percentage >= 75 ? "high" : percentage >= 50 ? "mid" : "low";

    const card = document.createElement("div");
    card.classList.add("history-card");
    card.innerHTML = `
      <p><b>Quiz #${historyData.length - index}</b> 🗓 ${quiz.date}</p>
      <p>📚 Category: ${quiz.category}</p>
      <p>🎯 Difficulty: ${quiz.difficulty}</p>
      <p>⏳ Time: ${quiz.timeTaken}s</p>
      <p>❓ Questions: ${quiz.numQuestions}</p>
      <p class="score ${scoreClass}">🏆 Score: ${quiz.score}/${quiz.maxScore} (${percentage}%)</p>
    `;
    historyList.appendChild(card);
  });
});
