document.addEventListener("DOMContentLoaded", () => {
  const calcData = [
    {
      key: "clientType",
      question: "1. ¿Qué tipo de cliente es?",
      answers: [
        { text: "Cliente nuevo", value: "nuevo" },
        { text: "Cliente existente", value: "existente" },
      ],
    },
    {
      key: "goBox",
      question: "2. ¿Incluye GO Box?",
      answers: [
        { text: "Sí", value: "si" },
        { text: "No", value: "no" },
      ],
    },
    {
      key: "football",
      question: "3. ¿Agrega fútbol?",
      answers: [
        { text: "Sí", value: "si" },
        { text: "No", value: "no" },
      ],
    },
    {
      key: "plan",
      question: "4. ¿Qué plan elige?",
      answers: [
        { text: "Bronce", value: "bronce" },
        { text: "Plata", value: "plata" },
        { text: "Oro", value: "oro" },
      ],
    },
    {
      key: "decos",
      question: "5. ¿Cuántos decos extra necesita?",
      answers: [
        { text: "0 decos extra", value: "0" },
        { text: "1 deco extra", value: "1" },
        { text: "2 decos extra", value: "2" },
        { text: "3 decos extra", value: "3" },
      ],
    },
  ];

  const PRICES = {
    installationNew: 4500,
    installationExisting: 2500,
    goBoxInstallation: 1200,
    footballMonthly: 3200,
    extraDecoMonthly: 900,
    planMonthly: {
      bronce: 5200,
      plata: 7200,
      oro: 9800,
    },
  };

  const startCalcBtn = document.getElementById("startCalcBtn");
  const calcIntro = document.getElementById("calcIntro");
  const calcStepper = document.getElementById("calcStepper");
  const calcQuestionCounter = document.getElementById("calcQuestionCounter");
  const calcProgressPercent = document.getElementById("calcProgressPercent");
  const calcProgressFill = document.getElementById("calcProgressFill");
  const calcQuestionTitle = document.getElementById("calcQuestionTitle");
  const calcAnswersContainer = document.getElementById("calcAnswersContainer");
  const nextCalcBtn = document.getElementById("nextCalcBtn");
  const prevCalcBtn = document.getElementById("prevCalcBtn");
  const calcError = document.getElementById("calcError");
  const calcCard = document.getElementById("calcCard");
  const calcResult = document.getElementById("calcResult");
  const restartCalcBtn = document.getElementById("restartCalcBtn");
  const installationCost = document.getElementById("installationCost");
  const monthlyCost = document.getElementById("monthlyCost");
  const resultBreakdownList = document.getElementById("resultBreakdownList");

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
  const gameResult = document.getElementById("gameResult");

  let currentCalcIndex = 0;
  let selectedCalcAnswer = null;
  let calcAnswers = {};

  let score = 0;
  let timeLeft = 10;
  let gameInterval = null;
  let gameRunning = false;

  function formatCurrency(value) {
    return `$${value.toLocaleString("es-UY")}`;
  }

  function lockBodyScroll() {
    document.body.style.overflow = "hidden";
  }

  function unlockBodyScroll() {
    const featureOpen = featureOverlay && !featureOverlay.classList.contains("hidden");
    if (!featureOpen) {
      document.body.style.overflow = "";
    }
  }

  function startCalculator() {
    currentCalcIndex = 0;
    selectedCalcAnswer = null;
    calcAnswers = {};
    calcError?.classList.add("hidden");
    calcIntro?.classList.add("hidden");
    calcResult?.classList.add("hidden");
    calcStepper?.classList.remove("hidden");
    renderCalcQuestion();
  }

  function updateCalcProgress() {
    const currentStep = currentCalcIndex + 1;
    const progress = Math.round((currentStep / calcData.length) * 100);

    calcQuestionCounter.textContent = `Paso ${currentStep} de ${calcData.length}`;
    calcProgressPercent.textContent = `${progress}%`;
    calcProgressFill.style.width = `${progress}%`;
  }

  function updateCalcButtons() {
    prevCalcBtn.classList.toggle("hidden", currentCalcIndex === 0);
    const nextLabel = nextCalcBtn.querySelector("span");
    nextLabel.textContent =
      currentCalcIndex === calcData.length - 1 ? "Ver resultado" : "Siguiente";
  }

  function renderCalcQuestion() {
    const currentQuestion = calcData[currentCalcIndex];
    selectedCalcAnswer = calcAnswers[currentQuestion.key] || null;

    calcCard.classList.add("animating");

    window.setTimeout(() => {
      updateCalcProgress();
      updateCalcButtons();
      calcQuestionTitle.textContent = currentQuestion.question;
      calcAnswersContainer.innerHTML = "";

      currentQuestion.answers.forEach((answer) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "answer-option";
        button.textContent = answer.text;

        if (selectedCalcAnswer === answer.value) {
          button.classList.add("selected");
        }

        button.addEventListener("click", () => {
          selectedCalcAnswer = answer.value;
          calcError.classList.add("hidden");

          document.querySelectorAll(".answer-option").forEach((option) => {
            option.classList.remove("selected");
          });

          button.classList.add("selected");
        });

        calcAnswersContainer.appendChild(button);
      });

      calcCard.classList.remove("animating");
    }, 120);
  }

  function calculateCosts() {
    const installationBase =
      calcAnswers.clientType === "nuevo"
        ? PRICES.installationNew
        : PRICES.installationExisting;

    const goBoxInstallation =
      calcAnswers.goBox === "si" ? PRICES.goBoxInstallation : 0;

    const planMonthly = PRICES.planMonthly[calcAnswers.plan] || 0;
    const footballMonthly =
      calcAnswers.football === "si" ? PRICES.footballMonthly : 0;

    const decoCount = Number(calcAnswers.decos || 0);
    const extraDecosMonthly = decoCount * PRICES.extraDecoMonthly;

    const totalInstallation = installationBase + goBoxInstallation;
    const totalMonthly = planMonthly + footballMonthly + extraDecosMonthly;

    return {
      totalInstallation,
      totalMonthly,
      breakdown: [
        `Conexión base: ${formatCurrency(installationBase)}`,
        goBoxInstallation > 0
          ? `GO Box en conexión: ${formatCurrency(goBoxInstallation)}`
          : `GO Box en conexión: ${formatCurrency(0)}`,
        `Plan ${calcAnswers.plan}: ${formatCurrency(planMonthly)}`,
        footballMonthly > 0
          ? `Adicional fútbol: ${formatCurrency(footballMonthly)}`
          : `Adicional fútbol: ${formatCurrency(0)}`,
        `Decos extra (${decoCount}): ${formatCurrency(extraDecosMonthly)}`,
      ],
    };
  }

  function showCalcResult() {
    const result = calculateCosts();

    installationCost.textContent = formatCurrency(result.totalInstallation);
    monthlyCost.textContent = formatCurrency(result.totalMonthly);
    resultBreakdownList.innerHTML = "";

    result.breakdown.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      resultBreakdownList.appendChild(li);
    });

    calcStepper.classList.add("hidden");
    calcResult.classList.remove("hidden");
  }

  function nextCalcQuestion() {
    const currentQuestion = calcData[currentCalcIndex];

    if (!selectedCalcAnswer) {
      calcError.classList.remove("hidden");
      return;
    }

    calcAnswers[currentQuestion.key] = selectedCalcAnswer;

    if (currentCalcIndex < calcData.length - 1) {
      currentCalcIndex += 1;
      renderCalcQuestion();
      return;
    }

    showCalcResult();
  }

  function prevCalcQuestion() {
    if (currentCalcIndex === 0) return;

    const currentQuestion = calcData[currentCalcIndex];
    calcAnswers[currentQuestion.key] = selectedCalcAnswer;
    currentCalcIndex -= 1;
    renderCalcQuestion();
    calcError.classList.add("hidden");
  }

  function resetCalculator() {
    currentCalcIndex = 0;
    selectedCalcAnswer = null;
    calcAnswers = {};
    calcError.classList.add("hidden");
    calcResult.classList.add("hidden");
    calcStepper.classList.add("hidden");
    calcIntro.classList.remove("hidden");
    calcProgressFill.style.width = "0%";
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
    gameScore.textContent = `Puntos: ${score}`;
    gameTimer.textContent = `Tiempo: ${timeLeft}`;
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
    score = 0;
    timeLeft = 10;
    gameRunning = true;
    gameResult.classList.add("hidden");
    gameResult.textContent = "";
    updateGameStats();
    gameTarget.classList.remove("hidden");
    moveTarget();

    clearInterval(gameInterval);
    gameInterval = window.setInterval(() => {
      timeLeft -= 1;
      updateGameStats();

      if (timeLeft <= 0) {
        stopGame();
        gameTimer.textContent = "Tiempo: 0";
        gameResult.textContent = `¡Tiempo! Hiciste ${score} punto${score === 1 ? "" : "s"}.`;
        gameResult.classList.remove("hidden");
      }
    }, 1000);
  }

  function stopGame() {
    gameRunning = false;
    clearInterval(gameInterval);
    gameTarget?.classList.add("hidden");
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

  function setupKeyboardSupport() {
    document.addEventListener("keydown", (event) => {
      const isFeatureOpen =
        featureOverlay && !featureOverlay.classList.contains("hidden");

      if (event.key === "Escape" && isFeatureOpen) {
        closeFeatureModal();
      }
    });
  }

  startCalcBtn?.addEventListener("click", startCalculator);
  nextCalcBtn?.addEventListener("click", nextCalcQuestion);
  prevCalcBtn?.addEventListener("click", prevCalcQuestion);
  restartCalcBtn?.addEventListener("click", resetCalculator);

  setupAccordion();
  setupFeatureModals();
  setupInnerAccordion();
  setupGame();
  setupKeyboardSupport();
});
