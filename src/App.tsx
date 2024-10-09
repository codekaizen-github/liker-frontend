import './App.css';
import { LoggedIn } from './components/LoggedIn';

function App() {
    // const auth = useSelector((state: RootState) => state.auth.token);
    const auth = 'testing';
    return <LoggedIn email={auth ?? 'testing'} />;
}

export default App;
