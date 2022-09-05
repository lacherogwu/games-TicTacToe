// element references
const grid = document.querySelector('.grid');
const blocks = grid.querySelectorAll('.block');
const feedback = document.querySelector('.feedback p');
const scoreboard = document.querySelectorAll('.scoreboard .box');
const startBtn = document.querySelector('#startGame');

/* State */
// game state
let gameStarted = false;
let turn;

// players state
const players = {
	playerA: {
		item: '😍',
		score: 0,
	},
	playerB: {
		item: '😎',
		score: 0,
	},
};

/* Core Functions */
const reset = () => {
	turn = 'playerA';

	// clean grid
	blocks.forEach(i => (i.textContent = ''));
};

const startGame = () => {
	reset();
	gameStarted = true;

	updateFeedback('Game Started, Good Luck!', 'green');
	updateUI();
};

const switchTurn = () => (turn = turn === 'playerA' ? 'playerB' : 'playerA');

const updateFeedback = (text, state) => {
	feedback.className = 'content';
	if (state) feedback.classList.add(`text--${state}`);
	feedback.textContent = text;
};

const checkDraw = currentGrid => {
	const draw = currentGrid.filter(Boolean).length === 9;
	if (!draw) return;
	declareWinner();
};

const checkWinner = () => {
	const possibilities = [
		// column win
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		// row win
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		// cross win
		[0, 4, 8],
		[6, 4, 2],
	];

	const currentGrid = [];
	blocks.forEach(elem => currentGrid.push(elem.textContent));

	const playersItems = [players.playerA.item, players.playerB.item];

	const winner = playersItems
		.map((player, index) => {
			const playerBoard = currentGrid.map((item, itemIndex) => (item === player ? itemIndex : false)).filter(i => i !== false);
			const exists = possibilities.some(pos => pos.every(v => playerBoard.includes(v)));
			if (exists) return index === 0 ? 'playerA' : 'playerB';
		})
		.filter(Boolean);

	winner.length ? declareWinner(winner[0]) : checkDraw(currentGrid);
};

const declareWinner = winner => {
	let feedback = [];
	if (!winner) {
		feedback = ['There was no winner 😢', 'red'];
	} else {
		feedback = [`Congratulations 🎉 ${winner} has won this game!`, 'green'];
		players[winner].score++;
	}
	gameStarted = false;
	updateFeedback(...feedback);
	updateUI();
};

/* Game Functions */
const playerTurn = (turn, target) => {
	// if game hasn't started or box is filled
	if (!gameStarted || target.textContent.length) return;

	target.textContent = players[turn].item;
	switchTurn();

	// process winner
	checkWinner();
};

/* Click Handlers */
grid.addEventListener('click', ({ target }) => {
	if (target.className !== 'block') return;

	playerTurn(turn, target);
});

/* Update UI */
// update score
const updateScore = () => {
	scoreboard.forEach((elem, index) => {
		const span = elem.querySelector('span');
		span.textContent = index ? players.playerB.score : players.playerA.score;
	});
};

// update start button
const updateStartButton = () => (gameStarted ? startBtn.setAttribute('disabled', true) : startBtn.removeAttribute('disabled'));

const updateUI = () => {
	updateScore();
	updateStartButton();
};
