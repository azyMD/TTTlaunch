const socket = io();

const loginDiv = document.getElementById('login');
const lobbyDiv = document.getElementById('lobby');
const gameDiv = document.getElementById('game');
const playerNameInput = document.getElementById('playerName');
const loginBtn = document.getElementById('loginBtn');
const playerList = document.getElementById('playerList');
const playWithBotBtn = document.getElementById('playWithBot');
const board = document.getElementById('board');
const quitGameBtn = document.getElementById('quitGame');

let currentPlayer;

// Login
loginBtn.addEventListener('click', () => {
    const name = playerNameInput.value;
    if (name) {
        currentPlayer = name;
        socket.emit('join', name);
        loginDiv.style.display = 'none';
        lobbyDiv.style.display = 'block';
    }
});

// Update lobby
socket.on('updateLobby', (players) => {
    playerList.innerHTML = '';
    for (const id in players) {
        const player = players[id];
        const li = document.createElement('li');
        li.textContent = `${player.name} (${player.status})`;
        playerList.appendChild(li);
    }
});

// Play with Bot
playWithBotBtn.addEventListener('click', () => {
    lobbyDiv.style.display = 'none';
    gameDiv.style.display = 'block';
});

// Game logic
board.addEventListener('click', (e) => {
    if (e.target.classList.contains('cell')) {
        const index = e.target.getAttribute('data-index');
        socket.emit('move', { index, player: currentPlayer });
    }
});

// Update game board
socket.on('updateGame', (data) => {
    const cell = document.querySelector(`.cell[data-index="${data.index}"]`);
    cell.textContent = data.player;
});

// Quit game
quitGameBtn.addEventListener('click', () => {
    gameDiv.style.display = 'none';
    lobbyDiv.style.display = 'block';
});