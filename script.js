const board = document.getElementById('game-board');
const moveCounter = document.getElementById('move-counter');
const timerDisplay = document.getElementById('timer');
const restartButton = document.getElementById('restart');

let cardIcons = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🥝', '🍉'];
let cards, firstCard, secondCard;
let moves = 0, matchedPairs = 0;
let timer, seconds = 0, minutes = 0;

// Load sound effects
const flipSound = new Audio('flip.mp3');
const matchSound = new Audio('match.wav');
const wrongSound = new Audio('wrong.mp3');

function initGame() {
    moves = 0;
    matchedPairs = 0;
    seconds = 0;
    minutes = 0;
    moveCounter.textContent = moves;
    timerDisplay.textContent = "00:00";
    clearInterval(timer);
    
    // Shuffle and duplicate icons for card pairs
    let cardValues = [...cardIcons, ...cardIcons];
    cardValues.sort(() => 0.5 - Math.random());

    // Create the game board
    board.innerHTML = '';
    cardValues.forEach(icon => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="front"></div>
            <div class="back">${icon}</div>
        `;
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
    
    cards = document.querySelectorAll('.card');
    timer = setInterval(updateTimer, 1000);
}

function flipCard() {
    if (this.classList.contains('flip') || secondCard) return;
    flipSound.play();
    
    this.classList.add('flip');
    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        checkForMatch();
    }
}

function checkForMatch() {
    moves++;
    moveCounter.textContent = moves;

    if (firstCard.innerHTML === secondCard.innerHTML) {
        matchSound.play();
        matchedPairs++;
        resetTurn();
        
        // Check if all pairs are matched
        if (matchedPairs === cardIcons.length) {
            clearInterval(timer);
            setTimeout(() => {
                alert(`You won in ${moves} moves! Time taken: ${timerDisplay.textContent}`);
                initGame(); // Restart the game automatically after winning
            }, 500); // Add slight delay to ensure the last pair is visible before alert
        }
    } else {
        wrongSound.play();
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetTurn();
        }, 1000);
    }
}

function resetTurn() {
    firstCard = null;
    secondCard = null;
}

function updateTimer() {
    seconds++;
    if (seconds === 60) {
        minutes++;
        seconds = 0;
    }
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

restartButton.addEventListener('click', initGame);

initGame();



