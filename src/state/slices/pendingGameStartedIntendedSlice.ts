import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import writeEvent from '../../writeEvent';
import { RootGetStateType } from '../store';
interface PendingGameStartedIntendedsState {
    value: string[];
}
// Define the initial state using that type
const initialState: PendingGameStartedIntendedsState = {
    value: [],
};
// First, create the thunk

export const pendingGameStartedIntendedsSlice = createSlice({
    name: 'pendingGameStartedIntendeds',
    initialState,
    reducers: {
        add: (state, action: PayloadAction<string>) => {
            state.value.push(action.payload);
        },
        remove: (state, action: PayloadAction<string>) => {
            state.value = state.value.filter((id) => id !== action.payload);
        },
        removeBulk: (state, action: PayloadAction<string[]>) => {
            const newStateValue = state.value.filter(
                (id) => !action.payload.includes(id)
            );
            state.value = newStateValue;
        },
        reset: () => {
            return initialState;
        },
    },
});

export const newGame =
    () => async (dispatch: Dispatch, getState: RootGetStateType) => {
        const fencingToken = await writeEvent('game-started-intended', {
            user: {
                email: getState().email.value,
            },
        });
        dispatch(pendingGameStartedIntendedsSlice.actions.add(fencingToken));
    };

// Extract the action creators object and the reducer
const { actions, reducer } = pendingGameStartedIntendedsSlice;
// Extract and export each action creator by name
export const { add, remove, reset, removeBulk } = actions;
// Export the reducer, either as a default or named export
export default reducer;
