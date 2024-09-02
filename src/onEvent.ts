import { db } from './db';
import {
    StreamEventIdDuplicateException,
    StreamEventOutOfSequenceException,
} from './exceptions';
import { FetchUpstream } from './fetchUpstream';
import { processStreamEvent } from './streamProcessor';
import { notifySubscribers } from './subscriptions';
import {
    getUpstreamControlForUpdate,
    insertIntoIgnoreUpstreamControl,
    updateUpstreamControl,
} from './upstreamControlStore';

export default async function onEvent(
    event: any,
    fetchUpstream: FetchUpstream
) {
    // Random delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
    console.log({ event });
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
                const upstreamControl = await getUpstreamControlForUpdate(
                    trx,
                    0
                );
                console.log({ event, upstreamControl });
                if (upstreamControl === undefined) {
                    throw new Error('Failed to get upstream control lock');
                }
                if (upstreamControl.streamOutId >= event.userEventId) {
                    throw new StreamEventIdDuplicateException();
                }
                if (upstreamControl.streamOutId + 1 === event.userEventId) {
                    console.log('we have a winner!');
                    const results = await processStreamEvent(trx, event);
                    await updateUpstreamControl(trx, 0, {
                        streamOutId: event.userEventId,
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
            console.log('Duplicate event ID', event);
            return;
        }
        if (e instanceof StreamEventOutOfSequenceException) {
            console.log('Out of sequence event ID', event);
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
                    const upstreamControl = await getUpstreamControlForUpdate(
                        trx,
                        0
                    );
                    return upstreamControl;
                }
            );
            if (upstreamControl === undefined) {
                throw new Error('Failed to get upstream control lock');
            }
            const streamOuts = await fetchUpstream(upstreamControl.streamOutId);
            console.log({ streamOuts });
            for (const streamOut of streamOuts) {
                console.log('...next interation!');
                try {
                    const results = await db.transaction(
                        'rw',
                        [db.upstreamControl, db.streamOut],
                        async (trx) => {
                            const upstreamForUpdateLock =
                                await getUpstreamControlForUpdate(trx, 0); // Prevents duplicate entry keys and insertions in other tables
                            const upstreamControlIgnore =
                                await insertIntoIgnoreUpstreamControl(trx, {
                                    id: 0,
                                    streamOutId: 0,
                                });
                            const upstreamControl =
                                await getUpstreamControlForUpdate(trx, 0);

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
                                console.log('we have a winner! on 2nd pass');
                                const results = await processStreamEvent(
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
                    if (e instanceof StreamEventOutOfSequenceException) {
                        console.log('Out of sequence event ID on 2nd pass', {
                            upstreamControl,
                            streamOut,
                        });
                        continue;
                    }
                    throw e;
                }
            }
        }
    }
}
