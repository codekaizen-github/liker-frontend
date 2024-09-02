import { LikeBtn } from './LikeBtn';
import '../App.css';
import useWebSocket from 'react-use-websocket';
interface LoggedInProps {
    email: string;
}
import { getFetchUpstream } from '../fetchUpstream';
import onEvent from '../onEvent';
export function LoggedIn({ email }: LoggedInProps) {
    const WS_URL = 'ws://localhost:3030';
    const HTTP_URL_PARSED = new URL('http://localhost:3028/userEvent');
    HTTP_URL_PARSED.searchParams.append('email', email);
    const fetchUpstream = getFetchUpstream(HTTP_URL_PARSED.toString());
    const { lastJsonMessage } = useWebSocket(`${WS_URL}?email=${email}`, {
        onOpen: () => {
            console.log('WebSocket connection established.');
        },
        onMessage: async (message) => {
            await onEvent(JSON.parse(message.data), fetchUpstream);
        },
    });
    // TODO: Process in total order
    return (
        <>
            <LikeBtn />
        </>
    );
}
