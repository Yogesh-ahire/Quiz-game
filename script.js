import localQuiz from "./localQuiz.js";
// const container = document.querySelector('.container');
const questionbox = document.querySelector('.question');
const choicesbox = document.querySelector('.choices');
const submit = document.querySelector('.nextBtn');
const skip = document.querySelector('.next');
const scoreCard = document.querySelector('.scoreCard');
const welcome = document.querySelector('#welcome');
const start = document.querySelector('#start');
const QNum = document.querySelector('.QNum');


let quiz = [];
let currentQuestionIndex;
let num = [];
let score = 0;
let currentQ = 0;
let totalQ = 10;
// questionbox.style.display = "none";
// choicesbox.style.display = "none";
// submit.style.display = "none";
// skip.style.display = "none";

// Decode HTML entities from Trivia DB API
function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

// Shuffle array (Fisher–Yates shuffle is more reliable than sort)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Transform API data into your quiz format
function transformData(apiData) {
    return apiData.results.map(item => {
        return {
            quistion: "Q. " + decodeHtml(item.question),
            choices: shuffle([
                decodeHtml(item.correct_answer),
                ...item.incorrect_answers.map(ans => decodeHtml(ans))
            ]),
            answer: decodeHtml(item.correct_answer)
        };
    });
}


// fetch from Trivia DB with fallback
async function loadQuizData() {
    try {
        const res = await fetch('https://opentdb.com/api.php?amount=10&category=18&type=multiple');
        const data = await res.json();

        if (data.response_code === 0 && data.results.length > 0) {
            // transform API data to your format
            return transformData(data);
        } else {
            return localQuiz;
        }
    } catch (error) {
        return localQuiz;
    }
}

//  start of web
loadQuizData().then(quizD => {
    quiz = quizD;
    console.log(quiz);
    randomNum();    // start quiz only after data is ready
});


//play again
const playAgain = () => {
    num = [];
    score = 0;
    currentQ = 0;
    questionbox.style.display = "block";
    choicesbox.style.display = "block";
    submit.style.display = "block";
    scoreCard.textContent = "";
    QNum.style.display = "flex";
    loadQuizData().then(quizD => {
        quiz = quizD;   // not push!
        randomNum();    // start quiz only after data is ready
    });
}

// submit button come here 
const randomNum = () => {
    const randIdx = Math.floor(Math.random() * 10);
    currentQuestionIndex = randIdx;
    if (num.length < 10) {
        if (num.includes(currentQuestionIndex)) {
            randomNum();
        }
        else {
            showQuestions();
            num.push(currentQuestionIndex);
        }
    }
    else {
        showScore();
        QNum.style.display = "none";
    }
}

//arraw function to show Questions
const showQuestions = () => {
    // console.log("hello")
    nextQuestion();
    const questionDetails = quiz[currentQuestionIndex];
    questionbox.textContent = questionDetails.quistion;

    choicesbox.textContent = "";
    for (let i = 0; i < questionDetails.choices.length; i++) {
        const currentChoice = questionDetails.choices[i];
        const choiceDiv = document.createElement('div');
        choiceDiv.textContent = currentChoice;
        choiceDiv.classList.add('choice')
        choicesbox.appendChild(choiceDiv);

        //select option
        choiceDiv.addEventListener('click', () => {
            if (choiceDiv.classList.contains('selected')) {
                choiceDiv.classList.remove('selected');
            }
            else {
                for (let i = 0; i < choicesbox.childElementCount; i++) {
                    choicesbox.children[i].classList.remove('selected');
                }
                choiceDiv.classList.add('selected');
            }
        });
    }
}

//check answer
const checkAnswer = () => {
    const selectedchoise = document.querySelector('.choice.selected');
    if (selectedchoise == null) {
        alert("select answer");
    }
    if (selectedchoise.textContent === quiz[currentQuestionIndex].answer) {
        alert("Correct Asnwer!");
        score+=5;
    }
    else {
        alert("Wrong Answer!");
        score-=2;
    }
}

//show score 
const showScore = () => {
    questionbox.style.display = "none";
    choicesbox.style.display = "none";
    submit.style.display = "none";
    skip.textContent = "Play Again";
    skip.classList.add('playAgain');
    scoreCard.textContent = `You Scored ${score} out of 50`;

}

// randomNum();

//progress code 
function updateProgress(current, total) {
  let percent = (current / total) * 360; // convert to degrees
  document.querySelector('.QNum').style.background =
    `conic-gradient(#00c6ff ${percent}deg, #ddd ${percent}deg)`;
  
  document.getElementById('progressText').innerText = `${current}/${total}`;
}

// call this when moving to next question
function nextQuestion() {
  if (currentQ < totalQ) {
    currentQ++;
    updateProgress(currentQ, totalQ);
  }
}



submit.addEventListener('click', () => {
    checkAnswer();
    randomNum();
});

skip.addEventListener('click', () => {
    if (skip.textContent === "Skip") {
        randomNum();
    }
    else {
        skip.classList.remove('playAgain');
        skip.textContent = "Skip";
        playAgain();
    }
});

start.addEventListener('click', () => {
    welcome.style.display = "none"
    questionbox.style.display = "block";
    choicesbox.style.display = "block";
    submit.style.display = "block";
    skip.style.display = "block";
});