import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../state/store";
import { increment } from "../state/slices/pendingLikesSlice";

export function LikeBtn() {
	const dispatch = useDispatch();
	const email = useSelector((state: RootState) => state.email.value);
	const likeEnabled = useSelector(
		(state: RootState) => state.likeEnabled.value
	);
	const pendingLikes = useSelector(
		(state: RootState) => state.pendingLikes.value
	);
	const failedLikes = useSelector(
		(state: RootState) => state.failedLikes.value
	);
	const succeededLikes = useSelector(
		(state: RootState) => state.succeededLikes.value
	);
	const gameState = useSelector((state: RootState) => state.gameState.value);

	const handleLikeClick = () => {
		dispatch(increment());
	};

	return (
		<>
			<h1>Welcome, {email}!</h1>
			<div>
				{likeEnabled ? "Likes are enabled!" : "Likes are disabled"}
				<button disabled={!likeEnabled} onClick={handleLikeClick}>
					Like
				</button>
				<div>Pending Likes: {pendingLikes}</div>
				<div>Failed Likes: {failedLikes}</div>
				<div>Succeeded Likes: {succeededLikes}</div>
				<div>Game State: {gameState}</div>
			</div>
		</>
	);
}
