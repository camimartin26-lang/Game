const data = [
  { q: "¿Qué te gusta más?", a: ["Colores", "Minimal", "Animación"] },
  { q: "¿Botones?", a: ["Grandes", "Simples", "Animados"] },
  { q: "¿Sensación?", a: ["Creativa", "Clara", "Innovadora"] }
];

let step = 0;
let answers = [];
let selected = null;

const startBtn = document.getElementById("startQuizBtn");
const quizIntro = document.getElementById("quizIntro");
const quizBox = document.getElementById("quizBox");

const qEl = document.getElementById("question");
const aEl = document.getElementById("answers");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const error = document.getElementById("error");

const modal = document.getElementById("modal");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");
const restartBtn = document.getElementById("restartBtn");

/* START */
startBtn.onclick = () => {
  quizIntro.classList.add("hidden");
  quizBox.classList.remove("hidden");
  render();
};

/* RENDER */
function render() {
  qEl.innerText = data[step].q;
  aEl.innerHTML = "";
  selected = answers[step] ?? null;

  data[step].a.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.innerText = text;

    if (selected === i) btn.classList.add("selected");

    btn.onclick = () => {
      selected = i;
      document.querySelectorAll("#answers button")
        .forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    };

    aEl.appendChild(btn);
  });

  prevBtn.classList.toggle("hidden", step === 0);
}

/* NEXT */
nextBtn.onclick = () => {
  if (selected === null) {
    error.classList.remove("hidden");
    return;
  }

  error.classList.add("hidden");
  answers[step] = selected;

  if (step < data.length - 1) {
    step++;
    render();
  } else {
    showResult();
  }
};

/* PREV */
prevBtn.onclick = () => {
  step--;
  render();
};

/* RESULT */
function showResult() {
  modal.classList.remove("hidden");

  const score = answers.reduce((a, b) => a + b, 0);

  if (score < 2) {
    resultTitle.innerText = "Neubrutalismo 🔥";
    resultText.innerText = "Te gustan interfaces fuertes";
  } else if (score < 4) {
    resultTitle.innerText = "Minimalismo 🧼";
    resultText.innerText = "Preferís claridad";
  } else {
    resultTitle.innerText = "Futurista 🚀";
    resultText.innerText = "Buscás innovación";
  }
}

/* RESET */
restartBtn.onclick = () => {
  modal.classList.add("hidden");
  step = 0;
  answers = [];
  quizBox.classList.add("hidden");
  quizIntro.classList.remove("hidden");
};

/* ACORDEÓN */
document.querySelectorAll(".item").forEach(item => {
  item.querySelector("button").onclick = () => {
    document.querySelectorAll(".item").forEach(i => i.classList.remove("active"));
    item.classList.add("active");
  };
});
