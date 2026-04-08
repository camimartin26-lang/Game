const quizForm = document.getElementById("quizForm");
const quizResult = document.getElementById("quizResult");
const accordionItems = document.querySelectorAll(".accordion-item");

quizForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(quizForm);
  const q1 = formData.get("q1");
  const q2 = formData.get("q2");
  const q3 = formData.get("q3");

  if (!q1 || !q2 || !q3) {
    quizResult.classList.remove("hidden");
    quizResult.innerHTML = "⚠️ Por favor, respondé las 3 preguntas.";
    return;
  }

  const answers = [q1, q2, q3];
  const countA = answers.filter((a) => a === "A").length;
  const countB = answers.filter((a) => a === "B").length;
  const countC = answers.filter((a) => a === "C").length;

  let resultTitle = "";
  let resultText = "";

  if (countA >= countB && countA >= countC) {
    resultTitle = "✨ Tu estilo es: Neubrutalismo vibrante";
    resultText =
      "Te atraen los colores fuertes, los layouts con personalidad y las interfaces con mucha energía visual.";
  } else if (countB >= countA && countB >= countC) {
    resultTitle = "🧼 Tu estilo es: Minimalismo estructurado";
    resultText =
      "Preferís la claridad, el orden y una experiencia más limpia y funcional.";
  } else {
    resultTitle = "🚀 Tu estilo es: Futurismo dinámico";
    resultText =
      "Buscás innovación, movimiento e interfaces que se sientan vivas y modernas.";
  }

  quizResult.classList.remove("hidden");
  quizResult.innerHTML = `
    <strong>${resultTitle}</strong>
    <p style="margin-top:10px; margin-bottom:0;">${resultText}</p>
  `;
});

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
