import { LikeBtn } from './LikeBtn';
import '../App.css';
import useWebSocket from 'react-use-websocket';
import { processNewMaterializedView } from '../processNewMaterializedView';
interface LoggedInProps {
    email: string;
}
export function LoggedIn({ email }: LoggedInProps) {
    const WS_URL = 'ws://localhost:3030';
    const HTTP_URL_PARSED = new URL('http://localhost:3028/userView');
    HTTP_URL_PARSED.searchParams.append('email', email);
    const { lastJsonMessage } = useWebSocket(`${WS_URL}?email=${email}`, {
        onOpen: async () => {
            console.log('WebSocket connection established.');
            const viewRaw = await fetch(HTTP_URL_PARSED.toString());
            const view = await viewRaw.json();
            await processNewMaterializedView(view);
        },
        onMessage: async (message) => {
            await processNewMaterializedView(JSON.parse(message.data));
        },
        shouldReconnect: (closeEvent) => true,
    });
    // TODO: Process in total order
    return (
        <>
            <LikeBtn />
        </>
    );
}
