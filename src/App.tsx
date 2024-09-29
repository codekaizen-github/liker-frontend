import { useSelector } from 'react-redux';
import './App.css';
import Login from './components/Login';
import { RootState } from './state/store';
import { LoggedIn } from './components/LoggedIn';

function App() {
    const auth = useSelector((state: RootState) => state.auth.token);

    return (
        <>
            {auth === null ? <Login /> : <LoggedIn email={auth ?? 'testing'} />}
        </>
    );
}

export default App;
