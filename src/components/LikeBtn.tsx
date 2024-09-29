import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../state/store';
import { newLike } from '../state/slices/pendingLikesSlice';
import { newGame } from '../state/slices/pendingGameStartedIntendedSlice';

export function LikeBtn() {
    const dispatch: AppDispatch = useDispatch();
    const email = useSelector((state: RootState) => state.email.value);
    // const likeEnabled = useSelector(
    //     (state: RootState) => state.likeEnabled.value
    // );
    const pendingLikes = useSelector(
        (state: RootState) => state.pendingLikes.value.length
    );

    const pendingGameStartedIndendeds = useSelector(
        (state: RootState) => state.pendingGameStartedIntendeds.value
    );
    const pendingNewGameRequests = pendingGameStartedIndendeds.length > 0;
    // const failedLikes = useSelector(
    //     (state: RootState) => state.failedLikes.value
    // );
    // const succeededLikes = useSelector(
    //     (state: RootState) => state.succeededLikes.value
    // );
    // const gameState = useSelector((state: RootState) => state.gameState.value);
    const games = useSelector((state: RootState) => state.games.value);
    const currentGame = games.currentGame;
    const gameStatus = currentGame?.status;
    let gameStatusText = 'Not started';
    switch (gameStatus) {
        case 0:
            gameStatusText = 'In Progress';
            break;
        case 1:
            gameStatusText = 'Over';
            break;
    }
    const likeEnabled = currentGame ? currentGame.status === 0 : false;

    const handleLikeClick = () => {
        if (currentGame) {
            dispatch(newLike(currentGame.id));
        }
    };

    const handleNewGameClick = () => {
        dispatch(newGame());
    };

    const totalOrderId = useSelector(
        (state: RootState) => state.totalOrderId.value
    );

    return (
        <>
            <h1>Welcome, {email}!</h1>
            <div>Total Order ID: {totalOrderId}</div>
            <div>Game ID: {currentGame?.id ?? ''}</div>
            <div>
                {likeEnabled ? 'Likes are enabled!' : 'Likes are disabled'}
                <button disabled={!likeEnabled} onClick={handleLikeClick}>
                    Like
                </button>
                <button
                    disabled={pendingNewGameRequests}
                    onClick={handleNewGameClick}
                >
                    New Game
                </button>
                <div>Total Likes: {games.currentGame?.likeCount ?? 0}</div>
                <div>Game Status: {gameStatusText}</div>
                <div>My Pending Likes: {pendingLikes}</div>
                <div>
                    My Failed Likes: {games.currentGame?.failedLikes ?? 0}
                </div>
                <div>
                    My Succeeded Likes:{' '}
                    {games.currentGame?.successfulLikes ?? 0}
                </div>
                {/* <div>Game State: {games.}</div> */}
            </div>
        </>
    );
}
