import './App.css';
import { LoggedIn } from './components/LoggedIn';

function App() {
    // const auth = useSelector((state: RootState) => state.auth.token);
    const auth = 'andrewjamesdawes@gmail.com';
    return <LoggedIn email={auth ?? 'testing'} />;
}

export default App;
