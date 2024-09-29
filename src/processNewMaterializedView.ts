import store from './state/store';
import { setId as totalOrderIdSliceSetId } from './state/slices/totalOrderIdSlice';
import {
    setGames as gamesSliceSet,
    setActiveGame as gamesSliceSetActiveGame,
} from './state/slices/gamesSlice';

import { removeBulk as pendingLikesSliceRemoveBulk } from './state/slices/pendingLikesSlice';

export async function processNewMaterializedView(
    view: {
        totalOrderId: number;
        userId: number;
        games: {
            likeCount: number;
            status: number;
            successfulLikes: number;
            failedLikes: number;
            id: number;
        }[];
    },
    fetchUserFencingTokens: (
        fencingTokens: string[],
        totalOrderId?: number
    ) => Promise<string[]>
) {
    console.log({ view });
    if ((store.getState().totalOrderId.value ?? 0) >= view.totalOrderId) {
        return;
    }
    const pendingLikes = store.getState().pendingLikes.value;
    const fencingTokensResponse = await fetchUserFencingTokens(
        pendingLikes,
        view.totalOrderId
    );
    store.dispatch(pendingLikesSliceRemoveBulk(fencingTokensResponse));
    store.dispatch(totalOrderIdSliceSetId(view.totalOrderId));
    store.dispatch(gamesSliceSet(view.games));
    const currentGames = view.games.filter((game) => game.status === 0);
    const currentGame =
        currentGames.length > 0 ? currentGames[currentGames.length - 1] : null;
    store.dispatch(gamesSliceSetActiveGame(currentGame));

    //     On receiving a pushed update
    //     - [ ] IF new totalOrderId > current totalOrderId
    //         - [ ] If any pending events, create a list of these and send to server along with the new totalOrderId
    //             - [ ] Server should return which of these were resolved at or before that totalOrderId
    //         - [ ] Update all slices with state from the pushed materialized view
    //         - [ ] Update the total order
    //     - [ ] ELSE
    //         - [ ] Disregard ( do nothing )
    // - [ ] For any slices that should have "pending" actions (client side pending)
    //     - [ ] Make sure the list of pending fencingTokens is accessible as state on the slice
    //     - [ ] Add a method that accepts a list of "processed" fencing tokens and removes those from the "pending" actions

    // switch (streamOut.data.type) {
    //     case 'game-started-succeeded':
    //         store.dispatch(pendingLikesSliceReset());
    //         store.dispatch(succeededLikesSliceReset());
    //         store.dispatch(failedLikesSliceReset());
    //         store.dispatch(setId(streamOut.data.payload.game.id));
    //         store.dispatch(gameStarted());
    //         break;
    //     case 'like-succeeded':
    //         if (!streamOut.data.payload.fencingToken) {
    //             console.error('No fencing token in like-succeeded event');
    //             return;
    //         }
    //         store.dispatch(
    //             pendingLikesSliceRemove(streamOut.data.payload.fencingToken)
    //         );
    //         store.dispatch(succeededLikesSliceIncrement());
    //         break;
    //     case 'like-failed':
    //         if (!streamOut.data.payload.fencingToken) {
    //             console.error('No fencing token in like-failed event');
    //             return;
    //         }
    //         store.dispatch(
    //             pendingLikesSliceRemove(streamOut.data.payload.fencingToken)
    //         );
    //         store.dispatch(failedLikesSliceIncrement());
    //         break;
    //     case 'game-updated':
    //         break;
    //     default:
    //         break;
    // }
}
