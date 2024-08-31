import { useSelector } from "react-redux";
import "./App.css";
import { Login } from "./components/Login";
import { RootState } from "./state/store";
import { LikeBtn } from "./components/LikeBtn";
import useWebSocket from "react-use-websocket";
function App() {
	const email = useSelector((state: RootState) => state.email.value);
	if (email) {
		const WS_URL = "ws://localhost:3030";
		const { lastJsonMessage } = useWebSocket(`${WS_URL}?email=${email}`, {
			onOpen: () => {
				console.log("WebSocket connection established.");
			},
		});
		console.log({ lastJsonMessage });
	}
	return <>{email === "" ? <Login /> : <LikeBtn />}</>;
}

export default App;
