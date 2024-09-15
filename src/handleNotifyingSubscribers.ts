import store from './state/store';
import { gameStarted } from './state/slices/gameStateSlice';
import {
    remove as pendingLikesSliceRemove,
    reset as pendingLikesSliceReset,
} from './state/slices/pendingLikesSlice';
import {
    increment as succeededLikesSliceIncrement,
    reset as succeededLikesSliceReset,
} from './state/slices/succeededLikesSlice';
import {
    increment as failedLikesSliceIncrement,
    reset as failedLikesSliceReset,
} from './state/slices/failedLikesSlice';
import { setId } from './state/slices/gameIdSlice';
import { TotallyOrderedStreamEvent } from './transmissionControl/types';
export async function handleNotifyingSubscribers(
    streamOut: TotallyOrderedStreamEvent
): Promise<void> {
    console.log({ streamOut });
    switch (streamOut.data.type) {
        case 'game-started-succeeded':
            store.dispatch(pendingLikesSliceReset());
            store.dispatch(succeededLikesSliceReset());
            store.dispatch(failedLikesSliceReset());
            store.dispatch(setId(streamOut.data.payload.game.id));
            store.dispatch(gameStarted());
            break;
        case 'like-succeeded':
            if (!streamOut.data.payload.fencingToken) {
                console.error('No fencing token in like-succeeded event');
                return;
            }
            store.dispatch(
                pendingLikesSliceRemove(streamOut.data.payload.fencingToken)
            );
            store.dispatch(succeededLikesSliceIncrement());
            break;
        case 'like-failed':
            if (!streamOut.data.payload.fencingToken) {
                console.error('No fencing token in like-failed event');
                return;
            }
            store.dispatch(
                pendingLikesSliceRemove(streamOut.data.payload.fencingToken)
            );
            store.dispatch(failedLikesSliceIncrement());
            break;
        case 'game-updated':
            break;
        default:
            break;
    }
}
