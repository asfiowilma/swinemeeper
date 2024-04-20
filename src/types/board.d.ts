type Board = Array<Array<number | '💣'>>;
type BoardState = Array<Array<number>>;
type GameState = 'INITIALIZING' | 'NOT STARTED' | 'COOKING' | 'WON' | 'LOST';

type Level = {
	height: number;
	width: number;
	bombs: number;
};
type Difficulty = 'beginner' | 'intermediate' | 'expert';
