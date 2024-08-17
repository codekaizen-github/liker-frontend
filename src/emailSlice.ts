import { createSlice } from "@reduxjs/toolkit";

export const emailSlice = createSlice({
	name: "email",
	initialState: {
		value: "",
	},
	reducers: {
		setEmail: (state, action) => {
			state.value = action.payload;
			console.log("Email set to: ", action.payload);
		},
	},
});

export const { setEmail } = emailSlice.actions;

export default emailSlice.reducer;
