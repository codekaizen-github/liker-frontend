import { createSlice } from "@reduxjs/toolkit";

export const pendingLikesSlice = createSlice({
	name: "pendingLikes",
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

export const { increment, decrement, reset } = pendingLikesSlice.actions;

export default pendingLikesSlice.reducer;
