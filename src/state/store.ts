import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import totalOrderIdReducer from './slices/totalOrderIdSlice';
import likeEnabledReducer from './slices/likeEnabledSlice';
import pendingLikesReducer from './slices/pendingLikesSlice';
import failedLikesReducer from './slices/failedLikesSlice';
import succeededLikesReducer from './slices/succeededLikesSlice';
import gameStateReducer from './slices/gameStateSlice';
import gameIdReducer from './slices/gameIdSlice';
import gamesReducer from './slices/gamesSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        totalOrderId: totalOrderIdReducer,
        likeEnabled: likeEnabledReducer,
        pendingLikes: pendingLikesReducer,
        failedLikes: failedLikesReducer,
        succeededLikes: succeededLikesReducer,
        gameState: gameStateReducer,
        gameId: gameIdReducer,
        games: gamesReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type RootGetStateType = typeof store.getState;
export type AppStore = typeof store;

export default store;
