// const questions = [
//   {
//     question: "What is the capital of Pakistan?",
//     answers: ["Islamabad", "Lahore", "Karachi", "Quetta"],
//     correct: "Islamabad"
//   },
//   {
//     question: "Which language runs in a web browser?",
//     answers: ["Java", "C", "Python", "JavaScript"],
//     correct: "JavaScript"
//   },
//   {
//     question: "What does HTML stand for?",
//     answers: [
//       "Hyper Text Markup Language",
//       "Home Tool Markup Language",
//       "Hyperlinks and Text Markup Language",
//       "Hyperlink Transfer Markup Language"
//     ],
//     correct: "Hyper Text Markup Language"
//   }
// ];
let questions = [];
let currentIndex = 0;
let score = 0;

const questionEl = document.getElementById("question");
const answerBtns = document.querySelectorAll(".answer-btn");
const nextBtn = document.getElementById("next-btn");
const resultEl = document.getElementById("result");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const quizContent = document.getElementById("quiz-content");

startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restartQuiz);

function startQuiz() {
  startBtn.style.display = "none";
  resultEl.textContent = "";
  quizContent.classList.remove("hidden");
  restartBtn.classList.add("hidden");
  fetchQuestions();
}

function restartQuiz() {
  currentIndex = 0;
  score = 0;
  resultEl.textContent = "";
  restartBtn.classList.add("hidden");
  quizContent.classList.remove("hidden");
  fetchQuestions();
}

function fetchQuestions() {
  fetch("https://opentdb.com/api.php?amount=5&type=multiple")
    .then(res => res.json())
    .then(data => {
      questions = data.results.map(q => ({
        question: q.question,
        answers: shuffle([...q.incorrect_answers, q.correct_answer]),
        correct: q.correct_answer
      }));
      loadQuestion();
    });
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function loadQuestion() {
  const current = questions[currentIndex];
  questionEl.innerHTML = `Q${currentIndex + 1}: ${current.question}`;
  answerBtns.forEach((btn, i) => {
    btn.textContent = current.answers[i];
    btn.disabled = false;
    btn.classList.remove("bg-green-300", "bg-red-300");
    btn.classList.add("bg-gray-200");
    btn.onclick = () => checkAnswer(btn);
  });
  nextBtn.classList.add("hidden");
}

function checkAnswer(button) {
  const correct = questions[currentIndex].correct;
  if (button.textContent === correct) {
    score++;
    button.classList.remove("bg-gray-200");
    button.classList.add("bg-green-300");
  } else {
    button.classList.remove("bg-gray-200");
    button.classList.add("bg-red-300");
  }

  answerBtns.forEach(btn => (btn.disabled = true));
  nextBtn.classList.remove("hidden");
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
  nextBtn.classList.add("hidden");
}

function showResult() {
  quizContent.classList.add("hidden");
  resultEl.textContent = `🎉 You scored ${score} out of ${questions.length}`;
  restartBtn.classList.remove("hidden");
}
