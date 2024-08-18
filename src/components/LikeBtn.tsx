import { useSelector } from "react-redux";
import { RootState } from "../state/store";

export function LikeBtn() {
	const email = useSelector((state: RootState) => state.email.value);
	const likeEnabled = useSelector(
		(state: RootState) => state.likeEnabled.value
	);

	return (
		<>
			<h1>Welcome, {email}!</h1>
			<div>
				{likeEnabled ? "Likes are enabled!" : "Likes are disabled"}
				<button disabled={!likeEnabled}>Like</button>
			</div>
		</>
	);
}
