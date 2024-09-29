import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import writeEvent from '../../writeEvent';
// import { RootGetStateType } from '../store';
interface PendingLikesState {
    value: string[];
}
// Define the initial state using that type
const initialState: PendingLikesState = {
    value: [],
};
// First, create the thunk

export const pendingLikesSlice = createSlice({
    name: 'pendingLikes',
    initialState,
    reducers: {
        add: (state, action: PayloadAction<string>) => {
            state.value.push(action.payload);
        },
        remove: (state, action: PayloadAction<string>) => {
            state.value = state.value.filter((id) => id !== action.payload);
        },
        removeBulk: (state, action: PayloadAction<string[]>) => {
            state.value = state.value.filter(
                (id) => !action.payload.includes(id)
            );
        },
        reset: () => {
            return initialState;
        },
    },
});

export const newLike =
    (gameId: number) =>
    async (dispatch: Dispatch /*, getState: RootGetStateType*/) => {
        const fencingToken = await writeEvent('like-intended', {
            game: {
                id: gameId,
            },
        });
        dispatch(pendingLikesSlice.actions.add(fencingToken));
    };

// Extract the action creators object and the reducer
const { actions, reducer } = pendingLikesSlice;
// Extract and export each action creator by name
export const { add, remove, reset, removeBulk } = actions;
// Export the reducer, either as a default or named export
export default reducer;
