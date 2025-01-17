let words = [];
let score = 0;
let timeLeft = 5; // Initial timer set to 60 seconds
let timerInterval;
let gameStarted = false;

const spaceSound = new Audio('./FX/space.mp3'); 
const skipSound = new Audio('./FX/skip.mp3'); 
const endSound = new Audio('./FX/end.mp3'); 
const clockSound = new Audio('./FX/tick.mp3'); 
const startSound = new Audio('./FX/start.mp3'); 

const wordBox = document.getElementById('word-box'); // The right-hand side box for displaying skipped or correct words

const wordElement = document.getElementById('word');
const scoreElement = document.getElementById('score');
const timerElement = document.createElement('div');
timerElement.id = 'timer';
timerElement.style.fontSize = '1.5em';
timerElement.style.color = 'red';
document.body.appendChild(timerElement);

async function fetchWords() {
  const response = await fetch('https://random-word-api.herokuapp.com/word?number=1000');
  words = await response.json();
}

function startGame() {
  // Add an event listener for the keydown event
  document.addEventListener('keydown', function(event) {
    // Check if the pressed key is the space bar
    if (event.code === 'Space' & !gameStarted) {
      gameStarted = true;
      console.log(gameStarted)
      console.log('Space bar pressed! Starting...');
      timeLeft = 5;
      score = 0;
      initWordAndScore(); // Initialize with the first word
      startTimer(); // Start the timer after fetching words
      document.addEventListener('keydown', handleKeyPress);
    }
  });
}

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function addWordToHistory(word, color) {
  // Create a new div element to hold the word with the specified color
  const wordDiv = document.createElement('div');
  wordDiv.textContent = word;
  wordDiv.style.color = color;
  wordBox.appendChild(wordDiv); // Add it to the word-box
}

function initWordAndScore() {
  if (words.length > 0) {
    wordElement.textContent = getRandomWord();
    scoreElement.textContent = `Score: ${score}`
    updateTimerDisplay();
    startSound.play();
  }
}

function updateWordAndScore() {
  if (words.length > 0) {
    wordElement.textContent = getRandomWord();
    score++;
    scoreElement.textContent = `Score: ${score}`;
    addTime(15); // Add 10 seconds to the timer
    spaceSound.play();
  }
}

function replaceWord() {
  if (words.length > 0) {
    wordElement.textContent = getRandomWord();
    skipSound.play();
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

function addTime(seconds) {
  timeLeft += seconds;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  timerElement.textContent = `Time Left: ${timeLeft}s`;
  clockSound.play();

  // Add pulsing effect if time is less than 5 seconds
  if (timeLeft < 5) {
    wordElement.classList.add('pulsing');
  } else {
    wordElement.classList.remove('pulsing');
  }
}

function waitFiveSeconds() {
  return new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
}

function endGame() {
  wordElement.textContent = 'Game Over!';
  wordElement.style.color = 'red';
  document.removeEventListener('keydown', handleKeyPress);
  endSound.play();
  gameStarted = false;

  
  startGame();
  console.log(gameStarted)
}

function handleKeyPress(event) {

  console.log("booboo");

  if (event.code === 'Space' & gameStarted) {
    event.preventDefault(); // Prevent the default spacebar scroll behavior
    updateWordAndScore();
    addWordToHistory(wordElement.textContent, 'green'); // Add word in green (correct)
  } else if (event.code === 'KeyS' & gameStarted) {
    event.preventDefault(); // Prevent default action if needed
    replaceWord(); // Replace word without affecting score or timer
    addWordToHistory(wordElement.textContent, 'red'); // Add word in red (skipped)
  }
}



// Prevent mouse events from interfering with the game
document.addEventListener('mousemove', (event) => {
  event.preventDefault(); // Prevent default behavior on mousemove
});

document.addEventListener('click', (event) => {
  event.preventDefault(); // Prevent default behavior on mouse click
});
// Fetch words on load
fetchWords();
startGame();
