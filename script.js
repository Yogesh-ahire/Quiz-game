// ================= DOM ELEMENTS =================
const questionBox = document.querySelector('.question');
const choicesBox = document.querySelector('.choices');
const submitBtn = document.querySelector('.nextBtn'); // Submit button
const skipBtn = document.querySelector('.next');      // Skip/Next button
const scoreCard = document.querySelector('.scoreCard');
const welcomeScreen = document.querySelector('#welcome');
const startBtn = document.querySelector('#start');
const progressCircle = document.querySelector('.QNum');
const gameBox = document.querySelector('.gameBox');
const noticeTimer = document.querySelector('#Qtimer-notice');
const gameTimer = document.querySelector('#Qtimer-game');
const noticeBoard = document.querySelector('#notice-statements');
const questionTimer = document.querySelector('.timer');

// ================= GAME VARIABLES =================
let quiz = [];
let currentQuestionIndex;
let usedQuestions = [];
let score = 0;
let currentQ = 0;

// Default Quiz Configuration
let quizConfig = JSON.parse(localStorage.getItem("customQuiz")) || {
    category: 9,
    difficulty: "easy",
    amount: 10,
    timer: 15,
    apiUrl: `https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple`
};

// Hide game area and timers initially
noticeTimer.style.display = "none";
gameBox.style.display = "none";

// ================= UTILITY FUNCTIONS =================

// Decode HTML entities
function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

// Shuffle array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Transform API response
function transformData(apiData) {
    return apiData.results.map(item => ({
        question: decodeHtml(item.question),
        choices: shuffle([decodeHtml(item.correct_answer), ...item.incorrect_answers.map(ans => decodeHtml(ans))]),
        answer: decodeHtml(item.correct_answer)
    }));
}

// ================= LOAD QUIZ DATA =================
async function loadQuizData() {
    try {
        const res = await fetch(quizConfig.apiUrl);
        const data = await res.json();

        if (data.response_code === 0 && data.results.length > 0) {
            return transformData(data);
        } else {
            alert("Failed to fetch quiz. Please try again.");
            return [];
        }
    } catch (error) {
        alert("Error fetching quiz. Check your internet connection.");
        return [];
    }
}

// ================= NOTICE BOARD =================
function updateNoticeBoard() {
    const categories = [
        { id: 9, name: "General Knowledge" }, { id: 10, name: "Entertainment: Books" },
        { id: 11, name: "Entertainment: Film" }, { id: 12, name: "Entertainment: Music" },
        { id: 13, name: "Musicals & Theatres" }, { id: 14, name: "Television" },
        { id: 15, name: "Video Games" }, { id: 16, name: "Board Games" },
        { id: 17, name: "Science & Nature" }, { id: 18, name: "Computers" },
        { id: 19, name: "Mathematics" }, { id: 20, name: "Mythology" },
        { id: 21, name: "Sports" }, { id: 22, name: "Geography" },
        { id: 23, name: "History" }, { id: 24, name: "Politics" },
        { id: 25, name: "Art" }, { id: 26, name: "Celebrities" },
        { id: 27, name: "Animals" }, { id: 28, name: "Vehicles" },
        { id: 29, name: "Comics" }, { id: 30, name: "Gadgets" },
        { id: 31, name: "Anime & Manga" }, { id: 32, name: "Cartoon & Animations" }
    ];

    const categoryName = categories.find(c => c.id == quizConfig.category)?.name || "General Knowledge";

    // Update notice board
    noticeBoard.querySelector("ul").innerHTML = `
        <li>${categoryName} - ${quizConfig.difficulty} level</li>
        <li>Total Questions: ${quizConfig.amount}</li>
        <li>Points per Question: 5</li>
        <li>Time per Question: ${quizConfig.timer} seconds</li>
    `;

    noticeBoard.style.display = "block";
}

// ================= QUESTION TIMER =================


function startQuestionTimer() {
    questionTimer.style.display = "flex";
    let timeLeft = quizConfig.timer;

    const interval = setInterval(() => {
        questionTimer.textContent = timeLeft;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(interval);
            skipQuestion();
        }
    }, 1000);

    // Clear interval on click
    submitBtn.addEventListener('click', () => clearInterval(interval));
    skipBtn.addEventListener('click', () => clearInterval(interval));
}


// ================= DISPLAY QUESTIONS =================
function showQuestion() {
    gameTimer.style.display = "none";
    questionTimer.style.display = "none";
    nextQuestion();
    if (quizConfig.timer) {
        startQuestionTimer();
    }
    submitBtn.disabled = true;

    const q = quiz[currentQuestionIndex];
    questionBox.textContent = q.question;

    // Render choices
    choicesBox.innerHTML = "";
    q.choices.forEach(choice => {
        const div = document.createElement('div');
        div.textContent = choice;
        div.classList.add('choice');
        choicesBox.appendChild(div);

        // Selection logic
        div.addEventListener('click', () => {
            submitBtn.disabled = false;
            choicesBox.querySelectorAll('.choice').forEach(c => c.classList.remove('selected'));
            div.classList.add('selected');
        });
    });
}

// ================= RANDOM QUESTION PICKER =================
function pickRandomQuestion() {
    const idx = Math.floor(Math.random() * quizConfig.amount);
    currentQuestionIndex = idx;

    if (usedQuestions.length < quizConfig.amount) {
        if (usedQuestions.includes(currentQuestionIndex)) pickRandomQuestion();
        else {
            showQuestion();
            usedQuestions.push(currentQuestionIndex);
        }
    } else {
        showScore();
    }
}

// ================= CHECK ANSWER =================
function checkAnswer() {
    const selected = document.querySelector('.choice.selected');
    if (!selected) return;

    if (selected.textContent === quiz[currentQuestionIndex].answer) {
        score += 5;
        selected.classList.add('correct');
    } else {
        selected.classList.add('wrong');
        // Highlight correct choice
        choicesBox.querySelectorAll('.choice').forEach(c => {
            if (c.textContent === quiz[currentQuestionIndex].answer) c.classList.add('correct');
        });
    }

    setTimeout(() => pickRandomQuestion(), 1000);
}

// ================= SKIP QUESTION =================
function skipQuestion() {
    if (skipBtn.textContent === "Skip") pickRandomQuestion();
    else {
        gameTimer.style.display = "flex";
        skipBtn.textContent = "Preparing Quiz";
        loadQuizData().then(q => {
            quiz = q;
            startCountdown();
            setTimeout(() => {
                skipBtn.textContent = "Skip";
                playAgain();
            }, 5100);
        });
    }
}

// ================= PLAY AGAIN =================
function playAgain() {
    usedQuestions = [];
    score = 0;
    currentQ = 0;

    questionBox.style.display = "block";
    choicesBox.style.display = "block";
    submitBtn.style.display = "block";
    scoreCard.innerHTML = "";
    progressCircle.style.display = "flex";

    pickRandomQuestion();
}

// ================= SHOW SCORE =================
function showScore() {
    questionBox.style.display = "none";
    choicesBox.style.display = "none";
    submitBtn.style.display = "none";
    progressCircle.style.display = "none";
    questionTimer.style.display = "none";
    noticeTimer.style.display = "none";

    skipBtn.textContent = "Play Again";
    skipBtn.classList.add('playAgain');

    let percentage = Math.round((score /(quizConfig.amount * 5)) * 100);

    // Determine circle color class
    let circleClass = percentage >= 70 ? 'high' : percentage >= 40 ? 'mid' : 'low';

    scoreCard.innerHTML = `
        <div class="score-card">
            <h2 class="score-title">🎯 Quiz Results</h2>
            <div class="circle ${circleClass}">
                <div class="inside-circle">0%</div>
            </div>
            <p class="score-text">You Scored <b>${score}</b> out of ${quizConfig.amount * 5}</p>
            <p class="score-text">${percentage >= 70 ? "🔥 Excellent job!" : percentage >= 40 ? "👍 Good effort!" : "😢 Keep practicing!"}</p>
            <a href= "index.html"><button id="getback">Home</button></a>
        </div>
    `;

    // Animate the circle
    const circle = scoreCard.querySelector('.circle');
    const insideCircle = circle.querySelector('.inside-circle');
    let progress = 0;
    const interval = setInterval(() => {
        if (progress >= percentage) {
            clearInterval(interval);
        } else {
            progress++;
            circle.style.setProperty('--progress', progress);
            insideCircle.textContent = `${progress}%`;
        }
    }, 15); // Adjust speed
}


// ================= PROGRESS BAR =================
function updateProgress(current, total) {
    const percent = (current / total) * 360;
    progressCircle.style.background = `conic-gradient(#00c6ff ${percent}deg, #ddd ${percent}deg)`;
    document.getElementById('progressText').innerText = `${current}/${total}`;
}

function nextQuestion() {
    if (currentQ < quizConfig.amount) currentQ++;
    updateProgress(currentQ, quizConfig.amount);
}

// ================= COUNTDOWN BEFORE QUIZ =================
function startCountdown() {
    noticeBoard.style.display = "none";
    noticeTimer.style.display = "flex";
    gameTimer.style.display = "flex";
    let count = 4;

    const interval = setInterval(() => {
        noticeTimer.textContent = count;
        gameTimer.textContent = count;
        count--;
        if (count < 0) {
            noticeTimer.textContent = 5;
            gameTimer.textContent = 5;
            clearInterval(interval);
        }
    }, 980);
}

// ================= START QUIZ =================
function startQuiz() {
    welcomeScreen.style.display = "none";
    gameBox.style.display = "block";
    questionTimer.textContent = quizConfig.timer;
    pickRandomQuestion();
}

// ================= EVENT LISTENERS =================
updateNoticeBoard();

startBtn.addEventListener('click', () => {
    startBtn.textContent = "Preparing Quiz";
    startBtn.disabled = true;
    loadQuizData().then(q => {
        quiz = q;
    });
    startCountdown();
    setTimeout(() => startQuiz(), 5100);
});

submitBtn.addEventListener('click', checkAnswer);
skipBtn.addEventListener('click', skipQuestion);
