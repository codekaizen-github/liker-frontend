import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../state/store';
import { newLike } from '../state/slices/pendingLikesSlice';

export function LikeBtn() {
    // const dispatch: AppDispatch = useDispatch();
    const email = useSelector((state: RootState) => state.email.value);
    // const likeEnabled = useSelector(
    //     (state: RootState) => state.likeEnabled.value
    // );
    const pendingLikes = useSelector(
        (state: RootState) => state.pendingLikes.value.length
    );
    const failedLikes = useSelector(
        (state: RootState) => state.failedLikes.value
    );
    const succeededLikes = useSelector(
        (state: RootState) => state.succeededLikes.value
    );
    const gameState = useSelector((state: RootState) => state.gameState.value);
    const games = useSelector((state: RootState) => state.games.value);
    // const handleLikeClick = () => {
    //     dispatch(newLike());
    // };

    const totalOrderId = useSelector(
        (state: RootState) => state.totalOrderId.value
    );

    return (
        <>
            <h1>Welcome, {email}!</h1>
            <div>Total Order ID: {totalOrderId}</div>
            <div>
                {/* {likeEnabled ? 'Likes are enabled!' : 'Likes are disabled'}
                <button disabled={!likeEnabled} onClick={handleLikeClick}>
                    Like
                </button> */}
                <div>Pending Likes: {pendingLikes}</div>
                <div>Failed Likes: {games.activeGame?.failedLikes ?? 0}</div>
                <div>
                    Succeeded Likes: {games.activeGame?.successfulLikes ?? 0}
                </div>
                {/* <div>Game State: {games.}</div> */}
            </div>
        </>
    );
}
