import { LikeBtn } from './LikeBtn';
import '../App.css';
import useWebSocket from 'react-use-websocket';
import { processNewMaterializedView } from '../processNewMaterializedView';
import writeEvent from '../writeEvent';
import { useEffect } from 'react';
export function LoggedIn() {
    useEffect(() => {
        writeEvent('user-login-intended', {
            timestamp: new Date().toISOString(),
        });
    }, []);
    // const WS_URL = 'ws://localhost:3030';
    const HTTP_URL_USER_VIEW = new URL(
        import.meta.env.VITE_LIKER_READ_PATH_USER_VIEW_URL ?? ''
    );
    // HTTP_URL_USER_VIEW.searchParams.append('email', email);
    const HTTP_URL_FENCING_TOKENS = new URL(
        import.meta.env.VITE_LIKER_USER_FENCING_TOKEN_URL ?? ''
    );
    // HTTP_URL_FENCING_TOKENS.searchParams.append('email', email);
    async function fetchUserFencingTokens(
        fencingTokens: string[],
        totalOrderId?: number
    ): Promise<string[]> {
        const url = new URL(HTTP_URL_FENCING_TOKENS.toString());
        url.searchParams.append('fencingTokens', fencingTokens.join(','));
        if (totalOrderId !== undefined) {
            url.searchParams.append('totalOrderId', totalOrderId.toString());
        }
        const fencingTokensRaw = await fetch(
            HTTP_URL_FENCING_TOKENS.toString(),
            {
                credentials: 'include',
            }
        );
        const response: {
            id: number;
            totalOrderId: number;
            userId: number;
            fencingToken: number;
        }[] = await fencingTokensRaw.json();
        console.log({ response });
        return response.map((r) => r.fencingToken.toString());
    }
    console.log(
        'VITE_LIKER_READ_PATH_WS_URL',
        `${import.meta.env.VITE_LIKER_READ_PATH_WS_URL ?? ''}`
    );
    const { lastJsonMessage } = useWebSocket(
        // `${import.meta.env.VITE_LIKER_READ_PATH_WS_URL ?? ''}?email=${email}`,
        `${import.meta.env.VITE_LIKER_READ_PATH_WS_URL ?? ''}`,
        {
            onOpen: async () => {
                console.log('WebSocket connection established.');
                const viewRaw = await fetch(HTTP_URL_USER_VIEW.toString(), {
                    credentials: 'include',
                });
                const view = await viewRaw.json();
                await processNewMaterializedView(view, fetchUserFencingTokens);
            },
            onMessage: async (message) => {
                await processNewMaterializedView(
                    JSON.parse(message.data),
                    fetchUserFencingTokens
                );
            },
            onError: (event) => {
                console.log('WebSocket error:', event);
            },
            shouldReconnect: (closeEvent) => true,
            retryOnError: true,
            reconnectAttempts: Number.MAX_SAFE_INTEGER,
        }
    );
    // TODO: Process in total order
    return (
        <>
            <LikeBtn />
        </>
    );
}
