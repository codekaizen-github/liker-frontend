import { configureStore } from "@reduxjs/toolkit";
import emailReducer from "./slices/emailSlice";
import likeEnabledReducer from "./slices/likeEnabledSlice";

const store = configureStore({
	reducer: {
		email: emailReducer,
		likeEnabled: likeEnabledReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
