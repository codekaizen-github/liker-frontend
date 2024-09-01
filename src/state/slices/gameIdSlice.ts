import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameIdState {
    value: number | undefined;
}
const initialState: GameIdState = {
    value: undefined,
};
export const gameIdSlice = createSlice({
    name: 'gameId',
    initialState,
    reducers: {
        setId: (state, action: PayloadAction<number>) => {
            state.value = action.payload;
        },
    },
});

export const { setId } = gameIdSlice.actions;
export default gameIdSlice.reducer;
