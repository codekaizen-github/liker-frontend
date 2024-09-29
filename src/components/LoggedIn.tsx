import { LikeBtn } from './LikeBtn';
import '../App.css';
import useWebSocket from 'react-use-websocket';
interface LoggedInProps {
    email: string;
}
import { buildFetchUpstream } from '../transmissionControl/buildFetchUpstream';
import onEvent from '../transmissionControl/onEvent';
import { syncUpstreamFromUpstreamControl } from '../transmissionControl/syncUpstream';
export function LoggedIn({ email }: LoggedInProps) {
    const WS_URL = 'ws://localhost:3030';
    const HTTP_URL_PARSED = new URL('http://localhost:3028/userView');
    HTTP_URL_PARSED.searchParams.append('email', email);
    // const fetchUpstream = buildFetchUpstream(HTTP_URL_PARSED.toString());
    // // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const { lastJsonMessage } = useWebSocket(`${WS_URL}?email=${email}`, {
    //     onOpen: async () => {
    //         console.log('WebSocket connection established.');
    //         await syncUpstreamFromUpstreamControl(fetchUpstream);
    //     },
    //     onMessage: async (message) => {
    //         await onEvent(JSON.parse(message.data), fetchUpstream);
    //     },
    //     shouldReconnect: (closeEvent) => true,
    // });
    async function processNewMaterializedView(view: {
        totalOrderId: number;
        userId: number;
        games: {
            likeCount: number;
            status: number;
            successfulLikes: number | null;
            failedLikes: number | null;
            id: number;
        }[];
    }) {
        console.log({view})
    //     On receiving a pushed update
    //     - [ ] IF new totalOrderId > current totalOrderID
    //         - [ ] If any pending events, create a list of these and send to server along with the new totalOrderID
    //             - [ ] Server should return which of these were resolved at or before that totalOrderId
    //         - [ ] Update all slices with state from the pushed materialized view
    //         - [ ] Update the total order
    //     - [ ] ELSE
    //         - [ ] Disregard ( do nothing )
    // - [ ] For any slices that should have "pending" actions (client side pending)
    //     - [ ] Make sure the list of pending fencingTokens is accessible as state on the slice
    //     - [ ] Add a method that accepts a list of "processed" fencing tokens and removes those from the "pending" actions
    }
    const { lastJsonMessage } = useWebSocket(`${WS_URL}?email=${email}`, {
        onOpen: async () => {
            console.log('WebSocket connection established.');
            const messageRaw = await fetch(HTTP_URL_PARSED.toString());
            const message = await messageRaw.json();
            await processNewMaterializedView(message);
        },
        onMessage: async (message) => {
            await processNewMaterializedView(JSON.parse(message));
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
