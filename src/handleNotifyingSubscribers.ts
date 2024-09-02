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
import { TotallyOrderedStreamEvent } from './transmissionControl/types';
export async function handleNotifyingSubscribers(
    streamIn: TotallyOrderedStreamEvent
): Promise<void> {
    console.log({ streamIn });
    switch (streamIn.data.type) {
        case 'game-started-succeeded':
            store.dispatch(pendingLikesSliceReset());
            store.dispatch(succeededLikesSliceReset());
            store.dispatch(setId(streamIn.data.payload.game.id));
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
