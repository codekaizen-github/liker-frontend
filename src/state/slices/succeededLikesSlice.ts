import { createSlice } from '@reduxjs/toolkit';

export const succeededLikesSlice = createSlice({
    name: 'succeededLikes',
    initialState: {
        value: 0,
    },
    reducers: {
        setSucceededLikes: (state, action) => {
            state.value = action.payload;
        },
        reset: () => {
            return { value: 0 };
        },
        increment: (state) => {
            state.value += 1;
        },
    },
});

export const { setSucceededLikes, reset, increment } =
    succeededLikesSlice.actions;

export default succeededLikesSlice.reducer;
