import { useSelector } from "react-redux";
import "./App.css";
import { Login } from "./Login";
import { RootState } from "./store";

function App() {
	const email = useSelector((state: RootState) => state.email.value);

	return (
		<>
			{email === "" ? (
				<Login />
			) : (
				<>
					<h1>Welcome, {email}!</h1>
				</>
			)}
		</>
	);
}

export default App;
