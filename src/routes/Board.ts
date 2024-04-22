import { board, boardState, difficulty, flags, gameState, paused, time } from '$stores/board';
import { create2dArray, getSurroundingCoordinates, mod } from '$lib/utils';

import { LEVELS } from '$lib/constants';
import { coins } from '$stores/shop';
import { get } from 'svelte/store';

export const getWidth = () => LEVELS[get(difficulty)].width;
export const getHeight = () => LEVELS[get(difficulty)].height;
export const getBombs = () => LEVELS[get(difficulty)].bombs;

export const generateBoard = () => {
	let bombs = getBombs();
	const TOTAL_CELLS = getWidth() * getHeight();

	board.set(create2dArray(getWidth(), getHeight()));
	boardState.set(create2dArray(getWidth(), getHeight()));
	flags.set(create2dArray(getWidth(), getHeight()));

	// init everything with 0
	for (let index = 0; index < getHeight(); index++) get(board)[index].fill(0);

	// populate
	for (let index = 0; index < getHeight(); index++) {
		const row = get(board)[index];

		for (let cell = 0; cell < getWidth(); cell++) {
			if (bombs == 0) {
				continue;
			}

			const odds = bombs / (TOTAL_CELLS - (index * getHeight() + cell + 1));
			const isBomb = Math.random() < odds;

			if (bombs > 0 && isBomb) {
				bombs -= 1;
				row[cell] = '💣';

				const surroundingCoordinates = getSurroundingCoordinates(cell, index);
				for (const coord of Object.values(surroundingCoordinates)) {
					const [y, x] = coord;
					if (
						!coord.some((x) => x < 0) &&
						y < getHeight() &&
						x < getWidth() &&
						get(board)[y][x] != '💣'
					) {
						get(board)[y][x] = (get(board)[y][x] as number) + 1;
					}
				}
			}
		}
	}
};

export const startGame = () => {
	time.set(0);
	paused.set(false);
	gameState.set('COOKING');
	generateBoard();
};

export const togglePause = () => {
	if (get(gameState) === 'COOKING') paused.update((pause) => !pause);
};

export const resetGame = () => {
	gameState.set('NOT STARTED');
	flags.set(create2dArray(getWidth(), getHeight()));
};

export const checkWinCondition = () => {
	const flatBoard = get(board).flatMap((row) => row);
	const flatFlags = get(flags).toString().split(',');
	const flatState = get(boardState).toString().split(',');

	const isWin = flatBoard.every((cell, i) =>
		cell == '💣' ? parseInt(flatFlags[i]) || !parseInt(flatState[i]) : parseInt(flatState[i])
	);

	if (isWin) {
		gameState.set('WON');
		coins.update((coin) => coin + getBombs());
		if (get(time) < 60) coins.update((coin) => coin + 5);
		else if (get(time) < 60 * 2) coins.update((coin) => coin + 3);
		else if (get(time) < 60 * 3) coins.update((coin) => coin + 1);
	}
};

export const checkLostCondition = (x: number, y: number) => {
	const isLost = get(board)[y][x] == '💣';
	if (isLost) {
		gameState.set('LOST');

		// reveal all bombs
		let correctFlags = 0;
		const flatBoard = get(board).flatMap((row) => row);
		flatBoard.forEach((cell, i) => {
			if (cell == '💣') {
				const [x, y] = [mod(i, getHeight()), Math.floor(i / getHeight())];
				get(boardState)[y][x] = 1;
				if (get(flags)[y][x]) correctFlags += 1;
			}
		});

		// reward coins if flags not abused
		const flatFlags = get(flags).toString().split(',');
		const isEligible =
			flatFlags.reduce((count, current) => (current == '1' ? count + 1 : count), 0) <=
			getBombs() + 1;
		if (isEligible) coins.update((coin) => coin + correctFlags);
	}
};

export const openZero = (x_: number, y_: number) => {
	const surroundingCoordinates = getSurroundingCoordinates(x_, y_);
	for (const coord of Object.values(surroundingCoordinates)) {
		const [y, x] = coord;
		if (
			!coord.some((z) => z < 0) &&
			coord[0] < getHeight() &&
			coord[1] < getWidth() &&
			!get(boardState)[y][x]
		) {
			get(boardState)[y][x] = 1;
			if (get(board)[y][x] == 0) openZero(x, y);
		}
	}
};
