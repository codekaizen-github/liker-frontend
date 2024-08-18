import { createSlice } from "@reduxjs/toolkit";

export enum GameState {
	REQUESTED = "REQUESTED",
	IN_PROGRESS = "IN_PROGRESS",
	WON = "WON",
	LOST = "LOST",
}

export const gameStateSlice = createSlice({
	name: "gameState",
	initialState: {
		value: GameState.REQUESTED,
	},
	reducers: {
		gameStarted: () => {
			return { value: GameState.IN_PROGRESS };
		},
		gameWon: () => {
			return { value: GameState.WON };
		},
		gameLost: () => {
			return { value: GameState.LOST };
		},
		gameRequested: () => {
			return { value: GameState.REQUESTED };
		},
	},
});

export const { gameStarted, gameWon, gameLost, gameRequested } =
	gameStateSlice.actions;

export default gameStateSlice.reducer;
