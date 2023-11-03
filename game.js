const phraseBlock = document.querySelector("#phrase_block");
// Crée un objet pour gérer les données du texte du jeu
const textGameData = {
  letterIndex: 0, // Index de la lettre actuelle dans la phrase
  idText: 0, // Index du texte actuel
  phrase: null, // La phrase actuelle (peut être mise à jour)
  isFinishedTyping: false,
  textTable: [], // Tableau de texte contenant différentes phrases
};

// Crée un objet pour gérer les données des joueurs
const players = {
  currentPlayer: 1, // Joueur actuel (1 ou 2)
  player1Life: 100, // Points de vie du joueur 1
  player2Life: 100, // Points de vie du joueur 2
  player1Time: 0, // Compteur de temps du joueur 1
  player2Time: 0, // Compteur de temps du joueur 2
  roundCount: 0, // Nombre de rounds joués
  isRoundOver: false, // Indique si le round est terminé ou non
};

const avatarOfPlayer1 = document.querySelector("#player1");
const avatarOfPlayer2 = document.querySelector("#player2");
const player1LifeDisplay = document.querySelector("#player1_life");
const player2LifeDisplay = document.querySelector("#player2_life");
player1LifeDisplay.innerText = players.player1Life;
player2LifeDisplay.innerText = players.player2Life;

const timerDisplay = document.querySelector("#timer");
// Crée un objet pour gérer les données du minuteur du jeu (20 secondes)
const gameTimerData = {
  timer: null, // Référence à l'intervalle de temps du minuteur
  isRunning: false, // Indique si le minuteur est en cours d'exécution
  countDown: 20, // Durée initiale du minuteur en secondes
};

// Initialise le texte de départ et les événements de clavier
switchText();
// Demarre le compte a rebour de 20 seconde
startTimer();
document.addEventListener("keydown", (e) => {
  const key = e.key;
  const currentLetter = textGameData.phrase[textGameData.letterIndex];

  if(players.currentPlayer === 1){
    avatarOfPlayer2.style.borderColor = 'black'
    avatarOfPlayer1.style.borderColor = 'green'
  }else{
    avatarOfPlayer1.style.borderColor = 'black'
    avatarOfPlayer2.style.borderColor = 'green'
  }

  if (key === currentLetter) {
    handleCorrectKey();
  } else {
    handleIncorrectKey();
  }
});

// Gère la saisie correcte d'une lettre
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
  } else {
    textGameData.letterIndex++;
  }
}

// Gère la saisie incorrecte d'une lettre
function handleIncorrectKey() {
  const letterSpanFalse = phraseBlock.querySelector(
    `span:nth-child(${textGameData.letterIndex + 1})`
  );
  letterSpanFalse.style.color = "red";
}

// Réinitialise les styles des lettres
function resetPhraseStyles() {
  phraseBlock.querySelectorAll("span").forEach((span) => {
    span.style.color = "black";
  });
}

// Met à jour le joueur actuel et vérifie si le jeu est terminé
function updatePlayersAndCheckGameOver() {
  players.currentPlayer = players.currentPlayer === 1 ? 2 : 1;
  gameTimerData.countDown = 20;
  timerDisplay.textContent = gameTimerData.countDown;
  switchText();
}

// Réduit la vie des joueurs en fonction du temps
function reduceLife() {
  if (players.player1Time > players.player2Time) {
    // avatarOfPlayer1.style.borderColor = "red";
    avatarOfPlayer2.setAttribute("id", "player2_attack");
    setTimeout(() => {
      avatarOfPlayer1.setAttribute("id", "player1_blesse");
    }, 1000)
    setTimeout(() => {
      avatarOfPlayer2.setAttribute("id", "player2");
      avatarOfPlayer1.setAttribute("id", "player1_seReleve");

      setTimeout(() => {
        avatarOfPlayer1.setAttribute("id", "player1");
      }, 1000);
    }, 2000);

    setTimeout(() => {
      players.player1Life -= 10;
      player1LifeDisplay.innerText = players.player1Life;
      player1LifeDisplay.style.width = players.player1Life + "px";
    }, 1000)


  } else if (players.player1Time < players.player2Time) {
    // avatarOfPlayer2.style.borderColor = "red";
    avatarOfPlayer1.setAttribute("id", "player1_attack");
    setTimeout(() => {
      avatarOfPlayer2.setAttribute("id", "player2_blesse");
    }, 1000)
    setTimeout(() => {
      avatarOfPlayer1.setAttribute("id", "player1");
      avatarOfPlayer2.setAttribute("id", "player2_seReleve");

      setTimeout(() => {
        avatarOfPlayer2.setAttribute("id", "player2");
      }, 1000);
    }, 2000);

    setTimeout(() => {
      players.player2Life -= 10;
      player2LifeDisplay.innerText = players.player2Life;
      player2LifeDisplay.style.width = players.player2Life + "px";
    }, 1000)
  }

  if (players.player1Life <= 0) {
    // avatarOfPlayer1.style.display = "none";
    avatarOfPlayer1.setAttribute('id', 'player1_mort');
    console.log("Player 2 wins!");
  } else if (players.player2Life <= 0) {
    // avatarOfPlayer2.style.display = "none";
    avatarOfPlayer2.setAttribute('id', 'player2_mort');
    console.log("Player 1 wins!");
  }
}

// Réinitialise les compteurs de temps des joueurs
function resetCounters() {
  players.player1Time = 0;
  players.player2Time = 0;
}

// Met à jour le minuteur
function updateTimer() {
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

// Gère la fin du minuteur
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

// Démarre le minuteur
function startTimer() {
  if (!gameTimerData.isRunning) {
    timer = setInterval(updateTimer, 1000);
    gameTimerData.isRunning = true;
  }
}

// Change le texte affiché en fonction du joueur
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
  // Crée un span pour chaque lettre dans la phrase
  phraseBlock.innerHTML = textGameData.phrase
    .split("")
    .map((letter) => `<span>${letter}</span>`)
    .join("");
}
