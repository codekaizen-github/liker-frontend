import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../state/store';
import { newLike } from '../state/slices/pendingLikesSlice';

export function LikeBtn() {
    const dispatch: AppDispatch = useDispatch();
    const pendingLikes = useSelector(
        (state: RootState) => state.pendingLikes.value.length
    );
    const user = useSelector((state: RootState) => state.user.value);
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

    if (!user.user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <h1>Welcome, {user.user?.email}!</h1>
            <div>Total Order ID: {totalOrderId}</div>
            <div>Game ID: {currentGame?.id}</div>
            <div>
                {likeEnabled ? 'Likes are enabled!' : 'Likes are disabled'}
                <button disabled={!likeEnabled} onClick={handleLikeClick}>
                    Like
                </button>
                <div>Total Likes: {currentGame?.likeCount ?? 0}</div>
                <div>Your Pending Likes: {pendingLikes}</div>
                <div>Your Failed Likes: {currentGame?.failedLikes ?? 0}</div>
                <div>Your Succeeded Likes: {currentGame?.successfulLikes ?? 0}</div>
                {/* <div>Game State: {games.}</div> */}
            </div>
        </>
    );
}
