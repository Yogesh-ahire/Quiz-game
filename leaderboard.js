document.addEventListener("DOMContentLoaded", () => {
  const leaderboardList = document.getElementById("leaderboard-list");
  const history = JSON.parse(localStorage.getItem("quizHistory")) || [];

  if (history.length === 0) {
    leaderboardList.innerHTML = `<p>No quizzes played yet.</p>`;
    return;
  }

  // ✅ Group by player and keep best (highest score, then fastest)
  const bestScores = {};
  history.forEach(item => {
    const percentage = (item.score / item.maxScore) * 100;

    if (!bestScores[item.player]) {
      bestScores[item.player] = {
        player: item.player,
        score: item.score,
        maxScore: item.maxScore,
        percentage,
        timeTaken: item.timeTaken,
        category: item.category,
        date: item.date
      };
    } else {
      const existing = bestScores[item.player];
      // Compare score first, then timeTaken
      if (
        percentage > existing.percentage ||
        (percentage === existing.percentage && item.timeTaken < existing.timeTaken)
      ) {
        bestScores[item.player] = {
          player: item.player,
          score: item.score,
          maxScore: item.maxScore,
          percentage,
          timeTaken: item.timeTaken,
          category: item.category,
          date: item.date
        };
      }
    }
  });

  // Convert to array and sort (higher score first, then faster time)
  const sorted = Object.values(bestScores).sort((a, b) => {
    if (b.percentage === a.percentage) {
      return a.timeTaken - b.timeTaken; // lower time = higher rank
    }
    return b.percentage - a.percentage;
  });

  // ✅ Render top 10 with time shown
  sorted.slice(0, 10).forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "leaderboard-entry";
    div.title = `Category: ${item.category}\nPlayed on: ${item.date}\nTime Taken: ${item.timeTaken}s`;
    div.innerHTML = `
      <span>#${index + 1} 👤 ${item.player}</span>
      <span class="score">${item.score}/${item.maxScore} (${Math.round(item.percentage)}%) ⏱ ${item.timeTaken}s</span>
    `;
    leaderboardList.appendChild(div);
  });
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("quizUsername");
  window.location.href = "login.html";
});
