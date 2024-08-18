import { createSlice } from "@reduxjs/toolkit";

export const likeEnabledSlice = createSlice({
	name: "likeEnabled",
	initialState: {
		value: true,
	},
	reducers: {
		setLikeEnabled: (state, action) => {
			state.value = action.payload;
		},
	},
});

export const { setLikeEnabled } = likeEnabledSlice.actions;

export default likeEnabledSlice.reducer;
