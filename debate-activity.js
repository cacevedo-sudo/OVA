const connectorMeanings = {
  however: 'introduce un contraste',
  therefore: 'presenta una consecuencia o conclusión lógica',
  although: 'concede una idea antes de presentar la postura principal',
  consequently: 'presenta el resultado de la idea anterior',
  moreover: 'añade un argumento que apoya la idea anterior',
};

const debateConnectors = Array.from(document.querySelectorAll('.debate-select'));
const debateFeedback = document.getElementById('debate-feedback');
const purposeFeedback = document.getElementById('purpose-feedback');

document.getElementById('debate-verify').addEventListener('click', () => {
  const unanswered = debateConnectors.some((select) => !select.value);
  if (unanswered) {
    debateFeedback.textContent = 'Completa los cinco espacios antes de verificar el debate.';
    debateFeedback.className = 'result-box error debate-feedback';
    debateFeedback.hidden = false;
    return;
  }

  let correctCount = 0;
  debateConnectors.forEach((select, index) => {
    const answer = select.dataset.answer;
    const selected = select.value;
    const isCorrect = selected === answer;
    if (isCorrect) correctCount += 1;
    select.classList.toggle('correct', isCorrect);
    select.classList.toggle('incorrect', !isCorrect);

    const feedback = document.createElement('p');
    feedback.textContent = isCorrect
      ? `Intervención ${index + 1}: Correcto. “${answer}” ${connectorMeanings[answer]}; así se mantiene la relación lógica del argumento.`
      : `Intervención ${index + 1}: “${selected}” ${connectorMeanings[selected]}, pero esa relación no encaja aquí. La respuesta es “${answer}”, que ${connectorMeanings[answer]}.`;
    if (index === 0) debateFeedback.replaceChildren();
    debateFeedback.appendChild(feedback);
  });

  const summary = document.createElement('p');
  summary.textContent = `Resultado: ${correctCount}/${debateConnectors.length} conectores correctos.`;
  debateFeedback.prepend(summary);
  debateFeedback.className = `result-box debate-feedback ${correctCount === debateConnectors.length ? 'success' : 'error'}`;
  debateFeedback.hidden = false;
});

document.getElementById('purpose-verify').addEventListener('click', () => {
  const selected = document.querySelector('input[name="maya-purpose"]:checked');
  const options = document.querySelectorAll('.debate-purpose-options .quiz-option');
  options.forEach((option) => option.classList.remove('correct', 'incorrect'));

  if (!selected) {
    purposeFeedback.textContent = 'Selecciona una respuesta antes de verificar.';
    purposeFeedback.className = 'result-box error';
    purposeFeedback.hidden = false;
    return;
  }

  const selectedLabel = selected.closest('.quiz-option');
  const isCorrect = selected.value === 'guided';
  if (selectedLabel) selectedLabel.classList.add(isCorrect ? 'correct' : 'incorrect');
  purposeFeedback.textContent = isCorrect
    ? '¡Correcto! Maya defiende un uso guiado y responsable, no una prohibición total. “Although” reconoce que la IA puede ayudar y, a la vez, introduce el límite de que no debe reemplazar el pensamiento propio.'
    : 'Revisa la postura de Maya: reconoce que la IA puede ser útil, pero sostiene que no debe sustituir el pensamiento del estudiante. “Although” expresa esa concesión.';
  purposeFeedback.className = `result-box ${isCorrect ? 'success' : 'error'}`;
  purposeFeedback.hidden = false;
});

debateConnectors.forEach((select) => {
  select.addEventListener('change', () => {
    select.classList.remove('correct', 'incorrect');
  });
});
