import { RootState } from "../state/store";
import { requestAuthorization } from "../state/slices/emailSlice";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../state/hooks";

export function Login() {
	const email = useAppSelector((state: RootState) => state.email.value);
	const dispatch = useAppDispatch();
	const [inputEmail, setInputEmail] = useState(email);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputEmail(event.target.value);
	};

	const handleButtonClick = () => {
		dispatch(requestAuthorization(inputEmail));
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
