import { db } from '../db';
import {
    StreamEventIdDuplicateException,
    StreamEventOutOfSequenceException,
} from './exceptions';
import { processStreamEvent } from './processStreamEvent';
import {
    getUpstreamControlForUpdate,
    insertIntoIgnoreUpstreamControl,
    updateUpstreamControl,
} from '../upstreamControlStore';
import { TotallyOrderedStreamEvent } from './types';

export async function onEventProcessSingle(event: TotallyOrderedStreamEvent) {
    const results = await db.transaction(
        'rw',
        [db.upstreamControl, db.streamIn],
        async (trx) => {
            const upstreamForUpdateLock = await getUpstreamControlForUpdate(
                trx,
                0
            ); // Prevents duplicate entry keys and insertions in other tables
            const upstreamControlIgnore = await insertIntoIgnoreUpstreamControl(
                trx,
                {
                    id: 0,
                    streamInId: 0,
                }
            );
            const upstreamControl = await getUpstreamControlForUpdate(trx, 0);
            console.log({
                event: event,
                upstreamControl,
            });
            if (upstreamControl === undefined) {
                throw new Error('Failed to get upstream control lock');
            }
            if (upstreamControl.streamInId >= event.id) {
                throw new StreamEventIdDuplicateException();
            }
            if (upstreamControl.streamInId + 1 === event.id) {
                console.log('we have a winner! on 2nd pass');
                const results = await processStreamEvent(trx, event);
                await updateUpstreamControl(trx, 0, {
                    id: 0,
                    streamInId: event.id,
                });
                return results;
            }
            throw new StreamEventOutOfSequenceException();
        }
    );
    return results;
}
