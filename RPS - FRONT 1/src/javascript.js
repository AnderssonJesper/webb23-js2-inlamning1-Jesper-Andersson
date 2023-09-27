const playerNameInput = document.getElementById('playerName');
const playerNameDisplay = document.getElementById('playerNameDisplay');
const playButtons = document.querySelectorAll('.play-button');
const resultDisplay = document.getElementById('result');
const playerScoreDisplay = document.getElementById('playerScore');
const highscoreList = document.getElementById('highscoreList');

let playerScore = 0;
let highscores = [];

window.addEventListener('load', fetchHighscores);

function updatePlayerNameDisplay() {
    playerNameDisplay.textContent = `Player Name: ${playerNameInput.value}`;
}

function updateHighscoreList() {
    highscoreList.innerHTML = '';
    highscores.forEach((hs, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${hs.name}: ${hs.score}`;
        highscoreList.appendChild(listItem);

    });
}

function playRound(playerChoice) {
    const choices = ['rock', 'paper', 'scissor'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];

    const playerChoiceElement = document.getElementById('playerChoice');
    const computerChoiceElement = document.getElementById('computerChoice');
    playerChoiceElement.textContent = `Ditt val: ${playerChoice}`;
    computerChoiceElement.textContent = `Datorns val: ${computerChoice}`;


    if (playerChoice === computerChoice) {
        resultDisplay.textContent = 'Omgången är oavgjord!';
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissor') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissor' && computerChoice === 'paper')
    ) {
        resultDisplay.textContent = 'Du vinner omgången!';
        playerScore++;

    } else {
        resultDisplay.textContent = 'Datorn vinner omgången!';
        playerScore = 0;
    }

    playerScoreDisplay.textContent = `Din poäng: ${playerScore}`;

    const playerName = playerNameInput.value;

    highscores.push({ playerName, score: playerScore });

    highscores.sort((a, b) => b.score - a.score);

    highscores = highscores.slice(0, 5);

    updateHighscoreList();
    sendScore(playerName, playerScore);

}

function fetchHighscores() {
    fetch('http://localhost:3000/highscores')
        .then((response) => response.json())
        .then((data) => {
            highscores = data;
            updateHighscoreList();
        });
}

function sendScore(playerName, score) {
    fetch('http://localhost:3000/addScore', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({ playerName, score }),

    })
        .then((response) => {
            if (response.status === 201) {
                fetchHighscores();
            }
        });
}

const resetButton = document.getElementById('resetHighscores');
resetButton.addEventListener('click', () => {
    fetch('http://localhost:3000/resetHighscores', {
        method: 'DELETE',
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data.message);
            fetchHighscores();
        });
});
fetchHighscores();


playButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const playerChoice = button.getAttribute('data-choice');
        playRound(playerChoice);
    });
});