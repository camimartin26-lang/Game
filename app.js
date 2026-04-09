document.addEventListener("DOMContentLoaded", () => {
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
  const prevQuestionBtn = document.getElementById("prevQuestionBtn");
  const quizError = document.getElementById("quizError");
  const quizCard = document.getElementById("quizCard");

  const quizModal = document.getElementById("quizModal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalResultTitle = document.getElementById("modalResultTitle");
  const modalResultText = document.getElementById("modalResultText");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const closeResultBtn = document.getElementById("closeResultBtn");
  const restartQuizBtn = document.getElementById("restartQuizBtn");

  const accordionItems = document.querySelectorAll(".h-accordion-item");

  const featureOverlay = document.getElementById("featureOverlay");
  const featureBackdrop = featureOverlay?.querySelector(".feature-backdrop");
  const featureOpenButtons = document.querySelectorAll(".feature-open-btn");
  const featureCloseButtons = document.querySelectorAll(".feature-close-btn");
  const featureModals = document.querySelectorAll(".feature-modal");

  const innerAccordionItems = document.querySelectorAll(".inner-accordion-item");

  const startGameBtn = document.getElementById("startGameBtn");
  const gameTarget = document.getElementById("gameTarget");
  const gameArea = document.getElementById("gameArea");
  const gameScore = document.getElementById("gameScore");
  const gameTimer = document.getElementById("gameTimer");

  const miniGalleryImages = [
    "images/IMG-20260408-WA0001.jpg",
    "images/IMG-20260408-WA0002.jpg",
    "images/IMG-20260408-WA0003.jpg",
    "images/IMG-20260408-WA0004.jpg",
  ];

  const miniGalleryImage = document.getElementById("miniGalleryImage");
  const miniPrevBtn = document.getElementById("miniPrevBtn");
  const miniNextBtn = document.getElementById("miniNextBtn");

  let currentQuestionIndex = 0;
  let selectedAnswer = null;
  let userAnswers = [];

  let score = 0;
  let timeLeft = 10;
  let gameInterval = null;
  let gameRunning = false;

  let miniGalleryIndex = 0;

  function lockBodyScroll() {
    document.body.style.overflow = "hidden";
  }

  function unlockBodyScroll() {
    const quizModalOpen = quizModal && !quizModal.classList.contains("hidden");
    const featureOpen =
      featureOverlay && !featureOverlay.classList.contains("hidden");

    if (!quizModalOpen && !featureOpen) {
      document.body.style.overflow = "";
    }
  }

  function startQuiz() {
    currentQuestionIndex = 0;
    selectedAnswer = null;
    userAnswers = [];
    quizError?.classList.add("hidden");
    quizIntro?.classList.add("hidden");
    quizStepper?.classList.remove("hidden");
    renderQuestion();
  }

  function updateProgress() {
    const currentStep = currentQuestionIndex + 1;
    const progress = Math.round((currentStep / quizData.length) * 100);

    if (questionCounter) {
      questionCounter.textContent = `Pregunta ${currentStep} de ${quizData.length}`;
    }
    if (progressPercent) {
      progressPercent.textContent = `${progress}%`;
    }
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
  }

  function updateButtons() {
    if (prevQuestionBtn) {
      prevQuestionBtn.classList.toggle("hidden", currentQuestionIndex === 0);
    }

    const nextLabel = nextQuestionBtn?.querySelector("span");
    if (nextLabel) {
      nextLabel.textContent =
        currentQuestionIndex === quizData.length - 1
          ? "Ver resultado"
          : "Siguiente";
    }
  }

  function renderQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    selectedAnswer = userAnswers[currentQuestionIndex] || null;

    quizCard?.classList.add("animating");

    window.setTimeout(() => {
      updateProgress();
      updateButtons();

      if (questionTitle) {
        questionTitle.textContent = currentQuestion.question;
      }

      if (answersContainer) {
        answersContainer.innerHTML = "";

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
            quizError?.classList.add("hidden");

            document.querySelectorAll(".answer-option").forEach((option) => {
              option.classList.remove("selected");
            });

            button.classList.add("selected");
          });

          answersContainer.appendChild(button);
        });
      }

      quizCard?.classList.remove("animating");
    }, 120);
  }

  function getResultContent() {
    const countA = userAnswers.filter((a) => a === "A").length;
    const countB = userAnswers.filter((a) => a === "B").length;
    const countC = userAnswers.filter((a) => a === "C").length;

    if (countA >= countB && countA >= countC) {
      return {
        title: "✨ Tu estilo es: Neubrutalismo vibrante",
        text: "Te atraen los colores fuertes, la energía visual y las interfaces con personalidad. Tu estética ideal combina impacto, contraste y un look muy expresivo.",
      };
    }

    if (countB >= countA && countB >= countC) {
      return {
        title: "🧩 Tu estilo es: Minimalismo estructurado",
        text: "Preferís claridad, orden y equilibrio visual. Te funcionan mejor las interfaces limpias, directas y con una sensación de control más refinada.",
      };
    }

    return {
      title: "🚀 Tu estilo es: Futurismo dinámico",
      text: "Buscás innovación, movimiento y una experiencia que se sienta viva. Te atraen las interfaces modernas, experimentales y con fuerte energía tecnológica.",
    };
  }

  function showResult() {
    if (!quizModal) return;

    const result = getResultContent();
    if (modalResultTitle) modalResultTitle.textContent = result.title;
    if (modalResultText) modalResultText.textContent = result.text;

    quizModal.classList.remove("hidden");
    lockBodyScroll();
  }

  function nextQuestion() {
    if (!selectedAnswer) {
      quizError?.classList.remove("hidden");
      return;
    }

    userAnswers[currentQuestionIndex] = selectedAnswer;

    if (currentQuestionIndex < quizData.length - 1) {
      currentQuestionIndex += 1;
      renderQuestion();
      return;
    }

    showResult();
  }

  function prevQuestion() {
    if (currentQuestionIndex === 0) return;

    userAnswers[currentQuestionIndex] = selectedAnswer;
    currentQuestionIndex -= 1;
    renderQuestion();
    quizError?.classList.add("hidden");
  }

  function closeModal() {
    if (!quizModal) return;
    quizModal.classList.add("hidden");
    unlockBodyScroll();
  }

  function resetQuiz() {
    closeModal();
    currentQuestionIndex = 0;
    selectedAnswer = null;
    userAnswers = [];
    quizError?.classList.add("hidden");
    quizStepper?.classList.add("hidden");
    quizIntro?.classList.remove("hidden");
    if (progressFill) {
      progressFill.style.width = "0%";
    }
  }

  function setupAccordion() {
    if (!accordionItems.length) return;

    accordionItems.forEach((item) => {
      const trigger = item.querySelector(".h-accordion-trigger");
      if (!trigger) return;

      trigger.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        accordionItems.forEach((accordionItem) => {
          accordionItem.classList.remove("active");
        });

        if (!isActive) {
          item.classList.add("active");
        }
      });
    });
  }

  function openFeatureModal(id) {
    if (!featureOverlay) return;

    featureOverlay.classList.remove("hidden");
    featureModals.forEach((modal) => modal.classList.add("hidden"));

    const activeModal = document.getElementById(id);
    if (activeModal) {
      activeModal.classList.remove("hidden");
    }

    lockBodyScroll();

    if (id === "featureD") {
      updateMiniGallery();
    }
  }

  function closeFeatureModal() {
    if (!featureOverlay) return;

    featureOverlay.classList.add("hidden");
    featureModals.forEach((modal) => modal.classList.add("hidden"));
    stopGame();
    unlockBodyScroll();
  }

  function setupFeatureModals() {
    featureOpenButtons.forEach((button) => {
      button.addEventListener("click", () => {
        openFeatureModal(button.dataset.modal);
      });
    });

    featureCloseButtons.forEach((button) => {
      button.addEventListener("click", closeFeatureModal);
    });

    featureBackdrop?.addEventListener("click", closeFeatureModal);
  }

  function setupInnerAccordion() {
    innerAccordionItems.forEach((item) => {
      const trigger = item.querySelector(".inner-accordion-trigger");
      if (!trigger) return;

      trigger.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        innerAccordionItems.forEach((el) => el.classList.remove("active"));

        if (!isActive) {
          item.classList.add("active");
        }
      });
    });
  }

  function updateGameStats() {
    if (gameScore) {
      gameScore.textContent = `Puntos: ${score}`;
    }
    if (gameTimer) {
      gameTimer.textContent = `Tiempo: ${timeLeft}`;
    }
  }

  function moveTarget() {
    if (!gameArea || !gameTarget) return;

    const areaRect = gameArea.getBoundingClientRect();
    const targetSize = 60;
    const maxX = Math.max(0, areaRect.width - targetSize - 8);
    const maxY = Math.max(0, areaRect.height - targetSize - 8);

    const randomX = Math.floor(Math.random() * (maxX + 1));
    const randomY = Math.floor(Math.random() * (maxY + 1));

    gameTarget.style.left = `${randomX}px`;
    gameTarget.style.top = `${randomY}px`;
  }

  function startGame() {
    if (!gameTarget) return;

    score = 0;
    timeLeft = 10;
    gameRunning = true;
    updateGameStats();
    gameTarget.classList.remove("hidden");
    moveTarget();

    clearInterval(gameInterval);
    gameInterval = window.setInterval(() => {
      timeLeft -= 1;
      updateGameStats();

      if (timeLeft <= 0) {
        stopGame();
        if (gameTimer) gameTimer.textContent = "Tiempo: 0";
        window.alert(`Juego terminado. Tu puntaje fue: ${score}`);
      }
    }, 1000);
  }

  function stopGame() {
    gameRunning = false;
    clearInterval(gameInterval);
    if (gameTarget) {
      gameTarget.classList.add("hidden");
    }
  }

  function setupGame() {
    startGameBtn?.addEventListener("click", startGame);

    gameTarget?.addEventListener("click", () => {
      if (!gameRunning) return;
      score += 1;
      updateGameStats();
      moveTarget();
    });
  }

  function updateMiniGallery() {
    if (!miniGalleryImage) return;
    miniGalleryImage.src = miniGalleryImages[miniGalleryIndex];
    miniGalleryImage.alt = `Mini galería ${miniGalleryIndex + 1}`;
  }

  function setupMiniGallery() {
    miniPrevBtn?.addEventListener("click", () => {
      miniGalleryIndex =
        (miniGalleryIndex - 1 + miniGalleryImages.length) %
        miniGalleryImages.length;
      updateMiniGallery();
    });

    miniNextBtn?.addEventListener("click", () => {
      miniGalleryIndex = (miniGalleryIndex + 1) % miniGalleryImages.length;
      updateMiniGallery();
    });
  }

  function setupKeyboardSupport() {
    document.addEventListener("keydown", (event) => {
      const isQuizModalOpen = quizModal && !quizModal.classList.contains("hidden");
      const isFeatureOpen =
        featureOverlay && !featureOverlay.classList.contains("hidden");

      if (event.key === "Escape" && isQuizModalOpen) {
        closeModal();
      }

      if (event.key === "Escape" && isFeatureOpen) {
        closeFeatureModal();
      }
    });
  }

  startQuizBtn?.addEventListener("click", startQuiz);
  nextQuestionBtn?.addEventListener("click", nextQuestion);
  prevQuestionBtn?.addEventListener("click", prevQuestion);

  closeModalBtn?.addEventListener("click", closeModal);
  closeResultBtn?.addEventListener("click", closeModal);
  restartQuizBtn?.addEventListener("click", resetQuiz);
  modalBackdrop?.addEventListener("click", closeModal);

  setupAccordion();
  setupFeatureModals();
  setupInnerAccordion();
  setupGame();
  setupMiniGallery();
  setupKeyboardSupport();
});
