import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import writeEvent from '../../writeEvent';
// import { RootGetStateType } from '../store';
interface PendingGamesState {
    value: string | null;
}
// Define the initial state using that type
const initialState: PendingGamesState = {
    value: null,
};
// First, create the thunk

export const pendingGamesSlice = createSlice({
    name: 'pendingGames',
    initialState,
    reducers: {
        add: (state, action: PayloadAction<string>) => {
            state.value = action.payload;
        },
        removeBulk: (state, action: PayloadAction<string[]>) => {
            if (state.value !== null && action.payload.includes(state.value)) {
                state.value = null;
            }
        },
        reset: () => {
            return initialState;
        },
    },
});

export const newGame =
    () => async (dispatch: Dispatch /*, getState: RootGetStateType*/) => {
        const fencingToken = await writeEvent('game-started-intended', {});
        dispatch(pendingGamesSlice.actions.add(fencingToken));
    };

// Extract the action creators object and the reducer
const { actions, reducer } = pendingGamesSlice;
// Extract and export each action creator by name
export const { add, removeBulk, reset } = actions;
// Export the reducer, either as a default or named export
export default reducer;
