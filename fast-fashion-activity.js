const highlightTools = document.querySelectorAll('.highlight-tool[data-highlight]');
const highlightTokens = document.querySelectorAll('.highlight-token');
const highlightStatus = document.getElementById('highlight-status');
const highlightFeedback = document.getElementById('highlight-feedback');
const judgmentFeedback = document.getElementById('judgment-feedback');
let activeHighlight = null;

const connectorLabels = {
  cause: 'causa-efecto (azul)',
  contrast: 'contraste o concesión (naranja)',
};

highlightTools.forEach((tool) => {
  tool.addEventListener('click', () => {
    activeHighlight = tool.dataset.highlight;
    highlightTools.forEach((item) => {
      item.setAttribute('aria-pressed', String(item === tool));
    });
    highlightStatus.textContent = `Color activo: ${connectorLabels[activeHighlight]}. Selecciona los conectores del texto.`;
  });
});

highlightTokens.forEach((token) => {
  token.addEventListener('click', () => {
    if (!activeHighlight) {
      highlightStatus.textContent = 'Primero activa un color del resaltador.';
      return;
    }

    token.dataset.selectedKind = activeHighlight;
    token.classList.remove('highlighted-cause', 'highlighted-contrast', 'highlight-correct', 'highlight-incorrect');
    token.classList.add(activeHighlight === 'cause' ? 'highlighted-cause' : 'highlighted-contrast');
    token.setAttribute('aria-pressed', 'true');
  });
});

document.getElementById('clear-highlights').addEventListener('click', () => {
  activeHighlight = null;
  highlightTools.forEach((tool) => tool.setAttribute('aria-pressed', 'false'));
  highlightTokens.forEach((token) => {
    delete token.dataset.selectedKind;
    token.classList.remove('highlighted-cause', 'highlighted-contrast', 'highlight-correct', 'highlight-incorrect');
    token.setAttribute('aria-pressed', 'false');
  });
  highlightStatus.textContent = 'Resaltados limpiados. Activa un color para comenzar.';
  highlightFeedback.hidden = true;
  highlightFeedback.textContent = '';
});

document.getElementById('verify-highlights').addEventListener('click', () => {
  const unmarked = Array.from(highlightTokens).some((token) => !token.dataset.selectedKind);
  highlightTokens.forEach((token) => token.classList.remove('highlight-correct', 'highlight-incorrect'));
  if (unmarked) {
    highlightFeedback.textContent = 'Marca todos los conectores de ambos textos antes de verificar.';
    highlightFeedback.className = 'result-box error';
    highlightFeedback.hidden = false;
    return;
  }

  let correctCount = 0;
  highlightTokens.forEach((token) => {
    const isCorrect = token.dataset.selectedKind === token.dataset.kind;
    if (isCorrect) correctCount += 1;
    token.classList.add(isCorrect ? 'highlight-correct' : 'highlight-incorrect');
  });

  const total = highlightTokens.length;
  const allCorrect = correctCount === total;
  highlightFeedback.textContent = allCorrect
    ? `¡Correcto! ${correctCount}/${total}. Los conectores azules presentan causa o consecuencia; los naranjas expresan contraste o concesión.`
    : `Tienes ${correctCount}/${total} correctos. Los marcados con borde rojo usan el color equivocado: “therefore”, “thus” y “as a result” son de causa-efecto; “nevertheless”, “on the other hand”, “although” y “despite” expresan contraste o concesión.`;
  highlightFeedback.className = `result-box ${allCorrect ? 'success' : 'error'}`;
  highlightFeedback.hidden = false;
});

document.getElementById('verify-judgment').addEventListener('click', () => {
  const selected = document.querySelector('input[name="argument-judgment"]:checked');
  const options = document.querySelectorAll('.argument-options .quiz-option');
  options.forEach((option) => option.classList.remove('correct', 'incorrect'));

  if (!selected) {
    judgmentFeedback.textContent = 'Selecciona un juicio antes de verificar.';
    judgmentFeedback.className = 'result-box error';
    judgmentFeedback.hidden = false;
    return;
  }

  const isCorrect = selected.value === 'text-b';
  const selectedLabel = selected.closest('.quiz-option');
  if (selectedLabel) selectedLabel.classList.add(isCorrect ? 'correct' : 'incorrect');
  judgmentFeedback.textContent = isCorrect
    ? '¡Correcto! Text B reconoce distintos factores y limita sus conclusiones. Sus conectores de contraste y concesión equilibran la información; Text A usa conectores de consecuencia para presentar afirmaciones amplias sin aportar evidencia suficiente.'
    : 'Revisa la evidencia: un conector de consecuencia no demuestra por sí solo que una idea sea cierta. Text A salta de ejemplos limitados a conclusiones absolutas; Text B reconoce matices y pide datos verificables.';
  judgmentFeedback.className = `result-box ${isCorrect ? 'success' : 'error'}`;
  judgmentFeedback.hidden = false;
});
