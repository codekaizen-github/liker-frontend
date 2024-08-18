import { useSelector } from "react-redux";
import "./App.css";
import { Login } from "./components/Login";
import { RootState } from "./state/store";
import { LikeBtn } from "./components/LikeBtn";

function App() {
	const email = useSelector((state: RootState) => state.email.value);

	return <>{email === "" ? <Login /> : <LikeBtn />}</>;
}

export default App;
