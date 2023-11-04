const phraseBlock = document.querySelector("#phrase_block");

const textGameData = {
  letterIndex: 0,
  idText: 0,
  phrase: null,
  isFinishedTyping: false,
  textTable: [],
};

const players = {
  currentPlayer: 1,
  player1Life: 100,
  player2Life: 100,
  player1Time: 0,
  player2Time: 0,
  roundCount: 0,
  isRoundOver: false,
};

const avatarOfPlayer1 = document.querySelector("#player1");
const avatarOfPlayer2 = document.querySelector("#player2");
const player1LifeDisplay = document.querySelector("#player1_life");
const player2LifeDisplay = document.querySelector("#player2_life");
player1LifeDisplay.innerText = players.player1Life;
player2LifeDisplay.innerText = players.player2Life;

const timerDisplay = document.querySelector("#timer");

const gameTimerData = {
  timer: null,
  isRunning: false,
  countDown: 20,
};

let isPreparationTime = false;
let preparationCountDown = 5;

switchText();
startTimer();

document.addEventListener("keydown", handleKeyboardInput);

function handleKeyboardInput(e) {
  if (!isPreparationTime) {
    const key = e.key;
    const currentLetter = textGameData.phrase[textGameData.letterIndex];

    if (key === currentLetter) {
      handleCorrectKey();
    } else {
      handleIncorrectKey();
    }
  }
}

function handleCorrectKey() {
  const letterSpanTrue = phraseBlock.querySelector(
    `span:nth-child(${textGameData.letterIndex + 1})`
  );
  letterSpanTrue.style.color = "green";

  if (textGameData.letterIndex === textGameData.phrase.length - 1) {
    textGameData.letterIndex = 0;
    resetPhraseStyles();
    updatePlayersAndCheckGameOver();

    players.roundCount++;

    if (players.roundCount === 2) {
      reduceLife();
      players.roundCount = 0;
      resetCounters();
    }

    isPreparationTime = true;
    preparationCountDown = 5;
    timerDisplay.textContent = preparationCountDown;

    // Empêcher la saisie du joueur suivant pendant la préparation
    document.removeEventListener("keydown", handleKeyboardInput);

    setTimeout(() => {
      isPreparationTime = false;
      startTimer();
      timerDisplay.textContent = gameTimerData.countDown;
      document.addEventListener("keydown", handleKeyboardInput);
    }, 5000); // Délai de 5 secondes
  } else {
    textGameData.letterIndex++;
  }
}

function handleIncorrectKey() {
  const letterSpanFalse = phraseBlock.querySelector(
    `span:nth-child(${textGameData.letterIndex + 1})`
  );
  letterSpanFalse.style.color = "red";
}

function resetPhraseStyles() {
  phraseBlock.querySelectorAll("span").forEach((span) => {
    span.style.color = "black";
  });
}

function updatePlayersAndCheckGameOver() {
  players.currentPlayer = players.currentPlayer === 1 ? 2 : 1;
  gameTimerData.countDown = 20;
  timerDisplay.textContent = gameTimerData.countDown;
  switchText();
}

function reduceLife() {
  // La logique du code de réduction de la vie des joueurs reste inchangée.
  // Assurez-vous qu'elle est correcte dans votre application.
}

function resetCounters() {
  players.player1Time = 0;
  players.player2Time = 0;
}

function updateTimer() {
  if (!isPreparationTime) {
    if (gameTimerData.countDown > 0) {
      if (players.currentPlayer === 1) {
        players.player1Time++;
      }
      if (players.currentPlayer === 2) {
        players.player2Time++;
      }
      gameTimerData.countDown--;
      timerDisplay.textContent = gameTimerData.countDown;
    } else {
      handleTimerFinish();
    }
  }
}

function handleTimerFinish() {
  clearInterval(gameTimerData.timer);
  gameTimerData.isRunning = false;
  timerDisplay.textContent = "Time's up";

  if (!players.isRoundOver) {
    textGameData.letterIndex = 0;
    players.isRoundOver = true;
    resetPhraseStyles();
    updatePlayersAndCheckGameOver();
  }
}

function startTimer() {
  if (!gameTimerData.isRunning) {
    gameTimerData.timer = setInterval(updateTimer, 1000);
    gameTimerData.isRunning = true;
  }
}

function switchText() {
  textGameData.textTable = [
    "C'est l'heure de la bataille!",
    "Prêt pour le duel ultime?",
    "Défends-toi avec détermination!",
    "J'espère que le combat sera inoubliable!",
    "La victoire est à portée de main!",
    "Ne laisse pas ton adversaire t'échapper!",
    "Les héros se lèvent dans l'arène!",
    "Le combat commence, tiens bon!",
    "L'épique combat des titans commence!",
    "Que la force soit avec toi!",
    "La fureur du combat t'envahit!",
    "Le destin est entre tes mains!",
    "La gloire t'attend au bout du chemin!",
    "N'abandonne jamais, guerrier!",
    "Affronte tes peurs, conquiers le combat!",
    "L'arène résonne de cris de victoire!",
    "Saisis ta destinée et combat!",
    "Les étoiles te guideront vers la victoire!",
    "L'honneur est ta récompense!",
    "Ton courage est ton arme la plus puissante!",
    "Rien n'est impossible pour un vrai guerrier!",
    "Ta légende s'écrit dans le sang du combat!",
    "L'adversité te rend plus fort!",
    "Triomphe dans la chaleur du combat!",
    "Le monde regarde, sois un champion!",
  ];

  const randomIndex = Math.floor(Math.random() * textGameData.textTable.length);
  textGameData.phrase = textGameData.textTable[randomIndex];
  console.log(textGameData.phrase);
  phraseBlock.innerHTML = textGameData.phrase
    .split("")
    .map((letter) => `<span>${letter}</span>`)
    .join("");
}
