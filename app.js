document.addEventListener("DOMContentLoaded", () => {
  const PLAN_MENSUAL = {
    plata: 990,
    plata_promo_j: 890,
    oro: 1190,
  };

  const EXTRA_DECO = 280;
  const FUTBOL_MENSUAL = 300;

  function conexionBase(tipo, decos) {
    if (decos === 1 || decos === 2) return tipo === "p12" ? 690 : 0;
    if (decos === 3) return tipo === "p12" ? 1789 : 1099;
    if (decos === 4) return tipo === "p12" ? 2888 : 2198;
    return 0;
  }

  function conexionGoBoxExtra(tipo) {
    return tipo === "p12" ? 1000 : 500;
  }

  const screens = [
    {
      key: "tipo",
      title: "Pregunta 1 · ¿Tipo de cliente?",
      answers: [
        { text: "P1 o P2", value: "p12" },
        { text: "P3 o TC", value: "p3tc" },
      ],
    },
    {
      key: "gobox",
      title: "Pregunta 2 · ¿Quiere GO Box?",
      answers: [
        { text: "Sí", value: "si" },
        { text: "No", value: "no" },
      ],
    },
    {
      key: "futbol",
      title: "Pregunta 3 · ¿Quiere Fútbol Uruguayo?",
      answers: [
        { text: "Sí", value: "si" },
        { text: "No", value: "no" },
      ],
    },
    {
      key: "plan",
      title: "Pregunta 4 · ¿Qué plan desea?",
      answers: [
        { text: "Plata HD — $990 (1 deco)", value: "plata" },
        { text: "Plata HD Promo J — $890 (1 deco)", value: "plata_promo_j" },
        { text: "Oro HD — $1190 (1 deco)", value: "oro" },
      ],
    },
    {
      key: "decos",
      title: "Pregunta 5 · ¿Cuántos decodificadores quiere?",
      answers: [
        { text: "1", value: "1", hint: `Sin extra por deco` },
        { text: "2", value: "2", hint: `+$${EXTRA_DECO}/mes` },
        { text: "3", value: "3", hint: `+$${EXTRA_DECO * 2}/mes` },
        { text: "4", value: "4", hint: `+$${EXTRA_DECO * 3}/mes` },
      ],
      footer: `Extras: +$${EXTRA_DECO}/mes desde el 2º deco · Fútbol +$${FUTBOL_MENSUAL}/mes.`,
    },
  ];

  const startCalcBtn = document.getElementById("startCalcBtn");
  const calcIntro = document.getElementById("calcIntro");
  const calcStepper = document.getElementById("calcStepper");
  const calcStepLabel = document.getElementById("calcStepLabel");
  const calcProgressPercent = document.getElementById("calcProgressPercent");
  const calcProgressFill = document.getElementById("calcProgressFill");
  const calcQuestionTitle = document.getElementById("calcQuestionTitle");
  const calcAnswersContainer = document.getElementById("calcAnswersContainer");
  const nextCalcBtn = document.getElementById("nextCalcBtn");
  const prevCalcBtn = document.getElementById("prevCalcBtn");
  const calcError = document.getElementById("calcError");
  const calcCard = document.getElementById("calcCard");

  const resultModal = document.getElementById("resultModal");
  const resultBackdrop = resultModal?.querySelector(".result-backdrop");
  const resultContent = document.getElementById("resultContent");
  const resultCloseButtons = document.querySelectorAll(".result-close-btn");
  const resetQuizBtn = document.getElementById("resetQuizBtn");

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

  let quiz = {
    tipo: null,
    gobox: null,
    futbol: null,
    plan: null,
    decos: null,
  };

  let step = 0;
  let selectedAnswer = null;

  let score = 0;
  let timeLeft = 10;
  let gameInterval = null;
  let gameRunning = false;

  function lockBodyScroll() {
    document.body.style.overflow = "hidden";
  }

  function unlockBodyScroll() {
    const featureOpen = featureOverlay && !featureOverlay.classList.contains("hidden");
    const resultOpen = resultModal && !resultModal.classList.contains("hidden");
    if (!featureOpen && !resultOpen) {
      document.body.style.overflow = "";
    }
  }

  function setErr(show, msg) {
    if (!calcError) return;
    calcError.querySelector("span").textContent =
      msg || "Elegí una opción para continuar.";
    calcError.classList.toggle("hidden", !show);
  }

  function updateProgress() {
    const currentStep = step + 1;
    const total = screens.length;
    const progress = Math.round((currentStep / total) * 100);

    calcStepLabel.textContent = `Paso ${currentStep}`;
    calcProgressPercent.textContent = `${progress}%`;
    calcProgressFill.style.width = `${progress}%`;
  }

  function updateButtons() {
    prevCalcBtn.classList.toggle("hidden", step === 0);
    const nextLabel = nextCalcBtn.querySelector("span");
    nextLabel.textContent = step < screens.length - 1 ? "Siguiente" : "Ver resultado";
  }

  function renderQuiz() {
    const current = screens[step];
    selectedAnswer = quiz[current.key];

    calcCard.classList.add("animating");

    window.setTimeout(() => {
      updateProgress();
      updateButtons();
      calcQuestionTitle.textContent = current.title;
      calcAnswersContainer.innerHTML = "";

      current.answers.forEach((answer) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "answer-option";

        const title = document.createElement("span");
        title.textContent = answer.text;
        button.appendChild(title);

        if (answer.hint) {
          const hint = document.createElement("small");
          hint.textContent = answer.hint;
          button.appendChild(hint);
        }

        const normalizedValue =
          current.key === "gobox" || current.key === "futbol"
            ? selectedAnswer === true
              ? "si"
              : selectedAnswer === false
              ? "no"
              : null
            : String(selectedAnswer);

        if (normalizedValue === answer.value) {
          button.classList.add("selected");
        }

        button.addEventListener("click", () => {
          if (current.key === "gobox" || current.key === "futbol") {
            selectedAnswer = answer.value === "si";
          } else if (current.key === "decos") {
            selectedAnswer = parseInt(answer.value, 10);
          } else {
            selectedAnswer = answer.value;
          }

          setErr(false);

          document.querySelectorAll(".answer-option").forEach((option) => {
            option.classList.remove("selected");
          });

          button.classList.add("selected");
        });

        calcAnswersContainer.appendChild(button);
      });

      if (current.footer) {
        const footer = document.createElement("p");
        footer.className = "section-text";
        footer.style.margin = "16px 0 0";
        footer.textContent = current.footer;
        calcAnswersContainer.appendChild(footer);
      }

      calcCard.classList.remove("animating");
    }, 120);
  }

  function computeResult() {
    const tipo = quiz.tipo;
    const decos = quiz.decos;

    let conexion = conexionBase(tipo, decos);
    if (quiz.gobox === true) {
      conexion += conexionGoBoxExtra(tipo);
    }

    const base = PLAN_MENSUAL[quiz.plan] ?? 0;
    const extras = Math.max(0, decos - 1) * EXTRA_DECO;

    let mensual = base + extras;
    if (quiz.futbol === true) {
      mensual += FUTBOL_MENSUAL;
    }

    return { conexion, mensual, base, extras };
  }

  function openResultModal() {
    resultModal.classList.remove("hidden");
    lockBodyScroll();
  }

  function closeResultModal() {
    resultModal.classList.add("hidden");
    unlockBodyScroll();
  }

  function showResult() {
    const { conexion, mensual, base, extras } = computeResult();

    const tipoLabel = quiz.tipo === "p12" ? "P1 o P2" : "P3 o TC";
    const planLabel =
      quiz.plan === "plata"
        ? "Plata HD"
        : quiz.plan === "plata_promo_j"
        ? "Plata HD Promo J"
        : "Oro HD";

    const goConn = quiz.gobox ? conexionGoBoxExtra(quiz.tipo) : 0;
    const connBase = conexionBase(quiz.tipo, quiz.decos);
    const futbolExtra = quiz.futbol ? FUTBOL_MENSUAL : 0;

    resultContent.innerHTML = `
      <div class="result-main">
        <div class="result-box">
          <span>Costo de conexión</span>
          <strong>$${conexion}</strong>
        </div>
        <div class="result-box">
          <span>Costo mensual</span>
          <strong>$${mensual}</strong>
        </div>
      </div>

      <div class="result-detail">
        <h4>Detalle</h4>
        <ul>
          <li>Tipo de cliente: ${tipoLabel}</li>
          <li>Plan: ${planLabel} (base $${base})</li>
          <li>Decodificadores: ${quiz.decos} (extras mensual $${extras})</li>
          <li>GO Box: ${quiz.gobox ? "Sí" : "No"} (extra conexión $${goConn})</li>
          <li>Fútbol uruguayo: ${quiz.futbol ? "Sí" : "No"} (extra mensual $${futbolExtra})</li>
          <li>Conexión base: $${connBase}</li>
        </ul>
      </div>
    `;

    openResultModal();
  }

  function resetAll() {
    quiz = {
      tipo: null,
      gobox: null,
      futbol: null,
      plan: null,
      decos: null,
    };
    step = 0;
    selectedAnswer = null;
    setErr(false);
    calcProgressFill.style.width = "0%";
    calcIntro.classList.remove("hidden");
    calcStepper.classList.add("hidden");
    closeResultModal();
  }

  function startCalculator() {
    calcIntro.classList.add("hidden");
    calcStepper.classList.remove("hidden");
    step = 0;
    selectedAnswer = null;
    setErr(false);
    renderQuiz();
  }

  function nextStep() {
    const key = screens[step].key;

    if (selectedAnswer === null || selectedAnswer === undefined) {
      setErr(true);
      return;
    }

    quiz[key] = selectedAnswer;

    if (step < screens.length - 1) {
      step += 1;
      renderQuiz();
      return;
    }

    if (
      !quiz.tipo ||
      quiz.gobox === null ||
      quiz.futbol === null ||
      !quiz.plan ||
      !quiz.decos
    ) {
      setErr(true, "Faltan respuestas. Volvé y completá todo.");
      return;
    }

    showResult();
  }

  function prevStep() {
    if (step === 0) return;

    const key = screens[step].key;
    if (selectedAnswer !== null && selectedAnswer !== undefined) {
      quiz[key] = selectedAnswer;
    }

    step -= 1;
    setErr(false);
    renderQuiz();
  }

  function setupAccordion() {
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
    featureOverlay.classList.remove("hidden");
    featureModals.forEach((modal) => modal.classList.add("hidden"));

    const activeModal = document.getElementById(id);
    if (activeModal) {
      activeModal.classList.remove("hidden");
    }

    lockBodyScroll();
  }

  function closeFeatureModal() {
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
      const isResultOpen =
        resultModal && !resultModal.classList.contains("hidden");

      if (event.key === "Escape" && isFeatureOpen) {
        closeFeatureModal();
      }

      if (event.key === "Escape" && isResultOpen) {
        closeResultModal();
      }
    });
  }

  startCalcBtn?.addEventListener("click", startCalculator);
  nextCalcBtn?.addEventListener("click", nextStep);
  prevCalcBtn?.addEventListener("click", prevStep);

  resultCloseButtons.forEach((button) => {
    button.addEventListener("click", closeResultModal);
  });

  resultBackdrop?.addEventListener("click", closeResultModal);
  resetQuizBtn?.addEventListener("click", resetAll);

  setupAccordion();
  setupFeatureModals();
  setupInnerAccordion();
  setupGame();
  setupKeyboardSupport();
});
