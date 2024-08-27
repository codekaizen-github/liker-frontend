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

const likerWritePath = import.meta.env.VITE_LIKER_WRITE_PATH_URL ?? "";

export const requestAuthorization =
	(email: string) => async (dispatch: Dispatch) => {
		fetch(likerWritePath, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				data: {
					type: "user-login-intended",
					payload: {
						timestamp: new Date().toISOString(),
						user: {
							email: email,
						},
					},
				},
			}),
		})
			.then((response) => response.json())
			.then((data) => console.log(data))
			.catch((error) => console.error(error));
		dispatch(emailSlice.actions.setEmail(email));
	};

export default emailSlice.reducer;
