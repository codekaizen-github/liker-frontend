import { LikeBtn } from './LikeBtn';
import '../App.css';
import useWebSocket from 'react-use-websocket';
interface LoggedInProps {
    email: string;
}
import { getFetchUpstream as buildFetchUpstreamFunction } from '../fetchUpstream';
import onEvent, { fetchMissing } from '../onEvent';
export function LoggedIn({ email }: LoggedInProps) {
    const WS_URL = 'ws://localhost:3030';
    const HTTP_URL_PARSED = new URL('http://localhost:3028/userEvent');
    HTTP_URL_PARSED.searchParams.append('email', email);
    const fetchUpstream = buildFetchUpstreamFunction(HTTP_URL_PARSED.toString());
    const { lastJsonMessage } = useWebSocket(`${WS_URL}?email=${email}`, {
        onOpen: async () => {
            console.log('WebSocket connection established.');
            await fetchMissing(fetchUpstream);
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
