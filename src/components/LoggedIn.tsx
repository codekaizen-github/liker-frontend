import { LikeBtn } from './LikeBtn';
import '../App.css';
import useWebSocket from 'react-use-websocket';
import { db } from '../db';
import {
    StreamEventIdDuplicateException,
    StreamEventOutOfSequenceException,
} from '../exceptions';
import {
    getUpstreamControlForUpdate,
    insertIntoIgnoreUpstreamControl,
    updateUpstreamControl,
} from '../upstreamControlStore';
import { processStreamEvent } from '../streamProcessor';
import { notifySubscribers } from '../subscriptions';
interface LoggedInProps {
    email: string;
}
import { AppDispatch } from '../store';
export function LoggedIn({ email }: LoggedInProps) {
    const WS_URL = 'ws://localhost:3030';
    const { lastJsonMessage } = useWebSocket(`${WS_URL}?email=${email}`, {
        onOpen: () => {
            console.log('WebSocket connection established.');
        },
        onMessage: async (message) => {
            // Random delay
            await new Promise((resolve) =>
                setTimeout(resolve, Math.random() * 1000)
            );
            const messageData = JSON.parse(message.data);
            console.log({ messageData });
            // Get the upstream control lock
            try {
                const results = await db.transaction(
                    'rw',
                    [db.upstreamControl, db.streamOut],
                    async (trx) => {
                        console.log('inside transaction');
                        // const upstreamForUpdateLock =
                        //     await getUpstreamControlForUpdate(trx, 0); // Prevents duplicate entry keys and insertions in other tables
                        const upstreamControlIgnore =
                            await insertIntoIgnoreUpstreamControl(trx, {
                                id: 0,
                                streamOutId: 0,
                            });
                        console.log({ upstreamControlIgnore });
                        const upstreamControl =
                            await getUpstreamControlForUpdate(trx, 0);
                        console.log({ messageData, upstreamControl });
                        if (upstreamControl === undefined) {
                            throw new Error(
                                'Failed to get upstream control lock'
                            );
                        }
                        if (
                            upstreamControl.streamOutId >=
                            messageData.userEventId
                        ) {
                            throw new StreamEventIdDuplicateException();
                        }
                        if (
                            upstreamControl.streamOutId + 1 ===
                            messageData.userEventId
                        ) {
                            console.log('we have a winner!');
                            const results = await processStreamEvent(
                                trx,
                                messageData
                            );
                            await updateUpstreamControl(trx, 0, {
                                streamOutId: messageData.userEventId,
                            });
                            return results;
                        }
                        throw new StreamEventOutOfSequenceException();
                    }
                );
                if (results.length) {
                    for (const result of results) {
                        notifySubscribers(result);
                    }
                }
            } catch (e) {
                if (e instanceof StreamEventIdDuplicateException) {
                    console.log('Duplicate event ID', message);
                    return;
                }
                if (e instanceof StreamEventOutOfSequenceException) {
                    console.log('Out of sequence event ID', message);
                    const urlParsed = new URL(
                        'http://localhost:3028/userEvent'
                    );
                    urlParsed.searchParams.append('email', email);
                    const upstreamControl = await db.transaction(
                        'rw',
                        [db.upstreamControl],
                        async (trx) => {
                            // const upstreamForUpdateLock =
                            //     await getUpstreamControlForUpdate(trx, 0); // Prevents duplicate entry keys and insertions in other tables
                            const upstreamControlIgnore =
                                await insertIntoIgnoreUpstreamControl(trx, {
                                    id: 0,
                                    streamOutId: 0,
                                });
                            const upstreamControl =
                                await getUpstreamControlForUpdate(trx, 0);
                            return upstreamControl;
                        }
                    );
                    if (upstreamControl === undefined) {
                        throw new Error('Failed to get upstream control lock');
                    }
                    urlParsed.searchParams.append(
                        'afterId',
                        upstreamControl.streamOutId.toString()
                    );
                    const response = await fetch(urlParsed.toString());
                    const streamOuts = await response.json();
                    console.log({ streamOuts });
                    for (const streamOut of streamOuts) {
                        console.log('...next interation!');
                        try {
                            const results = await db.transaction(
                                'rw',
                                [db.upstreamControl, db.streamOut],
                                async (trx) => {
                                    const upstreamForUpdateLock =
                                        await getUpstreamControlForUpdate(
                                            trx,
                                            0
                                        ); // Prevents duplicate entry keys and insertions in other tables
                                    const upstreamControlIgnore =
                                        await insertIntoIgnoreUpstreamControl(
                                            trx,
                                            {
                                                id: 0,
                                                streamOutId: 0,
                                            }
                                        );
                                    const upstreamControl =
                                        await getUpstreamControlForUpdate(
                                            trx,
                                            0
                                        );

                                    console.log({
                                        streamOut,
                                        upstreamControl,
                                    });
                                    if (upstreamControl === undefined) {
                                        throw new Error(
                                            'Failed to get upstream control lock'
                                        );
                                    }
                                    if (
                                        upstreamControl.streamOutId >=
                                        streamOut.userEventId
                                    ) {
                                        throw new StreamEventIdDuplicateException();
                                    }
                                    if (
                                        upstreamControl.streamOutId + 1 ===
                                        streamOut.userEventId
                                    ) {
                                        console.log(
                                            'we have a winner! on 2nd pass'
                                        );
                                        const results =
                                            await processStreamEvent(
                                                trx,
                                                streamOut
                                            );
                                        await updateUpstreamControl(trx, 0, {
                                            id: 0,
                                            streamOutId: streamOut.userEventId,
                                        });
                                        return results;
                                    }
                                    throw new StreamEventOutOfSequenceException();
                                }
                            );
                            if (results.length) {
                                for (const result of results) {
                                    notifySubscribers(result);
                                }
                            }
                        } catch (e) {
                            if (e instanceof StreamEventIdDuplicateException) {
                                console.log(
                                    'Duplicate event ID on 2nd pass',
                                    streamOut
                                );
                                continue;
                            }
                            if (
                                e instanceof StreamEventOutOfSequenceException
                            ) {
                                console.log(
                                    'Out of sequence event ID on 2nd pass',
                                    {
                                        upstreamControl,
                                        streamOut,
                                    }
                                );
                                continue;
                            }
                            throw e;
                        }
                    }
                }
            }
        },
    });
    // TODO: Process in total order
    return (
        <>
            <LikeBtn />
        </>
    );
}
