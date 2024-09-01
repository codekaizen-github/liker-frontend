import { configureStore } from '@reduxjs/toolkit';
import emailReducer from './slices/emailSlice';
import likeEnabledReducer from './slices/likeEnabledSlice';
import pendingLikesReducer from './slices/pendingLikesSlice';
import failedLikesReducer from './slices/failedLikesSlice';
import succeededLikesReducer from './slices/succeededLikesSlice';
import gameStateReducer from './slices/gameStateSlice';
import gameIdReducer from './slices/gameIdSlice';

const store = configureStore({
    reducer: {
        email: emailReducer,
        likeEnabled: likeEnabledReducer,
        pendingLikes: pendingLikesReducer,
        failedLikes: failedLikesReducer,
        succeededLikes: succeededLikesReducer,
        gameState: gameStateReducer,
        gameId: gameIdReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type RootGetStateType = typeof store.getState;
export type AppStore = typeof store;

export default store;
