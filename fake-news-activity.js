const fakeNewsCards = Array.from(document.querySelectorAll('.fake-news-card'));
const fakeNewsSummary = document.getElementById('fake-news-summary');

const fakeNewsAnswers = {
  1: {
    diagnosis: 'false-cause',
    explanation: 'A score change after the phone rule does not prove the rule caused it; other factors may explain the difference.',
    topic: /\b(phone|rule|score|average|quiz)\b/i,
  },
  2: {
    diagnosis: 'generalization',
    explanation: 'Five students are a small example: it does not prove the app caused their results or that every student needs it.',
    topic: /\b(app|student|sample|every|all|club)\b/i,
  },
  3: {
    diagnosis: 'unsupported',
    explanation: 'The screenshot can show that Wi-Fi was unavailable, but it does not provide evidence about learning outcomes.',
    topic: /\b(internet|offline|outage|screenshot|learn|wifi|wi-fi)\b/i,
  },
};

const neutralConnectorPattern = /\b(nevertheless|while|despite this)\b/i;
const evidenceLimitPattern = /\b(does not|doesn't|cannot|can't|not enough evidence|limited evidence|insufficient evidence|no evidence|is not proof|isn't proof)\b/i;

function resetFakeNewsFeedback(card) {
  card.classList.remove('correct', 'incorrect');
  const feedback = card.querySelector('.fake-post-feedback');
  feedback.textContent = '';
  feedback.hidden = true;
  card.querySelectorAll('.quiz-option').forEach((option) => option.classList.remove('correct', 'incorrect'));
  fakeNewsSummary.textContent = '';
  fakeNewsSummary.hidden = true;
  fakeNewsSummary.className = 'result-box';
}

fakeNewsCards.forEach((card) => {
  card.addEventListener('input', () => resetFakeNewsFeedback(card));
  card.addEventListener('change', () => resetFakeNewsFeedback(card));
});

document.getElementById('verify-fake-news').addEventListener('click', () => {
  const incompleteCard = fakeNewsCards.find((card) => (
    !card.querySelector('input[type="radio"]:checked')
    || !card.querySelector('.fake-rewrite').value.trim()
  ));
  if (incompleteCard) {
    fakeNewsSummary.textContent = 'Completa el diagnóstico y la reescritura de las tres publicaciones antes de verificar.';
    fakeNewsSummary.className = 'result-box error';
    fakeNewsSummary.hidden = false;
    return;
  }

  let correctDiagnoses = 0;
  let objectiveRewrites = 0;

  fakeNewsCards.forEach((card) => {
    const postNumber = card.dataset.post;
    const answer = fakeNewsAnswers[postNumber];
    const selected = card.querySelector('input[type="radio"]:checked');
    const selectedLabel = selected.closest('.quiz-option');
    const correctLabel = card.querySelector(`input[value="${answer.diagnosis}"]`).closest('.quiz-option');
    const diagnosisCorrect = selected.value === answer.diagnosis;
    const rewrite = card.querySelector('.fake-rewrite').value.trim();
    const rewriteUsesConnector = neutralConnectorPattern.test(rewrite);
    const rewriteLimitsEvidence = evidenceLimitPattern.test(rewrite);
    const rewriteAddressesClaim = answer.topic.test(rewrite);
    const rewriteObjective = rewriteUsesConnector && rewriteLimitsEvidence && rewriteAddressesClaim;

    if (diagnosisCorrect) correctDiagnoses += 1;
    if (rewriteObjective) objectiveRewrites += 1;

    if (selectedLabel) selectedLabel.classList.add(diagnosisCorrect ? 'correct' : 'incorrect');
    if (correctLabel) correctLabel.classList.add('correct');
    card.classList.add(diagnosisCorrect && rewriteObjective ? 'correct' : 'incorrect');

    const repairFeedback = rewriteObjective
      ? 'La reescritura usa un conector de contraste o concesión y limita la conclusión a lo que la evidencia permite afirmar.'
      : `Para hacerla más objetiva, usa Nevertheless, Despite this o While, explica qué no demuestra la evidencia y relaciona la aclaración con la afirmación del post.`;
    const diagnosisFeedback = diagnosisCorrect
      ? answer.explanation
      : `Revisa el conector resaltado. ${answer.explanation}`;
    const feedback = card.querySelector('.fake-post-feedback');
    feedback.textContent = `${diagnosisFeedback} ${repairFeedback}`;
    feedback.className = `fake-post-feedback result-box ${diagnosisCorrect && rewriteObjective ? 'success' : 'error'}`;
    feedback.hidden = false;
  });

  const allCorrect = correctDiagnoses === fakeNewsCards.length && objectiveRewrites === fakeNewsCards.length;
  fakeNewsSummary.textContent = `Diagnósticos correctos: ${correctDiagnoses}/3. Reescrituras objetivas: ${objectiveRewrites}/3. ${allCorrect ? '¡Excelente fact-checking! Las publicaciones reparadas distinguen los datos de las conclusiones y no presentan una asociación como prueba de causalidad.' : 'Revisa la retroalimentación de cada publicación y ajusta tus respuestas.'}`;
  fakeNewsSummary.className = `result-box ${allCorrect ? 'success' : 'error'}`;
  fakeNewsSummary.hidden = false;
});

document.getElementById('reset-fake-news').addEventListener('click', () => {
  fakeNewsCards.forEach((card) => {
    card.querySelectorAll('input[type="radio"]').forEach((input) => {
      input.checked = false;
    });
    card.querySelector('.fake-rewrite').value = '';
    resetFakeNewsFeedback(card);
  });
});
