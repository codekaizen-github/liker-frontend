import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/*
"games": [
        {
            "id": 1,
            "likeCount": 0,
            "status": 1,
            "successfulLikes": 0,
            "failedLikes": 0
        },
        {
            "id": 2,
            "likeCount": 0,
            "status": 1,
            "successfulLikes": 0,
            "failedLikes": 0
        },
        {
            "id": 3,
            "likeCount": 0,
            "status": 1,
            "successfulLikes": 0,
            "failedLikes": 0
        },
        {
            "id": 4,
            "likeCount": 0,
            "status": 1,
            "successfulLikes": 0,
            "failedLikes": 0
        },
        {
            "id": 5,
            "likeCount": 0,
            "status": 1,
            "successfulLikes": 0,
            "failedLikes": 0
        },
        {
            "id": 6,
            "likeCount": 0,
            "status": 1,
            "successfulLikes": 1,
            "failedLikes": 0
        },
        {
            "id": 7,
            "likeCount": 0,
            "status": 0,
            "successfulLikes": 0,
            "failedLikes": 0
        }
    ]
*/

export interface Game {
    id: number;
    likeCount: number;
    status: number;
    successfulLikes: number;
    failedLikes: number;
}

export interface GamesState {
    games: Game[];
    currentGame: Game | null;
}
const initialState: GamesState = {
    games: [],
    currentGame: null,
};

export const gamesSlice = createSlice({
    name: 'games',
    initialState: {
        value: initialState,
    },
    reducers: {
        setGames(state, action: PayloadAction<Game[]>) {
            state.value.games = action.payload;
        },
        setActiveGame(state, action: PayloadAction<Game | null>) {
            state.value.currentGame = action.payload;
        },
    },
});

export const { setGames, setActiveGame } = gamesSlice.actions;

export default gamesSlice.reducer;
