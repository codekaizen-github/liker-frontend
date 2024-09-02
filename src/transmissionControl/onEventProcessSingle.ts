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

export async function onEventProcessSingle(event: any) {
    const results = await db.transaction(
        'rw',
        [db.upstreamControl, db.streamOut],
        async (trx) => {
            const upstreamForUpdateLock = await getUpstreamControlForUpdate(
                trx,
                0
            ); // Prevents duplicate entry keys and insertions in other tables
            const upstreamControlIgnore = await insertIntoIgnoreUpstreamControl(
                trx,
                {
                    id: 0,
                    streamOutId: 0,
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
            if (upstreamControl.streamOutId >= event.userEventId) {
                throw new StreamEventIdDuplicateException();
            }
            if (upstreamControl.streamOutId + 1 === event.userEventId) {
                console.log('we have a winner! on 2nd pass');
                const results = await processStreamEvent(trx, event);
                await updateUpstreamControl(trx, 0, {
                    id: 0,
                    streamOutId: event.userEventId,
                });
                return results;
            }
            throw new StreamEventOutOfSequenceException();
        }
    );
    return results;
}
