import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../state/store';
import { newLike } from '../state/slices/pendingLikesSlice';

export function LikeBtn() {
    const dispatch: AppDispatch = useDispatch();
    const pendingLikes = useSelector(
        (state: RootState) => state.pendingLikes.value.length
    );
    const games = useSelector((state: RootState) => state.games.value);
    const currentGame = games.currentGame;
    const likeEnabled = currentGame ? currentGame.status === 0 : false;

    const handleLikeClick = () => {
        if (currentGame) {
            dispatch(newLike(currentGame.id));
        }
    };

    const totalOrderId = useSelector(
        (state: RootState) => state.totalOrderId.value
    );

    return (
        <>
            {/* <h1>Welcome, {email}!</h1> */}
            <div>Total Order ID: {totalOrderId}</div>
            <div>Game ID: {currentGame?.id}</div>
            <div>
                {likeEnabled ? 'Likes are enabled!' : 'Likes are disabled'}
                <button disabled={!likeEnabled} onClick={handleLikeClick}>
                    Like
                </button>
                <div>Pending Likes: {pendingLikes}</div>
                <div>Failed Likes: {currentGame?.failedLikes ?? 0}</div>
                <div>Succeeded Likes: {currentGame?.successfulLikes ?? 0}</div>
                {/* <div>Game State: {games.}</div> */}
            </div>
        </>
    );
}
