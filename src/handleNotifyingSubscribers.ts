import { StreamOut } from './db';
import store from './state/store';
import { gameStarted } from './state/slices/gameStateSlice';
import {
    decrement as pendingLikesSliceDecrement,
    reset as pendingLikesSliceReset,
} from './state/slices/pendingLikesSlice';
import {
    increment as succeededLikesSliceIncrement,
    reset as succeededLikesSliceReset,
} from './state/slices/succeededLikesSlice';
import { setId } from './state/slices/gameIdSlice';
export async function handleNotifyingSubscribers(
    streamOut: StreamOut
): Promise<void> {
    console.log({ streamOut });
    switch (streamOut.data.type) {
        case 'game-started-succeeded':
            store.dispatch(pendingLikesSliceReset());
            store.dispatch(succeededLikesSliceReset());
            store.dispatch(setId(streamOut.data.payload.game.id));
            store.dispatch(gameStarted());
            break;
        case 'like-succeeded':
            store.dispatch(pendingLikesSliceDecrement());
            store.dispatch(succeededLikesSliceIncrement());
            break;
        case 'game-updated':
            break;
        default:
            break;
    }
}
