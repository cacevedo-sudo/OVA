const stanceButtons = document.querySelectorAll('.stance-choice');
const dialogueSteps = document.querySelectorAll('.dialogue-step');
const dialogueFeedback = document.getElementById('dialogue-feedback');
const dialogueProgress = document.getElementById('dialogue-progress');
const continueDialogue = document.getElementById('continue-dialogue');
const simulatorResult = document.getElementById('simulator-result');
const phoneDialogue = document.getElementById('phone-dialogue');

let activeStance = null;
let activeStep = 0;
let strongArguments = 0;

function getActiveDialogueStep() {
  return document.querySelector(`.dialogue-step[data-stance="${activeStance}"][data-step="${activeStep}"]`);
}

function updateDialogueProgress() {
  const stanceName = activeStance === 'ban' ? 'Ban Phones' : 'Regulate & Integrate';
  dialogueProgress.textContent = `${stanceName} · Dialogue ${activeStep + 1} of 2`;
}

function resetDialogueRoute() {
  dialogueSteps.forEach((step) => {
    step.hidden = true;
    step.querySelectorAll('.decision-option').forEach((option) => {
      option.disabled = false;
      option.classList.remove('correct', 'incorrect');
    });
  });
  dialogueFeedback.hidden = true;
  dialogueFeedback.textContent = '';
  dialogueFeedback.className = 'result-box';
  continueDialogue.hidden = true;
  simulatorResult.hidden = true;
  simulatorResult.textContent = '';
}

stanceButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeStance = button.dataset.stance;
    activeStep = 0;
    strongArguments = 0;
    resetDialogueRoute();

    stanceButtons.forEach((stanceButton) => {
      stanceButton.setAttribute('aria-pressed', String(stanceButton === button));
    });

    getActiveDialogueStep().hidden = false;
    phoneDialogue.hidden = false;
    updateDialogueProgress();
  });
});

document.querySelectorAll('.decision-option').forEach((option) => {
  option.addEventListener('click', () => {
    const activeDialogueStep = getActiveDialogueStep();
    if (!activeDialogueStep || !activeDialogueStep.contains(option)) return;

    const isStrongArgument = option.dataset.correct === 'true';
    const correctOption = activeDialogueStep.querySelector('.decision-option[data-correct="true"]');
    activeDialogueStep.querySelectorAll('.decision-option').forEach((choice) => {
      choice.disabled = true;
      choice.classList.remove('correct', 'incorrect');
    });
    option.classList.add(isStrongArgument ? 'correct' : 'incorrect');
    if (!isStrongArgument && correctOption) correctOption.classList.add('correct');

    if (isStrongArgument) strongArguments += 1;
    dialogueFeedback.textContent = option.dataset.feedback;
    dialogueFeedback.className = `result-box ${isStrongArgument ? 'success' : 'error'}`;
    dialogueFeedback.hidden = false;
    continueDialogue.textContent = activeStep === 0 ? 'Continue to question 2' : 'View your decision';
    continueDialogue.hidden = false;
  });
});

continueDialogue.addEventListener('click', () => {
  if (activeStep === 0) {
    getActiveDialogueStep().hidden = true;
    activeStep = 1;
    getActiveDialogueStep().hidden = false;
    dialogueFeedback.hidden = true;
    dialogueFeedback.textContent = '';
    continueDialogue.hidden = true;
    updateDialogueProgress();
    return;
  }

  dialogueSteps.forEach((step) => {
    if (step.dataset.stance === activeStance) step.hidden = true;
  });
  continueDialogue.hidden = true;
  const stanceName = activeStance === 'ban' ? 'Ban Phones' : 'Regulate & Integrate';
  const resultText = strongArguments === 2
    ? 'You supported your stance with clear concessions and reasons. A strong recommendation weighs both classroom focus and fair access.'
    : 'Review the feedback and evidence. A convincing recommendation acknowledges trade-offs and explains how its conditions or consequences follow from the evidence.';
  simulatorResult.textContent = `Your decision: ${stanceName}. Strong arguments: ${strongArguments}/2. ${resultText}`;
  simulatorResult.className = `simulator-result result-box ${strongArguments === 2 ? 'success' : 'error'}`;
  simulatorResult.hidden = false;
});
