import { createSlice } from "@reduxjs/toolkit";

export const failedLikesSlice = createSlice({
	name: "failedLikes",
	initialState: {
		value: 0,
	},
	reducers: {
		setFailedLikes: (state, action) => {
			state.value = action.payload;
		},
		reset: () => {
			return { value: 0 };
		},
	},
});

export const { setFailedLikes, reset } = failedLikesSlice.actions;

export default failedLikesSlice.reducer;
