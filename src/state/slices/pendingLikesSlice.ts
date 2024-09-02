import { createSlice, Dispatch } from '@reduxjs/toolkit';
import writeEvent from '../../transmissionControl/writeEvent';
import { RootGetStateType } from '../store';

// First, create the thunk

export const pendingLikesSlice = createSlice({
    name: 'pendingLikes',
    initialState: {
        value: 0,
    },
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        reset: () => {
            return { value: 0 };
        },
    },
});

export const newLike =
    () => async (dispatch: Dispatch, getState: RootGetStateType) => {
        await writeEvent('like-intended', {
            game: {
                id: getState().gameId.value,
            },
        });
        dispatch(pendingLikesSlice.actions.increment());
    };

// Extract the action creators object and the reducer
const { actions, reducer } = pendingLikesSlice;
// Extract and export each action creator by name
export const { increment, decrement, reset } = actions;
// Export the reducer, either as a default or named export
export default reducer;
