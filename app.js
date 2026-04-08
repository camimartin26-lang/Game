const quizData = [
  {
    question: "1. ¿Qué te atrae más en una web?",
    answers: [
      { text: "Colores vibrantes", value: "A" },
      { text: "Orden y minimalismo", value: "B" },
      { text: "Movimiento y efectos", value: "C" },
    ],
  },
  {
    question: "2. ¿Qué tipo de botones preferís?",
    answers: [
      { text: "Grandes y llamativos", value: "A" },
      { text: "Simples y discretos", value: "B" },
      { text: "Con animaciones", value: "C" },
    ],
  },
  {
    question: "3. ¿Qué sensación querés transmitir?",
    answers: [
      { text: "Energía y creatividad", value: "A" },
      { text: "Confianza y claridad", value: "B" },
      { text: "Innovación y dinamismo", value: "C" },
    ],
  },
];

const startQuizBtn = document.getElementById("startQuizBtn");
const quizIntro = document.getElementById("quizIntro");
const quizStepper = document.getElementById("quizStepper");
const questionCounter = document.getElementById("questionCounter");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");
const questionTitle = document.getElementById("questionTitle");
const answersContainer = document.getElementById("answersContainer");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");

const quizModal = document.getElementById("quizModal");
const modalResultTitle = document.getElementById("modalResultTitle");
const modalResultText = document.getElementById("modalResultText");
const closeModalBtn = document.getElementById("closeModalBtn");
const closeResultBtn = document.getElementById("closeResultBtn");
const restartQuizBtn = document.getElementById("restartQuizBtn");

const accordionItems = document.querySelectorAll(".accordion-item");

let currentQuestionIndex = 0;
let selectedAnswer = null;
let userAnswers = [];

function startQuiz() {
  currentQuestionIndex = 0;
  selectedAnswer = null;
  userAnswers = [];

  quizIntro.classList.add("hidden");
  quizStepper.classList.remove("hidden");

  renderQuestion();
}

function renderQuestion() {
  const currentQuestion = quizData[currentQuestionIndex];
  const currentStep = currentQuestionIndex + 1;
  const progress = Math.round((currentStep / quizData.length) * 100);

  questionCounter.textContent = `Pregunta ${currentStep} de ${quizData.length}`;
  progressPercent.textContent = `${progress}%`;
  progressFill.style.width = `${progress}%`;

  questionTitle.textContent = currentQuestion.question;
  answersContainer.innerHTML = "";
  selectedAnswer = userAnswers[currentQuestionIndex] || null;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.textContent = answer.text;

    if (selectedAnswer === answer.value) {
      button.classList.add("selected");
    }

    button.addEventListener("click", () => {
      selectedAnswer = answer.value;

      document.querySelectorAll(".answer-option").forEach((option) => {
        option.classList.remove("selected");
      });

      button.classList.add("selected");
    });

    answersContainer.appendChild(button);
  });

  nextQuestionBtn.textContent =
    currentQuestionIndex === quizData.length - 1 ? "Ver resultado" : "Siguiente";
}

function showResult() {
  const countA = userAnswers.filter((a) => a === "A").length;
  const countB = userAnswers.filter((a) => a === "B").length;
  const countC = userAnswers.filter((a) => a === "C").length;

  let resultTitle = "";
  let resultText = "";

  if (countA >= countB && countA >= countC) {
    resultTitle = "✨ Tu estilo es: Neubrutalismo vibrante";
    resultText =
      "Te atraen los colores fuertes, la energía visual y las interfaces con personalidad. Tu estilo ideal tiene contraste, formas marcadas y una presencia muy fuerte.";
  } else if (countB >= countA && countB >= countC) {
    resultTitle = "🧼 Tu estilo es: Minimalismo estructurado";
    resultText =
      "Preferís claridad, orden y una experiencia visual más limpia. Te funcionan mejor las interfaces elegantes, equilibradas y directas.";
  } else {
    resultTitle = "🚀 Tu estilo es: Futurismo dinámico";
    resultText =
      "Buscás innovación, movimiento y experiencias que se sientan vivas. Te atraen las interfaces modernas, expresivas y con energía tecnológica.";
  }

  modalResultTitle.textContent = resultTitle;
  modalResultText.textContent = resultText;
  quizModal.classList.remove("hidden");
}

function nextQuestion() {
  if (!selectedAnswer) {
    alert("Elegí una opción antes de continuar.");
    return;
  }

  userAnswers[currentQuestionIndex] = selectedAnswer;

  if (currentQuestionIndex < quizData.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
  } else {
    showResult();
  }
}

function closeModal() {
  quizModal.classList.add("hidden");
}

function resetQuiz() {
  closeModal();
  quizStepper.classList.add("hidden");
  quizIntro.classList.remove("hidden");
  currentQuestionIndex = 0;
  selectedAnswer = null;
  userAnswers = [];
}

startQuizBtn.addEventListener("click", startQuiz);
nextQuestionBtn.addEventListener("click", nextQuestion);
closeModalBtn.addEventListener("click", closeModal);
closeResultBtn.addEventListener("click", closeModal);
restartQuizBtn.addEventListener("click", resetQuiz);

accordionItems.forEach((item) => {
  const header = item.querySelector(".accordion-header");

  header.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    accordionItems.forEach((accordionItem) => {
      accordionItem.classList.remove("active");
    });

    if (!isActive) {
      item.classList.add("active");
    }
  });
});
