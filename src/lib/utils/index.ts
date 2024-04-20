export const create2dArray = (width: number, height: number) =>
	[...Array(height)].map(() => Array(width));

export const mod = (a: number, b: number) => ((a % b) + b) % b;

export const getSurroundingCoordinates = (x: number, y: number) => ({
	topLeft: [y - 1, x - 1],
	top: [y - 1, x],
	topRight: [y - 1, x + 1],
	right: [y, x + 1],
	botRight: [y + 1, x + 1],
	bot: [y + 1, x],
	botLeft: [y + 1, x - 1],
	left: [y, x - 1]
});

export const capitalize = (str: string): string =>
	str.replace(/^([a-z])/, (first) => first.toUpperCase());
