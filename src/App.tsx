import { useSelector } from 'react-redux';
import './App.css';
import { Login } from './components/Login';
import { RootState } from './state/store';
import { LoggedIn } from './components/LoggedIn';
function App() {
    const email = useSelector((state: RootState) => state.email.value);

    return <>{email === '' ? <Login /> : <LoggedIn email={email} />}</>;
}

export default App;
