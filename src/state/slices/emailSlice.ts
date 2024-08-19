import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";

export const emailSlice = createSlice({
	name: "email",
	initialState: {
		value: "",
	},
	reducers: {
		setEmail: (state, action: PayloadAction<string>) => {
			state.value = action.payload;
		},
	},
});

export const requestAuthorization =
	(email: string) => async (dispatch: Dispatch) => {
		console.log("is this working?");
		dispatch(emailSlice.actions.setEmail(email));
	};

export default emailSlice.reducer;
