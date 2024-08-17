import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store";
import { setEmail } from "./emailSlice";
import { useState } from "react";

export function Login() {
	const email = useSelector((state: RootState) => state.email.value);
	const dispatch = useDispatch();
	const [inputEmail, setInputEmail] = useState(email);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputEmail(event.target.value);
	};

	const handleButtonClick = () => {
		dispatch(setEmail(inputEmail));
	};

	return (
		<div>
			<h1>Login</h1>
			<div>
				<label>Email: </label>
				<input
					type="email"
					value={inputEmail}
					onChange={handleInputChange}
					placeholder="Enter your email"
				/>
			</div>
			<div>
				<button onClick={handleButtonClick}>Submit</button>
			</div>
		</div>
	);
}
