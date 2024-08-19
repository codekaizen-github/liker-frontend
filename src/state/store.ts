import { configureStore } from "@reduxjs/toolkit";
import emailReducer from "./slices/emailSlice";
import likeEnabledReducer from "./slices/likeEnabledSlice";
import pendingLikesReducer from "./slices/pendingLikesSlice";
import failedLikesReducer from "./slices/failedLikesSlice";
import succeededLikesReducer from "./slices/succeededLikesSlice";
import gameStateReducer from "./slices/gameStateSlice";

const store = configureStore({
	reducer: {
		email: emailReducer,
		likeEnabled: likeEnabledReducer,
		pendingLikes: pendingLikesReducer,
		failedLikes: failedLikesReducer,
		succeededLikes: succeededLikesReducer,
		gameState: gameStateReducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
